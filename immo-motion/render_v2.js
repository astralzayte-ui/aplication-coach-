// usage : node render_v2.js <full|overlay> <outDir> [t1,t2,...]      (sans temps : toutes les images 0 -> 9,5 s)
//   full    -> JPG, fond de doublure (hook opaque + doublure vidéo extraite des clips dans build/v2_plates/)
//   overlay -> PNG transparent (fond opaque seulement sur le hook ; clip client passé dessous au montage)
// Lit timeline_v2.json et overlay_v2.html. N'écrit QUE dans build/ (outDir doit être sous build/).
// Lancer depuis /home/user/aplication-coach-/immo-motion ; export PW_PATH=$(npm root -g)/playwright
const {chromium}=require(process.env.PW_PATH||'playwright');
const fs=require('fs'),path=require('path'),os=require('os'),{execFileSync}=require('child_process');
const ROOT=__dirname, BUILD=path.join(ROOT,'build');
const mode=process.argv[2], outArg=process.argv[3], times=process.argv[4]?process.argv[4].split(',').map(Number):null;
if(!['full','overlay'].includes(mode)||!outArg){console.error('usage: node render_v2.js <full|overlay> <outDir sous build/> [t1,t2,...]');process.exit(2)}
const out=path.resolve(outArg);
if(!(out===BUILD||out.startsWith(BUILD+path.sep))){console.error('refus : outDir doit être sous '+BUILD);process.exit(2)}
const TL=JSON.parse(fs.readFileSync(path.join(ROOT,'timeline_v2.json')));
fs.mkdirSync(out,{recursive:true});
const ext=mode==='overlay'?'png':'jpg';
const FPS=TL.fps, NF=Math.round(TL.total*FPS);
const frames=times?times.map((t,i)=>[i,t]):Array.from({length:NF},(_,i)=>[i,i/FPS]);

// ── doublure vidéo (mode full) : extrait les images des clips sur la grille de 30 i/s, nommées p_<n° d'image>.jpg
const PLATES=path.join(BUILD,'v2_plates');
function plateSegments(){ // [clip, srcStart, dur, firstFrame]
  const segs=[];let pos=TL.scenes.demo[0];
  TL.demo_segments.forEach(([clip,a,b])=>{segs.push([clip,a,b-a,Math.round(pos*FPS)]);pos+=b-a});
  const [cc,ca,cb]=TL.cta_bg;segs.push([cc,ca,Math.min(cb-ca,TL.scenes.cta[1]-TL.scenes.cta[0]),Math.round(TL.scenes.cta[0]*FPS)]);
  return segs;
}
function ensurePlates(frameNums){
  fs.mkdirSync(PLATES,{recursive:true});
  for(const [clip,a,dur,f0] of plateSegments()){
    const n=Math.round(dur*FPS);
    const need=frameNums.some(f=>f>=f0&&f<f0+n&&!fs.existsSync(path.join(PLATES,'p_'+String(f).padStart(4,'0')+'.jpg')));
    if(!need)continue;
    execFileSync('ffmpeg',['-y','-v','error','-ss',String(a),'-t',String(dur),'-i',path.join(ROOT,'clips',clip+'.mp4'),
      '-vf','fps='+FPS+',scale=1080:1920','-q:v','3','-start_number',String(f0),path.join(PLATES,'p_%04d.jpg')]);
  }
}
if(mode==='full'&&process.env.NO_PLATES!=='1')ensurePlates(frames.map(([,t])=>Math.round(t*FPS)));

(async()=>{
  const b=await chromium.launch({args:['--allow-file-access-from-files']});
  const W=Math.max(1,Math.min(4,os.cpus().length,frames.length)); // 4 workers max
  let next=0,done=0;
  async function worker(){
    const ctx=await b.newContext({viewport:{width:1080,height:1920}});const p=await ctx.newPage();
    await p.addInitScript(tl=>{window.TL=tl},TL);
    await p.goto('file://'+path.join(ROOT,'overlay_v2.html')+'?mode='+mode+(process.env.NO_PLATES==='1'?'&plates=0':''));
    await p.evaluate(()=>document.fonts.ready);
    await p.waitForFunction(()=>[...document.images].every(i=>i.complete));
    while(true){
      const k=next++;if(k>=frames.length)break;const [i,t]=frames[k];
      await p.evaluate(t=>window.seek(t),t);
      await p.evaluate(()=>window.plateReady());
      await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
      const name=times?`still_${mode}_${String(t).replace('.','_')}.${ext}`:`${String(i).padStart(5,'0')}.${ext}`;
      await p.screenshot(Object.assign({path:path.join(out,name),type:ext==='png'?'png':'jpeg',omitBackground:mode==='overlay'},ext==='png'?{}:{quality:90}));
      if(++done%60===0)console.log('frames',done,'/',frames.length);
    }
    await ctx.close();
  }
  await Promise.all(Array.from({length:W},worker));await b.close();console.log('done',frames.length);
})().catch(e=>{console.error(e);process.exit(1)});
