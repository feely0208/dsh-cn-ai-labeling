// 本地笔记：解析 Markdown 并渲染目录。全程不调用任何模型。
import { marked } from 'marked';
import { readFileSync } from 'node:fs';

export function renderNote(path) {
  const raw = readFileSync(path, 'utf-8');
  return marked.parse(raw);
}

/** 由标题层级自动生成目录 */
export function buildToc(markdown) {
  const toc = [];
  for (const line of markdown.split('\n')) {
    const m = /^(#{1,3})\s+(.*)$/.exec(line);
    if (!m) continue;
    toc.push({ level: m[1].length, text: m[2].trim() });
  }
  return toc;
}
