import { Tetris } from "../Tetris/Tetris";

export abstract class Block {
  protected c = 0;
  protected r = 0;
  protected rowCount: number;
  protected colCount: number;
  protected container: Tetris;
  protected block: boolean[][];

  constructor(
    container: Tetris,
    colCount: number,
    rowCount: number,
    initC = Math.floor(container.matrixWidth / 2)
  ) {
    this.container = container;
    this.colCount = colCount;
    this.rowCount = rowCount;

    this.c = initC;
    this.r = -rowCount;

    this.initBlock();
    this.write();
  }

  freeze() {
    this.traverse((val) => (val > 0 ? val : 2));
  }

  write() {
    this.traverse(() => 0);
  }

  erase() {
    this.traverse(() => -1);
  }

  abstract initBlock(): void;

  rotate(antiClockwise?: boolean) {
    this.erase();
    const newBlock: boolean[][] = new Array();
    this.block.forEach(() => {
      newBlock.push(new Array());
    });
    for (let r = 0; r < this.rowCount; r++) {
      for (let c = 0; c < this.colCount; c++) {
        newBlock[c].unshift(this.block[r][c]);
      }
    }

    this.block = newBlock;
    const tempH = this.rowCount;
    this.rowCount = this.colCount;
    this.colCount = tempH;

    if (this.colCount + this.c >= this.container.matrixWidth) {
      this.c = this.container.matrixWidth - this.colCount;
    }

    if (this.rowCount + this.r >= this.container.matrixHeight) {
      this.r = this.container.matrixHeight - this.rowCount;
    }

    this.write();
  }

  protected traverse(
    cb: (val: number, row: number, col: number) => number | boolean | void
  ) {
    outer: for (let r = 0; r < this.rowCount; r++) {
      for (let c = 0; c < this.colCount; c++) {
        if (this.block[r][c] === false) continue;
        const col = this.c + c;
        const row = this.r + r;

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
  }

  private isOnLeft = () => this.c <= 0;
  private isOnRight = () =>
    this.c + this.colCount >= this.container.matrixWidth;
  private isOnTop = () => this.r <= 0;
  private isOnBottom = () =>
    this.r + this.rowCount >= this.container.matrixHeight;

  private scanHorizontalNeighbours(x: number) {
    if ((x < 0 && this.isOnLeft()) || (x > 0 && this.isOnRight())) return false;
    let noConflict = true;
    if (x !== 0) {
      this.traverse((_, r, c) => {
        c += x;
        if (this.container.isLegalCell(r, c)) {
          if (this.container.matrix[r][c] > 0) {
            noConflict = false;
            return false;
          }
        }
      });
    }
    return noConflict;
  }

  private scanVerticalNeighbours(y: number) {
    if ((y < 0 && this.isOnTop()) || (y > 0 && this.isOnBottom())) return false;
    let noConflict = true;
    if (y !== 0) {
      this.traverse((_, r, c) => {
        r += y;
        if (this.container.isLegalCell(r, c)) {
          if (this.container.matrix[r][c] > 0) {
            noConflict = false;
            return false;
          }
        }
      });
    }
    return noConflict;
  }

  move(x = 0, y = 0) {
    const isFreeToMove =
      this.scanVerticalNeighbours(y) && this.scanHorizontalNeighbours(x);

    if (isFreeToMove) {
      this.erase();
      this.c += x;
      this.r += y;
      this.write();
      return true;
    } else {
      return false;
    }
  }

  moveLeft() {
    if (this.scanHorizontalNeighbours(-1)) {
      this.erase();
      this.c -= 1;
      this.write();
      return true;
    }
    return false;
  }
  moveRight() {
    if (this.scanHorizontalNeighbours(1)) {
      this.erase();
      this.c += 1;
      this.write();
      return true;
    }
    return false;
  }
  moveDown() {
    if (this.scanVerticalNeighbours(1)) {
      this.erase();
      this.r += 1;
      this.write();
      return true;
    }
    return false;
  }
  moveUp() {
    if (this.scanVerticalNeighbours(-1)) {
      this.erase();
      this.r -= 1;
      this.write();
      return true;
    }
    return false;
  }
}
