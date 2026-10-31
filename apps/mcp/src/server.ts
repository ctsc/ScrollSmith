import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { trackMcp } from "./track.js";

export const SERVER_INFO = { name: "scrollsmith", version: "0.1.0" } as const;

export const PUBLIC_HOSTS = [
  "mcp.scroll-smith.com",
  "scrollsmith-mcp.vercel.app",
];

const CATEGORIES = ["video", "image", "voice"] as const;

export function buildServer(): McpServer {
  const server = new McpServer({
    ...SERVER_INFO,
    title: "Scrollsmith",
    description:
      "Free skills for making faceless short-form video, images and voice-over with your own AI assistant.",
    websiteUrl: "https://www.scroll-smith.com",
  });

  server.server.oninitialized = () => {
    const client = server.server.getClientVersion();
    void trackMcp({
      event: "initialize",
      client_name: client?.name,
      client_version: client?.version,
    });
  };

  server.registerTool(
    "scrollsmith_status",
    {
      title: "Scrollsmith status",
      description:
        "Confirms the Scrollsmith MCP connection is working and reports what is available right now.",
      inputSchema: z.object({}),
    },
    async () => {
      await trackMcp({ event: "tool_call", tool: "scrollsmith_status" });
      return {
        content: [
          {
            type: "text",
            text: [
              "Scrollsmith is connected.",
              `Server version ${SERVER_INFO.version}.`,
              "Skills (video, image, voice) are not published yet; list_skills will return them when they land.",
              "Site: https://www.scroll-smith.com",
            ].join("\n"),
          },
        ],
      };
    },
  );

  server.registerTool(
    "list_skills",
    {
      title: "List Scrollsmith skills",
      description:
        "Lists the Scrollsmith skills available for making faceless short-form content. Optionally filter by category.",
      inputSchema: z.object({
        category: z.enum(CATEGORIES).optional(),
      }),
    },
    async ({ category }) => {
      await trackMcp({ event: "tool_call", tool: "list_skills" });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                category: category ?? "all",
                skills: [],
                note: "Skills are being published. Check back soon or follow https://www.scroll-smith.com.",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  return server;
}

export const handler = createMcpHandler(() => buildServer());
