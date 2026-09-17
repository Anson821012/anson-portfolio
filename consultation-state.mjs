export const storageKey = 'less-trouble-office:list:v2';
export const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSelxzPzsJZ0sZ9crRcECPsh6I87YubqpcSOWlWGksKk59ig_g/viewform';
export const formEntry = 'entry.1572194397';
export function normalizeSelection(value, catalogue) {
  const valid = new Set(catalogue.map(s=>s.id));
  return {ids:[...new Set(Array.isArray(value?.ids)?value.ids:[])].filter(id=>valid.has(id)),note:typeof value?.note==='string'?value.note.slice(0,2000):''};
}
export function readSelection(storage, catalogue) {
  try {return normalizeSelection(JSON.parse(storage.getItem(storageKey)||'{}'),catalogue);} catch {return normalizeSelection({},catalogue);}
}
export function inquirySummary(state,catalogue,offer='') {
  const names=state.ids.map(id=>catalogue.find(s=>s.id===id)?.name).filter(Boolean);
  return [offer?`想聊的方向：${offer}`:'',names.length?`我的簡化清單：\n${names.map(n=>'・'+n).join('\n')}`:'目前沒有選定服務，想先聊聊現況。',state.note?`補充：\n${state.note}`:'','來源：麻煩整理所網站合作詢問'].filter(Boolean).join('\n\n');
}
export function inquiryURL(summary,embedded=false) {
  const url=new URL(formURL);
  url.searchParams.set('usp','pp_url');
  url.searchParams.set(formEntry,summary);
  if(embedded)url.searchParams.set('embedded','true');
  return url.href;
}
// Keep long Chinese notes out of oversized URLs; the page provides an explicit copy fallback.
export function formPreparation(summary) {
  const needsPaste=inquiryURL(summary,true).length>7000;
  const prefill=needsPaste?'清單較長，請將網站提供的「完整詢問內容」貼到這裡。':summary;
  return {needsPaste,summary,url:inquiryURL(prefill),embeddedURL:inquiryURL(prefill,true)};
}
