# ダツの旅

「ダーツの旅」のように旅先を決めるゲームです。

過去に[離島マニア](https://github.com/Kosuke-Nagamatsu/ritomania)というアプリを作りました。その際のカタログ設計を見ると、ダーツゲームについて次のように説明していました。

> **ダーツ機能　優先度「低」**
> 的にダーツを投げてランダムに離島名を表示します。「ダーツの旅」のようにどこの離島へ行くかをゲーム感覚で決めれます。遊びながら楽しんで使用して貰うことが目的です。

当時はどうすればできるのか全く分からず、、、今は分からないけどできるようになりたい！と思いながら書いたような気がします。

そのような背景があり、新しい試みを取り入れつつ HTML5, Canvas, バニラな JS で作成しました。

## ゲームの始め方

1. [バックエンド](https://github.com/Kosuke-Nagamatsu/datsu-trip-backend)で離島情報などの初期データを作成
1. https://kosuke-nagamatsu.github.io/datsu-trip へアクセスしゲーム開始

## ゲームコマンド

### Enter: ダーツを投げる方向を決める

ダツが東西南北に動くので Enter で方向を決めます。決めた方向にダーツが飛んでいきます。

西か東か
<img width="660" alt="スクリーンショット 2023-04-04 23 08 28" src="https://user-images.githubusercontent.com/83779040/229822513-1e74a458-14f5-4f5a-8c3f-eab84f4cb289.png">

北か南か
<img width="662" alt="スクリーンショット 2023-04-04 23 16 15" src="https://user-images.githubusercontent.com/83779040/229822695-f87eb1d3-354f-462d-abbc-4bda6621f1f5.png">

### P: お助けコマンド

離島がある地域を表示します。どこを狙えば良いか分からない場合のお助けコマンドです。

<img width="588" alt="スクリーンショット 2023-04-11 7 07 32" src="https://user-images.githubusercontent.com/83779040/231008441-e37c82da-1eea-4a49-8d96-a35879fe167d.png">
