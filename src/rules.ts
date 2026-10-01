/** Streak rules: lean at 3 towers in a row, fall at 4, any city anchors the streak. */

export interface Build {
  streak: number;
  city: number;
  collapses: number;
  anchored: number;
  cityChoices: number;
  towerChoices: number;
  /** Bricks lying on the ground after a fall, waiting to be built into the city. */
  rubble: number;
}

export type Ending = "full" | "joined" | "fell" | "rebuilt";

export function emptyBuild(): Build {
  return {
    streak: 0,
    city: 0,
    collapses: 0,
    anchored: 0,
    cityChoices: 0,
    towerChoices: 0,
    rubble: 0,
  };
}

/** After a fall the tower is gone for good; only the city can be built. */
export function canStack(b: Build): boolean {
  return b.collapses === 0;
}

export interface ChoiceResult extends Build {
  fell: boolean;
}

export function afterTower(b: Build): ChoiceResult {
  const streak = b.streak + 1;
  const towerChoices = b.towerChoices + 1;
  if (streak >= 4) {
    return {
      ...b,
      streak: 0,
      towerChoices,
      collapses: b.collapses + 1,
      rubble: b.rubble + streak,
      fell: true,
    };
  }
  return { ...b, streak, towerChoices, fell: false };
}

export function afterCity(b: Build): ChoiceResult {
  return {
    streak: 0,
    city: Math.min(8, b.city + 1),
    collapses: b.collapses,
    anchored: b.anchored + b.streak + b.rubble,
    cityChoices: b.cityChoices + 1,
    towerChoices: b.towerChoices,
    rubble: 0,
    fell: false,
  };
}

export function endingOf(b: Build): Ending {
  if (b.collapses > 0) return b.rubble > 0 ? "fell" : "rebuilt";
  if (b.cityChoices >= 8) return "full";
  return "joined";
}
