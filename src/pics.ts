import { icon } from "./art";

const INK = "#241e18";
const S = `stroke="${INK}" stroke-width="2"`;

const screen = (inner: string) =>
  icon(`<rect x="8" y="12" width="64" height="44" rx="5" fill="${INK}"/><rect x="12" y="16" width="56" height="36" rx="2" fill="#f6f1e7"/><rect x="34" y="56" width="12" height="7" fill="${INK}"/><rect x="26" y="63" width="28" height="4" rx="2" fill="${INK}"/>${inner}`);

const phone = (inner: string) =>
  icon(`<rect x="22" y="6" width="36" height="68" rx="6" fill="${INK}"/><rect x="25" y="12" width="30" height="54" rx="2" fill="#f6f1e7"/>${inner}`);

const txt = (x: number, y: number, s: string, size = 7, fill = INK) =>
  `<text x="${x}" y="${y}" font-size="${size}" font-weight="700" font-family="Avenir Next, sans-serif" fill="${fill}" text-anchor="middle">${s}</text>`;

const figure = (x: number, y: number, color: string, r = 6) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="#f2cc8f" ${S}/><rect x="${x - r}" y="${y + r + 1}" width="${r * 2}" height="${r * 2.4}" rx="${r * 0.8}" fill="${color}" ${S}/>`;

const building = (roof: string, body: string, extra: string) =>
  icon(`<rect x="14" y="34" width="52" height="34" fill="${body}" ${S}/>${roof}${extra}<rect x="10" y="68" width="60" height="4" fill="${INK}"/>`);

const cube = (x: number, y: number, top: string, side: string) =>
  `<rect x="${x}" y="${y}" width="12" height="12" fill="${side}" ${S}/><rect x="${x}" y="${y}" width="12" height="4" fill="${top}"/>`;

export const PICS = {
  leaderboard: screen(
    `<rect x="16" y="20" width="48" height="9" rx="2" fill="#f0c14d"/>${txt(40, 27, "1 · YOU")}<rect x="16" y="32" width="48" height="7" rx="2" fill="#d9d3c7"/><rect x="16" y="42" width="48" height="7" rx="2" fill="#d9d3c7"/>`,
  ),
  skin: phone(
    `${figure(40, 28, "#f0c14d", 7)}<path d="M50 20 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#e0a106"/><path d="M29 24 l1.5 3 3 1.5 -3 1.5 -1.5 3 -1.5 -3 -3 -1.5 3 -1.5z" fill="#e0a106"/>${txt(40, 62, "$$$", 8, "#2f6d4f")}`,
  ),
  groupChat: phone(
    `<rect x="28" y="16" width="18" height="9" rx="4" fill="#81b29a"/><rect x="34" y="28" width="18" height="9" rx="4" fill="#e07a5f"/><rect x="28" y="40" width="18" height="9" rx="4" fill="#f2cc8f"/><path d="M44 54 q4 -8 8 0 z" fill="#c4553a" ${S}/><path d="M48 54 v8" stroke="${INK}"/>`,
  ),
  sharedDrawing: screen(
    `<path d="M22 44 L32 30 L42 44 Z" fill="none" stroke="#c4553a" stroke-width="3"/><circle cx="52" cy="28" r="6" fill="none" stroke="#e0a106" stroke-width="3"/><path d="M18 48 H62" stroke="#2f6d4f" stroke-width="3"/><circle cx="16" cy="60" r="5" fill="#e07a5f"/><circle cx="64" cy="60" r="5" fill="#81b29a"/>`,
  ),
  team: icon(`${figure(24, 22, "#1f4e79", 8)}${figure(56, 22, "#c4553a", 8)}<path d="M30 40 L40 26 L50 40" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><rect x="26" y="58" width="28" height="12" rx="6" fill="#8a8175" ${S}/><circle cx="33" cy="64" r="2" fill="${INK}"/><circle cx="47" cy="64" r="2" fill="${INK}"/>`),
  bragVideo: screen(`<path d="M22 24 L22 44 L38 34 Z" fill="#c4553a"/>${txt(52, 38, "ME!", 11)}`),
  tutorial: screen(`<path d="M18 22 L18 40 L32 31 Z" fill="#2f6d4f"/>${txt(50, 30, "HOW", 8)}${txt(50, 40, "TO", 8)}${figure(20, 44, "#81b29a", 3)}${figure(60, 44, "#e07a5f", 3)}`),
  bot: icon(`<rect x="16" y="24" width="40" height="32" rx="6" fill="#d9d3c7" ${S}/><path d="M24 34 L32 38 M48 34 L40 38" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="29" cy="42" r="3" fill="${INK}"/><circle cx="43" cy="42" r="3" fill="${INK}"/><path d="M28 50 H44" stroke="${INK}" stroke-width="3"/><path d="M36 24 V16" stroke="${INK}" stroke-width="3"/><circle cx="36" cy="14" r="3" fill="#c4553a"/><rect x="54" y="10" width="20" height="16" rx="4" fill="#fff" ${S}/>${txt(64, 22, "WIN", 7, "#c4553a")}`),
  search: icon(`<circle cx="34" cy="32" r="16" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M46 44 L60 58" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>${figure(28, 28, "#81b29a", 4)}${figure(40, 28, "#e07a5f", 4)}`),
  mountain: icon(`<path d="M6 66 L30 22 L44 44 L54 32 L74 66 Z" fill="#6c8ea4" ${S}/><path d="M30 22 L24 34 L30 32 L36 34 Z" fill="#fff"/><circle cx="62" cy="18" r="6" fill="#f0c14d"/>`),
  wave: icon(`<path d="M6 58 Q20 20 42 30 Q30 34 34 44 Q44 36 56 46 Q66 54 74 50 V70 H6 Z" fill="#3f88b5" ${S}/><path d="M42 30 Q34 36 36 42" fill="none" stroke="#fff" stroke-width="3"/>`),
  rainbow: icon(`<path d="M8 60 A32 32 0 0 1 72 60" fill="none" stroke="#c4553a" stroke-width="6"/><path d="M16 60 A24 24 0 0 1 64 60" fill="none" stroke="#f0c14d" stroke-width="6"/><path d="M24 60 A16 16 0 0 1 56 60" fill="none" stroke="#2f6d4f" stroke-width="6"/><path d="M32 60 A8 8 0 0 1 48 60" fill="none" stroke="#1f4e79" stroke-width="6"/>`),
  galaxy: icon(`<circle cx="40" cy="40" r="30" fill="#1b2340"/><path d="M40 40 m-18 0 a18 8 25 1 0 36 0 a18 8 25 1 0 -36 0" fill="none" stroke="#b9a6f0" stroke-width="3"/><circle cx="40" cy="40" r="5" fill="#fff3c4"/><circle cx="22" cy="24" r="1.5" fill="#fff"/><circle cx="58" cy="56" r="1.5" fill="#fff"/><circle cx="60" cy="22" r="1" fill="#fff"/>`),
  grandparent: icon(`<circle cx="36" cy="22" r="10" fill="#f2cc8f" ${S}/><path d="M26 18 Q36 8 46 18" fill="#d9d3c7" ${S}/><rect x="26" y="34" width="20" height="30" rx="8" fill="#6d4c2b" ${S}/><path d="M54 36 V68 M54 36 Q54 30 48 32" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`),
  helping: icon(
    `${figure(20, 16, "#2f6d4f", 7)}<path d="M27 30 L41 43" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="40" r="7" fill="#f2cc8f" ${S}/><rect x="52" y="48" width="16" height="14" rx="5" fill="#c4553a" ${S}/><rect x="52" y="60" width="22" height="8" rx="3" fill="#1f4e79" ${S}/><path d="M54 52 L45 45" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="43" cy="44" r="3.5" fill="#f2cc8f" ${S}/><path d="M8 68 H72" stroke="${INK}" stroke-width="3"/>`,
  ),
  church: building(
    `<polygon points="10,34 40,14 70,34" fill="#c4553a" ${S}/><rect x="36" y="2" width="8" height="14" fill="#d9d3c7" ${S}/><path d="M40 2 V-4" stroke="${INK}"/>`,
    "#f6f1e7",
    `<circle cx="40" cy="44" r="6" fill="#f0c14d" ${S}/><rect x="34" y="54" width="12" height="14" fill="#6d4c2b"/><path d="M40 4 V14 M36 8 H44" stroke="${INK}" stroke-width="2"/>`,
  ),
  home: building(`<polygon points="10,34 40,12 70,34" fill="#c4553a" ${S}/>`, "#f2e2c4", `<rect x="34" y="48" width="12" height="20" fill="#6d4c2b"/><rect x="20" y="42" width="10" height="10" fill="#7eb6d6" ${S}/><rect x="50" y="42" width="10" height="10" fill="#7eb6d6" ${S}/>`),
  apartment: icon(`<rect x="20" y="8" width="40" height="60" fill="#d7c4a3" ${S}/>${[16, 28, 40, 52].map((y) => `<rect x="26" y="${y}" width="10" height="8" fill="#7eb6d6"/><rect x="44" y="${y}" width="10" height="8" fill="#7eb6d6"/>`).join("")}<rect x="10" y="68" width="60" height="4" fill="${INK}"/>`),
  school: building(`<rect x="14" y="26" width="52" height="8" fill="#c4553a" ${S}/><path d="M40 26 V6" stroke="${INK}" stroke-width="2"/><rect x="40" y="6" width="14" height="8" fill="#1f4e79"/>`, "#f2e2c4", `<circle cx="40" cy="44" r="5" fill="#f0c14d" ${S}/><rect x="34" y="54" width="12" height="14" fill="#6d4c2b"/>${txt(40, 32, "SCHOOL", 5, "#fff")}`),
  hospital: building(`<rect x="14" y="26" width="52" height="8" fill="#fff" ${S}/>`, "#fff", `<rect x="36" y="38" width="8" height="20" fill="#c4553a"/><rect x="30" y="44" width="20" height="8" fill="#c4553a"/>`),
  library: building(`<polygon points="10,34 40,18 70,34" fill="#d9d3c7" ${S}/>`, "#f6f1e7", `${[20, 32, 44, 56].map((x) => `<rect x="${x}" y="36" width="5" height="30" fill="#d9d3c7" ${S}/>`).join("")}<rect x="30" y="22" width="20" height="8" fill="#1f4e79"/>`),
  townhall: building(`<path d="M22 34 Q40 6 58 34 Z" fill="#6c8ea4" ${S}/>`, "#f6f1e7", `${[20, 30, 46, 56].map((x) => `<rect x="${x}" y="38" width="5" height="28" fill="#d9d3c7" ${S}/>`).join("")}<rect x="35" y="48" width="10" height="20" fill="#6d4c2b"/>`),
  arcade: icon(`<path d="M22 70 V14 Q22 8 28 8 H52 Q58 8 58 14 V70 Z" fill="#6b3fa0" ${S}/><rect x="27" y="16" width="26" height="20" fill="#1b2340"/><circle cx="34" cy="26" r="3" fill="#f0c14d"/><rect x="24" y="44" width="32" height="6" fill="#241e18"/><circle cx="32" cy="47" r="2" fill="#c4553a"/><circle cx="48" cy="47" r="2" fill="#2f6d4f"/>`),
  theater: icon(`<rect x="8" y="12" width="64" height="44" fill="#1b2340" ${S}/><path d="M8 12 Q18 34 12 56 H8 Z M72 12 Q62 34 68 56 H72 Z" fill="#c4553a"/><rect x="28" y="56" width="24" height="14" fill="#fff" ${S}/><path d="M28 56 L32 70 M40 56 V70 M52 56 L48 70" stroke="#c4553a"/><circle cx="34" cy="54" r="3" fill="#fff3c4"/><circle cx="42" cy="52" r="3" fill="#fff3c4"/>`),
  stadium: icon(`<ellipse cx="40" cy="44" rx="34" ry="20" fill="#8a8175" ${S}/><ellipse cx="40" cy="44" rx="24" ry="12" fill="#2f6d4f"/><path d="M40 32 V56" stroke="#fff" stroke-width="2"/><circle cx="40" cy="44" r="4" fill="none" stroke="#fff" stroke-width="2"/>`),
  gamestore: building(`<path d="M10 34 L16 22 H64 L70 34 Z" fill="#6b3fa0" ${S}/>`, "#f6f1e7", `<rect x="26" y="40" width="28" height="14" rx="7" fill="#8a8175" ${S}/><circle cx="33" cy="47" r="2" fill="${INK}"/><circle cx="47" cy="47" r="2" fill="${INK}"/>${txt(40, 31, "GAMES", 6, "#fff")}`),
  gameTurns: screen(
    `${txt(40, 22, "WHOSE TURN?", 5.5)}${figure(24, 35, "#e07a5f", 4)}${figure(40, 35, "#81b29a", 4)}${figure(56, 35, "#1f4e79", 4)}<polygon points="36,25 44,25 40,30" fill="#2f6d4f"/>${txt(24, 49, "1", 4)}${txt(40, 49, "2", 4)}${txt(56, 49, "3", 4)}`,
  ),
  poll: phone(`${txt(40, 22, "WHO'S BEST?", 5)}<rect x="28" y="28" width="22" height="6" fill="#c4553a"/><rect x="28" y="38" width="14" height="6" fill="#d9d3c7"/><rect x="28" y="48" width="8" height="6" fill="#d9d3c7"/>`),
  chatSpam: phone(`${[20, 28, 36, 44, 52, 60].map((y, i) => txt(i % 2 ? 44 : 36, y, "ME ME ME", 5, "#c4553a")).join("")}`),
  townApp: phone(`<path d="M40 18 C32 18 30 30 40 42 C50 30 48 18 40 18 Z" fill="#c4553a" ${S}/><circle cx="40" cy="26" r="3" fill="#fff"/><rect x="30" y="48" width="20" height="4" rx="2" fill="#8a8175" transform="rotate(-20 40 50)"/><rect x="28" y="44" width="8" height="8" fill="#6d4c2b"/>`),
  videoCall: screen(`${figure(34, 24, "#1f4e79", 7)}<rect x="48" y="36" width="16" height="14" fill="#d7ebf6" ${S}/>${figure(56, 40, "#c4553a", 3)}`),
  filter: phone(`<circle cx="40" cy="38" r="12" fill="#f2cc8f" ${S}/><path d="M28 28 L30 16 L36 26 M52 28 L50 16 L44 26" fill="#e07a5f" ${S}/><circle cx="35" cy="37" r="2" fill="${INK}"/><circle cx="45" cy="37" r="2" fill="${INK}"/><path d="M50 52 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2z" fill="#b9a6f0"/>`),
  mcTower: icon(`${[0, 1, 2, 3, 4].map((i) => cube(34, 62 - i * 12, "#5a9e3a", "#8b5a2b")).join("")}<path d="M40 2 V14" stroke="${INK}" stroke-width="2"/><path d="M40 2 L52 6 L40 10" fill="#c4553a"/>${txt(58, 30, "MINE", 6, "#c4553a")}`),
  mcVillage: icon(`${cube(8, 52, "#5a9e3a", "#8b5a2b")}${cube(20, 52, "#5a9e3a", "#8b5a2b")}${cube(14, 40, "#c4553a", "#c4553a")}${cube(46, 52, "#5a9e3a", "#d7c4a3")}${cube(58, 52, "#5a9e3a", "#d7c4a3")}${cube(52, 40, "#1f4e79", "#1f4e79")}${figure(40, 50, "#e07a5f", 3)}<rect x="4" y="64" width="72" height="6" fill="#5a9e3a"/>`),
  envelope: icon(`<rect x="10" y="20" width="60" height="40" rx="4" fill="#fffdf8" stroke="${INK}" stroke-width="3"/><path d="M10 22 L40 44 L70 22" fill="none" stroke="${INK}" stroke-width="3"/>`),
  nehemiah: icon(`<circle cx="40" cy="24" r="11" fill="#e8b98a" ${S}/><path d="M28 22 Q40 4 52 22 L54 30 Q40 20 26 30 Z" fill="#f6f1e7" ${S}/><path d="M34 32 Q40 40 46 32" fill="#6d4c2b"/><path d="M22 72 L28 38 Q40 32 52 38 L58 72 Z" fill="#1f4e79" ${S}/><path d="M40 38 V72" stroke="#f0c14d" stroke-width="3"/>`),
  pray: icon(`<path d="M40 14 C34 22 30 40 32 58 L40 62 L48 58 C50 40 46 22 40 14 Z" fill="#f2cc8f" stroke="${INK}" stroke-width="3"/><path d="M40 18 V60" stroke="${INK}" stroke-width="2"/><path d="M26 10 l2 5 M54 10 l-2 5 M40 4 v5" stroke="#f0c14d" stroke-width="3" stroke-linecap="round"/>`),
  temple: icon(`<rect x="20" y="36" width="40" height="30" fill="#f2e2c4" ${S}/><polygon points="16,36 40,20 64,36" fill="#e0a106" ${S}/><rect x="34" y="48" width="12" height="18" fill="#6d4c2b"/>`),
  bookCover: icon(`<rect x="18" y="10" width="44" height="60" rx="3" fill="#1f4e79" ${S}/><rect x="24" y="18" width="32" height="10" fill="#f0c14d"/><rect x="24" y="34" width="32" height="3" fill="#f6f1e7"/><rect x="24" y="42" width="24" height="3" fill="#f6f1e7"/>`),
  god: icon(`<circle cx="40" cy="40" r="30" fill="#fff3c4"/><path d="M40 6 V18 M40 62 V74 M6 40 H18 M62 40 H74 M16 16 L24 24 M56 56 L64 64 M64 16 L56 24 M24 56 L16 64" stroke="#e0a106" stroke-width="3" stroke-linecap="round"/><rect x="36" y="20" width="8" height="40" rx="2" fill="#f0c14d" ${S}/><rect x="26" y="30" width="28" height="8" rx="2" fill="#f0c14d" ${S}/>`),
  love: icon(`<path d="M40 68 C14 50 8 36 14 24 C20 12 34 14 40 26 C46 14 60 12 66 24 C72 36 66 50 40 68 Z" fill="#c4553a" stroke="${INK}" stroke-width="3"/>`),
  friendship: icon(`${figure(26, 22, "#2f6d4f", 8)}${figure(54, 22, "#e07a5f", 8)}<path d="M34 42 Q40 48 46 42" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M14 70 H66" stroke="${INK}" stroke-width="3"/>`),
  trust: icon(`<rect x="2" y="26" width="10" height="20" fill="#1f4e79" ${S}/><rect x="68" y="24" width="10" height="20" fill="#c4553a" ${S}/><path d="M10 34 Q22 28 34 40 L46 36 Q54 32 60 40 Q66 50 54 52 L30 50 Q16 48 10 34 Z" fill="#f2cc8f" ${S}/><path d="M70 32 Q58 26 46 36" fill="none" stroke="${INK}" stroke-width="3"/><path d="M34 40 L40 48 M46 36 L50 46" stroke="${INK}" stroke-width="2"/>`),
  justice: icon(`<rect x="38" y="14" width="4" height="52" fill="${INK}"/><rect x="24" y="64" width="32" height="5" fill="${INK}"/><path d="M12 24 H68" stroke="${INK}" stroke-width="3"/><path d="M12 24 L6 44 M12 24 L18 44 M68 24 L62 44 M68 24 L74 44" stroke="${INK}" stroke-width="2"/><path d="M4 44 H20 Q12 56 4 44 Z" fill="#f0c14d" ${S}/><path d="M60 44 H76 Q68 56 60 44 Z" fill="#f0c14d" ${S}/>`),
  responsibility: icon(`<rect x="18" y="12" width="44" height="58" rx="4" fill="#fffdf8" ${S}/><rect x="30" y="6" width="20" height="10" rx="3" fill="#8a8175" ${S}/><path d="M26 30 L31 35 L40 25" fill="none" stroke="#2f6d4f" stroke-width="3"/><path d="M44 31 H56" stroke="${INK}" stroke-width="2"/><path d="M26 46 L31 51 L40 41" fill="none" stroke="#2f6d4f" stroke-width="3"/><path d="M44 47 H56" stroke="${INK}" stroke-width="2"/><path d="M26 60 h8 M44 61 H56" stroke="${INK}" stroke-width="2"/>`),
  laws: icon(`<path d="M20 14 H60 Q68 14 68 22 V66 H28 Q20 66 20 58 Z" fill="#fffdf8" ${S}/><path d="M20 14 Q12 14 12 22 Q12 30 20 30 H28" fill="#d9d3c7" ${S}/><path d="M32 30 H58 M32 40 H58 M32 50 H50" stroke="${INK}" stroke-width="2"/><rect x="46" y="52" width="20" height="8" rx="2" fill="#6d4c2b" ${S} transform="rotate(-35 56 56)"/><rect x="60" y="60" width="12" height="6" fill="#6d4c2b" ${S}/>`),
  road: icon(`<path d="M6 74 L28 10 H52 L74 74 Z" fill="#5f574e" ${S}/><path d="M40 74 L40 10" stroke="#f0c14d" stroke-width="3" stroke-dasharray="8 6"/><path d="M0 74 H80" stroke="${INK}" stroke-width="3"/><circle cx="66" cy="18" r="6" fill="#f0c14d"/>`),
  technology: icon(`<rect x="8" y="16" width="64" height="40" rx="4" fill="${INK}"/><rect x="12" y="20" width="56" height="32" fill="#f6f1e7"/><rect x="4" y="56" width="72" height="6" rx="3" fill="#8a8175" ${S}/><circle cx="40" cy="36" r="8" fill="#d9d3c7" ${S}/><path d="M40 22 V26 M40 46 V50 M26 36 H30 M50 36 H54 M30 26 L33 29 M47 43 L50 46 M50 26 L47 29 M33 43 L30 46" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>`),
  buildings: icon(`<rect x="6" y="30" width="20" height="40" fill="#d7c4a3" ${S}/><rect x="30" y="14" width="22" height="56" fill="#8fa8b8" ${S}/><rect x="56" y="38" width="18" height="32" fill="#f2e2c4" ${S}/>${[20, 30, 40, 50].map((y) => `<rect x="35" y="${y}" width="5" height="5" fill="#fff"/><rect x="43" y="${y}" width="5" height="5" fill="#fff"/>`).join("")}<rect x="10" y="36" width="5" height="5" fill="#7eb6d6"/><rect x="18" y="36" width="5" height="5" fill="#7eb6d6"/><rect x="60" y="44" width="4" height="4" fill="#7eb6d6"/><rect x="4" y="70" width="72" height="4" fill="${INK}"/>`),
};
