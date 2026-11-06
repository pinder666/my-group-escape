(function(){
const ID='heist', P=`.scene[data-exp="${ID}"]`;

/* ---------- art helpers ---------- */
const RED='#c8242c', INK='#1b1b1f';
function suit(s,x,y,k=1){
  const t=`transform="translate(${x} ${y}) scale(${k})"`;
  if(s==='H') return `<path ${t} fill="${RED}" d="M0 4.2C-6.4-.6-5.4-6.4-2.6-6.4-1.2-6.4-.3-5.4 0-4.4.3-5.4 1.2-6.4 2.6-6.4 5.4-6.4 6.4-.6 0 4.2Z"/>`;
  if(s==='D') return `<path ${t} fill="${RED}" d="M0-6 4.4 0 0 6-4.4 0Z"/>`;
  if(s==='C') return `<g ${t} fill="${INK}"><circle cx="0" cy="-3" r="2.6"/><circle cx="-2.9" cy="1.2" r="2.6"/><circle cx="2.9" cy="1.2" r="2.6"/><path d="M-.9 0h1.8l1.3 5.6h-4.4z"/></g>`;
  return `<g ${t} fill="${INK}"><path d="M0-6.2C6.4-1.4 5.4 4 2.6 4 1.2 4 .3 3 0 2 -.3 3-1.2 4-2.6 4-5.4 4-6.4-1.4 0-6.2Z"/><path d="M-.9 1.5h1.8l1.3 4.4h-4.4z"/></g>`;
}
const PIPS={1:[[0,0]],2:[[0,-9],[0,9]],3:[[0,-11],[0,0],[0,11]],4:[[-5.5,-8],[5.5,-8],[-5.5,8],[5.5,8]]};
function card(x,y,rot,s,n){
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-13" y="-18" width="26" height="36" rx="3" fill="#fbf8f0" stroke="#bdb6a6" stroke-width=".6"/>${PIPS[n].map(([a,b])=>suit(s,a,b,n===1?1.25:.95)).join('')}</g>`;
}
function back(x,y,rot){
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-13" y="-18" width="26" height="36" rx="3" fill="#7a1420" stroke="#e8c76a" stroke-width="1"/><rect x="-9.5" y="-14.5" width="19" height="29" rx="1.5" fill="none" stroke="#e8c76a" stroke-width=".6" stroke-dasharray="2 1.5"/><path d="M0-8 5 0 0 8-5 0Z" fill="none" stroke="#e8c76a" stroke-width=".7"/></g>`;
}
function chip(x,y,c){return `<g transform="translate(${x} ${y})"><circle r="6" fill="${c}"/><circle r="6" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="2.2 2.5"/><circle r="3.4" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".6"/></g>`}
function feltSVG(i){
  let g=`<rect width="120" height="90" fill="#155c3a"/><rect width="120" height="90" fill="url(#hf${i})"/><defs><radialGradient id="hf${i}" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#1f7a4c" stop-opacity=".7"/><stop offset="1" stop-color="#0a3320" stop-opacity=".8"/></radialGradient></defs>`;
  if(i===0) g+=`<path d="M0 12 Q60 2 120 12" fill="none" stroke="#e8c76a" stroke-width="1" opacity=".6"/>`+card(34,50,-8,'H',3)+card(66,46,6,'C',2)+back(98,56,14)+chip(14,78,'#b8202a');
  if(i===1) g+=card(22,44,-10,'D',4)+card(56,50,3,'S',1)+card(92,44,10,'H',2)+chip(104,80,'#1d4f9a')+chip(10,80,'#e0a020');
  if(i===2) g+=back(20,44,-6)+card(52,48,4,'C',4)+back(84,40,-12)+card(98,62,8,'H',1)+chip(30,80,'#1d4f9a');
  if(i===3) g+=card(24,48,-6,'D',1)+card(58,44,5,'C',3)+card(94,50,-4,'S',2)+chip(10,14,'#b8202a')+chip(112,82,'#e0a020');
  return `<svg viewBox="0 0 120 90" role="img" aria-label="Card table photo piece ${i+1}">${g}</svg>`;
}
function wheelSVG(){
  const W=[[0,'G'],[36,'R'],[11,'B'],[28,'R'],[6,'B'],[19,'R'],[18,'B'],[32,'R'],[3,'B'],[25,'R'],[14,'B'],[5,'R'],[23,'B']];
  const n=W.length, a=2*Math.PI/n, R=92, r=56, col={G:'#1f8a4c',R:'#b8202a',B:'#17171b'};
  const pt=(rad,ang)=>[(100+rad*Math.sin(ang)).toFixed(2),(100-rad*Math.cos(ang)).toFixed(2)];
  let g=`<circle cx="100" cy="100" r="99" fill="#5a3418"/><circle cx="100" cy="100" r="96" fill="#d9a441"/>`;
  W.forEach(([num,c],i)=>{const a0=(i-.5)*a,a1=(i+.5)*a,[x0,y0]=pt(R,a0),[x1,y1]=pt(R,a1),[x2,y2]=pt(r,a1),[x3,y3]=pt(r,a0),[tx,ty]=pt((R+r)/2,i*a);
    g+=`<path d="M${x0} ${y0}A${R} ${R} 0 0 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 0 0 ${x3} ${y3}Z" fill="${col[c]}" stroke="#d9a441" stroke-width="1.4"/><text x="${tx}" y="${ty}" transform="rotate(${(i*360/n).toFixed(1)} ${tx} ${ty})" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-weight="700" font-size="15" fill="#fff">${num}</text>`;});
  g+=`<circle cx="100" cy="100" r="${r}" fill="#6b3d1c"/><circle cx="100" cy="100" r="40" fill="#8a5326"/>${[0,1,2,3].map(k=>`<rect x="97" y="64" width="6" height="72" rx="3" fill="#e8c76a" transform="rotate(${k*45} 100 100)"/>`).join('')}<circle cx="100" cy="100" r="10" fill="#f4d27a" stroke="#8a5326" stroke-width="2"/>`;
  return `<svg viewBox="0 0 200 200" role="img" aria-label="Roulette wheel with 13 pockets" style="width:min(100%,270px);margin:0 auto">${g}</svg>`;
}
function clockSVG(h,m,letter){
  const ha=((h%12)+m/60)*30, ma=m*6;
  let g=`<circle cx="50" cy="50" r="46" fill="#dfe6dc" stroke="#5c6b62" stroke-width="3"/>`;
  for(let i=0;i<60;i++){const big=i%5===0;g+=`<line x1="50" y1="${big?8:7}" x2="50" y2="${big?14:10}" stroke="#2a312d" stroke-width="${big?2:.8}" transform="rotate(${i*6} 50 50)"/>`}
  for(let i=1;i<=12;i++){const an=i*30*Math.PI/180;g+=`<text x="${(50+30*Math.sin(an)).toFixed(1)}" y="${(50-30*Math.cos(an)).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-size="10" font-weight="700" fill="#2a312d">${i}</text>`}
  g+=`<line x1="50" y1="50" x2="50" y2="27" stroke="#14181a" stroke-width="5" stroke-linecap="round" transform="rotate(${ha} 50 50)"/><line x1="50" y1="50" x2="50" y2="12" stroke="#14181a" stroke-width="2.6" stroke-linecap="round" transform="rotate(${ma} 50 50)"/><circle cx="50" cy="50" r="3.5" fill="#b8202a"/>`;
  return `<div style="display:flex;align-items:center;gap:8px"><svg viewBox="0 0 100 100" style="width:68%;flex:none;filter:drop-shadow(0 0 6px #8fd1a6aa)">${g}</svg><div style="flex:1;text-align:center"><div style="font-size:9px;letter-spacing:1px;color:#8fd1a6">FRAME</div><div style="font-family:'Archivo Black',Impact,sans-serif;font-size:30px;color:#eaffef;line-height:1">${letter}</div></div></div>`;
}
function floorSVG(){
  const grid=["TROBK","SINMU","DGPLW","HFECA","*OYRJ"], laser=["1,0","1,1","1,2","3,2","3,3","3,4"];
  const S=34, ox=14, oy=10; let g=`<rect x="0" y="0" width="${ox*2+S*5}" height="${oy+S*5+24}" rx="6" fill="#0d2a4a"/>`;
  for(let r=0;r<5;r++)for(let c=0;c<5;c++){const row=4-r,x=ox+c*S,y=oy+r*S,ch=grid[r][c],isL=laser.includes(c+','+row);
    g+=`<rect x="${x+1}" y="${y+1}" width="${S-2}" height="${S-2}" rx="2" fill="${isL?'#3a1420':'#123a63'}" stroke="#5f8fc0" stroke-width=".8"/>`;const op=isL?' opacity=".45"':'';
    g+=ch==='*'?`<text x="${x+S/2}" y="${y+S/2}" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#ffd98a">DOOR</text>`:`<text x="${x+S/2}" y="${y+S/2+1}" text-anchor="middle" dominant-baseline="central" font-family="'Courier New',monospace" font-size="19" font-weight="700" fill="#e6f0ff"${op}>${ch}</text>`;}
  const cx=c=>ox+c*S+S/2;
  g+=`<g stroke="#ff3040" stroke-width="3" stroke-linecap="round"><line x1="${cx(1)}" y1="${oy+2*S+2}" x2="${cx(1)}" y2="${oy+5*S-2}"/><line x1="${cx(3)}" y1="${oy+2}" x2="${cx(3)}" y2="${oy+3*S-2}"/></g><g stroke="#ff3040" stroke-width="9" opacity=".25" stroke-linecap="round"><line x1="${cx(1)}" y1="${oy+2*S+2}" x2="${cx(1)}" y2="${oy+5*S-2}"/><line x1="${cx(3)}" y1="${oy+2}" x2="${cx(3)}" y2="${oy+3*S-2}"/></g>`;
  g+=`<text x="${ox+S*2.5}" y="${oy+S*5+15}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9" fill="#9cc0e6" letter-spacing=".5">RED = LASER. NEVER CROSS ONE.</text>`;
  return `<svg viewBox="0 0 ${ox*2+S*5} ${oy+S*5+24}" role="img" aria-label="Floor plan grid with letters and laser beams" style="width:min(100%,300px);margin:0 auto">${g}</svg>`;
}
const SIGN=["THE","GOLDEN","CLOVER","CASINO"];
function snap(dark){let i=0;return `<div style="font-family:'Courier New',monospace;font-weight:700;font-size:15px;letter-spacing:2px;text-align:center;line-height:1.5;background:#0b0606;border-radius:4px;padding:4px 0">${SIGN.map((w,wi)=>[...w].map(ch=>{const d=dark.includes(i++);return `<span style="${d?'color:#3a2f2a':'color:#ffd36a;text-shadow:0 0 6px #ff9a2a'}">${ch}</span>`}).join('')+(wi===0?' ':'<br>')).join('')}</div>`}

EXPERIENCES[ID]={
  id:ID, title:"The Heist", titleHTML:"THE<br><span>HEIST</span>",
  tag:"A casino escape room",
  blurb:"Midnight at the Golden Clover Casino. Your crew is inside the back office with one vault door, six locks, and a guard who comes back at dawn.",
  menuBlurb:"Break into the Golden Clover's vault before the guard comes back.",
  menuLine:"Crack the vault",
  theme:{accent:'#e8b84a',accent2:'#ffd98a',bg:'#06100c',introBg:'#0f3a26',door:'radial-gradient(circle at 50% 50%,#9aa0a8 0 12%,#4a5058 13% 30%,#80868e 31% 34%,#3c4248 35%)',doorFrame:'#1a1d20',boxColor:'linear-gradient(#ffe08a,#c8901e)'},
  sceneCSS:`
${P}{background:#06140e}
${P} .wall{position:absolute;left:0;right:0;top:0;height:58%;background:radial-gradient(circle at 50% 50%,#1d4a33 0 2px,transparent 3px) 0 0/22px 22px,radial-gradient(ellipse at 50% 30%,#14402a,#0a2318 75%)}
${P} .wall::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 46px,rgba(232,184,74,.07) 46px 48px)}
${P} .rail{position:absolute;left:0;right:0;top:55%;height:3.4%;background:linear-gradient(#3a2414,#1e120a);border-top:2px solid #c99a3a;border-bottom:2px solid #6a4a1c}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:42%;background:radial-gradient(circle at 50% 50%,#c99a3a 0 2px,transparent 3px) 0 0/26px 26px,repeating-linear-gradient(45deg,#3a0d14 0 13px,#2a0810 13px 26px),#2a0810}
${P} .floor::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.55),transparent 45%)}
${P} .glowpool{position:absolute;left:18%;right:18%;top:44%;height:20%;background:radial-gradient(ellipse,rgba(255,200,90,.22),transparent 70%);animation:flicker 5s infinite;pointer-events:none}
/* neon sign */
${P} #o-neon{left:12%;top:3%;width:76%;height:11%;border-radius:8px;background:#0b0606;box-shadow:inset 0 0 0 2px #2a1a10,0 6px 18px rgba(0,0,0,.6)}
${P} #o-neon svg{position:absolute;inset:6% 4%;width:92%;height:88%}
${P} #o-neon text{font-family:'Archivo Black',Impact,'Arial Black',sans-serif;fill:#ffe39a;stroke:#ff9a2a;stroke-width:.6}
${P} #o-neon .glow{filter:blur(2.5px);fill:#ffb03a;stroke:none;opacity:.9}
${P} #o-neon .fl{animation:heist-neon 3.2s infinite}
${P} #o-neon .fl2{animation:heist-neon 4.7s infinite 1.1s}
${P} #o-neon .clover{fill:#3ddc84;stroke:#1a8a4a;animation:glowpulse 2.4s infinite}
/* camera */
${P} .cam{position:absolute;right:2%;top:15.5%;width:13%;height:6%;z-index:3}
${P} .cam .mount{position:absolute;right:0;top:0;width:12%;height:70%;background:#2c3034;border-radius:2px}
${P} .cam .arm{position:absolute;right:6%;top:24%;width:58%;height:100%;transform-origin:100% 20%;animation:heist-sweep 6s ease-in-out infinite}
${P} .cam .body{position:absolute;left:0;top:0;width:100%;height:50%;background:linear-gradient(#e2e5e8,#9aa0a6);border-radius:3px 6px 6px 3px;box-shadow:0 2px 4px rgba(0,0,0,.5)}
${P} .cam .body::before{content:"";position:absolute;left:-14%;top:12%;width:20%;height:76%;background:#14171a;border-radius:3px}
${P} .cam .led{position:absolute;right:16%;top:30%;width:12%;aspect-ratio:1;border-radius:50%;background:#ff2a2a;box-shadow:0 0 6px #ff2a2a;animation:blink 1.2s infinite}
${P} .cam .cone{position:absolute;right:92%;top:-60%;width:250%;height:300%;background:linear-gradient(270deg,rgba(255,250,210,.16),transparent);clip-path:polygon(100% 42%,0 0,0 100%,100% 58%);pointer-events:none}
/* vault */
${P} #o-vault{left:25%;top:17%;width:50%;height:36%;border-radius:50%}
${P} #o-vault .frame{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,#3a3f45 62%,#7d848c 64%,#5a6067 70%,#2a2e33 72%,#8a9098 74%,#4a5057 100%);box-shadow:0 10px 26px rgba(0,0,0,.7)}
${P} #o-vault .bolt{position:absolute;width:5%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#e0e4e8,#5a6067);transform:translate(-50%,-50%)}
${P} #o-vault .inside{position:absolute;inset:9%;border-radius:50%;background:radial-gradient(circle,#fff3c0,#f2b33d 40%,#8a5a10 80%);overflow:hidden;box-shadow:inset 0 0 20px #4a2e05}
${P} #o-vault .inside i{position:absolute;width:26%;height:11%;background:linear-gradient(#fff1b0,#e0a530 60%,#a8741a);clip-path:polygon(12% 0,88% 0,100% 100%,0 100%)}
${P} #o-vault .door{position:absolute;inset:9%;border-radius:50%;background:radial-gradient(circle,#9aa1a9 0 14%,#6e757d 15% 30%,#a2a9b1 31% 33%,#5d646b 34% 60%,#878e96 61% 63%,#4c5259 64%);box-shadow:inset 0 0 0 3px #2a2e33,inset 0 -8px 16px rgba(0,0,0,.45);transform-origin:0% 50%;transition:transform 1.6s cubic-bezier(.5,0,.3,1)}
${P} #o-vault .wheel{position:absolute;left:31%;top:31%;width:38%;height:38%;transition:transform 1.4s}
${P} #o-vault .wheel i{position:absolute;left:46%;top:-6%;width:8%;height:112%;border-radius:4px;background:linear-gradient(90deg,#c9cfd6,#7a8189)}
${P} #o-vault .wheel b{position:absolute;inset:34%;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ffe08a,#b8862b);box-shadow:0 0 0 2px #5a4010}
${P} #o-vault .lights{position:absolute;inset:0}
${P} #o-vault .lights b{position:absolute;width:9%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);background:#2a1a08;box-shadow:inset 0 0 0 2px #14100a,0 0 0 2px #6e757d;transition:.4s}
${P} #o-vault .lights b.on{background:radial-gradient(circle at 40% 35%,#fff6c8,#ffc23a);box-shadow:0 0 10px #ffb21a,0 0 0 2px #6e757d}
${P} #o-vault.opened .door{transform:perspective(500px) rotateY(-78deg)}
${P} #o-vault.opened .wheel{transform:rotate(200deg)}
${P} #o-vault.opened{box-shadow:0 0 60px 20px rgba(255,200,80,.55)}
/* rope */
${P} .post{position:absolute;top:50%;width:3%;height:10%;background:linear-gradient(90deg,#8a6420,#ffe08a,#8a6420);border-radius:40% 40% 2px 2px;z-index:1}
${P} .post::after{content:"";position:absolute;left:-40%;right:-40%;bottom:-6%;height:14%;background:#c99a3a;border-radius:50%}
${P} .rope{position:absolute;top:51.2%;height:4.5%;border-bottom:4px solid #9a1020;border-radius:0 0 50% 50%;z-index:1}
/* cctv monitors */
${P} #o-cctv{left:3%;top:19%;width:21%;height:19%;background:linear-gradient(#2c3136,#1a1d21);border-radius:6px;box-shadow:0 6px 14px rgba(0,0,0,.6),inset 0 0 0 2px #3c4248}
${P} #o-cctv .scr{position:absolute;width:40%;height:35%;border-radius:3px;background:#050807;overflow:hidden;box-shadow:inset 0 0 0 1px #000}
${P} #o-cctv .scr::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.08) 0 1px,transparent 1px 3px);opacity:0;transition:opacity .8s}
${P} #o-cctv .scr i{position:absolute;left:30%;bottom:0;width:40%;height:60%;background:#2a3a30;border-radius:50% 50% 0 0;opacity:0;transition:opacity .8s}
${P} #o-cctv .off{position:absolute;left:0;right:0;bottom:1.5%;text-align:center;font:700 7px Arial,sans-serif;letter-spacing:1px;color:#ff4a4a}
${P} #o-cctv.revealed .scr{background:radial-gradient(#5f8a72,#24392d);animation:heist-scan 2.2s infinite}
${P} #o-cctv.revealed .scr::after,${P} #o-cctv.revealed .scr i{opacity:1}
${P} #o-cctv.revealed .off{color:#5fe08a}
/* laser case */
${P} #o-plans{right:3%;top:23%;width:21%;height:25%;background:#0d2a4a;border:5px solid #c99a3a;border-radius:3px;box-shadow:0 6px 14px rgba(0,0,0,.6);overflow:hidden}
${P} #o-plans .bp{position:absolute;inset:6%;background:linear-gradient(#5f8fc0 1px,transparent 1px) 0 0/20% 20%,linear-gradient(90deg,#5f8fc0 1px,transparent 1px) 0 0/20% 20%;opacity:.35;transition:opacity .8s}
${P} #o-plans .glass{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%,rgba(255,255,255,.06) 60%,transparent)}
${P} #o-plans .beam{position:absolute;left:-10%;right:-10%;height:3px;background:#ff2a3a;box-shadow:0 0 6px 2px rgba(255,40,60,.7);animation:heist-laser 1.6s ease-in-out infinite;transition:opacity .6s}
${P} #o-plans.revealed .beam{opacity:0!important;animation:none}
${P} #o-plans.revealed .bp{opacity:.9}
/* card table */
${P} #o-cards{left:2%;top:65%;width:47%;height:21%;border-radius:50% 50% 12px 12px / 70% 70% 12px 12px;background:radial-gradient(ellipse at 50% 40%,#22895a,#0f4d30 70%);box-shadow:0 0 0 5px #4a2a12,0 0 0 7px #c99a3a,0 12px 20px rgba(0,0,0,.6)}
${P} #o-cards .pc{position:absolute;width:15%;height:30%;background:#fbf8f0;border-radius:3px;box-shadow:0 2px 3px rgba(0,0,0,.4)}
${P} #o-cards .pc.bk{background:#7a1420;box-shadow:inset 0 0 0 2px #e8c76a,0 2px 3px rgba(0,0,0,.4)}
${P} #o-cards .pc em{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:min(12px,3.2vw);font-weight:700}
${P} #o-cards .chips{position:absolute;width:10%;aspect-ratio:1;border-radius:50%;box-shadow:0 3px 0 rgba(0,0,0,.35),inset 0 0 0 2px rgba(255,255,255,.7)}
/* roulette */
${P} #o-roulette{right:2%;top:64%;width:46%;height:22%}
${P} #o-roulette .rim{position:absolute;inset:0;border-radius:50%;background:radial-gradient(ellipse,#3a2412 55%,#7a4a22 58%,#c99a3a 62%,#5a3418 66%);box-shadow:0 12px 20px rgba(0,0,0,.6)}
${P} #o-roulette .tilt{position:absolute;left:10%;top:13%;width:80%;height:74%;border-radius:50%;overflow:hidden}
${P} #o-roulette .spin{position:absolute;left:0;top:50%;width:100%;aspect-ratio:1;margin-top:-50%;border-radius:50%;background:radial-gradient(circle,#d9a441 0 12%,#6b3d1c 13% 44%,transparent 45%),repeating-conic-gradient(#b8202a 0 15deg,#17171b 15deg 30deg);animation:spin 7s linear infinite}
${P} #o-roulette .tiltwrap{position:absolute;inset:0;transform:scaleY(1)}
${P} #o-roulette .ball{position:absolute;left:48%;top:14%;width:6%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff,#bbb);box-shadow:0 1px 2px #000}
/* duffel bag */
${P} .bag{position:absolute;left:37%;top:87.5%;width:26%;height:8%;background:linear-gradient(#2a2a30,#121216);border-radius:40% 40% 18% 18%;box-shadow:0 6px 10px rgba(0,0,0,.6);z-index:1}
${P} .bag::before{content:"";position:absolute;left:28%;right:28%;top:-38%;height:60%;border:3px solid #2a2a30;border-bottom:none;border-radius:50% 50% 0 0}
${P} .bag::after{content:"";position:absolute;left:8%;right:8%;top:22%;height:3px;background:#6a6a70;border-radius:2px}
${P} .coin{position:absolute;width:3.2%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff1b0,#d69a2a);box-shadow:0 1px 2px rgba(0,0,0,.6);z-index:1}
/* lamp light */
${P} .light{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 32%,rgba(255,205,110,.16),transparent 55%);z-index:3}
${P} .dust{position:absolute;width:2px;height:2px;border-radius:50%;background:#ffe9a8;opacity:.0;animation:heist-dust 9s linear infinite;pointer-events:none;z-index:3}
@keyframes heist-neon{0%,100%{opacity:1}6%{opacity:.25}8%{opacity:1}52%{opacity:1}54%{opacity:.15}55%{opacity:.9}57%{opacity:.2}60%{opacity:1}}
@keyframes heist-sweep{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(22deg)}}
@keyframes heist-laser{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes heist-scan{0%,100%{filter:brightness(1)}50%{filter:brightness(1.25)}}
@keyframes heist-dust{0%{transform:translate(0,0);opacity:0}20%{opacity:.7}100%{transform:translate(30px,-120px);opacity:0}}
`,
  sceneHTML:`
<div class="wall"></div><div class="rail"></div><div class="floor"></div><div class="glowpool"></div>
<button class="obj" id="o-neon" aria-label="Neon sign"><svg viewBox="0 0 300 44" preserveAspectRatio="xMidYMid meet"><g class="glow"><text x="150" y="31" text-anchor="middle" font-size="27">GOLDEN CLOVER</text></g><text x="150" y="31" text-anchor="middle" font-size="27"><tspan>GOL</tspan><tspan class="fl">D</tspan><tspan>EN CL</tspan><tspan class="fl2">O</tspan><tspan>VER</tspan></text><g class="clover" transform="translate(16 22)"><circle cx="0" cy="-6" r="5"/><circle cx="6" cy="0" r="5"/><circle cx="0" cy="6" r="5"/><circle cx="-6" cy="0" r="5"/></g><g class="clover" transform="translate(284 22)"><circle cx="0" cy="-6" r="5"/><circle cx="6" cy="0" r="5"/><circle cx="0" cy="6" r="5"/><circle cx="-6" cy="0" r="5"/></g></svg><span class="spark"></span></button>
<div class="cam"><div class="mount"></div><div class="arm"><div class="cone"></div><div class="body"></div><div class="led"></div></div></div>
<button class="obj" id="o-cctv" aria-label="Security monitors">${[0,1,2,3].map((_,i)=>`<div class="scr" style="left:${[7,53,7,53][i]}%;top:${[7,7,46,46][i]}%"><i></i></div>`).join('')}<div class="off">CCTV</div><span class="spark"></span></button>
<button class="obj" id="o-plans" aria-label="Floor plan behind laser beams"><div class="bp"></div>${[18,38,58,78].map((t,i)=>`<div class="beam" style="top:${t}%;transform:rotate(${i%2?-14:12}deg);animation-delay:${i*.3}s"></div>`).join('')}<div class="glass"></div><span class="spark"></span></button>
<button class="obj" id="o-vault" aria-label="The vault door"><div class="frame"></div>${[0,1,2,3,4,5,6,7,8,9,10,11].map(k=>{const a=k*Math.PI/6;return `<span class="bolt" style="left:${(50+46*Math.sin(a)).toFixed(1)}%;top:${(50-46*Math.cos(a)).toFixed(1)}%"></span>`}).join('')}<div class="inside">${[[37,62],[13,62],[61,62],[25,51],[49,51],[37,40]].map(([l,t])=>`<i style="left:${l}%;top:${t}%"></i>`).join('')}</div><div class="door"><div class="wheel">${[0,60,120].map(r=>`<i style="transform:rotate(${r}deg)"></i>`).join('')}<b></b></div><div class="lights">${[-75,-45,-15,15,45,75].map(d=>{const a=d*Math.PI/180;return `<b style="left:${(50+38*Math.sin(a)).toFixed(1)}%;top:${(50-38*Math.cos(a)).toFixed(1)}%"></b>`}).join('')}</div></div><span class="spark"></span></button>
<div class="post" style="left:21%"></div><div class="post" style="left:76%"></div><div class="rope" style="left:22.5%;width:12%"></div><div class="rope" style="left:65.5%;width:11.5%"></div>
<button class="obj" id="o-cards" aria-label="Card table"><div class="pc" style="left:20%;top:26%;transform:rotate(-10deg)"><em style="color:#c8242c">&#9829;</em></div><div class="pc bk" style="left:40%;top:20%;transform:rotate(4deg)"></div><div class="pc" style="left:60%;top:28%;transform:rotate(12deg)"><em style="color:#1b1b1f">&#9827;</em></div><div class="chips" style="left:12%;top:62%;background:#b8202a"></div><div class="chips" style="left:74%;top:64%;background:#1d4f9a"></div><div class="chips" style="left:44%;top:66%;background:#e0a020"></div><span class="spark"></span></button>
<button class="obj" id="o-roulette" aria-label="Roulette wheel"><div class="rim"></div><div class="tilt"><div class="spin"></div><div class="ball"></div></div><span class="spark"></span></button>
<div class="bag"></div>${[[33,93],[35.5,95],[64,94],[67,92.5]].map(([l,t])=>`<div class="coin" style="left:${l}%;top:${t}%"></div>`).join('')}
${[[30,70,0],[60,64,3],[45,80,6],[72,76,1.5],[20,58,4.5]].map(([l,t,d])=>`<div class="dust" style="left:${l}%;top:${t}%;animation-delay:${d}s"></div>`).join('')}
<div class="light"></div>`,
  order:["neon","roulette","cards","plans","cctv","vault"],
  revealOnWave2:[{sel:'#o-plans',cls:'revealed'},{sel:'#o-cctv',cls:'revealed'}],
  wave2Toast:"The lasers over the floor plan just blinked out, and the security monitors flickered on.",
  finalReadyToast:"Five gold letters in the vault dial. Time to open it.",
  startToast:"The guard is on his rounds. Tap anything that sparkles. Three locks are ready.",
  locks:{
    /* NEON. Sign letters THE GOLDEN CLOVER CASINO (21). Dark letters per photo:
       P1 T,D,R,A,N(casino)  P2 H,O(golden),L(clover),I  P3 E(the),D,N(golden),C(casino),O(casino)  P4 E(golden),C(clover),O(golden),A.
       Each photo has letters dark only in that photo, so all 4 are needed.
       Lit in all four: G(golden) L(golden) O V E(clover) S = GLOVES. Verified with node. */
    neon:{wave:1,title:"The Flickering Sign",obj:"o-neon",answer:"GLOVES",kind:"word",tile:"G",
      scene:"The crew's lookout snapped the casino's big neon sign four times while it flickered. <em>\"Letters that stay lit in EVERY photo spell the crew's first rule.\"</em>",
      cardClass:"dark",cards:[snap([0,6,14,16,19]),snap([1,4,10,18]),snap([2,8,15,20,6]),snap([7,9,16,4])],
      hints:["A letter that is dark in even one photo is out. Compare all four photos letter by letter.","THE and CASINO are almost all dark somewhere. Look closely at GOLDEN and CLOVER.","G, L, O, V, E, S stay lit every time. The answer is GLOVES."]},
    /* ROULETTE. Wheel clockwise from 0: 0G 36R 11B 28R 6B 19R 18B 32R 3B 25R 14B 5R 23B.
       Red: 36 28 19 32 25 5. Even: 36 28 32. Digits sum >8: 36(9) 28(10). Not next to 0: 28.
       Each card needed (node): drop red->28,18; drop even->28,19; drop digits->28,32; drop zero->36,28. Answer 28. */
    roulette:{wave:1,title:"The Roulette Wheel",obj:"o-roulette",answer:"28",kind:"num",tile:"O",
      scene:"The croupier hid the safe code in his last spin. Four crew members each saw one thing about where the ball stopped.",
      extra:wheelSVG(),
      cards:["\"It landed on a RED pocket.\"","\"It was an EVEN number.\"","\"Add its digits together and you get MORE than 8.\"","\"It was NOT right next to the green 0.\""],
      hints:["Use every clue to cross pockets off the wheel. Only one number survives.","The red even numbers are 36, 28 and 32. Now use the last two clues.","32's digits add up to 5, and 36 sits next to the green 0. The answer is 28."]},
    /* CARDS. Face-up cards: P1 hearts-3, clubs-2. P2 diamonds-4, spades-1, hearts-2. P3 clubs-4, hearts-1 (plus 2 face down).
       P4 diamonds-1, clubs-3, spades-2. Symbols: hearts 3+2+1=6, diamonds 4+1=5, clubs 2+4+3=9, spades 1+2=3 -> 6593.
       (Counting cards instead of symbols gives 3232, so the "symbols not cards" wording matters.) Verified with node. */
    cards:{wave:1,title:"The Card Table",obj:"o-cards",answer:"6593",kind:"num",tile:"T",splitArt:true,
      scene:"The dealer left a sticky note under the felt: <em>\"Code = how many hearts, diamonds, clubs, spades, in that order. Count the SYMBOLS on the cards, not the cards. Face-down cards don't count.\"</em>",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-2,1.5,1,-1.5][i]}deg;animation-delay:${i*.08}s"><span class="ph">PHONE ${i+1}</span>${feltSVG(i)}</div>`).join('')}</div><div style="display:flex;justify-content:center;gap:18px;font-size:13px;color:#d6cdbf"><span><span style="color:#ff5a5a">&#9829;</span> hearts</span><span><span style="color:#ff5a5a">&#9830;</span> diamonds</span><span>&#9827; clubs</span><span>&#9824; spades</span></div>`,
      hints:["Add up the symbols for each suit across all four pieces of the table.","Hearts: 3 + 2 + 1. Clubs: 2 + 4 + 3.","6 hearts, 5 diamonds, 9 clubs, 3 spades. The code is 6593."]},
    /* PLANS. 5x5 grid, rows top to bottom: T R O B K / S I N M U / D G P L W / H F E C A / DOOR O Y R J.
       Door = bottom-left. Up 3 -> S; Right 2 -> N; Down 2 -> E; Right 2 -> A; Up 3 -> K = SNEAK.
       Lasers: column 2 (rows 1-3 from bottom) and column 4 (top three rows); the path never crosses one (checked in node). */
    plans:{wave:2,title:"The Laser Floor",obj:"o-plans",answer:"SNEAK",kind:"word",tile:"I",
      lockedMsg:"Laser beams cover the floor plan. Crack two of the first locks to cut the power.",
      scene:"With the lasers off you can lift the floor plan of the vault corridor. Each crew member memorised one leg of the safe route. <em>\"Start on the DOOR square. Write down the letter where each leg ENDS.\"</em>",
      extra:floorSVG(),
      cards:["Leg 1: from the door, 3 squares UP.","Leg 2: 2 squares RIGHT.","Leg 3: 2 squares DOWN.","Leg 4: 2 squares RIGHT.","Leg 5: 3 squares UP. You're at the vault!"],
      wideCards:false,
      hints:["Move one leg at a time and only write down the letter where each leg stops. If you'd cross a red laser, you went wrong.","Leg 1 stops on S. Leg 2 stops on N.","S, N, E, A, K. The answer is SNEAK."]},
    /* CCTV. Frames (shuffled on cards): D 3:45, S 1:20, W 5:15, A 3:05, O 4:30, H 2:10.
       Earliest to latest: S 1:20, H 2:10, A 3:05, D 3:45, O 4:30, W 5:15 = SHADOW.
       3:05 vs 3:45 needs the minute hand; hour hands are drawn at true positions. Verified with node. */
    cctv:{wave:2,title:"The Security Tapes",obj:"o-cctv",answer:"SHADOW",kind:"word",tile:"N",
      lockedMsg:"The monitors are switched off. Crack two of the first locks to power them up.",
      scene:"The monitors play six frames of the guard's rounds, shuffled. Each frame has a clock and a letter. <em>\"Put the frames in time order, earliest first. That's how to move without being seen.\"</em>",
      cardClass:"dark",cards:[clockSVG(3,45,'D'),clockSVG(1,20,'S'),clockSVG(5,15,'W'),clockSVG(3,5,'A'),clockSVG(4,30,'O'),clockSVG(2,10,'H')],
      hints:["Read each clock: the short hand gives the hour, the long hand the minutes. Then sort.","Two frames are both after 3 o'clock. The long hand tells you which came first.","1:20 S, 2:10 H, 3:05 A, 3:45 D, 4:30 O, 5:15 W. The answer is SHADOW."]},
    /* VAULT. Tiles G O T I N -> INGOT (a bar of gold). Other real anagrams: TIGON, TOING (wrongMessages). */
    vault:{wave:3,title:"The Vault Door",obj:"o-vault",answer:"INGOT",kind:"word",onSolve:[{sel:'#o-vault',cls:'opened'}],
      scene:"Six lights ring the vault door. Every lock you crack drops a gold letter into its dial. <em>\"Spell what's stacked inside, and the door is yours.\"</em>",
      wrongMessages:{TIGON:"A tiger-lion? Not in this vault. What's stacked inside?",TOING:"Real word, wrong one. Think gold, in bars."},
      hints:["It's a single bar of solid gold.","It starts with I.","The answer is INGOT."]}
  },
  finale:{tag:"ESCAPED",titleHTML:"THE VAULT IS<br><span>OPEN</span>",
    cardHTML:`<svg viewBox="0 0 300 120" style="width:100%;display:block;margin:-4px 0 8px"><defs><radialGradient id="heistg"><stop offset="0" stop-color="#fff3c0"/><stop offset=".5" stop-color="#f2b33d" stop-opacity=".7"/><stop offset="1" stop-color="#f2b33d" stop-opacity="0"/></radialGradient><linearGradient id="heistb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b0"/><stop offset=".6" stop-color="#e0a530"/><stop offset="1" stop-color="#a8741a"/></linearGradient></defs><ellipse cx="150" cy="70" rx="150" ry="60" fill="url(#heistg)"><animate attributeName="opacity" values=".6;1;.6" dur="2.4s" repeatCount="indefinite"/></ellipse>${[[90,92],[150,92],[210,92],[120,72],[180,72],[150,52]].map(([x,y],i)=>`<path d="M${x-26} ${y+16}L${x-18} ${y}H${x+18}L${x+26} ${y+16}Z" fill="url(#heistb)" stroke="#8a5a10" stroke-width="1" opacity="0"><animate attributeName="opacity" from="0" to="1" begin="${(1.4+i*.18).toFixed(2)}s" dur=".4s" fill="freeze"/></path>`).join('')}</svg><h3>The Golden Clover Job</h3>The vault swings open and the back office fills with gold light. Six crews have tried this room. Yours is the first to walk out before dawn.<div class="note">"Whoever cracked this: the gold stays, the bragging rights are yours. Same time next year? The Management."</div>`}
};
EXP_ORDER.push(ID);
})();
