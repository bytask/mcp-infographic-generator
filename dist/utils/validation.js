import { z } from "zod";
/**
 * Input schema for generate_infographic tool
 */
export const GenerateInfographicSchema = z.object({
    theme: z.string()
        .min(1, "Theme cannot be empty")
        .describe("インフォグラフィックのメインテーマ（例: '機械学習の基礎', 'Docker入門'）"),
    details: z.string().optional()
        .describe("含めたい要素や詳細説明（例: 'コンテナ、イメージ、Dockerfileについて'）"),
    style: z.enum([
        "notebooklm",
        "dark",
        "minimal",
        "colorful",
        "corporate"
    ]).optional().default("notebooklm")
        .describe("デザインスタイルのプリセット"),
    language: z.enum(["ja", "en"]).optional().default("ja")
        .describe("テキストラベルの言語"),
    aspectRatio: z.enum([
        "16:9",
        "1:1",
        "9:16",
        "4:3",
        "3:2"
    ]).optional().default("16:9")
        .describe("画像のアスペクト比"),
    sections: z.number().int().min(2).max(8).optional().default(4)
        .describe("インフォグラフィック内のセクション数（2-8）"),
    fileName: z.string().optional()
        .describe("出力ファイル名（指定しない場合は自動生成）"),
    imageSize: z.enum(["standard", "2K", "4K"]).optional().default("standard")
        .describe("画像解像度")
});
/**
 * Validate environment variables
 */
export function validateEnv() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required. " +
            "Please set it in your .mcp.json configuration or environment.");
    }
    return { apiKey };
}
/**
 * Get output directory from environment or use default
 */
export function getOutputDir() {
    return process.env.IMAGE_OUTPUT_DIR || "./output";
}
/**
 * Get default style from environment or use preset
 */
export function getDefaultStyle() {
    return process.env.DEFAULT_STYLE || "notebooklm";
}
//# sourceMappingURL=validation.js.map