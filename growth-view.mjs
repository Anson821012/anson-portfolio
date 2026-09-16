const fmt = new Intl.NumberFormat('zh-TW');
const n = value => fmt.format(value);
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const day = value => esc(value.replaceAll('-', '/'));
const percent = (value, places = 1) => `${(value * 100).toFixed(places)}%`;
const stamp = value => value ? new Intl.DateTimeFormat('zh-TW', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit', ...(value.includes('T') ? {hour:'2-digit',minute:'2-digit'} : {})}).format(new Date(value)) : '尚未完成';

export function monthsFor(daily) {
  const groups = new Map();
  for (const row of daily) {
    const key = row.date.slice(0, 7);
    if (!groups.has(key)) groups.set(key, {month:key,days:0,clicks:0,impressions:0,start:row.date,end:row.date});
    const group = groups.get(key);
    group.days++; group.clicks += row.clicks; group.impressions += row.impressions; group.end = row.date;
  }
  return [...groups.values()].map(group => ({...group, average:group.clicks/group.days, full:group.days === new Date(Date.UTC(Number(group.month.slice(0,4)),Number(group.month.slice(5)),0)).getUTCDate()}));
}

function syncNote(data, label) {
  if (data.status === 'awaiting_auth') return `${label}：已核對快照・自動同步待授權`;
  if (data.status === 'error') return `${label}：本次同步未完成，保留上次成功資料（${esc(stamp(data.last_success))}）`;
  const stale = Date.now() - new Date(data.last_success).getTime() > 36 * 3600 * 1000;
  return `${label}：${stale ? '超過 36 小時未同步・' : ''}最近同步 ${esc(stamp(data.last_success))}（台灣時間）`;
}

export function renderSearch(data) {
  if (data.schema !== 1 || data.property !== 'sc-domain:fuyunlovemommy.com' || !data.daily.length) throw new Error('Invalid search data');
  const rows = data.daily, totals = data.totals, months = monthsFor(rows);
  const range = `${day(rows[0].date)}—${day(rows.at(-1).date)}`;
  const coverage = `目前可用 ${rows.length} 天`;
  const sum = key => rows.reduce((acc, row) => acc + row[key], 0);
  if (sum('clicks') !== totals.clicks || sum('impressions') !== totals.impressions) throw new Error('Totals do not match');
  const cards = `<article class="growth-metric"><p>Google 自然搜尋累計點擊</p><strong><span>${n(totals.clicks)}</span> 次</strong><div class="metric-exact">近 12 個月查詢・${coverage}</div><small>實際資料：${range}<br>已完成處理的搜尋資料</small></article><article class="growth-metric"><p>Google 自然搜尋累計曝光</p><strong><span>${totals.impressions >= 10000 ? (totals.impressions/10000).toFixed(2) : n(totals.impressions)}</span> ${totals.impressions >= 10000 ? '萬' : '次'}</strong><div class="metric-exact">精確合計 ${n(totals.impressions)} 次</div><small>與點擊採相同期間<br>平均點閱率 ${percent(totals.ctr)}・平均排序 ${totals.position.toFixed(1)}</small></article>`;
  const ceiling = Math.max(10, Math.ceil(Math.max(...months.map(m => m.average))/10)*10);
  let comparison = '完整月份累積後，才比較月與月的變化。';
  const complete = months.filter(m => m.full);
  if (complete.length >= 2) {
    const [a,b] = complete.slice(-2);
    const next = new Date(`${a.month}-01T00:00:00Z`); next.setUTCMonth(next.getUTCMonth()+1);
    if (next.toISOString().slice(0,7) === b.month && a.clicks > 0) {
      const change = (b.clicks-a.clicks)/a.clicks;
      comparison = `${a.month} → ${b.month}，完整月份點擊${change >= 0 ? '增加' : '減少'} ${percent(Math.abs(change))}`;
    }
  }
  const chart = `<figcaption>有資料的月份，平均每天帶來多少點擊？</figcaption>${months.map((m,i) => `<div class="comparison-row${i === months.length-1 ? ' current' : ''}"><div><span>${esc(m.month)} · ${m.full ? `完整 ${m.days} 天` : `${m.days} 個資料日`}</span><strong>${m.average.toFixed(1)}<small> 次／日</small></strong></div><div class="bar-track" aria-hidden="true"><span style="width:${(m.average/ceiling*100).toFixed(3)}%"></span></div></div>`).join('')}<p>${esc(comparison)}</p><small>日均點擊＝點擊÷有資料的天數；長條均以 0–${ceiling} 次／日為刻度。未回傳的日期不當作零，也不推估整月。<br>資料：Google Search Console，網路搜尋。</small>`;
  const table = (caption, headers, body) => `<div class="metric-table-wrap"><table class="metric-table"><caption>${caption}</caption><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${body.map(row => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const detail = `<p><strong>搜尋：</strong>查詢近 12 個月（${day(data.requested.start)}—${day(data.requested.end)}），只採已完成處理的 Google 網路搜尋資料。實際回傳 ${range}，${coverage}；平台處理資料需要時間，並非即時流量。</p>${table(`${coverage}的整體指標`,['指標','結果'],[['點擊',n(totals.clicks)],['曝光',n(totals.impressions)],['平均點閱率',percent(totals.ctr)],['平均排序',totals.position.toFixed(1)]])}${table('依實際資料天數整理的每月表現',['期間','點擊','曝光','點閱率'],months.map(m=>[`${day(m.start)}—${day(m.end)}`,n(m.clicks),n(m.impressions),percent(m.impressions ? m.clicks/m.impressions : 0,2)]))}<p>每日點擊與曝光加總已與整體指標核對。平均排序使用來源的整體指標；月份點閱率依點擊÷曝光計算。資料不足一年時，不推估全年或計算年增率。</p><p class="source-updated">${syncNote(data,'搜尋')}。業績核對：2026/09/15；業績仍為人工核對快照。搜尋數據僅代表官網 Google 網路搜尋。</p>`;
  return {cards, chart, detail, coverage:`<strong>近一年查詢，清楚標明可用期間。</strong>${range}，${coverage}。<br>${syncNote(data,'搜尋')}`};
}

export function renderContent(data) {
  if (data.schema !== 1 || data.source !== 'https://www.fuyunlovemommy.com') throw new Error('Invalid content source');
  const items = data.items.slice(0,6).filter(item => {
    const url = new URL(item.url);
    return url.origin === data.source && url.pathname.startsWith('/blogs/') && item.credit.includes('蔡鈞佑');
  });
  return `<div class="credit-heading"><h3>最近整理的內容，也留在這裡。</h3><p>自動收錄官網有「蔡鈞佑」編輯、撰文或企劃署名的文章，保留共同參與者的署名。</p></div><p class="source-updated">${syncNote(data,'官網文章')}</p><div class="credit-grid live-articles">${items.length ? items.map(item=>`<a class="credit-card" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"><span>福韻官網 / 署名作品</span><h4>${esc(item.title)}</h4><p>${esc(item.credit)}</p><small>${day(item.published)} · 閱讀原文 ↗</small></a>`).join('') : '<p>署名文章將在第一次成功同步後顯示。</p>'}</div>`;
}
