import { GRAVITY_MAX, GRAVITY_MIN, RATE_MAX, RATE_MIN } from "../config";

function element<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing #${id}`);
  return node as T;
}

/** HTML readout and controls positioned over the playfield rectangle. */
export class Hud {
  onRateStep: (direction: -1 | 1) => void = () => {};
  onGravityStep: (direction: -1 | 1) => void = () => {};

  private readonly root = element<HTMLDivElement>("hud");
  private readonly count = element<HTMLElement>("shape-count");
  private readonly area = element<HTMLElement>("shape-area");
  private readonly rate = element<HTMLElement>("rate-value");
  private readonly gravity = element<HTMLElement>("gravity-value");
  private readonly rateDec = element<HTMLButtonElement>("rate-dec");
  private readonly rateInc = element<HTMLButtonElement>("rate-inc");
  private readonly gravityDec = element<HTMLButtonElement>("gravity-dec");
  private readonly gravityInc = element<HTMLButtonElement>("gravity-inc");

  constructor() {
    this.rateDec.addEventListener("click", () => this.onRateStep(-1));
    this.rateInc.addEventListener("click", () => this.onRateStep(1));
    this.gravityDec.addEventListener("click", () => this.onGravityStep(-1));
    this.gravityInc.addEventListener("click", () => this.onGravityStep(1));
  }

  place(x: number, y: number, width: number, height: number): void {
    this.root.style.transform = `translate(${x}px, ${y}px)`;
    this.root.style.width = `${width}px`;
    this.root.style.height = `${height}px`;
  }

  setStats(count: number, area: number): void {
    this.count.textContent = String(count);
    this.area.textContent = area.toLocaleString("en-US");
  }

  setRate(value: number): void {
    this.rate.textContent = String(value);
    this.rateDec.disabled = value <= RATE_MIN;
    this.rateInc.disabled = value >= RATE_MAX;
  }

  setGravity(value: number): void {
    this.gravity.textContent = String(value);
    this.gravityDec.disabled = value <= GRAVITY_MIN;
    this.gravityInc.disabled = value >= GRAVITY_MAX;
  }
}
