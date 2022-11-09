import { Random } from "../../helpers/ExtendedClasses";
import { Component } from "../Component";
import { Block } from "../TetrisBlocks/Block";
import { Pipe } from "../TetrisBlocks/Pipe";

export class Tetris extends Component {
  matrix: boolean[][];
  matrixWidth: number;
  matrixHeight: number;
  width: number;
  height: number;
  cellSize = 51; //1 pixel for gap
  currentBlock: Block;
  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
    this.matrixWidth = Math.floor(width / this.cellSize);
    this.matrixHeight = Math.floor(height / this.cellSize);

    this.matrix = new Array(this.matrixHeight);

    this.fillMatrix();
  }

  attachListeners(ctx: CanvasRenderingContext2D) {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        this.currentBlock.moveLeft();
        this.draw(ctx);
      } else if (e.key === "ArrowRight") {
        this.currentBlock.moveRight();
        this.draw(ctx);
      } else if (e.key == "ArrowDown") {
        this.currentBlock.moveDown();
        this.draw(ctx);
      }
    });
  }

  fillMatrix() {
    for (let r = 0; r < this.matrixHeight; r++) {
      this.matrix[r] = new Array(this.matrixWidth);
      for (let c = 0; c < this.matrixWidth; c++) {
        this.matrix[r][c] = false;
      }
    }
  }

  traverse(cb: (val: boolean, row: number, col: number) => boolean | void) {
    for (let r = 0; r < this.matrixHeight; r++) {
      for (let c = 0; c < this.matrixWidth; c++) {
        const returnVal = cb(this.matrix[r][c], r, c);
        if (typeof returnVal === "boolean") {
          this.matrix[r][c] = returnVal;
        }
      }
    }
  }

  protected _draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.width, this.width);
    this.traverse((val, r, c) => {
      ctx.fillStyle = val ? "red" : "#bbbbbb";

      ctx.fillRect(
        c * this.cellSize,
        r * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      );
    });
  }

  addRandomBlock() {
    const B = Random.item([Pipe]);
    this.currentBlock = new B(this);
  }

  gameOverCb: CallableFunction;

  onGameOver(cb: CallableFunction) {
    this.gameOverCb = cb;
  }

  public play(ctx: CanvasRenderingContext2D) {
    this.addRandomBlock();
    this.draw(ctx);

    const timerId = window.setInterval(() => {
      const fallen = !this.currentBlock.moveDown();
      this.draw(ctx);

      if (fallen) {
        this.clearFilledRows();
        this.addRandomBlock();
        const fallen = this.currentBlock.moveDown();
        if (!fallen) {
          window.clearInterval(timerId);
          this.gameOverCb?.();
          return;
        }

        this.draw(ctx);
      }
    }, 1000);
  }

  clearFilledRows() {
    for (let r = this.matrixHeight - 1; r >= 0; r--) {
      //reverse
      let areAllFilled = true;
      for (let c = this.matrixWidth - 1; c >= 0; c--) {
        if (!this.matrix[r][c]) {
          areAllFilled = false;
          break;
        }
      }

      if (areAllFilled) {
        for (let _r = r; _r >= 0; _r--) {
          //reverse
          for (let _c = this.matrixWidth - 1; _c >= 0; _c--) {
            if (_r != 0) {
              this.matrix[_r][_c] = this.matrix[_r - 1][_c];
            } else {
              this.matrix[_r][_c] = false;
            }
          }
        }
        r++;
      }
    }
  }

  doesPointIntercept(x: number, y: number): boolean {
    return true;
  }
}
