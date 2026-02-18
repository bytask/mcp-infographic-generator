import type { GenerateInfographicInput } from "../utils/validation.js";
export declare function generateInfographic(input: GenerateInfographicInput, apiKey: string): Promise<{
    content: ({
        type: "text";
        text: string;
        resource?: undefined;
    } | {
        type: "resource";
        resource: {
            uri: string;
            name: string;
            mimeType: string;
        };
        text?: undefined;
    })[];
    isError?: undefined;
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError: boolean;
}>;
//# sourceMappingURL=generate-infographic.d.ts.map