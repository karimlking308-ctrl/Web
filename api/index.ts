import express from 'express';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'QuickKit Online Tools Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }
  return res.json({
    success: true,
    message: 'Thank you for subscribing to QuickKit updates!',
  });
});

export default app;
