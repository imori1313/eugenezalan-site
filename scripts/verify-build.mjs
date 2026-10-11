import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const dist=path.resolve('dist');
async function walk(dir){let all=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);all.push(...(e.isDirectory()?await walk(p):[p]));}return all;}
const files=await walk(dist),htmls=files.filter(f=>f.endsWith('.html'));
const allTitles=new Set(),summaries=[];
for(const file of htmls){
 const s=await fs.readFile(file,'utf8');const route=path.relative(dist,file).replaceAll('\\','/');
 assert.equal((s.match(/<h1\b/g)||[]).length,1,`One H1: ${route}`);
 const title=s.match(/<title>(.*?)<\/title>/s)?.[1];assert(title&&title.length>10,`Title: ${route}`);assert(!allTitles.has(title),`Unique title: ${route}`);allTitles.add(title);
 assert(/<meta name="description" content="[^"]{30,}"/.test(s),`Description: ${route}`);
 assert(s.includes('https://wa.me/447709252900?text='),`WhatsApp on ${route}`);
 const isPiece=route.startsWith('projects/')&&route!=='projects/index.html';
 const pieceName=isPiece?title.split(' — ')[0]:'';
 const message=pieceName?`Hi Eugene, I’m interested in commissioning ${pieceName}. Could we discuss the price, finishes and delivery?`:'Hi Eugene, I’m interested in discussing a bespoke furniture commission.';
 assert(s.includes(encodeURIComponent(message)),`Contextual WhatsApp message: ${route}`);
 if(isPiece){
  assert(s.includes(encodeURIComponent(`${pieceName} — commission enquiry`)),`Contextual email subject: ${route}`);
  assert(s.includes('3–6 weeks')&&s.includes('50% deposit'),`Commission terms: ${route}`);
  assert(s.includes('Design visualisations'),`Image disclosure: ${route}`);
  assert.equal((s.match(/href="https:\/\/wa.me\//g)||[]).length,1,`Single direct WhatsApp CTA: ${route}`);
  assert(!s.includes('/contact?piece='),`No contact detour: ${route}`);
  assert(!s.includes('Discuss materials and finishes'),`Materials are explained in place: ${route}`);
  const expectedPrice={'projects/ruyi/index.html':'£5,900','projects/gisluotis/index.html':'£5,200','projects/moon-buffet/index.html':'£9,500','projects/dark-blue/index.html':'£7,000','projects/la-clavelina/index.html':'£9,000','projects/sherwood/index.html':'£7,800'}[route];
  if(expectedPrice) assert(s.includes(expectedPrice),`Approved price: ${route}`);
 }
 for(const match of s.matchAll(/\b(?:href|src|poster)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const url=match[1];if(url.startsWith('//'))continue;const rel=decodeURIComponent(url.slice(1));
  const targets=[path.join(dist,rel),path.join(dist,rel,'index.html'),path.join(dist,rel+'.html')];
  assert((await Promise.all(targets.map(p=>fs.stat(p).then(x=>x.isFile()).catch(()=>false)))).some(Boolean),`Local reference ${url} in ${route}`);
 }
 for(const m of s.matchAll(/<img\b[^>]*>/g))assert(/alt="[^"]+"/.test(m[0]) || m[0].includes('data-lightbox-image'),`Image alt: ${route}`);
 summaries.push(route);
}
assert.equal(htmls.length,14,'Home + collection + 7 projects + about + commission + contact + privacy + 404');
const home=await fs.readFile(path.join(dist,'index.html'),'utf8');
assert(home.includes('data-responsive-video')&&home.includes('autoplay')&&home.includes('playsinline'),'Homepage autoplay video');
const project=await fs.readFile(path.join(dist,'projects/ruyi/index.html'),'utf8');assert(project.includes('data-gallery')&&project.includes('gallery-dialog'),'Project fullscreen gallery');
const contact=await fs.readFile(path.join(dist,'contact/index.html'),'utf8');assert(!contact.includes('<form')&&contact.includes('mailto:imori@europe.com'),'Direct email contact without enquiry form');
assert(contact.includes('data-contact-page')&&contact.includes('data-enquiry-context'),'Contact page preserves a selected piece');
console.log(`Verified ${htmls.length} pages: local links/media, unique SEO titles, headings, image descriptions, WhatsApp and enquiry/gallery structure.`);
await fs.writeFile('audit/build-verification.json',JSON.stringify({checkedAt:new Date().toISOString(),pages:summaries,result:'passed',scope:'Static output and local asset references; no external message was sent.'},null,2));
