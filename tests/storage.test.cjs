const {test}=require('node:test');
const assert=require('node:assert/strict');
const {decode,write}=require('../storage.js');
const defaults={tasks:[],settings:{},name:''};
function store(seed){const map=new Map(Object.entries(seed));return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};}
test('legacy migration preserves all modules and unknown historical records',()=>{
 const old={tasks:[{id:1}],settings:{old:true},customModule:{records:[1,2]}};
 const migrated=decode(JSON.stringify(old),defaults);
 assert.deepEqual(decode(JSON.stringify(migrated),defaults),migrated);
 assert.deepEqual(migrated.customModule,old.customModule);
 assert.deepEqual(defaults.tasks,[]);
});
test('full export restores every field including unknown modules',()=>{
 const record={...defaults,finance:[{amount:25}],india:{leads:[1]},yami:{customers:[2]}};
 const s=store({});write(s,record,defaults);assert.deepEqual(decode(s.getItem('sov_v3'),defaults),record);
});
test('invalid shapes and prototype keys rejected',()=>{
 for(const raw of ['null','[]','{"tasks":{}}','{"settings":[]}','{"__proto__":{}}']) assert.throws(()=>decode(raw,defaults));
});
test('previous good revision survives primary write failure',()=>{
 const previous=JSON.stringify(defaults);const s=store({sov_v3:previous});const set=s.setItem;
 s.setItem=(k,v)=>{if(k==='sov_v3')throw Error('QuotaExceeded');set(k,v);};
 assert.throws(()=>write(s,{...defaults,name:'next'},defaults));assert.equal(s.getItem('sov_v3_prev'),previous);assert.equal(s.getItem('sov_v3'),previous);
});
test('corrupt primary is never overwritten by autosave',()=>{
 const s=store({sov_v3:'broken',sov_v3_prev:JSON.stringify(defaults)});
 assert.throws(()=>write(s,defaults,defaults));assert.equal(s.getItem('sov_v3'),'broken');assert.equal(s.getItem('sov_v3_prev'),JSON.stringify(defaults));
});
test('unsupported versions and malformed canonical actions cannot be loaded',()=>{assert.throws(()=>decode('{"v2":{"version":99}}'));assert.throws(()=>decode('{"live":{}}'));});
test('nested unsafe keys and nonfinite monetary data fail validation',()=>{assert.throws(()=>decode('{"custom":{"__proto__":{}}}'));assert.throws(()=>decode('{"finance":1e999}'));});
