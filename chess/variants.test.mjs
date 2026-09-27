
import * as Rl from './rules.js';
import {allPuzzles,allVerdicts,PATTERNS,familyOf,demoFor} from './patterns.js';
import {puzzles} from './puzzles.js';
let bad=0,n=0;
for(const p of allPuzzles){n++;let c;try{c=new Rl.Chess(p.fen);}catch(e){bad++;console.log('illegal',p.id);continue;}
 const w=Rl.winningMoves(p.fen,p.mateIn);if(!w.length){bad++;console.log('nosol',p.id);}
 if(p.mateIn===2&&Rl.winningMoves(p.fen,1).length){bad++;console.log('has m1',p.id);}}
for(const v of allVerdicts){n++;try{new Rl.Chess(v.fen);}catch(e){bad++;console.log('illegal',v.id);continue;}const pr=Rl.inspectCheck(v.fen);if(!pr.check||(pr.mate?'mate':'not')!==v.answer){bad++;console.log('verdict',v.id,pr.mate,v.answer);}}
const unf=puzzles.filter(p=>!familyOf(p.pattern));console.log('unmapped',unf.map(p=>p.pattern));
console.log('nodemo',PATTERNS.filter(p=>!demoFor(p.key)).map(p=>p.key));
console.log('checked',n,'bad',bad);
