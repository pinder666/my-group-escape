(function(){
const ID='last-lab', P=`.scene[data-exp="${ID}"]`;

/* ---------- colour jars (lock: beakers) ---------- */
const JARS=[['pink','#ff8fc8','P'],['orange','#ff9a2e','O'],['purple','#9b4dff','T'],['green','#3fcf4a','I'],['light blue','#9fdcff','N'],['grey','#9a9aa2','A']];
function jarsSVG(){
  return `<svg viewBox="0 0 330 120" role="img" aria-label="Six labelled jars">${JARS.map(([n,c,l],i)=>{const x=10+i*54;return `<g transform="translate(${x} 0)"><rect x="12" y="6" width="22" height="10" rx="2" fill="#5a5f6a"/><path d="M8 16 H38 V96 Q38 104 30 104 H16 Q8 104 8 96Z" fill="#ffffff14" stroke="#cfe" stroke-opacity=".5"/><path d="M10 40 H36 V96 Q36 102 30 102 H16 Q10 102 10 96Z" fill="${c}"/><rect x="12" y="54" width="22" height="24" rx="3" fill="#f4f1e6"/><text x="23" y="72" text-anchor="middle" font-size="17" font-weight="700" fill="#222" font-family="Inter,sans-serif">${l}</text><text x="23" y="117" text-anchor="middle" font-size="9.5" fill="#d6cdbf" font-family="Inter,sans-serif">${n}</text></g>`}).join('')}</svg>`;
}

/* ---------- graduated cylinders (lock: cyl) ---------- */
const CYL=[['A',160,'#8dff5a'],['B',80,'#c79bff'],['C',50,'#5ad8ff']];
function cylSVG(){
  const top=14, bot=164, h=bot-top, max=200; // 0.75px per ml
  let g='';
  CYL.forEach(([l,v,c],i)=>{const x=30+i*104; const ly=bot-v/max*h;
    g+=`<rect x="${x}" y="${top-6}" width="44" height="${h+6}" rx="4" fill="#ffffff10" stroke="#9fb" stroke-opacity=".5"/><rect x="${x+2}" y="${ly}" width="40" height="${bot-ly}" fill="${c}" opacity=".85"/><rect x="${x+2}" y="${ly-2}" width="40" height="4" fill="#fff" opacity=".5"/>`;
    for(let m=0;m<=max;m+=10){const y=bot-m/max*h, big=m%50===0; g+=`<line x1="${x+44}" y1="${y}" x2="${x+44-(big?14:7)}" y2="${y}" stroke="#e8f4ec" stroke-width="${big?1.6:1}"/>`; if(big) g+=`<text x="${x+48}" y="${y+3.5}" font-size="10" fill="#e8f4ec" font-family="Inter,sans-serif">${m}</text>`;}
    g+=`<rect x="${x-6}" y="${bot}" width="56" height="6" rx="2" fill="#5a5f6a"/><text x="${x+22}" y="${bot+22}" text-anchor="middle" font-size="14" font-weight="700" fill="#8dff5a" font-family="Inter,sans-serif">${l}</text>`;});
  return `<svg viewBox="0 0 330 192" role="img" aria-label="Three measuring cylinders marked in ml">${g}<text x="322" y="10" text-anchor="end" font-size="9" fill="#9a9" font-family="Inter,sans-serif">ml</text></svg>`;
}

/* ---------- DNA strand (lock: dna) ---------- */
const BEAD={R:['#ff4d5a','c'],B:['#3d8bff','s'],G:['#3fcf4a','t'],Y:['#ffd23d','d']};
const KEY={Y:'G',R:'L',G:'O',B:'W'}; // missing bead colour -> letter
// each segment: 4 rungs [top,bottom]; '?' = smudged bottom
const STRAND=[[['R','B'],['G','Y'],['G','?'],['B','R']],[['Y','G'],['B','?'],['R','B'],['G','Y']],[['B','R'],['G','Y'],['Y','?'],['R','B']],[['G','Y'],['R','B'],['Y','G'],['R','?']]];
function bead(k,x,y,r=7.5){
  if(k==='?') return `<circle cx="${x}" cy="${y}" r="${r+2}" fill="#6b6f78"/><circle cx="${x-3}" cy="${y-2}" r="${r-1}" fill="#7b808a"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="13" font-weight="700" fill="#2a2d33" font-family="Inter,sans-serif">?</text>`;
  const [c,s]=BEAD[k];
  if(s==='c') return `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#111" stroke-width="1"/>`;
  if(s==='s') return `<rect x="${x-r+1}" y="${y-r+1}" width="${2*r-2}" height="${2*r-2}" rx="1.5" fill="${c}" stroke="#111" stroke-width="1"/>`;
  if(s==='t') return `<path d="M${x} ${y-r-1} L${x+r+1} ${y+r-1} H${x-r-1}Z" fill="${c}" stroke="#111" stroke-width="1"/>`;
  return `<path d="M${x} ${y-r-1.5} L${x+r+1} ${y} L${x} ${y+r+1.5} L${x-r-1} ${y}Z" fill="${c}" stroke="#111" stroke-width="1"/>`;
}
function dnaSVG(i){
  let g=`<rect width="120" height="90" fill="#0b1a1e"/><path d="M0 22 Q30 14 60 22 T120 22" fill="none" stroke="#7fe0c8" stroke-width="3"/><path d="M0 64 Q30 72 60 64 T120 64" fill="none" stroke="#c79bff" stroke-width="3"/>`;
  STRAND[i].forEach(([t,b],j)=>{const x=16+j*29; g+=`<line x1="${x}" y1="24" x2="${x}" y2="62" stroke="#e8f4ec" stroke-opacity=".45" stroke-width="2"/>`+bead(t,x,24)+bead(b,x,62);});
  g+=`<text x="6" y="86" font-size="9" fill="#8dff5a" font-family="Inter,sans-serif" font-weight="700">SEGMENT ${i+1}</text>`;
  return `<svg viewBox="0 0 120 90" role="img" aria-label="Strand segment ${i+1}">${g}</svg>`;
}
const dnaKey=()=>`<div style="display:flex;justify-content:center;gap:14px;margin-bottom:12px">${Object.keys(KEY).map(k=>`<div style="text-align:center;font:700 15px Inter,sans-serif;color:#e8f4ec"><svg viewBox="0 0 24 24" style="width:26px;height:26px;display:block;margin:0 auto 2px">${bead(k,12,12,8)}</svg>= ${KEY[k]}</div>`).join('')}</div>`;

/* ---------- element chart (lock: chart) ---------- */
const ELEM=[['Fz','Fizzium'],['Bu','Bubblon'],['Gl','Glowium'],['An','Annoyium'],['Zp','Zappium'],['Ti','Tickleon'],['Wo','Wobblium'],['Do','Dozium'],['Sq','Squeakon'],['Te','Teeheeum'],['Pf','Pfuffium'],['Ka','Kaboomium']];
const ECOL=['#3fcf4a','#9b4dff','#ff9a2e','#3d8bff'];
const chartHTML=()=>`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px">${ELEM.map(([s,n],i)=>`<div style="background:${ECOL[i%4]}26;border:1.5px solid ${ECOL[i%4]};border-radius:6px;padding:3px 2px 4px;text-align:center;color:#e8f4ec;position:relative"><div style="position:absolute;left:4px;top:2px;font:700 10px Inter,sans-serif;color:${ECOL[i%4]}">${i+1}</div><div style="font:400 22px 'Archivo Black',sans-serif;line-height:1.3;margin-top:6px">${s}</div><div style="font:500 9.5px Inter,sans-serif;color:#b8c8c0">${n}</div></div>`).join('')}</div>`;

/* ---------- microscope slides (lock: scope): overlay 7-segment digits ---------- */
const SEG={a:[3,0,14,3],b:[17,3,3,14],c:[17,19,3,14],d:[3,33,14,3],e:[0,19,3,14],f:[0,3,3,14],g:[3,16.5,14,3]};
const DIGSEG={'6':'acdefg','2':'abdeg','9':'abcdfg','5':'acdfg'};
const CODE='6295';
// segment -> slide; each lit segment appears on exactly one slide
const SLIDES=[[],[],[],[]];
CODE.split('').forEach((d,di)=>DIGSEG[d].split('').forEach((s,si)=>SLIDES[(di+si)%4].push([di,s])));
function slideSVG(i){
  let g=`<rect width="120" height="90" fill="#0d1416"/><rect x="6" y="14" width="108" height="62" rx="4" fill="#cfeee6" fill-opacity=".12" stroke="#cfeee6" stroke-opacity=".5"/>`;
  for(let di=0;di<4;di++){const ox=14+di*25, oy=27; Object.values(SEG).forEach(([x,y,w,h])=>g+=`<rect x="${ox+x}" y="${oy+y}" width="${w}" height="${h}" rx="1.2" fill="none" stroke="#cfeee6" stroke-opacity=".18" stroke-dasharray="2 1.5"/>`);}
  SLIDES[i].forEach(([di,s])=>{const [x,y,w,h]=SEG[s]; g+=`<rect x="${14+di*25+x}" y="${27+y}" width="${w}" height="${h}" rx="1.2" fill="#8dff5a" style="filter:drop-shadow(0 0 2px #8dff5a)"/>`;});
  g+=`<text x="60" y="10" text-anchor="middle" font-size="8.5" fill="#c79bff" font-family="Inter,sans-serif" font-weight="700">SLIDE ${'ABCD'[i]}</text>`;
  return `<svg viewBox="0 0 120 90" role="img" aria-label="Glass slide ${'ABCD'[i]}">${g}</svg>`;
}

EXPERIENCES[ID]={
  id:ID, title:"The Last Lab", titleHTML:"THE LAST<br><span>LAB</span>",
  tag:"A mad-science escape room",
  blurb:"Professor Fizzwick drank the wrong flask and can't stop hiccuping bubbles. At midnight the lab seals itself shut. Crack six locks, brew the cure, and get out with him.",
  menuBlurb:"The professor can't stop hiccuping bubbles. Brew the cure before the lab seals.",
  menuLine:"Brew the cure",
  theme:{accent:'#8dff5a',accent2:'#c79bff',bg:'#07100f',introBg:'#1a0f2e',door:'#3a4250',doorFrame:'#1c2128',boxColor:'linear-gradient(#7a4dd8,#3a1f7a)'},
  sceneCSS:`
${P}{background:#0f1a1c}
${P} .wall{position:absolute;left:0;right:0;top:0;height:67%;background:linear-gradient(rgba(10,20,22,.35),rgba(10,20,22,.7)),repeating-linear-gradient(0deg,#1d3236 0 22px,#132326 22px 24px),#1d3236;background-blend-mode:normal}
${P} .wall::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 22px,#132326 22px 24px)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:33%;background:repeating-conic-gradient(#1b2224 0 25%,#262f32 0 50%) 0 0/36px 36px;box-shadow:inset 0 14px 20px rgba(0,0,0,.6)}
${P} .floor::before{content:"";position:absolute;left:0;right:0;top:0;height:8px;background:#2a3c3f}
/* beacon */
${P} .beacon{position:absolute;left:46.5%;top:4%;width:7%;height:6%;border-radius:50% 50% 10% 10%;background:radial-gradient(circle at 50% 60%,#ffd0d0,#ff3348 55%,#7a0f1a);animation:${ID}-beacon 1.2s infinite;z-index:1}
${P} .beacon::after{content:"";position:absolute;left:-10%;right:-10%;bottom:-24%;height:30%;background:#3a4250;border-radius:2px}
${P} .halo{position:absolute;left:30%;top:-6%;width:40%;height:30%;background:radial-gradient(ellipse,rgba(255,50,70,.35),transparent 65%);animation:${ID}-beacon 1.2s infinite;pointer-events:none}
${P} .seal{position:absolute;left:44%;top:12%;width:12%;padding:2px 0;text-align:center;font:400 7px 'Archivo Black',sans-serif;letter-spacing:.5px;color:#ff5a6a;background:#120a0c;border:1px solid #ff3348;border-radius:3px;animation:blink 1.2s infinite}
/* chart (wave 2) */
${P} #o-chart{left:4%;top:6%;width:40%;height:23%;background:#0b1416;border:4px solid #3a4250;border-radius:4px;box-shadow:0 6px 14px rgba(0,0,0,.5);overflow:hidden}
${P} #o-chart .grid{position:absolute;inset:8% 6%;display:grid;grid-template-columns:repeat(4,1fr);gap:5%}
${P} #o-chart .grid i{border-radius:2px;font:400 10px 'Archivo Black',sans-serif;font-style:normal;color:#e8f4ec;display:flex;align-items:center;justify-content:center}
${P} #o-chart .blind{position:absolute;inset:0;background:repeating-linear-gradient(0deg,#8a8f9a 0 8px,#6a6f7a 8px 9px);transform-origin:50% 0;transition:transform 1.4s cubic-bezier(.6,.05,.3,1);display:flex;align-items:center;justify-content:center;z-index:1}
${P} #o-chart .blind b{background:repeating-linear-gradient(45deg,#ffd23d 0 8px,#1a1a1a 8px 16px);padding:3px;border-radius:2px}
${P} #o-chart .blind b span{display:block;background:#1a1a1a;color:#ffd23d;font:400 8px 'Archivo Black',sans-serif;padding:3px 6px;letter-spacing:.5px}
${P} #o-chart.revealed .blind{transform:scaleY(.06)}
/* DNA monitor */
${P} #o-dna{right:4%;top:6%;width:40%;height:21%;background:#05100f;border:5px solid #3a4250;border-radius:8px;box-shadow:0 0 18px rgba(141,255,90,.25),0 6px 14px rgba(0,0,0,.5);overflow:hidden}
${P} #o-dna::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.04) 0 2px,transparent 2px 4px);pointer-events:none}
${P} #o-dna .rung{position:absolute;top:18%;bottom:18%;width:3px;margin-left:-1.5px;animation:${ID}-twist 2.4s ease-in-out infinite}
${P} #o-dna .rung::before,${P} #o-dna .rung::after{content:"";position:absolute;left:50%;width:9px;height:9px;margin-left:-4.5px;border-radius:50%}
${P} #o-dna .rung::before{top:-4px;background:var(--a)} ${P} #o-dna .rung::after{bottom:-4px;background:var(--b)}
${P} #o-dna .rung i{position:absolute;left:0;right:0;top:0;bottom:0;background:#e8f4ec55}
${P} #o-dna .lbl{position:absolute;left:5%;bottom:3%;font:700 8px Inter,sans-serif;color:#8dff5a;letter-spacing:1px}
/* cylinder shelf */
${P} #o-cyl{left:4%;top:32%;width:36%;height:19%}
${P} #o-cyl .shelf{position:absolute;left:0;right:0;bottom:0;height:9%;background:linear-gradient(#6a7280,#3a4250);border-radius:2px;box-shadow:0 4px 8px rgba(0,0,0,.5)}
${P} #o-cyl .cy{position:absolute;bottom:9%;width:17%;height:84%;border:2px solid rgba(200,255,230,.55);border-top:0;border-radius:0 0 4px 4px;background:rgba(255,255,255,.06);overflow:hidden}
${P} #o-cyl .cy::before{content:"";position:absolute;left:0;right:0;bottom:0;height:var(--h);background:var(--c);opacity:.8}
${P} #o-cyl .cy::after{content:"";position:absolute;right:0;top:0;bottom:0;width:30%;background:repeating-linear-gradient(0deg,rgba(255,255,255,.7) 0 1px,transparent 1px 7px)}
${P} #o-cyl .tag{position:absolute;bottom:-1%;width:17%;text-align:center;font:400 8px 'Archivo Black',sans-serif;color:#0f1a1c;z-index:1}
/* beakers on bench */
${P} .bench{position:absolute;left:0;width:52%;top:64%;height:4%;background:linear-gradient(#e8ecef,#9aa2aa);box-shadow:0 6px 10px rgba(0,0,0,.6)}
${P} .bench::after{content:"";position:absolute;left:4%;right:4%;top:100%;height:110%;background:linear-gradient(#3a4250,#262c35)}
${P} #o-beakers{left:2%;top:51%;width:34%;height:13%}
${P} #o-beakers .fl{position:absolute;bottom:0;width:20%;height:100%}
${P} #o-beakers .fl .glass{position:absolute;inset:0;clip-path:polygon(36% 0,64% 0,64% 34%,100% 100%,0 100%,36% 34%);background:rgba(220,255,240,.18)}
${P} #o-beakers .fl .liq{position:absolute;inset:0;clip-path:polygon(22% 55%,78% 55%,100% 100%,0 100%);background:var(--c);transition:background 1s}
${P} #o-beakers .fl .bub{position:absolute;bottom:6%;width:12%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.75);animation:${ID}-bubble 2.2s ease-in infinite;opacity:0}
${P} #o-beakers.solved .fl .liq{background:#8dff5a}
${P} .rack{position:absolute;left:36%;top:56%;width:10%;height:8%}
${P} .rack::after{content:"";position:absolute;left:-4%;right:-4%;top:38%;height:12%;background:#6a7280;border-radius:2px}
${P} .hic{position:absolute;bottom:-8%;width:5%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(199,155,255,.35) 40%,rgba(141,255,90,.15) 70%);border:1px solid rgba(220,200,255,.5);pointer-events:none;z-index:3;animation:${ID}-float linear infinite}
@keyframes ${ID}-float{0%{transform:translate(0,0);opacity:0}10%{opacity:.9}50%{transform:translate(14px,-900%)}100%{transform:translate(-10px,-1900%);opacity:0}}
/* fume hood + microscope (wave 2) */
${P} #o-scope{right:3%;top:30%;width:50%;height:34%}
${P} #o-scope .hood{position:absolute;inset:0;background:linear-gradient(#5a6270,#3a4250);border-radius:6px 6px 0 0;box-shadow:0 8px 16px rgba(0,0,0,.6)}
${P} #o-scope .hood::before{content:"FUME HOOD";position:absolute;left:0;right:0;top:2%;text-align:center;font:400 8px 'Archivo Black',sans-serif;color:#c9d2da;letter-spacing:1px}
${P} #o-scope .inside{position:absolute;left:6%;right:6%;top:12%;bottom:8%;background:radial-gradient(ellipse at 50% 90%,#1f4a2a,#0a1412 70%);overflow:hidden}
${P} #o-scope .vap{position:absolute;bottom:10%;width:40%;height:30%;border-radius:50%;background:radial-gradient(ellipse,rgba(141,255,90,.35),transparent 70%);animation:${ID}-vapour 5s ease-in-out infinite}
${P} #o-scope .mic{position:absolute;left:30%;bottom:4%;width:40%;height:80%}
${P} #o-scope .sash{position:absolute;left:6%;right:6%;top:12%;bottom:8%;background:linear-gradient(160deg,rgba(200,230,255,.28),rgba(200,230,255,.12) 40%,rgba(200,230,255,.22));border:3px solid #6a7280;transition:transform 1.4s cubic-bezier(.6,.05,.3,1);transform-origin:50% 0;z-index:1}
${P} #o-scope .tape{position:absolute;left:-6%;right:-6%;top:44%;height:14%;background:repeating-linear-gradient(45deg,#ffd23d 0 10px,#1a1a1a 10px 20px);transform:rotate(-14deg);transition:transform 1s,opacity 1s;z-index:2;display:flex;align-items:center;justify-content:center}
${P} #o-scope .tape.t2{transform:rotate(14deg)}
${P} #o-scope .tape span{background:#1a1a1a;color:#ffd23d;font:400 8px 'Archivo Black',sans-serif;padding:1px 5px;letter-spacing:1px}
${P} #o-scope.revealed .sash{transform:scaleY(.1)}
${P} #o-scope.revealed .tape{transform:translateY(240%) rotate(30deg);opacity:0}
/* synthesizer (final) */
${P} #o-synth{left:7%;top:69%;width:86%;height:27%}
${P} #o-synth .body{position:absolute;left:0;right:0;bottom:0;height:62%;background:linear-gradient(#5b3aa8,#2e1a66);border-radius:10px 10px 4px 4px;box-shadow:0 10px 20px rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.18)}
${P} #o-synth .tank{position:absolute;left:38%;width:24%;bottom:40%;height:58%;border:3px solid #c9d2da;border-radius:40% 40% 8px 8px/24% 24% 8px 8px;background:rgba(220,255,240,.12);overflow:hidden;z-index:1}
${P} #o-synth .tank::before{content:"";position:absolute;left:-50%;right:-50%;bottom:-20%;height:75%;background:radial-gradient(circle at 30% 40%,#c4ff9a,#5fd43a 40%,#2a8a2a);border-radius:42%;animation:${ID}-swirl 6s linear infinite}
${P} #o-synth .tank .bub{position:absolute;bottom:4%;width:12%;aspect-ratio:1;border-radius:50%;background:rgba(255,255,255,.7);animation:${ID}-bubble 2.6s ease-in infinite;opacity:0}
${P} #o-synth .pipe{position:absolute;bottom:58%;width:6%;height:40%;background:linear-gradient(90deg,#8a92a0,#c9d2da,#6a7280);border-radius:3px}
${P} #o-synth .scr{position:absolute;left:5%;top:47%;width:26%;height:22%;background:#05100f;border:2px solid #8dff5a;border-radius:4px;font:400 9px 'Archivo Black',sans-serif;color:#8dff5a;display:flex;align-items:center;justify-content:center;letter-spacing:.5px;text-shadow:0 0 6px #8dff5a}
${P} #o-synth .knob{position:absolute;top:50%;width:8%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 40% 35%,#e0e4ea,#6a7280);box-shadow:0 2px 3px rgba(0,0,0,.6)}
${P} #o-synth .lights{position:absolute;left:24%;right:24%;bottom:9%;display:flex;justify-content:space-between}
${P} #o-synth .lights b{width:10%;aspect-ratio:1;border-radius:50%;background:#1a0f2e;box-shadow:inset 0 0 0 1.5px #000}
${P} #o-synth .lights b.on{background:#8dff5a;box-shadow:0 0 9px #8dff5a}
${P} #o-synth.solved .tank::before{background:radial-gradient(circle at 30% 40%,#f0d8ff,#c79bff 40%,#7a4dd8)}
${P} .tubes{position:absolute;bottom:0;width:100%;height:100%;display:flex;justify-content:space-around;align-items:flex-end}
${P} .tubes i{width:16%;height:90%;border:1.5px solid rgba(220,255,240,.6);border-top:0;border-radius:0 0 8px 8px;background:linear-gradient(transparent 40%,var(--c) 40%);animation:glowpulse 2s ease-in-out infinite;box-shadow:0 0 8px var(--c)}
${P} .glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 82%,rgba(141,255,90,.16),transparent 40%),radial-gradient(circle at 78% 50%,rgba(141,255,90,.1),transparent 30%);animation:flicker 4s infinite;z-index:3}
@keyframes ${ID}-beacon{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes ${ID}-twist{0%,100%{transform:scaleY(1)}50%{transform:scaleY(-1)}}
@keyframes ${ID}-bubble{0%{transform:translateY(0) scale(.6);opacity:0}15%{opacity:.9}100%{transform:translateY(-700%) scale(1.1);opacity:0}}
@keyframes ${ID}-vapour{0%,100%{transform:translateX(0) scale(1);opacity:.5}50%{transform:translateX(70%) scale(1.4);opacity:1}}
@keyframes ${ID}-swirl{to{transform:rotate(360deg)}}
`,
  sceneHTML:`
<div class="wall"></div><div class="floor"></div><div class="halo"></div><div class="beacon"></div><div class="seal">LOCKDOWN</div>
<button class="obj" id="o-chart" aria-label="Element chart behind a blind"><div class="grid">${ELEM.map(([s],i)=>`<i style="background:${ECOL[i%4]}55;border:1px solid ${ECOL[i%4]}">${s}</i>`).join('')}</div><div class="blind"><b><span>AUTHORISED ONLY</span></b></div><span class="spark"></span></button>
<button class="obj" id="o-dna" aria-label="DNA scanner monitor">${[...Array(9)].map((_,i)=>`<div class="rung" style="left:${8+i*10.5}%;--a:${['#ff4d5a','#3fcf4a','#3d8bff','#ffd23d'][i%4]};--b:${['#3d8bff','#ffd23d','#ff4d5a','#3fcf4a'][i%4]};animation-delay:-${(i*.27).toFixed(2)}s"><i></i></div>`).join('')}<div class="lbl">DNA SCAN</div><span class="spark"></span></button>
<button class="obj" id="o-cyl" aria-label="Shelf of measuring cylinders">${CYL.map(([l,v,c],i)=>`<div class="cy" style="left:${8+i*31}%;--h:${v/2}%;--c:${c}"></div><div class="tag" style="left:${8+i*31}%">${l}</div>`).join('')}<div class="shelf"></div><span class="spark"></span></button>
<div class="bench"></div>
<button class="obj" id="o-beakers" aria-label="Bubbling beakers">${['#ff4d5a','#ffd23d','#3d8bff','#f4f6ff'].map((c,i)=>`<div class="fl" style="left:${2+i*25}%;--c:${c}"><div class="glass"></div><div class="liq"></div>${[0,1,2].map(j=>`<div class="bub" style="left:${30+j*14}%;animation-delay:${(i*.5+j*.7).toFixed(1)}s"></div>`).join('')}</div>`).join('')}<span class="spark"></span></button>
<button class="obj" id="o-scope" aria-label="Sealed fume hood with microscope"><div class="hood"></div><div class="inside"><div class="vap" style="left:5%"></div><div class="vap" style="left:45%;animation-delay:-2.5s"></div><svg class="mic" viewBox="0 0 60 90"><rect x="8" y="80" width="44" height="8" rx="2" fill="#c9d2da"/><path d="M40 80 V40 Q40 30 30 28" fill="none" stroke="#8a92a0" stroke-width="7"/><rect x="14" y="56" width="34" height="5" rx="1" fill="#6a7280"/><rect x="20" y="53" width="18" height="3" fill="#9fdcff" opacity=".8"/><g transform="rotate(-24 26 26)"><rect x="18" y="8" width="12" height="40" rx="3" fill="#e8ecef"/><rect x="20" y="0" width="8" height="10" rx="2" fill="#3a4250"/><rect x="21" y="46" width="6" height="6" fill="#3a4250"/></g><circle cx="44" cy="62" r="4" fill="#3a4250"/></svg></div><div class="sash"></div><div class="tape"><span>SEALED</span></div><div class="tape t2"></div><span class="spark"></span></button>
<button class="obj" id="o-synth" aria-label="Cure synthesizer"><div class="pipe" style="left:18%"></div><div class="pipe" style="right:18%"></div><div class="body"></div><div class="tank">${[0,1,2].map(j=>`<div class="bub" style="left:${25+j*22}%;animation-delay:${j*.8}s"></div>`).join('')}</div><div class="scr">CURE-O-MATIC</div><div class="knob" style="right:16%"></div><div class="knob" style="right:5%"></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<div class="rack"><div class="tubes">${['#8dff5a','#c79bff','#5ad8ff','#ff8fc8'].map((c,i)=>`<i style="--c:${c};animation-delay:-${i*.5}s"></i>`).join('')}</div></div>
${[[12,9,0],[58,11,3],[84,8,6],[34,12,8.5],[70,10,1.5]].map(([l,d,dl])=>`<div class="hic" style="left:${l}%;animation-duration:${d}s;animation-delay:-${dl}s"></div>`).join('')}<div class="glow"></div>`,
  order:["beakers","cyl","dna","chart","scope","synth"],
  revealOnWave2:[{sel:'#o-chart',cls:'revealed'},{sel:'#o-scope',cls:'revealed'}],
  wave2Toast:"Clunk! The blind rolled up off the element chart, and the fume hood glass slid open.",
  finalReadyToast:"Five tiles loaded. The synthesizer is humming. Hic!",
  startToast:"Tap anything that sparkles. Three locks are ready. Hic!",
  locks:{
    /* Colour mixing. red+white=pink P, red+yellow=orange O, red+blue=purple T, blue+yellow=green I,
       yellow+red=orange O, blue+white=light blue N. Grey (A) is never made. POTION. */
    beakers:{wave:1,title:"The Colour Mixer",obj:"o-beakers",answer:"POTION",kind:"word",tile:"N",
      scene:"Four flasks bubble on the bench: red, yellow, blue and white. The professor's notes are scattered, one drop per page. <em>\"Mix each drop, find the jar that matches, take its letter.\"</em>",
      extra:jarsSVG,
      cards:["<b>Drop 1</b><br>Mix RED with WHITE.","<b>Drop 2</b><br>Mix RED with YELLOW.","<b>Drop 3</b><br>Mix RED with BLUE.","<b>Drop 4</b><br>Mix BLUE with YELLOW.","<b>Drop 5</b><br>Mix YELLOW with RED.","<b>Drop 6</b><br>Mix BLUE with WHITE."],
      hints:["Work out what colour each pair makes, then find that colour's jar.","Red and white make pink, so Drop 1 is P. Red and yellow make orange.","Pink, orange, purple, green, orange, light blue. The answer is POTION."]},
    /* Measuring. Read A=160, B=80, C=50. 160+80=240, half boils away -> 120, +50 = 170. */
    cyl:{wave:1,title:"The Measuring Shelf",obj:"o-cyl",answer:"170",kind:"num",tile:"O",
      scene:"Three measuring cylinders, and a recipe card torn into steps. <em>\"The flask code is how many ml are in the big flask at the end.\"</em>",
      extra:cylSVG,cardClass:"type",
      cards:["Step 1: Pour ALL of cylinder A into the big empty flask.","Step 2: Add ALL of cylinder B.","Step 3: Heat the flask. Bubbling boils away exactly HALF of what's inside.","Step 4: Top it up with ALL of cylinder C. Done!"],
      hints:["Read each cylinder carefully: the long marks are every 50 ml, the short ones every 10 ml.","A is 160, B is 80, C is 50. Do the steps in order.","160 + 80 = 240, half is 120, plus 50 = 170. The code is 170."]},
    /* DNA pattern. Intact rungs always pair red circle with blue square, green triangle with yellow diamond.
       Missing bottoms: seg1 under green -> yellow = G; seg2 under blue -> red = L; seg3 under yellow -> green = O;
       seg4 under red -> blue = W. GLOW. */
    dna:{wave:1,title:"The DNA Scanner",obj:"o-dna",answer:"GLOW",kind:"word",tile:"C",splitArt:true,
      scene:"The scanner printed the professor's strand in four segments, but one bead on each came out smudged. Taped to the screen, a key: <em>\"Code = the four smudged beads, segment 1 to 4.\"</em>",
      extra:()=>dnaKey()+`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-2,1.5,1,-1.5][i]}deg;animation-delay:${i*.08}s;background:#1c2a2e"><span class="ph">PHONE ${i+1}</span>${dnaSVG(i)}</div>`).join('')}</div>`,
      hints:["Look at the rungs that aren't smudged. Each bead always has the same partner.","Red circles always pair with blue squares, and green triangles with yellow diamonds. So what goes under a green triangle?","Yellow, red, green, blue: G, L, O, W. The answer is GLOW."]},
    /* Element chart (4 columns: 1-4 / 5-8 / 9-12).
       Fizzium 1 + Glowium 3 = 4 An; below Bubblon (2) is 6 Ti; double Annoyium (4) = 8 Do; Wobblium 7 + Glowium 3 = 10 Te. ANTIDOTE. */
    chart:{wave:2,title:"The Element Chart",obj:"o-chart",answer:"ANTIDOTE",kind:"word",tile:"T",
      lockedMsg:"A blind is pulled down over the chart: AUTHORISED ONLY. Crack two of the first locks to raise it.",
      scene:"The professor's chart of very real (very made-up) elements. Four sticky notes each point to one element. <em>\"Stick the symbols together, in order, and you'll know what we're making.\"</em>",
      extra:chartHTML,
      cards:["<b>Note 1</b><br>The element whose number is Fizzium's number plus Glowium's number.","<b>Note 2</b><br>The element directly BELOW Bubblon on the chart.","<b>Note 3</b><br>The element whose number is DOUBLE Annoyium's.","<b>Note 4</b><br>The element whose number is Wobblium's number plus Glowium's number."],
      hints:["Each note gives you one element. Write down its two-letter symbol.","Note 1: Fizzium is 1 and Glowium is 3, so element 4: An. Note 2: under Bubblon is element 6.","An, Ti, Do, Te. The answer is ANTIDOTE."]},
    /* Microscope overlay. Lit segments are split across 4 slides (each segment on exactly one slide).
       Stacked, the four digits read 6 2 9 5 (verified by script). */
    scope:{wave:2,title:"The Microscope Slides",obj:"o-scope",answer:"6295",kind:"num",tile:"I",splitArt:true,
      lockedMsg:"The fume hood glass is sealed with tape. Crack two of the first locks to open it.",
      scene:"Four glass slides sit by the microscope, each with a few glowing marks. Etched on the eyepiece: <em>\"One slide on its own is nonsense. Stack all four and look again.\"</em>",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1.5,1.5,1,-1][i]}deg;animation-delay:${i*.08}s;background:#1c2a2e"><span class="ph">PHONE ${i+1}</span>${slideSVG(i)}</div>`).join('')}</div>`,
      hints:["The slides are all the same size and the marks line up. Imagine laying all four on top of each other.","Combine the glowing marks from every slide, one box at a time. Each box becomes a digit like on a calculator.","Stacked, the slides read 6, 2, 9, 5. The code is 6295."]},
    /* Final: tiles T,O,N,I,C -> TONIC. Only other dictionary anagram: ONTIC (obscure). */
    synth:{wave:3,title:"The Cure-O-Matic",obj:"o-synth",answer:"TONIC",kind:"word",
      scene:"Each lock you crack drops a glowing letter tile into the synthesizer. The screen blinks: <em>\"NAME THE CURE TO BREW IT.\"</em> The professor hiccups a bubble.",
      wrongMessages:{ONTIC:"That's a real (very rare) word, but you can't drink it. Try again.",CURES:"Close in spirit, wrong letters. Use only the five tiles."},
      hints:["It's a drink that makes you feel better. A word for a cure.","It starts with T. Some people mix it with lemonade.","The answer is TONIC."]}
  },
  finale:{tag:"CURED",titleHTML:"NO MORE<br><span>HICCUPS</span>",
    cardHTML:`<h3>Fizzwick's Fizzy Tonic</h3>Fill a glass with ice. Add the juice of half a lime, a splash of apple juice and a teaspoon of honey. Top up with sparkling water, stir, and drop in a mint leaf. Bubbling optional.<div class="note">"You did it! The lab's unsealed and I haven't hiccuped in... hic. Oh dear. One more glass, please." - Prof. Fizzwick</div>`}
};
EXP_ORDER.push(ID);
})();
