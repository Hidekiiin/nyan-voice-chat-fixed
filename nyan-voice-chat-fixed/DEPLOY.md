# Vercel と GitHub へのデプロイ手順

このドキュメントでは、nyan 音声チャットアプリを Vercel にデプロイする手順を説明します。

## 1. GitHub リポジトリの作成

1. [GitHub](https://github.com) にログインします
2. 右上の "+" アイコンをクリックし、"New repository" を選択します
3. リポジトリ名を入力します（例: `nyan-voice-chat`）
4. 必要に応じて説明を追加します
5. リポジトリを公開または非公開に設定します
6. "Create repository" をクリックします

## 2. コードを GitHub にプッシュ

ローカルマシンで以下のコマンドを実行します：

```bash
# リポジトリをクローン
git clone https://github.com/あなたのユーザー名/nyan-voice-chat.git

# ZIPファイルの内容をクローンしたリポジトリにコピー
# (ZIPファイルを解凍した場所から全てのファイルをコピーします)

# 変更をコミット
cd nyan-voice-chat
git add .
git commit -m "Initial commit"
git push origin main
```

## 3. Ably アカウントの作成と API キーの取得

1. [Ably](https://ably.com/) にアクセスし、アカウントを作成またはログインします
2. ダッシュボードから新しいアプリケーションを作成します
3. アプリケーションの API キーをコピーします（後で Vercel の環境変数として使用します）

## 4. Vercel でのデプロイ

1. [Vercel](https://vercel.com/) にアクセスし、アカウントを作成またはログインします
2. "New Project" をクリックします
3. "Import Git Repository" セクションで、先ほど作成した GitHub リポジトリを選択します
4. プロジェクト名を確認します
5. "Environment Variables" セクションで、以下の環境変数を追加します：
   - `ABLY_API_KEY` = Ably から取得した API キー
6. "Deploy" をクリックします

## 5. デプロイの確認

デプロイが完了すると、Vercel は自動的にプロジェクトの URL を生成します。この URL にアクセスして、アプリケーションが正常に動作していることを確認します。

## 6. カスタムドメインの設定（オプション）

1. Vercel ダッシュボードでプロジェクトを選択します
2. "Settings" > "Domains" に移動します
3. カスタムドメインを追加し、指示に従って DNS 設定を行います

## トラブルシューティング

- デプロイに失敗した場合は、Vercel のビルドログを確認してエラーを特定します
- Ably の接続に問題がある場合は、API キーが正しく設定されているか確認します
- ブラウザのコンソールでエラーが表示される場合は、開発者ツールを使用してデバッグします
