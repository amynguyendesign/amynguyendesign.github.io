// patterns.js — the named mating patterns (worksheet catalog) + position variants for endless practice.
import { puzzles, verdicts } from './puzzles.js';

export const PATTERNS = [
 {key:'back-rank',name:'Back rank',line:'The king’s own pawns wall it in. A rook lands on the back row.',pieces:['r','q'],origin:'The most common mate in real games.',match:['back rank','queen sacrifice, back rank']},
 {key:'smothered',name:'Smothered mate',line:'Boxed in by its own pieces, the king can’t dodge a knight.',pieces:['n'],origin:'Philidor’s legacy is the queen-sac version.',match:['smothered mate','Philidor']},
 {key:'arabian',name:'Arabian mate',line:'Rook and knight corner the king. The knight guards the rook.',pieces:['r','n'],origin:'Found in 9th-century Arabic manuscripts.',match:['Arabian']},
 {key:'anastasia',name:'Anastasia’s mate',line:'A knight shuts the escape. The rook or queen mates down the edge.',pieces:['n','r'],origin:'From a German novel, 1803.',match:['Anastasia']},
 {key:'boden',name:'Boden’s mate',line:'Two bishops cross diagonals over the king.',pieces:['b','b'],origin:'Samuel Boden, London, 1853.',match:['Boden']},
 {key:'epaulette',name:'Epaulette mate',line:'The king’s own rooks sit either side of it. A queen checks from the front.',pieces:['q'],origin:'The rooks look like shoulder pads.',match:['epaulette']},
 {key:'opera',name:'Opera mate',line:'Rook mates on the back rank. A bishop guards it from far away.',pieces:['r','b'],origin:'Morphy, at the Paris Opera, 1858.',match:['Opera']},
 {key:'greco',name:'Greco’s mate',line:'A bishop takes the last escape square. The queen or rook mates on the edge.',pieces:['b','q'],origin:'Gioachino Greco, 1600s.',match:['Greco']},
 {key:'hook',name:'Hook mate',line:'Pawn guards knight, knight guards rook. The chain closes the net.',pieces:['r','n','p'],origin:'The three pieces link like a hook.',match:['hook mate']},
 {key:'double-check',name:'Double check',line:'Two pieces check at once. The king has to move, and can’t.',pieces:['n','r'],origin:'No block or capture stops two checks.',match:['double check']},
 {key:'battery',name:'Queen & bishop battery',line:'A bishop backs up the queen on one diagonal. She lands next to the king, safe.',pieces:['q','b'],origin:'Lined up like batteries in a row.',match:['queen and bishop battery']},
 {key:'kiss',name:'Kiss of death',line:'The queen goes face to face with the king, guarded by a friend.',pieces:['q','p'],origin:'Also called the supported queen.',match:['supported queen','pawn-supported queen']},
 {key:'ladder',name:'Ladder mate',line:'Two rooks take turns stepping the king to the edge.',pieces:['r','r'],origin:'Also called the lawnmower.',match:['ladder']},
 {key:'edge',name:'Edge mate',line:'King and queen (or rook) pin the lone king to the edge.',pieces:['k','q'],origin:'The first endgame everyone learns.',match:['edge mate']},
 {key:'promotion',name:'Promotion mate',line:'A pawn becomes a queen and mates on arrival.',pieces:['p','q'],origin:'Eight squares, one big finish.',match:['promotion mate']},
];
export function familyOf(pattern){
 if(!pattern)return null;
 for(const p of PATTERNS) if(p.match.some(m=>pattern.toLowerCase().includes(m.toLowerCase())))return p.key;
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
