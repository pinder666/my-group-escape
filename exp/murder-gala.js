(function(){
const ID='murder-gala', P=`.scene[data-exp="${ID}"]`;

/* ---------- art helpers ---------- */
function mask(kind,x,y,k=1){
  const C={Fox:['#e0732a','#7a3410'],Owl:['#8a6440','#3e2a16'],Swan:['#f4f1ea','#9a9488'],Peacock:['#1f9a8a','#0c4a44'],Cat:['#26222c','#0a080c']}[kind];
  let extra='';
  if(kind==='Fox') extra=`<path d="M-15-5-12-17-5-8ZM15-5 12-17 5-8Z" fill="${C[0]}" stroke="${C[1]}" stroke-width="1"/><path d="M-3 5 0 9 3 5Z" fill="#2a1408"/>`;
  if(kind==='Cat') extra=`<path d="M-15-5-13-16-6-8ZM15-5 13-16 6-8Z" fill="${C[0]}" stroke="#d4af37" stroke-width=".8"/><path d="M-6 6h-8M-6 8l-7 2M6 6h8M6 8l7 2" stroke="#d4af37" stroke-width=".6"/>`;
  if(kind==='Owl') extra=`<circle cx="-7.5" cy="0" r="7" fill="none" stroke="#e8c070" stroke-width="1.6"/><circle cx="7.5" cy="0" r="7" fill="none" stroke="#e8c070" stroke-width="1.6"/><path d="M-2 4 0 9 2 4Z" fill="#e8a030"/><path d="M-14-6-10-13-6-7M14-6 10-13 6-7" fill="none" stroke="${C[1]}" stroke-width="1.6"/>`;
  if(kind==='Swan') extra=`<path d="M12-4C20-14 14-24 6-22" fill="none" stroke="#f4f1ea" stroke-width="2.6" stroke-linecap="round"/><path d="M5-23 1-21 6-20Z" fill="#e8a030"/><path d="M-16-2C-22-6-22 4-16 4" fill="#fff" stroke="#c8c2b6" stroke-width=".6"/>`;
  if(kind==='Peacock') extra=`${[-30,-15,0,15,30].map(a=>`<g transform="rotate(${a} 0 -6)"><line x1="0" y1="-6" x2="0" y2="-22" stroke="#2a6a3a" stroke-width="1"/><ellipse cx="0" cy="-23" rx="3.2" ry="4.4" fill="#1f9a8a"/><ellipse cx="0" cy="-23" rx="1.6" ry="2.2" fill="#1a3a8a"/><circle cx="0" cy="-23" r=".8" fill="#e8c070"/></g>`).join('')}`;
  return `<g transform="translate(${x} ${y}) scale(${k})">${kind==='Peacock'||kind==='Swan'?extra:''}<path d="M-17-3C-17-9-6-9 0-4 6-9 17-9 17-3 17 5 8 9 0 5-8 9-17 5-17-3Z" fill="${C[0]}" stroke="${C[1]}" stroke-width="1.2"/><ellipse cx="-7.5" cy="0" rx="4.4" ry="2.8" fill="#0a0a14"/><ellipse cx="7.5" cy="0" rx="4.4" ry="2.8" fill="#0a0a14"/>${kind!=='Peacock'&&kind!=='Swan'?extra:''}</g>`;
}
const MASKS=['Fox','Owl','Swan','Peacock','Cat'];
function suspectsArt(){
  return `<div style="display:flex;justify-content:space-between;gap:4px;margin-bottom:10px">${MASKS.map(m=>`<div style="flex:1;text-align:center;font-size:11.5px;color:#d6cdbf"><svg viewBox="-20 -28 40 40" style="width:100%;max-width:60px;margin:0 auto">${mask(m,0,0,1)}</svg>${m}</div>`).join('')}</div>
  <div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center">${['Grand staircase','Gramophone','Balcony','Dance floor','Champagne tower'].map(p=>`<span style="font-size:12px;padding:4px 9px;border-radius:999px;border:1px solid #6a5a3a;color:#f3c96b">${p}</span>`).join('')}</div>`;
}
function towerSVG(){
  const rows=[5,4,3,2,1], gw=40, gh=34; let g='';
  rows.forEach((n,r)=>{const y=190-r*gh, x0=150-(n-1)*gw/2;
    for(let i=0;i<n;i++){const x=x0+i*gw, top=r===4, bot=r===0;
      g+=`<g transform="translate(${x} ${y})"><path d="M-17-14Q0 4 17-14Z" fill="${top?'#ffe7a0':'#f6e6b0'}" fill-opacity=".85" stroke="#c9a24a" stroke-width="1.2"/><line x1="0" y1="-5" x2="0" y2="9" stroke="#c9a24a" stroke-width="1.6"/><ellipse cx="0" cy="10" rx="8" ry="2" fill="#c9a24a"/>${bot?`<text x="0" y="-8" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="#6a4a10">${String.fromCharCode(65+i)}</text>`:''}${top?`<text x="0" y="-7" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="12" fill="#6a4a10">?</text>`:''}</g>`;}});
  return `<svg viewBox="0 0 300 210" role="img" aria-label="Champagne tower of fifteen glasses, bottom row lettered A to E" style="width:min(100%,300px);margin:0 auto">${g}</svg>`;
}
/* record ring: 24 letters clockwise from the star; every 3rd from the star = FEATHERS */
const RING='FQLEMOAURTNWHPGEKCRYBSDJ';
function recordPiece(q){ // q: 0=TL 1=TR 2=BL 3=BR
  const cx=[100,0,100,0][q], cy=[100,100,0,0][q], from=[18,0,12,6][q];
  let g=`<rect width="100" height="100" fill="#efe6d0"/><circle cx="${cx}" cy="${cy}" r="96" fill="#111"/>`;
  for(let r=40;r<94;r+=4) g+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#2a2a2a" stroke-width=".6"/>`;
  g+=`<circle cx="${cx}" cy="${cy}" r="34" fill="#8a1a2a"/><circle cx="${cx}" cy="${cy}" r="30" fill="none" stroke="#e8c070" stroke-width=".8"/><circle cx="${cx}" cy="${cy}" r="4" fill="#efe6d0"/>`;
  for(let i=from;i<from+6;i++){const a=(i*15+7.5)*Math.PI/180;const x=cx+76*Math.sin(a),y=cy-76*Math.cos(a);
    g+=`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-weight="700" font-size="13" fill="#f3d27a">${RING[i]}</text>`;}
  if(q===1){const pt=(r,d)=>[(cx+r*Math.sin(d*Math.PI/180)).toFixed(1),(cy-r*Math.cos(d*Math.PI/180)).toFixed(1)];const [sx,sy]=pt(58,7.5),[ax,ay]=pt(50,18),[bx,by]=pt(50,48),[h1x,h1y]=pt(44,42),[h2x,h2y]=pt(56,42);
    g+=`<text x="${sx}" y="${sy}" text-anchor="middle" dominant-baseline="central" font-size="14" fill="#ffd34a">&#9733;</text><path d="M${ax} ${ay}A50 50 0 0 1 ${bx} ${by}M${h1x} ${h1y}L${bx} ${by}L${h2x} ${h2y}" fill="none" stroke="#ffd34a" stroke-width="1.6"/>`;}
  return `<svg viewBox="0 0 100 100" role="img" aria-label="Record quarter ${q+1}">${g}</svg>`;
}
function wheelSVG(){
  const cx=140, cy=140; let g=`<circle cx="${cx}" cy="${cy}" r="136" fill="#1a1626" stroke="#e8c070" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="108" fill="#f4ecd8" stroke="#e8c070" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="76" fill="#1a1626"/>`;
  for(let k=0;k<26;k++){const a=k*360/26, ar=a*Math.PI/180, o=String.fromCharCode(65+k), inr=String.fromCharCode(65+(k+21)%26);
    g+=`<line x1="${cx+76*Math.sin(ar+Math.PI/26)}" y1="${cy-76*Math.cos(ar+Math.PI/26)}" x2="${cx+136*Math.sin(ar+Math.PI/26)}" y2="${cy-136*Math.cos(ar+Math.PI/26)}" stroke="#8a7a5a" stroke-width=".6"/>`;
    g+=`<text x="${(cx+122*Math.sin(ar)).toFixed(1)}" y="${(cy-122*Math.cos(ar)).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#f3d27a">${o}</text>`;
    g+=`<text x="${(cx+92*Math.sin(ar)).toFixed(1)}" y="${(cy-92*Math.cos(ar)).toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-weight="700" font-size="14" fill="#2a1a3a">${inr}</text>`;}
  g+=`<text x="${cx}" y="${cy-12}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#f3d27a" letter-spacing=".5">OUTER = CRYSTAL</text><text x="${cx}" y="${cy+4}" text-anchor="middle" font-family="Arial,sans-serif" font-size="9.5" fill="#f4ecd8" letter-spacing=".5">INNER = REAL</text><text x="${cx}" y="${cy+20}" text-anchor="middle" font-size="14" fill="#e8c070">&#10022;</text>`;
  return `<svg viewBox="0 0 280 280" role="img" aria-label="Crystal cipher ring" style="width:min(100%,290px);margin:0 auto">${g}</svg>`;
}
/* torn guest list. Underlined letters by line: 1 S(terling) 2 (Col)E(nel) 3 C(rumb) 4 R(upert) 5 (F)E(nwick) 6 T(oby) = SECRET */
const U=t=>t.replace(/<u>/g,'<u style="text-decoration:none;border-bottom:2.5px solid #b8202a">');
const LIST=[['Lady Mavis','<u>S</u>terling','Table 1'],['Colon<u>e</u>l Hugo','Bramble','Table 2'],['Miss Daisy','<u>C</u>rumb','Table 3'],['Mr <u>R</u>upert','Quill','Table 4'],['Dr Olive','F<u>e</u>nwick','Table 5'],['Sir <u>T</u>oby','Platt','Table 6']];
function listPiece(q){ // 0 TL,1 TR,2 BL,3 BR
  const left=q%2===0, rows=q<2?[0,1,2]:[3,4,5];
  const head=q===0?'GUEST':q===1?'LIST':'';
  const tear=left?'polygon(0 0,100% 0,96% 12%,100% 25%,94% 38%,99% 52%,95% 66%,100% 80%,96% 92%,100% 100%,0 100%)':'polygon(4% 0,100% 0,100% 100%,0 100%,4% 90%,0 76%,5% 62%,1% 48%,6% 34%,0 20%,5% 8%)';
  const ttear=q<2?'':'';
  return `<div style="background:#f6efdc;clip-path:${tear};padding:8px ${left?'14px':'8px'} 8px ${left?'8px':'14px'};font-family:Georgia,serif;color:#2a1f14;min-height:118px;${q>=2?'border-top:2px dashed #c9b88e;':''}">
    <div style="height:20px;font-weight:700;letter-spacing:3px;font-size:13px;text-align:${left?'right':'left'};color:#5a3a1a">${head}</div>
    ${rows.map(r=>`<div style="height:30px;display:flex;align-items:center;justify-content:${left?'flex-end':'space-between'};gap:6px;font-size:14px;border-bottom:1px solid #d9caa4;white-space:nowrap">${left?`<span style="font-size:11px;color:#8a7a5a;margin-right:auto">${r+1}.</span><span>${U(LIST[r][0])}</span>`:`<span>${U(LIST[r][1])}</span><span style="font-size:11px;color:#8a7a5a">${LIST[r][2]}</span>`}</div>`).join('')}
    ${q===3?'<div style="font-family:Caveat,cursive;font-size:15px;text-align:right;color:#5a3a1a;margin-top:4px">R.F.</div>':''}${q===2?'<div style="height:22px"></div>':''}
  </div>`;
}

EXPERIENCES[ID]={
  id:ID, title:"Murder at the Gala", titleHTML:"MURDER AT<br>THE <span>GALA</span>",
  tag:"A 1920s whodunit escape room",
  blurb:"Midnight, 1925. Lord Featherstone raised his glass at his own masquerade, took one sip, and fell face-first into the cake. Somebody slipped him a sleeping powder. Unmask them before he wakes up.",
  menuBlurb:"The host is snoring in the cake. One of his masked guests did it.",
  menuLine:"Unmask the culprit",
  theme:{accent:'#f3c96b',accent2:'#ffe3a3',bg:'#0a0912',introBg:'#2a1838',door:'linear-gradient(90deg,#1a1626,#2e2840 50%,#1a1626)',doorFrame:'#c9a24a',boxColor:'linear-gradient(#2e2840,#14111c)'},
  sceneCSS:`
${P}{background:#0c0b16}
${P} .wall{position:absolute;left:0;right:0;top:0;height:60%;background:repeating-linear-gradient(90deg,transparent 0 30px,rgba(232,192,112,.12) 30px 31px,transparent 31px 34px,rgba(232,192,112,.12) 34px 35px),linear-gradient(#17142a,#221a36)}
${P} .sun{position:absolute;left:50%;top:22%;width:120%;aspect-ratio:1;transform:translate(-50%,-50%);background:repeating-conic-gradient(from 90deg,rgba(243,201,107,.16) 0 4deg,transparent 4deg 12deg);-webkit-mask:radial-gradient(circle,#000 18%,transparent 60%);mask:radial-gradient(circle,#000 18%,transparent 60%)}
${P} .arch{position:absolute;left:24%;right:24%;top:10%;height:20%;border:3px solid #c9a24a;border-bottom:none;border-radius:50% 50% 0 0/80% 80% 0 0;box-shadow:inset 0 0 0 5px rgba(201,162,74,.25)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:42%;overflow:hidden;background:#141018}
${P} .floor::before{content:"";position:absolute;left:-40%;right:-40%;top:0;height:220%;background:repeating-conic-gradient(#ece4d2 0 25%,#1c1824 0 50%) 0 0/16% 9%;transform:perspective(260px) rotateX(52deg);transform-origin:50% 0}
${P} .floor::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(12,11,22,.85),rgba(12,11,22,.2) 50%,rgba(12,11,22,.5))}
${P} .balcony{position:absolute;left:14%;right:14%;top:27%;height:5%;background:repeating-linear-gradient(90deg,#c9a24a 0 3px,transparent 3px 11px);border-top:4px solid #e8c070;border-bottom:3px solid #8a6a24;z-index:1}
${P} .stairs{position:absolute;left:20%;right:20%;top:32%;height:28%;background:repeating-linear-gradient(180deg,#3a3050 0 9%,#2a2238 9% 11%);clip-path:polygon(30% 0,70% 0,100% 100%,0 100%)}
${P} .runner{position:absolute;left:20%;right:20%;top:32%;height:28%;background:repeating-linear-gradient(180deg,#a0202e 0 9%,#6e1420 9% 11%);clip-path:polygon(42% 0,58% 0,68% 100%,32% 100%)}
${P} .ban{position:absolute;top:32%;height:31%;width:4px;margin-left:-2px;background:linear-gradient(#ffe08a,#a07a24);border-radius:2px}
${P} .ban.l{left:36.8%;transform:rotate(23.4deg);transform-origin:top} ${P} .ban.r{left:63.2%;transform:rotate(-23.4deg);transform-origin:top}
${P} .twinkle{position:absolute;width:5px;height:5px;background:#ffe9b0;clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);animation:twinkle 2.8s infinite;z-index:1}
/* chandelier (wave 2) */
${P} #o-chand{left:28%;top:0;width:44%;height:22%;transform:translateY(-38%);filter:brightness(.45) saturate(.6);transition:transform 1.6s cubic-bezier(.4,1.3,.5,1),filter 1s}
${P} #o-chand .sw{position:absolute;inset:0;transform-origin:50% 0;animation:murder-gala-sway 5s ease-in-out infinite}
${P} #o-chand svg{position:absolute;inset:0;width:100%;height:100%}
${P} #o-chand .bulb{animation:glowpulse 1.8s infinite}
${P} #o-chand .tag{opacity:0;transition:opacity .6s .9s}
${P} #o-chand.revealed{transform:translateY(0);filter:brightness(1.1) drop-shadow(0 0 14px rgba(255,220,140,.7))}
${P} #o-chand.revealed .tag{opacity:1}
/* gramophone (wave 2) */
${P} #o-gramo{left:2%;top:33%;width:27%;height:25%}
${P} #o-gramo svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
${P} #o-gramo .rec{transform-box:fill-box;transform-origin:50% 50%}
${P} #o-gramo.revealed .rec{animation:spin 2.4s linear infinite}
${P} #o-gramo .dome{position:absolute;left:-2%;right:-2%;top:2%;bottom:16%;border-radius:50% 50% 8px 8px/40% 40% 8px 8px;background:linear-gradient(110deg,rgba(255,255,255,.28),rgba(255,255,255,.05) 35%,rgba(255,255,255,.14) 60%,rgba(255,255,255,.04));border:2px solid rgba(220,230,255,.45);transition:transform 1.4s cubic-bezier(.5,0,.3,1),opacity 1.4s}
${P} #o-gramo .dome::after{content:"";position:absolute;left:44%;top:-8%;width:12%;height:10%;border-radius:50%;background:#c9a24a}
${P} #o-gramo.revealed .dome{transform:translateY(-140%);opacity:0}
${P} #o-gramo .note{position:absolute;font-size:14px;color:#ffe3a3;opacity:0;font-family:Georgia,serif}
${P} #o-gramo.revealed .note{animation:murder-gala-note 3s linear infinite}
/* mask wall */
${P} #o-masks{right:2%;top:31%;width:26%;height:23%;background:linear-gradient(#2a2238,#1a1626);border:3px solid #c9a24a;border-radius:50% 50% 4px 4px/24% 24% 4px 4px;box-shadow:0 6px 16px rgba(0,0,0,.6),inset 0 0 0 3px rgba(201,162,74,.25)}
${P} #o-masks svg{position:absolute;inset:4%;width:92%;height:92%}
/* champagne tower */
${P} #o-tower{right:3%;top:57%;width:31%;height:27%}
${P} #o-tower svg{position:absolute;inset:0;width:100%;height:100%}
${P} .bub{position:absolute;width:3px;height:3px;border-radius:50%;background:#fff6d0;opacity:0;animation:murder-gala-bub 2.6s linear infinite;pointer-events:none;z-index:3}
/* sleeping host */
${P} .host{position:absolute;left:3%;top:61%;width:30%;height:17%}
${P} .host svg{width:100%;height:100%}
${P} .zz{position:absolute;font-family:Georgia,serif;font-weight:700;color:#cfd8ff;opacity:0;animation:murder-gala-z 3.6s ease-out infinite;z-index:3}
/* golden mask (final) */
${P} #o-mask{left:34%;top:61%;width:32%;height:22%}
${P} #o-mask .ped{position:absolute;left:22%;right:22%;top:52%;bottom:0;background:linear-gradient(90deg,#14111c,#2e2840 50%,#14111c);clip-path:polygon(10% 0,90% 0,100% 100%,0 100%);border-top:3px solid #e8c070}
${P} #o-mask .ped::after{content:"";position:absolute;left:30%;right:30%;top:20%;bottom:20%;border:2px solid #c9a24a;border-radius:2px}
${P} #o-mask .face{position:absolute;left:0;right:0;top:0;height:60%;transition:transform 1.4s cubic-bezier(.4,1.4,.5,1)}
${P} #o-mask .face svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 4px 6px rgba(0,0,0,.6))}
${P} #o-mask .lights{position:absolute;inset:0}
${P} #o-mask .lights b{position:absolute;width:7%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%) rotate(45deg);background:#3a2a40;box-shadow:inset 0 0 0 1.5px #8a6a24;transition:.4s}
${P} #o-mask .lights b.on{background:radial-gradient(circle,#e0fff8,#3ad6c4 60%);box-shadow:0 0 8px #3ad6c4,inset 0 0 0 1.5px #ffe08a}
${P} #o-mask .glow{pointer-events:none;position:absolute;left:-10%;right:-10%;top:-20%;height:90%;background:radial-gradient(ellipse,rgba(255,226,150,.8),transparent 65%);opacity:0;transition:opacity 1s}
${P} #o-mask.unmasked .face{transform:translateY(-55%) rotate(-12deg) scale(1.08)}
${P} #o-mask.unmasked .glow{opacity:1}
/* torn guest list */
${P} #o-list{left:5%;top:82%;width:26%;height:10%}
${P} #o-list i{position:absolute;width:46%;height:70%;background:#f6efdc;box-shadow:0 3px 6px rgba(0,0,0,.5)}
${P} #o-list i::before{content:"";position:absolute;left:14%;right:14%;top:28%;height:2px;background:#9a8a6a;box-shadow:0 5px 0 #9a8a6a,0 10px 0 #9a8a6a}
${P} .spot{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 18%,rgba(255,230,170,.18),transparent 50%),radial-gradient(ellipse at 50% 75%,rgba(255,220,150,.12),transparent 30%);animation:flicker 6s infinite;z-index:3}
@keyframes murder-gala-sway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
@keyframes murder-gala-bub{0%{transform:translateY(0);opacity:0}15%{opacity:.9}100%{transform:translateY(-60px);opacity:0}}
@keyframes murder-gala-z{0%{transform:translate(0,0) scale(.6);opacity:0}20%{opacity:.9}100%{transform:translate(18px,-40px) scale(1.2);opacity:0}}
@keyframes murder-gala-note{0%{transform:translate(0,0);opacity:0}20%{opacity:1}100%{transform:translate(20px,-50px) rotate(20deg);opacity:0}}
`,
  sceneHTML:`
<div class="wall"></div><div class="sun"></div><div class="arch"></div><div class="floor"></div>
<div class="stairs"></div><div class="runner"></div><div class="ban l"></div><div class="ban r"></div><div class="balcony"></div>
${[[8,8,0],[90,14,.8],[14,24,1.6],[84,4,2.2],[50,36,1.1],[70,22,.4]].map(([l,t,d])=>`<div class="twinkle" style="left:${l}%;top:${t}%;animation-delay:${d}s"></div>`).join('')}
<button class="obj" id="o-chand" aria-label="Chandelier"><div class="sw"><svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMin meet"><line x1="80" y1="0" x2="80" y2="30" stroke="#c9a24a" stroke-width="2"/><path d="M30 52Q80 76 130 52" fill="none" stroke="#e8c070" stroke-width="3"/><path d="M48 44Q80 60 112 44" fill="none" stroke="#e8c070" stroke-width="2.4"/><ellipse cx="80" cy="34" rx="12" ry="6" fill="#e8c070"/><path d="M80 34V64" stroke="#e8c070" stroke-width="3"/>${[30,55,80,105,130].map((x,i)=>{const y=i===2?64:i%4===0?52:60;return `<g><rect x="${x-2}" y="${y-12}" width="4" height="10" fill="#f6efdc"/><ellipse class="bulb" cx="${x}" cy="${y-15}" rx="3.5" ry="5" fill="#fff2b0" style="animation-delay:${i*.3}s"/><path d="M${x} ${y}l-3 9 3 6 3-6z" fill="#dff4ff" opacity=".85"/></g>`}).join('')}${[40,66,94,120].map(x=>`<path d="M${x} 56l-2.4 7 2.4 5 2.4-5z" fill="#cfeaff" opacity=".8"/>`).join('')}<g class="tag"><line x1="80" y1="70" x2="80" y2="84" stroke="#e8c070"/><rect x="68" y="84" width="24" height="14" rx="2" fill="#f6efdc" stroke="#c9a24a"/><circle cx="80" cy="91" r="5" fill="none" stroke="#5a3a1a" stroke-width="1"/><circle cx="80" cy="91" r="2.4" fill="none" stroke="#5a3a1a" stroke-width=".8"/></g></svg></div><span class="spark"></span></button>
<button class="obj" id="o-gramo" aria-label="Gramophone under a glass dome"><svg viewBox="0 0 100 92"><rect x="14" y="70" width="60" height="20" rx="2" fill="#5a3418"/><rect x="18" y="74" width="52" height="3" fill="#8a5a2a"/><rect x="12" y="66" width="64" height="6" rx="2" fill="#6e4220"/><g transform="translate(38 64) scale(1 .27)"><g class="rec"><circle r="22" fill="#111"/><circle r="15" fill="none" stroke="#333" stroke-width="1.2"/><circle r="7" fill="#a0202e"/><path d="M-20-3A20 20 0 0 1-3-20" stroke="#5a5a5a" stroke-width="2" fill="none"/><circle cx="3" cy="-3" r="1.6" fill="#e8c070"/></g></g><path d="M56 62L62 34" stroke="#c9a24a" stroke-width="3"/><path d="M60 38C64 20 78 6 96 0C100 14 96 30 84 40C76 46 66 44 60 38Z" fill="#c9a24a" stroke="#8a6a24" stroke-width="1.2"/><path d="M62 37C70 24 82 14 94 6" stroke="#ffe08a" stroke-width="1.6" fill="none" opacity=".8"/><ellipse cx="88" cy="22" rx="7" ry="16" transform="rotate(35 88 22)" fill="#2a1a08" opacity=".8"/></svg><div class="dome"></div><span class="note" style="left:70%;top:-6%">&#9834;</span><span class="note" style="left:82%;top:4%;animation-delay:1.4s">&#9835;</span><span class="spark"></span></button>
<button class="obj" id="o-masks" aria-label="Wall of masks"><svg viewBox="0 0 100 90">${mask('Peacock',30,30,.95)}${mask('Owl',72,32,.95)}${mask('Fox',22,66,.9)}${mask('Swan',52,66,.9)}${mask('Cat',80,68,.9)}</svg><span class="spark"></span></button>
<div class="host"><svg viewBox="0 0 120 70"><path d="M6 30Q6 14 22 16L30 34H100Q114 34 114 46V58H6Z" fill="#7a1a2a"/><rect x="6" y="54" width="108" height="6" rx="2" fill="#5a1020"/><rect x="10" y="60" width="5" height="8" fill="#c9a24a"/><rect x="104" y="60" width="5" height="8" fill="#c9a24a"/><ellipse cx="72" cy="40" rx="30" ry="8" fill="#1a1a22"/><circle cx="40" cy="34" r="9" fill="#f0d0b0"/><path d="M33 34q7 4 14 0" stroke="#5a3a2a" stroke-width="1.2" fill="none"/><path d="M34 30h4M42 30h4" stroke="#3a2a1a" stroke-width="1.2"/><path d="M36 37q4 2 8 0" stroke="#3a2a1a" stroke-width="1" fill="none"/><path d="M40 40l6 3h-6z" fill="#fff"/><rect x="28" y="16" width="12" height="12" rx="1" fill="#141418" transform="rotate(-30 34 22)"/><rect x="25" y="26" width="18" height="3" rx="1" fill="#141418" transform="rotate(-30 34 22)"/><path d="M96 44q8-10 14-2" fill="#fff6e8" stroke="#e8c070"/><circle cx="104" cy="38" r="2" fill="#c8202a"/></svg></div>
<span class="zz" style="left:12%;top:61%;font-size:15px">z</span><span class="zz" style="left:14%;top:61%;font-size:21px;animation-delay:1.2s">Z</span><span class="zz" style="left:10%;top:61%;font-size:13px;animation-delay:2.4s">z</span>
<button class="obj" id="o-tower" aria-label="Champagne tower"><svg viewBox="0 0 120 100"><ellipse cx="60" cy="92" rx="54" ry="7" fill="#e8dcc0"/><rect x="10" y="88" width="100" height="5" fill="#d8ccb0"/>${[[4,82],[3,68],[2,54],[1,40]].map(([n,y],r)=>[...Array(n)].map((_,i)=>{const x=60-(n-1)*13+i*26;return `<g transform="translate(${x} ${y})"><path d="M-12-6Q0 6 12-6Z" fill="#f6dc8a" fill-opacity=".9" stroke="#e8c070"/><line x1="0" y1="0" x2="0" y2="8" stroke="#e8c070" stroke-width="1.4"/><ellipse cx="0" cy="8" rx="5" ry="1.4" fill="#e8c070"/></g>`}).join('')).join('')}<path d="M54 30l-2-14h16l-2 14z" fill="#1d4a2a"/><rect x="57" y="8" width="6" height="9" fill="#1d4a2a"/><rect x="56" y="6" width="8" height="3" fill="#e8c070"/></svg><span class="spark"></span></button>
${[[78,72,0],[86,66,.7],[70,62,1.3],[82,58,1.9],[90,74,.4]].map(([l,t,d])=>`<span class="bub" style="left:${l}%;top:${t}%;animation-delay:${d}s"></span>`).join('')}
<button class="obj" id="o-mask" aria-label="The golden mask"><div class="glow"></div><div class="ped"></div><div class="face"><svg viewBox="-40 -24 80 40">${[-34,-22,-11,0,11,22,34].map(a=>`<g transform="rotate(${a} 0 -2)"><path d="M0-4C-3-14 0-22 0-24 0-22 3-14 0-4Z" fill="#f6efdc" opacity=".9"/></g>`).join('')}<path d="M-36-4C-36-14-14-14 0-6 14-14 36-14 36-4 36 10 18 16 0 8-18 16-36 10-36-4Z" fill="#e8c070" stroke="#8a6a24" stroke-width="1.4"/><path d="M-30-4C-30-10-14-10 0-3 14-10 30-10 30-4" fill="none" stroke="#fff3c0" stroke-width="1" opacity=".7"/><ellipse cx="-15" cy="0" rx="8" ry="4.6" fill="#0c0b16"/><ellipse cx="15" cy="0" rx="8" ry="4.6" fill="#0c0b16"/></svg><div class="lights">${[[12,30],[24,22],[38,20],[62,20],[76,22],[88,30]].map(([l,t])=>`<b style="left:${l}%;top:${t}%"></b>`).join('')}</div></div><span class="spark"></span></button>
<button class="obj" id="o-list" aria-label="Torn guest list on the floor"><i style="left:0;top:10%;transform:rotate(-14deg)"></i><i style="left:30%;top:30%;transform:rotate(9deg)"></i><i style="left:54%;top:0;transform:rotate(-4deg)"></i><span class="spark"></span></button>
<div class="spot"></div>`,
  order:["alibis","list","tower","gramo","chand","mask"],
  revealOnWave2:[{sel:'#o-gramo',cls:'revealed'},{sel:'#o-chand',cls:'revealed'}],
  wave2Toast:"The glass dome lifted off the gramophone and the chandelier just lowered, lights blazing.",
  finalReadyToast:"All five letters are in the golden mask. Time to name the culprit.",
  startToast:"Lord Featherstone is snoring in the cake. Tap anything that sparkles. Three locks are ready.",
  locks:{
    /* ALIBIS. Five masks, five spots, one each. Cat in {Stairs,Tower} and {Stairs,Balcony} -> Cat=Stairs.
       Owl in {Stairs,Gramophone} -> Gramophone. Fox in {Dance,Gramophone} -> Dance. Peacock in {Dance,Tower} -> Tower. Swan -> Balcony.
       Unique (node brute force over 120 orders). Dropping any one card leaves 2+ masks possible at the tower. Answer PEACOCK. */
    alibis:{wave:1,title:"The Alibis",obj:"o-masks",answer:"PEACOCK",kind:"word",tile:"I",
      scene:"At ten to midnight someone tipped powder into the host's glass at the champagne tower. Five masked guests were in the room, each at a different spot. The staff saw a little each. <em>\"Which mask was at the champagne tower?\"</em>",
      extra:suspectsArt(),
      cards:["Butler: \"The Cat was either on the grand staircase or by the champagne tower.\"","Maid: \"The Cat was either on the grand staircase or up on the balcony.\"","Bandleader: \"The Fox was either on the dance floor or at the gramophone.\"","Photographer: \"The Peacock was either on the dance floor or at the champagne tower.\"","Cook: \"The Owl was either on the grand staircase or at the gramophone.\""],
      hints:["Two staff members talk about the Cat. Only one spot fits both.","The Cat was on the staircase. That pins down the Owl, then the Fox.","Owl at the gramophone, Fox dancing, so the Peacock was at the tower. The answer is PEACOCK."]},
    /* LIST. Pieces: TL lines 1-3 left halves, TR lines 1-3 right halves, BL lines 4-6 left, BR lines 4-6 right.
       Underlines: 1 Sterling (TR), 2 Colonel (TL), 3 Crumb (TR), 4 Rupert (BL), 5 Fenwick (BR), 6 Toby (BL).
       Line order: S E C R E T = SECRET. Reading piece by piece (TL,TR,BL,BR) gives E S C R T E, so reassembly is needed. */
    list:{wave:1,title:"The Torn Guest List",obj:"o-list",answer:"SECRET",kind:"word",tile:"M",splitArt:true,
      scene:"The host's guest list, torn in four and kicked under the chaise. He underlined one letter on every line in red ink. <em>\"Put the list back together and read the underlined letters from line 1 to line 6.\"</em>",
      extra:()=>`<div class="photo-grid" style="gap:10px 2px">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-2,1.5,1.5,-1.5][i]}deg;animation-delay:${i*.08}s;padding:0;background:none;box-shadow:none"><span class="ph" style="z-index:2">PHONE ${i+1}</span>${listPiece(i)}</div>`).join('')}</div>`,
      hints:["The left pieces have the line numbers. Match each right piece to its left piece, row by row.","Line 1 is Lady Mavis Sterling, and the S of Sterling is underlined. Line 2's mark is in Colonel.","S, E, C, R, E, T. The answer is SECRET."]},
    /* TOWER. Each glass = sum of the two below. Bottom A-E: 8 5 9 6 7.
       Row 2: 13 14 15 13. Row 3: 27 29 28. Row 4: 56 57. Top: 113. (node) */
    tower:{wave:1,title:"The Champagne Tower",obj:"o-tower",answer:"113",kind:"num",tile:"S",
      scene:"Every glass in the tower has a number etched on its base. <em>\"Each glass carries the total of the two glasses it rests on.\"</em> If 2 and 3 hold up a glass, that glass is 5. What is the top glass?",
      extra:towerSVG(),
      cards:["Bottom row, glass A: 8","Bottom row, glass B: 5","Bottom row, glass C: 9","Bottom row, glass D: 6","Bottom row, glass E: 7"],
      hints:["Start at the bottom. A and B hold up a glass worth 8 + 5.","The second row is 13, 14, 15, 13. Keep adding pairs going up.","27, 29, 28, then 56, 57. The top glass is 113."]},
    /* GRAMO. 24 letters clockwise from the star: F Q L E M O A U R T N W H P G E K C R Y B S D J.
       Read one, skip two: positions 0,3,6,...,21 = F E A T H E R S. Other offsets: QMUNPKYD, LORWGCBJ. (node)
       Each quarter holds 2 of the 8 letters, so all four pieces are needed. */
    gramo:{wave:2,title:"The Skipping Record",obj:"o-gramo",answer:"FEATHERS",kind:"word",tile:"A",splitArt:true,
      lockedMsg:"The gramophone is under a locked glass dome. Crack two of the first locks to lift it.",
      scene:"The record was cracked into quarters, but the letters round the edge survive. The needle always skipped: <em>play one groove, jump two.</em> Start at the gold star, go clockwise, read one letter, skip two, and so on round the record. It tells you where the powder was hidden.",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1.5,1.5,1,-1][i]}deg;animation-delay:${i*.08}s;padding:4px"><span class="ph">PHONE ${i+1}</span>${recordPiece(i)}</div>`).join('')}</div>`,
      hints:["The star is at the top. F is the first letter. Then skip two letters and read the next one.","Put the four quarters together in your heads: the top-right piece comes first, then bottom-right, bottom-left, top-left.","F, E, A, T, H, E, R, S. The answer is FEATHERS."]},
    /* CHAND. Cipher ring: outer (crystal) letter X -> inner (real) letter X-5. Crystals Q N U X Y N H P -> L I P S T I C K. (node) */
    chand:{wave:2,title:"The Crystal Cipher",obj:"o-chand",answer:"LIPSTICK",kind:"word",tile:"V",
      lockedMsg:"The chandelier is too high to reach. Crack two of the first locks to lower it.",
      scene:"Eight crystals hang from the lowered chandelier, each etched with a letter. The tag on its chain shows a cipher ring. <em>\"Find each crystal's letter on the OUTER ring and read the real letter just inside it.\"</em> It's what the culprit left on the glass.",
      extra:wheelSVG(),
      cards:["Crystals 1 and 2: Q N","Crystals 3 and 4: U X","Crystals 5 and 6: Y N","Crystals 7 and 8: H P"],
      hints:["Find Q on the outside ring. The letter right inside it is the first real letter.","Q is L, N is I, U is P. Keep going.","L I P S T I C K. The answer is LIPSTICK."]},
    /* MASK. Tiles M A V I S -> MAVIS (Lady Mavis Sterling, line 1 of the guest list). No other real-word anagram. */
    mask:{wave:3,title:"The Golden Mask",obj:"o-mask",answer:"MAVIS",kind:"word",onSolve:[{sel:'#o-mask',cls:'unmasked'}],
      scene:"At midnight everyone unmasks. Each lock drops a letter into the host's golden mask. <em>\"The Peacock hid the powder in her feathers and left lipstick on the glass. Spell her first name. She's on the guest list.\"</em>",
      hints:["Check the guest list: it's one of the six first names.","She's on line 1 of the guest list.","Lady Mavis Sterling. The answer is MAVIS."]}
  },
  finale:{tag:"CASE CLOSED",titleHTML:"THE PEACOCK<br>IS <span>UNMASKED</span>",
    cardHTML:`<svg viewBox="-60 -80 120 104" style="width:150px;display:block;margin:0 auto 6px"><g>${mask('Peacock',0,0,2.2)}<animateTransform attributeName="transform" type="rotate" values="-5 0 0;5 0 0;-5 0 0" dur="3s" repeatCount="indefinite"/></g></svg><h3>Lady Mavis Sterling</h3>At midnight the Lord planned to announce his sister's SECRET: for ten years her "homemade" prize-winning cakes came from the shop on the corner. So she tipped sleeping powder from her peacock feathers into his glass, and left a perfect lipstick print on the rim.<div class="note">"Lord Featherstone woke at 1 a.m., wiped the icing off his face, and asked for another slice. Case closed."</div>`}
};
EXP_ORDER.push(ID);
})();
