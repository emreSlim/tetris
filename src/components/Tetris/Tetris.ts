import { NumberE, Random } from "../../helpers";
import { Component } from "../Component";
import { Text } from "../Text/Text";
import { Block, L, J, P, I, O, S, Z } from "../TetrisBlocks";
import { CustomAudio } from "../CustomAudio/CustomAudio";

export class Tetris extends Component {
  readonly matrix: number[][]; // -1 = space; 0 = moving; 1 = about to clear; 2 = filled
  readonly matrixWidth: number;
  readonly matrixHeight: number;
  readonly width: number;
  readonly height: number;
  readonly cellSize: number; //1 pixel for gap
  private currentBlock: Block;
  private level = 1;
  private fallenCountInCurrentLevel = 0;
  public isPlaying = false;
  private mainTimer: number;
  private levelColors = [
    "#bbbbbb40",
    "#b2c3dd40",
    "#b2b8dd40",
    "#b9b2dd40",
    "#c6b2dd40",
    "#d9b2dd40",
    "#ddb2d640",
    "#ddb2c040",
    "#ddc9b240",
    "#dddcb240",
  ];
  private soundEffects = [
    new CustomAudio("felldown.m4a"),
    new CustomAudio("clearRows.m4a"),
    new CustomAudio("gameover.m4a"),
  ];
  public score = 0;
  public frameDelay = 500;
  public ctx: CanvasRenderingContext2D;
  public offsetY: number;
  public cellGap = 4;
  public canvas: HTMLCanvasElement;

  constructor(size: number) {
    super();
    this.canvas = document.createElement("canvas");
    this.canvas.width = size;
    this.canvas.height = size;

    let ctx = this.canvas.getContext("2d");
    if (ctx) this.ctx = ctx;
    this.cellSize = size / 16;
    this.width = size;
    this.height = size;
    this.matrixWidth = Math.floor(this.width / this.cellSize);
    this.matrixHeight = Math.floor(this.height / this.cellSize);

    this.matrix = new Array(this.matrixHeight);
    this.offsetY = (this.height - this.cellSize * this.matrixHeight) / 2;

    this.addRandomBlock();
  }

  public startGame() {
    if (this.ctx === null) return;

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(0, 0, this.width, this.height);
    const starting = new Text(
      "Starting..",
      this.width / 2,
      this.height / 2,
      48
    );
    starting.style = "black";
    starting.centered = true;
    starting.draw(this.ctx);
    this.initMatrix();
    this.fallenCountInCurrentLevel = 0;
    this.level = 1;
    this.score = 0;
    this.frameDelay = 500;

    window.setTimeout(this.play, 1000); //play after 1 second
  }

  public setVolume = (vol: number) => {
    this.soundEffects.forEach((s) => (vol === 0 ? s.mute() : s.unmute()));
  };

  public isLegalCell(r: number, c: number) {
    return c >= 0 && c < this.matrixWidth && r >= 0 && r < this.matrixHeight;
  }

  public onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      this.currentBlock.moveLeft();
    }
    if (e.key === "ArrowRight") {
      this.currentBlock.moveRight();
    }
    if (e.key == "ArrowDown") {
      this.currentBlock.moveDown();
    }
    if (e.key === "ArrowUp") {
      this.currentBlock.rotate();
    }
    if (e.key == " ") {
      let moveDownBy =
        this.matrixHeight - (this.currentBlock.r + this.currentBlock.rowCount);
      let moved = false;
      do {
        moved = this.currentBlock.moveDown(moveDownBy);
        if (moved) break;
        moveDownBy--;
      } while (!moved && moveDownBy > 0);
    }

    this.draw(this.ctx);
  };

  public onPointerDown = (e: PointerEvent) => {
    if (e.offsetX > this.width * (3 / 4)) {
      this.currentBlock.moveRight();
    } else if (e.offsetX < this.width / 4) {
      this.currentBlock.moveLeft();
    } else if (e.offsetY > this.height * (3 / 4)) {
      this.currentBlock.moveDown();
    } else {
      this.currentBlock.rotate();
    }

    this.draw(this.ctx);
  };

  private initMatrix() {
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
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle =
      this.levelColors[(this.level - 1) % this.levelColors.length];
    this.traverse((val, r, c) => {
      if (val > 0) return;

      this.fillCell(r, c, 0, this.offsetY);
    });
    this.displayArrows(ctx);
    this.displayScore(ctx);

    this.traverse((val, r, c) => {
      if (val === -1 || val === 0) return;
      ctx.fillStyle = val == 2 ? "#f00" : val == 1 ? "#0f0" : "#bbb4 ";
      this.fillCell(r, c, 0, this.offsetY);
    });

    this.currentBlock.draw(ctx);
  }

  private displayScore = (ctx: CanvasRenderingContext2D) => {
    const score = new Text(
      "Score:" + this.score,
      this.cellSize,
      this.offsetY + this.cellSize,
      this.cellSize
    );
    score.style = "#00000080";
    score.draw(ctx);

    const multiplier = new Text(
      NumberE.roundToPrecision(500 / this.frameDelay, 1) + "x",
      this.width - this.cellSize,
      this.offsetY + this.cellSize,
      this.cellSize
    );
    multiplier.x =
      this.width - this.cellSize * 2 - ctx.measureText(multiplier.text).width;

    multiplier.style = "#00000080";
    multiplier.draw(ctx);
  };

  private displayArrows = (ctx: CanvasRenderingContext2D) => {
    //arrow right
    ctx.strokeStyle = "#00000010";
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
    const B = Random.item([O, P, L, I, J, S, Z]);
    this.currentBlock = new B(this, undefined);
  }

  private gameOverCb: CallableFunction;

  public onGameOver(cb: CallableFunction) {
    this.gameOverCb = cb;
  }

  public fillCell = (
    r: number,
    c: number,
    offsetX: number,
    offsetY: number
  ) => {
    this.ctx.fillRect(
      c * this.cellSize + offsetX,
      r * this.cellSize + offsetY,
      this.cellSize - this.cellGap,
      this.cellSize - this.cellGap
    );
  };

  private onTick = () => {
    const fallen = !this.currentBlock.moveDown();
    if (fallen) {
      const filledRows = this.getFilledRows();
      if (filledRows.length > 0) {
        this.setFilledRows(filledRows);
        this.soundEffects[1].replay();
        window.setTimeout(() => {
          this.clearFilledRows(filledRows);
        }, this.frameDelay / 2);
      } else {
        this.soundEffects[0].replay();
      }
      this.currentBlock.freeze();

      this.addRandomBlock();
      this.fallenCountInCurrentLevel++;
      const blockMoveable = this.currentBlock.moveDown();
      if (!blockMoveable) {
        this.isPlaying = false;
        window.clearInterval(this.mainTimer);
        this.soundEffects[2].replay(1);
        this.gameOverCb?.();
        return;
      }
    }

    if (this.fallenCountInCurrentLevel > 16) {
      //increase the speed
      this.level++;
      window.clearInterval(this.mainTimer);
      this.frameDelay *= 0.85;
      this.fallenCountInCurrentLevel = 0;
      this.mainTimer = window.setInterval(this.onTick, this.frameDelay);
    }
  };

  public play = () => {
    if (this.isPlaying) return;

    window.addEventListener("keydown", this.onKeyDown);
    this.canvas.addEventListener("pointerdown", this.onPointerDown);

    this.isPlaying = true;
    this.currentBlock.timeStamp = Date.now();
    this.currentBlock.updateVH();
    this.currentBlock.updateVV();

    const cb = () => {
      if (this.isPlaying) {
        this.draw(this.ctx);
        window.requestAnimationFrame(cb);
      }
    };

    window.requestAnimationFrame(cb);

    this.mainTimer = window.setInterval(this.onTick, this.frameDelay);
  };

  public pause = () => {
    this.isPlaying = false;
    window.clearInterval(this.mainTimer);
    window.removeEventListener("keydown", this.onKeyDown);
    this.canvas.removeEventListener("pointerdown", this.onPointerDown);
  };

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
