import { Container, FederatedPointerEvent, Graphics } from "pixi.js";

/** Rectangular play area. Shapes outside it are masked. */
export class Playfield extends Container {
  readonly shapes = new Container();
  private readonly background = new Graphics();
  private readonly maskShape = new Graphics();
  private readonly frame = new Graphics();
  private readonly masked = new Container();
  widthPx = 0;
  heightPx = 0;

  constructor(
    private readonly onEmptyPointerDown: (x: number, y: number) => void,
  ) {
    super();
    this.shapes.eventMode = "passive";
    this.masked.eventMode = "passive";
    this.maskShape.eventMode = "none";
    this.frame.eventMode = "none";
    this.background.eventMode = "static";

    this.masked.addChild(this.shapes);
    this.masked.mask = this.maskShape;
    this.addChild(this.background, this.maskShape, this.masked, this.frame);

    this.background.on("pointerdown", (event: FederatedPointerEvent) => {
      const point = event.getLocalPosition(this);
      this.onEmptyPointerDown(point.x, point.y);
    });
  }

  resize(width: number, height: number): void {
    this.widthPx = width;
    this.heightPx = height;
    this.background.clear().rect(0, 0, width, height).fill({ color: 0xe7eef6 });
    this.maskShape.clear().rect(0, 0, width, height).fill({ color: 0xffffff });
    this.frame
      .clear()
      .rect(1.5, 1.5, Math.max(0, width - 3), Math.max(0, height - 3))
      .stroke({ width: 3, color: 0x0b1220 });
  }
}
