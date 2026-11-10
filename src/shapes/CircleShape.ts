import { ShapeKind } from "../config";
import { randomColor } from "../geometry";
import { FallingShape } from "./FallingShape";

export class CircleShape extends FallingShape {
  readonly kind = ShapeKind.Circle;

  rebuild(rng: () => number, sizeScale: number): void {
    const radius = (16 + rng() * 22) * sizeScale;
    this.clear();
    this.circle(0, 0, radius)
      .fill({ color: randomColor(rng) })
      .stroke({
        width: 1.5,
        color: 0x0f172a,
        alpha: 0.28,
      });
    this.rotation = 0;
    this.area = Math.PI * radius * radius;
    this.extentX = radius;
    this.extentY = radius;
  }
}
