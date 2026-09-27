// patterns.js — the named mating patterns (worksheet catalog) + position variants for endless practice.
import { puzzles, verdicts } from './puzzles.js';

// Names and definitions follow the standard references cited on the page:
// Renaud & Kahn, The Art of the Checkmate (1953); Wikipedia, "Checkmate pattern"; Lichess Practice, Checkmate Patterns I–IV.
export const PATTERNS = [
 {key:'back-rank',name:'Back-rank mate',line:'The king’s own pawns wall it in. A rook or queen lands on the back row.',pieces:['r','q'],origin:'Also called a back-row mate.',match:['back rank','queen sacrifice, back rank']},
 {key:'smothered',name:'Smothered mate',line:'Boxed in by its own pieces, the king can’t dodge a knight.',pieces:['n'],origin:'Philidor’s legacy is the queen-sacrifice version.',match:['smothered mate','philidor\'s legacy (queen sacrifice, smothered mate)']},
 {key:'arabian',name:'Arabian mate',line:'Rook and knight corner the king. The knight guards the rook.',pieces:['r','n'],origin:'Described in early Arabic chess manuscripts.',match:['rook and knight (arabian mate)']},
 {key:'anastasia',name:'Anastasia’s mate',line:'A knight shuts the escape. The rook or queen mates down the edge.',pieces:['n','r'],origin:'From Heinse’s novel Anastasia und das Schachspiel, 1803.',match:['anastasia\'s mate','anastasia\'s mate (queen sacrifice)']},
 {key:'boden',name:'Boden’s mate',line:'Two bishops cross diagonals over the king.',pieces:['b','b'],origin:'Schulder vs. Boden, London, 1853.',match:['boden\'s mate','boden\'s mate (queen sacrifice)']},
 {key:'epaulette',name:'Epaulette mate',line:'The king’s own pieces sit on both sides of it. The queen checks from the front.',pieces:['q'],origin:'The rooks look like shoulder epaulettes.',match:['epaulette mate']},
 {key:'opera',name:'Opera mate',line:'A rook mates on the back rank. A bishop guards it from far away.',pieces:['r','b'],origin:'Morphy, at the Paris Opera, 1858.',match:['opera mate (rook supported by bishop)']},
 {key:'anderssen',name:'Anderssen’s mate',line:'A rook mates on the back rank, guarded by a pawn right beside the king.',pieces:['r','p'],origin:'Named after Adolf Anderssen.',match:['anderssen\'s mate']},
 {key:'greco',name:'Greco’s mate',line:'A bishop takes the last escape square. The queen or rook mates on the edge.',pieces:['b','q'],origin:'Named after Gioachino Greco, 1600s.',match:['greco\'s mate (bishop covers g8)']},
 {key:'hook',name:'Hook mate',line:'Pawn guards knight, knight guards rook. The chain closes the net.',pieces:['r','n','p'],origin:'The three pieces link like a hook.',match:['hook mate (rook, knight and pawn)']},
 {key:'damiano',name:'Damiano’s mate',line:'A pawn guards the queen as she lands right next to the king.',pieces:['q','p'],origin:'Published by Pedro Damiano, 1512.',match:['damiano\'s mate']},
 {key:'damiano-bishop',name:'Damiano’s bishop mate',line:'A bishop backs up the queen as she lands next to the king.',pieces:['q','b'],origin:'The bishop version of Damiano’s mate.',match:['damiano\'s bishop mate','queen and bishop battery']},
 {key:'lolli',name:'Lolli’s mate',line:'A pawn wedged into the king’s shelter lets the queen land beside it.',pieces:['q','p'],origin:'Named after Giambattista Lolli.',match:['lolli\'s mate']},
 {key:'dovetail',name:'Dovetail mate',line:'The queen lands diagonally next to the king. Its own pieces block the last two exits.',pieces:['q'],origin:'Also called Cozio’s mate.',match:['dovetail mate']},
 {key:'swallow',name:'Swallow’s tail mate',line:'The queen lands straight in front. Two of the king’s own pieces sit behind it like a forked tail.',pieces:['q'],origin:'Also called the guéridon mate.',match:['swallow\'s tail mate']},
 {key:'triangle',name:'Triangle mate',line:'The queen lands next to the king with a rook two squares behind her.',pieces:['q','r'],origin:'King, queen and rook form a triangle.',match:['triangle mate']},
 {key:'morphy',name:'Morphy’s mate',line:'A bishop checks from far away. A rook and the king’s own pawn seal the corner.',pieces:['b','r'],origin:'Named after Paul Morphy.',match:['morphy\'s mate']},
 {key:'corner',name:'Corner mate',line:'A rook seals the file, the king’s own pawn blocks, a knight lands the check.',pieces:['r','n'],origin:'The king is stuck in its own corner.',match:['corner mate']},
 {key:'blind-swine',name:'Blind swine mate',line:'Two rooks on the seventh rank team up right next to the king.',pieces:['r','r'],origin:'Janowski’s nickname for doubled rooks on the seventh.',match:['blind swine mate']},
 {key:'ladder',name:'Ladder mate',line:'Two major pieces take turns pushing the king to the edge.',pieces:['r','r'],origin:'Also called the lawnmower mate.',match:['two-rook ladder mate']},
];
const norm=s=>String(s||'').toLowerCase().replace(/[’‘]/g,"'").trim();
export function familyOf(pattern){
 const n=norm(pattern);if(!n)return null;
 for(const p of PATTERNS) if(p.match.some(m=>norm(m)===n))return p.key;
 return null;
}
export const patternByKey = Object.fromEntries(PATTERNS.map(p=>[p.key,p]));
export function demoFor(key){return puzzles.find(p=>p.mateIn===1&&familyOf(p.pattern)===key);}
export function countFor(key){return puzzles.filter(p=>familyOf(p.pattern)===key).length;}

// ---------- variants: mirror (a↔h) and colour swap keep every pattern exact ----------
const expand=r=>r.replace(/[1-8]/g,d=>'.'.repeat(+d));
const compress=r=>r.replace(/\.+/g,m=>String(m.length));
const mf=f=>'abcdefgh'[7-'abcdefgh'.indexOf(f)];
function mirrorFen(fen){const [b,t,c,e,h,f]=fen.split(' ');if(c!=='-')return null;return [b.split('/').map(r=>compress([...expand(r)].reverse().join(''))).join('/'),t,c,e==='-'?'-':mf(e[0])+e[1],h,f].join(' ');}
function swapFen(fen){const [b,t,c,e,h,f]=fen.split(' ');const sw=s=>s.replace(/[a-zA-Z]/g,ch=>ch===ch.toUpperCase()?ch.toLowerCase():ch.toUpperCase());return [b.split('/').reverse().map(sw).join('/'),t==='w'?'b':'w',c==='-'?'-':sw(c),e==='-'?'-':e[0]+(9-+e[1]),h,f].join(' ');}
function mirrorText(s){return s&&s.replace(/([a-h])([1-8])/g,(m,a,n)=>mf(a)+n).replace(/\b([a-h])-(pawn|file)/g,(m,a,w)=>mf(a)+'-'+w).replace(/kingside|queenside/g,w=>w==='kingside'?'queenside':'kingside');}
function swapText(s){return s&&s.replace(/([a-h])([1-8])/g,(m,a,n)=>a+(9-+n)).replace(/\b(White|Black|white|black)\b/g,w=>({White:'Black',Black:'White',white:'black',black:'white'})[w]);}
export function variantsOf(p){
 const out=[p];const m=mirrorFen(p.fen),s=swapFen(p.fen);
 if(m)out.push({...p,id:p.id+'~m',fen:m,lesson:mirrorText(p.lesson),solutions:undefined,variant:'m'});
 if(s)out.push({...p,id:p.id+'~c',fen:s,lesson:swapText(p.lesson),solutions:undefined,variant:'c'});
 if(m&&s){const ms=swapFen(m);out.push({...p,id:p.id+'~mc',fen:ms,lesson:swapText(mirrorText(p.lesson)),solutions:undefined,variant:'mc'});}
 return out;
}
export const allPuzzles = puzzles.flatMap(variantsOf);
export const allVerdicts = verdicts.flatMap(variantsOf);
