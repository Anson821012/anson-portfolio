// Private Apps Script project. This file is excluded from the public site build.
// Only the owner runs setup(). Public routes never expose inquiry rows or sheet IDs.
const OWNER_EMAIL = 'yo30437@gmail.com';
const TABLES = {
  Inquiries: ['ID','收到時間','稱呼','Email','想整理的事','服務清單','首次入口','來源網域','送出頁面','狀態','通知','瀏覽器摘要'],
  Comments: ['ID','收到時間','文章','暱稱','留言','審核狀態','瀏覽器摘要'],
  Hearts: ['文章','瀏覽器摘要','喜歡','更新時間']
};
function setup() {
  const properties = PropertiesService.getScriptProperties();
  if (properties.getProperty('DATA_SHEET')) { console.log('管理表：' + book_().getUrl()); return; }
  const book = SpreadsheetApp.create('麻煩整理所｜網站詢問與文章互動');
  const guide = book.getSheets()[0]; guide.setName('使用說明');
  guide.getRange(1,1,9,2).setValues([
    ['麻煩整理所｜私人管理表','只有擁有者可存取；請勿公開整份表格'],
    ['Inquiries','每一列為成功收到的網站詢問；狀態可填新詢問／已回覆／測試／垃圾訊息'],
    ['Comments','留言預設「待審核」。將 F 欄改為「公開」，網站才會顯示；改為「隱藏」即可下架'],
    ['Hearts','每個瀏覽器與每篇文章一列；喜歡為 true 才計入，不代表不重複的真人數'],
    ['Email 通知','寄到 yo30437@gmail.com；通知失敗不影響詢問入庫，請定期檢查此表'],
    ['詢問統計','以 Inquiries 排除「測試／垃圾訊息」為準；GA4 為同意分析且未阻擋追蹤者'],
    ['資料保留','合作評估資料建議一年後檢視清除；留言依公開狀態保存；可由本人來信要求處理'],
    ['測試','網站測試請在稱呼與留言標明「測試」並在狀態欄標示測試'],
    ['Google 表單','備用 Google 表單的回覆仍在原表單中，未併入此表或 GA4 成功事件']
  ]);
  guide.setColumnWidth(1,180); guide.setColumnWidth(2,700); guide.getDataRange().setWrap(true);
  Object.keys(TABLES).forEach(name=>{
    const sheet=book.insertSheet(name), headers=TABLES[name];
    sheet.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#edf4f1');
    sheet.setFrozenRows(1); sheet.setColumnWidths(1,headers.length,170);
  });
  const comments=book.getSheetByName('Comments');
  comments.getRange('F2:F1000').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['待審核','公開','隱藏'],true).build());
  properties.setProperties({DATA_SHEET:book.getId(),VISITOR_SALT:Utilities.getUuid()});
  console.log('管理表：' + book.getUrl());
}
function book_(){const id=PropertiesService.getScriptProperties().getProperty('DATA_SHEET');if(!id)throw Error('unavailable');return SpreadsheetApp.openById(id);}
function rows_(name){const s=book_().getSheetByName(name);return s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,TABLES[name].length).getValues():[];}
function text_(value,max){return String(value||'').trim().slice(0,max);}
function cell_(value){const s=String(value||'');return /^[=+\-@\t\r\n]/.test(s)?"'"+s:s;}
function slug_(value){const s=String(value||'');if(!/^[a-z0-9][a-z0-9-]{2,99}$/.test(s))throw Error('invalid');return s;}
function visitor_(value){if(!/^[a-z0-9-]{24,80}$/i.test(String(value||'')))throw Error('invalid');return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,PropertiesService.getScriptProperties().getProperty('VISITOR_SALT')+value).map(b=>(b+256).toString(16).slice(-2)).join('');}
function path_(value){return /^\/(?:anson-portfolio\/)?(?:[a-z0-9-]+\/)*$/.test(String(value||''))?String(value).slice(0,250):'/';}
function domain_(value){return /^[a-z0-9.-]{1,150}$/i.test(String(value||''))?String(value):'direct';}
function json_(data){return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);}
function publicArticle_(slug,visitor){
  const hearts=rows_('Hearts').filter(r=>r[0]===slug), comments=rows_('Comments').filter(r=>r[2]===slug&&r[5]==='公開').slice(-100);
  return {ok:true,hearts:hearts.filter(r=>r[2]===true).length,liked:hearts.some(r=>r[1]===visitor&&r[2]===true),comments:comments.map(r=>({name:r[3],text:r[4],date:new Date(r[1]).toISOString().slice(0,10)}))};
}
function doGet(e){try {const p=e.parameter||{};if(p.action==='health')return json_({ok:!!PropertiesService.getScriptProperties().getProperty('DATA_SHEET')});return json_(publicArticle_(slug_(p.article),p.visitor?visitor_(p.visitor):''));} catch(error){return json_({ok:false,error:'unavailable'});}}
function doPost(e){
  const lock=LockService.getScriptLock();
  try {
    if(!e.postData||e.postData.contents.length>24000)throw Error('invalid');
    const p=JSON.parse(e.postData.contents);
    if(p.website||!['lead','comment','heart'].includes(p.action))throw Error('invalid');
    const visitor=visitor_(p.visitor), request=text_(p.request,80);
    if(!/^[a-z0-9-]{24,80}$/i.test(request))throw Error('invalid');
    if(!lock.tryLock(15000))throw Error('busy');
    const cache=CacheService.getScriptCache(), rateKey='rate:'+visitor+':'+p.action;
    const now=new Date();
    if(p.action==='lead'){
      const previous=rows_('Inquiries').find(r=>r[0]===request&&r[11]===visitor);
      if(previous)return json_({ok:true,action:'lead',request,duplicate:true});
      const email=text_(p.email,254), name=text_(p.name,60), message=text_(p.message,3000);
      if(!name||message.length<3||!/^\S+@\S+\.\S+$/.test(email))throw Error('invalid');
      limit_(cache,rateKey,3); limit_(cache,'global:lead',100);
      const sheet=book_().getSheetByName('Inquiries');
      sheet.appendRow([request,now,cell_(name),cell_(email),cell_(message),cell_(text_(p.services,8000)),path_(p.entry),domain_(p.referrer),path_(p.page),'新詢問','待通知',visitor]);
      SpreadsheetApp.flush();
      let notified=false;
      try{MailApp.sendEmail({to:OWNER_EMAIL,subject:'麻煩整理所收到一則網站詢問',body:'稱呼：'+name+'\nEmail：'+email+'\n\n'+message+'\n\n服務清單：\n'+text_(p.services,8000)+'\n\n私人管理表：'+book_().getUrl()});notified=true;}catch(error){}
      sheet.getRange(sheet.getLastRow(),11).setValue(notified?'已通知':'通知失敗，請查看管理表');
      return json_({ok:true,action:'lead',request});
    }
    const slug=slug_(p.article);
    if(p.action==='comment'){
      if(rows_('Comments').some(r=>r[0]===request&&r[6]===visitor))return json_({ok:true,action:'comment',request});
      const name=text_(p.name,40), message=text_(p.message,1000);
      if(!name||message.length<2)throw Error('invalid');
      limit_(cache,rateKey,5);limit_(cache,'global:comment',150);
      book_().getSheetByName('Comments').appendRow([request,now,slug,cell_(name),cell_(message),'待審核',visitor]);
      return json_({ok:true,action:'comment',request});
    }
    if(typeof p.liked!=='boolean')throw Error('invalid');
    limit_(cache,rateKey,60);limit_(cache,'global:heart',1500);
    const sheet=book_().getSheetByName('Hearts'), rows=rows_('Hearts'), index=rows.findIndex(r=>r[0]===slug&&r[1]===visitor);
    if(index<0)sheet.appendRow([slug,visitor,p.liked,now]);else sheet.getRange(index+2,3,1,2).setValues([[p.liked,now]]);
    SpreadsheetApp.flush();
    return json_({...publicArticle_(slug,visitor),action:'heart',request});
  }catch(error){return json_({ok:false,error:['invalid','busy','rate_limit'].includes(error.message)?error.message:'unavailable'});}
  finally{if(lock.hasLock())lock.releaseLock();}
}
function limit_(cache,key,max){const n=Number(cache.get(key)||0);if(n>=max)throw Error('rate_limit');cache.put(key,String(n+1),3600);}
