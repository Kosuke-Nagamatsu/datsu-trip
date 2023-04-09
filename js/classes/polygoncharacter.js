import { Character, Position } from './character.js';

/**
 * 多角形キャラクターの親クラス
 * （四角形を描く仕様）
 */
class PolygonCharacter extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {{minX: number, maxX: number, minY: number, maxY: number}} position - 地域の位置
   * @param {string} color - 線の色
   * @param {number} [width=1] - 線の幅（デフォルトは1）
   */
  constructor(ctx, position, color, width = 1) {
    super(ctx, position.minX, position.minY, width, null, null);
    this.color = color;
    /**
     * 四角形の頂点座標（左上の始点を除く）
     * @type {Position[]}
     */
    this.points = [
      new Position(position.maxX, position.minY),
      new Position(position.maxX, position.maxY),
      new Position(position.minX, position.maxY),
    ];
  }

  draw() {
    this.ctx.save();
    if (this.color) {
      this.ctx.strokeStyle = this.color;
    }
    this.ctx.beginPath();
    // パスの始点を設定
    this.ctx.moveTo(this.position.x, this.position.y);
    // 各頂点を結ぶパスを設定
    this.points.forEach((point) => {
      this.ctx.lineTo(point.x, point.y);
    });
    // パスを閉じる
    this.ctx.closePath();
    // 設定したパスで四角形を描く
    this.ctx.stroke();
    this.ctx.restore();
  }
}

/**
 * 地域の境界線
 */
export default class Border extends PolygonCharacter {
  update() {
    if (!window.isKeyDown.p) {
      return;
    }
    this.draw();
  }
}
