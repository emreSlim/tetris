import { Tetris } from "../Tetris/Tetris";
import { Text } from "../Text/Text";

export class GameCanvas {
  node: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(width: number, height: number) {
    this.node = document.createElement("canvas");
    this.node.width = width;
    this.node.height = height;
    this.ctx = this.node.getContext("2d");
  }

  get width() {
    return this.node.width;
  }
  get height() {
    return this.node.height;
  }

  onGameOver = (score: number) => {};
  public startGame() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);
    const starting = new Text(
      "Starting..",
      this.width / 2,
      this.height / 2,
      48
    );
    starting.style = "black";
    starting.centered = true;
    starting.draw(this.ctx);

    window.setTimeout(() => {
      const game = new Tetris(
        this.ctx,
        this.width,
        this.height,
        this.width / 16
      );

      window.addEventListener("keydown", game.onKeyDown);

      this.node.addEventListener("pointerdown", game.onPointerDown);

      game.onGameOver(() => {
        this.onGameOver(game.score);
      });
    }, 1000);
  }
}
