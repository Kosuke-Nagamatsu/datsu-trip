import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import fetchTargetRegion from './fetch.js';
import Canvas2DUtility from './classes/canvas2d.js';
import DataStore from './classes/datastore.js';
import SceneManager from './classes/scene.js';
import { Compass, Map } from './classes/character.js';
import { EffectMessage, ResultMessage, RestartMessage } from './classes/textcharacter.js';
import Direction from './classes/linecharacter.js';
import KeyButton from './classes/rectcharacter.js';

/**
 * キーが押されたかを調べるためのオブジェクト
 * どこからでも参照できるようにwindowのプロパティとして設定
 * @type {object}
 */
window.isKeyDown = {};
/**
 * キーが押された回数
 * isKeyDownと同じようにwindowに設定
 * @type {object}
 */
window.keyCount = { Enter: 0 };

/**
 * Canvas2D APIをラップしたユーティリティクラス
 * @type {Canvas2DUtility}
 */
let util = null;
/**
 * Canvasエレメント
 * @type {HTMLCanvasElement}
 */
let canvas = null;
/**
 * Canvas2D APIのコンテキスト
 * @type {CanvasRenderingContext2D}
 */
let ctx = null;
/**
 * データの保管場所
 * @type {DataStore}
 */
let store = null;
/**
 * シーンマネージャー
 * @type {SceneManager}
 */
let scene = null;
/**
 * 上下左右（東西南北）に動くダツキャラクター
 * @type {Compass}
 */
let compass = null;
/**
 * ダーツの的になる地図
 * @type {Map}
 */
let map = null;
/**
 * 東西南北の位置を示す補助線
 * @type {Direction}
 */
let direction = null;
/**
 * 効果音のようなメッセージ
 * @type {EffectMessage}
 */
let effectMsg = null;
/**
 * 結果表示
 * @type {ResultMessage}
 */
let resultMsg = null;
/**
 * 再スタートの案内文
 * @type {RestartMessage}
 */
let restartMsg = null;
/**
 * Enterボタン
 * @type {KeyButton}
 */
let enterBtn = null;
/**
 * 再スタートするためのフラグ
 * @type {boolean}
 */
let restart = false;

/**
 * canvasやコンテキスト,各クラスを初期化する
 */
function initialize() {
  // ユーティリティクラス
  util = new Canvas2DUtility(document.querySelector('#main_canvas'));
  canvas = util.canvas;
  ctx = util.context;
  // canvasの大きさを設定
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  // その他各クラス
  store = new DataStore();
  scene = new SceneManager();
  enterBtn = new KeyButton(ctx, 0, 0, 200, 120, '#ffff00');
  // 動きを開始するための設定
  enterBtn.setMoving(
    CANVAS_WIDTH / 2, // 開始位置（x座標）
    CANVAS_HEIGHT / 2 // 開始位置（y座標）
  );
  compass = new Compass(ctx, 0, 0, 98, 50, './images/datsu.png');
  // 動きを開始するための設定
  compass.setMoving(
    CANVAS_WIDTH / 2, // 開始位置（x座標）
    CANVAS_HEIGHT / 2 // 開始位置（y座標）
  );
  map = new Map(ctx, 0, 0, compass.range * 2, compass.range * 2, './images/japan_map.png');
  direction = new Direction(
    ctx,
    compass.position.x - compass.range,
    compass.position.y,
    compass.position.x + compass.range,
    compass.position.y
  );
  effectMsg = new EffectMessage(
    ctx,
    'サイハテ',
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH,
    '#ff8c00'
  );
  resultMsg = new ResultMessage(ctx, '', 0, 0, CANVAS_WIDTH, '#ffffff');
  restartMsg = new RestartMessage(ctx, '', 0, 0, CANVAS_WIDTH / 2, '#ffffff');
}

/**
 * 再スタートのためにリセットする
 */
function reset() {
  restart = false;
  window.keyCount.Enter = 0;
  resultMsg.isDisplaying = false;
  restartMsg.isMoving = false;
  compass.isAtEdge = false;
  compass.setMoving(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}

/**
 * シーンを設定する
 */
function sceneSetting() {
  // イントロシーン
  scene.add('intro', (time) => {
    // 3秒経過したらシーンを'choice'に変更（方角の選択が終わりダツの停止フラグが立った場合も）
    if (time > 3.0 || !compass.isMoving) {
      enterBtn.isMoving = false;
      scene.use('choice');
    }
  });
  // ダーツを投げる方角を決めるシーン
  scene.add('choice', () => {
    if (!compass.isMoving) {
      compass.isAtEdge = false;
      scene.use('dartsStart');
    }
  });
  // ダーツ投げの演出開始シーン
  scene.add('dartsStart', (time) => {
    // ダツ画像の横軸の位置（canvas画面の右から左へ移動）
    const x = CANVAS_WIDTH + compass.width / 2 - 200 ** time;
    const { y } = compass.position;
    // ダツがcanvas画面から見えなくなれば、シーンを'dartsEnd'へ変更
    if (x < -compass.width) {
      scene.use('dartsEnd');
    }
    compass.position.set(x, y);
    compass.draw();
  });
  // ダーツが地図に当たり結果を表示するシーン
  scene.add('dartsEnd', (time) => {
    // 地図に当たるまでの時間
    const throwingTime = 0.5;
    // ダーツの半径(初期値と地図に当たった時の値)
    const startR = window.innerWidth;
    const endR = 5;
    // xy座標（初期値と目的地の値）
    const startX = CANVAS_WIDTH / 2;
    const endX = compass.targetPosition.x;
    const startY = CANVAS_HEIGHT / 2;
    const endY = compass.targetPosition.y;
    // 半径が縮む速度とxy方向に動く速度
    const vr = (endR - startR) / throwingTime;
    const vx = (endX - startX) / throwingTime;
    const vy = (endY - startY) / throwingTime;
    // 半径とxy座標を計算し、画面中心から目的地へ投げたように動かす
    const r = time <= throwingTime ? startR + vr * time : endR;
    const x = time <= throwingTime ? startX + vx * time : endX;
    const y = time <= throwingTime ? startY + vy * time : endY;
    // 円を描画
    util.drawCircle(x, y, r, '#202f55');

    // フレーム数が90になれば結果を表示
    if (scene.frame === 90) {
      // メッセージをセット
      resultMsg.text = store.targetRegion ? `${store.targetRegion}の` : 'ハズレ';
      // 座標をセットし表示をオン
      resultMsg.setDisplaying(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }
    // フレーム数が150になれば離島名をセット
    if (store.targetRegion && scene.frame === 150) {
      resultMsg.text = `${store.targetIsland}へ！`;
    }
    // フレーム数が360になれば、結果を非表示にし'restart'シーンへ変更
    if (scene.frame === 360) {
      resultMsg.isDisplaying = false;
      scene.use('restart');
    }
  });
  // 再スタートの案内シーン
  scene.add('restart', () => {
    const loopWidth = CANVAS_WIDTH + restartMsg.width;
    const startX = CANVAS_WIDTH + restartMsg.width / 2;
    const x = startX - (scene.frame % loopWidth);
    restartMsg.text = 'Press enter to restart';
    restartMsg.setMoving(x, CANVAS_HEIGHT / 2);
    // 再スタートのための処理
    if (restart) {
      reset();
      scene.use('choice');
    }
  });
  // 一番最初のシーンを'intro'に設定
  scene.use('intro');
}

/**
 * イベントを設定する
 */
function eventSetting() {
  // キーが押された時の設定
  window.addEventListener(
    'keydown',
    (event) => {
      // 押されたキーの状態をtrueにする
      window.isKeyDown[event.key] = true;
      switch (event.key) {
        // 押されたキーが'Enter'の場合
        case 'Enter':
          // 方角を決める場面でダツ画像が動いている場合
          if (compass.isMoving) {
            // 押した数をカウント
            window.keyCount[event.key] += 1;
            // 目的地の座標を保存
            compass.setTargetPosition(compass.position.x, compass.position.y);
            if (window.keyCount.Enter === 2) {
              // 目的地の地域を取得し保存
              fetchTargetRegion(compass.targetPosition).then((data) => {
                store.setTarget(data);
              });
            }
          }
          // 再スタートのメッセージが流れている場合
          if (restartMsg.isMoving) {
            // 再スタートフラグを立てる
            restart = true;
          }
          break;
        default:
          break;
      }
    },
    false
  );
  // キーが離された時の設定
  window.addEventListener(
    'keyup',
    (event) => {
      // 離されたキーの状態をfalseにする
      window.isKeyDown[event.key] = false;
    },
    false
  );
}

/**
 * 描画処理を行う
 */
function render() {
  // 描く前に画面全体を青色の楕円で塗りつぶす
  util.drawEllipse(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    0,
    0,
    Math.PI * 2,
    '#00bfff'
  );
  map.update();
  direction.update();
  compass.update();
  if (compass.isAtEdge) effectMsg.update();
  enterBtn.update();
  scene.update();
  resultMsg.update();
  restartMsg.update();

  // 恒常ループのために描画処理を再帰呼出しする
  // 通常1秒で60回の画面更新に応じてパラパラ漫画のようにrenderする
  requestAnimationFrame(render);
}

/**
 * インスタンスの準備が完了しているか確認する
 * （画像を持つCharacterの子クラスのみ）
 */
function loadCheck() {
  // 準備完了の状態
  let ready = true;
  // 準備できているかチェック
  ready = compass.ready;
  ready = map.ready;

  // 全ての準備が完了したら次の処理に進む
  if (ready) {
    sceneSetting();
    // イベントを設定
    eventSetting();
    // 描画処理を開始
    render();
  } else {
    // 準備が完了してない場合は再度呼び出す
    setTimeout(loadCheck, 100);
  }
}

// loadイベントで処理を開始
window.addEventListener('load', () => {
  // 初期化
  initialize();
  // インスタンスの状態を確認
  loadCheck();
});
