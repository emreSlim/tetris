import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class I extends Block {
  constructor(container: Tetris, initC?: number) {
    const WIDTH = 1;
    const HEIGHT = 4;
    super(container, WIDTH, HEIGHT, initC);
  }

  initBlock(): void {
    this.block = [[true], [true], [true], [true]];
  }
}
