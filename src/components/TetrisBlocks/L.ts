import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class L extends Block {
  constructor(container: Tetris) {
    const WIDTH = 2;
    const HEIGHT = 3;
    super(container, WIDTH, HEIGHT);
  }

  initBlock(): void {
    this.block = [
      [true, false],
      [true, false],
      [true, true],
    ];
  }
}
