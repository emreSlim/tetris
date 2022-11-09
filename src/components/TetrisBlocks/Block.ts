import { Tetris } from "../Tetris/Tetris";

export abstract class Block {
  protected x = 0;
  protected y = 0;
  protected blockHeight: number;
  protected blockWidth: number;
  protected container: Tetris;
  constructor(container: Tetris, width: number, height: number) {
    this.container = container;
    this.blockWidth = width;
    this.blockHeight = height;

    this.x = Math.floor(container.matrixWidth / 2);
    this.y = 1 - height;
  }

  protected traverse(
    cb: (val: boolean, row: number, col: number) => boolean | void | number
  ) {
    outer: for (let r = 0; r < this.blockHeight; r++) {
      for (let c = 0; c < this.blockWidth; c++) {
        const row = r + this.y;
        const col = c + this.x;

        const isOutOfFrame =
          row < 0 ||
          col < 0 ||
          row > this.container.matrixHeight ||
          col > this.container.matrixWidth;

        const val = isOutOfFrame ? false : this.container.matrix[row][col];

        const returnVal = cb(val, row, col);
        if (!isOutOfFrame && typeof returnVal === "boolean") {
          this.container.matrix[row][col] = returnVal;
        } else if (returnVal === -1) {
          //-1 stops the loops
          break outer;
        }
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
      const startingX = x > 0 ? this.x + this.blockWidth : this.x + x;
      const limitX = x > 0 ? startingX + x : this.x;

      for (let r = this.y; r < this.blockHeight + this.y; r++) {
        if (r < 0) continue;
        if (r >= this.container.matrixHeight) break;
        for (let c = startingX; c < limitX; c++) {
          if (c < 0) continue;
          if (c >= this.container.matrixWidth) break;

          if (this.container.matrix[r][c] == true) return false; //already occupied
        }
      }
    }

    return true;
  }

  private scanVerticalNeighbours(y: number) {
    if ((y < 0 && this.isOnTop()) || (y > 0 && this.isOnBottom())) return false;

    if (y !== 0) {
      const startingY = y > 0 ? this.y + this.blockHeight : this.y + y;
      const limitY = y > 0 ? startingY + y : this.y;

      for (let r = startingY; r < limitY; r++) {
        if (r < 0) continue;
        if (r >= this.container.matrixHeight) break;

        for (let c = this.x; c < this.blockWidth + this.x; c++) {
          if (c < 0) continue;
          if (c >= this.container.matrixWidth) break;
          if (this.container.matrix[r][c] == true) return false; //already occupied
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
