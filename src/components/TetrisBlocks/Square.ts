import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class Square extends Block {
  constructor(container: Tetris) {
    const WIDTH = 2;
    const HEIGHT = 2;
    super(container, WIDTH, HEIGHT);
  }

  initBlock(): void {
    this.block = [
      [true, true],
      [true, true],
    ];
  }
}
