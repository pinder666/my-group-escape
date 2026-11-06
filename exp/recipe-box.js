(function(){
const ID='recipe-box', P=`.scene[data-exp="${ID}"]`;

function turkey(x,y,s=1){return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-11 2 A11 11 0 0 1 11 2Z" fill="#a0522d"/><path d="M-8 2 A8 8 0 0 1 8 2Z" fill="#d2691e"/><path d="M-5 2 A5 5 0 0 1 5 2Z" fill="#f4a460"/><ellipse cx="0" cy="5" rx="6" ry="5" fill="#5c3317"/><circle cx="4" cy="-1" r="2.6" fill="#6b3d1f"/><path d="M5.5 0 l2 1 -2 .8z" fill="#e8b33a"/><circle cx="4.6" cy="1.8" r="1.1" fill="#d23a2a"/><path d="M-2 10v3M2 10v3" stroke="#e8b33a" stroke-width="1"/></g>`}
function chicken(x,y){return `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="3" rx="5" ry="4" fill="#fdfaf2"/><circle cx="4" cy="-1.5" r="2.4" fill="#fdfaf2"/><path d="M3 -4 q1 -2 2 0 q1 -2 2 0z" fill="#d23a2a"/><path d="M6.3 -1.5 l2 .6 -2 .6z" fill="#e8b33a"/><path d="M-1 7v2.5M1.5 7v2.5" stroke="#e8b33a" stroke-width=".9"/></g>`}
function farmSVG(i){
  const sky='#cfe0e8', grass='#9bb86a'; let g='';
  if(i===0){ g+=`<rect width="120" height="90" fill="${grass}"/><rect width="120" height="38" fill="${sky}"/><path d="M8 40 L40 16 L72 40 V78 H8Z" fill="#9b3b2a"/><rect x="30" y="52" width="20" height="26" fill="#6e2a1e"/><rect x="31" y="24" width="18" height="14" fill="#3a1a12"/>`;
    g+=turkey(40,28,.75)+turkey(84,52)+turkey(106,58)+turkey(86,70,.85)+turkey(108,73,.85)+chicken(62,74)+chicken(100,42); }
  if(i===1){ g+=`<rect width="120" height="90" fill="${grass}"/><rect width="120" height="38" fill="${sky}"/><rect x="86" y="14" width="8" height="40" fill="#6b4a2a"/><circle cx="90" cy="16" r="18" fill="#6f8f3f"/><rect x="0" y="48" width="120" height="3" fill="#8a6a42"/><rect x="0" y="58" width="120" height="3" fill="#8a6a42"/>${[8,38,68,98].map(x=>`<rect x="${x}" y="44" width="4" height="22" fill="#7a5a32"/>`).join('')}`;
    g+=chicken(20,42)+chicken(50,42)+chicken(80,42)+chicken(108,42)+turkey(22,68,.9)+turkey(58,72,.9)+turkey(96,68,.9); }
  if(i===2){ g+=`<rect width="120" height="90" fill="${grass}"/><ellipse cx="58" cy="52" rx="44" ry="16" fill="#7aa6c2"/>`;
    g+=turkey(16,30)+turkey(40,28)+turkey(70,30)+turkey(26,70,.9)+turkey(56,72,.9)+turkey(100,63)+`<rect x="86" y="62" width="28" height="20" rx="4" fill="#d9b44a"/><path d="M88 68h24M88 74h24" stroke="#b8902e"/>`+chicken(8,60); }
  if(i===3){ g+=`<rect width="120" height="90" fill="${grass}"/><rect x="10" y="10" width="100" height="44" fill="#e7dcc4"/><path d="M4 12 L60 0 L116 12Z" fill="#7a3a2a"/><rect x="20" y="22" width="18" height="16" fill="#9fb8c8"/><rect x="82" y="22" width="18" height="16" fill="#9fb8c8"/><rect x="30" y="54" width="60" height="6" fill="#b9a27a"/><rect x="34" y="60" width="52" height="6" fill="#a8916a"/><rect x="38" y="66" width="44" height="6" fill="#977f58"/><rect x="50" y="18" width="20" height="16" fill="#fff8e6" stroke="#6b4a2a"/><g opacity=".9">${turkey(60,26,.45)}</g>`;
    g+=turkey(42,52,.85)+turkey(62,58,.85)+turkey(78,64,.85)+chicken(14,72)+chicken(106,66)+chicken(98,78); }
  return `<svg viewBox="0 0 120 90" role="img" aria-label="Farm photo piece ${i+1}" style="filter:sepia(.15)">${g}</svg>`;
}

EXPERIENCES[ID]={
  id:ID, title:"The Recipe Box", titleHTML:"THE RECIPE<br><span>BOX</span>", season:"Thanksgiving",
  tag:"A Thanksgiving escape room",
  blurb:"Grandma locked her pie recipe in a box with six locks. Search the dining room, crack every lock, and the pie is yours.",
  menuBlurb:"Grandma's pie recipe is locked in a box with six locks. Crack them before dessert.",
  menuLine:"Unlock Grandma's pie",
  theme:{accent:'#f2b33d',accent2:'#ffd27a',bg:'#0e0b09',introBg:'#2a1a10'},
  sceneCSS:`
${P}{background:#2a1616}
${P} .wall{position:absolute;left:0;right:0;top:0;height:56%;background:repeating-linear-gradient(90deg,#3d1f1c 0 18px,#46241f 18px 36px)}
${P} .wall::after{content:"";position:absolute;left:0;right:0;bottom:0;height:14px;background:linear-gradient(#5a3a24,#3e2717)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:44%;background:repeating-linear-gradient(0deg,#4a2f1d 0 22px,#3f2717 22px 24px)}
${P} .window{position:absolute;left:36%;top:7%;width:28%;height:27%;border:6px solid #2b1a0f;border-radius:6px 6px 2px 2px;background:linear-gradient(#0d1b33,#1d3157);overflow:hidden}
${P} .window::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:4px;margin-left:-2px;background:#2b1a0f;z-index:1}
${P} .window::after{content:"";position:absolute;top:50%;left:0;right:0;height:4px;margin-top:-2px;background:#2b1a0f;z-index:1}
${P} .moon{position:absolute;right:16%;top:14%;width:22%;aspect-ratio:1;border-radius:50%;background:#f3ead1;box-shadow:0 0 18px #f3ead1aa}
${P} .star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:twinkle 2.5s infinite}
${P} .curtain{position:absolute;top:5%;width:12%;height:34%;background:linear-gradient(90deg,#7a1f1f,#a8322a 40%,#6d1a1a);border-radius:0 0 40% 40%;transform-origin:top center;animation:sway 6s ease-in-out infinite}
${P} .curtain.l{left:29%} ${P} .curtain.r{left:59%;animation-delay:-3s}
${P} .rod{position:absolute;top:4.4%;left:27%;width:46%;height:6px;border-radius:3px;background:#b8862b}
${P} #o-letter{left:6%;top:11%;width:22%;height:22%;border:7px solid #b8862b;border-radius:3px;background:#e9dcbc;box-shadow:0 6px 14px rgba(0,0,0,.5),inset 0 0 0 2px #7a5a1b}
${P} #o-letter i{position:absolute;left:14%;right:14%;height:2px;background:#8a7350;border-radius:2px}
${P} #o-photo{right:6%;top:12%;width:24%;height:19%;border:7px solid #2b1a0f;background:#c9b48a;overflow:visible;box-shadow:0 6px 14px rgba(0,0,0,.5)}
${P} #o-photo .thumb{position:absolute;inset:0;background:linear-gradient(#d8c7a0 55%,#a89060 55%)}
${P} #o-photo .thumb::before{content:"";position:absolute;left:12%;bottom:38%;width:34%;height:34%;background:#8a4a2a;clip-path:polygon(0 35%,50% 0,100% 35%,100% 100%,0 100%)}
${P} #o-photo .cloth{position:absolute;inset:-10px -8px -18px -8px;background:linear-gradient(160deg,#6b4c3b,#4e3426);border-radius:30% 30% 12% 12%;transition:transform 1.2s cubic-bezier(.6,.05,.3,1),opacity 1.2s;display:flex;align-items:center;justify-content:center;font-family:'Archivo Black';color:#8f6a52;font-size:22px;transform-origin:top center}
${P} #o-photo.revealed .cloth{transform:translateY(160%) rotate(12deg);opacity:0}
${P} .sideboard{position:absolute;right:3%;top:44%;width:36%;height:17%;background:linear-gradient(#6b4226,#4a2c18);border-radius:4px;box-shadow:0 8px 16px rgba(0,0,0,.5)}
${P} #o-drawer{right:6%;top:50%;width:30%;height:7%;background:linear-gradient(#7a4c2c,#5a3820);border-radius:3px;box-shadow:inset 0 0 0 2px #3a2212;transition:transform .5s}
${P} #o-drawer::after{content:"";position:absolute;left:40%;right:40%;top:42%;height:4px;border-radius:2px;background:#d6a74a}
${P} #o-drawer.open{transform:translateY(18%) scale(1.06)}
${P} #o-pie{right:12%;top:38.5%;width:20%;height:6%;border-radius:50%;background:radial-gradient(ellipse at 50% 35%,#e8e8ea,#9a9aa2 60%,#6c6c75);box-shadow:0 3px 6px rgba(0,0,0,.5)}
${P} #o-pie::before{content:"";position:absolute;inset:18% 12%;border-radius:50%;background:radial-gradient(#d98a3a,#b5652a)}
${P} .table{position:absolute;left:3%;right:3%;top:60%;height:24%;background:linear-gradient(#efe6d2,#d9ccb0);clip-path:polygon(8% 0,92% 0,100% 100%,0 100%)}
${P} .runner{position:absolute;left:44%;width:12%;top:60%;height:24%;background:linear-gradient(#c8641f,#a54e15);clip-path:polygon(15% 0,85% 0,100% 100%,0 100%);opacity:.9}
${P} .tleg{position:absolute;top:84%;width:4%;height:14%;background:#3e2717}
${P} .chair{position:absolute;top:52%;width:9%;height:12%;background:linear-gradient(#5a3a24,#3e2717);border-radius:6px 6px 2px 2px}
${P} #o-box{left:39%;top:55.5%;width:22%;height:11%;background:linear-gradient(#8a5a32,#5e3a1e);border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.6),inset 0 0 0 2px #3a2212}
${P} #o-box::before{content:"";position:absolute;left:-3%;right:-3%;top:-14%;height:34%;background:linear-gradient(#9a6a3e,#6e4624);border-radius:4px;box-shadow:inset 0 0 0 2px #3a2212}
${P} #o-box .lights{position:absolute;left:8%;right:8%;bottom:16%;display:flex;justify-content:space-between}
${P} #o-box .lights b{width:9%;aspect-ratio:1;border-radius:50%;background:#2a1a10;box-shadow:inset 0 0 0 1px #000}
${P} #o-box .lights b.on{background:#ffd27a;box-shadow:0 0 8px #f2b33d}
${P} #o-seat{left:14%;top:66%;width:16%;height:8%;background:#fbf6ea;transform:rotate(-8deg);border-radius:2px;box-shadow:0 3px 6px rgba(0,0,0,.35)}
${P} #o-seat::before{content:"";position:absolute;left:12%;right:12%;top:30%;height:2px;background:#9a8a6a;box-shadow:0 6px 0 #9a8a6a}
${P} .candle{position:absolute;top:56%;width:2.6%;height:7%;background:linear-gradient(#f6efe0,#d8ccb4);border-radius:2px}
${P} .candle::before{content:"";position:absolute;left:50%;top:-55%;width:180%;height:60%;transform:translateX(-50%);background:radial-gradient(ellipse at 50% 70%,#fff6c8,#ffb23d 45%,transparent 70%);border-radius:50% 50% 45% 45%;animation:flame .18s infinite alternate}
${P} .light{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 58%,rgba(255,190,90,.22),transparent 45%);animation:flicker 4s infinite;z-index:3}
`,
  sceneHTML:`
<div class="wall"></div><div class="floor"></div><div class="rod"></div>
<div class="window"><div class="moon"></div>${[[12,20],[30,60],[55,15],[70,70],[20,80],[80,40]].map(([l,t],i)=>`<div class="star" style="left:${l}%;top:${t}%;animation-delay:${i*.4}s"></div>`).join('')}</div>
<div class="curtain l"></div><div class="curtain r"></div>
<button class="obj" id="o-letter" aria-label="Framed letter"><i style="top:22%"></i><i style="top:38%"></i><i style="top:54%"></i><i style="top:70%;right:40%"></i><span class="spark"></span></button>
<button class="obj" id="o-photo" aria-label="Covered picture frame"><div class="thumb"></div><div class="cloth">?</div><span class="spark"></span></button>
<div class="sideboard"></div>
<button class="obj" id="o-drawer" aria-label="Sideboard drawer"><span class="spark"></span></button>
<button class="obj" id="o-pie" aria-label="Pie tin"><span class="spark"></span></button>
<div class="chair" style="left:10%"></div><div class="chair" style="left:24%"></div><div class="chair" style="left:66%"></div><div class="chair" style="left:80%"></div>
<div class="table"></div><div class="runner"></div><div class="tleg" style="left:8%"></div><div class="tleg" style="right:8%"></div>
<div class="candle" style="left:33%"></div><div class="candle" style="left:64.5%"></div>
<button class="obj" id="o-box" aria-label="Grandma's recipe box"><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<button class="obj" id="o-seat" aria-label="Seating card"><span class="spark"></span></button>
<div class="light"></div>`,
  order:["seat","drawer","letter","photo","pie","box"],
  revealOnWave2:[{sel:'#o-photo',cls:'revealed'}],
  wave2Toast:"The cloth slid off the picture frame, and the pie tin came loose.",
  finalReadyToast:"Five tiles in the box. The last lock is waiting.",
  locks:{
    seat:{wave:1,title:"The Seating Chart",obj:"o-seat",answer:"GRAVY",kind:"word",tile:"S",
      scene:"A seating card is propped on the table: five chairs in a row. <em>\"Seat my guests the way I like them, then read their first letters in chair order.\"</em>",
      extra:`<div style="display:flex;gap:6px">${[1,2,3,4,5].map(n=>`<div style="flex:1;text-align:center;font-size:11px;color:#b3aa9c"><div style="height:34px;margin-bottom:4px;border-radius:8px 8px 3px 3px;background:linear-gradient(#5a3a24,#3e2717);display:flex;align-items:center;justify-content:center;font-family:'Archivo Black';color:#d6a74a">${n}</div>Chair ${n}</div>`).join('')}</div><p class="scene-txt" style="margin:10px 0 0">Guests: <b>Gus, Ray, Ann, Vera, Yolanda</b></p>`,
      cards:["Gus always takes chair 1. He's carved the turkey since 1974.","Yolanda wants the end seat, chair 5, closest to the pie.","Ray has to sit right next to Gus. They argue about football.","Vera will not sit next to Ray. Not after last year.","Ann sits between Ray and Vera to keep the peace."],
      hints:["Two guests already know exactly which chair is theirs. Seat them first.","Gus is in 1, Yolanda in 5. Ray must be next to Gus, so where does he go?","Gus, Ray, Ann, Vera, Yolanda. The answer is GRAVY."]},
    drawer:{wave:1,title:"The Recipe Card",obj:"o-drawer",answer:"4628",kind:"num",tile:"E",openClass:"open",
      scene:"Inside the drawer: Grandma's stuffing card, torn into strips. <em>\"Serves 4. Eight of you are coming, so double everything. The code is the new amounts, top to bottom.\"</em>",
      cardClass:"hand",cards:["Top line: 2 eggs","Second line: 3 cups of bread cubes","Third line: 1 onion","Bottom line: 4 celery sticks","Margin note: 8 coming, double it! Code = new amounts, top to bottom."],
      hints:["The card serves 4. How many are coming?","Double every amount and keep them in card order.","4 eggs, 6 cups, 2 onions, 8 celery. The code is 4628."]},
    letter:{wave:1,title:"The Mayflower Letter",obj:"o-letter",answer:"PUMPKIN",kind:"word",tile:"T",
      scene:"Behind the frame's glass is an old letter Grandma treasures, \"from a settler, autumn 1621\". Its lines are numbered.",
      cardClass:"hand",cards:["Line 1: Praise be, we have lived through our first year here.","Line 2: Under snow all winter, we wondered if we would.","Line 3: Most days we stayed close to the fire.","Line 4: Planting began in spring, and our neighbors showed us how to grow corn.","Line 5: Kettles are full now, and we have a harvest to celebrate.","Line 6: In a few days we feast together with our neighbors.","Line 7: Never have I been so thankful.","Grandma's sticky note: \"I always say the first thing matters most.\""],
      hints:["Put the lines in order. Then reread Grandma's sticky note.","Look only at the first letter of each line.","The first letters spell PUMPKIN."]},
    photo:{wave:2,title:"The Turkey Tally",obj:"o-photo",answer:"17",kind:"num",tile:"A",splitArt:true,
      lockedMsg:"Something's under that cloth. Crack two of the first locks to lift it.",
      scene:"Under the cloth: a photo of Grandma's old farm, cut into four pieces. <em>\"Count every turkey on the farm. Not the chickens. Your grandfather always missed one.\"</em>",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-2,1.5,1,-1.5][i]}deg;animation-delay:${i*.08}s"><span class="ph">PHONE ${i+1}</span>${farmSVG(i)}</div>`).join('')}</div>`,
      hints:["Count the turkeys in each piece, then add them up together.","Two turkeys are hiding: the barn's top window and behind the hay bale. The one on the sign doesn't count.","5 + 3 + 6 + 3. The answer is 17."]},
    pie:{wave:2,title:"The Pie Cipher",obj:"o-pie",answer:"THANKS",kind:"word",tile:"F",
      lockedMsg:"The pie tin is stuck to the shelf. Crack two of the first locks to free it.",
      scene:"Scratched into the bottom of Grandma's pie tin are six letters. Her code wheel is cut like a pie.",
      extra:`<div class="big-letters">${"WKDQNV".split('').map(c=>`<span>${c}</span>`).join('')}</div>`,
      cardClass:"slice",cards:["W on the tin means T","K on the tin means H","D on the tin means A","Q on the tin means N","N on the tin means K","V on the tin means S"],
      hints:["Each slice swaps one letter on the tin for another. You need every slice.","W becomes T, K becomes H. Keep going.","The tin says THANKS."]},
    box:{wave:3,title:"Grandma's Recipe Box",obj:"o-box",answer:"FEAST",kind:"word",
      scene:"Six locks on the lid. Each lock you crack drops a golden letter tile into the box. <em>\"Arrange my letters into what we're all here for tonight.\"</em>",
      wrongMessages:{FEATS:"Real word, wrong one. What are you all here for tonight?",FATES:"Real word, wrong one. What are you all here for tonight?"},
      hints:["It's a word for a very big Thanksgiving dinner.","It starts with F.","The answer is FEAST."]}
  },
  finale:{tag:"ESCAPED",titleHTML:"THE BOX IS<br><span>OPEN</span>",
    cardHTML:`<h3>Grandma's Pumpkin Pie</h3>One 9-inch pie crust · 15 oz pumpkin purée · ¾ cup sugar · 2 eggs · 12 oz evaporated milk · 1 tsp cinnamon · ½ tsp ginger · ¼ tsp cloves · ½ tsp salt.<br>Whisk, pour into the crust. Bake 15 min at 425°F, then 40–50 min at 350°F until a knife comes out clean.<div class="note">"The secret ingredient was always you lot, working together. Happy Thanksgiving. Love, Grandma."</div>`}
};
EXP_ORDER.push(ID);
})();
