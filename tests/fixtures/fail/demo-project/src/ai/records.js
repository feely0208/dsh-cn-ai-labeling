// 把摘要落成给下游消费的结构化记录。
import { summarize } from '../ai/client.js';

export async function buildRecord(material, question, tenantId) {
  const aiSummary = await summarize(material, question);
  return {
    tenant: tenantId,
    title: question.slice(0, 60),
    body: aiSummary,
    createdAt: new Date().toISOString(),
  };
}

/** 批量：给一批材料各出一份摘要 */
export async function buildRecords(items, tenantId) {
  const records = [];
  for (const it of items) {
    records.push(await buildRecord(it.material, it.question, tenantId));
  }
  return records;
}
