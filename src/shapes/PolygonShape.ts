import type { ShapeKind } from "../config";
import { regularPolygonPoints } from "../geometry";
import { FallingShape } from "./FallingShape";

export class PolygonShape extends FallingShape {
  readonly kind: ShapeKind;

  constructor(
    kind: ShapeKind,
    private readonly sides: number,
  ) {
    super();
    this.kind = kind;
  }

  rebuild(rng: () => number, sizeScale: number): void {
    const radius = (22 + rng() * 24) * sizeScale;
    this.paintPolygon(
      regularPolygonPoints(this.sides, radius),
      rng() * Math.PI * 2,
      rng,
    );
  }
}
