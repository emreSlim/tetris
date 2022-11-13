import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class P extends Block {
  constructor(container: Tetris) {
    const WIDTH = 2;
    const HEIGHT = 3;
    super(container, WIDTH, HEIGHT);
  }

  initBlock(): void {
    this.block = [
      [true, false],
      [true, true],
      [true, false],
    ];
  }
}
