import { Tetris } from "../Tetris/Tetris";

export abstract class Block {
  public c = 0;
  public r = 0;
  protected x = 0;
  protected y = 0;
  public rowCount: number;
  public colCount: number;
  protected container: Tetris;
  protected block: boolean[][];
  private vh = 0; // per milisecond;
  private vv = 0; // per milisecond
  private rotationTarget = 0; //in degrees
  private rotationCurrent = 0; //in degrees
  private rotationSpeed = 9 / 20; // degrees per ms

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

    this.x = this.c * container.cellSize;
    this.y = this.r * container.cellSize;

    this.initBlock();
    this.write();
  }

  private timeStamp: number;

  onTick(tx: number, ty: number) {
    const now = Date.now();
    if (this.x !== tx) {
      this.vh = tx < this.x ? -Math.abs(this.vh) : Math.abs(this.vh);
      this.x += this.vh * (now - this.timeStamp);
      if ((this.vh > 0 && this.x > tx) || (this.vh < 0 && this.x < tx)) {
        this.x = tx;
      }
    }

    if (this.y !== ty) {
      this.vv = ty < this.y ? -Math.abs(this.vv) : Math.abs(this.vv);
      this.y += this.vv * (now - this.timeStamp);
      if ((this.vv > 0 && this.y > ty) || (this.vv < 0 && this.y < ty))
        this.y = ty;
    }

    if (this.rotationCurrent < this.rotationTarget) {
      this.rotationCurrent += this.rotationSpeed * (now - this.timeStamp);
      if (this.rotationCurrent > this.rotationTarget)
        this.rotationCurrent = this.rotationTarget;
    }

    this.timeStamp = now;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "#00f";

    this.onTick(
      this.c * this.container.cellSize,
      this.r * this.container.cellSize
    );

    if (this.rotationTarget !== this.rotationCurrent) {
      ctx.translate(
        this.x + (this.colCount * this.container.cellSize) / 2,
        this.y + (this.rowCount * this.container.cellSize) / 2
      );
      ctx.rotate(
        (this.rotationCurrent - this.rotationTarget) * (Math.PI / 180)
      );
      ctx.translate(
        -(this.x + (this.colCount * this.container.cellSize) / 2),
        -(this.y + (this.rowCount * this.container.cellSize) / 2)
      );
    }

    for (let r = 0; r < this.rowCount; r++) {
      for (let c = 0; c < this.colCount; c++) {
        if (this.block[r][c] === false) continue;
        ctx.fillRect(
          this.x + c * this.container.cellSize,
          this.y + r * this.container.cellSize + this.container.offsetY,
          this.container.cellSize - this.container.cellGap,
          this.container.cellSize - this.container.cellGap
        );
      }
    }
    ctx.restore();
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

  rotate() {
    this.erase();
    const newBlock: boolean[][] = new Array();
    this.block[0].forEach(() => {
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

    {
      const f = this.rotationTarget % 180 === 0 ? Math.floor : Math.ceil;

      const differC = f((this.rowCount - this.colCount) / 2);
      const differR = f((this.colCount - this.rowCount) / 2);

      this.c += differC;
      this.r += differR;

      if (this.c < 0) this.c = 0;
      if (this.r < 0) this.r = 0;
    }

    {
      //prevent from going out of frame
      if (this.colCount + this.c >= this.container.matrixWidth) {
        this.c = this.container.matrixWidth - this.colCount;
      }
      //prevent from going out of frame
      if (this.rowCount + this.r >= this.container.matrixHeight) {
        this.r = this.container.matrixHeight - this.rowCount;
      }
    }

    this.write();

    this.rotationTarget += 90;
    this.rotationSpeed = (this.rotationTarget - this.rotationCurrent) / 200;
    this.updateVH();
    this.updateVV();
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

  updateVH() {
    this.vh = Math.abs(this.x - this.c * this.container.cellSize) / 100;
  }

  moveLeft() {
    if (this.scanHorizontalNeighbours(-1)) {
      this.erase();
      this.c -= 1;
      this.write();
      this.updateVH();
      return true;
    }
    return false;
  }
  moveRight() {
    if (this.scanHorizontalNeighbours(1)) {
      this.erase();
      this.c += 1;
      this.write();
      this.updateVH();
      return true;
    }
    return false;
  }

  updateVV() {
    this.vv =
      Math.abs(this.y - this.r * this.container.cellSize) /
      this.container.frameDelay;
  }
  moveDown(by = 1) {
    if (this.scanVerticalNeighbours(by)) {
      if (!this.timeStamp) this.timeStamp = Date.now();
      this.erase();
      this.r += by;
      this.write();
      this.updateVV();
      return true;
    }
    return false;
  }

  moveUp() {
    if (this.scanVerticalNeighbours(-1)) {
      this.erase();
      this.r -= 1;
      this.write();
      this.updateVV();
      return true;
    }
    return false;
  }
}
