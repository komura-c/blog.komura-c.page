---
title: "当サイトをAstro3.0にアップデートしました！"
description: "当サイトをAstro3.0にアップデートしました！"
tags: "Astro"
pubDate: "2023-09-01 01:57:35 +0900"
heroImage: ""
draft: false
createdDate: "2023-09-01 01:57:35 +0900"
updatedDate: "2024-03-17 07:18:35 +0900"
---

## はじめに

[Astro 3.0 | Astro](https://astro.build/blog/astro-3/)を見ました。
View Transitions API が MPA でも使えるという話が出てきていて、そろそろ試そうかと思っていた頃だったので、
Astro View Transitions という表記に惹かれました。
また、リリースブログでこのようにメタフレームワークがサポートするというのが僕が見る限り初めてだったこともあり、
試してみることにしました。

## Astro2.3 からのアップデート

まず、このサイトは Astro で SSG をしているのですが、Astro のバージョンがastro@1.9.2→2.3.0 に 4 月に上げてから触れていなかったのでアップデートしました。
astro@2.0.0からで[Content Collections](https://docs.astro.build/en/guides/content-collections/)という機能が入り、
この移行は少し変更が多かったですが、今回は比較的少なく移行ができました。
astro はドキュメントが充実しているので、
[Upgrade to Astro v3](https://docs.astro.build/en/guides/upgrade-to/v3/)に沿って影響ある箇所を数行変更するだけで、移行ができました。

## Astro View Transitions

いよいよ本題です。
[Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)を見ながら Astro 上で View Transitions を使いました。

はじめに、head タグの中で Astro が用意してくれている ViewTransitions の Component を記述します。

```astro
--
import { ViewTransitions } from 'astro:transitions';
--

<html lang="ja">
  <head>
    <ViewTransitions />
  </head>
```

Animation をカスタムしない場合は、ビルトインで`fade`と`slide`があるのでどちらかを使用します。

```astro
--
import { fade } from "astro:transitions";
--
  <main transition:animate={fade({ duration: '0.5s' })}>
```

もうこれだけで、ページ遷移時に指定した ViewTransition のアニメーションが動いてくれます。
ただ、ViewTransitionAPI の凄い所の 1 つは指定した要素をリッチに遷移させることができることです。
次のように、`transition:name`属性を遷移前と遷移後のページで指定します。(遷移前と遷移後のページ双方で一意でないと上手く要素が特定できないため、動きません)

```astro
<time datetime={post.pubDate} transition:name={"blog-pub-date-" + post.slug}>
```

すると、この Web サイトのようなアニメーションが実現できます。
ちなみに、iOS の Safari が ViewTransition に対応していないため、[fallback オプション](https://docs.astro.build/ja/guides/view-transitions/#%E3%83%95%E3%82%A9%E3%83%BC%E3%83%AB%E3%83%90%E3%83%83%E3%82%AF%E3%81%AE%E5%88%B6%E5%BE%A1)で遷移アニメーションを無効にするなどの対応ができます。

```astro
<ViewTransitions fallback="swap">
```

## おわりに

このページの遷移を確認したいために、新しく記事を書こうと思って凄く雑に書いてみました。

紹介しなかった機能としては、ViewTransitions の Animation はカスタムで作ることができて拡張性があることや、Astro では`transition:persist`属性をタグに付与することで、ページ間でその HTML 要素の状態を維持できるなどの機能があるなどがあります。
ViewTransitionsAPI は、まだ Experimental ではありますが、MPA でも SPA のような遷移ができかなり便利な API なので、
ブラウザ対応が進めば一般的に使われ、SPA のみを選択するケースはより少なくなっていくのかなと感じました。
ここまで読んでいただきありがとうございました。
