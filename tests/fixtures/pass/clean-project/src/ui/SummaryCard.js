// 摘要卡片组件。标识文案必须渲染出来，不能只在接口里返回。
import { fetchJSON } from '../lib/http.js';

export function mountSummaryCard(el, material, question) {
  el.innerHTML = '<div class="card-loading">正在整理材料…</div>';
  fetchJSON('/api/summary', { method: 'POST', body: { material, question } })
    .then((resp) => {
      const text = resp.data;
      el.innerHTML = `
        <article class="summary-card">
          <h3>文章摘要</h3>
          <p class="ai-label">${resp.label}</p>
          <p>${text}</p>
        </article>
      `;
    })
    .catch(() => {
      el.innerHTML = '<div class="card-error">摘要生成失败，请稍后重试</div>';
    });
}
