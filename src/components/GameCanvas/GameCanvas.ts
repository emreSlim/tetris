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
    const welcome = new Text("Welcome!", this.width / 2, this.height / 2, 72);

    welcome.centered = true;
    welcome.draw(ctx);

    const start = new Text("Start", welcome.x, welcome.y + 50, 30);
    start.centered = welcome.centered;
    start.draw(ctx);

    const onStartClick = () => {
      start.removeEventListener(this.node, "click", onStartClick);
      this.startGame(ctx);
    };

    start.addEventListener(this.node, "click", onStartClick);
  }

  private startGame(ctx: CanvasRenderingContext2D) {
    console.log("start game");
  }
}
