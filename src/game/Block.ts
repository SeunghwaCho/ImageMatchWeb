export class Block {
  type: number = 0;
  x: number = 0;
  y: number = 0;
  far: number = 0;

  constructor();
  constructor(b: Block);
  constructor(x: number, y: number);
  constructor(xOrBlock?: number | Block, y?: number) {
    if (xOrBlock === undefined) {
      // default
    } else if (typeof xOrBlock === 'object') {
      this.type = xOrBlock.type;
      this.x = xOrBlock.x;
      this.y = xOrBlock.y;
      this.far = xOrBlock.far;
    } else {
      this.x = xOrBlock;
      this.y = y ?? 0;
    }
  }

  set(type: number, x: number, y: number, far?: number): void {
    this.type = type;
    this.x = x;
    this.y = y;
    this.far = far ?? 0;
  }

  clone(): Block {
    const b = new Block();
    b.type = this.type;
    b.x = this.x;
    b.y = this.y;
    b.far = this.far;
    return b;
  }
}
