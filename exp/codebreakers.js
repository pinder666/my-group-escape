(function(){
const ID='codebreakers', P=`.scene[data-exp="${ID}"]`;

/* ---------- art helpers ---------- */
const MORSE={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..'};
const mk=(code,s=1)=>[...code].map(c=>c==='.'?`<i style="display:inline-block;width:${9*s}px;height:${9*s}px;border-radius:50%;background:currentColor;margin:0 ${2*s}px;vertical-align:middle"></i>`:`<i style="display:inline-block;width:${24*s}px;height:${9*s}px;border-radius:${5*s}px;background:currentColor;margin:0 ${2*s}px;vertical-align:middle"></i>`).join('');
function morseMsg(word){
  return `<div style="background:#efe6c8;border-radius:4px;padding:12px 8px;color:#2a2418;display:flex;flex-wrap:wrap;justify-content:center;gap:10px 4px;box-shadow:0 4px 10px rgba(0,0,0,.4)">${[...word].map((c,i)=>`<span style="white-space:nowrap;padding:4px 6px;border-radius:4px;background:#e2d6b0">${mk(MORSE[c])}</span>${i<word.length-1?'<b style="font-size:20px;color:#9a3a2a;align-self:center">/</b>':''}`).join('')}</div><p class="scene-txt" style="margin:8px 0 0;font-size:12.5px;text-align:center">Each red slash marks the gap between two letters.</p>`;
}
function morseKey(from,to){
  let r='';for(let c=from.charCodeAt(0);c<=to.charCodeAt(0);c++){const L=String.fromCharCode(c);r+=`<div style="display:flex;align-items:center;gap:6px;height:20px"><b style="width:14px;font-family:'Courier New',monospace">${L}</b><span style="color:#2a2418">${mk(MORSE[L],.7)}</span></div>`}
  return `<div style="font-size:11px;letter-spacing:1px;color:#7a6a4a;margin-bottom:4px">KEY ${from}–${to}</div>${r}`;
}
/* pigpen-style symbols in a 30x30 box */
function pig(L){
  const i=L.charCodeAt(0)-65; let d='', dot=null;
  if(i<18){const k=i%9,r=Math.floor(k/3),c=k%3; if(r>0)d+='M4 4H26'; if(r<2)d+='M4 26H26'; if(c>0)d+='M4 4V26'; if(c<2)d+='M26 4V26'; if(i>=9)dot=[15,15];}
  else {const k=(i-18)%4; d=['M4 4L15 22 26 4','M4 4L22 15 4 26','M26 4L8 15 26 26','M4 26L15 8 26 26'][k]; if(i>=22)dot=[[15,10],[10,15],[20,15],[15,20]][k];}
  return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>${dot?`<circle cx="${dot[0]}" cy="${dot[1]}" r="2.6" fill="currentColor"/>`:''}`;
}
function pigMsg(word){return `<div style="display:flex;justify-content:center;gap:8px;color:#1c2a40">${[...word].map(c=>`<svg viewBox="0 0 30 30" style="width:52px;height:52px;background:#efe6c8;border-radius:6px;padding:4px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.15)">${pig(c)}</svg>`).join('')}</div>`}
function pigKey(n){
  const s=`stroke="#1c2a40" stroke-width="2.4" fill="none" stroke-linecap="round"`, t=(x,y,L)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-family="Georgia,serif" font-weight="700" font-size="15" fill="#5a2a1a">${L}</text>`, D=(x,y)=>`<circle cx="${x}" cy="${y}" r="2.4" fill="#1c2a40"/>`;
  let g='';
  if(n<2){const base=n?9:0; g+=`<path d="M33 6V84M57 6V84M6 33H84M6 57H84" ${s}/>`;
    for(let k=0;k<9;k++){const x=19+(k%3)*26,y=19+Math.floor(k/3)*26; g+=t(x-(n?5:0),y,String.fromCharCode(65+base+k))+(n?D(x+7,y):'');}}
  else {const base=n===2?18:22; g+=`<path d="M12 12L78 78M78 12L12 78" ${s}/>`;
    [[45,22],[22,45],[68,45],[45,68]].forEach(([x,y],k)=>{g+=t(x-(n===3?6:0),y,String.fromCharCode(65+base+k))+(n===3?D(x+6,y):'')});}
  return `<svg viewBox="0 0 90 90" style="width:100%;max-width:120px;display:block;margin:0 auto">${g}</svg><div style="text-align:center;font-size:11px;color:#7a6a4a">${['plain grid','dotted grid','plain X','dotted X'][n]}</div>`;
}
function wheelsArt(){
  return `<div style="display:flex;justify-content:center;gap:6px;margin-bottom:12px">${'ZJMUJ'.split('').map((c,i)=>`<div style="text-align:center"><div style="width:46px;height:60px;border-radius:8px;background:linear-gradient(#1a1a16,#4a4636 30%,#4a4636 70%,#1a1a16);display:flex;align-items:center;justify-content:center;font-family:'Courier New',monospace;font-weight:700;font-size:30px;color:#f4e8c0;box-shadow:inset 0 0 0 2px #8a7a4a">${c}</div><div style="font-size:11px;color:#b3aa9c;margin-top:3px">Wheel ${i+1}</div></div>`).join('')}</div><div style="display:flex;flex-wrap:wrap;justify-content:center;gap:3px">${[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(c=>`<span style="width:20px;height:24px;display:flex;align-items:center;justify-content:center;background:#2a2a22;border-radius:3px;font-family:'Courier New',monospace;font-weight:700;font-size:14px;color:#c4ffb0">${c}</span>`).join('')}</div>`;
}
/* map: 5x5 grid, columns A-E, rows 1-5. Targets: Cliff A1, Thorn D2, Elmby C3, Rye B4, Upton E5. */
const TOWNS=[['Cliff','A',1],['Brook','C',1],['Ashby','E',1],['Tarn','B',2],['Thorn','D',2],['Holt','A',3],['Elmby','C',3],['Moss','E',3],['Rye','B',4],['Penby','D',4],['Wick','A',5],['Dale','C',5],['Upton','E',5]];
function mapSVG(){
  const S=48, ox=18, oy=18; let g=`<rect width="${ox+S*5+6}" height="${oy+S*5+6}" fill="#e9dcb4"/>`;
  g+=`<path d="M${ox} ${oy+S*3.6}Q${ox+S*.8} ${oy+S*3.9} ${ox+S*.5} ${oy+S*5}H${ox}Z" fill="#a9c4c8"/><path d="M${ox+S*5} ${oy+S*.2}C${ox+S*3.6} ${oy+S*1.4} ${ox+S*3.4} ${oy+S*2.6} ${ox+S*2.6} ${oy+S*3.2}S${ox+S*1.4} ${oy+S*4.4} ${ox+S*.4} ${oy+S*4.4}" fill="none" stroke="#7fa6b0" stroke-width="4"/>`;
  [[1.3,.4],[1.6,.6],[1.35,4.45],[1.7,4.7],[1.3,4.8],[4.4,1.9],[1.4,2.7]].forEach(([x,y])=>{g+=`<path d="M${ox+S*x} ${oy+S*y-7}l5 9h-10z" fill="#6f8a4a"/>`});
  for(let i=0;i<=5;i++){g+=`<line x1="${ox+i*S}" y1="${oy}" x2="${ox+i*S}" y2="${oy+5*S}" stroke="#8a6a3a" stroke-width=".8" stroke-dasharray="3 2"/><line x1="${ox}" y1="${oy+i*S}" x2="${ox+5*S}" y2="${oy+i*S}" stroke="#8a6a3a" stroke-width=".8" stroke-dasharray="3 2"/>`;}
  for(let i=0;i<5;i++){g+=`<text x="${ox+i*S+S/2}" y="${oy-7}" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="#5a3a1a">${'ABCDE'[i]}</text><text x="${ox-9}" y="${oy+i*S+S/2}" text-anchor="middle" dominant-baseline="central" font-family="Arial,sans-serif" font-weight="700" font-size="11" fill="#5a3a1a">${i+1}</text>`;}
  TOWNS.forEach(([n,c,r])=>{const x=ox+'ABCDE'.indexOf(c)*S+S/2,y=oy+(r-1)*S+S/2;g+=`<rect x="${x-4}" y="${y-10}" width="8" height="8" fill="#5a2a1a"/><text x="${x}" y="${y+9}" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700" fill="#2a1a0a">${n}</text>`});
  g+=`<g transform="translate(${ox+S*3.5} ${oy+S*.55})"><path d="M0-10 3 0 0 10-3 0Z" fill="#5a3a1a"/><text x="0" y="-12" text-anchor="middle" font-size="7" font-family="Arial" fill="#5a3a1a">N</text></g>`;
  return `<svg viewBox="0 0 ${ox+S*5+6} ${oy+S*5+6}" role="img" aria-label="Map with a 5 by 5 grid, columns A to E and rows 1 to 5" style="width:min(100%,300px);margin:0 auto;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,.5)">${g}</svg>`;
}
const TAPE=[[0,0,1,0,0],[0,0,0,0,1],[1,0,1,1,1],[0,1,1,1,0]];
function tapeRow(bits,n){
  const xs=[14,30,46,70,86];
  return `<svg viewBox="0 0 100 34" style="width:100%;display:block"><rect x="2" y="2" width="96" height="30" fill="#f4ecd0" stroke="#b8a878"/><path d="M2 2l4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 2M98 2l-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 2" fill="none" stroke="#b8a878" stroke-width=".6"/>${xs.map((x,i)=>bits[i]?`<circle cx="${x}" cy="17" r="5.5" fill="#1a1612"/>`:`<circle cx="${x}" cy="17" r="5.5" fill="none" stroke="#d8ccaa" stroke-width=".8" stroke-dasharray="1.5 1.5"/>`).join('')}<circle cx="58" cy="17" r="2" fill="#1a1612"/></svg><div style="text-align:center;font-size:11px;color:#7a6a4a;margin-top:2px">Tape row ${n}</div>`;
}
function tapeKey(){
  const xs=[14,30,46,70,86];
  return `<svg viewBox="0 0 100 44" style="width:min(100%,280px);display:block;margin:0 auto"><rect x="2" y="14" width="96" height="28" fill="#f4ecd0" stroke="#b8a878"/>${xs.map((x,i)=>`<text x="${x}" y="10" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="8" fill="#c4ffb0">${[16,8,4,2,1][i]}</text><circle cx="${x}" cy="28" r="5.5" fill="#1a1612"/>`).join('')}<circle cx="58" cy="28" r="2" fill="#1a1612"/><text x="58" y="10" text-anchor="middle" font-family="Arial" font-size="6" fill="#8a8a7a">feed</text></svg>
  <p class="scene-txt" style="font-size:12.5px;text-align:center;margin:6px 0 8px">The little middle hole just pulls the tape along. Ignore it.</p>
  <div style="display:grid;grid-template-columns:repeat(9,1fr);gap:3px">${[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((c,i)=>`<div style="background:#2a2a22;border-radius:3px;text-align:center;font-family:'Courier New',monospace;font-size:12px;line-height:1.15;padding:2px 0;color:#c4ffb0"><b>${c}</b><br><span style="color:#d6cdbf">${i+1}</span></div>`).join('')}</div>`;
}

EXPERIENCES[ID]={
  id:ID, title:"Codebreakers", titleHTML:"CODE<br><span>BREAKERS</span>",
  tag:"A 1940s wartime escape room",
  blurb:"1944, a radio hut on the coast. An enemy message came in at midnight, scrambled five different ways. Decode every part before dawn.",
  menuBlurb:"Decode an intercepted wartime message before the sun comes up.",
  menuLine:"Decode before dawn",
  theme:{accent:'#8be38f',accent2:'#c4ffb0',bg:'#090c09',introBg:'#1c2a1c',door:'linear-gradient(90deg,#2e3a2a,#4a5a42 50%,#2e3a2a)',doorFrame:'#1a1f18',boxColor:'linear-gradient(#5a6a4a,#2e3a26)'},
  sceneCSS:`
${P}{background:#0d120d}
${P} .wall{position:absolute;left:0;right:0;top:0;height:64%;background:radial-gradient(circle,#56604a 0 1.5px,transparent 2px) 0 6px/25% 50px,repeating-linear-gradient(90deg,#2a3326 0 24.6%,#1c231a 24.6% 25%),#2a3326}
${P} .wall::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 70% 70%,rgba(255,200,110,.18),transparent 55%),linear-gradient(rgba(0,0,0,.45),transparent 30%)}
${P} .pipe{position:absolute;left:0;right:0;top:2.5%;height:1.6%;background:linear-gradient(#6a6e66,#3a3e36);box-shadow:0 2px 3px rgba(0,0,0,.5)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:36%;background:repeating-linear-gradient(90deg,#2a1e14 0 16%,#22180f 16% 16.6%),#2a1e14}
${P} .floor::after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.2))}
${P} .desk{position:absolute;left:1%;right:1%;top:62%;height:4%;background:linear-gradient(#7a5230,#5a3a20);border-radius:3px;box-shadow:0 6px 12px rgba(0,0,0,.6);z-index:1}
${P} .dleg{position:absolute;top:66%;width:5%;height:28%;background:linear-gradient(90deg,#4a301a,#5a3a20,#3a2412);z-index:1}
${P} .drawers{position:absolute;right:4%;top:66%;width:22%;height:22%;background:linear-gradient(#5a3a20,#3e2814);box-shadow:inset 0 0 0 2px #2a1a0c;z-index:1}
${P} .drawers::before,${P} .drawers::after{content:"";position:absolute;left:38%;right:38%;height:5%;background:#c9a04a;border-radius:2px}
${P} .drawers::before{top:24%} ${P} .drawers::after{top:70%}
/* poster */
${P} .poster{position:absolute;left:4%;top:7%;width:20%;height:20%;background:#c8b98a;box-shadow:0 4px 8px rgba(0,0,0,.5);transform:rotate(-3deg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4%}
${P} .poster b{display:block;width:100%;text-align:center;font:900 9px/1.05 Arial,sans-serif;color:#7a1a14;letter-spacing:.3px}
${P} .poster i{display:block;width:44%;aspect-ratio:1;margin:6% 0;border-radius:50%;background:radial-gradient(circle at 50% 40%,#2a2a2a 30%,transparent 32%),radial-gradient(circle,#c8b98a 54%,#2a2a2a 56% 62%,transparent 64%)}
/* clock */
${P} .clock{position:absolute;right:5%;top:6%;width:17%;aspect-ratio:1;border-radius:50%;background:#efe6c8;box-shadow:0 0 0 4px #3a2a1a,0 4px 10px rgba(0,0,0,.6)}
${P} .clock::before{content:"";position:absolute;inset:8%;border-radius:50%;background:repeating-conic-gradient(#2a2418 0 1.5deg,transparent 1.5deg 30deg);-webkit-mask:radial-gradient(circle,transparent 76%,#000 77%);mask:radial-gradient(circle,transparent 76%,#000 77%)}
${P} .clock .hand{position:absolute;left:50%;bottom:50%;transform-origin:50% 100%;border-radius:3px;background:#1a1612}
${P} .clock .sec{background:#b8202a;animation:spin 60s steps(60) infinite}
${P} .clock .pin{position:absolute;left:44%;top:44%;width:12%;height:12%;border-radius:50%;background:#b8202a}
/* map behind blind (wave 2) */
${P} #o-map{left:28%;top:6%;width:44%;height:26%;background:#e9dcb4;border:4px solid #4a3420;box-shadow:0 6px 14px rgba(0,0,0,.6)}
${P} #o-map svg.m{position:absolute;inset:0;width:100%;height:100%}
${P} #o-map .pinb{animation:blink 1.4s infinite}
${P} #o-map .blind{position:absolute;left:-6%;right:-6%;top:-10%;bottom:-4%;background:repeating-linear-gradient(0deg,#1e2418 0 7px,#262d20 7px 9px);transform-origin:top;transition:transform 1.4s cubic-bezier(.6,0,.3,1);box-shadow:0 6px 10px rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center}
${P} #o-map .blind::before{content:"TOP SECRET";font:900 13px Arial,sans-serif;letter-spacing:2px;color:#9a2a20;border:2px solid #9a2a20;padding:3px 6px;transform:rotate(-8deg);opacity:.85}
${P} #o-map .blind::after{content:"";position:absolute;left:44%;right:44%;bottom:-8%;height:10%;background:#c9a04a;border-radius:0 0 50% 50%}
${P} #o-map .roll{position:absolute;left:-8%;right:-8%;top:-12%;height:8%;background:linear-gradient(#5a5e56,#2a2e26);border-radius:6px;z-index:2}
${P} #o-map.revealed .blind{transform:scaleY(0)}
/* radio */
${P} #o-radio{left:3%;top:40%;width:38%;height:22%;background:linear-gradient(#3e4a36,#2a3324);border-radius:6px;box-shadow:0 6px 14px rgba(0,0,0,.6),inset 0 0 0 3px #1a2014}
${P} #o-radio .grille{position:absolute;left:6%;top:12%;width:38%;height:72%;border-radius:4px;background:radial-gradient(circle,#0e120c 1.2px,transparent 1.6px) 0 0/5px 5px,#1e261a;box-shadow:inset 0 0 0 2px #121810}
${P} #o-radio .dial{position:absolute;width:15%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 40% 35%,#d8d0b0,#6a6450);box-shadow:0 2px 3px rgba(0,0,0,.6)}
${P} #o-radio .dial::after{content:"";position:absolute;left:46%;top:6%;width:8%;height:40%;background:#2a2418}
${P} #o-radio .meter{position:absolute;left:50%;top:12%;width:44%;height:26%;border-radius:4px 4px 2px 2px;background:linear-gradient(#f4e8b0,#d8c47a);box-shadow:inset 0 0 0 2px #1a2014;overflow:hidden}
${P} #o-radio .meter i{position:absolute;left:50%;bottom:0;width:3%;height:90%;background:#b8202a;transform-origin:50% 100%;animation:codebreakers-needle 2.2s ease-in-out infinite}
${P} #o-radio .bulb{position:absolute;top:44%;width:7%;aspect-ratio:1;border-radius:50%;animation:blink 1s infinite}
${P} #o-radio .ant{position:absolute;right:10%;top:-38%;width:2%;height:40%;background:#8a8e86;transform:rotate(12deg);transform-origin:bottom}
${P} .headset{position:absolute;left:31%;top:36%;width:12%;height:7%;border:3px solid #2a2a26;border-bottom:none;border-radius:50% 50% 0 0;z-index:2;pointer-events:none}
${P} .headset::before,${P} .headset::after{content:"";position:absolute;bottom:-30%;width:34%;height:60%;border-radius:40%;background:#1a1a16}
${P} .headset::before{left:-18%} ${P} .headset::after{right:-18%}
/* teletype (wave 2) */
${P} #o-teletype{right:3%;top:38%;width:27%;height:24%}
${P} #o-teletype .body{position:absolute;left:0;right:0;bottom:0;height:62%;background:linear-gradient(#5a5e56,#33372f);border-radius:10px 10px 4px 4px;box-shadow:0 6px 14px rgba(0,0,0,.6),inset 0 0 0 2px #22261e}
${P} #o-teletype .keys{position:absolute;left:10%;right:10%;bottom:10%;height:30%;background:radial-gradient(circle,#d8d0b0 30%,#2a2a26 34%) 0 0/12.5% 50%}
${P} #o-teletype .lamp{position:absolute;right:8%;top:10%;width:9%;aspect-ratio:1;border-radius:50%;background:#5a1410;box-shadow:inset 0 0 0 1px #000}
${P} #o-teletype .paper{position:absolute;left:24%;right:24%;bottom:58%;height:50%;background:repeating-linear-gradient(0deg,#f4ecd0 0 5px,#b8ac88 5px 6px,#f4ecd0 6px 10px);border-radius:3px 3px 0 0;transform-origin:bottom;box-shadow:0 0 0 1px #c9bc90}
${P} #o-teletype .paper::after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 60%,rgba(0,0,0,.25))}
${P} #o-teletype .cover{position:absolute;left:-3%;right:-3%;bottom:-2%;height:66%;background:linear-gradient(#2a2e26,#1a1d17);border-radius:12px 12px 4px 4px;transition:transform 1.2s cubic-bezier(.6,0,.3,1),opacity 1.2s;display:flex;align-items:center;justify-content:center;font:900 9px Arial,sans-serif;letter-spacing:1px;color:#6a6e66}
${P} #o-teletype.revealed .cover{transform:translateY(-30%) rotate(-8deg);opacity:0}
${P} #o-teletype.revealed .lamp{background:#5fe08a;box-shadow:0 0 8px #5fe08a}
${P} #o-teletype.revealed .paper{animation:codebreakers-scroll 1.2s linear infinite}
/* lamp */
${P} .lampbase{position:absolute;left:47%;top:58.5%;width:9%;height:3.5%;background:linear-gradient(#2e4a2a,#1a2a18);border-radius:50% 50% 3px 3px;z-index:2}
${P} .lamparm{position:absolute;left:50.5%;top:47%;width:1.6%;height:12%;background:#c9a04a;transform:rotate(-14deg);transform-origin:bottom;z-index:2}
${P} .lamphead{position:absolute;left:44%;top:44%;width:14%;height:5%;background:linear-gradient(#3a6a3a,#1e3a1e);border-radius:50% 50% 10% 10%/100% 100% 10% 10%;transform:rotate(12deg);z-index:2}
${P} .lamplight{position:absolute;left:30%;top:47%;width:42%;height:22%;background:radial-gradient(ellipse at 50% 0,rgba(255,220,140,.42),transparent 70%);clip-path:polygon(38% 0,62% 0,100% 100%,0 100%);animation:codebreakers-lamp 5s infinite;pointer-events:none;z-index:3}
/* cipher machine */
${P} #o-machine{left:29%;top:62.5%;width:42%;height:14%}
${P} #o-machine .case{position:absolute;inset:18% 0 0;background:linear-gradient(#4a3a26,#2e2416);border-radius:6px;box-shadow:0 8px 14px rgba(0,0,0,.6),inset 0 0 0 2px #1e160c}
${P} #o-machine .keys{position:absolute;left:8%;right:8%;bottom:10%;height:40%;background:radial-gradient(circle,#efe6c8 32%,#14100a 36%,transparent 46%) 0 0/10% 50%}
${P} #o-machine .wins{position:absolute;left:18%;right:18%;top:0;height:40%;display:flex;gap:4%;justify-content:center}
${P} #o-machine .w{flex:1;border-radius:3px;background:linear-gradient(#14100a,#3a3226 30%,#3a3226 70%,#14100a);overflow:hidden;position:relative;box-shadow:inset 0 0 0 1px #8a7a4a}
${P} #o-machine .w i{position:absolute;left:0;right:0;top:0;height:300%;background:repeating-linear-gradient(#3a3226 0 8%,#d8ccaa 8% 9%,#3a3226 9% 16.6%);animation:codebreakers-wheel 3s steps(6) infinite}
/* notebook */
${P} #o-notebook{left:5%;top:63%;width:22%;height:9%;transform:rotate(-6deg);background:linear-gradient(90deg,#efe6c8 49%,#b8ac88 49% 51%,#efe6c8 51%);border-radius:2px;box-shadow:0 4px 8px rgba(0,0,0,.6)}
${P} #o-notebook svg{position:absolute;inset:12% 6%;width:88%;height:76%}
/* strongbox (final) */
${P} #o-box{left:33%;top:79%;width:34%;height:15%;background:linear-gradient(#6a7262,#3a4234);border-radius:6px;box-shadow:0 8px 14px rgba(0,0,0,.7),inset 0 0 0 3px #22281e}
${P} #o-box .lid{position:absolute;left:-3%;right:-3%;top:-10%;height:30%;background:linear-gradient(#7a8272,#4a5244);border-radius:6px;box-shadow:inset 0 0 0 2px #22281e;transform-origin:50% 0;transition:transform 1.2s cubic-bezier(.4,1.4,.5,1)}
${P} #o-box .stencil{position:absolute;left:0;right:0;top:30%;text-align:center;font:900 8px Arial,sans-serif;letter-spacing:2px;color:#c8c0a0;opacity:.7}
${P} #o-box .lights{position:absolute;left:10%;right:10%;bottom:14%;display:flex;justify-content:space-between}
${P} #o-box .lights b{width:11%;aspect-ratio:1;border-radius:50%;background:#1e2418;box-shadow:inset 0 0 0 2px #0e120c;transition:.4s}
${P} #o-box .lights b.on{background:radial-gradient(circle at 40% 35%,#eaffd8,#7ee08a);box-shadow:0 0 8px #7ee08a}
${P} #o-box .glow{pointer-events:none;position:absolute;left:0;right:0;top:-80%;height:100%;background:radial-gradient(ellipse at 50% 100%,rgba(196,255,176,.85),transparent 70%);opacity:0;transition:opacity 1s .4s}
${P} #o-box.opened .lid{transform:perspective(200px) rotateX(70deg)}
${P} #o-box.opened .glow{opacity:1}
${P} .light{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 100%,rgba(0,0,0,.35),transparent 60%);z-index:3}
@keyframes codebreakers-needle{0%,100%{transform:rotate(-30deg)}40%{transform:rotate(20deg)}60%{transform:rotate(5deg)}}
@keyframes codebreakers-scroll{from{background-position:0 0}to{background-position:0 -20px}}
@keyframes codebreakers-wheel{to{transform:translateY(-50%)}}
@keyframes codebreakers-lamp{0%,100%{opacity:1}47%{opacity:1}48%{opacity:.55}49%{opacity:1}51%{opacity:.7}52%{opacity:1}}
`,
  sceneHTML:`
<div class="wall"></div><div class="pipe"></div><div class="floor"></div>
<div class="poster"><b>SILENCE!</b><i></i><b>THE ENEMY<br>IS LISTENING</b></div>
<div class="clock"><div class="hand" style="width:5%;height:24%;margin-left:-2.5%;transform:rotate(145deg)"></div><div class="hand" style="width:3.5%;height:36%;margin-left:-1.75%;transform:rotate(300deg)"></div><div class="hand sec" style="width:1.6%;height:38%;margin-left:-.8%"></div><div class="pin"></div></div>
<button class="obj" id="o-map" aria-label="Wall map behind a blackout blind"><svg class="m" viewBox="0 0 100 60" preserveAspectRatio="none"><path d="M0 40Q12 42 10 60H0Z" fill="#a9c4c8"/><path d="M100 4C80 14 76 30 58 36S28 48 6 46" fill="none" stroke="#7fa6b0" stroke-width="2"/>${[20,40,60,80].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="60" stroke="#8a6a3a" stroke-width=".4" stroke-dasharray="2 1"/>`).join('')}${[12,24,36,48].map(y=>`<line x1="0" y1="${y}" x2="100" y2="${y}" stroke="#8a6a3a" stroke-width=".4" stroke-dasharray="2 1"/>`).join('')}${[[10,6],[70,18],[50,30],[30,42],[90,54]].map(([x,y],i)=>`<g class="pinb" style="animation-delay:${i*.28}s"><line x1="${x}" y1="${y}" x2="${x+2}" y2="${y-5}" stroke="#333" stroke-width=".8"/><circle cx="${x+2}" cy="${y-5}" r="2.2" fill="#c8202a"/></g>`).join('')}<path d="M10 6L70 18 50 30 30 42 90 54" fill="none" stroke="#c8202a" stroke-width=".7" stroke-dasharray="2 1.5"/></svg><div class="blind"></div><div class="roll"></div><span class="spark"></span></button>
<button class="obj" id="o-radio" aria-label="Radio set"><div class="ant"></div><div class="grille"></div><div class="meter"><i></i></div><div class="dial" style="left:50%;top:62%"></div><div class="dial" style="left:78%;top:62%"></div><span class="bulb" style="left:52%;background:#ff5a3a;box-shadow:0 0 6px #ff5a3a"></span><span class="bulb" style="left:64%;background:#7ee08a;box-shadow:0 0 6px #7ee08a;animation-delay:.33s"></span><span class="bulb" style="left:76%;background:#ffd34a;box-shadow:0 0 6px #ffd34a;animation-delay:.66s"></span><span class="spark"></span></button>
<div class="headset"></div>
<button class="obj" id="o-teletype" aria-label="Teletype machine"><div class="paper"></div><div class="body"><div class="keys"></div><div class="lamp"></div></div><div class="cover">OFF</div><span class="spark"></span></button>
<div class="desk"></div><div class="dleg" style="left:3%"></div><div class="dleg" style="left:27%"></div><div class="drawers"></div>
<div class="lamplight"></div><div class="lamparm"></div><div class="lamphead"></div><div class="lampbase"></div>
<button class="obj" id="o-notebook" aria-label="Codebook with symbols"><svg viewBox="0 0 100 40" style="color:#1c2a40">${['T','O','W','E','R'].map((c,i)=>`<g transform="translate(${4+i*19+(i>1?6:0)} 6) scale(.9)">${pig(c)}</g>`).join('')}</svg><span class="spark"></span></button>
<button class="obj" id="o-machine" aria-label="Cipher machine"><div class="case"><div class="keys"></div></div><div class="wins">${[0,1,2,3,4].map(i=>`<div class="w"><i style="animation-delay:${-i*.55}s;animation-duration:${2.4+i*.5}s"></i></div>`).join('')}</div><span class="spark"></span></button>
<button class="obj" id="o-box" aria-label="Dispatch strongbox"><div class="glow"></div><div class="lid"></div><div class="stencil">DISPATCH</div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<div class="light"></div>`,
  order:["radio","notebook","machine","map","teletype","box"],
  revealOnWave2:[{sel:'#o-map',cls:'revealed'},{sel:'#o-teletype',cls:'revealed'}],
  wave2Toast:"The blackout blind rolled up off the wall map, and the teletype just clattered to life.",
  finalReadyToast:"Five letters in the dispatch box. One word left before dawn.",
  startToast:"The clock says ten to five. Dawn is coming. Tap anything that sparkles.",
  locks:{
    /* RADIO. Morse on the log: ... / .. / --. / -. / .- / .-.. = S I G N A L.
       Key cards A-F (A), G-L (G, I, L), M-R (N), S-Z (S): every card is used. (node) */
    radio:{wave:1,title:"The Radio Log",obj:"o-radio",answer:"SIGNAL",kind:"word",tile:"E",
      scene:"The midnight broadcast, written down in dots and dashes. The Morse key was torn into four strips so no spy could steal the whole thing.",
      extra:morseMsg('SIGNAL'),
      cards:[morseKey('A','F'),morseKey('G','L'),morseKey('M','R'),morseKey('S','Z')],
      hints:["Match each group of dots and dashes to a letter on the key strips. Every strip gets used.","Three dots is S. Two dots is I.","S, I, G, N, A, L. The answer is SIGNAL."]},
    /* NOTEBOOK. Pigpen-style. T = plain X left cell (>), O = dotted grid middle-right (open on right, dot),
       W = dotted X top (V, dot), E = plain grid centre (full box), R = dotted grid bottom-right (top+left lines, dot) = TOWER.
       Groups used: plain grid E, dotted grid O R, plain X T, dotted X W, so all four key cards are needed. */
    notebook:{wave:1,title:"The Symbol Codebook",obj:"o-notebook",answer:"TOWER",kind:"word",tile:"A",
      scene:"Five strange symbols in the operator's notebook. <em>\"Each symbol is the shape of the lines around its letter on the key. A dot means look on a dotted key.\"</em> It's where the message comes from.",
      extra:pigMsg('TOWER'),
      cards:[pigKey(0),pigKey(1),pigKey(2),pigKey(3)],
      hints:["Look at the lines around each letter in its box. A box with lines on all four sides is the middle letter of the plain grid.","The first symbol is the left part of the plain X: T. The fourth symbol is a full box: E.","T, O, W, E, R. The answer is TOWER."]},
    /* MACHINE. Wheels show Z J M U J. Shifts back: 3,2,4,1,5. Z-3=W, J-2=H, M-4=I, U-1=T, J-5=E = WHITE. No wrap-around. (node) */
    machine:{wave:1,title:"The Cipher Machine",obj:"o-machine",answer:"WHITE",kind:"word",tile:"P",
      scene:"The cipher machine jammed and every wheel slipped forward a different amount. Five engineers each checked one wheel. <em>\"Turn every wheel back and read the real word.\"</em>",
      extra:wheelsArt(),
      cards:["Wheel 1 slipped 3 letters forward. Turn it back 3.","Wheel 2 slipped 2 letters forward. Turn it back 2.","Wheel 3 slipped 4 letters forward. Turn it back 4.","Wheel 4 slipped 1 letter forward. Turn it back 1.","Wheel 5 slipped 5 letters forward. Turn it back 5."],
      hints:["Use the alphabet strip. Find the wheel's letter and count backwards toward A.","Z back 3 is W. J back 2 is H.","W, H, I, T, E. The answer is WHITE."]},
    /* MAP. Pins: 1 D2 Thorn, 2 B4 Rye, 3 E5 Upton, 4 A1 Cliff, 5 C3 Elmby -> T R U C E = TRUCE.
       Decoy Tarn sits in B2, so reading row-then-column for D2 (swapping) gives a wrong T-town path; all 13 town squares distinct. (node) */
    map:{wave:2,title:"The War Map",obj:"o-map",answer:"TRUCE",kind:"word",tile:"E",
      lockedMsg:"A blackout blind covers the map. Crack two of the first locks to roll it up.",
      scene:"The pins fell out when the blind rolled up. Each operator wrote down where one pin went. <em>\"Find each pin's square. Read the first letter of the town in it, pin 1 to pin 5.\"</em> Letter first means the column, number means the row.",
      extra:mapSVG(),
      cards:["Pin 1 was in square D2.","Pin 2 was in square B4.","Pin 3 was in square E5.","Pin 4 was in square A1.","Pin 5 was in square C3."],
      hints:["D2 means column D, row 2. The town there is Thorn.","Thorn, then Rye. Keep going.","Thorn, Rye, Upton, Cliff, Elmby. The answer is TRUCE."]},
    /* TELETYPE. Hole values 16 8 4 2 1, A=1. Row 1: 4 = D. Row 2: 1 = A. Row 3: 16+4+2+1 = 23 = W. Row 4: 8+4+2 = 14 = N. DAWN. (node) */
    teletype:{wave:2,title:"The Punched Tape",obj:"o-teletype",answer:"DAWN",kind:"word",tile:"C",
      lockedMsg:"The teletype is switched off under its cover. Crack two of the first locks to power it up.",
      scene:"The teletype punched four rows of holes, then the tape was cut up. <em>\"Add up the values of the holes in a row, then turn the number into a letter.\"</em> It says when it happens.",
      extra:tapeKey(),
      cards:TAPE.map((b,i)=>tapeRow(b,i+1)),
      hints:["Each hole is worth the number above its column on the key. Add them up for each row.","Row 1 has one hole worth 4, so it's D. Row 2 is worth 1: A.","4, 1, 23, 14 is D, A, W, N. The answer is DAWN."]},
    /* BOX. Tiles P E A C E -> PEACE. Decoded parts: SIGNAL / TOWER / WHITE / TRUCE / DAWN. No other real-word anagram. */
    box:{wave:3,title:"The Dispatch Box",obj:"o-box",answer:"PEACE",kind:"word",onSolve:[{sel:'#o-box',cls:'opened'}],
      scene:"So far: <em>SIGNAL. TOWER. WHITE. TRUCE. DAWN.</em> Each lock dropped a letter into the dispatch box. Arrange them into the message's last word.",
      hints:["A white flag and a truce. What is the message really offering?","It's the opposite of war.","The answer is PEACE."]}
  },
  finale:{tag:"DECODED",titleHTML:"MESSAGE<br><span>DECODED</span>",
    cardHTML:`<div style="font-family:'Special Elite','Courier New',monospace;background:#efe6c8;border:1px dashed #8a7a4a;padding:10px;margin:0 0 10px;font-size:13.5px;line-height:1.5;color:#2a2418"><div style="font-size:11px;letter-spacing:2px;color:#9a2a20">INTERCEPT 0450 HRS</div>SIGNAL FROM THE TOWER AT DAWN STOP WHITE FLAG STOP TRUCE STOP <b style="background:#c4ffb0;padding:0 3px">PEACE</b></div><h3>Not an attack. A peace offer.</h3>You cracked it with minutes to spare. At first light the white flag goes up on the tower, and nobody fires a shot.<div class="note">"Brilliant work, codebreakers. Put the kettle on. The war ends a little sooner because of you."</div>`}
};
EXP_ORDER.push(ID);
})();
