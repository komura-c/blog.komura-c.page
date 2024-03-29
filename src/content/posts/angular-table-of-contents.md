---
title: "Angularで動的に生成した記事の目次（TableOfContents）とスムーズスクロールを実装する"
description: "Angularで動的に生成した記事の目次（TableOfContents）とスムーズスクロールを実装する"
tags: "Angular"
pubDate: "2020-08-19 00:00:00 +0900"
heroImage: ""
draft: false
createdDate: "2020-08-19 00:00:00 +0900"
updatedDate: "2020-08-19 00:00:00 +0900"
---

## はじめに

Qiita などの記事投稿サービスやライブラリのドキュメントには TableOfContents と言われる記事の目次があります。その Angular での実装方法をまとめました。

## 1.サイドナビに見出しリスト作成

今回は、[Async pipe](https://angular.jp/guide/observables-in-angular.en#async-pipe)でサブスクライブされ、動的に生成された要素に対して見出しリストを作成します。
まず、要素を取得する関数を作ります。

```typescript
  getHeading() {
    setTimeout(() => {
      //HTMLで生成されている箇所のクラスを取得
      const headingTagElements = document.querySelectorAll(
        '.main__content h2, .main__content h3, .main__content h4'
      );
      //forループして、生成されている箇所のidにindex番号を含めて代入
      headingTagElements.forEach((headingTagElement, index) => {
        headingTagElement.id = 'heading' + index;
        this.headingElements.push(headingTagElement);
        this.headingPositions.push(
          headingTagElement.getBoundingClientRect().top
        );
      });
    }, 100);
  }
```

querySelectorAll は複数取得した場合、要素が HTMLElement ではなく、NodeElement と型が変わってしまうため offsetTop が使えないですが、[getBoundingClientRect().top](https://developer.mozilla.org/ja/docs/Web/API/Element/getBoundingClientRect)で現在のスクロール位置から要素の上までのスクロール量を取得できます。  
headingElements、headingPositions は後述します。ここではエレメント自体と高さの値を配列に追加しています。  
setTimeout を記述している理由は、FireStore などから流れてきた Observable を読み込む前に関数が動くと取得できないためです。そのため、関数の実行を記述する位置は、以下のように Observable が流れてきた後の Operator 内が適切だと思います。

```typescript
article$.pipe(tap(() => this.getHeading()));
```

次に以下のように見出しリストを生成します。

```html
<div class="table">
  <div class="table__title">目次</div>
  <ul class="table__content">
    <li
      class="table-list"
      *ngFor="let headingElement of headingElements; index as i"
    >
      <a
        class="table-list__item"
        [href]="'#' + headingElement.id"
        [class.active]="i === activeHeadingIndex"
        [class.h3]="headingElement.tagName === 'H3'"
        [class.h4]="headingElement.tagName === 'H4'"
        (click)="scrollToHeading($event)"
        >{{ headingElement.textContent }}</a
      >
    </li>
  </ul>
</div>
```

ngFor で取得した要素をループさせ、見出しリストを生成しています。
後にスムーズスクロールを行うため、先ほど代入した要素の id に遷移するためのページ内リンクを href 属性にバインドしています。  
activeHeadingIndex は条件が true の時にクラスを付与したいため、記述しています。

## 2.スクロール位置にハイライト

まず、[HostListener](https://angular.jp/api/core/HostListener)という Angular の[デコレーター](https://qiita.com/taqm/items/4bfd26dfa1f9610128bc)を使い、Angular から見たホストつまりブラウザの挙動を感知します。ここではスクロールイベントを検知します。この利用は Javascript の addEventListener に似ていると思います。  
加えて、スクロール位置にハイライトするための関数を作成します。

```typescript
  @HostListener('window:scroll', ['$event'])
  getTableOfContents() {
    if (this.headingPositions.length) {
      const headerHeight = 0;
      const buffer = 20;
      const position = window.pageYOffset + headerHeight + buffer;
      this.headingPositions.forEach((headingPosition, index) => {
        if (headingPosition < position) {
          this.activeHeadingIndex = index;
        }
      });
    }
  }
```

現在のページ位置を position で定義しています。buffer は、スクロールした時に要素がページ上部にあるのにハイライトが前の要素を指すのを避けるため、余分に数値を追加するため記述しています。1 で取得した headingPositions をループし、見出しより下にスクロールした場合にその見出しに active というスタイルがつくようにここで activeHeadingIndex にどの見出しかの番号を代入しています。

## 3.クリックでページ内リンクスムーズスクロール

このままでもリンクの場所に遷移することはできますが、アニメーションもなく、header が fixed されている場合、位置がずれてしまいます。そのため、調整し、スムーズスクロールする関数を記述します。

```typescript
  scrollToHeading(event) {
    const id = event.target.hash.replace('#', '');
    if (id !== '') {
      const rectTop = document.getElementById(id).getBoundingClientRect().top;
      const position = window.pageYOffset;
      const headerHeight = 0;
      const top = rectTop + position - this.headerHeight;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
    return false;
  }
```

click イベントからクリックしたリンク先を受け取り、その現在のスクロール位置から要素の上までのスクロール量から現在のスクロール量を足し、[scrollTo](https://developer.mozilla.org/ja/docs/Web/API/Window/scrollTo)でスムーズスクロールを実装できます。

## 実装コード

[angular-toc-sample - StackBlitz](https://stackblitz.com/edit/angular-toc-sample)  
css は angular ドキュメントの toc を参考にしています。
