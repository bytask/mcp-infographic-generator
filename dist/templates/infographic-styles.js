/**
 * Infographic style presets with design specifications
 */
export const INFOGRAPHIC_STYLES = {
    notebooklm: {
        name: "NotebookLM Style",
        description: "NotebookLM風: 白背景、Material Designカラー、クリーンなレイアウト",
        colors: ["#4285F4", "#34A853", "#FBBC04", "#EA4335"],
        background: "Clean white (#FFFFFF) or light gray (#F8F9FA)",
        typography: "Sans-serif, clear hierarchy (title > heading > body)",
        layout: "Grid-based with generous whitespace, 3-5 sections with icons",
        bestFor: "教育資料、技術解説、学習ノート"
    },
    dark: {
        name: "Dark Theme",
        description: "ダークテーマ: 暗い背景にビビッドなカラー",
        colors: ["#1a1a2e", "#16213e", "#0f3460", "#e94560"],
        background: "Dark navy (#1a1a2e) or black (#000000)",
        typography: "Modern sans-serif with high contrast",
        layout: "Futuristic design with neon accents and glowing effects",
        bestFor: "プレゼン、技術カンファレンス資料"
    },
    minimal: {
        name: "Minimal Design",
        description: "ミニマル: 白黒基調、シンプルな幾何学模様",
        colors: ["#000000", "#333333", "#666666", "#ffffff"],
        background: "Pure white (#FFFFFF)",
        typography: "Clean sans-serif, Swiss design inspired",
        layout: "Ultra minimal with lots of negative space, simple geometric shapes",
        bestFor: "ドキュメント、フォーマルな資料"
    },
    colorful: {
        name: "Colorful & Vibrant",
        description: "カラフル: ポップで明るい色使い",
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"],
        background: "Light cream (#FFF9F0) or pastel background",
        typography: "Friendly rounded sans-serif",
        layout: "Playful layout with organic shapes and bright colors",
        bestFor: "SNS投稿、マーケティング資料"
    },
    corporate: {
        name: "Corporate Professional",
        description: "コーポレート: ビジネスフォーマルなデザイン",
        colors: ["#2C3E50", "#3498DB", "#2ECC71", "#E74C3C"],
        background: "Professional gray (#ECF0F1) or white",
        typography: "Corporate sans-serif, conservative and formal",
        layout: "Structured grid layout, professional charts and diagrams",
        bestFor: "社内報告、経営資料、提案書"
    }
};
export const DEFAULT_STYLE = "notebooklm";
export function getStyleTemplate(styleName) {
    return INFOGRAPHIC_STYLES[styleName] || INFOGRAPHIC_STYLES[DEFAULT_STYLE];
}
export function listAllStyles() {
    return Object.values(INFOGRAPHIC_STYLES);
}
//# sourceMappingURL=infographic-styles.js.map