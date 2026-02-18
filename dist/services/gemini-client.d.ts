import type { GenerateInfographicInput } from "../utils/validation.js";
export declare class GeminiClient {
    private genai;
    private imageModel;
    private textModel;
    constructor(apiKey: string);
    /**
     * Enhance prompt using Gemini Flash (text generation)
     */
    enhancePrompt(basePrompt: string): Promise<string>;
    /**
     * Generate infographic image using Gemini image generation
     */
    generateImage(prompt: string, input: GenerateInfographicInput): Promise<Buffer>;
    /**
     * Test API connection
     */
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=gemini-client.d.ts.map