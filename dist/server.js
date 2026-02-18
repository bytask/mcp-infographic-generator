import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { GenerateInfographicSchema, validateEnv } from "./utils/validation.js";
import { ListTemplatesSchema } from "./tools/list-templates.js";
import { generateInfographic } from "./tools/generate-infographic.js";
import { listInfographicTemplates } from "./tools/list-templates.js";
export class InfographicGeneratorServer {
    server;
    apiKey;
    constructor() {
        // Validate environment variables
        const env = validateEnv();
        this.apiKey = env.apiKey;
        // Initialize MCP server
        this.server = new Server({
            name: "infographic-generator",
            version: "1.0.0",
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupHandlers();
    }
    setupHandlers() {
        // List available tools
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "generate_infographic",
                    description: "指定されたテーマについてNotebookLM風のインフォグラフィック画像を生成します。テーマを入力するだけで、視覚的に分かりやすい教育的・説明的な画像を自動生成します。",
                    inputSchema: {
                        type: "object",
                        properties: {
                            theme: {
                                type: "string",
                                description: "インフォグラフィックのメインテーマ（例: '機械学習の基礎', 'Docker入門'）",
                            },
                            details: {
                                type: "string",
                                description: "含めたい要素や詳細説明（例: 'コンテナ、イメージ、Dockerfileについて'）",
                            },
                            style: {
                                type: "string",
                                enum: ["notebooklm", "dark", "minimal", "colorful", "corporate"],
                                description: "デザインスタイルのプリセット",
                                default: "notebooklm",
                            },
                            language: {
                                type: "string",
                                enum: ["ja", "en"],
                                description: "テキストラベルの言語",
                                default: "ja",
                            },
                            aspectRatio: {
                                type: "string",
                                enum: ["16:9", "1:1", "9:16", "4:3", "3:2"],
                                description: "画像のアスペクト比",
                                default: "16:9",
                            },
                            sections: {
                                type: "number",
                                description: "インフォグラフィック内のセクション数（2-8）",
                                minimum: 2,
                                maximum: 8,
                                default: 4,
                            },
                            fileName: {
                                type: "string",
                                description: "出力ファイル名（指定しない場合は自動生成）",
                            },
                            imageSize: {
                                type: "string",
                                enum: ["standard", "2K", "4K"],
                                description: "画像解像度",
                                default: "standard",
                            },
                        },
                        required: ["theme"],
                    },
                },
                {
                    name: "list_infographic_templates",
                    description: "利用可能なインフォグラフィックのデザインスタイル一覧を表示します。",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    },
                },
            ],
        }));
        // Handle tool calls
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case "generate_infographic": {
                        const validated = GenerateInfographicSchema.parse(args);
                        return await generateInfographic(validated, this.apiKey);
                    }
                    case "list_infographic_templates": {
                        ListTemplatesSchema.parse(args);
                        return await listInfographicTemplates();
                    }
                    default:
                        throw new Error(`Unknown tool: ${name}`);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    return {
                        content: [
                            {
                                type: "text",
                                text: JSON.stringify({
                                    error: true,
                                    message: error.message,
                                }, null, 2),
                            },
                        ],
                        isError: true,
                    };
                }
                throw error;
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Infographic Generator MCP Server running on stdio");
    }
}
//# sourceMappingURL=server.js.map