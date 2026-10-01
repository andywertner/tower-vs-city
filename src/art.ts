export function icon(body: string, vb = "0 0 80 80"): string {
  return `<svg viewBox="${vb}" aria-hidden="true">${body}</svg>`;
}

export function shark(body: string, belly: string, extra = ""): string {
  return `
    <ellipse cx="40" cy="48" rx="26" ry="18" fill="${body}"/>
    <path d="M16 36 L4 18 L30 32 Z" fill="${body}"/>
    <path d="M64 46 L78 34 L78 60 Z" fill="${body}"/>
    <ellipse cx="40" cy="52" rx="14" ry="10" fill="${belly}"/>
    <circle cx="31" cy="44" r="4.2" fill="#fff"/>
    <circle cx="50" cy="44" r="4.2" fill="#fff"/>
    <circle cx="32.2" cy="45" r="2" fill="#1b2430"/>
    <circle cx="51.2" cy="45" r="2" fill="#1b2430"/>
    <path d="M33 56 Q40 61 47 56" fill="none" stroke="#1b2430" stroke-width="1.7" stroke-linecap="round"/>
    ${extra}
  `;
}

const CREATURE_SHAPES: Record<string, string> = {
  baby: shark("#3aa0c8", "#e7f7fb"),
  daddy: shark("#1f4e79", "#d5e4f2", `<ellipse cx="40" cy="30" rx="10" ry="4" fill="#1f4e79"/>`),
  mommy: shark("#2a9d8f", "#e5f7f4", `<circle cx="58" cy="30" r="5" fill="#e76f51"/><circle cx="58" cy="30" r="2" fill="#f4d35e"/>`),
  grandma: shark("#7d6b5a", "#f3ebe3", `<circle cx="31" cy="44" r="6.2" fill="none" stroke="#241e18" stroke-width="1.4"/><circle cx="50" cy="44" r="6.2" fill="none" stroke="#241e18" stroke-width="1.4"/><path d="M37 44 H44" stroke="#241e18" stroke-width="1.4"/>`),
  grandpa: shark("#3d5a4c", "#e4efe8", `<path d="M18 34 Q40 18 62 34 L58 30 Q40 20 22 30 Z" fill="#2c3e34"/>`),
  fox: `
    <path d="M14 38 L28 14 L36 32 L40 22 L44 32 L52 14 L66 38 Q68 58 40 62 Q12 58 14 38 Z" fill="#e07a3d"/>
    <path d="M28 14 L34 30 L24 28 Z" fill="#f4e1d2"/>
    <path d="M52 14 L46 30 L56 28 Z" fill="#f4e1d2"/>
    <ellipse cx="40" cy="48" rx="14" ry="10" fill="#f4e1d2"/>
    <circle cx="33" cy="42" r="2.2" fill="#241e18"/>
    <circle cx="47" cy="42" r="2.2" fill="#241e18"/>
    <circle cx="40" cy="48" r="2.4" fill="#241e18"/>
  `,
  owl: `
    <ellipse cx="40" cy="46" rx="24" ry="26" fill="#8c6239"/>
    <path d="M16 28 L28 14 L34 28 Z" fill="#6d4c2b"/>
    <path d="M64 28 L52 14 L46 28 Z" fill="#6d4c2b"/>
    <circle cx="30" cy="42" r="9" fill="#f6f1e7"/>
    <circle cx="50" cy="42" r="9" fill="#f6f1e7"/>
    <circle cx="31" cy="43" r="3.2" fill="#241e18"/>
    <circle cx="51" cy="43" r="3.2" fill="#241e18"/>
    <path d="M40 48 L36 54 L44 54 Z" fill="#e0a106"/>
  `,
  turtle: `
    <ellipse cx="40" cy="46" rx="24" ry="18" fill="#2f6d4f"/>
    <ellipse cx="40" cy="46" rx="14" ry="10" fill="#3f8f68"/>
    <circle cx="62" cy="42" r="8" fill="#7dcea0"/>
    <circle cx="64" cy="41" r="1.6" fill="#241e18"/>
    <ellipse cx="22" cy="58" rx="6" ry="4" fill="#7dcea0"/>
    <ellipse cx="58" cy="58" rx="6" ry="4" fill="#7dcea0"/>
  `,
};

export function creatureIcon(id: string): string {
  return icon(CREATURE_SHAPES[id] ?? CREATURE_SHAPES.baby);
}

export function creatureShapes(id: string): string {
  return CREATURE_SHAPES[id] ?? CREATURE_SHAPES.baby;
}

export function person(color: string): string {
  return `<circle cx="40" cy="26" r="12" fill="${color}"/><ellipse cx="40" cy="56" rx="16" ry="18" fill="${color}"/>`;
}

export function brickIcon(): string {
  return icon(`<rect x="14" y="28" width="52" height="26" rx="4" fill="#d4652f" stroke="#241e18" stroke-width="3"/>`);
}

export function crossIcon(): string {
  return icon(`
    <rect x="8" y="34" width="64" height="14" rx="4" fill="#d7c4a3" stroke="#241e18" stroke-width="3"/>
    <rect x="33" y="10" width="14" height="60" rx="4" fill="#d7c4a3" stroke="#241e18" stroke-width="3"/>
    <circle cx="40" cy="41" r="5" fill="#f0c14d" stroke="#241e18" stroke-width="2"/>
  `);
}

export const ICONS = {
  trophy: icon(`<path d="M28 14 H52 V28 Q52 42 40 44 Q28 42 28 28 Z" fill="#f0c14d" stroke="#241e18" stroke-width="3"/><path d="M28 18 H18 Q20 32 30 30" fill="none" stroke="#241e18" stroke-width="3"/><path d="M52 18 H62 Q60 32 50 30" fill="none" stroke="#241e18" stroke-width="3"/><rect x="36" y="44" width="8" height="10" fill="#241e18"/><rect x="28" y="54" width="24" height="6" rx="2" fill="#c4553a"/>`),
  blocks: icon(`<rect x="28" y="18" width="24" height="14" rx="2" fill="#d4652f" stroke="#241e18" stroke-width="2"/><rect x="22" y="34" width="36" height="14" rx="2" fill="#e07a3d" stroke="#241e18" stroke-width="2"/><rect x="16" y="50" width="48" height="14" rx="2" fill="#c4553a" stroke="#241e18" stroke-width="2"/>`),
  megaphone: icon(`<path d="M18 34 H30 L58 20 V60 L30 46 H18 Z" fill="#f0c14d" stroke="#241e18" stroke-width="3"/><circle cx="62" cy="30" r="3" fill="none" stroke="#241e18" stroke-width="2"/><circle cx="66" cy="24" r="3" fill="none" stroke="#241e18" stroke-width="2"/>`),
  ranks: icon(`<rect x="16" y="14" width="48" height="52" rx="4" fill="#fff" stroke="#241e18" stroke-width="3"/><text x="24" y="34" font-size="14" font-family="Georgia" fill="#241e18">1</text><text x="24" y="50" font-size="14" font-family="Georgia" fill="#241e18">2</text><text x="24" y="62" font-size="12" font-family="Georgia" fill="#8a8175">3</text><circle cx="52" cy="28" r="6" fill="#f0c14d" stroke="#241e18"/>`),
  table: icon(`<ellipse cx="40" cy="46" rx="28" ry="14" fill="#c4553a" stroke="#241e18" stroke-width="3"/><circle cx="18" cy="26" r="8" fill="#e07a5f"/><circle cx="40" cy="18" r="8" fill="#81b29a"/><circle cx="62" cy="26" r="8" fill="#f2cc8f"/>`),
  houses: icon(`<rect x="10" y="40" width="22" height="18" fill="#f2e2c4" stroke="#241e18" stroke-width="2"/><polygon points="8,40 21,28 34,40" fill="#c4553a" stroke="#241e18" stroke-width="2"/><rect x="34" y="36" width="22" height="22" fill="#f6f1e7" stroke="#241e18" stroke-width="2"/><polygon points="32,36 45,24 58,36" fill="#2f6d4f" stroke="#241e18" stroke-width="2"/><rect x="56" y="42" width="16" height="16" fill="#f2e2c4" stroke="#241e18" stroke-width="2"/>`),
  hands: icon(`<circle cx="22" cy="28" r="10" fill="#e07a5f"/><circle cx="58" cy="28" r="10" fill="#81b29a"/><path d="M22 40 Q40 58 58 40" fill="none" stroke="#241e18" stroke-width="4" stroke-linecap="round"/>`),
  bread: icon(`<ellipse cx="40" cy="44" rx="26" ry="16" fill="#e0a106" stroke="#241e18" stroke-width="3"/><path d="M22 44 H58" stroke="#f6f1e7" stroke-width="3"/><circle cx="18" cy="36" r="6" fill="#e07a5f"/><circle cx="62" cy="36" r="6" fill="#81b29a"/><circle cx="40" cy="24" r="6" fill="#f2cc8f"/>`),
  sunrise: icon(`<circle cx="40" cy="48" r="14" fill="#f0c14d" stroke="#241e18" stroke-width="3"/><path d="M40 20 V28 M18 30 L24 36 M62 30 L56 36 M14 50 H22 M58 50 H66" stroke="#e07a3d" stroke-width="3" stroke-linecap="round"/><path d="M12 62 H68" stroke="#2f6d4f" stroke-width="4" stroke-linecap="round"/>`),
  gold: icon(`<circle cx="40" cy="40" r="18" fill="#f0c14d" stroke="#241e18" stroke-width="3"/><path d="M40 28 L43 36 H52 L45 41 L48 50 L40 44 L32 50 L35 41 L28 36 H37 Z" fill="#fff3c4"/>`),
  wow: icon(`<circle cx="40" cy="40" r="22" fill="#f0c14d" stroke="#241e18" stroke-width="3"/><circle cx="32" cy="36" r="3" fill="#241e18"/><circle cx="48" cy="36" r="3" fill="#241e18"/><ellipse cx="40" cy="50" rx="6" ry="7" fill="#241e18"/>`),
  face: icon(`<circle cx="40" cy="40" r="22" fill="#f2cc8f" stroke="#241e18" stroke-width="3"/><circle cx="32" cy="36" r="2.5" fill="#241e18"/><circle cx="48" cy="36" r="2.5" fill="#241e18"/><path d="M32 48 Q40 56 48 48" fill="none" stroke="#241e18" stroke-width="2.5" stroke-linecap="round"/>`),
  family: icon(`<circle cx="20" cy="22" r="8" fill="#f2cc8f" stroke="#241e18" stroke-width="2"/><rect x="12" y="32" width="16" height="30" rx="7" fill="#1f4e79" stroke="#241e18" stroke-width="2"/><circle cx="60" cy="22" r="8" fill="#f2cc8f" stroke="#241e18" stroke-width="2"/><rect x="52" y="32" width="16" height="30" rx="7" fill="#c4553a" stroke="#241e18" stroke-width="2"/><circle cx="40" cy="38" r="6" fill="#f2cc8f" stroke="#241e18" stroke-width="2"/><rect x="34" y="46" width="12" height="16" rx="5" fill="#2f6d4f" stroke="#241e18" stroke-width="2"/><path d="M28 44 L34 50 M46 50 L52 44" stroke="#241e18" stroke-width="3" stroke-linecap="round"/>`),
  kids: icon(`<circle cx="28" cy="28" r="10" fill="#e07a5f"/><ellipse cx="28" cy="52" rx="12" ry="14" fill="#3d6b58"/><circle cx="52" cy="32" r="9" fill="#81b29a"/><ellipse cx="52" cy="54" rx="11" ry="13" fill="#c4553a"/>`),
  note: icon(`<rect x="22" y="16" width="36" height="48" rx="4" fill="#fff" stroke="#241e18" stroke-width="3"/><path d="M30 32 H50 M30 42 H46" stroke="#241e18" stroke-width="2"/>`),
  sign: icon(`<rect x="18" y="16" width="44" height="28" rx="3" fill="#f6f1e7" stroke="#241e18" stroke-width="3"/><rect x="37" y="44" width="6" height="20" fill="#241e18"/>`),
  around: icon(`<circle cx="40" cy="40" r="24" fill="none" stroke="#1f4e79" stroke-width="8"/><circle cx="40" cy="40" r="10" fill="#f0c14d" stroke="#241e18" stroke-width="2"/>`),
  circleWord: icon(`<circle cx="40" cy="34" r="16" fill="none" stroke="#1f4e79" stroke-width="6"/><circle cx="40" cy="34" r="4" fill="#f0c14d"/>`),
  spark: icon(`<path d="M40 12 L44 32 L64 36 L44 40 L40 64 L36 40 L16 36 L36 32 Z" fill="#f0c14d" stroke="#241e18" stroke-width="2"/>`),
  peopleMark: icon(`<circle cx="28" cy="30" r="8" fill="#e07a5f"/><circle cx="52" cy="30" r="8" fill="#81b29a"/><path d="M16 58 Q28 44 40 58 Q52 44 64 58" fill="#3d6b58"/>`),
  gear: icon(`<circle cx="40" cy="40" r="10" fill="#d9d3c7" stroke="#241e18" stroke-width="3"/><path d="M40 14 V22 M40 58 V66 M14 40 H22 M58 40 H66 M22 22 L28 28 M52 52 L58 58 M58 22 L52 28 M28 52 L22 58" stroke="#241e18" stroke-width="3" stroke-linecap="round"/>`),
  bolt: icon(`<path d="M46 10 L28 42 H40 L32 70 L56 36 H44 Z" fill="#f0c14d" stroke="#241e18" stroke-width="3"/>`),
  bird: icon(`<ellipse cx="36" cy="42" rx="16" ry="12" fill="#5b8def" stroke="#241e18" stroke-width="3"/><path d="M50 40 L66 32 L58 46 Z" fill="#f0c14d" stroke="#241e18" stroke-width="2"/><circle cx="30" cy="40" r="2" fill="#241e18"/>`),
  mitre: icon(`<path d="M40 12 L58 62 H22 Z" fill="#f6f1e7" stroke="#241e18" stroke-width="3"/><path d="M40 12 L34 28 H46 Z" fill="#f0c14d"/><path d="M28 50 H52" stroke="#c4553a" stroke-width="3"/>`),
  book: icon(`<path d="M14 18 H40 V64 H14 Q18 42 14 18 Z" fill="#1f4e79" stroke="#241e18" stroke-width="2"/><path d="M66 18 H40 V64 H66 Q62 42 66 18 Z" fill="#f6f1e7" stroke="#241e18" stroke-width="2"/>`),
  may: icon(`<rect x="16" y="18" width="48" height="46" rx="4" fill="#fff" stroke="#241e18" stroke-width="3"/><rect x="16" y="18" width="48" height="14" fill="#c4553a"/><text x="40" y="52" text-anchor="middle" font-size="14" font-family="Georgia" fill="#241e18">15</text>`),
  jan: icon(`<rect x="16" y="18" width="48" height="46" rx="4" fill="#fff" stroke="#241e18" stroke-width="3"/><rect x="16" y="18" width="48" height="14" fill="#8a8175"/><text x="40" y="52" text-anchor="middle" font-size="14" font-family="Georgia" fill="#241e18">1</text>`),
  light: icon(`<circle cx="40" cy="40" r="10" fill="#f0c14d" stroke="#241e18" stroke-width="3"/><path d="M40 14 V22 M40 58 V66 M16 40 H24 M56 40 H64 M22 22 L28 28 M52 52 L58 58 M58 22 L52 28 M28 52 L22 58" stroke="#e0a106" stroke-width="3" stroke-linecap="round"/>`),
  house: icon(`<rect x="22" y="38" width="36" height="26" fill="#f2e2c4" stroke="#241e18" stroke-width="3"/><polygon points="16,38 40,18 64,38" fill="#c4553a" stroke="#241e18" stroke-width="3"/><rect x="34" y="48" width="12" height="16" fill="#6d4c2b"/>`),
  tree: icon(`<rect x="36" y="48" width="8" height="18" fill="#6d4c2b"/><circle cx="40" cy="36" r="16" fill="#2f6d4f" stroke="#241e18" stroke-width="3"/>`),
  well: icon(`<ellipse cx="40" cy="48" rx="20" ry="10" fill="none" stroke="#241e18" stroke-width="4"/><ellipse cx="40" cy="48" rx="12" ry="6" fill="#7eb6d6"/><rect x="22" y="28" width="4" height="20" fill="#6d4c2b"/><rect x="54" y="28" width="4" height="20" fill="#6d4c2b"/><path d="M22 28 H58" stroke="#6d4c2b" stroke-width="4"/>`),
  spire: icon(`<polygon points="40,8 52,70 28,70" fill="#8a8175" stroke="#241e18" stroke-width="3"/><rect x="34" y="70" width="12" height="6" fill="#241e18"/>`),
  robotPage: icon(`<rect x="8" y="28" width="28" height="24" rx="4" fill="#d9d3c7" stroke="#241e18" stroke-width="3"/><circle cx="16" cy="38" r="2" fill="#241e18"/><circle cx="26" cy="38" r="2" fill="#241e18"/><rect x="44" y="16" width="26" height="48" rx="2" fill="#fff" stroke="#241e18" stroke-width="2"/><path d="M50 28 H64 M50 36 H64 M50 44 H60" stroke="#8a8175" stroke-width="2"/>`, "0 0 80 80"),
  kidWrite: icon(`<circle cx="24" cy="36" r="10" fill="#f2cc8f" stroke="#241e18" stroke-width="2"/><path d="M14 62 Q24 48 34 62" fill="#3d6b58"/><rect x="42" y="40" width="28" height="20" rx="2" fill="#fff" stroke="#241e18" stroke-width="2"/><path d="M48 50 H64" stroke="#1f4e79" stroke-width="2"/>`),
  shout: icon(`<path d="M14 36 H26 L52 22 V58 L26 44 H14 Z" fill="#f0c14d" stroke="#241e18" stroke-width="3"/><text x="58" y="42" font-size="12" font-family="Georgia" fill="#241e18">ME</text>`),
  tools: icon(`<circle cx="24" cy="26" r="8" fill="#e07a5f"/><circle cx="56" cy="26" r="8" fill="#81b29a"/><rect x="36" y="36" width="8" height="28" rx="2" fill="#6d4c2b" transform="rotate(-30 40 50)"/><rect x="34" y="34" width="18" height="8" rx="2" fill="#8a8175"/>`),
  alone: icon(`<rect x="30" y="28" width="20" height="12" fill="#d4652f" stroke="#241e18"/><rect x="24" y="40" width="32" height="12" fill="#e07a3d" stroke="#241e18"/><rect x="18" y="52" width="44" height="12" fill="#c4553a" stroke="#241e18"/><circle cx="40" cy="18" r="7" fill="#f2cc8f" stroke="#241e18"/>`),
  phone: icon(`<rect x="28" y="12" width="24" height="44" rx="4" fill="#241e18"/><rect x="31" y="18" width="18" height="30" fill="#f6f1e7"/><path d="M34 28 H46 M36 36 H44" stroke="#c4553a" stroke-width="2"/><circle cx="40" cy="44" r="2" fill="#e07a5f"/>`),
  photo: icon(`<rect x="14" y="20" width="36" height="28" rx="2" fill="#fff" stroke="#241e18" stroke-width="3"/><circle cx="26" cy="30" r="4" fill="#7eb6d6"/><path d="M18 44 L28 34 L36 42 L42 36 L48 44" fill="#2f6d4f"/><circle cx="60" cy="48" r="12" fill="#f2cc8f" stroke="#241e18" stroke-width="2"/><path d="M54 46 H66" stroke="#241e18" stroke-width="1.4"/><circle cx="56" cy="46" r="3" fill="none" stroke="#241e18"/>`),
  story: icon(`<rect x="18" y="16" width="44" height="48" rx="3" fill="#fff" stroke="#241e18" stroke-width="3"/><path d="M26 32 H52 M26 42 H52 M26 52 H40" stroke="#1f4e79" stroke-width="2"/><circle cx="22" cy="12" r="5" fill="#e07a5f"/><circle cx="40" cy="10" r="5" fill="#81b29a"/><circle cx="58" cy="12" r="5" fill="#f2cc8f"/>`),
};
