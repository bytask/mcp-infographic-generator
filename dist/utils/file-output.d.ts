/**
 * Get output directory from environment or use default
 */
export declare function getOutputDir(): string;
/**
 * Ensure directory exists, create if necessary
 */
export declare function ensureDirectory(dirPath: string): Promise<void>;
/**
 * Generate unique filename with timestamp
 */
export declare function generateFileName(theme: string, customName?: string): string;
/**
 * Save image buffer to file
 */
export declare function saveImage(imageBuffer: Buffer, outputDir: string, fileName: string): Promise<string>;
/**
 * Convert file path to file:// URI
 */
export declare function toFileUri(filePath: string): string;
//# sourceMappingURL=file-output.d.ts.map