(function(){
const ID='haunted-manor', P=`.scene[data-exp="${ID}"]`;

/* ---------- art helpers ---------- */
// Portrait line-up for the guess-who lock. [hat, glasses, moustache, bowtie]
const GHOSTS=[
  ['HORACE',1,1,0,1,'#3b2a4a'],['CLARA',0,0,0,1,'#2f3b4a'],['BASIL',0,1,1,1,'#3a3a2a'],
  ['MAUDE',0,1,0,1,'#4a2a3a'],['RUPERT',1,0,1,0,'#2a4a3a'],['EDITH',0,1,0,0,'#4a3a2a']];
function portrait([name,hat,gl,mo,bow,bg],i){
  const hair=[`<path d="M18 30 q12 -16 24 0 q-2 -8 -12 -9 q-10 1 -12 9z" fill="#c9c2d6"/>`,
    `<path d="M16 34 q2 -18 14 -18 q12 0 14 18 q-3 -10 -14 -11 q-11 1 -14 11z" fill="#d8cfa8"/><circle cx="30" cy="15" r="5" fill="#d8cfa8"/>`,
    `<path d="M19 28 q11 -10 22 0" stroke="#bfb6a0" stroke-width="4" fill="none"/>`,
    `<path d="M15 40 q-2 -24 15 -24 q17 0 15 24 q-3 -14 -15 -15 q-12 1 -15 15z" fill="#e3d6f0"/><circle cx="30" cy="14" r="6" fill="#e3d6f0"/>`,
    `<path d="M19 29 q11 -8 22 0" stroke="#9a8f80" stroke-width="3" fill="none"/>`,
    `<path d="M16 36 q0 -20 14 -20 q14 0 14 20 q-4 -12 -14 -12 q-10 0 -14 12z" fill="#cbbfa3"/>`][i];
  return `<div style="text-align:center"><svg viewBox="0 0 60 82" role="img" aria-label="Portrait of ${name}">
  <rect x="1" y="1" width="58" height="72" rx="4" fill="#b48a3a"/><rect x="5" y="5" width="50" height="64" rx="2" fill="${bg}"/>
  <path d="M10 69 q20 -22 40 0z" fill="#262033"/>
  <ellipse cx="30" cy="38" rx="12" ry="14" fill="#dff5ea"/>
  ${hair}
  <circle cx="25" cy="36" r="1.8" fill="#1d2a24"/><circle cx="35" cy="36" r="1.8" fill="#1d2a24"/>
  <path d="M26 45 q4 2 8 0" stroke="#5b6f66" stroke-width="1.2" fill="none"/>
  ${gl?`<g stroke="#20262a" stroke-width="1.4" fill="rgba(255,255,255,.25)"><circle cx="25" cy="36" r="4.2"/><circle cx="35" cy="36" r="4.2"/><path d="M29.2 36h1.6"/></g>`:''}
  ${mo?`<path d="M30 42 q-4 -2 -8 1 q3 3 8 0 q5 3 8 0 q-4 -3 -8 -1z" fill="#3a2e28"/>`:''}
  ${hat?`<rect x="19" y="8" width="22" height="16" rx="1" fill="#14121a"/><rect x="15" y="23" width="30" height="4" rx="2" fill="#14121a"/><rect x="19" y="19" width="22" height="3" fill="#6b3a6b"/>`:''}
  ${bow?`<path d="M30 56 l-8 -4 v8z M30 56 l8 -4 v8z" fill="#b34b6e"/><circle cx="30" cy="56" r="2" fill="#7a2a48"/>`:''}
  </svg><div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#cfe9db;margin-top:2px">${name}</div></div>`;
}
// Picture-algebra icons
const ICON={
  candle:`<svg viewBox="0 0 24 30" width="26" height="32" style="vertical-align:middle"><path d="M12 1 q5 5 0 10 q-5 -5 0 -10z" fill="#f08a1c"/><rect x="8" y="11" width="8" height="15" rx="1.5" fill="#7a4fa0" stroke="#3e2456" stroke-width="1"/><rect x="5" y="25" width="14" height="3" rx="1.5" fill="#9a8a6a"/></svg>`,
  bat:`<svg viewBox="0 0 32 20" width="34" height="22" style="vertical-align:middle"><path d="M16 6 q-2 -4 -1 -5 l1 2 l1 -2 q1 1 -1 5 q6 -4 15 -2 q-4 2 -4 6 q-4 -2 -6 2 q-3 -1 -5 3 q-2 -4 -5 -3 q-2 -4 -6 -2 q0 -4 -4 -6 q9 -2 15 2z" fill="#2a2235"/><circle cx="14.6" cy="7" r=".9" fill="#ffd27a"/><circle cx="17.4" cy="7" r=".9" fill="#ffd27a"/></svg>`,
  spider:`<svg viewBox="0 0 30 26" width="30" height="26" style="vertical-align:middle"><g stroke="#2a2235" stroke-width="1.6" fill="none"><path d="M12 12 l-6 -6 l-4 4 M12 14 l-8 0 l-3 5 M12 16 l-5 5 l-1 4 M18 12 l6 -6 l4 4 M18 14 l8 0 l3 5 M18 16 l5 5 l1 4"/></g><ellipse cx="15" cy="15" rx="5" ry="6" fill="#2a2235"/><circle cx="15" cy="8" r="3.4" fill="#2a2235"/><line x1="15" y1="0" x2="15" y2="5" stroke="#2a2235"/></svg>`,
  owl:`<svg viewBox="0 0 26 30" width="26" height="30" style="vertical-align:middle"><path d="M4 6 l4 4 h10 l4 -4 v16 q-9 10 -18 0z" fill="#6b5240"/><circle cx="9.5" cy="14" r="4" fill="#f4ead2"/><circle cx="16.5" cy="14" r="4" fill="#f4ead2"/><circle cx="9.5" cy="14" r="1.8" fill="#1a1410"/><circle cx="16.5" cy="14" r="1.8" fill="#1a1410"/><path d="M13 17 l-1.5 2.5 h3z" fill="#e8b33a"/></svg>`};
const eq=(a,b,c,n)=>`<div style="display:flex;align-items:center;justify-content:center;gap:3px;font-family:'Archivo Black';font-size:17px">${ICON[a]}+${ICON[b]}+${ICON[c]}=<span>${n}</span></div>`;
// Mirror half-letters (left halves; the mirror line is on the right)
const HALF={M:'M8 46 V6 L20 28 L32 6 V46',Y:'M8 6 L20 26 L32 6 M20 26 V46',T:'M5 7 H35 M20 7 V46',H:'M8 6 V46 M32 6 V46 M8 26 H32'};
function halfLetter(ch,n){return `<svg viewBox="0 0 40 52" role="img" aria-label="Half of letter ${n}" style="max-width:110px;margin:4px auto 0"><defs><clipPath id="hmc${n}"><rect x="0" y="0" width="20" height="52"/></clipPath><linearGradient id="hmg${n}" x1="0" x2="1"><stop offset="0" stop-color="#cfe3ea"/><stop offset="1" stop-color="#8fa9b6"/></linearGradient></defs><rect x="20" y="0" width="20" height="52" fill="url(#hmg${n})" opacity=".55"/><path d="${HALF[ch]}" stroke="#2b2236" stroke-width="5.5" stroke-linecap="butt" stroke-linejoin="miter" fill="none" clip-path="url(#hmc${n})"/><line x1="20" y1="0" x2="20" y2="52" stroke="#6b5a8a" stroke-width="1.2" stroke-dasharray="3 2"/></svg><div style="text-align:center;font-size:12px;font-weight:700">Letter ${n} of 4</div>`}
// Spider-web cipher (pigpen-style). Grid letters A-R, X letters S-Z.
function glyph(ch,s=44){
  const i=ch.charCodeAt(0)-65; let d='',dot='';
  if(i<18){const k=i%9,r=Math.floor(k/3),c=k%3; if(c>0)d+='M3 3V17'; if(c<2)d+='M17 3V17'; if(r>0)d+='M3 3H17'; if(r<2)d+='M3 17H17'; if(i>=9)dot='10,10';}
  else{const k=(i-18)%4; d=['M3 3L10 13L17 3','M3 3L13 10L3 17','M17 3L7 10L17 17','M3 17L10 7L17 17'][k]; if(i>=22)dot=['10,6','6,10','14,10','10,14'][k];}
  return `<svg viewBox="0 0 20 20" style="width:${s}px;height:${s}px;flex:none;background:#221830;border-radius:6px"><path d="${d}" stroke="#e6f7ee" stroke-width="2" fill="none" stroke-linecap="square"/>${dot?`<circle cx="${dot.split(',')[0]}" cy="${dot.split(',')[1]}" r="1.8" fill="#9df5c8"/>`:''}</svg>`;
}
function gridKey(start,dots){const L=[...Array(9)].map((_,k)=>String.fromCharCode(start+k));
  return `<svg viewBox="0 0 66 66" style="max-width:120px;margin:2px auto 0"><g stroke="#3a2a17" stroke-width="2.4"><path d="M23 3V63M43 3V63M3 23H63M3 43H63"/></g>${L.map((ch,k)=>`<text x="${13+(k%3)*20}" y="${18+Math.floor(k/3)*20}" text-anchor="middle" font-size="13" font-weight="700" fill="#3a2a17">${ch}</text>${dots?`<circle cx="${19+(k%3)*20}" cy="${7+Math.floor(k/3)*20}" r="1.8" fill="#3a2a17"/>`:''}`).join('')}</svg>`}
function xKey(start,dots){const L=[0,1,2,3].map(k=>String.fromCharCode(start+k)); const pos=[[33,17],[15,37],[51,37],[33,57]], dp=[[40,12],[10,30],[56,30],[40,52]];
  return `<svg viewBox="0 0 66 66" style="max-width:120px;margin:2px auto 0"><g stroke="#3a2a17" stroke-width="2.4"><path d="M5 5L61 61M61 5L5 61"/></g>${L.map((ch,k)=>`<text x="${pos[k][0]}" y="${pos[k][1]}" text-anchor="middle" font-size="13" font-weight="700" fill="#3a2a17">${ch}</text>${dots?`<circle cx="${dp[k][0]}" cy="${dp[k][1]}" r="1.8" fill="#3a2a17"/>`:''}`).join('')}</svg>`}
const keyCard=(title,svg)=>`<div style="text-align:center;font-size:12px;font-weight:700">${title}</div>${svg}`;
// Spirit board
const BOARD=['ABCDEF','GHIJKL','MNOPQR','STUVWX','YZ*#'];
function boardSVG(){let g='';BOARD.forEach((row,r)=>row.split('').forEach((ch,c)=>{const x=10+c*30,y=12+r*26;
  if(ch==='*')g+=`<g transform="translate(${x+15} ${y+12})"><circle r="8" fill="#f3ead1"/><circle cx="4" cy="-3" r="7" fill="#2a1f14"/></g>`;
  else if(ch==='#')g+=`<g transform="translate(${x+15} ${y+12})"><circle r="5" fill="#ffd27a"/>${[0,45,90,135,180,225,270,315].map(a=>`<rect x="-1" y="-10" width="2" height="3" fill="#ffd27a" transform="rotate(${a})"/>`).join('')}</g>`;
  else g+=`<text x="${x+15}" y="${y+19}" text-anchor="middle" font-family="Georgia,serif" font-size="19" font-weight="700" fill="#2a1f14">${ch}</text>`;}));
  return `<svg viewBox="0 0 200 146" role="img" aria-label="Spirit board letter grid"><rect x="2" y="2" width="196" height="142" rx="12" fill="#d8bf8a" stroke="#6b4a26" stroke-width="3"/>${[0,1,2,3,4,5].map(c=>`<line x1="${10+c*30}" y1="10" x2="${10+c*30}" y2="138" stroke="#b39a66" stroke-width=".6"/>`).join('')}${g}<text x="160" y="129" text-anchor="middle" font-family="Georgia,serif" font-size="11" fill="#6b4a26">GOODBYE</text></svg>`}

EXPERIENCES[ID]={
  id:ID, title:"The Haunted Manor", titleHTML:"THE HAUNTED<br><span>MANOR</span>", season:"Halloween",
  tag:"A friendly-spooky escape room",
  blurb:"Ashgrove Manor has had a guest for a hundred years who never checks out. Find out who is trapped in the parlour, crack six locks, and set the poor ghost free.",
  menuBlurb:"A ghost has been stuck in the parlour for a century. Crack six locks and set it free.",
  menuLine:"Free the trapped ghost",
  theme:{accent:'#9df5c8',accent2:'#e3fff1',bg:'#07060b',introBg:'#1d1430',door:'linear-gradient(90deg,#1c1424,#2e2238 50%,#1c1424)',doorFrame:'#120d18',boxColor:'linear-gradient(#3a2a48,#1f1628)'},
  sceneCSS:`
${P}{background:#120d18}
${P} .wall{position:absolute;left:0;right:0;top:0;height:72%;background:radial-gradient(circle at 50% 50%,#2e2140 0 3px,transparent 4px) 0 0/22px 22px,radial-gradient(circle at 50% 50%,#251a33 0 6px,transparent 7px) 11px 11px/22px 22px,linear-gradient(#1f1629,#2a1e38)}
${P} .wains{position:absolute;left:0;right:0;top:60%;height:12%;background:repeating-linear-gradient(90deg,#24182c 0 30px,#1c1222 30px 32px);box-shadow:inset 0 3px 0 #3a2a48,inset 0 -2px 0 #0e0912}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:28%;background:repeating-linear-gradient(90deg,#1e1514 0 26px,#171010 26px 28px);}
${P} .floor::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.6),transparent 40%)}
${P} .rug{position:absolute;left:8%;right:22%;top:79%;height:17%;border-radius:50%;background:radial-gradient(ellipse,#4a1f3a 0 45%,#6b2d4f 46% 52%,#3a1530 53% 70%,#5a2342 71%);box-shadow:0 4px 10px rgba(0,0,0,.6)}
${P} .window{position:absolute;left:37%;top:5%;width:26%;height:31%;border:5px solid #0d0910;border-radius:50% 50% 3px 3px/30% 30% 3px 3px;background:linear-gradient(#0c1a2e,#1d3350);overflow:hidden}
${P} .window::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:3px;margin-left:-1.5px;background:#0d0910;z-index:1}
${P} .window::after{content:"";position:absolute;top:55%;left:0;right:0;height:3px;background:#0d0910;z-index:1}
${P} .moon{position:absolute;left:18%;top:14%;width:44%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 40% 40%,#fbf6e4,#d9d2b8);box-shadow:0 0 20px #e8f5ff99;animation:${ID}-moon 6s ease-in-out infinite}
${P} .cloud{position:absolute;top:30%;width:60%;height:12%;border-radius:20px;background:rgba(160,170,200,.35);animation:${ID}-cloud 14s linear infinite}
${P} .beam{position:absolute;left:34%;top:30%;width:34%;height:60%;background:linear-gradient(rgba(200,230,255,.13),transparent 85%);clip-path:polygon(25% 0,75% 0,100% 100%,0 100%);pointer-events:none;z-index:1;animation:glowpulse 7s ease-in-out infinite}
${P} .web{position:absolute;top:0;width:24%;pointer-events:none;z-index:1;opacity:.55;transform-origin:top center;animation:${ID}-web 5s ease-in-out infinite}
${P} .web.l{left:0} ${P} .web.r{right:0;transform:scaleX(-1);animation-delay:-2s}
${P} .web svg{width:100%;height:auto;display:block}
${P} .dangle{position:absolute;left:30%;top:0;width:1px;height:16%;background:rgba(220,220,230,.4);z-index:1;transform-origin:top;animation:${ID}-dangle 4s ease-in-out infinite}
${P} .dangle::after{content:"";position:absolute;left:-4px;bottom:-6px;width:9px;height:8px;border-radius:50%;background:#0d0910;box-shadow:-3px -1px 0 -2px #0d0910,3px -1px 0 -2px #0d0910}
/* portrait */
${P} #o-portrait{left:5%;top:7%;width:28%;height:24%;border-radius:50%/50%;background:radial-gradient(ellipse at 50% 40%,#3e2a52,#1c1226);border:6px solid #b48a3a;box-shadow:0 0 0 2px #6b4f1e,0 8px 16px rgba(0,0,0,.6),inset 0 0 18px rgba(0,0,0,.7);overflow:hidden}
${P} #o-portrait .face{position:absolute;left:28%;top:20%;width:44%;height:50%;border-radius:50% 50% 46% 46%;background:radial-gradient(ellipse at 45% 40%,#e9f7ef,#b6d0c4)}
${P} #o-portrait .hair{position:absolute;left:22%;top:8%;width:56%;height:34%;border-radius:50% 50% 30% 30%;background:#d9cfe6}
${P} #o-portrait .hair::after{content:"";position:absolute;left:36%;top:-24%;width:28%;height:50%;border-radius:50%;background:#d9cfe6}
${P} #o-portrait .body{position:absolute;left:14%;right:14%;bottom:-8%;height:30%;border-radius:50% 50% 0 0;background:#2a1838}
${P} #o-portrait .eye{position:absolute;top:44%;width:16%;height:9%;border-radius:50%;background:#fff;overflow:hidden}
${P} #o-portrait .eye.a{left:22%} ${P} #o-portrait .eye.b{right:22%}
${P} #o-portrait .eye i{position:absolute;top:10%;left:30%;width:44%;height:80%;border-radius:50%;background:#16301f;animation:${ID}-look 5s ease-in-out infinite}
${P} #o-portrait .eye::after{content:"";position:absolute;inset:0;background:#b6d0c4;transform:translateY(-100%);animation:${ID}-blink 4.5s infinite}
${P} #o-portrait .mouth{position:absolute;left:40%;top:76%;width:20%;height:6%;border-bottom:2px solid #6b7f74;border-radius:0 0 50% 50%}
/* mirror (wave 2) */
${P} #o-mirror{left:4%;top:36%;width:24%;height:22%;border-radius:40% 40% 6px 6px/26% 26% 6px 6px;border:5px solid #a7a7b8;background:linear-gradient(135deg,#9fb7c4,#5c7380 50%,#a9c2cc);box-shadow:0 0 0 2px #4a4a5a,0 8px 14px rgba(0,0,0,.6)}
${P} #o-mirror::before{content:"";position:absolute;left:14%;top:12%;width:18%;height:60%;background:linear-gradient(rgba(255,255,255,.5),transparent);transform:skewX(-14deg);border-radius:6px}
${P} #o-mirror .writ{position:absolute;inset:26% 18%;display:flex;justify-content:center;align-items:center;font-family:Georgia,serif;font-weight:700;font-size:15px;letter-spacing:2px;color:rgba(40,30,55,.55)}
${P} #o-mirror .dust{position:absolute;inset:-12px -9px -16px -9px;background:repeating-linear-gradient(96deg,transparent 0 14px,rgba(0,0,0,.1) 15px 17px,transparent 19px 26px),linear-gradient(170deg,#d6d0c4,#a8a196 70%,#8f887d);border-radius:42% 42% 18% 18%/30% 30% 18% 18%;box-shadow:inset -6px -8px 14px rgba(0,0,0,.25);transform-origin:top center;transition:transform 1.3s cubic-bezier(.6,.05,.3,1),opacity 1.3s;z-index:2}
${P} #o-mirror .dust::before{content:"";position:absolute;left:30%;top:5%;width:2px;height:90%;background:rgba(0,0,0,.08);box-shadow:16px 4px 0 rgba(0,0,0,.08),-10px 8px 0 rgba(0,0,0,.06)}
${P} #o-mirror.revealed .dust{transform:translateY(170%) rotate(-14deg) scaleY(.6);opacity:0}
/* grandfather clock (wave 2) */
${P} #o-clock{right:3%;top:12%;width:22%;height:65%;}
${P} #o-clock .hood{position:absolute;left:0;right:0;top:0;height:28%;background:linear-gradient(90deg,#2a1810,#4a2c1c 50%,#2a1810);border-radius:40% 40% 4px 4px/20% 20% 4px 4px;box-shadow:inset 0 0 0 2px #1a0e08}
${P} #o-clock .dial{position:absolute;left:12%;top:16%;width:76%;aspect-ratio:1;border-radius:50%;background:radial-gradient(#efe6cf,#cbbd98);box-shadow:0 0 0 3px #b48a3a,inset 0 0 6px rgba(0,0,0,.4)}
${P} #o-clock .dial b{position:absolute;left:50%;top:50%;width:3px;margin-left:-1.5px;background:#1a1410;transform-origin:50% 100%;border-radius:2px}
${P} #o-clock .dial b.h{height:28%;margin-top:-28%;animation:${ID}-rev 240s linear infinite}
${P} #o-clock .dial b.m{height:40%;margin-top:-40%;width:2px;animation:${ID}-rev 20s linear infinite}
${P} #o-clock .dial::after{content:"";position:absolute;left:46%;top:46%;width:8%;height:8%;border-radius:50%;background:#1a1410}
${P} #o-clock .trunk{position:absolute;left:10%;right:10%;top:28%;height:62%;background:linear-gradient(90deg,#2a1810,#3e2416 50%,#2a1810);box-shadow:inset 0 0 0 2px #1a0e08}
${P} #o-clock .glass{position:absolute;left:18%;right:18%;top:6%;height:80%;border-radius:40% 40% 4px 4px/14% 14% 4px 4px;background:#0f0a0c;box-shadow:inset 0 0 0 2px #b48a3a;overflow:hidden;transform-origin:left center;transition:transform .8s}
${P} #o-clock .pend{position:absolute;left:50%;top:0;width:3px;height:70%;margin-left:-1.5px;background:#b48a3a;transform-origin:top center;animation:${ID}-swing 2s ease-in-out infinite}
${P} #o-clock .pend::after{content:"";position:absolute;left:50%;bottom:-12px;width:20px;height:20px;margin-left:-10px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe7a8,#b48a3a 60%,#6b4f1e)}
${P} #o-clock .door{position:absolute;inset:6% 18% 14% 18%;border-radius:40% 40% 4px 4px/14% 14% 4px 4px;background:linear-gradient(120deg,rgba(255,255,255,.14),transparent 40%);transform-origin:left center;transition:transform .9s}
${P} #o-clock.open .door{transform:perspective(200px) rotateY(-70deg)}
${P} #o-clock .base{position:absolute;left:4%;right:4%;bottom:0;height:10%;background:linear-gradient(#3e2416,#22140c);border-radius:3px}
${P} #o-clock .chain{position:absolute;left:-6%;right:-6%;top:53%;height:4.5%;background:radial-gradient(ellipse 45% 40% at 50% 50%,transparent 45%,#c4c4ce 52%,#6a6a76 80%,transparent 86%) 0 0/11px 100% repeat-x;transition:transform 1s cubic-bezier(.6,.05,.4,1),opacity 1s;box-shadow:0 2px 4px rgba(0,0,0,.6)}
${P} #o-clock .chain.a{transform:rotate(22deg)} ${P} #o-clock .chain.b{transform:rotate(-22deg)}
${P} #o-clock .lock{position:absolute;left:38%;top:52%;width:24%;height:9%;border-radius:3px;background:linear-gradient(#d6a74a,#8a6420);transition:transform 1s cubic-bezier(.6,.05,.4,1),opacity 1s;box-shadow:0 2px 4px rgba(0,0,0,.6)}
${P} #o-clock .lock::before{content:"";position:absolute;left:22%;top:-60%;width:56%;height:80%;border:3px solid #9a9aa6;border-bottom:0;border-radius:10px 10px 0 0}
${P} #o-clock.revealed .chain.a{transform:translateY(260%) rotate(70deg);opacity:0}
${P} #o-clock.revealed .chain.b{transform:translateY(280%) rotate(-80deg);opacity:0}
${P} #o-clock.revealed .lock{transform:translateY(300%) rotate(40deg);opacity:0}
/* organ (final) */
${P} #o-organ{left:30%;top:43%;width:44%;height:33%}
${P} #o-organ .pipes{position:absolute;left:6%;right:6%;top:0;height:46%;display:flex;align-items:flex-end;justify-content:center;gap:3%}
${P} #o-organ .pipes i{display:block;width:9%;border-radius:40% 40% 2px 2px/12% 12% 2px 2px;background:linear-gradient(90deg,#6b6070,#d8d0e0 40%,#8a8094);position:relative}
${P} #o-organ .pipes i::after{content:"";position:absolute;left:20%;right:20%;bottom:16%;height:6%;border-radius:50%;background:#1a1220}
${P} #o-organ .case{position:absolute;left:0;right:0;top:44%;bottom:0;background:linear-gradient(#3a2230,#22121c);border-radius:6px 6px 3px 3px;box-shadow:inset 0 0 0 2px #120810,0 8px 16px rgba(0,0,0,.6)}
${P} #o-organ .keys{position:absolute;left:8%;right:8%;top:50%;height:22%;background:repeating-linear-gradient(90deg,#efe9dc 0 9px,#8a8278 9px 10px);border-radius:2px}
${P} #o-organ .keys::after{content:"";position:absolute;inset:0 0 45% 0;background:repeating-linear-gradient(90deg,transparent 0 6px,#16101a 6px 11px,transparent 11px 20px)}
${P} #o-organ .lights{position:absolute;left:10%;right:10%;top:20%;display:flex;justify-content:space-between}
${P} #o-organ .lights b{width:10%;aspect-ratio:1;border-radius:50%;background:#1a1220;box-shadow:inset 0 0 0 1px #000}
${P} #o-organ .lights b.on{background:#c9ffe4;box-shadow:0 0 8px #9df5c8,0 0 2px #fff}
${P} #o-organ .music{position:absolute;left:30%;top:-2%;font-size:14px;color:#9df5c8;opacity:0;animation:${ID}-note 4s ease-out infinite;font-family:Georgia,serif}
/* candelabra */
${P} #o-candles{left:5%;top:60%;width:20%;height:30%}
${P} #o-candles .stem{position:absolute;left:46%;width:8%;top:36%;bottom:8%;background:linear-gradient(90deg,#6b6878,#d5d2e0,#6b6878)}
${P} #o-candles .foot{position:absolute;left:22%;right:22%;bottom:0;height:9%;border-radius:50% 50% 4px 4px;background:linear-gradient(#c8c5d4,#6b6878)}
${P} #o-candles .arms{position:absolute;left:8%;right:8%;top:28%;height:14%;border:3px solid #b9b6c6;border-top:0;border-radius:0 0 50% 50%}
${P} #o-candles .c{position:absolute;top:12%;width:12%;height:19%;background:linear-gradient(90deg,#d8ceb8,#f6efe0,#d8ceb8);border-radius:2px}
${P} #o-candles .c::before{content:"";position:absolute;left:50%;top:-62%;width:180%;height:62%;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 70%,#f4fff8,#9df5c8 40%,transparent 70%);border-radius:50% 50% 45% 45%;animation:flame .2s infinite alternate}
${P} #o-candles .c::after{content:"";position:absolute;left:20%;top:0;width:20%;height:30%;background:#f6efe0;border-radius:0 0 3px 3px}
${P} .halo{position:absolute;left:-6%;top:44%;width:42%;height:40%;border-radius:50%;background:radial-gradient(rgba(157,245,200,.22),transparent 65%);pointer-events:none;z-index:1;animation:flicker 3s infinite}
/* spirit board */
${P} #o-board{left:30%;top:81%;width:38%;height:12%;border-radius:10px;background:linear-gradient(#e0c892,#b8995c);box-shadow:inset 0 0 0 2px #6b4a26,0 6px 10px rgba(0,0,0,.6);transform:perspective(120px) rotateX(24deg)}
${P} #o-board::before{content:"A B C D E F G";position:absolute;left:0;right:0;top:18%;text-align:center;font-family:Georgia,serif;font-size:9px;letter-spacing:1px;color:#4a321a;font-weight:700}
${P} #o-board::after{content:"YES        NO";white-space:pre;position:absolute;left:0;right:0;bottom:14%;text-align:center;font-family:Georgia,serif;font-size:7px;color:#4a321a}
${P} #o-board .plan{position:absolute;left:44%;top:30%;width:18%;height:52%;background:#f2e6c8;clip-path:polygon(50% 0,100% 70%,85% 100%,15% 100%,0 70%);animation:${ID}-plan 6s ease-in-out infinite}
${P} #o-board .plan::after{content:"";position:absolute;left:36%;top:38%;width:28%;height:28%;border-radius:50%;background:#7a5a32}
/* ghost */
${P} .ghost{position:absolute;left:45%;top:19%;width:14%;height:16%;pointer-events:none;z-index:3;animation:${ID}-float 7s ease-in-out infinite}
${P} .ghost .sheet{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 30%,#f6fffb,#cdeee0 70%);border-radius:50% 50% 8% 8%/60% 60% 8% 8%;opacity:.85;clip-path:polygon(0 0,100% 0,100% 88%,88% 100%,75% 88%,62% 100%,50% 88%,38% 100%,25% 88%,12% 100%,0 88%);box-shadow:0 0 20px #9df5c8}
${P} .ghost .sheet::before,${P} .ghost .sheet::after{content:"";position:absolute;top:32%;width:13%;height:16%;border-radius:50%;background:#1a1424;animation:${ID}-blink2 5s infinite}
${P} .ghost .sheet::before{left:30%} ${P} .ghost .sheet::after{right:30%}
${P} .ghost i{position:absolute;left:43%;top:56%;width:14%;height:12%;border-radius:50%;background:#2a2036}
${P} .ghost::after{content:"";position:absolute;left:10%;right:10%;bottom:-30%;height:12%;border-radius:50%;background:rgba(157,245,200,.18);filter:blur(3px)}
${P} .mote{position:absolute;width:3px;height:3px;border-radius:50%;background:#dff;opacity:0;pointer-events:none;z-index:1;animation:${ID}-mote 9s linear infinite}
${P} .tint{position:absolute;inset:0;pointer-events:none;z-index:3;background:radial-gradient(circle at 50% 30%,rgba(140,200,255,.08),transparent 50%),radial-gradient(circle at 14% 70%,rgba(157,245,200,.1),transparent 30%)}
@keyframes ${ID}-moon{0%,100%{box-shadow:0 0 16px #e8f5ff77}50%{box-shadow:0 0 28px #e8f5ffcc}}
@keyframes ${ID}-cloud{from{left:-70%}to{left:110%}}
@keyframes ${ID}-web{0%,100%{transform:rotate(0)}50%{transform:rotate(1.6deg)}}
${P} .web.r{animation-name:${ID}-webr}
@keyframes ${ID}-webr{0%,100%{transform:scaleX(-1) rotate(0)}50%{transform:scaleX(-1) rotate(1.6deg)}}
@keyframes ${ID}-dangle{0%,100%{transform:scaleY(1) rotate(0)}50%{transform:scaleY(1.25) rotate(4deg)}}
@keyframes ${ID}-look{0%,30%{transform:translateX(-30%)}45%,75%{transform:translateX(40%)}90%,100%{transform:translateX(-30%)}}
@keyframes ${ID}-blink{0%,92%,100%{transform:translateY(-100%)}95%{transform:translateY(0)}}
@keyframes ${ID}-blink2{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.1)}}
@keyframes ${ID}-rev{to{transform:rotate(-360deg)}}
@keyframes ${ID}-swing{0%,100%{transform:rotate(14deg)}50%{transform:rotate(-14deg)}}
@keyframes ${ID}-float{0%{transform:translate(0,0) rotate(-3deg)}25%{transform:translate(-12%,-8%) rotate(2deg)}50%{transform:translate(-4%,6%) rotate(-2deg)}75%{transform:translate(8%,-4%) rotate(3deg)}100%{transform:translate(0,0) rotate(-3deg)}}
@keyframes ${ID}-mote{0%{opacity:0;transform:translate(0,0)}20%{opacity:.7}100%{opacity:0;transform:translate(14px,-60px)}}
@keyframes ${ID}-plan{0%,100%{transform:translate(0,0) rotate(0)}30%{transform:translate(-90%,-10%) rotate(-12deg)}60%{transform:translate(80%,5%) rotate(10deg)}}
@keyframes ${ID}-note{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(20px,-40px) rotate(15deg)}}
`,
  sceneHTML:`
<div class="wall"></div><div class="wains"></div><div class="floor"></div><div class="rug"></div>
<div class="window"><div class="moon"></div><div class="cloud"></div></div>
<div class="beam"></div>
<div class="web l"><svg viewBox="0 0 100 100"><g stroke="#e8e8f0" stroke-width=".8" fill="none"><path d="M0 0L100 30M0 0L80 70M0 0L40 100M0 0L10 100"/><path d="M28 8Q22 18 26 26Q16 30 11 28M50 15Q42 32 46 46Q30 52 21 56Q14 60 5 56M75 22Q62 46 68 62Q46 74 32 84Q18 90 8 82"/></g></svg></div>
<div class="web r"><svg viewBox="0 0 100 100"><g stroke="#e8e8f0" stroke-width=".8" fill="none"><path d="M0 0L100 30M0 0L80 70M0 0L40 100M0 0L10 100"/><path d="M28 8Q22 18 26 26Q16 30 11 28M50 15Q42 32 46 46Q30 52 21 56Q14 60 5 56M75 22Q62 46 68 62Q46 74 32 84Q18 90 8 82"/></g></svg></div>
<div class="dangle"></div>
<button class="obj" id="o-portrait" aria-label="Portrait with following eyes"><div class="body"></div><div class="hair"></div><div class="face"></div><div class="eye a"><i></i></div><div class="eye b"><i></i></div><div class="mouth"></div><span class="spark"></span></button>
<button class="obj" id="o-mirror" aria-label="Mirror under a dust sheet"><div class="writ">&#x2223; &#x2223; &#x2223; &#x2223;</div><div class="dust"></div><span class="spark"></span></button>
<button class="obj" id="o-clock" aria-label="Chained grandfather clock"><div class="hood"><div class="dial"><b class="h"></b><b class="m"></b></div></div><div class="trunk"><div class="glass"><div class="pend"></div></div><div class="door"></div></div><div class="base"></div><div class="chain a"></div><div class="chain b"></div><div class="lock"></div><span class="spark"></span></button>
<button class="obj" id="o-organ" aria-label="The ghost's pipe organ"><div class="pipes"><i style="height:60%"></i><i style="height:78%"></i><i style="height:92%"></i><i style="height:100%"></i><i style="height:92%"></i><i style="height:78%"></i><i style="height:60%"></i></div><div class="case"><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><div class="keys"></div></div><span class="music">&#9834;</span><span class="spark"></span></button>
<div class="halo"></div>
<button class="obj" id="o-candles" aria-label="Candelabra"><div class="arms"></div><div class="stem"></div><div class="foot"></div><div class="c" style="left:2%;top:18%"></div><div class="c" style="left:44%"></div><div class="c" style="right:2%;top:18%"></div><span class="spark"></span></button>
<button class="obj" id="o-board" aria-label="Spirit board"><div class="plan"></div><span class="spark"></span></button>
<div class="ghost"><div class="sheet"></div><i></i></div>
${[[40,70,0],[52,60,2],[46,82,4],[58,74,6],[44,50,3]].map(([l,t,d])=>`<div class="mote" style="left:${l}%;top:${t}%;animation-delay:${d}s"></div>`).join('')}
<div class="tint"></div>`,
  order:["portrait","board","candles","mirror","clock","organ"],
  revealOnWave2:[{sel:'#o-mirror',cls:'revealed'},{sel:'#o-clock',cls:'revealed'}],
  wave2Toast:"A cold wind! The dust sheet slid off the mirror and the chains fell from the clock.",
  finalReadyToast:"Five letters glow on the organ. Play the last word.",
  startToast:"Something is watching from the portrait. Tap anything that sparkles.",
  locks:{
    /* Solution: portraits HORACE(hat), CLARA(no glasses), BASIL(moustache), RUPERT(hat, moustache, no glasses, no bow tie),
       EDITH(no bow tie). Only MAUDE has no hat, glasses, no moustache and a bow tie. Dropping any one card leaves two suspects. */
    portrait:{wave:1,title:"Who Is Trapped?",obj:"o-portrait",answer:"MAUDE",kind:"word",tile:"A",
      scene:"The painted eyes follow you to a row of family portraits. A brass plate reads: <em>\"One of us never left. Name them, and they may speak.\"</em> The old staff each remember one thing.",
      extra:`<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:#1a1222;padding:10px;border-radius:12px">${GHOSTS.map(portrait).join('')}</div>`,
      cards:["<b>The maid:</b> \"The trapped one never wore a hat. Not once, not even at funerals.\"","<b>The gardener:</b> \"Couldn't see a thing without their spectacles. Wore them every day.\"","<b>The cook:</b> \"No moustache. I would remember. Moustaches get in the soup.\"","<b>The butler:</b> \"Always wore a bow tie. Even to bed, I'm told.\""],
      hints:["Each card rules some portraits out. Cross them off one card at a time.","After the hat and spectacles cards, only Maude, Basil and Edith are left. Now check moustaches and bow ties.","Only one portrait has no hat, glasses, no moustache and a bow tie. The answer is MAUDE."]},
    /* Solution: board rows ABCDEF/GHIJKL/MNOPQR/STUVWX/YZ(moon)(sun). Start on moon (row 5, col 3).
       3 up 1 left = H; 1 up 3 right = E; 1 down 1 right = L; 1 down 2 left = P; 3 left = M; 2 up 4 right = E. HELPME. */
    board:{wave:1,title:"The Spirit Board",obj:"o-board",answer:"HELPME",kind:"word",tile:"E",
      scene:"The pointer on the spirit board twitches. It starts on the <b>moon</b>, then slides six times. Each move starts from where the last one stopped. Follow it and read the six letters it lands on.",
      extra:boardSVG(),
      cards:["Move 1: three up, one left","Move 2: one up, three right","Move 3: one down, one right","Move 4: one down, two left","Move 5: three left","Move 6: two up, four right"],cardClass:"hand",
      hints:["Find the moon on the bottom row. Every move starts where the last one ended, so do them in order.","From the moon, three up and one left lands on H. Then one up and three right lands on E.","The pointer spells H, E, L, P, M, E. The answer is HELPME."]},
    /* Solution: 3 candles = 18 so candle 6. 6 + 2 bats = 10 so bat 2. 2 + 2 spiders = 20 so spider 9.
       2 owls + 9 = 17 so owl 4. Code owl, bat, spider, candle = 4 2 9 6 = 4296. */
    candles:{wave:1,title:"The Candelabra Sums",obj:"o-candles",answer:"4296",kind:"num",tile:"C",
      scene:"Scratched into the base of the candelabra are little picture sums. Every picture stands for one number from 1 to 9. Work them out to get the code.",
      wideCards:true,cards:[eq('candle','candle','candle',18),eq('candle','bat','bat',10),eq('bat','spider','spider',20),eq('owl','owl','spider',17),`<div style="text-align:center">The code is:<br>${ICON.owl} ${ICON.bat} ${ICON.spider} ${ICON.candle}</div>`],
      hints:["Start with the sum that uses only one kind of picture.","Three candles make 18, so a candle is 6. Use that to find the bat, then the spider, then the owl.","Candle 6, bat 2, spider 9, owl 4. In code order the answer is 4296."]},
    /* Solution: each card is the left half of a letter; the mirror line completes it: M, Y, T, H = MYTH. */
    mirror:{wave:2,title:"The Half Message",obj:"o-mirror",answer:"MYTH",kind:"word",tile:"E",
      lockedMsg:"The mirror is under a heavy dust sheet. Crack two of the first locks to shift it.",
      scene:"With the sheet gone, you see the ghost wrote on the glass. But ghosts have no reflection, so she only wrote the <b>left half</b> of each letter. The mirror line is on the right. Finish each letter with its reflection.",
      cards:[halfLetter('M',1),halfLetter('Y',2),halfLetter('T',3),halfLetter('H',4)],
      hints:["Imagine folding each card along the dotted line. What would the whole letter look like?","Letter 1 becomes M once you add its mirror image. Letter 4 has a bar across the middle.","The letters are M, Y, T and H. The ghost insists it is no MYTH."]},
    /* Solution: symbols decode with the four keys: > = T (X key), V with dot = W (dotted X key), square = E (grid key),
       corner with dot = L (dotted grid key), upward wedge = V (X key), square = E. TWELVE. */
    clock:{wave:2,title:"The Spider's Code",obj:"o-clock",answer:"TWELVE",kind:"word",tile:"P",
      lockedMsg:"The clock is wrapped in chains. Crack two of the first locks to loosen them.",
      openClass:"open",
      scene:"Inside the clock case, a spider has spun six symbols. Each symbol is the shape of the lines around a letter in one of the spider's keys. A dot means the letter comes from a key with dots.",
      extra:`<div style="display:flex;justify-content:center;gap:6px;background:#140e1c;border:1px solid #3a2a48;border-radius:12px;padding:12px 6px">${'TWELVE'.split('').map(c=>glyph(c)).join('')}</div>`,
      cards:[keyCard('Web key 1',gridKey(65,false)),keyCard('Web key 2 (dots)',gridKey(74,true)),keyCard('Web key 3',xKey(83,false)),keyCard('Web key 4 (dots)',xKey(87,true))],
      hints:["A full square is the middle box of a grid. An arrow shape comes from one of the X keys.","A square with no dot is E, the middle of key 1. A shape like a V with a dot is the top of key 4.","The symbols spell T, W, E, L, V, E. The answer is TWELVE, the hour the ghost got stuck."]},
    /* Tiles A, E, C, E, P. Only English anagram: PEACE. */
    organ:{wave:3,title:"Maude's Organ",obj:"o-organ",answer:"PEACE",kind:"word",
      scene:"Every lock you crack drops a glowing letter onto the organ. Maude floats over your shoulder. <em>\"A hundred years of rattling chains. All I want now is a bit of...\"</em>",
      hints:["What does a tired ghost need to finally rest?","It starts with P and is the opposite of war.","The answer is PEACE."]}
  },
  finale:{tag:"SET FREE",titleHTML:"MAUDE IS<br><span>FREE</span>",
    cardHTML:`<h3>Thank you, dears</h3>The organ plays one long, happy chord. The windows rattle, the candles flare green, and Maude Ashgrove drifts up through the ceiling for the first time in a hundred years, waving her spectacles.<div class="note">"I left you something under the floorboards: my famous ghost-story book. Read it with the lights off. Love, Maude."</div>`}
};
EXP_ORDER.push(ID);
})();
