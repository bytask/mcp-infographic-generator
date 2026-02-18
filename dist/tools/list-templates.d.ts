import { z } from "zod";
export declare const ListTemplatesSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare function listInfographicTemplates(): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=list-templates.d.ts.map