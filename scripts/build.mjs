import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {renderSearch,renderContent} from '../growth-view.mjs';

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
await writeFile(path.join(dest,'index.html'),html);
// Explicit public allowlist: credentials, source tools and raw reports never enter the artifact.
for (const file of ['styles.css','expanded.css','growth.css','catalogue.js','portfolio.js','app.js','growth-view.mjs','live.mjs','office.svg','favicon.svg','anson.JPG']) await copyFile(path.join(root,file),path.join(dest,file));
await writeFile(path.join(dest,'.nojekyll'),'');
console.log('Built public site at '+dest);
