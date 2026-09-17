import {track} from './analytics.mjs';
import {request,readArticle,errorText} from './engagement-api.mjs';
const section=document.querySelector('#article-engagement');
if(section){
  const article=JSON.parse(document.querySelector('#article-share-data').textContent);
  const dialog=document.querySelector('#share-dialog'),status=document.querySelector('#share-status'),publicStatus=document.querySelector('#interaction-status');
  let opener,cardFile,liked=false,commentRequest=crypto.randomUUID();
  const shareEvent=method=>track('share',{method,content_type:'article',item_id:article.slug});
  document.querySelectorAll('[data-open-share]').forEach(button=>button.addEventListener('click',()=>{opener=button;dialog.showModal();}));
  dialog.querySelector('[data-close-share]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>opener?.focus());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const linkField=document.querySelector('#share-link');linkField.value=article.url;
  async function copy(){try{await navigator.clipboard.writeText(article.url);status.textContent='連結已複製，貼給想分享的人吧。';shareEvent('copy_link');}catch{linkField.focus();linkField.select();status.textContent='請長按或使用鍵盤複製這段連結。';}}
  document.querySelector('#copy-article').addEventListener('click',copy);
  document.querySelector('#native-share').addEventListener('click',async()=>{
    if(!navigator.share){await copy();return;}
    try{await navigator.share({title:article.title,text:article.title+'｜蔡鈞佑 Anson Tsai',url:article.url});shareEvent('system_share');status.textContent='已開啟系統分享；請在選擇的 App 完成傳送。';}catch(error){if(error.name!=='AbortError')status.textContent='這個裝置暫時無法分享，請使用複製連結。';}
  });
  const threads=document.querySelector('#threads-share');
  const threadsURL=new URL('https://www.threads.com/intent/post');threadsURL.searchParams.set('text',article.title+'\n\n蔡鈞佑 Anson Tsai｜麻煩整理所\n'+article.url);threads.href=threadsURL.href;
  threads.addEventListener('click',()=>shareEvent('threads_open'));
  const cardStatus=document.querySelector('#story-status'),shareCard=document.querySelector('#share-story'),download=document.querySelector('#download-story');
  async function prepareCard(){
    try{
      const img=new Image();img.src=new URL('assets/office-friends-960.webp',import.meta.url).href;await img.decode();
      const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;const ctx=canvas.getContext('2d');
      ctx.fillStyle='#faf6ed';ctx.fillRect(0,0,1080,1920);
      ctx.fillStyle='#315b50';ctx.font='600 34px sans-serif';ctx.fillText('THE LESS TROUBLE OFFICE',80,128);
      ctx.fillStyle='#20362f';ctx.font='700 46px sans-serif';ctx.fillText('麻煩整理所・整理筆記',80,204);
      ctx.save();ctx.beginPath();ctx.roundRect(55,270,970,650,40);ctx.clip();ctx.drawImage(img,0,0,img.width,img.height,55,270,970,650);ctx.restore();
      ctx.fillStyle='#20362f';ctx.font='700 67px sans-serif';const lines=[];let line='';
      for(const char of article.title){if(ctx.measureText(line+char).width>900){lines.push(line);line=char;}else line+=char;}if(line)lines.push(line);
      lines.slice(0,5).forEach((text,i)=>ctx.fillText(text,80,1060+i*96));
      ctx.font='500 38px sans-serif';ctx.fillText('把麻煩的事，一件一件整理好。',80,1620);
      ctx.font='600 38px sans-serif';ctx.fillText('蔡鈞佑 Anson Tsai',80,1710);ctx.font='30px sans-serif';ctx.fillText('anson821012.github.io',80,1765);
      ctx.fillStyle='#6a7971';ctx.font='28px sans-serif';ctx.fillText('閱讀全文・分享時加上文章連結貼紙',80,1830);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error();
      cardFile=new File([blob],article.slug+'-story.png',{type:'image/png'});
      document.querySelector('#story-preview').src=URL.createObjectURL(blob);
      download.href=URL.createObjectURL(blob);download.download=cardFile.name;download.hidden=false;
      shareCard.disabled=false;cardStatus.textContent='直式分享卡已準備好。請先複製文章連結，再到 IG 加上「連結」貼紙。';
    }catch{cardStatus.textContent='分享卡暫時無法載入，仍可使用上方的複製連結。';}
  }
  let preparing=false;
  document.querySelector('#prepare-story').addEventListener('click',()=>{document.querySelector('#story-panel').hidden=false;if(!preparing){preparing=true;prepareCard();}});
  shareCard.addEventListener('click',async()=>{
    if(!cardFile)return;
    if(!navigator.canShare?.({files:[cardFile]})){cardStatus.textContent='這個瀏覽器不支援圖片分享。請下載分享卡，開啟 IG 限時動態後選取圖片。';return;}
    try{await navigator.share({files:[cardFile]});shareEvent('story_system_share');cardStatus.textContent='請在手機分享選單選擇 IG（若有提供），並在限動加上文章連結貼紙。';}catch(error){if(error.name!=='AbortError')cardStatus.textContent='請改用「下載分享卡」，再到 IG 選取圖片。';}
  });
  download.addEventListener('click',()=>shareEvent('story_download'));
  const heart=document.querySelector('#article-heart');
  if(heart){
  function render(data){
    liked=data.liked===true;heart.setAttribute('aria-pressed',String(liked));heart.querySelector('span').textContent=(liked?'已喜歡':'喜歡')+' · '+data.hearts;
    const list=document.querySelector('#public-comments');list.replaceChildren();
    if(!data.comments.length){const p=document.createElement('p');p.textContent='還沒有公開留言。你的日常裡，也有類似的情況嗎？';list.append(p);}
    data.comments.forEach(comment=>{const item=document.createElement('article'),name=document.createElement('strong'),date=document.createElement('time'),text=document.createElement('p');name.textContent=comment.name;date.textContent=comment.date;date.dateTime=comment.date;text.textContent=comment.text;item.append(name,date,text);list.append(item);});
  }
  const load=()=>readArticle(article.slug).then(data=>{render(data);publicStatus.textContent='';heart.disabled=false;}).catch(()=>{publicStatus.textContent='互動資料暫時讀取不到，請稍後重試。';heart.disabled=true;});
  document.querySelector('#reload-comments').addEventListener('click',load);load();
  heart.addEventListener('click',async()=>{
    heart.disabled=true;try{const next=!liked,data=await request({action:'heart',article:article.slug,liked:next,request:crypto.randomUUID()});render(data);publicStatus.textContent=next?'謝謝你的喜歡，已記下來了。':'已收回喜歡。';if(next)track('article_like',{item_id:article.slug});}catch(error){publicStatus.textContent=errorText(error);}finally{heart.disabled=false;}
  });
  const commentForm=document.querySelector('#comment-form'),commentStatus=document.querySelector('#comment-status');
  commentForm.addEventListener('submit',async e=>{
    e.preventDefault();if(!commentForm.reportValidity())return;const button=commentForm.querySelector('[type=submit]');if(button.disabled)return;button.disabled=true;commentStatus.textContent='正在送出…';
    const form=new FormData(commentForm);
    try{await request({action:'comment',article:article.slug,request:commentRequest,name:form.get('name'),message:form.get('message'),website:form.get('website')});commentForm.reset();commentRequest=crypto.randomUUID();commentStatus.textContent='留言已收到，謝謝你願意分享。Anson 看過後才會公開。';track('comment_submit',{item_id:article.slug});}catch(error){commentStatus.textContent=errorText(error);}finally{button.disabled=false;}
  });
}
}
