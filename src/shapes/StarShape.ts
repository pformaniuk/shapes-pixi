import { ShapeKind } from "../config";
import { randomRadius, starPoints } from "../geometry";
import { FallingShape } from "./FallingShape";

export class StarShape extends FallingShape {
  readonly kind = ShapeKind.Star;

  rebuild(rng: () => number, sizeScale: number): void {
    const outer = randomRadius(rng, sizeScale, 20);
    const inner = outer * (0.38 + rng() * 0.14);
    this.paintPolygon(starPoints(5, outer, inner), rng() * Math.PI * 2, rng);
  }
}
