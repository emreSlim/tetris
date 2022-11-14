import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class Square extends Block {
  constructor(container: Tetris, initC?: number) {
    const WIDTH = 2;
    const HEIGHT = 2;
    super(container, WIDTH, HEIGHT, initC);
  }

  initBlock(): void {
    this.block = [
      [true, true],
      [true, true],
    ];
  }
}
