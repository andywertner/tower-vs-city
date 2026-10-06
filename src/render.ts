import { brickIcon, creatureIcon, creatureShapes, crossIcon, ICONS, person } from "./art";
import {
  CREATURES,
  choiceLabels,
  choiceLine,
  creatureCard,
  creatureLine,
  creatureName,
  cityLine,
  fallLine,
  levels,
  PLACE_HINT,
  quoteFor,
  SANDBOX_CITE,
  SANDBOX_HINT,
  SANDBOX_TITLE,
  stackLine,
  type Family,
  type Item,
  type Person,
  type Step,
  type Zone,
} from "./challenges";
import { PICS } from "./pics";
import { canStack } from "./rules";
import { PALETTE, sway, TOWER_X } from "./sandbox";
import { LAST_LEVEL, toBuild, type CreatureId, type Piece, type State } from "./state";
import { previewMode, timing } from "./timing";

type PlaceStep = Extract<Step, { kind: "place" }>;

export function render(state: State): string {
  if (state.phase === "band") return bandScreen();
  if (state.phase === "creature") return creatureScreen(state);
  if (state.phase === "sandbox") return sandboxScreen(state);
  const quote = quoteFor(state.verseIndex);
  const veil =
    state.phase === "city"
      ? `<div class="veil"><div>${countdown()}<blockquote class="mh-quote"><p>“${quote.text}”</p><cite>${quote.cite}</cite></blockquote><p class="veil-note">${cityLine(state.city)}</p></div></div>`
      : "";
  const inner = stage(state);
  const one = /^\s*<(div class="stamp"|section class="info-card")/.test(inner) ? " one" : "";
  return `<div class="skyhead">${pips(state)}${skyline(state)}</div><div class="stage${one}">${inner}</div>${veil}`;
}

function bandScreen(): string {
  return `
    <section class="gate">
      <h1 class="title">Tower vs City</h1>
      <p class="subtitle">An Exploration of Magnifica Humanitas by Pope Leo XIV</p>
      <p class="school">Notre Dame de Lourdes School · Mr. Wertner</p>
      <div class="gate-art">${ICONS.blocks}${crossIcon()}</div>
      <p class="prompt">Pick your grade.</p>
      <div class="grades">
        <button type="button" data-act="band" data-band="34">3–4</button>
        <button type="button" data-act="band" data-band="56">5–6</button>
        <button type="button" data-act="band" data-band="78">7–8</button>
      </div>
    </section>
  `;
}

function creatureScreen(state: State): string {
  return `
    <section class="gate creature-gate">
      <p class="prompt">${creatureLine(state.creature)}</p>
      <div class="hero">${creatureCard(state.creature)}<strong>${creatureName(state.creature)}</strong></div>
      <div class="roster">
        ${CREATURES.map((id) => {
          const on = id === state.creature ? "sel" : "";
          return `<button type="button" class="mini ${on}" data-act="creature" data-id="${id}" aria-pressed="${on ? "true" : "false"}">${creatureCard(id)}<span>${shortName(id)}</span></button>`;
        }).join("")}
      </div>
      <button type="button" class="go" data-act="go">Go</button>
    </section>
  `;
}

function shortName(id: CreatureId): string {
  if (id === "baby") return "Baby";
  if (id === "daddy") return "Daddy";
  if (id === "mommy") return "Mommy";
  if (id === "grandma") return "Grandma";
  if (id === "grandpa") return "Grandpa";
  return creatureName(id);
}

function stage(state: State): string {
  if (!state.band) return "";
  if (state.phase === "choice") return choiceScreen(state);
  if (state.phase === "tower") {
    const bricks = state.streak + 1;
    return `<p class="prompt">${stackLine(bricks)}</p>${bigTower(state, bricks)}`;
  }
  if (state.phase === "collapse") return `<p class="prompt">${fallLine(state.creature)}</p>`;
  if (state.phase === "city") return `<div class="watch"></div>`;
  if (state.reading && state.flash) return `<div class="stamp"><p class="prompt">${state.flash}</p></div>`;
  const step = levels(state.band, state.creature)[state.level - 1]?.steps[state.beat];
  if (!step) return "";
  if (step.kind === "card") return infoCard(step);
  const prompt = state.flash || step.prompt;
  const hint =
    step.kind === "place"
      ? `<p class="hint">${PLACE_HINT}</p>`
      : step.kind === "deliver"
        ? `<p class="hint">Drag the top letter to a person, or tap the letter and then tap the person.</p>`
        : "";
  const warn = state.flash ? "warn" : "";
  return `<div class="ask ${warn}"><p class="prompt">${prompt}</p>${hint}</div>${board(step, state)}`;
}

function infoCard(step: Extract<Step, { kind: "card" }>): string {
  const quote = step.quote
    ? `<blockquote class="mh-quote"><p>“${step.quote.text}”</p><cite>${step.quote.cite}</cite></blockquote>`
    : "";
  return `
    <section class="info-card">
      <div class="info-art">${step.art}</div>
      ${step.lines.map((line) => `<p class="info-line">${line}</p>`).join("")}
      ${quote}
      <button type="button" class="go" data-act="next">${step.button}</button>
    </section>
  `;
}

function bigTower(state: State, bricks: number): string {
  const dur = timing(previewMode()).tower;
  const base = 300;
  const h = 34;
  const rects = Array.from({ length: bricks }, (_, i) => {
    const y = base - (i + 1) * h;
    const isNew = i === bricks - 1;
    const style = isNew ? ` style="animation-duration:${dur}ms"` : "";
    return `<rect class="brick${isNew ? " drop" : ""}"${style} x="160" y="${y}" width="80" height="${h - 4}" rx="4"/>`;
  }).join("");
  const top = base - bricks * h;
  const lean = bricks >= 3 ? "lean" : "";
  return `
    <svg class="big-tower" viewBox="0 0 400 320" aria-hidden="true">
      <rect y="300" width="400" height="20" fill="#e7d7b8"/>
      <g class="tower ${lean}">
        ${rects}
        <g class="hop" style="animation-duration:${dur}ms" transform="translate(166 ${top - 62}) scale(0.85)">${creatureShapes(state.creature)}</g>
      </g>
    </svg>
  `;
}

function countdown(): string {
  const ms = timing(previewMode()).city;
  const secs = Math.round(ms / 1000);
  return `
    <div class="clock" aria-label="Seconds left">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle class="clock-track" cx="50" cy="50" r="44"/>
        <circle class="clock-ring" cx="50" cy="50" r="44" style="animation-duration:${ms}ms"/>
      </svg>
      <span id="countdown">${secs}</span>
    </div>
  `;
}

function choiceScreen(state: State): string {
  const fallen = !canStack(toBuild(state));
  const labels = choiceLabels(fallen, state.rubble);
  const word = state.lessonWord
    ? `<div class="word-bar done">${Array.from(state.lessonWord).map((ch) => `<i class="on">${ch}</i>`).join("")}</div>`
    : "";
  const lesson = state.lesson ? `<div class="lesson">${word}<p>${state.lesson}</p></div>` : "";
  const towerButton = fallen
    ? ""
    : `<button type="button" class="choice tower" data-act="choice" data-choice="tower">${brickIcon()}<span>${labels.tower}</span><small>${labels.towerTime}</small></button>`;
  return `
    <div class="ask">${lesson}<p class="prompt">${choiceLine(fallen, state.rubble)}</p></div>
    <div class="choice-row ${fallen ? "single" : ""}">
      ${towerButton}
      <button type="button" class="choice city" data-act="choice" data-choice="city">${fallen ? rubbleIcon() : crossIcon()}<span>${labels.city}</span><small>${labels.cityTime}</small></button>
    </div>
  `;
}

function rubbleIcon(): string {
  return `<svg viewBox="0 0 80 80" aria-hidden="true">
    <rect x="8" y="34" width="64" height="12" rx="3" fill="#d7c4a3" stroke="#241e18" stroke-width="3"/>
    <rect x="34" y="12" width="12" height="56" rx="3" fill="#d7c4a3" stroke="#241e18" stroke-width="3"/>
    <rect x="10" y="52" width="20" height="10" rx="2" fill="#d4652f" stroke="#241e18" stroke-width="2" transform="rotate(-14 20 57)"/>
    <rect x="50" y="52" width="20" height="10" rx="2" fill="#d4652f" stroke="#241e18" stroke-width="2" transform="rotate(12 60 57)"/>
    <rect x="12" y="20" width="18" height="9" rx="2" fill="#d4652f" stroke="#241e18" stroke-width="2" transform="rotate(8 21 24)"/>
  </svg>`;
}

function board(step: Step, state: State): string {
  if (step.kind === "choose") return chooseBoard(step, state);
  if (step.kind === "place") return placeBoard(step, state);
  if (step.kind === "scenes") return sceneBoard(step, state);
  if (step.kind === "deliver") return deliverBoard(step, state);
  if (step.kind === "king") return kingBoard(step, state);
  if (step.kind === "hold") return holdBoard(step);
  if (step.kind === "inspect") return inspectBoard(step, state);
  return "";
}

function chooseBoard(step: Extract<Step, { kind: "choose" }>, state: State): string {
  const buttons = step.options
    .map((opt) => {
      const cls = ["choice-card", step.words ? "word" : "", state.bad === opt.id ? "bad" : ""].filter(Boolean).join(" ");
      return `<button type="button" class="${cls}" data-act="choose" data-id="${opt.id}">${opt.art ?? ""}<span>${escapeText(opt.label)}</span></button>`;
    })
    .join("");
  const art = step.art ? `<div class="choose-art">${step.art}</div>` : "";
  return `<div class="choose-board">${art}<div class="choice-row ${step.words ? "words" : ""}">${buttons}</div></div>`;
}

function placeBoard(step: PlaceStep, state: State): string {
  const trayItems = step.items.filter((item) => !state.placed.some((p) => p.itemId === item.id));
  const fresh = state.placed.length === 0 && !state.selected ? "fresh" : "";
  const wide = step.items.some((item) => item.label.length > 24) ? "wide" : step.items.length > 11 ? "many" : "";
  const tray = `<div class="tray ${fresh} ${wide}">${trayItems.map((item) => card(item, state, familyColor(step, item.id))).join("")}</div>`;
  if (step.board === "rings") return `<div class="board rings-board">${ringZones(step, state)}${tray}</div>`;
  if (step.board === "book") return `<div class="board">${bookZones(step, state)}${tray}</div>`;
  if (step.board === "wall") return `<div class="board wall-place">${wallZones(step, state)}${tray}</div>`;
  return `<div class="board">${binZones(step, state)}${tray}</div>`;
}

function familyColor(step: PlaceStep, id: string): string | null {
  if (!step.tint || !step.families) return null;
  return step.families.find((f) => f.id === id)?.color ?? null;
}

function card(item: Item, state: State, tint: string | null = null): string {
  const long = item.art && item.label.split(" ").some((w) => w.length > 8) ? "long" : "";
  const cls = ["card", item.art ? "" : "text", long, state.selected === item.id ? "sel" : "", state.bad === item.id ? "bad" : "", tint ? "tinted" : ""]
    .filter(Boolean)
    .join(" ");
  const style = tint ? ` style="--c:${tint}"` : "";
  const label = item.label ? `<span>${escapeText(item.label)}</span>` : "";
  return `<button type="button" class="${cls}"${style} data-act="item" data-item="${item.id}">${item.art}${label}</button>`;
}

function placedIn(zoneId: string, step: PlaceStep, state: State): Item[] {
  return state.placed
    .filter((p) => p.zoneId === zoneId)
    .map((p) => step.items.find((item) => item.id === p.itemId))
    .filter((item): item is Item => Boolean(item));
}

function contents(zone: Zone, step: PlaceStep, state: State): string {
  const label = zone.label ? `<em>${escapeText(zone.label)}</em>` : "";
  const placed = placedIn(zone.id, step, state);
  if (!placed.length) return `<span class="ghost-art">${zone.art}</span>${label}`;
  if (step.pile) return `${label}<span class="filled">${placed.map((item) => item.art).join("")}</span>`;
  const shown = placed
    .map((item) => `<span class="placed">${item.art}${item.label ? `<b>${escapeText(item.label)}</b>` : ""}</span>`)
    .join("");
  return `${label}${shown}`;
}

function binZones(step: PlaceStep, state: State): string {
  return `<div class="zones">${step.zones
    .map((zone) => `<button type="button" class="zone" data-act="zone" data-zone="${zone.id}">${contents(zone, step, state)}</button>`)
    .join("")}</div>`;
}

function bookZones(step: PlaceStep, state: State): string {
  return `<div class="book">${step.zones
    .map((zone) => `<button type="button" class="slot-line" data-act="zone" data-zone="${zone.id}">${contents(zone, step, state)}</button>`)
    .join("")}</div>`;
}

const RING_MID = [0, 27.5, 42.5];

function ringZones(step: PlaceStep, state: State): string {
  const overlay = step.zones
    .map((zone, ring) => {
      const placed = placedIn(zone.id, step, state);
      return placed
        .map((item, i) => {
          const turn = ((-90 + (i * 360) / Math.max(placed.length, ring === 2 ? 7 : 5) + ring * 20) * Math.PI) / 180;
          const r = RING_MID[ring];
          const left = 50 + r * Math.cos(turn);
          const top = 50 + r * Math.sin(turn);
          return `<span class="ring-piece" data-ring="${zone.id}" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%" title="${escapeText(item.label)}">${item.art}</span>`;
        })
        .join("");
    })
    .join("");
  const zone = (ring: number, inner: string) => `<div class="ring-zone r${ring}" data-act="zone" data-zone="r${ring}">${inner}</div>`;
  const nested = zone(2, zone(1, zone(0, "")));
  const filled = placedIn("r0", step, state).length > 0 ? " filled" : "";
  return `
    <div class="rings fit${filled}">
      ${nested}
      <div class="ring-overlay">${overlay}</div>
      <span class="ring-tag in">Foundation</span>
      <span class="ring-tag mid">People</span>
      <span class="ring-tag out">City</span>
    </div>
  `;
}

interface WallSection {
  act: string;
  key: string;
  label: string;
  sub: string;
  color: string | null;
  look: "broken" | "seen" | "built";
}

function wallRing(sections: WallSection[], centerNote: string): string {
  const n = sections.length;
  const buttons = sections
    .map((s, i) => {
      const turn = ((-90 + (i * 360) / n) * Math.PI) / 180;
      const left = 50 + 37 * Math.cos(turn);
      const top = 50 + 36 * Math.sin(turn);
      const style = `left:${left.toFixed(2)}%;top:${top.toFixed(2)}%`;
      const art = s.look === "built" ? PICS_WALL.built : PICS_WALL.broken;
      const cls = ["wall-part", s.look, s.color ? "tinted" : ""].filter(Boolean).join(" ");
      const tint = s.color ? ` style="--c:${s.color}"` : "";
      return `<span class="pin" style="${style}"><button type="button" class="${cls}"${tint} ${s.act}="${s.key}">${art}<em>${escapeText(s.label)}</em>${s.sub ? `<b>${escapeText(s.sub)}</b>` : ""}</button></span>`;
    })
    .join("");
  return `<div class="wall-board fit"><div class="wall-line"></div><div class="wall-center">${PICS.temple}<span>${centerNote}</span></div>${buttons}</div>`;
}

const PICS_WALL = {
  broken: `<svg viewBox="0 0 80 40" aria-hidden="true"><rect x="4" y="22" width="20" height="14" fill="#c9b48f" stroke="#241e18" stroke-width="2"/><rect x="30" y="28" width="16" height="8" fill="#c9b48f" stroke="#241e18" stroke-width="2" transform="rotate(-12 38 32)"/><rect x="52" y="18" width="24" height="18" fill="#c9b48f" stroke="#241e18" stroke-width="2"/><path d="M24 20 L30 28 M46 26 L52 18" stroke="#241e18" stroke-width="2"/></svg>`,
  built: `<svg viewBox="0 0 80 40" aria-hidden="true"><rect x="4" y="8" width="72" height="28" fill="#d7c4a3" stroke="#241e18" stroke-width="2"/><path d="M4 22 H76 M22 8 V22 M44 8 V22 M66 8 V22 M12 22 V36 M34 22 V36 M56 22 V36" stroke="#241e18" stroke-width="1.5"/><path d="M4 8 V2 H14 V8 M26 8 V2 H36 V8 M48 8 V2 H58 V8 M68 8 V2 H76 V8" fill="#d7c4a3" stroke="#241e18" stroke-width="2"/></svg>`,
};

function wallZones(step: PlaceStep, state: State): string {
  const sections: WallSection[] = step.zones.map((zone) => {
    const placed = placedIn(zone.id, step, state)[0];
    const fam = step.families?.find((f) => f.id === zone.bin);
    return {
      act: `data-act="zone" data-zone`,
      key: zone.id,
      label: zone.label,
      sub: placed ? placed.label : "",
      color: step.tint && fam ? fam.color : null,
      look: placed ? "built" : "broken",
    };
  });
  const done = state.placed.length;
  return wallRing(sections, `${done} of ${step.zones.length} rebuilt`);
}

function inspectBoard(step: Extract<Step, { kind: "inspect" }>, state: State): string {
  const sections: WallSection[] = step.families.map((fam: Family) => {
    const seen = state.marks.includes(fam.id);
    return {
      act: `data-act="inspect" data-id`,
      key: fam.id,
      label: seen ? fam.home : "Broken",
      sub: seen ? `Next to ${fam.name.replace(/^The /, "the ")}` : "Tap to look",
      color: seen && step.tint ? fam.color : null,
      look: seen ? "seen" : "broken",
    };
  });
  return `<div class="board">${wallRing(sections, "Jerusalem")}</div>`;
}

function holdBoard(step: Extract<Step, { kind: "hold" }>): string {
  const ms = previewMode() ? 400 : 3000;
  return `
    <div class="pray-board">
      <div class="pray-art">${PICS.nehemiah}</div>
      <button type="button" class="pray-btn" data-pray="1" style="--hold:${ms}ms">
        <i class="fill"></i>${PICS.pray}<span>${step.button}</span>
      </button>
    </div>
  `;
}

function deliverBoard(step: Extract<Step, { kind: "deliver" }>, state: State): string {
  const n = step.people.length;
  const nextId = step.order[state.marks.length];
  const next = step.people.find((p) => p.id === nextId);
  const people = step.people
    .map((p, i) => {
      const turn = ((-90 + (i * 360) / n) * Math.PI) / 180;
      const left = 50 + 40 * Math.cos(turn);
      const top = 50 + 40 * Math.sin(turn);
      const got = state.marks.indexOf(p.id);
      const cls = ["person-spot", got >= 0 ? "got" : "", state.bad === p.id ? "bad" : ""].filter(Boolean).join(" ");
      const letter = got >= 0 ? `<b class="got-letter">${step.word[got]}</b>` : "";
      return `<span class="pin" style="left:${left.toFixed(2)}%;top:${top.toFixed(2)}%"><button type="button" class="${cls}" data-act="zone" data-zone="${p.id}">${personChip(p, step.marker)}<span>${p.name}</span>${letter}</button></span>`;
    })
    .join("");
  const left = step.order.length - state.marks.length;
  const letterCls = ["card", "letter-card", state.selected === "letter" ? "sel" : "", state.bad === "letter" ? "bad" : ""].filter(Boolean).join(" ");
  const center = next
    ? `<div class="mailbox"><button type="button" class="${letterCls}" data-act="item" data-item="letter">${envelope(next, step.marker)}</button><small>${left} letter${left === 1 ? "" : "s"} left</small></div>`
    : "";
  const bar = Array.from(step.word)
    .map((ch, i) => `<i class="${i < state.marks.length ? "on" : ""}${i === state.marks.length - 1 ? " new" : ""}">${i < state.marks.length ? ch : ""}</i>`)
    .join("");
  return `<div class="board deliver-board"><div class="circle-board fit">${people}${center}</div><div class="word-bar" aria-label="Word so far">${bar}</div></div>`;
}

function personChip(p: Person, marker: "color" | "shape" | "name"): string {
  if (marker === "color") return `<i class="chip" style="background:${p.color}"></i>`;
  if (marker === "shape") return `<i class="chip plain">${p.shape}</i>`;
  return `<i class="chip plain">${p.name[0]}</i>`;
}

function envelope(p: Person, marker: "color" | "shape" | "name"): string {
  const mark =
    marker === "color"
      ? `<i class="env-mark" style="background:${p.color}"></i>`
      : marker === "shape"
        ? `<i class="env-mark plain">${p.shape}</i>`
        : `<i class="env-mark name">To: ${p.name}</i>`;
  return `<span class="env">${PICS.envelope}${mark}</span>`;
}

function kingBoard(step: Extract<Step, { kind: "king" }>, state: State): string {
  const sent = state.marks;
  const top = sent[sent.length - 1];
  const knocked = sent.slice(0, -1);
  const color = (id: string) => step.bricks[Number(id.slice(1))] ?? "#c4553a";
  const meBrick = (id: string, cls: string) => `<b class="me ${cls}" style="background:${color(id)}">ME</b>`;
  const left = step.bricks.map((_, i) => `k${i}`).filter((id) => !sent.includes(id));
  return `
    <div class="topgame">
      <div class="summit">
        <div class="peak">${top ? meBrick(top, "climb") : `<i class="peak-empty">Top</i>`}</div>
        <div class="mini-tower"><i class="base-brick"></i><i class="base-brick"></i><i class="base-brick"></i></div>
      </div>
      <div class="fell">${knocked.length ? `<em>Knocked off:</em>` : ""}${knocked
        .map((id, i) => meBrick(id, i === knocked.length - 1 ? "tumble" : "dim"))
        .join("")}</div>
      <div class="tray">
        ${left.map((id) => `<button type="button" class="card me-card" style="--c:${color(id)}" data-act="king" data-id="${id}">ME</button>`).join("")}
      </div>
    </div>
  `;
}

function sceneBoard(step: Extract<Step, { kind: "scenes" }>, state: State): string {
  const scene = step.scenes[state.scene];
  if (!scene) return "";
  const towerBad = state.bad === "tower" ? "bad" : "";
  const cityBad = state.bad === "city" ? "bad" : "";
  return `
    <div class="scene-play">
      <div class="scene-art">${scene.art}<p class="caption">${escapeText(scene.caption)}</p><small class="count">${state.scene + 1} of ${step.scenes.length}</small></div>
      <div class="targets">
        <button type="button" class="zone ${towerBad}" data-act="scene" data-side="tower">${brickIcon()}<em>Tower (just me)</em></button>
        <button type="button" class="zone ${cityBad}" data-act="scene" data-side="city">${crossIcon()}<em>City (together)</em></button>
      </div>
    </div>
  `;
}

function pips(state: State): string {
  const dots = Array.from({ length: LAST_LEVEL }, (_, i) => {
    const n = i + 1;
    const cls = n < state.level ? "on" : n === state.level ? "now" : "";
    return `<i class="${cls}"></i>`;
  }).join("");
  return `<div class="pips" aria-hidden="true">${dots}</div>`;
}

function skyline(state: State): string {
  const growing = state.phase === "city";
  let bricks = state.streak;
  let cityN = state.city;
  if (state.phase === "tower") bricks = state.streak + 1;
  if (state.phase === "collapse") bricks = 4;
  if (growing) cityN = Math.min(8, state.city + 1);
  const lean = !growing && state.phase !== "collapse" && bricks >= 3;
  const hard = state.phase === "tower" && bricks >= 4;
  const fall = state.phase === "collapse";
  const anchor = growing && state.streak > 0;
  const dur = timing(previewMode());
  const towerClass = ["tower", lean ? "lean" : "", hard ? "hard" : "", fall ? "fall" : "", anchor ? "anchor" : ""].filter(Boolean).join(" ");
  const motion = fall
    ? `animation-duration:${Math.round(dur.collapse * 0.7)}ms`
    : anchor
      ? `animation-duration:${Math.min(4000, dur.city)}ms`
      : "";
  const anchorStyle = motion ? ` style="${motion}"` : "";
  const brickRects = Array.from({ length: bricks }, (_, i) => {
    const y = 214 - (i + 1) * 30;
    const isNew = state.phase === "tower" && i === bricks - 1;
    const style = isNew ? ` style="animation-duration:${dur.tower}ms"` : "";
    return `<rect class="brick${isNew ? " drop" : ""}"${style} x="742" y="${y}" width="56" height="24" rx="3"/>`;
  }).join("");
  const onTower = bricks > 0;
  const avatar = `<g transform="translate(${onTower ? 718 : 640} ${onTower ? 214 - bricks * 30 - 64 : 142}) scale(0.9)">${creatureShapes(state.creature)}</g>`;
  const rubbleMoving = growing && state.rubble > 0;
  const rubbleStyle = rubbleMoving ? ` style="animation-duration:${Math.min(4000, dur.city)}ms"` : "";
  const spots = [
    [690, 196, -14],
    [742, 200, 6],
    [796, 194, -8],
    [846, 202, 16],
    [716, 176, 10],
    [772, 178, -6],
    [822, 180, 12],
    [746, 158, -4],
  ];
  const rubble = state.rubble
    ? `<g class="rubble ${rubbleMoving ? "anchor" : ""}"${rubbleStyle}>${Array.from({ length: Math.min(state.rubble, 8) }, (_, i) => {
        const [x, y, r] = spots[i % spots.length];
        return `<rect class="rub" x="${x}" y="${y}" width="50" height="18" rx="3" transform="rotate(${r} ${x + 25} ${y + 9})"/>`;
      }).join("")}</g>`
    : "";
  const cottages = Array.from({ length: Math.min(state.anchored, 8) }, (_, i) => {
    const x = 470 + (i % 4) * 42;
    const y = 168 - Math.floor(i / 4) * 28;
    return `<g class="cottage"><rect x="${x}" y="${y}" width="28" height="20" rx="2"/><polygon points="${x - 2},${y} ${x + 14},${y - 12} ${x + 30},${y}"/></g>`;
  }).join("");

  return `
    <svg class="sky" viewBox="0 0 1000 250" role="img" aria-label="Your skyline">
      <rect width="1000" height="250" fill="#d7ebf6"/>
      <rect y="214" width="1000" height="36" fill="#e7d7b8"/>
      ${cityPieces(cityN, growing, dur.city, state.creature)}
      ${cottages}
      ${rubble}
      <g class="${towerClass}"${anchorStyle}>${brickRects}${onTower ? avatar : ""}</g>
      ${onTower ? "" : avatar}
    </svg>
  `;
}

function cityPieces(cityN: number, growing: boolean, cityMs: number, creature: CreatureId): string {
  const piece = (n: number, body: string) => {
    if (cityN < n) return "";
    const isNew = growing && cityN === n;
    const style = isNew ? ` style="animation-duration:${cityMs}ms"` : "";
    return `<g class="${isNew ? "grow" : ""}"${style}>${body}</g>`;
  };
  const house = (x: number, y: number) =>
    `<rect x="${x}" y="${y}" width="36" height="26" fill="#f2e2c4" stroke="#241e18" stroke-width="2"/><polygon points="${x - 2},${y} ${x + 18},${y - 16} ${x + 38},${y}" fill="#c4553a" stroke="#241e18" stroke-width="2"/>`;
  return [
    piece(1, `<rect x="150" y="118" width="250" height="26" rx="6" fill="#d7c4a3" stroke="#241e18" stroke-width="3"/>`),
    piece(2, `<rect x="262" y="40" width="26" height="170" rx="6" fill="#d7c4a3" stroke="#241e18" stroke-width="3"/>`),
    piece(3, `${house(150, 104)}${house(364, 104)}${house(252, 36)}`),
    piece(4, peoplePiece(creature)),
    piece(5, `<circle cx="275" cy="131" r="10" fill="#f0c14d" stroke="#241e18" stroke-width="2"/>`),
    piece(6, `<circle cx="132" cy="150" r="12" fill="#2f6d4f"/><circle cx="420" cy="150" r="12" fill="#2f6d4f"/><rect x="128" y="150" width="6" height="14" fill="#6d4c2b"/><rect x="416" y="150" width="6" height="14" fill="#6d4c2b"/>`),
    piece(7, `<path d="M248 196 H302 V214 H248 Z" fill="none" stroke="#241e18" stroke-width="3"/><path d="M248 196 Q275 176 302 196" fill="none" stroke="#241e18" stroke-width="3"/>`),
    piece(8, `<circle cx="190" cy="131" r="4" fill="#f0c14d"/><circle cx="230" cy="131" r="4" fill="#f0c14d"/><circle cx="320" cy="131" r="4" fill="#f0c14d"/><circle cx="360" cy="131" r="4" fill="#f0c14d"/><circle cx="275" cy="78" r="4" fill="#f0c14d"/><circle cx="275" cy="170" r="4" fill="#f0c14d"/>`),
  ].join("");
}

function peoplePiece(creature: CreatureId): string {
  const cast = familyCast(creature);
  if (cast.length === 0) {
    const colors = ["#e07a5f", "#81b29a", "#f2cc8f", "#3d405b"];
    return colors
      .map((color, i) => `<g transform="translate(${168 + i * 42} 78) scale(0.42)">${person(color)}</g>`)
      .join("");
  }
  return cast
    .map((id, i) => `<g transform="translate(${160 + i * 48} 70) scale(0.5)">${creatureShapes(id)}</g>`)
    .join("");
}

function familyCast(creature: CreatureId): CreatureId[] {
  const sharks: CreatureId[] = ["baby", "daddy", "mommy", "grandma", "grandpa"];
  return sharks.includes(creature) ? sharks.filter((id) => id !== creature) : [];
}

const PALETTE_NAMES: Record<string, string> = {
  house: "House",
  tree: "Tree",
  light: "Light",
  church: "Church",
  well: "Well",
  family: "Family",
};

function pieceArt(kind: string, creature: CreatureId): string {
  if (kind === "brick") return `<svg viewBox="0 0 60 24" aria-hidden="true"><rect x="1" y="1" width="58" height="22" rx="3" fill="#d4652f" stroke="#241e18" stroke-width="2"/></svg>`;
  if (kind === "house") return ICONS.house;
  if (kind === "tree") return ICONS.tree;
  if (kind === "light") return ICONS.light;
  if (kind === "church") return PICS.church;
  if (kind === "well") return ICONS.well;
  if (kind === "family") {
    const cast = familyCast(creature);
    if (!cast.length) return creatureIcon(creature);
    const group = [creature, ...cast].map((id, i) => `<g transform="translate(${i * 70} 0)">${creatureShapes(id)}</g>`).join("");
    return `<svg viewBox="0 0 360 80" aria-hidden="true">${group}</svg>`;
  }
  return "";
}

function sandboxScreen(state: State): string {
  const sand = state.sand;
  const brickH = 26;
  const tilt = sway(sand.stack);
  const swayDur = Math.max(0.9, 2.6 - sand.stack * 0.1);
  const bricks = Array.from({ length: sand.stack }, (_, i) => `<i class="s-brick" style="bottom:${i * brickH}px"></i>`).join("");
  const rider = sand.stack
    ? `<span class="s-rider" style="bottom:${sand.stack * brickH}px">${creatureIcon(state.creature)}</span>`
    : "";
  const tower = `<div class="sand-tower-pin" style="left:${TOWER_X}%"><div class="sand-tower ${sand.stack >= 3 ? "sway" : ""}" style="--tilt:${tilt}deg;--sdur:${swayDur}s">${bricks}${rider}</div></div>`;
  const pieces = sand.pieces.map((p) => pieceHtml(p, state.creature)).join("");
  const palette = PALETTE.map(
    (kind) => `<button type="button" class="card pal" data-act="sand-add" data-kind="${kind}">${pieceArt(kind, state.creature)}<span>${PALETTE_NAMES[kind]}</span></button>`,
  ).join("");
  return `
    <section class="sandbox">
      <header class="sand-head">
        <h2>${SANDBOX_TITLE}</h2><cite>${SANDBOX_CITE}</cite>
        <p class="hint">${SANDBOX_HINT}</p>
      </header>
      <div class="sand" id="sand">
        <div class="sand-ground"></div>
        ${tower}
        ${pieces}
        <div class="sand-trash" id="trash" aria-label="Trash">${trashIcon()}<span>Drop here to remove</span></div>
      </div>
      <div class="sand-tools">
        <button type="button" class="choice tower add-brick" data-act="sand-brick">${brickIcon()}<span>Add a brick</span><small>Height: ${sand.stack}</small></button>
        <div class="palette">${palette}</div>
      </div>
    </section>
  `;
}

function pieceHtml(p: Piece, creature: CreatureId): string {
  const wide = p.kind === "family" ? " wide" : p.kind === "brick" ? " brickish" : "";
  return `<div class="piece${wide}" data-piece="${p.id}" style="left:${p.x}%;top:${p.y}%;--r:${p.r}deg">${pieceArt(p.kind, creature)}</div>`;
}

function escapeText(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function trashIcon(): string {
  return `<svg viewBox="0 0 80 80" aria-hidden="true"><rect x="22" y="26" width="36" height="42" rx="5" fill="#d9d3c7" stroke="#241e18" stroke-width="3"/><rect x="16" y="18" width="48" height="8" rx="3" fill="#8a8175" stroke="#241e18" stroke-width="3"/><rect x="32" y="12" width="16" height="6" rx="2" fill="#8a8175" stroke="#241e18" stroke-width="2"/><path d="M32 34 V60 M40 34 V60 M48 34 V60" stroke="#241e18" stroke-width="3" stroke-linecap="round"/></svg>`;
}
