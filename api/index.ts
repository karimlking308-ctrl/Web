import express from 'express';
import { newsRouter } from '../server/routes/newsRoutes';
import { marketRouter } from '../server/routes/marketRoutes';
import { ingestAllSources } from '../server/services/ingestion';

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

// Serverless cron ingestion endpoint
app.all('/api/cron/ingest', async (req, res) => {
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

// API Routes
app.use('/api/news', newsRouter);
app.use('/api/markets', marketRouter);

export default app;
