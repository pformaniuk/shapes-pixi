export const ShapeKind = {
  Triangle: "triangle",
  Quad: "quad",
  Pentagon: "pentagon",
  Hexagon: "hexagon",
  Circle: "circle",
  Ellipse: "ellipse",
  Star: "star",
  Irregular: "irregular",
} as const;

export type ShapeKind = (typeof ShapeKind)[keyof typeof ShapeKind];

/** Shapes used by the automatic spawner. Clicking the field uses an irregular polygon. */
export const SPAWN_KINDS: readonly ShapeKind[] = [
  ShapeKind.Triangle,
  ShapeKind.Quad,
  ShapeKind.Pentagon,
  ShapeKind.Hexagon,
  ShapeKind.Circle,
  ShapeKind.Ellipse,
  ShapeKind.Star,
];

export const GRAVITY_DEFAULT = 160;
export const GRAVITY_STEP = 40;
export const GRAVITY_MIN = 40;
export const GRAVITY_MAX = 480;

export const RATE_DEFAULT = 1;
export const RATE_STEP = 1;
export const RATE_MIN = 0;
export const RATE_MAX = 8;

/** Recycled graphics kept per shape type before extras are destroyed. */
export const POOL_LIMIT = 24;
