import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy requests to the target site
  app.use(
    "/proxy",
    createProxyMiddleware({
      target: "https://abejorro-digital.rf.gd",
      changeOrigin: true,
      pathRewrite: {
        "^/proxy": "", // remove /proxy from the URL
      },
      on: {
        proxyRes: (proxyRes, req, res) => {
          // Remove headers that prevent framing
          delete proxyRes.headers["x-frame-options"];
          delete proxyRes.headers["content-security-policy"];
          
          // Also handle cookies if needed, but removing frame options is the main goal
        },
      },
    })
  );

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
