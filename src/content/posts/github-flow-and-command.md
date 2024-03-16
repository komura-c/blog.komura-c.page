---
title: "Github-Flowと自分がよく使うGithubコマンド"
description: "Github-Flowと自分がよく使うGithubコマンド"
tags: "GitHub"
pubDate: "2020-07-02 23:39:35 +0900"
heroImage: ""
draft: false
createdDate: "2020-07-02 23:39:36 +0900"
updatedDate: "2020-07-05 01:01:44 +0900"
---

## Github-Flow

1. 作業内容を書いて issue 立てる
2. ローカルのリモートブランチ origin/master からローカルの feature/xxx(issue 番号)ブランチを作成
3. 作成したブランチに切り替えて作業
4. 作業をステージング（VScode の場合は左上の+押すだけ）
5. コミットメッセージを feature(変更箇所): 内容または fix(変更箇所): 内容などとしてコミット
6. ローカルの feature/xxx ブランチからリモートの origin feature/xxx ブランチにプッシュする（コマンド: git push origin feature/xxx）
7. プルリクの Detail に作業内容, Image にスクショを貼って、ご確認お願いしますと記述、プルリクを出す
8. プルリクが marge されたら、issue をクローズ。（プルリク時に fix #(issue 番号)と記述すると自動でクローズしてくれる）
9. フェッチ（コマンド: git fetch —prune）をする（リモートで削除されているローカルのリモートブランチを削除してくれる）
10. 1〜9 を繰り返す

## よく使う Git コマンド

#### 直前のコミットのみを取り消す(作業内容は残す)

git reset --soft HEAD^

#### コミット履歴をみる

git reflog

#### git reset --soft HEAD^で取り消した変更を戻す

git reset --soft HEAD@{1}

#### ブランチ名を変える

git branch -m <新しいブランチ名>
※ローカルの master をブランチ名変えただけだと VScode 上で push しようとした時に origin/master に push しようとしてできないので git push origin feature/xxx コマンドでリモートブランチに push する
