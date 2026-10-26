const {chromium}=require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium'});
try{
 for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/?skipopener=1');await page.waitForTimeout(800);
 assert.equal(await page.locator('#app').isVisible(),true);assert.deepEqual(errors,[]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const roundtrip=await page.evaluate(()=>{S.testUnknown={records:[{id:'preserve'}]};save();return JSON.stringify(SovereignStorage.decode(JSON.stringify(S),DS))===JSON.stringify(S)});assert.equal(roundtrip,true);
 await page.evaluate(()=>{localStorage.setItem('sov_v3','broken');});await page.reload();await page.waitForTimeout(300);
 assert.match(await page.locator('#storage-error').innerText(),/Startup paused/);assert.equal(await page.evaluate(()=>localStorage.getItem('sov_v3')),'broken');
 await page.getByRole('button',{name:'Download recovery copy'}).isVisible().then(x=>assert.equal(x,true));
 console.log('PASS startup, full-state roundtrip, corrupt-data preservation, recovery controls, layout '+width);await page.close();
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
