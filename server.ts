import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { newsRouter } from './server/routes/newsRoutes';
import { marketRouter } from './server/routes/marketRoutes';
import { startIngestionScheduler, ingestAllSources } from './server/services/ingestion';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'PULSE Financial Intelligence Engine',
      phase: 2,
      timestamp: new Date().toISOString(),
    });
  });

  // Dedicated serverless cron ingestion endpoint (Vercel Cron, Google Cloud Scheduler, GitHub Actions)
  app.all('/api/cron/ingest', async (req, res) => {
    // Optional secret verification if CRON_SECRET is configured
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.authorization;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized cron request' });
    }

    try {
      const report = await ingestAllSources();
      return res.json({
        status: 'success',
        message: 'Serverless cron ingestion completed',
        report,
      });
    } catch (err: any) {
      console.error('[Cron Ingest Error]:', err);
      return res.status(500).json({ error: 'Ingestion failed' });
    }
  });

  // News Ingestion API Routes
  app.use('/api/news', newsRouter);

  // Market Data API Routes
  app.use('/api/markets', marketRouter);

  // Initialize optional local background scheduler (safe for long-running Node processes; bypassed when in serverless mode)
  startIngestionScheduler(15 * 60 * 1000);

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PULSE Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[PULSE Server] Failed to start:', err);
});
