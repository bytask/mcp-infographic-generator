# Infographic Generator MCP Server

NotebookLM風のインフォグラフィック画像を生成するMCPサーバー。

## 概要

このMCPサーバーは、Gemini APIを使用してテーマから自動的にプロフェッショナルなインフォグラフィック画像を生成します。

### 特徴

- 🎨 **5つのスタイルプリセット**: NotebookLM、ダーク、ミニマル、カラフル、コーポレート
- 🌐 **多言語対応**: 日本語・英語
- 📐 **柔軟なレイアウト**: 5種類のアスペクト比（16:9, 1:1, 9:16, 4:3, 3:2）
- ⚡ **自動プロンプト最適化**: Gemini Flash による品質向上
- 🔧 **カスタマイズ可能**: セクション数、解像度、出力ファイル名

## 前提条件

- Node.js 20以上
- Gemini APIキー（[Google AI Studio](https://aistudio.google.com/app/apikey)で取得）
  - **注意**: 画像生成には `gemini-2.0-flash-preview-image-generation` モデルへのアクセスが必要です

## インストール

### 方法1: GitHubから直接使用（推奨）

リポジトリをクローンせずにそのまま使用できます。`.mcp.json` に以下を追加してください：

```json
{
  "mcpServers": {
    "infographic-generator": {
      "command": "npx",
      "args": ["-y", "--package=github:bytask/mcp-infographic-generator", "mcp-infographic-generator"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-api-key-here",
        "IMAGE_OUTPUT_DIR": "/path/to/output/directory",
        "DEFAULT_STYLE": "notebooklm",
        "DEFAULT_LANGUAGE": "ja"
      }
    }
  }
}
```

### 方法2: リポジトリをクローンして使用

```bash
# リポジトリをクローン
git clone https://github.com/bytask/mcp-infographic-generator.git
cd mcp-infographic-generator

# 依存関係インストール & ビルド（自動実行）
npm install
```

`.mcp.json` に以下を追加：

```json
{
  "mcpServers": {
    "infographic-generator": {
      "command": "node",
      "args": ["/path/to/cloned/mcp-infographic-generator/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "your-gemini-api-key-here",
        "IMAGE_OUTPUT_DIR": "/path/to/output/directory"
      }
    }
  }
}
```

## 環境変数

| 変数名 | 必須 | デフォルト | 説明 |
|--------|------|-----------|------|
| `GEMINI_API_KEY` | ✅ | - | Gemini APIキー |
| `IMAGE_OUTPUT_DIR` | ❌ | `./output` | 画像保存先ディレクトリ |
| `DEFAULT_STYLE` | ❌ | `notebooklm` | デフォルトスタイル |
| `DEFAULT_LANGUAGE` | ❌ | `ja` | デフォルト言語 |
| `SKIP_PROMPT_ENHANCEMENT` | ❌ | `false` | プロンプト最適化スキップ |

## 使い方

### ツール1: generate_infographic

インフォグラフィック画像を生成します。

**引数:**

- `theme` (必須): メインテーマ
- `details` (オプション): 詳細説明
- `style` (オプション): スタイル（notebooklm/dark/minimal/colorful/corporate）
- `language` (オプション): 言語（ja/en）
- `aspectRatio` (オプション): アスペクト比（16:9/1:1/9:16/4:3/3:2）
- `sections` (オプション): セクション数（2-8）
- `fileName` (オプション): 出力ファイル名
- `imageSize` (オプション): 解像度（standard/2K/4K）

**使用例:**

```json
{
  "theme": "Docker入門",
  "details": "コンテナ、イメージ、Dockerfile、docker-composeについて",
  "style": "notebooklm",
  "language": "ja",
  "aspectRatio": "16:9",
  "sections": 4
}
```

### ツール2: list_infographic_templates

利用可能なスタイルテンプレート一覧を表示します（引数不要）。

## スタイルプリセット

### notebooklm (デフォルト)
- **説明**: 白背景、Material Designカラー
- **用途**: 教育資料、技術解説、学習ノート
- **カラー**: #4285F4, #34A853, #FBBC04, #EA4335

### dark
- **説明**: 暗い背景にビビッドなカラー
- **用途**: プレゼン、技術カンファレンス資料
- **カラー**: #1a1a2e, #16213e, #0f3460, #e94560

### minimal
- **説明**: 白黒基調、シンプルな幾何学模様
- **用途**: ドキュメント、フォーマルな資料
- **カラー**: #000000, #333333, #666666, #ffffff

### colorful
- **説明**: ポップで明るい色使い
- **用途**: SNS投稿、マーケティング資料
- **カラー**: #FF6B6B, #4ECDC4, #45B7D1, #FFA07A

### corporate
- **説明**: ビジネスフォーマルなデザイン
- **用途**: 社内報告、経営資料、提案書
- **カラー**: #2C3E50, #3498DB, #2ECC71, #E74C3C

## ローカル開発

```bash
# 依存関係インストール
npm install

# 開発モード（ウォッチ）
npm run dev

# ビルド
npm run build
```

### ディレクトリ構造

```
mcp-infographic-generator/
├── src/
│   ├── index.ts                    # エントリーポイント
│   ├── server.ts                   # MCPサーバー定義
│   ├── tools/
│   │   ├── generate-infographic.ts # 画像生成ツール
│   │   └── list-templates.ts       # テンプレート一覧ツール
│   ├── services/
│   │   ├── gemini-client.ts        # Gemini APIクライアント
│   │   └── prompt-builder.ts       # プロンプト構築
│   ├── templates/
│   │   └── infographic-styles.ts   # スタイルプリセット
│   └── utils/
│       ├── file-output.ts          # ファイル出力
│       └── validation.ts           # 入力バリデーション
├── dist/                           # ビルド済みファイル（コミット済み）
├── package.json
├── tsconfig.json
└── README.md
```

## トラブルシューティング

### エラー: GEMINI_API_KEY is required

**原因**: APIキーが設定されていません。

**解決策**: `.mcp.json` の `env` に `GEMINI_API_KEY` を追加してください。

### エラー: No image data found in Gemini API response

**原因**: 画像生成に対応していないAPIキーまたはモデルアクセス権限がありません。

**解決策**:
1. [Google AI Studio](https://aistudio.google.com/app/apikey) でAPIキーを再確認
2. `gemini-2.0-flash-preview-image-generation` モデルへのアクセス権限があるか確認
3. Free tierの場合、レート制限（15 RPM）に注意

### 画像が生成されない

1. APIキーが有効か確認
2. クォータ制限を確認（Free tier: 15 RPM）
3. ネットワーク接続を確認

## ライセンス

MIT

## 関連リンク

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude Code](https://claude.com/claude-code)
