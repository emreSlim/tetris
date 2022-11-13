import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class LOpposite extends Block {
  constructor(container: Tetris) {
    const WIDTH = 2;
    const HEIGHT = 3;
    super(container, WIDTH, HEIGHT);
  }
  initBlock(): void {
    this.block = [
      [false, true],
      [false, true],
      [true, true],
    ];
  }
}
