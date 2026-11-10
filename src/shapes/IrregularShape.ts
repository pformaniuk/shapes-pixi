import { ShapeKind } from "../config";
import { irregularPoints } from "../geometry";
import { FallingShape } from "./FallingShape";

export class IrregularShape extends FallingShape {
  readonly kind = ShapeKind.Irregular;

  rebuild(rng: () => number, sizeScale: number): void {
    const radius = (26 + rng() * 22) * sizeScale;
    this.paintPolygon(irregularPoints(radius, rng), rng() * Math.PI * 2, rng);
  }
}
