import {measurementId,siteBase} from './site-config.mjs';
const preferenceKey='less-trouble-office:analytics';
let enabled=false, initialized=false;
const production=location.hostname==='anson821012.github.io';
function preference(){try{return localStorage.getItem(preferenceKey);}catch{return null;}}
function cleanReferrer(){try{const url=new URL(document.referrer);return url.origin+(url.origin===location.origin?url.pathname:'/');}catch{return '';}}
function cleanLocation(){return location.origin+location.pathname;}
function start(){
  if(!production||!/^G-[A-Z0-9]+$/.test(measurementId))return;
  enabled=true;window['ga-disable-'+measurementId]=false;
  if(initialized){window.gtag('consent','update',{analytics_storage:'granted'});return;}
  initialized=true;window.dataLayer=window.dataLayer||[];
  window.gtag=function(){window.dataLayer.push(arguments);};
  window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  window.gtag('js',new Date());
  window.gtag('config',measurementId,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanLocation(),page_referrer:cleanReferrer()});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;document.head.append(script);
  track('page_view');
}
const allowed=new Set(['page_view','contact_click','inquiry_start','generate_lead','share','article_like','comment_submit']);
export function track(event,params={}){
  if(!enabled||!allowed.has(event)||!window.gtag)return;
  const safe={page_location:cleanLocation(),page_referrer:cleanReferrer(),page_title:document.title};
  // Deliberate allowlist: never send form input, email, full outbound URLs or browser IDs.
  for(const key of ['method','content_type','item_id','contact_method'])if(typeof params[key]==='string'&&/^[a-z0-9_-]{1,100}$/i.test(params[key]))safe[key]=params[key];
  window.gtag('event',event,safe);
}
function choose(value){
  try{localStorage.setItem(preferenceKey,value);}catch{}
  if(value==='yes')start();else{
    enabled=false;window['ga-disable-'+measurementId]=true;
    window.gtag?.('consent','update',{analytics_storage:'denied'});
    document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(n=>/^_ga(?:_|$)/.test(n)).forEach(n=>{
      for(const domain of ['',`; domain=${location.hostname}`])document.cookie=`${n}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
    });
  }
  panel.hidden=true;
}
const panel=document.createElement('section');panel.className='analytics-choice';panel.setAttribute('aria-label','網站分析選擇');
panel.innerHTML='<p><strong>幫我把網站整理得更好。</strong><br>同意後會使用 GA4 了解瀏覽與詢問成效。不同意也能使用全部功能。</p><div><button type="button" data-consent="yes">同意分析</button><button type="button" data-consent="no">先不要</button><a href="'+siteBase+'privacy/">資料使用說明</a></div>';
document.body.append(panel);panel.hidden=preference()!==null;
panel.addEventListener('click',e=>{const button=e.target.closest('[data-consent]');if(button)choose(button.dataset.consent);});
const settings=document.createElement('button');settings.type='button';settings.className='analytics-settings';settings.textContent='資料與分析設定';
settings.addEventListener('click',()=>{panel.hidden=false;panel.querySelector('button').focus();});
(document.querySelector('footer')||document.body).append(settings);
if(preference()==='yes')start();
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a)return;
  let method='';try{const u=new URL(a.href);if(u.protocol==='mailto:')method='email';else if(u.hostname==='line.me')method='line';else if(u.hostname==='www.instagram.com')method='instagram';else if(u.hostname==='docs.google.com'&&u.pathname.includes('/forms/'))method='google_form';}catch{}
  if(method)track('contact_click',{contact_method:method});
});
