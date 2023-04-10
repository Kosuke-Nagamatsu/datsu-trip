/**
 * バックエンドから取得したデータを管理するクラス
 */
export default class DataStore {
  /**
   * 各地域の位置
   * @type {[] | null}
   */
  regionPositions = null;

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
   * 各地域の位置を保存する
   * @param {object[]} data - 地域データ一覧
   */
  setRegionPositions(data) {
    if (!data || data.length === 0) {
      this.regionPositions = [];
      return;
    }
    const positions = data.map((region) => ({
      minX: region.min_x_position,
      maxX: region.max_x_position,
      minY: region.min_y_position,
      maxY: region.max_y_position,
    }));
    this.regionPositions = positions;
  }

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
