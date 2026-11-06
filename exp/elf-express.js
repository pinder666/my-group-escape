(function(){
const ID='elf-express', P=`.scene[data-exp="${ID}"]`;
const A='assets/elf-express/';

/* ================= ROUTE MAP (lock: route) =================
   One 240x180 map, drawn once; each phone gets a 120x90 window of it (viewBox offset).
   Closed switches carry a red bar. Following only open track from START:
   START - F - j1 -> R - j2 -> O - j3 -> S - j5 -> T - j4 -> Y - NORTH POLE  => printed S W I T C H = SWITCH (see LBL).
   Decoy stations on closed branches: H, K, E, M, D. The network is a tree, so the path is unique
   (checked by walking the graph in node, see ROUTE.edges). */
const ROUTE={
  n:{start:[14,24],F:[44,24],j1:[72,24],H:[60,68],R:[150,18],j2:[180,22],K:[222,22],O:[198,62],j3:[198,104],E:[228,126],
     S:[154,122],j5:[104,130],M:[92,102],T:[68,140],j4:[40,148],D:[14,110],Y:[40,168],NP:[204,166]},
  edges:[['start','F'],['F','j1'],['j1','R'],['j1','H',1],['R','j2'],['j2','O'],['j2','K',1],['O','j3'],['j3','S'],['j3','E',1],
     ['S','j5'],['j5','T'],['j5','M',1],['T','j4'],['j4','Y'],['j4','D',1],['Y','NP']]
};
const LBL={F:'S',R:'W',O:'I',S:'T',T:'C',Y:'H',H:'B'}; /* station keys -> printed letters: path reads S W I T C H */
function routeMap(){
  const N=ROUTE.n; let g='';
  // scenery
  g+=`<rect width="240" height="180" fill="#eef4fb"/>`;
  g+=[[96,60],[128,48],[20,80],[176,92],[132,160],[84,166],[214,108]].map(([x,y])=>`<path d="M${x} ${y} l7 -14 l7 14z" fill="#8fb3cf"/><path d="M${x+4.5} ${y-9} l2.5 -5 l2.5 5 l-2.5 1.5z" fill="#fff"/>`).join('');
  g+=[[30,50],[36,56],[110,82],[170,40],[160,148],[120,108],[70,112],[226,64],[12,160],[190,128]].map(([x,y])=>`<path d="M${x} ${y} l3.5 -9 l3.5 9z" fill="#2f8a57"/><rect x="${x+3}" y="${y}" width="1" height="2" fill="#6b4a2a"/>`).join('');
  g+=`<ellipse cx="120" cy="66" rx="16" ry="7" fill="#bfe0f2"/>`;
  // track
  ROUTE.edges.forEach(([a,b])=>{const [x1,y1]=N[a],[x2,y2]=N[b];
    g+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#5b4330" stroke-width="5" stroke-linecap="round"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#c9b28c" stroke-width="5" stroke-dasharray="1.2 2.4"/><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#3a2a1c" stroke-width="1.2"/>`;});
  // closed switches: red bar across the branch, 9 units from the fork
  ROUTE.edges.filter(e=>e[2]).forEach(([a,b])=>{const [x1,y1]=N[a],[x2,y2]=N[b];const d=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/d,uy=(y2-y1)/d,cx=x1+ux*10,cy=y1+uy*10;
    g+=`<line x1="${(cx-uy*6).toFixed(1)}" y1="${(cy+ux*6).toFixed(1)}" x2="${(cx+uy*6).toFixed(1)}" y2="${(cy-ux*6).toFixed(1)}" stroke="#d62b2b" stroke-width="3.4" stroke-linecap="round"/>`;});
  // junction dots
  ['j1','j2','j3','j4','j5'].forEach(j=>{const [x,y]=N[j]; g+=`<circle cx="${x}" cy="${y}" r="2.6" fill="#3a2a1c"/>`;});
  // stations
  'FHRKOESMTDY'.split('').forEach(s=>{const [x,y]=N[s]; g+=`<circle cx="${x}" cy="${y}" r="8" fill="#fff" stroke="#2b3a4a" stroke-width="2"/><text x="${x}" y="${y+3.6}" text-anchor="middle" font-size="10.5" font-weight="700" font-family="Inter,Arial,sans-serif" fill="#1d2a38">${LBL[s]||s}</text>`;});
  // start: little engine
  const [sx,sy]=N.start; g+=`<g transform="translate(${sx-9} ${sy-8})"><rect x="0" y="4" width="14" height="8" rx="1.5" fill="#c8323a"/><rect x="9" y="0" width="6" height="7" fill="#7a1f24"/><rect x="2" y="1" width="3" height="4" fill="#333"/><circle cx="3.5" cy="13" r="2.4" fill="#222"/><circle cx="10.5" cy="13" r="2.4" fill="#222"/></g><text x="${sx-1}" y="${sy-11}" text-anchor="middle" font-size="6.5" font-weight="700" font-family="Inter,Arial,sans-serif" fill="#c8323a">START</text>`;
  // north pole
  const [px,py]=N.NP; g+=`<rect x="${px-1.6}" y="${py-16}" width="3.2" height="16" fill="#fff" stroke="#c8323a" stroke-width=".8"/>${[0,1,2,3].map(i=>`<rect x="${px-1.6}" y="${py-15+i*4}" width="3.2" height="1.8" fill="#c8323a"/>`).join('')}<path d="M${px} ${py-24} l2 4.5 5 .5 -3.8 3.2 1.2 4.8 -4.4 -2.6 -4.4 2.6 1.2 -4.8 -3.8 -3.2 5 -.5z" fill="#ffc928" stroke="#b8862b" stroke-width=".6"/><text x="${px-12}" y="${py+9}" text-anchor="middle" font-size="6.5" font-weight="700" font-family="Inter,Arial,sans-serif" fill="#c8323a">NORTH POLE</text>`;
  return g;
}
const MAP=routeMap();
const mapPiece=i=>{const [x,y]=[[0,0],[120,0],[0,90],[120,90]][i];return `<svg viewBox="${x} ${y} 120 90" role="img" aria-label="Route map piece ${i+1}">${MAP}</svg>`};

/* ================= GAUGES (lock: gauges) =================
   Each dial sweeps 270 degrees, from lower-left (left end) to lower-right (right end), no numbers.
   STEAM  5 steps, needle on step 4. Card: left end 0, +2 per mark      -> 8   (naive 4)
   COAL   9 steps, needle on step 5. Card: left end 9 sacks, -1 per mark -> 4  (naive 5)
   WATER 10 steps, short gold on 3, long red (stuck) on 6. Card: read gold -> 3 (naive 6)
   SAND   7 steps, needle on step 5. Card: left end is 1, +1 per mark     -> 6  (naive 5)
   Code, dials left to right: 8436. */
const DIALS=[{name:'STEAM',steps:5,n:[4]},{name:'COAL',steps:9,n:[5]},{name:'WATER',steps:10,n:[3],stuck:6},{name:'SAND',steps:7,n:[5]}];
function dialSVG(d,cx){
  const cy=44,R=30; let g=`<circle cx="${cx}" cy="${cy}" r="${R+6}" fill="#b8862b"/><circle cx="${cx}" cy="${cy}" r="${R+3}" fill="#6b4a1c"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="#fbf6ea"/>`;
  const pt=(deg,r)=>{const a=(deg-90)*Math.PI/180;return [(cx+r*Math.cos(a)).toFixed(1),(cy+r*Math.sin(a)).toFixed(1)]};
  for(let i=0;i<=d.steps;i++){const deg=-135+270*i/d.steps,big=i===0||i===d.steps,[x1,y1]=pt(deg,R-2),[x2,y2]=pt(deg,R-(big?11:8));
    g+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${big?'#c8323a':'#2a2118'}" stroke-width="${big?3:2.2}" stroke-linecap="round"/>`;}
  const [lx,ly]=pt(-135,R+12),[rx,ry]=pt(135,R+12);
  g+=`<text x="${lx}" y="${+ly+3}" text-anchor="middle" font-size="8" font-family="Inter,Arial,sans-serif" fill="#d6cdbf">L</text><text x="${rx}" y="${+ry+3}" text-anchor="middle" font-size="8" font-family="Inter,Arial,sans-serif" fill="#d6cdbf">R</text>`;
  if(d.stuck!=null){const [x,y]=pt(-135+270*d.stuck/d.steps,R-3);g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#d62b2b" stroke-width="2.4" stroke-linecap="round"/>`;}
  d.n.forEach(s=>{const [x,y]=pt(-135+270*s/d.steps,d.stuck!=null?R-14:R-5);g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${d.stuck!=null?'#e0a21c':'#1a1a1a'}" stroke-width="${d.stuck!=null?4:2.6}" stroke-linecap="round"/>`;});
  g+=`<circle cx="${cx}" cy="${cy}" r="4" fill="#3a2a1c"/><text x="${cx}" y="${cy+R+20}" text-anchor="middle" font-size="11" font-weight="700" letter-spacing="1" font-family="Inter,Arial,sans-serif" fill="#ffd2a1">${d.name}</text>`;
  return g;
}
const gaugesSVG=()=>`<svg viewBox="0 0 336 100" role="img" aria-label="Four dials with no numbers: steam, coal, water, sand">${DIALS.map((d,i)=>dialSVG(d,42+i*84)).join('')}</svg>`;

/* ================= COUPLINGS (lock: couplings) =================
   Carriages face one way: front hook (left) and back hook (right). Engine's back hook = star, guard's van front hook = heart.
   P star>moon, A moon>bell, R bell>tree, C tree>moon, E moon>flake, L flake>heart.
   Brute force over all 720 orders: the only full chain is PARCEL. Trap: two carriages (A and E) have moon fronts;
   taking E straight after P reaches the van with A, R, C left over. */
const SH={
  star:'<path d="M0 -8 L2.4 -2.6 8 -2.4 3.6 1.3 5 7 0 3.8 -5 7 -3.6 1.3 -8 -2.4 -2.4 -2.6Z" fill="#ffc928" stroke="#8a6414" stroke-width="1"/>',
  moon:'<path d="M2 -8 A8 8 0 1 0 2 8 A6 6 0 1 1 2 -8Z" fill="#9fc7ff" stroke="#2c4f8a" stroke-width="1"/>',
  bell:'<path d="M0 -8 C5 -8 6 -3 6 1 C6 4 8 5 8 6 H-8 C-8 5 -6 4 -6 1 C-6 -3 -5 -8 0 -8Z" fill="#ffb03a" stroke="#8a5a14" stroke-width="1"/><circle cy="7.5" r="1.8" fill="#8a5a14"/>',
  tree:'<path d="M0 -9 L6 -1 H3 L8 6 H-8 L-3 -1 H-6Z" fill="#2fbf4a" stroke="#1a6b2a" stroke-width="1"/><rect x="-1.4" y="6" width="2.8" height="3" fill="#6b4a2a"/>',
  flake:'<g stroke="#2a8ac8" stroke-width="2" stroke-linecap="round"><path d="M0 -8V8M-7 -4L7 4M-7 4L7 -4"/></g><g stroke="#2a8ac8" stroke-width="1.3" stroke-linecap="round"><path d="M-2.5 -6L0 -4 2.5 -6M-2.5 6L0 4 2.5 6"/></g>',
  heart:'<path d="M0 7 C-9 0 -8 -7 -3.5 -7 C-1.5 -7 0 -5.5 0 -4 C0 -5.5 1.5 -7 3.5 -7 C8 -7 9 0 0 7Z" fill="#e8333a" stroke="#7a1418" stroke-width="1"/>'
};
const shp=(s,x,y,k=1)=>`<g transform="translate(${x} ${y}) scale(${k})">${SH[s]}</g>`;
const CARS=[['C','tree','moon','#2f7bff'],['E','moon','flake','#8e44c8'],['A','moon','bell','#2f9e48'],['L','flake','heart','#e07a1f'],['P','star','moon','#c8323a'],['R','bell','tree','#1f9aa8']];
const carCard=([L,f,b,col])=>`<svg viewBox="0 0 150 66" role="img" aria-label="Carriage ${L}: front hook ${f}, back hook ${b}" style="display:block;width:100%;height:auto"><rect x="26" y="8" width="98" height="40" rx="5" fill="${col}"/><rect x="26" y="8" width="98" height="7" rx="3" fill="rgba(0,0,0,.25)"/><rect x="34" y="20" width="18" height="13" rx="2" fill="#fff8e0"/><rect x="98" y="20" width="18" height="13" rx="2" fill="#fff8e0"/><text x="75" y="40" text-anchor="middle" font-size="24" font-family="'Archivo Black',Impact,sans-serif" fill="#fff">${L}</text><circle cx="44" cy="52" r="6" fill="#2a2118"/><circle cx="106" cy="52" r="6" fill="#2a2118"/><rect x="16" y="30" width="10" height="3" fill="#555"/><rect x="124" y="30" width="10" height="3" fill="#555"/><circle cx="11" cy="31" r="10" fill="#fff" stroke="#999"/>${shp(f,11,31)}<circle cx="139" cy="31" r="10" fill="#fff" stroke="#999"/>${shp(b,139,31)}<text x="11" y="62" text-anchor="middle" font-size="8" font-family="Inter,Arial,sans-serif" fill="#6b5a44">front</text><text x="139" y="62" text-anchor="middle" font-size="8" font-family="Inter,Arial,sans-serif" fill="#6b5a44">back</text></svg>`;
const couplingSVG=`<svg viewBox="0 0 336 92" role="img" aria-label="Engine at the front with a star hook, six empty gaps, guard's van at the back with a heart hook">
<g transform="translate(4 14)"><rect x="0" y="22" width="62" height="30" rx="4" fill="#c8323a"/><rect x="34" y="4" width="28" height="30" rx="3" fill="#7a1f24"/><rect x="40" y="10" width="16" height="12" rx="2" fill="#ffe08a"/><rect x="8" y="8" width="10" height="16" fill="#333"/><rect x="5" y="4" width="16" height="6" rx="2" fill="#444"/><path d="M0 52 L-4 62 H10Z" fill="#555"/><circle cx="16" cy="56" r="8" fill="#222" stroke="#888" stroke-width="2"/><circle cx="44" cy="56" r="8" fill="#222" stroke="#888" stroke-width="2"/><rect x="62" y="38" width="8" height="3" fill="#555"/><circle cx="80" cy="39" r="10" fill="#fff" stroke="#999"/>${shp('star',80,39)}</g>
<g fill="none" stroke="#6b5a44" stroke-width="2" stroke-dasharray="5 5"><rect x="102" y="30" width="148" height="34" rx="6"/></g><text x="176" y="51" text-anchor="middle" font-size="11" font-family="Inter,Arial,sans-serif" fill="#d6cdbf">6 carriages go here</text>
<g transform="translate(262 14)"><circle cx="0" cy="39" r="10" fill="#fff" stroke="#999"/>${shp('heart',0,39)}<rect x="10" y="38" width="8" height="3" fill="#555"/><rect x="18" y="18" width="52" height="34" rx="4" fill="#5a3a24"/><path d="M14 18 H74 L68 10 H20Z" fill="#3a2414"/><rect x="28" y="26" width="12" height="11" rx="2" fill="#ffe08a"/><circle cx="58" cy="32" r="4" fill="#e8333a"/><circle cx="32" cy="56" r="7" fill="#222" stroke="#888" stroke-width="2"/><circle cx="58" cy="56" r="7" fill="#222" stroke="#888" stroke-width="2"/></g>
<text x="40" y="12" text-anchor="middle" font-size="10" font-weight="700" font-family="Inter,Arial,sans-serif" fill="#ffd2a1">ENGINE (front)</text><text x="300" y="12" text-anchor="middle" font-size="10" font-weight="700" font-family="Inter,Arial,sans-serif" fill="#ffd2a1">GUARD'S VAN</text></svg>`;

/* ================= LOST TICKETS (lock: tickets, mini-game) =================
   Hidden-object scene 140x100. Eight tickets, each printed with a letter. Six passenger cards say where
   their own ticket fell and which seat they're in. Seat order: S I G N A L. Decoys T (lantern hook), O (right shelf).
   Card mapping:  1 top-left shelf under purple present = S | 2 by the elf's boots = I | 3 behind the penguin = G
                  4 sticking out of the mail sack = N | 5 corner of the window = A | 6 under the big present pile = L  => SIGNAL */
const TICKETS=[
  {x:31,y:29.5,L:'S',rot:-10},{x:81,y:87.5,L:'I',rot:8},{x:25.5,y:77,L:'G',rot:16},{x:53,y:65.8,L:'N',rot:-18},
  {x:83.6,y:9.4,L:'A',rot:14},{x:117,y:89.5,L:'L',rot:-6},{x:42.5,y:45,L:'T',rot:-6},{x:122,y:31,L:'O',rot:9}];
const ticket=t=>`<g transform="translate(${t.x} ${t.y}) rotate(${t.rot})"><rect x="-4.4" y="-2.9" width="8.8" height="5.8" rx=".7" fill="#f3e6c4" stroke="#c8323a" stroke-width=".6"/><line x1="-2.2" y1="-2.9" x2="-2.2" y2="2.9" stroke="#c8323a" stroke-width=".35" stroke-dasharray=".7 .5"/><text x="1" y="1.7" text-anchor="middle" font-size="4.6" font-weight="700" font-family="Inter,Arial,sans-serif" fill="#7a1418">${t.L}</text></g>`;
const env=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-4.4" y="-2.9" width="8.8" height="5.8" rx=".5" fill="#f6f1e4" stroke="#b8ab90" stroke-width=".4"/><path d="M-4.4 -2.9 L0 .6 L4.4 -2.9" fill="none" stroke="#b8ab90" stroke-width=".45"/></g>`;
const T=Object.fromEntries(TICKETS.map(t=>[t.L,t]));
function vanScene(){
  let g=`<svg viewBox="0 0 140 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label="The luggage van, full of presents">`;
  g+=`<rect width="140" height="100" fill="#6e4426"/>${[...Array(14)].map((_,i)=>`<rect x="${i*10}" y="0" width="9.4" height="80" fill="${i%2?'#7a4c2c':'#734628'}"/>`).join('')}`;
  g+=`<rect x="0" y="78" width="140" height="22" fill="#4a2e1a"/>${[0,1,2].map(i=>`<rect x="0" y="${82+i*6}" width="140" height=".6" fill="#3a2212"/>`).join('')}`;
  // window (ticket A tucked into its corner, drawn under the frame)
  g+=`<rect x="56" y="6" width="30" height="20" fill="#16294a"/><circle cx="64" cy="12" r=".9" fill="#fff"/><circle cx="72" cy="18" r=".7" fill="#fff"/><circle cx="80" cy="10" r=".8" fill="#fff"/><circle cx="60" cy="21" r=".6" fill="#fff"/><path d="M56 26 Q64 21 72 24 T86 22 V26Z" fill="#e9f1ff"/>`;
  g+=ticket(T.A)+`<rect x="54" y="4" width="34" height="24" fill="none" stroke="#3a2414" stroke-width="3"/><line x1="71" y1="6" x2="71" y2="26" stroke="#3a2414" stroke-width="1.6"/><rect x="82" y="7" width="7" height="9" fill="#3a2414" opacity=".0"/>`;
  // shelves
  g+=`<rect x="2" y="32" width="46" height="2.4" fill="#3a2414"/><rect x="94" y="34" width="44" height="2.4" fill="#3a2414"/>${[4,46,96,136].map(x=>`<rect x="${x-1}" y="${x<60?32:34}" width="1.4" height="8" fill="#3a2414"/>`).join('')}`;
  g+=ticket(T.S)+`<image href="${A}present-02.svg" x="14" y="17" width="16" height="15"/><rect x="35" y="21" width="12" height="11" rx="1.5" fill="#2c5a8a"/><rect x="39" y="19" width="4" height="2.4" rx="1" fill="#1a3a5a"/><rect x="36" y="24" width="3.6" height="5" rx=".5" fill="#c9a66b"/><image href="${A}present-03.svg" x="4" y="22" width="10" height="10"/>`;
  g+=`<rect x="97" y="23" width="18" height="11" rx="1.5" fill="#8a2a24"/><rect x="104" y="21" width="5" height="2.4" rx="1" fill="#5a1a14"/><rect x="99" y="27" width="14" height=".8" fill="#d6a74a"/>`+ticket(T.O)+`<image href="${A}present-04.svg" x="127" y="22" width="11" height="12"/>`;
  g+=`<rect x="98" y="56" width="20" height="16" fill="#a8743c" stroke="#6b4a24" stroke-width=".8"/><path d="M98 61.3H118M98 66.6H118M98 56L118 72" stroke="#6b4a24" stroke-width=".7"/>`+env(108,53.5,8)+`<image href="${A}present-01.svg" x="100" y="46" width="9" height="10"/>`;
  g+=`<circle cx="131" cy="42" r="1.2" fill="#999"/><path d="M129 42 C126 50 128 58 126 64 L130 64 C131 56 133 50 133 42Z" fill="#c8323a"/><path d="M126 64 h4 M126.5 62 h3" stroke="#fff" stroke-width=".8"/>`;
  g+=`<rect x="12" y="40" width="14" height="10" fill="#f1e7cc" transform="rotate(-4 19 45)"/><path d="M14 43h10M14 45.5h8M14 48h9" stroke="#9a8a6a" stroke-width=".6" transform="rotate(-4 19 45)"/><circle cx="19" cy="40.6" r=".9" fill="#c8323a"/>`;
  // lantern hook (decoy T hangs from it)
  g+=`<path d="M44 34 V38" stroke="#222" stroke-width=".8"/>`+ticket(T.T)+`<g transform="translate(36 37)"><rect x="-2.6" y="0" width="5.2" height="1.6" fill="#222"/><rect x="-3" y="1.6" width="6" height="8" rx="1" fill="#ffd27a" stroke="#222" stroke-width=".8"/><rect x="-3.4" y="9.6" width="6.8" height="1.6" fill="#222"/><circle cy="5.6" r="5" fill="#ffd27a" opacity=".25"/></g><path d="M36 34 V37" stroke="#222" stroke-width=".8"/>`;
  // floor: penguin (G behind it), mail sack (N sticking out), elf (I by boots), present pile (L under it)
  g+=ticket(T.G)+`<image href="${A}penguin-presents.svg" x="2" y="54" width="28" height="30"/>`;
  g+=env(48.5,71,12)+env(57.5,70.5,-10)+ticket(T.N)+`<path d="M46 92 C40 92 40 76 47 72 L52 68 L58 72 C64 76 64 92 58 92Z" fill="#c9a66b" stroke="#8a6a3a" stroke-width=".8"/><path d="M48 71 L56 71" stroke="#8a6a3a" stroke-width="1.4"/><rect x="47" y="80" width="10" height="6" fill="#fff" opacity=".6"/><path d="M47 80 L52 83.5 L57 80" fill="none" stroke="#c8323a" stroke-width=".6"/>`;
  g+=`<image href="${A}elf2-holding.png" x="64" y="47" width="20" height="40"/>`+ticket(T.I);
  g+=ticket(T.L)+`<image href="${A}presents-stack.svg" x="98" y="64" width="40" height="24"/>`;
  g+=`<image href="${A}present-01.svg" x="88" y="80" width="10" height="10"/>`+env(64,93,-14)+env(96,94,10)+env(36,90,20)+env(7,31,-6);
  return g+`</svg>`;
}

EXPERIENCES[ID]={
  id:ID, title:"The Elf Express", titleHTML:"THE ELF<br><span>EXPRESS</span>", season:"Christmas", collection:'christmas',
  tag:"A Christmas train escape room",
  blurb:"The overnight present train to the North Pole has stopped dead in a snowy mountain pass, and the driver's cab is locked tight. Crack the cab's six locks and get her moving before the presents freeze.",
  menuBlurb:"The present train is stuck in a snowy pass. Get it moving before the presents freeze.",
  menuLine:"Get the train moving",
  theme:{accent:'#ff9a4d',accent2:'#ffd2a1',bg:'#090c14',introBg:'#13253d',door:'#8b1e24',doorFrame:'#2b2f38',boxColor:'linear-gradient(#c8323a,#7a1f24)'},
  sceneCSS:`
${P}{background:#17241f}
${P} .wall{position:absolute;inset:0 0 22% 0;background:linear-gradient(90deg,rgba(0,0,0,.35),transparent 18%,transparent 82%,rgba(0,0,0,.35)),repeating-linear-gradient(0deg,#22392f 0 38px,#1c3128 38px 40px)}
${P} .rivets{position:absolute;left:0;right:0;height:5px;background:radial-gradient(circle,#8a9a90 1.4px,transparent 2px) 0 0/16px 5px repeat-x;opacity:.7}
${P} .ceiling{position:absolute;left:0;right:0;top:0;height:4.5%;background:linear-gradient(#0b1310,#15211c);box-shadow:0 3px 8px rgba(0,0,0,.6)}
${P} .floor{position:absolute;left:0;right:0;bottom:0;height:22%;background:repeating-linear-gradient(90deg,#3e2a1a 0 30px,#352416 30px 32px);box-shadow:inset 0 10px 18px rgba(0,0,0,.6)}
/* front window */
${P} .win{position:absolute;left:21%;top:5.5%;width:58%;height:29%;border-radius:14px 14px 6px 6px;overflow:hidden;background:linear-gradient(#0a1530,#1d3a66 70%,#3a5a86);box-shadow:0 0 0 6px #4a5550,0 0 0 9px #2a3330,inset 0 0 20px rgba(0,0,0,.6)}
${P} .win .mtn{position:absolute;left:-10%;width:120%;bottom:6%;filter:brightness(.42) saturate(.75) hue-rotate(18deg)}
${P} .win .trees{position:absolute;bottom:0;filter:brightness(.6) saturate(.8)}
${P} .win .drift{position:absolute;left:-5%;right:-5%;bottom:-6%;height:22%;border-radius:50% 50% 0 0;background:linear-gradient(#dfe8f5,#b9c8de);box-shadow:0 -4px 10px rgba(255,255,255,.2)}
${P} .win .moon{position:absolute;right:28%;top:9%;z-index:1;width:11%;aspect-ratio:1;border-radius:50%;background:#f6f0d8;box-shadow:0 0 16px #f6f0d8aa}
${P} .win .bar{position:absolute;top:0;bottom:0;left:50%;width:5px;margin-left:-2.5px;background:#4a5550;z-index:3}
${P} .win .glare{position:absolute;inset:0;background:linear-gradient(115deg,transparent 30%,rgba(255,255,255,.08) 38%,transparent 46%);z-index:3}
${P} .fl{position:absolute;inset:0;z-index:2;animation:${ID}-blow linear infinite}
${P} .fl::before{content:"";position:absolute;left:100%;top:var(--y);width:var(--s,4px);height:var(--s,4px);border-radius:50%;background:#fff;opacity:.9}
${P} .steam{position:absolute;bottom:26%;width:34%;filter:brightness(0) invert(1);opacity:0;z-index:1;animation:${ID}-steam 5s ease-out infinite}
/* lantern */
${P} .lantern{position:absolute;left:20%;top:0;width:8%;height:17%;transform-origin:50% 0;animation:${ID}-swing 3.2s ease-in-out infinite;z-index:3}
${P} .lantern .ch{position:absolute;left:50%;top:0;width:2px;height:46%;margin-left:-1px;background:repeating-linear-gradient(#999 0 3px,#555 3px 5px)}
${P} .lantern .cap{position:absolute;left:18%;right:18%;top:44%;height:9%;background:#2a2a2a;border-radius:4px 4px 0 0}
${P} .lantern .glass{position:absolute;left:14%;right:14%;top:52%;height:36%;background:radial-gradient(circle at 50% 60%,#fff6c8,#ffb23d 55%,#b8641a);border:2px solid #2a2a2a;border-radius:3px;animation:flicker 2.5s infinite}
${P} .lantern .base{position:absolute;left:10%;right:10%;top:87%;height:8%;background:#2a2a2a;border-radius:2px}
${P} .lantern .halo{position:absolute;left:-120%;right:-120%;top:30%;height:90%;background:radial-gradient(circle,rgba(255,190,90,.28),transparent 65%);pointer-events:none}
/* timetable board */
${P} #o-timetable{left:2.5%;top:7%;width:17%;height:26%;background:linear-gradient(#1b1d22,#0e0f12);border:3px solid #6b4a24;border-radius:4px;box-shadow:0 6px 12px rgba(0,0,0,.6)}
${P} #o-timetable .hd{position:absolute;left:8%;right:8%;top:5%;height:9%;background:#c8323a;border-radius:2px}
${P} #o-timetable .row{position:absolute;left:8%;right:8%;height:7%;display:flex;gap:6%}
${P} #o-timetable .row i{flex:3;background:#2a2c33;border-radius:1px;position:relative;overflow:hidden}
${P} #o-timetable .row i+i{flex:2;background:#ffb03a;opacity:.85}
${P} #o-timetable .row.q i+i{background:#2a2c33;animation:blink 1.1s infinite}
${P} #o-timetable .row.q i+i::after{content:"";position:absolute;left:20%;right:20%;top:40%;height:20%;background:#ffb03a}
${P} #o-timetable.solved .row.q i+i{background:#7dff8a;animation:none}
/* satchel */
${P} #o-tickets{right:2.5%;top:8%;width:16.5%;height:22%}
${P} #o-tickets .hook{position:absolute;left:50%;top:0;width:12%;height:10%;margin-left:-6%;border:3px solid #9a9aa2;border-top:0;border-radius:0 0 8px 8px}
${P} #o-tickets .strap{position:absolute;left:22%;right:22%;top:4%;height:40%;border:4px solid #5a3418;border-bottom:0;border-radius:50% 50% 0 0}
${P} #o-tickets .bag{position:absolute;left:4%;right:4%;top:38%;bottom:0;background:linear-gradient(#8a5a32,#6b4024);border-radius:6px 6px 14px 14px;box-shadow:0 6px 10px rgba(0,0,0,.5)}
${P} #o-tickets .tk{position:absolute;top:28%;width:30%;height:20%;background:#fff6dc;border:2px solid #c8323a;border-radius:2px}
${P} #o-tickets .flap{position:absolute;left:2%;right:2%;top:36%;height:30%;background:linear-gradient(#7a4c2c,#5a3418);border-radius:6px 6px 40% 40%;transform-origin:50% 0;transition:transform .5s;z-index:1;box-shadow:0 3px 4px rgba(0,0,0,.4)}
${P} #o-tickets .flap::after{content:"";position:absolute;left:44%;right:44%;bottom:12%;height:22%;background:#d6a74a;border-radius:2px}
${P} #o-tickets.open .flap{transform:rotateX(70deg)}
${P} #o-tickets.solved .tk{box-shadow:0 0 8px #7dff8a}
/* gauges panel */
${P} #o-gauges{left:21%;top:38%;width:58%;height:14.5%;background:linear-gradient(#d9a84a,#a8782a 60%,#8a5e1e);border-radius:10px;box-shadow:0 6px 14px rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.35);display:flex;align-items:center;justify-content:space-around;padding:0 3%}
${P} #o-gauges .dl{position:relative;width:21%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#fbf6ea 58%,transparent 59%),repeating-conic-gradient(from -135deg,#2a2118 0 3deg,transparent 3deg 27deg);box-shadow:0 0 0 3px #6b4a1c,0 0 0 5px #e0b860,inset 0 0 0 2px #fbf6ea;background-color:#fbf6ea}
${P} #o-gauges .dl::before{content:"";position:absolute;inset:16%;border-radius:50%;background:#fbf6ea}
${P} #o-gauges .nd{position:absolute;left:50%;top:14%;width:3px;height:36%;margin-left:-1.5px;background:#1a1a1a;border-radius:2px;transform-origin:50% 100%;animation:${ID}-needle 1.6s ease-in-out infinite alternate}
${P} #o-gauges .nd.r{background:#d62b2b}
${P} #o-gauges .dl::after{content:"";position:absolute;left:50%;top:50%;width:16%;height:16%;margin:-8% 0 0 -8%;border-radius:50%;background:#3a2a1c}
${P} #o-gauges .pipe{position:absolute;top:-30%;width:5%;height:30%;background:linear-gradient(90deg,#8a5e1e,#e0b860,#8a5e1e)}
${P} #o-gauges.solved .dl{box-shadow:0 0 0 3px #6b4a1c,0 0 0 5px #7dff8a,0 0 10px #7dff8a}
${P} #o-gauges.solved .nd{animation:none}
/* firebox */
${P} .firebox{position:absolute;left:33%;top:55.5%;width:34%;height:16%;background:linear-gradient(#3a3f44,#24282c);border-radius:10px 10px 4px 4px;box-shadow:0 6px 12px rgba(0,0,0,.6),inset 0 2px 0 rgba(255,255,255,.12)}
${P} .firebox .mouth{position:absolute;left:18%;right:18%;top:18%;bottom:14%;border-radius:40% 40% 6px 6px/50% 50% 6px 6px;background:radial-gradient(ellipse at 50% 100%,#fff0a0,#ff8a1f 35%,#b8300c 65%,#2a0a04);animation:flicker 1.3s infinite;overflow:hidden}
${P} .firebox .coal{position:absolute;left:0;right:0;bottom:0;height:34%;background:radial-gradient(circle at 20% 60%,#1a1a1a 18%,transparent 20%),radial-gradient(circle at 50% 50%,#222 20%,transparent 22%),radial-gradient(circle at 80% 60%,#1a1a1a 18%,transparent 20%)}
${P} .firebox .door{position:absolute;right:-6%;top:12%;width:26%;height:76%;background:linear-gradient(90deg,#555b60,#3a3f44);border-radius:6px;transform:perspective(200px) rotateY(-40deg);transform-origin:100% 50%;box-shadow:-3px 3px 6px rgba(0,0,0,.5)}
${P} .glowf{position:absolute;left:20%;right:20%;top:52%;height:34%;background:radial-gradient(ellipse,rgba(255,140,40,.32),transparent 65%);pointer-events:none;animation:flicker 1.7s infinite;z-index:3}
/* rear door to the carriages (wave 2) */
${P} #o-coupling{left:2%;top:38%;width:17%;height:36%;background:#0e1512;border:4px solid #3a4440;border-radius:6px;overflow:hidden}
${P} #o-coupling .out{position:absolute;inset:0;background:linear-gradient(#1d3a66,#6a86aa 60%,#e6eef8 60%)}
${P} #o-coupling .car{position:absolute;left:18%;right:-30%;top:34%;height:30%;background:#2f9e48;border-radius:4px;box-shadow:inset 0 5px 0 rgba(0,0,0,.25)}
${P} #o-coupling .car::after{content:"";position:absolute;left:12%;top:28%;width:28%;height:34%;background:#ffe08a;border-radius:2px;box-shadow:0 0 8px #ffe08a}
${P} #o-coupling .hk{position:absolute;left:4%;top:52%;width:20%;height:5%;background:#666}
${P} #o-coupling .door{position:absolute;inset:0;background:linear-gradient(90deg,#2c3a35,#3c4c46 50%,#2a3632);transition:transform 1.4s cubic-bezier(.5,.1,.3,1);z-index:1}
${P} #o-coupling .door::before{content:"";position:absolute;left:22%;right:22%;top:10%;height:24%;border-radius:50%;background:radial-gradient(circle at 40% 40%,#9ab8d8,#3a5a86);box-shadow:0 0 0 3px #6c7a74}
${P} #o-coupling .door::after{content:"";position:absolute;right:10%;top:54%;width:14%;height:6%;border-radius:3px;background:#c9c9d2}
${P} #o-coupling .chain{position:absolute;left:-10%;right:-10%;top:47%;height:7px;background:repeating-linear-gradient(90deg,#c0c0c8 0 7px,#6c6c74 7px 9px);transform:rotate(-14deg);z-index:2;transition:transform 1s,opacity 1s}
${P} #o-coupling .chain.b{transform:rotate(14deg)}
${P} #o-coupling .pad{position:absolute;left:50%;top:46%;width:30%;height:13%;margin-left:-15%;background:linear-gradient(#ffd34d,#b8862b);border-radius:4px;z-index:3;transition:transform 1s,opacity 1s}
${P} #o-coupling .pad::before{content:"";position:absolute;left:22%;right:22%;top:-48%;height:55%;border:3px solid #9a9aa2;border-bottom:0;border-radius:8px 8px 0 0}
${P} #o-coupling.revealed .door{transform:translateX(-88%)}
${P} #o-coupling.revealed .chain,${P} #o-coupling.revealed .pad{transform:translateY(300%) rotate(30deg);opacity:0}
${P} #o-coupling.solved .car{background:#c8323a}
/* frosted side window with route map (wave 2) */
${P} #o-route{right:2%;top:36%;width:19%;height:20%;border-radius:12px;background:#0e1512;box-shadow:0 0 0 4px #4a5550,0 0 0 6px #2a3330;overflow:hidden}
${P} #o-route .map{position:absolute;inset:6%;background:#eef4fb;border-radius:4px;transform:rotate(-3deg)}
${P} #o-route .map svg{width:100%;height:100%;display:block}
${P} #o-route .frost{position:absolute;inset:0;background:radial-gradient(circle at 30% 30%,#ffffff,#d8e8f6 40%,#a8c4de 80%);transition:opacity 2s,transform 2s;z-index:1}
${P} #o-route .frost::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(60deg,transparent 0 6px,rgba(255,255,255,.7) 6px 7px),repeating-linear-gradient(-60deg,transparent 0 8px,rgba(255,255,255,.6) 8px 9px)}
${P} #o-route.revealed .frost{opacity:0;transform:scale(1.2)}
${P} #o-route.solved{box-shadow:0 0 0 4px #4a5550,0 0 0 6px #7dff8a,0 0 12px #7dff8a}
/* departure lever (final) */
${P} #o-lever{left:47%;top:73%;width:34%;height:25%}
${P} #o-lever .post{position:absolute;left:18%;right:18%;bottom:0;height:42%;background:linear-gradient(90deg,#3a3f44,#5a6268 50%,#33383c);border-radius:8px 8px 2px 2px;box-shadow:0 6px 12px rgba(0,0,0,.6)}
${P} #o-lever .quad{position:absolute;left:8%;right:8%;bottom:34%;height:44%;border-radius:100% 100% 0 0/100% 100% 0 0;background:linear-gradient(#c9a24a,#8a6420);box-shadow:inset 0 0 0 3px #5a3e10}
${P} #o-lever .quad::before{content:"";position:absolute;left:12%;right:12%;top:20%;bottom:0;border-radius:100% 100% 0 0/100% 100% 0 0;background:#24282c}
${P} #o-lever .arm{position:absolute;left:50%;bottom:30%;width:6%;height:70%;margin-left:-3%;background:linear-gradient(90deg,#9a9aa2,#e6e6ee,#8a8a92);border-radius:4px;transform-origin:50% 100%;transform:rotate(-34deg);transition:transform .8s cubic-bezier(.3,1.5,.5,1);z-index:1}
${P} #o-lever .arm::before{content:"";position:absolute;left:-90%;right:-90%;top:-8%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 35%,#ff7a6a,#c8323a 60%,#7a1418)}
${P} #o-lever.solved .arm{transform:rotate(34deg)}
${P} #o-lever .lights{position:absolute;left:22%;right:22%;bottom:12%;display:flex;justify-content:space-between;z-index:2}
${P} #o-lever .lights b{width:12%;aspect-ratio:1;border-radius:50%;background:#4a1418;box-shadow:inset 0 0 0 1px #000}
${P} #o-lever .lights b.on{background:#7dff8a;box-shadow:0 0 7px #3dff5a}
/* coal heap, elves, presents */
${P} .coalheap{position:absolute;left:0;bottom:0;width:30%;height:13%;border-radius:60% 70% 0 0;background:radial-gradient(circle at 20% 40%,#2c2c2c 10%,transparent 12%),radial-gradient(circle at 50% 30%,#333 9%,transparent 11%),radial-gradient(circle at 75% 55%,#2a2a2a 10%,transparent 12%),radial-gradient(circle at 35% 70%,#383838 9%,transparent 11%),linear-gradient(#1c1c1c,#0e0e0e)}
${P} .shovel{position:absolute;left:21%;bottom:5%;width:2%;height:17%;background:#6b4a2a;transform:rotate(22deg);transform-origin:50% 100%;border-radius:2px}
${P} .shovel::after{content:"";position:absolute;left:-180%;right:-180%;bottom:-18%;height:26%;background:#555b60;border-radius:2px 2px 8px 8px}
${P} .elf{position:absolute;z-index:2;animation:bob 2.8s ease-in-out infinite}
${P} .gift{position:absolute;z-index:1}
@keyframes ${ID}-blow{from{transform:translate(0,0)}to{transform:translate(-118%,42%)}}
@keyframes ${ID}-steam{0%{opacity:0;transform:translate(0,30%) scale(.5)}20%{opacity:.85}100%{opacity:0;transform:translate(-60%,-90%) scale(1.5)}}
@keyframes ${ID}-swing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
@keyframes ${ID}-needle{from{transform:rotate(calc(var(--a) - 6deg))}to{transform:rotate(calc(var(--a) + 5deg))}}
`,
  sceneHTML:`
<div class="wall"></div><div class="ceiling"></div><div class="rivets" style="top:4.6%"></div><div class="rivets" style="top:36%"></div><div class="floor"></div>
<div class="win"><div class="moon"></div><img class="mtn" src="${A}mountain.svg" alt=""><img class="steam" src="${A}cloud.min.svg" alt="" style="left:40%"><img class="steam" src="${A}cloud.min.svg" alt="" style="left:48%;animation-delay:-1.7s"><img class="steam" src="${A}cloud.min.svg" alt="" style="left:36%;animation-delay:-3.4s"><img class="trees" src="${A}trees-blue.svg" alt="" style="left:-4%;height:52%"><img class="trees" src="${A}trees-green.svg" alt="" style="right:-6%;height:62%"><div class="drift"></div>${[[8,0,1.6,4],[22,.5,1.9,3],[36,1.1,1.4,5],[50,.2,1.7,4],[64,.9,1.5,3],[78,1.4,1.8,4],[14,.7,1.3,3],[44,1.6,2.1,5],[58,.4,1.6,3],[72,1.2,1.9,4],[30,1.8,1.5,3],[86,.6,1.7,4]].map(([y,d,s,z])=>`<div class="fl" style="--y:${y}%;--s:${z}px;animation-duration:${s}s;animation-delay:-${d}s"></div>`).join('')}<div class="bar"></div><div class="glare"></div></div>
<div class="lantern"><div class="ch"></div><div class="halo"></div><div class="cap"></div><div class="glass"></div><div class="base"></div></div>
<button class="obj" id="o-timetable" aria-label="Timetable board"><div class="hd"></div>${[22,34,46,58,70].map((t,i)=>`<div class="row${i===0?' q':''}" style="top:${t}%"><i></i><i></i></div>`).join('')}<span class="spark"></span></button>
<button class="obj" id="o-tickets" aria-label="Conductor's ticket satchel"><div class="hook"></div><div class="strap"></div><div class="tk" style="left:16%;transform:rotate(-14deg)"></div><div class="tk" style="left:52%;transform:rotate(10deg)"></div><div class="bag"></div><div class="flap"></div><span class="spark"></span></button>
<button class="obj" id="o-gauges" aria-label="Brass gauge panel"><div class="pipe" style="left:12%"></div><div class="pipe" style="right:12%"></div>${[[81,'',0],[15,'',-.4],[-54,'',-.9],[58,'',-1.2]].map(([a,c,d],i)=>`<div class="dl"><div class="nd" style="--a:${a}deg;animation-delay:${d}s"></div>${i===2?'<div class="nd r" style="--a:27deg;animation:none;transform:rotate(27deg)"></div>':''}</div>`).join('')}<span class="spark"></span></button>
<div class="firebox"><div class="mouth"><div class="coal"></div></div><div class="door"></div></div><div class="glowf"></div>
<button class="obj" id="o-coupling" aria-label="Chained rear door to the carriages"><div class="out"></div><div class="car"></div><div class="hk"></div><div class="door"></div><div class="chain"></div><div class="chain b"></div><div class="pad"></div><span class="spark"></span></button>
<button class="obj" id="o-route" aria-label="Frosted side window"><div class="map"><svg viewBox="0 0 240 180" preserveAspectRatio="none">${MAP}</svg></div><div class="frost"></div><span class="spark"></span></button>
<div class="coalheap"></div><div class="shovel"></div>
<img class="gift" src="${A}present-04.svg" alt="" style="left:30%;top:86%;width:9%">
<img class="gift" src="${A}present-02.svg" alt="" style="left:34%;top:80.5%;width:7%;transform:rotate(-8deg)">
<img class="elf" src="${A}elf-1-front.svg" alt="" style="left:21%;top:66%;height:21%;animation-delay:-1s">
<button class="obj" id="o-lever" aria-label="Departure lever"><div class="quad"></div><div class="arm"></div><div class="post"></div><div class="lights"><b></b><b></b><b></b><b></b><b></b><b></b></div><span class="spark"></span></button>
<img class="elf" src="${A}elf5-holding.png" alt="" style="right:-3%;top:71%;height:24%">`,
  order:["timetable","gauges","tickets","route","couplings","lever"],
  revealOnWave2:[{sel:'#o-route',cls:'revealed'},{sel:'#o-coupling',cls:'revealed'}],
  wave2Toast:"The firebox is roaring now: the frost on the side window has melted, and the chain on the back door just fell off.",
  finalReadyToast:"Five brass letters in the lever. Pull it and let's go!",
  startToast:"Tap anything that sparkles. Three locks are ready, and the presents are getting chilly.",
  locks:{
    /* Timetable. Work backwards from 23:50. Legs: 35 + 10 (water stop) + 45 + 25x2 (snow doubles everything after the bridge) = 140 min = 2 h 20.
       23:50 - 2:20 = 21:30. Code 2130 (verified in node). */
    timetable:{wave:1,title:"The Timetable Board",obj:"o-timetable",answer:"2130",kind:"num",tile:"N",
      scene:"The board has the arrival time but the departure line is blank. Scratched underneath: <em>\"Door code = the LATEST time we can leave Frostbite Pass and still reach the North Pole on time. Four digits.\"</em>",
      extra:`<div style="background:#111317;border:3px solid #6b4a24;border-radius:8px;padding:10px 12px;font-family:ui-monospace,Menlo,monospace;color:#ffb03a;font-size:13px;line-height:1.9"><div style="background:#c8323a;color:#fff;text-align:center;font-weight:700;letter-spacing:2px;border-radius:3px;margin-bottom:6px">ELF EXPRESS · OVERNIGHT</div>${[['Frostbite Pass','DEP ??:??'],['Icicle Junction',''],['Aurora Bridge',''],['North Pole','ARR 23:50']].map(([a,b])=>`<div style="display:flex;justify-content:space-between;border-bottom:1px solid #2a2c33"><span>${a}</span><b style="color:${b.includes('?')?'#ff6a6a':'#ffb03a'}">${b}</b></div>`).join('')}</div>`,
      cardClass:"type",
      cards:["Frostbite Pass to Icicle Junction: <b>35 minutes</b>.","At Icicle Junction we stop for <b>10 minutes</b> to fill up with water.","Icicle Junction to Aurora Bridge: <b>45 minutes</b>.","Aurora Bridge to the North Pole: <b>25 minutes</b>, on a clear night.","Driver's note: it's snowing hard past the bridge. Everything after Aurora Bridge takes <b>twice as long</b> tonight."],
      hints:["Add up the whole journey first, then count backwards from 23:50.","35 + 10 + 45, and the last leg is doubled to 50. That's 140 minutes, or 2 hours 20 minutes.","23:50 take away 2 hours 20 minutes is 21:30. The code is 2130."]},
    /* Gauges. Readings: STEAM 4 marks x2 = 8, COAL 9 - 5 = 4, WATER short gold needle = 3, SAND 1 + 5 = 6. Code 8436.
       Naive reading without the cards would give 4 5 6 5, so every card changes its digit. */
    gauges:{wave:1,title:"The Gauge Panel",obj:"o-gauges",answer:"8436",kind:"num",tile:"I",
      scene:"Four brass dials, and somebody has rubbed all the numbers off. A tag on the panel: <em>\"Read every dial, left to right, one digit each. Each fireman knows how to read ONE dial.\"</em>",
      extra:gaugesSVG,
      cardClass:"dark",
      cards:["<b>STEAM</b>: the left end is 0. Every mark you move to the right adds <b>2</b>.","<b>COAL</b> counts sacks left. The left end means full: <b>9</b> sacks. Every mark to the right is one sack fewer.","<b>WATER</b> has two needles. The long red one is stuck, ignore it! Read the short gold one: left end 0, each mark adds 1.","<b>SAND</b> (for icy rails): the left end is <b>1</b>, not 0. Each mark adds 1."],
      hints:["Count the marks from the left end to each needle, then use the card for that dial. Don't count the left end itself as a step.","STEAM is 4 marks along, so 4 x 2 = 8. COAL is 5 marks along, so 9 - 5 = 4.","8, 4, 3, 6. The code is 8436."]},
    /* Tickets (mini-game). Find all 8 tickets; the 6 passenger cards say where each fell and their seat.
       Seat 1 shelf under purple present S, 2 elf's boots I, 3 behind penguin G, 4 mail sack N, 5 window corner A, 6 under present pile L.
       SIGNAL. Spare tickets T (lantern hook) and O (right shelf) belong to nobody. SIGNAL/ALIGNS share letters, so the seat order matters. */
    tickets:{wave:1,title:"The Lost Tickets",obj:"o-tickets",answer:"SIGNAL",kind:"word",tile:"A",openClass:"open",
      scene:"The conductor's satchel burst open in the luggage van and the tickets went everywhere. Find all eight. Then read the letters on the six passengers' tickets in seat order.",
      game:{type:'find',title:'Find the 8 lost tickets',aspect:'1.4',scene:vanScene,
        targets:TICKETS.map(t=>({x:+(t.x/1.4).toFixed(1),y:t.y,r:5,name:'ticket'})),
        reveal:'All 8 found! Only <b>6</b> belong to passengers. Check your cards.'},
      cardClass:"type",
      cards:["<b>Seat 1</b>, Mrs Frost: \"Mine slid under the purple present on the top shelf.\"","<b>Seat 2</b>, Pip the elf: \"I dropped mine right by my own boots.\"","<b>Seat 3</b>, Captain Waddle: \"Mine's hiding behind me. I'm the penguin.\"","<b>Seat 4</b>, Granny Gale: \"Mine fell into the big mail sack.\"","<b>Seat 5</b>, Mr Sleet: \"Mine is stuck in the corner of the window.\"","<b>Seat 6</b>, Little Nell: \"Mine went under the big pile of presents.\""],
      wrongMessages:{ALIGNS:"Right letters, wrong order. Read them by seat number, 1 to 6."},
      hints:["Find all eight tickets first. Two of them belong to nobody on your cards.","Seat 1's ticket is under the purple present: S. Seat 2's is by the elf's boots: I.","S, I, G, N, A, L. The answer is SIGNAL."]},
    /* Route. Follow open track from START; a red bar closes a branch. Stations passed (printed labels via LBL): S, W, I, T, C, H = SWITCH.
       Path walks all four pieces (TL F; TR R,O; BR S; BL T,Y; BR North Pole). Decoys H K E M D sit on closed branches. */
    route:{wave:2,title:"The Frosted Route Map",obj:"o-route",answer:"SWITCH",kind:"word",tile:"T",splitArt:true,
      lockedMsg:"The side window is frozen solid. Crack two of the first locks to get the firebox hot enough to melt it.",
      scene:"The frost melted off a route map taped to the glass, torn into four. <em>\"Follow our line from START to the NORTH POLE. A red bar means that switch is set against us: never go past one. Read every station letter you pass.\"</em>",
      extra:()=>`<div class="photo-grid">${[0,1,2,3].map(i=>`<div class="card" style="--r:${[-1.5,1.2,1,-1.2][i]}deg;animation-delay:${i*.08}s;background:#dfe8f2"><span class="ph">PHONE ${i+1}</span>${mapPiece(i)}</div>`).join('')}</div>`,
      hints:["Put the four pieces together: the tracks carry on from one piece to the next. START is top left.","From START you pass S, then the branch down to B is barred, so carry on right to W. Keep going.","S, W, I, T, C, H. The answer is SWITCH."]},
    /* Couplings. Chain from the engine's star hook to the van's heart hook, each back hook matching the next front hook.
       Only full chain (brute force, 720 orders): P A R C E L. */
    couplings:{wave:2,title:"The Carriage Couplings",obj:"o-coupling",answer:"PARCEL",kind:"word",tile:"R",
      lockedMsg:"The back door is chained shut. Crack two of the first locks to shake it loose.",
      scene:"The six present carriages came unhooked in the snow. A hook only fits a hook of the SAME shape, and carriages can't be turned round. <em>\"Couple ALL six between the engine and the guard's van, then read their letters from front to back.\"</em>",
      extra:couplingSVG,
      cards:CARS.map(carCard),
      hints:["Start at the engine: its back hook is a star. Which carriage has a star on its front?","P goes first. Two carriages have a moon at the front. One of them leads to the van too soon, leaving carriages behind.","P, A, R, C, E, L. The answer is PARCEL."]},
    /* Final: tiles N, I, A, T, R -> TRAIN (no other common English word uses these five letters). */
    lever:{wave:3,title:"The Departure Lever",obj:"o-lever",answer:"TRAIN",kind:"word",
      scene:"Every lock you crack drops a brass letter into the lever's slots. Stamped on the handle: <em>\"Spell what you're all riding tonight, then pull.\"</em>",
      wrongMessages:{SLEIGH:"Nice try, but Santa's sleigh comes later. Use only the five letters.",ENGINE:"Close! But use only the five letters."},
      hints:["You're riding it right now. It runs on rails.","It starts with T and has carriages.","The answer is TRAIN."]}
  },
  finale:{tag:"FULL STEAM",titleHTML:"THE EXPRESS<br><span>IS MOVING</span>",
    cardHTML:`<h3>Choo-Choo Snow Cocoa</h3>Warm 2 cups of milk in a pan (ask a grown-up). Whisk in 2 tbsp cocoa powder, 2 tbsp sugar and a tiny pinch of salt. Pour into mugs, float a marshmallow "snowdrift" on top and add a candy cane for the lever.<div class="note">"Presents warm, wheels turning, North Pole by 23:50. Best crew I've ever had. Toot toot!" <br>The Driver<br><small style="font-family:Inter;font-size:11px;color:#8a6a4a">Art: Google Santa Tracker, CC BY 4.0</small></div>`}
};
EXPERIENCES[ID].locks.route._graph=ROUTE;
EXPERIENCES[ID].locks.tickets._tickets=TICKETS;
EXP_ORDER.push(ID);
})();
