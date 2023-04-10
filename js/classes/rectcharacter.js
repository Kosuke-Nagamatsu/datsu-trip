import { Position, Character } from './character.js';
import { TextCharacter } from './textcharacter.js';

/**
 * 四角形のキャラクターの親クラス
 */
class RectCharacter extends Character {
  /**
   * 角の丸み（円弧の半径）
   * @type {number | number[]}
   */
  radius = 60;

  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {string} color - 四角形の色
   * @param {string} type - 四角形のタイプ
   */
  constructor(ctx, x, y, w, h, color, type) {
    super(ctx, x, y, w, h, null);
    this.color = color;
    this.type = type;
  }

  draw() {
    const offsetX = this.width / 2;
    const offsetY = this.height / 2;
    if (this.color) {
      this.ctx.fillStyle = this.color;
    }
    this.ctx.beginPath();
    // 角丸四角形を描く
    // （普通の四角形の処理を追加する場合は、rect()を追加する）
    if (this.type === 'round') {
      this.ctx.roundRect(
        this.position.x - offsetX,
        this.position.y - offsetY,
        this.width,
        this.height,
        this.radius
      );
    }
    this.ctx.fill();
  }
}

/**
 * キー名が書かれたボタン
 */
export default class KeyButton extends RectCharacter {
  /**
   * 動いてるかどうかのフラグ
   * @type {boolean}
   */
  isMoving = false;

  /**
   * 動き始めのタイムスタンプ
   * @type {number | null}
   */
  movingStart = null;

  /**
   * 動作の開始位置
   * @type {Position | null}
   */
  startPosition = null;

  /**
   * 動くスピード
   * @type {number}
   */
  speed = 24;

  /**
   * 影の色
   * @type {string}
   */
  shadowColor = '#c0c000';

  /**
   * 影のy方向のオフセット
   * @type {number}
   */
  shadowOffsetY = 16;

  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 幅
   * @param {number} h - 高さ
   * @param {string} color - 四角形の色
   * @param {string} [type='round'] - 四角形のタイプ（デフォルトは角丸四角形'round'）
   */
  constructor(ctx, x, y, w, h, color, type = 'round') {
    super(ctx, x, y, w, h, color, type);
    /**
     * ボタンのラベル
     * @type {TextCharacter}
     */
    this.text = new TextCharacter(ctx, 'Enter', x, y, w, '#777');
  }

  // 動きを開始するための設定を行う
  setMoving(startX, startY) {
    this.isMoving = true;
    this.movingStart = Date.now();
    this.position.set(startX, startY);
    this.startPosition = new Position(startX, startY);
    // ボタンと同じ座標にテキストをセット
    this.text.position.set(startX, startY);
  }

  update() {
    if (!this.isMoving) {
      return;
    }
    // 現在のタイムスタンプ
    const justTime = Date.now();
    // 動き始めからの経過時間
    const movingTime = (justTime - this.movingStart) / 1000;
    // 縦方向の影幅で昇順にループする
    const y = (movingTime * this.speed) % this.shadowOffsetY;
    // 影は「y」とは逆に降順にループする
    const shadowY = this.shadowOffsetY - y;

    this.ctx.save();
    this.ctx.shadowColor = this.shadowColor;
    // 影のオフセットとEnterボタンの位置を動かし、ボタンを押す動きを繰り返す
    this.ctx.shadowOffsetY = shadowY;
    this.position.set(this.startPosition.x, this.startPosition.y + y);
    this.text.position.set(this.position.x, this.position.y);
    this.draw();
    this.ctx.restore();
    this.ctx.save();
    this.ctx.font = `bold ${this.text.fontSize}px sans-serif`;
    this.text.draw();
    this.ctx.restore();
  }
}
