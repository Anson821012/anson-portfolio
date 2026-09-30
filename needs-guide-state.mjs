export const questions = [
  {id:'pain',title:'哪一件事，最近最讓你頭痛？',hint:'挑最常想到的那件就好。不用一次解救全公司。',options:[
    {id:'brand',label:'品牌有在做，卻說不清楚',detail:'介紹、賣點、形象，各說各的。',icon:'✦'},
    {id:'content',label:'內容一直趕，靈感卻下班了',detail:'社群、文章、影片，想好好串起來。',icon:'✎'},
    {id:'handoff',label:'交接一件事，要重講好多次',detail:'SOP、分工與做法，留在某個人腦中。',icon:'↔'},
    {id:'customer',label:'顧客問題，總是回不完',detail:'訊息、介紹與後續追蹤，想接得更順。',icon:'♡'},
    {id:'data',label:'表格和訊息，散得到處都是',detail:'找資料、重抄、核對，花掉不少時間。',icon:'▤'},
    {id:'unsure',label:'每件都麻煩，我還選不出來',detail:'先把事情攤開，一起找起點。',icon:'⌁'},
  ]},
  {id:'method',title:'這件事，現在大多怎麼處理？',hint:'照現況選就好，這裡沒有「應該要很厲害」的答案。',options:[
    {id:'scattered',label:'散在訊息、檔案和表格裡',detail:'做得到，只是每次都要重新找。'},
    {id:'person',label:'主要靠某一位夥伴記得',detail:'人不在，事情就容易等在那裡。'},
    {id:'tools',label:'有工具，但中間還要人工接',detail:'複製、貼上、再確認一次。'},
    {id:'starting',label:'還沒有固定做法',detail:'每次各自想辦法，也還在摸索。'},
  ]},
  {id:'goal',title:'先做到什麼，你會鬆一口氣？',hint:'先選這一輪想完成的程度，後面還能慢慢加。',options:[
    {id:'clarity',label:'先知道，最值得從哪裡開始',detail:'釐清原因、範圍與先後順序。'},
    {id:'small-win',label:'先讓一件日常工作變順',detail:'挑一個小範圍，做出能試用的版本。'},
    {id:'handoff',label:'留下團隊能持續使用的做法',detail:'把規則、範本與維護方式交接清楚。'},
  ]},
];

const routes = {
  brand:{title:'先把品牌想說的話，整理成同一個方向。',audit:'brand-position',first:'value-message',process:'brand-guide',organize:'brand-voice',tools:'social-templates',caseId:'content',step:'先挑一項主力服務，整理它適合誰、解決什麼，以及為什麼值得選。',connection:'看看同一個品牌的專業內容，如何接到文章、節目與不同平台。'},
  content:{title:'讓下一篇內容，有材料也有方法。',audit:'social-audit',first:'social-calendar',process:'content-workflow',organize:'reuse-assets',tools:'content-workflow',caseId:'content',step:'先拿一份既有內容，排出可延伸的主題、發布順序與審稿節點。',connection:'看看一份專業內容，如何拆成各平台適合閱讀的形式。'},
  handoff:{title:'把做法留下來，讓交接少一點猜。',audit:'workflow-audit',first:'sop',process:'role-handoff',organize:'knowledge-base',tools:'task-management',caseId:'tasks',step:'先挑一件常被問的工作，記下誰接手、怎麼做，以及遇到例外找誰。',connection:'看看待辦、優先順序與執行紀錄，如何放進同一個工作入口。'},
  customer:{title:'先把重複的問題，整理成清楚的回應。',audit:'service-blueprint',first:'support-library',process:'sales-handoff',organize:'support-library',tools:'customer-tracking',caseId:'contract',step:'先挑最常被問的幾個問題，整理可使用的回覆、負責窗口與下一步。',connection:'看看簽約後的資訊與服務交接，如何接成顧客看得懂的流程。'},
  data:{title:'讓資料有固定的家，工作少繞一圈。',audit:'workflow-audit',first:'data-classification',process:'document-version',organize:'data-cleanup',tools:'workflow-integration',caseId:'docs',step:'先挑一種每天都要找的資料，確認存放位置、命名方式與誰負責更新。',connection:'看看專業文件如何分類、查閱與更新，讓大家找到同一份資料。'},
  unsure:{title:'先把麻煩攤開，順序才會出現。',audit:'business-audit',first:'workflow-audit',process:'business-goals',organize:'business-audit',tools:'ai-audit',caseId:'menu',step:'先列三件最近常卡住的事，記下牽涉的人、資料與重複發生的地方。',connection:'看看一份每日菜單，如何同時照顧內部更新與顧客查閱。'},
};

export function validAnswers(answers) {
  return questions.every(q=>q.options.some(o=>o.id===answers?.[q.id]));
}
export function answerLabels(answers) {
  return questions.map(q=>q.options.find(o=>o.id===answers?.[q.id])?.label || '');
}
export function guideSummary(answers) {
  if (!validAnswers(answers)) return '';
  const [pain,method,goal]=answerLabels(answers);
  return `我的整理方向\n想處理：${pain}\n目前做法：${method}\n希望先做到：${goal}`;
}
export function recommend(answers, catalogue) {
  if (!validAnswers(answers)) return null;
  const route=routes[answers.pain];
  const first=answers.goal==='clarity' ? route.audit : answers.goal==='handoff' ? route.process : route.first;
  const support={scattered:route.organize,person:route.process,tools:route.tools,starting:route.audit}[answers.method];
  const ids=[...new Set([first,support,route.first,route.process,route.audit])].filter(id=>catalogue.some(s=>s.id===id)).slice(0,2);
  const reasons={
    clarity:'你想先知道改善順序，這項可以先釐清方向與範圍。',
    'small-win':'你想先讓一件事變順，這項適合拿小範圍開始討論。',
    handoff:'你希望團隊能接得下去，這項著重共同做法與交接。',
  };
  const supportReasons={scattered:'目前資料比較分散，可以一起整理共用的內容與依據。',person:'目前較依賴個人記憶，可以把做法留下來，方便接手。',tools:'目前工具之間還要人工接，可以一起確認流程如何銜接。',starting:'目前還沒有固定做法，可以先建立共同方向，再決定怎麼做。'};
  return {...route,services:ids.map((id,i)=>({...catalogue.find(s=>s.id===id),reason:i===0 ? reasons[answers.goal] : supportReasons[answers.method]})),summary:guideSummary(answers)};
}

// Adding guide choices is an additive action, never a replacement of a visitor's list.
export function mergeSelectionIds(existing, incoming, validIds) {
  const valid=new Set(validIds);
  return [...new Set([...existing,...incoming])].filter(id=>valid.has(id));
}
