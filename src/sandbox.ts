import type { Piece, Sandbox } from "./state";

export const SAFE_HEIGHT = 6;
export const MAX_HEIGHT = 16;
export const TOWER_X = 82;
export const PALETTE = ["house", "tree", "light", "church", "well", "family"] as const;

export function fallChance(height: number): number {
  if (height <= SAFE_HEIGHT) return 0;
  if (height >= MAX_HEIGHT) return 1;
  return (height - SAFE_HEIGHT) * 0.12;
}

export function sway(height: number): number {
  return Math.min(14, height * 0.9);
}

export function addBrick(sand: Sandbox, roll: number): { sand: Sandbox; fell: boolean } {
  const height = sand.stack + 1;
  const fell = roll < fallChance(height);
  return { sand: { ...sand, stack: height }, fell };
}

export function scatter(sand: Sandbox, rand: () => number): Sandbox {
  const bricks: Piece[] = Array.from({ length: sand.stack }, (_, i) => ({
    id: sand.next + i,
    kind: "brick",
    x: round(40 + rand() * 54),
    y: round(72 + rand() * 20),
    r: Math.round(rand() * 120 - 60),
  }));
  return { pieces: [...sand.pieces, ...bricks], stack: 0, next: sand.next + bricks.length, falls: sand.falls + 1 };
}

export function addPiece(sand: Sandbox, kind: string, rand: () => number): Sandbox {
  const piece: Piece = { id: sand.next, kind, x: round(8 + rand() * 60), y: round(72 + rand() * 20), r: 0 };
  return { ...sand, pieces: [...sand.pieces, piece], next: sand.next + 1 };
}

export function startSand(sand: Sandbox, rubble: number, rand: () => number): Sandbox {
  if (sand.pieces.length) return sand;
  const withRubble = rubble ? scatter({ ...sand, stack: rubble }, rand) : sand;
  const family: Piece = { id: withRubble.next, kind: "family", x: 30, y: 70, r: 0 };
  return { ...withRubble, falls: 0, pieces: [...withRubble.pieces, family], next: withRubble.next + 1 };
}

/** Moves a piece and brings it to the front, so the last thing you touched is never hidden behind another piece. */
export function movePiece(sand: Sandbox, id: number, x: number, y: number): Sandbox {
  const piece = sand.pieces.find((p) => p.id === id);
  if (!piece) return sand;
  const moved = { ...piece, x: round(clamp(x, 2, 98)), y: round(clamp(y, 4, 96)) };
  return { ...sand, pieces: [...sand.pieces.filter((p) => p.id !== id), moved] };
}

export function removePiece(sand: Sandbox, id: number): Sandbox {
  return { ...sand, pieces: sand.pieces.filter((p) => p.id !== id) };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
