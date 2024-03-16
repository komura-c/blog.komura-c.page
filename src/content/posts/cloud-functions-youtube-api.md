---
title: "CloudFunctionsからYouTubeAPIで特定チャンネル動画を取得する"
description: "CloudFunctionsからYouTubeAPIで特定チャンネル動画を取得する"
tags: "CloudFunctions"
pubDate: "2020-09-28 00:00:00 +0900"
heroImage: ""
draft: false
createdDate: "2020-09-28 00:00:00 +0900"
updatedDate: "2020-09-28 00:00:00 +0900"
---

先日 9/27 に行われた[CAMP のハッカソン](https://to.camp/lesson?v=vtriUBb2KPcOpCUAtljK)にて CloudFunctions で YouTubeAPI を使った実装をしたので、知見を共有します。

## Cloud Funtions for Firebase とは

[Cloud Functions](https://to.camp/lesson?v=AgNXUteAmULRSrOT7WwP)を見れば大体の内容は分かります。
大胆に言えば、Node.js という JavaScript 環境をサーバーレス（事前にサーバーを購入するのではなく Google の実行環境を利用する）で運用するものです。
[Firebase Cloud Function を作る](https://to.camp/lesson?v=3A8yYWWRMOrn62aLJQR1)
[Webhook で受け取ったデータで Firestore を更新する](https://to.camp/lesson?v=NsxvY9KjS5gaKfDjzVIB)を見ればどういう風に実装していけばいいかが大体掴めます。

## YouTubeAPI

[YouTube](https://to.camp/lesson?v=31A9llLVUeVNqKWMJfR9)ここでフロント側での実装方法が分かります。HTTP リクエストというものを送ると JSON という形式でデータが返ってきます。

## 実装

まず、Functions から HTTP リクエストを送ろうとして詰まりました。Nino さんのアドバイスで[node-fetch](https://www.npmjs.com/package/node-fetch)を使えばできると言われましたが、[googleapis](https://www.npmjs.com/package/googleapis)という GoogleAPI を使用するためのライブラリがあったのでそれを使うことにしました。
functions ディレクトリのコンソールで npm i googleapis をしてインストールします。
その後最初に以下を記述します。

```ts
const { google } = require("googleapis");
google.options({
  headers: {
    Referer: "https://xxxxx", // YouTubeAPIで制限をかけているリファラー
  },
});
const apiKey = functions.config().youtube.api_key;
const youtube = google.youtube({ version: "v3", auth: apiKey });
```

googleapis のオプションで[リファラー](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Referer)に記述された場所からリクエストを送っているよと指示しています。Cloud Functions からはデフォルトでリファラーが送られないので、リファラーの記述がないと API の認証エラーになります。（ここも詰まりました）その後あらかじめ環境変数に入れた API キーを呼び出して、youtubeAPI で使うように引数に入れています。[Firebase Cloud Functions の環境設定](https://to.camp/lesson?v=vfJwfKMpHpY0gt4BVCcK#Firebase%20Cloud%20Functions%E3%81%AE%E7%92%B0%E5%A2%83%E8%A8%AD%E5%AE%9A)を見ると分かります。
取得処理は以下になります。

```ts
async function getMoviesByChannelId(channelId: string, nextPageToken?: string) {
  youtube.search
    .list({
      // ここの引数でAPIのオプションを指定している
      part: "snippet",
      channelId,
      maxResults: 50, // 一回のリクエストでは最大50件しか返ってこない
      order: `viewCount`,
      type: `video`,
      videoEmbeddable: true,
      videoSyndicated: true,
      pageToken: nextPageToken ? nextPageToken : "",
    })
    .then(async (response: any) => {
      const resData: {
        nextPageToken: string;
        items: []; // ここに動画データの配列が入る
      } = response.data;
      const videos: [] = resData.items;
      await createVideos(videos, channelId);
      const nextToken = response.data?.nextPageToken; // 次リクエストのトークンがあれば入れる
      if (nextToken) {
        await getMoviesByChannelId(channelId, nextToken); // 次リクエストのトークンがあればもう一度実行する
      }
      return;
    })
    .catch((error: any) => {
      functions.logger.warn(error);
      return;
    });
}
```

今回の設計ではフロント側で API を使って保存した ChannelId を利用してチャンネル動画を保存する処理をしています。特に、nextToken を用いて再帰（その関数自体を実行する）処理をするところがポイントです。createVideos という関数内で Firestore に保存しています。

## コード

[youtube-room/functions/src/room-videos.function.ts](https://github.com/camp-team/youtube-room/blob/master/functions/src/room-videos.function.ts)
こうリファクタリングした方がよいなどご指摘をお待ちしております。
