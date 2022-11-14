import { Random, Debouncer } from "../../helpers";
import { Component } from "../Component";
import { Text } from "../Text/Text";
import { Block, L, LOpposite, P, Pipe, Square } from "../TetrisBlocks";

export class Tetris extends Component {
  readonly matrix: number[][]; // -1 = space; 0 = moving; 1 = about to clear; 2 = filled
  readonly matrixWidth: number;
  readonly matrixHeight: number;
  readonly width: number;
  readonly height: number;
  readonly cellSize: number; //1 pixel for gap
  private currentBlock: Block;
  public score = 0;
  private frameDelay = 1000;
  private ctx: CanvasRenderingContext2D;
  private offsetY: number;
  private difficulty: number;
  private isFastForward = true;

  constructor(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    cellSize = 51,
    difficulty = 1
  ) {
    super();
    this.cellSize = cellSize;
    this.difficulty = difficulty;
    this.frameDelay = 700 / Math.sqrt(difficulty);
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.matrixWidth = Math.floor(width / this.cellSize);
    this.matrixHeight = Math.floor(height / this.cellSize);

    this.matrix = new Array(this.matrixHeight);
    this.offsetY = (this.height - this.cellSize * this.matrixHeight) / 2;
    this.fillMatrix();
    this.attachListeners();
    this.play();
  }

  public isLegalCell(r: number, c: number) {
    return c >= 0 && c < this.matrixWidth && r >= 0 && r < this.matrixHeight;
  }

  public destroy() {
    window.removeEventListener("keydown", this.onKeyDown);
    document.removeEventListener("pointerdown", this.onPointerDown);

    document.removeEventListener("dblclick", this.onDblClick);
  }

  private onKeyDown = (e: KeyboardEvent) => {
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

  private attachListeners() {
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

  private onPointerDown = (e: PointerEvent) => {
    if (e.clientX > this.width * (3 / 4)) {
      this.currentBlock.moveRight();
    } else if (e.clientX < this.width / 4) {
      this.currentBlock.moveLeft();
    } else if (e.clientY > this.height * (3 / 4)) {
      this.currentBlock.moveDown();
    } else {
      this.currentBlock.rotate();
    }

    this.draw(this.ctx);
  };
  private onDblClick = (e: PointerEvent) => {};

  private fillMatrix() {
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
    this.displayArrows(ctx);
    this.displayScore(ctx);
    this.traverse((val, r, c) => {
      ctx.fillStyle =
        val == 2 ? "#f003" : val == 1 ? "#0f03" : val == 0 ? "#00f3" : "#bbb2";
      this.fillCell(r, c);
    });
  }

  private displayScore = (ctx: CanvasRenderingContext2D) => {
    const score = new Text(
      "Score:" + this.score,
      this.cellSize,
      this.offsetY + (this.cellSize * 3) / 4,
      48
    );
    score.style = "#00000080";
    score.draw(ctx);
  };

  private displayArrows = (ctx: CanvasRenderingContext2D) => {
    //arrow right
    ctx.strokeStyle = "#00000003";
    ctx.lineWidth = this.cellSize;

    {
      const aw = this.height / 8;
      const al = this.width / 8;
      const y = this.height / 2;

      ctx.beginPath();
      const rx = this.width * (13 / 16);
      ctx.moveTo(rx, y - aw);
      ctx.lineTo(rx + al, y);
      ctx.lineTo(rx, y + aw);
      ctx.closePath();
      ctx.stroke();

      //arrow left
      ctx.beginPath();
      const lx = this.width * (3 / 16);
      ctx.moveTo(lx, y - aw);
      ctx.lineTo(lx - al, y);
      ctx.lineTo(lx, y + aw);
      ctx.closePath();
      ctx.stroke();
    }
    {
      const aw = this.width / 8;
      const al = this.height / 8;
      const x = this.width / 2;

      //arrowdown
      const dy = this.height * (13 / 16);
      ctx.beginPath();
      ctx.moveTo(x - aw, dy);
      ctx.lineTo(x, dy + al);
      ctx.lineTo(x + aw, dy);
      ctx.closePath();
      ctx.stroke();
    }

    //round
    ctx.beginPath();
    ctx.arc(this.width / 2, this.height / 2, this.width / 14, 0, Math.PI * 2);
    ctx.stroke();
  };

  private addRandomBlock() {
    const B = Random.item([Square, P, L, Pipe, LOpposite]);
    this.currentBlock = new B(
      this,
      this.isFastForward ? Random.int(this.matrixWidth - 3) : undefined
    );
    Random.iterations(() => {
      this.currentBlock.rotate();
    });
  }

  private gameOverCb: CallableFunction;

  public onGameOver(cb: CallableFunction) {
    this.gameOverCb = cb;
  }

  private fillCell = (r: number, c: number) => {
    this.ctx.fillRect(
      c * this.cellSize,
      r * this.cellSize + this.offsetY,
      this.cellSize - 4,
      this.cellSize - 4
    );
  };

  public play() {
    this.fillMatrix();
    this.addRandomBlock();
    this.draw(this.ctx);
    let requestFrame = true;
    const cb = () => {
      if (requestFrame) {
        this.draw(this.ctx);
        window.requestAnimationFrame(cb);
      }
    };

    window.requestAnimationFrame(cb);

    let timerId: number;

    const onTick = () => {
      this.traverse((val, r, c) => {
        if (val != -1) return;
        this.ctx.fillStyle = "#bbb4";
        this.fillCell(r, c);
      });
      const fallen = !this.currentBlock.moveDown();

      if (fallen) {
        const filledRows = this.getFilledRows();
        if (filledRows.length > 0) {
          this.setFilledRows(filledRows);

          window.setTimeout(() => {
            this.clearFilledRows(filledRows);
          }, this.frameDelay / 2);
        }
        this.currentBlock.freeze();

        this.addRandomBlock();
        const newBlockFallen = this.currentBlock.moveDown();
        if (!newBlockFallen) {
          requestFrame = false;
          window.clearInterval(timerId);
          this.gameOverCb?.();
          return;
        }
      }
    };

    const preplayTimer = window.setInterval(onTick, this.frameDelay / 16);
    window.setTimeout(() => {
      window.clearInterval(preplayTimer);
      this.isFastForward = false;
      timerId = window.setInterval(onTick, this.frameDelay);
    }, this.height + this.width);
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

  public doesPointIntercept(x: number, y: number): boolean {
    return true;
  }
}
