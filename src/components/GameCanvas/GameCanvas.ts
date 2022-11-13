import { Tetris } from "../Tetris/Tetris";
import { Text } from "../Text/Text";

export class GameCanvas {
  node: HTMLCanvasElement;

  constructor(width: number, height: number) {
    this.node = document.createElement("canvas");
    this.node.width = width;
    this.node.height = height;

    this.init();
  }

  get width() {
    return this.node.width;
  }
  get height() {
    return this.node.height;
  }

  private onMount() {}

  private init() {
    const ctx = this.node.getContext("2d");
    if (ctx) {
      this.showIntro(ctx);
    }
  }

  private showIntro(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);

    const welcome = new Text(
      "Tetris Blocks",
      this.width / 2,
      this.height / 2,
      72
    );

    welcome.centered = true;
    welcome.draw(ctx);

    const start = new Text("Start", welcome.x, welcome.y + 100, 30);
    start.centered = welcome.centered;
    start.draw(ctx);
    const onStartClick = () => {
      start.removeEventListener(this.node, "click", onStartClick);
      this.startGame(ctx);
    };

    start.addEventListener(this.node, "click", onStartClick);
  }

  showGameOver(ctx: CanvasRenderingContext2D, score: number) {
    ctx.clearRect(0, 0, this.width, this.height);
    const gameover = new Text(
      "Game Over..",
      this.width / 2,
      this.height / 2,
      48
    );
    gameover.centered = true;

    gameover.draw(ctx);

    const scoreText = new Text(
      "Score: " + score,
      this.width / 2,
      50 + this.height / 2,
      64
    );
    scoreText.centered = true;

    scoreText.draw(ctx);
  }

  private startGame(ctx: CanvasRenderingContext2D) {
    const game = new Tetris(this.width, this.height);
    game.play(ctx);
    game.draw(ctx);
    game.focused = true;
    game.attachListeners(ctx);
    game.onGameOver(() => {
      this.showGameOver(ctx, game.score);
      window.setTimeout(() => {
        this.showIntro(ctx);
      }, 3000);
    });
  }
}
