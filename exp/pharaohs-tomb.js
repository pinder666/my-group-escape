(function(){
const ID='pharaohs-tomb', P=`.scene[data-exp="${ID}"]`;

/* ---------- invented glyph alphabet (no real hieroglyph meanings) ---------- */
const GL={
  S:'<path d="M3 10 Q10 2 17 10 Q10 18 3 10Z"/><circle cx="10" cy="10" r="2.2" class="f"/>',
  A:'<path d="M3 6 q3.5 -3 7 0 t7 0 M3 11 q3.5 -3 7 0 t7 0 M3 16 q3.5 -3 7 0 t7 0"/>',
  R:'<path d="M10 2 V18 M10 5 l-5 3 M10 9 l-5 3 M10 13 l-5 3 M10 5 l5 3 M10 9 l5 3"/>',
  T:'<path d="M6 3 V17 M14 3 V17 M3 10 H17"/>',
  P:'<path d="M2 14 L6 6 L10 14 L14 6 L18 14"/>',
  H:'<circle cx="10" cy="10" r="7"/><path d="M10 3 V17 M3 10 H17"/>',
  E:'<path d="M3 17 V9 Q10 1 17 9 V17"/>',
  O:'<rect x="3" y="3" width="14" height="14"/><path d="M3 3 L17 17"/>',
  I:'<path d="M3 17 L10 3 L17 17Z"/><circle cx="10" cy="12" r="1.8" class="f"/>',
  N:'<path d="M13 3 A7.5 7.5 0 1 0 13 17 A6 6 0 1 1 13 3Z" class="f"/>',
  M:'<path d="M4 4 V12 Q10 18 16 12 V4 M10 4 V14"/>',
  U:'<circle cx="10" cy="10" r="7"/><circle cx="10" cy="10" r="2.6"/>',
  X:'<path d="M10 10 m0 -1 a1 1 0 1 1 -1 1 a3 3 0 0 1 3 -3 a5 5 0 0 1 5 5 a7 7 0 0 1 -7 7"/>',
  D:'<path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8Z"/>',
  K:'<path d="M6 3 V13 Q6 18 11 18 Q16 18 16 13"/><circle cx="16" cy="11" r="1.6" class="f"/>',
  L:'<path d="M3 15 Q3 4 10 4 Q17 4 17 10 Q17 15 11 15 Q7 15 7 11"/>'};
const glyph=(ch,s=34,col='#3a2410')=>`<svg viewBox="0 0 20 20" style="width:${s}px;height:${s}px;flex:none"><g fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="--f:${col}">${GL[ch].replace(/class="f"/g,`fill="${col}" stroke="none"`)}</g></svg>`;
const keyCard=pairs=>`<div style="display:grid;grid-template-columns:auto auto;gap:4px 8px;justify-content:center;align-items:center">${pairs.split('').map(ch=>`${glyph(ch,30)}<b style="font-family:'Archivo Black';font-size:18px">= ${ch}</b>`).join('')}</div>`;

/* ---------- scarab frieze (count heads pointing right) ---------- */
const FRIEZE=[
  [[18,22,'R'],[56,18,'L'],[96,24,'R'],[32,60,'U'],[70,56,'R'],[104,66,'L']],
  [[16,20,'L'],[52,26,'R'],[90,16,'D'],[22,62,'R'],[60,64,'L'],[96,52,'L'],[104,78,'R']],
  [[20,18,'R'],[58,22,'R'],[98,18,'U'],[18,58,'L'],[54,62,'R'],[86,58,'D'],[106,40,'R']],
  [[22,24,'L'],[62,20,'U'],[100,28,'R'],[34,64,'L'],[82,66,'R']]];
const ROT={R:0,D:90,L:180,U:270};
function scarab(x,y,d){return `<g transform="translate(${x} ${y}) rotate(${ROT[d]})"><g stroke="#5a3a12" stroke-width="1.2"><path d="M-4 -5 l-3 -3 M0 -5 l0 -4 M4 -5 l3 -3 M-4 5 l-3 3 M0 5 l0 4 M4 5 l3 3"/></g><ellipse cx="-2" cy="0" rx="7" ry="5.5" fill="#d9a63a" stroke="#6b4512" stroke-width="1"/><path d="M-2 -5.5 V5.5" stroke="#6b4512" stroke-width=".8"/><circle cx="7" cy="0" r="3" fill="#3fa79a" stroke="#1d5a52" stroke-width=".8"/><path d="M9.5 -1.5 l2.5 -2 M9.5 1.5 l2.5 2" stroke="#1d5a52" stroke-width="1"/></g>`}
function friezeSVG(i){return `<svg viewBox="0 0 120 104" role="img" aria-label="Frieze stone ${i+1}"><rect width="120" height="90" fill="#cf9f5e"/><rect x="2" y="2" width="116" height="86" fill="none" stroke="#9a6a32" stroke-width="2"/><path d="M0 44 H120" stroke="#b5844a" stroke-width="1" stroke-dasharray="4 3"/>${FRIEZE[i].map(s=>scarab(...s)).join('')}<rect y="90" width="120" height="14" fill="#5a3a12"/><text x="5" y="100" font-size="7" font-weight="700" fill="#f2d595" font-family="Arial">SARCOPHAGUS</text><path d="M66 97 H112 M106 93 L112 97 L106 101" stroke="#f2d595" stroke-width="1.8" fill="none"/></svg>`}

/* ---------- maze (8x8 perfect maze, seed 51; walls listed between cell indices) ---------- */
const MW=new Set("0-1 1-2 4-12 5-6 6-14 8-9 10-11 10-18 11-19 12-13 13-14 15-23 16-17 17-25 18-19 18-26 20-21 20-28 21-22 24-25 26-34 27-28 27-35 28-29 29-30 30-31 30-38 32-33 33-34 34-42 35-43 36-37 37-45 38-46 40-48 41-42 41-49 43-51 44-52 45-46 47-55 50-51 50-58 52-53 53-54 53-61 54-55 56-57 59-60".split(' '));
const MLET={40:'C',26:'O',11:'B',21:'R',39:'A',2:'S',15:'T',49:'E',58:'K',52:'N',31:'D'};
function mazePiece(q){const r0=q>1?4:0,c0=q%2?4:0,S=14,o=4;let g='';
  const wall=(a,b)=>MW.has(a<b?a+'-'+b:b+'-'+a);
  for(let r=r0;r<r0+4;r++)for(let c=c0;c<c0+4;c++){const i=r*8+c,x=o+(c-c0)*S,y=o+(r-r0)*S;
    if(MLET[i])g+=`<text x="${x+S/2}" y="${y+S/2+4}" text-anchor="middle" font-size="10" font-weight="700" fill="#0f4f49" font-family="Archivo Black,Arial">${MLET[i]}</text>`;
    // right wall
    if(c<7?wall(i,i+1):true)g+=`<path d="M${x+S} ${y}V${y+S}"/>`;
    if(r<7?wall(i,i+8):!(i===63))g+=`<path d="M${x} ${y+S}H${x+S}"/>`;
    if(c===c0)g+=(c===0||wall(i-1,i))?`<path d="M${x} ${y}V${y+S}"/>`:'';
    if(r===r0)g+=(r===0?i!==0:wall(i-8,i))?`<path d="M${x} ${y}H${x+S}"/>`:'';
  }
  const lab=['TOP LEFT','TOP RIGHT','BOTTOM LEFT','BOTTOM RIGHT'][q];
  let extra='';
  if(q===0)extra=`<path d="M${o+S/2} -1 V${o+3} M${o+S/2-3} ${o} L${o+S/2} ${o+3.5} L${o+S/2+3} ${o}" stroke="#b5482e" stroke-width="1.6" fill="none"/>`;
  if(q===3)extra=`<rect x="${o+3*S+2}" y="${o+4*S-1}" width="${S-4}" height="5" rx="2" fill="#d9a63a" stroke="#6b4512" stroke-width=".8"/>`;
  return `<svg viewBox="0 0 64 70" role="img" aria-label="Map piece ${lab}"><rect width="64" height="70" fill="#e6c98e"/><g stroke="#3a2410" stroke-width="1.8" stroke-linecap="square" fill="none">${g}</g>${extra}<text x="32" y="68" text-anchor="middle" font-size="5.5" fill="#7a5226" font-weight="700" letter-spacing=".5">${lab}</text></svg>`}

/* ---------- amulets (spot the fake in each row) ---------- */
const AM={
  eye:f=>`<path d="M2 12 Q12 2 22 12 Q12 22 2 12Z" fill="#3fa79a" stroke="#1d5a52"/><circle cx="12" cy="12" r="3.5" fill="#1a2a28"/>${f?'':'<path d="M9 17 l-2 5" stroke="#1d5a52" stroke-width="1.6"/>'}`,
  sun:f=>`<circle cx="12" cy="12" r="5" fill="#f5c542" stroke="#8a6420"/>${[0,45,90,135,180,225,270,315].slice(0,f?7:8).map(a=>`<rect x="11" y="1.5" width="2" height="4" fill="#d69a2a" transform="rotate(${a} 12 12)"/>`).join('')}`,
  feather:f=>`<path d="M12 2 Q18 10 12 22 Q6 10 12 2Z" fill="#7ee8dc" stroke="#1d5a52"/><path d="M12 4 V21 ${f?'M12 9 l3 -2 M12 13 l3 -2':'M12 9 l3 -2 M12 13 l3 -2 M12 17 l3 -2'}" stroke="#1d5a52" stroke-width="1"/>`,
  pot:f=>`<path d="M7 4 H17 L15 8 Q20 13 15 21 H9 Q4 13 9 8Z" fill="#c8693a" stroke="#6b2a12"/><path d="M8 13 H16" stroke="#f5c542" stroke-width="1.6"/>${f?'<circle cx="12" cy="17" r="1.4" fill="#f5c542"/>':''}`,
  cat:f=>`<path d="M7 22 V11 L5 3 L9 7 H15 L19 3 L17 11 V22Z" fill="#2a2235" stroke="#000"/><circle cx="${f?10:10}" cy="11" r="1.2" fill="#f5c542"/><circle cx="14" cy="11" r="1.2" fill="#f5c542"/>${f?'':'<path d="M12 18 V22" stroke="#f5c542" stroke-width="1.2"/>'}`};
function amuletRow(kind,letters,fake){return `<div style="display:flex;justify-content:space-around">${letters.split('').map((ch,i)=>`<div style="text-align:center"><svg viewBox="0 0 24 24" style="width:44px;height:44px;display:block">${AM[kind](i===fake)}</svg><b style="font-size:13px">${ch}</b></div>`).join('')}</div>`}

/* ---------- number pyramid tablet art ---------- */
function pyramidArt(){const rows=[[0],[0,1],[0,1,2],[0,1,2,3]],val={'1-1':'','3-0':'7','3-2':'6'};let g='';
  rows.forEach((row,r)=>row.forEach(c=>{const w=46,x=110-(r+1)*w/2+c*w,y=8+r*34;g+=`<rect x="${x+1}" y="${y}" width="${w-2}" height="32" rx="2" fill="#d9b07a" stroke="#7a5226" stroke-width="1.5"/><text x="${x+w/2}" y="${y+22}" text-anchor="middle" font-family="Archivo Black,Arial" font-size="16" fill="#3a2410">${val[r+'-'+c]||'?'}</text>`}));
  return `<svg viewBox="0 0 220 148" role="img" aria-label="Number pyramid"><rect width="220" height="148" rx="8" fill="#2a1a0c"/>${g}</svg>`}

EXPERIENCES[ID]={
  id:ID, title:"The Pharaoh's Tomb", titleHTML:"THE PHARAOH'S<br><span>TOMB</span>",
  tag:"A pyramid escape room",
  blurb:"The stone door slammed shut behind your expedition and sand is trickling from the ceiling. Crack the pharaoh's six locks and find the way back to daylight.",
  menuBlurb:"Sealed in a pyramid with sand pouring in. Crack six locks to find daylight.",
  menuLine:"Escape the pyramid",
  theme:{accent:'#f5c542',accent2:'#7ee8dc',bg:'#0d0904',introBg:'#3a2510',door:'linear-gradient(90deg,#8a6438,#b8884e 50%,#8a6438)',doorFrame:'#4a3018',boxColor:'linear-gradient(#e0b04a,#9a6a1e)'},
  sceneCSS:`
${P}{background:#3a2410}
${P} .wall{position:absolute;left:0;right:0;top:0;height:72%;background:
  repeating-linear-gradient(0deg,rgba(60,35,12,.55) 0 2px,transparent 2px 38px),
  repeating-linear-gradient(90deg,rgba(60,35,12,.4) 0 2px,transparent 2px 64px),
  linear-gradient(#a8743e,#c08a4c 40%,#9a6a36)}
${P} .wall::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,transparent 30%,rgba(30,15,4,.55) 90%)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:30%;background:repeating-radial-gradient(ellipse at 50% 120%,#c99a58 0 10px,#b8874a 10px 18px),#c99a58}
${P} .floor::before{content:"";position:absolute;left:0;right:0;top:0;height:16%;background:linear-gradient(rgba(40,20,5,.55),transparent)}
${P} .crack{position:absolute;left:66%;top:0;width:8%;height:3%;background:#1a0e04;clip-path:polygon(0 0,100% 0,70% 100%,55% 40%,35% 100%);z-index:2}
${P} .stream{position:absolute;left:69.4%;top:2%;width:1.4%;height:78%;background:repeating-linear-gradient(180deg,#e8c27a 0 6px,#c99a58 6px 9px,#f2d595 9px 14px);background-size:100% 28px;animation:${ID}-pour .5s linear infinite;z-index:3;opacity:.9;border-radius:2px;pointer-events:none}
${P} .grain{position:absolute;width:3px;height:3px;border-radius:50%;background:#f2d595;z-index:3;pointer-events:none;animation:${ID}-grain 1.6s linear infinite}
${P} .torch{position:absolute;top:13%;width:9%;height:20%;z-index:1}
${P} .torch.l{left:5%} ${P} .torch.r{right:5%}
${P} .torch .stick{position:absolute;left:38%;top:34%;width:24%;height:56%;background:linear-gradient(90deg,#4a2c12,#7a4c22,#4a2c12);border-radius:2px}
${P} .torch .cup{position:absolute;left:18%;top:28%;width:64%;height:14%;background:linear-gradient(#e0b04a,#8a6420);border-radius:2px 2px 50% 50%}
${P} .torch .flame{position:absolute;left:50%;top:-6%;width:90%;height:40%;margin-left:-45%;background:radial-gradient(ellipse at 50% 75%,#fff7d0,#ffc040 35%,#ff6a1a 60%,transparent 72%);border-radius:50% 50% 40% 40%;transform-origin:50% 100%;animation:${ID}-fire .16s infinite alternate}
${P} .torch .flame::after{content:"";position:absolute;left:30%;top:-30%;width:40%;height:50%;background:radial-gradient(ellipse at 50% 80%,#ffd27a,transparent 70%);border-radius:50%;animation:${ID}-fire .23s infinite alternate-reverse}
${P} .glow{position:absolute;top:2%;width:44%;height:44%;border-radius:50%;background:radial-gradient(rgba(255,170,60,.35),transparent 65%);pointer-events:none;z-index:3;animation:flicker 2.6s infinite}
${P} .glow.l{left:-12%} ${P} .glow.r{right:-12%;animation-delay:-1.2s}
/* hieroglyph wall */
${P} #o-wall{left:21%;top:6%;width:58%;height:20%;background:linear-gradient(#d9b07a,#c4955a);border:3px solid #7a5226;box-shadow:inset 0 0 0 3px #3fa79a,inset 0 0 0 5px #7a5226,0 6px 12px rgba(0,0,0,.45);border-radius:3px;display:flex;flex-direction:column;justify-content:space-evenly;padding:4px 6px}
${P} #o-wall .row{display:flex;justify-content:space-between;align-items:center}
${P} #o-wall .row svg{width:13%;height:auto}
${P} #o-wall::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,transparent 30%,rgba(255,240,200,.35) 45%,transparent 60%);background-size:300% 100%;animation:${ID}-shine 6s ease-in-out infinite;pointer-events:none}
/* hidden door (wave 2) */
${P} #o-door{left:33%;top:31%;width:34%;height:36%;overflow:hidden;border-radius:2px;background:#120a04;box-shadow:0 0 0 4px #7a5226,0 0 0 7px #3fa79a,0 0 0 9px #7a5226}
${P} #o-door .map{position:absolute;inset:10% 10%;border-radius:3px;background:#0d2a28;box-shadow:0 0 14px #3fa79a;opacity:.25;transition:opacity 1s 1s}
${P} #o-door .map svg{width:100%;height:100%;display:block}
${P} #o-door.revealed .map{opacity:1;animation:${ID}-mapglow 3s ease-in-out infinite 2s}
${P} #o-door .slab{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(60,35,12,.5) 0 2px,transparent 2px 25%),linear-gradient(90deg,#9a6a36,#b8854a 50%,#9a6a36);transition:transform 2s cubic-bezier(.5,0,.3,1);display:flex;align-items:center;justify-content:center}
${P} #o-door .slab::before{content:"";position:absolute;left:20%;top:30%;width:2px;height:40%;background:rgba(40,20,5,.6);transform:rotate(18deg);box-shadow:30px 10px 0 rgba(40,20,5,.4)}
${P} #o-door .slab b{width:32%;aspect-ratio:1;border-radius:50%;background:radial-gradient(#7ee8dc,#1d5a52);box-shadow:0 0 0 3px #7a5226,0 0 10px #3fa79a88;opacity:.6}
${P} #o-door.revealed .slab{transform:translateY(102%)}
${P} .lintel{position:absolute;left:30%;top:27.5%;width:40%;height:4%;background:linear-gradient(#d9b07a,#9a6a36);border:2px solid #5a3a12;border-radius:2px;z-index:2}
/* scarab */
${P} #o-scarab{left:4%;top:38%;width:25%;height:26%}
${P} #o-scarab .ped{position:absolute;left:14%;right:14%;bottom:0;height:46%;background:linear-gradient(90deg,#8a5e30,#b8854a 50%,#8a5e30);border-top:4px solid #d9b07a;box-shadow:0 6px 10px rgba(0,0,0,.45)}
${P} #o-scarab .ped::after{content:"";position:absolute;left:20%;right:20%;top:30%;height:12%;background:#3fa79a;box-shadow:0 10px 0 #7a5226}
${P} #o-scarab svg{position:absolute;left:4%;right:4%;top:0;width:92%;height:auto;filter:drop-shadow(0 4px 4px rgba(0,0,0,.5))}
${P} #o-scarab .shine{position:absolute;left:10%;top:4%;width:80%;height:50%;background:linear-gradient(110deg,transparent 40%,rgba(255,255,230,.7) 50%,transparent 60%);background-size:300% 100%;animation:${ID}-shine 4s ease-in-out infinite;mix-blend-mode:overlay;pointer-events:none;border-radius:50%}
/* tablet */
${P} #o-tablet{right:4%;top:36%;width:22%;height:21%;background:linear-gradient(#6b6258,#4a433b);border-radius:40% 40% 4px 4px/18% 18% 4px 4px;box-shadow:inset 0 0 0 2px #2a241e,0 6px 12px rgba(0,0,0,.5)}
${P} #o-tablet svg{position:absolute;left:10%;top:16%;width:80%;height:auto}
/* sand pile (wave 2) */
${P} #o-sand{left:56%;top:73%;width:40%;height:22%}
${P} #o-sand .chest{position:absolute;left:24%;width:52%;bottom:24%;height:44%;background:linear-gradient(#3fa79a,#1d5a52);border:3px solid #d9a63a;border-radius:4px 4px 2px 2px;transform:translateY(60%);transition:transform 1.4s cubic-bezier(.3,1.4,.5,1) .8s}
${P} #o-sand .chest::before{content:"";position:absolute;left:-6%;right:-6%;top:-18%;height:30%;background:linear-gradient(#f5c542,#a8781e);border-radius:4px}
${P} #o-sand .chest::after{content:"";position:absolute;left:42%;top:30%;width:16%;height:30%;background:#f5c542;border-radius:2px}
${P} #o-sand .pile{position:absolute;inset:0;transform-origin:50% 100%;transition:transform 1.6s ease-in-out}
${P} #o-sand .pile svg{width:100%;height:100%;display:block}
${P} #o-sand.revealed .pile{transform:scaleY(.42) scaleX(1.12)}
${P} #o-sand.revealed .chest{transform:translateY(0)}
/* sarcophagus (final) */
${P} #o-sarc{left:3%;top:66%;width:54%;height:29%}
${P} #o-sarc svg{position:absolute;inset:0;width:100%;height:100%;filter:drop-shadow(0 8px 8px rgba(0,0,0,.5))}
${P} #o-sarc .lights{position:absolute;left:24%;right:6%;bottom:12%;display:flex;justify-content:space-between}
${P} #o-sarc .lights b{width:9%;aspect-ratio:1;border-radius:50%;background:#1d3a36;box-shadow:inset 0 0 0 1.5px #6b4512}
${P} #o-sarc .lights b.on{background:radial-gradient(#e8fffb,#7ee8dc 60%);box-shadow:0 0 8px #7ee8dc,inset 0 0 0 1.5px #d9a63a}
${P} #o-sarc .eyes{position:absolute;left:8.6%;top:33%;width:10%;height:6%;display:flex;justify-content:space-between}
${P} #o-sarc .eyes i{width:30%;height:100%;border-radius:50%;background:#7ee8dc;box-shadow:0 0 6px #7ee8dc;animation:glowpulse 3s ease-in-out infinite}
${P} .mote{position:absolute;width:2px;height:2px;border-radius:50%;background:#ffe7b0;opacity:0;pointer-events:none;z-index:3;animation:${ID}-mote 8s linear infinite}
@keyframes ${ID}-pour{from{background-position:0 0}to{background-position:0 28px}}
@keyframes ${ID}-grain{0%{transform:translate(0,0);opacity:0}10%{opacity:1}100%{transform:translate(var(--gx,6px),70px);opacity:0}}
@keyframes ${ID}-fire{from{transform:scale(1,1) rotate(-3deg)}to{transform:scale(.92,1.12) rotate(3deg)}}
@keyframes ${ID}-shine{0%,60%{background-position:100% 0}100%{background-position:-50% 0}}
@keyframes ${ID}-mapglow{0%,100%{box-shadow:0 0 8px #3fa79a}50%{box-shadow:0 0 20px #7ee8dc}}
@keyframes ${ID}-mote{0%{opacity:0;transform:translate(0,0)}25%{opacity:.8}100%{opacity:0;transform:translate(-20px,-50px)}}
`,
  sceneHTML:`
<div class="wall"></div><div class="floor"></div><div class="crack"></div>
<div class="torch l"><div class="stick"></div><div class="cup"></div><div class="flame"></div></div>
<div class="torch r"><div class="stick"></div><div class="cup"></div><div class="flame"></div></div>
<button class="obj" id="o-wall" aria-label="Hieroglyph wall">${['SAHPIR','NETXOM','KDLUAI'].map(r=>`<div class="row">${r.split('').map(c=>glyph(c,20,'#5a3412')).join('')}</div>`).join('')}<span class="spark"></span></button>
<div class="lintel"></div>
<button class="obj" id="o-door" aria-label="Sealed stone panel"><div class="map"><svg viewBox="0 0 40 40"><g stroke="#7ee8dc" stroke-width="1.6" fill="none"><path d="M4 4H36V36H4Z M4 12H20 M28 4V20H12 M12 20V28H28 M20 28V36 M36 28H28"/></g><circle cx="32" cy="32" r="2" fill="#f5c542"/></svg></div><div class="slab"><b></b></div><span class="spark"></span></button>
<button class="obj" id="o-scarab" aria-label="Golden scarab statue"><div class="ped"></div><svg viewBox="0 0 100 70"><g stroke="#6b4512" stroke-width="3" stroke-linecap="round"><path d="M30 30 L12 20 L6 28 M30 42 L10 46 L6 56 M70 30 L88 20 L94 28 M70 42 L90 46 L94 56"/></g><ellipse cx="50" cy="42" rx="24" ry="22" fill="#e0b04a" stroke="#6b4512" stroke-width="2"/><path d="M50 22 V64" stroke="#6b4512" stroke-width="2"/><path d="M34 34 q16 -8 32 0" stroke="#fff3c4" stroke-width="2" fill="none" opacity=".6"/><ellipse cx="50" cy="18" rx="11" ry="8" fill="#3fa79a" stroke="#1d5a52" stroke-width="2"/><path d="M44 11 L38 3 M56 11 L62 3" stroke="#1d5a52" stroke-width="2.5" stroke-linecap="round"/></svg><div class="shine"></div><span class="spark"></span></button>
<button class="obj" id="o-tablet" aria-label="Stone tablet">${'<svg viewBox="0 0 60 50"><g fill="#8a8072" stroke="#2a241e" stroke-width="1"><rect x="24" y="2" width="12" height="9"/><rect x="18" y="13" width="12" height="9"/><rect x="30" y="13" width="12" height="9"/><rect x="12" y="24" width="12" height="9"/><rect x="24" y="24" width="12" height="9"/><rect x="36" y="24" width="12" height="9"/><rect x="6" y="35" width="12" height="9"/><rect x="18" y="35" width="12" height="9"/><rect x="30" y="35" width="12" height="9"/><rect x="42" y="35" width="12" height="9"/></g><text x="30" y="9.5" font-size="7" text-anchor="middle" fill="#f5c542" font-weight="700">?</text></svg>'}<span class="spark"></span></button>
<button class="obj" id="o-sarc" aria-label="The pharaoh's sarcophagus"><svg viewBox="0 0 200 110" preserveAspectRatio="none"><path d="M10 40 Q10 20 34 18 L186 24 Q196 26 196 40 V92 Q196 100 186 100 H18 Q10 100 10 92Z" fill="#6b4512"/><path d="M14 36 Q14 16 36 14 L184 20 Q192 22 192 34 V58 H14Z" fill="#e0b04a"/>${[60,84,108,132,156].map(x=>`<rect x="${x}" y="17" width="10" height="41" fill="#3fa79a"/>`).join('')}<path d="M14 58 H192 V92 Q192 98 184 98 H20 Q14 98 14 92Z" fill="#b8854a"/><path d="M14 62 H192" stroke="#7a5226" stroke-width="2"/><path d="M8 50 Q4 22 26 12 Q46 6 50 30 L52 62 Q30 70 8 62Z" fill="#3fa79a" stroke="#1d5a52" stroke-width="2"/>${[16,24,32,40].map(x=>`<path d="M${x} 16 V62" stroke="#f5c542" stroke-width="3"/>`).join('')}<ellipse cx="28" cy="38" rx="13" ry="16" fill="#f5c542" stroke="#8a6420" stroke-width="2"/><path d="M18 34 h8 M30 34 h8" stroke="#1a1410" stroke-width="2.5"/><path d="M24 48 q4 3 8 0" stroke="#8a6420" stroke-width="2" fill="none"/><rect x="25" y="53" width="6" height="12" rx="2" fill="#3fa79a" stroke="#1d5a52"/></svg><div class="eyes"><i></i><i></i></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<button class="obj" id="o-sand" aria-label="Pile of sand"><div class="chest"></div><div class="pile"><svg viewBox="0 0 100 50" preserveAspectRatio="none"><path d="M0 50 Q18 40 30 22 Q42 4 52 4 Q62 6 72 22 Q84 40 100 50Z" fill="#e2b56e"/><path d="M30 22 Q42 4 52 4 Q46 14 44 30 Q36 40 20 46 Z" fill="#f2d595" opacity=".6"/><path d="M10 46 Q30 40 40 44 M60 42 Q76 40 90 47" stroke="#b8874a" fill="none"/></svg></div><span class="spark"></span></button>
<div class="stream"></div>
${[0,.4,.8,1.2].map((d,i)=>`<div class="grain" style="left:${69.6+(i%2?1:-.5)}%;top:${72}%;--gx:${[8,-7,5,-9][i]}px;animation-delay:${d}s"></div>`).join('')}
<div class="glow l"></div><div class="glow r"></div>
${[[30,60,0],[50,48,2],[40,30,4],[78,58,1],[20,28,5]].map(([l,t,d])=>`<div class="mote" style="left:${l}%;top:${t}%;animation-delay:${d}s"></div>`).join('')}`,
  order:["wall","tablet","scarab","door","sand","sarc"],
  revealOnWave2:[{sel:'#o-door',cls:'revealed'},{sel:'#o-sand',cls:'revealed'}],
  wave2Toast:"Rumble! The stone panel sank into the floor, and the sand pile slumped to show a buried chest.",
  finalReadyToast:"Five gold letters glow on the sarcophagus lid. One word left.",
  startToast:"The door is sealed and sand is pouring in. Tap anything that sparkles.",
  locks:{
    /* Solution: wall symbols decode with the four key cards: almond eye = S (card 1), zigzag = P and crossed circle = H (card 2),
       dotted triangle = I and crescent = N (card 3), spiral = X (card 4). SPHINX. */
    wall:{wave:1,title:"The Glyph Wall",obj:"o-wall",answer:"SPHINX",kind:"word",tile:"H",
      scene:"One line on the wall is painted brighter than the rest. Your team's notebooks each copied part of the glyph alphabet. Put them together to read the name of the tomb's guardian.",
      extra:`<div style="display:flex;justify-content:center;gap:4px;background:linear-gradient(#d9b07a,#c4955a);border:3px solid #7a5226;box-shadow:inset 0 0 0 2px #3fa79a;border-radius:8px;padding:12px 4px">${'SPHINX'.split('').map(c=>glyph(c,42)).join('')}</div>`,
      cards:[keyCard('SART'),keyCard('PEHO'),keyCard('MINU'),keyCard('DXKL')],
      hints:["Each notebook has a few glyphs. Look for the six wall glyphs across all four.","The almond with a dot is S. The zigzag is P.","The glyphs spell S, P, H, I, N, X. The answer is SPHINX."]},
    /* Solution: bottom row 7, b, 6, d. Middle of row 2 is b+6 = 15 so b = 9. Row 2 is 16, 15, 6+d.
       Right of row 3 is 15 + (6+d) = 32 so 6+d = 17, d = 11. Row 3 is 16+15 = 31 and 32. Top = 31+32 = 63.
       Without any one card the top is not fixed (checked by brute force). */
    tablet:{wave:1,title:"The Stone Pyramid",obj:"o-tablet",answer:"63",kind:"num",tile:"T",
      scene:"A stone tablet shows a pyramid of blocks. Every block is the sum of the two blocks directly underneath it. The code is the number on the very top block.",
      extra:pyramidArt(),cardClass:"type",
      cards:["Bottom row, first block: 7","Bottom row, third block: 6","Second row, middle block: 15","Third row, right block: 32"],
      hints:["The middle block of row 2 sits on the second and third bottom blocks. You know one of them.","The second bottom block is 9. Now use the 32 to find the last bottom block, which is 11.","Row 2 is 16, 15, 17. Row 3 is 31, 32. The top is 63."]},
    /* Solution: heads (turquoise) pointing right per stone: 3 + 3 + 4 + 2 = 12. Left, up and down heads do not count. */
    scarab:{wave:1,title:"The Scarab Parade",obj:"o-scarab",answer:"12",kind:"num",tile:"G",splitArt:true,
      scene:"The scarab's pedestal is wrapped in a frieze of little beetles, carved on four stones. The inscription: <em>\"Only those who march toward the sarcophagus may count.\"</em> The arrow on each stone points to the sarcophagus. How many scarabs face that way?",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1.5,1,1.5,-1][i]}deg;animation-delay:${i*.08}s;background:#b8874a"><span class="ph">PHONE ${i+1}</span>${friezeSVG(i)}</div>`).join('')}</div>`,
      hints:["A scarab faces the way its turquoise head points. Only count heads pointing the same way as the arrow.","Count each stone separately, then add the four numbers together.","3 + 3 + 4 + 2 makes 12."]},
    /* Solution: the only route from the red arrow (top left) to the gold sarcophagus (bottom right) passes, in order,
       C (bottom-left piece), O and B (top-left piece), R (top-right piece), A (bottom-right piece). COBRA.
       Decoys S, T, E, K, N, D sit in dead ends. Maze is a perfect maze so the route is unique. */
    door:{wave:2,title:"The Hidden Map",obj:"o-door",answer:"COBRA",kind:"word",tile:"L",splitArt:true,
      lockedMsg:"A solid stone panel. It sounds hollow. Crack two of the first locks to open it.",
      scene:"Behind the panel, a map of the tomb is carved in four tiles. Trace the only path from the red arrow to the gold sarcophagus. Read the letters you pass over, in order, to learn the name of the guardian snake.",
      extra:()=>`<div class="photo-grid" style="gap:0;background:#e6c98e;border-radius:6px;padding:4px">${[0,1,2,3].map(i=>`<div class="card" style="--r:0deg;animation-delay:${i*.08}s;padding:2px;box-shadow:none;border-radius:0"><span class="ph">PHONE ${i+1}</span>${mazePiece(i)}</div>`).join('')}</div>`,
      hints:["Start at the red arrow in the top left. Walls are lines; you can only walk through gaps.","The path drops straight down the left side first, so the first letter is in the bottom-left tile.","The path passes C, O, B, R and A. The answer is COBRA."]},
    /* Solution: the odd one out in each row: eye with no tear line = O, sun with 7 rays = A, feather with 2 barbs = S,
       pot with a dot = I, cat with no chin stripe = S. OASIS. */
    sand:{wave:2,title:"The Fake Amulets",obj:"o-sand",answer:"OASIS",kind:"word",tile:"I",
      lockedMsg:"Just a big heap of sand. Something glints underneath. Crack two of the first locks.",
      scene:"In the buried chest lie five rows of amulets. A tomb robber swapped one amulet in every row for a fake that is slightly wrong. Read the fakes' letters, row 1 to row 5, to learn where the secret tunnel leads.",
      cards:[`<b>Row 1</b>${amuletRow('eye','MOTH',1)}`,`<b>Row 2</b>${amuletRow('sun','ARCE',0)}`,`<b>Row 3</b>${amuletRow('feather','LUSP',2)}`,`<b>Row 4</b>${amuletRow('pot','DEWI',3)}`,`<b>Row 5</b>${amuletRow('cat','SNRY',0)}`],wideCards:true,
      hints:["In each row three amulets match exactly. Compare them closely: count rays, lines and dots.","Row 1: one eye has no little line underneath. That's O.","The fakes are O, A, S, I, S. The answer is OASIS."]},
    /* Tiles H, T, G, L, I. Only English anagram: LIGHT. */
    sarc:{wave:3,title:"The Sarcophagus",obj:"o-sarc",answer:"LIGHT",kind:"word",
      scene:"Every lock you crack sets a gold letter into the sarcophagus lid. The carving reads: <em>\"Lost in the dark? Speak the one thing you seek, and the pharaoh will show it to you.\"</em>",
      hints:["Your torches are nearly out. What do you need most in a dark tomb?","It's what the sun gives. It starts with L.","The answer is LIGHT."]}
  },
  finale:{tag:"ESCAPED",titleHTML:"BACK TO<br><span>DAYLIGHT</span>",
    cardHTML:`<h3>The Pharaoh's Gift</h3>The sarcophagus lid grinds open. Inside is no mummy, just a polished golden mirror. It catches the last flicker of your torch and throws a beam up a hidden shaft, where a staircase climbs to blue sky and a waiting camel.<div class="note">"Clever explorers! Keep the golden scarab as a souvenir, and please shut the door on your way out. Pharaoh Amenkhet."</div>`}
};
EXP_ORDER.push(ID);
})();
