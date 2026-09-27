// sound.js — tiny synthesized sound effects (Web Audio, no files). Soft, woody, pastel.
const KEY='studio-mate-sound';
let ctx=null,master=null,on=true;
try{on=localStorage.getItem(KEY)!=='off';}catch(e){}
function ac(){
 if(!on)return null;
 if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;ctx=new C();master=ctx.createGain();master.gain.value=.55;const comp=ctx.createDynamicsCompressor();comp.threshold.value=-18;master.connect(comp);comp.connect(ctx.destination);}
 if(ctx.state==='suspended')ctx.resume();
 return ctx;
}
function tone({f,f2=null,type='sine',t=0,d=.15,v=.3,a=.004}){
 const c=ac();if(!c)return;const s=c.currentTime+t,o=c.createOscillator(),g=c.createGain();
 o.type=type;o.frequency.setValueAtTime(f,s);if(f2)o.frequency.exponentialRampToValueAtTime(f2,s+d);
 g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(v,s+a);g.gain.exponentialRampToValueAtTime(.0001,s+d);
 o.connect(g);g.connect(master);o.start(s);o.stop(s+d+.02);
}
let nbuf=null;
function noise({t=0,d=.05,v=.15,freq=1800,q=1.2,type='bandpass',f2=null}){
 const c=ac();if(!c)return;const s=c.currentTime+t;
 if(!nbuf){nbuf=c.createBuffer(1,c.sampleRate*.5,c.sampleRate);const ch=nbuf.getChannelData(0);for(let i=0;i<ch.length;i++)ch[i]=Math.random()*2-1;}
 const src=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();src.buffer=nbuf;fl.type=type;fl.frequency.setValueAtTime(freq,s);if(f2)fl.frequency.exponentialRampToValueAtTime(f2,s+d);fl.Q.value=q;
 g.gain.setValueAtTime(v,s);g.gain.exponentialRampToValueAtTime(.0001,s+d);src.connect(fl);fl.connect(g);g.connect(master);src.start(s);src.stop(s+d+.02);
}
// marimba-ish: fundamental + soft 4th partial, quick decay
function mallet(f,t=0,v=.28,d=.5){tone({f,t,d,v});tone({f:f*4,t,d:d*.25,v:v*.18});}
export const sfx={
 get on(){return on;},
 toggle(){on=!on;try{localStorage.setItem(KEY,on?'on':'off');}catch(e){}if(on)sfx.tap();return on;},
 unlock(){if(on)ac();},
 tap(){tone({f:1500,d:.035,v:.05,type:'triangle'});},
 pick(){tone({f:700,f2:1050,d:.07,v:.13,type:'triangle'});},
 move(){tone({f:420,f2:210,d:.1,v:.4});noise({d:.035,v:.13,freq:2200});},
 capture(){tone({f:330,f2:150,d:.14,v:.5});noise({d:.06,v:.2,freq:1300});tone({f:900,t:.02,d:.05,v:.08,type:'triangle'});},
 wrong(){tone({f:392,d:.13,v:.16,type:'triangle'});tone({f:294,t:.11,d:.24,v:.17,type:'triangle'});},
 hint(){mallet(1175,0,.16,.35);mallet(1568,.08,.12,.35);},
 next(){noise({d:.16,v:.07,freq:600,f2:3000,q:.8});},
 pop(){tone({f:380,f2:980,d:.07,v:.15});},
 right(){mallet(784,0,.26);mallet(1175,.09,.26);mallet(1568,.18,.2,.7);},
 miss(){mallet(392,0,.2,.35);mallet(349,.12,.18,.45);},
 mate(streak=0){
  [523.25,659.25,783.99,987.77,1046.5].forEach((f,i)=>mallet(f,i*.075,.26,.7));
  // shimmer
  [2093,2637,3136].forEach((f,i)=>tone({f,t:.42+i*.05,d:.35,v:.035}));
  if(streak>=3)mallet(1318.5,.5,.2,.8);
 },
};
