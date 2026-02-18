import { z } from "zod";
import { listAllStyles } from "../templates/infographic-styles.js";

export const ListTemplatesSchema = z.object({});

export async function listInfographicTemplates() {
  const templates = listAllStyles();

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            templates: templates.map((style) => ({
              name: style.name,
              description: style.description,
              colors: style.colors,
              bestFor: style.bestFor,
            })),
          },
          null,
          2
        ),
      },
    ],
  };
}
