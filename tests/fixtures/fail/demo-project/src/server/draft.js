// 客服答复初稿接口：模型直接起草，前端放进输入框。
import { draftReply } from '../ai/client.js';

export async function handleDraft(req, res) {
  const { material = '', tone = '正式' } = req.body || {};
  const aiText = await draftReply(material, tone);
  return res.send(aiText);
}
