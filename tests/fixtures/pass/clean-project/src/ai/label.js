// 全站统一的 AI 生成内容标识文案。所有输出链路都引用这里，不要各写一份。
export const AI_LABEL = '本内容由 AI 生成';
export const AI_REVIEW_HINT = '仅供参考，请以人工核验结果为准';

/** 显式标识：给用户看的那行字 */
export function aiLabelText() {
  return `${AI_LABEL}，${AI_REVIEW_HINT}`;
}
