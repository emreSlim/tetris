import { Tetris } from "../Tetris/Tetris";

export class PointSet extends Array<number[]> {
  has = (val: number[]) => {
    for (let _val of this)
      if (_val[0] === val[0] && _val[1] === val[1]) return true;

    return false;
  };
  add = (val: number[]) => {
    if (!this.has(val)) this.push(val);
  };
}

export abstract class Block {
  protected x = 0;
  protected y = 0;
  protected blockHeight: number;
  protected blockWidth: number;
  protected container: Tetris;
  protected pointSet: PointSet;
  constructor(container: Tetris, width: number, height: number) {
    this.container = container;
    this.blockWidth = width;
    this.blockHeight = height;

    this.x = Math.floor(container.matrixWidth / 2);
    this.y = -height;

    this.pointSet = new PointSet();
    this.initPoints();
  }

  abstract initPoints(): void;

  flipHrizontally() {
    for (let point of this.pointSet) {
      point[0] = this.blockWidth - 1 - point[0];
      // point[1] = this.blockHeight - 1 - point[1];
    }
  }

  flipVertically() {
    for (let point of this.pointSet) {
      // point[0] = this.blockWidth - 1 - point[0];
      point[1] = this.blockHeight - 1 - point[1];
    }
  }

  flipXY (){
    this.pointSet.forEach((point) => {
      const temp = point[0];
      point[0] = point[1];
      point[1] = temp;
    });
  }

  rotate(antiClockwise?: boolean) {
    this.erase();

    this.pointSet.forEach((point) => {
      const temp = point[0];
      point[0] = point[1];
      point[1] = temp;
    });

    this.flipHrizontally();

    const tempH = this.blockHeight;
    this.blockHeight = this.blockWidth;
    this.blockWidth = tempH;

    this.write();
  }

  protected traverse(
    cb: (val: number, row: number, col: number) => number | boolean | void
  ) {
    outer: for (let [pointX, pointY] of this.pointSet) {
      const col = this.x + pointX;
      const row = this.y + pointY;
      const isOutOfFrame =
        row < 0 ||
        col < 0 ||
        row > this.container.matrixHeight ||
        col > this.container.matrixWidth;
      const val = isOutOfFrame ? -1 : this.container.matrix[row][col];

      const returnVal = cb(val, row, col);
      if (!isOutOfFrame && typeof returnVal === "number") {
        this.container.matrix[row][col] = returnVal;
      } else if (returnVal === false) {
        //-1 stops the loops
        break outer;
      }
    }
  }

  private isOnLeft = () => this.x <= 0;
  private isOnRight = () =>
    this.x + this.blockWidth >= this.container.matrixWidth;
  private isOnTop = () => this.y <= 0;
  private isOnBottom = () =>
    this.y + this.blockHeight >= this.container.matrixHeight;

  private scanHorizontalNeighbours(x: number) {
    if ((x < 0 && this.isOnLeft()) || (x > 0 && this.isOnRight())) return false;

    if (x !== 0) {
      for (let [pointX, pointY] of this.pointSet) {
        const col = this.x + pointX + x;
        const row = this.y + pointY;
        if (
          !this.pointSet.has([col, row]) &&
          col >= 0 &&
          col < this.container.matrixWidth &&
          row >= 0 &&
          row < this.container.matrixHeight
        ) {
          if (this.container.matrix[row][col] == 1) return false;
        }
      }
    }

    return true;
  }

  private scanVerticalNeighbours(y: number) {
    if ((y < 0 && this.isOnTop()) || (y > 0 && this.isOnBottom())) return false;

    if (y !== 0) {
      for (let [pointX, pointY] of this.pointSet) {
        const col = this.x + pointX;
        const row = this.y + pointY + y;

        if (
          !this.pointSet.has([col, row]) &&
          col >= 0 &&
          col < this.container.matrixWidth &&
          row >= 0 &&
          row < this.container.matrixHeight
        ) {
          if (this.container.matrix[row][col] == 1) return false;
        }
      }
    }

    return true;
  }

  abstract write(): void;
  abstract erase(): void;

  move(x = 0, y = 0) {
    const isFreeToMove =
      this.scanVerticalNeighbours(y) && this.scanHorizontalNeighbours(x);

    if (isFreeToMove) {
      this.erase();
      this.x += x;
      this.y += y;
      this.write();
      return true;
    } else {
      return false;
    }
  }

  moveLeft() {
    if (this.scanHorizontalNeighbours(-1)) {
      this.erase();
      this.x -= 1;
      this.write();
      return true;
    }
    return false;
  }
  moveRight() {
    if (this.scanHorizontalNeighbours(1)) {
      this.erase();
      this.x += 1;
      this.write();
      return true;
    }
    return false;
  }
  moveDown() {
    if (this.scanVerticalNeighbours(1)) {
      this.erase();
      this.y += 1;
      this.write();
      return true;
    }
    return false;
  }
  moveUp() {
    if (this.scanVerticalNeighbours(-1)) {
      this.erase();
      this.y -= 1;
      this.write();
      return true;
    }
    return false;
  }
}
