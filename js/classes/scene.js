/**
 * シーンを管理するためのクラス
 */
export default class SceneManager {
  /**
   * シーンを納めるためのオブジェクト
   * @type {object}
   */
  scene = {};

  /**
   * 現在アクティブなシーン
   * @type {function | null}
   */
  activeScene = null;

  /**
   * シーンがアクティブになった時のタイムスタンプ
   * @type {number | null}
   */
  startTime = null;

  /**
   * シーンがアクティブになってからのシーンの実行回数
   * @type {number | null}
   */
  frame = null;

  // シーンを追加する
  add(name, updateFunction) {
    this.scene[name] = updateFunction;
  }

  // アクティブなシーンを設定する
  use(name) {
    // 指定されたシーンが無ければ何もしない
    if (!this.scene.hasOwnProperty(name)) {
      return;
    }
    this.activeScene = this.scene[name];
    this.startTime = Date.now();
    // シーンをアクティブにしたのでカウンタをリセット
    this.frame = -1;
  }

  // シーンを更新する
  update() {
    // シーンがアクティブになってからの経過時間
    const activeTime = (Date.now() - this.startTime) / 1000;
    // updateFunctionを呼び出す
    this.activeScene(activeTime);
    // 更新のたびにカウントアップ
    this.frame += 1;
  }
}
