/**
 * バックエンドから取得したデータを管理するクラス
 */
export default class DataStore {
  /**
   * 目的地の地域
   * @type {string | null}
   */
  targetRegion = null;

  /**
   * 目的地の離島
   * @type {string | null}
   */
  targetIsland = null;

  /**
   * 目的地をセットする
   * @param {object | null} data - 目的地の地域データ
   */
  setTarget(data) {
    if (!data) {
      this.targetRegion = data;
      this.targetIsland = data;
      return;
    }
    const randomIndex = Math.floor(Math.random() * data.islands.length);
    this.targetRegion = data.name;
    this.targetIsland = data.islands[randomIndex].name;
  }
}
