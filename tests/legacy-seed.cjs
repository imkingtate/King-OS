/* Optional real-snapshot verification; deliberately never logs record values. */
const fs=require('node:fs');const {isDeepStrictEqual:equal}=require('node:util');const d=require('../domain');const storage=require('../storage');
try{
 const raw=fs.readFileSync(process.argv[2]||'/workspace/legacy-recovery-seed.js','utf8');const marker='Object.assign({},DS,';
 const start=raw.indexOf(marker);const end=raw.lastIndexOf(')));');if(start<0||end<start)throw Error('Unsupported recovery artifact format');
 const record=JSON.parse(raw.slice(start+marker.length,end));const migrated=d.migrate(record);const restored=storage.decode(JSON.stringify(migrated));
 for(const key of Object.keys(record)){
  if(key==='inbox'){for(let i=0;i<record.inbox.length;i++)for(const field of Object.keys(record.inbox[i]))if(!equal(restored.inbox[i][field],record.inbox[i][field]))throw Error('Historical inbox mismatch');}
  else if(key==='live'){if(!equal(restored.live.slice(0,record.live.length),record.live))throw Error('Historical action mismatch');}
  else if(!equal(restored[key],record[key]))throw Error('Historical field mismatch: '+key);
 }
 if(!equal(d.migrate(migrated),migrated))throw Error('Migration is not idempotent');
 console.log('PASS historical migration and complete backup roundtrip: '+Object.keys(record).length+' fields; record values not logged');
}catch(err){console.error('Historical verification failed. '+(err.code==='ENOENT'?'Provide the preserved recovery artifact path.':'Inspect the artifact privately; values withheld.'));process.exitCode=1;}
