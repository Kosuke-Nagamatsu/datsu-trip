/**
 * 目的地の地域データを取得する
 * @param {Position} position - 目的地の座標
 */
export default async function fetchTargetRegion(position) {
  const params = {
    x: position.x,
    y: position.y,
  };
  const urlSearchParams = new URLSearchParams(params).toString();
  try {
    const response = await fetch(`http://localhost:8000/regions/?${urlSearchParams}`);
    if (!response.ok) {
      throw new Error('Response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem fetching the data:', error);
    return null;
  }
}
