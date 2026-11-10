import type { Application } from "pixi.js";
import {
  GRAVITY_DEFAULT,
  GRAVITY_MAX,
  GRAVITY_MIN,
  GRAVITY_STEP,
  RATE_DEFAULT,
  RATE_MAX,
  RATE_MIN,
  RATE_STEP,
  SPAWN_KINDS,
  ShapeKind,
} from "../config";
import { ShapeFactory } from "../shapes/ShapeFactory";
import type { FallingShape } from "../shapes/FallingShape";
import { ShapePool } from "../shapes/ShapePool";
import type { Hud } from "../ui/Hud";
import { Playfield } from "./Playfield";

export class Game {
  private readonly playfield = new Playfield((x, y) => this.spawnAt(x, y));
  private readonly pool: ShapePool;
  private readonly active: FallingShape[] = [];
  private gravity = GRAVITY_DEFAULT;
  private spawnPerSecond = RATE_DEFAULT;
  private spawnAccumulator = 1;
  private sizeScale = 1;
  private visibleCount = -1;
  private visibleArea = -1;

  constructor(
    private readonly app: Application,
    private readonly hud: Hud,
  ) {
    this.pool = new ShapePool(new ShapeFactory(), (shape) =>
      this.dismiss(shape),
    );
    this.app.stage.addChild(this.playfield);
    this.hud.onRateStep = (direction) => this.adjustRate(direction);
    this.hud.onGravityStep = (direction) => this.adjustGravity(direction);
  }

  start(): void {
    this.hud.setRate(this.spawnPerSecond);
    this.hud.setGravity(this.gravity);
    this.layout();
    this.app.renderer.on("resize", this.layout, this);
    this.app.ticker.add(this.update, this);
  }

  private update(): void {
    const dt = Math.min(this.app.ticker.deltaMS / 1000, 0.05);
    this.spawnOverTime(dt);
    this.advance(dt);
  }

  private spawnOverTime(dt: number): void {
    if (this.spawnPerSecond <= 0) return;
    this.spawnAccumulator += dt;
    const interval = 1 / this.spawnPerSecond;
    let spawned = 0;
    while (this.spawnAccumulator >= interval && spawned < 4) {
      this.spawnAccumulator -= interval;
      this.spawnFalling(
        SPAWN_KINDS[Math.floor(Math.random() * SPAWN_KINDS.length)],
      );
      spawned += 1;
    }
  }

  private advance(dt: number): void {
    const distance = this.gravity * dt;
    const height = this.playfield.heightPx;
    let count = 0;
    let area = 0;

    for (let i = this.active.length - 1; i >= 0; i--) {
      const shape = this.active[i];
      shape.y += distance;
      if (shape.isCompletelyBelow(height)) {
        this.active.splice(i, 1);
        this.pool.release(shape);
        continue;
      }
      if (shape.isDisplayed(height)) {
        count += 1;
        area += shape.area;
      }
    }

    const rounded = Math.round(area);
    if (count !== this.visibleCount || rounded !== this.visibleArea) {
      this.visibleCount = count;
      this.visibleArea = rounded;
      this.hud.setStats(count, rounded);
    }
  }

  private spawnAt(x: number, y: number): void {
    const shape = this.launch(ShapeKind.Irregular);
    shape.position.set(x, y);
  }

  private spawnFalling(kind: (typeof SPAWN_KINDS)[number]): void {
    const shape = this.launch(kind);
    const pad = shape.extentX;
    const room = this.playfield.widthPx - pad * 2;
    const x =
      room > 0 ? pad + Math.random() * room : this.playfield.widthPx / 2;
    shape.position.set(x, -shape.extentY - 1);
  }

  private launch(kind: ShapeKind): FallingShape {
    const shape = this.pool.acquire(kind, Math.random, this.sizeScale);
    this.playfield.shapes.addChild(shape);
    this.active.push(shape);
    return shape;
  }

  private dismiss(shape: FallingShape): void {
    const index = this.active.indexOf(shape);
    if (index === -1) return;
    this.active.splice(index, 1);
    this.pool.release(shape);
  }

  private adjustRate(direction: -1 | 1): void {
    this.spawnPerSecond = clamp(
      this.spawnPerSecond + direction * RATE_STEP,
      RATE_MIN,
      RATE_MAX,
    );
    if (this.spawnPerSecond === 0) this.spawnAccumulator = 0;
    this.hud.setRate(this.spawnPerSecond);
  }

  private adjustGravity(direction: -1 | 1): void {
    this.gravity = clamp(
      this.gravity + direction * GRAVITY_STEP,
      GRAVITY_MIN,
      GRAVITY_MAX,
    );
    this.hud.setGravity(this.gravity);
  }

  private layout(): void {
    const screenWidth = this.app.screen.width;
    const screenHeight = this.app.screen.height;
    const margin = Math.max(12, Math.min(screenWidth, screenHeight) * 0.04);
    const width = Math.min(860, Math.max(200, screenWidth - margin * 2));
    const height = Math.min(720, Math.max(240, screenHeight - margin * 2));
    const x = (screenWidth - width) / 2;
    const y = (screenHeight - height) / 2;

    this.playfield.position.set(x, y);
    this.playfield.resize(width, height);
    this.sizeScale = Math.min(1, Math.max(0.55, width / 640));
    this.hud.place(x, y, width, height);
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
