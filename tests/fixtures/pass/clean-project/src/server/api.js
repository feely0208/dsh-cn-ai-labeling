// 摘要接口：返回正文的同时，带上显式标识与隐式标识。
// 返回体里的 label 字段即「本内容由 AI 生成，仅供参考，请人工核验」，前端必须渲染出来。
import { summarize } from '../ai/client.js';
import { aiLabelText } from '../ai/label.js';

export async function handleSummary(req, res) {
  const { material = '', question = '', tenant = 'anon' } = req.body || {};
  if (!material.trim()) {
    return res.status(400).json({ error: 'material is required' });
  }
  const result = await summarize(material, question, tenant);
  return res.json({
    data: result.text,
    meta: result.meta,
    label: aiLabelText(),
  });
}
