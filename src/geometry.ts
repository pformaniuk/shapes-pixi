import { MIN_SHAPE_RADIUS } from "./config";

export interface Point {
  x: number;
  y: number;
}

/** Radius is never below `minimum`, even when `sizeScale` shrinks the playfield. */
export function randomRadius(
  rng: () => number,
  sizeScale: number,
  spread: number,
  minimum = MIN_SHAPE_RADIUS,
): number {
  return minimum + rng() * spread * sizeScale;
}

export function randomColor(rng: () => number): number {
  const hue = rng() * 360;
  const saturation = 0.62 + rng() * 0.28;
  const lightness = 0.42 + rng() * 0.16;
  const chroma = saturation * Math.min(lightness, 1 - lightness);
  const channel = (offset: number) => {
    const k = (offset + hue / 30) % 12;
    const value = lightness - chroma * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * value);
  };
  return (channel(0) << 16) + (channel(8) << 8) + channel(4);
}

export function regularPolygonPoints(sides: number, radius: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return points;
}

export function starPoints(
  spikes: number,
  outerRadius: number,
  innerRadius: number,
): Point[] {
  const points: Point[] = [];
  const step = Math.PI / spikes;
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * step;
    points.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return points;
}

/** Simple concave-or-convex polygon: angles stay in order so the outline does not cross itself. */
export function irregularPoints(radius: number, rng: () => number): Point[] {
  const count = 6 + Math.floor(rng() * 5);
  const slice = (Math.PI * 2) / count;
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + i * slice + (rng() - 0.5) * slice * 0.55;
    const distance = radius * (0.38 + rng() * 0.62);
    points.push({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    });
  }
  return points;
}

export function polygonArea(points: Point[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const next = points[(i + 1) % points.length];
    sum += points[i].x * next.y - next.x * points[i].y;
  }
  return Math.abs(sum) / 2;
}

export function rotatedExtents(
  points: Point[],
  rotation: number,
): { x: number; y: number } {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  let x = 0;
  let y = 0;
  for (const point of points) {
    x = Math.max(x, Math.abs(point.x * cos - point.y * sin));
    y = Math.max(y, Math.abs(point.x * sin + point.y * cos));
  }
  return { x, y };
}
