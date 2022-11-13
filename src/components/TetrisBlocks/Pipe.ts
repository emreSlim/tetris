import { Tetris } from "../Tetris/Tetris";
import { Block } from "./Block";

export class Pipe extends Block {
  constructor(container: Tetris) {
    const WIDTH = 1;
    const HEIGHT = 4;
    super(container, WIDTH, HEIGHT);
    this.write();
  }
  write() {
    this.traverse(() => 2);
  }

  erase() {
    this.traverse(() => -1);
  }
}
