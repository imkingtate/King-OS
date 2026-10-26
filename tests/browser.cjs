const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
try{
 for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.SOVEREIGN_TEST_URL||'http://127.0.0.1:8765/')+'?skipopener=1');await page.waitForTimeout(800);
 assert.equal(await page.locator('#app').isVisible(),true);assert.deepEqual(errors,[]);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const roundtrip=await page.evaluate(()=>{S.testUnknown={records:[{id:'preserve'}]};save();return JSON.stringify(SovereignStorage.decode(JSON.stringify(S),DS))===JSON.stringify(S)});assert.equal(roundtrip,true);
 await page.evaluate(()=>{localStorage.setItem('sov_v3_prev',JSON.stringify(S));localStorage.setItem('sov_v3','broken');});await page.reload();await page.waitForTimeout(300);
 assert.match(await page.locator('#storage-error').innerText(),/Startup paused/);assert.equal(await page.evaluate(()=>localStorage.getItem('sov_v3')),'broken');
 await page.getByRole('button',{name:'Download recovery copy'}).isVisible().then(x=>assert.equal(x,true));
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Recover previous save'}).click();await page.waitForTimeout(700);
 assert.equal(await page.locator('#app').isVisible(),true);assert.equal(await page.evaluate(()=>S.testUnknown.records[0].id),'preserve');
 assert.equal(await page.evaluate(()=>localStorage.getItem('sov_v3_recovery_original')),'broken');
 await page.evaluate(()=>importText(JSON.stringify(S)));await page.waitForTimeout(1100);assert.equal(await page.evaluate(()=>S.testUnknown.records[0].id),'preserve');
 // Real browser quota fault: the primary copy remains intact and the error is visible.
 const quota=await page.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='sov_v3')throw new DOMException('Full','QuotaExceededError');return original.call(this,k,v);};S.testUnsaved=true;const result=save();Storage.prototype.setItem=original;return result;});assert.equal(quota,false);assert.match(await page.locator('#storage-error').innerText(),/NOT SAVED/);
 await page.reload();await page.locator('#v2-panel').waitFor();await page.waitForTimeout(200);
 await page.evaluate(()=>localStorage.removeItem('sov_v3'));await page.reload();await page.locator('#v2-panel').waitFor();assert.equal(await page.evaluate(()=>S.testUnknown.records[0].id),'preserve');
 const other=await page.context().newPage();await other.goto((process.env.SOVEREIGN_TEST_URL||'http://127.0.0.1:8765/')+'?skipopener=1');await other.locator('#v2-panel').waitFor();await other.evaluate(()=>{const r=JSON.parse(localStorage.getItem('sov_v3'));r.otherTabMarker=true;localStorage.setItem('sov_v3',JSON.stringify(r));});await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>save()),false);assert.match(await page.locator('#storage-error').innerText(),/Another tab/);await other.close();
 console.log('PASS startup, full-state import/export, corrupt recovery, quota errors, IndexedDB recovery, tab conflicts, layout '+width);await page.close();
 }
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
