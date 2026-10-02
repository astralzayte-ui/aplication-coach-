// usage: node render.js <full|overlay> <outDir> [t1,t2,...]   (sans temps : toutes les images)
const {chromium}=require(process.env.PW_PATH||'playwright'); const fs=require('fs'), path=require('path');
const mode=process.argv[2], out=process.argv[3], times=process.argv[4]?process.argv[4].split(',').map(Number):null;
const TL=JSON.parse(fs.readFileSync('timeline.json')); fs.mkdirSync(out,{recursive:true});
const ext=mode==='overlay'?'png':'jpg';
(async()=>{
  const b=await chromium.launch({args:['--allow-file-access-from-files']});
  const frames=times?times.map((t,i)=>[i,t]):Array.from({length:Math.round(TL.total*TL.fps)},(_,i)=>[i,i/TL.fps]);
  const W=times?1:Math.min(4,require('os').cpus().length);
  let next=0, done=0;
  async function worker(){
    const ctx=await b.newContext({viewport:{width:1080,height:1920}}); const p=await ctx.newPage();
    await p.addInitScript(tl=>{window.TL=tl},TL);
    await p.goto('file://'+path.resolve('overlay.html')+'?mode='+mode); await p.evaluate(()=>document.fonts.ready);
    await p.waitForFunction(()=>[...document.images].every(i=>i.complete));
    while(true){const k=next++; if(k>=frames.length)break; const [i,t]=frames[k];
      await p.evaluate(t=>window.seek(t),t);
      const name=times?`still_${mode}_${String(t).replace('.','_')}.${ext}`:`${String(i).padStart(5,'0')}.${ext}`;
      await p.screenshot(Object.assign({path:path.join(out,name),type:ext==='png'?'png':'jpeg',omitBackground:mode==='overlay'},ext==='png'?{}:{quality:90}));
      if(++done%60===0) console.log('frames',done,'/',frames.length,flush=true);}
    await ctx.close();
  }
  await Promise.all(Array.from({length:W},worker)); await b.close(); console.log('done',frames.length);
})();
