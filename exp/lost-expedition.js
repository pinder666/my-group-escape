(function(){
const ID='lost-expedition', P=`.scene[data-exp="${ID}"]`;

/* ---------- map pieces (6x6 grid, rows 1-6 north to south, cols 1-6 west to east) ---------- */
const LM={'6,1':['Camp','tent'],'3,1':['Rock','rock'],'3,5':['Idol','idol'],'1,5':['Vines','vine'],'6,5':['Eagle','bird'],'6,3':['Reeds','reed'],
  '4,1':['Hut','hut'],'2,1':['Cave','cave'],'3,4':['Lake','lake'],'3,6':['Bats','bat'],'2,5':['Owl','bird'],'5,5':['Moss','tree'],'6,4':['Palm','palm'],
  '6,2':['Fern','reed'],'1,2':['Ants','ants'],'2,3':['Snake','snake'],'5,3':['Frogs','frog'],'4,6':['Tapir','rock'],'4,4':['Bones','bones'],'1,4':['Hill','hill'],'5,1':['Mud','lake']};
function icon(t){
  switch(t){
    case 'tent':return `<path d="M-7 4 L0 -7 L7 4Z" fill="#e8b64a" stroke="#5a3a12" stroke-width="1"/><path d="M0 -7 V4" stroke="#5a3a12" stroke-width="1"/>`;
    case 'rock':return `<path d="M-7 4 Q-6 -5 0 -5 Q7 -4 7 4Z" fill="#8d8a80" stroke="#4a463e" stroke-width=".8"/>`;
    case 'idol':return `<rect x="-5" y="-7" width="10" height="11" rx="2" fill="#9a9478" stroke="#4a463e" stroke-width=".8"/><circle cx="-2" cy="-3" r="1.1" fill="#2a2618"/><circle cx="2" cy="-3" r="1.1" fill="#2a2618"/><path d="M-2.5 1h5" stroke="#2a2618" stroke-width="1"/>`;
    case 'vine':return `<path d="M-7 -6 Q-2 -2 -6 2 Q-2 5 0 3 M7 -6 Q2 -2 6 2 Q2 5 0 3" fill="none" stroke="#2f6b1f" stroke-width="1.6"/><path d="M-7 -6 H7" stroke="#6b4a22" stroke-width="1.4"/>`;
    case 'bird':return `<path d="M-7 -3 Q-3 -6 0 -1 Q3 -6 7 -3" fill="none" stroke="#2a2a2a" stroke-width="1.6"/>`;
    case 'reed':return `<path d="M-4 4V-5M0 4V-7M4 4V-4" stroke="#4f7a2a" stroke-width="1.4"/><ellipse cx="0" cy="-7" rx="1.2" ry="2.2" fill="#7a5226"/>`;
    case 'hut':return `<path d="M-7 -1 L0 -7 L7 -1Z" fill="#a8823e"/><rect x="-5" y="-1" width="10" height="6" fill="#7a5a2a"/>`;
    case 'cave':return `<path d="M-7 4 Q-7 -6 0 -6 Q7 -6 7 4Z" fill="#6f6a60"/><path d="M-3 4 Q-3 -2 0 -2 Q3 -2 3 4Z" fill="#1a1712"/>`;
    case 'lake':return `<ellipse cx="0" cy="-1" rx="8" ry="4.5" fill="#5b9ab8" stroke="#2f6680" stroke-width=".8"/>`;
    case 'bat':return `<path d="M0 -2 Q-3 -6 -8 -4 Q-5 -2 -6 1 Q-3 -1 0 1 Q3 -1 6 1 Q5 -2 8 -4 Q3 -6 0 -2Z" fill="#2a2230"/>`;
    case 'tree':return `<rect x="-1" y="0" width="2" height="5" fill="#6b4a22"/><circle cx="0" cy="-3" r="5" fill="#3f7a2a"/>`;
    case 'palm':return `<path d="M0 5 Q1 0 0 -4" stroke="#6b4a22" stroke-width="1.6" fill="none"/><path d="M0 -4 Q-5 -7 -8 -3 M0 -4 Q5 -7 8 -3 M0 -4 Q-3 -8 -1 -9 M0 -4 Q3 -8 2 -9" stroke="#3f7a2a" stroke-width="1.8" fill="none"/>`;
    case 'ants':return `<g fill="#3a2010"><circle cx="-5" cy="1" r="1.4"/><circle cx="-1" cy="-2" r="1.4"/><circle cx="3" cy="1" r="1.4"/><circle cx="6" cy="-3" r="1.4"/></g>`;
    case 'snake':return `<path d="M-8 2 Q-5 -4 -2 1 Q1 6 4 0 Q6 -4 8 -2" fill="none" stroke="#6f8f2a" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'frog':return `<ellipse cx="0" cy="0" rx="5" ry="3.5" fill="#5aa83a"/><circle cx="-2.5" cy="-3" r="1.6" fill="#5aa83a"/><circle cx="2.5" cy="-3" r="1.6" fill="#5aa83a"/>`;
    case 'bones':return `<path d="M-6 3 L6 -4 M-6 -4 L6 3" stroke="#f1ead6" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'hill':return `<path d="M-8 4 Q0 -10 8 4Z" fill="#6f8f45"/>`;
  }
  return '';
}
function mapPiece(q){
  const r0=q<2?1:4, c0=q%2===0?1:4; let g=`<rect width="90" height="90" fill="#d9c58f"/>`;
  // texture
  g+=`<path d="M0 ${q<2?70:10} Q30 ${q<2?60:25} 60 ${q<2?75:5} T90 ${q<2?65:20}" fill="none" stroke="#c7b07a" stroke-width="5" opacity=".6"/>`;
  for(let i=0;i<=3;i++) g+=`<path d="M${i*30} 0V90M0 ${i*30}H90" stroke="#8a6a3a" stroke-width="${i%3===0?1.6:.7}" stroke-dasharray="${i%3===0?'':'2 2'}"/>`;
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
    const L=LM[(r0+r)+','+(c0+c)]; if(!L)continue;
    const x=c*30+15,y=r*30+13;
    g+=`<g transform="translate(${x} ${y})">${icon(L[1])}</g><text x="${x}" y="${r*30+27}" text-anchor="middle" font-size="7.2" font-weight="700" font-family="Inter,sans-serif" fill="#3a2410">${L[0]}</text>`;
  }
  if(q===0) g+=`<g transform="translate(9 9)"><circle r="7" fill="#f3e6bf" stroke="#8a6a3a" stroke-width=".8"/><path d="M0 -6 L2 0 L0 6 L-2 0Z" fill="#b8402a"/><path d="M0 0 L2 0 L0 6 L-2 0Z" fill="#3a2410"/><text y="-8.5" text-anchor="middle" font-size="5.5" font-weight="700" fill="#b8402a" font-family="Inter,sans-serif">N</text></g>`;
  const edge=['M90 0V90M0 90H90','M0 0V90M0 90H90','M90 0V90M0 0H90','M0 0V90M0 0H90'][q];
  g+=`<path d="${edge}" stroke="#f4ead2" stroke-width="2" stroke-dasharray="4 3" opacity=".9"/>`;
  return `<svg viewBox="0 0 90 90" role="img" aria-label="Map piece ${q+1}">${g}</svg>`;
}

/* ---------- compass dial ---------- */
function compassSVG(){
  const D=['N','NE','E','SE','S','SW','W','NW'], NUM=[7,2,9,4,1,6,3,8]; let g='';
  g+=`<circle cx="100" cy="100" r="92" fill="#3a2a14"/><circle cx="100" cy="100" r="86" fill="#c9a24a"/><circle cx="100" cy="100" r="62" fill="#f1e4bf" stroke="#7a5a22" stroke-width="2"/>`;
  D.forEach((d,i)=>{const a=(i*45-90)*Math.PI/180;
    const lx=100+48*Math.cos(a), ly=100+48*Math.sin(a), nx=100+75*Math.cos(a), ny=100+75*Math.sin(a);
    g+=`<path d="M${100+58*Math.cos(a)} ${100+58*Math.sin(a)} L${100+62*Math.cos(a)} ${100+62*Math.sin(a)}" stroke="#7a5a22" stroke-width="2"/>`;
    g+=`<text x="${lx}" y="${ly+4}" text-anchor="middle" font-size="${d.length>1?11:14}" font-weight="700" font-family="Inter,sans-serif" fill="${d==='N'?'#b8402a':'#3a2410'}">${d}</text>`;
    g+=`<circle cx="${nx}" cy="${ny}" r="10" fill="#1d3a1a" stroke="#f1e4bf" stroke-width="1.5"/><text x="${nx}" y="${ny+5}" text-anchor="middle" font-size="14" font-family="'Archivo Black',Inter,sans-serif" fill="#ffd27a">${NUM[i]}</text>`;});
  g+=`<path d="M100 66 L106 100 L100 134 L94 100Z" fill="#3a2410"/><path d="M100 66 L106 100 L94 100Z" fill="#b8402a"/><circle cx="100" cy="100" r="4" fill="#c9a24a"/>`;
  return `<svg viewBox="0 0 200 200" style="max-width:230px;margin:0 auto" role="img" aria-label="Compass dial: N 7, NE 2, E 9, SE 4, S 1, SW 6, W 3, NW 8">${g}</svg>`;
}

/* ---------- tracks ---------- */
function boot(x,y,r){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.35)"><ellipse cx="0" cy="-3" rx="4" ry="5.5" fill="#3b2614"/><ellipse cx="0" cy="6" rx="3.2" ry="3.2" fill="#3b2614"/><path d="M-3 -6h6M-3 -3h6M-3 0h6" stroke="#6b4a2a" stroke-width=".8"/></g>`}
function paw(x,y,r){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.35)" fill="#3b2614"><path d="M-5 3 Q-5 -2 0 -1 Q5 -2 5 3 Q4 6 0 5 Q-4 6 -5 3Z"/><ellipse cx="-5.2" cy="-4.5" rx="1.7" ry="2.2"/><ellipse cx="-1.8" cy="-6.8" rx="1.7" ry="2.2"/><ellipse cx="1.8" cy="-6.8" rx="1.7" ry="2.2"/><ellipse cx="5.2" cy="-4.5" rx="1.7" ry="2.2"/></g>`}
function hand(x,y,r){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.35)" stroke="#3b2614" stroke-width="2" stroke-linecap="round" fill="#3b2614"><ellipse cx="0" cy="2" rx="3.6" ry="4" stroke="none"/><path d="M-3 -1 L-4.5 -7M-1 -2 L-1.2 -8.5M1 -2 L1.3 -8.5M3 -1 L4.5 -7M-3.4 3 L-7.5 1" fill="none"/></g>`}
function bird(x,y,r){return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.35)" stroke="#4a3420" stroke-width="1.4" stroke-linecap="round" fill="none"><path d="M0 5 V-2 M0 -2 L-4 -6 M0 -2 V-7 M0 -2 L4 -6"/></g>`}
// [boots, paws, hands, birds] per piece: 2/1/2/2, 2/0/1/1, 1/2/1/2, 2/1/2/1  -> boots 7, paws 4, hands 6
const TRACKS=[
  [[boot,22,62,-10],[boot,40,30,-5],[paw,70,52,20],[hand,62,18,-15],[hand,18,26,10],[bird,76,78,0],[bird,48,76,30]],
  [[boot,30,70,0],[boot,52,38,8],[hand,74,64,15],[bird,20,22,-20]],
  [[boot,60,24,-8],[paw,24,60,-15],[paw,46,78,10],[hand,76,60,20],[bird,22,22,10],[bird,72,82,-30]],
  [[boot,36,58,6],[boot,58,22,12],[paw,20,24,-10],[hand,72,70,-20],[hand,44,82,15],[bird,78,40,20]]
];
function trackPiece(i){
  let g=`<rect width="90" height="90" fill="#6e5236"/><ellipse cx="${[20,70,40,60][i]}" cy="${[80,14,40,86][i]}" rx="16" ry="8" fill="#5c4329"/><path d="M${[0,10,0,5][i]} 8 q8 -4 14 0 M66 ${[40,82,30,50][i]} q6 -5 12 0" stroke="#3f5a2a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  g+=TRACKS[i].map(([f,x,y,r])=>f(x,y,r)).join('');
  return `<svg viewBox="0 0 90 90" role="img" aria-label="Mud piece ${i+1}">${g}</svg>`;
}
function trackKey(){
  const k=[[boot,'Boots','#f4ead2'],[paw,'Paws','#f4ead2'],[hand,'Hands','#f4ead2'],[bird,'Birds','#9a8f7a']];
  return `<svg viewBox="0 0 200 44" role="img" aria-label="Track key">${k.map(([f,n,c],i)=>`<g transform="translate(${i*50} 0)"><rect x="3" y="2" width="44" height="40" rx="6" fill="#6e5236"/>${f(25,18,0)}<text x="25" y="38" text-anchor="middle" font-size="8.5" font-weight="700" fill="${c}" font-family="Inter,sans-serif">${n}</text></g>`).join('')}<path d="M155 6 L193 38" stroke="#d24a2a" stroke-width="2.4"/></svg>`;
}

/* ---------- butterflies ---------- */
const BUTTER={B:['#3f86d8',2,1],R:['#e8812a',2,0],I:['#4fae4a',1,1],D:['#3f86d8',2,0],G:['#e8812a',3,0],E:['#4fae4a',1,0]};
function fly(x,y,[col,spots,tails],n){
  const sp=s=>[...Array(spots)].map((_,i)=>`<circle cx="${s*(9+i*5)}" cy="${-9+(i%2)*5}" r="2.3" fill="#fff"/>`).join('');
  return `<g transform="translate(${x} ${y})">
  ${tails?`<path d="M-12 10 Q-19 24 -21 31 Q-14 27 -6 13Z M12 10 Q19 24 21 31 Q14 27 6 13Z" fill="${col}" stroke="#1a1410" stroke-width="1.1"/>`:''}
  <path d="M-2 -2 Q-26 -24 -26 -6 Q-24 4 -2 2Z M2 -2 Q26 -24 26 -6 Q24 4 2 2Z" fill="${col}" stroke="#1a1410" stroke-width="1.2"/>
  <path d="M-2 2 Q-18 4 -16 14 Q-10 18 -2 6Z M2 2 Q18 4 16 14 Q10 18 2 6Z" fill="${col}" stroke="#1a1410" stroke-width="1.2" opacity=".92"/>
  ${sp(-1)}${sp(1)}
  <ellipse cx="0" cy="2" rx="2.2" ry="11" fill="#1a1410"/><path d="M-1 -8 Q-4 -16 -7 -17 M1 -8 Q4 -16 7 -17" stroke="#1a1410" stroke-width="1" fill="none"/>
  <path d="M0 9 V35" stroke="#b9a27a" stroke-width="1"/><circle cx="0" cy="-2" r="1.6" fill="#d8d0c0"/>
  <rect x="-8" y="35" width="16" height="11" rx="2" fill="#f4ead2"/><text x="0" y="44" text-anchor="middle" font-size="9" font-weight="700" fill="#3a2410" font-family="Inter,sans-serif">${n}</text></g>`;
}
function caseSVG(){
  const order='BRIDGE'.split(''); let g=`<rect x="2" y="2" width="296" height="196" rx="8" fill="#5a3a1c"/><rect x="12" y="12" width="276" height="176" rx="4" fill="#efe3c2"/><path d="M12 100 H288" stroke="#d8c79c" stroke-width="1"/>`;
  order.forEach((k,i)=>{g+=fly(58+(i%3)*92,40+Math.floor(i/3)*90,BUTTER[k],i+1)});
  g+=`<path d="M14 14 L80 14 L14 60Z" fill="#fff" opacity=".18"/>`;
  return `<svg viewBox="0 0 300 200" role="img" aria-label="Butterfly case with six butterflies numbered 1 to 6">${g}</svg>`;
}

EXPERIENCES[ID]={
  id:ID, title:"The Lost Expedition", titleHTML:"THE LOST<br><span>EXPEDITION</span>",
  tag:"A jungle escape room",
  blurb:"Dr. Amara Vance walked out of her jungle camp three days ago and never came back. Search her tent, open her trunk, and find out where she went.",
  menuBlurb:"An explorer vanished from her jungle camp. Her tent holds the trail.",
  menuLine:"Find the missing explorer",
  theme:{accent:'#9fd25a',accent2:'#ffc65a',bg:'#0a0f08',introBg:'#16240f'},
  sceneCSS:`
${P}{background:#2a2414}
${P} .outside{position:absolute;inset:0;background:linear-gradient(#2a1f45 0%,#7a3f4a 34%,#d98a45 52%,#2c3a1c 60%,#14200f 100%)}
${P} .jtree{position:absolute;bottom:38%;background:#0f1a0c;border-radius:50% 50% 0 0}
${P} .wall{position:absolute;left:0;right:0;top:0;height:60%;background:linear-gradient(90deg,rgba(0,0,0,.35),transparent 18%,transparent 82%,rgba(0,0,0,.35)),repeating-linear-gradient(90deg,#8a7446 0 2px,#7c6840 2px 34px);clip-path:polygon(0 8%,50% 0,100% 8%,100% 100%,0 100%)}
${P} .seam{position:absolute;top:0;height:60%;width:2px;background:rgba(40,30,10,.4)}
${P} .ridge{position:absolute;left:0;right:0;top:0;height:4%;background:linear-gradient(#5a4628,#3a2c18)}
${P} .pole{position:absolute;left:49%;width:2%;top:0;height:60%;background:linear-gradient(90deg,#4a361c,#7a5a30,#4a361c);z-index:1}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:40%;background:radial-gradient(ellipse at 50% 0,#3d4a26,#232c15 70%);border-top:3px solid #1a2010}
${P} .floor::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(100deg,transparent 0 40px,rgba(0,0,0,.12) 40px 42px)}
${P} .door{position:absolute;left:36%;width:28%;top:31%;height:29%;overflow:hidden;clip-path:polygon(50% 0,100% 100%,0 100%);background:linear-gradient(#4a2e52,#c4703f 58%,#24331a 59%)}
${P} .door .jtree{bottom:40%}
${P} .rain{position:absolute;inset:-20% 0 0;background:repeating-linear-gradient(105deg,transparent 0 9px,rgba(200,220,255,.28) 9px 10px);background-size:40px 40px;animation:${ID}-rain .5s linear infinite}
${P} .ff{position:absolute;width:4px;height:4px;border-radius:50%;background:#f7f08a;box-shadow:0 0 6px 2px #e6e04a;animation:${ID}-ff 7s ease-in-out infinite,twinkle 1.6s ease-in-out infinite}
${P} .win{position:absolute;left:6%;top:24%;width:22%;height:20%;border:4px solid #5a4628;border-radius:6px;overflow:hidden;background:linear-gradient(#5a3550,#c4783f 70%,#1d2a14 71%)}
${P} .win::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,rgba(0,0,0,.25) 0 1px,transparent 1px 4px)}
${P} .win .jtree{bottom:26%}
${P} .lamp{position:absolute;left:50%;top:3%;width:0;height:30%;transform-origin:top center;animation:${ID}-swing 4s ease-in-out infinite;z-index:4;pointer-events:none}
${P} .lamp .cord{position:absolute;left:-1px;top:0;width:2px;height:40%;background:#2a1e10}
${P} .lamp .body{position:absolute;left:-14px;top:38%;width:28px;height:34px;border-radius:6px 6px 10px 10px;background:radial-gradient(circle at 50% 55%,#fff3b0,#ffb43a 45%,#b8641c 75%);box-shadow:0 0 22px 8px rgba(255,180,60,.55);border:2px solid #3a2a14}
${P} .lamp .body::before{content:"";position:absolute;left:3px;right:3px;top:-8px;height:8px;border-radius:6px 6px 0 0;background:#3a2a14}
${P} .lamp .body::after{content:"";position:absolute;left:10px;right:10px;top:9px;bottom:9px;border-radius:50% 50% 40% 40%;background:#fff8d0;animation:flicker 1.3s infinite}
${P} .glow{position:absolute;left:-180px;top:20%;width:360px;height:360px;background:radial-gradient(circle,rgba(255,190,90,.30),rgba(255,170,60,.10) 40%,transparent 65%)}
${P} .mist{position:absolute;left:-40%;width:180%;height:16%;bottom:2%;background:radial-gradient(ellipse at 30% 50%,rgba(220,230,210,.16),transparent 60%),radial-gradient(ellipse at 75% 60%,rgba(220,230,210,.12),transparent 55%);animation:${ID}-mist 14s ease-in-out infinite alternate;pointer-events:none;z-index:5}
/* flap door (wave 2) */
${P} #o-flap{left:36%;top:31%;width:28%;height:29%;clip-path:polygon(50% 0,100% 100%,0 100%);z-index:2}
${P} #o-flap .trail{position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(#4a3620,#6e5236)}
${P} #o-flap .trail i{position:absolute;width:7%;height:12%;border-radius:50% 50% 45% 45%;background:#2a1a0c}
${P} #o-flap .fl,${P} #o-flap .fr{position:absolute;top:0;bottom:0;width:51%;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px 12px),linear-gradient(90deg,#3e3019,#5a4626);transition:transform 1.4s cubic-bezier(.6,.05,.3,1)}
${P} #o-flap .fl{left:0;transform-origin:0 0;box-shadow:inset -6px 0 10px rgba(0,0,0,.35)} ${P} #o-flap .fr{right:0;transform-origin:100% 0;box-shadow:inset 6px 0 10px rgba(0,0,0,.35)}
${P} #o-flap .tie{position:absolute;left:34%;width:32%;top:56%;height:9%;border-radius:40%;border:4px solid #d9b25a;box-shadow:0 0 0 1px #3a2810;transition:opacity .6s}
${P} #o-flap .tie::after{content:"";position:absolute;left:50%;top:80%;width:3px;height:120%;background:#d9b25a;transform:rotate(12deg)}
${P} .doorframe{position:absolute;left:35%;width:30%;top:29.5%;height:30.5%;background:#2a2010;clip-path:polygon(50% 0,100% 100%,0 100%)}
${P} #o-flap.revealed .fl{transform:skewY(-28deg) scaleX(.18)} ${P} #o-flap.revealed .fr{transform:skewY(28deg) scaleX(.18)}
${P} #o-flap.revealed .tie{opacity:0}
/* butterfly case (wave 2) */
${P} #o-case{right:5%;top:22%;width:25%;height:20%;background:#5a3a1c;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.5);padding:6%}
${P} #o-case .glass{position:absolute;inset:7%;background:#efe3c2;border-radius:2px;display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center;justify-items:center}
${P} #o-case .glass b{width:62%;height:44%;border-radius:50% 50% 40% 40%;clip-path:polygon(0 0,46% 40%,54% 40%,100% 0,90% 100%,54% 60%,46% 60%,10% 100%)}
${P} #o-case .net{position:absolute;inset:-12% -10% -24%;background:repeating-linear-gradient(45deg,rgba(220,220,200,.5) 0 1px,transparent 1px 4px),repeating-linear-gradient(-45deg,rgba(220,220,200,.5) 0 1px,transparent 1px 4px),rgba(30,38,22,.82);border-radius:40% 40% 10% 10%;transition:transform 1.3s cubic-bezier(.6,.05,.3,1),opacity 1.3s;transform-origin:top center}
${P} #o-case.revealed .net{transform:translateY(130%) scaleY(.4);opacity:0}
/* journal */
${P} .crate{position:absolute;left:3%;top:58%;width:23%;height:15%;background:repeating-linear-gradient(0deg,#6b4a22 0 8px,#5a3c1a 8px 10px);border:2px solid #3a2810;box-shadow:0 8px 12px rgba(0,0,0,.5)}
${P} #o-journal{left:4%;top:52%;width:20%;height:8%;background:linear-gradient(90deg,#5a2a14,#7a3a1c 12%,#7a3a1c);border-radius:3px 6px 6px 3px;transform:rotate(-6deg);box-shadow:0 4px 8px rgba(0,0,0,.5)}
${P} #o-journal::before{content:"";position:absolute;right:-2px;top:12%;bottom:12%;width:10%;background:repeating-linear-gradient(0deg,#f1e4bf 0 2px,#d9c89a 2px 3px);border-radius:0 3px 3px 0}
${P} #o-journal::after{content:"";position:absolute;left:30%;top:0;bottom:0;width:8%;background:#c9a24a}
/* table + map + compass */
${P} .table{position:absolute;left:27%;width:50%;top:61%;height:11%;background:linear-gradient(#8a6a3a,#6b4e26);clip-path:polygon(5% 0,95% 0,100% 100%,0 100%);box-shadow:0 6px 10px rgba(0,0,0,.5)}
${P} .tleg{position:absolute;top:72%;width:2.4%;height:11%;background:#3a2810}
${P} #o-map{left:29%;top:59.5%;width:26%;height:10%;background:linear-gradient(135deg,#e8d6a0,#cdb47a);transform:rotate(-4deg);box-shadow:0 3px 6px rgba(0,0,0,.45);border-radius:2px}
${P} #o-map::before{content:"";position:absolute;inset:10%;background:linear-gradient(90deg,transparent 32%,rgba(90,60,20,.45) 32% 34%,transparent 34% 66%,rgba(90,60,20,.45) 66% 68%,transparent 68%),linear-gradient(transparent 46%,rgba(90,60,20,.45) 46% 50%,transparent 50%)}
${P} #o-map::after{content:"";position:absolute;left:14%;top:22%;width:60%;height:50%;border:2px dashed #b8402a;border-width:2px 2px 0 0;border-radius:0 40% 0 0}
${P} #o-compass{left:58%;top:57.5%;width:16%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#f1e4bf 55%,#c9a24a 58%,#8a6a2a 72%,#3a2a14 74%);box-shadow:0 4px 8px rgba(0,0,0,.55)}
${P} #o-compass .needle{position:absolute;left:46%;top:16%;width:8%;height:68%;background:linear-gradient(#b8402a 50%,#2a1e10 50%);clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);animation:${ID}-wobble 2.6s ease-in-out infinite}
/* trunk (final) */
${P} #o-trunk{left:25%;top:79%;width:50%;height:15%;background:linear-gradient(#4a5a2a,#2f3c18);border-radius:6px;border:3px solid #1c2410;box-shadow:0 10px 18px rgba(0,0,0,.6)}
${P} #o-trunk::before{content:"";position:absolute;left:-4%;right:-4%;top:-26%;height:42%;background:linear-gradient(#5a6c32,#3a4a1e);border-radius:10px 10px 3px 3px;border:3px solid #1c2410}
${P} #o-trunk .strap{position:absolute;top:-26%;bottom:0;width:6%;background:#7a5226;border-left:2px solid #4a3014;border-right:2px solid #4a3014}
${P} #o-trunk .clasp{position:absolute;left:44%;width:12%;top:2%;height:22%;background:#c9a24a;border-radius:2px 2px 6px 6px;box-shadow:inset 0 -2px 0 #7a5a22}
${P} #o-trunk .lights{position:absolute;left:12%;right:12%;bottom:16%;display:flex;justify-content:space-between}
${P} #o-trunk .lights b{width:9%;aspect-ratio:1;border-radius:50%;background:#1a2010;box-shadow:inset 0 0 0 1px #000}
${P} #o-trunk .lights b.on{background:#c6f27a;box-shadow:0 0 8px #9fd25a,0 0 2px #fff inset}
${P} .bedroll{position:absolute;right:3%;top:63%;width:20%;height:9%;border-radius:40px;background:linear-gradient(#7a2e22,#561e16);box-shadow:0 6px 10px rgba(0,0,0,.5)}
${P} .bedroll::before{content:"";position:absolute;left:20%;top:-10%;bottom:-10%;width:8%;background:#c9a24a}
${P} .hat{position:absolute;right:6%;top:57%;width:15%;height:6%;border-radius:50%;background:radial-gradient(ellipse at 50% 30%,#c9a86a 30%,#a8864a 32%,#8a6a38 70%)}
${P} .hat::before{content:"";position:absolute;left:28%;right:28%;top:-55%;height:80%;border-radius:40% 40% 10% 10%;background:linear-gradient(#cfae6e,#a8864a);border-bottom:3px solid #5a3a1c}
@keyframes ${ID}-rain{to{background-position:-12px 40px}}
@keyframes ${ID}-ff{0%,100%{transform:translate(0,0)}25%{transform:translate(10px,-8px)}50%{transform:translate(-6px,-14px)}75%{transform:translate(-12px,4px)}}
@keyframes ${ID}-swing{0%,100%{transform:rotate(5deg)}50%{transform:rotate(-5deg)}}
@keyframes ${ID}-mist{from{transform:translateX(-8%)}to{transform:translateX(8%)}}
@keyframes ${ID}-wobble{0%,100%{transform:rotate(-14deg)}30%{transform:rotate(10deg)}55%{transform:rotate(-6deg)}80%{transform:rotate(16deg)}}
`,
  sceneHTML:`
<div class="outside">
  <div class="jtree" style="left:30%;width:18%;height:30%"></div><div class="jtree" style="left:44%;width:14%;height:26%"></div><div class="jtree" style="left:54%;width:20%;height:32%"></div>
</div>
<div class="wall"></div><div class="doorframe"></div><div class="door"><div class="jtree" style="left:5%;width:40%;height:40%"></div><div class="jtree" style="left:55%;width:45%;height:46%"></div><div class="rain"></div>${[[30,55,0],[60,40,-2],[48,75,-4],[70,70,-1.2]].map(([l,t,d])=>`<div class="ff" style="left:${l}%;top:${t}%;animation-delay:${d}s,${d/2}s"></div>`).join('')}</div>
${[12,24,76,88].map(l=>`<div class="seam" style="left:${l}%"></div>`).join('')}<div class="ridge"></div>
<div class="win"><div class="jtree" style="left:-10%;width:50%;height:44%"></div><div class="jtree" style="left:45%;width:60%;height:52%"></div><div class="rain"></div>${[[20,40,-1],[70,30,-3],[50,60,-5]].map(([l,t,d])=>`<div class="ff" style="left:${l}%;top:${t}%;animation-delay:${d}s,${d/3}s"></div>`).join('')}</div>
<div class="floor"></div>
<button class="obj" id="o-flap" aria-label="Tent flap, tied shut"><div class="trail">${[[22,30],[34,62],[50,24],[62,58],[76,30]].map(([l,t])=>`<i style="left:${l}%;top:${t}%"></i>`).join('')}</div><div class="fl"></div><div class="fr"></div><div class="tie"></div><span class="spark"></span></button>
<button class="obj" id="o-case" aria-label="Butterfly case under a net"><div class="glass">${['#3f86d8','#e8812a','#4fae4a','#3f86d8','#e8812a','#4fae4a'].map(c=>`<b style="background:${c}"></b>`).join('')}</div><div class="net"></div><span class="spark"></span></button>
<div class="crate"></div>
<button class="obj" id="o-journal" aria-label="Explorer's journal"><span class="spark"></span></button>
<div class="bedroll"></div><div class="hat"></div>
<div class="table"></div><div class="tleg" style="left:29%"></div><div class="tleg" style="left:72.6%"></div>
<button class="obj" id="o-map" aria-label="Torn map on the table"><span class="spark"></span></button>
<button class="obj" id="o-compass" aria-label="Brass compass"><div class="needle"></div><span class="spark"></span></button>
<button class="obj" id="o-trunk" aria-label="Locked expedition trunk"><div class="strap" style="left:16%"></div><div class="strap" style="right:16%"></div><div class="clasp"></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<div class="lamp"><div class="glow"></div><div class="cord"></div><div class="body"></div></div>
<div class="mist"></div>`,
  order:["map","compass","journal","tracks","butterflies","trunk"],
  revealOnWave2:[{sel:'#o-flap',cls:'revealed'},{sel:'#o-case',cls:'revealed'}],
  wave2Toast:"The tent flap came untied and blew open, and the net slid off the butterfly case.",
  finalReadyToast:"Five tiles in the trunk. One last lock between you and Amara's trail.",
  startToast:"Amara's tent is just as she left it. Tap anything that sparkles.",
  locks:{
    /* Route on the 6x6 map, starting at Camp (row 6, col 1):
       3 north -> Rock (r3c1), 4 east -> Idol (r3c5), 2 north -> Vines (r1c5),
       5 south -> Eagle (r6c5), 2 west -> Reeds (r6c3). First letters: R-I-V-E-R.
       Off-by-one squares hold Hut/Cave, Lake/Bats, Owl, Moss, Palm/Fern, so miscounts read as nonsense. */
    map:{wave:1,title:"The Torn Map",obj:"o-map",answer:"RIVER",kind:"word",tile:"S",splitArt:true,
      scene:"Amara's map lies on the table, torn into four squares. Her route is pencilled along the table edge: <em>\"From Camp: 3 north, 4 east, 2 north, 5 south, 2 west. Read the first letter of every stop and you'll know what I followed.\"</em>",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1.5,1.2,1,-1][i]}deg;animation-delay:${i*.08}s"><span class="ph">PHONE ${i+1}</span>${mapPiece(i)}</div>`).join('')}</div>`,
      hints:["Put the four pieces together into one 6 by 6 map, then find Camp in the bottom-left corner.","Move one square at a time. The first stop, 3 squares north of Camp, is the Rock.","Rock, Idol, Vines, Eagle, Reeds. The answer is RIVER."]},
    /* Dial: N7 NE2 E9 SE4 S1 SW6 W3 NW8. Turns are from where you ended up, not from north:
       N +2 -> E (9); +4 -> W (3); +1 -> NW (8); -2 -> SW (6). Code 9386.
       (Counting every turn from north gives 9123, which is wrong.) */
    compass:{wave:1,title:"The Compass Drill",obj:"o-compass",answer:"9386",kind:"num",tile:"N",
      scene:"The compass needle won't sit still, but the dial is ringed with numbers. Taped underneath: <em>\"My morning drill. Start facing north, follow the steps, and write down the number you face after each one.\"</em> One point = one step around the dial.",
      extra:compassSVG(),
      cardClass:"hand",cards:["Step 1: Face north. Turn RIGHT 2 points.","Step 2: Turn RIGHT 4 points.","Step 3: Turn RIGHT 1 point.","Step 4: Turn LEFT 2 points."],
      hints:["Each turn starts from wherever the last step left you facing, not from north.","After step 1 you face east (9). Step 2 spins you right round to face west.","East 9, west 3, north-west 8, south-west 6. The code is 9386."]},
    /* Order: S "Day one" (1st); T "storm the night after I arrived" (2nd);
       O "morning after the storm, found the face" (3rd); N "day after I found the face, scrubbed it" (4th);
       E "my last page" (5th). Corner letters: S-T-O-N-E. NOTES/TONES/ONSET are the wrong order. */
    journal:{wave:1,title:"The Loose Pages",obj:"o-journal",answer:"STONE",kind:"word",tile:"U",
      scene:"The journal's last pages have come loose. Amara doodles one big letter in the corner of every page. <em>Put the pages back in order, then read the corner letters.</em>",
      cardClass:"hand",cards:[
        "<b style='float:right;font-size:34px;color:#7a3a1c;margin:-4px 2px 0 6px'>T</b>A storm hit the night after I arrived. Everything I own is soggy.",
        "<b style='float:right;font-size:34px;color:#7a3a1c;margin:-4px 2px 0 6px'>N</b>Spent the day after I found the face scrubbing moss off it.",
        "<b style='float:right;font-size:34px;color:#7a3a1c;margin:-4px 2px 0 6px'>E</b>My last page. The face's eyes point beyond the river. Going alone. Back soon!",
        "<b style='float:right;font-size:34px;color:#7a3a1c;margin:-4px 2px 0 6px'>S</b>Day one! Camp is up. The frogs here are louder than my snoring.",
        "<b style='float:right;font-size:34px;color:#7a3a1c;margin:-4px 2px 0 6px'>O</b>The morning after the storm, I found a stone face hidden in the vines!"],
      wrongMessages:{NOTES:"Right letters, wrong order. Which page has to come first?",TONES:"Right letters, wrong order. Which page has to come first?",ONSET:"Right letters, wrong order. Which page has to come first?"},
      hints:["Find the page that has to come first: it says so itself. Then chain the rest: each page mentions what happened just before.","Day one (S), then the storm the night after (T), then the morning after the storm (O).","S, T, O, N, E. The answer is STONE."]},
    /* Prints per piece [boots,paws,hands,birds]: P1 2,1,2,2  P2 2,0,1,1  P3 1,2,1,2  P4 2,1,2,1.
       Boots 7, paws 4, hands 6 (birds ignored). Code 746. */
    tracks:{wave:2,title:"The Muddy Trail",obj:"o-flap",answer:"746",kind:"num",tile:"R",splitArt:true,
      lockedMsg:"The tent flap is tied shut from outside. Crack two of the first locks to work it loose.",
      scene:"Outside the flap, the mud is full of prints. A note is pinned to the tent pole: <em>\"Count every print. Code = boots, then paws, then hands. Ignore the birds, they were only visiting.\"</em>",
      extra:()=>`${trackKey()}<div class="photo-grid" style="margin-top:12px">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[1.2,-1.5,-1,1.4][i]}deg;animation-delay:${i*.08}s;background:#4a3a24"><span class="ph">PHONE ${i+1}</span>${trackPiece(i)}</div>`).join('')}</div>`,
      hints:["Every phone has a different stretch of mud. Count each kind on your piece and add them up across the group.","There are 7 boot prints in total. Now do the paws and the hands.","7 boots, 4 paws, 6 hands. The code is 746."]},
    /* Case order 1-6 matched to field-guide cards:
       1 blue,2 spots,tails = B; 2 orange,2,no tails = R; 3 green,1,tails = I;
       4 blue,2,no tails = D; 5 orange,3,no tails = G; 6 green,1,no tails = E.
       Each near-twin pair (B/D, R/G, I/E) differs in one feature, so every detail matters. */
    butterflies:{wave:2,title:"The Butterfly Case",obj:"o-case",answer:"BRIDGE",kind:"word",tile:"I",
      lockedMsg:"A mosquito net is pinned over the case. Crack two of the first locks to lift it.",
      scene:"Under the net: Amara's butterfly case, six butterflies pinned in a row. Her field guide gives each kind a tag letter. <em>Match each butterfly to its guide entry, then read the tags from 1 to 6.</em>",
      extra:caseSVG(),
      cards:["<b>Tag G</b><br>Orange wings. 3 white spots on each top wing. No tails.","<b>Tag I</b><br>Green wings. 1 white spot on each top wing. Long tails.","<b>Tag D</b><br>Blue wings. 2 white spots on each top wing. No tails.","<b>Tag B</b><br>Blue wings. 2 white spots on each top wing. Long tails.","<b>Tag E</b><br>Green wings. 1 white spot on each top wing. No tails.","<b>Tag R</b><br>Orange wings. 2 white spots on each top wing. No tails."],
      hints:["Some butterflies look like twins. Check all three things: colour, number of spots, and tails.","Butterfly 1 is blue with 2 spots and tails, so it's tag B. Butterfly 4 is the same but with no tails.","B, R, I, D, G, E. The answer is BRIDGE."]},
    trunk:{wave:3,title:"Amara's Trunk",obj:"o-trunk",answer:"RUINS",kind:"word",
      scene:"Six lights on the trunk. Each lock you crack drops a letter tile inside. Scratched into the lid: <em>\"If I don't come back, my letters say where I've gone.\"</em> Stone face, river, bridge... where did she go?",
      hints:["She followed the river, crossed a bridge, and went looking for more carved stone.","It's what's left of a very old, crumbling city. It starts with R.","The answer is RUINS."]}
  },
  finale:{tag:"FOUND HER",titleHTML:"THE TRUNK IS<br><span>OPEN</span>",
    cardHTML:`<h3>Amara's Last Letter</h3>"Whoever finds this: the stone face was a signpost. Beyond the river and over the old rope bridge lie the ruins of a city nobody has seen in a thousand years. I am safe, I have plenty of food, and I am having the time of my life. Follow the river, cross the bridge, and come and see."<div class="note">The rescue team found Amara two days later, sitting on a temple step, sketching. She asked if they'd brought more pencils.</div>`}
};
EXP_ORDER.push(ID);
})();
