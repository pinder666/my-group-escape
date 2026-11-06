(function(){
const ID='undersea-delivery', P=`.scene[data-exp="${ID}"]`;
const A='assets/undersea-delivery/';

/* ---------- sonar (lock: sonar) ----------
   Rings are 50 m apart (ring 1 = 50 m, ring 2 = 100 m, ring 3 = 150 m). Bearings N, NE, E, SE, S, SW, W, NW (index 0..7). */
const SONAR=[
  'KMOLRUAE',   // ring 1 (50 m)
  'TBSHDNOP',   // ring 2 (100 m)
  'CGYTVIFW'    // ring 3 (150 m)
];
const BEAR=['N','NE','E','SE','S','SW','W','NW'];
const PINGS=[[150,'NE'],[50,'S'],[100,'W'],[100,'N'],[150,'SE'],[50,'E']]; // -> G R O T T O
function sonarSVG(){
  const c=120; let g='';
  [32,64,96].forEach(r=>g+=`<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#3dff9a" stroke-opacity=".45" stroke-width="1.2"/>`);
  BEAR.forEach((b,i)=>{const a=(-90+45*i)*Math.PI/180;
    g+=`<line x1="${c}" y1="${c}" x2="${(c+96*Math.cos(a)).toFixed(1)}" y2="${(c+96*Math.sin(a)).toFixed(1)}" stroke="#3dff9a" stroke-opacity=".22"/>`;
    g+=`<text x="${(c+110*Math.cos(a)).toFixed(1)}" y="${(c+110*Math.sin(a)+4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#ffd34d" font-family="Inter,sans-serif">${b}</text>`;
    SONAR.forEach((row,k)=>{const r=32*(k+1);
      g+=`<circle cx="${(c+r*Math.cos(a)).toFixed(1)}" cy="${(c+r*Math.sin(a)).toFixed(1)}" r="8" fill="#062a1a"/><text x="${(c+r*Math.cos(a)).toFixed(1)}" y="${(c+r*Math.sin(a)+4.5).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="#b9ffd6" font-family="Inter,sans-serif">${row[i]}</text>`;});
  });
  return `<svg viewBox="0 0 240 240" role="img" aria-label="Sonar screen with letters on three rings" style="max-width:290px;display:block;margin:0 auto"><circle cx="${c}" cy="${c}" r="118" fill="#0a1c16"/><circle cx="${c}" cy="${c}" r="100" fill="#06140f" stroke="#2a4a3c" stroke-width="3"/>${g}<path d="M${c-6} ${c+3} h12 l-2 4 h-8z M${c-3} ${c+3} v-5 h6 v5" fill="#ffd34d"/><circle cx="${c}" cy="${c}" r="2" fill="#ffd34d"/></svg><p class="scene-txt" style="margin:6px 0 0;text-align:center;font-size:12px">The little yellow sub in the middle is you.</p>`;
}

/* ---------- fish log (lock: porthole) ----------
   S striped, Y yellow, B blue, P puffer. d:'R' nose points right, 'L' nose points left. */
const FISH=[
  {t:'S',x:30,y:28,d:'R'},{t:'Y',x:84,y:24,d:'L'},{t:'B',x:136,y:32,d:'L'},{t:'P',x:190,y:26,d:'R'},{t:'Y',x:242,y:30,d:'L'},{t:'S',x:296,y:25,d:'L'},
  {t:'B',x:36,y:72,d:'R'},{t:'P',x:90,y:70,d:'L'},{t:'Y',x:144,y:74,d:'L'},{t:'S',x:198,y:69,d:'R'},{t:'P',x:252,y:73,d:'L'},
  {t:'Y',x:28,y:116,d:'R'},{t:'S',x:82,y:118,d:'R'},{t:'B',x:136,y:114,d:'L'},{t:'P',x:190,y:118,d:'L'},{t:'Y',x:244,y:114,d:'L'},{t:'B',x:298,y:117,d:'R'},
  {t:'P',x:34,y:160,d:'L'},{t:'S',x:140,y:162,d:'L'},{t:'Y',x:194,y:158,d:'L'},{t:'P',x:248,y:161,d:'R'},{t:'B',x:300,y:160,d:'L'}
];
function fishShape(t){
  const eye=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/><circle cx="${x+.6}" cy="${y}" r="1.3" fill="#111"/>`;
  if(t==='S') return `<path d="M-13 0 L-23 -9 L-23 9Z" fill="#e8661a"/><ellipse rx="16" ry="9" fill="#ff8a2a" stroke="#b84a0c" stroke-width="1"/><path d="M-5 -8V8M6 -8V8" stroke="#fff" stroke-width="3.6"/>${eye(11,-2)}`;
  if(t==='Y') return `<path d="M-11 0 L-20 -8 L-20 8Z" fill="#e8b81a"/><path d="M-6 -9 Q2 -18 8 -9Z" fill="#e8b81a"/><ellipse rx="13" ry="11" fill="#ffd23a" stroke="#b8901a" stroke-width="1"/>${eye(7,-3)}`;
  if(t==='B') return `<path d="M-15 0 L-25 -8 L-21 0 L-25 8Z" fill="#2563c9"/><ellipse rx="17" ry="6" fill="#3d8bff" stroke="#1c4fa8" stroke-width="1"/><path d="M-12 0H10" stroke="#1c4fa8" stroke-width="1.6"/>${eye(11,-1.5)}`;
  return `<path d="M-9 0 L-17 -6 L-17 6Z" fill="#d86aa6"/>${[0,45,90,135,180,225,270,315].map(a=>`<path d="M0 -10 L1.6 -13.5 L-1.6 -13.5Z" fill="#c2508a" transform="rotate(${a})"/>`).join('')}<circle r="10" fill="#f28cc0" stroke="#c2508a" stroke-width="1"/><circle cx="-4" cy="3" r="1.6" fill="#c2508a"/><circle cx="1" cy="6" r="1.4" fill="#c2508a"/><circle cx="-2" cy="-4" r="1.3" fill="#c2508a"/>${eye(5,-2)}`;
}
const fishAt=f=>`<g transform="translate(${f.x} ${f.y}) scale(${f.d==='L'?-1:1} 1)">${fishShape(f.t)}</g>`;
const fishIcon=(t,d)=>`<svg viewBox="-27 -15 54 30" width="46" height="26" style="vertical-align:middle;margin-left:4px"><g transform="scale(${d==='L'?-1:1} 1)">${fishShape(t)}</g></svg>`;
function fishSVG(){
  const kelp=[[60,1],[118,.8],[222,1.1],[272,.9]].map(([x,s])=>`<path d="M${x} 190 C${x-8} 170 ${x+8} 150 ${x} 130 C${x-8} 115 ${x+6} 100 ${x} ${190-110*s}" fill="none" stroke="#2f8f5a" stroke-width="5" stroke-linecap="round" opacity=".6"/>`).join('');
  return `<svg viewBox="0 0 330 190" role="img" aria-label="View out of the porthole: a school of fish"><defs><linearGradient id="ud-fw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b7fa6"/><stop offset="1" stop-color="#0a3a5c"/></linearGradient></defs><rect width="330" height="190" fill="url(#ud-fw)"/>${kelp}<path d="M0 182 Q80 172 165 180 T330 178 V190 H0Z" fill="#e8cf8a"/>${FISH.map(fishAt).join('')}</svg>`;
}

/* ---------- current chart (lock: chart) ---------- */
const GRID=['STAKM','OFREL','NIPUW','CSDGB','YH VJ'];         // E3 (row 4, col 2) = grotto, no letter
const ARROWS=['>>v<v','^v<<^','>v<^<','^v>^<','>> <^'];
const ARW={'>':'→','<':'←','^':'↑','v':'↓',' ':''};
function chartSVG(){
  let g='';
  for(let r=0;r<5;r++){ g+=`<text x="10" y="${42+r*44}" text-anchor="middle" font-size="13" font-weight="700" fill="#ffd34d" font-family="Inter,sans-serif">${'ABCDE'[r]}</text>`;
    for(let c=0;c<5;c++){ const x=22+c*44, y=20+r*44;
      g+=`<rect x="${x}" y="${y}" width="42" height="42" rx="5" fill="${r===4&&c===2?'#5a3a1a':'#f3e6c4'}" stroke="#8a6a3a"/>`;
      if(r===4&&c===2) g+=`<path d="M${x+6} ${y+38} Q${x+21} ${y+4} ${x+36} ${y+38}Z" fill="#1a0f06"/><image href="${A}present-01.svg" x="${x+13}" y="${y+20}" width="16" height="16"/>`;
      else g+=`<text x="${x+21}" y="${y+29}" text-anchor="middle" font-size="21" font-weight="700" fill="#2a3a4a" font-family="Inter,sans-serif">${GRID[r][c]}</text>`;
    }}
  for(let c=0;c<5;c++) g+=`<text x="${43+c*44}" y="14" text-anchor="middle" font-size="12" font-weight="700" fill="#ffd34d" font-family="Inter,sans-serif">${c+1}</text>`;
  g+=`<g transform="translate(23 21) scale(.8)"><path d="M0 9 h12 l-2 4 h-8z M3 9 v-5 h6 v5" fill="#e8a020"/></g>`;
  return `<svg viewBox="0 0 244 244" role="img" aria-label="Seabed chart: a five by five grid of letters" style="max-width:300px;display:block;margin:0 auto">${g}</svg><p class="scene-txt" style="margin:6px 0 0;text-align:center;font-size:12px">The sub starts in square A1 (top left). The grotto is the cave in E3.</p>`;
}
const rowCard=r=>`<b>Row ${'ABCDE'[r]} currents</b><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:3px;margin-top:6px;text-align:center">${[...ARROWS[r]].map((a,c)=>`<span style="background:#e6eef5;border-radius:5px;padding:2px 0;color:#1a4a7a"><small style="display:block;font-size:10px;color:#6a7a8a">${c+1}</small><b style="font-size:20px;line-height:1.1">${ARW[a]||'·'}</b></span>`).join('')}</div>`;

/* ---------- grabber camera (lock: grabber, hidden-object mini-game) ----------
   Shells numbered 1..7 along the seabed, columns at x = 10 + 20*(n-1) in a 140x100 scene.
   Targets: red box (col 5), blue box (col 2), purple box (col 7), yellow box (col 3). Decoys: orange box (col 1), green box (col 4). */
const PRES=[
  {f:'present-07.svg',col:5,y:38,name:'red present'},
  {f:'present-04.svg',col:2,y:66,name:'blue present'},
  {f:'present-02.svg',col:7,y:24,name:'purple present'},
  {f:'present-05.svg',col:3,y:56,name:'yellow present'}
];
const DECOY=[{f:'present-01.svg',col:1,y:48},{f:'present-03.svg',col:4,y:70}];
const colX=n=>10+20*(n-1);
function coral(x,y,s,c){return `<g transform="translate(${x} ${y}) scale(${s})" fill="${c}"><path d="M0 0 C-1 -6 -6 -8 -7 -14 C-8 -18 -5 -19 -4 -15 C-3 -11 -1 -10 0 -13 C1 -18 0 -22 2 -23 C4 -24 5 -20 3 -15 C2 -11 4 -10 6 -14 C8 -18 10 -17 9 -13 C8 -9 4 -6 3 0Z"/></g>`}
function fan(x,y,s,c){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 C-10 -4 -12 -16 -6 -22 C0 -26 6 -26 10 -21 C14 -15 10 -4 0 0Z" fill="${c}" opacity=".95"/><path d="M0 0 L-6 -20 M0 0 L0 -24 M0 0 L7 -20 M0 0 L-9 -12 M0 0 L10 -12" stroke="#00000033" stroke-width=".8"/></g>`}
function grabberScene(){
  const pres=[...PRES,...DECOY].map(p=>`<image href="${A}${p.f}" x="${colX(p.col)-4.5}" y="${p.y-4.5}" width="9" height="9"/>`).join('');
  const shells=[1,2,3,4,5,6,7].map(n=>`<line x1="${colX(n)}" y1="6" x2="${colX(n)}" y2="86" stroke="#bfe6ff" stroke-width=".35" stroke-dasharray="1.5 2" opacity=".55"/><path d="M${colX(n)-5} 94 Q${colX(n)} 82 ${colX(n)+5} 94Z" fill="#f6d9b8" stroke="#c99a6a" stroke-width=".5"/><text x="${colX(n)}" y="93" text-anchor="middle" font-size="6.5" font-weight="700" fill="#7a4a2a" font-family="Inter,sans-serif">${n}</text>`).join('');
  const front=[coral(-1,62,1,'#ff6f61'),fan(37,64,.8,'#f2a33a'),coral(97,48,.9,'#e85a9a'),fan(20,80,.7,'#ff8a65'),coral(76,80,.9,'#ff6f61'),fan(139,38,.7,'#c86ad8'),coral(112,70,1.1,'#ffb74d'),coral(60,86,.7,'#e85a9a'),coral(100,86,.7,'#ff6f61'),coral(141,86,.8,'#f2a33a'),fan(20,86,.4,'#c86ad8'),fan(62,46,.6,'#ff8a65'),coral(118,40,.7,'#e85a9a')].join('');
  const kelp=[4,25,61,79,103,121,138].map((x,i)=>`<path d="M${x} 100 C${x-4} 80 ${x+4} 60 ${x} ${30+i*3}" fill="none" stroke="#2f9e6a" stroke-width="2.2" opacity=".75"/>`).join('');
  return `<svg viewBox="0 0 140 100" preserveAspectRatio="none" role="img" aria-label="Grabber camera view of the coral reef"><defs><linearGradient id="ud-gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a9cc4"/><stop offset="1" stop-color="#0c4a6e"/></linearGradient></defs><rect width="140" height="100" fill="url(#ud-gw)"/><path d="M20 0 L34 0 L22 100 L4 100Z M70 0 L80 0 L76 100 L60 100Z" fill="#fff" opacity=".06"/><image href="${A}reef.png" x="0" y="60" width="140" height="22" preserveAspectRatio="none" opacity=".7"/><rect y="84" width="140" height="16" fill="#e8cf8a"/>${shells}${kelp}${pres}${front}<image href="${A}fish-a.png" x="96" y="10" width="20" height="8"/><image href="${A}fish-c.png" x="40" y="16" width="12" height="8"/><image href="${A}crab.png" x="115.5" y="86" width="9" height="7.5"/></svg>`;
}
const presIcon=f=>`<img src="${A}${f}" alt="" style="height:26px;vertical-align:middle;margin-right:6px">`;

EXPERIENCES[ID]={
  id:ID, title:"The Undersea Delivery", titleHTML:"THE UNDERSEA<br><span>DELIVERY</span>", season:"Christmas", collection:'christmas',
  tag:"A Christmas Eve escape room",
  blurb:"One sack of presents slipped off the sleigh and sank into the ocean. You're the elves who borrowed a little submarine to fetch it from a sunken grotto. Crack six locks and get the sack back before morning.",
  menuBlurb:"A sack of presents fell into the sea. Take the elves' submarine down and fetch it before morning.",
  menuLine:"Dive for the lost sack",
  theme:{accent:'#3fd6c8',accent2:'#9ff5ea',bg:'#06121a',introBg:'#06324a',door:'#2c5a66',doorFrame:'#14262c',boxColor:'linear-gradient(#a0602a,#6a3a14)'},
  sceneCSS:`
${P}{background:#132a32}
${P} .wall{position:absolute;inset:0;background:radial-gradient(circle,#5c7a82 0 1.4px,transparent 1.8px) 0 0/22px 22px,linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px) 0 0/88px 100%,linear-gradient(#24474f,#1a363d 60%,#12272c)}
${P} .pipe{position:absolute;background:linear-gradient(#8a9aa0,#c9d4d8 40%,#5a6a70);border-radius:6px;box-shadow:0 3px 6px rgba(0,0,0,.5)}
${P} .pipe.top{left:0;right:0;top:1%;height:2.2%}
${P} .pipe.side{right:1.5%;top:1%;width:3%;height:52%;background:linear-gradient(90deg,#8a9aa0,#c9d4d8 40%,#5a6a70)}
${P} .valve{position:absolute;right:.2%;top:26.5%;width:6%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#222 0 18%,#c8323a 20% 60%,#7a1418 62%);box-shadow:0 2px 4px #000;animation:${ID}-spin 9s linear infinite}
${P} .drip{position:absolute;right:2.3%;top:30.5%;width:5px;height:7px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:#9fe8ff;opacity:0;animation:${ID}-drip 3.2s ease-in infinite}
/* porthole */
${P} #o-porthole{left:3%;top:4%;width:64%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#b7c4c8 0 64%,#6a7a80 66%,#d6e0e3 70%,#7a8a90 74%);box-shadow:0 8px 18px rgba(0,0,0,.6),inset 0 0 0 3px #3a4a50}
${P} #o-porthole .bolt{position:absolute;width:5%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#eef3f5,#6a7a80);box-shadow:0 1px 2px #000}
${P} #o-porthole .sea{position:absolute;inset:9%;border-radius:50%;overflow:hidden;background:linear-gradient(#1f8fb8,#0c5a80 45%,#06304c);box-shadow:inset 0 0 24px rgba(0,0,0,.7)}
${P} .ray{position:absolute;top:-10%;width:14%;height:90%;background:linear-gradient(rgba(255,255,255,.22),transparent);transform-origin:50% 0;animation:${ID}-ray 7s ease-in-out infinite alternate}
${P} .sea .reef{position:absolute;left:-5%;width:110%;bottom:12%;height:22%;object-fit:fill;opacity:.85}
${P} .sea .sand{position:absolute;left:0;right:0;bottom:0;height:16%;background:linear-gradient(#ead28e,#c9ae6a);border-radius:40% 60% 0 0/30% 30% 0 0}
${P} .sea .tree{position:absolute;left:14%;bottom:8%;height:30%}
${P} .sea .pile{position:absolute;left:44%;bottom:6%;height:15%;filter:brightness(.8) saturate(.9)}
${P} .sea .crab{position:absolute;bottom:4%;height:10%;left:20%;animation:${ID}-crab 11s ease-in-out infinite alternate}
${P} .kelp{position:absolute;bottom:4%;width:8%;transform-origin:50% 100%;animation:${ID}-kelp 4s ease-in-out infinite alternate}
${P} .fishy{position:absolute;left:110%;animation:${ID}-swimL linear infinite}
${P} .fishy.r{animation-name:${ID}-swimR;transform:scaleX(-1)}
${P} .bub{position:absolute;bottom:-6%;border-radius:50%;border:1.5px solid rgba(220,250,255,.75);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.6),transparent 50%);animation:${ID}-bub linear infinite}
${P} .angler{position:absolute;right:6%;bottom:20%;width:36%;animation:${ID}-bob 5s ease-in-out infinite}
${P} .angler .lure{animation:${ID}-glow 1.6s ease-in-out infinite alternate}
${P} .glass{position:absolute;inset:9%;border-radius:50%;background:linear-gradient(135deg,rgba(255,255,255,.22) 0 18%,transparent 34%);pointer-events:none}
/* depth gauge */
${P} #o-depth{right:6%;top:6%;width:25%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#f4efe0 0 58%,#c9a24a 60% 66%,#8a6420 68% 72%,#e0c070 74%);box-shadow:0 6px 12px rgba(0,0,0,.55)}
${P} #o-depth .ticks{position:absolute;inset:14%;border-radius:50%;background:repeating-conic-gradient(from -135deg,#333 0 2deg,transparent 2deg 27deg);-webkit-mask:radial-gradient(circle,transparent 0 70%,#000 71%);mask:radial-gradient(circle,transparent 0 70%,#000 71%)}
${P} #o-depth .lbl{position:absolute;left:0;right:0;top:60%;text-align:center;font:700 7px Inter,sans-serif;letter-spacing:1px;color:#5a4a2a}
${P} #o-depth .needle{position:absolute;left:48.5%;top:20%;width:3%;height:32%;background:#c8323a;border-radius:2px;transform-origin:50% 94%;animation:${ID}-needle 3s ease-in-out infinite alternate}
${P} #o-depth .hub{position:absolute;left:44%;top:44%;width:12%;aspect-ratio:1;border-radius:50%;background:#333}
${P} #o-depth.solved .needle{animation:none;transform:rotate(118deg);transition:transform 1s}
/* grabber camera monitor (wave 2) */
${P} #o-camera{right:3%;top:34%;width:30%;height:17%;background:linear-gradient(#3a4a50,#1e2a2e);border-radius:8px;box-shadow:0 6px 12px rgba(0,0,0,.55),inset 0 0 0 2px #56686e}
${P} #o-camera .scr{position:absolute;left:8%;right:8%;top:10%;bottom:20%;border-radius:6px;overflow:hidden;background:#0b1214}
${P} #o-camera .static{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 1px,transparent 1px 3px);animation:${ID}-static .25s steps(2) infinite}
${P} #o-camera .off{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:700 8px Inter,sans-serif;letter-spacing:1px;color:#5a6a70;transition:opacity .8s}
${P} #o-camera .feed{position:absolute;inset:0;opacity:0;transition:opacity 1s .3s;background:linear-gradient(#2a9cc4,#0c4a6e)}
${P} #o-camera .feed img{position:absolute}
${P} #o-camera .claw{position:absolute;left:44%;top:-6%;width:16%;animation:${ID}-claw 3s ease-in-out infinite alternate}
${P} #o-camera .rec{position:absolute;right:7%;bottom:7%;width:6%;aspect-ratio:1;border-radius:50%;background:#4a1418}
${P} #o-camera.revealed .feed{opacity:1} ${P} #o-camera.revealed .off{opacity:0}
${P} #o-camera.revealed .rec{background:#ff3a3a;box-shadow:0 0 6px #ff3a3a;animation:${ID}-blink 1s steps(2) infinite}
/* console desk */
${P} .desk{position:absolute;left:0;right:0;top:53%;bottom:0;background:linear-gradient(#3a4e54,#26363b 12%,#1c292d);box-shadow:0 -4px 10px rgba(0,0,0,.45)}
${P} .desk::before{content:"";position:absolute;left:0;right:0;top:0;height:2.4%;background:linear-gradient(#9aaab0,#5a6a70)}
${P} .btn-l{position:absolute;width:3%;aspect-ratio:1;border-radius:50%;animation:${ID}-blink 1.4s steps(2) infinite}
/* sonar */
${P} #o-sonar{left:4%;top:56%;width:34%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,transparent 0 62%,#1a2a24 63% 68%,#7a8a90 69% 74%,#3a4a50 75%);box-shadow:0 6px 12px rgba(0,0,0,.6)}
${P} #o-sonar .scr{position:absolute;inset:12%;border-radius:50%;overflow:hidden;background:repeating-radial-gradient(circle,#06261a 0 15%,#1f7a4a 15.6% 16.4%),#06261a}
${P} #o-sonar .scr::before{content:"";position:absolute;inset:0;background:linear-gradient(#1f7a4a,#1f7a4a) 50% 0/1px 100% no-repeat,linear-gradient(#1f7a4a,#1f7a4a) 0 50%/100% 1px no-repeat}
${P} #o-sonar .sweep{position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 0deg,rgba(61,255,154,.55),rgba(61,255,154,0) 70deg,transparent);animation:${ID}-spin 3s linear infinite}
${P} #o-sonar .blip{position:absolute;width:7%;aspect-ratio:1;border-radius:50%;background:#b9ffd6;box-shadow:0 0 6px #3dff9a;animation:${ID}-ping 3s linear infinite}
/* current chart (wave 2) */
${P} #o-chart{left:43%;top:56.5%;width:53%;height:17%;background:#2a2016;border-radius:6px;box-shadow:0 6px 12px rgba(0,0,0,.55),inset 0 0 0 3px #6a5a3a;overflow:hidden}
${P} #o-chart .map{position:absolute;inset:7%;background:#f3e6c4;border-radius:3px;background-image:linear-gradient(#c9b48a 1px,transparent 1px),linear-gradient(90deg,#c9b48a 1px,transparent 1px);background-size:20% 20%}
${P} #o-chart .map i{position:absolute;font-style:normal;font:700 11px Inter,sans-serif;color:#1a6aa8}
${P} #o-chart .shutter{position:absolute;inset:0;background:repeating-linear-gradient(#8a9aa0 0 7px,#5a6a70 7px 9px);transform-origin:50% 0;transition:transform 1.4s cubic-bezier(.6,.05,.3,1);box-shadow:inset 0 -6px 0 #3a4a50;z-index:2}
${P} #o-chart .shutter::after{content:"";position:absolute;left:44%;bottom:12%;width:12%;height:30%;border-radius:3px;background:linear-gradient(#ffd34d,#b8862b);box-shadow:0 0 0 2px #6a5014}
${P} #o-chart.revealed .shutter{transform:scaleY(.06)}
/* airlock with chest (final) */
${P} #o-airlock{left:38%;top:76.5%;width:58%;height:21%;background:linear-gradient(#5a6e74,#36464c);border-radius:14px;box-shadow:0 6px 14px rgba(0,0,0,.6),inset 0 0 0 3px #7a8e94}
${P} #o-airlock .win{position:absolute;left:6%;top:8%;width:62%;height:62%;border-radius:40px;background:linear-gradient(#0c5a80,#06304c);box-shadow:inset 0 0 0 3px #1a2a2e,inset 0 0 14px #000;overflow:hidden}
${P} #o-airlock .win img{position:absolute;left:50%;bottom:6%;height:74%;transform:translateX(-50%);transition:opacity .8s}
${P} #o-airlock .win .open{opacity:0}
${P} #o-airlock.solved .win .open{opacity:1} ${P} #o-airlock.solved .win .shut{opacity:0}
${P} #o-airlock .wheel{position:absolute;right:5%;top:10%;width:22%;aspect-ratio:1;border-radius:50%;border:4px solid #e0a030;box-shadow:0 2px 4px #000,inset 0 0 0 2px #8a5a14;background:radial-gradient(circle,#ffd34d 0 14%,#8a5a14 15% 19%,transparent 20%),linear-gradient(90deg,transparent 44%,#e0a030 44% 56%,transparent 56%),linear-gradient(0deg,transparent 44%,#e0a030 44% 56%,transparent 56%);transition:transform 1.5s}
${P} #o-airlock .wheel::after{content:"";position:absolute;inset:-14%;background:radial-gradient(circle,#ffd34d 0 50%,transparent 55%) 50% 0/22% 22% no-repeat,radial-gradient(circle,#ffd34d 0 50%,transparent 55%) 50% 100%/22% 22% no-repeat,radial-gradient(circle,#ffd34d 0 50%,transparent 55%) 0 50%/22% 22% no-repeat,radial-gradient(circle,#ffd34d 0 50%,transparent 55%) 100% 50%/22% 22% no-repeat}
${P} #o-airlock.solved .wheel{transform:rotate(540deg)}
${P} #o-airlock .lights{position:absolute;left:6%;right:6%;bottom:9%;display:flex;justify-content:space-between}
${P} #o-airlock .lights b{width:10%;aspect-ratio:1;border-radius:50%;background:#1a3238;box-shadow:inset 0 0 0 1px #000}
${P} #o-airlock .lights b.on{background:#7dfff0;box-shadow:0 0 8px #3fd6c8}
${P} .elf{position:absolute;left:4%;top:80%;height:18%;animation:${ID}-bob 3s ease-in-out infinite}
${P} .elf2{position:absolute;left:21%;top:83%;height:14%;transform:scaleX(-1);animation:${ID}-bob2 3.4s ease-in-out infinite}
${P} .tint{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 35% 26%,rgba(63,214,200,.16),transparent 50%);animation:flicker 5s infinite;z-index:3}
@keyframes ${ID}-spin{to{transform:rotate(360deg)}}
@keyframes ${ID}-drip{0%,55%{opacity:0;transform:translateY(0)}60%{opacity:1}100%{opacity:0;transform:translateY(300%)}}
@keyframes ${ID}-ray{from{transform:rotate(-12deg)}to{transform:rotate(10deg)}}
@keyframes ${ID}-kelp{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes ${ID}-swimL{from{left:110%}to{left:-35%}}
@keyframes ${ID}-swimR{from{left:-35%}to{left:110%}}
@keyframes ${ID}-bub{from{transform:translateY(0);opacity:0}10%{opacity:1}to{transform:translateY(-900%) translateX(6px);opacity:0}}
@keyframes ${ID}-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
@keyframes ${ID}-bob2{0%,100%{transform:scaleX(-1) translateY(0)}50%{transform:scaleX(-1) translateY(-3px)}}
@keyframes ${ID}-glow{from{opacity:.55}to{opacity:1}}
@keyframes ${ID}-needle{from{transform:rotate(60deg)}to{transform:rotate(96deg)}}
@keyframes ${ID}-static{to{background-position:0 2px}}
@keyframes ${ID}-blink{50%{opacity:.25}}
@keyframes ${ID}-ping{0%,100%{opacity:.15}8%{opacity:1}40%{opacity:.3}}
@keyframes ${ID}-claw{from{transform:translateY(0)}to{transform:translateY(30%)}}
@keyframes ${ID}-crab{from{transform:translateX(0)}to{transform:translateX(260%)}}
`,
  sceneHTML:`
<div class="wall"></div><div class="pipe top"></div><div class="pipe side"></div><div class="valve"></div><div class="drip"></div>
<button class="obj" id="o-porthole" aria-label="Big porthole">
${[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<i class="bolt" style="left:${(47.5+45.5*Math.cos(r)).toFixed(1)}%;top:${(47.5+45.5*Math.sin(r)).toFixed(1)}%"></i>`}).join('')}
<div class="sea">
<div class="ray" style="left:18%"></div><div class="ray" style="left:52%;animation-delay:-3s;width:10%"></div>
<img class="reef" src="${A}reef.png" alt="">
<svg class="kelp" style="left:6%;height:52%" viewBox="0 0 20 100" preserveAspectRatio="none"><path d="M10 100 C2 80 18 60 10 40 C4 25 14 12 10 0" fill="none" stroke="#3aa86a" stroke-width="5" stroke-linecap="round"/><path d="M10 60 q8 -4 9 -12 M10 30 q-8 -4 -8 -12" fill="none" stroke="#3aa86a" stroke-width="3"/></svg>
<svg class="kelp" style="left:30%;height:38%;animation-delay:-1.5s" viewBox="0 0 20 100" preserveAspectRatio="none"><path d="M10 100 C2 80 18 60 10 40 C4 25 14 12 10 0" fill="none" stroke="#2f8f5a" stroke-width="5" stroke-linecap="round"/></svg>
<svg class="kelp" style="left:84%;height:46%;animation-delay:-2.6s" viewBox="0 0 20 100" preserveAspectRatio="none"><path d="M10 100 C2 80 18 60 10 40 C4 25 14 12 10 0" fill="none" stroke="#3aa86a" stroke-width="5" stroke-linecap="round"/><path d="M10 50 q8 -4 9 -12" fill="none" stroke="#3aa86a" stroke-width="3"/></svg>
<div class="sand"></div>
<img class="tree" src="${A}tree-small.png" alt="">
<img class="pile" src="${A}presents-pile.png" alt="">
<img class="crab" src="${A}crab.png" alt="">
<img class="fishy" src="${A}fish-b.png" alt="" style="top:16%;width:26%;animation-duration:13s;animation-delay:-4s">
<img class="fishy r" src="${A}fish-a.png" alt="" style="top:34%;width:18%;animation-duration:10s;animation-delay:-7s">
<img class="fishy" src="${A}fish-c.png" alt="" style="top:46%;width:13%;animation-duration:8s;animation-delay:-1s;filter:hue-rotate(150deg) saturate(1.6)">
<img class="fishy r" src="${A}fish-d.png" alt="" style="top:8%;width:22%;animation-duration:17s;animation-delay:-12s;filter:hue-rotate(-40deg)">
<svg class="angler" viewBox="0 0 100 70"><path d="M58 22 Q60 4 78 6" fill="none" stroke="#3a3048" stroke-width="2"/><circle class="lure" cx="79" cy="7" r="9" fill="#fff6a0" opacity=".35"/><circle class="lure" cx="79" cy="7" r="4.5" fill="#ffe84a"/><path d="M14 40 L0 26 L2 54Z" fill="#3a3048"/><ellipse cx="50" cy="42" rx="38" ry="24" fill="#4a3d5c"/><path d="M60 48 Q76 64 90 44 Q78 52 60 48Z" fill="#1a1222"/><path d="M64 50 l3 5 l2 -5 l3 6 l2 -6 l3 5 l2 -6" fill="none" stroke="#f4f4f4" stroke-width="1.6" stroke-linejoin="round"/><circle cx="70" cy="32" r="6" fill="#fff"/><circle cx="72" cy="32" r="3" fill="#111"/><path d="M36 22 l4 -8 l4 8 l4 -8 l4 8" fill="#3a3048"/></svg>
${[[12,0,5,6],[26,2.2,7,4],[48,1.1,6,5],[63,3.4,8,3],[78,.4,5,5],[90,2.8,6,4]].map(([l,d,s,w])=>`<i class="bub" style="left:${l}%;width:${w}%;aspect-ratio:1;animation-duration:${s}s;animation-delay:-${d}s"></i>`).join('')}
</div><div class="glass"></div><span class="spark"></span></button>
<button class="obj" id="o-depth" aria-label="Depth gauge"><div class="ticks"></div><div class="lbl">DEPTH m</div><div class="needle"></div><div class="hub"></div><span class="spark"></span></button>
<button class="obj" id="o-camera" aria-label="Grabber camera monitor"><div class="scr"><div class="feed"><img src="${A}reef.png" alt="" style="left:0;bottom:0;width:100%;height:40%"><img src="${A}present-07.svg" alt="" style="left:18%;bottom:22%;width:14%"><img src="${A}present-04.svg" alt="" style="left:66%;bottom:30%;width:12%"><svg class="claw" viewBox="0 0 20 30"><path d="M10 0 V16" stroke="#c9d4d8" stroke-width="2.5"/><path d="M10 16 L3 24 L6 29 M10 16 L17 24 L14 29" fill="none" stroke="#ffd34d" stroke-width="2.5" stroke-linecap="round"/></svg></div><div class="static"></div><div class="off">NO SIGNAL</div></div><div class="rec"></div><span class="spark"></span></button>
<div class="desk"></div>
${[[40,92,'#ff5a5a',0],[33,95,'#ffd34d',.5],[26,93,'#3dff9a',.9]].map(([l,t,c,d])=>`<i class="btn-l" style="left:${l}%;top:${t}%;background:${c};box-shadow:0 0 5px ${c};animation-delay:-${d}s"></i>`).join('')}
<button class="obj" id="o-sonar" aria-label="Sonar screen"><div class="scr"><div class="sweep"></div>${[[64,26,0],[30,60,1.1],[70,66,2]].map(([l,t,d])=>`<i class="blip" style="left:${l}%;top:${t}%;animation-delay:${d}s"></i>`).join('')}</div><span class="spark"></span></button>
<button class="obj" id="o-chart" aria-label="Current chart behind a shutter"><div class="map">${[[8,10,'→'],[30,10,'→'],[50,30,'↓'],[30,52,'←'],[70,50,'↑'],[50,72,'→']].map(([l,t,a])=>`<i style="left:${l}%;top:${t}%">${a}</i>`).join('')}</div><div class="shutter"></div><span class="spark"></span></button>
<button class="obj" id="o-airlock" aria-label="Present chest airlock"><div class="win"><img class="shut" src="${A}chest-closed.png" alt=""><img class="open" src="${A}chest-open.png" alt=""></div><div class="wheel"></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<img class="elf" src="${A}elf-diver.png" alt="">
<img class="elf2" src="${A}elf-diver.png" alt="">
<div class="tint"></div>`,
  order:["sonar","depth","porthole","chart","grabber","airlock"],
  revealOnWave2:[{sel:'#o-chart',cls:'revealed'},{sel:'#o-camera',cls:'revealed'}],
  wave2Toast:"The chart shutter just rattled up, and the grabber camera flickered on.",
  finalReadyToast:"Five tiles in the airlock. The chest is right outside the window.",
  startToast:"Tap anything that sparkles. Three locks are ready, and the sun comes up at six.",
  locks:{
    /* Sonar. Scale card: rings are 50 m apart (ring 1 = 50, ring 2 = 100, ring 3 = 150).
       150 NE = G, 50 S = R, 100 W = O, 100 N = T, 150 SE = T, 50 E = O -> GROTTO. */
    sonar:{wave:1,title:"The Sonar Pings",obj:"o-sonar",answer:"GROTTO",kind:"word",tile:"S",
      scene:"The sonar has bounced six pings off the seabed. Stuck to the screen: <em>\"Each ping lands on a letter. Read them in ping order and you'll know where the sack went.\"</em>",
      extra:sonarSVG,
      cards:["<b>Sonar scale:</b> the rings are <b>50 m</b> apart, counting out from the sub in the middle.",...PINGS.map(([m,b],i)=>`<b>Ping ${i+1}:</b> ${m} m away, bearing <b>${b}</b>.`)],
      hints:["You need the scale card first: how many metres is each ring?","Ring 1 is 50 m, ring 2 is 100 m, ring 3 is 150 m. Ping 1 is on the third ring, out toward NE.","G, R, O, T, T, O. The answer is GROTTO."]},
    /* Depth log, sorted by time: 0 +140 =140, -25 =115, x2 =230, -48 =182, +160 =342.
       (In card order you'd get a different number, which is the trap.) */
    depth:{wave:1,title:"The Dive Log",obj:"o-depth",answer:"342",kind:"num",tile:"T",
      scene:"The depth gauge is jammed. A note taped to it: <em>\"Set me to the grotto's depth. The last crew's dive log blew all over the cabin, so put it back in time order first.\"</em>",
      cardClass:"hand",
      cards:["<b>9:35 pm</b> Rose 48 m to squeeze over a reef.","<b>9:05 pm</b> Left the surface. Dove 140 m.","<b>9:45 pm</b> Dove another 160 m and touched the grotto floor. Made it!","<b>9:15 pm</b> A whale swam under us. Rose 25 m to be polite.","<b>9:25 pm</b> Saw something shiny. Dove until we were <b>twice as deep</b> as before."],
      hints:["Sort the log by time first. The order really matters because of the 'twice as deep' line.","140, then 115, then double it. Keep going.","140, 115, 230, 182, 342. The code is 342."]},
    /* Fish log. Picture counts: striped R3 L2, yellow R1 L5, blue R2 L3, puffer R2 L4 (22 fish).
       Asked: striped right 3, yellow left 5, blue right 2, puffer left 4 -> 3524. Ignoring direction gives 5656. */
    porthole:{wave:1,title:"The Fish Log",obj:"o-porthole",answer:"3524",kind:"num",tile:"I",
      scene:"A sign under the porthole: <em>\"SUB RULE 1: Log the fish before you move. The engine code is the count.\"</em> Each phone has one line of the fish log. Watch which way they're swimming.",
      extra:fishSVG,
      cards:[`<b>Digit 1:</b> striped fish with noses pointing <b>right</b>${fishIcon('S','R')}`,`<b>Digit 2:</b> yellow fish with noses pointing <b>left</b>${fishIcon('Y','L')}`,`<b>Digit 3:</b> blue fish with noses pointing <b>right</b>${fishIcon('B','R')}`,`<b>Digit 4:</b> pufferfish with noses pointing <b>left</b>${fishIcon('P','L')}`],
      hints:["Each phone counts only one kind of fish, and only the ones swimming one way. Look at where the eye is.","There are 5 striped fish in the picture, but only 3 face right. Do the same for the others.","3 striped right, 5 yellow left, 2 blue right, 4 puffers left. The code is 3524."]},
    /* Current chart. Combine row cards with the grid, start A1:
       A1 S > A2 T > A3 A v B3 R < B2 F v C2 I v D2 S v E2 H > E3 grotto -> STARFISH. Every row's card is used. */
    chart:{wave:2,title:"The Current Chart",obj:"o-chart",answer:"STARFISH",kind:"word",tile:"F",
      lockedMsg:"A steel shutter covers the chart. Crack two of the first locks to raise it.",
      scene:"The sub is low on power, so you'll have to ride the currents to the grotto. <em>\"Each square's current pushes you one square the way its arrow points. Read every letter you pass through, starting square included.\"</em>",
      extra:chartSVG,
      cards:[0,1,2,3,4].map(rowCard),
      hints:["Copy each phone's row of arrows onto the chart, then start at A1 and follow them.","A1 points right, A2 points right, A3 points down. That's S, T, A so far.","S, T, A, R, F, I, S, H, then the grotto. The answer is STARFISH."]},
    /* Grabber (hidden-object mini-game). Shell numbers under each target present:
       red 5, blue 2, purple 7, yellow 3 -> 5273. Orange (1) and green (4) boxes are decoys. */
    grabber:{wave:2,title:"The Grabber Arm",obj:"o-camera",answer:"5273",kind:"num",tile:"G",
      lockedMsg:"The camera says NO SIGNAL. Crack two of the first locks to power it up.",
      scene:"The sack burst and some presents are scattered through the coral. The grabber can only lift presents you tag on the camera. <em>Find your phone's present, then read the number on the shell directly below it.</em>",
      game:{type:'find',title:'Tag the four lost presents',aspect:'1.4',scene:grabberScene,
        targets:PRES.map(p=>({x:colX(p.col)/1.4,y:p.y,r:5,name:p.name})),
        reveal:'All four tagged. The grabber code is the shell numbers in <b>phone order</b>.'},
      cards:[`${presIcon('present-07.svg')}<b>Phone 1:</b> the <b>red</b> box with the lime ribbon. Its shell is digit 1.`,`${presIcon('present-04.svg')}<b>Phone 2:</b> the <b>blue</b> box with the orange ribbon. Its shell is digit 2.`,`${presIcon('present-02.svg')}<b>Phone 3:</b> the <b>purple</b> box with the green ribbon. Its shell is digit 3.`,`${presIcon('present-05.svg')}<b>Phone 4:</b> the <b>yellow</b> box with the purple ribbon. Its shell is digit 4.`],
      hints:["Two presents in the reef aren't on anyone's card. Ignore the orange box and the green box.","Follow the dotted line straight down from each present to its numbered shell. The red one is above shell 5.","Red 5, blue 2, purple 7, yellow 3. The code is 5273."]},
    /* Final: tiles S,T,I,F,G -> GIFTS (the only English anagram). */
    airlock:{wave:3,title:"The Present Chest",obj:"o-airlock",answer:"GIFTS",kind:"word",
      scene:"The grabber has dragged the treasure chest into the airlock, and the lost presents are tucked inside. Every lock you crack drops a letter into the airlock panel. <em>\"Spell what fell off the sleigh and the inner door will open.\"</em>",
      wrongMessages:{SACKS:"Close! But use only the five tiles.",TOYS:"Use only the five tiles."},
      hints:["Think about what was inside the sack that fell into the sea.","Children unwrap them on Christmas morning. It starts with G.","The answer is GIFTS."]}
  },
  finale:{tag:"DELIVERED",titleHTML:"THE SACK IS<br><span>SAVED</span>",
    cardHTML:`<h3>Elf Submarine Floats</h3>Pour cold lemonade into a tall glass and add a scoop of vanilla ice cream. Watch it fizz up like the bubbles outside the porthole. Pop in a gummy fish or two, and serve with a straw.<div class="note">"Every present is dry, wrapped and back on the sleigh. Thanks, crew. Merry Christmas! Love, S."<br><small style="font-family:Inter;font-size:11px;color:#8a6a4a">Art: Google Santa Tracker, CC BY 4.0</small></div>`}
};
EXP_ORDER.push(ID);
})();
