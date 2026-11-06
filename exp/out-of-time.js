(function(){
const ID='out-of-time', P=`.scene[data-exp="${ID}"]`;

/* ---------- art helpers ---------- */
// Gear outline with exactly n teeth (first tooth centred on angle 0).
function gearPath(n,ro,ri){let d='';const step=Math.PI*2/n;
  for(let k=0;k<n;k++){const a=k*step,pts=[[a-step*.5,ri],[a-step*.22,ro],[a+step*.22,ro],[a+step*.5,ri]];
    pts.forEach(([t,r],j)=>{d+=(k===0&&j===0?'M':'L')+(r*Math.cos(t)).toFixed(2)+' '+(r*Math.sin(t)).toFixed(2)})}
  return d+'Z'}
function gearSVG(n,label,col){const ro=46,ri=ro-9;return `<svg viewBox="-52 -52 104 104" role="img" aria-label="Gear ${label}" style="width:100%;max-width:130px;display:block;margin:0 auto"><path d="${gearPath(n,ro,ri)}" fill="${col}" stroke="#3a2410" stroke-width="1.2"/><circle r="${ri-8}" fill="none" stroke="#3a2410" stroke-width="1" opacity=".5"/><circle r="9" fill="#3a2410"/><text y="5" text-anchor="middle" font-family="Archivo Black,Arial" font-size="14" fill="#fff3d6">${label}</text></svg>`}
// Small analog clock (no numbers): hour 1-12 at minute 0
function miniClock(h,label){const a=h*30-90,rad=a*Math.PI/180;return `<svg viewBox="-30 -30 60 60" style="width:92px;height:92px;display:block;margin:0 auto" role="img" aria-label="Clock ${label}"><circle r="28" fill="#fdf6e6" stroke="#8a5a22" stroke-width="3"/>${[...Array(12)].map((_,i)=>`<rect x="-1" y="-26" width="2" height="${i%3?4:6}" fill="#3a2410" transform="rotate(${i*30})"/>`).join('')}<line x1="0" y1="0" x2="0" y2="-22" stroke="#7a8a96" stroke-width="2.2" stroke-linecap="round"/><line x1="0" y1="0" x2="${(14*Math.cos(rad)).toFixed(2)}" y2="${(14*Math.sin(rad)).toFixed(2)}" stroke="#1a1410" stroke-width="4" stroke-linecap="round"/><circle r="2.6" fill="#b5482e"/></svg>`}
const FACE={12:'T',1:'K',2:'O',3:'S',4:'M',5:'A',6:'E',7:'R',8:'L',9:'P',10:'I',11:'N'};
function letterFace(){let g='';for(let h=1;h<=12;h++){const a=(h*30-90)*Math.PI/180;g+=`<text x="${(50*Math.cos(a)).toFixed(1)}" y="${(50*Math.sin(a)+7).toFixed(1)}" text-anchor="middle" font-family="Archivo Black,Arial" font-size="19" fill="#ffcf7a">${FACE[h]}</text>`}
  return `<svg viewBox="-70 -70 140 140" role="img" aria-label="Clock face with letters" style="max-width:220px;margin:0 auto"><circle r="66" fill="#16222a" stroke="#c88a3a" stroke-width="5"/><circle r="62" fill="none" stroke="#7ff3ff" stroke-width="1" opacity=".5"/>${g}<circle r="4" fill="#c88a3a"/></svg>`}
// Ticker tape strip
const tape=(s,n)=>`<div style="text-align:center;font-size:12px;font-weight:700;margin-bottom:6px">Tape piece ${n} of 3</div><div style="display:flex;justify-content:center;gap:4px">${s.split('').map(c=>`<span style="font-family:'Special Elite',monospace;font-size:26px;font-weight:700;background:#fff;border:1px dashed #8a7350;padding:2px 8px">${c}</span>`).join('')}</div>`;
const seq=(arr)=>`<div style="text-align:center;font-family:'Archivo Black',Arial;font-size:20px;letter-spacing:1px">${arr.map(x=>x==='?'?'<span style="color:#b5482e">?</span>':x).join(', ')}</div>`;

// Room gears: same tooth pitch (r/teeth = 2.5), centres spaced r1+r2, durations proportional to teeth, alternating spin.
const RG=[{n:16,r:40,x:50,y:52,off:0,dur:16,dir:1,col:'#c88a3a'},{n:8,r:20,x:110,y:52,off:22.5,dur:8,dir:-1,col:'#e0b060'},{n:12,r:30,x:110,y:102,off:0,dur:12,dir:1,col:'#a8672a'}];
const roomGears=()=>`<svg viewBox="0 0 150 140" style="width:100%;height:100%;display:block;overflow:visible">${RG.map(g=>`<g transform="translate(${g.x.toFixed(2)} ${g.y.toFixed(2)})"><g class="spin" style="animation-duration:${g.dur}s;animation-direction:${g.dir>0?'normal':'reverse'}"><g transform="rotate(${g.off})"><path d="${gearPath(g.n,g.r+4,g.r-4)}" fill="${g.col}" stroke="#3a2410" stroke-width="1.2"/><circle r="${g.r*.55}" fill="none" stroke="#3a2410" stroke-width="2" opacity=".45"/>${[0,1,2,3].map(k=>`<rect x="-2" y="${-g.r*.5}" width="4" height="${g.r*.5}" fill="#3a2410" opacity=".35" transform="rotate(${k*90})"/>`).join('')}<circle r="${Math.max(4,g.r*.18)}" fill="#3a2410"/></g></g></g>`).join('')}</svg>`;

EXPERIENCES[ID]={
  id:ID, title:"Out of Time", titleHTML:"OUT OF<br><span>TIME</span>",
  tag:"A clock-tower escape room",
  blurb:"Professor Tock's time machine is stuck in a loop, and so are you: every hour this workshop rewinds and starts again. Crack six locks and shut the machine down before it loops forever.",
  menuBlurb:"A runaway time machine has trapped you in a loop. Shut it down before it loops forever.",
  menuLine:"Stop the time loop",
  theme:{accent:'#ffb347',accent2:'#7ff3ff',bg:'#0a0b0d',introBg:'#2a1c10',door:'linear-gradient(90deg,#5a3a1e,#8a5a2e 50%,#5a3a1e)',doorFrame:'#2a1a0c',boxColor:'linear-gradient(#c88a3a,#7a4a1a)'},
  sceneCSS:`
${P}{background:#1a1310}
${P} .wall{position:absolute;inset:0 0 28% 0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.35) 0 2px,transparent 2px 26px),repeating-linear-gradient(90deg,rgba(0,0,0,.25) 0 2px,transparent 2px 52px),linear-gradient(#3a2a22,#4a352a 60%,#2e211a)}
${P} .wall::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 26%,rgba(127,243,255,.16),transparent 50%)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:28%;background:repeating-linear-gradient(90deg,#2a1e18 0 30px,#231812 30px 32px);}
${P} .floor::before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.55),transparent 50%)}
${P} .beam{position:absolute;top:0;height:3.5%;left:0;right:0;background:linear-gradient(#5a3a22,#3a2416);box-shadow:0 3px 6px rgba(0,0,0,.5);z-index:1}
${P} .pipe{position:absolute;background:linear-gradient(90deg,#7a4a1e,#d89a50 45%,#7a4a1e);z-index:1}
${P} .pipe.h{background:linear-gradient(#7a4a1e,#d89a50 45%,#7a4a1e)}
${P} .puff{position:absolute;width:9%;aspect-ratio:1;border-radius:50%;background:radial-gradient(rgba(235,240,245,.75),rgba(235,240,245,0) 70%);opacity:0;pointer-events:none;z-index:3;animation:${ID}-puff 3.2s ease-out infinite}
/* giant clock */
${P} #o-clock{left:23%;top:5%;width:54%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(200,250,255,.35),rgba(60,120,140,.25) 60%,rgba(20,40,50,.6));box-shadow:0 0 0 6px #c88a3a,0 0 0 9px #5a3a1e,0 0 30px rgba(127,243,255,.35);animation:${ID}-glow 4s ease-in-out infinite}
${P} #o-clock svg{position:absolute;inset:0;width:100%;height:100%}
${P} #o-clock .hand{position:absolute;left:50%;bottom:50%;transform-origin:50% 100%;border-radius:3px;background:#1a1410}
${P} #o-clock .hand.h{width:4%;height:26%;margin-left:-2%;animation:${ID}-spin 60s linear infinite}
${P} #o-clock .hand.m{width:2.4%;height:38%;margin-left:-1.2%;animation:${ID}-spin 5s linear infinite}
${P} #o-clock .hand.m::after{content:"";position:absolute;left:50%;top:-6%;width:300%;height:10%;margin-left:-150%;background:#1a1410;clip-path:polygon(50% 0,100% 100%,0 100%)}
${P} #o-clock .hub{position:absolute;left:46%;top:46%;width:8%;height:8%;border-radius:50%;background:#c88a3a;box-shadow:0 0 0 2px #1a1410}
/* pendulum */
${P} .pend{position:absolute;left:12%;top:3.5%;width:2%;height:33%;transform-origin:50% 0;animation:${ID}-swing 2.4s ease-in-out infinite;z-index:1}
${P} .pend::before{content:"";position:absolute;left:35%;top:0;width:30%;height:100%;background:linear-gradient(90deg,#8a5a22,#e0b060,#8a5a22)}
${P} .pend::after{content:"";position:absolute;left:-200%;bottom:-6%;width:500%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe2a0,#c88a3a 55%,#5a3a1e);box-shadow:0 4px 8px rgba(0,0,0,.5)}
/* gears */
${P} #o-gears{left:2%;top:44%;width:30%;height:22%}
${P} #o-gears .spin{transform-box:fill-box;transform-origin:center;animation-name:${ID}-spin;animation-timing-function:linear;animation-iteration-count:infinite}
/* tesla coil */
${P} #o-coil{right:3%;top:34%;width:21%;height:36%}
${P} #o-coil .base{position:absolute;left:10%;right:10%;bottom:0;height:12%;background:linear-gradient(#5a3a22,#2a1a10);border-radius:4px}
${P} #o-coil .tube{position:absolute;left:32%;right:32%;bottom:12%;height:56%;background:repeating-linear-gradient(0deg,#b8652a 0 3px,#e8a060 3px 5px,#7a3a14 5px 6px);border-radius:3px;box-shadow:inset -4px 0 6px rgba(0,0,0,.4)}
${P} #o-coil .torus{position:absolute;left:12%;right:12%;top:20%;height:13%;border-radius:50%;background:radial-gradient(ellipse at 40% 30%,#f0f4f8,#8a96a2 60%,#4a525a);box-shadow:0 0 12px rgba(127,243,255,.5)}
${P} #o-coil .zap{position:absolute;left:-30%;right:-30%;top:-6%;height:40%;pointer-events:none}
${P} #o-coil .zap svg{width:100%;height:100%;overflow:visible}
${P} #o-coil .zap path{fill:none;stroke:#bffbff;stroke-width:2;filter:drop-shadow(0 0 3px #7ff3ff);opacity:0;animation:${ID}-zap 1.3s steps(1) infinite}
${P} #o-coil .zap path:nth-child(2){animation-delay:-.45s} ${P} #o-coil .zap path:nth-child(3){animation-delay:-.9s}
/* logbook cabinet (wave 2) */
${P} #o-cabinet{left:3%;top:70%;width:27%;height:21%;background:linear-gradient(#5a3a22,#3a2416);border-radius:4px;box-shadow:inset 0 0 0 3px #c88a3a,0 6px 12px rgba(0,0,0,.5);overflow:hidden}
${P} #o-cabinet .book{position:absolute;left:22%;right:22%;top:24%;height:52%;background:linear-gradient(90deg,#6b1f1f,#9a2e2e 20%,#7a2424);border-radius:2px 5px 5px 2px;box-shadow:inset 3px 0 0 #3a0e0e,0 0 0 rgba(127,243,255,0);transition:box-shadow 1s 1s}
${P} #o-cabinet .book::after{content:"LOG";position:absolute;left:0;right:0;top:34%;text-align:center;font-family:'Archivo Black',Arial;font-size:9px;color:#ffcf7a;letter-spacing:1px}
${P} #o-cabinet .glass{position:absolute;inset:8%;background:linear-gradient(135deg,rgba(200,240,255,.35),rgba(200,240,255,.08) 40%,rgba(200,240,255,.3));border:2px solid #e0b060;border-radius:2px;transition:transform 1.4s cubic-bezier(.6,.05,.3,1)}
${P} #o-cabinet .glass::after{content:"";position:absolute;left:38%;top:62%;width:24%;height:22%;background:linear-gradient(#d6a74a,#8a6420);border-radius:2px}
${P} #o-cabinet.revealed .glass{transform:translateY(-110%)}
${P} #o-cabinet.revealed .book{box-shadow:inset 3px 0 0 #3a0e0e,0 0 14px rgba(127,243,255,.8)}
/* steam safe (wave 2) */
${P} #o-safe{right:3%;top:73%;width:25%;height:21%;background:linear-gradient(#4a525a,#2a3036);border-radius:6px;box-shadow:inset 0 0 0 3px #1a1e22,0 6px 12px rgba(0,0,0,.5);perspective:200px}
${P} #o-safe .inside{position:absolute;inset:10%;background:#0e1114;border-radius:3px;box-shadow:inset 0 0 10px #000}
${P} #o-safe .inside::after{content:"";position:absolute;left:20%;right:20%;top:40%;height:26%;background:repeating-linear-gradient(90deg,#f4efe6 0 3px,#d8d0c0 3px 4px);border-radius:2px;box-shadow:0 0 10px rgba(127,243,255,.4)}
${P} #o-safe .sdoor{position:absolute;inset:6%;background:linear-gradient(135deg,#7a848e,#4a525a);border-radius:4px;box-shadow:inset 0 0 0 2px #2a3036;transform-origin:left center;transition:transform 1.3s cubic-bezier(.4,1.4,.5,1)}
${P} #o-safe .gauge{position:absolute;left:30%;top:14%;width:40%;aspect-ratio:1;border-radius:50%;background:#fdf6e6;box-shadow:0 0 0 3px #c88a3a}
${P} #o-safe .gauge i{position:absolute;left:48%;top:12%;width:4%;height:40%;background:#b5482e;transform-origin:50% 100%;animation:${ID}-needle 1.8s ease-in-out infinite}
${P} #o-safe .valve{position:absolute;left:36%;bottom:10%;width:28%;height:12%;background:#b5482e;border-radius:3px;box-shadow:0 0 0 2px #5a1e14}
${P} #o-safe.revealed .sdoor{transform:rotateY(-95deg)}
${P} #o-safe.revealed .gauge i{animation:none;transform:rotate(-60deg)}
/* time machine (final) */
${P} #o-machine{left:30%;top:47%;width:41%;height:47%}
${P} #o-machine .ring{position:absolute;left:8%;right:8%;top:0;aspect-ratio:1;border-radius:50%;background:conic-gradient(from 0deg,#0a2a33,#7ff3ff,#1a4a6a,#c6faff,#0a2a33,#7ff3ff,#0a2a33);box-shadow:0 0 0 7px #c88a3a,0 0 0 10px #5a3a1e,0 0 24px rgba(127,243,255,.6);animation:${ID}-spin 3s linear infinite}
${P} #o-machine .ring::after{content:"";position:absolute;inset:22%;border-radius:50%;background:radial-gradient(#ffffff,#9ff6ff 40%,transparent 72%);animation:${ID}-pulse 1.6s ease-in-out infinite}
${P} #o-machine .rivets{position:absolute;left:8%;right:8%;top:0;aspect-ratio:1;border-radius:50%;pointer-events:none}
${P} #o-machine .rivets i{position:absolute;left:50%;top:50%;width:5%;height:5%;margin:-2.5%;border-radius:50%;background:#ffe2a0}
${P} #o-machine .desk{position:absolute;left:0;right:0;bottom:0;height:40%;background:linear-gradient(#8a5a2e,#4a2e16);border-radius:10px 10px 4px 4px;box-shadow:inset 0 0 0 3px #c88a3a,0 8px 16px rgba(0,0,0,.6);clip-path:polygon(6% 0,94% 0,100% 100%,0 100%)}
${P} #o-machine .lights{position:absolute;left:12%;right:12%;bottom:29%;display:flex;justify-content:space-between}
${P} #o-machine .lights b{width:11%;aspect-ratio:1;border-radius:50%;background:#2a0e0a;box-shadow:inset 0 0 0 2px #1a0a06,0 0 0 2px #c88a3a}
${P} #o-machine .lights b.on{background:radial-gradient(#ffffff,#7ff3ff 55%);box-shadow:0 0 10px #7ff3ff,0 0 0 2px #c88a3a}
${P} #o-machine .dial{position:absolute;bottom:5%;width:16%;aspect-ratio:1;border-radius:50%;background:#fdf6e6;box-shadow:0 0 0 2px #c88a3a}
${P} #o-machine .dial i{position:absolute;left:46%;top:12%;width:8%;height:40%;background:#b5482e;transform-origin:50% 100%;animation:${ID}-needle 1.1s ease-in-out infinite}
${P} #o-machine .lever{position:absolute;left:47%;bottom:4%;width:5%;height:14%;background:linear-gradient(90deg,#8a96a2,#e0e6ea,#8a96a2);transform-origin:50% 100%;transform:rotate(-20deg);border-radius:3px}
${P} #o-machine .lever::after{content:"";position:absolute;left:-60%;top:-20%;width:220%;aspect-ratio:1;border-radius:50%;background:#b5482e}
${P} .loop{position:absolute;left:30%;top:47%;width:41%;height:22%;pointer-events:none;z-index:3}
${P} .loop i{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:50%;background:#bffbff;box-shadow:0 0 8px #7ff3ff;animation:${ID}-orbit 2.8s linear infinite}
@keyframes ${ID}-spin{to{transform:rotate(360deg)}}
@keyframes ${ID}-swing{0%,100%{transform:rotate(11deg)}50%{transform:rotate(-11deg)}}
@keyframes ${ID}-puff{0%{opacity:0;transform:translate(0,0) scale(.4)}20%{opacity:.9}100%{opacity:0;transform:translate(-14px,-40px) scale(1.8)}}
@keyframes ${ID}-zap{0%{opacity:1}12%{opacity:0}40%{opacity:.8}46%{opacity:0}100%{opacity:0}}
@keyframes ${ID}-glow{0%,100%{box-shadow:0 0 0 6px #c88a3a,0 0 0 9px #5a3a1e,0 0 18px rgba(127,243,255,.25)}50%{box-shadow:0 0 0 6px #c88a3a,0 0 0 9px #5a3a1e,0 0 36px rgba(127,243,255,.55)}}
@keyframes ${ID}-needle{0%,100%{transform:rotate(-40deg)}50%{transform:rotate(50deg)}}
@keyframes ${ID}-pulse{0%,100%{transform:scale(.8);opacity:.7}50%{transform:scale(1.1);opacity:1}}
@keyframes ${ID}-orbit{from{transform:rotate(0) translateX(70px) rotate(0)}to{transform:rotate(360deg) translateX(70px) rotate(-360deg)}}
`,
  sceneHTML:`
<div class="wall"></div><div class="floor"></div><div class="beam"></div>
<div class="pipe" style="right:7%;top:3%;width:2.6%;height:30%"></div><div class="pipe h" style="right:7%;top:30%;width:16%;height:2.2%"></div>
<div class="pipe" style="left:39%;top:3%;width:2%;height:3%"></div>
<div class="puff" style="right:3%;top:24%"></div><div class="puff" style="right:3%;top:24%;animation-delay:-1.6s"></div>
<div class="pend"></div>
<button class="obj" id="o-clock" aria-label="Giant clock face"><svg viewBox="-50 -50 100 100">${[...Array(60)].map((_,i)=>`<rect x="-.4" y="-47" width=".8" height="${i%5?2:5}" fill="#1a1410" opacity=".8" transform="rotate(${i*6})"/>`).join('')}${['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'].map((r,i)=>{const a=(i*30-90)*Math.PI/180;return `<text x="${(36*Math.cos(a)).toFixed(1)}" y="${(36*Math.sin(a)+3).toFixed(1)}" text-anchor="middle" font-family="Georgia,serif" font-size="8" font-weight="700" fill="#1a1410">${r}</text>`}).join('')}<circle r="22" fill="none" stroke="#1a1410" stroke-width=".5" opacity=".4"/></svg><div class="hand h"></div><div class="hand m"></div><div class="hub"></div><span class="spark"></span></button>
<button class="obj" id="o-gears" aria-label="Turning gears">${roomGears()}<span class="spark"></span></button>
<button class="obj" id="o-coil" aria-label="Sparking Tesla coil"><div class="zap"><svg viewBox="0 0 100 40"><path d="M50 30 L38 20 L42 16 L22 6 L26 2 L8 -4"/><path d="M50 30 L62 22 L58 16 L80 8 L76 2 L94 -2"/><path d="M50 30 L48 18 L54 12 L46 2 L52 -6"/></svg></div><div class="torus"></div><div class="tube"></div><div class="base"></div><span class="spark"></span></button>
<button class="obj" id="o-machine" aria-label="Time machine console"><div class="ring"></div><div class="rivets">${[...Array(12)].map((_,i)=>`<i style="transform:rotate(${i*30}deg) translateY(-560%)"></i>`).join('')}</div><div class="desk"></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><div class="dial" style="left:14%"><i></i></div><div class="dial" style="right:14%"><i style="animation-delay:-.4s"></i></div><div class="lever"></div><span class="spark"></span></button>
<div class="loop"><i></i><i style="animation-delay:-1.4s"></i></div>
<button class="obj" id="o-cabinet" aria-label="Glass cabinet with logbook"><div class="book"></div><div class="glass"></div><span class="spark"></span></button>
<button class="obj" id="o-safe" aria-label="Steam-locked safe"><div class="inside"></div><div class="sdoor"><div class="gauge"><i></i></div><div class="valve"></div></div><span class="spark"></span></button>
<div class="puff" style="right:12%;top:68%;animation-delay:-.8s"></div>`,
  order:["clock","gears","coil","cabinet","safe","machine"],
  revealOnWave2:[{sel:'#o-cabinet',cls:'revealed'},{sel:'#o-safe',cls:'revealed'}],
  wave2Toast:"Hiss! The safe door blew open in a puff of steam, and the cabinet glass slid up.",
  finalReadyToast:"Five letters are humming in the time machine. Enter the shutdown word.",
  startToast:"The clock is spinning far too fast. Tap anything that sparkles.",
  locks:{
    /* Solution: every card shows o'clock, so the long hand always points at 12 (letter T, a decoy).
       Short hands: 3 = S, 9 = P, 5 = A, 7 = R, 1 = K. SPARK. */
    clock:{wave:1,title:"The Talking Clock",obj:"o-clock",answer:"SPARK",kind:"word",tile:"U",
      scene:"Behind the spinning hands, the clock face has letters instead of numbers. Professor Tock's sticky note: <em>\"The long hand is a liar. Only the short hand speaks.\"</em> Read the five clocks in order.",
      extra:letterFace(),
      cards:[miniClock(3,1)+'<div style="text-align:center;font-weight:700">Clock 1</div>',miniClock(9,2)+'<div style="text-align:center;font-weight:700">Clock 2</div>',miniClock(5,3)+'<div style="text-align:center;font-weight:700">Clock 3</div>',miniClock(7,4)+'<div style="text-align:center;font-weight:700">Clock 4</div>',miniClock(1,5)+'<div style="text-align:center;font-weight:700">Clock 5</div>'],
      hints:["Ignore the long grey hand. It always points straight up.","Find where the short black hand points on each clock, then find that spot on the letter face. Clock 1 points to 3 o'clock.","The short hands point at S, P, A, R and K. The answer is SPARK."]},
    /* Solution: gears in a chain pass the same number of teeth. A has 16 teeth x 3 turns = 48 teeth.
       B (8 teeth) turns 48/8 = 6, C (12) turns 4, D (24) turns 2. Code B, C, D = 642. Tooth counts are drawn exactly. */
    gears:{wave:1,title:"The Gear Train",obj:"o-gears",answer:"642",kind:"num",tile:"E",
      scene:"Four gears are linked in a row: A turns B, B turns C, C turns D. When two gears touch, the same number of teeth pass each other. Count the teeth, turn the crank, and the code is how many full turns B, C and D make, in that order.",
      cards:[gearSVG(16,'A','#c88a3a'),gearSVG(8,'B','#e0b060'),gearSVG(12,'C','#a8672a'),gearSVG(24,'D','#d89a50'),"<b>The crank:</b> turn gear A exactly 3 full times."],
      hints:["Count the teeth on gear A, then work out how many teeth pass in 3 turns.","16 teeth times 3 turns is 48 teeth. Every gear in the chain moves 48 teeth. How many turns is that for 8 teeth?","B turns 6 times, C 4 times, D 2 times. The answer is 642."]},
    /* Solution: 1,3,5,_,9 (+2) = 7; 1,2,_,8,16 (doubling) = 4; 20,17,14,11,_ (-3) = 8; 2,3,5,6,8,_ (+1,+2 alternating) = 9. Code 7489. */
    coil:{wave:1,title:"The Coil Readings",obj:"o-coil",answer:"7489",kind:"num",tile:"P",
      scene:"The Tesla coil crackles. Its four meters each flash a number pattern with one reading missing. The code is the four missing numbers, meter 1 to meter 4.",
      cards:["<b>Meter 1</b>"+seq([1,3,5,'?',9]),"<b>Meter 2</b>"+seq([1,2,'?',8,16]),"<b>Meter 3</b>"+seq([20,17,14,11,'?']),"<b>Meter 4</b>"+seq([2,3,5,6,8,'?'])],
      hints:["Look at how each number changes to get to the next one.","Meter 2 doubles each time. Meter 4 goes up by 1, then 2, then 1, then 2.","The missing numbers are 7, 4, 8 and 9. The answer is 7489."]},
    /* Solution: start 9:40. +2h35 = 12:15, -50 = 11:25, +1h15 = 12:40, -25 = 12:15, +30 = 12:45. Code 1245.
       Net change is +3h05 whatever order the jumps are added. */
    cabinet:{wave:2,title:"The Logbook",obj:"o-cabinet",answer:"1245",kind:"num",tile:"S",
      lockedMsg:"The logbook is locked behind glass. Crack two of the first locks to lift it.",
      scene:"The professor's logbook: <em>\"Left the workshop at <b>9:40</b> in the morning. Made five jumps. Wherever I land, that's the time the machine is stuck on.\"</em> Set the code to the final time, hours then minutes (so 7:05 would be 705).",
      cardClass:"hand",cards:["Jump: forward 2 hours 35 minutes","Jump: back 50 minutes","Jump: forward 1 hour 15 minutes","Jump: back 25 minutes","Jump: forward 30 minutes"],
      hints:["You need every jump. The order doesn't matter, but forward adds time and back takes it away.","After the first two jumps it's 11:25.","The final time is 12:45. The answer is 1245."]},
    /* Solution: tape reads JY XY VI. The clock card shows 4 o'clock, so shift each letter back 4:
       J-F, Y-U, X-T, Y-U, V-R, I-E. FUTURE. */
    safe:{wave:2,title:"The Ticker Tape",obj:"o-safe",answer:"FUTURE",kind:"word",tile:"A",
      lockedMsg:"The safe is sealed by steam pressure. Crack two of the first locks to vent it.",
      scene:"Inside the safe, a torn ticker tape in the professor's code. The alphabet below will help. Join the pieces in order, then shift every letter back the right number of places.",
      extra:`<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:2px">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(c=>`<span style="width:22px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:4px;background:#2a221b;border:1px solid #4a4136;font-weight:700;font-size:13px">${c}</span>`).join('')}</div>`,
      cards:[tape('JY',1),tape('XY',2),tape('VI',3),`<div style="text-align:center"><b>Shift key:</b> move each letter back as many places as the hour on this clock.</div>${miniClock(4,'key')}`],
      hints:["Read the shift clock's short hand. That's how many letters back to move.","The clock says 4. J moved back 4 places is F.","JYXYVI moved back 4 spells FUTURE."]},
    /* Tiles U, E, P, S, A. Only English anagram: PAUSE. */
    machine:{wave:3,title:"The Time Machine",obj:"o-machine",answer:"PAUSE",kind:"word",
      scene:"Each lock you crack slots a glowing letter into the console. A warning flashes: <em>\"LOOP DETECTED. Enter the button word to stop time from repeating.\"</em>",
      hints:["It's a button on every remote control that stops things for a moment.","It starts with P. It's the opposite of play.","The answer is PAUSE."]}
  },
  finale:{tag:"LOOP BROKEN",titleHTML:"TIME IS<br><span>BACK ON</span>",
    cardHTML:`<h3>Professor Tock's Thank-You</h3>The portal fizzles, the gears slow to a gentle tick, and the giant clock finally shows the right time. For the first time in a hundred loops, the next hour is a brand new one.<div class="note">"You've saved time itself! Help yourselves to the biscuits on my desk. They've been fresh for a very, very long time. Prof. T."</div>`}
};
EXP_ORDER.push(ID);
})();
