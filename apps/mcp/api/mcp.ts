import { hostHeaderValidationResponse } from "@modelcontextprotocol/server";
import { handler, PUBLIC_HOSTS } from "../src/server.ts";

const allowedHosts = [
  ...PUBLIC_HOSTS,
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
].filter((h): h is string => Boolean(h));

async function serve(request: Request): Promise<Response> {
  return hostHeaderValidationResponse(request, allowedHosts) ?? handler.fetch(request);
}

export { serve as GET, serve as POST, serve as DELETE };
