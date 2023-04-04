import { Position, Character } from './character.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

/**
 * 線のキャラクター管理のための親クラス
 */
class LineCharacter extends Character {
  /**
   * 破線のパターン
   * @type {number[]}
   */
  patterns = [1, 5];

  /**
   * 回転の角度
   * @type {number}
   */
  angle = 90;

  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {{x: number, y: number}} startPosition - 線の始点の座標
   * @param {{x: number, y: number}} endPosition - 線の終点の座標
   * @param {string} color - 線の色
   * @param {string} type - 線のタイプ
   * @param {number} [width=1] - 線の幅（デフォルトは1）
   */
  // Lineは引数が多いため、オブジェクトにまとめ意味を把握しやすくする
  constructor(ctx, { startPosition, endPosition, color, type, width = 1 }) {
    super(ctx, startPosition.x, startPosition.y, width, null, null);
    this.endPosition = new Position(endPosition.x, endPosition.y);
    this.color = color;
    this.type = type;
  }

  // 線の始点と終点の距離
  get distance() {
    const x = this.endPosition.x - this.position.x;
    const y = this.endPosition.y - this.position.y;
    return Math.sqrt(x * x + y * y);
  }

  draw() {
    this.ctx.save();
    if (this.color) {
      this.ctx.strokeStyle = this.color;
    }
    this.ctx.lineWidth = this.width;
    this.ctx.beginPath();
    // 破線タイプであれば線のパターンをセット
    if (this.type === 'dash') this.ctx.setLineDash(this.patterns);
    this.ctx.moveTo(this.position.x, this.position.y);
    this.ctx.lineTo(this.endPosition.x, this.endPosition.y);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }

  // 回転後に描画する
  rotationDraw(angle = this.angle) {
    this.ctx.save();
    if (this.color) {
      this.ctx.strokeStyle = this.color;
    }
    // Canvasの原点を線の中点へ移動
    this.ctx.translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    // 線の中点を中心に回転
    this.ctx.rotate((angle * Math.PI) / 180);
    this.ctx.beginPath();
    if (this.type === 'dash') this.ctx.setLineDash(this.patterns);
    this.ctx.moveTo(-this.distance / 2, 0);
    this.ctx.lineTo(this.distance / 2, 0);
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.restore();
  }
}

/**
 * 座標軸（X軸は東西, Y軸は南北を表す）
 */
export default class Direction extends LineCharacter {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {number} x1 - 線の始点のX座標
   * @param {number} y1 - 線の始点のY座標
   * @param {number} x2 - 線の終点のX座標
   * @param {number} y2 - 線の終点のY座標
   * @param {string} color - 線の色
   * @param {string} [type='dash'] - 線のタイプ（デフォルトは破線'dash'）
   */
  constructor(ctx, x1, y1, x2, y2, color, type = 'dash') {
    // 引数が多いため、オブジェクトにまとめ意味を把握しやすくする
    super(ctx, { startPosition: { x: x1, y: y1 }, endPosition: { x: x2, y: y2 }, color, type });
  }

  update() {
    switch (window.keyCount.Enter) {
      case 0:
        this.draw();
        break;
      case 1:
        this.rotationDraw();
        break;
      default:
        break;
    }
  }
}
