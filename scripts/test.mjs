import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const engine=html.match(/<script id="tax-engine">([\s\S]*?)<\/script>/)[1];
const context=vm.createContext({});vm.runInContext(engine+';this.api={calculate,limit401,progressive,STATES}',context);
const {calculate,limit401,STATES}=context.api;
const base={married:false,joint:false,kids:false,medical:false,biz1:false,biz2:false,max1:false,max2:false,w1:100000,w2:0,age1:40,age2:40,prior1:0,prior2:0,contrib1:0,contrib2:0,revenue1:0,revenue2:0,expense1:0,expense2:0,premium:0,interest:0,localRate:0,state:'Texas',medicalType:'pretax',children:0,teens:0};
const close=(a,b)=>assert.ok(Math.abs(a-b)<.01,`${a} != ${b}`);
// $83,900 taxable: $5,800 through $50,400, then 22%.
close(calculate(base).federal,13170);
close(calculate(base).payroll,7650);
close(calculate(base).net,79180);
close(calculate({...base,w1:0}).net,0);
close(calculate({...base,married:true,joint:true,w1:120000,w2:80000,max1:true,max2:true}).federal,15560);
close(calculate({...base,kids:true,children:1}).federal,10970);
close(calculate({...base,kids:true,teens:1}).federal,12670);
close(calculate({...base,max1:true}).retirement,24500);
assert.equal(limit401(50,100000),32500);assert.equal(limit401(60,100000),35750);assert.equal(limit401(64,100000),32500);assert.equal(limit401(40,10000),10000);
const roth=calculate({...base,age1:55,max1:true,prior1:160000});
const traditional=calculate({...base,age1:55,max1:true,prior1:100000});
close(roth.retirement,traditional.retirement);close(roth.agi-traditional.agi,8000);
close(calculate({...base,medical:true,premium:5000}).payroll,7267.5);
close(calculate({...base,medical:true,premium:5000,medicalType:'aftertax'}).federal,13170);
const se=calculate({...base,w1:0,biz1:true,revenue1:50000,expense1:10000});
close(se.payroll,40000*.9235*.153);assert.ok(se.qbi>0);
for(const state of Object.keys(STATES))for(const married of [false,true])for(const joint of [false,true]){
 const d={...base,state,married,joint,w2:80000,interest:1000,biz1:true,revenue1:30000,expense1:10000};const r=calculate(d);
 for(const v of Object.values(r))assert.ok(Number.isFinite(v),state);
 close(r.net+r.totalTax+r.retirement+r.medical,r.gross);assert.ok(r.stateTax>=0);
}
for(const name of ['Alaska','Florida','Nevada','New Hampshire','South Dakota','Tennessee','Texas','Washington','Wyoming'])close(calculate({...base,state:name}).stateTax,0);
assert.equal(Object.keys(STATES).length,51);
for(const script of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script[1]);
console.log('Passed: federal benchmarks, credits, payroll, medical, catch-up, self-employment, 204 filing/state combinations, and script syntax.');
