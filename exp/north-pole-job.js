(function(){
const ID='north-pole-job', P=`.scene[data-exp="${ID}"]`;
const A='assets/northpole/';

/* ---------- cookie plate (lock: cookies) ----------
   Each photo piece is one quarter of Santa's plate. b:1 = nibbled (does not count). */
const COOKIES=[
  [{t:'star',x:24,y:28},{t:'gb',x:60,y:26},{t:'star',x:96,y:30},{t:'bell',x:26,y:66,b:1},{t:'tree',x:64,y:64}],
  [{t:'tree',x:24,y:28},{t:'star',x:60,y:26,b:1},{t:'bell',x:96,y:30},{t:'star',x:30,y:64},{t:'tree',x:68,y:64}],
  [{t:'gb',x:24,y:28},{t:'star',x:60,y:28},{t:'tree',x:96,y:26,b:1},{t:'star',x:28,y:64},{t:'bell',x:64,y:62}],
  [{t:'star',x:24,y:28,b:1},{t:'tree',x:60,y:28},{t:'bell',x:96,y:30},{t:'tree',x:32,y:62,b:1},{t:'star',x:70,y:62}]
];
const PLATE='#f7f3ea';
let CK=0;
function cookie(c){
  const dough='#d9a05a', edge='#a86d2c';
  if(c.t==='gb') return `<image href="${A}gingerbread.svg" x="${c.x-13}" y="${c.y-19}" width="26" height="38"/>`;
  let shape='', deco='';
  if(c.t==='star'){ const pts=[...Array(10)].map((_,i)=>{const r=i%2?5:12,a=-Math.PI/2+i*Math.PI/5;return (r*Math.cos(a)).toFixed(1)+','+(r*Math.sin(a)).toFixed(1)}).join(' ');
    shape=`<polygon points="${pts}"/>`; deco=`<circle r="2.2" fill="#fff"/><circle cy="-7" r="1.1" fill="#e8333a"/>`; }
  if(c.t==='tree'){ shape=`<path d="M0 -13 L9 -2 H5 L11 7 H3 V12 H-3 V7 H-11 L-5 -2 H-9Z"/>`; deco=`<path d="M-6 -1 L6 -1 M-8 6 L8 6" stroke="#2f9e48" stroke-width="2" stroke-linecap="round"/><circle cy="-9" r="1.4" fill="#ffd34d"/>`; }
  if(c.t==='bell'){ shape=`<path d="M0 -12 C7 -12 8 -4 8 2 C8 6 11 7 11 9 H-11 C-11 7 -8 6 -8 2 C-8 -4 -7 -12 0 -12Z"/>`; deco=`<path d="M-10 6 H10" stroke="#ffd34d" stroke-width="2.2"/><circle cy="11" r="2.4" fill="${dough}" stroke="${edge}"/>`; }
  let s=`<g fill="${dough}" stroke="${edge}" stroke-width="1.2">${shape}</g>${deco}`;
  if(c.b){ const id=`np-ck${CK++}`, bites=[[10,-5,6],[11,3,5],[6,-11,4.5]];
    s+=`<clipPath id="${id}">${shape}</clipPath>`+bites.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${PLATE}"/>`).join('')
      +`<g clip-path="url(#${id})">${bites.map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#8a5420" stroke-width="1.6"/>`).join('')}</g>`
      +`<circle cx="16" cy="9" r="1.2" fill="${dough}"/><circle cx="18" cy="-3" r="1" fill="${dough}"/>`; }
  return `<g transform="translate(${c.x} ${c.y}) scale(1.28)">${s}</g>`;
}
function plateSVG(i){
  const cx=[120,0,120,0][i], cy=[90,90,0,0][i];
  return `<svg viewBox="0 0 120 90" role="img" aria-label="Cookie plate piece ${i+1}"><rect width="120" height="90" fill="#b3222c"/><path d="M0 0H120V90H0Z" fill="url(#np-check${i})" opacity=".35"/><defs><pattern id="np-check${i}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><rect x="8" y="8" width="8" height="8" fill="#fff"/></pattern></defs><circle cx="${cx}" cy="${cy}" r="146" fill="${PLATE}"/><circle cx="${cx}" cy="${cy}" r="139" fill="none" stroke="#3d7fbf" stroke-width="2.5" stroke-dasharray="6 4"/>${COOKIES[i].map(cookie).join('')}</svg>`;
}

/* ---------- garland (lock: garland): TWINKLE in colour pairs ---------- */
const BULB={red:'#e8333a',green:'#2fbf4a',gold:'#ffc928',blue:'#2f7bff',white:'#f4f6ff'};
const PAIRS=[['blue','blue'],['white','green'],['green','blue'],['gold','gold'],['green','white'],['gold','red'],['red','white']];
function garlandSVG(){
  let g='', x=14;
  PAIRS.forEach((p,i)=>{p.forEach((c,j)=>{const bx=x+j*20; g+=`<line x1="${bx}" y1="26" x2="${bx}" y2="34" stroke="#2b4a2b" stroke-width="2"/><rect x="${bx-3}" y="32" width="6" height="5" rx="1" fill="#7a7a7a"/><ellipse cx="${bx}" cy="45" rx="7" ry="9.5" fill="${BULB[c]}" stroke="#1a1a1a" stroke-width=".8"/><ellipse cx="${bx-2.5}" cy="41" rx="1.8" ry="3" fill="#fff" opacity=".55"/>`;});
    g+=`<text x="${x+10}" y="70" text-anchor="middle" font-size="9" fill="#d6cdbf" font-family="Inter,sans-serif">${i+1}</text>`; x+=46;});
  return `<svg viewBox="0 0 330 76" role="img" aria-label="String of fourteen lights in seven pairs"><path d="M2 22 Q80 34 165 24 T328 22" fill="none" stroke="#2b4a2b" stroke-width="3"/>${g}</svg>`;
}
const dot=c=>`<i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:${BULB[c]};border:1px solid #333;vertical-align:-1px;margin-right:3px"></i>`;
const ROWS={red:'ABCDE',green:'FGHIK',gold:'LMNOP',blue:'QRSTU',white:'VWXYZ'};
const garlandCard=r=>`<b>First bulb ${dot(r)}${r.toUpperCase()}</b><br>then the second bulb:<div style="display:grid;grid-template-columns:repeat(5,1fr);margin-top:5px;text-align:center;font-weight:700">${Object.keys(BULB).map((c,i)=>`<span>${dot(c).replace('margin-right:3px','display:block;margin:0 auto 2px')}${ROWS[r][i]}</span>`).join('')}</div>`;

EXPERIENCES[ID]={
  id:ID, title:"The North Pole Job", titleHTML:"THE NORTH POLE<br><span>JOB</span>", season:"Christmas",
  tag:"A Christmas Eve escape room",
  blurb:"It's Christmas Eve, the sleigh's ignition is locked, and Santa has lost the code. You're the elves. Crack the workshop's six locks and get him airborne before midnight.",
  menuBlurb:"The sleigh won't start and Santa's lost the code. Elves, get him airborne by midnight.",
  menuLine:"Get Santa airborne",
  theme:{accent:'#ffc94a',accent2:'#ffe08a',bg:'#0a0d12',introBg:'#3a0d14',door:'#7a1f24',doorFrame:'#3b2414',boxColor:'linear-gradient(#c8323a,#7e1820)'},
  sceneCSS:`
${P}{background:#2a1512}
${P} .wall{position:absolute;left:0;right:0;top:0;height:64%;background:repeating-linear-gradient(90deg,#4a2418 0 26px,#53291b 26px 52px);box-shadow:inset 0 -30px 40px rgba(0,0,0,.35)}
${P} .wall::after{content:"";position:absolute;left:0;right:0;bottom:0;height:12px;background:linear-gradient(#6b3d22,#3e2214)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:36%;background:repeating-linear-gradient(0deg,#5b3a22 0 26px,#4a2e1a 26px 28px),#5b3a22}
${P} .rug{position:absolute;left:10%;right:10%;top:72%;height:22%;border-radius:50%;background:radial-gradient(ellipse,#2f6a3a 0 46%,#a8232c 47% 56%,#2f6a3a 57% 66%,transparent 67%);opacity:.85}
/* window + snow + aurora */
${P} .window{position:absolute;left:35%;top:7%;width:30%;height:20%;border:6px solid #3b2414;border-radius:8px 8px 3px 3px;background:linear-gradient(#071328,#173563);overflow:hidden;box-shadow:0 0 0 3px #22140b,0 8px 18px rgba(0,0,0,.5)}
${P} .window::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:4px;margin-left:-2px;background:#3b2414;z-index:3}
${P} .window::after{content:"";position:absolute;top:48%;left:0;right:0;height:4px;background:#3b2414;z-index:3}
${P} .aurora{position:absolute;left:-30%;right:-30%;top:8%;height:45%;background:linear-gradient(90deg,transparent,#3dffb0 30%,#7a6bff 55%,#3dffb0 75%,transparent);filter:blur(8px);opacity:.45;border-radius:50%;animation:${ID}-aurora 9s ease-in-out infinite alternate}
${P} .hill{position:absolute;left:-10%;right:-10%;bottom:-26%;height:50%;border-radius:50%;background:#e9f1ff;z-index:2}
${P} .flake{position:absolute;top:-8%;width:4px;height:4px;border-radius:50%;background:#fff;opacity:.9;animation:${ID}-snow linear infinite;z-index:1}
${P} .sill{position:absolute;left:33.5%;top:26.6%;width:33%;height:2.2%;background:linear-gradient(#f4f8ff,#cdd9ea);border-radius:4px;box-shadow:0 3px 0 #3b2414}
/* garland (wave 2) */
${P} #o-garland{left:1%;top:0.5%;width:98%;height:10%}
${P} #o-garland svg{width:100%;height:100%;display:block;overflow:visible}
${P} #o-garland .bl{fill:#3a3634;stroke:#151515;stroke-width:.6;transition:fill .6s}
${P} #o-garland .plug{transition:opacity .5s}
${P} #o-garland.revealed .plug{opacity:0}
${P} #o-garland.revealed .bl.c0{fill:#e8333a} ${P} #o-garland.revealed .bl.c1{fill:#2fbf4a} ${P} #o-garland.revealed .bl.c2{fill:#ffc928} ${P} #o-garland.revealed .bl.c3{fill:#2f7bff} ${P} #o-garland.revealed .bl.c4{fill:#f4f6ff}
${P} #o-garland.revealed .bl{animation:${ID}-twinkle 1.6s ease-in-out infinite;filter:drop-shadow(0 0 3px currentColor)}
${P} #o-garland.revealed{filter:drop-shadow(0 0 6px rgba(255,220,120,.6))}
/* nice list scroll */
${P} #o-list{left:4%;top:14%;width:25%;height:33%}
${P} #o-list .scroll{position:absolute;inset:0;transform-origin:50% 0;animation:${ID}-sway 5s ease-in-out infinite}
${P} #o-list .paper{position:absolute;left:6%;right:6%;top:7%;bottom:7%;background:linear-gradient(90deg,#e6d3a3,#f6ead0 30%,#f6ead0 70%,#e2cc98);box-shadow:0 6px 14px rgba(0,0,0,.5)}
${P} #o-list .roll{position:absolute;left:0;right:0;height:9%;border-radius:8px;background:linear-gradient(#a8743c,#e0b878 45%,#8a5a2a);box-shadow:0 2px 4px rgba(0,0,0,.5)}
${P} #o-list .roll.t{top:0} ${P} #o-list .roll.b{bottom:0}
${P} #o-list h4{position:absolute;left:0;right:0;top:12%;margin:0;text-align:center;font:400 13px 'Archivo Black',sans-serif;color:#b3222c;letter-spacing:1px}
${P} #o-list i{position:absolute;left:18%;height:2px;background:#8a7350;border-radius:2px}
${P} #o-list i::after{content:"";position:absolute;right:-16%;top:-3px;width:6px;height:6px;border-radius:50%;background:var(--m,#2f9e48)}
${P} #o-list .nail{position:absolute;left:50%;top:-5%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#c9c9c9;box-shadow:0 0 0 2px #555}
/* stable (wave 2) */
${P} #o-stable{right:4%;top:13%;width:28%;height:33%;perspective:300px}
${P} #o-stable .stall{position:absolute;inset:12% 6% 0 6%;background:linear-gradient(#1b0f08,#2e1a0e);box-shadow:inset 0 0 18px #000;overflow:hidden}
${P} #o-stable .stall::after{content:"";position:absolute;left:0;right:0;bottom:0;height:18%;background:repeating-linear-gradient(80deg,#c9a24a 0 3px,#a8822e 3px 6px)}
${P} #o-stable .deer{position:absolute;bottom:2%;height:86%;animation:bob 3s ease-in-out infinite}
${P} #o-stable .sign{position:absolute;left:4%;right:4%;top:0;height:12%;background:linear-gradient(#7a4a24,#5a3418);border-radius:3px;font:400 10px 'Archivo Black',sans-serif;color:#ffe08a;display:flex;align-items:center;justify-content:center;letter-spacing:1.5px;box-shadow:0 2px 4px rgba(0,0,0,.5);z-index:2}
${P} #o-stable .d{position:absolute;top:12%;bottom:0;width:44%;background:linear-gradient(90deg,#7a4524,#8e5430 50%,#6e3c1e);border:3px solid #4a2812;transition:transform 1.4s cubic-bezier(.5,.1,.3,1);z-index:1}
${P} #o-stable .d::before{content:"";position:absolute;inset:6%;background:linear-gradient(to top right,transparent 47%,#4a2812 47% 53%,transparent 53%),linear-gradient(to top left,transparent 47%,#4a2812 47% 53%,transparent 53%);border:3px solid #4a2812}
${P} #o-stable .d.l{left:6%;transform-origin:0 50%} ${P} #o-stable .d.r{right:6%;transform-origin:100% 50%}
${P} #o-stable .chain{position:absolute;left:8%;right:8%;top:52%;height:6px;background:repeating-linear-gradient(90deg,#b8b8c0 0 6px,#6c6c74 6px 8px);border-radius:3px;z-index:2;transition:transform 1s,opacity 1s}
${P} #o-stable .pad{position:absolute;left:50%;top:48%;width:16%;height:13%;margin-left:-8%;background:linear-gradient(#ffd34d,#b8862b);border-radius:4px;z-index:3;transition:transform 1s,opacity 1s}
${P} #o-stable .pad::before{content:"";position:absolute;left:20%;right:20%;top:-45%;height:55%;border:3px solid #9a9aa2;border-bottom:0;border-radius:8px 8px 0 0}
${P} #o-stable.revealed .d.l{transform:rotateY(-78deg)} ${P} #o-stable.revealed .d.r{transform:rotateY(78deg)}
${P} #o-stable.revealed .chain,${P} #o-stable.revealed .pad{transform:translateY(160%) rotate(14deg);opacity:0}
/* fireplace */
${P} .fireplace{position:absolute;left:33%;top:33%;width:34%;height:31%;background:repeating-linear-gradient(0deg,#8e3b2a 0 9px,#5a2418 9px 10px),#8e3b2a;border-radius:4px 4px 0 0;box-shadow:0 0 0 3px #3a1a12}
${P} .mantel{position:absolute;left:30%;top:30.5%;width:40%;height:3.4%;background:linear-gradient(#6b3d22,#3e2214);border-radius:3px;box-shadow:0 4px 8px rgba(0,0,0,.5);z-index:1}
${P} .holly{position:absolute;left:44%;top:27.6%;width:12%;z-index:1}
${P} .firebox{position:absolute;left:41%;top:43%;width:18%;height:21%;border-radius:40% 40% 0 0/30% 30% 0 0;background:radial-gradient(ellipse at 50% 100%,#ff9a2e,#7a1c0c 50%,#140805 80%);overflow:hidden}
${P} .flame{position:absolute;bottom:14%;width:30%;height:60%;border-radius:50% 50% 45% 45%/60% 60% 40% 40%;background:radial-gradient(ellipse at 50% 80%,#fff3b0,#ffb23d 40%,#ff5a1f 70%,transparent 72%);transform-origin:50% 100%;animation:${ID}-flame .5s ease-in-out infinite alternate}
${P} .logs{position:absolute;left:8%;right:8%;bottom:4%;height:14%;background:linear-gradient(#6b3d22,#3a2012);border-radius:6px;box-shadow:0 -2px 0 #8a5a32 inset}
${P} .stocking{position:absolute;top:33.6%;width:6%;height:9%;background:linear-gradient(#fff 0 22%,#c8323a 22%);border-radius:2px 2px 8px 2px;z-index:1;transform-origin:50% 0;animation:${ID}-sway 4s ease-in-out infinite}
${P} .stocking::after{content:"";position:absolute;right:-40%;bottom:0;width:70%;height:34%;background:#c8323a;border-radius:0 50% 50% 0}
${P} .hearth{position:absolute;left:30%;top:63%;width:40%;height:3%;background:linear-gradient(#9a9aa2,#5c5c64);border-radius:2px}
${P} .glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 56%,rgba(255,150,60,.28),transparent 42%);animation:flicker 3s infinite;z-index:3}
/* cookies */
${P} #o-cookies{left:35%;top:65.5%;width:30%;height:8%}
${P} #o-cookies .plate{position:absolute;left:0;right:22%;top:20%;bottom:0;border-radius:50%;background:radial-gradient(ellipse,#fbf8f0 55%,#3d7fbf 57% 60%,#e9e4d6 62%);box-shadow:0 4px 8px rgba(0,0,0,.45)}
${P} #o-cookies .ck{position:absolute;width:20%;aspect-ratio:1;background:#d9a05a;box-shadow:inset 0 0 0 2px #a86d2c}
${P} #o-cookies .milk{position:absolute;right:2%;bottom:6%;width:15%;height:96%;background:linear-gradient(90deg,#eef2f8,#fff 50%,#d6dde8);border-radius:2px 2px 6px 6px;box-shadow:0 3px 6px rgba(0,0,0,.4)}
/* wrapping table */
${P} #o-wrap{left:2%;top:47%;width:31%;height:20%}
${P} #o-wrap .top{position:absolute;left:0;right:0;top:46%;height:13%;background:linear-gradient(#a8743c,#7a4c24);border-radius:3px;box-shadow:0 4px 8px rgba(0,0,0,.5)}
${P} #o-wrap .leg{position:absolute;top:58%;bottom:0;width:7%;background:#5a3418}
${P} #o-wrap img{position:absolute;bottom:53%}
${P} #o-wrap .spool{position:absolute;right:4%;bottom:54%;width:22%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#ffe08a 0 22%,#c8323a 24% 100%);box-shadow:0 2px 4px rgba(0,0,0,.5)}
${P} #o-wrap .bow{position:absolute;left:21%;bottom:88%;width:16%;height:16%;opacity:0;transform:scale(.3);transition:.6s cubic-bezier(.3,1.6,.5,1)}
${P} #o-wrap.done .bow{opacity:1;transform:scale(1)}
/* tree */
${P} .tree{position:absolute;right:3%;top:46%;height:21%;z-index:1}
${P} .tl{position:absolute;width:5px;height:5px;border-radius:50%;z-index:1;animation:twinkle 1.8s infinite}
/* sleigh + ignition */
${P} #o-ignition{left:12%;top:75.5%;width:76%;height:23%}
${P} #o-ignition .santa{position:absolute;left:38%;top:-2%;height:58%}
${P} #o-ignition .sleigh{position:absolute;left:50%;bottom:0;height:100%;width:74%;object-fit:fill;transform:translateX(-50%) scaleX(-1)}
${P} #o-ignition .panel{position:absolute;left:34%;top:50%;width:34%;height:27%;background:linear-gradient(#3a3f4a,#1c1f26);border:2px solid #ffc94a;border-radius:8px;box-shadow:0 0 12px rgba(255,201,74,.45),inset 0 2px 0 rgba(255,255,255,.15)}
${P} #o-ignition .key{position:absolute;left:50%;top:14%;width:16%;aspect-ratio:1;margin-left:-8%;border-radius:50%;background:radial-gradient(circle,#111 0 22%,#8a8a92 24% 60%,#c9c9d2 62%)}
${P} #o-ignition .lights{position:absolute;left:7%;right:7%;bottom:12%;display:flex;justify-content:space-between}
${P} #o-ignition .lights b{width:11%;aspect-ratio:1;border-radius:50%;background:#4a1418;box-shadow:inset 0 0 0 1px #000}
${P} #o-ignition .lights b.on{background:#7dff8a;box-shadow:0 0 8px #3dff5a}
${P} #o-ignition.solved .sleigh{animation:${ID}-lift 2s ease-in-out infinite alternate}
${P} .elf{position:absolute;z-index:1;animation:bob 2.6s ease-in-out infinite}
@keyframes ${ID}-snow{to{transform:translate(12px,1200%)}}
@keyframes ${ID}-aurora{from{transform:translateX(-12%) skewX(-10deg)}to{transform:translateX(12%) skewX(10deg)}}
@keyframes ${ID}-twinkle{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes ${ID}-sway{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}
@keyframes ${ID}-flame{from{transform:scaleY(.9) rotate(-4deg)}to{transform:scaleY(1.12) rotate(4deg)}}
@keyframes ${ID}-lift{from{transform:translateX(-50%) scaleX(-1) translateY(0)}to{transform:translateX(-50%) scaleX(-1) translateY(-6px) rotate(2deg)}}
`,
  sceneHTML:`
<div class="wall"></div><div class="floor"></div><div class="rug"></div>
<div class="window"><div class="aurora"></div>${[[8,0,3.2],[22,1.4,4.1],[36,.6,3.6],[52,2.2,4.6],[64,.2,3.3],[78,1.8,4.2],[90,.9,3.8],[14,2.8,4.4],[44,3.1,3.5],[70,3.4,4]].map(([l,d,s])=>`<div class="flake" style="left:${l}%;animation-duration:${s}s;animation-delay:-${d}s"></div>`).join('')}<div class="hill"></div></div>
<div class="sill"></div>
<button class="obj" id="o-garland" aria-label="String of lights"><svg viewBox="0 0 400 50" preserveAspectRatio="none"><path d="M0 6 Q50 30 100 10 Q150 30 200 10 Q250 30 300 10 Q350 30 400 6" fill="none" stroke="#2b4a2b" stroke-width="3"/>${[[18,17],[50,22],[82,15],[118,17],[150,22],[182,15],[218,17],[250,22],[282,15],[318,17],[350,22],[382,15]].map(([x,y],i)=>`<rect x="${x-2.5}" y="${y-2}" width="5" height="5" fill="#777"/><ellipse class="bl c${i%5}" cx="${x}" cy="${y+9}" rx="5.5" ry="8" style="animation-delay:${(i*.37)%1.6}s;color:${['#e8333a','#2fbf4a','#ffc928','#2f7bff','#f4f6ff'][i%5]}"/>`).join('')}<g class="plug"><path d="M396 6 Q402 22 394 40" fill="none" stroke="#2b4a2b" stroke-width="3"/><rect x="388" y="38" width="12" height="9" rx="2" fill="#555"/></g></svg><span class="spark"></span></button>
<button class="obj" id="o-list" aria-label="Santa's nice list"><div class="scroll"><div class="nail"></div><div class="roll t"></div><div class="paper"></div><div class="roll b"></div><h4>NICE</h4>${[30,40,50,60,70,80].map((t,i)=>`<i style="top:${t}%;right:${[30,40,26,34,44,30][i]}%;--m:${[1,0,1,1,0,1][i]?'#2f9e48':'#c8323a'}"></i>`).join('')}</div><span class="spark"></span></button>
<button class="obj" id="o-stable" aria-label="Reindeer stable doors"><div class="stall"><img class="deer" src="${A}reindeer.svg" alt="" style="left:6%"><img class="deer" src="${A}reindeer.svg" alt="" style="left:52%;transform:scaleX(-1);animation-delay:-1.4s"></div><div class="sign">STABLE</div><div class="d l"></div><div class="d r"></div><div class="chain"></div><div class="pad"></div><span class="spark"></span></button>
<div class="fireplace"></div><div class="firebox"><div class="flame" style="left:14%;animation-delay:-.2s"></div><div class="flame" style="left:36%;height:72%"></div><div class="flame" style="left:56%;animation-delay:-.35s"></div><div class="logs"></div></div>
<div class="mantel"></div><img class="holly" src="${A}holly.svg" alt="">
<div class="stocking" style="left:35%"></div><div class="stocking" style="left:59%;animation-delay:-2s"></div>
<div class="hearth"></div>
<button class="obj" id="o-cookies" aria-label="Plate of cookies and milk"><div class="plate"></div>${[[10,34,'polygon(50% 0,63% 35%,100% 38%,70% 60%,80% 100%,50% 78%,20% 100%,30% 60%,0 38%,37% 35%)'],[30,22,'polygon(50% 0,100% 100%,0 100%)'],[50,36,'circle(50%)']].map(([l,t,c])=>`<div class="ck" style="left:${l}%;top:${t}%;clip-path:${c}"></div>`).join('')}<div class="milk"></div><span class="spark"></span></button>
<button class="obj" id="o-wrap" aria-label="Present wrapping table"><div class="leg" style="left:6%"></div><div class="leg" style="right:6%"></div><div class="top"></div><img src="${A}present-red.svg" alt="" style="left:6%;height:44%"><img src="${A}box-blue.svg" alt="" style="left:38%;height:30%"><img src="${A}box-purple.svg" alt="" style="left:42%;height:20%;bottom:83%"><div class="spool"></div><svg class="bow" viewBox="0 0 20 20"><path d="M10 10 C2 2 0 10 4 12 Z M10 10 C18 2 20 10 16 12 Z" fill="#ffd34d" stroke="#b8862b"/><circle cx="10" cy="10" r="2.5" fill="#ffd34d" stroke="#b8862b"/></svg><span class="spark"></span></button>
<img class="tree" src="${A}tree.svg" alt="">${[[86,52,0],[91,56,.4],[83,58,.8],[89,61,1.2],[94,63,.6],[85,64,1]].map(([l,t,d],i)=>`<div class="tl" style="left:${l}%;top:${t}%;background:${['#ffd34d','#ff5a5a','#7dd3ff'][i%3]};animation-delay:${d}s"></div>`).join('')}
<img class="elf" src="${A}elf-red.svg" alt="" style="left:0;top:74%;height:20%">
<img class="elf" src="${A}elf-green.svg" alt="" style="right:0;top:72%;height:23%;animation-delay:-1.3s">
<button class="obj" id="o-ignition" aria-label="Sleigh ignition panel"><img class="santa" src="${A}santa.svg" alt=""><img class="sleigh" src="${A}sleigh.svg" alt=""><div class="panel"><div class="key"></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div></div><span class="spark"></span></button>
<div class="glow"></div>`,
  order:["list","wrap","cookies","stable","garland","ignition"],
  revealOnWave2:[{sel:'#o-stable',cls:'revealed'},{sel:'#o-garland',cls:'revealed'}],
  wave2Toast:"The stable chain just dropped and the doors swung open. And someone plugged in the lights.",
  finalReadyToast:"Five tiles in the ignition. Santa's tapping his watch.",
  startToast:"Tap anything that sparkles. Three locks are ready, and it's nearly midnight.",
  locks:{
    /* Nice list. Nice names in list order: Tom, Mia, Anna, Jess, Chloe, Daniel (Rex, Olga, Barney, Kit are naughty).
       1st letter of 1st nice name, 2nd of 2nd...: T,I,N,S,E,L = TINSEL. */
    list:{wave:1,title:"The Nice List",obj:"o-list",answer:"TINSEL",kind:"word",tile:"E",
      scene:"Santa's list came off the wall in pieces. Scribbled on the back: <em>\"Ignition word is hidden in the nice names. NOT the naughty ones.\"</em>",
      cardClass:"hand",
      cards:["<b>Page 1</b><br>Tom - nice<br>Rex - naughty<br>Mia - nice","<b>Page 2</b><br>Olga - naughty<br>Anna - nice","<b>Page 3</b><br>Jess - nice<br>Barney - naughty<br>Chloe - nice","<b>Page 4</b><br>Kit - naughty<br>Daniel - nice","Santa's margin note: <b>1st nice name, 1st letter. 2nd nice name, 2nd letter.</b> Keep going down the list."],
      hints:["Put the pages in order and cross out every naughty name. Six nice names are left.","Take the 1st letter of Tom, the 2nd letter of Mia, the 3rd letter of Anna, and so on.","T from Tom, I from Mia, N from Anna, S from Jess, E from Chloe, L from Daniel. The answer is TINSEL."]},
    /* Ribbon: perimeter + 20 cm bow each. Teddy 4x15+20=80, rocket 2x(30+10)+20=100, robot 4x12+20=68, train 2x(25+15)+20=100.
       Total 348. Spool 500 - 348 = 152. */
    wrap:{wave:1,title:"The Wrapping Table",obj:"o-wrap",answer:"152",kind:"num",tile:"R",
      onSolve:[{sel:'#o-wrap',cls:'done'}],
      scene:"The ribbon spool is padlocked to the table. Its tag says: <em>\"500 cm on the spool. Code = ribbon LEFT after the last four presents are wrapped.\"</em>",
      extra:`<svg viewBox="0 0 330 112" role="img" aria-label="How ribbon goes on a present"><rect x="40" y="18" width="150" height="80" rx="4" fill="#2f9e48" stroke="#1d6b30" stroke-width="2"/><rect x="40" y="18" width="150" height="80" rx="4" fill="none" stroke="#e8333a" stroke-width="7"/><path d="M115 18 C96 0 84 14 104 22 Z M115 18 C134 0 146 14 126 22 Z" fill="#ffd34d" stroke="#b8862b"/><circle cx="115" cy="19" r="5" fill="#ffd34d" stroke="#b8862b"/><text x="115" y="62" text-anchor="middle" font-size="12" fill="#fff" font-family="Inter,sans-serif" font-weight="700">LID (from above)</text><text x="115" y="111" text-anchor="middle" font-size="11" fill="#d6cdbf" font-family="Inter,sans-serif">ribbon runs along all 4 edges</text><circle cx="270" cy="56" r="36" fill="#c8323a"/><circle cx="270" cy="56" r="11" fill="#ffe08a"/><text x="270" y="106" text-anchor="middle" font-size="11" fill="#d6cdbf" font-family="Inter,sans-serif">spool: 500 cm</text></svg>`,
      cards:[`<img src="${A}teddy.svg" alt="" style="float:right;height:38px;margin-left:4px">Teddy box: square lid, <b>15 cm</b> on every edge.`,`<img src="${A}rocket.svg" alt="" style="float:right;height:42px;margin-left:4px">Rocket box: long lid, <b>30 cm</b> by <b>10 cm</b>.`,`<img src="${A}robot.svg" alt="" style="float:right;height:40px;margin-left:4px">Robot box: square lid, <b>12 cm</b> on every edge.`,`<img src="${A}train.svg" alt="" style="float:right;height:36px;margin-left:4px">Train box: long lid, <b>25 cm</b> by <b>15 cm</b>.`,"Elf wrapping rule: ribbon goes once around all four edges of the lid, then the bow uses <b>another 20 cm</b>. Every present gets a bow."],
      hints:["Work out each present on its own: add up all four edges of its lid, then add 20 for the bow.","Teddy 80, rocket 100, robot 68, train 100. Add those up and take it away from 500.","500 - 348 = 152. The code is 152."]},
    /* Cookies. Whole cookies: stars 2+1+2+1=6, trees 1+2+0+1=4, bells 0+1+1+1=3.
       Nibbled (don't count): 1 bell, 2 stars, 2 trees. Gingerbread men are not asked for. Code 643. */
    cookies:{wave:1,title:"The Cookie Plate",obj:"o-cookies",answer:"643",kind:"num",tile:"C",splitArt:true,
      scene:"Under the milk glass, a note from the kitchen: <em>\"Plate code = how many WHOLE cookies of each shape: stars, then trees, then bells. Somebody's been nibbling. Nibbled ones don't count!\"</em>",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-2,1.5,1,-1.5][i]}deg;animation-delay:${i*.08}s;background:#f1e6cc"><span class="ph">PHONE ${i+1}</span>${plateSVG(i)}</div>`).join('')}</div>`,
      hints:["Each phone has one quarter of the plate. Count whole stars, trees and bells in your piece, then add them across all four.","Look for bite marks: two stars, two trees and one bell have been nibbled. Gingerbread men aren't part of the code.","6 whole stars, 4 whole trees, 3 whole bells. The code is 643."]},
    /* Reindeer order (all 5 clues needed, checked by brute force over 720 orders).
       Tundra 6th, Holly 5th. Flurry+Lumen adjacent; Ivy not 1st and ahead of Gusty; Gusty not beside Lumen
       -> Flurry, Lumen, Ivy, Gusty, Holly, Tundra = FLIGHT. */
    stable:{wave:2,title:"The Reindeer Line-Up",obj:"o-stable",answer:"FLIGHT",kind:"word",tile:"H",
      lockedMsg:"The stable's chained shut. Crack two of the first locks to get it open.",
      scene:"Six reindeer, six harness spots, and they're very fussy. <em>\"Line them up the way they like, then read their first letters from the front to the back.\"</em>",
      extra:`<div style="display:flex;align-items:flex-end;gap:4px">${[1,2,3,4,5,6].map(n=>`<div style="flex:1;text-align:center;font-size:10.5px;color:#b3aa9c"><img src="${A}reindeer.svg" alt="" style="height:44px"><div style="height:24px;margin-top:2px;border-radius:6px;background:linear-gradient(#7a4524,#4a2812);display:flex;align-items:center;justify-content:center;font-family:'Archivo Black';color:#ffe08a">${n}</div></div>`).join('')}<div style="flex:1.3;text-align:center"><img src="${A}sleigh.svg" alt="" style="height:44px;transform:scaleX(-1)"></div></div><div style="display:flex;justify-content:space-between;font-size:11px;color:#ffe08a;margin:4px 2px 0"><span>FRONT</span><span>SLEIGH</span></div><p class="scene-txt" style="margin:10px 0 0">Reindeer: <b>Flurry, Lumen, Ivy, Gusty, Holly, Tundra</b></p>`,
      cards:["Tundra pulls at the very back, right in front of the sleigh.","Lumen is directly behind Flurry.","Holly is directly in front of Tundra.","Ivy is somewhere ahead of Gusty.","Ivy hates leading. She is never at the front.","Gusty and Lumen bicker. They must not stand side by side."],
      hints:["Start at the back: two cards tell you exactly who is in spots 5 and 6.","Holly 5, Tundra 6. Flurry and Lumen are a pair. Try each place the pair could go and see which one breaks a card.","Flurry, Lumen, Ivy, Gusty, Holly, Tundra. The answer is FLIGHT."]},
    /* Garland: pairs (first bulb = row card, second bulb = letter).
       blue-blue T, white-green W, green-blue I, gold-gold N, green-white K, gold-red L, red-white E = TWINKLE. */
    garland:{wave:2,title:"The Light String",obj:"o-garland",answer:"TWINKLE",kind:"word",tile:"E",
      lockedMsg:"The lights are unplugged. Crack two of the first locks and an elf will plug them in.",
      scene:"Now that it's plugged in, the string blinks the same 14 bulbs over and over, in seven pairs. Each phone has one page of the elves' light code.",
      extra:garlandSVG,
      cards:['red','green','gold','blue','white'].map(garlandCard),
      hints:["Bulbs work in pairs. The first bulb of a pair tells you which card to use.","Pair 1 is blue then blue: on the BLUE card, the blue letter is T. Pair 2 is white then green.","T, W, I, N, K, L, E. The answer is TWINKLE."]},
    /* Final: tiles C,H,E,E,R -> CHEER (only real-word anagram in the en_US dictionary). */
    ignition:{wave:3,title:"The Sleigh Ignition",obj:"o-ignition",answer:"CHEER",kind:"word",
      scene:"Every lock you crack drops a golden letter into the ignition. Engraved under the slots: <em>\"This sleigh runs on one thing only. Spell it and she'll fly.\"</em>",
      wrongMessages:{MERRY:"Lovely word, wrong letters. Use only the five tiles.",JOLLY:"Lovely word, wrong letters. Use only the five tiles."},
      hints:["It's the fuel of every magic sleigh: something people feel and shout at Christmas.","It's what the crowd does when Santa takes off. It starts with C.","The answer is CHEER."]}
  },
  finale:{tag:"AIRBORNE",titleHTML:"SANTA'S<br><span>FLYING</span>",
    cardHTML:`<h3>Workshop Hot Cocoa</h3>Warm 2 cups of milk in a pan (ask a grown-up). Whisk in 2 tbsp cocoa powder, 2 tbsp sugar and a pinch of cinnamon until smooth. Pour into mugs, top with marshmallows, and drink it watching the sky.<div class="note">"Couldn't have done it without my elves. See you next year! Love, S." <br><small style="font-family:Inter;font-size:11px;color:#8a6a4a">Art: Google Santa Tracker, CC BY 4.0</small></div>`}
};
EXP_ORDER.push(ID);
})();
