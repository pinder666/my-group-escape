(function(){
const ID='gingerbread-village', P=`.scene[data-exp="${ID}"]`;
const A='assets/gingerbread-village/';

/* ---------- tower art (final object) ---------- */
function towerSVG(){
  const ticks=[...Array(12)].map((_,i)=>{const a=i*Math.PI/6;return `<circle cx="${(50+19*Math.sin(a)).toFixed(1)}" cy="${(100-19*Math.cos(a)).toFixed(1)}" r="${i%3?1.3:2.1}" fill="${['#ff5c8a','#3cc7a0','#ffc93c','#5b8cff'][i%4]}"/>`}).join('');
  const scal=(y,x0,x1,c='#fff')=>{let d=`M${x0} ${y}`;for(let x=x0;x<x1;x+=6)d+=` q3 7 6 0`;return `<path d="${d}V${y-3}H${x0}Z" fill="${c}"/>`};
  return `<svg viewBox="0 0 100 260" preserveAspectRatio="none" aria-hidden="true">
  <defs><clipPath id="gv-cone"><path d="M50 2 L84 64 H16Z"/></clipPath>
  <pattern id="gv-gb" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#b8692f"/><circle cx="3" cy="3" r=".7" fill="#9a5424"/><circle cx="8" cy="7" r=".6" fill="#9a5424"/></pattern></defs>
  <path d="M50 2 L84 64 H16Z" fill="#ff7fb0"/>
  <g clip-path="url(#gv-cone)">${[0,1,2,3,4,5,6].map(i=>`<path d="M${-40+i*22} 70 L${-10+i*22} 0 L${-1+i*22} 0 L${-31+i*22} 70Z" fill="#fff" opacity=".85"/>`).join('')}</g>
  <path d="M40 58 V44 a10 10 0 0 1 20 0 V58Z" fill="#3a1f3a"/>
  <g class="bell"><path d="M50 43 c-5 0 -6 4 -6 8 l-2 4 h16 l-2 -4 c0 -4 -1 -8 -6 -8Z" fill="#ffc93c" stroke="#b8862b" stroke-width=".8"/><circle cx="50" cy="56.5" r="1.8" fill="#b8862b"/></g>
  <circle cx="50" cy="3" r="4" fill="#3cc7a0"/><circle cx="48.6" cy="1.8" r="1.2" fill="#fff" opacity=".7"/>
  <rect x="20" y="62" width="60" height="198" fill="url(#gv-gb)"/>
  <rect x="20" y="62" width="5" height="198" fill="#000" opacity=".12"/><rect x="75" y="62" width="5" height="198" fill="#fff" opacity=".08"/>
  ${scal(66,14,86)}
  <circle cx="50" cy="100" r="27" fill="#ff5c8a"/><circle cx="50" cy="100" r="27" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="3 3"/>
  <circle cx="50" cy="100" r="23" fill="#fff8ec"/>${ticks}
  <g class="hands"><line class="hh" x1="50" y1="100" x2="49.9" y2="87" stroke="#3a1f1a" stroke-width="3" stroke-linecap="round"/><line class="mh" x1="50" y1="100" x2="47.9" y2="80.5" stroke="#3a1f1a" stroke-width="2" stroke-linecap="round"/></g>
  <circle cx="50" cy="100" r="2.4" fill="#ffc93c"/>
  <g class="frost"><path d="M28 112 q6 -4 12 2 q5 -5 10 1 q6 -6 11 0 q5 -3 10 -2 l-2 6 l-2 7 l-2 -6 l-3 9 l-3 -9 l-3 6 l-2 -6 l-3 10 l-3 -10 l-3 5 l-2 -5 l-3 7 l-3 -8 l-2 4Z" fill="#dff4ff" opacity=".9"/></g>
  <rect x="24" y="132" width="52" height="16" rx="5" fill="#3a1f3a" stroke="#fff" stroke-width="1.5"/>
  ${scal(158,20,80,'#ffd7e8')}
  <path d="M30 194 V176 a7 7 0 0 1 14 0 V194Z M56 194 V176 a7 7 0 0 1 14 0 V194Z" fill="#ffd36b" class="tw"/>
  <path d="M37 168 V194 M30 182 H44 M63 168 V194 M56 182 H70" stroke="#7a3d16" stroke-width="1.6"/>
  ${scal(206,20,80)}
  <path d="M36 260 V232 a14 14 0 0 1 28 0 V260Z" fill="#ff5c8a"/>
  <path d="M36 260 V232 a14 14 0 0 1 28 0 V260" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/>
  <path d="M41 260 V234 a9 9 0 0 1 18 0 V260Z" fill="#7a3d16"/><circle cx="55" cy="248" r="1.6" fill="#ffc93c"/>
  </svg>`;
}

/* ---------- lock: houses (logic) ----------
   Colours pink, mint, lemon, blue, purple in houses 1-5 (left to right).
   Cards: lemon at an end; lemon directly left of purple; mint not at an end;
   mint next to pink; blue somewhere left of pink.
   Solve: lemon at an end + purple directly to its right => lemon 1, purple 2.
   Mint not at an end => mint 3 or 4; blue left of pink and mint next to pink.
   If mint 3: pink 4 (2 is purple), blue 5 -> blue not left of pink. X.  So mint 4.
   Mint 4: pink 3 or 5. Pink 3 -> blue 5, not left of pink. X.  So pink 5, blue 3.
   => 1 lemon, 2 purple, 3 blue, 4 mint, 5 pink.  Code = pink, mint, purple = 5 4 2 = 542.
   Brute force over all 120 orders: unique, and dropping any single card gives >1 solution. */
function frostHouse(n){
  return `<div style="flex:1;text-align:center;font-size:11px;color:#c9c0dd"><svg viewBox="0 0 40 44" style="width:100%;display:block"><path d="M3 18 L20 4 L37 18Z" fill="#f4f7ff"/><path d="M3 18 q3 4 6 0 q3 4 6 0 q3 4 6 0 q3 4 6 0 q3 4 6 0 q3 4 5 0" fill="#fff"/><rect x="6" y="18" width="28" height="24" fill="#e6ecf7"/><rect x="10" y="23" width="7" height="7" fill="#ffe08a"/><rect x="23" y="23" width="7" height="7" fill="#ffe08a"/><rect x="16" y="31" width="8" height="11" fill="#c9d3e6"/><circle cx="31" cy="9" r="2" fill="#fff"/></svg><div style="margin-top:3px;height:22px;border-radius:6px;background:#2a1f3d;display:flex;align-items:center;justify-content:center;font-family:'Archivo Black';color:#ffb3d1;font-size:13px">${n}</div></div>`;
}
const sw=c=>`<i style="display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:-1px;margin-right:3px;border:1px solid #0003;background:${{pink:'#ff7fb0',mint:'#5fe0b8',lemon:'#ffe14d',blue:'#5b8cff',purple:'#a35cff'}[c]}"></i>`;

/* ---------- lock: windows (overlay / AND) ----------
   Four photos of Gumdrop Row (5 floors x 15 windows), taken a moment apart while lights blink.
   Windows lit in ALL FOUR photos (verified by node script):
     #...###.###.###
     #...#.#.#.#.#..
     #...#.#.###.##.
     #...#.#.#.#.#..
     ###.###.#.#.#..   = L O A F
   Each photo has 60-65 of 75 lit (unreadable alone). Leaving out any one photo adds 6 false windows. */
const PHOTOS=[["111111111110111","111011101111111","101011111111111","100111111011111","111111101111101"],["111011111111111","110110111111101","100111101111111","101010111110111","111111111010111"],["100111111111111","100111101111111","110010111111111","111011101111100","111011111110110"],["101111101111111","111111111010110","100010111110110","101111111111101","111111111011111"]];
function rowSVG(i){
  const ph=PHOTOS[i]; let w='';
  const roofs=['#ff7fb0','#5fe0b8','#ffe14d','#a35cff','#5b8cff'];
  for(let h=0;h<5;h++){ const x0=4+h*58.4; w+=`<path d="M${x0} 30 L${x0+29.2} 8 L${x0+58.4} 30Z" fill="${roofs[h]}"/><path d="M${x0} 30 ${[...Array(8)].map(()=>'q3.65 6 7.3 0').join(' ')}V27H${x0}Z" fill="#fff"/>`; }
  for(let r=0;r<5;r++)for(let c=0;c<15;c++){const x=10+c*19.2, y=36+r*18, on=ph[r][c]==='1';
    w+=`<rect x="${x}" y="${y}" width="12" height="13" rx="2" fill="${on?'#ffd55a':'#1d2340'}" ${on?'stroke="#fff3b0" stroke-width=".8"':''}/>`;}
  return `<svg viewBox="0 0 300 130" role="img" aria-label="Photo ${i+1} of Gumdrop Row at night" style="display:block;width:100%;height:auto;border-radius:4px;margin-top:4px"><rect width="300" height="130" fill="#141a38"/><rect x="4" y="30" width="292" height="100" fill="#b8692f"/>${[1,2,3,4].map(h=>`<rect x="${4+h*58.4-1}" y="30" width="2" height="100" fill="#8a4a20"/>`).join('')}${w}</svg>`;
}

/* ---------- lock: icing (ratio arithmetic) ----------
   Code = total spoons of WHITE, then total spoons of COLOUR.
   Pink  3 white : 1 red,    24 spoons -> 24/4=6  -> 18 white, 6 red
   Mint  5 white : 1 green,  18 spoons -> 18/6=3  -> 15 white, 3 green
   Lemon 1 white : 1 yellow, 10 spoons -> 10/2=5  ->  5 white, 5 yellow
   Blue  2 white : 1 blue,   12 spoons -> 12/3=4  ->  8 white, 4 blue
   White 18+15+5+8 = 46, colour 6+3+5+4 = 18.  Code 4618. */
const bag=c=>`<svg viewBox="0 0 24 36" style="float:right;width:22px;height:33px;margin-left:6px"><path d="M3 3 H21 L13 31 H11Z" fill="${c}" stroke="#0004"/><rect x="2" y="1" width="20" height="5" rx="2" fill="#fff" stroke="#0003"/><path d="M11 31 h2 l-1 4z" fill="#999"/></svg>`;

/* ---------- lock: gumdrops (mini-game + colour key) ----------
   Six gumdrops hidden in the village picture, left to right by x position:
   red (x9) orange (x27) yellow (x40) green (x64) blue (x100) purple (x124).
   Key: red S, orange U, yellow G, green A, blue R, purple Y (pink N and white E are decoys; there are no
   pink or white gumdrops). Left to right: S U G A R Y = SUGARY. */
const GD={red:'#ff3b3b',orange:'#ff9a1f',yellow:'#ffe11f',green:'#33d26b',blue:'#2f7bff',purple:'#a24bff'};
const gum=(x,y,c,s=1)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3.2 1.4 Q-3.4 -3.6 0 -3.6 Q3.4 -3.6 3.2 1.4Z" fill="${c}" stroke="#0005" stroke-width=".35"/><circle cx="-1.2" cy="-1.8" r=".45" fill="#fff" opacity=".85"/><circle cx=".9" cy="-.6" r=".35" fill="#fff" opacity=".75"/><circle cx="-.2" cy=".6" r=".3" fill="#fff" opacity=".7"/></g>`;
const GUMS=[{c:'red',x:9,y:79},{c:'orange',x:27,y:36.5},{c:'yellow',x:40,y:52},{c:'green',x:64,y:31},{c:'blue',x:100,y:48},{c:'purple',x:124,y:83}];
function cane(x,y,s,r=0){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 12 V0 a3 3 0 0 1 6 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M0 12 V0 a3 3 0 0 1 6 0" fill="none" stroke="#e8333a" stroke-width="1.8" stroke-dasharray="1.4 1.4" stroke-linecap="round"/></g>`}
function villageFind(){
  const im=(f,x,y,w,h)=>`<image href="${A}${f}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
  let s=`<svg viewBox="0 0 140 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The village square at night">
  <defs><linearGradient id="gv-fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1650"/><stop offset="1" stop-color="#5a3a8a"/></linearGradient></defs>
  <rect width="140" height="100" fill="url(#gv-fsky)"/>
  ${[[8,6],[22,14],[50,5],[70,12],[95,4],[118,10],[132,18],[36,20],[84,20]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r=".6" fill="#fff"/>`).join('')}
  <circle cx="122" cy="16" r="6" fill="#fff6d8"/><circle cx="125" cy="14" r="5.4" fill="#2a2266"/>
  ${im('hit-house-03.svg',0,24,46,23.2)}${im('hit-house-12.svg',46,20,40,23.4)}${im('hit-house-07.svg',88,26,50,25)}
  <path d="M0 60 Q35 52 70 58 T140 56 V100 H0Z" fill="#eef4ff"/><path d="M0 74 Q40 66 80 72 T140 70 V100 H0Z" fill="#dfe9fb"/>
  <path d="M60 100 Q66 80 72 60 L80 60 Q82 80 92 100Z" fill="#f6c9db" opacity=".6"/>
  ${im('tree.svg',30,30,17,28.6)}${im('tree.svg',104,58,13,22)}
  ${im('gingerbread-man.svg',62,54,14,21.4)}${im('penguin.svg',116,60,8,16.3)}
  ${im('snowman.svg',14,58,11,15.7)}${im('bow.svg',118,77,12,8.8)}${im('bauble.svg',4,68,6,8)}${im('holly.svg',48,64,8,9)}
  ${im('peppermint.svg',36,82,6,6)}${im('peppermint.svg',96,86,5,5)}${im('peppermint.svg',84,40,4.5,4.5)}${im('bauble.svg',134,66,5,6.7)}
  ${cane(54,78,1)}${cane(108,84,.9,15)}${cane(24,86,.8,-12)}${cane(2,40,.7)}`;
  s+=GUMS.map(g=>gum(g.x,g.y,GD[g.c],.8)).join('');
  return s+'</svg>';
}
const keyCard=(pairs)=>pairs.map(([c,l])=>`<div style="display:flex;align-items:center;gap:8px;margin:2px 0"><svg viewBox="-4 -4 8 6" style="width:30px;height:23px">${gum(0,0,c==='pink'?'#ff8fc8':c==='white'?'#f4f4f4':GD[c])}</svg><b style="font-size:15px">${c.toUpperCase()}</b><span style="margin-left:auto;font-family:'Archivo Black';font-size:20px">${l}</span></div>`).join('');

/* ---------- lock: map (route on a split map) ----------
   4x4 grid of lamp posts, columns 0-3 (west->east), rows 0-3 (north->south). Start = star at (0,3).
   N2 -> (0,1)=S ; E3 -> (3,1)=L ; S2 -> (3,3)=E ; W1 -> (2,3)=I ; N3 -> (2,0)=G ; W1 -> (1,0)=H  => SLEIGH.
   Map pieces: TL has S,H + compass, TR has L,G, BR has E,I, BL has the start star. All four needed. */
const GRID=[['T','H','G','P'],['S','A','W','L'],['N','R','K','U'],['*','O','I','E']];
const GX=[30,90,150,210], GY=[22,67,112,157];
function mapFull(){
  let s=`<rect width="240" height="180" fill="#e9f2ff"/>`;
  const hc=['#ff7fb0','#5fe0b8','#ffe14d','#a35cff','#5b8cff','#ff9a1f'];
  let k=0;
  for(let i=0;i<3;i++)for(let j=0;j<3;j++){const x=GX[i]+10,y=GY[j]+9;
    if(i===0&&j===0) continue;
    s+=`<g><path d="M${x+6} ${y+14} l12 -10 l12 10Z" fill="${hc[k%6]}"/><rect x="${x+8}" y="${y+14}" width="20" height="13" fill="#b8692f"/><rect x="${x+15}" y="${y+19}" width="6" height="8" fill="#7a3d16"/></g>`;
    s+=`<circle cx="${x+34}" cy="${y+6}" r="3" fill="#2f9e48"/>`; k++;}
  GY.forEach(y=>{s+=`<rect x="14" y="${y-5}" width="212" height="10" rx="5" fill="#d8b38a"/>`});
  GX.forEach(x=>{s+=`<rect x="${x-5}" y="6" width="10" height="168" rx="5" fill="#d8b38a"/>`});
  GY.forEach(y=>{s+=`<line x1="18" y1="${y}" x2="222" y2="${y}" stroke="#fff" stroke-width="1" stroke-dasharray="4 4"/>`});
  GX.forEach(x=>{s+=`<line x1="${x}" y1="10" x2="${x}" y2="170" stroke="#fff" stroke-width="1" stroke-dasharray="4 4"/>`});
  /* compass in top-left block */
  s+=`<g transform="translate(60 45)"><circle r="13" fill="#fff" stroke="#2a1f3d" stroke-width="1"/><path d="M0 -11 L4 0 L0 -2 L-4 0Z" fill="#e8333a"/><path d="M0 11 L4 0 L0 2 L-4 0Z" fill="#2a1f3d"/><text y="-13.5" text-anchor="middle" font-size="7" font-weight="700" fill="#e8333a" font-family="Inter,sans-serif">N</text></g>`;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const x=GX[c],y=GY[r],L=GRID[r][c];
    if(L==='*') s+=`<g transform="translate(${x} ${y})"><circle r="11" fill="#ff5c8a" stroke="#fff" stroke-width="2"/><path d="M0 -7 L2 -2 L7 -2 L3 1 L4.5 6.5 L0 3.3 L-4.5 6.5 L-3 1 L-7 -2 L-2 -2Z" fill="#ffe14d"/></g><text x="${x+14}" y="${y+12}" font-size="7" font-weight="700" fill="#7a3d16" font-family="Inter,sans-serif">BAKERY</text>`;
    else s+=`<g transform="translate(${x} ${y})"><circle r="8.5" fill="#ffd55a" stroke="#7a3d16" stroke-width="1.5"/><text y="3.6" text-anchor="middle" font-size="10" font-weight="700" fill="#3a1f1a" font-family="Inter,sans-serif">${L}</text></g>`;}
  return s;
}
const MAPC=mapFull();
const mapPiece=i=>{const ox=[0,120,0,120][i], oy=[0,0,90,90][i];return `<svg viewBox="${ox} ${oy} 120 90" role="img" aria-label="Village map piece ${i+1}">${MAPC}</svg>`};

EXPERIENCES[ID]={
  id:ID, title:"The Gingerbread Village", titleHTML:"THE GINGERBREAD<br><span>VILLAGE</span>", season:"Christmas", collection:'christmas',
  tag:"A Christmas Eve escape room",
  blurb:"The bakery clock tower froze at 11:59, and Christmas can't start until it strikes midnight. Search the gingerbread village, crack six sugary locks, and get those hands moving.",
  menuBlurb:"The village clock froze at 11:59. Restart the tower so Christmas can begin.",
  menuLine:"Make midnight strike",
  theme:{accent:'#ffb3d1',accent2:'#ffe08a',bg:'#0b0a1a',introBg:'#2a1240',door:'#9a5424',doorFrame:'#f4eefc',boxColor:'linear-gradient(#c97a3c,#8a4a20)'},
  sceneCSS:`
${P}{background:#120f30}
${P} .sky{position:absolute;inset:0;background:linear-gradient(#0d0b2e 0%,#231a5a 35%,#4a2f7a 58%,#6a3f86 62%)}
${P} .star{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff;animation:twinkle 2.6s infinite}
${P} .moon{position:absolute;right:7%;top:4%;width:11%;aspect-ratio:1;border-radius:50%;background:#fff6d8;box-shadow:0 0 22px #fff6d877}
${P} .moon::after{content:"";position:absolute;left:30%;top:-8%;width:90%;height:90%;border-radius:50%;background:#171140}
${P} .bh{position:absolute;filter:brightness(.62) saturate(.9)}
${P} .hill{position:absolute;left:-10%;right:-10%;top:52%;height:20%;border-radius:50%;background:#cfdcf3}
${P} .ground{position:absolute;left:0;right:0;top:58%;bottom:0;background:linear-gradient(#eef4ff,#dbe6fa 60%,#c9d7f2)}
${P} .path{position:absolute;left:36%;width:28%;top:58%;bottom:0;background:repeating-linear-gradient(0deg,#f6c9db 0 14px,#ffd9e7 14px 16px);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);opacity:.85}
${P} .edge{position:absolute;top:58%;bottom:0;width:2%;background:repeating-linear-gradient(0deg,#e8333a 0 8px,#fff 8px 16px)}
/* tower */
${P} #o-tower{left:33%;top:2.5%;width:34%;height:60%;filter:drop-shadow(0 0 10px rgba(255,140,190,.35))}
${P} #o-tower svg{position:absolute;inset:0;width:100%;height:100%}
${P} #o-tower .bell{transform-origin:50px 43px;animation:${ID}-bell 3s ease-in-out infinite}
${P} #o-tower .hands line{transition:transform 1.2s cubic-bezier(.4,1.6,.5,1);transform-origin:50px 100px}
${P} #o-tower.solved .hh{transform:rotate(1deg)} ${P} #o-tower.solved .mh{transform:rotate(6deg)}
${P} #o-tower .frost{transition:opacity 1s}
${P} #o-tower.solved .frost{opacity:0}
${P} #o-tower .tw{animation:${ID}-glow 3.4s ease-in-out infinite}
${P} #o-tower .lights{position:absolute;left:27%;right:27%;top:51.5%;height:4.6%;display:flex;justify-content:space-between;align-items:center}
${P} #o-tower .lights b{width:12%;aspect-ratio:1;border-radius:50%;background:#5a3a5a;box-shadow:inset 0 0 0 1px #000}
${P} #o-tower .lights b.on{background:#ffe14d;box-shadow:0 0 7px #ffe14d,0 0 2px #fff inset}
/* houses */
${P} .house{position:absolute;display:block}
${P} #o-houses{left:-4%;top:41%;width:41%;height:19.2%}
${P} #o-houses img{position:absolute;inset:0;width:100%;height:100%}
${P} #o-houses .plaque{position:absolute;left:43%;top:46.5%;width:14%;height:12.5%;border-radius:4px;background:#f4f7ff;box-shadow:0 2px 0 #b9c6e0,inset 0 -3px 0 #dfe7f6;display:flex;align-items:center;justify-content:center;font:400 12px 'Archivo Black',sans-serif;color:#9aa8c8}
${P} #o-houses .plaque .n{display:none;font-size:9px;color:#fff}
${P} #o-houses.thawed .plaque{background:#ff7fb0;box-shadow:0 0 10px #ff7fb0}
${P} #o-houses.thawed .plaque::before{opacity:0}
${P} #o-houses.thawed .q{display:none} ${P} #o-houses.thawed .n{display:block}
${P} #o-houses .plaque::before{content:"";position:absolute;left:-10%;right:-10%;top:-22%;height:34%;border-radius:50% 50% 30% 30%;background:#fff}
${P} #o-windows{right:-4%;top:39%;width:41%;height:21.3%}
${P} #o-windows img{position:absolute;inset:0;width:100%;height:100%}
${P} #o-windows.steady .win{animation:none;opacity:1}
${P} .win{position:absolute;background:#ffe27a;box-shadow:0 0 8px #ffd34d;animation:${ID}-blink 4s steps(1) infinite}
/* smoke */
${P} .smoke{position:absolute;width:5%;aspect-ratio:1;border-radius:50%;background:rgba(240,240,255,.75);filter:blur(1px);animation:${ID}-smoke 4.5s ease-out infinite;pointer-events:none}
/* lamp */
${P} .lamp{position:absolute;left:1.5%;top:45%;width:8%;height:40%;z-index:3;pointer-events:none}
${P} .lamp .pole{position:absolute;left:38%;width:24%;top:14%;bottom:0;border-radius:3px;background:repeating-linear-gradient(-35deg,#e8333a 0 7px,#fff 7px 14px)}
${P} .lamp .hook{position:absolute;left:38%;top:5%;width:70%;height:14%;border:4px solid #e8333a;border-bottom:0;border-left-color:#fff;border-radius:20px 20px 0 0}
${P} .lamp .bulb{position:absolute;left:85%;top:15%;width:50%;aspect-ratio:1;border-radius:50% 50% 45% 45%;background:radial-gradient(#fffbe0,#ffd34d 60%);box-shadow:0 0 16px 6px rgba(255,214,90,.55);animation:flicker 3s infinite}
${P} .lamp .halo{position:absolute;left:10%;top:-10%;width:220%;aspect-ratio:1;border-radius:50%;background:radial-gradient(rgba(255,220,120,.35),transparent 65%);animation:${ID}-glow 3s ease-in-out infinite}
${P} .lamp .holly{position:absolute;left:24%;top:44%;width:54%}
/* gingerbread person */
${P} .gbm{position:absolute;left:43%;top:61%;height:15.5%;z-index:2;transform-origin:50% 100%;animation:${ID}-wave 1.6s ease-in-out infinite;pointer-events:none;filter:drop-shadow(0 4px 3px rgba(0,0,0,.25))}
/* map board (wave 2) */
${P} #o-map{left:10%;top:62%;width:27%;height:19%}
${P} #o-map .post{position:absolute;bottom:0;width:8%;height:40%;background:linear-gradient(90deg,#7a3d16,#9a5424)}
${P} #o-map .board{position:absolute;left:0;right:0;top:4%;height:64%;border-radius:4px;background:#9a5424;box-shadow:0 4px 8px rgba(0,0,0,.35);padding:5%}
${P} #o-map .paper{position:absolute;inset:9% 7%;background:#e9f2ff;border-radius:2px;overflow:hidden}
${P} #o-map .paper svg{width:100%;height:100%;display:block}
${P} #o-map .drift{position:absolute;left:-6%;right:-6%;top:-4%;height:78%;border-radius:40% 40% 18% 18%;background:linear-gradient(#fff,#e2ebfa);box-shadow:inset 0 -4px 0 #cbd8ef;transition:transform 1.3s cubic-bezier(.6,.05,.3,1),opacity 1.3s;transform-origin:50% 100%}
${P} #o-map.revealed .drift{transform:translateY(70%) scaleY(.2);opacity:0}
/* gumdrop stall (wave 2) */
${P} #o-gumdrops{right:2%;top:61%;width:33%;height:25%}
${P} #o-gumdrops .awn{position:absolute;left:-4%;right:-4%;top:0;height:22%;background:repeating-linear-gradient(90deg,#ff5c8a 0 12px,#fff 12px 24px);border-radius:4px 4px 0 0;box-shadow:0 3px 0 rgba(0,0,0,.15)}
${P} #o-gumdrops .awn::after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:8px;background:radial-gradient(circle at 6px 0,#ff5c8a 5px,transparent 5.5px) 0 0/12px 8px repeat-x}
${P} #o-gumdrops .box{position:absolute;left:4%;right:4%;top:22%;bottom:0;background:linear-gradient(#a35cff,#7a3cd0);border-radius:0 0 4px 4px;box-shadow:0 5px 10px rgba(0,0,0,.3)}
${P} #o-gumdrops .gw{position:absolute;left:12%;right:12%;top:30%;height:44%;background:#2a1650;border-radius:3px;overflow:hidden}
${P} #o-gumdrops .jar{position:absolute;left:30%;width:40%;bottom:0;height:88%;border-radius:20% 20% 12% 12%;background:linear-gradient(90deg,rgba(255,255,255,.25),rgba(255,255,255,.08));border:2px solid rgba(255,255,255,.6)}
${P} #o-gumdrops .jar i{position:absolute;width:26%;height:20%;border-radius:50% 50% 12% 12%;opacity:0;transform:translateY(-200%);transition:.5s cubic-bezier(.3,1.5,.5,1)}
${P} #o-gumdrops.filled .jar i{opacity:1;transform:none}
${P} #o-gumdrops .shutter{position:absolute;left:12%;right:12%;top:30%;height:44%;background:repeating-linear-gradient(#9aa0b8 0 4px,#7a8098 4px 6px);border-radius:3px;transition:transform 1.2s cubic-bezier(.6,.05,.3,1);transform-origin:50% 0}
${P} #o-gumdrops .shutter::after{content:"";position:absolute;left:42%;bottom:6%;width:16%;height:22%;background:#ffc93c;border-radius:2px}
${P} #o-gumdrops.revealed .shutter{transform:scaleY(.06)}
${P} #o-gumdrops .snowcap{position:absolute;left:-6%;right:-6%;top:-7%;height:12%;background:#fff;border-radius:50% 50% 30% 30%}
/* icing cart */
${P} #o-icing{left:27%;top:80%;width:46%;height:17%}
${P} #o-icing .top{position:absolute;left:0;right:0;top:44%;height:16%;background:linear-gradient(#ffd7e8,#f4a8c8);border-radius:4px;box-shadow:0 4px 6px rgba(0,0,0,.25)}
${P} #o-icing .front{position:absolute;left:4%;right:4%;top:58%;bottom:0;background:repeating-linear-gradient(90deg,#b8692f 0 14px,#a65d28 14px 28px);border-radius:0 0 4px 4px}
${P} #o-icing .bowl{position:absolute;left:34%;width:32%;top:6%;height:42%;border-radius:0 0 50% 50%/0 0 90% 90%;background:linear-gradient(#e8eef8,#a9b6cc)}
${P} #o-icing .bowl::before{content:"";position:absolute;left:4%;right:4%;top:-14%;height:36%;border-radius:50%;background:#fff;box-shadow:inset 0 -2px 0 #e6e9f2}
${P} #o-icing .spoon{position:absolute;left:52%;top:-18%;width:4%;height:40%;background:#d7d7de;border-radius:3px;transform:rotate(24deg);animation:${ID}-stir 2.4s ease-in-out infinite;transform-origin:50% 100%}
${P} #o-icing.done .bowl::before{background:radial-gradient(circle at 30% 50%,#ff7fb0 0 18%,transparent 19%),radial-gradient(circle at 50% 50%,#5fe0b8 0 14%,transparent 15%),radial-gradient(circle at 70% 50%,#ffe14d 0 16%,transparent 17%),#fff}
${P} #o-icing.done .spoon{animation-duration:.6s}
${P} #o-icing .pb{position:absolute;top:2%;width:9%;height:44%;clip-path:polygon(0 0,100% 0,60% 100%,40% 100%);border-radius:2px}
/* snow */
${P} .flake{position:absolute;top:-4%;width:4px;height:4px;border-radius:50%;background:#fff;opacity:.85;animation:${ID}-snow linear infinite;z-index:4;pointer-events:none}
${P} .deco{position:absolute;pointer-events:none}
@keyframes ${ID}-snow{to{transform:translate(14px,2700%)}}
@keyframes ${ID}-blink{0%{opacity:1}30%{opacity:.08}55%{opacity:1}80%{opacity:.08}}
@keyframes ${ID}-smoke{0%{transform:translate(0,0) scale(.5);opacity:0}15%{opacity:.8}100%{transform:translate(18px,-260%) scale(1.8);opacity:0}}
@keyframes ${ID}-glow{0%,100%{opacity:.65}50%{opacity:1}}
@keyframes ${ID}-wave{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) translateY(-3px)}}
@keyframes ${ID}-bell{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes ${ID}-stir{0%,100%{transform:rotate(14deg)}50%{transform:rotate(38deg)}}
`,
  sceneHTML:`
<div class="sky"></div>
${[[6,6],[18,13],[28,4],[74,15],[86,24],[12,24],[93,32],[70,4],[4,36],[24,30],[80,38]].map(([l,t],i)=>`<div class="star" style="left:${l}%;top:${t}%;animation-delay:${(i*.37).toFixed(2)}s"></div>`).join('')}
<div class="moon"></div>
<img class="bh" src="${A}hit-house-24.svg" alt="" style="left:3%;top:29%;width:27%">
<img class="bh" src="${A}hit-house-12.svg" alt="" style="right:3%;top:30%;width:28%">
<div class="hill"></div>
<button class="obj" id="o-tower" aria-label="Bakery clock tower">${towerSVG()}<div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<div class="ground"></div><div class="path"></div><div class="edge" style="left:36%"></div><div class="edge" style="left:62%"></div>
<div class="smoke" style="left:2%;top:38%"></div><div class="smoke" style="left:2.5%;top:38%;animation-delay:-2.2s"></div>
<div class="smoke" style="left:91.5%;top:36%;animation-delay:-1.1s"></div><div class="smoke" style="left:92%;top:36%;animation-delay:-3.4s"></div>
<div class="smoke" style="left:71%;top:39.5%;animation-delay:-.6s;width:4%"></div>
<button class="obj" id="o-houses" aria-label="Snowed-over house with a blank number plate"><img src="${A}hit-house-08.svg" alt=""><div class="win" style="left:42.5%;top:58.5%;width:15%;height:9.2%;animation-delay:-1.3s"></div><div class="plaque"><span class="q">?</span><span class="n">542</span></div><span class="spark"></span></button>
<button class="obj" id="o-windows" aria-label="Tall house with blinking windows"><img src="${A}hit-house-11.svg" alt="">${[65,103,165,203,265,303].map((x,i)=>`<div class="win" style="left:${(x/4).toFixed(2)}%;top:61.7%;width:8%;height:20.7%;animation-delay:-${[0,2.1,1.2,3.1,.6,2.6][i]}s;animation-duration:${[4,3.4,4.6,3.8,5,4.2][i]}s"></div>`).join('')}<span class="spark"></span></button>
<div class="lamp"><div class="halo"></div><div class="hook"></div><div class="bulb"></div><div class="pole"></div><img class="holly" src="${A}holly.svg" alt=""></div>
<button class="obj" id="o-map" aria-label="Village notice board"><div class="post" style="left:12%"></div><div class="post" style="right:12%"></div><div class="board"><div class="paper"><svg viewBox="0 0 240 180" preserveAspectRatio="none">${MAPC}</svg></div></div><div class="drift"></div><span class="spark"></span></button>
<img class="gbm" src="${A}gingerbread-man.svg" alt="">
<button class="obj" id="o-gumdrops" aria-label="Sweet stall"><div class="box"></div><div class="gw"><div class="jar">${[['#ff3b3b',8,62],['#ff9a1f',40,66],['#ffe11f',70,60],['#33d26b',20,38],['#2f7bff',54,36],['#a24bff',36,12]].map(([c,l,t])=>`<i style="left:${l}%;top:${t}%;background:${c}"></i>`).join('')}</div></div><div class="shutter"></div><div class="awn"></div><div class="snowcap"></div><span class="spark"></span></button>
<button class="obj" id="o-icing" aria-label="Icing cart"><div class="bowl"><div class="spoon"></div></div>${[['#ff7fb0',6],['#5fe0b8',17],['#ffe14d',74],['#5b8cff',85]].map(([c,l])=>`<div class="pb" style="left:${l}%;background:${c}"></div>`).join('')}<div class="top"></div><div class="front"></div><span class="spark"></span></button>
<img class="deco" src="${A}penguin.svg" alt="" style="left:2%;top:86%;height:12%;animation:bob 3s ease-in-out infinite">
<img class="deco" src="${A}tree.svg" alt="" style="right:2%;top:85%;height:14%">
<img class="deco" src="${A}peppermint.svg" alt="" style="left:76%;top:91%;width:6%">
${[[5,0,6.2],[16,2.5,7.4],[27,1.1,5.8],[39,3.9,8],[50,.4,6.6],[61,2,7.1],[72,3.2,6],[83,1.6,7.7],[94,.8,6.4],[10,4.4,8.2],[45,5,7],[88,5.5,6.8]].map(([l,d,s])=>`<div class="flake" style="left:${l}%;animation-duration:${s}s;animation-delay:-${d}s"></div>`).join('')}`,
  order:["houses","windows","icing","gumdrops","map","tower"],
  revealOnWave2:[{sel:'#o-map',cls:'revealed'},{sel:'#o-gumdrops',cls:'revealed'}],
  wave2Toast:"The snow just slid off the notice board, and the sweet stall's shutter rolled up.",
  finalReadyToast:"Five letters in the tower. The clock is twitching.",
  startToast:"Tap anything that sparkles. The clock says 11:59 and it's stuck there.",
  locks:{
    houses:{wave:1,title:"The Frosted Houses",obj:"o-houses",answer:"542",kind:"num",tile:"M",onSolve:[{sel:'#o-houses',cls:'thawed'}],
      scene:"A blizzard frosted every house on Gumdrop Lane white, number plates and all. Mr. Crumb the clockmaker left a note: <em>\"Tower code = the house numbers of the PINK house, then the MINT house, then the PURPLE house.\"</em> The neighbours remember the colours.",
      extra:`<div style="display:flex;gap:6px">${[1,2,3,4,5].map(frostHouse).join('')}</div><p class="scene-txt" style="margin:10px 0 0">Colours: ${['pink','mint','lemon','blue','purple'].map(c=>sw(c)+c).join(', ')}. Every house is a different colour. "Left" means as you see them here.</p>`,
      cards:[`${sw('lemon')}The <b>lemon</b> house is at one end of the lane.`,`${sw('purple')}The <b>purple</b> house is right next door to the lemon house, on its right.`,`${sw('mint')}The <b>mint</b> house is not at either end.`,`${sw('pink')}The <b>pink</b> house and the mint house are next door to each other.`,`${sw('blue')}The <b>blue</b> house is somewhere to the left of the pink house.`],
      hints:["Start with lemon and purple: lemon is at an end and purple is just to its right. Which end must lemon be at?","Lemon 1, purple 2. Mint can't be at an end, and blue must be left of pink. Try mint in 3, then in 4.","1 lemon, 2 purple, 3 blue, 4 mint, 5 pink. Pink 5, mint 4, purple 2: the code is 542."]},
    windows:{wave:1,title:"The Blinking Windows",obj:"o-windows",answer:"LOAF",kind:"word",tile:"E",wideCards:true,onSolve:[{sel:'#o-windows',cls:'steady'}],
      scene:"Baker Bun took four photos of Gumdrop Row a second apart, while the lights blinked on and off. On the back: <em>\"Most lights here blink. The ones that spell my secret word never go out.\"</em>",
      cardClass:"dark",
      cards:PHOTOS.map((_,i)=>`<b>Photo ${i+1}</b>${rowSVG(i)}`),
      hints:["Compare the photos window by window. Which windows are lit in every single photo?","Cross out any window that is dark in even one photo. The ones left make four letters, one under each pair of houses.","The always-lit windows spell LOAF."]},
    icing:{wave:1,title:"The Icing Recipe",obj:"o-icing",answer:"4618",kind:"num",tile:"H",onSolve:[{sel:'#o-icing',cls:'done'}],
      scene:"The clock face cracked in the frost and needs patching with four colours of icing. The cart's lid is padlocked: <em>\"Code = how many spoons of WHITE icing you need altogether, then how many spoons of COLOUR altogether.\"</em>",
      cards:[`${bag('#ff7fb0')}<b>Pink:</b> 3 spoons of white for every 1 spoon of red. The clock needs <b>24 spoons</b> of pink.`,`${bag('#5fe0b8')}<b>Mint:</b> 5 spoons of white for every 1 spoon of green. The clock needs <b>18 spoons</b> of mint.`,`${bag('#ffe14d')}<b>Lemon:</b> 1 spoon of white for every 1 spoon of yellow. The clock needs <b>10 spoons</b> of lemon.`,`${bag('#5b8cff')}<b>Blue:</b> 2 spoons of white for every 1 spoon of blue. The clock needs <b>12 spoons</b> of blue.`],
      hints:["Pink is made in batches of 4 spoons (3 white + 1 red). How many batches make 24?","Pink: 6 batches = 18 white, 6 red. Mint: 15 white, 3 green. Lemon: 5 and 5. Blue: 8 and 4. Now add up.","White 18+15+5+8 = 46. Colour 6+3+5+4 = 18. The code is 4618."]},
    gumdrops:{wave:2,title:"The Missing Gumdrops",obj:"o-gumdrops",answer:"SUGARY",kind:"word",tile:"C",onSolve:[{sel:'#o-gumdrops',cls:'filled'}],
      lockedMsg:"The sweet stall's shutter is frozen shut. Crack two of the first locks to thaw it.",
      scene:"The gumdrop jar is empty! Somebody scattered the gumdrops all over the square. Find all six, then use the stall's colour key on each gumdrop, reading them <b>from left to right</b> across the picture.",
      game:{type:'find',title:'Find the 6 lost gumdrops',aspect:'1.4',scene:villageFind,targets:GUMS.map(g=>({x:+(g.x/1.4).toFixed(1),y:g.y,r:4.4,name:g.c+' gumdrop'})),reveal:`All six found! Here they are, left to right:<br><b>${GUMS.map(g=>`<svg viewBox="-4 -4 8 6" style="width:34px;height:26px;vertical-align:middle">${gum(0,0,GD[g.c])}</svg>`).join('')}</b>`},
      cards:[keyCard([['red','S'],['white','E']]),keyCard([['orange','U'],['pink','N']]),keyCard([['yellow','G'],['green','A']]),keyCard([['blue','R'],['purple','Y']])],
      hints:["Find all six gumdrops first. They're the little sugar-dusted domes, not the peppermints or candy canes.","From the left: red in the snow, orange on a roof, yellow in the tree. Look each colour up on the key cards.","Red S, orange U, yellow G, green A, blue R, purple Y. The answer is SUGARY."]},
    map:{wave:2,title:"The Lamplighter's Route",obj:"o-map",answer:"SLEIGH",kind:"word",tile:"I",splitArt:true,
      lockedMsg:"The notice board is buried under a snowdrift. Crack two of the first locks to dig it out.",
      scene:"Under the snow: a village map torn into four, and the lamplighter's route in pieces. Walk it on the map. Up the map is north.",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1.5,1.2,1,-1.2][i]}deg;animation-delay:${i*.08}s;background:#f4ead2"><span class="ph">PHONE ${i+1}</span>${mapPiece(i)}</div>`).join('')}</div>`,
      cards:["<b>Route, part 1 of 3:</b> Start at the bakery's star. Walk <b>2 blocks north</b>. Then <b>3 blocks east</b>.","<b>Route, part 2 of 3:</b> Walk <b>2 blocks south</b>. Then <b>1 block west</b>.","<b>Route, part 3 of 3:</b> Walk <b>3 blocks north</b>. Last, <b>1 block west</b>.","Lamplighter's rule: a block is from one lamp post to the next. Each time you <b>stop to turn</b> (and at the very end), write down the letter on that lamp."],
      hints:["Put the four map pieces together first. The star is bottom left. North is up.","From the star, 2 north lands on S. Then 3 east lands on L. Keep going.","S, L, E, I, G, H. The answer is SLEIGH."]},
    /* Final: tiles M,E,H,C,I -> CHIME (only common-word anagram; MICHE is obscure). */
    tower:{wave:3,title:"The Clock Tower",obj:"o-tower",answer:"CHIME",kind:"word",
      scene:"Every lock you crack drops a sugar letter into the tower's slots. Carved over the clock: <em>\"Tell the bell what to do at midnight, and the hands will move.\"</em>",
      wrongMessages:{MICHE:"That's not what a bell does. Try again.",BELLS:"Close! But use only the five tiles."},
      hints:["It's what a clock's bell does when the hour strikes.","It's a five-letter word that starts with C. Ding dong!","The answer is CHIME."]}
  },
  finale:{tag:"MIDNIGHT",titleHTML:"CHRISTMAS<br><span>HAS BEGUN</span>",
    cardHTML:`<h3>Gingerbread Village Icing</h3>Whisk 1 pasteurised egg white (or 2 tbsp aquafaba) with 1 cup of icing sugar and a squeeze of lemon until thick and glossy. Split into bowls and tint pink, mint, lemon and blue. Pipe windows, roofs and snow on your gingerbread houses, then let them set overnight.<div class="note">"Bong! Twelve chimes, and the whole village cheered. Merry Christmas from Gumdrop Lane." <br><small style="font-family:Inter;font-size:11px;color:#8a6a4a">Art: Google Santa Tracker, CC BY 4.0</small></div>`}
};
EXP_ORDER.push(ID);
})();
