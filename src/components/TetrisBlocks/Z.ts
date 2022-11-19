import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class Z extends Block {
  constructor(container: Tetris, initC?: number) {
    const WIDTH = 2;
    const HEIGHT = 3;
    super(container, WIDTH, HEIGHT, initC);
  }
  initBlock(): void {
    this.block = [
      [true, true, false],
      [false, true, true],
    ];
  }
}
