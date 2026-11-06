(function(){
const ID='shipwreck-island', P=`.scene[data-exp="${ID}"]`;

/* ---------- castaway flag code ---------- */
function flag(L,x,y,w=30,h=22){
  const R='#d8402e',W='#f7f3e8',B='#2f6fc0',Y='#f5c518',K='#1d1d1d', hw=w/2, hh=h/2; let g='';
  switch(L){
    case 'D':g=`<rect width="${w}" height="${h}" fill="${W}"/><path d="M0 0H${w}L0 ${h}Z" fill="${R}"/>`;break;
    case 'O':g=`<rect width="${w}" height="${hh}" fill="${Y}"/><rect y="${hh}" width="${w}" height="${hh}" fill="${R}"/>`;break;
    case 'E':g=`<rect width="${w}" height="${hh}" fill="${B}"/><rect y="${hh}" width="${w}" height="${hh}" fill="${R}"/>`;break;
    case 'A':g=`<rect width="${hw}" height="${h}" fill="${W}"/><rect x="${hw}" width="${hw}" height="${h}" fill="${B}"/>`;break;
    case 'R':g=`<rect width="${w}" height="${h}" fill="${B}"/><rect x="${hw-3}" width="6" height="${h}" fill="${Y}"/><rect y="${hh-3}" width="${w}" height="6" fill="${Y}"/>`;break;
    case 'N':g=`<rect width="${w}" height="${h}" fill="${K}"/><path d="M0 0L${w} ${h}M${w} 0L0 ${h}" stroke="${W}" stroke-width="4"/>`;break;
    case 'I':g=`<rect width="${w}" height="${h}" fill="${Y}"/><circle cx="${hw}" cy="${hh}" r="${h*.28}" fill="${K}"/>`;break;
    case 'S':g=`<rect width="${w}" height="${h}" fill="${W}"/><rect x="${w*.3}" y="${h*.25}" width="${w*.4}" height="${h*.5}" fill="${B}"/>`;break;
    case 'F':g=`<rect width="${w}" height="${h}" fill="${R}"/><rect x="5" y="5" width="${w-10}" height="${h-10}" fill="${W}"/>`;break;
    case 'T':g=`<rect width="${w/3}" height="${h}" fill="${R}"/><rect x="${w/3}" width="${w/3}" height="${h}" fill="${W}"/><rect x="${2*w/3}" width="${w/3}" height="${h}" fill="${B}"/>`;break;
    case 'W':g=`<rect width="${w}" height="${h}" fill="${W}"/><rect width="${hw}" height="${hh}" fill="${B}"/><rect x="${hw}" y="${hh}" width="${hw}" height="${hh}" fill="${B}"/>`;break;
    case 'L':g=`<rect width="${w}" height="${h}" fill="${Y}"/><rect x="${hw}" width="${hw}" height="${hh}" fill="${K}"/><rect y="${hh}" width="${hw}" height="${hh}" fill="${K}"/>`;break;
  }
  return `<g transform="translate(${x} ${y})">${g}<rect width="${w}" height="${h}" fill="none" stroke="#3a2a1a" stroke-width="1"/></g>`;
}
function flagLine(){
  const msg='DRIFTWOOD'.split(''); let g=`<rect width="320" height="74" rx="8" fill="#f2c48d"/><path d="M6 14 Q160 26 314 14" stroke="#6b4a2a" stroke-width="2" fill="none"/>`;
  msg.forEach((c,i)=>{const x=10+i*34.2, y=14+Math.sin(Math.PI*(x/320))*11; g+=`<path d="M${x+15} ${y} v4" stroke="#6b4a2a"/>`+flag(c,x,y+4,30,24)+`<text x="${x+15}" y="${y+42}" text-anchor="middle" font-size="9" font-weight="700" fill="#7a4a22" font-family="Inter,sans-serif">${i+1}</text>`});
  return `<svg viewBox="0 0 320 74" role="img" aria-label="Nine flags on a line">${g}</svg>`;
}
const keyCard=s=>`<b style="display:block;margin-bottom:6px">Flag chart, scrap</b><div style="display:flex;flex-direction:column;gap:6px">${s.split('').map(c=>`<div style="display:flex;align-items:center;gap:10px"><svg viewBox="0 0 32 24" width="40" height="30">${flag(c,1,1,30,22)}</svg><b style="font-family:'Archivo Black',Inter,sans-serif;font-size:20px">= ${c}</b></div>`).join('')}</div>`;

/* ---------- knotted rope ---------- */
const ROPE=[[50,60,70],[20,30,40,50,104,114],[6,16,26],[50,60]];  // knot x positions, piece width 120 -> bunches 3,4,(2+3),2
function ropePiece(i){
  let g=`<rect width="120" height="60" fill="#e9cf9c"/><path d="M0 46 Q30 40 60 47 T120 44" stroke="#dcbf86" stroke-width="6" fill="none"/>`;
  const x0=i===0?14:0, x1=i===3?100:120;
  g+=`<path d="M${x0} 30 H${x1}" stroke="#8a5a2a" stroke-width="6" stroke-linecap="${i===0||i===3?'round':'butt'}"/><path d="M${x0} 30 H${x1}" stroke="#c48a4a" stroke-width="2.5" stroke-dasharray="3 3"/>`;
  if(i===0) g+=`<circle cx="9" cy="30" r="7" fill="none" stroke="#6b6b6b" stroke-width="3"/>`;
  if(i===3) g+=`<path d="M100 30 l9 -6 M100 30 l10 -1 M100 30 l9 5 M100 30 l7 8" stroke="#a87a4a" stroke-width="2" stroke-linecap="round"/>`;
  g+=ROPE[i].map(x=>`<ellipse cx="${x}" cy="30" rx="4.6" ry="7" fill="#7a4a1e" stroke="#4a2a10" stroke-width="1"/><path d="M${x-3} 26 Q${x} 30 ${x+3} 34" stroke="#c48a4a" stroke-width="1.2" fill="none"/>`).join('');
  if(i>0) g+=`<path d="M1 10 V50" stroke="#b03a2a" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  if(i<3) g+=`<path d="M119 10 V50" stroke="#b03a2a" stroke-width="1.2" stroke-dasharray="3 3"/>`;
  return `<svg viewBox="0 0 120 60" role="img" aria-label="Rope piece ${i+1}">${g}</svg>`;
}

/* ---------- star chart ---------- */
// [name, colour, points, big?, x, y]
const STARS=[['CORAL','#ffd84a',6,1,52,58],['PEARL','#ffd84a',6,1,228,46],['SHELL','#7fc8ff',6,1,112,160],['SQUID','#ffd84a',4,1,38,148],['WHALE','#ffd84a',5,0,96,104],['OTTER','#ffffff',6,1,118,40],['SHARK','#ffffff',4,0,192,118],['SKATE','#7fc8ff',5,0,262,108],['GULLS','#ffd84a',4,0,218,172]];
function starPath(n,R){const r=R*.45;let d='';for(let i=0;i<n*2;i++){const a=Math.PI*i/n-Math.PI/2,rr=i%2?r:R;d+=(i?'L':'M')+(rr*Math.cos(a)).toFixed(1)+' '+(rr*Math.sin(a)).toFixed(1)}return d+'Z'}
function chartSVG(){
  let g=`<rect width="300" height="210" rx="8" fill="#0f1d3a"/><rect x="4" y="4" width="292" height="202" rx="6" fill="none" stroke="#c9a24a" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  [[20,20],[80,190],[150,18],[280,30],[270,190],[160,190],[30,100],[250,80]].forEach(([x,y])=>g+=`<circle cx="${x}" cy="${y}" r=".9" fill="#9fb4d8"/>`);
  g+=`<circle cx="150" cy="105" r="17" fill="#f3ead1"/><circle cx="157" cy="100" r="15" fill="#0f1d3a"/><text x="150" y="134" text-anchor="middle" font-size="8" fill="#c9a24a" font-family="Inter,sans-serif">MOON</text>`;
  STARS.forEach(([n,c,p,big,x,y])=>{const R=big?14:10;g+=`<g transform="translate(${x} ${y})"><path d="${starPath(p,R)}" fill="${c}" stroke="#0f1d3a" stroke-width=".6"/></g><text x="${x}" y="${y+R+10}" text-anchor="middle" font-size="9" font-weight="700" fill="#e6dcc0" font-family="Inter,sans-serif">${n}</text>`});
  return `<svg viewBox="0 0 300 210" role="img" aria-label="Star chart with nine named stars around the moon">${g}</svg>`;
}

/* ---------- mirror note ---------- */
const mirror=(t,sz)=>`<div style="transform:scaleX(-1);font-family:Georgia,'Times New Roman',serif;font-weight:700;font-size:${sz}px;letter-spacing:4px;text-align:center;color:#2a3a5a;line-height:1">${t}</div>`;

EXPERIENCES[ID]={
  id:ID, title:"Shipwreck Island", titleHTML:"SHIPWRECK<br><span>ISLAND</span>",
  tag:"A desert island escape room",
  blurb:"Your ship hit the reef and you washed up on a tiny island. A rescue ship sails past tonight. Find a way to signal it before it's gone.",
  menuBlurb:"Stranded on a desert island. The rescue ship passes tonight. Signal it.",
  menuLine:"Signal the rescue ship",
  theme:{accent:'#ff9a45',accent2:'#4fd8cf',bg:'#0b1116',introBg:'#3a1c18'},
  sceneCSS:`
${P}{background:#e8c48a}
${P} .sky{position:absolute;left:0;right:0;top:0;height:42%;background:linear-gradient(#3b2a5c 0%,#a8456a 38%,#f07a45 70%,#ffc46a 100%)}
${P} .sun{position:absolute;left:52%;top:31%;width:26%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#fff0b0,#ffb44a 60%,#ff8a3a);box-shadow:0 0 40px 12px rgba(255,170,70,.55);animation:glowpulse 5s ease-in-out infinite}
${P} .cloud{position:absolute;height:3%;border-radius:20px;background:rgba(255,190,170,.55);animation:${ID}-cloud 40s linear infinite}
${P} .gull{position:absolute;top:12%;left:-10%;width:7%;height:2%;animation:${ID}-gull 18s linear infinite}
${P} .gull::before,${P} .gull::after{content:"";position:absolute;top:0;width:50%;height:100%;border-top:2px solid #2a1a2a;border-radius:50% 50% 0 0}
${P} .gull::before{left:0;transform:rotate(12deg)} ${P} .gull::after{right:0;transform:rotate(-12deg)}
${P} .sea{position:absolute;left:0;right:0;top:41%;height:21%;background:linear-gradient(#2fa8b0,#1fc0b8 40%,#5fe0d0);overflow:hidden}
${P} .glint{position:absolute;left:52%;width:26%;top:0;height:100%;background:repeating-linear-gradient(0deg,rgba(255,220,150,.5) 0 2px,transparent 2px 9px);opacity:.6;clip-path:polygon(30% 0,70% 0,100% 100%,0 100%)}
${P} .wave{position:absolute;left:0;width:200%;height:14%;animation:${ID}-wave 3s linear infinite}
${P} .wave svg{display:block;width:100%;height:100%}
${P} .surf{position:absolute;left:-5%;right:-5%;top:58%;height:7%;border-radius:50%;background:radial-gradient(ellipse at 50% 0,rgba(255,255,255,.85),rgba(255,255,255,.2) 55%,transparent 70%);animation:${ID}-surf 4s ease-in-out infinite}
${P} .sand{position:absolute;left:0;right:0;bottom:0;height:40%;background:radial-gradient(ellipse at 50% 0,#f2d39a,#e2b876 60%,#c99a5a)}
${P} .sand::after{content:"";position:absolute;inset:0;background:radial-gradient(circle,rgba(150,100,50,.25) 1px,transparent 1.5px);background-size:11px 9px}
/* hull + mast */
${P} .hull{position:absolute;left:-6%;top:48%;width:52%;height:24%;background:repeating-linear-gradient(170deg,#6b4226 0 9px,#5a361e 9px 11px);border-radius:0 0 60% 30%/0 0 90% 60%;transform:rotate(-9deg);box-shadow:inset 0 -10px 18px rgba(0,0,0,.4),0 8px 14px rgba(0,0,0,.35)}
${P} .hull::before{content:"";position:absolute;left:0;right:-2%;top:-6%;height:14%;background:#3e2614;border-radius:3px}
${P} .hole{position:absolute;left:62%;top:48%;width:20%;height:30%;background:#1a0f08;clip-path:polygon(10% 20%,40% 0,80% 15%,100% 60%,70% 100%,20% 85%,0 55%)}
${P} .mast{position:absolute;left:30%;top:9%;width:2.4%;height:45%;background:linear-gradient(90deg,#4a2e18,#7a5230,#4a2e18);transform:rotate(-12deg);transform-origin:bottom center}
${P} .spar{position:absolute;left:9%;top:16%;width:30%;height:1.4%;background:#5a3a1e;transform:rotate(-24deg);border-radius:3px}
${P} #o-flags{left:3%;top:10%;width:34%;height:14%}
${P} #o-flags .line{position:absolute;left:2%;right:6%;top:18%;height:40%;border-top:2px solid #3a2414;border-radius:50% 50% 0 0/60% 60% 0 0;transform:rotate(-14deg)}
${P} #o-flags i{position:absolute;width:15%;height:30%;border:1px solid #3a2414;transform-origin:top center;animation:${ID}-flutter 1.6s ease-in-out infinite}
/* hatch (wave 2) */
${P} #o-hatch{left:8%;top:54%;width:22%;height:13%;background:#1a0f08;border-radius:4px;transform:rotate(-9deg);box-shadow:inset 0 0 0 3px #3e2614;overflow:hidden}
${P} #o-hatch .glow2{position:absolute;inset:0;background:radial-gradient(circle at 50% 70%,rgba(255,200,90,.85),rgba(255,160,60,.2) 50%,transparent 70%);opacity:0;transition:opacity 1s .8s}
${P} #o-hatch .chest{position:absolute;left:28%;right:28%;bottom:10%;height:40%;background:linear-gradient(#8a5a2a,#5a3618);border-radius:3px 3px 1px 1px;border:2px solid #c9a24a;opacity:0;transition:opacity 1s .8s}
${P} #o-hatch .plank{position:absolute;left:-10%;width:120%;height:26%;background:linear-gradient(#9a6a3a,#7a4e28);border:1px solid #3e2614;transition:transform 1.1s cubic-bezier(.6,.05,.3,1),opacity 1.1s}
${P} #o-hatch .plank:nth-child(1){top:14%;transform:rotate(14deg)} ${P} #o-hatch .plank:nth-child(2){top:56%;transform:rotate(-12deg)}
${P} #o-hatch.revealed .plank:nth-child(1){transform:translate(-30%,240%) rotate(60deg);opacity:0}
${P} #o-hatch.revealed .plank:nth-child(2){transform:translate(40%,200%) rotate(-50deg);opacity:0;transition-delay:.25s}
${P} #o-hatch.revealed .glow2,${P} #o-hatch.revealed .chest{opacity:1}
/* tide post */
${P} #o-tide{left:46%;top:38%;width:9%;height:23%;background:linear-gradient(90deg,#6b4428,#9a6a3e 50%,#6b4428);border-radius:3px 3px 0 0;box-shadow:2px 4px 6px rgba(0,0,0,.3)}
${P} #o-tide i{position:absolute;left:0;width:45%;height:2px;background:#f7f0dc}
${P} #o-tide::after{content:"";position:absolute;left:-30%;right:-30%;bottom:-6%;height:16%;border-radius:50%;background:radial-gradient(ellipse,rgba(255,255,255,.8),transparent 70%);animation:${ID}-surf 3s ease-in-out infinite}
/* palm + rope */
${P} .palm{position:absolute;right:4%;top:22%;width:30%;height:56%;transform-origin:70% 100%;animation:${ID}-palm 6s ease-in-out infinite}
${P} .trunk{position:absolute;right:30%;top:8%;width:12%;height:92%;background:repeating-linear-gradient(170deg,#8a5e34 0 8px,#6b4426 8px 10px);border-radius:40% 40% 10% 10%;transform:rotate(8deg);transform-origin:bottom}
${P} .frond{position:absolute;right:30%;top:6%;width:62%;height:12%;background:linear-gradient(#3f8a3a,#2a6a2a);border-radius:100% 0 100% 0;transform-origin:100% 50%}
${P} .coco{position:absolute;right:38%;top:12%;width:9%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#8a6a3a,#4a3018)}
${P} #o-rope{right:13%;top:31%;width:13%;height:30%}
${P} #o-rope::before{content:"";position:absolute;left:46%;top:0;bottom:0;width:8%;background:repeating-linear-gradient(0deg,#c48a4a 0 3px,#8a5a2a 3px 6px);border-radius:3px}
${P} #o-rope i{position:absolute;left:34%;width:32%;height:6%;border-radius:50%;background:#6b4220;box-shadow:inset 0 -1px 0 #3a2210}
/* bottle (wave 2) */
${P} #o-bottle{left:66%;top:47%;width:14%;height:6%;transition:left 2s ease-in-out,top 2s ease-in-out,transform 2s;animation:${ID}-bob 2.4s ease-in-out infinite}
${P} #o-bottle .glass{position:absolute;left:0;top:18%;width:76%;height:64%;border-radius:40% 30% 30% 40%;background:linear-gradient(#bff0e0,#5fb8a0);box-shadow:inset 0 0 0 1px #2f7a6a}
${P} #o-bottle .glass::after{content:"";position:absolute;left:20%;right:24%;top:28%;bottom:28%;background:#f2e6c4;border-radius:2px}
${P} #o-bottle .neck{position:absolute;left:72%;top:36%;width:18%;height:28%;background:#7fcab4}
${P} #o-bottle .cork{position:absolute;left:88%;top:34%;width:12%;height:32%;background:#a8784a;border-radius:2px}
${P} #o-bottle.locked{opacity:.85}
${P} #o-bottle.revealed{left:77%;top:85%;transform:rotate(-20deg);animation:none}
/* crab */
${P} .crab{position:absolute;bottom:4%;left:0;width:9%;height:4%;animation:${ID}-crab 14s ease-in-out infinite;z-index:3;pointer-events:none}
${P} .crab b{position:absolute;left:15%;right:15%;top:30%;bottom:0;border-radius:50% 50% 30% 30%;background:#e0452a}
${P} .crab i{position:absolute;top:0;width:22%;height:44%;border-radius:50%;background:#e0452a}
${P} .crab i:first-of-type{left:0} ${P} .crab i:last-of-type{right:0}
${P} .crab s{position:absolute;top:36%;width:5%;height:20%;background:#1a1a1a;border-radius:50%}
/* beacon (final) */
${P} #o-beacon{left:28%;top:69%;width:44%;height:24%}
${P} #o-beacon .logs{position:absolute;left:22%;right:22%;top:0;height:66%;background:linear-gradient(75deg,transparent 46%,#6b4226 46% 54%,transparent 54%),linear-gradient(105deg,transparent 46%,#7a4e2a 46% 54%,transparent 54%),linear-gradient(90deg,transparent 45%,#5a361e 45% 55%,transparent 55%),linear-gradient(60deg,transparent 47%,#6b4226 47% 53%,transparent 53%),linear-gradient(120deg,transparent 47%,#5a361e 47% 53%,transparent 53%)}
${P} #o-beacon .flame{position:absolute;left:38%;right:38%;top:16%;height:46%;border-radius:50% 50% 40% 40%;background:radial-gradient(ellipse at 50% 80%,#fff2b0,#ff9a3a 45%,#e0452a 70%,transparent 72%);opacity:0;transform-origin:bottom center;transition:opacity 1s}
${P} #o-beacon.solved .flame{opacity:1;animation:${ID}-fire .3s ease-in-out infinite alternate}
${P} #o-beacon .ring{position:absolute;left:4%;right:4%;bottom:0;height:42%;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,#3a2a1a 40%,#8a8478 42%,#6a645a 70%);box-shadow:0 6px 10px rgba(0,0,0,.35)}
${P} #o-beacon .lights{position:absolute;left:14%;right:14%;bottom:12%;display:flex;justify-content:space-between}
${P} #o-beacon .lights b{width:9%;aspect-ratio:1;border-radius:50%;background:#3a2e22;box-shadow:inset 0 0 0 1px #000}
${P} #o-beacon .lights b.on{background:#ffcf6a;box-shadow:0 0 8px #ff9a45,0 0 2px #fff inset}
@keyframes ${ID}-wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes ${ID}-surf{0%,100%{transform:translateY(0) scaleX(1);opacity:.9}50%{transform:translateY(-18%) scaleX(1.04);opacity:.55}}
@keyframes ${ID}-palm{0%,100%{transform:rotate(0)}50%{transform:rotate(-2.5deg)}}
@keyframes ${ID}-bob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-22%) rotate(6deg)}}
@keyframes ${ID}-crab{0%{transform:translateX(0)}40%{transform:translateX(220%)}50%{transform:translateX(220%)}90%{transform:translateX(30%)}100%{transform:translateX(0)}}
@keyframes ${ID}-cloud{from{transform:translateX(-120%)}to{transform:translateX(420%)}}
@keyframes ${ID}-gull{0%{transform:translate(0,0)}50%{transform:translate(800%,60%)}100%{transform:translate(1600%,0)}}
@keyframes ${ID}-flutter{0%,100%{transform:skewY(0) rotate(-14deg)}50%{transform:skewY(8deg) rotate(-14deg)}}
@keyframes ${ID}-fire{from{transform:scaleY(1) skewX(-3deg)}to{transform:scaleY(1.15) skewX(3deg)}}
`,
  sceneHTML:`
<div class="sky"><div class="cloud" style="top:14%;width:30%"></div><div class="cloud" style="top:30%;width:20%;animation-delay:-22s;animation-duration:55s"></div></div>
<div class="sun"></div><div class="gull"></div><div class="gull" style="top:20%;animation-delay:-7s;transform:scale(.7)"></div>
<div class="sea"><div class="glint"></div>${[8,30,52,74].map((t,i)=>`<div class="wave" style="top:${t}%;animation-duration:${6+i*2}s;opacity:${.45+i*.15}"><svg viewBox="0 0 400 10" preserveAspectRatio="none"><path d="${[...Array(20)].map((_,k)=>`M${k*20} 8 Q${k*20+10} 0 ${k*20+20} 8`).join('')}" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.6"/></svg></div>`).join('')}</div>
<div class="sand"></div><div class="surf"></div>
<div class="mast"></div><div class="spar"></div>
<button class="obj" id="o-flags" aria-label="Flags on the broken mast"><div class="line"></div>${[['#d8402e',4,26],['#f5c518',22,32],['#2f6fc0',40,34],['#f7f3e8',58,33],['#d8402e',76,28]].map(([c,l,t],i)=>`<i style="left:${l}%;top:${t}%;background:${c};animation-delay:${-i*.3}s"></i>`).join('')}<span class="spark"></span></button>
<div class="hull"><div class="hole"></div></div>
<button class="obj" id="o-hatch" aria-label="Boarded-up hatch in the hull"><div class="plank"></div><div class="plank"></div><div class="glow2"></div><div class="chest"></div><span class="spark"></span></button>
<button class="obj" id="o-tide" aria-label="Tide post in the shallows">${[14,30,46,62,78].map(t=>`<i style="top:${t}%"></i>`).join('')}<span class="spark"></span></button>
<div class="palm"><div class="trunk"></div>${[[-30],[-5],[20],[160],[190],[215]].map(([r])=>`<div class="frond" style="transform:rotate(${r}deg)"></div>`).join('')}<div class="coco"></div><div class="coco" style="right:30%;top:14%"></div></div>
<button class="obj" id="o-rope" aria-label="Knotted rope hanging from the palm">${[12,17,22,40,45,50,55,72,77].map(t=>`<i style="top:${t}%"></i>`).join('')}<span class="spark"></span></button>
<button class="obj" id="o-bottle" aria-label="Bottle bobbing in the sea"><div class="glass"></div><div class="neck"></div><div class="cork"></div><span class="spark"></span></button>
<button class="obj" id="o-beacon" aria-label="Signal fire"><div class="logs"></div><div class="flame"></div><div class="ring"></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<div class="crab"><i></i><b></b><i></i><s style="left:38%"></s><s style="left:56%"></s></div>`,
  order:["flags","tide","rope","bottle","chart","beacon"],
  revealOnWave2:[{sel:'#o-bottle',cls:'revealed'},{sel:'#o-hatch',cls:'revealed'}],
  wave2Toast:"A wave washed the bottle up on the sand, and the boards over the hatch fell away.",
  finalReadyToast:"Five tiles in the fire pit. The rescue ship is on the horizon. Hurry!",
  startToast:"The rescue ship passes tonight. Tap anything that sparkles.",
  locks:{
    /* Flags 1-9 on the line, decoded with the four chart scraps:
       red/white diagonal = D, blue+yellow cross = R, yellow+black dot = I, white with red frame = F,
       red/white/blue stripes = T, blue/white squares = W, yellow over red = O, O, D.  -> DRIFTWOOD.
       Scraps also hold unused flags (A, E, S, N, L); every scrap has at least one needed flag. */
    flags:{wave:1,title:"The Flag Line",obj:"o-flags",answer:"DRIFTWOOD",kind:"word",tile:"L",
      scene:"The last castaway strung nine flags from the broken mast, a message for whoever came next. His flag chart blew apart in a storm, and each of you found one scrap.",
      extra:flagLine(),
      cards:[keyCard('DAW'),keyCard('REO'),keyCard('IST'),keyCard('FNL')],
      hints:["Each flag stands for one letter. Match every flag on the line to a flag on one of the scraps.","Flag 1 is red and white split corner to corner. That's D. Flag 2 is blue with a yellow cross.","D, R, I, F, T, W, O, O, D. The answer is DRIFTWOOD."]},
    /* High tide 5:20. Low tide 6 h 15 min later = 11:35. The path only shows at low tide,
       and the walk takes 40 min, so leave at 11:35 - 0:40 = 10:55. Code 1055. */
    tide:{wave:1,title:"The Tide Post",obj:"o-tide",answer:"1055",kind:"num",tile:"B",
      scene:"Dry kindling is stashed in a sea cave, but the rocks to it are underwater most of the day. Carved into the tide post: <em>\"Set the lock to the time you must leave the wreck.\"</em>",
      cardClass:"hand",cards:["Captain's log: HIGH tide this morning was at 5:20.","Low tide always comes 6 hours and 15 minutes after high tide.","The rock path only shows for a few minutes, right at LOW tide. Arrive exactly then.","It's a 40-minute walk from the wreck to the rock path.","Write the time like a clock with no dots: 9:30 is 0930."],
      hints:["First work out when low tide is. Then work backwards for the walk.","Low tide is at 11:35. You need to arrive right then, and the walk is 40 minutes.","Leave at 10:55. The code is 1055."]},
    /* Bunches of knots along the rope, pieces 1-4 end to end:
       piece 1: 3 | piece 2: 4, then 2 at the cut edge | piece 3: 3 more at the cut edge (same bunch = 5) | piece 4: 2.
       Code 3452. (Reading the cut bunch as two digits gives 5 digits, which won't fit the 4-wheel lock.) */
    rope:{wave:1,title:"The Knotted Rope",obj:"o-rope",answer:"3452",kind:"num",tile:"E",splitArt:true,
      scene:"A knotted rope hangs from the palm. The castaway's note says: <em>\"Each bunch of knots is one number.\"</em> Somebody chopped it into four pieces. Piece 1 is tied to the palm and piece 4 is the frayed end.",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1.2,1.4,1,-1.4][i]}deg;animation-delay:${i*.08}s"><span class="ph">PHONE ${i+1}</span>${ropePiece(i)}</div>`).join('')}</div>`,
      hints:["Lay the pieces end to end, 1 to 4. The lock only takes four numbers, so look closely at the cuts.","One bunch was chopped in half: the knots at the end of piece 2 and the start of piece 3 belong together.","3, then 4, then 2 + 3 = 5, then 2. The code is 3452."]},
    /* The note is mirror writing: every letter is flipped AND the order runs right to left.
       Strips left to right show T-U, O-K, O-O, L (flipped). Reading right to left: L-O-O-K-O-U-T. */
    bottle:{wave:2,title:"Message in a Bottle",obj:"o-bottle",answer:"LOOKOUT",kind:"word",tile:"Z",
      lockedMsg:"The bottle is bobbing too far out to reach. Crack two of the first locks and the tide may bring it in.",
      scene:"The bottle has washed up. Inside, a soggy note. The top line is intact, but the last word tore into four strips, left to right. The writing looks very strange...",
      extra:`<div style="background:#f2e6c4;border-radius:6px;padding:14px 8px;box-shadow:0 4px 10px rgba(0,0,0,.35)">${mirror('LIGHT YOUR FIRE ON THE',17)}</div>`,
      cards:[mirror('UT',46),mirror('KO',46),mirror('OO',46),mirror('L',46)],
      hints:["It's mirror writing, as if you're reading it in the water's reflection. Try the top line first.","In mirror writing, the letters are flipped and the words run right to left. Start with the strip on the far right.","L, O, O, K, O, U, T. The answer is LOOKOUT."]},
    /* Clues: not blue (removes SHELL, SKATE), more than 4 points (removes SQUID, SHARK, GULLS),
       left of the moon (removes PEARL), big (removes WHALE), not white (removes OTTER). Only CORAL is left.
       Each clue is the only one that removes some star, so every card is needed. */
    chart:{wave:2,title:"The Captain's Star",obj:"o-hatch",answer:"CORAL",kind:"word",tile:"A",
      lockedMsg:"The hatch is boarded shut. Crack two of the first locks to pry the planks loose.",
      scene:"Behind the hatch is the captain's chest, locked with a word: the name of his lucky star, the one the rescue ship steers by. His star chart is inside, but his notes about the star are scattered.",
      extra:chartSVG(),
      cardClass:"hand",cards:["My star is NOT blue. Blue stars bring storms.","My star has MORE than 4 points.","My star sits to the LEFT of the moon.","My star is one of the BIG ones.","Never trust a WHITE star. Mine isn't one."],
      hints:["Cross stars off one note at a time. Only one star survives all five notes.","Left of the moon, big, and not blue leaves CORAL, SQUID and OTTER. Two more notes to go.","Only one star is left. The answer is CORAL."]},
    beacon:{wave:3,title:"The Signal Fire",obj:"o-beacon",answer:"BLAZE",kind:"word",
      scene:"You've got driftwood, a spot on the lookout and dry kindling. Six lights ring the fire pit, and each lock you crack drops a letter tile in. <em>Arrange them into what the ship's lookout needs to see tonight.</em>",
      hints:["It's a big, bright, roaring fire.","It starts with B.","The answer is BLAZE."]}
  },
  finale:{tag:"RESCUED",titleHTML:"THE SHIP<br><span>SAW YOU</span>",
    cardHTML:`<h3>Ship's Log, 9:42 PM</h3>"Lookout reports a huge blaze on the island's highest rock. Turning the ship around. Castaways spotted, waving like mad. One of them is holding a crab."<div class="note">Hot soup and dry blankets for everyone. The crab stayed on the island. It seemed happier there.</div>`}
};
EXP_ORDER.push(ID);
})();
