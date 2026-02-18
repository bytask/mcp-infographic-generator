import type { GenerateInfographicInput } from "../utils/validation.js";
import type { InfographicStyle } from "../templates/infographic-styles.js";
/**
 * Build detailed prompt for infographic generation
 */
export declare function buildInfographicPrompt(input: GenerateInfographicInput, styleTemplate: InfographicStyle): string;
/**
 * Enhance prompt using Gemini Flash (optional step)
 */
export declare function buildPromptEnhancementQuery(basePrompt: string): string;
//# sourceMappingURL=prompt-builder.d.ts.map