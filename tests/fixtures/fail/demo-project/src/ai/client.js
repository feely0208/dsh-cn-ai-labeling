// 统一的模型客户端。所有生成走这里，方便换模型。
import OpenAI from 'openai';

export const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/** 依据材料生成一段摘要 */
export async function summarize(material, question) {
  const res = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: '你是文档助手，请用中文给出简明摘要。' },
      { role: 'user', content: `材料：${material}\n问题：${question}` },
    ],
    temperature: 0.3,
  });
  return res.choices[0].message.content.trim();
}

/** 生成一段答复草稿 */
export async function draftReply(material, tone = '正式') {
  const res = await ai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: `请用${tone}的语气起草答复。` },
      { role: 'user', content: material },
    ],
  });
  return res.choices[0].message.content.trim();
}
