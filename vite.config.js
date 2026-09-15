import { defineConfig, loadEnv } from 'vite';
import handler from './api/products.js';

export default defineConfig(({ mode }) => {
  // Load environment variables so process.env has PRINTIFY_API_KEY
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      {
        name: 'vercel-serverless-api-emulator',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            const url = req.url ? req.url.split('?')[0] : '';
            if (url === '/api/products') {
              // Adapt Node HTTP response to Vercel/Express-style helpers
              res.status = (statusCode) => {
                res.statusCode = statusCode;
                return res;
              };
              res.json = (data) => {
                if (!res.getHeader('Content-Type')) {
                  res.setHeader('Content-Type', 'application/json');
                }
                res.end(JSON.stringify(data));
                return res;
              };
              try {
                await handler(req, res);
              } catch (err) {
                console.error('[API Emulator Error]:', err);
                if (!res.writableEnded) {
                  res.status(500).json({ error: err.message });
                }
              }
              return;
            }
            next();
          });
        },
      },
    ],
  };
});
