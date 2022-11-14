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
    start.style = "purple";
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

    const easy = new Text(
      "Easy",
      this.width * (2 / 3),
      this.height * (1 / 5),
      48
    );
    easy.style = "purple";
    easy.centered = true;
    easy.draw(ctx);

    const medium = new Text(
      "Medium",
      this.width * (2 / 3),
      this.height * (2 / 5),
      48
    );
    medium.style = "purple";
    medium.centered = true;
    medium.draw(ctx);

    const hard = new Text(
      "Hard",
      this.width * (2 / 3),
      this.height * (3 / 5),
      48
    );
    hard.style = "purple";
    hard.centered = true;
    hard.draw(ctx);

    const extraHard = new Text(
      "ExtraHard",
      this.width * (2 / 3),
      this.height * (4 / 5),
      48
    );
    extraHard.style = "purple";
    extraHard.centered = true;
    extraHard.draw(ctx);

    const easyCb = () => {
      this.startGame(ctx, 1);
      easy.style = "#f00";
      easy.draw(ctx);
      cbArray.forEach((t) =>
        t[0].removeEventListener(this.node, "click", t[1])
      );
    };

    const mediumCb = () => {
      this.startGame(ctx, 2);
      medium.style = "#f00";
      medium.draw(ctx);
      cbArray.forEach((t) =>
        t[0].removeEventListener(this.node, "click", t[1])
      );
    };

    const hardCb = () => {
      this.startGame(ctx, 3);
      hard.style = "#f00";
      hard.draw(ctx);
      cbArray.forEach((t) =>
        t[0].removeEventListener(this.node, "click", t[1])
      );
    };

    const extraHardCb = () => {
      this.startGame(ctx, 4);
      extraHard.style = "#f00";
      extraHard.draw(ctx);
      cbArray.forEach((t) =>
        t[0].removeEventListener(this.node, "click", t[1])
      );
    };

    const cbArray = [
      [easy, easyCb] as any,
      [medium, mediumCb],
      [hard, hardCb],
      [extraHard, extraHardCb],
    ];

    easy.addEventListener(this.node, "click", easyCb);
    medium.addEventListener(this.node, "click", mediumCb);
    hard.addEventListener(this.node, "click", hardCb);
    extraHard.addEventListener(this.node, "click", extraHardCb);
  };

  showGameOver(ctx: CanvasRenderingContext2D, score: number) {
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = "black";

    const gameover = new Text(
      "Game Over..",
      this.width / 2,
      this.height / 2 - 60,
      48
    );

    gameover.centered = true;

    gameover.draw(ctx);

    const scoreText = new Text(
      "Score: " + score,
      this.width / 2,
      this.height / 2,
      64
    );
    scoreText.centered = true;
    scoreText.style = "#f00";
    scoreText.draw(ctx);

    const lobby = new Text("Lobby", this.width / 2, 70 + this.height / 2, 32);
    lobby.style = "purple";
    lobby.centered = true;

    lobby.draw(ctx);

    const lobbyClickCb = () => {
      this.showIntro(ctx);
      lobby.removeEventListener(this.node, "click", lobbyClickCb);
    };

    lobby.addEventListener(this.node, "click", lobbyClickCb);
  }

  private startGame(ctx: CanvasRenderingContext2D, level: number) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.width, this.height);
    const starting = new Text(
      "Starting..",
      this.width / 3,
      this.height / 2,
      48
    );
    starting.style = "black";
    starting.centered = true;
    starting.draw(ctx);

    window.setTimeout(() => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, this.width, this.height);
      const game = new Tetris(
        ctx,
        this.width,
        this.height,
        this.width / Math.floor(this.width / 50),
        level
      );

      game.onGameOver(() => {
        this.showGameOver(ctx, game.score);
        game.destroy();
      });
    }, 1000);
  }
}
