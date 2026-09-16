// The passport scene from the app, drawn on a web canvas.
//
// A port of PassportSilhouetteCanvasView.swift, AuroraSky.swift, CampArt.swift and
// SkyClock.swift: the same palette, the same ridges stacked by elevation, the same
// stamps, meadow, switchbacking trail, milestone signs and camp. The differences are
// the ones a web page needs: the scene is drawn in a logical space scaled to the
// viewport, wide screens get a trail and ranges proportioned for landscape, and the
// sky leaves room for the page's headline.

// ════════════════════════════════════════════════════════════════
//  Color
// ════════════════════════════════════════════════════════════════

export type RGB = readonly [number, number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const WHITE: RGB = [1, 1, 1];
const BLACK: RGB = [0, 0, 0];

export const hex = (v: number): RGB => [
  ((v >> 16) & 255) / 255,
  ((v >> 8) & 255) / 255,
  (v & 255) / 255,
];
const rgb = (r: number, g: number, b: number): RGB => [r, g, b];

export function mix(a: RGB, b: RGB, t: number): RGB {
  const k = clamp01(t);
  return [
    a[0] + (b[0] - a[0]) * k,
    a[1] + (b[1] - a[1]) * k,
    a[2] + (b[2] - a[2]) * k,
  ];
}

export const luminance = (c: RGB) => 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];

function toHsb([r, g, b]: RGB): [number, number, number] {
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
    if (h < 0) h += 1;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

function fromHsb(h: number, s: number, v: number): RGB {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s);
  switch (((i % 6) + 6) % 6) {
    case 0:
      return [v, t, p];
    case 1:
      return [q, v, p];
    case 2:
      return [p, v, t];
    case 3:
      return [p, q, v];
    case 4:
      return [t, p, v];
    default:
      return [v, p, q];
  }
}

const withHue = (c: RGB, hue: number): RGB => {
  const [, s, v] = toHsb(c);
  return fromHsb(hue, s, v);
};

const adjusted = (c: RGB, ds: number, db: number): RGB => {
  const [h, s, v] = toHsb(c);
  return fromHsb(h, clamp01(s + ds), clamp01(v + db));
};

export const css = (c: RGB, a = 1) =>
  `rgba(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)},${+a.toFixed(3)})`;

export const cssHex = (c: RGB) =>
  "#" +
  c
    .map((v) =>
      Math.round(v * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

// ════════════════════════════════════════════════════════════════
//  Themes (PassportTheme.swift)
// ════════════════════════════════════════════════════════════════

export interface Theme {
  id: string;
  name: string;
  park: string | null;
  sky: RGB;
  sun: RGB;
  ridgeFar: RGB;
  ridgeNear: RGB;
  ground: RGB;
  skyTop: RGB;
  skyMid: RGB | null;
  skyHorizon: RGB;
  meadow: RGB | null;
  accent: RGB;
  accentDark: RGB;
  /** The light on the tops of the peaks: alpenglow on a sunset theme, pale sun under a clear sky. */
  alpenglow: RGB | null;
  /** How far the meadow's bands run toward black. */
  meadowDeep: number | null;
}

type ThemeInput = Pick<
  Theme,
  "id" | "name" | "park" | "sky" | "sun" | "ridgeFar" | "ridgeNear" | "ground"
> &
  Partial<
    Pick<
      Theme,
      | "skyTop"
      | "skyMid"
      | "skyHorizon"
      | "meadow"
      | "accent"
      | "accentDark"
      | "alpenglow"
      | "meadowDeep"
    >
  >;

const theme = (t: ThemeInput): Theme => ({
  ...t,
  skyTop: t.skyTop ?? mix(t.sky, BLACK, 0.14),
  skyMid: t.skyMid ?? null,
  skyHorizon: t.skyHorizon ?? mix(t.sky, WHITE, 0.35),
  meadow: t.meadow ?? null,
  accent: t.accent ?? hex(0x5e9a63),
  accentDark: t.accentDark ?? hex(0x85bd8a),
  alpenglow: t.alpenglow ?? null,
  meadowDeep: t.meadowDeep ?? null,
});

// Palettes from PassportTheme.swift in the iOS app. Keep them in step with it.
export const THEMES: Theme[] = [
  theme({
    id: "default",
    name: "Meadow",
    park: null,
    sky: hex(0xd6e8f2),
    sun: hex(0xf8dfa0),
    ridgeFar: hex(0x9fb4d8),
    ridgeNear: hex(0x6e86b4),
    ground: hex(0xa9cfa6),
    alpenglow: hex(0xffe9bc),
  }),
  // Alpenglow on Rainier: lavender overhead, pink through the middle, coral along the
  // ridgeline, and the last of the sun still on the summits
  theme({
    id: "rainier",
    name: "Rainier",
    park: "Inspired by Mount Rainier",
    sky: hex(0xf7c6be),
    sun: hex(0xffd6a4),
    ridgeFar: hex(0xf0ac85),
    ridgeNear: hex(0xc2705e),
    ground: hex(0x8db078),
    skyTop: hex(0x9a97d6),
    skyMid: hex(0xf0a3be),
    skyHorizon: hex(0xffb48e),
    meadow: hex(0x8db078),
    accent: hex(0xa85a38),
    accentDark: hex(0xe5a183),
    alpenglow: hex(0xff5a2e),
  }),
  // The grove: bark brown and rust, a tan forest floor, sage greens, and a canopy sky
  // washed almost to white by the light coming through it
  theme({
    id: "redwood",
    name: "Redwood",
    park: "Inspired by Redwood",
    sky: hex(0xd5dedd),
    sun: hex(0xefeae0),
    ridgeFar: hex(0xa0522b),
    ridgeNear: hex(0x4a3123),
    ground: hex(0x87a365),
    skyTop: hex(0x9fbacb),
    skyMid: hex(0xc8d5d6),
    skyHorizon: hex(0xe6e4e2),
    meadow: hex(0x87a365),
    accent: hex(0x5c7a55),
    accentDark: hex(0x9bbf92),
    alpenglow: hex(0xf6eedc),
    meadowDeep: 0.3,
  }),
  // Northern dusk: indigo through violet to lavender, boreal green below
  theme({
    id: "voyageurs",
    name: "Voyageurs",
    park: "Inspired by Voyageurs",
    sky: hex(0xbfc4e2),
    sun: hex(0xf6f3fa),
    ridgeFar: hex(0x9e97c6),
    ridgeNear: hex(0x7e79ac),
    ground: hex(0x9fd4a4),
    skyTop: hex(0xb3b3e4),
    skyMid: hex(0xd4ceed),
    skyHorizon: hex(0xf1eff9),
    meadow: hex(0x7fba88),
    accent: hex(0x5a5788),
    accentDark: hex(0xa3a0d2),
    alpenglow: hex(0xffdcb0),
  }),
  // Desert sunset: slate overhead, rose through the middle, dusty mauve at the horizon
  theme({
    id: "saguaro",
    name: "Saguaro",
    park: "Inspired by Saguaro",
    sky: hex(0xe0bfc0),
    sun: hex(0xf0b9a8),
    ridgeFar: hex(0xc79aa4),
    ridgeNear: hex(0x8e5a63),
    ground: hex(0x8c9a6b),
    skyTop: hex(0x8fa0b0),
    skyMid: hex(0xe5899a),
    skyHorizon: hex(0xbe95a2),
    meadow: hex(0x8c9a6b),
    accent: hex(0x8b4c63),
    accentDark: hex(0xce9ca6),
    alpenglow: hex(0xe58c87),
  }),
  // The northern lights: indigo overhead, teal at the horizon, ribbons that move
  theme({
    id: "aurora",
    name: "Aurora",
    park: "Inspired by the northern lights",
    sky: hex(0xbbd9f2),
    sun: hex(0xbff3dc),
    ridgeFar: hex(0x7e9bc4),
    ridgeNear: hex(0x53709b),
    ground: hex(0x7fb894),
    skyTop: hex(0x8fbcec),
    skyMid: hex(0xbee4e2),
    skyHorizon: hex(0xe9f6ee),
    meadow: hex(0x85be7f),
    accent: hex(0x1e7a63),
    accentDark: hex(0x6fd8b4),
    alpenglow: hex(0xd6f7e6),
  }),
  // High desert noon: saturated blue overhead, bleached at the horizon
  theme({
    id: "white-sands",
    name: "White Sands",
    park: "Inspired by White Sands",
    sky: hex(0xa9cbe6),
    sun: hex(0xfcf3d2),
    ridgeFar: hex(0xf6f2ea),
    ridgeNear: hex(0xded7c9),
    ground: hex(0xf2eee2),
    skyTop: hex(0x66a8e6),
    skyHorizon: hex(0xf0f6fa),
    accent: hex(0x2b6ca8),
    accentDark: hex(0x7fbce8),
    alpenglow: hex(0xfff6da),
  }),
];

export const themeById = (id: string | null | undefined) =>
  THEMES.find((t) => t.id === id) ?? THEMES[0];

function stampInk(t: Theme): RGB {
  let ink = adjusted(t.ridgeNear, 0.12, 0);
  for (let i = 0; luminance(ink) > 0.24 && i < 12; i++)
    ink = mix(ink, BLACK, 0.16);
  return ink;
}
const stampPaper = (t: Theme) => mix(t.sun, WHITE, 0.62);

// ════════════════════════════════════════════════════════════════
//  Sky clock (SkyClock.swift)
// ════════════════════════════════════════════════════════════════

export class SkyClock {
  constructor(readonly hour: number) {}

  static now() {
    const d = new Date();
    return new SkyClock(d.getHours() + d.getMinutes() / 60);
  }

  get isNight() {
    return this.hour < 5.5 || this.hour >= 20.5;
  }

  get sun() {
    const t = clamp01((this.hour - 5.5) / 14.5);
    return { x: 0.08 + 0.84 * t, y: 0.88 - 0.8 * Math.sin(Math.PI * t) };
  }

  get warmth() {
    if (this.isNight) return 0;
    const fromNoon = Math.abs(this.hour - 12.5) / 8;
    return clamp01((fromNoon - 0.35) / 0.65);
  }

  private static keys = [
    {
      hour: 5.5,
      top: rgb(0.36, 0.42, 0.68),
      horizon: rgb(0.99, 0.74, 0.58),
      glow: rgb(1, 0.78, 0.52),
    },
    {
      hour: 8.0,
      top: rgb(0.36, 0.62, 0.9),
      horizon: rgb(0.94, 0.9, 0.78),
      glow: rgb(1, 0.9, 0.62),
    },
    {
      hour: 12.5,
      top: rgb(0.28, 0.58, 0.94),
      horizon: rgb(0.8, 0.91, 0.98),
      glow: rgb(1, 0.96, 0.78),
    },
    {
      hour: 17.0,
      top: rgb(0.34, 0.58, 0.88),
      horizon: rgb(0.93, 0.86, 0.7),
      glow: rgb(1, 0.86, 0.56),
    },
    {
      hour: 19.5,
      top: rgb(0.42, 0.4, 0.66),
      horizon: rgb(0.99, 0.66, 0.42),
      glow: rgb(1, 0.7, 0.4),
    },
    {
      hour: 20.5,
      top: rgb(0.05, 0.09, 0.22),
      horizon: rgb(0.2, 0.3, 0.48),
      glow: rgb(0.8, 0.86, 1),
    },
  ];

  private blend(pick: (k: (typeof SkyClock.keys)[number]) => RGB): RGB {
    const keys = SkyClock.keys;
    const last = keys[keys.length - 1];
    if (this.hour < keys[0].hour || this.hour >= last.hour) return pick(last);
    for (let i = 1; i < keys.length; i++) {
      if (this.hour < keys[i].hour) {
        const a = keys[i - 1],
          b = keys[i];
        return mix(pick(a), pick(b), (this.hour - a.hour) / (b.hour - a.hour));
      }
    }
    return pick(last);
  }

  get skyTop() {
    return this.blend((k) => k.top);
  }
  get skyHorizon() {
    return this.blend((k) => k.horizon);
  }
  get glow() {
    return this.blend((k) => k.glow);
  }
}

// ════════════════════════════════════════════════════════════════
//  Palette
// ════════════════════════════════════════════════════════════════

export type TimeOfDay = "day" | "dark" | "night";

interface Palette {
  skyTop: RGB;
  skyHorizon: RGB;
  skyMid: RGB | null;
  sunDisc: RGB;
  sunGlow: RGB;
  sunGlowAlpha: number;
  haze: RGB;
  ridgeFarthest: RGB;
  ridgeFar: RGB;
  ridgeMid: RGB;
  ridgeNear: RGB;
  ridgeDoneFar: RGB;
  ridgeDoneNear: RGB;
  ridgeBase: RGB;
  flag: RGB;
  bands: RGB[];
  treeline: RGB;
  pines: RGB[];
  trail: RGB;
  trailEdge: RGB;
  signPost: RGB;
  stampInk: RGB;
  stampPaper: RGB;
  goalInk: RGB;
  stars: boolean;
  usesClockSky: boolean;
  hazeStrength: number;
}

interface RockSet {
  farthest: RGB;
  far: RGB;
  mid: RGB;
  near: RGB;
  doneFar: RGB;
  doneNear: RGB;
}

const Rock = (() => {
  const doneFar = rgb(0.62, 0.65, 0.65),
    doneNear = rgb(0.46, 0.5, 0.51);
  const doneFarDark = rgb(0.4, 0.44, 0.45),
    doneNearDark = rgb(0.29, 0.33, 0.34);
  return {
    day: {
      farthest: rgb(0.66, 0.7, 0.72),
      far: rgb(0.55, 0.6, 0.62),
      mid: rgb(0.46, 0.51, 0.51),
      near: rgb(0.38, 0.44, 0.43),
      doneFar,
      doneNear,
    } as RockSet,
    aurora: {
      farthest: rgb(0.64, 0.68, 0.84),
      far: rgb(0.54, 0.58, 0.78),
      mid: rgb(0.44, 0.48, 0.7),
      near: rgb(0.35, 0.39, 0.62),
      doneFar,
      doneNear,
    } as RockSet,
    auroraDark: {
      farthest: rgb(0.37, 0.4, 0.6),
      far: rgb(0.3, 0.33, 0.53),
      mid: rgb(0.24, 0.26, 0.45),
      near: rgb(0.18, 0.2, 0.37),
      doneFar: doneFarDark,
      doneNear: doneNearDark,
    } as RockSet,
    dark: {
      farthest: rgb(0.4, 0.46, 0.5),
      far: rgb(0.32, 0.38, 0.42),
      mid: rgb(0.25, 0.31, 0.34),
      near: rgb(0.19, 0.25, 0.27),
      doneFar: doneFarDark,
      doneNear: doneNearDark,
    } as RockSet,
    doneFarDark,
    doneNearDark,
  };
})();

const DEFAULT = THEMES[0];

const DAY: Palette = {
  skyTop: rgb(0.4, 0.6, 0.8),
  skyHorizon: rgb(0.84, 0.89, 0.92),
  skyMid: null,
  sunDisc: rgb(1, 0.97, 0.86),
  sunGlow: rgb(1, 0.94, 0.7),
  sunGlowAlpha: 1,
  haze: rgb(0.94, 0.97, 1),
  // The same natural rock every themed passport draws
  ridgeFarthest: Rock.day.farthest,
  ridgeFar: Rock.day.far,
  ridgeMid: Rock.day.mid,
  ridgeNear: Rock.day.near,
  ridgeDoneFar: Rock.day.doneFar,
  ridgeDoneNear: Rock.day.doneNear,
  ridgeBase: rgb(0.34, 0.52, 0.38),
  flag: rgb(0.84, 0.2, 0.16),
  bands: [
    rgb(0.6, 0.74, 0.46),
    rgb(0.54, 0.69, 0.42),
    rgb(0.47, 0.62, 0.38),
    rgb(0.41, 0.55, 0.34),
  ],
  treeline: rgb(0.19, 0.35, 0.28),
  pines: [rgb(0.18, 0.34, 0.27), rgb(0.14, 0.29, 0.23), rgb(0.11, 0.24, 0.19)],
  trail: rgb(0.945, 0.891, 0.766),
  trailEdge: rgb(0.78, 0.7, 0.58),
  signPost: rgb(0.55, 0.42, 0.28),
  stampInk: stampInk(DEFAULT),
  stampPaper: stampPaper(DEFAULT),
  goalInk: rgb(0.14, 0.18, 0.3),
  stars: false,
  usesClockSky: true,
  hazeStrength: 0,
};

const NIGHT: Palette = {
  skyTop: rgb(0.05, 0.09, 0.22),
  skyHorizon: rgb(0.2, 0.3, 0.48),
  skyMid: null,
  sunDisc: rgb(0.96, 0.96, 0.9),
  sunGlow: rgb(0.8, 0.86, 1),
  sunGlowAlpha: 1,
  haze: rgb(0.6, 0.7, 0.9),
  ridgeFarthest: rgb(0.3, 0.4, 0.58),
  ridgeFar: rgb(0.26, 0.32, 0.48),
  ridgeMid: rgb(0.16, 0.22, 0.36),
  ridgeNear: rgb(0.09, 0.19, 0.23),
  ridgeDoneFar: Rock.doneFarDark,
  ridgeDoneNear: Rock.doneNearDark,
  ridgeBase: rgb(0.1, 0.22, 0.26),
  flag: rgb(0.96, 0.8, 0.34),
  bands: [
    rgb(0.14, 0.3, 0.28),
    rgb(0.12, 0.26, 0.24),
    rgb(0.1, 0.22, 0.2),
    rgb(0.08, 0.18, 0.16),
  ],
  treeline: rgb(0.16, 0.32, 0.28),
  pines: [rgb(0.16, 0.32, 0.28), rgb(0.13, 0.27, 0.24), rgb(0.1, 0.22, 0.19)],
  trail: rgb(0.72, 0.68, 0.58),
  trailEdge: rgb(0.48, 0.44, 0.36),
  signPost: rgb(0.4, 0.3, 0.2),
  stampInk: mix(stampInk(DEFAULT), WHITE, 0.12),
  stampPaper: stampPaper(DEFAULT),
  goalInk: rgb(0.86, 0.9, 1),
  stars: true,
  usesClockSky: false,
  hazeStrength: 0,
};

function deepened(p: Palette, clock: SkyClock, rock?: RockSet): Palette {
  const shade = rgb(0.06, 0.08, 0.14);
  const d = (c: RGB, amount = 0.42) => mix(c, shade, amount);
  const top = p.usesClockSky ? clock.skyTop : p.skyTop;
  const horizon = p.usesClockSky ? clock.skyHorizon : p.skyHorizon;
  return {
    ...p,
    skyTop: d(top, 0.55),
    skyHorizon: d(horizon, 0.4),
    skyMid: p.skyMid && d(p.skyMid, 0.48),
    sunGlowAlpha: 0.6,
    haze: d(p.haze, 0.35),
    ridgeFarthest: rock?.farthest ?? d(p.ridgeFarthest),
    ridgeFar: rock?.far ?? d(p.ridgeFar),
    ridgeMid: rock?.mid ?? d(p.ridgeMid),
    ridgeNear: rock?.near ?? d(p.ridgeNear),
    ridgeDoneFar: rock?.doneFar ?? d(p.ridgeDoneFar, 0.3),
    ridgeDoneNear: rock?.doneNear ?? d(p.ridgeDoneNear, 0.3),
    ridgeBase: d(p.ridgeBase),
    bands: p.bands.map((c) => d(c, 0.45)),
    treeline: d(p.treeline, 0.3),
    pines: p.pines.map((c) => d(c, 0.3)),
    trail: d(p.trail, 0.18),
    trailEdge: d(p.trailEdge, 0.18),
    goalInk: NIGHT.goalInk,
    stars: false,
    usesClockSky: false,
    hazeStrength: p.hazeStrength * 0.45,
  };
}

function themed(t: Theme, night: boolean): Palette {
  const pale = luminance(t.ground) > 0.72;
  const groundHue = toHsb(t.meadow ?? t.ground)[0];
  if (night) return themedNight(t, pale, groundHue);
  let bands: RGB[], base: RGB, pines: RGB[];
  const m = t.meadow ?? (pale ? t.ground : null);
  if (m) {
    const deep = t.meadowDeep ?? (pale ? 0.12 : 0.2);
    bands = [
      mix(m, WHITE, 0.08),
      m,
      mix(m, BLACK, deep / 2),
      mix(m, BLACK, deep),
    ];
    base = mix(m, BLACK, 0.25);
    pines = pale
      ? DAY.pines
      : [mix(m, BLACK, 0.45), mix(m, BLACK, 0.55), mix(m, BLACK, 0.65)];
  } else {
    bands = DAY.bands.map((c) => withHue(c, groundHue));
    base = withHue(DAY.ridgeBase, groundHue);
    pines = DAY.pines.map((c) => withHue(c, groundHue));
  }
  const rock = t.id === "aurora" ? Rock.aurora : Rock.day;
  return {
    ...DAY,
    skyTop: t.skyTop,
    skyHorizon: t.skyHorizon,
    skyMid: t.skyMid,
    sunDisc: t.sun,
    sunGlow: t.sun,
    haze: mix(t.skyHorizon, WHITE, 0.1),
    ridgeFarthest: rock.farthest,
    ridgeFar: rock.far,
    ridgeMid: rock.mid,
    ridgeNear: rock.near,
    ridgeDoneFar: rock.doneFar,
    ridgeDoneNear: rock.doneNear,
    ridgeBase: base,
    bands,
    treeline: pines[0],
    pines,
    trail: pale ? mix(DAY.trail, BLACK, 0.22) : DAY.trail,
    trailEdge: pale ? mix(DAY.trailEdge, BLACK, 0.22) : DAY.trailEdge,
    stampInk: stampInk(t),
    stampPaper: stampPaper(t),
    goalInk: rgb(0.16, 0.2, 0.24),
    usesClockSky: false,
    hazeStrength: 1,
  };
}

function themedNight(t: Theme, pale: boolean, groundHue: number): Palette {
  const n = NIGHT;
  const r = t.id === "aurora" ? Rock.auroraDark : null;
  const skyHue = toHsb(t.sky)[0];
  const groundSat = pale ? -0.42 : 0;
  const pines = n.pines.map((c) =>
    adjusted(withHue(c, groundHue), groundSat, 0),
  );
  const haze = mix(withHue(n.skyHorizon, skyHue), n.skyHorizon, 0.4);
  // The theme's own ramp taken down into the dark rather than a generic navy: Rainier
  // stays lavender into rose, Saguaro stays plum. The horizon keeps the most colour.
  const ink = rgb(0.05, 0.07, 0.16);
  return {
    ...n,
    skyTop: mix(t.skyTop, ink, 0.8),
    skyMid: mix(t.skyMid ?? t.sky, ink, 0.74),
    skyHorizon: mix(t.skyHorizon, ink, 0.62),
    haze,
    ridgeFarthest: r?.farthest ?? n.ridgeFarthest,
    ridgeFar: r?.far ?? n.ridgeFar,
    ridgeMid: r?.mid ?? n.ridgeMid,
    ridgeNear: r?.near ?? n.ridgeNear,
    ridgeDoneFar: r?.doneFar ?? n.ridgeDoneFar,
    ridgeDoneNear: r?.doneNear ?? n.ridgeDoneNear,
    ridgeBase: adjusted(withHue(n.ridgeBase, groundHue), groundSat, 0),
    bands: n.bands.map((c) => adjusted(withHue(c, groundHue), groundSat, 0)),
    treeline: pines[0],
    pines,
    stampInk: stampInk(t),
    stampPaper: stampPaper(t),
    stars: true,
    usesClockSky: false,
    hazeStrength: 0.6,
  };
}

function paletteFor(t: Theme, time: TimeOfDay, clock: SkyClock): Palette {
  const isDefault = t.id === "default";
  switch (time) {
    case "day":
      return isDefault ? DAY : themed(t, false);
    case "dark":
      return isDefault
        ? deepened(DAY, clock)
        : deepened(
            themed(t, false),
            clock,
            t.id === "aurora" ? Rock.auroraDark : Rock.dark,
          );
    case "night":
      return isDefault ? NIGHT : themed(t, true);
  }
}

// ════════════════════════════════════════════════════════════════
//  Scene data
// ════════════════════════════════════════════════════════════════

export interface Hike {
  id: string;
  name: string;
  /** Summit elevation, feet. */
  elevation: number;
  /** Elevation gain, feet. */
  gain: number;
  difficulty?: string;
  /** "AUG 16" once summited. */
  completed?: string | null;
}

export interface Milestone {
  id: string;
  label: string;
  achieved: boolean;
  detected?: boolean;
}

export interface SceneData {
  hikes: Hike[];
  milestones: Milestone[];
  /** 0…1 from the last done sign toward the next. */
  progressToNext: number;
  /** Buddy art that keeps camp. */
  buddy?: { src: string; name: string } | null;
}

export interface HitTarget {
  kind: "hike" | "milestone";
  id: string;
  label: string;
  /** CSS pixels, relative to the canvas. */
  x: number;
  y: number;
  w: number;
  h: number;
}

// ════════════════════════════════════════════════════════════════
//  Helpers
// ════════════════════════════════════════════════════════════════

type Pt = { x: number; y: number };

function fnv(str: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A seeded random stream with the `random(in:)` shape the Swift code uses. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  const next = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return (lo: number, hi: number) => lo + next() * (hi - lo);
}

const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};
const backOut = (t: number) => {
  const x = clamp01(t) - 1;
  return 1 + 2.7 * x * x * x + 1.7 * x * x;
};

const FONT = '"National Park", "Avenir Next", system-ui, sans-serif';
const font = (weight: number, size: number) =>
  `${weight} ${size.toFixed(2)}px ${FONT}`;

const isMountain = (h: Hike) =>
  h.elevation >= 4000 ||
  h.gain >= 2000 ||
  (h.difficulty ?? "").toLowerCase() === "hard";

function stampName(name: string) {
  let s = name.toUpperCase();
  for (const [long, short] of [
    ["MOUNTAIN ", "MTN "],
    ["MOUNT ", "MT "],
    [" TRAIL", ""],
    [" PEAK", ""],
    [" LOOP", ""],
    [" LAKE", " LK"],
  ]) {
    s = s.split(long).join(short);
  }
  s = s.trim();
  const limit = 13;
  if (s.length > limit && (s.startsWith("MT ") || s.startsWith("MTN ")))
    s = s.slice(s.indexOf(" ") + 1).trim();
  if (s.length > limit) {
    let out = "";
    for (const w of s.split(" ")) {
      const next = out ? `${out} ${w}` : w;
      if (next.length > limit) break;
      out = next;
    }
    s = out || s.slice(0, limit - 1) + ".";
  }
  return s;
}

function scallopedDisc(r: number, bumps = 20, depth = 0.055) {
  const p = new Path2D();
  const steps = bumps * 10;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const rr = r * (1 + depth * Math.cos(bumps * a));
    const x = Math.cos(a) * rr,
      y = Math.sin(a) * rr;
    i === 0 ? p.moveTo(x, y) : p.lineTo(x, y);
  }
  p.closePath();
  return p;
}

const circle = (x: number, y: number, r: number) => {
  const p = new Path2D();
  p.arc(x, y, r, 0, Math.PI * 2);
  return p;
};

function roundedPolygon(pts: Pt[], radius: number) {
  const path = new Path2D();
  const n = pts.length;
  const unit = (a: Pt, b: Pt) => {
    const dx = b.x - a.x,
      dy = b.y - a.y,
      len = Math.max(Math.hypot(dx, dy), 0.001);
    return { x: dx / len, y: dy / len };
  };
  for (let i = 0; i < n; i++) {
    const prev = pts[(i - 1 + n) % n],
      cur = pts[i],
      next = pts[(i + 1) % n];
    const inDir = unit(cur, prev),
      outDir = unit(cur, next);
    const start = { x: cur.x + inDir.x * radius, y: cur.y + inDir.y * radius };
    const end = { x: cur.x + outDir.x * radius, y: cur.y + outDir.y * radius };
    i === 0 ? path.moveTo(start.x, start.y) : path.lineTo(start.x, start.y);
    path.quadraticCurveTo(cur.x, cur.y, end.x, end.y);
  }
  path.closePath();
  return path;
}

function roundRect(x: number, y: number, w: number, h: number, r: number) {
  const p = new Path2D();
  const rr = Math.min(r, w / 2, h / 2);
  p.moveTo(x + rr, y);
  p.arcTo(x + w, y, x + w, y + h, rr);
  p.arcTo(x + w, y + h, x, y + h, rr);
  p.arcTo(x, y + h, x, y, rr);
  p.arcTo(x, y, x + w, y, rr);
  p.closePath();
  return p;
}

const translated = (path: Path2D, dy: number) => {
  const p = new Path2D();
  p.addPath(path, new DOMMatrix().translate(0, dy));
  return p;
};

// CampArt.swift: the tent as paths, so the fabric takes the theme's colors.
const TENT_BOUNDS = { x: 383.5312, y: 716.168, w: 777.168, h: 458.1992 };
const TENT_ASPECT = TENT_BOUNDS.w / TENT_BOUNDS.h;
type TentRole = "light" | "shade" | "flap" | "doorway" | "stake";
const TENT_PARTS: [TentRole, number, string][] = [
  [
    "stake",
    1,
    "M 411.17 1157.37 C 410.09 1153.41 408.5 1147.17 406.99 1139.34 C 405.1 1129.55 405.06 1126.18 401.99 1123.75 C 396.98 1119.79 387.22 1121.16 384.86 1125.62 C 383.53 1128.1 384.96 1130.65 389.54 1140.89 C 392.61 1147.79 394.97 1153.37 396.4 1156.79 C 401.31 1156.98 406.24 1157.18 411.17 1157.37 Z",
  ],
  [
    "shade",
    1,
    "M 644.62 716.17 C 678.75 794.04 721.06 879.23 773.65 968.5 C 817.54 1043.02 862.29 1109.66 905.58 1168.64 C 946.59 1167.5 989.67 1165.18 1034.61 1161.39 C 1074.75 1157.99 1113.21 1153.68 1149.86 1148.71 C 1103.7 1090.3 1053.49 1018.1 1006.33 931.53 C 968.29 861.68 939.34 795.6 917.16 736.46 C 878.38 740.19 831.81 741.85 779.43 737.91 C 727.57 734.02 682.16 725.54 644.62 716.17 Z",
  ],
  [
    "light",
    1,
    "M 644.62 716.17 C 611.32 803 565.21 902.24 500.73 1006.23 C 465.84 1062.48 430.09 1112.79 395.26 1157.41 C 565.38 1161.16 735.48 1164.89 905.6 1168.64 C 861.24 1108.23 815.23 1039.58 770.15 962.51 C 719.13 875.33 677.96 792.22 644.62 716.17 Z",
  ],
  [
    "flap",
    1,
    "M 644.62 716.17 C 658.88 771.66 678.6 834.05 706.2 900.7 C 741.1 984.96 780.32 1056.07 817.12 1113.88 C 804.81 1117.12 788.75 1122.61 771.45 1132.37 C 752.49 1143.07 738.55 1155.19 729.12 1164.75 C 708.09 1091.5 688.42 1010.14 672.51 921.37 C 659.48 848.74 650.54 780.07 644.62 716.17 Z",
  ],
  [
    "flap",
    1,
    "M 644.62 716.17 C 628.21 785.56 602.1 868.82 559.41 958.37 C 531.79 1016.3 502.1 1066.59 473.54 1109.32 C 487.01 1112.95 503.03 1118.45 520.27 1126.96 C 542.54 1137.97 559.87 1150.59 572.49 1161.33 C 587.07 1078.54 601.23 994.58 614.86 909.43 C 625.27 844.43 635.19 780.01 644.62 716.17 Z",
  ],
  [
    "doorway",
    1,
    "M 729.1 1164.77 C 676.9 1163.61 624.68 1162.45 572.46 1161.31 C 574.46 1150.09 576.4 1138.88 578.37 1127.61 C 588.23 1070.98 597.89 1013.81 607.3 956.07 C 620.5 875.23 632.93 795.22 644.62 716.17 C 651.64 791.8 662.87 874.44 680.24 962.62 C 691.07 1017.5 703.24 1069.4 716.21 1118.18 C 720.44 1134.01 724.75 1149.55 729.1 1164.77 Z",
  ],
  [
    "light",
    0.3,
    "M 729.1 1164.77 C 676.9 1163.61 624.68 1162.45 572.46 1161.31 C 574.46 1150.09 576.4 1138.88 578.37 1127.61 C 602.55 1125.24 627.4 1123.19 652.91 1121.51 C 674.43 1120.08 695.55 1118.98 716.21 1118.15 C 720.44 1134.01 724.75 1149.55 729.1 1164.77 Z",
  ],
  [
    "stake",
    1,
    "M 902 1172.89 C 903.07 1168.93 904.67 1162.7 906.18 1154.86 C 908.07 1145.08 908.11 1141.7 911.18 1139.27 C 916.19 1135.32 925.93 1136.68 928.31 1141.14 C 929.64 1143.63 928.21 1146.18 923.63 1156.42 C 920.56 1163.32 918.2 1168.89 916.77 1172.31 C 915.36 1172.98 913.1 1173.85 910.22 1174.07 C 906.54 1174.37 903.59 1173.5 902 1172.89 Z",
  ],
  [
    "stake",
    1,
    "M 1139.67 1151.84 C 1140.5 1148.83 1141.7 1144.06 1142.86 1138.09 C 1144.29 1130.63 1144.33 1128.06 1146.65 1126.21 C 1150.46 1123.21 1157.9 1124.25 1159.71 1127.65 C 1160.7 1129.53 1159.63 1131.48 1156.14 1139.3 C 1153.8 1144.56 1152 1148.81 1150.92 1151.4 C 1149.84 1151.92 1148.13 1152.56 1145.93 1152.75 C 1143.13 1152.98 1140.89 1152.29 1139.67 1151.84 Z",
  ],
];

function tentColors(t: Theme): Record<TentRole, RGB> {
  const stake = rgb(0.529, 0.267, 0.09);
  if (t.id === "default") {
    return {
      light: rgb(0.973, 0.702, 0.204),
      shade: rgb(0.918, 0.62, 0.141),
      flap: rgb(0.886, 0.439, 0.102),
      doorway: stake,
      stake,
    };
  }
  let light = mix(t.sun, t.ridgeNear, 0.3);
  if (luminance(light) > 0.8) light = mix(t.sun, t.ridgeNear, 0.55);
  return {
    light,
    shade: mix(light, BLACK, 0.16),
    flap: mix(light, BLACK, 0.3),
    doorway: mix(light, BLACK, 0.52),
    stake,
  };
}

// ════════════════════════════════════════════════════════════════
//  Scene
// ════════════════════════════════════════════════════════════════

interface Ridge {
  hike: Hike;
  peakX: number;
  peakY: number;
  amplitude: number;
  depth: number;
  seed: number;
  mountain: boolean;
  r: number;
  stamp: Pt;
}

interface SignPlacement {
  m: Milestone;
  label: string;
  base: Pt;
  scale: number;
  frame: { x: number; y: number; w: number; h: number };
  trailY: number;
}

interface Decor {
  kind: "tent" | "backpack" | "firepit" | "buddy";
  base: Pt;
  height: number;
  box: DOMRect;
}

type Layout = {
  stackTop: number;
  horizon: number;
  peakXs: number[];
  wide: boolean;
};

export interface SceneOptions {
  theme?: string;
  time?: TimeOfDay | "auto";
  reduceMotion?: boolean;
  onTargets?: (targets: HitTarget[]) => void;
}

export class PassportScene {
  private ctx: CanvasRenderingContext2D;
  private scene = document.createElement("canvas");
  /** The aurora's lights, drawn small and stretched: the upscale is the glow. */
  private lights = document.createElement("canvas");
  private sctx = this.scene.getContext("2d")!;
  private cssW = 0;
  private cssH = 0;
  private dpr = 1;
  /** Logical scale: everything is drawn in a space `cssW / k` wide. */
  private k = 1;
  private w = 0;
  private h = 0;
  private layout: Layout = {
    stackTop: 0.4,
    horizon: 0.66,
    peakXs: [0.34, 0.68, 0.5],
    wide: false,
  };

  theme: Theme;
  timeMode: TimeOfDay | "auto";
  private data: SceneData;
  private images: Record<string, HTMLImageElement> = {};
  private sprites = new Map<string, HTMLCanvasElement>();
  private reduceMotion: boolean;
  private onTargets?: (t: HitTarget[]) => void;

  private reveal = 0;
  private revealStart = 0;
  private slam: { id: string; start: number } | null = null;
  private stampDrop = 1;
  private raf = 0;
  private visible = true;
  private dirty = true;
  private hasFilter: boolean;

  constructor(
    private canvas: HTMLCanvasElement,
    data: SceneData,
    opts: SceneOptions = {},
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.data = data;
    this.theme = themeById(opts.theme);
    this.timeMode = opts.time ?? "auto";
    this.reduceMotion = !!opts.reduceMotion;
    this.onTargets = opts.onTargets;
    this.hasFilter = typeof this.ctx.filter === "string";
    this.reveal = this.reduceMotion ? 1 : 0;
  }

  // ── Public API ────────────────────────────────────────────────

  async start(assets: Record<string, string>) {
    await Promise.all([
      ...Object.entries(assets).map(
        ([key, src]) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => {
              this.images[key] = img;
              resolve();
            };
            img.onerror = () => resolve();
            img.src = src;
          }),
      ),
      document.fonts?.load(font(800, 16)).catch(() => {}),
      document.fonts?.load(font(700, 16)).catch(() => {}),
      document.fonts?.load(font(600, 16)).catch(() => {}),
    ]);
    this.resize();
    new ResizeObserver(() => this.resize()).observe(this.canvas);
    new IntersectionObserver(([e]) => {
      this.visible = e.isIntersecting;
      if (this.visible) this.kick();
    }).observe(this.canvas);
    this.revealStart = performance.now();
    this.kick();
  }

  get timeOfDay(): TimeOfDay {
    const clock = SkyClock.now();
    if (this.timeMode !== "auto") return this.timeMode;
    if (clock.isNight) return "night";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "day";
  }

  setTheme(id: string) {
    this.theme = themeById(id);
    this.invalidate();
  }

  /**
   * The right edge of the headline's buttons, in CSS pixels from the canvas's left edge.
   * On wide screens the ranges start at the gap in the treeline left of the trail, and
   * never further left than this, so no mountain stands behind the buttons.
   */
  setSkylineLeft(cssX: number) {
    const x = Math.max(0, Math.round(cssX));
    if (x === this.skylineLeftCss) return;
    this.skylineLeftCss = x;
    this.invalidate();
  }

  private skylineLeftCss = 0;

  /** The skyline's left edge in logical units; 0 means edge to edge. */
  private get skyLeft() {
    if (!this.layout.wide) return 0;
    const trailGap = this.w * 0.5 - this.treelineGap;
    return Math.min(
      Math.max(this.skylineLeftCss / this.k, trailGap),
      this.w * 0.6,
    );
  }

  /** Half the opening in the treeline where the trail reaches the mountains. */
  private get treelineGap() {
    return Math.max(this.w * 0.06 * Math.max(this.swing, 0.6), 22);
  }

  setTime(mode: TimeOfDay | "auto") {
    this.timeMode = mode;
    this.invalidate();
  }

  /** Stamp a goal summit (or re-stamp a summited one) with the slam animation. */
  stamp(id: string) {
    const hike = this.data.hikes.find((h) => h.id === id);
    if (!hike) return;
    if (!hike.completed) {
      hike.completed = new Date()
        .toLocaleDateString("en-US", { month: "short", day: "numeric" })
        .toUpperCase();
    }
    this.slam = { id, start: performance.now() };
    this.stampDrop = this.reduceMotion ? 1 : 0;
    this.invalidate();
  }

  toggleMilestone(id: string) {
    const m = this.data.milestones.find((x) => x.id === id);
    if (!m) return;
    m.achieved = !m.achieved;
    this.invalidate();
  }

  /** The text color that reads on this sky, for the headline laid over it. */
  get skyInk(): "light" | "dark" {
    const p = this.palette();
    const top = p.usesClockSky ? SkyClock.now().skyTop : p.skyTop;
    return luminance(mix(top, p.skyMid ?? p.skyHorizon, 0.35)) > 0.62
      ? "dark"
      : "light";
  }

  // ── Loop ──────────────────────────────────────────────────────

  private invalidate() {
    this.dirty = true;
    this.kick();
  }

  private kick() {
    if (!this.raf) this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  private frame(now: number) {
    this.raf = 0;
    if (!this.visible || !this.w) return;

    let animating = false;
    if (this.reveal < 1) {
      this.reveal = clamp01((now - this.revealStart) / 2600);
      this.dirty = true;
      animating = this.reveal < 1;
    }
    if (this.slam && this.stampDrop < 1) {
      this.stampDrop = clamp01((now - this.slam.start) / 650);
      this.dirty = true;
      animating ||= this.stampDrop < 1;
    }

    const aurora = this.theme.id === "aurora";
    if (this.dirty) {
      this.sctx.setTransform(this.dpr * this.k, 0, 0, this.dpr * this.k, 0, 0);
      this.sctx.clearRect(0, 0, this.w, this.h);
      this.drawScene(this.sctx, !aurora);
      this.dirty = false;
      if (!animating) this.onTargets?.(this.targets());
    }

    const c = this.ctx;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (aurora) {
      c.setTransform(this.dpr * this.k, 0, 0, this.dpr * this.k, 0, 0);
      this.drawAurora(c, this.reduceMotion ? 0 : now / 1000);
      c.setTransform(1, 0, 0, 1, 0, 0);
    }
    c.drawImage(this.scene, 0, 0);

    if (animating || (aurora && !this.reduceMotion)) this.kick();
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    this.cssW = rect.width;
    this.cssH = rect.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.k = Math.min(1.4, Math.max(0.82, this.cssH / 800));
    this.w = this.cssW / this.k;
    this.h = this.cssH / this.k;
    for (const cv of [this.canvas, this.scene]) {
      cv.width = Math.round(this.cssW * this.dpr);
      cv.height = Math.round(this.cssH * this.dpr);
    }
    const wide = this.cssW >= 760 && this.cssW >= this.cssH * 1.05;
    this.layout = wide
      ? {
          stackTop: 0.3,
          horizon: 0.655,
          // Fractions of the sky right of the headline column
          peakXs: [0.4, 0.9, 0.66, 0.22, 0.55],
          wide,
        }
      : {
          stackTop: 0.53,
          horizon: 0.725,
          peakXs: [0.34, 0.7, 0.52, 0.18, 0.82],
          wide,
        };
    this.sprites.clear();
    this.invalidate();
  }

  /**
   * A soft shadow of whatever `draw` fills, without `ctx.filter`: a filtered fill blurs a
   * layer the size of the whole canvas, which stalls every frame of the entrance. The
   * shape is drawn far off to the left and only its shadow is thrown back into view.
   */
  private softShadow(
    c: CanvasRenderingContext2D,
    color: string,
    blur: number,
    draw: () => void,
  ) {
    const OFF = 20000;
    c.save();
    const scale = c.getTransform().a;
    c.shadowColor = color;
    c.shadowBlur = blur * 2 * scale;
    c.shadowOffsetX = OFF * scale;
    c.translate(-OFF, 0);
    c.fillStyle = "#000";
    draw();
    c.restore();
  }

  private palette() {
    return paletteFor(this.theme, this.timeOfDay, SkyClock.now());
  }

  // ── Layout ────────────────────────────────────────────────────

  private get sorted() {
    return [...this.data.hikes].sort((a, b) => b.elevation - a.elevation);
  }

  private hillsOnly() {
    const hikes = this.data.hikes;
    return hikes.length > 0 && !hikes.some(isMountain);
  }

  private ridges(): Ridge[] {
    const sorted = this.sorted;
    if (!sorted.length) return [];
    const { w, h } = this;
    const { horizon, stackTop, peakXs } = this.layout;
    const maxE = Math.max(...sorted.map((s) => s.elevation), 1);
    const n = sorted.length;
    const onlyHills = this.hillsOnly();
    const base = h * (horizon - 0.03);
    const maxRise = onlyHills ? h * 0.2 : base - h * stackTop;
    return sorted.map((hike, i) => {
      const rel = Math.pow(
        Math.min(1, Math.max(0.01, hike.elevation / maxE)),
        0.6,
      );
      const rise = onlyHills
        ? maxRise * (0.3 + 0.7 * rel)
        : maxRise * (0.08 + 0.92 * rel);
      const rank = n === 1 ? 0 : i / (n - 1);
      const peakY = base - rise + rank * h * 0.02;
      const mountain = isMountain(hike);
      const r = 27 + 5 * rank;
      const L = this.skyLeft;
      const f =
        n === 1 ? (this.layout.wide ? 0.55 : 0.5) : peakXs[i % peakXs.length];
      const peakX = L + (w - L) * f;
      return {
        hike,
        peakX,
        peakY,
        amplitude: rise * (mountain ? 0.85 : 0.9),
        depth: rank,
        seed: fnv(hike.id),
        mountain,
        r,
        stamp: { x: peakX, y: peakY - r * 0.7 },
      };
    });
  }

  private get meadowTop() {
    return this.layout.horizon - 0.012;
  }
  private meadowY(y: number) {
    const top = this.meadowTop;
    return top + ((y - 0.513) * (1.06 - top)) / (1.06 - 0.513);
  }
  private get sceneScale() {
    return Math.min(1, Math.max(0.55, this.h / 620));
  }
  /** How far the switchbacks and signs swing, so a wide meadow keeps a phone's proportions. */
  private get swing() {
    return Math.min(1, (0.78 * this.h) / this.w);
  }

  private trailHalfWidth(yFrac: number) {
    const top = this.meadowTop;
    const t = clamp01((yFrac - top) / (1 - top));
    return (1.5 + 21 * Math.pow(t, 1.6)) * this.sceneScale;
  }

  private spineCache: { key: string; pts: Pt[] } | null = null;
  private spine(): Pt[] {
    const key = `${this.w}|${this.h}|${this.layout.horizon}`;
    if (this.spineCache?.key === key) return this.spineCache.pts;
    const { w, h } = this;
    const swing = (0.55 + 0.45 * this.sceneScale) * this.swing;
    const P = (fx: number, fy: number): Pt => ({
      x: (0.5 + (fx - 0.5) * swing) * w,
      y: this.meadowY(fy) * h,
    });
    const segs: [Pt, Pt, Pt, Pt][] = [
      [P(0.5, 0.513), P(0.5, 0.53), P(0.43, 0.548), P(0.435, 0.578)],
      [P(0.435, 0.578), P(0.44, 0.605), P(0.61, 0.6), P(0.6, 0.648)],
      [P(0.6, 0.648), P(0.59, 0.695), P(0.3, 0.69), P(0.315, 0.757)],
      [P(0.315, 0.757), P(0.33, 0.825), P(0.74, 0.81), P(0.7, 0.897)],
      [P(0.7, 0.897), P(0.66, 0.975), P(0.38, 0.985), P(0.42, 1.07)],
    ];
    const pts: Pt[] = [];
    segs.forEach((sg, i) => {
      const steps = 30;
      for (let k = 0; k <= (i === segs.length - 1 ? steps : steps - 1); k++) {
        const t = k / steps,
          u = 1 - t;
        pts.push({
          x:
            u * u * u * sg[0].x +
            3 * u * u * t * sg[1].x +
            3 * u * t * t * sg[2].x +
            t * t * t * sg[3].x,
          y:
            u * u * u * sg[0].y +
            3 * u * u * t * sg[1].y +
            3 * u * t * t * sg[2].y +
            t * t * t * sg[3].y,
        });
      }
    });
    this.spineCache = { key, pts };
    return pts;
  }

  private signFrames(c: CanvasRenderingContext2D): SignPlacement[] {
    const { w, h } = this;
    const top = this.meadowTop;
    const spine = this.spine();
    const all = this.data.milestones.slice(0, 6);
    if (!all.length) return [];
    const bottom = this.meadowY(0.87) * h;
    const apex = this.meadowY(0.578) * h;
    const rows = Math.min(all.length, 6);
    const sideGap = rows > 2 ? ((bottom - apex) / (rows - 1)) * 2 : Infinity;
    const cap = Math.min(1.25, (sideGap - 6) / 72);
    const ys =
      rows === 1
        ? [bottom]
        : Array.from(
            { length: rows },
            (_, i) => bottom + ((apex - bottom) * i) / (rows - 1),
          );
    const maxBoard = Math.min(w / 2 - 10, 230);
    const spread = Math.max(w * 0.24 * this.swing, 86);
    const out: SignPlacement[] = [];
    all.forEach((m, i) => {
      const targetY = ys[i];
      let s = spine[0];
      for (const p of spine)
        if (Math.abs(p.y - targetY) < Math.abs(s.y - targetY)) s = p;
      const side = i % 2 === 0 ? 1 : -1;
      const progress = (s.y - h * top) / (h * (1 - top));
      const scale = Math.min((0.62 + 0.38 * progress) * 1.25, cap);

      c.font = font(700, 15 * scale);
      const width = (t: string) => Math.ceil(c.measureText(t).width);
      const padding = 16 * scale;
      const room = Math.max(34 * scale, maxBoard) - padding;
      let label = m.label;
      if (width(label) > room) {
        let chars = [...label];
        while (chars.length > 1 && width(chars.join("") + "…") > room)
          chars.pop();
        label = chars.join("").trim() + "…";
      }
      const bw = Math.min(
        Math.max(34 * scale, width(label) + padding),
        Math.max(34 * scale, maxBoard),
      );
      const bh = 46 * scale;

      const trailHalf = this.trailHalfWidth(s.y / h);
      let x =
        side > 0
          ? Math.max(s.x + trailHalf + 10 + bw / 2, w * 0.5 + spread)
          : Math.min(s.x - trailHalf - 10 - bw / 2, w * 0.5 - spread);
      x = Math.min(Math.max(x, bw / 2 + 6), w - bw / 2 - 6);
      const postH = 26 * scale;
      const base = { x, y: s.y + 8 };
      out.push({
        m,
        label,
        base,
        scale,
        frame: { x: x - bw / 2, y: base.y - postH - bh, w: bw, h: bh },
        trailY: s.y,
      });
    });
    return out;
  }

  private targets(): HitTarget[] {
    const k = this.k;
    const out: HitTarget[] = this.ridges().map((r) => ({
      kind: "hike",
      id: r.hike.id,
      label: r.hike.completed
        ? `${r.hike.name}, summited ${r.hike.completed.toLowerCase()}. Stamp it again`
        : `${r.hike.name}, goal hike, not yet summited. Stamp the summit`,
      x: (r.stamp.x - 38) * k,
      y: (r.stamp.y - 38) * k,
      w: 76 * k,
      h: 76 * k,
    }));
    for (const s of this.signFrames(this.sctx)) {
      out.push({
        kind: "milestone",
        id: s.m.id,
        label: `Milestone sign, ${s.m.label}, ${s.m.achieved ? "done" : s.m.detected ? "looks done" : "not done yet"}`,
        x: (s.frame.x - 6) * k,
        y: (s.frame.y - 4) * k,
        w: (s.frame.w + 12) * k,
        h: (s.base.y - s.frame.y + 4) * k,
      });
    }
    return out;
  }

  // ════════════════════════════════════════════════════════════════
  //  Drawing
  // ════════════════════════════════════════════════════════════════

  private drawScene(c: CanvasRenderingContext2D, withSky: boolean) {
    const p = this.palette();
    if (withSky) this.drawSky(c, p);
    this.drawSkyline(c, p);
    const meadow = easeOut((this.reveal - 0.1) / 0.45);
    if (meadow > 0) {
      c.save();
      c.globalAlpha = meadow;
      c.translate(0, (1 - meadow) * 36);
      this.drawMeadow(c, p);
      c.restore();
    }
  }

  // ── Sky ───────────────────────────────────────────────────────

  private drawSky(c: CanvasRenderingContext2D, p: Palette) {
    const { w, h } = this;
    const clock = SkyClock.now();
    const top = p.stars || !p.usesClockSky ? p.skyTop : clock.skyTop;
    const horizon =
      p.stars || !p.usesClockSky ? p.skyHorizon : clock.skyHorizon;
    const skyEnd = h * (this.layout.horizon - 0.06);
    const g = c.createLinearGradient(0, 0, 0, skyEnd);
    g.addColorStop(0, css(top));
    if (p.skyMid) g.addColorStop(0.55, css(p.skyMid));
    g.addColorStop(1, css(horizon));
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);

    if (p.stars) {
      const r = rng(1234);
      const count = Math.round(70 * Math.max(1, w / 390));
      for (let i = 0; i < count; i++) {
        const sx = r(0, 1) * w,
          sy = r(0.02, 0.5) * h,
          rad = r(0.6, 1.6);
        c.fillStyle = `rgba(255,255,255,${r(0.4, 0.95).toFixed(2)})`;
        c.fill(circle(sx, sy, rad));
      }
      // Crescent moon, clear of the headline
      const cx = this.layout.wide ? w * 0.9 : w * 0.84,
        cy = h * (this.layout.wide ? 0.16 : 0.13);
      const size = Math.min(w, h * 0.7);
      const glowR = size * 0.34;
      const glow = c.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      glow.addColorStop(0, css(p.sunGlow, 0.45));
      glow.addColorStop(1, css(p.sunGlow, 0));
      c.fillStyle = glow;
      c.fill(circle(cx, cy, glowR));
      const discR = size * 0.045;
      c.save();
      c.clip(circle(cx, cy, discR));
      const bite = new Path2D();
      bite.rect(cx - discR - 2, cy - discR - 2, discR * 2 + 4, discR * 2 + 4);
      bite.arc(
        cx + discR * 0.45,
        cy - discR * 0.25,
        discR * 0.85,
        0,
        Math.PI * 2,
      );
      c.fillStyle = css(p.sunDisc);
      c.fill(bite, "evenodd");
      c.restore();
    } else {
      const skyH = h * this.layout.horizon;
      const sx = w * clock.sun.x,
        sy = skyH * clock.sun.y;
      const glowC = p.usesClockSky ? clock.glow : p.sunGlow;
      const reach = Math.max(w, h) * (0.95 + 0.25 * clock.warmth);
      const g2 = c.createRadialGradient(sx, sy, 0, sx, sy, reach);
      const a = p.sunGlowAlpha;
      g2.addColorStop(0, css(glowC, (0.55 + 0.15 * clock.warmth) * a));
      g2.addColorStop(0.28, css(glowC, 0.25 * a));
      g2.addColorStop(1, css(glowC, 0));
      c.fillStyle = g2;
      c.fillRect(0, 0, w, h);
    }
  }

  // AuroraSky.swift
  private auroraPillars = (() => {
    const r = rng(20260910);
    const hues = [0, 0, 1, 0, 2, 1, 0, 2, 1, 0, 2];
    return hues.map((hue, i) => ({
      x: i / hues.length + r(-0.035, 0.035),
      width: r(0.035, 0.105),
      height: r(0.45, 1),
      hue,
      speed: r(0.22, 0.55),
      phase: r(0, 6.28),
      alpha: r(0.45, 0.95),
    }));
  })();

  private drawAurora(c: CanvasRenderingContext2D, time: number) {
    const { w, h } = this;
    const tod = this.timeOfDay;
    const dark = tod !== "day";
    const indigo = rgb(0.04, 0.08, 0.19);
    const shade = (x: RGB) =>
      tod === "day" ? x : mix(x, indigo, tod === "dark" ? 0.76 : 0.91);
    const t = this.theme;
    const skyBottom = h * (this.layout.horizon + 0.02);
    const g = c.createLinearGradient(0, 0, 0, skyBottom);
    g.addColorStop(0, css(shade(t.skyTop)));
    g.addColorStop(0.5, css(shade(t.skyMid ?? t.sky)));
    g.addColorStop(1, css(shade(t.skyHorizon)));
    c.fillStyle = g;
    c.fillRect(0, 0, w, skyBottom + 2);

    if (dark) {
      const r = rng(4711);
      const count = Math.round(
        (tod === "night" ? 110 : 70) * Math.max(1, w / 390),
      );
      for (let i = 0; i < count; i++) {
        const x = r(0, w),
          y = r(0, skyBottom * 0.92),
          rad = r(0.6, 1.8);
        const a = r(0.3, 0.95) * (tod === "night" ? 1 : 0.7);
        c.fillStyle = `rgba(235,245,255,${a.toFixed(2)})`;
        c.fill(circle(x, y, rad));
      }
    }

    // Everything below is pure glow, so it is drawn on a canvas a fraction of the size
    // and scaled up, which softens it far more cheaply than blurring at full size.
    const q = 0.18;
    const main = c;
    this.lights.width = Math.max(1, Math.round(this.cssW * q));
    this.lights.height = Math.max(1, Math.round(this.cssH * q));
    c = this.lights.getContext("2d")!;
    c.setTransform(this.k * q, 0, 0, this.k * q, 0, 0);
    c.clearRect(0, 0, w, h);

    const lights: RGB[] = dark
      ? [rgb(0.38, 1, 0.67), rgb(0.36, 0.94, 0.92), rgb(0.7, 0.52, 1)]
      : [rgb(0.09, 0.74, 0.48), rgb(0.06, 0.68, 0.76), rgb(0.48, 0.33, 0.86)];
    const blend: GlobalCompositeOperation = dark ? "lighter" : "source-over";
    const blur = (px: number) => {
      if (this.hasFilter)
        c.filter = `blur(${(px * this.k * q * 0.6).toFixed(2)}px)`;
    };
    const span = Math.min(w, h * 1.4);

    // Swirls
    const arcs = [
      { y: 0.3, amp: 0.085, waves: 1.15, speed: 0.2, hue: 0, alpha: 0.6 },
      { y: 0.19, amp: 0.07, waves: 1.55, speed: -0.15, hue: 2, alpha: 0.42 },
      { y: 0.42, amp: 0.06, waves: 0.85, speed: 0.11, hue: 1, alpha: 0.34 },
    ];
    arcs.forEach((a, i) => {
      const phase = time * a.speed + i * 2.1;
      const path = new Path2D();
      for (let x = -40, started = false; x <= w + 40; x += 6) {
        const tt = x / Math.max(w, 1);
        const y =
          skyBottom * a.y +
          h * a.amp * Math.sin(tt * Math.PI * 2 * a.waves + phase) +
          h *
            a.amp *
            0.35 *
            Math.sin(tt * Math.PI * 2 * a.waves * 2.1 - phase * 1.4);
        started ? path.lineTo(x, y) : (path.moveTo(x, y), (started = true));
      }
      c.save();
      c.globalCompositeOperation = blend;
      c.globalAlpha = a.alpha * (dark ? 1 : 0.72);
      blur(h * 0.026);
      c.lineCap = "round";
      c.strokeStyle = css(lights[a.hue], 0.75);
      c.lineWidth = h * 0.03;
      c.stroke(path);
      c.strokeStyle = css(lights[a.hue], dark ? 0.85 : 0.6);
      c.lineWidth = h * 0.009;
      c.stroke(path);
      c.restore();
    });

    // Pillars
    for (const pl of this.auroraPillars) {
      const sway = Math.sin(time * pl.speed + pl.phase) * span * 0.03;
      const breathe =
        0.8 + 0.2 * Math.sin(time * pl.speed * 1.6 + pl.phase * 1.9);
      const glow =
        0.55 + 0.45 * (0.5 + 0.5 * Math.sin(time * pl.speed * 1.25 + pl.phase));
      const foot = skyBottom * 0.64;
      const cx = pl.x * w + sway;
      const top = foot - foot * pl.height * breathe;
      const halfLow = pl.width * span * 0.5,
        halfHigh = halfLow * 1.45;
      const col = new Path2D();
      col.moveTo(cx - halfLow, foot + h * 0.03);
      col.lineTo(cx - halfHigh, top);
      col.lineTo(cx + halfHigh, top);
      col.lineTo(cx + halfLow, foot + h * 0.03);
      col.closePath();
      const lc = lights[pl.hue];
      const grad = c.createLinearGradient(0, top, 0, foot + h * 0.03);
      grad.addColorStop(0, css(lc, 0));
      grad.addColorStop(0.3, css(lc, 0.3));
      grad.addColorStop(0.86, css(lc, dark ? 0.85 : 0.72));
      grad.addColorStop(1, css(lc, dark ? 0.55 : 0.48));
      c.save();
      c.globalCompositeOperation = blend;
      c.globalAlpha = pl.alpha * glow * (dark ? 1 : 0.88);
      blur(span * 0.03);
      c.fillStyle = grad;
      c.fill(col);
      c.restore();
    }

    // Horizon glow
    const pulse = 0.82 + 0.18 * (0.5 + 0.5 * Math.sin(time * 0.17));
    c.save();
    c.globalCompositeOperation = blend;
    c.globalAlpha = (dark ? 0.42 : 0.22) * pulse;
    blur(h * 0.02);
    const hg = c.createLinearGradient(0, skyBottom - h * 0.2, 0, skyBottom);
    hg.addColorStop(0, css(lights[0], 0));
    hg.addColorStop(1, css(lights[0]));
    c.fillStyle = hg;
    c.fillRect(-10, skyBottom - h * 0.2, w + 20, h * 0.22);
    c.restore();

    main.save();
    main.setTransform(1, 0, 0, 1, 0, 0);
    main.globalCompositeOperation = blend;
    main.imageSmoothingQuality = "high";
    main.drawImage(this.lights, 0, 0, this.canvas.width, this.canvas.height);
    main.restore();
  }

  // ── Skyline ───────────────────────────────────────────────────

  private ridgeProfile(
    peakX: number,
    peakY: number,
    amplitude: number,
    seed: number,
    rounded: boolean,
  ) {
    const { w, h } = this;
    const r = rng(seed);
    const baseline = peakY + amplitude;
    const dome = (d: number) => 0.5 * (1 + Math.cos(Math.PI * Math.min(1, d)));
    // Flanks are measured against a span no wider than a phone's proportions allow,
    // so a wide screen gets separate peaks rather than one long gentle roll.
    const span = Math.min(w, h * 0.82);
    const samples = Math.max(72, Math.round(w / 10));
    const pts: Pt[] = [];
    // On wide screens the ranges still run the full width, but left of the trail they
    // settle into low foothills: the same rugged crest, flattened toward the ground,
    // so the tallest peak's flank rolls away naturally and stays under the headline's
    // buttons instead of stopping at a hard edge.
    const L = this.skyLeft;
    const sampleX = (i: number) => -0.02 * w + (1.04 * w * i) / samples;
    const ground = h * (this.layout.horizon + 0.01);
    const buttons = this.skylineLeftCss / this.k;
    const flatStart = Math.min(buttons, L) - w * 0.15;
    const flatEnd = L + span * 0.25;
    const taper = (x: number, y: number) => {
      if (L <= 0) return y;
      const t = Math.min(
        1,
        Math.max(0, (x - flatStart) / Math.max(1, flatEnd - flatStart)),
      );
      const f = 0.08 + 0.92 * (t * t * (3 - 2 * t));
      return ground + (y - ground) * f;
    };

    if (rounded) {
      const side = peakX < w * 0.5 ? 1 : -1;
      const secondX = Math.min(
        w * 1.05,
        Math.max(w * -0.05, peakX + side * span * r(0.55, 0.7)),
      );
      const secondHeight = r(0.62, 0.8);
      const mainHW = span * r(0.55, 0.7),
        secondHW = span * r(0.5, 0.65);
      for (let i = 0; i <= samples; i++) {
        const x = sampleX(i);
        const rel = Math.max(
          0.5,
          dome(Math.abs(x - peakX) / mainHW),
          secondHeight * dome(Math.abs(x - secondX) / secondHW),
        );
        pts.push({ x, y: taper(x, baseline - amplitude * rel) });
      }
    } else {
      const j = (s: number) => r(-s, s);
      let verts = [
        { x: -0.03 * w, rel: 0.1 + j(0.03) },
        { x: peakX - span * (0.46 + j(0.04)), rel: 0.26 + j(0.04) },
        { x: peakX - span * (0.37 + j(0.02)), rel: 0.42 + j(0.03) },
        { x: peakX - span * (0.27 + j(0.03)), rel: 0.48 + j(0.05) },
        { x: peakX - span * (0.18 + j(0.02)), rel: 0.67 + j(0.03) },
        { x: peakX - span * (0.11 + j(0.02)), rel: 0.76 + j(0.04) },
        { x: peakX - span * (0.05 + j(0.01)), rel: 0.9 + j(0.02) },
        { x: peakX, rel: 1 },
        { x: peakX + span * (0.05 + j(0.01)), rel: 0.89 + j(0.02) },
        { x: peakX + span * (0.1 + j(0.02)), rel: 0.77 + j(0.04) },
        { x: peakX + span * (0.17 + j(0.02)), rel: 0.66 + j(0.03) },
        { x: peakX + span * (0.26 + j(0.03)), rel: 0.47 + j(0.05) },
        { x: peakX + span * (0.36 + j(0.02)), rel: 0.41 + j(0.03) },
        { x: peakX + span * (0.45 + j(0.04)), rel: 0.25 + j(0.04) },
        { x: 1.03 * w, rel: 0.1 + j(0.03) },
      ];
      verts = verts
        .filter(
          (v) => (v.x > -0.03 * w - 1 && v.x < 1.03 * w + 1) || v.x === peakX,
        )
        .sort((a, b) => a.x - b.x);
      const relAt = (x: number) => {
        if (x <= verts[0].x) return verts[0].rel;
        const last = verts[verts.length - 1];
        if (x >= last.x) return last.rel;
        for (let k = 1; k < verts.length; k++) {
          if (x <= verts[k].x) {
            const a = verts[k - 1],
              b = verts[k];
            const t = (x - a.x) / Math.max(b.x - a.x, 0.001);
            return a.rel + (b.rel - a.rel) * t - 0.045 * Math.sin(t * Math.PI);
          }
        }
        return last.rel;
      };
      for (let i = 0; i <= samples; i++) {
        const x = sampleX(i);
        const d = Math.abs(x - peakX) / span;
        const jitter = r(-0.016, 0.016) * Math.min(1, d * 12);
        pts.push({
          x,
          y: taper(
            x,
            baseline -
              amplitude * Math.min(1, Math.max(0.06, relAt(x) + jitter)),
          ),
        });
      }
      let best = 0;
      pts.forEach((p, i) => {
        if (Math.abs(p.x - peakX) < Math.abs(pts[best].x - peakX)) best = i;
      });
      pts[best] = { x: peakX, y: peakY };
    }

    const trace = (p: Path2D) => {
      if (rounded) {
        for (let i = 1; i < pts.length - 1; i++) {
          p.quadraticCurveTo(
            pts[i].x,
            pts[i].y,
            (pts[i].x + pts[i + 1].x) / 2,
            (pts[i].y + pts[i + 1].y) / 2,
          );
        }
        p.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      } else {
        for (const pt of pts.slice(1)) p.lineTo(pt.x, pt.y);
      }
    };
    const crest = new Path2D();
    crest.moveTo(pts[0].x, pts[0].y);
    trace(crest);
    const fill = new Path2D();
    const fx = -10;
    fill.moveTo(fx, h + 10);
    fill.lineTo(fx, pts[0].y);
    fill.lineTo(pts[0].x, pts[0].y);
    trace(fill);
    fill.lineTo(w + 10, pts[pts.length - 1].y);
    fill.lineTo(w + 10, h + 10);
    fill.closePath();
    return { fill, crest };
  }

  private drawSkyline(c: CanvasRenderingContext2D, p: Palette) {
    const { w, h } = this;
    const ridges = this.ridges();
    const rises = ridges.map((_, i) =>
      easeOut((this.reveal - 0.08 * i) / 0.55),
    );
    const offsets = rises.map((r) => (1 - r) * h * 0.22);
    const profiles = ridges.map((r) =>
      this.ridgeProfile(r.peakX, r.peakY, r.amplitude, r.seed, !r.mountain),
    );
    const aurora = this.theme.id === "aurora";

    const ramp = (d: number) =>
      d < 0.5
        ? mix(p.ridgeFar, p.ridgeMid, d * 2)
        : mix(p.ridgeMid, p.ridgeNear, (d - 0.5) * 2);

    ridges.forEach((ridge, i) => {
      const rise = rises[i];
      if (rise <= 0) return;
      const prof = profiles[i];
      const done = !!ridge.hike.completed;
      c.save();
      c.globalAlpha = rise;
      c.translate(0, offsets[i]);

      if (done) {
        c.fillStyle = css(mix(p.ridgeDoneFar, p.ridgeDoneNear, ridge.depth));
        c.fill(prof.fill);
      } else {
        const color = ramp(ridge.depth);
        const alpha =
          this.timeOfDay !== "day" ? 0.72 : p.hazeStrength > 0 ? 0.62 : 0.5;
        if (aurora) {
          const shadeSky = (x: RGB) => {
            const tod = this.timeOfDay;
            const indigo = rgb(0.04, 0.08, 0.19);
            return mix(
              tod === "day" ? x : mix(x, indigo, tod === "dark" ? 0.76 : 0.91),
              color,
              alpha,
            );
          };
          const g = c.createLinearGradient(
            0,
            0,
            0,
            h * (this.layout.horizon + 0.02),
          );
          g.addColorStop(0, css(shadeSky(this.theme.skyTop)));
          g.addColorStop(
            0.5,
            css(shadeSky(this.theme.skyMid ?? this.theme.sky)),
          );
          g.addColorStop(1, css(shadeSky(this.theme.skyHorizon)));
          c.fillStyle = g;
        } else {
          c.fillStyle = css(color, alpha);
        }
        c.fill(prof.fill);
      }
      this.shadeRidge(c, prof, ridge.peakX, done ? 0.8 : 0.5);
      this.hazeRidge(c, p, prof, ridge.depth, ridges.length, !done);
      this.alpenglowWash(c, prof, ridge, done ? 1 : 0.6);

      // Crest line, cut away wherever a nearer range stands in front
      c.save();
      for (let j = i + 1; j < ridges.length; j++) {
        if (rises[j] <= 0) continue;
        const clip = new Path2D();
        clip.rect(-20, -20, w + 40, h + 40);
        clip.addPath(translated(profiles[j].fill, offsets[j] - offsets[i]));
        c.clip(clip, "evenodd");
      }
      c.lineCap = "round";
      c.lineJoin = "round";
      if (done) {
        c.strokeStyle = css(p.goalInk, 0.55);
        c.lineWidth = 1.6;
      } else {
        c.strokeStyle = css(p.goalInk, 0.7);
        c.lineWidth = 1.8;
        c.setLineDash([8, 6]);
      }
      c.stroke(prof.crest);
      c.restore();

      done
        ? this.drawStamp(c, p, ridge, i, ridges.length)
        : this.drawGhostStamp(c, p, ridge, i, ridges.length);
      c.restore();
    });
  }

  private shadeRidge(
    c: CanvasRenderingContext2D,
    prof: { fill: Path2D; crest: Path2D },
    peakX: number,
    strength: number,
  ) {
    const { w, h } = this;
    const { stackTop, horizon } = this.layout;
    c.save();
    c.clip(prof.fill);
    const peakStop = Math.min(0.9, Math.max(0.1, peakX / w));
    const g = c.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, `rgba(255,255,255,${0.1 * strength})`);
    g.addColorStop(peakStop, `rgba(255,255,255,${0.03 * strength})`);
    g.addColorStop(
      Math.min(1, peakStop + 0.08),
      `rgba(0,0,0,${0.04 * strength})`,
    );
    g.addColorStop(1, `rgba(0,0,0,${0.16 * strength})`);
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.strokeStyle = `rgba(255,255,255,${0.14 * strength})`;
    c.lineWidth = 1.2;
    c.stroke(prof.crest);
    const y0 = h * (stackTop + (horizon - stackTop) * 0.33),
      y1 = h * (horizon + 0.02);
    const g2 = c.createLinearGradient(0, y0, 0, y1);
    g2.addColorStop(0, "rgba(0,0,0,0)");
    g2.addColorStop(1, `rgba(0,0,0,${0.14 * strength})`);
    c.fillStyle = g2;
    c.fillRect(0, y0 - 400, w, h);
    c.restore();
  }

  /**
   * The theme's light laid on the top of a ridge and gone by halfway down, the way the
   * sun leaves a summit lit while the valley has fallen into shadow. Dimmed in dark
   * mode, and gone after dark.
   */
  private alpenglowWash(
    c: CanvasRenderingContext2D,
    prof: { fill: Path2D },
    ridge: Ridge,
    alpha: number,
  ) {
    const glow = this.theme.alpenglow;
    const tod = this.timeOfDay;
    if (!glow || tod === "night" || ridge.amplitude <= 12) return;
    const a = alpha * (tod === "dark" ? 0.7 : 1);
    const top = ridge.peakY - ridge.amplitude * 0.08;
    const bottom = ridge.peakY + ridge.amplitude * 0.44;
    c.save();
    c.clip(prof.fill);
    const g = c.createLinearGradient(0, top, 0, bottom);
    g.addColorStop(0, css(glow, 0.35 * a));
    g.addColorStop(0.3, css(glow, 0.31 * a));
    g.addColorStop(0.68, css(glow, 0.12 * a));
    g.addColorStop(1, css(glow, 0));
    c.fillStyle = g;
    c.fillRect(0, top, this.w, bottom - top);
    c.restore();
  }

  private hazeRidge(
    c: CanvasRenderingContext2D,
    p: Palette,
    prof: { fill: Path2D },
    depth: number,
    count: number,
    goal: boolean,
  ) {
    if (p.hazeStrength <= 0) return;
    const { w, h } = this;
    const d = count === 1 ? 0.75 : depth;
    const scale = p.hazeStrength * (goal ? 0.32 : 1);
    const top = scale * (0.42 - 0.26 * d);
    const bottom = Math.min(0.9, top + 0.16);
    const veil = mix(p.skyHorizon, WHITE, 0.1);
    c.save();
    c.clip(prof.fill);
    const g = c.createLinearGradient(
      0,
      h * (this.layout.stackTop - 0.02),
      0,
      h * this.layout.horizon,
    );
    g.addColorStop(0, css(veil, top));
    g.addColorStop(1, css(veil, bottom));
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    c.restore();
  }

  private stampMountain(
    c: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    s: number,
    ink: string,
  ) {
    c.save();
    c.translate(cx, cy);
    c.strokeStyle = ink;
    c.lineWidth = s * 0.1;
    c.lineJoin = "round";
    c.lineCap = "round";
    c.beginPath();
    c.moveTo(-0.72 * s, 0.45 * s);
    c.lineTo(-0.3 * s, -0.12 * s);
    c.lineTo(-0.08 * s, 0.14 * s);
    c.lineTo(0.2 * s, -0.45 * s);
    c.lineTo(0.72 * s, 0.45 * s);
    c.closePath();
    c.stroke();
    c.restore();
  }

  private stampText(
    c: CanvasRenderingContext2D,
    text: string,
    weight: number,
    size: number,
    color: string,
    y: number,
  ) {
    c.font = font(weight, size);
    c.fillStyle = color;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, 0, y);
  }

  private drawGhostStamp(
    c: CanvasRenderingContext2D,
    p: Palette,
    ridge: Ridge,
    index: number,
    count: number,
  ) {
    const r = ridge.r;
    const stagger = 0.55 + (0.3 * index) / Math.max(count - 1, 1);
    const appear = backOut((this.reveal - stagger) / 0.15);
    if (appear <= 0.01) return;
    const name = stampName(ridge.hike.name);
    const dim = this.timeOfDay !== "day";
    c.save();
    c.globalAlpha *= Math.min(1, appear * 1.4);
    c.translate(ridge.stamp.x, ridge.stamp.y);
    c.rotate((-12 * Math.PI) / 180);
    c.scale(appear, appear);
    const disc = circle(0, 0, r);
    c.fillStyle = css(p.stampPaper, dim ? 0.92 : 0.55);
    c.fill(disc);
    c.strokeStyle = css(p.stampInk, 0.8);
    c.lineWidth = 2;
    c.lineCap = "round";
    c.setLineDash([4, 4]);
    c.stroke(disc);
    c.setLineDash([]);
    this.stampMountain(c, 0, -r * 0.47, r * 0.3, css(p.stampInk, 0.7));
    this.stampText(
      c,
      name,
      800,
      r * 0.26 * Math.min(1, 8.5 / Math.max(name.length, 1)),
      css(p.stampInk, 0.85),
      -r * 0.06,
    );
    this.stampText(c, "GOAL", 700, r * 0.22, css(p.stampInk, 0.7), r * 0.32);
    c.restore();
  }

  private drawStamp(
    c: CanvasRenderingContext2D,
    p: Palette,
    ridge: Ridge,
    index: number,
    count: number,
  ) {
    const r = ridge.r;
    const ink = p.stampInk;
    const slamming = this.slam?.id === ridge.hike.id && this.stampDrop < 1;
    const stagger = 0.55 + (0.3 * index) / Math.max(count - 1, 1);
    const appear = slamming
      ? clamp01(backOut(this.stampDrop))
      : backOut((this.reveal - stagger) / 0.15);
    if (appear <= 0.01) return;
    const fall = 1 - appear;
    const scale = slamming ? 1 + 1.6 * fall * fall : appear;
    const tilt = slamming ? -12 - 22 * fall : -12 - 25 * fall;
    const alpha = slamming
      ? Math.min(1, appear * 2.5)
      : Math.min(1, appear * 1.4);
    const name = stampName(ridge.hike.name);
    const date = ridge.hike.completed || "SUMMITED";

    c.save();
    c.globalAlpha *= alpha;
    c.translate(ridge.stamp.x, ridge.stamp.y);
    c.rotate((tilt * Math.PI) / 180);
    c.scale(scale, scale);

    if (slamming) {
      const burst = easeOut((this.stampDrop - 0.55) / 0.45);
      if (burst > 0) {
        c.strokeStyle = css(ink, (1 - burst) * 0.7);
        c.lineWidth = 3 * (1 - burst) + 0.5;
        c.stroke(circle(0, 0, r * (1.1 + 0.9 * burst)));
      }
    }

    c.fillStyle = "rgba(255,255,255,0.92)";
    c.fill(scallopedDisc(r + 2.6));
    const disc = scallopedDisc(r);
    c.fillStyle = css(p.stampPaper);
    c.fill(disc);
    c.strokeStyle = css(ink);
    c.lineWidth = 1.8;
    c.stroke(disc);

    c.save();
    c.setLineDash([0.1, 3.2]);
    c.lineCap = "round";
    c.lineWidth = 1;
    c.strokeStyle = css(ink, 0.85);
    c.stroke(circle(0, 0, r - 6));
    c.restore();

    this.stampMountain(c, 0, -r * 0.47, r * 0.3, css(ink));
    this.stampText(
      c,
      name,
      800,
      r * 0.26 * Math.min(1, 8.5 / Math.max(name.length, 1)),
      css(ink),
      -r * 0.06,
    );
    c.strokeStyle = css(ink, 0.6);
    c.lineWidth = 0.8;
    c.beginPath();
    c.moveTo(-r * 0.42, r * 0.13);
    c.lineTo(r * 0.42, r * 0.13);
    c.stroke();
    this.stampText(c, `★ ${date} ★`, 700, r * 0.2, css(ink, 0.9), r * 0.36);
    c.restore();
  }

  // ── Meadow ────────────────────────────────────────────────────

  private drawMeadow(c: CanvasRenderingContext2D, p: Palette) {
    const { w, h } = this;
    const top = h * this.meadowTop;
    const g = c.createLinearGradient(0, top, 0, h);
    g.addColorStop(0, css(p.bands[0]));
    g.addColorStop(0.5, css(p.bands[1]));
    g.addColorStop(1, css(p.bands[2]));
    c.fillStyle = g;
    c.fillRect(-10, top, w + 20, h - top + 20);

    this.drawTreeline(c, p, h * (this.layout.horizon + 0.004));

    const spine = this.spine();
    const drawn = easeInOut((this.reveal - 0.3) / 0.55);
    const start = Math.max(
      0,
      Math.min(spine.length - 3, Math.floor((1 - drawn) * (spine.length - 1))),
    );
    const visible = spine.slice(start);
    if (drawn > 0.01) this.drawTrail(c, p, visible);
    const tipY = drawn > 0.01 ? visible[0].y : h * 2;
    const signs = this.signFrames(c);
    if (drawn > 0.6) {
      this.drawFootprints(c, p, spine, signs);
      c.save();
      c.globalAlpha *= easeOut((drawn - 0.6) / 0.4);
      this.drawCamp(c, spine, signs);
      c.restore();
    }
    for (const s of signs) {
      const pop = backOut((s.trailY - tipY) / (h * 0.05));
      if (pop <= 0.01) continue;
      c.save();
      c.globalAlpha *= Math.min(1, pop * 1.5);
      c.translate(s.base.x, s.base.y);
      c.scale(pop, pop);
      c.translate(-s.base.x, -s.base.y);
      this.drawParkSign(c, p, s);
      c.restore();
    }
  }

  /** A sprite rasterized once at the size it is drawn, optionally veiled in a color. */
  private sprite(
    key: string,
    height: number,
    tint?: { color: RGB; alpha: number },
  ) {
    const img = this.images[key];
    if (!img) return null;
    const px = Math.max(8, Math.round(height * this.k * this.dpr * 1.25));
    const id = `${key}|${px}|${tint ? css(tint.color, tint.alpha) : ""}`;
    let cv = this.sprites.get(id);
    if (!cv) {
      const aspect = img.naturalWidth / Math.max(1, img.naturalHeight) || 0.61;
      cv = document.createElement("canvas");
      cv.width = Math.max(1, Math.round(px * aspect));
      cv.height = px;
      const x = cv.getContext("2d")!;
      x.drawImage(img, 0, 0, cv.width, cv.height);
      if (tint) {
        x.globalCompositeOperation = "source-atop";
        x.fillStyle = css(tint.color, tint.alpha);
        x.fillRect(0, 0, cv.width, cv.height);
      }
      this.sprites.set(id, cv);
    }
    return cv;
  }

  private drawSprite(
    c: CanvasRenderingContext2D,
    cv: HTMLCanvasElement,
    x: number,
    groundY: number,
    height: number,
  ) {
    const wd = (height * cv.width) / cv.height;
    c.drawImage(cv, x - wd / 2, groundY - height, wd, height);
  }

  private drawTreeline(
    c: CanvasRenderingContext2D,
    p: Palette,
    groundY: number,
  ) {
    const { w } = this;
    const redwood = this.theme.id === "redwood" && !!this.images.redwood;
    const gap = this.treelineGap;
    const tod = this.timeOfDay;
    const dim = tod !== "day";
    const ranks = redwood
      ? [
          {
            scale: [0.6, 0.78],
            step: [20, 32],
            lift: 6,
            haze: 0.22,
            seed: 611,
          },
          { scale: [0.86, 1.14], step: [22, 36], lift: 0, haze: 0, seed: 610 },
        ]
      : [
          { scale: [0.28, 0.4], step: [6, 10], lift: 5, haze: 0.24, seed: 611 },
          { scale: [0.42, 0.6], step: [7, 11], lift: 0, haze: 0, seed: 610 },
        ];
    const veil =
      tod === "night" ? rgb(0.22, 0.36, 0.46) : rgb(0.18, 0.28, 0.34);
    const key = redwood ? "redwood" : "pine";

    for (const rank of ranks) {
      const r = rng(rank.seed);
      const nominal =
        ((redwood ? 58 : 60) * (rank.scale[0] + rank.scale[1])) / 2;
      let tint: { color: RGB; alpha: number } | undefined;
      if (rank.haze > 0)
        tint = { color: mix(p.skyHorizon, p.treeline, 0.38), alpha: rank.haze };
      else if (dim)
        tint = { color: veil, alpha: tod === "night" ? 0.34 : 0.26 };
      const cv = this.sprite(key, nominal, tint);
      for (let x = -6; x < w + 10; x += r(rank.step[0], rank.step[1])) {
        const sc = r(rank.scale[0], rank.scale[1]);
        const baseY = groundY - rank.lift + r(-2, 2);
        if (Math.abs(x - w * 0.5) <= gap) continue;
        const height = (redwood ? 58 : 60) * sc;
        c.fillStyle = `rgba(0,0,0,${dim ? 0.06 : 0.1})`;
        c.beginPath();
        c.ellipse(x + 1.2 * sc, baseY, 5.5 * sc, 1.7 * sc, 0, 0, Math.PI * 2);
        c.fill();
        if (cv) this.drawSprite(c, cv, x, baseY, height);
        else this.drawPine(c, x, baseY, sc, p.treeline);
      }
    }
  }

  private drawPine(
    c: CanvasRenderingContext2D,
    x: number,
    groundY: number,
    scale: number,
    color: RGB,
  ) {
    const path = new Path2D();
    const trunkW = 2.6 * scale,
      trunkH = 7 * scale;
    path.rect(x - trunkW / 2, groundY - trunkH, trunkW, trunkH + 4);
    const base = groundY - trunkH + 2 * scale;
    for (const [tw, th, off] of [
      [20, 22, 0],
      [16, 19, -11],
      [12, 17, -21],
      [7, 14, -30],
    ]) {
      const ty = base + off * scale;
      path.moveTo(x - (tw * scale) / 2, ty);
      path.lineTo(x, ty - th * scale);
      path.lineTo(x + (tw * scale) / 2, ty);
      path.closePath();
    }
    c.fillStyle = css(color);
    c.fill(path);
  }

  private drawTrail(c: CanvasRenderingContext2D, p: Palette, spine: Pt[]) {
    if (spine.length <= 2) return;
    const { h } = this;
    const n = spine.length;
    const edges = (scale: number, shadow = false) => {
      const left: Pt[] = [],
        right: Pt[] = [];
      for (let i = 0; i < n; i++) {
        const prev = spine[Math.max(i - 1, 0)],
          next = spine[Math.min(i + 1, n - 1)];
        const tx = next.x - prev.x,
          ty = next.y - prev.y;
        const len = Math.max(Math.hypot(tx, ty), 0.001);
        const nx = -ty / len,
          ny = tx / len;
        const base = this.trailHalfWidth(spine[i].y / h);
        const hw = base * scale;
        const dx = shadow ? base * 0.3 : 0,
          dy = shadow ? base * 0.4 : 0;
        left.push({
          x: spine[i].x + nx * hw + dx,
          y: spine[i].y + ny * hw + dy,
        });
        right.push({
          x: spine[i].x - nx * hw + dx,
          y: spine[i].y - ny * hw + dy,
        });
      }
      return { left, right };
    };
    const ribbon = (e: { left: Pt[]; right: Pt[] }) => {
      const path = new Path2D();
      const smooth = (pts: Pt[]) => {
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1],
            b = pts[i];
          path.quadraticCurveTo(a.x, a.y, (a.x + b.x) / 2, (a.y + b.y) / 2);
        }
        const last = pts[pts.length - 1];
        path.lineTo(last.x, last.y);
      };
      path.moveTo(e.left[0].x, e.left[0].y);
      smooth(e.left);
      smooth([...e.right].reverse());
      path.closePath();
      return path;
    };

    const sc = this.sceneScale;
    const shadow = ribbon(edges(1, true));
    this.softShadow(c, `rgba(0,0,0,${0.16 * sc})`, 3 * sc, () =>
      c.fill(shadow),
    );

    const body = ribbon(edges(1));
    c.fillStyle = css(p.trail);
    c.fill(body);
    c.strokeStyle = css(p.trailEdge, 0.45);
    c.lineWidth = 1;
    c.lineJoin = "round";
    c.stroke(body);
  }

  private footprintEndY(spine: Pt[], signs: SignPlacement[]) {
    const bottom = spine[spine.length - 1];
    const done = signs.filter((s) => s.m.achieved).map((s) => s.trailY);
    const open = signs.filter((s) => !s.m.achieved).map((s) => s.trailY);
    const lastDoneY = done.length ? Math.min(...done) : null;
    const nextY = open.length ? Math.max(...open) : null;
    const startY = lastDoneY ?? bottom.y;
    let endY: number;
    if (nextY !== null)
      endY = startY - (startY - nextY) * this.data.progressToNext;
    else if (lastDoneY !== null) endY = spine[0].y;
    else return null;
    return endY < bottom.y - 4 ? endY : null;
  }

  private drawFootprints(
    c: CanvasRenderingContext2D,
    p: Palette,
    spine: Pt[],
    signs: SignPlacement[],
  ) {
    const endY = this.footprintEndY(spine, signs);
    if (endY === null) return;
    const { h } = this;
    const ink = css(p.trailEdge, 0.75);
    let traveled = 0,
      nextDrop = 6,
      left = true;
    for (let i = spine.length - 1; i > 0; i--) {
      const a = spine[i],
        b = spine[i - 1];
      if (a.y < endY) break;
      const seg = Math.hypot(b.x - a.x, b.y - a.y);
      let t = 0;
      while (traveled + (seg - t) >= nextDrop) {
        t += nextDrop - traveled;
        traveled = nextDrop;
        const pt = {
          x: a.x + (b.x - a.x) * (t / Math.max(seg, 0.001)),
          y: a.y + (b.y - a.y) * (t / Math.max(seg, 0.001)),
        };
        if (pt.y < endY) break;
        const hw = this.trailHalfWidth(pt.y / h);
        const dir = {
          x: (b.x - a.x) / Math.max(seg, 0.001),
          y: (b.y - a.y) / Math.max(seg, 0.001),
        };
        const side = left ? -1 : 1;
        const center = {
          x: pt.x - dir.y * hw * 0.32 * side,
          y: pt.y + dir.x * hw * 0.32 * side,
        };
        this.drawBootPrint(
          c,
          center,
          Math.atan2(dir.y, dir.x) + Math.PI / 2,
          Math.max(3.5, hw * 0.7),
          ink,
          !left,
        );
        left = !left;
        nextDrop += Math.max(10, hw * 1.3);
      }
      traveled += seg - t;
    }
  }

  private drawBootPrint(
    c: CanvasRenderingContext2D,
    center: Pt,
    angle: number,
    size: number,
    color: string,
    mirrored: boolean,
  ) {
    c.save();
    c.translate(center.x, center.y);
    c.rotate(angle);
    if (mirrored) c.scale(-1, 1);
    const w = size * 0.62,
      toeH = size * 0.95,
      heelH = size * 0.5;
    const toeY = -toeH - size * 0.1;
    c.save();
    c.clip(roundRect(-w / 2, toeY, w, toeH, w * 0.45));
    const treads = new Path2D();
    treads.rect(-w, toeY - 1, w * 2, toeH + 2);
    const gap = toeH / 4.5;
    for (let k = 1; k < 4; k++)
      treads.rect(
        -w,
        toeY + gap * k + gap * 0.15,
        w * 2,
        Math.max(0.6, size * 0.08),
      );
    c.fillStyle = color;
    c.fill(treads, "evenodd");
    c.restore();
    c.fillStyle = color;
    c.fill(roundRect(-w * 0.42, size * 0.12, w * 0.84, heelH, w * 0.35));
    c.restore();
  }

  // The camp: a tent where the boot prints end, a backpack, a firepit once a milestone
  // is done, and the buddy keeping it all company.
  private drawCamp(
    c: CanvasRenderingContext2D,
    spine: Pt[],
    signs: SignPlacement[],
  ) {
    const { w, h } = this;
    const top = this.meadowTop;
    const occupied: DOMRect[] = signs.map(
      (s) => new DOMRect(s.frame.x, s.frame.y, s.frame.w, s.base.y - s.frame.y),
    );
    const items: Decor[] = [];
    const buddyImg = this.images.buddy;
    const aspectOf = (kind: Decor["kind"]) =>
      kind === "tent"
        ? TENT_ASPECT
        : kind === "backpack"
          ? 0.72
          : kind === "firepit"
            ? 0.99
            : buddyImg
              ? buddyImg.naturalWidth / Math.max(1, buddyImg.naturalHeight)
              : 1;
    const box = (kind: Decor["kind"], base: Pt, height: number) => {
      const wd = height * aspectOf(kind);
      return new DOMRect(base.x - wd / 2, base.y - height, wd, height);
    };
    const hits = (a: DOMRect, b: DOMRect, m: number) =>
      a.left < b.right + m &&
      a.right > b.left - m &&
      a.top < b.bottom + m &&
      a.bottom > b.top - m;
    const trailX = (y: number) =>
      spine.reduce(
        (best, p) => (Math.abs(p.y - y) < Math.abs(best.y - y) ? p : best),
        spine[0],
      ).x;
    const nearTrail = (pt: Pt) =>
      spine.reduce(
        (d, s) => Math.min(d, Math.hypot(pt.x - s.x, pt.y - s.y)),
        Infinity,
      );
    const fits = (b: DOMRect, margin: number) => {
      if (b.left <= 2 || b.right >= w - 2 || b.top <= h * top + 2) return false;
      const ground = { x: b.x + b.width / 2, y: b.bottom };
      if (
        nearTrail(ground) <
        this.trailHalfWidth(ground.y / h) + b.width * 0.4 + 4
      )
        return false;
      return !occupied.some((o) => hits(o, b, margin));
    };
    const place = (
      kind: Decor["kind"],
      base: Pt,
      height: number,
      margin = 4,
      force = false,
    ) => {
      const b = box(kind, base, height);
      if (!force && !fits(b, margin)) return false;
      occupied.push(b);
      items.push({ kind, base, height, box: b });
      return true;
    };

    const fallbackY = h * this.meadowY(0.905);
    const campY = Math.min(
      fallbackY,
      Math.max(h * top + 30, this.footprintEndY(spine, signs) ?? fallbackY),
    );
    const campSide = trailX(campY) > w * 0.5 ? -1 : 1;
    const depth = (y: number) => clamp01((y / h - top) / (1 - top));
    const tentH = 40 * (0.55 + 0.45 * depth(campY));
    const tentX = (side: number, y: number) => {
      const clearance = this.trailHalfWidth(y / h) + tentH * 0.6 + 14;
      const tx = trailX(y);
      return side > 0
        ? Math.min(w - tentH * 0.6 - 4, tx + clearance)
        : Math.max(tentH * 0.6 + 4, tx - clearance);
    };
    let camp: Pt | null = null;
    outer: for (const dy of [0, 12, -12, 24, -24, 36]) {
      for (const side of [campSide, -campSide]) {
        const base = { x: tentX(side, campY + dy), y: campY + dy };
        if (place("tent", base, tentH)) {
          camp = base;
          break outer;
        }
      }
    }
    if (!camp) {
      camp = { x: tentX(campSide, campY), y: campY };
      place("tent", camp, tentH, 0, true);
    }
    const side = camp.x > trailX(camp.y) ? 1 : -1;
    place(
      "backpack",
      { x: camp.x - side * tentH * 0.9, y: camp.y + 1 },
      tentH * 0.43,
    );
    let firepit: Pt | null = null;
    if (signs.some((s) => s.m.achieved)) {
      const base = { x: camp.x + side * tentH * 1.18, y: camp.y + 3 };
      if (place("firepit", base, tentH * 0.44, 2)) firepit = base;
    }
    if (buddyImg) {
      const bh = tentH * 0.62;
      const spots: Pt[] = [];
      if (firepit) {
        spots.push(
          { x: firepit.x + side * tentH * 0.6, y: firepit.y + 4 },
          { x: firepit.x, y: firepit.y + tentH * 0.5 },
        );
      }
      spots.push(
        { x: camp.x + side * tentH, y: camp.y + tentH * 0.45 },
        { x: camp.x - side * tentH, y: camp.y + tentH * 0.45 },
        { x: camp.x - side * tentH * 1.25, y: camp.y + 2 },
        { x: camp.x, y: camp.y + tentH * 0.75 },
      );
      if (!spots.some((s) => place("buddy", s, bh, 1)))
        place(
          "buddy",
          { x: camp.x - side * tentH * 0.9, y: camp.y + tentH * 0.5 },
          bh,
          0,
          true,
        );
    }

    const tod = this.timeOfDay;
    const dim = tod !== "day";
    for (const it of items.sort((a, b) => a.base.y - b.base.y)) {
      if (it.kind !== "firepit") {
        this.softShadow(c, "rgba(0,0,0,0.24)", 2.5, () => {
          c.beginPath();
          c.ellipse(
            it.base.x + it.height * 0.06,
            it.base.y - it.height * 0.08,
            it.box.width * 0.54,
            it.height * 0.1,
            0,
            0,
            Math.PI * 2,
          );
          c.fill();
        });
      }
      if (it.kind === "tent") {
        const colors = tentColors(this.theme);
        const s = it.height / TENT_BOUNDS.h;
        c.save();
        c.translate(
          it.base.x - (TENT_BOUNDS.x + TENT_BOUNDS.w / 2) * s,
          it.base.y + 1 - (TENT_BOUNDS.y + TENT_BOUNDS.h) * s,
        );
        c.scale(s, s);
        for (const [role, op, d] of TENT_PARTS) {
          c.fillStyle = css(
            dim
              ? mix(colors[role], this.palette().bands[2], 0.4)
              : colors[role],
            op,
          );
          c.fill(new Path2D(d));
        }
        c.restore();
      } else if (it.kind === "firepit") {
        if (dim) {
          const g = c.createRadialGradient(
            it.base.x,
            it.base.y - it.height * 0.35,
            0,
            it.base.x,
            it.base.y - it.height * 0.35,
            it.height * 1.6,
          );
          g.addColorStop(0, "rgba(255,150,40,0.38)");
          g.addColorStop(1, "rgba(255,150,40,0)");
          c.fillStyle = g;
          c.fillRect(
            it.base.x - it.height * 1.6,
            it.base.y - it.height * 1.1,
            it.height * 3.2,
            it.height * 1.8,
          );
        }
        const cv = this.sprite("firepit", it.height);
        if (cv) this.drawSprite(c, cv, it.base.x, it.base.y, it.height);
      } else {
        const cv = this.sprite(
          it.kind,
          it.height,
          dim ? { color: this.palette().bands[2], alpha: 0.42 } : undefined,
        );
        if (cv) this.drawSprite(c, cv, it.base.x, it.base.y + 1, it.height);
      }
    }
  }

  private drawParkSign(
    c: CanvasRenderingContext2D,
    p: Palette,
    s: SignPlacement,
  ) {
    const { m, scale, frame: f } = s;
    const dim = this.timeOfDay !== "day";
    const brown = dim ? rgb(0.52, 0.39, 0.27) : rgb(0.36, 0.25, 0.16);
    const tan = m.achieved
      ? dim
        ? rgb(0.97, 0.89, 0.72)
        : rgb(0.9, 0.8, 0.62)
      : dim
        ? rgb(0.94, 0.91, 0.83)
        : rgb(0.86, 0.82, 0.72);
    const inkBrown = m.achieved ? rgb(0.36, 0.25, 0.16) : rgb(0.45, 0.4, 0.34);
    const post = dim ? rgb(0.58, 0.45, 0.32) : p.signPost;
    const tilt = f.h * 0.16;
    const board = (inset: number) =>
      roundedPolygon(
        [
          { x: f.x + inset, y: f.y + tilt + inset },
          { x: f.x + f.w - inset, y: f.y + inset },
          { x: f.x + f.w - inset, y: f.y + f.h - inset },
          { x: f.x + inset, y: f.y + f.h - inset },
        ],
        7 * scale,
      );
    const sun = 0.3 * scale;
    const contact = Math.min(1, Math.max(0.35, scale));

    // Post and board, lifted off the grass with a drop shadow
    const postW = 5 * scale;
    const postRect = {
      x: s.base.x - postW / 2,
      y: f.y + f.h - 2,
      w: postW,
      h: s.base.y - (f.y + f.h) + 2,
    };
    c.save();
    c.shadowColor = `rgba(0,0,0,${dim ? 0.13 : 0.17})`;
    const px = c.getTransform().a;
    c.shadowBlur = 3.8 * contact * px;
    c.shadowOffsetX = 1.4 * contact * px;
    c.shadowOffsetY = 1.8 * contact * px;
    c.fillStyle = css(post);
    c.fill(roundRect(postRect.x, postRect.y, postRect.w, postRect.h, 1.5));
    c.fillStyle = css(brown);
    c.fill(board(0));
    c.restore();
    c.fillStyle = `rgba(255,255,255,${dim ? 0.1 : 0.16})`;
    c.fill(roundRect(postRect.x, postRect.y, postW * 0.34, postRect.h, 1.5));

    if (dim) {
      c.strokeStyle = css(rgb(0.98, 0.94, 0.84), 0.55);
      c.lineWidth = 1.2 * scale;
      c.stroke(board(0));
    }
    c.save();
    c.clip(board(0));
    c.strokeStyle = `rgba(255,255,255,${dim ? 0.14 : 0.22})`;
    c.lineWidth = 1.8 * scale;
    c.stroke(board(0.9 * scale));
    c.translate(0, 1.6 * scale);
    c.strokeStyle = "rgba(0,0,0,0.14)";
    c.lineWidth = 1.4 * scale;
    c.stroke(board(0.9 * scale));
    c.restore();

    const face = board(3.2 * scale);
    c.fillStyle = css(tan);
    c.fill(face);
    const bandH = f.h * 0.3;
    c.save();
    c.clip(face);
    c.save();
    c.translate(sun * 2, 1.4 * scale);
    c.strokeStyle = `rgba(0,0,0,${dim ? 0.11 : 0.1})`;
    c.lineWidth = 2.2 * scale;
    c.stroke(face);
    c.restore();
    c.fillStyle = css(brown);
    c.fillRect(f.x, f.y + f.h - bandH - 3.2 * scale, f.w, bandH + 4 * scale);
    c.restore();

    c.textAlign = "center";
    c.textBaseline = "middle";
    const faceCenterY = f.y + tilt * 0.6 + (f.h - bandH - tilt * 0.6) / 2;
    c.font = font(700, 15 * scale);
    c.fillStyle = css(inkBrown);
    c.fillText(s.label, f.x + f.w / 2, faceCenterY + 0.5);
    const band = m.achieved ? "DONE" : m.detected ? "LOOKS DONE" : "MILESTONE";
    c.font = font(600, 7.5 * scale);
    c.fillStyle = css(tan);
    c.fillText(band, f.x + f.w / 2, f.y + f.h - 3.2 * scale - bandH / 2 + 0.5);
  }
}
