import { GoogleGenAI } from "@google/genai";
export class GeminiClient {
    genai;
    imageModel = "gemini-3-pro-image-preview";
    textModel = "gemini-2.0-flash";
    constructor(apiKey) {
        this.genai = new GoogleGenAI({ apiKey });
    }
    /**
     * Enhance prompt using Gemini Flash (text generation)
     */
    async enhancePrompt(basePrompt) {
        try {
            const result = await this.genai.models.generateContent({
                model: this.textModel,
                contents: basePrompt,
            });
            return result.text ?? basePrompt;
        }
        catch (error) {
            console.error("Prompt enhancement failed, using base prompt:", error);
            return basePrompt;
        }
    }
    /**
     * Generate infographic image using Gemini image generation
     */
    async generateImage(prompt, input) {
        const aspectRatio = input.aspectRatio || "16:9";
        const config = {
            responseModalities: ["IMAGE"],
            imageConfig: {
                aspectRatio,
            },
        };
        const result = await this.genai.models.generateContent({
            model: this.imageModel,
            contents: prompt,
            config,
        });
        const candidates = result.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No response candidates returned from Gemini API. " +
                "Check that your GEMINI_API_KEY has access to image generation.");
        }
        for (const candidate of candidates) {
            for (const part of candidate.content?.parts ?? []) {
                if (part.inlineData?.data) {
                    return Buffer.from(part.inlineData.data, "base64");
                }
            }
        }
        throw new Error("No image data found in Gemini API response. " +
            "The model may not have generated an image for this prompt.");
    }
    /**
     * Test API connection
     */
    async testConnection() {
        try {
            await this.genai.models.generateContent({
                model: this.textModel,
                contents: "Hello",
            });
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=gemini-client.js.map