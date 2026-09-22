import test from 'node:test';import assert from 'node:assert/strict';import { traceLayers,setAtPath } from '../src/index.js';
test('deep merges objects and replaces arrays',()=>{const r=traceLayers([{name:'defaults',value:{http:{port:80,hosts:['a']}}},{name:'prod',value:{http:{port:443,hosts:['b']}}}]);assert.deepEqual(r.config,{http:{port:443,hosts:['b']}});assert.deepEqual(r.provenance['/http/port'],{source:'prod',overrode:['defaults']})});
test('keeps provenance for untouched leaves',()=>{const r=traceLayers([{name:'a',value:{x:1,y:2}},{name:'b',value:{x:3}}]);assert.equal(r.provenance['/y'].source,'a')});
test('supports explicit null and false',()=>{const r=traceLayers([{name:'a',value:{x:1}},{name:'b',value:{x:null,y:false}}]);assert.deepEqual(r.config,{x:null,y:false})});
test('sets dotted paths',()=>assert.deepEqual(setAtPath({},'http.tls.enabled',true),{http:{tls:{enabled:true}}}));
