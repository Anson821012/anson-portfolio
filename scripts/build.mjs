import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {renderSearch,renderContent} from '../growth-view.mjs';
import {buildSearchPages} from './search-pages.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dest = path.resolve(process.argv[2] || path.join(root,'_site'));
await mkdir(path.join(dest,'data'),{recursive:true});
for (const name of ['search','content']) {
  try { await readFile(path.join(dest,`data/${name}.json`)); }
  catch { await copyFile(path.join(root,`data/${name}.json`),path.join(dest,`data/${name}.json`)); }
}
const search = JSON.parse(await readFile(path.join(dest,'data/search.json'),'utf8'));
const content = JSON.parse(await readFile(path.join(dest,'data/content.json'),'utf8'));
let html = await readFile(path.join(root,'index.html'),'utf8');
const fragments = {...renderSearch(search),content:renderContent(content)};
for (const [name,value] of Object.entries(fragments)) {
  const pattern = new RegExp(`<!-- live:${name}:start -->[\\s\\S]*?<!-- live:${name}:end -->`);
  if (!pattern.test(html)) throw new Error(`Missing marker: ${name}`);
  html = html.replace(pattern,()=>`<!-- live:${name}:start -->${value}<!-- live:${name}:end -->`);
}
const searchReady = await buildSearchPages({root,dest,html,review:process.argv.includes('--review')});
await writeFile(path.join(dest,'index.html'),searchReady.html);
// Explicit public allowlist: credentials, source tools and raw reports never enter the artifact.
for (const file of ['styles.css','expanded.css','growth.css','friends.css','content-pages.css','content-pages.js','consultation.js','consultation-state.mjs','catalogue.js','portfolio.js','navigation.js','app.js','growth-view.mjs','live.mjs','office.svg','favicon.svg','favicon-robot-96.png','apple-touch-icon.png','anson.JPG']) await copyFile(path.join(root,file),path.join(dest,file));
await mkdir(path.join(dest,'assets'),{recursive:true});
for (const width of [480,800]) await copyFile(path.join(root,`assets/anson-${width}.webp`),path.join(dest,`assets/anson-${width}.webp`));
await copyFile(path.join(root,'assets/share-robot-20260917.jpg'),path.join(dest,'assets/share-robot-20260917.jpg'));
for (const scene of ['office-friends','planning-together']) {
  for (const width of [640,960,1536]) {
    const file = `assets/${scene}-${width}.webp`;
    await copyFile(path.join(root,file),path.join(dest,file));
  }
}
await writeFile(path.join(dest,'.nojekyll'),'');
console.log('Built public site at '+dest);
