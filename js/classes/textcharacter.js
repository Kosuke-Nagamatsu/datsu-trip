import { Character } from './character.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants.js';

/**
 * テキストキャラクターのための親クラス
 */
export class TextCharacter extends Character {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {string} text - 表示する文字
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 最大幅
   * @param {string} color - フォントの色
   * @param {number} [fontSize=32] - フォントの大きさ（デフォルトは32）
   */
  constructor(ctx, text, x, y, w, color, fontSize = 32) {
    super(ctx, x, y, w, null, null);
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
  }

  draw(type = 'fill') {
    // テキストの幅を考慮してオフセットする長さ
    // （各描画の際に指定した座標がテキストの中心になるように描画する）
    const offsetX = this.ctx.measureText(this.text).width / 2;
    const offsetY = this.fontSize / 2;
    // 描画するタイプで処理を分ける
    switch (type) {
      // 塗りつぶしの場合
      case 'fill':
        if (this.color) {
          this.ctx.fillStyle = this.color;
        }
        this.ctx.fillText(
          this.text,
          this.position.x - offsetX,
          this.position.y + offsetY,
          this.width
        );
        break;
      // 輪郭だけを描く場合
      case 'stroke':
        if (this.color) {
          this.ctx.strokeStyle = this.color;
        }
        this.ctx.strokeText(
          this.text,
          this.position.x - offsetX,
          this.position.y + offsetY,
          this.width
        );
        break;
      default:
        console.error(`There is no such type of '${type}'`);
    }
  }
}

/**
 * 効果音のように表示するメッセージ
 */
export class EffectMessage extends TextCharacter {
  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {string} text - 表示する文字
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 最大幅
   * @param {string} color - フォントの色
   * @param {number} [fontSize=100] - フォントの大きさ（デフォルトは100）
   */
  constructor(ctx, text, x, y, w, color, fontSize = 100) {
    super(ctx, text, x, y, w, color, fontSize);
  }

  // Enterが押された時だけ描画する
  update() {
    if (!window.isKeyDown.Enter) {
      return;
    }
    this.ctx.save();
    this.ctx.fillStyle = '#202f55';
    // 四角形を背景一面に描く
    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.ctx.restore();
    this.ctx.save();
    this.ctx.font = `bold ${this.fontSize}px sans-serif`;
    this.draw();
    this.ctx.restore();
  }
}

/**
 * 結果表示のメッセージ
 */
export class ResultMessage extends TextCharacter {
  /**
   * 表示してるかどうかのフラグ
   * @type {boolean}
   */
  isDisplaying = false;

  /**
   * 影の色
   * @type {string}
   */
  shadowColor = '#666666';

  /**
   * 影のx方向のオフセット
   * @type {number}
   */
  shadowOffsetX = 5;

  /**
   * 影のy方向のオフセット
   * @type {number}
   */
  shadowOffsetY = 5;

  /**
   * 影のぼかしレベル
   * @type {number}
   */
  shadowBlur = 1;

  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {string} text - 表示する文字
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 最大幅
   * @param {string} color - フォントの色
   * @param {number} [fontSize=68] - フォントの大きさ（デフォルトは68）
   */
  constructor(ctx, text, x, y, w, color, fontSize = 68) {
    super(ctx, text, x, y, w, color, fontSize);
  }

  setDisplaying(x, y) {
    this.isDisplaying = true;
    this.position.set(x, y);
  }

  update() {
    if (!this.isDisplaying) {
      return;
    }
    this.ctx.save();
    this.ctx.font = `bold ${this.fontSize}px sans-serif`;
    this.ctx.shadowColor = this.shadowColor;
    this.ctx.shadowOffsetX = this.shadowOffsetX;
    this.ctx.shadowOffsetY = this.shadowOffsetY;
    this.ctx.shadowBlur = this.shadowBlur;
    this.draw();
    this.ctx.restore();
  }
}

/**
 * 再スタートの案内
 */
export class RestartMessage extends TextCharacter {
  /**
   * 動いてるかどうかのフラグ
   * @type {boolean}
   */
  isMoving = false;

  /**
   * @constructor
   * @param {CanvasRenderingContext2D} ctx - 描画などに利用する2Dコンテキスト
   * @param {string} text - 表示する文字
   * @param {number} x - X座標
   * @param {number} y - Y座標
   * @param {number} w - 最大幅
   * @param {string} color - フォントの色
   * @param {number} [fontSize=32] - フォントの大きさ（デフォルトは32）
   */
  constructor(ctx, text, x, y, w, color, fontSize = 32) {
    super(ctx, text, x, y, w, color, fontSize);
  }

  setMoving(x, y) {
    this.isMoving = true;
    this.position.set(x, y);
  }

  update() {
    if (!this.isMoving) {
      return;
    }
    this.ctx.save();
    this.ctx.font = `bold ${this.fontSize}px sans-serif`;
    this.draw('stroke');
    this.ctx.restore();
  }
}
