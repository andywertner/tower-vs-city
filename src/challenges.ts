import { ICONS, brickIcon, creatureIcon, crossIcon } from "./art";
import { PICS } from "./pics";
import type { Band, CreatureId } from "./state";

export interface Item {
  id: string;
  art: string;
  label: string;
  bin: string;
  unsuitable?: boolean;
}

export interface Zone {
  id: string;
  art: string;
  label: string;
  bin: string;
}

export interface Choice {
  id: string;
  art?: string;
  label: string;
  ok: boolean;
  wrong?: string;
}

export interface Scene {
  art: string;
  caption: string;
  answer: "tower" | "city";
}

export interface Quote {
  text: string;
  cite: string;
}

export interface Person {
  id: string;
  name: string;
  color: string;
  shape: string;
}

export interface Family {
  id: string;
  name: string;
  home: string;
  color: string;
}

export type Board = "bins" | "book" | "rings" | "wall";

export type Step =
  | { kind: "card"; art: string; lines: string[]; quote?: Quote; button: string }
  | { kind: "choose"; prompt: string; success?: string; words?: boolean; art?: string; options: Choice[] }
  | { kind: "place"; prompt: string; success?: string; board: Board; pile?: boolean; items: Item[]; zones: Zone[]; families?: Family[]; tint?: boolean }
  | { kind: "deliver"; prompt: string; success: string; people: Person[]; order: string[]; word: string; marker: "color" | "shape" | "name" }
  | { kind: "scenes"; prompt: string; success?: string; scenes: Scene[] }
  | { kind: "king"; prompt: string; success: string; bricks: string[] }
  | { kind: "hold"; prompt: string; button: string; success: string }
  | { kind: "inspect"; prompt: string; success: string; families: Family[]; tint: boolean };

export interface Level {
  steps: Step[];
  reward: boolean;
}

export const LEVEL_COUNT = 12;

export const PLACE_HINT = "Tap a card, then tap where it goes. You can also drag it.";

function item(id: string, art: string, label: string, bin: string, unsuitable = false): Item {
  return { id, art, label, bin, unsuitable };
}

export function creatureName(id: CreatureId): string {
  const names: Record<CreatureId, string> = {
    baby: "Baby Shark",
    daddy: "Daddy Shark",
    mommy: "Mommy Shark",
    grandma: "Grandma Shark",
    grandpa: "Grandpa Shark",
    fox: "Fox",
    owl: "Owl",
    turtle: "Turtle",
  };
  return names[id];
}

export function creatureLine(id: CreatureId): string {
  if (id === "baby") return "Baby Shark is your builder. Tap Go, or pick someone else.";
  return `${creatureName(id)} is your builder. Tap Go to start.`;
}

export function choiceLine(fallen: boolean, rubble: number): string {
  if (fallen && rubble > 0) return "Your tower fell. Use its bricks to build the city.";
  if (fallen) return "Your tower already fell. Keep building the city.";
  return "Add a quick brick to your tower, or stay and build the city.";
}

export function choiceLabels(fallen: boolean, rubble: number): { tower: string; city: string; towerTime: string; cityTime: string } {
  return {
    tower: "Add a brick",
    city: fallen && rubble > 0 ? "Build from the ruins" : "Build the city",
    towerTime: "5 seconds",
    cityTime: "25 seconds",
  };
}

export function stackLine(bricks: number): string {
  if (bricks >= 3) return "Adding a brick... it's leaning!";
  return "Adding a brick to your tower.";
}

export function cityLine(): string {
  return "Your city is being built. Read this while you wait.";
}

export function fallLine(id: CreatureId): string {
  if (id === "baby") return "Baby Shark fell off! The bricks are on the ground now, ready for the city.";
  return "The tower fell! The bricks are on the ground now, ready for the city.";
}

export function leanLine(): string {
  return "Careful, your tower is leaning.";
}

export function ringLine(label: string, tooCentral: boolean): string {
  if (tooCentral) return `${label} is important, but is it the foundation? Try a ring farther out.`;
  return `${label} matters more than that. Try a ring closer to the center.`;
}

const MH = "Magnifica Humanitas";

const QUOTES: Quote[] = [
  {
    text: "Humanity… is today facing a pivotal choice: either to construct a new Tower of Babel or to build the city in which God and humanity dwell together.",
    cite: `${MH} ¶1`,
  },
  {
    text: "…the city is reborn, not through the initiative of one man, but through the shared responsibility of all.",
    cite: `${MH} ¶8`,
  },
  {
    text: "It is an undertaking with God at the center, which rebuilds relationships before rebuilding with stones.",
    cite: `${MH} ¶8`,
  },
  {
    text: "Technology has the power to heal, connect, educate and protect our common home; but it can also divide, exclude and generate new forms of injustice.",
    cite: `${MH} ¶9`,
  },
  {
    text: "…no one is so weak that they cannot play their part.",
    cite: `${MH} ¶13`,
  },
  {
    text: "True progress always stems from a heart open to others, an intelligence willing to listen and a will that seeks what unites rather than what separates.",
    cite: `${MH} ¶15`,
  },
  {
    text: "…the grandeur of humanity bestowed upon us and revealed in its fullness in Christ, the splendor of which no machine can ever replace.",
    cite: `${MH} ¶15`,
  },
  {
    text: "Let us not be afraid to get our hands dirty on the “construction site” of our time.",
    cite: `${MH} ¶16`,
  },
  {
    text: "…the task that stands before us is that of being builders of communion, rather than architects of Babel.",
    cite: `${MH} ¶16`,
  },
  {
    text: "…a small light continues to shine within humanity, one that can be rekindled, with God’s grace, along paths of conversion and reconciliation.",
    cite: `${MH} ¶121`,
  },
];

export function quoteFor(index: number): Quote {
  return QUOTES[index % QUOTES.length];
}

export const SANDBOX_TITLE = "What are we building?";
export const SANDBOX_CITE = `${MH} ¶90`;
export const SANDBOX_HINT = "Free play. There is nothing to finish and no right answer. Stack a tower, knock it down, build a town from the pieces, or make something silly. Drag anything to move it.";

export function levels(band: Band, creature: CreatureId): Level[] {
  return [
    intro(creature),
    sortScreens(band),
    pickWord(band),
    deliver(band),
    finishName(band),
    wonders(band),
    king(),
    rings(band),
    scenes(band),
    cover(band),
    nehemiah(band),
    bridge(),
  ];
}

function intro(creature: CreatureId): Level {
  const sharks = `<div class="card-art-row">${ICONS.blocks}${creatureIcon("baby")}</div>`;
  const family = `<div class="card-art-row">${creatureIcon("daddy")}${creatureIcon("mommy")}${creatureIcon("grandma")}${creatureIcon("grandpa")}</div>`;
  return {
    reward: false,
    steps: [
      {
        kind: "card",
        art: sharks,
        lines: [
          "Remember Baby Shark? He wanted the tallest tower, so he climbed up alone and fell off.",
        ],
        button: "Next",
      },
      {
        kind: "card",
        art: family,
        lines: ["Then his family built a city together, so everyone had a place to live."],
        button: "Next",
      },
      {
        kind: "card",
        art: `<div class="card-art-row">${ICONS.mitre}${PICS.envelope}${PICS.bookCover}</div>`,
        lines: [
          "In 2026, Pope Leo wrote an encyclical called Magnifica Humanitas.",
          "An encyclical is a letter from the Pope that is sent around to the whole Church.",
          "This one is about how we use technology, like phones, games, and AI.",
        ],
        button: "Next",
      },
      {
        kind: "card",
        art: `<div class="card-art-row">${brickIcon()}${crossIcon()}</div>`,
        lines: [
          "Pope Leo says every use of technology builds one of two things: a tower, or a city.",
          creature === "baby" ? "Baby Shark's tower and his family's city are the same choice." : "The block tower and the family's city are the same choice.",
        ],
        quote: QUOTES[0],
        button: "Next",
      },
      {
        kind: "card",
        art: `<div class="card-art-row">${ICONS.blocks}${creatureIcon(creature)}${crossIcon()}</div>`,
        lines: [
          "Now you will do a series of exercises inspired by Pope Leo's letter.",
          "After each one, you choose: add a quick brick to your tower, or stay and build the city.",
        ],
        button: "Let's play",
      },
    ],
  };
}

const TOWER_BIN: Zone = { id: "tower", bin: "tower", art: brickIcon(), label: "Tower (just me)" };
const CITY_BIN: Zone = { id: "city", bin: "city", art: crossIcon(), label: "City (together)" };

function sortScreens(band: Band): Level {
  const items = [
    item("score", PICS.leaderboard, "A high score with only your name", "tower"),
    item("skin", PICS.skin, "Buying a skin just to show off", "tower"),
    item("party", PICS.groupChat, "A group chat planning a party", "city"),
    item("draw", PICS.sharedDrawing, "A drawing two friends make together", "city"),
  ];
  if (band !== "34") {
    items.push(
      item("brag", PICS.bragVideo, "A “watch me” bragging video", "tower"),
      item("teach", PICS.tutorial, "A how-to video that teaches a friend", "city"),
      item("team", PICS.team, "A game where teammates help each other", "city"),
    );
  }
  if (band === "78") {
    items.push(
      item("bot", PICS.bot, "A bot built to win every argument", "tower"),
      item("search", PICS.search, "Searching to help a classmate find a source", "city"),
    );
  }
  return {
    reward: true,
    steps: [
      {
        kind: "place",
        board: "bins",
        pile: true,
        prompt: "Sort these ways people use screens: does each one build a tower or a city?",
        success: "The screen is the same. What you build with it is different.",
        items,
        zones: [TOWER_BIN, CITY_BIN],
      },
    ],
  };
}

function pickWord(band: Band): Level {
  const opts: Record<string, Choice> = {
    encyclopedia: { id: "encyclopedia", label: "encyclopedia", ok: false, wrong: "An encyclopedia is a big book of facts. Try again." },
    bicycle: { id: "bicycle", label: "bicycle", ok: false, wrong: "A bicycle has two wheels. Try again." },
    encyclical: { id: "encyclical", label: "encyclical", ok: true },
    cyclone: { id: "cyclone", label: "cyclone", ok: false, wrong: "A cyclone is a giant storm. Try again." },
    cyclical: { id: "cyclical", label: "cyclical", ok: false, wrong: "Cyclical means something that keeps repeating. Try again." },
    epistolary: { id: "epistolary", label: "epistolary", ok: false, wrong: "Epistolary means written as letters, but it is not the name of a letter. Try again." },
  };
  const order = band === "78"
    ? ["cyclical", "encyclopedia", "epistolary", "encyclical", "bicycle", "cyclone"]
    : ["encyclopedia", "bicycle", "encyclical", "cyclone"];
  return {
    reward: true,
    steps: [
      {
        kind: "choose",
        words: true,
        art: PICS.envelope,
        prompt: "Which word means a letter sent around to everyone?",
        success: "Encyclical! Now it's your turn to send one around.",
        options: order.map((id) => opts[id]),
      },
    ],
  };
}

const PEOPLE: Person[] = [
  { id: "p0", name: "Ana", color: "#c4553a", shape: "●" },
  { id: "p1", name: "Ben", color: "#1f4e79", shape: "■" },
  { id: "p2", name: "Cruz", color: "#2f6d4f", shape: "▲" },
  { id: "p3", name: "Dev", color: "#e0a106", shape: "★" },
  { id: "p4", name: "Eli", color: "#6b3fa0", shape: "♥" },
  { id: "p5", name: "Fay", color: "#e07a5f", shape: "◆" },
  { id: "p6", name: "Gus", color: "#3f88b5", shape: "☾" },
  { id: "p7", name: "Hana", color: "#8b5a2b", shape: "✚" },
  { id: "p8", name: "Ivo", color: "#81b29a", shape: "⬢" },
  { id: "p9", name: "Jade", color: "#d9719a", shape: "✿" },
];

function deliver(band: Band): Level {
  const marker = band === "34" ? "color" : band === "56" ? "shape" : "name";
  const prompt =
    marker === "color"
      ? "Deliver each letter to the person with the same color."
      : marker === "shape"
        ? "Deliver each letter to the person with the same shape."
        : "Deliver each letter to the person whose name is on it.";
  return {
    reward: true,
    steps: [
      {
        kind: "deliver",
        prompt,
        success: "You sent one letter around to everyone. That is an encyclical.",
        people: PEOPLE,
        order: ["p3", "p7", "p0", "p5", "p9", "p2", "p8", "p1", "p6", "p4"],
        word: "ENCYCLICAL",
        marker,
      },
    ],
  };
}

function finishName(band: Band): Level {
  const words = [
    item("magnifica", "", "Magnifica", "mag"),
    item("humanitas", "", "Humanitas", "hum"),
    item("magnificent", "", "Magnificent", "nope", true),
    item("humanities", "", "Humanities", "nope", true),
    item("humidity", "", "Humidity", "nope", true),
  ];
  if (band !== "34") words.push(item("magnifico", "", "Magnifico", "nope", true));
  if (band === "78") {
    words.push(
      item("humanoid", "", "Humanoid", "nope", true),
      item("manifesta", "", "Manifesta", "nope", true),
      item("totalus", "", "Magnificus Totalus", "nope", true),
    );
  }
  return {
    reward: true,
    steps: [
      {
        kind: "place",
        board: "book",
        prompt: "Pope Leo's letter has a two-word Latin name. Put the right words in the spaces.",
        success: "Magnifica Humanitas: wonderful humanity.",
        items: shuffle(words, [3, 0, 5, 1, 7, 2, 8, 4, 6]),
        zones: [
          { id: "slotm", bin: "mag", art: "", label: "Word 1 (means wonderful)" },
          { id: "sloth", bin: "hum", art: "", label: "Word 2 (means people)" },
        ],
      },
    ],
  };
}

function wonders(band: Band): Level {
  const pics = [
    item("sunrise", ICONS.sunrise, "Sunrise", "mag"),
    item("mountain", PICS.mountain, "Mountain", "mag"),
    item("rainbow", PICS.rainbow, "Rainbow", "mag"),
    item("face", ICONS.face, "A face", "hum"),
    item("family", ICONS.family, "A family", "hum"),
    item("kids", ICONS.kids, "Kids", "hum"),
  ];
  if (band !== "34") pics.push(item("wave", PICS.wave, "Ocean wave", "mag"), item("grandparent", PICS.grandparent, "A grandparent", "hum"));
  if (band === "78") pics.push(item("galaxy", PICS.galaxy, "Galaxy", "mag"), item("helping", PICS.helping, "Helping someone up", "hum"));
  return {
    reward: true,
    steps: [
      {
        kind: "place",
        board: "bins",
        pile: true,
        prompt: "Sort the pictures: wonders of creation go in Magnifica, and people go in Humanitas.",
        success: "Creation is wonderful, and so are the people in it.",
        items: shuffle(pics, [0, 3, 1, 4, 6, 2, 5, 7, 8, 9]),
        zones: [
          { id: "mag", bin: "mag", art: ICONS.spark, label: "Magnifica (wonderful)" },
          { id: "hum", bin: "hum", art: ICONS.peopleMark, label: "Humanitas (people)" },
        ],
      },
    ],
  };
}

function king(): Level {
  return {
    reward: true,
    steps: [
      {
        kind: "king",
        prompt: "Everyone wants to be on top. Tap each brick to send it up the tower.",
        success: "Only one fits on top. Everyone else gets knocked off.",
        bricks: ["#c4553a", "#1f4e79", "#2f6d4f", "#e0a106", "#6b3fa0"],
      },
    ],
  };
}

function rings(band: Band): Level {
  const items = [
    item("god", PICS.god, "God", "r0"),
    item("love", PICS.love, "Love", "r1"),
    item("family", ICONS.family, "Family", "r1"),
    item("friendship", PICS.friendship, "Friendship", "r1"),
    item("school", PICS.school, "Schools", "r2"),
    item("hospital", PICS.hospital, "Hospitals", "r2"),
    item("road", PICS.road, "Roads", "r2"),
  ];
  if (band !== "34") {
    items.push(
      item("trust", PICS.trust, "Trust", "r1"),
      item("service", PICS.helping, "Service", "r1"),
      item("laws", PICS.laws, "Laws", "r2"),
      item("technology", PICS.technology, "Technology", "r2"),
    );
  }
  if (band === "78") {
    items.push(
      item("justice", PICS.justice, "Justice", "r1"),
      item("responsibility", PICS.responsibility, "Responsibility", "r1"),
      item("government", PICS.townhall, "Government", "r2"),
      item("buildings", PICS.buildings, "Buildings", "r2"),
    );
  }
  return {
    reward: true,
    steps: [
      {
        kind: "card",
        art: `<div class="card-art-row">${PICS.god}</div>`,
        lines: [
          "Pope Leo says a real city does not start with buildings.",
          "It starts with God. He is the foundation, and everything else rests on him.",
        ],
        quote: {
          text: "Building a city founded on the common good implies, first and foremost, building on a firm relationship with God.",
          cite: `${MH} ¶11`,
        },
        button: "Next",
      },
      {
        kind: "card",
        art: `<div class="card-art-row">${ICONS.family}${PICS.school}${PICS.hospital}</div>`,
        lines: [
          "Next come people: love, family, friendship, trust, justice, service, and responsibility.",
          "Schools, laws, hospitals, roads, and technology come last. They matter, but people shape them.",
        ],
        quote: {
          text: "It is an undertaking with God at the center, which rebuilds relationships before rebuilding with stones.",
          cite: `${MH} ¶8`,
        },
        button: "Sort them",
      },
      {
        kind: "place",
        board: "rings",
        pile: true,
        prompt: "What matters most? Put the foundation in the center, and build outward from there.",
        success: "God is the foundation. He supports people, and people shape the city.",
        items: shuffle(items, [4, 1, 6, 0, 8, 2, 10, 5, 12, 3, 14, 7, 9, 11, 13]),
        zones: [
          { id: "r0", bin: "r0", art: "", label: "Foundation" },
          { id: "r1", bin: "r1", art: "", label: "People" },
          { id: "r2", bin: "r2", art: "", label: "City" },
        ],
      },
    ],
  };
}

function scene(art: string, caption: string, answer: "tower" | "city"): Scene {
  return { art, caption, answer };
}

function scenes(band: Band): Level {
  const list = [
    scene(PICS.leaderboard, "Only the top player's name shows on the leaderboard.", "tower"),
    scene(PICS.gameTurns, "An online game where everyone gets a turn.", "city"),
    scene(ICONS.phone, "Posting just to get likes.", "tower"),
    scene(ICONS.photo, "Sending a photo to Grandma.", "city"),
    scene(PICS.poll, "A group-chat poll ranking who is best in class.", "tower"),
    scene(ICONS.story, "The class writes one story together in a shared doc.", "city"),
    scene(PICS.chatSpam, "Spamming the chat so everyone sees your name.", "tower"),
    scene(PICS.townApp, "Neighbors sharing tools through a town app.", "city"),
    scene(PICS.videoCall, "A video call so Grandpa can watch the game.", "city"),
    scene(PICS.filter, "A filter that makes you look like nobody else.", "tower"),
    scene(PICS.mcTower, "Building the tallest tower in Minecraft so everyone knows it's yours.", "tower"),
    scene(PICS.mcVillage, "Building a Minecraft village with friends.", "city"),
  ];
  if (band === "78") {
    list.push(
      scene(ICONS.robotPage, "The computer writes your whole paper.", "tower"),
      scene(ICONS.kidWrite, "The computer helps you start, and you write the rest.", "city"),
    );
  }
  return {
    reward: true,
    steps: [
      {
        kind: "scenes",
        prompt: "Is this a tower or a city? Tap your answer.",
        success: "Same phone, same game, same computer. The difference is what you build with it.",
        scenes: list,
      },
    ],
  };
}

function cover(band: Band): Level {
  const items = [
    item("leo", ICONS.mitre, "Pope Leo", "who"),
    item("francis", ICONS.mitre, "Pope Francis", "nope", true),
    item("title", "", "Magnifica Humanitas", "title"),
    item("laudato", "", "Laudato Si'", "nope", true),
    item("tweet", ICONS.bird, "A tweet", "nope", true),
  ];
  const zones: Zone[] = [
    { id: "who", bin: "who", art: "", label: "Who wrote it?" },
    { id: "title", bin: "title", art: "", label: "What is it called?" },
  ];
  if (band !== "34") {
    items.push(
      item("may", ICONS.may, "May 15, 2026", "date"),
      item("old", ICONS.may, "May 15, 1891", "nope", true),
      item("rerum", "", "Rerum Novarum", "nope", true),
    );
    zones.push({ id: "date", bin: "date", art: "", label: "When was it sent?" });
  }
  if (band === "78") {
    items.push(
      item("kind", ICONS.around, "A letter to the whole Church", "kind"),
      item("score", ICONS.ranks, "A scoreboard", "nope", true),
    );
    zones.push({ id: "kind", bin: "kind", art: "", label: "What kind of writing is it?" });
  }
  return {
    reward: true,
    steps: [
      {
        kind: "place",
        board: "book",
        prompt: "Finish the cover of Pope Leo's letter: put each card on the right line.",
        success: "Magnifica Humanitas, by Pope Leo: an encyclical for everyone.",
        items: shuffle(items, [2, 0, 4, 5, 1, 3, 9, 6, 8, 7]),
        zones,
      },
    ],
  };
}

const FAMILIES: Family[] = [
  { id: "priests", name: "The priests", home: "Priests' homes", color: "#e0a106" },
  { id: "jericho", name: "The men of Jericho", home: "Road to Jericho", color: "#2f6d4f" },
  { id: "goldsmiths", name: "The goldsmiths", home: "Goldsmiths' shops", color: "#c4553a" },
  { id: "shallum", name: "Shallum and his daughters", home: "Shallum's house", color: "#6b3fa0" },
  { id: "perfumers", name: "The perfume makers", home: "Perfume shops", color: "#d9719a" },
  { id: "merchants", name: "The merchants", home: "Market stalls", color: "#3f88b5" },
  { id: "levites", name: "The Levites", home: "Levites' homes", color: "#8b5a2b" },
  { id: "tekoa", name: "The people of Tekoa", home: "Road to Tekoa", color: "#81b29a" },
];

function nehemiah(band: Band): Level {
  const count = band === "34" ? 4 : band === "56" ? 6 : 8;
  const families = FAMILIES.slice(0, count);
  const tint = band !== "78";
  const steps: Step[] = [
    {
      kind: "card",
      art: `<div class="card-art-row">${PICS.nehemiah}${PICS.temple}</div>`,
      lines: [
        "Who was Nehemiah? About 2,500 years ago, he worked for the king of Persia, far from home.",
        "Jerusalem, his people's city, lay in ruins: the walls had fallen and the gates were burned.",
        "When he heard the news, he fasted, prayed, and asked the king to let him go home and rebuild.",
      ],
      button: "Next",
    },
    {
      kind: "card",
      art: `<div class="card-art-row">${ICONS.houses}${PICS.nehemiah}${ICONS.houses}</div>`,
      lines: [
        "Pope Leo picks Nehemiah as a guide for our time.",
        "Nehemiah did not build the wall alone, and he did not boss everyone around.",
        "Each family rebuilt the part of the wall next to their own home, and the whole wall rose together.",
      ],
      quote: {
        text: "He did not impose solutions from above. He convened the families, assigned each of them a section of the wall to rebuild, listened to their concerns, coordinated their efforts and addressed any opposition.",
        cite: `${MH} ¶8`,
      },
      button: "Now you are Nehemiah",
    },
    {
      kind: "hold",
      prompt: "You are Nehemiah. Jerusalem's walls are broken. Before you build, pray. Press and hold the button.",
      button: "Hold to pray",
      success: "Nehemiah prayed before he built anything.",
    },
    {
      kind: "inspect",
      prompt: "Walk around the walls. Tap each broken part to see who lives next to it.",
      success: "You looked at every broken part before giving any orders.",
      families,
      tint,
    },
    {
      kind: "choose",
      art: PICS.nehemiah,
      prompt: "How will you get the whole wall rebuilt?",
      success: "The families came together to hear the plan.",
      options: [
        {
          id: "command",
          art: ICONS.megaphone,
          label: "Shout “Everyone, build it my way!”",
          ok: false,
          wrong: "Everyone rushed to one spot and piled up a tower. The rest of the wall is still broken. Try again.",
        },
        { id: "families", art: ICONS.houses, label: "Call the families together", ok: true },
      ],
    },
    {
      kind: "place",
      board: "wall",
      pile: false,
      tint,
      families,
      prompt: "Give each family the part of the wall closest to their own home.",
      success: "Every family rebuilt the part by their own home, all at the same time. (Nehemiah 3)",
      items: shuffle(
        families.map((f) => item(f.id, "", f.name, f.id)),
        [2, 0, 3, 1, 5, 7, 4, 6],
      ),
      zones: families.map((f) => ({ id: `wall-${f.id}`, bin: f.id, art: "", label: f.home })),
    },
  ];
  if (band !== "34") {
    steps.push({
      kind: "choose",
      art: PICS.nehemiah,
      prompt: "The goldsmiths say: “We ran out of tools!” What do you do?",
      success: "The families helped each other, and the work kept going.",
      options: [
        { id: "yell", label: "Yell at them to work faster", ok: false, wrong: "They got upset and stopped working. Try again." },
        { id: "share", label: "Ask the priests next door to share their tools", ok: true },
        { id: "alone", label: "Do their part of the wall yourself", ok: false, wrong: "You can't build the whole wall by yourself. Try again." },
      ],
    });
  }
  if (band === "78") {
    steps.push({
      kind: "choose",
      art: PICS.nehemiah,
      prompt: "Enemies outside the city laugh and threaten the builders. What do you do?",
      success: "Half built and half stood guard, and the wall was finished. (Nehemiah 4:16)",
      options: [
        { id: "hide", label: "Stop building and hide", ok: false, wrong: "Then the wall never gets finished. Try again." },
        { id: "tower", label: "Build a tower taller than their army", ok: false, wrong: "That is Babel again. Try again." },
        { id: "guard", label: "Half the people build while half stand guard", ok: true },
      ],
    });
  }
  return { reward: true, steps };
}

function bridge(): Level {
  return {
    reward: false,
    steps: [
      {
        kind: "card",
        art: `<div class="card-art-row">${ICONS.blocks}</div>`,
        lines: ["Everyone starts building a tower sometimes. Pope Leo says those towers are headed for ruin."],
        quote: { text: "We are to be servants of the coming Kingdom, instead of lords of towers destined for ruin.", cite: `${MH} ¶16` },
        button: "Next",
      },
      {
        kind: "card",
        art: `<div class="card-art-row">${PICS.nehemiah}${PICS.temple}</div>`,
        lines: [
          "Jerusalem was in ruins too, and the people rebuilt it together.",
          "When you notice you are building a tower, you can turn around and help build the city.",
        ],
        quote: {
          text: "…the ruins of Jerusalem, which under Nehemiah’s direction are rebuilt piece by piece as a project of shared responsibility.",
          cite: `${MH} ¶90`,
        },
        button: "Start building",
      },
    ],
  };
}

function shuffle<T>(list: T[], order: number[]): T[] {
  const seen = new Set<number>();
  const out: T[] = [];
  for (const i of order) {
    if (i < list.length && !seen.has(i)) {
      out.push(list[i]);
      seen.add(i);
    }
  }
  list.forEach((x, i) => {
    if (!seen.has(i)) out.push(x);
  });
  return out;
}

export const CREATURES: CreatureId[] = ["baby", "daddy", "mommy", "grandma", "grandpa", "fox", "owl", "turtle"];

export function creatureCard(id: CreatureId): string {
  return creatureIcon(id);
}
