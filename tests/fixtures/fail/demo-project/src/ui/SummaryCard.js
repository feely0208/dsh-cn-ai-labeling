// 摘要卡片组件。这里直接把接口返回的正文渲染出来。
import { fetchJSON } from '../lib/http.js';

export function mountSummaryCard(el, material, question) {
  el.innerHTML = '<div class="card-loading">正在整理材料…</div>';
  fetchJSON('/api/summary', { method: 'POST', body: { material, question } })
    .then((resp) => {
      const text = resp.result.data;
      el.innerHTML = `
        <article class="summary-card">
          <h3>文章摘要</h3>
          <p>${text}</p>
        </article>
      `;
    })
    .catch(() => {
      el.innerHTML = '<div class="card-error">摘要生成失败，请稍后重试</div>';
    });
}
