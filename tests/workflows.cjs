const {chromium}=require('playwright');const a=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});try{
for(const width of [390,1440]){
 const p=await browser.newPage({viewport:{width,height:900}});const errors=[];p.on('pageerror',err=>errors.push(err.message));p.on('dialog',d=>d.accept());await p.goto((process.env.SOVEREIGN_TEST_URL||'http://127.0.0.1:8765/')+'?skipopener=1');const panel=p.locator('#v2-panel');await panel.waitFor();
 async function fill(form,values){const f=panel.locator(`[data-form=${form}]`);for(const [k,v] of Object.entries(values)){const x=f.locator(`[name=${k}]`);if(await x.evaluate(x=>x.tagName)==='SELECT')await x.selectOption(v);else await x.fill(v);}await f.locator('button[type=submit]').click();}
 await fill('action',{title:'A real next step',due:'2026-10-26',domain:'FAMILY'});a.equal(await p.evaluate(()=>S.live.filter(x=>x.t==='A real next step').length),1);
 await panel.locator('[data-do=complete]').first().click();
 await fill('closeout',{note:'Tested workflow',tomorrow:'Tomorrow priority'});await fill('closeout',{note:'Revised outcome',tomorrow:'Revised priority'});a.equal(await p.evaluate(()=>S.live.filter(x=>x.t==='Revised priority').length),1);
 await panel.locator('[data-view=ops]').click();await fill('lead',{name:'Prospect A',stage:'new'});await fill('offer',{name:'Approved scope',amount:'50',terms:'Deliver the agreed report'});await panel.locator('[data-do=approve]').click();
 await fill('content',{title:'Planned post',due:'2026-10-27'});await fill('activity',{lead:'Prospect A',kind:'follow-up',outcome:'Asked about scope'});
 const tx=panel.locator('[data-form=transaction]');await tx.locator('[name=customer]').fill('Prospect A');await tx.locator('[name=amount]').fill('50');await tx.locator('[name=reference]').fill('receipt-'+width);await tx.locator('[name=verified]').check();await tx.locator('button').click();
 a.equal(await p.evaluate(()=>SovereignDomain.customers(S,'India').length),1);await panel.locator('[data-do=creator][data-id=Yami]').click();a.equal(await p.evaluate(()=>SovereignDomain.customers(S,'Yami').length),0);a.equal(await panel.getByText('Prospect A',{exact:true}).count(),0);
 await panel.locator('[data-view=money]').click();await fill('schedule',{kind:'subscription',name:'Hosting',amount:'12',due:'2026-10-27',repeat:'monthly',scope:'business',provenance:'manual'});
 await fill('savings',{amount:'100'});await panel.locator('[data-view=routines]').click();await fill('meal',{day:'MON',name:'Rice and vegetables'});await fill('meal',{day:'MON',name:'Rice and beans'});a.equal(await p.evaluate(()=>S.v2.mealHistory.some(x=>x.name==='Rice and vegetables')),true);await fill('family',{title:'Family visit',due:'2026-10-28'});await fill('routine',{title:'Practice a skill',due:'2026-10-28',domain:'MIND'});await panel.locator('[data-view=settings]').click();await fill('nutrition',{protein:'125',water:'96'});a.equal(await p.evaluate(()=>S.v2.nutrition.protein),125);
 a.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);a.deepEqual(errors,[]);
 await p.reload();await p.locator('#v2-panel').waitFor();a.equal(await p.evaluate(()=>S.v2.transactions.length),1);a.equal(await p.evaluate(()=>S.v2.nutrition.protein),125);
 console.log('PASS command, closeout idempotency, creator isolation, offers, content, activity, verified transaction, subscriptions, savings, nutrition, reload at '+width);await p.close();
}
}finally{await browser.close();}})().catch(err=>{console.error(err);process.exitCode=1});
