import { GoogleGenerativeAI } from "@google/generative-ai";
export class GeminiClient {
    genAI;
    imageModel = "gemini-3-pro-image-preview";
    textModel = "gemini-2.0-flash";
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }
    /**
     * Enhance prompt using Gemini Flash (text generation)
     */
    async enhancePrompt(basePrompt) {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.textModel });
            const result = await model.generateContent(basePrompt);
            const enhanced = result.response.text();
            return enhanced || basePrompt;
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
        const model = this.genAI.getGenerativeModel({
            model: this.imageModel,
        });
        // Embed aspect ratio guidance into the prompt
        const aspectRatio = input.aspectRatio || "16:9";
        const fullPrompt = `${prompt}\n\nIMPORTANT: Generate this as a ${aspectRatio} aspect ratio image.`;
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
            generationConfig: {
                responseModalities: ["image", "text"],
            },
        });
        const candidates = result.response.candidates;
        if (!candidates || candidates.length === 0) {
            throw new Error("No response candidates returned from Gemini API. " +
                "Check that your GEMINI_API_KEY has access to image generation.");
        }
        for (const candidate of candidates) {
            for (const part of candidate.content?.parts || []) {
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
            const model = this.genAI.getGenerativeModel({ model: this.textModel });
            await model.generateContent("Hello");
            return true;
        }
        catch {
            return false;
        }
    }
}
//# sourceMappingURL=gemini-client.js.map