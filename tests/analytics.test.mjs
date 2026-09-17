import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const code=readFileSync(new URL('../analytics.mjs',import.meta.url),'utf8').replace(/^import[^\n]+\n/,'').replace('export function track','function track');
function analytics(preference){
  const appended=[],storage=new Map(preference?[['less-trouble-office:analytics',preference]]:[]);
  const element=()=>({setAttribute(){},querySelector:()=>({focus(){}}),addEventListener(){},append(){}});
  const context=vm.createContext({measurementId:'G-EXAMPLE',siteBase:'https://anson821012.github.io/anson-portfolio/',URL,Set,window:{},location:{hostname:'anson821012.github.io',origin:'https://anson821012.github.io',pathname:'/anson-portfolio/contact/',search:'?email=private@example.com',hash:'#private'},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{title:'合作詢問',referrer:'https://www.google.com/search?q=private@example.com',cookie:'',createElement:element,head:{append:e=>appended.push(e)},body:element(),querySelector:element,addEventListener(){}}});
  vm.runInContext(code,context);return {context,appended};
}
test('GA4 does not load before consent or after declining',()=>{
  for(const consent of [null,'no']){const a=analytics(consent);assert.equal(a.appended.length,0);a.context.track('generate_lead');assert.equal(a.context.window.dataLayer,undefined);}
});
test('consented GA4 removes query and referrer data and ignores form fields',()=>{
  const a=analytics('yes');assert.equal(a.appended.length,1);
  a.context.track('generate_lead',{method:'website_form',email:'private@example.com',message:'secret',name:'private',visitor:'private'});
  const events=a.context.window.dataLayer.map(args=>Array.from(args));
  const lead=events.find(e=>e[1]==='generate_lead')[2];
  assert.equal(lead.page_location,'https://anson821012.github.io/anson-portfolio/contact/');assert.equal(lead.page_referrer,'https://www.google.com/');assert.equal(lead.method,'website_form');assert.equal(lead.email,undefined);assert.ok(!JSON.stringify(events).includes('private@example.com'));
});
test('withdrawing and restoring consent changes state without double pageview',()=>{
  const a=analytics('yes');a.context.choose('no');const before=a.context.window.dataLayer.length;a.context.track('generate_lead');assert.equal(a.context.window.dataLayer.length,before);
  a.context.choose('yes');a.context.track('contact_click',{contact_method:'email'});assert.equal(a.appended.length,1);assert.equal(a.context.window['ga-disable-G-EXAMPLE'],false);
  assert.equal(a.context.window.dataLayer.filter(args=>args[1]==='page_view').length,1);
});
