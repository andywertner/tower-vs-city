import type { Build } from "./rules";

export type Band = "34" | "56" | "78";
export type CreatureId = "baby" | "daddy" | "mommy" | "grandma" | "grandpa" | "fox" | "owl" | "turtle";
export type Phase = "band" | "creature" | "challenge" | "choice" | "tower" | "city" | "collapse" | "sandbox";

export const LAST_LEVEL = 12;

export interface Placement {
  itemId: string;
  zoneId: string;
}

export interface Piece {
  id: number;
  kind: string;
  x: number;
  y: number;
  r: number;
}

export interface Sandbox {
  pieces: Piece[];
  stack: number;
  next: number;
  falls: number;
}

export interface State {
  band: Band | null;
  creature: CreatureId;
  phase: Phase;
  level: number;
  beat: number;
  streak: number;
  city: number;
  collapses: number;
  anchored: number;
  cityChoices: number;
  towerChoices: number;
  rubble: number;
  selected: string | null;
  placed: Placement[];
  scene: number;
  tops: number;
  marks: string[];
  lesson: string | null;
  lessonWord: string | null;
  verseIndex: number;
  sand: Sandbox;
  flash: string | null;
  bad: string | null;
  reading: boolean;
}

const KEY = "tvc-v2";
const CREATURES = new Set<CreatureId>(["baby", "daddy", "mommy", "grandma", "grandpa", "fox", "owl", "turtle"]);
const PHASES = new Set<Phase>(["band", "creature", "challenge", "choice", "tower", "city", "collapse", "sandbox"]);
const BANDS = new Set<Band>(["34", "56", "78"]);

export function emptySand(): Sandbox {
  return { pieces: [], stack: 0, next: 1, falls: 0 };
}

export function fresh(): State {
  return {
    band: null,
    creature: "baby",
    phase: "band",
    level: 1,
    beat: 0,
    streak: 0,
    city: 0,
    collapses: 0,
    anchored: 0,
    cityChoices: 0,
    towerChoices: 0,
    rubble: 0,
    selected: null,
    placed: [],
    scene: 0,
    tops: 0,
    marks: [],
    lesson: null,
    lessonWord: null,
    verseIndex: 0,
    sand: emptySand(),
    flash: null,
    bad: null,
    reading: false,
  };
}

export function toBuild(s: State): Build {
  return {
    streak: s.streak,
    city: s.city,
    collapses: s.collapses,
    anchored: s.anchored,
    cityChoices: s.cityChoices,
    towerChoices: s.towerChoices,
    rubble: s.rubble,
  };
}

export function save(s: State): void {
  try {
    const copy: State = { ...s, flash: null, bad: null, reading: false, selected: null };
    sessionStorage.setItem(KEY, JSON.stringify(copy));
  } catch {
    /* private mode or a full disk should not stop the lesson */
  }
}

export function load(): State {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return fresh();
    const data = JSON.parse(raw) as Partial<State>;
    const next = fresh();
    if (data.band && BANDS.has(data.band)) next.band = data.band;
    if (data.creature && CREATURES.has(data.creature)) next.creature = data.creature;
    if (data.phase && PHASES.has(data.phase)) next.phase = data.phase;
    next.level = clamp(data.level, 1, LAST_LEVEL);
    next.beat = clamp(data.beat, 0, 8);
    next.streak = clamp(data.streak, 0, 4);
    next.city = clamp(data.city, 0, 8);
    next.collapses = clamp(data.collapses, 0, 10);
    next.anchored = clamp(data.anchored, 0, 40);
    next.cityChoices = clamp(data.cityChoices, 0, 12);
    next.towerChoices = clamp(data.towerChoices, 0, 12);
    next.rubble = clamp(data.rubble, 0, 8);
    next.scene = clamp(data.scene, 0, 16);
    next.tops = clamp(data.tops, 0, 6);
    next.verseIndex = clamp(data.verseIndex, 0, 100);
    next.placed = Array.isArray(data.placed) ? data.placed.filter(validPlace) : [];
    next.marks = Array.isArray(data.marks) ? data.marks.filter((x) => typeof x === "string").slice(0, 16) : [];
    next.sand = validSand(data.sand);
    next.lesson = typeof data.lesson === "string" ? data.lesson.slice(0, 300) : null;
    next.lessonWord = typeof data.lessonWord === "string" ? data.lessonWord.slice(0, 20) : null;
    if (next.phase !== "band" && next.phase !== "creature" && !next.band) return fresh();
    if (next.phase === "tower" || next.phase === "city") next.phase = "choice";
    if (next.phase === "collapse") {
      next.rubble += 4;
      next.streak = 0;
      next.collapses += 1;
      next.level = Math.min(LAST_LEVEL, next.level + 1);
      next.beat = 0;
      next.placed = [];
      next.scene = 0;
      next.tops = 0;
      next.marks = [];
      next.phase = "challenge";
    }
    return next;
  } catch {
    return fresh();
  }
}

export function clearSave(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

function clamp(n: unknown, min: number, max: number): number {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.floor(n) : min;
  return Math.min(max, Math.max(min, v));
}

function validPlace(p: unknown): p is Placement {
  if (!p || typeof p !== "object") return false;
  const row = p as Placement;
  return typeof row.itemId === "string" && typeof row.zoneId === "string";
}

function validSand(raw: unknown): Sandbox {
  const out = emptySand();
  if (!raw || typeof raw !== "object") return out;
  const data = raw as Partial<Sandbox>;
  out.stack = clamp(data.stack, 0, 40);
  out.falls = clamp(data.falls, 0, 999);
  if (Array.isArray(data.pieces)) {
    out.pieces = data.pieces
      .filter((p): p is Piece => {
        if (!p || typeof p !== "object") return false;
        const row = p as Piece;
        return typeof row.kind === "string" && [row.id, row.x, row.y, row.r].every((n) => typeof n === "number" && Number.isFinite(n));
      })
      .slice(0, 300);
  }
  out.next = Math.max(clamp(data.next, 1, 1_000_000), ...out.pieces.map((p) => p.id + 1), 1);
  return out;
}
