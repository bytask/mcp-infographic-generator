/**
 * Build detailed prompt for infographic generation
 */
export function buildInfographicPrompt(input, styleTemplate) {
    const { theme, details, language, aspectRatio, sections } = input;
    const languageMap = {
        ja: "Japanese",
        en: "English"
    };
    const prompt = `
Create a professional, educational infographic with the following specifications:

THEME: ${theme}
${details ? `ADDITIONAL DETAILS: ${details}` : ""}

DESIGN SYSTEM:
- Style: ${styleTemplate.description}
- Background: ${styleTemplate.background}
- Color Palette: ${styleTemplate.colors.join(", ")}
- Typography: ${styleTemplate.typography}
- Layout Structure: ${styleTemplate.layout}

CONTENT STRUCTURE:
- Title area at the top with prominent, bold text: "${theme}"
- Divide content into ${sections} distinct sections
- Each section should have:
  * An icon or simple illustration representing the concept
  * A clear heading (2-4 words)
  * A concise description (1-2 sentences maximum)
- Visual flow arrows or connectors between related concepts
- Generous whitespace and padding between sections

LAYOUT SPECIFICATIONS:
- Aspect Ratio: ${aspectRatio}
- Grid-based alignment for clean structure
- Icons: Simple, flat design style
- Visual hierarchy: Title (largest) > Section headings > Body text

CONTENT GUIDELINES:
- Focus on ${sections} key concepts or steps
- Each concept explained in 1-2 sentences maximum
- Use simple, clear language
- Include visual metaphors where appropriate
- Technical terms should have brief annotations

TEXT LANGUAGE: All text labels, headings, and descriptions must be in ${languageMap[language] || "Japanese"}

QUALITY REQUIREMENTS:
- Professional, clean design
- High readability
- Balanced composition
- Appropriate use of whitespace
- Icons and illustrations in flat design style
- Clear visual hierarchy

OUTPUT: A single, complete infographic image that can be used immediately for ${styleTemplate.bestFor}
`.trim();
    return prompt;
}
/**
 * Enhance prompt using Gemini Flash (optional step)
 */
export function buildPromptEnhancementQuery(basePrompt) {
    return `
You are a professional prompt engineer specializing in image generation prompts.

Given the following infographic generation prompt, enhance it to produce better results from an AI image generator. Focus on:
1. Adding specific visual details
2. Clarifying composition and layout
3. Specifying color usage more precisely
4. Adding details about iconography and visual elements
5. Improving clarity while keeping the core intent

Original prompt:
${basePrompt}

Enhanced prompt:
`.trim();
}
//# sourceMappingURL=prompt-builder.js.map