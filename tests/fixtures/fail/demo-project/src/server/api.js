// 摘要接口。前端把它渲染成「文章摘要」卡片。
import { summarize } from '../ai/client.js';

export async function handleSummary(req, res) {
  const { material = '', question = '' } = req.body || {};
  if (!material.trim()) {
    return res.status(400).json({ error: 'material is required' });
  }
  const summary = await summarize(material, question);
  return res.json({ data: summary, length: summary.length });
}
