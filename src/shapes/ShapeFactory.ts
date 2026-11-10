import { ShapeKind, type ShapeKind as Kind } from "../config";
import { CircleShape } from "./CircleShape";
import { EllipseShape } from "./EllipseShape";
import type { FallingShape } from "./FallingShape";
import { IrregularShape } from "./IrregularShape";
import { PolygonShape } from "./PolygonShape";
import { StarShape } from "./StarShape";

/** Creates a fresh display object for a shape type. Recycling lives in the pool. */
export class ShapeFactory {
  create(kind: Kind): FallingShape {
    switch (kind) {
      case ShapeKind.Triangle:
        return new PolygonShape(kind, 3);
      case ShapeKind.Quad:
        return new PolygonShape(kind, 4);
      case ShapeKind.Pentagon:
        return new PolygonShape(kind, 5);
      case ShapeKind.Hexagon:
        return new PolygonShape(kind, 6);
      case ShapeKind.Circle:
        return new CircleShape();
      case ShapeKind.Ellipse:
        return new EllipseShape();
      case ShapeKind.Star:
        return new StarShape();
      case ShapeKind.Irregular:
        return new IrregularShape();
      default: {
        const unknown: never = kind;
        throw new Error(`Unknown shape kind: ${unknown}`);
      }
    }
  }
}
