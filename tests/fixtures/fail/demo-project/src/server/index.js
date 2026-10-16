import express from 'express';
import { handleSummary } from './api.js';
import { handleDraft } from './draft.js';

const app = express();
app.use(express.json({ limit: '2mb' }));

app.post('/api/summary', handleSummary);
app.post('/api/draft', handleDraft);
app.get('/healthz', (req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 8080);
app.listen(port, () => {
  console.log(`whale-doc-assistant listening on :${port}`);
});
