import { FederatedPointerEvent, Graphics } from "pixi.js";
import type { ShapeKind } from "../config";
import {
  polygonArea,
  randomColor,
  rotatedExtents,
  type Point,
} from "../geometry";

const OUTLINE = { width: 1.5, color: 0x0f172a, alpha: 0.28 };

export abstract class FallingShape extends Graphics {
  abstract readonly kind: ShapeKind;
  area = 0;
  /** Axis-aligned half extents after the shape's current rotation. */
  extentX = 0;
  extentY = 0;
  onPressed: (() => void) | null = null;

  constructor() {
    super();
    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointerdown", (event: FederatedPointerEvent) => {
      event.stopPropagation();
      this.onPressed?.();
    });
  }

  abstract rebuild(rng: () => number, sizeScale: number): void;

  isDisplayed(viewHeight: number): boolean {
    const top = this.y - this.extentY;
    const bottom = this.y + this.extentY;
    return bottom > 0 && top < viewHeight;
  }

  isCompletelyBelow(viewHeight: number): boolean {
    return this.y - this.extentY >= viewHeight;
  }

  protected paintPolygon(
    points: Point[],
    rotation: number,
    rng: () => number,
  ): void {
    this.clear();
    this.poly(points, true)
      .fill({ color: randomColor(rng) })
      .stroke(OUTLINE);
    this.rotation = rotation;
    this.area = polygonArea(points);
    const extents = rotatedExtents(points, rotation);
    this.extentX = extents.x;
    this.extentY = extents.y;
  }
}
