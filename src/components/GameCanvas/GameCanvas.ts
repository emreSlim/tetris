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
      this.showDifficultyScreen(ctx);
    };
    start.addEventListener(this.node, "click", onStartClick);
  }

  showDifficultyScreen = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, this.width, this.height);
    const title = new Text(
      "Select Difficulty",
      this.width / 3,
      this.height / 2,
      48
    );
    title.centered = true;
    title.draw(ctx);

    const easy = new Text("Easy", this.width * (2 / 3), this.height / 4, 48);
    easy.centered = true;
    easy.draw(ctx);

    const medium = new Text(
      "Medium",
      this.width * (2 / 3),
      this.height / 2,
      48
    );
    medium.centered = true;
    medium.draw(ctx);

    const hard = new Text(
      "Hard",
      this.width * (2 / 3),
      this.height * (3 / 4),
      48
    );
    hard.centered = true;
    hard.draw(ctx);

    const easyCb = () => {
      this.startGame(ctx, 1);
      easy.style = "#f00";
      easy.draw(ctx);
      [[easy, easyCb] as any, [medium, mediumCb], [hard, hardCb]].forEach((t) =>
        t[0].removeEventListener(this.node, "click", t[1])
      );
    };

    const mediumCb = () => {
      this.startGame(ctx, 2);
      medium.style = "#f00";
      medium.draw(ctx);
      [[easy, easyCb] as any, [medium, mediumCb], [hard, hardCb]].forEach((t) =>
        t[0].removeEventListener(this.node, "click", t[1])
      );
    };

    const hardCb = () => {
      this.startGame(ctx, 3);
      hard.style = "#f00";
      hard.draw(ctx);
      [[easy, easyCb] as any, [medium, mediumCb], [hard, hardCb]].forEach((t) =>
        t[0].removeEventListener(this.node, "click", t[1])
      );
    };

    easy.addEventListener(this.node, "click", easyCb);
    medium.addEventListener(this.node, "click", mediumCb);
    hard.addEventListener(this.node, "click", hardCb);
  };

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

  private startGame(ctx: CanvasRenderingContext2D, level: number) {
    ctx.clearRect(0, 0, this.width, this.height);
    const starting = new Text(
      "Starting..",
      this.width / 2,
      this.height / 2,
      48
    );
    starting.centered = true;
    starting.draw(ctx);

    window.setTimeout(() => {
      const game = new Tetris(
        ctx,
        this.width,
        this.height,
        50 / Math.sqrt(level),
        1000 / level
      );
      game.play(ctx);
      game.draw(ctx);
      game.focused = true;
      game.attachListeners(ctx);
      game.onGameOver(() => {
        this.showGameOver(ctx, game.score);
        game.destroy();
        window.setTimeout(() => {
          this.showIntro(ctx);
        }, 3000);
      });
    }, 1000);
  }
}
