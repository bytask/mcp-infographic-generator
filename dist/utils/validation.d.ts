import { z } from "zod";
/**
 * Input schema for generate_infographic tool
 */
export declare const GenerateInfographicSchema: z.ZodObject<{
    theme: z.ZodString;
    details: z.ZodOptional<z.ZodString>;
    style: z.ZodDefault<z.ZodOptional<z.ZodEnum<["notebooklm", "dark", "minimal", "colorful", "corporate"]>>>;
    language: z.ZodDefault<z.ZodOptional<z.ZodEnum<["ja", "en"]>>>;
    aspectRatio: z.ZodDefault<z.ZodOptional<z.ZodEnum<["16:9", "1:1", "9:16", "4:3", "3:2"]>>>;
    sections: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    fileName: z.ZodOptional<z.ZodString>;
    imageSize: z.ZodDefault<z.ZodOptional<z.ZodEnum<["standard", "2K", "4K"]>>>;
}, "strip", z.ZodTypeAny, {
    theme: string;
    style: "notebooklm" | "dark" | "minimal" | "colorful" | "corporate";
    language: "ja" | "en";
    aspectRatio: "16:9" | "1:1" | "9:16" | "4:3" | "3:2";
    sections: number;
    imageSize: "standard" | "2K" | "4K";
    details?: string | undefined;
    fileName?: string | undefined;
}, {
    theme: string;
    details?: string | undefined;
    style?: "notebooklm" | "dark" | "minimal" | "colorful" | "corporate" | undefined;
    language?: "ja" | "en" | undefined;
    aspectRatio?: "16:9" | "1:1" | "9:16" | "4:3" | "3:2" | undefined;
    sections?: number | undefined;
    fileName?: string | undefined;
    imageSize?: "standard" | "2K" | "4K" | undefined;
}>;
export type GenerateInfographicInput = z.infer<typeof GenerateInfographicSchema>;
/**
 * Validate environment variables
 */
export declare function validateEnv(): {
    apiKey: string;
};
/**
 * Get output directory from environment or use default
 */
export declare function getOutputDir(): string;
/**
 * Get default style from environment or use preset
 */
export declare function getDefaultStyle(): string;
//# sourceMappingURL=validation.d.ts.map