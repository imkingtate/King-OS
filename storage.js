/* Shared persistence boundary. Unknown fields are intentionally retained. */
(function(root){
'use strict';
function validate(value, defaults){
 if(!value || typeof value!=='object' || Array.isArray(value)) throw Error('Expected a SOVEREIGN record');
 let nodes=0;
 function inspect(node,depth){if(++nodes>500000||depth>100)throw Error('Record is too complex');if(typeof node==='number'&&!Number.isFinite(node))throw Error('Record contains an invalid number');if(node&&typeof node==='object'){for(const k of Object.keys(node)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Unsafe record key');inspect(node[k],depth+1);}}}
 inspect(value,0);
 for(const key of Object.keys(value)){
  if(['__proto__','constructor','prototype'].includes(key)) throw Error('Unsafe record key');
  if(defaults && Object.hasOwn(defaults,key) && defaults[key]!==null){
   const expected=defaults[key];
   if(Array.isArray(expected) && !Array.isArray(value[key])) throw Error(key+' must be an array');
   if(typeof expected==='object' && !Array.isArray(expected) && (!value[key] || typeof value[key]!=='object' || Array.isArray(value[key]))) throw Error(key+' must be an object');
  }
 }
 const arrays=['live','actionsList','countersList','habitsList','homeChecksList','reignCreators','mealPlan','workoutPlan'];
 for(const key of arrays)if(value[key]!=null&&!Array.isArray(value[key]))throw Error(key+' must be an array');
 if(value.v2){
  const v=value.v2;if(v.version!==2)throw Error('Unsupported data version');
  for(const key of ['obligations','paydays','offers','content','activities','transactions','fulfillment'])if(!Array.isArray(v[key]))throw Error('Invalid v2 '+key);
  if(!v.briefings||typeof v.briefings!=='object'||Array.isArray(v.briefings))throw Error('Invalid briefings');
  if(!v.nutrition||!Number.isFinite(v.nutrition.protein)||v.nutrition.protein<=0||!Number.isFinite(v.nutrition.water)||v.nutrition.water<=0)throw Error('Invalid nutrition targets');
  if(!Number.isFinite(v.protectedSavings)||v.protectedSavings<0)throw Error('Invalid protected savings');
  for(const optional of ['journal','skills','bodyHistory','balanceHistory','mealHistory','importHistory'])if(v[optional]!==undefined&&!Array.isArray(v[optional]))throw Error('Invalid '+optional);
 for(const t of v.transactions){if(t.refunds!==undefined&&!Array.isArray(t.refunds))throw Error('Invalid refunds');if((t.refunds||[]).some(r=>!Number.isFinite(r.amount)||r.amount<=0)||((t.refunds||[]).reduce((n,r)=>n+r.amount,0)>t.amount))throw Error('Invalid refund amount');}
 for(const item of [...v.obligations,...v.paydays,...v.transactions,...v.offers])if(!Number.isFinite(item.amount)||item.amount<=0)throw Error('Invalid monetary record');
 }
 return value;
}
function decode(raw,defaults){
 let value=JSON.parse(raw);
 if(value && value.sov_v3 && typeof value.sov_v3==='object') value=value.sov_v3;
 validate(value,defaults);
 return Object.assign({},defaults?JSON.parse(JSON.stringify(defaults)):{},value);
}
function write(storage,value,defaults){
 validate(value,defaults);
 const raw=JSON.stringify(value), previous=storage.getItem('sov_v3');
 if(previous!==null && previous!==raw){
  // A corrupt primary must never overwrite the last usable recovery copy.
  decode(previous,defaults);
  storage.setItem('sov_v3_prev',previous);
 }
 storage.setItem('sov_v3',raw);
 if(storage.getItem('sov_v3')!==raw) throw Error('Storage verification failed');
 return raw;
}
const api={validate,decode,write};
if(typeof module!=='undefined') module.exports=api;
else root.SovereignStorage=api;
})(typeof window==='undefined'?globalThis:window);
