import { Application } from "pixi.js";
import { Game } from "./game/Game";
import { Hud } from "./ui/Hud";

(async () => {
  const root = document.getElementById("app");
  const view = document.getElementById("pixi-container");
  if (!root || !view) throw new Error("Missing app containers");

  const app = new Application();
  await app.init({
    background: "#12181f",
    resizeTo: root,
    antialias: true,
  });

  view.appendChild(app.canvas);

  const game = new Game(app, new Hud());
  game.start();
})();
