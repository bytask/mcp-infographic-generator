import fs from "fs/promises";
import path from "path";
/**
 * Get output directory from environment or use default
 */
export function getOutputDir() {
    return process.env.IMAGE_OUTPUT_DIR || "./output";
}
/**
 * Ensure directory exists, create if necessary
 */
export async function ensureDirectory(dirPath) {
    try {
        await fs.access(dirPath);
    }
    catch {
        await fs.mkdir(dirPath, { recursive: true });
    }
}
/**
 * Generate unique filename with timestamp
 */
export function generateFileName(theme, customName) {
    if (customName) {
        // Sanitize custom filename
        const sanitized = customName.replace(/[^a-zA-Z0-9-_]/g, "-");
        return `${sanitized}.png`;
    }
    // Auto-generate filename from theme and timestamp
    const timestamp = Date.now();
    const sanitizedTheme = theme
        .substring(0, 30)
        .replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
    return `infographic-${sanitizedTheme}-${timestamp}.png`;
}
/**
 * Save image buffer to file
 */
export async function saveImage(imageBuffer, outputDir, fileName) {
    await ensureDirectory(outputDir);
    const filePath = path.join(outputDir, fileName);
    await fs.writeFile(filePath, imageBuffer);
    return filePath;
}
/**
 * Convert file path to file:// URI
 */
export function toFileUri(filePath) {
    const absolute = path.resolve(filePath);
    return `file://${absolute}`;
}
//# sourceMappingURL=file-output.js.map