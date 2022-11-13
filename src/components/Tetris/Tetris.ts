import { Random } from "../../helpers/ExtendedClasses";
import { Component } from "../Component";
import { Block, L, P, Pipe, Square } from "../TetrisBlocks";

export class Tetris extends Component {
  matrix: number[][]; // -1 = space; 0 = about to clear; 1 = filled // 2 = moving
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
      } else if (e.key == " ") {
        this.currentBlock.rotate();
        this.draw(ctx);
      }
    });
  }

  fillMatrix() {
    for (let r = 0; r < this.matrixHeight; r++) {
      this.matrix[r] = new Array(this.matrixWidth);
      for (let c = 0; c < this.matrixWidth; c++) {
        this.matrix[r][c] = -1;
      }
    }
  }

  private traverse(
    cb: (val: number, row: number, col: number) => number | void
  ) {
    for (let r = 0; r < this.matrixHeight; r++) {
      for (let c = 0; c < this.matrixWidth; c++) {
        const returnVal = cb(this.matrix[r][c], r, c);
        if (typeof returnVal === "number") {
          this.matrix[r][c] = returnVal;
        }
      }
    }
  }

  protected _draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.width, this.width);
    this.traverse((val, r, c) => {
      ctx.fillStyle =
        val == 1 ? "#f00" : val == 0 ? "#0f0" : val == 2 ? "#00f" : "#bbb";

      ctx.fillRect(
        c * this.cellSize,
        r * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      );
    });
  }

  private addRandomBlock() {
    const B = Random.item([Square, P, L, Pipe]);
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

      if (fallen) {
        const filledRows = this.getFilledRows();
        if (filledRows.length > 0) {
          this.setFilledRows(filledRows);
          this.draw(ctx);
          window.setTimeout(() => {
            this.clearFilledRows(filledRows);
          }, 500);
        }
        this.traverse((val) => (val == 2 ? 1 : val));

        this.addRandomBlock();
        const newBlockFallen = this.currentBlock.moveDown();
        if (!newBlockFallen) {
          window.clearInterval(timerId);
          this.gameOverCb?.();
          return;
        }
      }
      this.draw(ctx);
    }, 1000);
  }

  private getFilledRows = () => {
    const indices: number[] = [];
    for (let r = this.matrixHeight - 1; r >= 0; r--) {
      //reverse
      let areAllFilled = true;
      for (let c = this.matrixWidth - 1; c >= 0; c--) {
        if (this.matrix[r][c] === -1) {
          areAllFilled = false;
          break;
        }
      }
      if (areAllFilled) indices.unshift(r);
    }
    return indices;
  };

  private setFilledRows = (indices: number[]) => {
    for (let r of indices) {
      for (let c = 0; c < this.matrixWidth; c++) {
        this.matrix[r][c] = 0;
      }
    }
  };

  private clearFilledRows(indices: number[]) {
    for (let rowIndex of indices) {
      for (let r = rowIndex; r >= 0; r--) {
        for (let c = 0; c < this.matrixWidth; c++) {
          if (this.matrix[r][c] !== 2) {
            if (r === 0) this.matrix[r][c] = -1;
            else if (this.matrix[r - 1][c] !== 2)
              this.matrix[r][c] = this.matrix[r - 1][c];
          }
        }
      }
    }
  }

  doesPointIntercept(x: number, y: number): boolean {
    return true;
  }
}
