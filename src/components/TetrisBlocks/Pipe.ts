import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class Pipe extends Block {
  constructor(container: Tetris) {
    const WIDTH = 1;
    const HEIGHT = 4;
    super(container, WIDTH, HEIGHT);
    this.write();
  }

  initPoints(): void {
    this.pointSet.add([0, 0]);
    this.pointSet.add([0, 1]);
    this.pointSet.add([0, 2]);
    this.pointSet.add([0, 3]);
  }

  write() {
    this.traverse(() => 2);
  }

  erase() {
    this.traverse(() => -1);
  }
}
