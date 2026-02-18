# Infographic Generator MCP Server - セットアップガイド

## クイックスタート

### ステップ1: ビルド確認

```bash
cd /Users/task/taskforce/pj-two/2511リスキリング/mcp-servers/infographic-generator
npm run build
```

ビルドが成功すると、`dist/` ディレクトリに JavaScript ファイルが生成されます。

### ステップ2: Claude Code に登録

プロジェクトルートの `.mcp.json` に以下を追加：

```json
{
  "mcpServers": {
    "infographic-generator": {
      "command": "node",
      "args": ["./mcp-servers/infographic-generator/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "AIzaSyBUoHOC0kIRPKwmOPvtIFOnHkKcgrvlnlA",
        "IMAGE_OUTPUT_DIR": "/Users/task/taskforce/pj-two/2511リスキリング/generated-images",
        "DEFAULT_STYLE": "notebooklm",
        "DEFAULT_LANGUAGE": "ja"
      }
    }
  }
}
```

### ステップ3: Claude Code を再起動

```bash
exit
claude
```

起動時に以下のようなメッセージが表示されることを確認：

```
Infographic Generator MCP Server running on stdio
```

### ステップ4: ツールが利用可能か確認

Claude に以下のように質問：

```
どのツールが使えますか？
```

`generate_infographic` と `list_infographic_templates` が表示されれば成功です。

## 使用例

### 基本的な使い方

```
GitHubの基礎についてインフォグラフィックを作成して
```

Claude が自動的に `generate_infographic` ツールを使用します。

### スタイルを指定

```
Dockerについてダークテーマでインフォグラフィックを作成して
```

### テンプレート一覧を確認

```
どんなインフォグラフィックスタイルが使えますか？
```

Claude が `list_infographic_templates` ツールを使用します。

## トラブルシューティング

### ツールが表示されない

1. `.mcp.json` の構文エラーを確認
2. ビルドが成功しているか確認
3. Claude Code を再起動

### 画像生成に失敗する

**現在の状態**: Gemini の画像生成API統合が未完成です。

**対処方法**: `src/services/gemini-client.ts` の `generateImage` メソッドを実装してください。

### APIキーエラー

`.mcp.json` の `GEMINI_API_KEY` が正しいか確認してください。

## 次のステップ

1. **画像生成API統合**: Gemini の実際の画像生成APIを統合
2. **テスト実行**: 各スタイルで画像生成をテスト
3. **カスタマイズ**: プロンプトテンプレートを調整

## ローカル開発

開発モードで実行：

```bash
npm run dev
```

コードを変更すると自動的に再起動されます。

## デバッグ

MCPサーバーのログを確認：

```bash
# stdioで直接実行
node dist/index.js
```

入力: `initialize` など

## npm パッケージとして公開する場合

```bash
# パッケージ名を決定
# package.json の name を確認

# npm にログイン
npm login

# 公開
npm publish

# その後、以下のように使用可能
npx mcp-infographic-generator
```

`.mcp.json` の設定を変更：

```json
{
  "mcpServers": {
    "infographic-generator": {
      "command": "npx",
      "args": ["-y", "mcp-infographic-generator"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}"
      }
    }
  }
}
```

---

**セットアップガイド version 1.0.0**
**作成日**: 2026-02-18
