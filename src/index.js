const isObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const pointer=parts=>'/' + parts.map(x=>String(x).replace(/~/g,'~0').replace(/\//g,'~1')).join('/');

export function traceLayers(layers){
  let config={};const histories=new Map();
  function record(path,source,value){const key=pointer(path),list=histories.get(key)||[];list.push({source,value});histories.set(key,list)}
  function merge(target,incoming,source,path=[]){
    if(!isObject(incoming)){record(path,source,incoming);return structuredClone(incoming)}
    const out=isObject(target)?structuredClone(target):{};
    for(const [k,v] of Object.entries(incoming)){const p=[...path,k];out[k]=isObject(v)?merge(out[k],v,source,p):(record(p,source,v),structuredClone(v))}
    return out;
  }
  for(const layer of layers){if(!layer||typeof layer.name!=='string'||!isObject(layer.value))throw new Error('each layer needs a name and object value');config=merge(config,layer.value,layer.name)}
  const provenance={};for(const [path,history] of [...histories].sort())provenance[path]={source:history.at(-1).source,overrode:history.slice(0,-1).map(x=>x.source)};
  return {config,provenance};
}

export function setAtPath(root,path,value){const parts=path.split('.').filter(Boolean);if(!parts.length)throw new Error('empty set path');let at=root;for(const p of parts.slice(0,-1)){if(!isObject(at[p]))at[p]={};at=at[p]}at[parts.at(-1)]=value;return root}

export function flatten(value,path=[]){if(!isObject(value))return [[pointer(path),value]];return Object.entries(value).flatMap(([k,v])=>flatten(v,[...path,k]));}
