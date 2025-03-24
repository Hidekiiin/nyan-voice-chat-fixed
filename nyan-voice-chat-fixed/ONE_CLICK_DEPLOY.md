# nyan - ワンクリックデプロイ

このファイルでは、nyan 音声チャットアプリを Vercel に簡単にデプロイする方法を説明します。

## ワンクリックデプロイ

以下のボタンをクリックすると、Vercel へのデプロイが自動的に開始されます：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fnyan-voice-chat&env=ABLY_API_KEY&envDescription=Ably%20API%20Key%20for%20realtime%20communication&envLink=https%3A%2F%2Fably.com%2F)

## デプロイ手順

1. 上記のボタンをクリックします
2. GitHub アカウントでログインします（まだログインしていない場合）
3. リポジトリ名を確認または変更します
4. 環境変数 `ABLY_API_KEY` に Ably の API キーを入力します
   - Ably アカウントをお持ちでない場合は、[Ably](https://ably.com/) で無料アカウントを作成してください
   - ダッシュボードから新しいアプリケーションを作成し、API キーを取得します
5. "Deploy" ボタンをクリックします

デプロイが完了すると、アプリケーションの URL が表示されます。この URL にアクセスして、アプリケーションが正常に動作していることを確認してください。

## 手動デプロイ

より詳細なデプロイ手順については、[DEPLOY.md](./DEPLOY.md) ファイルを参照してください。
