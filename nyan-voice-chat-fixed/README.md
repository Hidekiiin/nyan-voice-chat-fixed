# nyan - ランダム音声チャットアプリ

このアプリは、Ably を使用したリアルタイム通信機能を持つランダム音声チャットアプリです。
ランダムなユーザーとマッチングして音声チャットを楽しむことができます。

## 機能

- ランダムユーザーとのマッチング
- リアルタイム音声チャット
- シンプルで使いやすいUI

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- Ably (リアルタイム通信)
- React Media Recorder (音声録音)

## デプロイ方法

### 必要なもの

- GitHub アカウント
- Vercel アカウント
- Ably アカウント (無料プランでOK)

### 手順

1. このリポジトリを GitHub にフォークまたはクローンします
2. Ably でアプリケーションを作成し、API キーを取得します
3. Vercel でプロジェクトを作成し、GitHub リポジトリと連携します
4. Vercel の環境変数に `ABLY_API_KEY` を設定します
5. デプロイを実行します

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 環境変数

`.env.local` ファイルを作成し、以下の環境変数を設定します：

```
ABLY_API_KEY=your-ably-api-key
```

## ライセンス

MIT
