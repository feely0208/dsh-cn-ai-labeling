// 统一的模型客户端。所有生成走这里，方便换模型。
import OpenAI from 'openai';
import { AI_LABEL, AI_REVIEW_HINT } from './label.js';

export const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/** 隐式标识：与生成结果一起落库/落盘（《人工智能生成合成内容标识办法》第 5 条） */
function buildMeta(tenantId) {
  return {
    generated_by: 'AI',
    ai_generated: true,
    model_name: DEFAULT_MODEL,
    service_provider: 'deepwhale',
    content_id: `${tenantId}-${Date.now().toString(36)}`,
  };
}

/** 依据材料生成一段摘要，正文与标识元数据一起返回 */
export async function summarize(material, question, tenantId) {
  const res = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: '你是文档助手，请用中文给出简明摘要。' },
      { role: 'user', content: `材料：${material}\n问题：${question}` },
    ],
    temperature: 0.3,
  });
  return {
    text: res.choices[0].message.content.trim(),
    meta: buildMeta(tenantId),
    label: `${AI_LABEL}，${AI_REVIEW_HINT}`,
  };
}
