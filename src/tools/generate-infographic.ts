import type { GenerateInfographicInput } from "../utils/validation.js";
import { getStyleTemplate } from "../templates/infographic-styles.js";
import { buildInfographicPrompt, buildPromptEnhancementQuery } from "../services/prompt-builder.js";
import { GeminiClient } from "../services/gemini-client.js";
import { generateFileName, saveImage, toFileUri, getOutputDir } from "../utils/file-output.js";

export async function generateInfographic(
  input: GenerateInfographicInput,
  apiKey: string
) {
  try {
    // 1. Get style template
    const styleTemplate = getStyleTemplate(input.style || "notebooklm");

    // 2. Build base prompt
    const basePrompt = buildInfographicPrompt(input, styleTemplate);

    // 3. Initialize Gemini client
    const geminiClient = new GeminiClient(apiKey);

    // 4. Enhance prompt (optional, can be skipped with SKIP_PROMPT_ENHANCEMENT)
    const skipEnhancement = process.env.SKIP_PROMPT_ENHANCEMENT === "true";
    let finalPrompt = basePrompt;

    if (!skipEnhancement) {
      try {
        const enhancementQuery = buildPromptEnhancementQuery(basePrompt);
        finalPrompt = await geminiClient.enhancePrompt(enhancementQuery);
      } catch (error) {
        console.error("Prompt enhancement failed, using base prompt:", error);
        finalPrompt = basePrompt;
      }
    }

    // 5. Generate image
    const imageBuffer = await geminiClient.generateImage(finalPrompt, input);

    // 6. Save image to file
    const outputDir = getOutputDir();
    const fileName = generateFileName(input.theme, input.fileName);
    const filePath = await saveImage(imageBuffer, outputDir, fileName);

    // 7. Return result
    const fileUri = toFileUri(filePath);
    const metadata = {
      filePath,
      theme: input.theme,
      style: input.style || "notebooklm",
      aspectRatio: input.aspectRatio || "16:9",
      sections: input.sections || 4,
      generatedAt: new Date().toISOString(),
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(metadata, null, 2),
        },
        {
          type: "resource" as const,
          resource: {
            uri: fileUri,
            name: `インフォグラフィック: ${input.theme}`,
            mimeType: "image/png",
          },
        },
      ],
    };
  } catch (error) {
    // Error handling
    if (error instanceof Error) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: true,
                message: error.message,
                suggestion: "Please check your GEMINI_API_KEY and try again.",
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              error: true,
              message: "Unknown error occurred during image generation",
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}
