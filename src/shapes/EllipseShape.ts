import { MIN_SHAPE_RADIUS, ShapeKind } from "../config";
import { randomColor, randomRadius } from "../geometry";
import { FallingShape } from "./FallingShape";

export class EllipseShape extends FallingShape {
  readonly kind = ShapeKind.Ellipse;

  rebuild(rng: () => number, sizeScale: number): void {
    const radiusY = randomRadius(rng, sizeScale, 14, MIN_SHAPE_RADIUS * 0.72);
    const radiusX = randomRadius(rng, sizeScale, 24, radiusY + 8);
    const rotation = rng() * Math.PI;
    this.clear();
    this.ellipse(0, 0, radiusX, radiusY)
      .fill({ color: randomColor(rng) })
      .stroke({
        width: 1.5,
        color: 0x0f172a,
        alpha: 0.28,
      });
    this.rotation = rotation;
    this.area = Math.PI * radiusX * radiusY;
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    this.extentX = Math.hypot(radiusX * cos, radiusY * sin);
    this.extentY = Math.hypot(radiusX * sin, radiusY * cos);
  }
}
