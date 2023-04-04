import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

/**
 * 座標を管理
 */
export class Position {
  /**
   * @constructor
   * @param {number} x - X座標
   * @param {number} y - Y座標
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    if (x != null) {
      this.x = x;
    }
    if (y != null) {
      this.y = y;
    }
  }
}

/**
 * キャラクター管理のための親クラス
 * 描画する画像,線,テキストなどは全てキャラクターとする
 */
export class Character {
  /**
   * 準備完了フラグ
   * @type {boolean}
   */
  ready = false;

  /**
   * @type {Image}
   */
  image = new Image();

  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {string} imagePath - 画像のパス
   */
  constructor(ctx, x, y, w, h, imagePath) {
    this.ctx = ctx;
    this.position = new Position(x, y);
    this.width = w;
    this.height = h;
    this.image.addEventListener(
      'load',
      () => {
        // 画像のロードが完了したら準備完了フラグを立てる
        this.ready = true;
      },
      false
    );
    this.image.src = imagePath;
  }

  // キャラクター（画像）を描画する
  draw() {
    // キャラクターの幅を考慮してオフセットする長さ
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    // オフセットする長さを引き、指定した座標が画像の中心になるように描画
    this.ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      this.width,
      this.height
    );
  }
}

/**
 * 方向を指すコンパス
 */
export class Compass extends Character {
  /**
   * 動いてるかどうかのフラグ
   * @type {boolean}
   */
  isMoving = false;

  /**
   * 動き始めた時のタイムスタンプ
   * @type {number | null}
   */
  movingStart = null;

  /**
   * 移動スピード
   * @type {number}
   */
  speed = 3;

  /**
   * 移動の振幅
   * @type {number}
   */
  range = 180;

  /**
   * 目的地の座標
   * @type {Position}
   */
  targetPosition = new Position(0, 0);

  /**
   * 東西南北の端っこ（最果て）のフラグ
   * @type {boolean}
   */
  isAtEdge = false;

  // 動きを開始するための設定を行う
  setMoving(startX, startY) {
    this.isMoving = true;
    this.movingStart = Date.now();
    this.position.set(startX, startY);
  }

  // 目的地の座標をセットする
  setTargetPosition(x, y) {
    // エンターを押した回数で処理を分ける
    switch (window.keyCount.Enter) {
      case 1:
        this.targetPosition.set(x, 0);
        this.#setIsAtEdge('x');
        break;
      case 2:
        this.targetPosition.set(this.targetPosition.x, y);
        this.#setIsAtEdge('y');
        break;
      default:
        console.log(
          `Compass.targetPosition x:${this.targetPosition.x}, y:${this.targetPosition.y}`
        );
    }
  }

  // 状態を更新し描画する
  update() {
    if (!this.isMoving) {
      return;
    }
    // 現在のタイムスタンプ
    const justTime = Date.now();
    // 動き始めからの経過時間
    const movingTime = (justTime - this.movingStart) / 1000;
    const sin = Math.sin(movingTime * this.speed);
    const rSin = sin * this.range;
    // X座標だけ変化し、指定した振り幅で左右（西東）に動く
    this.position.set(CANVAS_WIDTH / 2 + rSin, CANVAS_HEIGHT / 2);
    switch (window.keyCount.Enter) {
      case 1:
        // Y座標だけ変化し、指定した振り幅で上下（北南）に動く
        this.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + rSin);
        break;
      case 2:
        this.isMoving = false;
        break;
      default:
        break;
    }
    this.draw();
  }

  // 座標が端っこであるかを調べ、最果てフラグを設定する
  #setIsAtEdge(coordinate) {
    // 最果ての範囲
    const edgeRange = 1;
    const minX = CANVAS_WIDTH / 2 - this.range + edgeRange;
    const maxX = CANVAS_WIDTH / 2 + this.range - edgeRange;
    const minY = CANVAS_HEIGHT / 2 - this.range + edgeRange;
    const maxY = CANVAS_HEIGHT / 2 + this.range - edgeRange;

    // 座標がXかYで処理を分ける
    switch (coordinate) {
      case 'x':
        if (this.targetPosition.x < minX || this.targetPosition.x > maxX) {
          this.isAtEdge = true;
        } else {
          this.isAtEdge = false;
        }
        break;
      case 'y':
        if (this.targetPosition.y < minY || this.targetPosition.y > maxY) {
          this.isAtEdge = true;
        } else {
          this.isAtEdge = false;
        }
        break;
      default:
        break;
    }
  }
}

/**
 * ダーツの的（地図）
 */
export class Map extends Character {
  /**
   * 影の色
   * @type {string}
   */
  shadowColor = '#666666';

  /**
   * 影のx方向のオフセット
   * @type {number}
   */
  shadowOffsetX = 1;

  /**
   * 影のy方向のオフセット
   * @type {number}
   */
  shadowOffsetY = 1;

  update() {
    this.ctx.save();
    this.ctx.shadowColor = this.shadowColor;
    this.ctx.shadowOffsetX = this.shadowOffsetX;
    this.ctx.shadowOffsetY = this.shadowOffsetY;
    this.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    this.draw();
    this.ctx.restore();
  }
}
