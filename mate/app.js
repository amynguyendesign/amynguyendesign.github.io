import {Chess, inspectCheck, assessMove} from './rules.js';
import {sfx} from './sound.js';
import {PATTERNS, familyOf, patternByKey, demoFor, countFor, allPuzzles} from './patterns.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
const other=c=>c==='w'?'b':'w', colorName=c=>c==='w'?'White':'Black';
// Pieces: every shape except the knight is generated from its left half and mirrored about x=24,
// so kings, queens, rooks, bishops and pawns are exactly symmetrical.
const PIECES={"p": "<path d=\"M24 21.5L20.2 21.5C20.2 26.5 17.6 30.6 15.8 33.5L24 33.5L32.2 33.5C30.4 30.6 27.8 26.5 27.8 21.5L24 21.5Z\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"18.2\" y=\"19\" width=\"11.6\" height=\"3.4\" rx=\"1.7\" fill=\"{F}\" stroke=\"{S}\"/><circle cx=\"24\" cy=\"12.6\" r=\"5.6\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"13.5\" y=\"33.5\" width=\"21\" height=\"4\" rx=\"1.6\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"10.5\" y=\"37.5\" width=\"27\" height=\"5\" rx=\"2.3\" fill=\"{P}\" stroke=\"{S}\"/>", "r": "<path d=\"M24 7L21 7L21 10.8L18.2 10.8L18.2 7L13.4 7L13.4 15L16.6 18L16.6 30.4L15 33.5L24 33.5L33 33.5L31.4 30.4L31.4 18L34.6 15L34.6 7L29.8 7L29.8 10.8L27 10.8L27 7L24 7Z\" fill=\"{F}\" stroke=\"{S}\"/><path d=\"M16.6 18L31.4 18\" fill=\"none\" stroke=\"{D}\"/><path d=\"M16.6 30.4L31.4 30.4\" fill=\"none\" stroke=\"{D}\"/><rect x=\"13.5\" y=\"33.5\" width=\"21\" height=\"4\" rx=\"1.6\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"10.5\" y=\"37.5\" width=\"27\" height=\"5\" rx=\"2.3\" fill=\"{P}\" stroke=\"{S}\"/>", "b": "<path d=\"M24 9.4C19.6 12.6 15.8 17.2 15.8 22.2C15.8 26.4 19.2 29 21 29.4L24 29.4L27 29.4C28.8 29 32.2 26.4 32.2 22.2C32.2 17.2 28.4 12.6 24 9.4Z\" fill=\"{F}\" stroke=\"{S}\"/><path d=\"M24 29.2L19.6 29.2C19.6 31 18.4 32.6 17 33.5L24 33.5L31 33.5C29.6 32.6 28.4 31 28.4 29.2L24 29.2Z\" fill=\"{F}\" stroke=\"{S}\"/><circle cx=\"24\" cy=\"6.6\" r=\"2.6\" fill=\"{F}\" stroke=\"{S}\"/><path d=\"M24 15.4L24 23.4\" fill=\"none\" stroke=\"{D}\"/><path d=\"M20 19.4L28 19.4\" fill=\"none\" stroke=\"{D}\"/><rect x=\"13.5\" y=\"33.5\" width=\"21\" height=\"4\" rx=\"1.6\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"10.5\" y=\"37.5\" width=\"27\" height=\"5\" rx=\"2.3\" fill=\"{P}\" stroke=\"{S}\"/>", "q": "<path d=\"M24 10.6L20.4 21L15.6 11.4L13.6 22.2L9.2 13.4L14.8 29.6L15.6 33.5L24 33.5L32.4 33.5L33.2 29.6L38.8 13.4L34.4 22.2L32.4 11.4L27.6 21L24 10.6Z\" fill=\"{F}\" stroke=\"{S}\"/><path d=\"M14.8 29.6L33.2 29.6\" fill=\"none\" stroke=\"{D}\"/><circle cx=\"24\" cy=\"8.2\" r=\"2.5\" fill=\"{F}\" stroke=\"{S}\"/><circle cx=\"15.6\" cy=\"9.3\" r=\"2.2\" fill=\"{F}\" stroke=\"{S}\"/><circle cx=\"32.4\" cy=\"9.3\" r=\"2.2\" fill=\"{F}\" stroke=\"{S}\"/><circle cx=\"9.2\" cy=\"11.4\" r=\"2.2\" fill=\"{F}\" stroke=\"{S}\"/><circle cx=\"38.8\" cy=\"11.4\" r=\"2.2\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"13.5\" y=\"33.5\" width=\"21\" height=\"4\" rx=\"1.6\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"10.5\" y=\"37.5\" width=\"27\" height=\"5\" rx=\"2.3\" fill=\"{P}\" stroke=\"{S}\"/>", "k": "<path d=\"M24 16.2C22.2 12.2 14.6 11.2 12.8 17.4C11.6 22.6 16.4 26.4 16.8 30L17 33.5L24 33.5L31 33.5L31.2 30C31.6 26.4 36.4 22.6 35.2 17.4C33.4 11.2 25.8 12.2 24 16.2Z\" fill=\"{F}\" stroke=\"{S}\"/><path d=\"M24 2.4L22.6 2.4L22.6 5L20 5L20 7.8L22.6 7.8L22.6 11.6L24 11.6L25.4 11.6L25.4 7.8L28 7.8L28 5L25.4 5L25.4 2.4L24 2.4Z\" fill=\"{F}\" stroke=\"{S}\"/><path d=\"M24 16.2L24 30\" fill=\"none\" stroke=\"{D}\"/><path d=\"M16.8 30L31.2 30\" fill=\"none\" stroke=\"{D}\"/><rect x=\"13.5\" y=\"33.5\" width=\"21\" height=\"4\" rx=\"1.6\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"10.5\" y=\"37.5\" width=\"27\" height=\"5\" rx=\"2.3\" fill=\"{P}\" stroke=\"{S}\"/>", "n": "<path d=\"M15.2 33.5C15.2 28.8 17.4 26.4 20.6 24.6L14.8 27C11.8 28.2 9.4 26.2 10 23.6L11.8 19.8C13.4 16.2 15.8 12.8 18.4 10.8L19.6 4.8L23.2 8.6C30.4 8.6 36.2 14.2 36.6 22.2C36.9 26.8 36.2 30.6 35.6 33.5Z\" fill=\"{F}\" stroke=\"{S}\"/><path d=\"M24.4 9.6C31 12 34.2 18 33.6 27\" fill=\"none\" stroke=\"{D}\"/><circle cx=\"19.4\" cy=\"14.6\" r=\"1.25\" fill=\"{E}\"/><circle cx=\"12.4\" cy=\"23.4\" r=\".75\" fill=\"{E}\"/><rect x=\"13.5\" y=\"33.5\" width=\"21\" height=\"4\" rx=\"1.6\" fill=\"{F}\" stroke=\"{S}\"/><rect x=\"10.5\" y=\"37.5\" width=\"27\" height=\"5\" rx=\"2.3\" fill=\"{P}\" stroke=\"{S}\"/>"};
const PCOL={w:{F:'#FFFFFF',S:'#2A3145',D:'#2A3145',P:'#EDEFF5',E:'#2A3145'},b:{F:'#4B576F',S:'#1D2333',D:'#DDE3EE',P:'#3A4459',E:'#F4F6FA'}};
function pieceSvg(p){const c=PCOL[p.color];return `<svg viewBox="0 0 48 48" aria-hidden="true" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${PIECES[p.type].replace(/\{([FSDPE])\}/g,(_,k)=>c[k])}</svg>`;}
const KEY='studio-mate-spotted-v2';
let progress={records:{},streak:0,best:0},canSave=true;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved.records==='object'&&saved.records)progress={...progress,...saved};}catch(e){canSave=false;}
progress.streak=Number(progress.streak)||0;progress.best=Number(progress.best)||0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress));}catch(e){canSave=false;}$('#storage-warning').hidden=canSave;}
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const smooth=()=>RM()?'instant':'smooth';
const CHEERS=['checkmate!','no way out.','that’s the one.','gg, king.','clean.'];
let view='patterns',patternKey=null,deck=[],idx=0,puzzle,fen,stageFen,orientation='w',attacker='w',remaining=1,resurfaced=new Set();
let selected=null,legalTargets=[],phase='play',hintLevel=0,hintFrom=null,assisted=false,dirty=false,recorded=false,named=null,nameOptions=[];
let feedback='',lastMove=null,attempt=null,defenseShown=false,defenseNote='',pendingPromotion=null,line=[],proof=null;
let busy=false,activeWorker=null,workEpoch=0,busyText='';
let lastCoachKey='',enterTimer=0,prevStreak=null,dropMove=null,suppressUntil=0,drag=null,fxQueue=[],cheer=CHEERS[0];
const fam=p=>familyOf(p?.pattern);
function cancelSolver(){workEpoch++;if(activeWorker){activeWorker.terminate();activeWorker=null;}busy=false;}
function compute(action,args){busy=true;busyText=action==='winningMoves'?'Thinking…':'Checking every defense…';render();return new Promise((resolve,reject)=>{const worker=new Worker(new URL('./solver.js',import.meta.url),{type:'module'});activeWorker=worker;worker.onmessage=({data})=>{worker.terminate();if(activeWorker===worker){activeWorker=null;busy=false;}data.error?reject(new Error(data.error)):resolve(data.result);};worker.onerror=()=>{worker.terminate();if(activeWorker===worker){activeWorker=null;busy=false;}reject(new Error('Chess verification unavailable.'));};worker.postMessage({action,args});});}
function entry(){const k=puzzle.id;if(!progress.records[k])progress.records[k]={solves:0,misses:0,assisted:0,clean:0};return progress.records[k];}
function wrong(){if(puzzle&&!resurfaced.has(puzzle.id)){resurfaced.add(puzzle.id);deck.splice(Math.min(idx+4,deck.length),0,puzzle);}dirty=true;const r=entry();r.misses++;r.last=Date.now();progress.streak=0;fxQueue.push('wrong');save();}
function finish(){if(recorded)return;recorded=true;const r=entry();r.last=Date.now();if(assisted){r.assisted++;progress.streak=0;}else{r.solves++;if(!dirty){r.clean++;progress.streak++;progress.best=Math.max(progress.best,progress.streak);}}save();}
const baseId=p=>p.id.split('~')[0];
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
 for(let i=1;i<a.length;i++){const near=a.slice(Math.max(0,i-4),i).map(baseId);if(near.includes(baseId(a[i]))){const k=a.findIndex((x,j)=>j>i&&!near.includes(baseId(x)));if(k>0)[a[i],a[k]]=[a[k],a[i]];}}
 // gentle ramp: in a fresh deck, lead with a mate in 1
 const f=a.findIndex(p=>p.mateIn===1);if(f>0)a.unshift(a.splice(f,1)[0]);return a;}
function poolFor(key){return key?allPuzzles.filter(p=>fam(p)===key):allPuzzles;}
function collection(){return shuffle(poolFor(patternKey));}
function writeURL(replace=false){const u=new URL(location.href);['mode','collection'].forEach(k=>u.searchParams.delete(k));u.searchParams.set('view',view);if(view==='practice'){patternKey?u.searchParams.set('pattern',patternKey):u.searchParams.delete('pattern');puzzle?u.searchParams.set('puzzle',puzzle.id):u.searchParams.delete('puzzle');}else{u.searchParams.delete('pattern');u.searchParams.delete('puzzle');}history[replace?'replaceState':'pushState']({},'',u);}
const mix=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function pickNames(){const right=fam(puzzle);if(!right)return [];const others=mix(PATTERNS.map(p=>p.key).filter(k=>k!==right)).slice(0,2);return mix([right,...others]);}
function load(index=0,nav=false){
 cancelSolver();
 idx=Math.max(0,Math.min(index,deck.length-1));puzzle=deck[idx];selected=null;legalTargets=[];phase='play';hintLevel=0;hintFrom=null;assisted=false;dirty=false;recorded=false;feedback='';lastMove=null;attempt=null;defenseShown=false;defenseNote='';pendingPromotion=null;line=[];proof=null;named=null;cheer=CHEERS[Math.floor(Math.random()*CHEERS.length)];
 if(puzzle){fen=puzzle.fen;stageFen=fen;const c=new Chess(fen);attacker=c.turn();orientation=attacker;remaining=puzzle.mateIn||1;nameOptions=pickNames();}
 if(nav)writeURL();render();
}
function restoreURL(){const q=new URL(location.href).searchParams;patternKey=patternByKey[q.get('pattern')]?q.get('pattern'):null;const v=q.get('view')==='practice'||q.get('puzzle')?'practice':'patterns';deck=collection();const i=deck.findIndex(p=>p.id===q.get('puzzle'));if(i>0)deck.unshift(deck.splice(i,1)[0]);setView(v,false);load(0);}
function resetStage(){cancelSolver();if(hintLevel>=3)hintLevel=2;fen=stageFen;phase='play';selected=null;legalTargets=[];lastMove=line.length?line[line.length-1]:null;attempt=null;defenseShown=false;defenseNote='';feedback='';pendingPromotion=null;proof=null;render();}
function boardSquares(){const a=[];for(let r=0;r<8;r++)for(let f=0;f<8;f++)a.push(String.fromCharCode(97+(orientation==='w'?f:7-f))+(orientation==='w'?8-r:r+1));return a;}
function renderBoard(){
 if(!puzzle){$('#board').innerHTML='';return;}
 const c=new Chess(fen),target=other(attacker);
 const targets=new Set(legalTargets.map(m=>m.to));const king=c.board().flat().find(p=>p&&p.type==='k'&&p.color===target)?.square;
 const checkedKing=c.inCheck()?c.board().flat().find(p=>p&&p.type==='k'&&p.color===c.turn())?.square:null;
 const mated=phase==='done',canMove=phase==='play'&&!busy&&!pendingPromotion&&c.turn()===attacker;
 const selXY=selected?[selected.charCodeAt(0),Number(selected[1])]:null;
 $('#board').innerHTML=boardSquares().map((sq,i)=>{const p=c.get(sq);const dark=(sq.charCodeAt(0)-97+Number(sq[1]))%2===1;const move=lastMove&&(lastMove.from===sq||lastMove.to===sq);const classes=['square',dark?'dark':'',selected===sq?'selected':'',move?'last':'',hintFrom===sq?'hint-piece':'',canMove&&p&&p.color===attacker?'movable':'',checkedKing===sq?'in-check':'',sq===king?'target-king':'',mated&&sq===king?'mated':'',!mated&&phase==='play'&&sq===king&&checkedKing!==sq?'nervous':'',drag?.started&&drag.sq===sq?'drag-src':''].filter(Boolean).join(' ');const dd=selXY?Math.max(Math.abs(sq.charCodeAt(0)-selXY[0]),Math.abs(Number(sq[1])-selXY[1])):0;return `<button class="${classes}" data-square="${sq}" tabindex="${i===0?0:-1}" aria-label="${sq}${p?', '+colorName(p.color)+' '+names[p.type]:', empty'}" ${selected===sq?'aria-pressed="true"':''}>${i%8===0?`<span class="coord rank">${sq[1]}</span>`:''}${i>=56?`<span class="coord file">${sq[0]}</span>`:''}${p?`<span class="piece">${pieceSvg(p)}</span>`:''}${targets.has(sq)?`<span class="move-dot ${p?'capture':''}" style="--d:${dd*45}ms"></span>`:''}</button>`;}).join('');
 const bar=$('#board-actionbar');const showBar=!busy&&(defenseShown||['done','wrong'].includes(phase))&&!(phase==='done'&&needsName());bar.hidden=!showBar;
 bar.innerHTML=defenseShown?'<button class="secondary" data-action="back-proof">Back ↶</button>':phase==='line'?'<button class="primary" data-action="defend">Their move →</button>':phase==='done'?'<button class="primary" data-action="next">Next →</button>':'<button class="primary" data-action="retry">Try again ↶</button>';
 $('#turn-label').innerHTML=`<span class="turn-dot ${c.turn()==='b'?'black':''}"></span>${phase==='done'?'Checkmate':phase==='line'?colorName(c.turn())+' is thinking…':colorName(c.turn())+' to move'}`;
 $('#position-label').textContent=remaining===2||puzzle.mateIn===2?'mate in 2':'mate in 1';
 $('#square-note').textContent=defenseNote;
 renderPromotion();
}
function renderPromotion(){const el=$('#promotion');el.hidden=!pendingPromotion;if(!pendingPromotion)return;el.innerHTML=`<strong>Promote your pawn</strong><div class="options">${['q','r','b','n'].map(t=>`<button data-promote="${t}" aria-label="Promote to ${names[t]}">${pieceSvg({type:t,color:attacker})}</button>`).join('')}</div><button class="text-button" data-action="cancel-promotion">Cancel</button>`;}
function pony(text){return `<div class="pony-cheer" aria-hidden="true"><img src="../src/assets/opt/pony-idle.png" alt="" width="64" height="64"><span class="bubble">${esc(text)}</span></div>`;}
function moveLine(){return line.length?`<p class="move-line">${line.map(m=>`<span>${esc(m.san)}</span>`).join('')}</p>`:'';}
const chip=(t,k='')=>`<span class="chip ${k}">${t}</span>`;
const needsName=()=>!patternKey&&named===null&&hintLevel<1&&!!fam(puzzle);
function patternReveal(){const k=fam(puzzle);if(!k)return '';const P=patternByKey[k];return `<div class="reveal"><button class="reveal-name" data-open-pattern="${k}">${esc(P.name)} <span aria-hidden="true">↗</span></button><p>${esc(P.line)}</p></div>`;}
function nameQuiz(){return `<p class="quiz-q">Which pattern was that?</p><div class="quiz">${nameOptions.map((k,i)=>`<button class="quiz-opt" data-name="${k}" style="--i:${i}">${esc(patternByKey[k].name)}</button>`).join('')}</div>`;}
function coachHTML(){
 if(!puzzle)return `<div class="empty"><h2>Nothing here yet.</h2></div>`;
 if(busy)return `<h2>${busyText}</h2><div class="thinking" aria-hidden="true"><i></i><i></i><i></i></div><button class="secondary" data-action="retry">Cancel</button>`;
 const k=fam(puzzle),tag=patternKey?'':chip(hintLevel>=1&&k?esc(patternByKey[k].name):'Mystery pattern',hintLevel>=1?'good':'');
 const m2=puzzle.mateIn===2?chip('Mate in 2'):'';
 if(phase==='done'){
  if(needsName())return `${pony(assisted?'we got there.':cheer)}<h2>Checkmate.</h2>${moveLine()}${nameQuiz()}`;
  const namedRight=named&&named===k,namedWrong=named&&named!==k;
  return `${pony(namedRight?'you know it.':namedWrong?'so close.':assisted?'we got there.':cheer)}${named?chip(namedRight?'Spotted ✓':'Not that one','good '+(namedRight?'':'miss')):chip(assisted?'With a hint':dirty?'Found it':'Clean solve',assisted?'':'good')}<h2>${namedWrong?'Close.':'Checkmate.'}</h2>${moveLine()}${patternReveal()}<p class="lesson-line">${esc(puzzle.lesson)}</p><div class="actions"><button class="primary" data-action="next">Next →</button><button class="secondary" data-action="restart">Again ↻</button></div>`;
 }
 if(phase==='line')return `${chip('First move ✓','good')}<h2>Nice.<br>Now they move…</h2>${moveLine()}<div class="thinking" aria-hidden="true"><i></i><i></i><i></i></div>`;
 if(phase==='wrong'){
  const title=proof?.stalemate?'Stalemate.':remaining===2?'They slip away.':proof?.check?'Check, not mate.':'The net’s open.';
  const body=proof?.stalemate?'No check means a draw.':proof?.check&&remaining===1?'The king still has a way out.':remaining===2?'Look for a move that forces it.':'Mate starts with check.';
  return `${chip(esc(attempt?.san||'Hmm'),'miss')}<h2>${title}</h2><p class="short">${body}</p>${defenseShown?'':remaining===2&&attempt?.defenses?.length?`<button class="helper-button" data-action="refute">Show their escape ↗</button>`:''}<div class="actions"><button class="primary" data-action="retry">Try again ↶</button></div>`;
 }
 const P=k?patternByKey[k]:null;
 const hint=hintLevel===1&&P?`<div class="hint-panel"><strong>${esc(P.name)}.</strong> ${esc(P.line)}</div>`:hintLevel>=2?`<div class="hint-panel"><strong>Try the ${esc(names[new Chess(fen).get(hintFrom)?.type]||'glowing piece')} on ${esc(hintFrom)}.</strong></div>`:'';
 const replied=puzzle.mateIn===2&&line.length>=2;
 return `<div class="tags">${replied?chip(`${colorName(other(attacker))} played ${esc(line[line.length-1].san)}`,'miss'):tag}${replied?'':m2}</div><h2>${replied?'Your move.<br>Finish it.':remaining===2?'Set the trap.<br>Then close it.':'One move.<br>No way out.'}</h2>${moveLine()}${feedback?`<div class="feedback" role="status">${esc(feedback)}</div>`:''}${hint}<button class="helper-button" data-action="hint">${hintLevel===0?(patternKey?'Remind me':'Which pattern?'):hintLevel===1?'Which piece?':'Show me'}</button>`;
}
function renderHUD(){
 const st=progress.streak,best=progress.best,sfx=prevStreak===null?'':st>prevStreak?'bump':st<prevStreak?'drop':'';prevStreak=st;
 $('#daily').innerHTML=`<div class="streak ${sfx} ${st>=3?'hot':st>0?'warm':''}" role="img" aria-label="${st} clean in a row, best ${best}"><span class="streak-num">${st}</span><span class="streak-copy"><strong>in a row</strong><small>best ${best}</small></span></div>`;
}
function renderHead(){const t=$('#practice-title');if(!t)return;const P=patternKey&&patternByKey[patternKey];t.textContent=P?P.name:'Mix';}
function render(){
 renderHUD();
 if(view!=='practice')return;
 $('.board-column').hidden=!puzzle;
 const w0=Math.max(0,Math.min(idx-4,deck.length-10)),w1=Math.min(deck.length,w0+10);
 $('#deck-strip').innerHTML=deck.slice(w0,w1).map((p,j)=>{const i=w0+j;const r=progress.records[p.id];const st=!r?'':r.clean?'clean':r.misses?'miss':'done';return `<button class="pip ${st} ${i===idx?'current':''}" data-jump="${i}" aria-label="Position ${i+1}${st?', '+st:''}"${i===idx?' aria-current="true"':''}></button>`;}).join('')+`<span class="deck-count mono">${deck.length?idx+1:0}<span>/${deck.length}</span></span>`;
 $('#previous').disabled=deck.length<2;$('#skip').disabled=deck.length<2;
 renderBoard();$('#coach').innerHTML=coachHTML();$('#storage-warning').hidden=canSave;
 const key=`${puzzle?.id}|${phase}|${remaining}|${busy}|${named}`;if(key!==lastCoachKey){lastCoachKey=key;enterCoach();}
 flushFx();
}
function enterCoach(){
 const el=$('#coach');clearTimeout(enterTimer);el.classList.remove('enter');if(RM())return;
 const h=el.querySelector('h2');if(h){let i=0;const walk=node=>{[...node.childNodes].forEach(ch=>{if(ch.nodeType===3){const frag=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}const w=document.createElement('span');w.className='w';w.style.setProperty('--i',i++);w.textContent=part;frag.appendChild(w);});ch.replaceWith(frag);}else if(ch.nodeType===1&&ch.tagName!=='BR')walk(ch);});};walk(h);}
 void el.offsetWidth;el.classList.add('enter');enterTimer=setTimeout(()=>el.classList.remove('enter'),1100);
}
// ---------- game feel: bursts, stamps, shakes ----------
const CONFETTI=['#748DA6','#9CB4CC','#D3CEDF','#F2D7D9','#465D73','#C98B93'];
function fxLayer(){const shell=$('.board-shell');let l=shell.querySelector('.fx-layer');if(!l){l=document.createElement('div');l.className='fx-layer';shell.appendChild(l);}return l;}
function centerOf(el){const s=$('.board-shell').getBoundingClientRect(),r=el.getBoundingClientRect();return [r.left-s.left+r.width/2,r.top-s.top+r.height/2,r.width];}
function burst(el,count){
 const layer=fxLayer(),[x,y,w]=centerOf(el);
 for(let i=0;i<count;i++){
  const p=document.createElement('i'),size=5+Math.random()*7,shape=Math.random();
  p.className='confetti';p.style.cssText=`left:${x}px;top:${y}px;width:${shape>.72?size*.45:size}px;height:${shape>.72?size*1.7:size}px;background:${CONFETTI[i%CONFETTI.length]};border-radius:${shape<.4?'50%':'2px'}`;
  layer.appendChild(p);
  const a=Math.random()*Math.PI*2,d=w*(1.1+Math.random()*1.9),dx=Math.cos(a)*d,dy=Math.sin(a)*d*.8-w*.6,rot=(Math.random()-.5)*540;
  p.animate([{transform:'translate(-50%,-50%) scale(.3)',opacity:1},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) rotate(${rot*.6}deg) scale(1)`,opacity:1,offset:.45},{transform:`translate(calc(-50% + ${dx*1.15}px),calc(-50% + ${dy+w*1.4}px)) rotate(${rot}deg) scale(.8)`,opacity:0}],{duration:850+Math.random()*450,easing:'cubic-bezier(.2,.7,.35,1)',fill:'forwards'}).onfinish=()=>p.remove();
 }
}
function floatLabel(el,text){const layer=fxLayer(),[x,y,w]=centerOf(el),t=document.createElement('span');t.className='float-label';t.textContent=text;t.style.left=x+'px';t.style.top=(y-w*.35)+'px';layer.appendChild(t);t.animate([{transform:'translate(-50%,0) scale(.6)',opacity:0},{transform:'translate(-50%,-14px) scale(1.08)',opacity:1,offset:.25},{transform:'translate(-50%,-22px) scale(1)',opacity:1,offset:.7},{transform:'translate(-50%,-38px) scale(1)',opacity:0}],{duration:1150,easing:'cubic-bezier(.2,.8,.3,1)',fill:'forwards'}).onfinish=()=>t.remove();}
function sticker(text){const layer=fxLayer(),s=document.createElement('div');s.className='mate-sticker';s.innerHTML=text;layer.appendChild(s);setTimeout(()=>s.remove(),1900);}
function boardPill(html,ms){const layer=fxLayer();layer.querySelectorAll('.board-pill').forEach(p=>p.remove());const p=document.createElement('div');p.className='board-pill';p.setAttribute('role','status');p.innerHTML=html;layer.appendChild(p);setTimeout(()=>{p.classList.add('out');setTimeout(()=>p.remove(),260);},ms);}
function fxMate(lite){
 const k=$('.square.mated'),shell=$('.board-shell');if(!k||!shell)return;
 k.querySelector('.piece')?.animate([{transform:'none'},{transform:'translateY(-24%) rotate(-10deg) scale(1.06)',offset:.3},{transform:'translateY(8%) rotate(84deg)',offset:.72},{transform:'translateY(6%) rotate(78deg)'}],{duration:640,easing:'cubic-bezier(.3,.7,.4,1)'});
 shell.animate([{transform:'scale(1)'},{transform:'scale(.984)',offset:.35},{transform:'scale(1.006)',offset:.7},{transform:'scale(1)'}],{duration:420,delay:300});
 setTimeout(()=>{burst(k,lite?16:30);if(!lite){sticker('checkmate<span>.</span>');floatLabel(k,assisted?'found it':dirty?'+1':'clean +1');}},300);
 try{navigator.vibrate?.(18);}catch(e){}
}
function fxWrong(){
 const shell=$('.board-shell');if(!shell)return;
 shell.animate([{transform:'translateX(0)'},{transform:'translateX(-7px)'},{transform:'translateX(6px)'},{transform:'translateX(-3px)'},{transform:'translateX(0)'}],{duration:340,easing:'ease-out'});
 $('.square.target-king .piece')?.animate([{transform:'none'},{transform:'translateY(-14%) rotate(-9deg)'},{transform:'translateY(-14%) rotate(9deg)'},{transform:'none'}],{duration:480,easing:'cubic-bezier(.3,.7,.4,1)'});
 try{navigator.vibrate?.([8,40,8]);}catch(e){}
}
function flushFx(){
 const q=fxQueue;fxQueue=[];if(RM()||!q.length)return;
 q.forEach(f=>{if(f==='mate'||f==='mate-lite')setTimeout(()=>fxMate(f==='mate-lite'),f==='mate'?300:60);else if(f==='right')setTimeout(()=>{const k=$('.square.target-king')||$('.square.mated');if(k){burst(k,18);}const q=$('.reveal');q&&q.animate([{transform:'scale(.9)'},{transform:'scale(1.04)'},{transform:'none'}],{duration:420,easing:'cubic-bezier(.34,1.5,.64,1)'});},60);else if(f==='wrong')setTimeout(fxWrong,360);});
}

function animateMove(move){
 const dropped=dropMove&&move&&dropMove.from===move.from&&dropMove.to===move.to;dropMove=null;
 if(!move||RM())return;
 const from=$(`[data-square="${move.from}"]`),to=$(`[data-square="${move.to}"]`),piece=to?.querySelector('.piece');
 if(!from||!to||!piece)return;
 if(dropped){piece.animate([{transform:'scale(1.16,.84)'},{transform:'scale(.95,1.06)',offset:.45},{transform:'none'}],{duration:280,easing:'ease-out'});return;}
 const a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),dx=a.x-b.x,dy=a.y-b.y,lift=Math.min(28,b.height*.45);
 piece.animate([{transform:`translate(${dx}px,${dy}px) scale(1)`},{transform:`translate(${dx*.45}px,${dy*.45-lift}px) scale(1.14)`,offset:.45},{transform:'translate(0,0) scale(1.07,.9)',offset:.82},{transform:'translate(0,0) scale(1)'}],{duration:380,easing:'cubic-bezier(.3,.7,.4,1)'});
}
function focusSquare(sq){const b=$(`[data-square="${sq}"]`);if(b){$$('[data-square]').forEach(el=>el.tabIndex=el===b?0:-1);b.focus({preventScroll:true});}}
function chooseSquare(sq){
 if(!puzzle||pendingPromotion||busy||phase!=='play')return;
 const c=new Chess(fen),piece=c.get(sq);
 if(selected&&tryMoveTo(sq))return;
 if(piece&&piece.color===attacker&&c.turn()===attacker){selected=selected===sq?null:sq;legalTargets=selected?c.moves({square:selected,verbose:true}):[];feedback='';if(selected)sfx.pick();render();focusSquare(sq);return;}
 if(selected){selected=null;legalTargets=[];render();}
}
function tryMoveTo(sq){const moves=legalTargets.filter(m=>m.to===sq);if(!selected||!moves.length)return false;if(moves.some(m=>m.promotion)){pendingPromotion={from:selected,to:sq};renderPromotion();$('#promotion button[data-promote]').focus();return true;}playMove({from:selected,to:sq});return true;}
async function playMove(move){
 if(phase!=='play'||busy)return;const epoch=workEpoch;
 let result;
 try{result=remaining===2?await compute('assessMove',[fen,move,remaining]):assessMove(fen,move,remaining);}catch(e){if(epoch!==workEpoch)return;busy=false;feedback='That move couldn’t be checked. Try again.';render();return;}if(epoch!==workEpoch)return;
 if(!result.legal){feedback='That isn’t a legal move here.';render();return;}
 {const dl=dropMove?0:250;const cap=/x/.test(result.san);setTimeout(()=>sfx[cap?'capture':'move'](),dl);if(result.mate){setTimeout(()=>sfx.mate(progress.streak+1),dl+320);setTimeout(()=>sfx.pop(),dl+900);}else if(!(result.winning&&remaining===2))setTimeout(()=>sfx.wrong(),dl+180);}
 attempt=result;fen=result.fen;lastMove={...move,san:result.san};selected=null;legalTargets=[];pendingPromotion=null;hintFrom=null;proof=inspectCheck(fen);
 if(result.mate){phase='done';line.push(lastMove);finish();fxQueue.push('mate');}
 else if(result.winning&&remaining===2){phase='line';line.push(lastMove);const ep=workEpoch;setTimeout(()=>{if(ep===workEpoch&&phase==='line')boardPill(`<span class="pill-dots"><i></i><i></i><i></i></span>${colorName(other(attacker))} is thinking`,900);},450);setTimeout(()=>{if(ep===workEpoch&&phase==='line')defend();},1450);}
 else {phase='wrong';wrong();}
 render();animateMove(lastMove);focusSquare(lastMove.to);
}
function defend(){
 if(phase!=='line'||!attempt?.replyFen)return;
 const rs=attempt.reply?.san||'';setTimeout(()=>sfx[/x/.test(rs)?'capture':'move'](),250);setTimeout(()=>boardPill(`${colorName(other(attacker))} played <b>${esc(rs||'')}</b>. Your move.`,1900),380);fen=attempt.replyFen;lastMove=attempt.reply;line.push(lastMove);stageFen=fen;remaining=1;phase='play';hintLevel=Math.min(hintLevel,1);hintFrom=null;attempt=null;
 render();animateMove(lastMove);
}
async function hint(){
 if(!puzzle||phase!=='play'||busy)return;const epoch=workEpoch;assisted=true;
 hintLevel++;sfx.hint();
 if(hintLevel===1&&fam(puzzle)){render();return;}
 if(hintLevel===1)hintLevel=2;
 let moves;try{moves=await compute('winningMoves',[fen,remaining]);}catch(e){if(epoch!==workEpoch)return;busy=false;feedback='The hint couldn’t be checked. Try again.';render();return;}if(epoch!==workEpoch)return;
 if(!moves.length){feedback='No solution found. Try the next one.';render();return;}
 if(hintLevel===2){hintFrom=moves[0].from;render();return;}
 playMove(moves[0]);
}
function nameIt(k){if(phase!=='done'||named)return;named=k;const right=k===fam(puzzle);right?sfx.right():sfx.miss();if(right){fxQueue.push('right');}else{try{navigator.vibrate?.([8,40,8]);}catch(e){}}render();}
function next(delta=1){if(!deck.length)return;sfx.next();let i=idx+delta;if(i>=deck.length){const cur=puzzle;deck=collection();if(deck.length>1&&cur&&baseId(deck[0])===baseId(cur))deck.push(deck.shift());i=0;}if(i<0)i=deck.length-1;load(i,true);if(matchMedia('(max-width:660px)').matches)document.querySelector('.board-meta').scrollIntoView({block:'start',behavior:smooth()});}
function action(name){
 if(name==='next')next();
 if(name==='retry')resetStage();
 if(name==='refute'&&attempt?.defenses?.length){const m=attempt.defenses[0];setTimeout(()=>sfx.move(),250);fen=m.fen;lastMove=m;defenseShown=true;defenseNote=m.san+' gets away.';render();animateMove(m);}
 if(name==='hint')hint();
 if(name==='defend')defend();
 if(name==='restart')load(idx);
 if(name==='cancel-promotion'){pendingPromotion=null;renderPromotion();focusSquare(selected);}
 if(name==='back-proof'){fen=attempt?.fen||stageFen;lastMove=attempt?{from:attempt.from,to:attempt.to,san:attempt.san}:null;defenseShown=false;defenseNote='';render();}
 if(name==='mix')practice(null);
 if(name==='back'){const k=patternKey;setView('patterns',true);if(k)openCard(k);}
}
$('#app').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(!b.dataset.square&&!b.dataset.name&&b.dataset.action!=='hint'&&b.dataset.action!=='next'&&b.dataset.action!=='defend')sfx.tap();
 if(b.dataset.square){if(performance.now()<suppressUntil)return;chooseSquare(b.dataset.square);}
 else if(b.dataset.action)action(b.dataset.action);
 else if(b.dataset.practice!==undefined){practice(b.dataset.practice||null);}
 else if(b.dataset.name){nameIt(b.dataset.name);}
 else if(b.dataset.openPattern){setView('patterns',true);openCard(b.dataset.openPattern);}
 else if(b.dataset.demoReplay){startDemo(b.closest('.mini'),true);}
 else if(b.dataset.jump!==undefined){load(Number(b.dataset.jump),true);}
 else if(b.dataset.promote&&pendingPromotion){const move={...pendingPromotion,promotion:b.dataset.promote};pendingPromotion=null;playMove(move);}
});
$('#previous').addEventListener('click',()=>next(-1));$('#skip').addEventListener('click',()=>next());
$('#board').addEventListener('keydown',e=>{const sq=e.target.closest('[data-square]')?.dataset.square;if(!sq)return;if(e.key==='Escape'){selected=null;legalTargets=[];render();focusSquare(sq);return;}const directions={ArrowUp:-8,ArrowDown:8,ArrowLeft:-1,ArrowRight:1};if(!(e.key in directions))return;e.preventDefault();const squares=boardSquares(),n=squares.indexOf(sq),offset=directions[e.key];if(offset===-1&&n%8===0||offset===1&&n%8===7)return;const target=squares[n+offset];if(target)focusSquare(target);});
$('#promotion').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();action('cancel-promotion');}});
const dialog=$('#how-dialog');$('#how-open').addEventListener('click',()=>dialog.showModal());$('#how-close').addEventListener('click',()=>dialog.close());$('#how-start').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
// ---------- views ----------
function setView(v,push){
 view=v;$('#practice-view').hidden=v!=='practice';$('#patterns-view').hidden=v!=='patterns';
 $$('.views button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===v)));
 if(v==='patterns'){buildPatterns();observeDemos(true);}else{observeDemos(false);renderHead();}
 if(push){writeURL();window.scrollTo({top:0,behavior:smooth()});}
 if(v==='practice'&&puzzle)render();
}
function practice(key){patternKey=key;deck=collection();setView('practice',false);load(0,true);window.scrollTo({top:0,behavior:smooth()});}
function openCard(key){requestAnimationFrame(()=>{const c=$(`#pat-${key}`);if(!c)return;c.scrollIntoView({block:'center',behavior:smooth()});c.classList.remove('flash');void c.offsetWidth;c.classList.add('flash');});}
let patternsBuilt=false;
function buildPatterns(){
 if(patternsBuilt)return;patternsBuilt=true;
 $('#patterns-view').innerHTML=`<div class="pat-head"><h2>15 ways to checkmate<span>.</span></h2><button class="primary" data-practice="">Mix them all →</button></div><div class="pat-grid">${PATTERNS.map((p,i)=>`<article class="pat-card" id="pat-${p.key}" style="--i:${i}"><div class="pat-top"><span class="pat-num mono">${String(i+1).padStart(2,'0')}</span><h3>${esc(p.name)}</h3></div><div class="mini" data-demo="${p.key}" role="img" aria-label="${esc(p.name)} example"><div class="mini-board"></div><button class="mini-replay" data-demo-replay="1" aria-label="Replay ${esc(p.name)}">↻</button></div><p class="pat-line">${esc(p.line)}</p><div class="pat-foot"><div class="pat-pieces" aria-hidden="true">${p.pieces.map(t=>`<span>${pieceSvg({type:t,color:'w'})}</span>`).join('')}</div><button class="primary pat-go" data-practice="${p.key}">Practice <span class="count">${countFor(p.key)*4}</span></button></div><p class="pat-origin">${esc(p.origin)}</p></article>`).join('')}</div>`;
 $$('.mini').forEach(el=>{const p=demoFor(el.dataset.demo);el.querySelector('.mini-board').innerHTML=miniHTML(p.fen,new Chess(p.fen).turn());});
}
function miniHTML(fen,orient,marks={}){
 const c=new Chess(fen);let out='';
 for(let r=0;r<8;r++)for(let f=0;f<8;f++){const sq=String.fromCharCode(97+(orient==='w'?f:7-f))+(orient==='w'?8-r:r+1);const p=c.get(sq);const dark=(sq.charCodeAt(0)-97+Number(sq[1]))%2===1;
  out+=`<div class="msq ${dark?'dark':''} ${marks[sq]||''}" data-sq="${sq}">${p?`<span class="pc">${pieceSvg(p)}</span>`:''}</div>`;}
 return out;
}
let demoObs=null;
function observeDemos(on){
 if(!on){demoObs?.disconnect();$$('.mini').forEach(stopDemo);return;}
 if(!demoObs)demoObs=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?startDemo(e.target):stopDemo(e.target)),{threshold:.45});
 $$('.mini').forEach(el=>demoObs.observe(el));
}
function stopDemo(el){(el._t||[]).forEach(clearTimeout);el._t=[];el._on=false;}
function startDemo(el,force){
 if(!el||(el._on&&!force))return;stopDemo(el);el._on=true;
 const p=demoFor(el.dataset.demo),c=new Chess(p.fen),o=c.turn(),mv=c.move(p.solutions[0]),after=c.fen(),ac=new Chess(after);
 const target=ac.board().flat().find(x=>x&&x.type==='k'&&x.color===ac.turn())?.square;
 const b=el.querySelector('.mini-board'),T=(fn,ms)=>el._t.push(setTimeout(fn,ms));
 if(RM()){b.innerHTML=miniHTML(after,o,{[mv.from]:'from',[mv.to]:'to',[target]:'mk mated'});return;}
 const cycle=()=>{
  b.innerHTML=miniHTML(p.fen,o);
  T(()=>{b.querySelector(`[data-sq="${mv.from}"]`)?.classList.add('lift');b.querySelector(`[data-sq="${mv.to}"]`)?.classList.add('aim');},700);
  T(()=>{const f=b.querySelector(`[data-sq="${mv.from}"]`),t=b.querySelector(`[data-sq="${mv.to}"]`),pc=f?.querySelector('.pc');if(!pc||!t)return;const a=f.getBoundingClientRect(),z=t.getBoundingClientRect();pc.animate([{transform:'translate(0,0) scale(1.12)'},{transform:`translate(${(z.x-a.x)*.5}px,${(z.y-a.y)*.5-z.height*.5}px) scale(1.2)`,offset:.5},{transform:`translate(${z.x-a.x}px,${z.y-a.y}px) scale(1)`}],{duration:520,easing:'cubic-bezier(.3,.7,.4,1)',fill:'forwards'});},1300);
  T(()=>{b.innerHTML=miniHTML(after,o,{[mv.from]:'from',[mv.to]:'to land',[target]:'mk'});},1840);
  T(()=>{b.innerHTML=miniHTML(after,o,{[mv.from]:'from',[mv.to]:'to',[target]:'mk mated'});},2200);
  T(cycle,4800);
 };
 cycle();
}

// ---------- drag and drop (tap-tap still works) ----------
$('#board').addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 const el=e.target.closest('.square.movable');if(!el)return;
 drag={sq:el.dataset.square,x:e.clientX,y:e.clientY,id:e.pointerId,started:false,ghost:null,over:null};
});
document.addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==drag.id)return;
 if(!drag.started){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<7)return;
  const c=new Chess(fen),p=c.get(drag.sq);if(!p){drag=null;return;}
  drag.started=true;const r=$(`[data-square="${drag.sq}"]`).getBoundingClientRect();drag.w=r.width;
  if(selected!==drag.sq){sfx.pick();selected=drag.sq;legalTargets=c.moves({square:selected,verbose:true});feedback='';squareNote='';render();}else renderBoard();
  const g=document.createElement('div');g.className='drag-ghost';g.innerHTML=pieceSvg(p);g.style.width=g.style.height=r.width+'px';document.body.appendChild(g);drag.ghost=g;document.body.classList.add('is-dragging');
 }
 e.preventDefault();
 drag.ghost.style.transform=`translate(${e.clientX-drag.w/2}px,${e.clientY-drag.w*.62}px) scale(1.18)`;
 const over=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-square]')?.dataset.square||null;
 if(over!==drag.over){$('.square.drag-over')?.classList.remove('drag-over');drag.over=over;if(over&&legalTargets.some(m=>m.to===over))$(`[data-square="${over}"]`)?.classList.add('drag-over');}
},{passive:false});
function endDrag(e,cancel){
 if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;
 if(!d.started)return;
 suppressUntil=performance.now()+350;document.body.classList.remove('is-dragging');
 const target=cancel?null:document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-square]')?.dataset.square;
 if(target&&target!==d.sq&&legalTargets.some(m=>m.to===target)){d.ghost.remove();dropMove={from:d.sq,to:target};if(!tryMoveTo(target))renderBoard();else if(pendingPromotion)renderBoard();return;}
 const home=$(`[data-square="${d.sq}"]`)?.getBoundingClientRect();
 if(home&&!RM()){const anim=d.ghost.animate([{transform:d.ghost.style.transform},{transform:`translate(${home.left}px,${home.top}px) scale(1)`}],{duration:260,easing:'cubic-bezier(.34,1.45,.64,1)',fill:'forwards'});anim.onfinish=()=>{d.ghost.remove();renderBoard();};}
 else{d.ghost.remove();renderBoard();}
}
document.addEventListener('pointerup',e=>endDrag(e,false));document.addEventListener('pointercancel',e=>endDrag(e,true));
(()=>{const h=$('h1');if(!h)return;let i=0;const walk=n=>[...n.childNodes].forEach(c=>{if(c.nodeType===3){const f=document.createDocumentFragment();[...c.textContent].forEach(ch=>{const s=document.createElement('span');s.className='ch';s.style.setProperty('--i',i++);s.textContent=ch;if(ch===' ')s.innerHTML='&nbsp;';f.appendChild(s);});c.replaceWith(f);}else walk(c);});h.setAttribute('aria-label',h.textContent);walk(h);[...h.querySelectorAll('.ch')].forEach(s=>s.setAttribute('aria-hidden','true'));h.addEventListener('pointerover',e=>{const c=e.target.closest('.ch');if(!c||RM())return;c.classList.remove('hop');void c.offsetWidth;c.classList.add('hop');});})();
document.addEventListener('pointerdown',()=>sfx.unlock(),{once:true,capture:true});
const sndBtn=$('#sound-toggle');const paintSnd=()=>{sndBtn.setAttribute('aria-pressed',String(sfx.on));sndBtn.setAttribute('aria-label',sfx.on?'Sound on. Turn off':'Sound off. Turn on');sndBtn.classList.toggle('off',!sfx.on);};
sndBtn.addEventListener('click',()=>{sfx.toggle();paintSnd();sndBtn.classList.remove('boing');void sndBtn.offsetWidth;sndBtn.classList.add('boing');});paintSnd();
window.addEventListener('popstate',restoreURL);
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{const p=JSON.parse(e.newValue);if(p.records){progress={...progress,...p};render();}}catch(err){}}});
restoreURL();writeURL(true);
