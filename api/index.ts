import express from 'express';
import { marketRouter } from '../server/routes/marketRoutes';

const app = express();

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

// Market Data API Route (Lightweight, zero database/ingestion dependencies)
app.use('/api/markets', marketRouter);

// Lazy-loaded News API Router
app.use('/api/news', async (req, res, next) => {
  try {
    const { newsRouter } = await import('../server/routes/newsRoutes');
    return newsRouter(req, res, next);
  } catch (err) {
    console.error('[Lazy News Router Error]:', err);
    return res.status(500).json({ error: 'Failed to load news service' });
  }
});

// Serverless cron ingestion endpoint
app.all('/api/cron/ingest', async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized cron request' });
  }

  try {
    const { ingestAllSources } = await import('../server/services/ingestion');
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

export default app;
