/**
 * Canvas2D API をラップしたユーティリティクラス
 * シンプルに図形などを描く時に使う予定
 */
export default class Canvas2DUtility {
  constructor(canvas) {
    this.canvasElement = canvas;
    this.context2d = canvas.getContext('2d');
  }

  get canvas() {
    return this.canvasElement;
  }

  get context() {
    return this.context2d;
  }

  drawLine(x1, y1, x2, y2, color, width = 1) {
    // 色が指定されている場合はスタイルを設定する
    if (color != null) {
      this.context2d.strokeStyle = color;
    }
    // 線幅を設定する
    this.context2d.lineWidth = width;
    // パスの設定を開始することを明示する
    this.context2d.beginPath();
    // パスの始点を設定する
    this.context2d.moveTo(x1, y1);
    // 直線のパスを終点座標に向けて設定する
    this.context2d.lineTo(x2, y2);
    // パスを閉じることを明示する
    this.context2d.closePath();
    // 設定したパスで線描画を行う
    this.context2d.stroke();
  }

  drawCircle(x, y, radius, color) {
    // 色が指定されている場合はスタイルを設定する
    if (color) {
      this.context2d.fillStyle = color;
    }
    // パスの設定を開始することを明示する
    this.context2d.beginPath();
    // 円のパスを設定する
    this.context2d.arc(x, y, radius, 0.0, Math.PI * 2.0);
    // パスを閉じることを明示する
    this.context2d.closePath();
    // 設定したパスで円の描画を行う
    this.context2d.fill();
  }

  drawEllipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, color) {
    if (color) {
      this.context2d.fillStyle = color;
    }
    this.context2d.beginPath();
    this.context2d.closePath();
    this.context2d.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
    this.context2d.fill();
  }
}
