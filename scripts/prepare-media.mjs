import fs from 'node:fs/promises';
import path from 'node:path';
import {spawn} from 'node:child_process';
import sharp from 'sharp';

const root=process.cwd();
const inventory=JSON.parse(await fs.readFile('audit/asset-inventory.json','utf8'));
const images=inventory.assets.filter(a=>a.path.startsWith('public/images/')&&a.extension!=='.svg');
const seen=new Set();
for(const asset of images){
  const key=asset.path.replace('public/images/','').replace(/\.[^.]+$/,'');
  if(seen.has(key))continue;seen.add(key);
  for(const width of [640,1200,2000]){
    const out=path.join(root,'public/media',`${key}-${width}.webp`);
    if(await fs.stat(out).then(s=>s.size>0).catch(()=>false))continue;
    await fs.mkdir(path.dirname(out),{recursive:true});
    // Never upscale a small public source; srcset descriptors use true widths below.
    await sharp(asset.path).rotate().resize({width,withoutEnlargement:true}).webp({quality:87,effort:5}).toFile(out);
  }
}
console.log(`Prepared ${seen.size} responsive image sets.`);
const ffmpeg=path.join(root,'node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe');
function run(args){return new Promise((resolve,reject)=>{const p=spawn(ffmpeg,['-y','-hide_banner','-loglevel','error',...args],{windowsHide:true});p.stderr.on('data',d=>process.stderr.write(d));p.on('error',reject);p.on('close',code=>code===0?resolve():reject(new Error(`ffmpeg exited ${code}`)));});}
await run(['-ss','5','-i','public/videos/hero-original.mp4','-frames:v','1','-vf','scale=1920:-2','public/media/hero-poster.jpg']);
await sharp('public/media/hero-poster.jpg').webp({quality:88}).toFile('public/media/hero-poster.webp');
for(const [name,width,rate,maxrate] of [['desktop',1920,'3800k','5000k']]){
  console.log(`Preparing hero ${name}…`);
  await run(['-i','public/videos/hero-original.mp4','-c:a','aac','-b:a','128k','-vf',`scale=${width}:-2`,'-c:v','libx264','-preset','fast','-crf','22','-maxrate',maxrate,'-bufsize',rate,'-pix_fmt','yuv420p','-movflags','+faststart',`public/videos/hero-${name}.mp4`]);
}
// The phone film is a separate portrait edit; never derive it from the desktop cut.
await run(['-i','public/videos/hero-mobile-original.mp4','-map','0:v:0','-map','0:a:0','-vf','scale=720:1280,setsar=1','-c:v','libx264','-preset','slow','-crf','23','-maxrate','2400k','-bufsize','4800k','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart','public/videos/hero-mobile-portrait.mp4']);
await run(['-ss','5','-i','public/videos/hero-mobile-original.mp4','-frames:v','1','-vf','scale=720:1280','public/media/hero-mobile-poster.jpg']);
await sharp('public/media/hero-mobile-poster.jpg').webp({quality:85}).toFile('public/media/hero-mobile-poster.webp');
await run(['-i','public/videos/craft-original.mp4','-an','-vf','scale=1280:-2','-c:v','libx264','-preset','fast','-crf','23','-maxrate','2000k','-bufsize','3000k','-pix_fmt','yuv420p','-movflags','+faststart','public/videos/craft-web.mp4']);
const sizes={};for(const name of ['hero-desktop.mp4','hero-mobile-portrait.mp4','craft-web.mp4'])sizes[name]=(await fs.stat(`public/videos/${name}`)).size;
await fs.writeFile('audit/web-media-report.json',JSON.stringify({imageSets:seen.size,videos:sizes},null,2));
console.log(sizes);
