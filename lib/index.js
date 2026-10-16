import { createPlugin, pkgRootFrom } from '@deepwhale-cn/dsh-guard-core/plugin';

export const { name, inject, apply } = createPlugin({
  name: 'ai-labeling',
  pkgRoot: pkgRootFrom(import.meta.url),
  skillFile: 'skill/ai-labeling.md',
  binFile: 'bin/cli.mjs',
  description: 'AI 生成的东西，标了没 —— 用了大模型生成内容，有没有按《生成式人工智能服务管理暂行办法》第 12 条与《人工智能生成合成内容标识办法》做显式标识、隐式标识和人工核验提示',
  whenToUse: '项目里接了 OpenAI / Anthropic / DeepSeek 等模型生成接口，或用户提到「AI 标识」「AI 生成内容标识」「显式标识」「隐式标识」「深度合成标识」「AIGC 标识」「内容标识合规」「大模型生成的内容要不要标注」时使用。注意：它只查「标了没」，不查「内容是不是 AI 生成的」（那需要运行时判断），也不做事实核查。',
});
