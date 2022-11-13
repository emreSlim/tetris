import { Random, Debouncer } from "../../helpers";
import { Component } from "../Component";
import { Block, L, LOpposite, P, Pipe, Square } from "../TetrisBlocks";

export class Tetris extends Component {
  matrix: number[][]; // -1 = space; 0 = moving; 1 = about to clear; 2 = filled
  matrixWidth: number;
  matrixHeight: number;
  width: number;
  height: number;
  cellSize = 51; //1 pixel for gap
  currentBlock: Block;
  score = 0;
  frameDelay = 1000;
  ctx: CanvasRenderingContext2D;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cellSize = 51,
    frameDelay = 1000
  ) {
    super();
    this.cellSize = cellSize;
    this.frameDelay = frameDelay;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.matrixWidth = Math.floor(width / this.cellSize);
    this.matrixHeight = Math.floor(height / this.cellSize);

    this.matrix = new Array(this.matrixHeight);

    this.fillMatrix();
  }

  isLegalCell(r: number, c: number) {
    return c >= 0 && c < this.matrixWidth && r >= 0 && r < this.matrixHeight;
  }

  destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("pointerdown", this.onPointerDown);

    document.removeEventListener("dblclick", this.onDblClick);
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      this.currentBlock.moveLeft();
    }
    if (e.key === "ArrowRight") {
      this.currentBlock.moveRight();
    }
    if (e.key == "ArrowDown") {
      this.currentBlock.moveDown();
    }
    if (e.key == " ") {
      this.currentBlock.rotate();
    }

    this.draw(this.ctx);
  };

  attachListeners(ctx: CanvasRenderingContext2D) {
    window.addEventListener("keydown", this.onKeyDown);

    // const guestureCB = new Debouncer((e: PointerEvent) => {
    //   if (e.movementX > 0) {
    //     this.currentBlock.moveRight();
    //   }
    //   if (e.movementX < 0) {
    //     this.currentBlock.moveLeft();
    //   }
    //   if (e.movementY > 0) {
    //     this.currentBlock.moveDown();
    //   }
    //   this.draw(ctx);
    // }, 100).schedule;

    // document.addEventListener("pointerdown", () => {
    //   window.addEventListener("pointermove", guestureCB);
    // });
    // document.addEventListener("pointerup", () => {
    //   window.removeEventListener("pointermove", guestureCB);
    // });

    document.addEventListener("pointerdown", this.onPointerDown);

    document.addEventListener("dblclick", this.onDblClick);
  }

  onPointerDown = (e: PointerEvent) => {
    if (e.clientX > this.width * (2 / 3)) {
      this.currentBlock.moveRight();
    } else if (e.clientX < this.width / 3) {
      this.currentBlock.moveLeft();
    } else if (e.clientY > this.height * (2 / 3)) {
      this.currentBlock.moveDown();
    } else {
      this.currentBlock.rotate();
    }

    this.draw(this.ctx);
  };
  onDblClick = (e: PointerEvent) => {};

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
        val == 2 ? "#f00" : val == 1 ? "#0f0" : val == 0 ? "#00f" : "#bbb";

      ctx.fillRect(
        c * this.cellSize,
        r * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      );
    });
  }

  private addRandomBlock() {
    const B = Random.item([Square, P, L, Pipe, LOpposite]);
    this.currentBlock = new B(this);
  }

  gameOverCb: CallableFunction;

  onGameOver(cb: CallableFunction) {
    this.gameOverCb = cb;
  }

  public play(ctx: CanvasRenderingContext2D) {
    this.fillMatrix();
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
          }, this.frameDelay / 2);
        }
        this.currentBlock.freeze();

        this.addRandomBlock();
        const newBlockFallen = this.currentBlock.moveDown();
        if (!newBlockFallen) {
          window.clearInterval(timerId);
          this.gameOverCb?.();
          return;
        }
      }
      this.draw(ctx);
    }, this.frameDelay);
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
        this.matrix[r][c] = 1;
      }
    }
  };

  private clearFilledRows(indices: number[]) {
    for (let rowIndex of indices) {
      for (let r = rowIndex; r >= 0; r--) {
        for (let c = 0; c < this.matrixWidth; c++) {
          if (this.matrix[r][c] !== 0) {
            //if not moving
            if (r === 0) this.matrix[r][c] = -1;
            else if (this.matrix[r - 1][c] !== 0)
              //if not moving
              this.matrix[r][c] = this.matrix[r - 1][c];
          }
        }
      }
    }
    this.score += indices.length * this.matrixWidth;
  }

  doesPointIntercept(x: number, y: number): boolean {
    return true;
  }
}
