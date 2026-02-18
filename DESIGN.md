# Infographic Generator MCP Server - 設計書

## 1. 概要

NotebookLM風のインフォグラフィック画像を生成するMCPサーバー。
Gemini APIを使用し、テーマと詳細情報からプロフェッショナルなインフォグラフィック画像を生成する。

既存の `mcp-image` サーバーは汎用的な画像生成ツールだが、本MCPサーバーはインフォグラフィック生成に特化し、NotebookLM風のデザインプロンプトを内蔵する点が差別化ポイントである。

---

## 2. ディレクトリ構造

```
mcp-servers/infographic-generator/
├── src/
│   ├── index.ts                  # エントリーポイント（MCPサーバー起動）
│   ├── server.ts                 # McpServer定義・ツール登録
│   ├── tools/
│   │   ├── generate-infographic.ts   # メインツール: インフォグラフィック生成
│   │   └── list-templates.ts         # テンプレート一覧ツール
│   ├── services/
│   │   ├── gemini-client.ts      # Gemini API クライアント（画像生成）
│   │   └── prompt-builder.ts     # NotebookLM風プロンプト構築
│   ├── templates/
│   │   └── infographic-styles.ts # プリセットスタイル定義
│   └── utils/
│       ├── file-output.ts        # 画像ファイル保存
│       └── validation.ts         # 入力バリデーション
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. ツール定義

### 3.1 `generate_infographic` (メインツール)

インフォグラフィック画像を生成する主要ツール。

**ツール名**: `generate_infographic`
**説明**: 指定されたテーマについてNotebookLM風のインフォグラフィック画像を生成します。テーマを入力するだけで、視覚的に分かりやすい教育的・説明的な画像を自動生成します。

**入力スキーマ (inputSchema)**:

```typescript
z.object({
  // 必須パラメータ
  theme: z.string()
    .describe("インフォグラフィックのメインテーマ（例: '機械学習の基礎', 'Docker入門'）"),

  // オプションパラメータ
  details: z.string().optional()
    .describe("含めたい要素や詳細説明（例: 'コンテナ、イメージ、Dockerfileについて'）"),

  style: z.enum([
    "notebooklm",       // デフォルト: NotebookLM風（白背景、Material Design）
    "dark",             // ダークテーマ（暗い背景、ネオンカラー）
    "minimal",          // ミニマル（白黒、シンプル）
    "colorful",         // カラフル（ポップな色使い）
    "corporate"         // ビジネス（フォーマルなデザイン）
  ]).optional().default("notebooklm")
    .describe("デザインスタイルのプリセット"),

  language: z.enum(["ja", "en"]).optional().default("ja")
    .describe("テキストラベルの言語"),

  aspectRatio: z.enum([
    "16:9",             // ワイド（プレゼン用）- デフォルト
    "1:1",              // 正方形（SNS用）
    "9:16",             // ポートレート（スマホ用）
    "4:3",              // スタンダード
    "3:2"               // 写真比率
  ]).optional().default("16:9")
    .describe("画像のアスペクト比"),

  sections: z.number().min(2).max(8).optional().default(4)
    .describe("インフォグラフィック内のセクション数（2-8）"),

  fileName: z.string().optional()
    .describe("出力ファイル名（指定しない場合は自動生成）"),

  imageSize: z.enum(["standard", "2K", "4K"]).optional().default("standard")
    .describe("画像解像度（standard=1920x1080, 2K=2560x1440, 4K=3840x2160）")
})
```

**imageSize 内部解像度マッピング**:

| imageSize | 16:9 | 1:1 | 9:16 | 4:3 | 3:2 |
|-----------|------|-----|------|-----|-----|
| standard | 1920x1080 | 1080x1080 | 1080x1920 | 1440x1080 | 1620x1080 |
| 2K | 2560x1440 | 1440x1440 | 1440x2560 | 1920x1440 | 2160x1440 |
| 4K | 3840x2160 | 2160x2160 | 2160x3840 | 2880x2160 | 3240x2160 |

**出力**: 生成された画像のファイルパスとメタデータ

```typescript
// 成功時レスポンス
{
  content: [
    {
      type: "text",
      text: JSON.stringify({
        filePath: "/path/to/generated-images/infographic-20260218-123456.png",
        theme: "機械学習の基礎",
        style: "notebooklm",
        aspectRatio: "16:9",
        sections: 4,
        generatedAt: "2026-02-18T12:34:56.789Z"
      })
    },
    {
      type: "resource_link",
      uri: "file:///path/to/generated-images/infographic-20260218-123456.png",
      name: "インフォグラフィック: 機械学習の基礎",
      mimeType: "image/png"
    }
  ]
}
```

### 3.2 `list_infographic_templates` (補助ツール)

利用可能なスタイルテンプレートの一覧を返す。

**ツール名**: `list_infographic_templates`
**説明**: 利用可能なインフォグラフィックのデザインスタイル一覧を表示します。

**入力スキーマ**: パラメータなし（空オブジェクト）

```typescript
z.object({})
```

**出力**:

```typescript
{
  content: [
    {
      type: "text",
      text: JSON.stringify({
        templates: [
          {
            name: "notebooklm",
            description: "NotebookLM風: 白背景、Material Designカラー、クリーンなレイアウト",
            colors: ["#4285F4", "#34A853", "#FBBC04", "#EA4335"],
            bestFor: "教育資料、技術解説、学習ノート"
          },
          {
            name: "dark",
            description: "ダークテーマ: 暗い背景にビビッドなカラー",
            colors: ["#1a1a2e", "#16213e", "#0f3460", "#e94560"],
            bestFor: "プレゼン、技術カンファレンス資料"
          },
          {
            name: "minimal",
            description: "ミニマル: 白黒基調、シンプルな幾何学模様",
            colors: ["#000000", "#333333", "#666666", "#ffffff"],
            bestFor: "ドキュメント、フォーマルな資料"
          },
          {
            name: "colorful",
            description: "カラフル: ポップで明るい色使い",
            colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
            bestFor: "SNS投稿、マーケティング資料"
          },
          {
            name: "corporate",
            description: "コーポレート: ビジネスフォーマルなデザイン",
            colors: ["#2C3E50", "#3498DB", "#2ECC71", "#E74C3C"],
            bestFor: "社内報告、経営資料、提案書"
          }
        ]
      })
    }
  ]
}
```

---

## 4. userConfig スキーマ

Claude Codeの `.mcp.json` でサーバー起動時に環境変数として渡される設定。

```json
{
  "mcpServers": {
    "infographic-generator": {
      "command": "npx",
      "args": ["-y", "mcp-infographic-generator"],
      "env": {
        "GEMINI_API_KEY": "AIzaSy...",
        "IMAGE_OUTPUT_DIR": "/Users/task/taskforce/pj-two/2511リスキリング/generated-images",
        "DEFAULT_STYLE": "notebooklm",
        "DEFAULT_LANGUAGE": "ja",
        "SKIP_PROMPT_ENHANCEMENT": "false"
      }
    }
  }
}
```

### 環境変数一覧

| 変数名 | 必須 | デフォルト | 説明 |
|--------|------|-----------|------|
| `GEMINI_API_KEY` | Yes | - | Google AI Studio で取得した Gemini API キー |
| `IMAGE_OUTPUT_DIR` | No | `./output` | 生成画像の保存先ディレクトリ（絶対パス推奨） |
| `DEFAULT_STYLE` | No | `notebooklm` | デフォルトのスタイルプリセット |
| `DEFAULT_LANGUAGE` | No | `ja` | デフォルトのテキスト言語 |
| `SKIP_PROMPT_ENHANCEMENT` | No | `false` | `true` にするとプロンプト最適化をスキップ |

### Claude Code CLIでの追加コマンド

```bash
claude mcp add --transport stdio \
  --env GEMINI_API_KEY=YOUR_KEY \
  --env IMAGE_OUTPUT_DIR=/path/to/output \
  infographic-generator \
  -- npx -y mcp-infographic-generator
```

---

## 5. package.json の構造

```json
{
  "name": "mcp-infographic-generator",
  "version": "1.0.0",
  "description": "MCP server for generating NotebookLM-style infographic images using Gemini API",
  "main": "dist/index.js",
  "bin": {
    "mcp-infographic-generator": "dist/index.js"
  },
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "biome check src",
    "format": "biome format --write src"
  },
  "keywords": [
    "mcp",
    "mcp-server",
    "model-context-protocol",
    "infographic",
    "image-generation",
    "gemini",
    "notebooklm",
    "claude-code"
  ],
  "license": "MIT",
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {
    "@google/genai": "^1.41.0",
    "@modelcontextprotocol/sdk": "^1.26.0",
    "zod": "^4.3.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

---

## 6. エラーハンドリング方針

### 6.1 エラー分類

| カテゴリ | エラー種別 | 対応方針 |
|---------|----------|---------|
| 設定エラー | `GEMINI_API_KEY` 未設定 | サーバー起動時にログ警告。ツール呼び出し時にユーザーフレンドリーなエラーメッセージを返す |
| 設定エラー | `IMAGE_OUTPUT_DIR` が存在しない | ディレクトリを自動作成（`mkdir -p` 相当） |
| API エラー | 認証失敗 (401) | APIキーの確認を促すメッセージを返す |
| API エラー | レート制限 (429) | リトライ間隔を含むメッセージを返す |
| API エラー | コンテンツポリシー違反 | テーマの変更を促すメッセージを返す |
| API エラー | タイムアウト | 30秒でタイムアウト、再試行を促すメッセージを返す |
| 入力エラー | テーマが空 | Zodバリデーションで拒否 |
| 入力エラー | セクション数が範囲外 | Zodバリデーションで拒否（2-8の範囲） |
| ファイルエラー | 書き込み権限なし | エラーメッセージでパス確認を促す |

### 6.2 エラーレスポンス形式

```typescript
// MCPツールのエラーレスポンス
{
  content: [
    {
      type: "text",
      text: JSON.stringify({
        error: true,
        code: "GEMINI_API_AUTH_FAILED",
        message: "Gemini APIの認証に失敗しました。APIキーを確認してください。",
        suggestion: "Google AI Studio (https://aistudio.google.com/app/apikey) で新しいAPIキーを取得してください。"
      })
    }
  ],
  isError: true
}
```

### 6.3 ログ出力

MCP SDKのlogging capabilityを使用してクライアントにログを送信する。

```typescript
// サーバー初期化時
const server = new McpServer(
  { name: "infographic-generator", version: "1.0.0" },
  { capabilities: { logging: {} } }
);

// ツールハンドラ内
async (params, ctx) => {
  await ctx.mcpReq.log("info", `Generating infographic: ${params.theme}`);
  // ...
  await ctx.mcpReq.log("debug", `Prompt: ${enhancedPrompt}`);
}
```

---

## 7. 依存関係リスト

### 本番依存 (dependencies)

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `@modelcontextprotocol/sdk` | ^1.26.0 | MCP サーバーフレームワーク |
| `@google/genai` | ^1.41.0 | Gemini API クライアント（画像生成 + プロンプト最適化）。注: `mcp-image` と同一パッケージ。旧パッケージ `@google/generative-ai` (v0.x) とは別物 |
| `zod` | ^4.3.0 | スキーマバリデーション（MCP SDK のピア依存）。4.x が latest 安定版 |

### 開発依存 (devDependencies)

| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| `typescript` | ^5.7.0 | TypeScript コンパイラ |
| `@types/node` | ^22.0.0 | Node.js 型定義 |
| `tsx` | ^4.19.0 | 開発時のTypeScript実行 |
| `vitest` | ^3.0.0 | テストフレームワーク |
| `@biomejs/biome` | ^1.9.0 | リンター・フォーマッター |

---

## 8. 処理フロー

```
ユーザー入力
    |
    v
[1. 入力バリデーション] -- Zodスキーマで検証
    |
    v
[2. スタイルテンプレート選択] -- style パラメータに基づく
    |
    v
[3. プロンプト構築] -- テーマ + 詳細 + スタイル情報を結合
    |
    v
[4. プロンプト最適化] -- Gemini 2.0 Flash でプロンプトを強化
    |                     (SKIP_PROMPT_ENHANCEMENT=true で省略可)
    v
[5. 画像生成] -- Gemini (Imagen 3) で画像生成
    |
    v
[6. ファイル保存] -- IMAGE_OUTPUT_DIR に PNG として保存
    |
    v
[7. レスポンス返却] -- ファイルパス + メタデータ
```

---

## 9. NotebookLM風プロンプトテンプレート（内蔵）

`prompt-builder.ts` に内蔵する基本プロンプトテンプレート:

```typescript
const NOTEBOOKLM_BASE_PROMPT = `
Create a professional, educational infographic with the following characteristics:

DESIGN SYSTEM:
- Clean, modern flat design inspired by Google's Material Design
- Light background (white #FFFFFF or light gray #F8F9FA)
- Primary colors: Blue #4285F4, Green #34A853, Orange #FBBC04, Red #EA4335
- Typography: Sans-serif, clear hierarchy (title > heading > body)
- Generous whitespace and padding between sections

LAYOUT:
- Title area at the top with prominent, bold text
- Content divided into {sections} distinct sections
- Each section: icon/illustration + heading + 1-2 sentence description
- Visual connectors or flow arrows between related concepts
- Subtle grid-based alignment

CONTENT RULES:
- Focus on key concepts (3-7 points)
- Each point is concise (1-2 sentences maximum)
- Use simple icons and flat illustrations
- Include visual metaphors where appropriate
- Technical terms have brief annotations

THEME: {theme}
DETAILS: {details}
LANGUAGE: {language} for all text labels
ASPECT RATIO: {aspectRatio}
`;
```

---

## 10. 既存環境との統合

### 現在の `.mcp.json` との共存

既存の `mcp-image` サーバーと並行して使用可能。`.mcp.json` に追加:

```json
{
  "mcpServers": {
    "mcp-image": {
      "command": "npx",
      "args": ["-y", "mcp-image"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "IMAGE_OUTPUT_DIR": "/Users/task/taskforce/pj-two/2511リスキリング/generated-images"
      }
    },
    "infographic-generator": {
      "command": "npx",
      "args": ["-y", "mcp-infographic-generator"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "IMAGE_OUTPUT_DIR": "/Users/task/taskforce/pj-two/2511リスキリング/generated-images"
      }
    }
  }
}
```

### ローカル開発時の設定

npm publish前のローカル開発では、`node` コマンドで直接実行:

```json
{
  "mcpServers": {
    "infographic-generator": {
      "command": "node",
      "args": ["./mcp-servers/infographic-generator/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",
        "IMAGE_OUTPUT_DIR": "/Users/task/taskforce/pj-two/2511リスキリング/generated-images"
      }
    }
  }
}
```

---

## 11. セキュリティ考慮事項

- `GEMINI_API_KEY` は環境変数経由でのみ受け渡し。ソースコードにハードコードしない
- `.mcp.json` に直接APIキーを書く場合は `.gitignore` で除外（既に設定済み）
- 環境変数展開 `${GEMINI_API_KEY}` を使うことで `.mcp.json` を安全にバージョン管理可能
- ファイル出力先は `IMAGE_OUTPUT_DIR` で制限し、パストラバーサルを防止

---

## 12. 設計上の判断

### Q: なぜ既存の `mcp-image` を使わず新しいMCPサーバーを作るのか？

A: `mcp-image` は汎用的な画像生成ツールであり、インフォグラフィック固有のプロンプト最適化やスタイルテンプレートを持たない。専用MCPサーバーにすることで:
- インフォグラフィックに最適化されたプロンプトテンプレートを内蔵できる
- `theme` と `details` だけの簡潔なインターフェースを提供できる
- スタイルプリセットでデザインの一貫性を保証できる

### Q: なぜ Gemini API を直接使うのか？

A: `mcp-image` がラップしている Gemini API を直接使うことで:
- プロンプト最適化ステージを完全に制御できる
- インフォグラフィック特化のプロンプトエンジニアリングが可能
- 依存関係を最小限に保てる

---

**設計書バージョン**: 1.1.0
**作成日**: 2026-02-18
**更新日**: 2026-02-18（レビューフィードバック反映: imageSize解像度マッピング追加、パッケージ名補足）
**ステータス**: 承認済み
