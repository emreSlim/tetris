import { Tetris } from "../Tetris/Tetris";
import { Block } from ".";

export class Square extends Block {
  constructor(container: Tetris) {
    const WIDTH = 2;
    const HEIGHT = 2;
    super(container, WIDTH, HEIGHT);
    this.write();
  }

  initPoints(): void {
    this.pointSet.add([0, 0]);
    this.pointSet.add([0, 1]);
    this.pointSet.add([1, 0]);
    this.pointSet.add([1, 1]);
  }

  write() {
    this.traverse(() => 2);
  }

  erase() {
    this.traverse(() => -1);
  }
}
