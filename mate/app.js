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
function cancelSolver(){workEpoch++;if(activeWorker){activeWorker.terminate();activeWorker=null;}busy=false;}
function compute(action,args){busy=true;busyText=action==='winningMoves'?'Finding a forcing move…':'Checking every defense…';render();return new Promise((resolve,reject)=>{const worker=new Worker(new URL('./solver.js',import.meta.url),{type:'module'});activeWorker=worker;worker.onmessage=({data})=>{worker.terminate();if(activeWorker===worker){activeWorker=null;busy=false;}data.error?reject(new Error(data.error)):resolve(data.result);};worker.onerror=()=>{worker.terminate();if(activeWorker===worker){activeWorker=null;busy=false;}reject(new Error('Chess verification unavailable.'));};worker.postMessage({action,args});});}
const getKey=()=>`${mode}:${puzzle.id}`;
function entry(){const k=getKey();if(!progress.records[k])progress.records[k]={solves:0,misses:0,assisted:0,clean:0};return progress.records[k];}
function wrong(){dirty=true;const r=entry();r.misses++;r.last=Date.now();save();}
function finish(revealed=false){if(recorded)return;recorded=true;const r=entry();r.last=Date.now();if(revealed||assisted)r.assisted++;else r.solves++;if(!revealed&&!assisted&&!dirty){r.clean++;const d=day();progress.days[d]=Array.isArray(progress.days[d])?progress.days[d]:[];if(!progress.days[d].includes(getKey()))progress.days[d].push(getKey());}save();}
function collection(){const source=mode==='judge'?verdicts:puzzles.filter(p=>p.mateIn===Number(mode));return source.filter(p=>{const r=progress.records[`${mode}:${p.id}`];return filter==='review'?r&&(r.misses>0||r.assisted>0):filter==='new'?!r: true;});}
function writeURL(replace=false){const u=new URL(location.href);u.searchParams.set('mode',mode);if(puzzle)u.searchParams.set('puzzle',puzzle.id);else u.searchParams.delete('puzzle');u.searchParams.set('collection',filter);history[replace?'replaceState':'pushState']({},'',u);}
function load(index=0,nav=false){
 cancelSolver();
 idx=Math.max(0,Math.min(index,deck.length-1));puzzle=deck[idx];selected=null;legalTargets=[];phase='play';boxOn=false;squareNote='';hintLevel=0;hintFrom=null;assisted=false;dirty=false;recorded=false;feedback='';lastMove=null;attempt=null;proof=null;proofFen=null;expanded=null;defenseShown=false;pendingPromotion=null;line=[];verdictChoice=null;
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
 $('#board').innerHTML=boardSquares().map((sq,i)=>{const p=c.get(sq),mark=boxOn?boxInfo.find(x=>x.square===sq):null;const dark=(sq.charCodeAt(0)-97+Number(sq[1]))%2===1;const move=lastMove&&(lastMove.from===sq||lastMove.to===sq);const classes=['square',dark?'dark':'',selected===sq?'selected':'',move?'last':'',hintFrom===sq?'hint-piece':''].filter(Boolean).join(' ');return `<button class="${classes}" data-square="${sq}" tabindex="${i===0?0:-1}" aria-label="${sq}${p?', '+colorName(p.color)+' '+names[p.type]:', empty'}${mark?', '+mark.status:''}" ${selected===sq?'aria-pressed="true"':''}>${i%8===0?`<span class="coord rank">${sq[1]}</span>`:''}${i>=56?`<span class="coord file">${sq[0]}</span>`:''}${mark?`<span class="box-mark ${mark.status}"><span class="box-symbol">${mark.status==='covered'?'•':mark.status==='blocked'?'×':'○'}</span></span>`:''}${boxOn&&king===sq?'<span class="king-target"></span>':''}${p?`<span class="piece">${pieceSvg(p)}</span>`:''}${targets.has(sq)?`<span class="move-dot ${p?'capture':''}"></span>`:''}</button>`;}).join('');
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
function lesson(){return `<div class="lesson"><h3>${esc(puzzle.pattern||'What to notice')}</h3><p>${esc(puzzle.lesson)}</p></div>`;}
function moveLine(){return line.length?`<p class="mono">${line.map(m=>esc(m.san)).join(' · ')}</p>`:'';}
function coachHTML(){
 if(!puzzle)return `<div class="empty"><h2>${filter==='review'?'Nothing to revisit.':'All caught up.'}</h2><p>${filter==='review'?'Missed and assisted positions will collect here.':'There are no untried positions in this set.'}</p><button class="primary" data-action="all">Show all positions →</button></div>`;
 if(busy)return `<p class="eyebrow">The full legal-move test</p><h2>${busyText}</h2><p>Checking all legal replies, including captures and blocks. The board will be ready in a moment.</p><button class="secondary" data-action="retry">Cancel</button>`;
 if(mode==='judge'&&phase==='play')return `<p class="eyebrow">The verification drill</p><h2>Mate. Or just check?</h2><p>${colorName(new Chess(fen).turn())} is in check. Before you decide, look for <strong>escape, capture, and block</strong>.</p><div class="actions"><button class="primary" data-verdict="mate">It’s checkmate</button><button class="secondary" data-verdict="not">Not mate</button></div><button class="helper-button" data-action="hint">${boxOn?'Inspect an escape square':'Show the king’s box'}</button>${checklist()}`;
 if(mode==='judge'){
 const yes=verdictChoice===puzzle.answer;
 return `<p class="eyebrow">${yes?'Good eye':'The detail to catch'}</p><h2>${proof.mate?'Nowhere to go.':'There’s still a way out.'}</h2><p>${yes?'You spotted it. ': 'Not quite. '}${proof.mate?'The king is in check and every legal defense is ruled out.':'A check is only mate when every defense fails. Open a row below and play a legal reply.'}</p>${defenseShown?'<div class="feedback">Defense played on the board. <button class="helper-button" data-action="back-proof">Back to the check</button></div>':''}${checklist()}${lesson()}<div class="actions"><button class="primary" data-action="next">Next position →</button></div>`;
 }
 if(phase==='done')return `<div class="big-symbol" aria-hidden="true">#</div><p class="eyebrow">${assisted?'Pattern revealed':dirty?'Found it':'Clean solve'}</p><h2>That’s checkmate.</h2>${moveLine()}<p>${assisted?'Trace what each piece controls. Then try it again without the hint.':'Not just a check. No escape, no capture, no block.'}</p>${checklist()}${lesson()}<div class="actions"><button class="primary" data-action="next">Next position →</button><button class="secondary" data-action="restart">Try again</button></div>`;
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
 const n=(Array.isArray(progress.days[day()])?progress.days[day()]:[]).length;
 $('#daily').innerHTML=`<div class="dots" aria-hidden="true">${Array.from({length:5},(_,i)=>`<span class="dot ${i<n?'on':''}"></span>`).join('')}</div><strong>${n} clean ${n===1?'solve':'solves'} today</strong><small>Five is a lovely start.</small>`;
 $('#position-select').innerHTML=deck.map((p,i)=>`<option value="${i}" ${i===idx?'selected':''}>Position ${String(i+1).padStart(2,'0')}</option>`).join('');
 $('#position-select').disabled=!deck.length;$('#previous').disabled=deck.length<2;$('#skip').disabled=deck.length<2;$('#box-toggle').disabled=!puzzle;$('#flip').disabled=!puzzle;
 renderBoard();$('#coach').innerHTML=coachHTML();$('#storage-warning').hidden=canSave;
}

function animateMove(move){
 if(!move||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const from=$(`[data-square="${move.from}"]`),to=$(`[data-square="${move.to}"]`),piece=to?.querySelector('.piece');
 if(from&&to&&piece){const a=from.getBoundingClientRect(),b=to.getBoundingClientRect();piece.animate([{transform:`translate(${a.x-b.x}px,${a.y-b.y}px)`},{transform:'translate(0,0)'}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)'});}
}
function focusSquare(sq){const b=$(`[data-square="${sq}"]`);if(b){$$('[data-square]').forEach(el=>el.tabIndex=el===b?0:-1);b.focus({preventScroll:true});}}
function chooseSquare(sq){
 if(!puzzle||pendingPromotion||busy)return;
 const c=new Chess(fen),piece=c.get(sq),mark=boxInfo.find(x=>x.square===sq);
 if(mode!=='judge'&&phase==='play'){
  if(selected){const moves=legalTargets.filter(m=>m.to===sq);if(moves.length){if(moves.some(m=>m.promotion)){pendingPromotion={from:selected,to:sq};renderPromotion();$('#promotion button[data-promote]').focus();return;}playMove({from:selected,to:sq});return;}}
  if(piece&&piece.color===attacker&&c.turn()===attacker){selected=selected===sq?null:sq;legalTargets=selected?c.moves({square:selected,verbose:true}):[];feedback='';squareNote=selected?`${colorName(piece.color)} ${names[piece.type]} on ${sq}. Choose a highlighted square.`:'';render();focusSquare(sq);return;}
 }
 if(boxOn&&mark){squareNote=`${sq.toUpperCase()}: ${mark.reason}`;$('#square-note').textContent=squareNote;return;}
 if(phase==='play'&&mode!=='judge'&&selected){feedback='That isn’t a legal move. Choose a highlighted square.';$('#coach').innerHTML=coachHTML();}
}
async function playMove(move){
 if(phase!=='play'||busy)return;const epoch=workEpoch;
 let result;
 try{result=remaining===2?await compute('assessMove',[fen,move,remaining]):assessMove(fen,move,remaining);}catch(e){if(epoch!==workEpoch)return;busy=false;feedback='That move couldn’t be checked. Try again.';render();return;}if(epoch!==workEpoch)return;
 if(!result.legal){feedback='That isn’t a legal move in this position.';render();return;}
 attempt=result;fen=result.fen;lastMove={...move,san:result.san};selected=null;legalTargets=[];pendingPromotion=null;hintFrom=null;squareNote='';proof=inspectCheck(fen);proofFen=fen;expanded=null;
 if(result.mate){phase='done';line.push(lastMove);finish(assisted);}
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
 if(choice!==puzzle.answer)wrong();finish(choice!==puzzle.answer);expanded=['escape','capture','block'].find(k=>proof[k].length)||null;
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
 else if(b.dataset.square)chooseSquare(b.dataset.square);
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
window.addEventListener('popstate',restoreURL);
window.addEventListener('storage',e=>{if(e.key===KEY&&e.newValue){try{const p=JSON.parse(e.newValue);if(p.records&&p.days){progress=p;render();}}catch(err){}}});
restoreURL();writeURL(true);
