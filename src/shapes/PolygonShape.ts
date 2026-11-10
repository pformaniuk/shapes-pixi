import type { ShapeKind } from "../config";
import { randomRadius, regularPolygonPoints } from "../geometry";
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
    const radius = randomRadius(rng, sizeScale, 24);
    this.paintPolygon(
      regularPolygonPoints(this.sides, radius),
      rng() * Math.PI * 2,
      rng,
    );
  }
}
