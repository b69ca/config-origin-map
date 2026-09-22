#!/usr/bin/env node
import { readFile } from 'node:fs/promises';import { traceLayers,setAtPath,flatten } from './index.js';
const args=process.argv.slice(2);if(!args.length||args.includes('--help')){console.log('Usage: config-origin-map FILE... [--set path=value]... [--json|--sources-only]');process.exit(args.length?0:2)}
try{
  const files=[];for(let i=0;i<args.length;i++)if(!args[i].startsWith('--')&&(i===0||args[i-1]!=='--set'))files.push(args[i]);
  const layers=[];for(const file of files)layers.push({name:file,value:JSON.parse(await readFile(file,'utf8'))});
  const overrides={};for(let i=0;i<args.length;i++)if(args[i]==='--set'){const text=args[++i],eq=text.indexOf('=');if(eq<1)throw new Error(`invalid --set: ${text}`);let value=text.slice(eq+1);try{value=JSON.parse(value)}catch{}setAtPath(overrides,text.slice(0,eq),value)}
  if(Object.keys(overrides).length)layers.push({name:'command line',value:overrides});const result=traceLayers(layers);
  if(args.includes('--json'))console.log(JSON.stringify(result,null,2));else for(const [path,value] of flatten(result.config)){const p=result.provenance[path];console.log(`${path}\t${p.source}\t${args.includes('--sources-only')?'':JSON.stringify(value)}${p.overrode.length?`\t(overrode ${p.overrode.join(', ')})`:''}`)}
}catch(e){console.error(`config-origin-map: ${e.message}`);process.exitCode=2}
