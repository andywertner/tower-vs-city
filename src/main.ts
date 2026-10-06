import "./style.css";
import { fallLine, leanLine, levels, ringLine, type Level, type Step } from "./challenges";
import { render } from "./render";
import { afterCity, afterTower, canStack } from "./rules";
import { addBrick, addPiece, movePiece, removePiece, scatter, startSand } from "./sandbox";
import { clearSave, fresh, LAST_LEVEL, load, save, toBuild, type Band, type CreatureId, type State } from "./state";
import { previewMode, timing } from "./timing";

let state: State = load();
let rewardTimer = 0;
let uiTimer = 0;
let onReward: (() => void) | null = null;
let suppressClick = false;
let sandBusy = false;

const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Missing #app");

function draw(): void {
  app!.dataset.band = state.band ?? "";
  app!.classList.toggle("full", state.phase === "band" || state.phase === "creature" || state.phase === "sandbox");
  app!.classList.toggle("quiz", state.phase === "challenge");
  app!.innerHTML = render(state);
  fitBoards();
  save(state);
}

/** Size square boards from the space they get, so cards scale on any screen or Chrome version. */
function fitBoards(): void {
  document.querySelectorAll<HTMLElement>(".fit").forEach((el) => {
    el.style.width = "";
    el.style.height = "";
    const parent = el.parentElement;
    if (!parent) return;
    const cap = el.classList.contains("rings") ? 460 : 520;
    const size = Math.max(140, Math.min(el.clientHeight || cap, parent.clientWidth || cap, cap));
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.setProperty("--cq", `${size}px`);
  });
}
window.addEventListener("resize", fitBoards);

function armReward(ms: number, fn: () => void): void {
  window.clearTimeout(rewardTimer);
  onReward = fn;
  rewardTimer = window.setTimeout(() => {
    onReward = null;
    fn();
  }, ms);
}

function armUi(ms: number, fn: () => void): void {
  window.clearTimeout(uiTimer);
  uiTimer = window.setTimeout(fn, ms);
}

function skipLock(): void {
  if (!onReward) return;
  const fn = onReward;
  onReward = null;
  window.clearTimeout(rewardTimer);
  fn();
}

function clearTimers(): void {
  window.clearTimeout(rewardTimer);
  window.clearTimeout(uiTimer);
  window.clearTimeout(prayTimer);
  stopCountdown();
  onReward = null;
  sandBusy = false;
}

function resetAll(): void {
  clearTimers();
  state = fresh();
  clearSave();
  draw();
}

function resetStep(): void {
  state.beat = 0;
  state.placed = [];
  state.selected = null;
  state.scene = 0;
  state.tops = 0;
  state.marks = [];
  state.bad = null;
  state.reading = false;
  state.flash = null;
}

function currentLevel(): Level | null {
  if (!state.band) return null;
  return levels(state.band, state.creature)[state.level - 1] ?? null;
}

function nextLevel(): void {
  if (state.level >= LAST_LEVEL) {
    startSandbox();
    return;
  }
  state.level += 1;
  resetStep();
  state.phase = "challenge";
  draw();
}

function startSandbox(): void {
  resetStep();
  state.phase = "sandbox";
  state.sand = startSand(state.sand, state.rubble, Math.random);
  draw();
}

function finishReward(): void {
  state.flash = null;
  nextLevel();
}

function endTowerAnim(): void {
  if (state.phase !== "tower") return;
  const result = afterTower(toBuild(state));
  state.towerChoices = result.towerChoices;
  if (result.fell) {
    state.streak = 4;
    state.phase = "collapse";
    state.flash = fallLine(state.creature);
    draw();
    armReward(timing(previewMode()).collapse, () => {
      if (state.phase !== "collapse") return;
      state.streak = 0;
      state.collapses = result.collapses;
      state.rubble = result.rubble;
      finishReward();
    });
    return;
  }
  state.streak = result.streak;
  finishReward();
}

function endCityAnim(): void {
  if (state.phase !== "city") return;
  const result = afterCity(toBuild(state));
  state.streak = result.streak;
  state.city = result.city;
  state.anchored = result.anchored;
  state.cityChoices = result.cityChoices;
  state.rubble = result.rubble;
  state.verseIndex += 1;
  stopCountdown();
  finishReward();
}

let countdownTimer = 0;

function startCountdown(ms: number): void {
  stopCountdown();
  const endsAt = Date.now() + ms;
  const tick = () => {
    const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
    const el = document.querySelector<HTMLElement>("#countdown");
    if (el) el.textContent = String(left);
  };
  tick();
  countdownTimer = window.setInterval(tick, 200);
}

function stopCountdown(): void {
  window.clearInterval(countdownTimer);
  countdownTimer = 0;
}

function choose(kind: "tower" | "city"): void {
  if (state.phase !== "choice") return;
  state.lesson = null;
  state.lessonWord = null;
  const pace = timing(previewMode());
  if (kind === "tower") {
    if (!canStack(toBuild(state))) return;
    state.phase = "tower";
    state.flash = state.streak + 1 >= 3 ? leanLine() : null;
    draw();
    armReward(pace.tower, endTowerAnim);
    return;
  }
  state.phase = "city";
  state.flash = null;
  draw();
  startCountdown(pace.city);
  armReward(pace.city, endCityAnim);
}

function stepNow(): Step | null {
  if (state.phase !== "challenge") return null;
  return currentLevel()?.steps[state.beat] ?? null;
}

function completeStep(success?: string): void {
  if (state.phase !== "challenge") return;
  const level = currentLevel();
  if (!level) return;
  const step = level.steps[state.beat];
  const more = state.beat + 1 < level.steps.length;
  const go = () => {
    if (state.phase !== "challenge") return;
    const beat = state.beat;
    resetStep();
    if (more) {
      state.beat = beat + 1;
      draw();
    } else if (level.reward) {
      state.phase = "choice";
      state.lesson = success ?? null;
      state.lessonWord = step?.kind === "deliver" ? step.word : null;
      draw();
    } else {
      nextLevel();
    }
  };
  if (success) {
    state.reading = true;
    state.flash = success;
    state.selected = null;
    draw();
    armUi(timing(previewMode()).read, go);
    return;
  }
  go();
}

function shake(id: string, flash: string | null = null): void {
  state.bad = null;
  state.flash = flash;
  draw();
  state.bad = id;
  draw();
}

function dropOn(itemId: string, zoneId: string): void {
  const step = stepNow();
  if (!step || state.reading) return;
  if (step.kind === "place") tryPlace(step, itemId, zoneId);
  if (step.kind === "deliver") tryDeliver(step, itemId, zoneId);
}

function tryPlace(step: Extract<Step, { kind: "place" }>, itemId: string, zoneId: string): void {
  state.flash = null;
  if (state.placed.some((p) => p.itemId === itemId)) return;
  if (!step.pile && state.placed.some((p) => p.zoneId === zoneId)) return;
  const item = step.items.find((row) => row.id === itemId);
  const zone = step.zones.find((row) => row.id === zoneId);
  if (!item || !zone) return;
  if (item.unsuitable) {
    shake(itemId);
    return;
  }
  if (item.bin !== zone.bin) {
    const hint = step.board === "rings" ? ringLine(item.label, Number(zone.bin.slice(1)) < Number(item.bin.slice(1))) : null;
    shake(itemId, hint);
    return;
  }
  state.placed = [...state.placed, { itemId, zoneId }];
  state.selected = null;
  state.bad = null;
  const needed = step.items.filter((row) => !row.unsuitable);
  if (needed.every((row) => state.placed.some((p) => p.itemId === row.id))) completeStep(step.success);
  else draw();
}

function tryDeliver(step: Extract<Step, { kind: "deliver" }>, itemId: string, zoneId: string): void {
  if (itemId !== "letter") return;
  const want = step.order[state.marks.length];
  if (!want) return;
  state.flash = null;
  if (zoneId !== want) {
    shake(zoneId);
    return;
  }
  state.marks = [...state.marks, zoneId];
  state.selected = null;
  state.bad = null;
  if (state.marks.length >= step.order.length) completeStep(step.success);
  else draw();
}

function tryChoose(id: string): void {
  const step = stepNow();
  if (!step || step.kind !== "choose" || state.reading) return;
  const opt = step.options.find((row) => row.id === id);
  if (!opt) return;
  if (!opt.ok) {
    shake(id, opt.wrong ?? null);
    return;
  }
  completeStep(step.success);
}

function tryScene(side: "tower" | "city"): void {
  const step = stepNow();
  if (!step || step.kind !== "scenes" || state.reading) return;
  const scene = step.scenes[state.scene];
  if (!scene) return;
  if (scene.answer !== side) {
    shake(side);
    return;
  }
  state.scene += 1;
  state.bad = null;
  if (state.scene >= step.scenes.length) completeStep(step.success);
  else draw();
}

function tryKing(id: string): void {
  const step = stepNow();
  if (!step || step.kind !== "king" || state.reading || state.marks.includes(id)) return;
  state.marks = [...state.marks, id];
  draw();
  if (state.marks.length >= step.bricks.length) armUi(previewMode() ? 200 : 1100, () => completeStep(step.success));
}

function tryInspect(id: string): void {
  const step = stepNow();
  if (!step || step.kind !== "inspect" || state.reading || state.marks.includes(id)) return;
  state.marks = [...state.marks, id];
  draw();
  if (step.families.every((f) => state.marks.includes(f.id))) armUi(previewMode() ? 200 : 900, () => completeStep(step.success));
}

let prayTimer = 0;

function startPray(btn: HTMLElement): void {
  const step = stepNow();
  if (!step || step.kind !== "hold" || state.reading) return;
  btn.classList.add("holding");
  window.clearTimeout(prayTimer);
  prayTimer = window.setTimeout(() => {
    btn.classList.remove("holding");
    completeStep(step.success);
  }, previewMode() ? 400 : 3000);
}

function stopPray(): void {
  window.clearTimeout(prayTimer);
  document.querySelector(".pray-btn.holding")?.classList.remove("holding");
}

function sandBrick(): void {
  if (state.phase !== "sandbox" || sandBusy) return;
  const { sand, fell } = addBrick(state.sand, Math.random());
  state.sand = sand;
  draw();
  if (!fell) return;
  sandBusy = true;
  document.querySelector(".sand-tower")?.classList.add("crash");
  armUi(previewMode() ? 250 : 1100, () => {
    sandBusy = false;
    if (state.phase !== "sandbox") return;
    state.sand = scatter(state.sand, Math.random);
    draw();
  });
}

function sandAdd(kind: string): void {
  if (state.phase !== "sandbox" || state.sand.pieces.length >= 300) return;
  state.sand = addPiece(state.sand, kind, Math.random);
  draw();
}

function startGame(): void {
  if (!state.band) return;
  const band = state.band;
  const creature = state.creature;
  clearTimers();
  state = fresh();
  state.band = band;
  state.creature = creature;
  state.phase = "challenge";
  draw();
}

function onClick(event: MouseEvent): void {
  if (suppressClick) {
    suppressClick = false;
    return;
  }
  const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-act]");
  if (!target) return;
  const act = target.dataset.act;
  if (act === "band") {
    state.band = target.dataset.band as Band;
    state.phase = "creature";
    state.creature = "baby";
    draw();
    return;
  }
  if (act === "creature") {
    state.creature = target.dataset.id as CreatureId;
    draw();
    return;
  }
  if (act === "go") return startGame();
  if (act === "new") return askStartOver();
  if (act === "new-yes") {
    closeStartOver();
    return resetAll();
  }
  if (act === "new-no") return closeStartOver();
  if (act === "next") {
    const step = stepNow();
    if (step?.kind === "card") completeStep();
    return;
  }
  if (act === "item") {
    const id = target.dataset.item;
    if (!id || state.phase !== "challenge" || state.reading) return;
    state.selected = state.selected === id ? null : id;
    state.bad = null;
    draw();
    return;
  }
  if (act === "zone") {
    const zone = target.dataset.zone;
    if (!zone || !state.selected) return;
    dropOn(state.selected, zone);
    return;
  }
  if (act === "choose") {
    const id = target.dataset.id;
    if (id) tryChoose(id);
    return;
  }
  if (act === "scene") {
    const side = target.dataset.side;
    if (side === "tower" || side === "city") tryScene(side);
    return;
  }
  if (act === "king") {
    const id = target.dataset.id;
    if (id) tryKing(id);
    return;
  }
  if (act === "inspect") {
    const id = target.dataset.id;
    if (id) tryInspect(id);
    return;
  }
  if (act === "choice") {
    const kind = target.dataset.choice;
    if (kind === "tower" || kind === "city") choose(kind);
    return;
  }
  if (act === "zoom") return setZoom(zoom + (target.dataset.dir === "in" ? 0.1 : -0.1));
  if (act === "sand-brick") return sandBrick();
  if (act === "sand-add") {
    const kind = target.dataset.kind;
    if (kind) sandAdd(kind);
  }
}

interface Drag {
  id: string;
  el: HTMLElement;
  pointer: number;
  x: number;
  y: number;
  moved: boolean;
  html: string;
  ghost: HTMLElement | null;
}

interface PieceDrag {
  id: number;
  el: HTMLElement;
  area: DOMRect;
  pointer: number;
  x: number;
  y: number;
  moved: boolean;
}

let drag: Drag | null = null;
let pieceDrag: PieceDrag | null = null;

function onPointerDown(event: PointerEvent): void {
  const el = event.target as HTMLElement | null;
  const pray = el?.closest<HTMLElement>("[data-pray]");
  if (pray) {
    event.preventDefault();
    startPray(pray);
    return;
  }
  const piece = el?.closest<HTMLElement>("[data-piece]");
  const area = document.querySelector<HTMLElement>("#sand");
  if (piece && area && state.phase === "sandbox") {
    event.preventDefault();
    pieceDrag = {
      id: Number(piece.dataset.piece),
      el: piece,
      area: area.getBoundingClientRect(),
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      moved: false,
    };
    piece.classList.add("lifted");
    return;
  }
  const item = el?.closest<HTMLElement>("[data-item]");
  if (!item || state.phase !== "challenge" || state.reading) return;
  drag = {
    id: item.dataset.item ?? "",
    el: item,
    pointer: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    moved: false,
    html: item.outerHTML,
    ghost: null,
  };
}

function onPointerMove(event: PointerEvent): void {
  if (pieceDrag && event.pointerId === pieceDrag.pointer) {
    pieceDrag.moved = true;
    const { x, y } = piecePos(pieceDrag, event);
    pieceDrag.el.style.left = `${x}%`;
    pieceDrag.el.style.top = `${y}%`;
    const trash = document.querySelector<HTMLElement>("#trash");
    if (trash) {
      const r = trash.getBoundingClientRect();
      trash.classList.toggle("over", event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom);
    }
    return;
  }
  if (!drag || event.pointerId !== drag.pointer) return;
  if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) <= 8) return;
  drag.moved = true;
  if (!drag.ghost) {
    const ghost = document.createElement("div");
    ghost.className = "ghost";
    ghost.innerHTML = drag.html;
    document.body.appendChild(ghost);
    drag.ghost = ghost;
    drag.el.classList.add("lifting");
  }
  drag.ghost.style.left = `${event.clientX}px`;
  drag.ghost.style.top = `${event.clientY}px`;
}

function piecePos(p: PieceDrag, event: PointerEvent): { x: number; y: number } {
  return {
    x: ((event.clientX - p.area.left) / p.area.width) * 100,
    y: ((event.clientY - p.area.top) / p.area.height) * 100,
  };
}

function onPointerUp(event: PointerEvent): void {
  stopPray();
  if (pieceDrag && event.pointerId === pieceDrag.pointer) {
    const current = pieceDrag;
    pieceDrag = null;
    current.el.classList.remove("lifted");
    if (!current.moved) return;
    const trash = document.querySelector("#trash")?.getBoundingClientRect();
    const inTrash = trash && event.clientX >= trash.left && event.clientX <= trash.right && event.clientY >= trash.top && event.clientY <= trash.bottom;
    const { x, y } = piecePos(current, event);
    state.sand = inTrash ? removePiece(state.sand, current.id) : movePiece(state.sand, current.id, x, y);
    draw();
    return;
  }
  if (!drag || event.pointerId !== drag.pointer) return;
  const current = drag;
  drag = null;
  current.ghost?.remove();
  current.el.classList.remove("lifting");
  if (!current.moved) return;
  suppressClick = true;
  window.setTimeout(() => {
    suppressClick = false;
  }, 0);
  document.body.classList.add("hitting");
  const hit = document.elementFromPoint(event.clientX, event.clientY);
  document.body.classList.remove("hitting");
  const zone = hit?.closest<HTMLElement>("[data-zone]");
  if (zone?.dataset.zone) dropOn(current.id, zone.dataset.zone);
}

function bindHold(el: HTMLElement, action: () => void): void {
  let timer = 0;
  const start = (event: PointerEvent) => {
    event.preventDefault();
    window.clearTimeout(timer);
    timer = window.setTimeout(action, 2000);
  };
  const stop = () => window.clearTimeout(timer);
  el.addEventListener("pointerdown", start);
  el.addEventListener("pointerup", stop);
  el.addEventListener("pointerleave", stop);
  el.addEventListener("pointercancel", stop);
}

function askStartOver(): void {
  if (document.querySelector("#confirm")) return;
  const box = document.createElement("div");
  box.id = "confirm";
  box.className = "confirm";
  box.innerHTML = `
    <div class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <p class="prompt" id="confirm-title">Start over?</p>
      <p class="hint">This erases all progress on this screen and goes back to the beginning.</p>
      <div class="confirm-row">
        <button type="button" class="go quiet" data-act="new-no">Keep going</button>
        <button type="button" class="go" data-act="new-yes">Yes, start over</button>
      </div>
    </div>`;
  document.body.appendChild(box);
}

function closeStartOver(): void {
  document.querySelector("#confirm")?.remove();
}

let zoom = 1;
function setZoom(z: number): void {
  zoom = Math.round(Math.min(1.8, Math.max(0.5, z)) * 10) / 10;
  app!.style.setProperty("--z", String(zoom));
  document.documentElement.style.setProperty("--z", String(zoom));
  fitBoards();
  const label = document.querySelector<HTMLElement>("#zoom-level");
  if (label) label.textContent = `${Math.round(zoom * 100)}%`;
  try {
    localStorage.setItem("tvc-zoom", String(zoom));
  } catch {
    /* ignore */
  }
}
try {
  const savedZoom = Number(localStorage.getItem("tvc-zoom"));
  setZoom(Number.isFinite(savedZoom) && savedZoom > 0 ? savedZoom : 1);
} catch {
  setZoom(1);
}

document.addEventListener("click", onClick);
document.addEventListener("pointerdown", onPointerDown);
document.addEventListener("pointermove", onPointerMove);
document.addEventListener("pointerup", onPointerUp);
document.addEventListener("pointercancel", onPointerUp);
document.addEventListener("contextmenu", (event) => event.preventDefault());

const hold = document.querySelector<HTMLElement>("#hold");
const reset = document.querySelector<HTMLElement>("#reset");
if (hold) bindHold(hold, skipLock);
if (reset) bindHold(reset, resetAll);

draw();
