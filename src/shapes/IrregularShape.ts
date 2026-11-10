import { ShapeKind } from "../config";
import { irregularPoints, randomRadius } from "../geometry";
import { FallingShape } from "./FallingShape";

export class IrregularShape extends FallingShape {
  readonly kind = ShapeKind.Irregular;

  rebuild(rng: () => number, sizeScale: number): void {
    const radius = randomRadius(rng, sizeScale, 22);
    this.paintPolygon(irregularPoints(radius, rng), rng() * Math.PI * 2, rng);
  }
}
