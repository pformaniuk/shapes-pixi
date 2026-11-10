import { POOL_LIMIT, type ShapeKind } from "../config";
import type { FallingShape } from "./FallingShape";
import type { ShapeFactory } from "./ShapeFactory";

/**
 * Reuses shape graphics instead of allocating one on every spawn.
 * Shapes that fall off or are clicked go back here; overflow is destroyed.
 */
export class ShapePool {
  private readonly free = new Map<ShapeKind, FallingShape[]>();

  constructor(
    private readonly factory: ShapeFactory,
    private readonly onPressed: (shape: FallingShape) => void,
  ) {}

  acquire(kind: ShapeKind, rng: () => number, sizeScale: number): FallingShape {
    const shape = this.free.get(kind)?.pop() ?? this.create(kind);
    shape.rebuild(rng, sizeScale);
    shape.visible = true;
    return shape;
  }

  release(shape: FallingShape): void {
    shape.removeFromParent();
    shape.visible = false;
    const bucket = this.free.get(shape.kind) ?? [];
    if (bucket.length >= POOL_LIMIT) {
      shape.destroy();
      return;
    }
    bucket.push(shape);
    this.free.set(shape.kind, bucket);
  }

  private create(kind: ShapeKind): FallingShape {
    const shape = this.factory.create(kind);
    shape.onPressed = () => this.onPressed(shape);
    return shape;
  }
}
