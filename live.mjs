import {renderSearch, renderContent} from './growth-view.mjs';

async function load(name, render) {
  try {
    const response = await fetch(new URL(`data/${name}.json`,import.meta.url), {cache:'no-store',signal:AbortSignal.timeout(15000)});
    if (!response.ok) throw new Error('Data unavailable');
    render(await response.json());
  } catch {
    // Retain the dated, pre-rendered snapshot if the connection is unavailable.
    const note = document.querySelector(`#${name}-connection-note`);
    if (note) note.textContent = '目前無法重新確認更新，先顯示頁面上的已核對資料。';
  }
}

function refresh() {
  if (document.hidden) return;
  load('search', data => {
    const fragments = renderSearch(data);
    for (const [key,value] of Object.entries(fragments)) document.getElementById(`search-${key}`).innerHTML = value;
    document.getElementById('search-connection-note').textContent = '';
  });
  load('content', data => {
    document.getElementById('latest-content').innerHTML = renderContent(data);
    document.getElementById('content-connection-note').textContent = '';
  });
}
refresh();
setInterval(refresh, 5 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
