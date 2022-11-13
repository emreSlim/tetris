import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class Pipe extends Block {
  constructor(container: Tetris) {
    const WIDTH = 1;
    const HEIGHT = 4;
    super(container, WIDTH, HEIGHT);
  }

  initBlock(): void {
    this.block = [[true], [true], [true], [true]];
  }
}
