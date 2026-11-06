(function(){
const ID='toy-factory', P=`.scene[data-exp="${ID}"]`;
const A='assets/toy-factory/';
const img=(f,st='',cls='')=>`<img${cls?` class="${cls}"`:''} src="${A}${f}" alt="" style="${st}">`;

/* ---------- toy builder: head of one toy on the body of another ----------
   Source crops (in each SVG's own units): where the head ends and the body starts. */
const TOY={
  teddy:{f:'teddy.svg',vb:[0,0,71,69],cut:29},
  robot:{f:'robot.svg',vb:[0,0,46,65],cut:21.5},
  rocket:{f:'rocket.svg',vb:[0,0,38,76],cut:17},
  nut:{f:'nutcracker.svg',vb:[140,86,94,290],cut:213}
};
function crop(t,y0,y1,x,y,s){
  const [vx,vy,vw,vh]=t.vb;
  return `<svg x="${(x).toFixed(2)}" y="${(y).toFixed(2)}" width="${(vw*s).toFixed(2)}" height="${((y1-y0)*s).toFixed(2)}" viewBox="${vx} ${y0} ${vw} ${y1-y0}" overflow="hidden"><image href="${A}${t.f}" x="${vx}" y="${vy}" width="${vw}" height="${vh}"/></svg>`;
}
function toy(head,body,cx,base,H){
  const h=TOY[head], b=TOY[body];
  const sb=H/b.vb[3], sh=H/h.vb[3];
  const bodyH=(b.vb[1]+b.vb[3]-b.cut)*sb, headH=(h.cut-h.vb[1])*sh;
  return crop(b,b.cut,b.vb[1]+b.vb[3],cx-b.vb[2]*sb/2,base-bodyH,sb)+crop(h,h.vb[1],h.cut,cx-h.vb[2]*sh/2,base-bodyH-headH+.3,sh);
}

/* ---------- lock: hopper (parts inventory) ---------- */
const BATTERY=`<svg viewBox="0 0 20 34"><rect x="7" y="0" width="6" height="4" rx="1" fill="#c9c9d2"/><rect x="2" y="3" width="16" height="30" rx="3" fill="#2a2d33"/><rect x="2" y="3" width="16" height="11" rx="3" fill="#ffc928"/><path d="M10 18v8M6 22h8" stroke="#fff" stroke-width="2.2"/></svg>`;
const PART={
  carBody:{i:'part-car-1.svg',n:'car body'}, wheel:{i:'part-car-2.svg',n:'wheel'},
  robotHead:{i:'part-robot-2.svg',n:'robot head'}, robotBody:{i:'part-robot-3.svg',n:'robot body'}, robotArms:{i:'part-robot-1.svg',n:'robot arms'}, battery:{s:BATTERY,n:'battery'},
  teddyHead:{i:'part-teddy-2.svg',n:'teddy head'}, teddyArms:{i:'part-teddy-1.svg',n:'teddy arms'}, teddyLegs:{i:'part-teddy-3.svg',n:'teddy legs'}, bowtie:{i:'bowtie.svg',n:'bow tie'},
  rocketNose:{i:'part-rocket-2.svg',n:'nose cone'}, rocketWindow:{i:'part-rocket-3.svg',n:'window section'}, rocketBase:{i:'part-rocket-4.svg',n:'tail section'}, rocketFins:{i:'part-rocket-1.svg',n:'fins'}
};
const picon=(k,h=30)=>PART[k].s?`<span style="display:inline-block;height:${h}px;width:${h*.6}px;vertical-align:middle">${PART[k].s.replace('<svg ','<svg style="height:100%;width:100%" ')}</span>`:`<img src="${A}${PART[k].i}" alt="" style="height:${h}px;max-width:${h*1.7}px;object-fit:contain;vertical-align:middle">`;
/* hopper contents (shown to everyone) */
const INV=[['wheel',21],['teddyHead',9],['rocketWindow',3],['robotArms',6],['bowtie',10],['carBody',6],['rocketFins',4],['robotHead',5],['teddyLegs',7],['battery',5],['rocketNose',4],['teddyArms',8],['robotBody',7],['rocketBase',6]];
/* blueprints (one per phone) */
const BP=[['CAR',{carBody:1,wheel:4},'1 car body + 4 wheels'],['ROBOT',{robotHead:1,robotBody:1,robotArms:1,battery:2},'1 head, 1 body, 1 pair of arms + 2 batteries'],['TEDDY',{teddyHead:1,teddyArms:1,teddyLegs:1,bowtie:1},'1 head, 1 pair of arms, 1 pair of legs + 1 bow tie'],['ROCKET',{rocketNose:1,rocketWindow:2,rocketBase:1,rocketFins:1},'1 nose cone, 2 window sections, 1 tail section + 1 set of fins']];
const invHTML=()=>`<div style="background:#1b2430;border:2px solid #4a5a6e;border-radius:12px;padding:10px 8px 6px"><div style="text-align:center;font:400 12px 'Archivo Black',sans-serif;letter-spacing:2px;color:#ffcf3f;margin-bottom:8px">HOPPER CONTENTS</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${INV.map(([k,n])=>`<div style="background:#eef2f6;border-radius:8px;padding:5px 2px 3px;text-align:center;color:#1b2430"><div style="height:32px;display:flex;align-items:center;justify-content:center">${picon(k,28)}</div><div style="font:700 15px Inter,sans-serif">×${n}</div><div style="font-size:9.5px;line-height:1.1;color:#4a5566">${PART[k].n}</div></div>`).join('')}</div></div>`;
const bpCard=([name,need,txt])=>`<div style="font:400 13px 'Archivo Black',sans-serif;letter-spacing:1px;color:#2058a8;margin-bottom:4px">BLUEPRINT: ${name}</div><div style="display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center">${Object.entries(need).map(([k,n])=>`<span style="white-space:nowrap">${picon(k,26)} <b>×${n}</b></span>`).join('')}</div><div style="font-size:11.5px;margin-top:4px;color:#5a4a37">One ${name.toLowerCase()} = ${txt}.</div>`;

/* ---------- lock: belt (repeating pattern) ----------
   Cycle of 7: teddy, ball, robot, elf, car, lollipop, snow globe. 24 slots, jammed at 2, 11, 13, 20, 21. */
const LOLLY=`<svg viewBox="0 0 30 46"><rect x="13.5" y="22" width="3" height="24" rx="1.5" fill="#f4efe6"/><circle cx="15" cy="15" r="13" fill="#ff5fa2"/><path d="M15 15 m0 -2 a2 2 0 1 1 -2 2 a4 4 0 1 1 4 4 a6 6 0 1 1 -6 -6 a8 8 0 1 1 8 8 a10 10 0 0 1 -11 -9" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><path d="M11 22 l8 0 l-1 3 l-6 0z" fill="#ffcf3f"/></svg>`;
const BT={teddy:{i:'teddy.svg',h:33},ball:{i:'ball.svg',h:27},robot:{i:'robot.svg',h:34},elf:{i:'elf-blue.svg',h:34},car:{i:'car.svg',h:29},lollipop:{s:LOLLY,h:33},snowglobe:{i:'snowglobe.svg',h:31}};
const CYC=['teddy','ball','robot','elf','car','lollipop','snowglobe'], JAM=[2,11,13,20,21];
const BELT=[...Array(24)].map((_,i)=>JAM.includes(i+1)?null:CYC[i%7]);
function beltSVG(seg){
  let g=`<rect width="300" height="74" fill="#26323f"/><rect x="0" y="0" width="300" height="10" fill="#1d2731"/><rect x="0" y="44" width="300" height="11" rx="3" fill="#1b1e23"/><path d="M0 46h300" stroke="#3a3f47" stroke-width="1.2" stroke-dasharray="6 4"/>${[...Array(11)].map((_,i)=>`<circle cx="${10+i*28}" cy="58.5" r="4" fill="#59616c" stroke="#2a2e34"/>`).join('')}`;
  for(let k=0;k<6;k++){const n=seg*6+k+1, t=BELT[n-1], x=25+k*50;
    if(k) g+=`<path d="M${x-25} 14v30" stroke="#3b4a5a" stroke-width="1" stroke-dasharray="2 3"/>`;
    if(t){const T=BT[t]; g+=T.s?`<svg x="${x-T.h*.33}" y="${44-T.h}" width="${T.h*.66}" height="${T.h}" viewBox="0 0 30 46">${T.s.replace(/^<svg[^>]*>|<\/svg>$/g,'')}</svg>`:`<image href="${A}${T.i}" x="${x-21}" y="${44-T.h}" width="42" height="${T.h}"/>`;}
    else g+=`<g><circle cx="${x-9}" cy="31" r="10" fill="#b9c0c9"/><circle cx="${x+6}" cy="27" r="12" fill="#cfd5dc"/><circle cx="${x+10}" cy="36" r="8" fill="#a9b1bb"/><circle cx="${x-3}" cy="38" r="8" fill="#c3c9d1"/><text x="${x}" y="36" text-anchor="middle" font-size="15" font-weight="700" fill="#5b6470" font-family="Inter,sans-serif">?</text></g>`;
    g+=`<text x="${x}" y="70" text-anchor="middle" font-size="10" font-weight="700" fill="#ffcf3f" font-family="Inter,sans-serif">${n}</text>`;}
  return `<svg viewBox="0 0 300 74" role="img" aria-label="Belt slots ${seg*6+1} to ${seg*6+6}">${g}</svg>`;
}
const legendHTML=`<div style="display:flex;justify-content:space-between;gap:2px;background:#1b2430;border-radius:10px;padding:8px 6px 6px">${['ball','car','elf','lollipop','robot','snowglobe','teddy'].map(t=>{const T=BT[t];return `<div style="flex:1;text-align:center;font-size:10px;color:#d6cdbf;line-height:1.1"><div style="height:30px;display:flex;align-items:flex-end;justify-content:center">${T.s?`<span style="display:inline-block;height:28px;width:19px">${T.s.replace('<svg ','<svg style="height:100%;width:100%" ')}</span>`:`<img src="${A}${T.i}" alt="" style="max-height:28px;max-width:38px">`}</div>${t==='snowglobe'?'snow globe':t}</div>`}).join('')}</div><p class="scene-txt" style="margin:8px 0 0;font-size:13px">Today's toys, A to Z. Each phone has one stretch of the belt.</p>`;

/* ---------- lock: gumball machine ----------
   Exact contents of the glass: green 9, red 7, blue 4, yellow 6, peppermints 3 (striped). Tray: 1 red, 1 yellow. */
const GB=[[60.2,93,'b'],[53.7,82.3,'r'],[65.9,82.2,'b'],[42.5,82.5,'y'],[78,82.7,'r'],[60.3,72.1,'g'],[48,72.2,'r'],[71.8,72.5,'r'],[36.1,72.2,'g'],[84,72,'p'],[54.2,61.6,'y'],[65.7,62.2,'y'],[42.4,62.3,'p'],[78.2,62.2,'y'],[30.4,62.1,'g'],[89.8,62.4,'b'],[59.8,51.5,'g'],[47.8,51.6,'b'],[72,51.8,'g'],[36,52,'g'],[84.2,51.5,'r'],[95.7,51.6,'r'],[23.9,52,'g'],[54,41.6,'g'],[66,41.3,'y'],[41.8,41.6,'r'],[78.1,41.1,'g'],[30.6,41.1,'p'],[89.9,41.5,'y']];
const GC={r:'#e8333a',g:'#2fbf4a',b:'#2f7bff',y:'#ffc928'};
function ball(x,y,c,r=5.3){
  if(c==='p') return `<g transform="translate(${x} ${y})"><circle r="${r}" fill="#fff"/><path d="M0 0L${r} -2 A${r} ${r} 0 0 1 ${r*.4} ${r*.95}Z M0 0L${-r} 2 A${r} ${r} 0 0 1 ${-r*.4} ${-r*.95}Z M0 0L2 ${r} A${r} ${r} 0 0 1 ${-r*.95} ${r*.4}Z M0 0L-2 ${-r} A${r} ${r} 0 0 1 ${r*.95} ${-r*.4}Z" fill="#e8333a"/><circle r="${r}" fill="none" stroke="#b9b9b9" stroke-width=".5"/></g>`;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${GC[c]}"/><circle cx="${x-1.7}" cy="${y-1.8}" r="${r*.3}" fill="#fff" opacity=".55"/>`;
}
function gumballSVG(){
  return `<svg viewBox="0 0 120 150" role="img" aria-label="Gumball machine"><defs><radialGradient id="tf-glass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#cfe9ff" stop-opacity=".12"/><stop offset="1" stop-color="#9cc8ee" stop-opacity=".35"/></radialGradient></defs>
  <rect x="50" y="4" width="20" height="8" rx="3" fill="#c8323a"/><circle cx="60" cy="56" r="45" fill="#203040" opacity=".35"/>${GB.map(([x,y,c])=>ball(x,y,c)).join('')}<circle cx="60" cy="56" r="45" fill="url(#tf-glass)" stroke="#e7f3ff" stroke-width="2.5"/><path d="M30 30 A36 36 0 0 1 52 16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
  <path d="M32 98 H88 L96 146 H24Z" fill="#c8323a"/><path d="M32 98 H88 L90 108 H30Z" fill="#a8222a"/><circle cx="60" cy="118" r="9" fill="#d9dde3" stroke="#8b929c" stroke-width="2"/><rect x="58.5" y="111" width="3" height="14" rx="1.5" fill="#8b929c"/><path d="M40 128 h16 v10 h-16z" fill="#2a1416"/><path d="M38 138 h22 v6 h-22z" fill="#8b929c"/>${ball(45,134,'r',4.2)}${ball(53,134,'y',4.2)}</svg>`;
}

/* ---------- lock: gears ----------
   Crank 48 teeth, A 16, B 24, C 12, D 8, all in one chain. Drawn with exact tooth counts, sizes in proportion. */
const GEARS=[{n:48,l:'CRANK',c:'#c8323a'},{n:16,l:'A',c:'#ffcf3f'},{n:24,l:'B',c:'#2f9e48'},{n:12,l:'C',c:'#2f7bff'},{n:8,l:'D',c:'#b05ce0'}];
function gearsSVG(){
  const m=2.9, ang=[0,-12,22,-28,25]; let x=76,y=88,phase=0,out='',prev=null;
  GEARS.forEach((G,i)=>{const r=m*G.n/2, step=2*Math.PI/G.n;
    if(i){const a=ang[i]*Math.PI/180, d=prev.r+r; x=prev.x+d*Math.cos(a); y=prev.y+d*Math.sin(a);
      /* prev has a tooth tip at angle a when (a-prev.ph) is a multiple of prev.step: put a gap of this gear at a+PI */
      const k=Math.round((a-prev.ph)/prev.step); const tipA=prev.ph+k*prev.step; const off=a-tipA; phase=a+Math.PI+step/2-off*prev.r/r;}
    let pts=[]; for(let t=0;t<G.n;t++){const b=phase+t*step; [[-.25,r-m],[-.12,r+m*.95],[.12,r+m*.95],[.25,r-m]].forEach(([f,rr])=>pts.push((x+rr*Math.cos(b+f*step)).toFixed(1)+','+(y+rr*Math.sin(b+f*step)).toFixed(1)));}
    out+=`<polygon points="${pts.join(' ')}" fill="${G.c}" stroke="#1b1e23" stroke-width="1"/><circle cx="${x}" cy="${y}" r="${r*.62}" fill="#000" opacity=".18"/>`;
    out+=i?`<circle cx="${x}" cy="${y}" r="6.5" fill="#f4f6f8" stroke="#1b1e23"/><text x="${x}" y="${y+3.6}" text-anchor="middle" font-size="10" font-weight="800" fill="#1b1e23" font-family="Inter,sans-serif">${G.l}</text>`:`<circle cx="${x}" cy="${y}" r="7" fill="#f4f6f8" stroke="#1b1e23"/><text x="${x}" y="${y-16}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff" stroke="#1b1e23" stroke-width="3" paint-order="stroke" font-family="Inter,sans-serif">CRANK</text>`;
    if(!i) out+=`<path d="M${x} ${y} L${x+30} ${y+30}" stroke="#d9dde3" stroke-width="6" stroke-linecap="round"/><circle cx="${x+30}" cy="${y+30}" r="6" fill="#1b1e23"/>`;
    prev={x,y,r,ph:phase,step};});
  return `<svg viewBox="0 0 320 168" role="img" aria-label="Chain of five gears: crank, A, B, C, D"><rect width="320" height="168" rx="10" fill="#26323f"/>${[...Array(9)].map((_,i)=>`<circle cx="${18+i*36}" cy="10" r="2.2" fill="#4a5a6e"/><circle cx="${18+i*36}" cy="158" r="2.2" fill="#4a5a6e"/>`).join('')}${out}</svg>`;
}

/* ---------- lock: QC reject bin (find mini-game) ----------
   12 crates. Wonky toys on the cards: W robot/teddy, O teddy/rocket, N rocket/nut, K nut/robot, Y teddy/nut  (head/body).
   Decoys (wonky but not on any card): S teddy/robot, E robot/nut. Normal toys: T teddy, R robot, P car, A rocket, L nutcracker. */
const QC=[
  {h:'teddy',b:'teddy',l:'T'},{h:'teddy',b:'nut',l:'Y',t:1},{h:'robot',b:'robot',l:'R'},{h:'teddy',b:'robot',l:'S'},
  {h:'robot',b:'teddy',l:'W',t:1},{car:1,l:'P'},{h:'nut',b:'robot',l:'K',t:1},{h:'rocket',b:'rocket',l:'A'},
  {h:'robot',b:'nut',l:'E'},{h:'teddy',b:'rocket',l:'O',t:1},{h:'nut',b:'nut',l:'L'},{h:'rocket',b:'nut',l:'N',t:1}];
const QCPOS=QC.map((_,i)=>({cx:15+(i%4)*30,shelf:33+Math.floor(i/4)*33}));
function qcSVG(){
  let g=`<rect width="120" height="100" fill="#2e3b4a"/>${[...Array(12)].map((_,i)=>`<rect x="${i*10}" y="0" width="9.4" height="100" fill="#344354"/>`).join('')}`;
  QC.forEach((q,i)=>{const {cx,shelf}=QCPOS[i];
    g+=`<rect x="${cx-11}" y="${shelf-8}" width="22" height="8" rx="1" fill="#b07a43" stroke="#6e4524" stroke-width=".6"/><path d="M${cx-11} ${shelf-5.5}h22" stroke="#8a5a2e" stroke-width=".5"/><circle cx="${cx}" cy="${shelf-4}" r="3.2" fill="#f4ead2" stroke="#6e4524" stroke-width=".4"/><text x="${cx}" y="${shelf-2.6}" text-anchor="middle" font-size="4.2" font-weight="800" fill="#3a2212" font-family="Inter,sans-serif">${q.l}</text>`;
    g+=q.car?`<image href="${A}car.svg" x="${cx-11}" y="${shelf-28}" width="22" height="21"/>`:toy(q.h,q.b,cx,shelf-8,22);});
  [33,66,99].forEach(y=>g+=`<rect x="0" y="${y}" width="120" height="2.6" fill="#8a96a3"/><rect x="0" y="${y+2.6}" width="120" height=".8" fill="#1b2430"/>`);
  return `<svg viewBox="0 0 120 101" preserveAspectRatio="xMidYMid slice">${g}</svg>`;
}
const QCT=QC.map((q,i)=>q.t?{x:+(QCPOS[i].cx/1.2).toFixed(1),y:+((QCPOS[i].shelf-19)/1.01).toFixed(1),r:8.5,name:'wonky toy'}:null).filter(Boolean);

/* ---------- room helpers ---------- */
const RIDE=[['teddy.svg',30],['robot.svg',31],['car.svg',25],['ball.svg',22],['rocket.svg',34],['snowglobe.svg',26],['train.svg',22],['nutcracker.svg',34]];
const pileSVG=`<svg viewBox="0 0 100 64" preserveAspectRatio="xMidYMax meet">${toy('rocket','nut',12,62,40)}${toy('robot','teddy',34,64,34)}${toy('teddy','rocket',55,62,44)}${toy('nut','robot',74,64,38)}${toy('teddy','nut',91,62,40)}</svg>`;

EXPERIENCES[ID]={
  id:ID, title:"Santa's Toy Factory", titleHTML:"SANTA'S TOY<br><span>FACTORY</span>", season:"Christmas", collection:'christmas',
  tag:"A Christmas Eve escape room",
  blurb:"It's Christmas Eve and the toy assembly line has jammed. Every toy is coming out wrong. Fix the machines before the sleigh is loaded at midnight.",
  menuBlurb:"The assembly line jammed on Christmas Eve and every toy's coming out wrong. Fix it before the sleigh leaves.",
  menuLine:"Fix the assembly line",
  theme:{accent:'#ffcf3f',accent2:'#ffe58a',bg:'#0a0e14',introBg:'#13324a',door:'#b3262e',doorFrame:'#2a3a4a',boxColor:'linear-gradient(#2f7bff,#1a4aa8)'},
  sceneCSS:`
${P}{background:#1a2430}
${P} .wall{position:absolute;left:0;right:0;top:0;height:61%;background:linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px) 0 0/16.66% 100%,linear-gradient(#22344a,#2b4058 60%,#22324a)}
${P} .wall::after{content:"";position:absolute;left:0;right:0;bottom:0;height:3%;background:repeating-linear-gradient(-45deg,#ffcf3f 0 10px,#1b1e23 10px 20px);opacity:.85}
${P} .rv{position:absolute;width:4px;height:4px;border-radius:50%;background:#4f6884;box-shadow:0 1px 0 #10161e}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:39%;background:linear-gradient(rgba(0,0,0,.35),transparent 30%),repeating-conic-gradient(#3a4654 0 25%,#2f3a47 0 50%) 0 0/34px 34px}
${P} .beam{position:absolute;left:0;right:0;top:1.2%;height:2.4%;background:linear-gradient(#8b929c,#4f5660);box-shadow:0 3px 6px rgba(0,0,0,.4);z-index:1}
${P} .lamp{position:absolute;top:3.4%;width:9%;height:3%;background:linear-gradient(#3a3f47,#1b1e23);border-radius:50% 50% 8px 8px/100% 100% 8px 8px;z-index:1}
${P} .lamp::after{content:"";position:absolute;left:-90%;right:-90%;top:90%;height:560%;background:radial-gradient(ellipse at 50% 0,rgba(255,230,150,.28),transparent 70%);animation:flicker 5s infinite;pointer-events:none}
${P} .window{position:absolute;left:37%;top:5.5%;width:26%;height:9%;border:5px solid #4f5660;border-radius:6px;background:linear-gradient(#081428,#1a3866);overflow:hidden;box-shadow:inset 0 0 0 2px #1b1e23}
${P} .window::before{content:"";position:absolute;left:0;right:0;bottom:-30%;height:55%;border-radius:50%;background:#e9f1ff}
${P} .window::after{content:"";position:absolute;left:33%;top:0;bottom:0;width:34%;border-left:4px solid #4f5660;border-right:4px solid #4f5660}
${P} .flake{position:absolute;top:-10%;width:3px;height:3px;border-radius:50%;background:#fff;animation:${ID}-snow linear infinite}
/* hopper */
${P} #o-hopper{left:3%;top:5%;width:28%;height:24%}
${P} #o-hopper .fun{position:absolute;left:0;right:0;top:22%;height:50%;background:linear-gradient(90deg,#6f7782,#c9ced6 40%,#8b929c 70%,#5d646e);clip-path:polygon(0 0,100% 0,62% 100%,38% 100%)}
${P} #o-hopper .rim{position:absolute;left:-3%;right:-3%;top:18%;height:9%;border-radius:4px;background:linear-gradient(#ffcf3f,#c8932a);box-shadow:0 2px 0 #1b1e23}
${P} #o-hopper .spout{position:absolute;left:39%;width:22%;top:70%;height:22%;background:linear-gradient(90deg,#5d646e,#aab1ba,#5d646e)}
${P} #o-hopper .pk{position:absolute;bottom:80%;height:22%;animation:${ID}-jig 1.6s ease-in-out infinite}
${P} #o-hopper .tag{position:absolute;left:30%;right:30%;top:38%;height:16%;background:#f4ead2;border-radius:2px;font:700 9px Inter,sans-serif;color:#2a2e34;display:flex;align-items:center;justify-content:center;letter-spacing:1px}
${P} .drop{position:absolute;left:14.5%;top:27%;height:4%;z-index:1;animation:${ID}-drop 2.4s ease-in infinite;opacity:0}
/* pistons */
${P} .piston{position:absolute;top:15.5%;width:8.5%;height:15.5%;z-index:1}
${P} .piston .cyl{position:absolute;left:10%;right:10%;top:0;height:42%;background:linear-gradient(90deg,#5d646e,#c9ced6 45%,#6f7782);border-radius:3px;box-shadow:0 0 0 2px #1b1e23}
${P} .piston .cyl::after{content:"";position:absolute;left:0;right:0;top:30%;height:12%;background:repeating-linear-gradient(-45deg,#ffcf3f 0 4px,#1b1e23 4px 8px)}
${P} .piston .rod{position:absolute;left:50%;width:18%;margin-left:-9%;top:38%;height:46%;background:linear-gradient(90deg,#9aa1aa,#eef1f4,#9aa1aa);transform-origin:top;animation:${ID}-pump 1.2s ease-in-out infinite}
${P} .piston .head{position:absolute;left:0;right:0;top:80%;height:14%;background:linear-gradient(#c8323a,#7e1820);border-radius:2px 2px 5px 5px;animation:${ID}-press 1.2s ease-in-out infinite}
/* belt */
${P} #o-belt{left:0;top:27%;width:71%;height:22%}
${P} #o-belt .ride{position:absolute;left:0;right:0;top:0;height:60%;overflow:hidden}
${P} #o-belt .ride img{position:absolute;bottom:0;left:-16%;animation:${ID}-ride 12s linear infinite}
${P} #o-belt .surf{position:absolute;left:0;right:0;top:60%;height:13%;border-radius:0 8px 8px 0;background:repeating-linear-gradient(90deg,#2a2e34 0 9px,#14171b 9px 12px);background-size:24px 100%;animation:${ID}-belt .5s linear infinite;box-shadow:0 2px 0 #59616c,inset 0 2px 0 rgba(255,255,255,.12)}
${P} #o-belt .frame{position:absolute;left:0;right:0;top:73%;height:12%;background:linear-gradient(#ffcf3f,#c8932a);border-radius:0 6px 6px 0;box-shadow:inset 0 -2px 0 rgba(0,0,0,.3)}
${P} #o-belt .roll{position:absolute;top:74.5%;width:5.5%;aspect-ratio:1;border-radius:50%;background:conic-gradient(#59616c 0 25%,#9aa1aa 0 50%,#59616c 0 75%,#9aa1aa 0);box-shadow:0 0 0 1.5px #1b1e23;animation:spin 1s linear infinite}
${P} #o-belt .leg{position:absolute;top:84%;height:16%;width:4%;background:linear-gradient(90deg,#3a3f47,#6f7782,#3a3f47)}
${P} #o-belt.solved .surf,${P} #o-belt.solved .ride img,${P} #o-belt.solved .roll{animation-duration:.25s}
${P} #o-belt.solved .ride img{animation-duration:6s}
/* gumball machine */
${P} #o-gumball{right:2%;top:23%;width:27%;height:37%}
${P} #o-gumball svg{width:100%;height:100%;display:block;filter:drop-shadow(0 6px 8px rgba(0,0,0,.5))}
${P} #o-gumball .gb{position:absolute;left:36%;top:84%;width:9%;aspect-ratio:1;border-radius:50%;background:#2fbf4a;opacity:0;animation:${ID}-gum 4s ease-in infinite 1s}
/* gearbox (wave 2) */
${P} #o-gears{right:2.5%;top:4.5%;width:30%;height:17%;overflow:hidden;border-radius:6px;background:#141b24;box-shadow:inset 0 0 12px #000,0 0 0 3px #4f5660}
${P} #o-gears .g{position:absolute;animation:spin 6s linear infinite;animation-play-state:paused}
${P} #o-gears .g.r{animation-direction:reverse}
${P} #o-gears.revealed .g{animation-play-state:running}
${P} #o-gears .cover{position:absolute;inset:0;background:linear-gradient(135deg,#8b929c,#c9ced6 40%,#6f7782);transition:transform 1.4s cubic-bezier(.6,.05,.3,1);display:flex;align-items:center;justify-content:center;z-index:2}
${P} #o-gears .cover::before{content:"";position:absolute;left:8%;right:8%;top:38%;height:24%;background:repeating-linear-gradient(-45deg,#ffcf3f 0 7px,#1b1e23 7px 14px);border-radius:2px}
${P} #o-gears .cover i{position:absolute;width:7px;height:7px;border-radius:50%;background:radial-gradient(#e7ebf0,#5d646e);box-shadow:0 0 0 1px #1b1e23}
${P} #o-gears.revealed .cover{transform:translateY(-104%)}
/* control panel deco */
${P} .panel{position:absolute;left:39%;top:51%;width:25%;height:8.5%;background:linear-gradient(#3a4654,#26323f);border-radius:5px;box-shadow:0 0 0 2px #1b1e23,0 4px 8px rgba(0,0,0,.4);display:grid;grid-template-columns:repeat(6,1fr);align-items:center;justify-items:center;padding:0 4%}
${P} .panel b{width:60%;aspect-ratio:1;border-radius:50%;animation:blink 1s infinite}
${P} .panel .dial{position:absolute;right:4%;bottom:-48%;width:20%;aspect-ratio:1;border-radius:50%;background:#e7ebf0;box-shadow:0 0 0 2px #1b1e23}
${P} .panel .dial::after{content:"";position:absolute;left:48%;top:12%;width:6%;height:40%;background:#c8323a;transform-origin:50% 95%;animation:${ID}-needle 2.2s ease-in-out infinite alternate}
/* QC reject bin (wave 2) */
${P} #o-qc{left:2.5%;top:51%;width:34%;height:21%}
${P} #o-qc .box{position:absolute;inset:16% 0 0 0;background:linear-gradient(#26323f,#1b2430);border:3px solid #59616c;border-radius:4px;overflow:hidden}
${P} #o-qc .box svg{position:absolute;left:3%;right:3%;bottom:0;width:94%;height:92%}
${P} #o-qc .sign{position:absolute;left:12%;right:12%;top:0;height:20%;background:#c8323a;border-radius:3px;font:400 9.5px 'Archivo Black',sans-serif;color:#fff;letter-spacing:1.5px;display:flex;align-items:center;justify-content:center;z-index:3;box-shadow:0 2px 0 #1b1e23}
${P} #o-qc .shutter{position:absolute;inset:16% 0 0 0;background:repeating-linear-gradient(#8b929c 0 7px,#5d646e 7px 9px);border:3px solid #59616c;border-radius:4px;transition:transform 1.3s cubic-bezier(.6,.05,.3,1);transform-origin:top;z-index:2}
${P} #o-qc .shutter::after{content:"";position:absolute;left:42%;right:42%;bottom:8%;height:10%;background:#ffcf3f;border-radius:2px;box-shadow:0 0 0 1px #1b1e23}
${P} #o-qc.revealed .shutter{transform:scaleY(.08)}
/* master control (final) */
${P} #o-master{left:29%;top:65%;width:42%;height:24%}
${P} #o-master .base{position:absolute;left:4%;right:4%;top:36%;bottom:0;background:linear-gradient(#c8323a,#7e1820);border-radius:6px;box-shadow:0 8px 14px rgba(0,0,0,.55),inset 0 -4px 0 rgba(0,0,0,.25)}
${P} #o-master .top{position:absolute;left:0;right:0;top:12%;height:36%;background:linear-gradient(#3a4654,#1b2430);border-radius:8px 8px 4px 4px;box-shadow:0 0 0 3px #ffcf3f,inset 0 2px 0 rgba(255,255,255,.15);clip-path:inset(-6px -6px 0 -6px)}
${P} #o-master .screen{position:absolute;left:8%;right:42%;top:22%;height:18%;background:#0d2a1a;border-radius:3px;overflow:hidden;box-shadow:inset 0 0 0 1.5px #000}
${P} #o-master .screen::after{content:"";position:absolute;inset:30% 0;background:linear-gradient(90deg,transparent,#3dff8a 40%,transparent);opacity:.6;animation:${ID}-scan 2.2s linear infinite}
${P} #o-master .lights{position:absolute;left:8%;right:8%;top:62%;display:flex;justify-content:space-between}
${P} #o-master .lights b{width:11%;aspect-ratio:1;border-radius:50%;background:#3a1418;box-shadow:inset 0 0 0 2px #1b1e23}
${P} #o-master .lights b.on{background:#7dff8a;box-shadow:0 0 0 2px #1b1e23,0 0 10px #3dff5a}
${P} #o-master .btns{position:absolute;right:8%;top:22%;width:30%;height:18%;display:flex;gap:8%;align-items:center}
${P} #o-master .btns i{flex:1;aspect-ratio:1;border-radius:50%;box-shadow:0 2px 0 #000}
${P} #o-master .lever{position:absolute;right:-1%;top:-6%;width:6%;height:46%;background:linear-gradient(90deg,#9aa1aa,#eef1f4,#9aa1aa);border-radius:3px;transform-origin:50% 100%;transform:rotate(-20deg);transition:transform 1s cubic-bezier(.3,1.6,.5,1)}
${P} #o-master .lever::before{content:"";position:absolute;left:-90%;right:-90%;top:-22%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff8a8a,#c8323a 55%,#7e1820)}
${P} #o-master.solved .lever{transform:rotate(20deg)}
/* floor stuff */
${P} .elf{position:absolute;z-index:1;animation:bob 2.4s ease-in-out infinite}
${P} .gift{position:absolute;z-index:1}
${P} .glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 76%,rgba(255,207,63,.14),transparent 40%);z-index:3}
@keyframes ${ID}-snow{to{transform:translate(8px,900%)}}
@keyframes ${ID}-ride{from{left:-16%}to{left:104%}}
@keyframes ${ID}-belt{to{background-position:24px 0}}
@keyframes ${ID}-pump{0%,100%{transform:scaleY(.35)}45%,55%{transform:scaleY(1)}}
@keyframes ${ID}-press{0%,100%{transform:translateY(-250%)}45%,55%{transform:translateY(0)}}
@keyframes ${ID}-jig{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-12%) rotate(6deg)}}
@keyframes ${ID}-drop{0%{opacity:0;transform:translateY(0) rotate(0)}10%{opacity:1}80%{opacity:1}100%{opacity:0;transform:translateY(240%) rotate(200deg)}}
@keyframes ${ID}-gum{0%,60%{opacity:0;transform:translateY(-60%)}70%{opacity:1;transform:translateY(0)}90%{opacity:1;transform:translateY(30%)}100%{opacity:0;transform:translateY(30%)}}
@keyframes ${ID}-needle{from{transform:rotate(-50deg)}to{transform:rotate(55deg)}}
@keyframes ${ID}-scan{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
`,
  sceneHTML:`
<div class="wall"></div><div class="floor"></div>
${[6,22.6,39.2,55.8,72.4,89].map(l=>[8,30,52].map(t=>`<i class="rv" style="left:${l}%;top:${t}%"></i>`).join('')).join('')}
<div class="beam"></div><div class="lamp" style="left:14%"></div><div class="lamp" style="left:45.5%"></div><div class="lamp" style="left:77%"></div>
<div class="window">${[[8,0,3],[24,1.2,3.8],[44,.4,3.3],[60,2,4.1],[78,.8,3.5],[92,1.6,3.9],[34,2.6,4.4],[70,3,3.6]].map(([l,d,s])=>`<i class="flake" style="left:${l}%;animation-duration:${s}s;animation-delay:-${d}s"></i>`).join('')}</div>
<button class="obj" id="o-hopper" aria-label="Parts hopper">${img('part-teddy-2.svg','left:8%','pk')}${img('part-car-2.svg','left:30%;animation-delay:-.5s','pk')}${img('part-robot-2.svg','left:52%;animation-delay:-1s','pk')}${img('part-rocket-2.svg','left:74%;animation-delay:-.3s','pk')}<div class="fun"></div><div class="rim"></div><div class="spout"></div><div class="tag">PARTS</div><span class="spark"></span></button>
${img('part-car-2.svg','','drop')}${img('part-teddy-2.svg','animation-delay:-1.2s','drop')}
<div class="piston" style="left:35%"><div class="cyl"></div><div class="rod"></div><div class="head"></div></div>
<div class="piston" style="left:52%"><div class="cyl"></div><div class="rod" style="animation-delay:-.6s"></div><div class="head" style="animation-delay:-.6s"></div></div>
<button class="obj" id="o-belt" aria-label="Conveyor belt"><div class="ride">${RIDE.map(([f,h],i)=>img(f,`height:${h*1.6}%;animation-delay:-${(i*1.5).toFixed(1)}s`)).join('')}</div><div class="surf"></div><div class="frame"></div>${[2,15,28,41,54,67,80,93].map(l=>`<i class="roll" style="left:${l-2.75}%"></i>`).join('')}<div class="leg" style="left:6%"></div><div class="leg" style="left:48%"></div><div class="leg" style="left:88%"></div><span class="spark"></span></button>
<button class="obj" id="o-gumball" aria-label="Gumball machine">${gumballSVG()}<i class="gb"></i><span class="spark"></span></button>
<button class="obj" id="o-gears" aria-label="Gearbox panel">${img('gear-big.svg','left:2%;top:4%;width:46%','g')}${img('gear-small.svg','left:43%;top:-20%;width:32%','g r')}${img('gear-big.svg','left:70%;top:30%;width:34%','g')}<div class="cover">${[[4,8],[92,8],[4,80],[92,80]].map(([l,t])=>`<i style="left:${l}%;top:${t}%"></i>`).join('')}</div><span class="spark"></span></button>
<div class="panel">${['#ff5a5a','#7dff8a','#ffcf3f','#7dd3ff','#7dff8a','#ff5a5a'].map((c,i)=>`<b style="background:${c};box-shadow:0 0 6px ${c};animation-delay:${(i*.37%1).toFixed(2)}s;animation-duration:${(0.8+i%3*.35).toFixed(2)}s"></b>`).join('')}<i class="dial"></i></div>
<button class="obj" id="o-qc" aria-label="Rejects bin with a shutter"><div class="sign">REJECTS</div><div class="box">${pileSVG}</div><div class="shutter"></div><span class="spark"></span></button>
${img('elf-pink.svg','right:3%;top:61%;height:17%;animation-delay:-1.1s','elf')}
${img('elf-blue.svg','left:2%;top:73%;height:19%','elf')}
${img('gift_blue2.png','right:3%;top:82%;width:17%','gift')}${img('gift_red2.png','right:15%;top:87%;width:15%','gift')}${img('gift_green2.png','right:6%;top:76.5%;width:12%','gift')}
<button class="obj" id="o-master" aria-label="Master assembly control"><div class="base"></div><div class="top"></div><div class="screen"></div><div class="btns"><i style="background:#ffcf3f"></i><i style="background:#2f7bff"></i></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><div class="lever"></div><span class="spark"></span></button>
<div class="glow"></div>`,
  order:["hopper","belt","gumball","gears","qc","master"],
  revealOnWave2:[{sel:'#o-gears',cls:'revealed'},{sel:'#o-qc',cls:'revealed'}],
  wave2Toast:"Clunk! The gearbox cover just slid up, and the rejects shutter rolled open.",
  finalReadyToast:"Five tiles in the master control. Pull that lever!",
  startToast:"Tap anything that sparkles. Three machines need fixing, and the sleigh leaves at midnight.",
  locks:{
    /* Hopper. Toys you can FULLY build = smallest (stock / needed) over the blueprint's parts.
       Car: bodies 6/1=6, wheels 21/4=5 -> 5.  Robot: heads 5, bodies 7, arms 6, batteries 5/2=2 -> 2.
       Teddy: heads 9, arms 8, legs 7, bow ties 10 -> 7.  Rocket: noses 4, windows 3/2=1, tails 6, fins 4 -> 1.
       Code 5271 (ignoring the "x4" / "x2" lines would give 6573). */
    hopper:{wave:1,title:"The Parts Hopper",obj:"o-hopper",answer:"5271",kind:"num",tile:"C",
      scene:"The hopper's lock has a note taped on: <em>\"Before we restart, tell me how many of each toy we can FULLY build from what's in here. Code: cars, robots, teddies, rockets.\"</em> Each phone has one blueprint.",
      extra:invHTML,
      cards:BP.map(bpCard),wideCards:true,
      hints:["Do one toy at a time. For each part on the blueprint, how many toys could that part alone make? The smallest number wins.","Cars: 21 wheels is only enough for 5 cars (4 each). Robots need 2 batteries each, and there are only 5 batteries.","5 cars, 2 robots, 7 teddies, 1 rocket. The code is 5271."]},
    /* Belt. The belt repeats every 7 toys: teddy, ball, robot, elf, car, lollipop, snow globe (teddy at 1, 8, 15, 22).
       Jammed slots 2, 11, 13, 20, 21 = ball, elf, lollipop, lollipop, snow globe -> BELLS.
       Checked: 7 is the smallest period that fits every visible slot (14 and 21 fit but leave gaps unknown). Every phone's stretch holds at least one jam. */
    belt:{wave:1,title:"The Jammed Belt",obj:"o-belt",answer:"BELLS",kind:"word",tile:"I",splitArt:true,
      scene:"The conveyor jammed and five slots are lost in smoke. The foreman's clipboard says: <em>\"The belt always makes the same run of toys, over and over. Work out what belongs in each jammed slot, then read their first letters from slot 1 to 24.\"</em>",
      extra:()=>legendHTML+`<div class="photo-grid" style="grid-template-columns:1fr;margin-top:10px">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1,.8,-.6,1][i]}deg;animation-delay:${i*.08}s;background:#d9dee5"><span class="ph">PHONE ${i+1}</span>${beltSVG(i)}</div>`).join('')}</div>`,
      hints:["Find a toy that shows up more than once and count how many slots apart the repeats are.","The teddy is in slots 1, 8, 15 and 22: the belt repeats every 7. Slot 2 holds the same toy as slot 9.","Ball, elf, lollipop, lollipop, snow globe. The answer is BELLS."]},
    /* Gumballs in the GLASS only (tray ones are sold, striped peppermints aren't gumballs).
       Exact counts from GB: green 9, red 7, blue 4, yellow 6 (+3 peppermints; tray has 1 red + 1 yellow).
       Card order green, red, blue, yellow -> 9746. */
    gumball:{wave:1,title:"The Gumball Machine",obj:"o-gumball",answer:"9746",kind:"num",tile:"M",
      scene:"The gumball machine feeds the toy painters, and it's locked until someone does a stock count. Its four-digit dial has one colour per digit.",
      extra:()=>`<div style="max-width:250px;margin:0 auto">${gumballSVG()}</div>`,
      cards:["<b>Digit 1</b><br>How many <b style=\"color:#1f8f36\">GREEN</b> gumballs?","<b>Digit 2</b><br>How many <b style=\"color:#c8232a\">RED</b> gumballs?","<b>Digit 3</b><br>How many <b style=\"color:#1f5fd8\">BLUE</b> gumballs?","<b>Digit 4</b><br>How many <b style=\"color:#b88a00\">YELLOW</b> gumballs?","Machine sticker: <b>Count only what's inside the glass.</b> The ones in the tray are already sold, and the red-and-white striped ones are peppermints, not gumballs."],
      hints:["Each phone counts one colour. Read the sticker card first: it tells you what NOT to count.","Skip the two in the tray and the three striped peppermints. Count row by row from the bottom.","9 green, 7 red, 4 blue, 6 yellow. The code is 9746."]},
    /* Gears: in one chain, the same number of teeth pass every contact. One crank turn = 48 teeth.
       A 48/16=3, B 48/24=2, C 48/12=4, D 48/8=6 -> 3246. (Each card holds one gear's tooth count.) */
    gears:{wave:2,title:"The Gearbox",obj:"o-gears",answer:"3246",kind:"num",tile:"G",
      lockedMsg:"The gearbox cover is bolted shut. Fix two of the first machines and it'll slide open.",
      scene:"Behind the cover: five gears in one long chain, and four dials marked A, B, C, D. Scratched inside the door: <em>\"Set each dial to how many full turns its gear makes when the crank turns ONCE. Remember: where two gears touch, every tooth that goes past on one goes past on the other.\"</em>",
      extra:gearsSVG,
      cards:["Spec sheet: the <b>CRANK</b> wheel has <b>48 teeth</b>.","Spec sheet: gear <b>A</b> has <b>16 teeth</b>.","Spec sheet: gear <b>B</b> has <b>24 teeth</b>.","Spec sheet: gear <b>C</b> has <b>12 teeth</b>.","Spec sheet: gear <b>D</b> has <b>8 teeth</b>."],cardClass:'type',
      hints:["Turn the crank once and 48 teeth go past gear A. How many turns is that for a gear with 16 teeth?","A turns 3 times, so 3 x 16 = 48 teeth go past B too. In fact every gear in the chain sees 48 teeth. Divide 48 by each gear's teeth.","48÷16=3, 48÷24=2, 48÷12=4, 48÷8=6. The code is 3246."]},
    /* QC find game: each card names one wonky toy (head/body). Their crate letters in card order:
       robot head + teddy body = W, teddy head + rocket = O, rocket nose + nutcracker = N, nutcracker head + robot = K, teddy head + nutcracker = Y -> WONKY.
       Decoys S (teddy head on robot) and E (robot head on nutcracker) are wonky but on no card. */
    qc:{wave:2,title:"The Rejects Bin",obj:"o-qc",answer:"WONKY",kind:"word",tile:"A",
      lockedMsg:"The rejects shutter is stuck down. Fix two of the first machines to roll it up.",
      scene:"Behind the shutter: the factory's mistakes, each on a lettered crate. Each phone's card describes one wonky toy. Tap all five in the bin, then read their crate letters in card order.",
      game:{type:'find',title:'Tag the 5 wonky toys',aspect:'1.19',scene:qcSVG,targets:QCT,reveal:'All five tagged! Their crate letters, in card order, are the code.'},
      cards:["<b>Letter 1</b><br>A teddy bear body wearing a <b>ROBOT head</b>.","<b>Letter 2</b><br>A rocket with a <b>TEDDY head</b> where the nose should be.","<b>Letter 3</b><br>A nutcracker soldier with a <b>ROCKET nose</b> for a head.","<b>Letter 4</b><br>A robot body with a <b>NUTCRACKER head</b>.","<b>Letter 5</b><br>A nutcracker soldier body with a <b>TEDDY head</b>."],
      hints:["Look at heads and bodies separately. Careful: some wonky toys in the bin are the wrong way round and aren't on any card.","The teddy body with a robot head sits on crate W. The robot body with a teddy head (crate S) is a trick.","W, O, N, K, Y. The answer is WONKY."]},
    /* Final: tiles C, I, M, G, A -> MAGIC (only common English anagram). */
    master:{wave:3,title:"Master Assembly Control",obj:"o-master",answer:"MAGIC",kind:"word",
      scene:"Every machine you fix drops a golden letter into the master control. Stamped on the big red lever: <em>\"Not steam. Not springs. Not batteries. Spell what really runs this factory, and pull.\"</em>",
      wrongMessages:{CHEER:"Close in spirit, but use only the five tiles.",SANTA:"He's the boss, not the fuel. Use only the five tiles."},
      hints:["It's the one thing every Christmas toy factory runs on. You can't see it, but you can feel it.","It's what makes reindeer fly. It starts with M.","The answer is MAGIC."]}
  },
  finale:{tag:"LINE RUNNING",titleHTML:"THE SLEIGH IS<br><span>LOADED</span>",
    cardHTML:`<h3>Elf Workshop Toy Check</h3>Before you wrap a present, give it the elf test: shake it gently (nothing rattles that shouldn't), check every part is the right way up, and give it a name. Then add a bow and a secret tag that says <b>"Made with magic."</b><div class="note">"Every toy right, every sack full. Best shift the factory's ever had. Love, S." <br><small style="font-family:Inter;font-size:11px;color:#8a6a4a">Art: Google Santa Tracker, CC BY 4.0</small></div>`}
};
EXP_ORDER.push(ID);
})();
