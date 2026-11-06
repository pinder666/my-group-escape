(function(){
const ID='mission-control', P=`.scene[data-exp="${ID}"]`;

/* ---------- binary lamp rows ---------- */
function lampRow(bits,label){
  return `<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="font-size:11px;font-weight:700;color:#8fb8d8;width:38px">${label}</span><svg viewBox="0 0 110 22" width="130" height="26">${bits.split('').map((b,i)=>`<circle cx="${11+i*22}" cy="11" r="8.5" fill="${b==='1'?'#7fe8ff':'#18263a'}" stroke="${b==='1'?'#d8fbff':'#3a4e66'}" stroke-width="1.5"${b==='1'?' style="filter:drop-shadow(0 0 3px #4fd8ff)"':''}/>`).join('')}</svg></div>`;
}
const ROWS=['01111','00011','00101','00001','01110']; // O C E A N
const valuesCard=`<b>Lamp values</b><br>Left to right, the five lamps are worth:<div style="display:flex;justify-content:space-between;max-width:200px;margin-top:8px;font-family:'Archivo Black',Inter,sans-serif;font-size:18px;color:#7fe8ff">${[16,8,4,2,1].map(n=>`<span>${n}</span>`).join('')}</div><div style="margin-top:4px;font-size:12px;color:#8fb8d8">Add up the lit lamps in a row.</div>`;
const alphaCard=`<b>Letter table</b><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:2px 4px;margin-top:6px;font-size:12px;font-family:ui-monospace,monospace">${[...Array(26)].map((_,i)=>`<span>${String.fromCharCode(65+i)}=${i+1}</span>`).join('')}</div>`;

/* ---------- nav star grid: (across, up) from bottom-left ---------- */
const GRID={'2,5':'H','5,2':'O','1,3':'M','4,6':'E','6,4':'W','3,1':'A','5,5':'R','2,2':'D',
  '1,1':'K','4,2':'T','6,1':'S','1,6':'P','3,4':'L','6,6':'B','4,4':'U','3,3':'G','5,3':'Y','2,6':'C','6,2':'I','4,1':'N','1,5':'F','5,6':'V'};
function navSVG(){
  let g=`<rect width="252" height="252" rx="8" fill="#04101e"/>`;
  for(let i=0;i<=6;i++) g+=`<path d="M${6+i*40} 6V246M6 ${6+i*40}H246" stroke="#1f4a6a" stroke-width="${i%6===0?2:1}"/>`;
  for(let x=1;x<=6;x++)for(let y=1;y<=6;y++){
    const L=GRID[x+','+y], cx=6+(x-1)*40+20, cy=6+(6-y)*40+20;
    if(L) g+=`<circle cx="${cx-8}" cy="${cy-6}" r="3.2" fill="#fff" style="filter:drop-shadow(0 0 3px #7fe8ff)"/><text x="${cx+6}" y="${cy+11}" text-anchor="middle" font-size="17" font-weight="700" fill="#7fe8ff" font-family="Inter,sans-serif">${L}</text>`;
    else g+=`<circle cx="${cx}" cy="${cy}" r="1" fill="#2f5a7a"/>`;
  }
  return `<svg viewBox="0 0 252 252" style="max-width:280px;margin:0 auto" role="img" aria-label="Navigation grid, 6 by 6, with lettered stars">${g}</svg>`;
}

EXPERIENCES[ID]={
  id:ID, title:"Mission Control", titleHTML:"MISSION<br><span>CONTROL</span>",
  tag:"A space escape room",
  blurb:"The capsule Starling has lost its main computer and is drifting in orbit with three astronauts aboard. You are ground control. Bring them home.",
  menuBlurb:"A capsule is drifting in orbit. You're ground control. Bring the crew home.",
  menuLine:"Bring the crew home",
  theme:{accent:'#4fd8ff',accent2:'#ff9a3c',bg:'#060a12',introBg:'#0c1a2c'},
  sceneCSS:`
${P}{background:#081020}
${P} .wall{position:absolute;inset:0;background:linear-gradient(#0d1a2e,#091322 60%);}
${P} .wall::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 23%,rgba(80,140,200,.08) 23% 23.4%),repeating-linear-gradient(0deg,transparent 0 11%,rgba(80,140,200,.06) 11% 11.3%)}
/* big screen */
${P} .screen{position:absolute;left:5%;top:4%;width:90%;height:27%;border:4px solid #23364e;border-radius:8px;background:radial-gradient(ellipse at 50% 50%,#0a1a33,#020814 70%);overflow:hidden;box-shadow:0 0 24px rgba(79,216,255,.18),inset 0 0 30px rgba(0,0,0,.8)}
${P} .st{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;animation:twinkle 3s ease-in-out infinite}
${P} .earth{position:absolute;left:39%;top:26%;width:22%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#7fd0ff,#2a7ad8 45%,#123a7a 75%);box-shadow:0 0 18px rgba(79,170,255,.6);overflow:hidden}
${P} .earth::before{content:"";position:absolute;left:14%;top:22%;width:40%;height:30%;border-radius:40% 60% 50% 40%;background:#3fae5a;box-shadow:28px 26px 0 -4px #3fae5a,6px 34px 0 -8px #3fae5a}
${P} .orbit{position:absolute;left:14%;right:14%;top:14%;bottom:14%;border:1.5px dashed rgba(127,232,255,.45);border-radius:50%}
${P} .capx{position:absolute;left:0;right:0;top:0;bottom:0;animation:${ID}-x 5s ease-in-out infinite alternate}
${P} .capy{position:absolute;inset:0;animation:${ID}-y 5s ease-in-out infinite alternate;animation-delay:-2.5s}
${P} .cap{position:absolute;left:50%;top:50%;width:12px;height:8px;margin:-4px -6px;background:#f2f6fa;clip-path:polygon(0 50%,40% 0,100% 15%,100% 85%,40% 100%);box-shadow:0 0 6px #fff}
${P} .cap::after{content:"";position:absolute;inset:0;background:#ff9a3c;animation:blink 1s infinite}
${P} .slabel{position:absolute;left:3%;top:5%;font:700 9px/1 ui-monospace,monospace;color:#ff9a3c;letter-spacing:1px;animation:blink 1.4s infinite}
${P} .slabel2{position:absolute;right:3%;bottom:6%;font:700 8px/1.3 ui-monospace,monospace;color:#7fe8ff;text-align:right}
/* telemetry monitor */
${P} .tele{position:absolute;left:4%;top:34%;width:27%;height:19%;background:#03110c;border:3px solid #23364e;border-radius:6px;overflow:hidden;box-shadow:inset 0 0 14px rgba(0,0,0,.8)}
${P} .tele .scroll{position:absolute;left:6%;right:6%;top:0;font:600 8px/1.45 ui-monospace,monospace;color:#5fe0a0;white-space:pre;animation:${ID}-scroll 9s linear infinite}
${P} .tele::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 1px,transparent 1px 3px)}
/* nav monitor */
${P} #o-nav{right:4%;top:34%;width:27%;height:19%;background:#04101e;border:3px solid #23364e;border-radius:6px;overflow:hidden}
${P} #o-nav::before{content:"";position:absolute;inset:6%;background:repeating-linear-gradient(90deg,#1f4a6a 0 1px,transparent 1px 16.6%),repeating-linear-gradient(0deg,#1f4a6a 0 1px,transparent 1px 16.6%)}
${P} #o-nav i{position:absolute;width:4px;height:4px;border-radius:50%;background:#fff;box-shadow:0 0 5px #7fe8ff;animation:twinkle 2.4s infinite}
${P} #o-nav::after{content:"";position:absolute;left:50%;top:50%;width:140%;height:140%;margin:-70% 0 0 -70%;background:conic-gradient(from 0deg,rgba(79,216,255,.35),transparent 18%);animation:spin 4s linear infinite;border-radius:50%}
/* countdown clock (wave 2) */
${P} #o-clock{left:35%;top:34%;width:30%;height:7.5%;background:#050505;border:3px solid #23364e;border-radius:6px;display:flex;align-items:center;justify-content:center;font:700 15px/1 ui-monospace,monospace;color:#2a2018;letter-spacing:1px;transition:color .8s,text-shadow .8s,box-shadow .8s}
${P} #o-clock .dg::before{content:"T- 88:88"}
${P} #o-clock.revealed{color:#ff9a3c;text-shadow:0 0 8px #ff7a1a;box-shadow:0 0 16px rgba(255,154,60,.35)}
${P} #o-clock.revealed .dg{animation:blink 1s infinite}
${P} #o-clock.revealed .dg::before{content:"T- --:--"}
/* crew file case (wave 2) */
${P} #o-file{left:37%;top:43.5%;width:26%;height:12%;background:#14243a;border:3px solid #3a5070;border-radius:4px;overflow:hidden}
${P} #o-file .folder{position:absolute;left:14%;right:14%;top:14%;bottom:8%;background:linear-gradient(#e8c46a,#c99a3a);border-radius:2px 8px 2px 2px}
${P} #o-file .folder::before{content:"CREW";position:absolute;left:0;right:0;top:30%;text-align:center;font:800 9px/1 Inter,sans-serif;color:#5a3a10;letter-spacing:2px}
${P} #o-file .glass{position:absolute;inset:0;background:linear-gradient(135deg,rgba(160,200,255,.35),rgba(60,90,140,.55));transition:transform 1.2s cubic-bezier(.6,.05,.3,1)}
${P} #o-file .seal{position:absolute;left:0;right:0;top:40%;height:20%;background:#c0302a;font:800 8px/1 Inter,sans-serif;color:#fff;display:flex;align-items:center;justify-content:center;letter-spacing:2px;transition:opacity .6s}
${P} #o-file.revealed .glass{transform:translateY(-105%)} ${P} #o-file.revealed .seal{opacity:0}
/* console desk */
${P} .desk{position:absolute;left:0;right:0;top:58%;bottom:0;background:linear-gradient(#1c2c44,#101a2a 40%,#0a111c);clip-path:polygon(0 8%,100% 8%,100% 100%,0 100%)}
${P} .desk::before{content:"";position:absolute;left:0;right:0;top:8%;height:3%;background:#2f4866}
${P} .cbtn{position:absolute;width:3.5%;aspect-ratio:1;border-radius:2px;animation:blink 1.7s infinite}
${P} #o-lights{left:5%;top:63%;width:42%;height:9%;background:#0b1422;border:2px solid #2f4866;border-radius:5px;display:grid;grid-template-columns:repeat(5,1fr);align-items:center;justify-items:center;padding:0 3%}
${P} #o-lights b{width:62%;aspect-ratio:1;border-radius:50%;background:#18263a;box-shadow:inset 0 0 0 1px #3a4e66}
${P} #o-lights b.l{animation:${ID}-lamp 2.2s infinite}
${P} #o-air{right:7%;top:61%;width:21%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#0c1626 58%,#2f4866 60%,#1a2a40 70%,#0a111c 72%);box-shadow:0 4px 8px rgba(0,0,0,.6)}
${P} #o-air::before{content:"";position:absolute;inset:16%;border-radius:50%;background:conic-gradient(from 225deg,#e0402a 0 25%,#ffb43a 25% 45%,#3fd27a 45% 75%,transparent 75%);-webkit-mask:radial-gradient(circle,transparent 62%,#000 64%);mask:radial-gradient(circle,transparent 62%,#000 64%)}
${P} #o-air .ndl{position:absolute;left:48.5%;top:20%;width:3%;height:30%;background:#f2f6fa;transform-origin:50% 100%;animation:${ID}-ndl 3s ease-in-out infinite;border-radius:2px}
${P} #o-air .o2{position:absolute;left:0;right:0;bottom:22%;text-align:center;font:800 10px/1 Inter,sans-serif;color:#7fe8ff}
/* abort / re-entry panel (final) */
${P} #o-panel{left:24%;top:76%;width:52%;height:19%;background:#141e2c;border-radius:6px;border:5px solid transparent;background-clip:padding-box;box-shadow:0 0 0 5px #141e2c,0 0 0 5px transparent;outline:4px dashed #f2c21a;outline-offset:-2px}
${P} #o-panel .bigbtn{position:absolute;left:39%;top:10%;width:22%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 40% 35%,#ff7a6a,#d02a1a 55%,#7a1208);box-shadow:0 4px 0 #4a0a04,0 0 14px rgba(255,60,40,.4)}
${P} #o-panel .cover{position:absolute;left:35%;top:5%;width:30%;height:52%;border-radius:8px;background:rgba(180,220,255,.22);border:1px solid rgba(200,230,255,.5);transform-origin:top center;transition:transform .8s}
${P} #o-panel.solved .cover{transform:perspective(200px) rotateX(70deg)}
${P} #o-panel .lab{position:absolute;left:0;right:0;top:61%;text-align:center;font:800 8px/1 Inter,sans-serif;color:#f2c21a;letter-spacing:2px}
${P} #o-panel .lights{position:absolute;left:10%;right:10%;bottom:9%;display:flex;justify-content:space-between}
${P} #o-panel .lights b{width:10%;aspect-ratio:1;border-radius:50%;background:#2a1414;box-shadow:inset 0 0 0 1px #000}
${P} #o-panel .lights b.on{background:#7fe8ff;box-shadow:0 0 8px #4fd8ff,0 0 2px #fff inset}
${P} .beacon{position:absolute;right:3%;top:31.5%;width:5%;height:3%;border-radius:50% 50% 0 0;background:#ff7a1a;box-shadow:0 0 10px 3px rgba(255,122,26,.7);animation:${ID}-alarm 1.2s ease-in-out infinite}
@keyframes ${ID}-x{from{transform:translateX(-33%)}to{transform:translateX(33%)}}
@keyframes ${ID}-y{from{transform:translateY(-34%)}to{transform:translateY(34%)}}
@keyframes ${ID}-scroll{from{transform:translateY(0)}to{transform:translateY(-50%)}}
@keyframes ${ID}-lamp{0%,40%{background:#7fe8ff;box-shadow:0 0 6px #4fd8ff}41%,100%{background:#18263a;box-shadow:inset 0 0 0 1px #3a4e66}}
@keyframes ${ID}-ndl{0%,100%{transform:rotate(-100deg)}50%{transform:rotate(-88deg)}}
@keyframes ${ID}-alarm{0%,100%{opacity:1}50%{opacity:.25}}
`,
  sceneHTML:`
<div class="wall"></div>
<div class="screen">${[[6,20],[14,70],[24,40],[33,85],[70,18],[78,60],[88,30],[92,80],[60,88],[45,10],[18,12],[84,8]].map(([l,t],i)=>`<div class="st" style="left:${l}%;top:${t}%;animation-delay:${i*.3}s"></div>`).join('')}
  <div class="orbit"></div><div class="earth"></div><div class="capx"><div class="capy"><div class="cap"></div></div></div>
  <div class="slabel">STARLING · SIGNAL LOST</div><div class="slabel2">ORBIT 3<br>ALT 412 KM</div></div>
<div class="beacon"></div>
<div class="tele"><div class="scroll">${(t=>t+t)(`ALT  412.06\nVEL  7.66\nO2   LOW\nCOMP  ERR\nTEMP 21.4\nPWR  63%\nRADIO --\nYAW  +0.2\nROLL -1.4\nCREW  3\nHULL  OK\nLINK  ...\n`)}</div></div>
<button class="obj" id="o-nav" aria-label="Navigation monitor">${[[20,30],[60,20],[40,60],[75,70],[30,80]].map(([l,t],i)=>`<i style="left:${l}%;top:${t}%;animation-delay:${i*.5}s"></i>`).join('')}<span class="spark"></span></button>
<button class="obj" id="o-clock" aria-label="Countdown clock, switched off"><span class="dg"></span><span class="spark"></span></button>
<button class="obj" id="o-file" aria-label="Sealed crew file case"><div class="folder"></div><div class="glass"></div><div class="seal">SEALED</div><span class="spark"></span></button>
<div class="desk"></div>
${[[52,66,'#3fd27a',0],[57,66,'#ff9a3c',.4],[62,66,'#7fe8ff',.9],[52,71,'#e0402a',1.3],[57,71,'#3fd27a',.2],[62,71,'#ffd84a',.7],[8,90,'#3fd27a',.5],[13,90,'#7fe8ff',1.1],[84,90,'#ff9a3c',.3],[89,90,'#3fd27a',.8]].map(([l,t,c,d])=>`<div class="cbtn" style="left:${l}%;top:${t}%;background:${c};box-shadow:0 0 6px ${c};animation-delay:${d}s"></div>`).join('')}
<button class="obj" id="o-lights" aria-label="Console signal lamps">${[1,0,1,1,0].map((on,i)=>`<b class="${on?'l':''}" style="animation-delay:${i*.35}s"></b>`).join('')}<span class="spark"></span></button>
<button class="obj" id="o-air" aria-label="Oxygen gauge"><div class="ndl"></div><div class="o2">O2</div><span class="spark"></span></button>
<button class="obj" id="o-panel" aria-label="Re-entry panel"><div class="cover"></div><div class="bigbtn"></div><div class="lab">RE-ENTRY</div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>`,
  order:["lights","nav","air","clock","crew","panel"],
  revealOnWave2:[{sel:'#o-clock',cls:'revealed'},{sel:'#o-file',cls:'revealed'}],
  wave2Toast:"Power's back on the wall: the countdown clock lit up and the glass slid off the crew file.",
  finalReadyToast:"Five tiles on the re-entry panel. Time to bring them home.",
  startToast:"Starling isn't answering. Tap anything that sparkles.",
  locks:{
    /* Lamps worth 16 8 4 2 1. Rows: 01111=8+4+2+1=15=O, 00011=2+1=3=C, 00101=4+1=5=E,
       00001=1=A, 01110=8+4+2=14=N. Word: OCEAN. */
    lights:{wave:1,title:"The Blinking Lamps",obj:"o-lights",answer:"OCEAN",kind:"word",tile:"T",
      scene:"The crew's radio is dead, so they're blinking a message on the console lamps, one row per letter. <em>\"Where should we land?\"</em> they asked. This is their best guess.",
      cardClass:"dark",wideCards:true,cards:[lampRow(ROWS[0],'Row 1')+lampRow(ROWS[1],'Row 2'),lampRow(ROWS[2],'Row 3')+lampRow(ROWS[3],'Row 4'),valuesCard,alphaCard,lampRow(ROWS[4],'Row 5')],
      hints:["Each lamp has a value. Add up only the lit lamps in a row, then turn that number into a letter.","Row 1 has the 8, 4, 2 and 1 lamps lit. That's 15, which is O.","15, 3, 5, 1, 14. The answer is OCEAN."]},
    /* Pilot's rule: from bottom-left (1,1), first number = along, second = up.
       (2,5)H (5,2)O (1,3)M (4,6)E (6,4)W (3,1)A (5,5)R (2,2)D -> HOMEWARD.
       Swapping the numbers gives OHAWEMRD; counting rows from the top lands on empty squares. */
    nav:{wave:1,title:"The Star Grid",obj:"o-nav",answer:"HOMEWARD",kind:"word",tile:"H",
      scene:"Starling's computer needs a course word before it will steer. The crew read eight guide stars off their window and radioed down the squares.",
      extra:navSVG(),
      cardClass:"dark",cards:["<b>Stars 1 and 2</b><br>(2, 5)<br>(5, 2)","<b>Stars 3 and 4</b><br>(1, 3)<br>(4, 6)","<b>Stars 5 and 6</b><br>(6, 4)<br>(3, 1)","<b>Stars 7 and 8</b><br>(5, 5)<br>(2, 2)","<b>Pilot's rule</b><br>Square (1, 1) is the BOTTOM-LEFT corner. First number: count ALONG. Second number: count UP."],
      hints:["Read the pilot's rule carefully. You start in the bottom-left corner and go along before you go up.","(2, 5) means 2 squares along, 5 squares up. That star is H.","H, O, M, E, W, A, R, D. The answer is HOMEWARD."]},
    /* 6.5 tanks x 12 astronaut-hours = 78 astronaut-hours. Shared by 3 = 26 hours of air.
       The trip home needs 2 of those hours, so they can wait 26 - 2 = 24 hours. */
    air:{wave:1,title:"The Oxygen Gauge",obj:"o-air",answer:"24",kind:"num",tile:"E",
      scene:"The oxygen needle is creeping toward red. Before you plan anything, you need to know: <em>how many hours can the crew wait before they must head home?</em>",
      cardClass:"type",cards:["Air tanks on board: 6 full tanks and 1 tank that is half full.","One full tank keeps ONE astronaut breathing for 12 hours.","There are 3 astronauts on Starling.","The trip home takes 2 hours, and they need air the whole way."],
      hints:["First work out how many hours of air there are for one astronaut, then share it between the crew.","6 and a half tanks is 78 hours for one person. Shared by 3, that's 26 hours each.","26 hours minus the 2-hour trip home. The answer is 24."]},
    /* Checklist in seconds: hatch 1:15 = 75, strap in 50, turn shield 2:00 = 120, engine 45 x 2 = 90.
       75 + 50 + 120 + 90 = 335. */
    clock:{wave:2,title:"The Countdown",obj:"o-clock",answer:"335",kind:"num",tile:"R",
      lockedMsg:"The countdown clock has no power yet. Crack two of the first locks to get the wall running.",
      scene:"The countdown clock has power, but it's blank. It must count down exactly as long as the re-entry checklist takes. <em>Set it in seconds.</em> (One minute is 60 seconds.)",
      cardClass:"type",cards:["CHECKLIST 1<br>Close and seal the hatch: 1 minute 15 seconds.","CHECKLIST 2<br>All crew strap in: 50 seconds.","CHECKLIST 3<br>Turn the heat shield to face Earth: 2 minutes.","CHECKLIST 4<br>Fire the engine for 45 seconds. Then do it AGAIN."],
      hints:["Turn every step into seconds first, then add them all up.","1 minute 15 is 75 seconds, 2 minutes is 120. Don't forget the engine fires twice.","75 + 50 + 120 + 45 + 45. The answer is 335."]},
    /* Kim is left. Gold is next to Kim -> gold is middle. Leo is red, so Leo isn't middle -> Leo right,
       Ana middle (gold), Kim blue. ROVER is blue -> Kim is ROVER. Ana isn't COMET -> Ana is LUNAR, Leo COMET.
       Middle seat = LUNAR. Brute-forced: unique, and dropping any one clue makes the answer ambiguous. */
    crew:{wave:2,title:"The Crew File",obj:"o-file",answer:"LUNAR",kind:"word",tile:"A",
      lockedMsg:"The crew file is sealed behind glass. Crack two of the first locks to break the seal.",
      scene:"The landing system only takes orders from the astronaut in the MIDDLE seat. You need that astronaut's call sign. The crew are Kim, Leo and Ana. Their call signs are COMET, LUNAR and ROVER, and their patches are red, blue and gold.",
      extra:`<div style="display:flex;gap:6px">${['LEFT','MIDDLE','RIGHT'].map(s=>`<div style="flex:1;text-align:center;font-size:11px;font-weight:700;color:#8fb8d8"><div style="height:40px;margin-bottom:4px;border-radius:10px 10px 4px 4px;background:linear-gradient(#2f4866,#1a2a40);border:2px solid ${s==='MIDDLE'?'#4fd8ff':'#3a5070'}"></div>${s} SEAT</div>`).join('')}</div>`,
      cards:["Kim sits in the LEFT seat.","Whoever wears the GOLD patch sits right next to Kim.","Leo's patch is RED.","The astronaut on the BLUE patch is called ROVER.","Ana's call sign is NOT COMET."],
      hints:["Start with Kim's seat, then work out which seat the gold patch must be in.","Gold is in the middle. Leo is red, so Ana is in the middle seat. Who is ROVER?","Kim is blue, so Kim is ROVER, and Ana isn't COMET. The answer is LUNAR."]},
    panel:{wave:3,title:"Re-Entry",obj:"o-panel",answer:"EARTH",kind:"word",
      scene:"Six lights on the re-entry panel, and each lock you crack drops a letter tile into it. The big red button stays locked until you key in one word. <em>Where are you bringing them?</em>",
      wrongMessages:{HEART:"Lovely, but the capsule needs a destination.",HATER:"Nobody hates anybody here. Where is home?",RATHE:"Not a destination. Where is home?"},
      hints:["It's the planet you're standing on.","It starts with E.","The answer is EARTH."]}
  },
  finale:{tag:"SPLASHDOWN",titleHTML:"WELCOME<br><span>HOME</span>",
    cardHTML:`<h3>Mission Log: Starling</h3>Re-entry burn: 335 seconds, right on the dot. Heat shield held. Parachutes open. Splashdown in the ocean at 06:12, gentle as a bath toy.<div class="note">"Ground control, this is LUNAR. We can see the recovery boat. Tell whoever was on shift tonight: thank you. And we'd like pizza."</div>`}
};
EXP_ORDER.push(ID);
})();
