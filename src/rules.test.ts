import assert from "node:assert/strict";
import { afterCity, afterTower, canStack, emptyBuild, endingOf, type Build } from "./rules.ts";
import { timing } from "./timing.ts";
import { addBrick, fallChance, MAX_HEIGHT, scatter, startSand, sway } from "./sandbox.ts";
import { emptySand } from "./state.ts";
import { LEVEL_COUNT, levels } from "./challenges.ts";

function choose(b: Build, kind: "tower" | "city"): Build {
  const r = kind === "tower" ? afterTower(b) : afterCity(b);
  return {
    streak: r.streak,
    city: r.city,
    collapses: r.collapses,
    anchored: r.anchored,
    cityChoices: r.cityChoices,
    towerChoices: r.towerChoices,
    rubble: r.rubble,
  };
}

function run(path: Array<"tower" | "city">): Build {
  return path.reduce(choose, emptyBuild());
}

const three = run(["tower", "tower", "tower"]);
assert.equal(three.streak, 3);
assert.equal(three.collapses, 0);
assert.equal(afterTower(three).fell, true);

const fell = run(["tower", "tower", "tower", "tower"]);
assert.equal(fell.streak, 0);
assert.equal(fell.collapses, 1);
assert.equal(fell.towerChoices, 4);
assert.equal(fell.rubble, 4);
assert.equal(canStack(fell), false);
assert.equal(endingOf(fell), "fell");

const rebuilt = choose(fell, "city");
assert.equal(rebuilt.rubble, 0);
assert.equal(rebuilt.anchored, 4);
assert.equal(rebuilt.city, 1);
assert.equal(endingOf(rebuilt), "rebuilt");

const saved = run(["tower", "tower", "tower", "city"]);
assert.equal(saved.streak, 0);
assert.equal(saved.collapses, 0);
assert.equal(saved.anchored, 3);
assert.equal(saved.city, 1);

assert.equal(canStack(three), true);
assert.equal(canStack(saved), true);

const eightCities = run(Array.from({ length: 8 }, () => "city" as const));
assert.equal(eightCities.city, 8);
assert.equal(eightCities.collapses, 0);
assert.equal(eightCities.streak, 0);
assert.equal(endingOf(eightCities), "full");

const mix = run(["tower", "tower", "city", "tower", "city", "tower", "tower", "city"]);
assert.equal(mix.collapses, 0);
assert.equal(endingOf(mix), "joined");
assert.equal(mix.anchored, 2 + 1 + 2);

const live = timing(false);
assert.equal(live.tower, 5000);
assert.equal(live.city, 25000);

const preview = timing(true);
assert.ok(preview.city < 2000);
assert.ok(preview.tower < 1000);

assert.equal(fallChance(6), 0);
assert.ok(fallChance(8) > 0 && fallChance(8) < 1);
assert.equal(fallChance(MAX_HEIGHT), 1);
assert.ok(sway(12) > sway(4));

let sand = emptySand();
for (let i = 0; i < 6; i++) {
  const r = addBrick(sand, 0);
  assert.equal(r.fell, false);
  sand = r.sand;
}
assert.equal(sand.stack, 6);
const tipping = addBrick({ ...sand, stack: MAX_HEIGHT - 1 }, 0.999);
assert.equal(tipping.fell, true);
const scattered = scatter(tipping.sand, () => 0.5);
assert.equal(scattered.stack, 0);
assert.equal(scattered.pieces.filter((p) => p.kind === "brick").length, MAX_HEIGHT);
assert.equal(new Set(scattered.pieces.map((p) => p.id)).size, scattered.pieces.length);

const started = startSand(emptySand(), 4, () => 0.3);
assert.equal(started.pieces.filter((p) => p.kind === "brick").length, 4);
assert.equal(started.pieces.filter((p) => p.kind === "family").length, 1);
assert.equal(startSand(started, 4, () => 0.3), started);

const lvls = levels("78", "baby");
assert.equal(lvls.length, LEVEL_COUNT);
assert.equal(lvls[0].reward, false);
assert.equal(lvls[LEVEL_COUNT - 1].reward, false);
assert.ok(lvls.slice(1, -1).every((l) => l.reward));
for (const band of ["34", "56", "78"] as const) {
  const deliver = levels(band, "baby")[3].steps[0];
  assert.equal(deliver.kind, "deliver");
  if (deliver.kind === "deliver") assert.equal(deliver.order.length, deliver.word.length);
}

console.log("rules ok");
