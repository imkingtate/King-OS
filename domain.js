(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const date=s=>{const m=String(s||'').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);return m?`${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`:'';};
function migrate(input){
 const s=clone(input);if(!Array.isArray(s.live))s.live=[];
 if(s.v2 && s.v2.version>2)throw Error('Newer data version: use a newer application');
 if(!s.v2)s.v2={version:2,briefings:{},obligations:[],paydays:[],offers:[],content:[],activities:[],transactions:[],fulfillment:[],nutrition:{protein:150,water:128},protectedSavings:0};
 for(const [i,item] of (s.inbox||[]).entries()){
  if(item.convertedTo || item.done || item.cat==='BRAND' || item.cat==='IDEA')continue;
  const ref='legacy-inbox:'+i+':'+(item.ts||item.date||'');
  let task=s.live.find(x=>x.ref===ref);
  if(!task){task={id:'v2-inbox-'+i+'-'+(item.ts||0),t:item.t||'',type:'task',src:'INBOX',dom:item.cat==='MONEY'?'MONEY':'SOVEREIGN',priority:'normal',status:'open',dueAt:item.dueAt||'',ts:item.ts||0,date:item.date||'',ref,hist:[{ev:'migrated',ts:0,note:'Original inbox retained'}]};s.live.push(task);}
  item.convertedTo=task.id; // Retain the historical record, linked to the canonical action.
 }
 return s;
}
function verified(t){return t && t.status==='verified' && Number.isFinite(t.amount) && t.amount>0 && typeof t.reference==='string' && t.reference.trim().length>0;}
function customers(s,creator){const groups=new Map();for(const t of s.v2.transactions.filter(t=>verified(t)&&t.creator===creator)){const c=groups.get(t.customer)||{name:t.customer,total:0,count:0};c.total+=t.amount;c.count++;groups.set(t.customer,c);}return [...groups.values()];}
function occurrences(item,start,end){
 const due=date(item.due);if(!due || !['none','weekly','monthly'].includes(item.repeat))throw Error('Invalid obligation schedule');
 const out=[];let d=new Date(due+'T12:00:00Z');const anchor=d.getUTCDate();let count=0;
 while(date(d.toISOString())<=end){
  const key=date(d.toISOString());if(key>=start && !(item.paidDates||[]).includes(key))out.push({date:key,amount:item.amount,id:item.id,name:item.name,scope:item.scope,provenance:item.provenance});
  if(item.repeat==='none')break;
  if(item.repeat==='weekly')d.setUTCDate(d.getUTCDate()+7);
  else {d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+1);const last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(anchor,last));}
  if(++count>2400)throw Error('Schedule exceeds supported range');
 }
 return out;
}
function forecast(s,start,end,scope){
 const v=s.v2;const bills=v.obligations.filter(x=>x.scope===scope).flatMap(x=>occurrences(x,date(x.due),end));
 const income=v.paydays.filter(x=>x.scope===scope).flatMap(x=>occurrences(x,start,end));
 const known=s.financeTouchedAt || (s.finTx||[]).length || s.finAccounts.some(a=>Number(a.balance)!==0);
 const opening=scope==='personal'&&known?s.finAccounts.reduce((n,a)=>n+(Number(a.balance)||0),0):null;
 const protectedAmount=scope==='personal'?v.protectedSavings:0;
 return {opening,protectedAmount,bills,income,projected:opening===null?null:opening-protectedAmount-bills.reduce((n,x)=>n+x.amount,0)+income.reduce((n,x)=>n+x.amount,0)};
}
function command(s,today){const open=s.live.filter(x=>x.status==='open');const score=x=>(date(x.dueAt)&&date(x.dueAt)<today?100:date(x.dueAt)===today?50:0)+(x.priority==='high'?20:0);return {next:open.slice().sort((a,b)=>score(b)-score(a)).slice(0,3),overdue:open.filter(x=>date(x.dueAt)&&date(x.dueAt)<today),commitments:(s.calendarEvents||[]).filter(x=>!x.done&&date(x.date)>=today).sort((a,b)=>date(a.date).localeCompare(date(b.date))).slice(0,5),completed:s.live.filter(x=>x.status==='completed'&&date(new Date(x.completedAt||0).toISOString())===today).length};}
const api={migrate,date,verified,customers,occurrences,forecast,command};if(typeof module!=='undefined')module.exports=api;else root.SovereignDomain=api;
})(typeof window==='undefined'?globalThis:window);
