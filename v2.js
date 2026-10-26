/* Incremental UI over the retained application and canonical action store. */
(function(){
'use strict';
const D=SovereignDomain;
const e=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>D.date(todayStr());const uid=()=>crypto.randomUUID();
const usd=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
const field=(name,label,type='text',value='')=>`<label>${label}<input name="${name}" type="${type}" value="${e(value)}" ${type==='number'?'min="0" step="0.01"':''} required></label>`;
const select=(name,label,values)=>`<label>${label}<select name="${name}">${values.map(x=>`<option value="${e(x)}">${e(x)}</option>`).join('')}</select></label>`;
let view='command',creator='India',ready=false;
function queueAction(data){const item=sovAct.make(data);S.live.unshift(item);return item;}
function commit(fn){const previous=JSON.stringify(S);try{fn();if(!save()){S=JSON.parse(previous);return false;}render();return true;}catch(err){S=JSON.parse(previous);storageError(err.message);return false;}}
function form(id,body,button){return `<form data-form="${id}">${body}<button class="btn btn-p" type="submit">${button}</button></form>`;}
function list(items,empty){return items.length?`<ul>${items.join('')}</ul>`:`<p>${empty}</p>`;}
function command(){
 const c=D.command(S,today());const briefing=S.v2.briefings[today()]||{};
 return `<h2>Today’s command</h2><p>${e(today())} · ${c.overdue.length} overdue · ${c.completed} completed today</p>
 <h3>Priorities and next actions</h3>${list(c.next.map(x=>`<li>${e(x.t)} ${x.dueAt?`<small>Due ${e(D.date(x.dueAt))}</small>`:''}<button data-do="complete" data-id="${e(x.id)}">Complete</button></li>`),'No open actions. Capture the next useful step below.')}
 ${form('action',field('title','Next action')+field('due','Due','date',today())+select('domain','Workspace',['SOVEREIGN','REIGN OPS','MONEY','BODY','MIND','FAMILY','HOME']),'Add action')}
 <h3>Upcoming commitments</h3>${list(c.commitments.map(x=>`<li>${e(x.date)} — ${e(x.title)}</li>`),'No upcoming commitments recorded.')}
 <h3>Morning briefing</h3><p>${c.overdue.length?`Resolve or reschedule ${c.overdue.length} overdue actions first.`:'No overdue actions.'} ${c.next[0]?`Next: ${e(c.next[0].t)}.`:'Choose one priority.'} Calendar information is local and manually recorded.</p>
 <button data-do="morning">${briefing.morning?'Briefing reviewed ✓':'Mark briefing reviewed'}</button>
 <h3>Evening closeout</h3>${form('closeout',`<label>Outcome and lesson<textarea name="note" required>${e(briefing.note||'')}</textarea></label>`+field('tomorrow','Tomorrow’s priority','text',briefing.tomorrow||''),'Save closeout')}
 ${briefing.closedAt?'<p>Closeout saved. Tomorrow’s priority is stored as an action.</p>':''}`;
}
function ops(){
 const v=S.v2,leads=S.pipeline.map((p,i)=>({p,i})).filter(x=>x.p.creator===creator);
 const tx=v.transactions.filter(t=>t.creator===creator);const customers=D.customers(S,creator);
 return `<h2>Reign Ops — ${creator}</h2><button data-do="creator" data-id="India" aria-pressed="${creator==='India'}">India</button><button data-do="creator" data-id="Yami" aria-pressed="${creator==='Yami'}">Yami</button>
 <p>Separate creator records. External messages and commercial commitments require human approval. This workspace never sends messages.</p>
 <h3>Pipeline</h3>${form('lead',field('name','Prospect / handle')+select('stage','Stage',['new','contacted','qualified','offer']),'Add prospect')}
 ${list(leads.map(({p,i})=>`<li>${e(p.name)} · ${e(p.v2stage||['new','contacted','qualified','legacy won — unverified'][p.stage]||'new')}<button data-do="advance" data-id="${i}">Advance stage</button></li>`),'No prospects in this workspace.')}
 <h3>Offers</h3>${form('offer',field('name','Offer')+field('amount','Price','number')+field('terms','Scope and fulfillment terms'),'Draft offer')}
 ${list(v.offers.filter(x=>x.creator===creator).map(x=>`<li>${e(x.name)} · ${usd(x.amount)} · ${e(x.status)} · ${e(x.terms)} ${x.status==='draft'?`<button data-do="approve" data-id="${e(x.id)}">Approve offer</button>`:''}</li>`),'No offers. Draft and approve before committing.')}
 <h3>Content plan</h3>${form('content',field('title','Content / channel')+field('due','Publish date','date',today()),'Plan content')}
 ${list(v.content.filter(x=>x.creator===creator).map(x=>`<li>${e(x.due)} · ${e(x.title)} · ${e(x.status)} <button data-do="publish" data-id="${e(x.id)}">Mark manually published</button></li>`),'No content planned.')}
 <h3>Acquisition activity</h3>${form('activity',select('lead','Prospect',leads.map(x=>x.p.name))+select('kind','Activity',['outreach','reply','follow-up','offer discussion'])+field('outcome','Observed outcome'),'Log completed activity')}
 <p>${v.activities.filter(x=>x.creator===creator).length} activities recorded · ${leads.length} prospects · ${customers.length} verified paying customers · ${usd(customers.reduce((n,x)=>n+x.total,0))} verified revenue</p>
 ${list(v.activities.filter(x=>x.creator===creator).slice(-5).reverse().map(x=>`<li>${e(x.date)} · ${e(x.lead)} · ${e(x.kind)} → ${e(x.outcome)}</li>`),'No activity recorded.')}
 <h3>Transactions and fulfillment</h3>${form('transaction',field('customer','Customer / handle')+select('offer','Approved offer',v.offers.filter(x=>x.creator===creator&&x.status==='approved').map(x=>x.id))+field('amount','Received amount','number')+field('reference','Receipt / transaction reference')+'<label><input name="verified" type="checkbox" required> I checked the payment evidence and confirm this transaction</label>','Record verified transaction')}
 ${list(tx.map(x=>`<li>${e(x.customer)} · ${usd(x.amount)} · verified manually · ${e(x.date)}</li>`),'No verified transactions.')}
 ${list(v.fulfillment.filter(x=>x.creator===creator).map(x=>`<li>${e(x.customer)} · ${e(x.terms)} · ${e(x.status)} ${x.status!=='fulfilled'?`<button data-do="fulfill" data-id="${e(x.id)}">Confirm fulfilled</button>`:''}</li>`),'No fulfillment pending.')}
 <details><summary>Preserved historical revenue (unverified)</summary>${list(S.reignRev.filter(x=>x.creator===creator&&!x.v2transaction).map(x=>`<li>${e(x.date)} · ${e(x.buyer||'Unnamed')} · ${usd(+x.amt||0)} · historical manual record</li>`),'No historical revenue records.')}</details>`;
}
function moneyView(){
 const end=new Date();end.setDate(end.getDate()+30);const f=D.forecast(S,today(),D.date(end.toISOString()),'personal');const v=S.v2;
 return `<h2>Money</h2><p>Personal balances are manually entered. Forecasts are estimates, not bank synchronization. Business revenue remains in Reign Ops.</p>
 <p>Manual personal opening balance: ${f.opening===null?"Unknown — enter account balances first":usd(f.opening)} · Protected savings: ${usd(f.protectedAmount)} · Estimated spendable in 30 days: ${f.projected===null?"Unknown until balances are entered":usd(f.projected)}</p>
 <p>Allocation framework: 60% living / 20% savings / 15% investment / 5% buffer. No allocation moves money automatically.</p>
 ${form('balance',select('account','Personal account',S.finAccounts.map(x=>x.name))+'<label>Current balance (may be negative)<input name="amount" type="number" step="0.01" required></label>','Save manual balance')}
 ${form('savings',field('amount','Protected savings','number',v.protectedSavings),'Protect savings')}
 <h3>Bills, subscriptions and paydays</h3>${form('schedule',select('kind','Record type',['bill','subscription','payday'])+field('name','Name')+field('amount','Amount','number')+field('due','Next date','date',today())+select('repeat','Recurrence',['none','weekly','monthly'])+select('scope','Ledger',['personal','business'])+select('provenance','Evidence',['manual','estimated','verified']),'Add obligation or payday')}
 ${list([...v.obligations,...v.paydays].map(x=>`<li>${e(x.name)} · ${usd(x.amount)} · ${e(x.scope)} · ${e(x.repeat)} · ${e(x.provenance)} ${v.obligations.includes(x)?`<button data-do="paid" data-id="${e(x.id)}">Mark next occurrence paid</button>`:''}</li>`),'No recurring records.')}
 <h3>Unpaid personal obligations — overdue and next 30 days</h3>${list(f.bills.map(x=>`<li>${e(x.date)} · ${e(x.name)} · ${usd(x.amount)} · ${e(x.provenance)}</li>`),'No obligations recorded in this window.')}
 <p>Forecast includes recorded unpaid overdue obligations and excludes unrecorded obligations and income. Business cash balance is unknown; verified revenue does not establish business cash on hand.</p>`;
}
function routines(){return `<h2>Personal and family</h2><p>Plans and actions share the existing records. Use Settings to search every module and export historical entries.</p>
 <h3>Weekly meal plan</h3>${form('meal',select('day','Day',['MON','TUE','WED','THU','FRI','SAT','SUN'])+field('name','Meal / preparation notes'),'Update meal plan')}
 ${list((S.mealPlan||[]).map(x=>`<li>${e(x.day)} · ${e(x.name)}</li>`),'No meals planned.')}
 <h3>Family schedule</h3>${form('family',field('title','Commitment')+field('due','Date','date',today()),'Add family commitment')}
 ${list((S.calendarEvents||[]).filter(x=>x.cat==='Family'&&!x.done).map(x=>`<li>${e(x.date)} · ${e(x.title)}</li>`),'No family commitments recorded.')}
 <h3>Skill development and home</h3>${form('routine',field('title','Concrete practice or home action')+field('due','Next date','date',today())+select('domain','Area',['MIND','BODY','HOME']),'Plan next action')}
 <p>Practice, training and home actions appear in Command alongside other priorities. Existing workout, reading and family history remain available through the original navigation.</p>`;}
function settings(){return `<h2>Settings and records</h2><h3>Nutrition targets</h3>${form('nutrition',field('protein','Daily protein (g)','number',S.v2.nutrition.protein)+field('water','Daily water (oz)','number',S.v2.nutrition.water),'Save targets')}
 <h3>Search all records</h3><label>Search terms<input id="v2-search" type="search"></label><div id="v2-results" aria-live="polite"></div>
 <h3>Backups and recovery</h3><button data-do="export">Export every module</button><button data-do="restore">Open restore controls</button>
 <p>Browser data stays on this device. Export before changing browsers or restoring. All historical modules remain in the original navigation.</p>
 <h3>Connected intelligence</h3><p>Calendar, finance and briefings currently use local records. No authenticated synchronization is configured. Future integrations require a server-side credential vault, explicit consent, read-only scopes, audited refreshes and revocation. Never paste API keys here.</p>`;}
function render(){if(!ready)return;const host=document.getElementById('v2-panel');if(!host)return;host.innerHTML=`<nav aria-label="Operational workspace">${['command','ops','money','routines','settings'].map(x=>`<button data-view="${x}" aria-current="${view===x?'page':'false'}">${{command:'Command',ops:'Reign Ops',money:'Money',routines:'Personal & family',settings:'Settings'}[x]}</button>`).join('')}</nav><div id="v2-status" role="status"></div>`+({command,ops,money:moneyView,routines,settings}[view])()+'<p><button data-do="legacy">Show / hide original command tools</button></p>';}
function submit(ev){const f=ev.target.closest('[data-form]');if(!f)return;ev.preventDefault();if(!f.reportValidity())return;const p=Object.fromEntries(new FormData(f));const kind=f.dataset.form;
 commit(()=>{const v=S.v2,now=today();const positive=()=>{const n=Number(p.amount);if(!Number.isFinite(n)||n<=0)throw Error('Amount must be positive');return n;};
 if(kind==='action')queueAction({t:p.title.trim(),dueAt:p.due,dom:p.domain,src:'OTHER',type:'task'});
 if(kind==='closeout'){const old=v.briefings[now]||{};v.briefings[now]={...old,note:p.note,tomorrow:p.tomorrow,closedAt:Date.now()};if(old.tomorrowAction){const x=S.live.find(x=>x.id===old.tomorrowAction);if(x)x.t=p.tomorrow;}else{const next=new Date();next.setDate(next.getDate()+1);const x=queueAction({t:p.tomorrow,dueAt:D.date(next.toISOString()),priority:'high',src:'OTHER',dom:'SOVEREIGN'});v.briefings[now].tomorrowAction=x.id;}}
 if(kind==='routine')queueAction({t:p.title,dueAt:p.due,dom:p.domain,src:'OTHER',type:'task'});
 if(kind==='family')S.calendarEvents.push({title:p.title,date:p.due,cat:'Family',done:false});
 if(kind==='meal'){if(!Array.isArray(S.mealPlan))S.mealPlan=[];if(!Array.isArray(v.mealHistory))v.mealHistory=[];const old=S.mealPlan.find(x=>x.day===p.day);if(old){v.mealHistory.push({...old,changedAt:Date.now()});old.name=p.name;}else S.mealPlan.push({day:p.day,name:p.name});}
 if(kind==='lead'){S.pipeline.push({name:p.name,creator,stage:0,v2stage:p.stage,date:now,amt:0});}
 if(kind==='offer')v.offers.push({id:uid(),creator,name:p.name,amount:positive(),terms:p.terms,status:'draft',createdAt:Date.now()});
 if(kind==='content')v.content.push({id:uid(),creator,title:p.title,due:p.due,status:'planned'});
 if(kind==='activity'){if(!p.lead)throw Error('Add a prospect first');v.activities.push({id:uid(),creator,lead:p.lead,kind:p.kind,outcome:p.outcome,date:now});}
 if(kind==='transaction'){
  const offer=v.offers.find(x=>x.id===p.offer&&x.creator===creator&&x.status==='approved');if(!offer)throw Error('An approved offer is required');
  if(!p.reference.trim()||!p.verified)throw Error('Verify payment evidence first');
  if(v.transactions.some(x=>x.reference===p.reference.trim()))throw Error('This transaction reference is already recorded');
  const t={id:uid(),creator,customer:p.customer.trim(),offer:offer.id,amount:positive(),reference:p.reference.trim(),status:'verified',verification:'human',date:now};v.transactions.push(t);
  v.fulfillment.push({id:uid(),transaction:t.id,creator,customer:t.customer,terms:offer.terms,status:'pending'});
  S.reignRev.push({amt:t.amount,creator,buyer:t.customer,date:now,ts:Date.now(),v2transaction:t.id,evidence:'human-verified'});
 }
 if(kind==='balance'){const x=S.finAccounts.find(x=>x.name===p.account);const n=Number(p.amount);if(!x||!Number.isFinite(n))throw Error('Invalid account balance');if(!Array.isArray(v.balanceHistory))v.balanceHistory=[];v.balanceHistory.push({name:x.name,balance:x.balance,changedAt:Date.now()});x.balance=n;S.financeTouchedAt=Date.now();}
 if(kind==='savings'){const n=Number(p.amount);if(!Number.isFinite(n)||n<0)throw Error('Invalid savings amount');v.protectedSavings=n;}
 if(kind==='schedule'){const item={id:uid(),name:p.name,amount:positive(),due:p.due,repeat:p.repeat,scope:p.scope,provenance:p.provenance,kind:p.kind,paidDates:[]};(p.kind==='payday'?v.paydays:v.obligations).push(item);}
 if(kind==='nutrition'){const protein=Number(p.protein),water=Number(p.water);if(protein<=0||water<=0||!Number.isFinite(protein+water))throw Error('Targets must be positive');v.nutrition={protein,water};updateTargets();}
 });
}
function click(ev){const b=ev.target.closest('button');if(!b)return;if(b.dataset.view){view=b.dataset.view;render();return;}const action=b.dataset.do,id=b.dataset.id;if(!action)return;
 if(action==='legacy'){document.getElementById('sec-brief').classList.toggle('v2-simplified');return;}
 if(action==='export'){exportData();return;}if(action==='restore'){sovAct.bkRestore();return;}
 if(action==='creator'){creator=id;render();return;}
 if(['approve','publish','fulfill'].includes(action)&&!confirm({approve:'Approve this offer and its fulfillment terms? This records approval only.',publish:'Confirm you manually published this content?',fulfill:'Confirm this order was fulfilled?'}[action]))return;
 commit(()=>{const v=S.v2;
 if(action==='complete')sovAct.complete(id);
 if(action==='morning')v.briefings[today()]={...v.briefings[today()],morning:Date.now()};
 if(action==='advance'){const p=S.pipeline[Number(id)],stages=['new','contacted','qualified','offer'];const current=stages.indexOf(p.v2stage||stages[p.stage]||'new');p.v2stage=stages[Math.min(3,current+1)];p.stage=Math.min(2,current+1);}
 if(action==='approve'){const x=v.offers.find(x=>x.id===id);x.status='approved';x.approvedAt=Date.now();}
 if(action==='publish'){const x=v.content.find(x=>x.id===id);x.status='published manually';x.publishedAt=Date.now();}
 if(action==='fulfill'){const x=v.fulfillment.find(x=>x.id===id);x.status='fulfilled';x.fulfilledAt=Date.now();}
 if(action==='paid'){const x=v.obligations.find(x=>x.id===id);const end=new Date();end.setFullYear(end.getFullYear()+1);const next=D.occurrences(x,x.due,D.date(end.toISOString()))[0];if(next){x.paidDates.push(next.date);x.lastPaidAt=Date.now();}}
 });
}
function updateTargets(){const n=S.v2.nutrition;const protein=document.getElementById('d-protein'),water=document.getElementById('d-water');if(protein)protein.parentElement.querySelector('.ms').textContent='target '+n.protein+'g';if(water)water.parentElement.querySelector('.ms').textContent='target '+n.water+'oz';}
function start(){if(!S||!Array.isArray(S.actionsList)||!Array.isArray(S.live)||!document.getElementById('cc-hero')||getComputedStyle(document.getElementById('app')).display==='none')return;clearInterval(wait);try{S=D.migrate(S);if(!save())return;ready=true;const host=document.createElement('section');host.id='v2-panel';host.className='card';host.setAttribute('aria-label','Daily operational command');document.getElementById('sec-brief').prepend(host);document.getElementById('sec-brief').classList.add('v2-simplified');host.addEventListener('click',click);host.addEventListener('submit',submit);host.addEventListener('input',ev=>{if(ev.target.id!=='v2-search')return;const q=ev.target.value.toLowerCase().trim();const out=document.getElementById('v2-results');if(q.length<2){out.textContent='Enter at least two characters';return;}const results=[];function walk(value,path){if(results.length>=50)return;if(typeof value==='string'&&value.toLowerCase().includes(q))results.push(path+': '+value);else if(value&&typeof value==='object')for(const k of Object.keys(value))walk(value[k],path+'.'+k);}walk(S,'records');out.textContent=results.join('\n')||'No records found';});render();updateTargets();}catch(err){storageError('Migration paused: '+err.message);}}
// Use the canonical live-action store for new inbox captures. Historical inputs remain linked.
const oldAdd=window.addInbox;window.addInbox=function(){if(!ready)return oldAdd();const x=document.getElementById('inbox-in');if(x.value.trim()){commit(()=>queueAction({t:x.value.trim(),src:'INBOX',dom:'SOVEREIGN',type:'task'}));x.value='';}};
// Brand and idea capture remain notes in their original workspace.
// Closing a pipeline stage must never manufacture a transaction or remove a prospect.
window.setStage=function(i,j){const p=S.pipeline[i];if(!p)return;if(j===3){alert('A stage change cannot verify payment. Record a verified transaction in Command → Reign Ops.');return;}commit(()=>{p.stage=j;p.v2stage=['new','contacted','qualified'][j];});renderReign();};
const wait=setInterval(start,100);start();
})();
