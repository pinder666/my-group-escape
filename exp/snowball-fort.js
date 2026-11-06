(function(){
const ID='snowball-fort', P=`.scene[data-exp="${ID}"]`;
const A='assets/snowball-fort/';

/* ================= LOCK: score (snowball tally) =================
   Frostbites throwers, hits/misses as tally marks. Rule: hit +3, miss -1.
   Pip 7H 3M = 21-3 = 18 | Moss 5H 4M = 15-4 = 11 | Fern 9H 2M = 27-2 = 25 | Juniper 6H 5M = 18-5 = 13
   Total 18+11+25+13 = 67. (Icicles' 52 on the board is just the rival score.) */
const TALLY={Pip:[7,3],Moss:[5,4],Fern:[9,2],Juniper:[6,5]};
function tallySVG(n,col){
  let g='',x=4;
  for(let i=0;i<n;i++){
    const inGroup=i%5;
    if(inGroup===4){ const gx=x-4*7; g+=`<line x1="${gx-3}" y1="20" x2="${gx+24}" y2="4" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`; x+=8; continue; }
    g+=`<line x1="${x}" y1="3" x2="${x}" y2="21" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`; x+=7;
  }
  return `<svg viewBox="0 0 ${Math.max(x+4,20)} 24" style="height:22px;width:auto;vertical-align:middle">${g}</svg>`;
}
const tallyCard=n=>`<b style="font-family:Inter,sans-serif;font-size:14px">${n}</b> <span style="font-size:11px;color:#6a5a44">(Frostbites)</span><div style="display:flex;align-items:center;gap:6px;margin-top:6px"><span style="font-size:11px;width:44px;font-weight:700;color:#2b6a3a">HITS</span>${tallySVG(TALLY[n][0],'#2b6a3a')}</div><div style="display:flex;align-items:center;gap:6px;margin-top:4px"><span style="font-size:11px;width:44px;font-weight:700;color:#a8323a">MISSES</span>${tallySVG(TALLY[n][1],'#a8323a')}</div>`;

/* ================= LOCK: trail (tangled ski tracks) =================
   Each skier's column at 4 levels (start, two midpoints, finish). Columns are a permutation at each level.
   Red 0>3>4>3, Green 1>0>1>0, Blue 2>1>0>4, Yellow 3>4>2>1, Purple 4>2>3>2.
   Finish flags (left to right) R K A C T. So Red ends at C, Green at R, Blue at T, Yellow at K, Purple at A.
   Finishing order from cards: Blue 1st (T), Green 2nd (R), Purple 3rd (A), Red 4th (C), Yellow 5th (K) = TRACK.
   (TRACK has no other anagram.) 11 crossings; script-checked that no two crossings are closer than 47 units (no triple crossings). */
const SKIERS=[{c:'#e8333a',n:'Red',p:[0,3,4,3]},{c:'#2fbf4a',n:'Green',p:[1,0,1,0]},{c:'#2f7bff',n:'Blue',p:[2,1,0,4]},{c:'#ffc928',n:'Yellow',p:[3,4,2,1]},{c:'#a35cff',n:'Purple',p:[4,2,3,2]}];
const FLAGS='RKACT';
const TX=[[40,102,165,228,290],[38,112,165,220,282],[40,95,153,216,293],[40,102,165,228,290]], TY=[52,112,172,228];
function trailPath(s){ let d=`M${TX[0][s.p[0]]} ${TY[0]}`; for(let l=1;l<4;l++){ const x0=TX[l-1][s.p[l-1]],y0=TY[l-1],x1=TX[l][s.p[l]],y1=TY[l],m=(y1-y0)/2; d+=` C${x0} ${y0+m} ${x1} ${y1-m} ${x1} ${y1}`; } return d; }
function trailSVG(){
  let g=`<rect width="330" height="270" rx="10" fill="#eaf2fc"/><path d="M0 30 Q80 18 165 28 T330 24 V0 H0Z" fill="#bcd0ea"/>`;
  g+=[[18,150],[310,90],[300,200],[20,240],[150,140],[200,95]].map(([x,y])=>`<image href="${A}tree-frost-b.png" x="${x-7}" y="${y-14}" width="14" height="28" opacity=".55"/>`).join('');
  SKIERS.forEach(s=>{ const d=trailPath(s); g+=`<path d="${d}" fill="none" stroke="#6f8fbf" stroke-width="5.5" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#eaf2fc" stroke-width="1.6" stroke-linecap="round"/>`; });
  SKIERS.forEach(s=>{ const x=TX[0][s.p[0]]; g+=`<g transform="translate(${x} 34)"><circle r="9" fill="#f6d2b0"/><path d="M-10 -2 Q0 -22 10 -2Z" fill="${s.c}"/><circle cy="-15" r="3" fill="#fff"/><circle cx="-3" cy="2" r="1.2" fill="#333"/><circle cx="3" cy="2" r="1.2" fill="#333"/></g><text x="${x}" y="16" text-anchor="middle" font-size="9.5" font-weight="700" fill="#33415c" font-family="Inter,sans-serif">${s.n.toUpperCase()}</text>`; });
  FLAGS.split('').forEach((f,i)=>{ const x=TX[3][i]; g+=`<line x1="${x}" y1="${TY[3]-2}" x2="${x}" y2="${TY[3]+26}" stroke="#555" stroke-width="2"/><path d="M${x} ${TY[3]+2} h22 l-5 8 5 8 h-22z" fill="#c8323a"/><text x="${x+9}" y="${TY[3]+15}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" font-family="Inter,sans-serif">${f}</text>`; });
  g+=`<text x="8" y="266" font-size="9" fill="#6a7a94" font-family="Inter,sans-serif">START at the top. Tracks go straight through where they cross.</text>`;
  return `<svg viewBox="0 0 330 270" role="img" aria-label="Five tangled ski tracks from five skiers to five lettered flags">${g}</svg>`;
}
const hat=c=>`<i style="display:inline-block;width:14px;height:11px;background:${c};clip-path:polygon(50% 0,100% 100%,0 100%);vertical-align:-1px;margin-right:4px"></i>`;

/* ================= LOCK: penguins (hidden-object mini-game + split cards) =================
   10 penguins hide in the scene. By hiding place: behind trees 3, inside ice blocks 1,
   behind snowmen 2, buried in snowdrifts (heads only) 4.  3+1+2+4 = 10 (the reveal confirms 10).
   Cards give digit order: trees, ice, snowmen, drifts -> 3124. */
const PEN={n:'penguin.png',ar:76/120}, PT={n:'penguin-teal.png',ar:76/120};
const im=(f,x,y,h,ar,extra='')=>`<image href="${A}${f}" x="${x}" y="${y}" height="${h}" width="${(h*ar).toFixed(2)}" ${extra}/>`;
const pg=(x,y,h=11,t=PEN,flip)=>flip?`<g transform="translate(${2*x+h*t.ar} 0) scale(-1 1)">${im(t.n,x,y,h,t.ar)}</g>`:im(t.n,x,y,h,t.ar);
function snowman(cx,base,s=1){ return `<g transform="translate(${cx} ${base}) scale(${s})"><ellipse cx="0" cy="0" rx="9" ry="2" fill="#9fb4d4" opacity=".6"/><circle cy="-7" r="8" fill="#f7fbff" stroke="#c4d4ea" stroke-width=".6"/><circle cy="-19" r="6" fill="#f7fbff" stroke="#c4d4ea" stroke-width=".6"/><circle cy="-19" r="1" fill="#33415c"/><circle cy="-15.5" r="1" fill="#33415c"/><path d="M-5 -19 L-13 -24 M5 -19 L13 -25" stroke="#6b4a2a" stroke-width="1"/><rect x="-5.5" y="-25.5" width="11" height="2.4" rx="1" fill="#c8323a"/>${im('snowman-head.png',-6,-35,12,1)}</g>`; }
const drift=(cx,cy,rx=9,ry=4)=>`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#sfdrift)"/>`;
function findScene(){
  let g=`<defs><linearGradient id="sfsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2f6a"/><stop offset=".7" stop-color="#8a6aa6"/><stop offset="1" stop-color="#e9a9a0"/></linearGradient><linearGradient id="sfground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe9f8"/><stop offset="1" stop-color="#f6f9ff"/></linearGradient><radialGradient id="sfdrift" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="#ffffff"/><stop offset=".75" stop-color="#eef4fd"/><stop offset="1" stop-color="#c9d8ee"/></radialGradient></defs>`;
  g+=`<rect width="140" height="100" fill="url(#sfground)"/><rect width="140" height="30" fill="url(#sfsky)"/><path d="M0 30 Q20 22 40 28 T80 26 T120 24 T140 27 V34 H0Z" fill="#cbd9ef"/>`;
  g+=[[3,18],[30,17],[70,16],[96,19],[128,15]].map(([x,y])=>im('tree-frost-a.png',x,y,15,.52,'opacity=".7"')).join('');
  // tree #1 (left) with penguin peeking out on its right
  g+=pg(15,40,11)+im('tree-snow-a.png',2,24,30,.525);
  // tree, no penguin
  g+=im('tree-snow-b.png',40,20,28,.54);
  // tree, no penguin (far right, small)
  g+=im('tree-frost-c.png',104,17,22,.51);
  // drift penguin #1 (left middle)
  g+=pg(7.5,59,9)+drift(11,68,8,3.6);
  // ice block with penguin inside; second ice block empty
  g+=pg(101,47,11,PT)+im('ice-block.png',97,43,17,.97,'opacity=".72"');
  g+=im('ice-block.png',24,57,14,.97,'opacity=".9"');
  // snowman #1 with penguin peeking on its left
  g+=pg(43,48,11,PEN,true)+snowman(53,64);
  // tree #2 with penguin peeking on its left
  g+=pg(78.5,36,10,PEN,true)+im('tree-snow-a.png',82,22,28,.525);
  // snowman, no penguin (right)
  g+=snowman(130,66,.85);
  // tree #3 with penguin peeking on its right
  g+=pg(70,74,11)+im('tree-snow-b.png',55,56,32,.54);
  // snowman #2 with penguin peeking on its right
  g+=pg(118,76,11)+snowman(114,92);
  // drift penguins #2, #3, #4 along the bottom, plus empty drifts
  g+=pg(12,80,10)+drift(16,89,10,4);
  g+=pg(38,84,10)+drift(42,93,10,4.2);
  g+=pg(84,82,10)+drift(88,91,9,3.8);
  g+=drift(102,70,9,3.4)+drift(66,46,8,3)+drift(32,46,7,2.6);
  g+=[[126,95],[129,95],[127.5,92.6]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" stroke="#b7c8e2" stroke-width=".4"/>`).join('');
  return `<svg viewBox="0 0 140 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Snowy field with hidden penguins">${g}</svg>`;
}
// hotspot targets (x,y in % of width/height; r in % of width). Order: trees 3, ice 1, snowmen 2, drifts 4.
const PENGUINS=[
  {x:13.2,y:45,r:4.6,name:'penguin behind a tree'},
  {x:58.2,y:41,r:4.6,name:'penguin behind a tree'},
  {x:52.5,y:79.5,r:4.6,name:'penguin behind a tree'},
  {x:74.6,y:52.5,r:5,name:'penguin in an ice block'},
  {x:32.9,y:53,r:4.6,name:'penguin behind a snowman'},
  {x:86.8,y:81.5,r:4.6,name:'penguin behind a snowman'},
  {x:7.4,y:63,r:4.4,name:'penguin in a snowdrift'},
  {x:10.8,y:84,r:4.4,name:'penguin in a snowdrift'},
  {x:29.4,y:88,r:4.4,name:'penguin in a snowdrift'},
  {x:62.3,y:86,r:4.4,name:'penguin in a snowdrift'}
];

/* ================= LOCK: window (snowflake symmetry) =================
   Every arm of a snowflake is identical. Each flake is missing one arm; each card is one arm.
   Arm designs: tip (dot/diamond/fork/plain) x branch positions.
   Flake 1 = D (plain, 3 short pairs)  -> card W
   Flake 2 = B (diamond, 2 pairs)      -> card I
   Flake 3 = E (dot, 2 pairs)          -> card N
   Flake 4 = A (dot, 1 pair)           -> card R
   Flake 5 = C (fork, no branches)     -> card T
   Flake 6 = F (diamond, 1 pair)       -> card Y
   Reading flakes 1..6: WINTRY. Every design is unique, and pairs share one feature each so both tip and branches must be checked. */
const ARMS={A:{tip:'dot',br:[.5]},B:{tip:'diamond',br:[.35,.7]},C:{tip:'fork',br:[]},D:{tip:'plain',br:[.28,.52,.76],s:6},E:{tip:'dot',br:[.35,.7]},F:{tip:'diamond',br:[.5]}};
const FLAKES=[['D',1],['B',4],['E',2],['A',5],['C',3],['F',0]]; // [design, missing arm index]
const ARM_LETTER={D:'W',B:'I',E:'N',A:'T',C:'R',F:'Y'};
function arm(k,col='#fff',w=3){
  const a=ARMS[k], L=34, r0=6; let s=`<line x1="0" y1="${-r0}" x2="0" y2="${a.tip==='fork'?-29:-L}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  a.br.forEach(f=>{const y=-(r0+(L-r0)*f), b=a.s||9; s+=`<path d="M${-.8*b} ${y-.75*b} L0 ${y} L${.8*b} ${y-.75*b}" fill="none" stroke="${col}" stroke-width="${w*.8}" stroke-linecap="round" stroke-linejoin="round"/>`;});
  if(a.tip==='dot') s+=`<circle cy="${-L-3}" r="3.6" fill="${col}"/>`;
  if(a.tip==='diamond') s+=`<path d="M0 ${-L-8} L4.5 ${-L-3} L0 ${-L+2} L-4.5 ${-L-3}Z" fill="${col}"/>`;
  if(a.tip==='fork') s+=`<path d="M-6 ${-L-4} L0 -28 L6 ${-L-4}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return s;
}
function flakeSVG(i){
  const [k,miss]=FLAKES[i]; let g='';
  for(let j=0;j<6;j++){ if(j===miss){ g+=`<g transform="rotate(${j*60})"><line x1="0" y1="-6" x2="0" y2="-11" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M-3 -12 l2 -2 2 2 2 -2" fill="none" stroke="#fff" stroke-width="1.2"/><line x1="0" y1="-16" x2="0" y2="-36" stroke="#9ec3ea" stroke-width="1.2" stroke-dasharray="2 3"/></g>`; continue; }
    g+=`<g transform="rotate(${j*60})">${arm(k)}</g>`; }
  g+=`<circle r="6.5" fill="none" stroke="#fff" stroke-width="2.4"/>`;
  return `<svg viewBox="-48 -48 96 96" role="img" aria-label="Snowflake ${i+1} with one arm missing"><circle r="47" fill="#1b3b6e"/><g>${g}</g><circle cx="-36" cy="-36" r="10" fill="#0e2550"/><text x="-36" y="-32" text-anchor="middle" font-size="12" font-weight="800" fill="#ffe08a" font-family="Inter,sans-serif">${i+1}</text></svg>`;
}
const flakeGrid=()=>`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${[0,1,2,3,4,5].map(i=>`<div>${flakeSVG(i)}</div>`).join('')}</div>`;
const armCard=(k,rot)=>`<div style="display:flex;align-items:center;gap:8px"><svg viewBox="-16 -46 32 48" style="width:44px;height:64px;background:#1b3b6e;border-radius:8px;flex:none"><g transform="rotate(${rot} 0 -20)">${arm(k)}</g></svg><div><div style="font-size:11px;color:#6a5a44">Arm tag</div><div style="font-family:'Archivo Black';font-size:28px;line-height:1;color:#1b3b6e">${ARM_LETTER[k]}</div></div></div>`;

/* ================= LOCK: gate (temperature thaw sequence) =================
   Chain: W = -4. T = W-6 = -10. A = W-1 = -5. H = T+3 = -7. D = +2. E = D-3 = -1.
   Coldest to warmest: T -10, H -7, A -5, W -4, E -1, D +2 = THAWED. Every reading depends on a card. */
const BARS='WDTEAH';
function gateSVG(){
  let g=`<rect width="330" height="200" rx="10" fill="#10224a"/><path d="M30 150 V60 Q165 -10 300 60 V150Z" fill="#071533" stroke="#cfe3fa" stroke-width="6"/>`;
  BARS.split('').forEach((c,i)=>{const x=62+i*41; g+=`<path d="M${x-9} 52 h18 v80 l-9 14 l-9 -14z" fill="url(#sfbar)" stroke="#e8f6ff" stroke-width="1.5"/><circle cx="${x}" cy="68" r="11" fill="#0b1d40" stroke="#7fe3ff" stroke-width="1.5"/><text x="${x}" y="73.5" text-anchor="middle" font-size="15" font-weight="800" fill="#c8f4ff" font-family="Inter,sans-serif">${c}</text>`;});
  // number line thermometer
  g+=`<rect x="22" y="168" width="286" height="10" rx="5" fill="url(#sftherm)"/>`;
  for(let t=-12;t<=4;t+=2){const x=30+(t+12)*(270/16); g+=`<line x1="${x}" y1="164" x2="${x}" y2="182" stroke="#fff" stroke-width="${t===0?2.4:1}"/><text x="${x}" y="194" text-anchor="middle" font-size="9.5" fill="#cfe3fa" font-family="Inter,sans-serif">${t}</text>`;}
  g+=`<text x="22" y="160" font-size="9.5" font-weight="700" fill="#7fe3ff" font-family="Inter,sans-serif">COLDER</text><text x="308" y="160" text-anchor="end" font-size="9.5" font-weight="700" fill="#ff9a7a" font-family="Inter,sans-serif">WARMER</text>`;
  return `<svg viewBox="0 0 330 200" role="img" aria-label="Gate with six lettered icicle bars and a thermometer scale"><defs><linearGradient id="sfbar" x1="0" x2="1"><stop offset="0" stop-color="#9fe6ff"/><stop offset=".5" stop-color="#e8fbff"/><stop offset="1" stop-color="#7fcfee"/></linearGradient><linearGradient id="sftherm" x1="0" x2="1"><stop offset="0" stop-color="#2f7bff"/><stop offset=".72" stop-color="#bfe8ff"/><stop offset="1" stop-color="#ff7a5a"/></linearGradient></defs>${g}</svg>`;
}

EXPERIENCES[ID]={
  id:ID, title:"The Snowball Fort", titleHTML:"THE SNOWBALL<br><span>FORT</span>", season:"Christmas", collection:'christmas',
  tag:"A snow-day escape room",
  blurb:"The elves' giant snow fort has frozen shut, and the Snowball Championship trophy is locked in the ice vault inside. Thaw your way in before the rival team, the Icicles, beat you to it.",
  menuBlurb:"The snowball trophy is frozen in the fort's ice vault. Thaw your way in before the rival team does.",
  menuLine:"Thaw the ice vault",
  theme:{accent:'#7fe3ff',accent2:'#c8f4ff',bg:'#070b1a',introBg:'#16224e',door:'#cfe0f4',doorFrame:'#6f8fbf',boxColor:'linear-gradient(#bff0ff,#5fb8e0)'},
  sceneCSS:`
${P}{background:#e6eef9}
${P} .sky{position:absolute;left:0;right:0;top:0;height:52%;background:linear-gradient(#0a0f30 0%,#1e2560 30%,#4f3b7c 55%,#b26d8c 80%,#efaa86 100%)}
${P} .star{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;animation:twinkle 3s infinite}
${P} .aurora{position:absolute;left:-20%;width:140%;height:9%;border-radius:50%;filter:blur(9px);opacity:.5;mix-blend-mode:screen;animation:${ID}-aurora 10s ease-in-out infinite alternate}
${P} .aurora.a1{top:6%;background:linear-gradient(90deg,transparent,#3dffb0 25%,#5ad8ff 50%,#3dffb0 70%,transparent)}
${P} .aurora.a2{top:13%;height:6%;background:linear-gradient(90deg,transparent 10%,#9a6bff 40%,#3dffb0 65%,transparent);animation-duration:13s;animation-delay:-4s;opacity:.38}
${P} .moon{position:absolute;right:9%;top:5%;width:9%;aspect-ratio:1;border-radius:50%;background:#fbf3dc;box-shadow:0 0 18px #fbf3dcaa;overflow:hidden}
${P} .moon::after{content:"";position:absolute;inset:0;border-radius:50%;transform:translate(28%,-12%);background:#1e2560}
${P} .hills{position:absolute;left:-10%;right:-10%;top:40%;height:16%;background:radial-gradient(ellipse at 20% 100%,#c6d6ee 0 55%,transparent 56%),radial-gradient(ellipse at 75% 100%,#b9cbe6 0 58%,transparent 59%)}
${P} .ftree{position:absolute;opacity:.75}
${P} .ground{position:absolute;left:0;right:0;bottom:0;height:40%;background:linear-gradient(#d4e1f4,#eef4fd 30%,#f8fbff)}
${P} .ground::before{content:"";position:absolute;left:0;right:0;top:0;height:10%;background:linear-gradient(rgba(70,90,150,.25),transparent)}
/* fort */
${P} .wall{position:absolute;left:0;right:0;top:41%;height:21%;background:linear-gradient(rgba(110,140,200,.32) 2px,transparent 2px) 0 0/100% 25%,repeating-linear-gradient(90deg,transparent 0 31px,rgba(110,140,200,.28) 31px 33px),linear-gradient(#f4f8ff,#c8d7ee);box-shadow:0 6px 10px rgba(40,60,110,.25)}
${P} .cren{position:absolute;top:37.6%;width:9%;height:3.8%;background:linear-gradient(#ffffff,#dfe8f6);border-radius:3px 3px 0 0}
${P} .tower{position:absolute;left:32%;width:36%;top:20%;height:42%;background:linear-gradient(rgba(110,140,200,.32) 2px,transparent 2px) 0 0/100% 12.5%,repeating-linear-gradient(90deg,transparent 0 29px,rgba(110,140,200,.28) 29px 31px),linear-gradient(90deg,#c9d8ee,#f6faff 40%,#d6e2f3);border-radius:4px 4px 0 0;box-shadow:0 0 18px rgba(20,30,80,.35)}
${P} .tcren{position:absolute;top:16.6%;width:7.6%;height:3.8%;background:linear-gradient(#fff,#dfe8f6);border-radius:3px 3px 0 0}
${P} .pole{position:absolute;left:49.6%;top:5%;width:.9%;height:12%;background:#6b4a2a;border-radius:2px}
${P} .flag{position:absolute;left:50.5%;top:5.4%;width:14%;height:5.6%;background:linear-gradient(90deg,#c8323a 0 50%,#2f9e48 50%);transform-origin:0 50%;animation:${ID}-flap 1.4s ease-in-out infinite;clip-path:polygon(0 0,100% 12%,88% 50%,100% 88%,0 100%)}
${P} .flag::after{content:"";position:absolute;left:30%;top:22%;width:22%;aspect-ratio:1;border-radius:50%;background:#fff;box-shadow:inset -2px -2px 0 #cfe0f4}
${P} .icicle{position:absolute;width:2.2%;height:3.4%;background:linear-gradient(90deg,#bfeaff,#fff 50%,#a8dcf6);clip-path:polygon(0 0,100% 0,50% 100%);z-index:1}
${P} .drop{position:absolute;width:.9%;aspect-ratio:.7;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:#bfeaff;box-shadow:0 0 3px #fff;opacity:0;animation:${ID}-drip 2.8s ease-in infinite;z-index:1}
/* snow */
${P} .snow{position:absolute;inset:0;pointer-events:none;z-index:4;overflow:hidden}
${P} .flake{position:absolute;top:-3%;width:5px;height:5px;border-radius:50%;background:#fff;opacity:.9;box-shadow:0 0 3px #fff;animation:${ID}-fall linear infinite}
${P} .flake.s{width:3px;height:3px;opacity:.7}
/* window (wave 2) */
${P} #o-window{left:39%;top:23.5%;width:22%;height:14%}
${P} #o-window .pane{position:absolute;inset:0;border-radius:50% 50% 6px 6px/40% 40% 6px 6px;background:radial-gradient(circle at 50% 40%,#2a5aa0,#0e2550);border:4px solid #a9c4e6;box-shadow:inset 0 0 10px rgba(0,0,0,.6),0 0 0 2px #e8f1fc;overflow:hidden}
${P} #o-window .pane svg{position:absolute;width:42%;animation:${ID}-spin 14s linear infinite}
${P} #o-window .frost{position:absolute;inset:0;border-radius:50% 50% 6px 6px/40% 40% 6px 6px;background:radial-gradient(circle at 30% 30%,#fff 0 20%,transparent 21%) 0 0/9px 9px,radial-gradient(circle at 70% 60%,#e6f2ff 0 25%,transparent 26%) 0 0/13px 13px,linear-gradient(135deg,#f4f9ff,#c9dcf2);border:4px solid #a9c4e6;transition:opacity 1.6s,transform 1.6s;display:flex;align-items:center;justify-content:center}
${P} #o-window .frost::after{content:"";width:40%;height:3px;border-radius:2px;background:#9ab4d6;box-shadow:0 7px 0 #9ab4d6,0 -7px 0 #9ab4d6;opacity:.5}
${P} #o-window.revealed .frost{opacity:0;transform:scale(1.15)}
${P} #o-window.solved .pane svg{animation-duration:3s;filter:drop-shadow(0 0 4px #c8f4ff)}
/* gate (wave 2) */
${P} #o-gate{left:37%;top:42%;width:26%;height:20%}
${P} #o-gate .arch{position:absolute;inset:0;border-radius:50% 50% 0 0/38% 38% 0 0;background:radial-gradient(ellipse at 50% 100%,#3a2e6a,#0b1433 70%);box-shadow:inset 0 0 0 4px #b8cdea,inset 0 0 14px #000;overflow:hidden}
${P} #o-gate .bar{position:absolute;top:10%;bottom:6%;width:9%;background:linear-gradient(90deg,#9fe6ff,#f2fcff 50%,#7fcfee);clip-path:polygon(0 0,100% 0,100% 88%,50% 100%,0 88%);transition:transform 1.4s cubic-bezier(.5,.1,.3,1)}
${P} #o-gate .bar:nth-child(2n){transition-delay:.15s}
${P} #o-gate.up .bar{transform:translateY(-105%)}
${P} #o-gate .glow{position:absolute;left:30%;right:30%;bottom:8%;height:30%;border-radius:50%;background:radial-gradient(#ffd34d,transparent 70%);opacity:.0;transition:opacity 1s 1s}
${P} #o-gate.up .glow{opacity:.9}
${P} #o-gate .slab{position:absolute;inset:-4% -6% -2%;border-radius:46% 46% 4px 4px/34% 34% 4px 4px;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.65) 42% 46%,transparent 48%),linear-gradient(160deg,#c7f1ff,#7cc6ea 60%,#5aa8d6);border:2px solid #e8f8ff;box-shadow:inset 0 0 12px rgba(255,255,255,.7);transition:transform 1.4s cubic-bezier(.6,.05,.3,1),opacity 1.4s;transform-origin:50% 100%;z-index:1}
${P} #o-gate .slab::before{content:"";position:absolute;inset:0;background:linear-gradient(60deg,transparent 48%,#e8f8ff 49% 51%,transparent 52%) 20% 30%/40% 40% no-repeat,linear-gradient(-50deg,transparent 48%,#e8f8ff 49% 51%,transparent 52%) 70% 60%/36% 40% no-repeat;opacity:.8}
${P} #o-gate.revealed .slab{transform:translateY(40%) scale(.9) rotate(5deg);opacity:0}
/* scoreboard */
${P} #o-score{left:3%;top:42.5%;width:29%;height:19%}
${P} #o-score .post{position:absolute;bottom:0;width:7%;height:42%;background:linear-gradient(90deg,#5a3a20,#7a5230);}
${P} #o-score .board{position:absolute;left:0;right:0;top:0;height:70%;background:linear-gradient(#7a4c2c,#5a3820);border-radius:6px;box-shadow:0 5px 10px rgba(0,0,0,.4),inset 0 0 0 3px #3a2212;padding:6% 7%;display:flex;flex-direction:column;justify-content:space-around}
${P} #o-score .srow{display:flex;align-items:center;justify-content:space-between;font:400 8.5px 'Archivo Black',sans-serif;color:#ffe9c2;letter-spacing:.2px;gap:3px}
${P} #o-score .num{min-width:32%;text-align:center;background:#1b1410;border-radius:3px;color:#7dff8a;font-size:11px;padding:1px 0;position:relative;overflow:hidden}
${P} #o-score .num.f{color:transparent}
${P} #o-score .num.f::after{content:"??";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#9fd8ff;background:linear-gradient(135deg,#e8f4ff,#a9cfee);transition:opacity 1s}
${P} #o-score.solved .num.f{color:#7dff8a}
${P} #o-score.solved .num.f::after{opacity:0}
${P} #o-score .cap{position:absolute;left:-3%;right:-3%;top:-7%;height:14%;background:#fff;border-radius:8px 8px 40% 40%;box-shadow:0 2px 0 #cfe0f4}
/* trail sign */
${P} #o-trail{right:3%;top:41.5%;width:29%;height:20%}
${P} #o-trail .sign{position:absolute;left:0;right:12%;top:0;height:68%;background:#eaf2fc;border:4px solid #6b4a2a;border-radius:6px;box-shadow:0 5px 10px rgba(0,0,0,.35);overflow:hidden}
${P} #o-trail .sign svg{width:100%;height:100%;display:block}
${P} #o-trail .post{position:absolute;left:40%;bottom:0;width:7%;height:36%;background:linear-gradient(90deg,#5a3a20,#7a5230)}
${P} #o-trail .ski{position:absolute;bottom:0;width:6%;height:96%;border-radius:40% 40% 3px 3px;transform-origin:50% 100%}
${P} #o-trail .ski.a{right:6%;background:linear-gradient(#e8333a,#a8232c);transform:rotate(8deg)}
${P} #o-trail .ski.b{right:1%;background:linear-gradient(#2f7bff,#1d4fb0);transform:rotate(-5deg)}
${P} #o-trail .skier{position:absolute;left:8%;top:4%;width:10%;aspect-ratio:1;border-radius:50%;background:#e8333a;box-shadow:0 0 6px #fff;opacity:0}
${P} #o-trail.solved .skier{opacity:1;animation:${ID}-ski 3.5s ease-in-out infinite}
${P} #o-trail .cap{position:absolute;left:-4%;right:8%;top:-6%;height:12%;background:#fff;border-radius:8px 8px 40% 40%}
/* snowman */
${P} .snowman{position:absolute;left:1%;top:63%;width:17%;height:23%;z-index:1}
${P} .snowman .b1{position:absolute;left:4%;right:4%;bottom:0;height:52%;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff,#e2ecf9 60%,#b8cbe6)}
${P} .snowman .b2{position:absolute;left:17%;right:17%;bottom:42%;height:36%;border-radius:50%;background:radial-gradient(circle at 38% 32%,#fff,#e2ecf9 60%,#b8cbe6)}
${P} .snowman .sbt{position:absolute;left:47%;width:6%;aspect-ratio:1;border-radius:50%;background:#33415c}
${P} .snowman .scarf{position:absolute;left:22%;right:22%;bottom:73%;height:7%;background:repeating-linear-gradient(90deg,#c8323a 0 6px,#fff 6px 9px);border-radius:4px;z-index:2}
${P} .snowman .tail{position:absolute;left:58%;bottom:58%;width:10%;height:17%;background:repeating-linear-gradient(0deg,#c8323a 0 6px,#fff 6px 9px);border-radius:2px;z-index:2;transform-origin:50% 0;animation:${ID}-wag 2s ease-in-out infinite}
${P} .snowman .arm{position:absolute;bottom:58%;width:34%;height:3%;background:#6b4a2a;border-radius:2px}
${P} .snowman .arm.l{left:-14%;transform:rotate(24deg)} ${P} .snowman .arm.r{right:-14%;transform:rotate(-30deg)}
${P} .snowman .head{position:absolute;left:23%;width:54%;bottom:72%;transform-origin:50% 90%;animation:${ID}-bob 2.4s ease-in-out infinite}
${P} .snowman .hat{position:absolute;left:24%;right:24%;top:-30%;height:38%;background:#2a2f45;border-radius:3px 3px 0 0;box-shadow:0 0 0 0 #000}
${P} .snowman .hat::after{content:"";position:absolute;left:-30%;right:-30%;bottom:-12%;height:22%;background:#2a2f45;border-radius:3px}
${P} .snowman .hat::before{content:"";position:absolute;left:0;right:0;bottom:12%;height:20%;background:#2f9e48}
/* drift with penguins */
${P} #o-drift{right:2%;top:63%;width:30%;height:17%}
${P} #o-drift .mound{position:absolute;left:0;right:0;bottom:0;height:55%;border-radius:50% 50% 12% 12%/90% 90% 12% 12%;background:radial-gradient(ellipse at 45% 25%,#fff,#e6eef9 60%,#bfd0e8);box-shadow:0 4px 8px rgba(60,80,130,.25);z-index:1}
${P} #o-drift .pk{position:absolute;bottom:30%;height:46%;animation:${ID}-peek 4s ease-in-out infinite}
${P} #o-drift .pop{position:absolute;left:34%;bottom:36%;height:72%;opacity:0;transform:translateY(40%);transition:.7s cubic-bezier(.3,1.6,.5,1);z-index:2}
${P} #o-drift.solved .pop{opacity:1;transform:translateY(0)}
/* waddling penguin */
${P} .walker{position:absolute;left:24%;top:63%;width:7%;z-index:1;animation:${ID}-walk 14s linear infinite}
${P} .walker img{width:100%;display:block;transform-origin:50% 100%;animation:${ID}-waddle .5s ease-in-out infinite alternate}
/* vault */
${P} #o-vault{left:27%;top:72%;width:46%;height:25%}
${P} #o-vault .ice{position:absolute;inset:0 0 0 0;border-radius:8px;background:linear-gradient(120deg,transparent 30%,rgba(255,255,255,.55) 32% 36%,transparent 38%),linear-gradient(120deg,transparent 58%,rgba(255,255,255,.35) 60% 62%,transparent 64%),linear-gradient(160deg,#c9f3ff,#7fcfee 55%,#4f9fd0);border:2px solid #effbff;box-shadow:0 8px 16px rgba(30,60,120,.35),inset 0 0 16px rgba(255,255,255,.7)}
${P} #o-vault .lid{position:absolute;left:-3%;right:-3%;top:-6%;height:16%;border-radius:8px 8px 4px 4px;background:linear-gradient(#ffffff,#d6e6f6);box-shadow:0 3px 0 rgba(80,120,180,.4)}
${P} #o-vault .trophy{position:absolute;left:33%;top:14%;width:34%;height:52%;opacity:.55;filter:blur(.6px);transition:opacity 1s,filter 1s}
${P} #o-vault.solved .trophy{opacity:1;filter:drop-shadow(0 0 8px #ffd34d)}
${P} #o-vault .plate{position:absolute;left:8%;right:8%;bottom:8%;height:20%;border-radius:6px;background:linear-gradient(#3a4a66,#1c2638);border:1.5px solid #7fe3ff;box-shadow:0 0 10px rgba(127,227,255,.5)}
${P} #o-vault .lights{position:absolute;inset:0 6%;display:flex;justify-content:space-between;align-items:center}
${P} #o-vault .lights b{width:11%;aspect-ratio:1;border-radius:50%;background:#20304a;box-shadow:inset 0 0 0 1px #000}
${P} #o-vault .lights b.on{background:#7fe3ff;box-shadow:0 0 8px #7fe3ff,0 0 2px #fff inset}
${P} .ballpile{position:absolute;z-index:1}
${P} .ballpile i{position:absolute;width:34%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,#e2ecf9 60%,#a9bfe0)}
${P} .elf{position:absolute;z-index:1}
${P} .elf.g{animation:bob 2.8s ease-in-out infinite}
${P} .elf.o{animation:${ID}-throw 3.2s ease-in-out infinite;transform-origin:50% 100%}
${P} .ball{position:absolute;width:2.6%;aspect-ratio:1;border-radius:50%;background:#fff;box-shadow:0 0 4px #fff;z-index:3;opacity:0;animation:${ID}-arc 3.2s ease-in infinite}
${P} .tint{position:absolute;inset:0;pointer-events:none;background:linear-gradient(rgba(60,40,120,.1),transparent 40%,rgba(30,40,90,.12));z-index:3}
@keyframes ${ID}-aurora{0%{transform:translateX(-8%) skewX(-12deg) scaleY(.8);opacity:.3}50%{opacity:.6}100%{transform:translateX(8%) skewX(12deg) scaleY(1.2);opacity:.4}}
@keyframes ${ID}-flap{0%,100%{transform:skewY(-4deg) scaleX(1)}50%{transform:skewY(5deg) scaleX(.86)}}
@keyframes ${ID}-drip{0%,55%{opacity:0;transform:translateY(0)}60%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(900%)}}
@keyframes ${ID}-fall{0%{top:-3%;transform:translateX(0)}50%{transform:translateX(14px)}100%{top:103%;transform:translateX(-6px)}}
@keyframes ${ID}-spin{to{transform:rotate(360deg)}}
@keyframes ${ID}-bob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-7%) rotate(6deg)}}
@keyframes ${ID}-wag{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}
@keyframes ${ID}-peek{0%,100%{transform:translateY(30%)}30%,60%{transform:translateY(0)}}
@keyframes ${ID}-walk{0%{transform:translateX(0) scaleX(1)}46%{transform:translateX(450%) scaleX(1)}50%{transform:translateX(450%) scaleX(-1)}96%{transform:translateX(0) scaleX(-1)}100%{transform:translateX(0) scaleX(1)}}
@keyframes ${ID}-waddle{from{transform:rotate(-9deg)}to{transform:rotate(9deg)}}
@keyframes ${ID}-throw{0%,60%,100%{transform:rotate(0)}70%{transform:rotate(-8deg)}78%{transform:rotate(6deg)}}
@keyframes ${ID}-arc{0%,72%{opacity:0;transform:translate(0,0)}74%{opacity:1;transform:translate(0,0)}86%{opacity:1;transform:translate(-260%,-260%)}100%{opacity:0;transform:translate(-520%,60%)}}
@keyframes ${ID}-ski{0%{transform:translate(0,0)}50%{transform:translate(380%,280%)}100%{transform:translate(700%,560%);opacity:0}}
`,
  sceneHTML:`
<div class="sky"></div>
${[[6,4],[18,10],[28,3],[44,8],[58,2],[66,12],[80,16],[12,20],[36,15],[92,22],[52,18],[72,6]].map(([l,t],i)=>`<div class="star" style="left:${l}%;top:${t}%;animation-delay:${(i*.37)%3}s"></div>`).join('')}
<div class="aurora a1"></div><div class="aurora a2"></div>
<div class="moon"></div>
<div class="hills"></div>
${[[2,30,9],[12,33,7],[22,31,8],[72,32,8],[82,29,10],[92,33,7]].map(([l,t,h])=>`<img class="ftree" src="${A}tree-frost-${'abc'[Math.round(l)%3]}.png" alt="" style="left:${l}%;top:${t}%;height:${h}%">`).join('')}
<div class="ground"></div>
<div class="pole"></div><div class="flag"></div>
<div class="tower"></div>
${[32,41.5,51,60.4].map(l=>`<div class="tcren" style="left:${l}%"></div>`).join('')}
<div class="wall"></div>
${[0,10.5,21,71,81.5,91].map(l=>`<div class="cren" style="left:${l}%"></div>`).join('')}
${[[3,41],[8,41],[14,41],[25,41],[70,41],[77,41],[86,41],[95,41],[34,20],[44,20],[54,20],[63,20]].map(([l,t])=>`<div class="icicle" style="left:${l}%;top:${t}%"></div>`).join('')}
${[[8.65,44.5,0],[44.65,23.5,1.1],[77.65,44.5,1.9],[63.65,23.5,.6]].map(([l,t,d])=>`<div class="drop" style="left:${l}%;top:${t}%;animation-delay:${d}s"></div>`).join('')}
<button class="obj" id="o-window" aria-label="Frosted tower window"><div class="pane"><svg viewBox="-48 -48 96 96" style="left:6%;top:14%">${[0,60,120,180,240,300].map(r=>`<g transform="rotate(${r})">${arm('B','#dff4ff',4)}</g>`).join('')}</svg><svg viewBox="-48 -48 96 96" style="right:4%;top:40%;width:34%;animation-direction:reverse">${[0,60,120,180,240,300].map(r=>`<g transform="rotate(${r})">${arm('A','#dff4ff',4)}</g>`).join('')}</svg></div><div class="frost"></div><span class="spark"></span></button>
<button class="obj" id="o-gate" aria-label="Frozen fort gate"><div class="arch"><div class="glow"></div>${[0,1,2,3,4,5].map(i=>`<div class="bar" style="left:${12+i*13.4}%"></div>`).join('')}</div><div class="slab"></div><span class="spark"></span></button>
<button class="obj" id="o-score" aria-label="Frozen scoreboard"><div class="post" style="left:16%"></div><div class="post" style="right:16%"></div><div class="board"><div class="srow"><span>FROSTBITES</span><span class="num f">67</span></div><div class="srow"><span>ICICLES</span><span class="num">52</span></div></div><div class="cap"></div><span class="spark"></span></button>
<button class="obj" id="o-trail" aria-label="Ski trail map sign"><div class="ski a"></div><div class="ski b"></div><div class="post"></div><div class="sign"><svg viewBox="0 0 100 64" preserveAspectRatio="none">${SKIERS.map(s=>{const d=trailPath(s).replace(/(\d+(\.\d+)?) (\d+(\.\d+)?)/g,(m,x,_,y)=>`${(x*100/330).toFixed(1)} ${((y-40)*64/200).toFixed(1)}`);return `<path d="${d}" fill="none" stroke="#6f8fbf" stroke-width="2.6"/>`}).join('')}${[0,1,2,3,4].map(i=>`<rect x="${TX[3][i]*100/330-1}" y="58" width="5" height="4" fill="#c8323a"/>`).join('')}</svg><div class="skier"></div></div><div class="cap"></div><span class="spark"></span></button>
<div class="walker"><img src="${A}penguin.png" alt=""></div>
<div class="snowman"><div class="arm l"></div><div class="arm r"></div><div class="b1"></div><div class="b2"><div class="sbt" style="top:30%"></div><div class="sbt" style="top:60%"></div></div><div class="tail"></div><div class="scarf"></div><div class="head"><div class="hat"></div><img src="${A}snowman-head.png" alt="" style="width:100%;display:block"></div></div>
<button class="obj" id="o-drift" aria-label="Snowdrift with penguins peeking out"><img class="pk" src="${A}penguin.png" alt="" style="left:12%"><img class="pk" src="${A}penguin-teal.png" alt="" style="left:60%;animation-delay:-1.6s"><img class="pk" src="${A}penguin.png" alt="" style="left:80%;height:38%;animation-delay:-2.7s"><img class="pop" src="${A}penguin-wave.png" alt=""><div class="mound"></div><span class="spark"></span></button>
<div class="ballpile" style="left:2%;top:91%;width:9%;height:6%"><i style="left:0;bottom:0"></i><i style="left:33%;bottom:0"></i><i style="left:66%;bottom:0"></i><i style="left:16%;bottom:48%"></i><i style="left:50%;bottom:48%"></i><i style="left:33%;bottom:94%"></i></div>
<img class="elf g" src="${A}elf-green.png" alt="" style="left:13%;top:81%;height:16%">
<img class="elf o" src="${A}elf-orange.png" alt="" style="right:1%;top:81%;height:17%">
<div class="ball" style="right:13%;top:82%"></div>
<button class="obj" id="o-vault" aria-label="The ice vault"><div class="ice"></div><svg class="trophy" viewBox="0 0 40 50"><path d="M10 4 H30 V16 Q30 28 20 30 Q10 28 10 16Z" fill="#ffd34d" stroke="#b8862b"/><path d="M10 8 Q2 8 3 15 Q4 21 11 21 M30 8 Q38 8 37 15 Q36 21 29 21" fill="none" stroke="#ffd34d" stroke-width="2.4"/><rect x="17" y="30" width="6" height="8" fill="#e8b33a"/><rect x="11" y="38" width="18" height="6" rx="1.5" fill="#b8862b"/><circle cx="20" cy="15" r="5" fill="#fff" opacity=".8"/></svg><div class="lid"></div><div class="plate"><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div></div><span class="spark"></span></button>
<div class="snow">${[...Array(22)].map((_,i)=>`<div class="flake${i%3===0?' s':''}" style="left:${(i*41+7)%100}%;animation-duration:${6+(i*7)%6}s;animation-delay:-${(i*1.7)%10}s"></div>`).join('')}</div>
<div class="tint"></div>`,
  order:["score","trail","penguins","window","gate","vault"],
  revealOnWave2:[{sel:'#o-window',cls:'revealed'},{sel:'#o-gate',cls:'revealed'}],
  wave2Toast:"Crack! The ice slab fell off the gate, and the frost melted from the tower window.",
  finalReadyToast:"Five tiles are frozen into the vault. The Icicles are on their way!",
  startToast:"Tap anything that sparkles. Three locks are ready, and the Icicles are coming.",
  locks:{
    score:{wave:1,title:"The Frozen Scoreboard",obj:"o-score",answer:"67",kind:"num",tile:"R",
      scene:"The scoreboard froze mid-game. The Icicles say they won 52 to nothing. Each elf on your team kept a tally of their throws. <em>\"Code = the Frostbites' real score.\"</em>",
      extra:`<div style="background:linear-gradient(#7a4c2c,#5a3820);border-radius:10px;padding:10px 14px;box-shadow:inset 0 0 0 3px #3a2212;font-family:'Archivo Black';color:#ffe9c2;font-size:15px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">FROSTBITES <span style="background:linear-gradient(135deg,#e8f4ff,#a9cfee);color:#5a8ac0;border-radius:4px;padding:2px 12px">??</span></div><div style="display:flex;justify-content:space-between;align-items:center">ICICLES <span style="background:#1b1410;color:#7dff8a;border-radius:4px;padding:2px 12px">52</span></div></div>`,
      cards:[tallyCard('Pip'),tallyCard('Moss'),tallyCard('Fern'),tallyCard('Juniper'),"<b>Official snowball rules</b><br>Every <b style='color:#2b6a3a'>HIT</b> scores <b>3 points</b>.<br>Every <b style='color:#a8323a'>MISS</b> takes <b>1 point away</b>.<br>Add up all four Frostbites for the team score."],
      hints:["Count each elf's tally marks. A bundle of four lines with a line across it is 5.","Each elf scores 3 for every hit, then loses 1 for every miss. Pip: 7 hits and 3 misses is 21 - 3 = 18.","Pip 18 + Moss 11 + Fern 25 + Juniper 13 = 67. The code is 67."]},
    trail:{wave:1,title:"The Tangled Ski Trails",obj:"o-trail",answer:"TRACK",kind:"word",tile:"O",
      scene:"Five elves raced down the practice slope this morning, and the snow still shows their tracks. Scrawled on the sign: <em>\"Follow each skier to their finish flag. Read the flags in the order they finished.\"</em>",
      extra:trailSVG,
      cards:[`${hat('#e8333a')}<b>Red hat</b> came in <b>4th</b>. Lost a mitten halfway down.`,`${hat('#2fbf4a')}<b>Green hat</b> came in <b>2nd</b>, just behind the winner.`,`${hat('#2f7bff')}<b>Blue hat</b> won! <b>1st</b> place, and won't stop talking about it.`,`${hat('#ffc928')}<b>Yellow hat</b> came <b>last</b> (5th). Stopped to make a snow angel.`,`${hat('#a35cff')}<b>Purple hat</b> finished right in the middle: <b>3rd</b>.`],
      hints:["Put a finger on one skier at the top and follow their track all the way down. Where tracks cross, keep going straight.","Blue's track ends at the T flag and Green's ends at R. Now do the other three, then read the flags 1st to 5th.","Blue T, Green R, Purple A, Red C, Yellow K. The answer is TRACK."]},
    penguins:{wave:1,title:"Penguin Hide-and-Seek",obj:"o-drift",answer:"3124",kind:"num",tile:"Y",
      scene:"The fort's penguin lookouts are playing hide-and-seek, and they won't give up the code until you find them. <em>\"Find every one of us. Then count WHERE we hid.\"</em>",
      game:{type:'find',title:'Find the 10 hiding penguins',aspect:'1.4',scene:findScene,targets:PENGUINS,reveal:'All <b>10</b> penguins found! Now check your cards: each one counts a different hiding place.'},
      cards:["<b>1st digit:</b> how many penguins are hiding behind <b>trees</b>.","<b>2nd digit:</b> how many penguins are frozen inside <b>ice blocks</b>.","<b>3rd digit:</b> how many penguins are hiding behind <b>snowmen</b>.","<b>4th digit:</b> how many penguins are buried in <b>snowdrifts</b>, just heads poking out."],
      hints:["Tap the penguins in the picture until all 10 have green rings. Look beside every tree, snowman, ice block and snow heap.","Some hide behind trees, one is inside an ice block (the other block is empty), and some are just heads sticking out of snowdrifts.","3 behind trees, 1 in ice, 2 behind snowmen, 4 in snowdrifts. The code is 3124."]},
    window:{wave:2,title:"The Snowflake Window",obj:"o-window",answer:"WINTRY",kind:"word",tile:"G",
      lockedMsg:"The window is frosted over solid. Crack two of the first locks to thaw it.",
      scene:"With the frost gone, you can see six snowflakes stuck to the glass. Each has one arm snapped off, and the broken arms are lying in the snow. <em>\"Fix every flake, then read the tags from flake 1 to flake 6.\"</em>",
      extra:flakeGrid,
      cards:[armCard('E',-10),armCard('C',8),armCard('A',-6),armCard('F',10),armCard('D',-12),armCard('B',6)],
      hints:["A real snowflake's six arms all look exactly the same. So the missing arm must match the five arms still on the flake.","Check two things on every arm: the shape at the tip (dot, diamond, fork or nothing) and how many pairs of little branches it has.","1 W, 2 I, 3 N, 4 T, 5 R, 6 Y. The answer is WINTRY."]},
    gate:{wave:2,title:"The Icicle Gate",obj:"o-gate",answer:"THAWED",kind:"word",tile:"L",onSolve:[{sel:'#o-gate',cls:'up'}],
      lockedMsg:"A slab of ice is frozen over the gate. Crack two of the first locks to break it.",
      scene:"Six icicle bars block the gate. A warning is carved above it: <em>\"Thaw the bars from the COLDEST to the WARMEST, or they freeze again. Read their letters in thaw order.\"</em> Each phone has one thermometer reading.",
      extra:gateSVG,
      cards:["Bar <b>W</b> reads <b>4 below zero</b> (-4).","Bar <b>T</b> is <b>6 degrees colder</b> than bar W.","Bar <b>A</b> is <b>1 degree colder</b> than bar W.","Bar <b>H</b> is <b>3 degrees warmer</b> than bar T.","Bar <b>D</b> is the only one above freezing: <b>2 above zero</b> (+2).","Bar <b>E</b> is <b>3 degrees colder</b> than bar D."],
      hints:["Use the thermometer under the gate. Colder means further left. Start with the two bars you know exactly: W and D.","W is -4, so T is -10 and A is -5. D is +2, so E is -1. Then H is 3 warmer than T.","T -10, H -7, A -5, W -4, E -1, D +2. The answer is THAWED."]},
    /* Final: tiles R,O,Y,G,L (HUD order spells ROYGL, not the answer) -> GLORY, the only anagram. */
    vault:{wave:3,title:"The Ice Vault",obj:"o-vault",answer:"GLORY",kind:"word",
      scene:"Every lock you crack freezes a letter tile into the vault door. Carved into the ice: <em>\"We don't play for the trophy. We play for the snow, and for the ...\"</em>",
      hints:["Champions play \"for the ___\". It's a feeling of winning big and being remembered.","It starts with G.","The answer is GLORY."]}
  },
  finale:{tag:"CHAMPIONS",titleHTML:"THE TROPHY<br><span>IS YOURS</span>",
    cardHTML:`<h3>How to Build a Champion Snow Fort</h3>Pack snow into a bucket or box, press it down hard, and tip it out like a sandcastle to make bricks. Stack them in a curve, staggering the joins, and smooth the cracks with mittens. Leave a low window for spotting the other team. Make your snowballs <b>before</b> the fight starts. No snow? Roll pairs of socks into balls and have a living-room snowball fight.<div class="note">"The Icicles want a rematch. Bring it on." The Frostbites<br><small style="font-family:Inter;font-size:11px;color:#6a7a94">Art: Google Santa Tracker, CC BY 4.0</small></div>`}
};
EXP_ORDER.push(ID);
})();
