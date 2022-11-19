import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class S extends Block {
  constructor(container: Tetris, initC?: number) {
    const WIDTH = 3;
    const HEIGHT = 2;
    super(container, WIDTH, HEIGHT, initC);
  }
  initBlock(): void {
    this.block = [
      [false, true, true],
      [true, true, false],
    ];
  }
}
