/* Shared persistence boundary. Unknown fields are intentionally retained. */
(function(root){
'use strict';
function validate(value, defaults){
 if(!value || typeof value!=='object' || Array.isArray(value)) throw Error('Expected a SOVEREIGN record');
 for(const key of Object.keys(value)){
  if(['__proto__','constructor','prototype'].includes(key)) throw Error('Unsafe record key');
  if(defaults && Object.hasOwn(defaults,key) && defaults[key]!==null){
   const expected=defaults[key];
   if(Array.isArray(expected) && !Array.isArray(value[key])) throw Error(key+' must be an array');
   if(typeof expected==='object' && !Array.isArray(expected) && (!value[key] || typeof value[key]!=='object' || Array.isArray(value[key]))) throw Error(key+' must be an object');
  }
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
