/**
 * Zoho Catalyst AppSail entry point.
 * Adapts the TanStack Start web-fetch handler to a plain Node.js HTTP server.
 */

import http from "node:http";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Port ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(
  process.env.X_ZOHO_CATALYST_LISTEN_PORT || process.env.PORT || "9000",
  10
);

// ── Static asset directory (client build) ────────────────────────────────────
const STATIC_DIR = path.join(__dirname, "dist", "client");

// ── MIME types ────────────────────────────────────────────────────────────────
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".webp": "image/webp",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".map": "application/json",
};

// ── Load the SSR handler ───────────────────────────────────────────────────────
let ssrHandler;
async function getHandler() {
  if (!ssrHandler) {
    const mod = await import("./dist/server/server.js");
    ssrHandler = (mod.default ?? mod).fetch;
  }
  return ssrHandler;
}

// ── Node req → Web Request ─────────────────────────────────────────────────────
function nodeToWebRequest(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["host"] || `localhost:${PORT}`;
  const url = `${proto}://${host}${req.url}`;

  const headers = new Headers();
  for (const [key, val] of Object.entries(req.headers)) {
    if (Array.isArray(val)) val.forEach((v) => headers.append(key, v));
    else if (val) headers.set(key, val);
  }

  const hasBody = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method || "GET");
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : null,
    duplex: hasBody ? "half" : undefined,
  });
}

// ── Web Response → Node res ────────────────────────────────────────────────────
async function webToNodeResponse(webRes, res) {
  res.statusCode = webRes.status;
  for (const [key, val] of webRes.headers.entries()) {
    res.setHeader(key, val);
  }
  if (webRes.body) {
    const reader = webRes.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    } finally {
      reader.releaseLock();
    }
  }
  res.end();
}

// ── Serve static file ─────────────────────────────────────────────────────────
function serveStatic(urlPath, res) {
  const safePath = urlPath.split("?")[0];
  const filePath = path.join(STATIC_DIR, safePath);

  // Prevent directory traversal
  if (!filePath.startsWith(STATIC_DIR)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return true;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || "application/octet-stream";
    res.setHeader("Content-Type", mime);

    // Cache immutable hashed assets
    if (safePath.startsWith("/assets/")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      res.setHeader("Cache-Control", "no-cache");
    }

    fs.createReadStream(filePath).pipe(res);
    return true;
  }
  return false;
}

// ── HTTP Server ───────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  try {
    const urlPath = (req.url || "/").split("?")[0];

    // Serve static files from /assets/ and known static extensions
    if (urlPath !== "/" && serveStatic(urlPath, res)) return;

    // SSR everything else
    const handler = await getHandler();
    const webReq = nodeToWebRequest(req);
    const webRes = await handler(webReq, {}, {});
    await webToNodeResponse(webRes, res);
  } catch (err) {
    console.error("[CatalystServer] Error:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain");
      res.end("Internal Server Error");
    }
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[CatalystServer] KSP CrimeIQ running on port ${PORT}`);
});
