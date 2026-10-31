import { hostHeaderValidationResponse } from "@modelcontextprotocol/server";
import { createHandler, installKeyFromPath, PUBLIC_HOSTS } from "../src/server.js";

const allowedHosts = [
  ...PUBLIC_HOSTS,
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
].filter((h): h is string => Boolean(h));

async function serve(request: Request): Promise<Response> {
  const rejected = hostHeaderValidationResponse(request, allowedHosts);
  if (rejected) return rejected;
  const key = installKeyFromPath(new URL(request.url).pathname);
  return createHandler(key).fetch(request);
}

export { serve as GET, serve as POST, serve as DELETE };
