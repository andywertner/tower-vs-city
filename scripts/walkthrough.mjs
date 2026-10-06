import fs from "node:fs";
import puppeteer from "puppeteer-core";
import { levels } from "../src/challenges.ts";

const out = "/tmp/tvc-shots";
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const URL = "http://127.0.0.1:5173/#preview";
const shots = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  const path = `${out}/${name}.png`;
  await page.screenshot({ path });
  shots.push(path);
}

async function saved(page) {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem("tvc-v2") || "{}"));
}

async function waitStep(page, level, beat) {
  await page.waitForFunction(
    (level, beat) => {
      const s = JSON.parse(sessionStorage.getItem("tvc-v2") || "{}");
      return s.phase === "challenge" && s.level === level && s.beat === beat && !document.querySelector(".stamp") && !document.querySelector(".veil");
    },
    { timeout: 8000 },
    level,
    beat,
  ).catch(async (err) => {
    await shot(page, `fail-L${level}-b${beat}`);
    console.log(JSON.stringify(await saved(page)), await page.evaluate(() => document.body.innerText.slice(0, 600)));
    throw err;
  });
}

const RING_MID = [0, 0.275, 0.425];

async function zonePoint(page, sel) {
  const ring = /data-zone="r(\d)"/.exec(sel);
  if (ring) {
    const box = await (await page.$(".rings")).boundingBox();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 - RING_MID[Number(ring[1])] * box.width };
  }
  const box = await (await page.$(sel)).boundingBox();
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

async function place(page, item, zone) {
  const selected = await page.$eval(`[data-item="${item}"]`, (el) => el.classList.contains("sel")).catch(() => false);
  if (!selected) await page.click(`[data-item="${item}"]`);
  const at = await zonePoint(page, `[data-zone="${zone}"]`);
  await page.mouse.click(at.x, at.y);
}

async function dragTo(page, fromSel, toSel) {
  const from = await zonePoint(page, fromSel);
  const to = await zonePoint(page, toSel);
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 10 });
  await page.mouse.up();
}

async function checkWrong(page, sel) {
  await page.waitForSelector(`${sel}.bad`, { timeout: 2000 });
}

async function solve(page, step, tag, opts) {
  if (step.kind === "card") {
    await page.click('[data-act="next"]');
    return;
  }
  if (step.kind === "choose") {
    const wrong = step.options.find((o) => !o.ok);
    if (wrong) {
      await page.click(`[data-act="choose"][data-id="${wrong.id}"]`);
      await checkWrong(page, `[data-id="${wrong.id}"]`);
      if (wrong.wrong) {
        const text = await page.$eval(".ask .prompt", (el) => el.textContent);
        if (!text.includes(wrong.wrong.slice(0, 20))) throw new Error(`${tag}: no wrong feedback, saw "${text}"`);
      }
      await shot(page, `${tag}-wrong`);
    }
    await page.click(`[data-act="choose"][data-id="${step.options.find((o) => o.ok).id}"]`);
    return;
  }
  if (step.kind === "place") {
    const odd = step.items.find((i) => i.unsuitable);
    if (odd) {
      await place(page, odd.id, step.zones[0].id);
      if (!(await page.$(`[data-item="${odd.id}"]`))) throw new Error(`${tag}: decoy accepted`);
    }
    const needed = step.items.filter((i) => !i.unsuitable);
    for (const [i, item] of needed.entries()) {
      const zone = step.zones.find((z) => z.bin === item.bin);
      if (i === 0) {
        const other = step.zones.find((z) => z.bin !== item.bin);
        if (other) {
          await place(page, item.id, other.id);
          if (!(await page.$(`[data-item="${item.id}"]`))) throw new Error(`${tag}: wrong zone accepted`);
          if (step.board === "rings") {
            const hint = await page.$eval(".ask .prompt", (el) => el.textContent);
            if (!hint.includes("Try a ring")) throw new Error(`${tag}: ring hint missing: ${hint}`);
            await shot(page, `${tag}-ring-hint`);
          }
        }
      }
      if (i === 0 && opts.drag) await dragTo(page, `[data-item="${item.id}"]`, `[data-zone="${zone.id}"]`);
      else await place(page, item.id, zone.id);
      if (i === 1) {
        if (step.board === "bins") {
          const kept = await page.$eval(`[data-zone="${zone.id}"]`, (el, label) => el.textContent.includes(label), zone.label);
          if (!kept) throw new Error(`${tag}: bin lost its label`);
        }
        await shot(page, `${tag}-part`);
      }
    }
    return;
  }
  if (step.kind === "deliver") {
    const wrong = step.people.find((p) => p.id !== step.order[0]);
    await place(page, "letter", wrong.id);
    await checkWrong(page, `[data-zone="${wrong.id}"]`);
    for (const [i, id] of step.order.entries()) {
      if (i === 0 && opts.drag) await dragTo(page, '[data-item="letter"]', `[data-zone="${id}"]`);
      else await place(page, "letter", id);
      if (i === 4) await shot(page, `${tag}-part`);
    }
    return;
  }
  if (step.kind === "scenes") {
    for (const [i, scene] of step.scenes.entries()) {
      await page.waitForFunction((cap) => document.querySelector(".caption")?.textContent === cap, {}, scene.caption);
      if (i === 2) await shot(page, `${tag}-scene`);
      await page.click(`[data-side="${scene.answer}"]`);
    }
    return;
  }
  if (step.kind === "king") {
    for (let i = 0; i < step.bricks.length; i++) {
      await page.click(`[data-act="king"][data-id="k${i}"]`);
      if (i === 2) {
        const knocked = await page.$$eval(".fell .me", (els) => els.length);
        if (knocked !== 2) throw new Error(`${tag}: expected 2 knocked off, saw ${knocked}`);
        await shot(page, `${tag}-part`);
      }
    }
    return;
  }
  if (step.kind === "hold") {
    const box = await (await page.$(".pray-btn")).boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await sleep(120);
    await page.mouse.up();
    await sleep(500);
    if (!(await page.$(".pray-btn"))) throw new Error(`${tag}: a short press should not finish prayer`);
    await page.mouse.down();
    await sleep(200);
    await shot(page, `${tag}-holding`);
    await sleep(400);
    await page.mouse.up();
    return;
  }
  if (step.kind === "inspect") {
    for (const [i, fam] of step.families.entries()) {
      await page.click(`[data-act="inspect"][data-id="${fam.id}"]`);
      if (i === 1) await shot(page, `${tag}-part`);
    }
    return;
  }
  throw new Error(`unknown step ${step.kind}`);
}

async function playBand(page, band, plan, opts = {}) {
  const lessons = levels(band, "baby");
  const quotes = [];
  for (const [li, level] of lessons.entries()) {
    const n = li + 1;
    for (const [beat, step] of level.steps.entries()) {
      await waitStep(page, n, beat);
      const tag = `${band}-L${String(n).padStart(2, "0")}-${beat}-${step.kind}`;
      await shot(page, tag);
      await solve(page, step, tag, { drag: opts.drag && n === 2 });
    }
    if (!level.reward) continue;
    await page.waitForSelector('[data-choice="city"]');
    const last = level.steps[level.steps.length - 1];
    if (last.success) {
      const lesson = await page.$eval(".lesson p", (el) => el.textContent).catch(() => "");
      if (!lesson.includes(last.success.slice(0, 15))) throw new Error(`L${n}: lesson banner missing on choice screen`);
    }
    if (last.kind === "deliver") {
      const word = await page.$eval(".lesson .word-bar.done", (el) => el.textContent);
      if (word !== last.word) throw new Error(`L${n}: finished word not shown, saw ${word}`);
    }
    await shot(page, `${band}-L${String(n).padStart(2, "0")}-choice`);
    const kind = plan[n] ?? "city";
    await opts.beforeChoice?.(page, n, kind);
    if (kind === "tower" && !(await page.$('[data-choice="tower"]'))) throw new Error(`L${n}: no tower button`);
    await page.click(`[data-choice="${kind}"]`);
    if (kind === "city") {
      await page.waitForSelector(".veil .mh-quote cite");
      const q = await page.$eval(".veil .mh-quote", (el) => el.textContent.trim());
      if (!q.includes("Magnifica Humanitas, paragraph")) throw new Error(`quote without citation: ${q}`);
      quotes.push(q);
      if (quotes.length === 1) await shot(page, `${band}-city-quote`);
    }
    await opts.afterChoice?.(page, n, kind);
  }
  await page.waitForSelector(".sandbox");
  return quotes;
}

// 3-4: all city.
const p34 = await browser.newPage();
await p34.setViewport({ width: 1280, height: 720 });
await p34.goto(URL, { waitUntil: "networkidle0" });
await shot(p34, "00-grades");
await p34.click('[data-band="34"]');
await p34.waitForSelector(".hero strong");
if ((await p34.$eval(".hero strong", (el) => el.textContent.trim())) !== "Baby Shark") throw new Error("default creature");
await shot(p34, "00-creature");
await p34.click('[data-act="go"]');
const q34 = await playBand(p34, "34", {});
if (new Set(q34).size < 5) throw new Error("quotes did not rotate");
await shot(p34, "34-sandbox");
await p34.click("#start-over");
await p34.waitForSelector("#confirm");
await shot(p34, "34-start-over-confirm");
await p34.click('[data-act="new-no"]');
if (await p34.$("#confirm")) throw new Error("Keep going did not close the confirm box");
if (!(await p34.$(".sandbox"))) throw new Error("Keep going lost the sandbox");
await p34.click("#start-over");
await p34.waitForSelector('[data-act="new-yes"]');
await p34.click('[data-act="new-yes"]');
await p34.waitForSelector('[data-band="34"]');
const gateText = await p34.$eval(".gate", (el) => el.textContent);
if (!gateText.includes("Pick your grade.") || !gateText.includes("Notre Dame de Lourdes School")) throw new Error(gateText);

// 5-6: four towers in a row on levels 2-5, the fall, then only the city.
const p56 = await browser.newPage();
await p56.setViewport({ width: 1280, height: 720 });
await p56.goto(URL, { waitUntil: "networkidle0" });
await p56.click('[data-band="56"]');
await p56.click('[data-act="go"]');
await playBand(p56, "56", { 2: "tower", 3: "tower", 4: "tower", 5: "tower" }, {
  beforeChoice: async (page, n) => {
    if (n === 6) {
      if (await page.$('[data-choice="tower"]')) throw new Error("tower option should be gone after a fall");
      const label = await page.$eval('[data-choice="city"]', (el) => el.textContent);
      if (!label.includes("ruins")) throw new Error(label);
      const line = await page.$eval(".ask .prompt", (el) => el.textContent);
      if (!line.startsWith("Your tower fell.")) throw new Error(line);
      const rub = await page.$$eval(".sky rect.rub", (els) => els.length);
      if (rub !== 4) throw new Error(`expected 4 rubble, saw ${rub}`);
      await shot(page, "56-ruins-choice");
    }
    if (n === 7) {
      const line = await page.$eval(".ask .prompt", (el) => el.textContent);
      if (!line.startsWith("Your tower already fell.")) throw new Error(line);
      await shot(page, "56-already-fell");
    }
  },
  afterChoice: async (page, n) => {
    if (n === 4) {
      await page.waitForFunction(() => document.body.textContent.includes("leaning"));
      const bricks = await page.$$eval(".sky rect.brick", (els) => els.length);
      if (bricks !== 3) throw new Error(`leaning with ${bricks} bricks`);
      await shot(page, "56-leaning");
    }
    if (n === 5) {
      await page.waitForSelector(".tower.fall");
      await sleep(150);
      await shot(page, "56-fall");
    }
    if (n === 6) {
      await page.waitForSelector("#countdown");
      await shot(page, "56-countdown");
      await page.waitForFunction(() => !document.querySelector(".veil"));
      const cottages = await page.$$eval(".sky .cottage", (els) => els.length);
      if (cottages !== 4) throw new Error(`cottages ${cottages}`);
    }
  },
});

// 7-8: drag on level 2, towers at the end so the sandbox starts with rubble.
const p78 = await browser.newPage();
await p78.setViewport({ width: 1440, height: 900 });
await p78.goto(URL, { waitUntil: "networkidle0" });
await p78.click('[data-band="78"]');
await p78.click('[data-act="go"]');
await playBand(p78, "78", { 8: "tower", 9: "tower", 10: "tower", 11: "tower" }, { drag: true });
const startBricks = await p78.$$eval('.piece.brickish', (els) => els.length);
if (startBricks !== 4) throw new Error(`sandbox should start with 4 fallen bricks, saw ${startBricks}`);
await shot(p78, "78-sandbox-start");

let fell = false;
for (let i = 0; i < 20 && !fell; i++) {
  await p78.click('[data-act="sand-brick"]');
  if (i === 7) await shot(p78, "78-sandbox-tall");
  await sleep(40);
  if (await p78.$(".sand-tower.crash")) {
    fell = true;
    await sleep(120);
    await shot(p78, "78-sandbox-crash");
  }
}
if (!fell) throw new Error("sandbox tower never fell");
await p78.waitForFunction(() => !document.querySelector(".sand-tower.crash"));
const s78 = await saved(p78);
if (s78.sand.stack !== 0 || s78.sand.pieces.filter((p) => p.kind === "brick").length < 11) throw new Error(`scatter ${JSON.stringify(s78.sand).slice(0, 200)}`);
await p78.click('[data-act="sand-add"][data-kind="church"]');
await p78.click('[data-act="sand-add"][data-kind="house"]');
const church = (await p78.$$(".piece")).at(-1);
const cBox = await church.boundingBox();
const area = await (await p78.$("#sand")).boundingBox();
await p78.mouse.move(cBox.x + cBox.width / 2, cBox.y + cBox.height / 2);
await p78.mouse.down();
await p78.mouse.move(area.x + area.width * 0.5, area.y + area.height * 0.5, { steps: 8 });
await p78.mouse.up();
const moved = (await saved(p78)).sand.pieces.at(-1);
if (Math.abs(moved.x - 50) > 3 || Math.abs(moved.y - 50) > 3) throw new Error(`piece did not move: ${JSON.stringify(moved)}`);
// Drag a piece onto the trash can: it is removed.
const victim = (await p78.$$(".piece")).at(0);
const vBox = await victim.boundingBox();
const tBox = await (await p78.$("#trash")).boundingBox();
await p78.mouse.move(vBox.x + vBox.width / 2, vBox.y + vBox.height / 2);
await p78.mouse.down();
await p78.mouse.move(tBox.x + tBox.width / 2, tBox.y + tBox.height / 2, { steps: 8 });
if (!(await p78.$("#trash.over"))) throw new Error("trash did not highlight");
await shot(p78, "78-sandbox-trash");
await p78.mouse.up();
if ((await saved(p78)).sand.pieces.length !== s78.sand.pieces.length + 1) throw new Error("trash did not remove the piece");
await p78.click('[data-act="sand-add"][data-kind="tree"]');
await p78.reload({ waitUntil: "networkidle0" });
const kept = (await saved(p78)).sand.pieces.length;
if (!(await p78.$(".sandbox")) || kept !== s78.sand.pieces.length + 2) throw new Error("sandbox not kept on refresh");
await shot(p78, "78-sandbox-built");

await browser.close();
console.log(JSON.stringify({ quotes: q34.length, shots: shots.length }, null, 2));
