import {Chess, kingBox, inspectCheck, assessMove, matingMoves, winningMoves} from './rules.js';
import {puzzles, verdicts} from './puzzles.js';

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={p:'pawn',n:'knight',b:'bishop',r:'rook',q:'queen',k:'king'};
const other=c=>c==='w'?'b':'w', colorName=c=>c==='w'?'White':'Black';
const paths={
 p:'<circle cx="24" cy="12" r="6"/><path d="M20 18h8l-1 10 6 7H15l6-7z"/><path d="M14 35h20l2 6H12z"/>',
 r:'<path d="M13 7h6v6h5V7h5v6h5V7h4v13l-6 4v11H17V24l-6-4V7z"/><path d="M14 35h21l2 6H12z"/><path d="M17 23h15" fill="none"/>',
 b:'<path d="M24 6c-3 4-10 9-10 15 0 4 3 7 7 8l-5 6h16l-5-6c4-1 7-4 7-8 0-6-7-11-10-15z"/><path d="M26 13l-5 8" fill="none"/><path d="M14 35h20l2 6H12z"/>',
 n:'<path d="M14 35c-1-7 4-13 10-16l-8 3-5-4 7-9 3-4 3 5c12-1 15 10 12 25z"/><path d="M14 35h22l2 6H12z"/><path d="M29 16c5 5 3 11 0 14" fill="none"/><circle cx="22" cy="14" r="1" fill="currentColor" stroke="none"/>',
 q:'<path d="M11 15l6 18h14l6-18-9 8-4-12-5 12z"/><circle cx="10" cy="12" r="3"/><circle cx="24" cy="8" r="3"/><circle cx="38" cy="12" r="3"/><path d="M16 33h16l4 8H12z"/><path d="M16 36h16" fill="none"/>',
 k:'<path d="M24 3v10M20 7h8" fill="none"/><path d="M24 15c-5-7-15-4-14 3 0 5 5 9 7 15h14c2-6 7-10 7-15 1-7-9-10-14-3z"/><path d="M16 33h16l4 8H12z"/><path d="M16 36h16" fill="none"/>'
};
function pieceSvg(p){return `<svg viewBox="0 0 48 48" aria-hidden="true" fill="${p.color==='w'?'#FFFEFF':'#465268'}" stroke="${p.color==='w'?'#465268':'#282E3B'}" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" style="color:${p.color==='w'?'#465268':'#F8F7FA'}">${paths[p.type]}</svg>`;}
const KEY='studio-mate-spotted-v1';
let progress={records:{},days:{}},canSave=true;
try {const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved&&typeof saved.records==='object'&&saved.records&&typeof saved.days==='object'&&saved.days)progress=saved;}catch(e){canSave=false;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(progress));}catch(e){canSave=false;}$('#storage-warning').hidden=canSave;}
function day(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
let mode='1',filter='all',deck=[],idx=0,puzzle,fen,baseFen,stageFen,orientation='w',attacker='w',remaining=1;
let selected=null,legalTargets=[],phase='play',boxOn=false,boxInfo=[],squareNote='',hintLevel=0,hintFrom=null,assisted=false,dirty=false,recorded=false;
let feedback='',lastMove=null,attempt=null,proof=null,proofFen=null,expanded=null,defenseShown=false,pendingPromotion=null,line=[],verdictChoice=null;
let busy=false,activeWorker=null,workEpoch=0,busyText='';
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const CHEERS=['checkmate!','no way out.','that’s the one.','gg, king.','clean.'];
let lastCoachKey='',enterTimer=0,prevDots=null,prevStreak=null,dropMove=null,suppressUntil=0,drag=null,fxQueue=[],cheer=CHEERS[0];
progress.streak=Number(progress.streak)||0;progress.best=Number(progress.best)||0;
function cancelSolver(){workEpoch++;if(activeWorker){activeWorker.terminate();activeWorker=null;}busy=false;}
function compute(action,args){busy=true;busyText=action==='winningMoves'?'Finding a forcing move…':'Checking every defense…';render();return new Promise((resolve,reject)=>{const worker=new Worker(new URL('./solver.js',import.meta.url),{type:'module'});activeWorker=worker;worker.onmessage=({data})=>{worker.terminate();if(activeWorker===worker){activeWorker=null;busy=false;}data.error?reject(new Error(data.error)):resolve(data.result);};worker.onerror=()=>{worker.terminate();if(activeWorker===worker){activeWorker=null;busy=false;}reject(new Error('Chess verification unavailable.'));};worker.postMessage({action,args});});}
const getKey=()=>`${mode}:${puzzle.id}`;
function entry(){const k=getKey();if(!progress.records[k])progress.records[k]={solves:0,misses:0,assisted:0,clean:0};return progress.records[k];}
function wrong(){dirty=true;const r=entry();r.misses++;r.last=Date.now();progress.streak=0;fxQueue.push('wrong');save();}
function finish(revealed=false){if(recorded)return;recorded=true;const r=entry();r.last=Date.now();if(revealed||assisted){r.assisted++;progress.streak=0;}else r.solves++;if(!revealed&&!assisted&&!dirty){r.clean++;progress.streak++;progress.best=Math.max(progress.best,progress.streak);const d=day();progress.days[d]=Array.isArray(progress.days[d])?progress.days[d]:[];if(!progress.days[d].includes(getKey()))progress.days[d].push(getKey());}save();}
function collection(){const source=mode==='judge'?verdicts:puzzles.filter(p=>p.mateIn===Number(mode));return source.filter(p=>{const r=progress.records[`${mode}:${p.id}`];return filter==='review'?r&&(r.misses>0||r.assisted>0):filter==='new'?!r: true;});}
function writeURL(replace=false){const u=new URL(location.href);u.searchParams.set('mode',mode);if(puzzle)u.searchParams.set('puzzle',puzzle.id);else u.searchParams.delete('puzzle');u.searchParams.set('collection',filter);history[replace?'replaceState':'pushState']({},'',u);}
function load(index=0,nav=false){
 cancelSolver();
 idx=Math.max(0,Math.min(index,deck.length-1));puzzle=deck[idx];selected=null;legalTargets=[];phase='play';boxOn=false;squareNote='';hintLevel=0;hintFrom=null;assisted=false;dirty=false;recorded=false;feedback='';lastMove=null;attempt=null;proof=null;proofFen=null;expanded=null;defenseShown=false;pendingPromotion=null;line=[];verdictChoice=null;cheer=CHEERS[Math.floor(Math.random()*CHEERS.length)];
 if(puzzle){fen=puzzle.fen;baseFen=fen;stageFen=fen;const c=new Chess(fen);attacker=mode==='judge'?other(c.turn()):c.turn();orientation=attacker;remaining=puzzle.mateIn||1;}
 if(nav)writeURL();render();
}
function restoreURL(){const q=new URL(location.href).searchParams;mode=['1','2','judge'].includes(q.get('mode'))?q.get('mode'):'1';filter=['all','review','new'].includes(q.get('collection'))?q.get('collection'):'all';deck=collection();load(Math.max(0,deck.findIndex(p=>p.id===q.get('puzzle'))));}
function resetStage(){cancelSolver();if(hintLevel>=2&&!hintFrom)hintLevel=1;fen=stageFen;phase='play';selected=null;legalTargets=[];lastMove=line.length?line[line.length-1]:null;attempt=null;proof=null;proofFen=null;expanded=null;defenseShown=false;feedback='';squareNote='';pendingPromotion=null;render();}
function boardSquares(){const a=[];for(let r=0;r<8;r++)for(let f=0;f<8;f++)a.push(String.fromCharCode(97+(orientation==='w'?f:7-f))+(orientation==='w'?8-r:r+1));return a;}
function renderBoard(){
 if(!puzzle){$('#board').innerHTML='';return;}
 const c=new Chess(fen), target=other(attacker);boxInfo=kingBox(fen,target);
 const targets=new Set(legalTargets.map(m=>m.to));const king=c.board().flat().find(p=>p&&p.type==='k'&&p.color===target)?.square;
 const checkedKing=c.inCheck()?c.board().flat().find(p=>p&&p.type==='k'&&p.color===c.turn())?.square:null;
 const mated=phase==='done'||(mode==='judge'&&phase==='judged'&&proof?.mate);
 const canMove=mode!=='judge'&&phase==='play'&&!busy&&!pendingPromotion&&c.turn()===attacker;
 const selXY=selected?[selected.charCodeAt(0),Number(selected[1])]:null;
 $('#board').innerHTML=boardSquares().map((sq,i)=>{const p=c.get(sq),mark=boxOn?boxInfo.find(x=>x.square===sq):null;const dark=(sq.charCodeAt(0)-97+Number(sq[1]))%2===1;const move=lastMove&&(lastMove.from===sq||lastMove.to===sq);const classes=['square',dark?'dark':'',selected===sq?'selected':'',move?'last':'',hintFrom===sq?'hint-piece':'',canMove&&p&&p.color===attacker?'movable':'',checkedKing===sq?'in-check':'',sq===king?'target-king':'',mated&&sq===king?'mated':'',!mated&&phase==='play'&&sq===king&&checkedKing!==sq?'nervous':'',drag?.started&&drag.sq===sq?'drag-src':''].filter(Boolean).join(' ');const dd=selXY?Math.max(Math.abs(sq.charCodeAt(0)-selXY[0]),Math.abs(Number(sq[1])-selXY[1])):0;return `<button class="${classes}" data-square="${sq}" tabindex="${i===0?0:-1}" aria-label="${sq}${p?', '+colorName(p.color)+' '+names[p.type]:', empty'}${mark?', '+mark.status:''}" ${selected===sq?'aria-pressed="true"':''}>${i%8===0?`<span class="coord rank">${sq[1]}</span>`:''}${i>=56?`<span class="coord file">${sq[0]}</span>`:''}${mark?`<span class="box-mark ${mark.status}"><span class="box-symbol">${mark.status==='covered'?'•':mark.status==='blocked'?'×':'○'}</span></span>`:''}${boxOn&&king===sq?'<span class="king-target"></span>':''}${p?`<span class="piece">${pieceSvg(p)}</span>`:''}${targets.has(sq)?`<span class="move-dot ${p?'capture':''}" style="--d:${dd*45}ms"></span>`:''}</button>`;}).join('');
 $('#board-actionbar').hidden=busy||(!defenseShown&&!['done','wrong','line'].includes(phase)&&!(mode==='judge'&&phase==='play'));$('#board-actionbar').innerHTML=defenseShown?'<button class="secondary" data-action="back-proof">Back to the check ↶</button>':mode==='judge'&&phase==='play'?'<button class="primary" data-verdict="mate">It’s checkmate</button><button class="secondary" data-verdict="not">Not mate</button>':phase==='line'?'<button class="primary" data-action="defend">Play the defense →</button>':'<button class="secondary" data-action="see-proof">'+(phase==='done'?'Checkmate. See why ↓':'Not mate. See why ↓')+'</button>';
 $('#turn-label').innerHTML=`<span class="turn-dot ${c.turn()==='b'?'black':''}"></span>${phase==='done'?'Checkmate':mode==='judge'&&phase==='judged'?(proof.mate?'Checkmate':'Check, not mate'):mode==='judge'?'Inspect the checked king':colorName(c.turn())+' to move'}`;
 $('#position-label').textContent=`${String(idx+1).padStart(2,'0')} / ${String(deck.length).padStart(2,'0')}`;
 $('#box-toggle').setAttribute('aria-pressed',String(boxOn));$('#box-legend').hidden=!boxOn;
 $('#square-note').textContent=squareNote||(boxOn?'Tap a marked square to see what closes it off.':'Tap a piece, then its destination.');
 if(mode==='judge'&&!boxOn&&!squareNote)$('#square-note').textContent='No moves needed. Is this check already checkmate?';
 renderPromotion();
}
function renderPromotion(){const el=$('#promotion');el.hidden=!pendingPromotion;if(!pendingPromotion)return;el.innerHTML=`<strong>Promote your pawn</strong><div class="options">${['q','r','b','n'].map(t=>`<button data-promote="${t}" aria-label="Promote to ${names[t]}">${pieceSvg({type:t,color:attacker})}</button>`).join('')}</div><button class="text-button" data-action="cancel-promotion">Cancel</button>`;}
const explanation={escape:'Can the king make a legal move, including capturing the checking piece?',capture:'Can a piece other than the king legally capture the checker?',block:'Can a defender legally move between the checking piece and the king?'};
function checklist(){return `<div class="checklist">${['escape','capture','block'].map((key,i)=>{const replies=proof?.[key]||[];const available=!!proof&&proof.check;const open=expanded===key;return `<div class="check-row ${available?(replies.length?'yes':'no'):''}"><button data-proof="${key}" aria-expanded="${open}"><span class="row-label"><span class="step-num">0${i+1}</span>${key[0].toUpperCase()+key.slice(1)}</span><span class="row-state">${available?(replies.length?`${replies.length} legal ${replies.length===1?'reply':'replies'} ↗`:'None ✓'):'Check this'} ${open?'−':'+'}</span></button>${open?`<div class="row-detail"><p>${explanation[key]}</p>${available?(replies.length?`<div class="response-chips">${replies.map((m,n)=>`<button data-reply="${key}:${n}" aria-label="Play defense ${esc(m.san)}">${esc(m.san)} ↗</button>`).join('')}</div>`:'No legal reply of this kind.'): 'Try a checking move to test it.'}</div>`:''}</div>`;}).join('')}</div>${proof?.check?'<p class="proof-caption">Every legal reply is checked. King captures are included under Escape.</p>':''}`;}
function pony(text){return `<div class="pony-cheer" aria-hidden="true"><img src="../src/assets/opt/pony-idle.png" alt="" width="64" height="64"><span class="bubble">${esc(text)}</span></div>`;}
function lesson(){return `<div class="lesson"><h3>${esc(puzzle.pattern||'What to notice')}</h3><p>${esc(puzzle.lesson)}</p></div>`;}
function moveLine(){return line.length?`<p class="mono">${line.map(m=>esc(m.san)).join(' · ')}</p>`:'';}
function coachHTML(){
 if(!puzzle)return `<div class="empty"><h2>${filter==='review'?'Nothing to revisit.':'All caught up.'}</h2><p>${filter==='review'?'Missed and assisted positions will collect here.':'There are no untried positions in this set.'}</p><button class="primary" data-action="all">Show all positions →</button></div>`;
 if(busy)return `<p class="eyebrow">The full legal-move test</p><h2>${busyText}</h2><p>Checking all legal replies, including captures and blocks. The board will be ready in a moment.</p><button class="secondary" data-action="retry">Cancel</button>`;
 if(mode==='judge'&&phase==='play')return `<p class="eyebrow">The verification drill</p><h2>Mate. Or just check?</h2><p>${colorName(new Chess(fen).turn())} is in check. Before you decide, look for <strong>escape, capture, and block</strong>.</p><div class="actions"><button class="primary" data-verdict="mate">It’s checkmate</button><button class="secondary" data-verdict="not">Not mate</button></div><button class="helper-button" data-action="hint">${boxOn?'Inspect an escape square':'Show the king’s box'}</button>${checklist()}`;
 if(mode==='judge'){
 const yes=verdictChoice===puzzle.answer;
 return `${yes?pony(proof.mate?'good eye.':'yep. still breathing.'):''}<p class="eyebrow">${yes?'Good eye':'The detail to catch'}</p><h2>${proof.mate?'Nowhere to go.':'There’s still a way out.'}</h2><p>${yes?'You spotted it. ': 'Not quite. '}${proof.mate?'The king is in check and every legal defense is ruled out.':'A check is only mate when every defense fails. Open a row below and play a legal reply.'}</p>${defenseShown?'<div class="feedback">Defense played on the board. <button class="helper-button" data-action="back-proof">Back to the check</button></div>':''}${checklist()}${lesson()}<div class="actions"><button class="primary" data-action="next">Next position →</button></div>`;
 }
 if(phase==='done')return `${pony(assisted?'we got there.':cheer)}<p class="eyebrow">${assisted?'Pattern revealed':dirty?'Found it':'Clean solve'}</p><h2>That’s checkmate.</h2>${moveLine()}<p>${assisted?'Trace what each piece controls. Then try it again without the hint.':'Not just a check. No escape, no capture, no block.'}</p>${checklist()}${lesson()}<div class="actions"><button class="primary" data-action="next">Next position →</button><button class="secondary" data-action="restart">Try again</button></div>`;
 if(phase==='line')return `<p class="eyebrow">First move found</p><h2>One more move.</h2>${moveLine()}<p>That move forces mate against every legal defense. Let’s play one of them. Can you finish the pattern?</p><div class="actions"><button class="primary" data-action="defend">Play the defense →</button></div>${checklist()}`;
 if(phase==='wrong'){
 const isCheck=proof?.check;
 const title=proof?.stalemate?'No moves. But no check.':isCheck?'Check isn’t always mate.':'The net isn’t closed.';
 const body=proof?.stalemate?'That is stalemate: a draw, not checkmate. The king must actually be in check.':isCheck?(remaining===2?'This check doesn’t force mate within two moves against every defense. The rows below show legal replies to the check.':'There’s a legal defense. Use the three-part test to see what you missed.'):remaining===2?'That move doesn’t force mate within two moves against every defense. Try another way to close the net.':'That move doesn’t check the king. Checkmate has to start with check.';
 return `<p class="eyebrow">${esc(attempt?.san||'Try again')}</p><h2>${title}</h2><p>${body}</p>${defenseShown?'<div class="feedback">Defense played. <button class="helper-button" data-action="back-proof">Back to the check</button></div>':''}${remaining===2&&attempt?.defenses?.length?`<div class="hint-panel"><strong>${esc(attempt.defenses[0].san)}</strong> avoids mate on your next move.<br><button class="helper-button" data-action="refute">Play that defense ↗</button></div>`:''}${isCheck?checklist():''}<div class="actions"><button class="primary" data-action="retry">Try another move ↶</button></div>`;
 }
 const hint=hintLevel?`<div class="hint-panel">${hintLevel===1?'<strong>Start with the king’s box.</strong> Tap a marked square. Look for a check that leaves no legal escape, capture, or block.':`<strong>Start with the ${esc(names[new Chess(fen).get(hintFrom)?.type]||'highlighted piece')} on ${esc(hintFrom)}.</strong> Which move makes the net complete?`}</div>`:'';
 return `<p class="eyebrow">${colorName(attacker)} to move${line.length?' · Finish the line':''}</p><h2>${remaining===2?'Set the trap.<br>Then close it.':'One move.<br>No way out.'}</h2>${moveLine()}<p>${remaining===2?'Find a move that forces checkmate on your next turn, whatever the defense.':'Find checkmate. Tap a piece, then its destination.'}</p>${feedback?`<div class="feedback" role="status">${esc(feedback)}</div>`:''}${hint}<button class="helper-button" data-action="hint">${hintLevel===0?'Need a nudge?':hintLevel===1?'Which piece should I look at?':'Show the move'}</button>${checklist()}<p class="proof-caption">The habit: check every check. Then rule out all three defenses.</p>`;
}
function render(){
 $('.board-column').hidden=!puzzle;$('.play-layout').classList.toggle('is-empty',!puzzle);
 $$('.modes button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));$('#filter').value=filter;
 const n=(Array.isArray(progress.days[day()])?progress.days[day()]:[]).length,st=progress.streak,best=progress.best;
 const popDot=prevDots!==null&&n>prevDots?n-1:-1,sfx=prevStreak===null?'':st>prevStreak?'bump':st<prevStreak?'drop':'';prevDots=n;prevStreak=st;
 $('#daily').innerHTML=`<div class="streak ${sfx} ${st>=3?'hot':st>0?'warm':''}" role="img" aria-label="${st} clean in a row, best ${best}"><span class="streak-num">${st}</span><span class="streak-copy"><strong>in a row</strong><small>best ${best}</small></span></div><div class="today"><div class="dots" aria-hidden="true">${Array.from({length:5},(_,i)=>`<span class="dot ${i<n?'on':''} ${i===popDot?'pop':''}"></span>`).join('')}</div><strong>${n} clean today</strong><small>Five is a lovely start.</small></div>`;
 $('#position-select').innerHTML=deck.map((p,i)=>`<option value="${i}" ${i===idx?'selected':''}>Position ${String(i+1).padStart(2,'0')}</option>`).join('');
 $('#position-select').disabled=!deck.length;$('#previous').disabled=deck.length<2;$('#skip').disabled=deck.length<2;$('#box-toggle').disabled=!puzzle;$('#flip').disabled=!puzzle;
 renderBoard();$('#coach').innerHTML=coachHTML();$('#storage-warning').hidden=canSave;
 const key=`${mode}|${puzzle?.id}|${phase}|${remaining}|${busy}`;if(key!==lastCoachKey){lastCoachKey=key;enterCoach();}
 positionPill();flushFx();
}
function enterCoach(){
 const el=$('#coach');clearTimeout(enterTimer);el.classList.remove('enter');if(RM())return;
 const h=el.querySelector('h2');if(h){let i=0;const walk=node=>{[...node.childNodes].forEach(ch=>{if(ch.nodeType===3){const frag=document.createDocumentFragment();ch.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}const w=document.createElement('span');w.className='w';w.style.setProperty('--i',i++);w.textContent=part;frag.appendChild(w);});ch.replaceWith(frag);}else if(ch.nodeType===1&&ch.tagName!=='BR')walk(ch);});};walk(h);}
 void el.offsetWidth;el.classList.add('enter');enterTimer=setTimeout(()=>el.classList.remove('enter'),1100);
}
let pill=null;
function positionPill(){const box=$('.modes');if(!box)return;if(!pill){pill=document.createElement('span');pill.className='mode-pill';pill.setAttribute('aria-hidden','true');box.prepend(pill);}const a=box.querySelector('button[aria-pressed="true"]');if(!a)return;pill.style.width=a.offsetWidth+'px';pill.style.transform=`translateX(${a.offsetLeft-4}px)`;if(!pill.classList.contains('ready'))requestAnimationFrame(()=>requestAnimationFrame(()=>pill.classList.add('ready')));}
window.addEventListener('resize',()=>{pill?.classList.remove('ready');positionPill();});

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
 q.forEach(f=>{if(f==='mate'||f==='mate-lite')setTimeout(()=>fxMate(f==='mate-lite'),f==='mate'?300:60);else if(f==='right')setTimeout(()=>{const k=$('.square.target-king');if(k){burst(k,14);}},60);else if(f==='wrong')setTimeout(fxWrong,mode==='judge'?40:360);});
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
 if(!puzzle||pendingPromotion||busy)return;
 const c=new Chess(fen),piece=c.get(sq),mark=boxInfo.find(x=>x.square===sq);
 if(mode!=='judge'&&phase==='play'){
  if(selected&&tryMoveTo(sq))return;
  if(piece&&piece.color===attacker&&c.turn()===attacker){selected=selected===sq?null:sq;legalTargets=selected?c.moves({square:selected,verbose:true}):[];feedback='';squareNote=selected?`${colorName(piece.color)} ${names[piece.type]} on ${sq}. Choose a highlighted square.`:'';render();focusSquare(sq);return;}
 }
 if(boxOn&&mark){squareNote=`${sq.toUpperCase()}: ${mark.reason}`;$('#square-note').textContent=squareNote;return;}
 if(phase==='play'&&mode!=='judge'&&selected){feedback='That isn’t a legal move. Choose a highlighted square.';$('#coach').innerHTML=coachHTML();}
}
function tryMoveTo(sq){const moves=legalTargets.filter(m=>m.to===sq);if(!selected||!moves.length)return false;if(moves.some(m=>m.promotion)){pendingPromotion={from:selected,to:sq};renderPromotion();$('#promotion button[data-promote]').focus();return true;}playMove({from:selected,to:sq});return true;}
async function playMove(move){
 if(phase!=='play'||busy)return;const epoch=workEpoch;
 let result;
 try{result=remaining===2?await compute('assessMove',[fen,move,remaining]):assessMove(fen,move,remaining);}catch(e){if(epoch!==workEpoch)return;busy=false;feedback='That move couldn’t be checked. Try again.';render();return;}if(epoch!==workEpoch)return;
 if(!result.legal){feedback='That isn’t a legal move in this position.';render();return;}
 attempt=result;fen=result.fen;lastMove={...move,san:result.san};selected=null;legalTargets=[];pendingPromotion=null;hintFrom=null;squareNote='';proof=inspectCheck(fen);proofFen=fen;expanded=null;
 if(result.mate){phase='done';line.push(lastMove);finish(assisted);fxQueue.push('mate');}
 else if(result.winning&&remaining===2){phase='line';line.push(lastMove);}
 else {phase='wrong';wrong();if(proof.check)expanded=['escape','capture','block'].find(k=>proof[k].length)||null;}
 render();animateMove(lastMove);focusSquare(lastMove.to);
}
function defend(){
 if(phase!=='line'||!attempt?.replyFen)return;
 fen=attempt.replyFen;lastMove=attempt.reply;line.push(lastMove);stageFen=fen;remaining=1;phase='play';proof=null;proofFen=null;expanded=null;hintLevel=0;hintFrom=null;squareNote='';attempt=null;
 render();animateMove(lastMove);
}
async function hint(){
 if(!puzzle||phase!=='play'||busy)return;const epoch=workEpoch;assisted=true;
 if(mode==='judge'){boxOn=true;render();return;}
 hintLevel++;
 if(hintLevel===1){boxOn=true;render();return;}
 let moves;try{moves=await compute('winningMoves',[fen,remaining]);}catch(e){if(epoch!==workEpoch)return;busy=false;feedback='The hint couldn’t be checked. Try again.';render();return;}if(epoch!==workEpoch)return;
 if(!moves.length){feedback='No solution found for this position. Please move to the next one.';render();return;}
 if(hintLevel===2){hintFrom=moves[0].from;render();return;}
 playMove(moves[0]);
}
function judge(choice){
 if(mode!=='judge'||phase!=='play')return;
 verdictChoice=choice;proof=inspectCheck(fen);proofFen=fen;phase='judged';
 if(choice!==puzzle.answer)wrong();else fxQueue.push(proof.mate?'mate-lite':'right');finish(choice!==puzzle.answer);expanded=['escape','capture','block'].find(k=>proof[k].length)||null;
 render();if(matchMedia('(max-width:660px)').matches)$('#coach').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
}
function playDefense(key,index){
 const m=proof?.[key]?.[index];if(!m||!proofFen)return;
 const c=new Chess(proofFen);const played=c.move({from:m.from,to:m.to,...(m.promotion?{promotion:m.promotion}:{})});
 if(!played)return;fen=c.fen();lastMove=m;defenseShown=true;squareNote=`${m.san}: a legal defense. This was check, not checkmate.`;render();animateMove(m);if(matchMedia('(max-width:660px)').matches)document.querySelector('.board-meta').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
}
function next(delta=1){if(deck.length){load((idx+delta+deck.length)%deck.length,true);if(matchMedia('(max-width:660px)').matches)document.querySelector('.board-meta').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}}
function action(name){
 if(name==='see-proof')$('#coach').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
 if(name==='next')next();
 if(name==='retry')resetStage();
 if(name==='refute'&&attempt?.defenses?.length){const m=attempt.defenses[0];fen=m.fen;lastMove=m;defenseShown=true;squareNote=m.san+': no immediate checkmate remains after this defense.';render();animateMove(m);}
 if(name==='hint')hint();
 if(name==='defend')defend();
 if(name==='restart')load(idx);
 if(name==='cancel-promotion'){pendingPromotion=null;renderPromotion();focusSquare(selected);}
 if(name==='back-proof'){fen=proofFen;lastMove=attempt?{from:attempt.from,to:attempt.to,san:attempt.san}:null;defenseShown=false;squareNote='';render();}
 if(name==='all'){filter='all';deck=collection();load(0,true);}
}
$('#app').addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.mode){if(mode===b.dataset.mode)return;mode=b.dataset.mode;filter='all';deck=collection();load(0,true);}
 else if(b.dataset.square){if(performance.now()<suppressUntil)return;chooseSquare(b.dataset.square);}
 else if(b.dataset.action)action(b.dataset.action);
 else if(b.dataset.verdict)judge(b.dataset.verdict);
 else if(b.dataset.proof){expanded=expanded===b.dataset.proof?null:b.dataset.proof;$('#coach').innerHTML=coachHTML();$(`[data-proof="${b.dataset.proof}"]`)?.focus({preventScroll:true});}
 else if(b.dataset.reply){const [key,n]=b.dataset.reply.split(':');playDefense(key,Number(n));}
 else if(b.dataset.promote&&pendingPromotion){const move={...pendingPromotion,promotion:b.dataset.promote};pendingPromotion=null;playMove(move);}
});
$('#box-toggle').addEventListener('click',()=>{boxOn=!boxOn;if(boxOn&&phase==='play')assisted=true;squareNote='';render();});
$('#flip').addEventListener('click',()=>{orientation=other(orientation);renderBoard();});
$('#previous').addEventListener('click',()=>next(-1));$('#skip').addEventListener('click',()=>next());
$('#position-select').addEventListener('change',e=>load(Number(e.target.value),true));
$('#filter').addEventListener('change',e=>{filter=e.target.value;deck=collection();load(0,true);});
$('#board').addEventListener('keydown',e=>{const sq=e.target.closest('[data-square]')?.dataset.square;if(!sq)return;if(e.key==='Escape'){selected=null;legalTargets=[];render();focusSquare(sq);return;}const directions={ArrowUp:-8,ArrowDown:8,ArrowLeft:-1,ArrowRight:1};if(!(e.key in directions))return;e.preventDefault();const squares=boardSquares(),n=squares.indexOf(sq),offset=directions[e.key];if(offset===-1&&n%8===0||offset===1&&n%8===7)return;const target=squares[n+offset];if(target)focusSquare(target);});
$('#promotion').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();action('cancel-promotion');}});
const dialog=$('#how-dialog');$('#how-open').addEventListener('click',()=>dialog.showModal());$('#how-close').addEventListener('click',()=>dialog.close());$('#how-start').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
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
  if(selected!==drag.sq){selected=drag.sq;legalTargets=c.moves({square:selected,verbose:true});feedback='';squareNote=`${colorName(p.color)} ${names[p.type]} on ${drag.sq}. Drop it on a highlighted square.`;render();}else renderBoard();
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
window.addEventListener('popstate',restoreURL);
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{const p=JSON.parse(e.newValue);if(p.records&&p.days){progress=p;render();}}catch(err){}}});
restoreURL();writeURL(true);
