/* My Group Escape engine. Experiences register in window.EXPERIENCES (see SPEC.md). */
(function(){
const $=s=>document.querySelector(s);
const EXPS=window.EXPERIENCES, ORDER_IDS=window.EXP_ORDER;
const HINT_MIN=[8,16,24], FINAL_HINT_MIN=[5,10,15];
let X=null, st=null, current=null, hintTimer=null;

/* ---------- audio ---------- */
let ac=null;
function audio(){ if(!ac){ try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){} } if(ac&&ac.state==='suspended') ac.resume(); }
function tone(f,d,type='sine',v=.12,w=0){ if(!ac)return; const t=ac.currentTime+w,o=ac.createOscillator(),g=ac.createGain(); o.type=type;o.frequency.setValueAtTime(f,t); g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d); o.connect(g).connect(ac.destination); o.start(t); o.stop(t+d+.02); }
const sfx={
  tick:()=>tone(1500,.025,'square',.025),
  tap:()=>tone(700,.05,'triangle',.06),
  wrong:()=>{tone(150,.32,'sawtooth',.09);tone(110,.32,'sawtooth',.07,.05)},
  unlock:()=>{tone(523,.12,'triangle',.14);tone(784,.14,'triangle',.14,.09);tone(1047,.3,'triangle',.12,.18)},
  win:()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,.4,'triangle',.12,i*.12)),
  creak:()=>{ if(!ac)return; const t=ac.currentTime,o=ac.createOscillator(),g=ac.createGain(),fl=ac.createBiquadFilter(); o.type='sawtooth'; o.frequency.setValueAtTime(90,t); o.frequency.linearRampToValueAtTime(60,t+1.2); g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(.05,t+.2); g.gain.linearRampToValueAtTime(.0001,t+1.3); fl.type='bandpass'; fl.frequency.value=400; fl.Q.value=6; o.connect(fl).connect(g).connect(ac.destination); o.start(t); o.stop(t+1.4); }
};

/* ---------- helpers ---------- */
const norm=s=>String(s).toUpperCase().replace(/[^A-Z0-9]/g,'');
function lev(a,b){const m=a.length,n=b.length,d=[...Array(m+1)].map((_,i)=>[i,...Array(n).fill(0)]);for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
const fmt=ms=>{const s=Math.max(0,Math.floor(ms/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};
const html=v=>typeof v==='function'?v():(v||'');
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
function toast(t,ms=2800){const el=$('#scene .toast');if(!el)return;el.textContent=t;el.classList.add('show');clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove('show'),ms)}
function applyTheme(t){const r=document.documentElement.style;const map={accent:'--accent',accent2:'--accent2',bg:'--bg',panel:'--panel',introBg:'--introBg',door:'--door',doorFrame:'--doorFrame',boxColor:'--boxColor'};Object.keys(map).forEach(k=>{if(t&&t[k])r.setProperty(map[k],t[k]);else r.removeProperty(map[k])})}
function injectCSS(id,css){if(document.getElementById('css-'+id))return;const s=document.createElement('style');s.id='css-'+id;s.textContent=css||'';document.head.appendChild(s)}

/* ---------- waves ---------- */
const keysByWave=w=>X.order.filter(k=>(X.locks[k].wave||1)===w);
const wave1Solved=()=>keysByWave(1).filter(k=>st.solved[k]).length;
const wave2Open=()=>wave1Solved()>=Math.min(2,keysByWave(1).length);
function isOpen(k){const w=X.locks[k].wave||1; if(w===2) return wave2Open(); return true;}
const finalKey=()=>X.order.find(k=>X.locks[k].wave===3);
const finalReady=()=>X.order.filter(k=>X.locks[k].wave!==3).every(k=>st.solved[k]);

/* ---------- menu ---------- */
const COLLECTIONS=[
  {id:'thanksgiving',title:'Thanksgiving'},
  {id:'christmas',title:'Christmas Adventures'},
  {id:'mystery',title:'Mysteries & Heists'},
  {id:'spooky',title:'Spooky Nights'},
  {id:'explorers',title:'Explorers'},
  {id:'scifi',title:'Science & Space'}];
const DEFAULT_COLL={'recipe-box':'thanksgiving','north-pole-job':'christmas','heist':'mystery','murder-gala':'mystery','codebreakers':'mystery','haunted-manor':'spooky','pharaohs-tomb':'spooky','lost-expedition':'explorers','shipwreck-island':'explorers','mission-control':'scifi','out-of-time':'scifi','last-lab':'scifi'};
const collOf=id=>EXPS[id].collection||DEFAULT_COLL[id]||'mystery';
function miniScene(e){const h=e.sceneHTML.replace(/<button\b/g,'<div').replace(/<\/button>/g,'</div>');return `<div class="mini" style="width:500px;height:694px;transform-origin:0 0;position:absolute;left:0;top:0"><div class="scene" data-exp="${e.id}" style="width:500px;aspect-ratio:auto;height:694px;border-radius:0;box-shadow:none;pointer-events:none">${h}<div class="vignette"></div></div></div>`}
function fitMinis(){document.querySelectorAll('.mini').forEach(m=>{const box=m.parentElement;if(!box.clientWidth)return;const s=Math.max(box.clientWidth/500,box.clientHeight/694);m.style.transform=`scale(${s})`;m.style.top=((box.clientHeight-694*s)/2)+'px';m.style.left=((box.clientWidth-500*s)/2)+'px'})}
let heroTimer=null;
function roomOfWeek(d=new Date()){
  const wk=+GENet.weekKey(d).split('W')[1]; const m=d.getMonth(), day=d.getDate();
  if(m===10&&day<=27&&EXPS['recipe-box']) return 'recipe-box'; // all of November up to Thanksgiving weekend
  const xmas=ORDER_IDS.filter(id=>collOf(id)==='christmas');
  if((m===11||(m===10&&day>=28))&&xmas.length) return xmas[wk%xmas.length];
  const rest=ORDER_IDS.filter(id=>!['christmas','thanksgiving'].includes(collOf(id))); return rest[wk%rest.length];
}
async function renderWeek(){
  const id=roomOfWeek(), e=EXPS[id]; if(!e) return; const box=$('#m-week');
  const now=new Date(); const left=7-((now.getDay()+6)%7); 
  box.innerHTML=`<div class="week"><div class="w-head"><span class="w-badge">ROOM OF THE WEEK</span><span class="w-left">New room in ${left} day${left>1?'s':''}</span></div><button class="w-room" data-id="${id}"><div class="w-thumb">${miniScene(e)}</div><div><b>${e.title}</b><small>Every group in the world gets this room this week. Race them.</small><span class="w-play" style="background:${e.theme.accent}">Play this week's room</span></div></button><div class="w-board"><div class="w-bt">Fastest groups this week</div><ol id="w-list"><li class="w-empty">Loading…</li></ol>${GENet.online?'':'<div class="w-note">Test mode: only results from this device show here.</div>'}</div></div>`;
  box.querySelector('[data-id]').onclick=()=>{audio();sfx.tap();location.hash=id};
  requestAnimationFrame(fitMinis);
  try{ const top=await GENet.topResults(id,GENet.weekKey()); const ol=$('#w-list'); if(!ol)return;
    ol.innerHTML=top.length?top.map((r,i)=>`<li><span class="w-pos">${i+1}</span><span class="w-team">${String(r.team).replace(/[<>&]/g,'')}</span><span class="w-time">${fmt(r.ms)}</span></li>`).join(''):'<li class="w-empty">No groups have escaped yet. Be the first.</li>';
  }catch(e){ const ol=$('#w-list'); if(ol) ol.innerHTML='<li class="w-empty">Leaderboard unavailable right now.</li>'; }
}
function renderMenu(){
  ORDER_IDS.forEach(id=>injectCSS(id,EXPS[id].sceneCSS));
  const done=store('ge-done')||{};
  const rw=roomOfWeek(), fe=EXPS[rw]; const returning=Object.keys(done).length>0;
  $('#m-hero').innerHTML=`<div class="hero lp"><div class="h-art">${miniScene(fe)}</div><div class="h-shade"></div><div class="h-body"><div class="tag">Free · No sign-up · No app</div><h2>Escape rooms for your <span>group chat</span></h2><p>Share one link. Everyone joins on their phone. Crack it together, at the table or on a video call.</p><button class="h-play lp-cta" data-id="${rw}" style="background:#f2b33d">Start a room with my group</button><button class="lp-browse" id="lp-browse">or browse all ${ORDER_IDS.length} rooms ↓</button></div></div>`;
  $('#lp-browse').onclick=()=>{ const r=document.querySelector('.row'); if(r) r.scrollIntoView({behavior:'smooth',block:'start'}); };
  $('#m-intro').classList.toggle('hidden',returning);
  clearInterval(heroTimer);
  renderWeek();
  $('#m-rows').innerHTML=COLLECTIONS.map(c=>{const ids=ORDER_IDS.filter(id=>collOf(id)===c.id);if(!ids.length)return '';return `<section class="row"><h3>${c.title} <small>${ids.length} room${ids.length>1?'s':''}</small></h3><div class="rail">${ids.map(id=>{const e=EXPS[id];return `<button class="poster" data-id="${id}">${done[id]?'<span class="done">✓</span>':''}<div class="p-art">${miniScene(e)}</div><div class="p-shade"></div><div class="p-t"><b>${e.title}</b><small>${e.menuLine}</small></div></button>`}).join('')}</div></section>`}).join('');
  document.querySelectorAll('#menu [data-id]').forEach(b=>b.onclick=()=>{audio();sfx.tap();location.hash=b.dataset.id});
  requestAnimationFrame(fitMinis); setTimeout(fitMinis,300);
}
window.addEventListener('resize',fitMinis);

function show(id){['menu','intro','lobby','game','finale','page'].forEach(s=>$('#'+s).classList.toggle('hidden',s!==id))}

/* ---------- routing ---------- */
function route(){
  closeSheet(true); ['#donatebox','#infobox','#msgbox'].forEach(q=>{const m=$(q); if(m) m.classList.add('hidden');});
  const raw=location.hash.slice(1); const [id,code]=raw.split('--');
  if(G&&(!code||code!==G.code)) leaveGroup();
  if(raw==='custom'||raw==='teams'){ applyTheme(null); X=null; $('#scene').innerHTML=''; renderInfo(raw); return; }
  if(id&&EXPS[id]&&code){ startGroup(id,code.toUpperCase()); }
  else if(id&&EXPS[id]){ startIntro(id); }
  else { applyTheme(null); X=null; $('#scene').innerHTML=''; show('menu'); renderMenu(); }
}
window.addEventListener('hashchange',route);

/* ---------- intro ---------- */
function prepExp(id){
  X=EXPS[id]; applyTheme(X.theme); injectCSS(id,X.sceneCSS); $('#m-hero').innerHTML=''; $('#m-rows').innerHTML=''; $('#m-week').innerHTML=''; clearInterval(heroTimer); $('#scene').innerHTML='';
  st={solved:{},openedAt:{},hintsUsed:{},games:{},start:0,wrong:0,done:false,toasted:false,inRoom:false};
}
function startIntro(id){
  prepExp(id); $('#enter-group').disabled=false;
  $('#i-tag').textContent=X.tag; $('#i-title').innerHTML=X.titleHTML; $('#i-blurb').textContent=X.blurb;
  const door=$('#door'); door.classList.remove('open'); $('#enter').disabled=false;
  $('#intro').style.opacity=1; $('#intro').style.transition='';
  show('intro'); window.scrollTo(0,0);
}
$('#intro-back').onclick=()=>{location.hash=''};
$('#game-back').onclick=()=>{location.hash=''};
$('#tomenu').onclick=()=>{location.hash=''};
$('#enter-group').onclick=()=>{audio();sfx.tap();location.hash=X.id+'--'+GENet.newCode()};
$('#enter').onclick=()=>{
  audio(); sfx.creak(); $('#door').classList.add('open'); $('#enter').disabled=true; $('#enter-group').disabled=true;
  setTimeout(()=>{$('#intro').style.transition='opacity .6s';$('#intro').style.opacity=0},1100);
  setTimeout(enterRoom,1700);
};
function enterRoom(){
  const sc=$('#scene'); sc.dataset.exp=X.id;
  sc.innerHTML=X.sceneHTML+'<div class="vignette"></div><div class="toast"></div>';
  X.order.forEach(k=>{const el=document.getElementById(X.locks[k].obj); if(!el){console.error('Missing object for lock',k,X.locks[k].obj);return;} el.addEventListener('click',()=>openSheet(k));});
  if(X.onEnter) try{X.onEnter(sc)}catch(e){console.error(e)}
  show('game'); st.inRoom=true; st.start=(G&&G.net&&G.net.state.startedAt)||Date.now(); renderHud(); tickTimer();
  if(G) replaySolved();
  toast(G?`${G.peers.length>1?G.peers.length+' players in. ':''}Your clue cards are split between your phones. Talk it out!`:(X.startToast||"Tap anything that sparkles. Three locks are ready."),3800);
}

/* ---------- group play ---------- */
let G=null;
function leaveGroup(){ clearInterval(countTimer); if(G&&G.net) try{G.net.leave()}catch(e){} G=null; }
function roomLink(){ return siteLink()+'#'+X.id+'--'+G.code; }
async function startGroup(id,code){
  prepExp(id);
  G={code,net:null,me:{id:GENet.deviceId(),name:GENet.ls('ge-name')||''},peers:[]};
  show('lobby'); window.scrollTo(0,0);
  $('#l-title').innerHTML=X.titleHTML; $('#l-code').textContent=code;
  $('#l-name').value=G.me.name; $('#l-team').value='';
  ['#l-countbox','#l-pick'].forEach(q=>$(q).classList.add('hidden')); $('#l-when').classList.remove('hidden'); $('#l-start').classList.remove('hidden'); $('#l-now').classList.add('on'); $('#l-later').classList.remove('on');
  updateInvite();
  $('#l-status').textContent=GENet.online?'Connecting…':'Test mode: open this same link in another tab to join as a second player.';
  try{ G.net=await GENet.join(code,id,G.me); }catch(e){ console.warn('join failed',e); $('#l-status').innerHTML='Could not connect to the room. Check your internet, then <a href="#" onclick="location.reload();return false">try again</a>. You can still play solo from the menu.'; return; }
  if(!G||G.code!==code) return;
  const net=G.net;
  net.onPeers=list=>{ if(!G)return; const before=G.peers.length; G.peers=list; renderLobbyPeers(); renderHud(); if(st.inRoom&&current&&before!==list.length) openSheet(current,true); };
  net.onState=s=>applyShared(s);
  net.onEvent=ev=>{ if(!G)return;
    if(ev.type==='solve') remoteSolve(ev.k,ev.by);
    if(ev.type==='hint'){ st.hintsUsed[ev.k]=Math.max(st.hintsUsed[ev.k]||0,ev.n); if(st.inRoom) toast(`${ev.by} revealed a hint for "${X.locks[ev.k].title}".`); if(current===ev.k) renderHints(); }
    if(ev.type==='start') applyShared(net.state);
    if(ev.type==='sched'&&!st.inRoom) setTimeout(()=>renderSchedule(),150);
    if(ev.type==='react'&&st.inRoom){ floatEmoji(ev.e,ev.by); rage(ev.e); }
  };
  G.peers=net.peers.length?net.peers:[{id:G.me.id,name:G.me.name,joined:Date.now()}];
  $('#l-status').textContent=GENet.online?'Connected. Share the link so your group can join.':'Test mode: open this same link in another tab to join as a second player.';
  if(net.state.team) $('#l-team').value=net.state.team;
  renderLobbyPeers();
  applyShared(net.state,true);
}
function applyShared(s,initial){
  if(!G||!X||!s) return;
  G.net.state=s;
  Object.keys(s.hintsUsed||{}).forEach(k=>{st.hintsUsed[k]=Math.max(st.hintsUsed[k]||0,s.hintsUsed[k])});
  if(s.team&&document.activeElement!==$('#l-team')) $('#l-team').value=s.team;
  const newly=Object.keys(s.solved||{}).filter(k=>!st.solved[k]);
  if(!st.inRoom){ newly.forEach(k=>st.solved[k]=true); renderSchedule(); if(s.startedAt&&G.me.name) startRoomFromLobby(); return; }
  newly.forEach(k=>remoteSolve(k,(s.solved[k]||{}).by||'Someone'));
}
function renderLobbyPeers(){
  if(!G) return; const box=$('#l-peers'); if(!box) return;
  box.innerHTML=G.peers.map(p=>`<li><span class="av">${(p.name||'?').slice(0,1).toUpperCase()}</span>${p.name||'(choosing a name…)'}${p.id===G.me.id?' <em>you</em>':''}</li>`).join('');
  $('#l-count').textContent=G.peers.length+(G.peers.length===1?' player':' players');
  $('#l-start').textContent=(G.net&&G.net.state.startedAt)?'Join your group':'Start the escape';
}
function saveName(){ const n=$('#l-name').value.trim().slice(0,16); if(!n){$('#l-name').focus();$('#l-name').classList.add('shake');setTimeout(()=>$('#l-name').classList.remove('shake'),500);return false;} G.me.name=n; GENet.ls('ge-name',n); if(G.net) G.net.rename(n); renderLobbyPeers(); return true; }
$('#l-name').addEventListener('change',()=>{if(G&&$('#l-name').value.trim())saveName()});
$('#l-team').addEventListener('change',()=>{if(G&&G.net)G.net.patch({team:$('#l-team').value.trim().slice(0,24)})});
$('#l-start').onclick=()=>{ audio(); if(!G||!G.net||!saveName())return; const team=$('#l-team').value.trim().slice(0,24)||('Team '+G.me.name); const startedAt=G.net.state.startedAt||Date.now(); G.net.patch({team,startedAt}); G.net.send({type:'start'}); startRoomFromLobby(); };
$('#l-copy').onclick=async()=>{ try{await navigator.clipboard.writeText(roomLink());$('#l-copy').textContent='Copied ✓'}catch(e){$('#l-copy').textContent=roomLink()} };
$('#lobby-back').onclick=()=>{location.hash=''};
function startRoomFromLobby(){
  if(st.inRoom||st.entering) return; st.entering=true;
  show('intro'); $('#i-tag').textContent=X.tag; $('#i-title').innerHTML=X.titleHTML; $('#i-blurb').textContent=G.net.state.team||'';
  $('#enter').disabled=true; $('#enter-group').disabled=true; $('#intro').style.opacity=1; $('#intro').style.transition='';
  audio(); sfx.creak(); $('#door').classList.remove('open'); void $('#door').offsetWidth; $('#door').classList.add('open');
  setTimeout(()=>{$('#intro').style.transition='opacity .6s';$('#intro').style.opacity=0},900);
  setTimeout(()=>{st.entering=false;enterRoom()},1500);
}
function dealCards(sheet){
  const n=G.peers.length, me=G.peers.findIndex(p=>p.id===G.me.id); if(n<2||me<0) return;
  const cards=[...sheet.querySelectorAll('.cards > .card, .photo-grid > .card')]; if(!cards.length) return;
  let mine=0;
  cards.forEach((c,j)=>{ const owner=j%n; if(owner===me){ mine++; const ph=c.querySelector('.ph'); if(ph) ph.textContent='YOURS'; c.classList.add('mine'); }
    else { const o=G.peers[owner]; const wide=c.classList.contains('wide'); c.className='card stub'+(wide?' wide':''); c.innerHTML=`<span class="ph">${o.name||'Player'}</span><div class="stubtxt"><b>${o.name||'A teammate'}</b> has this piece. Ask them to read it out!</div>`; } });
  const first=sheet.querySelector('.cards, .photo-grid'); if(first){ const b=document.createElement('div'); b.className='dealt'; b.innerHTML=`You hold <b>${mine}</b> of ${cards.length} pieces. The rest are on your teammates' phones.`; first.parentNode.insertBefore(b,first); }
}


/* ---------- scheduled game night ---------- */
let countTimer=null;
const fmtWhen=ms=>new Date(ms).toLocaleString(undefined,{weekday:'long',day:'numeric',month:'short',hour:'numeric',minute:'2-digit'});
function updateInvite(){
  if(!G||!X) return; const at=G.net&&G.net.state&&G.net.state.scheduledAt;
  const text=at&&at>Date.now()?`Game night! ${fmtWhen(at)} we're playing ${X.title} 🔐 Tap to see the countdown and say you're in: ${roomLink()}`:`Join our escape room! We're playing ${X.title}. Tap to join our team: ${roomLink()}`;
  $('#l-share').href='https://wa.me/?text='+encodeURIComponent(text);
  $('#l-share').textContent=at&&at>Date.now()?'Send the invite to your WhatsApp group':'Share to WhatsApp group';
}
function calLinks(at){
  const end=at+60*60000, z=d=>new Date(d).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const title=`Game night: ${X.title} (My Group Escape)`, details=`Tap to join your team: ${roomLink()}`;
  $('#l-gcal').href=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${z(at)}/${z(end)}&details=${encodeURIComponent(details)}`;
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//My Group Escape//EN','BEGIN:VEVENT','UID:'+G.code+'@mygroupescape','DTSTAMP:'+z(Date.now()),'DTSTART:'+z(at),'DTEND:'+z(end),'SUMMARY:'+title,'DESCRIPTION:'+details,'URL:'+roomLink(),'BEGIN:VALARM','TRIGGER:-PT15M','ACTION:DISPLAY','DESCRIPTION:'+title,'END:VALARM','END:VEVENT','END:VCALENDAR'].join('\r\n');
  $('#l-ics').href='data:text/calendar;charset=utf-8,'+encodeURIComponent(ics);
}
function renderSchedule(){
  if(!G||!G.net) return; const s=G.net.state||{}, at=s.scheduledAt;
  const scheduled=!!at&&!s.startedAt&&at>Date.now();
  $('#l-when').classList.toggle('hidden',scheduled||!!s.startedAt);
  $('#l-countbox').classList.toggle('hidden',!scheduled);
  $('#l-start').classList.toggle('hidden',scheduled);
  clearInterval(countTimer);
  if(!scheduled){ updateInvite(); return; }
  $('#l-at').textContent=fmtWhen(at)+' (your time)';
  calLinks(at); updateInvite();
  const rs=s.rsvps||{}; const names=Object.values(rs);
  const mine=!!rs[G.me.id];
  $('#l-rsvp').textContent=mine?"You're in ✓":"I'm in";
  $('#l-rsvp').classList.toggle('ghost',mine);
  $('#l-rsvps').innerHTML=names.length?`<b>${names.length} coming:</b> ${names.map(n=>esc(n)).join(', ')}`:'Nobody has said they\'re in yet. Be the first!';
  const tick=()=>{ const left=at-Date.now();
    if(left<=0){ clearInterval(countTimer); $('#l-clock').textContent='Starting!'; if(!st.inRoom){ if(G.me.name){ G.net.patch({startedAt:at}); startRoomFromLobby(); } else { renderSchedule(); $('#l-status').textContent='Game night has started! Type your name and tap Start to join.'; } } return; }
    const d=Math.floor(left/864e5), h=Math.floor(left/36e5)%24, m=Math.floor(left/6e4)%60, sec=Math.floor(left/1e3)%60;
    $('#l-clock').textContent=(d?d+'d ':'')+String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0'); };
  tick(); countTimer=setInterval(tick,1000);
}
$('#l-now').onclick=()=>{ $('#l-now').classList.add('on'); $('#l-later').classList.remove('on'); $('#l-pick').classList.add('hidden'); $('#l-start').classList.remove('hidden'); };
$('#l-later').onclick=()=>{ $('#l-later').classList.add('on'); $('#l-now').classList.remove('on'); $('#l-pick').classList.remove('hidden'); $('#l-start').classList.add('hidden');
  const d=new Date(Date.now()+864e5); d.setHours(19,0,0,0); const pad=n=>String(n).padStart(2,'0'); $('#l-dt').value=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T19:00`; };
$('#l-set').onclick=()=>{ audio(); if(!G||!G.net||!saveName())return; const v=$('#l-dt').value; const at=v?new Date(v).getTime():NaN;
  if(!(at>Date.now()+60000)){ $('#l-status').textContent='Pick a time in the future.'; return; }
  const team=$('#l-team').value.trim().slice(0,24)||('Team '+G.me.name); const rsvps=Object.assign({},G.net.state.rsvps||{}); rsvps[G.me.id]=G.me.name;
  G.net.patch({scheduledAt:at,team,rsvps}); G.net.send({type:'sched'}); renderSchedule(); $('#l-status').textContent='Game night is set. Now send the invite to your group!'; };
$('#l-rsvp').onclick=()=>{ audio(); if(!G||!G.net||!saveName())return; const rsvps=Object.assign({},G.net.state.rsvps||{}); if(rsvps[G.me.id]) delete rsvps[G.me.id]; else rsvps[G.me.id]=G.me.name; G.net.patch({rsvps}); G.net.send({type:'sched'}); renderSchedule(); };
$('#l-change').onclick=()=>{ G.net.patch({scheduledAt:null}); G.net.send({type:'sched'}); renderSchedule(); $('#l-later').onclick(); };
$('#l-early').onclick=()=>{ G.net.patch({scheduledAt:null}); G.net.send({type:'sched'}); renderSchedule(); $('#l-now').onclick(); };

/* ---------- hud ---------- */
const padSVG=()=>`<svg viewBox="0 0 20 22"><path d="M5 10V7a5 5 0 0 1 10 0v3" fill="none" stroke="#9b9ba3" stroke-width="2.4"/><rect x="2" y="10" width="16" height="11" rx="3" fill="currentColor"/></svg>`;
function renderHud(){
  const pp=$('#players'); if(pp){ if(G){pp.classList.remove('hidden');pp.textContent=(G.peers.length||1)+' in room'} else pp.classList.add('hidden'); }
  $('#hudlocks').innerHTML=X.order.map(k=>`<div class="pad ${st.solved[k]?'done':''}" style="color:${st.solved[k]?'#5fbf6a':'#6b5a3e'}">${padSVG()}</div>`).join('');
  const fk=finalKey(); const fobj=fk&&document.getElementById(X.locks[fk].obj);
  if(fobj) fobj.querySelectorAll('.lights b').forEach((b,i)=>b.classList.toggle('on',!!st.solved[X.order[i]]));
  X.order.forEach(k=>{const el=document.getElementById(X.locks[k].obj);if(!el)return;el.classList.toggle('solved',!!st.solved[k]);el.classList.toggle('locked',!isOpen(k))});
}
function tickTimer(){ if(!st||!st.start||st.done||!X)return; $('#timer').textContent=fmt(Date.now()-st.start); setTimeout(tickTimer,250); }

/* ---------- wheels ---------- */
function makeWheels(len,charset){
  const wrap=document.createElement('div'); wrap.className='wheels';
  const ww=Math.max(24,Math.min(42,Math.floor((Math.min(window.innerWidth,520)-56)/len)-4));
  wrap.style.setProperty('--ww',ww+'px');
  const idx=Array(len).fill(0), strips=[]; let input=null;
  const draw=i=>{strips[i].style.transform=`translateY(${-idx[i]*50}px)`};
  const get=()=>idx.map(n=>charset[n]).join('');
  const sync=()=>{if(input)input.value=get()};
  for(let i=0;i<len;i++){
    const w=document.createElement('div'); w.className='wheel';
    w.innerHTML=`<button aria-label="Up">▲</button><div class="wwin"><div class="strip">${charset.map(c=>`<div>${c}</div>`).join('')}</div></div><button aria-label="Down">▼</button>`;
    const up=w.children[0],down=w.children[2]; strips.push(w.querySelector('.strip'));
    up.onclick=()=>{audio();idx[i]=(idx[i]-1+charset.length)%charset.length;draw(i);sfx.tick();sync()};
    down.onclick=()=>{audio();idx[i]=(idx[i]+1)%charset.length;draw(i);sfx.tick();sync()};
    let y0=null; const win=w.querySelector('.wwin');
    win.addEventListener('touchstart',e=>{y0=e.touches[0].clientY},{passive:true});
    win.addEventListener('touchend',e=>{if(y0==null)return;const dy=e.changedTouches[0].clientY-y0;if(Math.abs(dy)>14)(dy<0?down:up).onclick();y0=null});
    wrap.appendChild(w);
  }
  function set(str){str=String(str).toUpperCase();for(let i=0;i<len;i++){const c=str[i];const n=c?charset.indexOf(c):0;if(n>=0&&n!==idx[i]){idx[i]=n;draw(i);sfx.tick()}}}
  return {el:wrap,get,set,bind(inp){input=inp}};
}

/* ---------- sheet ---------- */
function openSheet(k,redeal){
  if(!redeal){audio(); sfx.tap();} const L=X.locks[k];
  if(!isOpen(k)){ toast(L.lockedMsg||"Not yet. Crack two of the first locks to get at this."); return; }
  if(L.openClass) document.getElementById(L.obj).classList.add(L.openClass);
  if(!st.openedAt[k]) st.openedAt[k]=Date.now();
  current=k; const solved=!!st.solved[k], isFinal=L.wave===3;
  const n=X.order.indexOf(k)+1, total=X.order.length;
  const ph=i=>`<span class="ph">PHONE ${i%4+1}</span>`;
  let cards='';
  if(L.cards&&L.cards.length){
    const cls=L.cardClass||'';
    cards=`<div class="cards">${L.cards.map((c,i)=>{const lastOdd=i===L.cards.length-1&&L.cards.length%2===1;const wide=(L.wideCards||lastOdd)&&!cls.includes('slice');return `<div class="card ${cls} ${wide?'wide':''}" style="--r:${((i*37)%5-2)*.8}deg;animation-delay:${i*.07}s">${cls.includes('slice')?'':ph(i)}${c}</div>`}).join('')}</div>`;
  }
  let tiles='';
  if(isFinal){ tiles=`<div class="tiles">${X.order.filter(o=>X.locks[o].wave!==3).map(o=>st.solved[o]?`<span>${X.locks[o].tile}</span>`:`<span class="empty">?</span>`).join('')}</div>`; }
  const s=$('#sheet');
  s.innerHTML=`<div class="grab"></div><button class="close" aria-label="Close">✕</button>
    <div class="tag">LOCK ${n} OF ${total}</div><h2>${L.title}</h2>
    <p class="scene-txt">${L.scene}</p>${L.extra?`<div class="art">${html(L.extra)}</div>`:''}${L.game?'<div class="minigame" id="minigame"></div>':''}${tiles}${cards}
    ${((L.cards&&L.cards.length)||L.splitArt)&&!(G&&G.peers.length>1)?`<p class="scene-txt note-small">${G?'Waiting for the rest of your group: when they join, these pieces get dealt out between your phones.':'Solo, you see every piece. In a group, they are dealt out between your phones.'}</p>`:''}
    <div class="lockbox" id="lockbox">
      <div class="padlock ${solved?'open':''}" id="padlock"><div class="sh"></div><div class="bd"></div></div>
      <div id="wheelslot"></div>
      ${solved?`<div class="msg">Unlocked. Answer: ${L.answer}</div>`:`
      <input class="typein" id="typein" maxlength="${L.answer.length}" placeholder="or type the ${L.kind==='num'?'code':'word'} here" inputmode="${L.kind==='num'?'numeric':'text'}" autocomplete="off" autocapitalize="characters" spellcheck="false">
      <div class="msg" id="msg"></div>
      <div class="lock-actions"><button class="btn" id="try">Try it</button></div>`}
    </div>
    ${solved?'':`<div class="hints" id="hints"></div>`}`;
  s.querySelector('.close').onclick=()=>closeSheet();
  if(isFinal&&!finalReady()&&!solved){
    $('#lockbox').innerHTML=`<div class="padlock" id="padlock"><div class="sh"></div><div class="bd"></div></div><div class="msg">${X.finalLockedMsg||'Crack all the other locks first. Each one drops a letter tile in here.'}</div>`;
  } else {
    const charset=L.kind==='num'?"0123456789".split(''):"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
    const wh=makeWheels(L.answer.length,charset); $('#wheelslot').appendChild(wh.el);
    if(solved) wh.set(L.answer);
    else{
      const inp=$('#typein'); wh.bind(inp);
      inp.addEventListener('input',()=>{inp.value=norm(inp.value).slice(0,L.answer.length);wh.set(inp.value.padEnd(L.answer.length,charset[0]))});
      $('#try').onclick=()=>tryAnswer(k,wh.get());
      inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();tryAnswer(k,wh.get())}});
      renderHints(); clearInterval(hintTimer); hintTimer=setInterval(renderHints,1000);
    }
  }
  if(L.game) try{renderGame(k)}catch(e){console.error(e)}
  if(G&&G.peers.length>1) dealCards(s);
  if(L.onOpen) try{L.onOpen(s)}catch(e){console.error(e)}
  $('#sheetbg').classList.add('show'); s.classList.add('show'); s.scrollTop=0;
}
function closeSheet(instant){ $('#sheet').classList.remove('show'); $('#sheetbg').classList.remove('show'); clearInterval(hintTimer); current=null; }
$('#sheetbg').onclick=()=>closeSheet();

function renderHints(){
  const k=current; if(!k||!X)return; const box=$('#hints'); if(!box)return;
  const L=X.locks[k], mins=L.wave===3?FINAL_HINT_MIN:HINT_MIN, used=st.hintsUsed[k]||0;
  const elapsed=(Date.now()-st.openedAt[k])/60000;
  box.innerHTML=L.hints.map((h,i)=>{
    if(i<used) return `<div class="hint open"><b>Hint ${i+1}:</b> ${h}</div>`;
    if(i===used){const left=mins[i]-elapsed; return left<=0?`<button class="hint" data-h="${i}">Hint ${i+1} is ready. Tap to reveal.</button>`:`<button class="hint" disabled>Hint ${i+1} unlocks in ${fmt(left*60000)}</button>`;}
    return '';
  }).join('');
  box.querySelectorAll('button[data-h]').forEach(b=>b.onclick=()=>{audio();sfx.tap();st.hintsUsed[k]=(st.hintsUsed[k]||0)+1;renderHints();if(G){G.net.send({type:'hint',k,n:st.hintsUsed[k],by:G.me.name});G.net.patch({hintsUsed:Object.assign({},G.net.state.hintsUsed||{},st.hintsUsed)})}});
}


/* ---------- mini-games (Santa Tracker style) ---------- */
function gameReveal(box,G){ const r=document.createElement('div'); r.className='mg-reveal'; r.innerHTML=G.reveal||'Done!'; box.appendChild(r); }
function renderGame(k){
  const L=X.locks[k], G=L.game, box=document.getElementById('minigame'); if(!box)return;
  const done=!!st.games[k]||!!st.solved[k];
  box.innerHTML=`<div class="mg-title">${G.title||(G.type==='match'?'Match the pairs':'Find them all')}</div>`;
  const complete=()=>{ st.games[k]=true; sfx.unlock(); gameReveal(box,G); };
  if(G.type==='match'){
    const items=G.items; const deck=[...items.keys(),...items.keys()];
    let seed=(G.seed||7); const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280};
    for(let i=deck.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]]}
    const cols=deck.length<=12?4:(deck.length<=16?4:5);
    const grid=document.createElement('div'); grid.className='mg-grid'; grid.style.gridTemplateColumns=`repeat(${cols},1fr)`;
    let open=[], matched=0, busy=false;
    deck.forEach((id,i)=>{
      const c=document.createElement('button'); c.className='mg-card'+(done?' up matched':''); c.setAttribute('aria-label','Card');
      c.innerHTML=`<div class="mg-in"><div class="mg-back"></div><div class="mg-face">${items[id].startsWith('<')?items[id]:`<img src="${items[id]}" alt="">`}</div></div>`;
      c.dataset.id=id;
      if(!done) c.onclick=()=>{
        audio(); if(busy||c.classList.contains('up'))return; sfx.tick(); c.classList.add('up'); open.push(c);
        if(open.length===2){ busy=true; const [a,b]=open;
          if(a.dataset.id===b.dataset.id){ setTimeout(()=>{a.classList.add('matched');b.classList.add('matched');open=[];busy=false;matched++;sfx.tap();if(matched===items.length)complete()},250); }
          else setTimeout(()=>{a.classList.remove('up');b.classList.remove('up');open=[];busy=false},800);
        }
      };
      grid.appendChild(c);
    });
    box.appendChild(grid);
  }
  if(G.type==='find'){
    const wrap=document.createElement('div'); wrap.className='mg-find'; wrap.style.aspectRatio=G.aspect||'1.4';
    wrap.innerHTML=html(G.scene);
    const found=new Set(done?G.targets.map((_,i)=>i):[]);
    const counter=document.createElement('div'); counter.className='mg-count';
    const upd=()=>{counter.textContent=`Found ${found.size} of ${G.targets.length}`};
    G.targets.forEach((t,i)=>{
      const h=document.createElement('button'); h.className='mg-hot'+(found.has(i)?' got':''); h.setAttribute('aria-label',t.name||'hidden item');
      h.style.left=(t.x-t.r)+'%'; h.style.top=`calc(${t.y}% - ${t.r}cqw)`; h.style.width=(t.r*2)+'%'; h.style.height=(t.r*2)+'cqw';
      if(!done) h.onclick=e=>{e.stopPropagation();audio();if(found.has(i))return;found.add(i);h.classList.add('got');sfx.tap();upd();if(found.size===G.targets.length)complete()};
      wrap.appendChild(h);
    });
    wrap.addEventListener('click',()=>{audio();sfx.tick();wrap.classList.remove('miss');void wrap.offsetWidth;wrap.classList.add('miss')});
    box.appendChild(wrap); box.appendChild(counter); upd();
  }
  if(done) gameReveal(box,G);
}

function tryAnswer(k,guess){
  audio(); const L=X.locks[k], g=norm(guess), a=norm(L.answer);
  let ok=g===a;
  if(!ok&&L.kind==='word'&&L.wave!==3&&a.length>=5&&lev(g,a)<=1) ok=true;
  if(ok) return unlock(k);
  st.wrong++;
  const pl=$('#padlock'); pl.classList.remove('shake'); void pl.offsetWidth; pl.classList.add('shake'); sfx.wrong();
  if(navigator.vibrate) try{navigator.vibrate(120)}catch(e){}
  const special=L.wrongMessages&&L.wrongMessages[g];
  $('#msg').textContent=special||"Not quite. The lock won't budge.";
}

function unlock(k){
  const L=X.locks[k]; st.solved[k]=true; sfx.unlock();
  $('#padlock').classList.add('open'); $('#msg').textContent='Click! It opens.'; clearInterval(hintTimer);
  if(G){ const by=G.me.name; G.net.send({type:'solve',k,by}); const sol=Object.assign({},G.net.state.solved||{}); sol[k]={by,at:Date.now()}; G.net.patch({solved:sol}); }
  setTimeout(()=>afterSolve(k,null),900);
}
function remoteSolve(k,by){
  if(!X||!X.locks[k]||st.solved[k])return; st.solved[k]=true;
  if(!st.inRoom) return;
  sfx.unlock();
  if(current===k){const pl=$('#padlock');if(pl)pl.classList.add('open');const m=$('#msg');if(m)m.textContent=`${by} cracked it!`;clearInterval(hintTimer);}
  setTimeout(()=>afterSolve(k,by),current===k?1100:80);
}
function afterSolve(k,by){
  const L=X.locks[k];
  if(L.tile) flyTile(L.tile, X.locks[finalKey()].obj);
  if(!by||current===k) closeSheet();
  renderHud();
  (L.onSolve||[]).forEach(r=>{const el=document.querySelector('#scene '+r.sel); if(el) el.classList.add(r.cls)});
  if(L.wave===3) return finish(by);
  const who=by?`${by} cracked "${L.title}". `:'';
  if((L.wave||1)===1&&wave2Open()&&!st.toasted){
    st.toasted=true;
    setTimeout(()=>{(X.revealOnWave2||[]).forEach(r=>{const el=document.querySelector('#scene '+r.sel);if(el)el.classList.add(r.cls)});renderHud();toast(who+(X.wave2Toast||"Something new just opened up in the room."),3800)},900);
  } else if(finalReady()) setTimeout(()=>toast(who+(X.finalReadyToast||"All the tiles are in. The last lock is waiting."),3400),900);
  else toast(who||(L.solvedToast||`Lock open. Tile "${L.tile}" collected.`),3000);
}
function replaySolved(){ // late joiner: show everything already solved, no fanfare
  X.order.forEach(k=>{ if(!st.solved[k])return; (X.locks[k].onSolve||[]).forEach(r=>{const el=document.querySelector('#scene '+r.sel);if(el)el.classList.add(r.cls)}); });
  if(wave2Open()){st.toasted=true;(X.revealOnWave2||[]).forEach(r=>{const el=document.querySelector('#scene '+r.sel);if(el)el.classList.add(r.cls)})}
  renderHud();
  const fk=finalKey(); if(st.solved[fk]) finish('your group');
}
function flyTile(ch,targetId){
  const tgt=document.getElementById(targetId); if(!tgt)return; const box=tgt.getBoundingClientRect();
  const t=document.createElement('div'); t.className='flytile'; t.textContent=ch;
  const sx=window.innerWidth/2-24, sy=window.innerHeight*.45;
  t.style.left=sx+'px'; t.style.top=sy+'px';
  t.style.setProperty('--dx',(box.left+box.width/2-24-sx)+'px'); t.style.setProperty('--dy',(box.top+box.height/2-28-sy)+'px');
  document.body.appendChild(t); setTimeout(()=>t.remove(),1200);
}

/* ---------- finish ---------- */
function finish(by){
  if(st.done) return; st.done=true;
  const startAt=(G&&G.net&&G.net.state.startedAt)||st.start; const ms=Date.now()-startAt;
  const hints=Object.values(st.hintsUsed).reduce((a,b)=>a+b,0);
  const team=(G&&G.net.state.team)||(G?'Team '+G.me.name:(GENet.ls('ge-name')||'Solo player'));
  const link=siteLink()+'#'+X.id;
  const row=X.order.map((k,i)=>`${X.locks[k].wave===3?'Final':'Lock '+(i+1)} ${st.hintsUsed[k]?'□':'■'}`).join('  ');
  const players=G?Math.max(1,G.peers.length):1;
  const text=`${team} escaped ${X.title} in ${fmt(ms)} with ${hints} hint${hints===1?'':'s'}${G?` (${players} player${players>1?'s':''})`:''}.\n${row}\nThink your group can beat us? ${link}`;
  const done=store('ge-done')||{}; done[X.id]=true; store('ge-done',done);
  const finKey='ge-fin-'+(G?G.code:'solo-'+Date.now());
  if(!store(finKey)){ store(finKey,1); if(!(G&&by)) GENet.submitResult({exp:X.id,week:GENet.weekKey(),team,ms,hints,players,room:G?G.code:'solo-'+GENet.deviceId()+'-'+Date.now()}).catch(()=>{}); }
  $('#sharecard').textContent=text;
  $('#f-tag').textContent=X.finale.tag||'ESCAPED';
  $('#f-title').innerHTML=X.finale.titleHTML;
  $('#f-card').innerHTML=X.finale.cardHTML;
  $('#f-time').innerHTML=`<b>${fmt(ms)}</b><span>${team}${hints?` · ${hints} hint${hints>1?'s':''}`:' · no hints'}</span>`;
  resetRating();
  $('#bigbox').classList.remove('open');
  $('#challenge').href='https://wa.me/?text='+encodeURIComponent(text);
  setTimeout(()=>{ show('finale'); $('#finale').scrollTop=0; sfx.win(); setTimeout(()=>$('#bigbox').classList.add('open'),200); confetti(); },600);
  $('#copy').textContent='Copy';
  $('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(text);$('#copy').textContent='Copied ✓'}catch(e){$('#copy').textContent='Select the card to copy'}};
}
function confetti(){
  const c=$('#confetti'),x=c.getContext('2d'); c.width=innerWidth*devicePixelRatio; c.height=innerHeight*devicePixelRatio; x.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  const t=X.theme||{}; const cols=[t.accent||'#f2b33d',t.accent2||'#ffd27a','#d4513d','#5fbf6a','#f4efe6','#6fa8dc'];
  const P=[...Array(160)].map(()=>({x:innerWidth/2,y:innerHeight*.3,vx:(Math.random()-.5)*12,vy:-Math.random()*13-4,r:Math.random()*6+3,c:cols[Math.random()*cols.length|0],a:Math.random()*6,va:(Math.random()-.5)*.3}));
  let f=0;(function loop(){x.clearRect(0,0,innerWidth,innerHeight);P.forEach(p=>{p.vy+=.28;p.vx*=.99;p.x+=p.vx;p.y+=p.vy;p.a+=p.va;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);x.restore()});if(++f<260)requestAnimationFrame(loop);else x.clearRect(0,0,innerWidth,innerHeight)})();
}


/* ---------- reactions, rating, share, contact ---------- */
const CFG=window.GE_CONFIG||{};
const siteLink=()=>CFG.siteUrl||location.href.split('#')[0];
function floatEmoji(e,by){
  const box=$('#floaters'); if(!box) return;
  const f=document.createElement('div'); f.className='floater';
  f.style.left=(12+Math.random()*70)+'%'; f.style.setProperty('--dx',((Math.random()-.5)*60)+'px');
  f.innerHTML=`<span class="fe">${e}</span>${by?`<span class="fn">${String(by).replace(/[<>&]/g,'')}</span>`:''}`;
  box.appendChild(f); setTimeout(()=>f.remove(),2600);
}
function rage(e){ if(e!=='😡'&&e!=='😤') return; const sc=$('#scene'); if(sc){sc.classList.remove('rage');void sc.offsetWidth;sc.classList.add('rage');} if(navigator.vibrate) try{navigator.vibrate(e==='😡'?[80,40,80]:60)}catch(x){} }
let lastReact=0;
document.querySelectorAll('#reactbar button').forEach(b=>b.onclick=()=>{
  const now=Date.now(); if(now-lastReact<350) return; lastReact=now; audio(); sfx.tick();
  const e=b.dataset.e; floatEmoji(e,G?'You':null); rage(e);
  if(G&&G.net) G.net.send({type:'react',e,by:G.me.name});
  b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
});
let rating=0;
function resetRating(){ rating=0; $('#r-comment').value=''; $('#r-send').disabled=true; $('#r-send').classList.remove('hidden'); $('#r-comment').classList.remove('hidden'); $('#stars').classList.remove('hidden'); $('.r-q').classList.remove('hidden'); $('#r-thanks').classList.add('hidden'); $('#donate').classList.add('hidden'); document.querySelectorAll('#stars button').forEach(x=>x.classList.remove('on')); }
document.querySelectorAll('#stars button').forEach(b=>b.onclick=()=>{ audio(); sfx.tick(); rating=+b.dataset.s; document.querySelectorAll('#stars button').forEach(x=>x.classList.toggle('on',+x.dataset.s<=rating)); $('#r-send').disabled=false; });
$('#r-send').onclick=async()=>{
  if(!rating||!X) return; $('#r-send').disabled=true;
  const fb={exp:X.id,stars:rating,comment:$('#r-comment').value.trim().slice(0,500),room:G?G.code:'solo'};
  try{ await GENet.submitFeedback(fb); }catch(e){ console.warn('feedback failed',e); }
  ['#r-send','#r-comment','#stars','.r-q'].forEach(sel=>$(sel).classList.add('hidden'));
  const t=$('#r-thanks'); t.classList.remove('hidden');
  if(rating>=4){ const msg=`We just escaped ${X.title} on My Group Escape and loved it. Free escape rooms you play together in your group chat: ${siteLink()}`;
    t.innerHTML=`<b>Glad you loved it!</b><br>Know another group who'd love it too?<a class="btn r-wa" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">Send it to another group</a>`; }
  else t.innerHTML='<b>Thank you.</b> We read every rating and use it to make the rooms better.';
  if(CFG.donateUrl){ $('#donate').classList.remove('hidden'); }
};
function initLinks(){
  const ib=$('#infobox');
  document.querySelectorAll('[data-info]').forEach(b=>b.onclick=()=>{ audio(); sfx.tap(); ['faq','credits'].forEach(k=>$('#info-'+k).classList.toggle('hidden',k!==b.dataset.info)); ib.classList.remove('hidden'); ib.querySelector('.msg-card').scrollTop=0; });
  $('#info-close').onclick=()=>ib.classList.add('hidden');
  ib.addEventListener('click',e=>{if(e.target===ib)ib.classList.add('hidden')});
  if(CFG.donateUrl){ $('#m-donate').classList.remove('hidden'); $('#don-go').href=CFG.donateUrl; }
  const db=$('#donatebox');
  document.querySelectorAll('[data-donate]').forEach(b=>b.onclick=()=>{ audio(); sfx.tap(); db.classList.remove('hidden'); });
  ['#don-close','#don-later'].forEach(q=>$(q).onclick=()=>db.classList.add('hidden'));
  $('#don-go').addEventListener('click',()=>setTimeout(()=>db.classList.add('hidden'),300));
  db.addEventListener('click',e=>{if(e.target===db)db.classList.add('hidden')});
  const mb=$('#msgbox');
  if(!CFG.messageKey){ ['#m-contact','#f-contact'].forEach(q=>$(q).classList.add('hidden')); }
  const openMsg=()=>{ audio(); sfx.tap(); $('#msg-text').value=''; $('#msg-reply').value=''; $('#msg-send').disabled=true; $('#msg-send').classList.remove('hidden'); $('#msg-text').classList.remove('hidden'); $('#msg-reply').classList.remove('hidden'); $('#msg-done').classList.add('hidden'); mb.classList.remove('hidden'); setTimeout(()=>$('#msg-text').focus(),50); };
  document.querySelectorAll('[data-msg]').forEach(b=>b.onclick=openMsg);
  $('#msg-close').onclick=()=>mb.classList.add('hidden');
  mb.addEventListener('click',e=>{if(e.target===mb)mb.classList.add('hidden')});
  $('#msg-text').addEventListener('input',()=>{$('#msg-send').disabled=$('#msg-text').value.trim().length<2});
  $('#msg-send').onclick=async()=>{ const t=$('#msg-text').value.trim(); if(t.length<2)return; $('#msg-send').disabled=true;
    try{ await GENet.submitMessage({message:t.slice(0,1000),reply_to:$('#msg-reply').value.trim().slice(0,120)||null,exp:X?X.id:null}); ['#msg-send','#msg-text','#msg-reply'].forEach(q=>$(q).classList.add('hidden')); $('#msg-done').classList.remove('hidden'); }
    catch(e){ console.warn(e); $('#msg-send').disabled=false; $('#msg-send').textContent='Could not send. Try again'; } };
  $('#m-share').onclick=()=>{ audio(); const msg=`Free escape rooms you play together in your group chat. Pick a room, share the link, crack it together: ${siteLink()}`; window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank'); };
}
initLinks();


/* ---------- info pages: custom rooms & teams ---------- */
const esc=v=>String(v).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
function field(f){
  const req=f.req?' required':'';
  if(f.type==='select') return `<label class="pf"><span>${f.label}${f.req?' *':''}</span><select name="${f.name}"${req}><option value="">Choose…</option>${f.options.map(o=>`<option>${o}</option>`).join('')}</select></label>`;
  if(f.type==='area') return `<label class="pf"><span>${f.label}${f.req?' *':''}</span><textarea name="${f.name}" maxlength="1200" placeholder="${f.ph||''}"${req}></textarea></label>`;
  return `<label class="pf"><span>${f.label}${f.req?' *':''}</span><input name="${f.name}" type="${f.type||'text'}" maxlength="200" placeholder="${f.ph||''}"${req}></label>`;
}
const INFO={
  custom:{kind:'Custom room',tag:'CUSTOM ESCAPE ROOMS',title:'An escape room about <span>your people</span>',
    lead:'We build a one-off escape room around the person you love: their name in the clues, your family stories in the puzzles, and a surprise message behind the final lock.',
    price:()=>CFG.customPrice||'',
    chips:['Birthday','Anniversary','Proposal','Family reunion','Retirement','Baby announcement','Christmas surprise','Leaving do'],
    how:[['Tell us about them','Names, a few funny stories, inside jokes, and what the final lock should reveal.'],['We build your room','Six locks written around your story, in the same animated rooms as the free games.'],['Share one link','Everyone plays on their own phone, together or on a video call. The last lock reveals your message.']],
    gets:['Your own private room link','Six puzzles made from your stories','A surprise reveal at the end ("Will you marry me?", "Happy 60th, Dad!")','Works for the whole family, ages 8 to 80','Plays at the table or on a WhatsApp video call'],
    form:[{name:'Occasion',type:'select',options:['Birthday','Anniversary','Proposal','Family reunion','Retirement','Baby announcement','Christmas','Other'],req:true},
      {name:'Who it is for',ph:'e.g. Dad, turning 60'},
      {name:'Who will play',ph:'e.g. 6 of us: Mum, Dan, Priya, the cousins'},
      {name:'Stories and inside jokes',type:'area',ph:'A few fun facts, nicknames, places, favourite things. The more the better.',req:true},
      {name:'Final reveal message',ph:'e.g. Will you marry me? / Pack your bags, we are going to Rome!'},
      {name:'Date you need it by',type:'date'},
      {name:'Your name',req:true},{name:'Email',type:'email',ph:'So we can reply',req:true}],
    cta:'Ask about a custom room',done:'Thanks! We\'ll email you soon with ideas and next steps.'},
  teams:{kind:'Missions for work',tag:'ESCAPE MISSIONS FOR WORK',title:'Training your team will <span>actually enjoy</span>',
    lead:'We turn your training, onboarding or company news into an escape mission. Teams crack it on their phones during the week, shifts and sites race on a live leaderboard, and people remember what they learned.',
    price:()=>'',
    chips:['Safety training','New-starter onboarding','Product launches','Shift vs shift','Site vs site','Holiday party','Sales kick-off'],
    how:[['Send us your material','Your safety rules, onboarding guide, product sheet or company story. Whatever people need to learn.'],['We build your mission','Six locks written around your content, in our animated rooms, with your company name on it.'],['Teams play during the week','One link per team, no installs. A lock a shift, or the whole thing in a lunch break. Leaderboard on the break-room screen.']],
    gets:['A custom mission built from your own content','Teams of up to 8, as many teams as you like','Live leaderboard: shift vs shift, site vs site','Works on any phone or laptop browser, no accounts','Team scores only: we never track individual workers','Monthly missions available to keep morale up all year'],
    form:[{name:'Company',req:true},{name:'Number of people',type:'number',ph:'e.g. 120',req:true},
      {name:'What it is for',type:'select',options:['Training','Onboarding','Morale / engagement','Product launch','Event / party','Not sure yet'],req:true},
      {name:'Tell us more',type:'area',ph:'e.g. warehouse safety week for 3 shifts across 2 sites'},
      {name:'One-off or monthly?',type:'select',options:['One-off mission','Monthly missions','Not sure yet']},
      {name:'Date',type:'date'},{name:'Your name',req:true},{name:'Email',type:'email',ph:'Work email',req:true}],
    cta:'Get a quote',done:'Thanks! We\'ll reply by email within a couple of days.'}
};
function renderInfo(key){
  const P=INFO[key]; leaveGroup&&G&&leaveGroup();
  $('#m-hero').innerHTML=''; $('#m-rows').innerHTML=''; $('#m-week').innerHTML=''; clearInterval(heroTimer);
  const price=P.price();
  $('#pg').innerHTML=`<div class="tag">${P.tag}</div><h1 class="pg-h">${P.title}</h1><p class="pg-lead">${P.lead}</p>
    ${price?`<div class="pg-price">${esc(price)}</div>`:''}
    <button class="btn pg-cta" id="pg-cta">${P.cta}</button>
    <div class="pg-chips">${P.chips.map(c=>`<span>${c}</span>`).join('')}</div>
    <h2 class="pg-h2">How it works</h2>
    <div class="pg-how">${P.how.map((h,i)=>`<div class="pg-step"><i>${i+1}</i><div><b>${h[0]}</b><p>${h[1]}</p></div></div>`).join('')}</div>
    <h2 class="pg-h2">What you get</h2>
    <ul class="pg-gets">${P.gets.map(g=>`<li>${g}</li>`).join('')}</ul>
    <h2 class="pg-h2" id="pg-form">${P.cta}</h2>
    <form class="pg-form" id="pgf" novalidate>${P.form.map(f=>field(Object.assign({label:f.name},f))).join('')}
      <input type="checkbox" name="botcheck" class="hidden" tabindex="-1" autocomplete="off">
      <button class="btn" type="submit">Send enquiry</button><div class="pg-msg" id="pg-msg"></div></form>
    <p class="pg-small">We only use your details to reply to you. ${key==='custom'?'<a href="#teams">Need something for work instead?</a>':'<a href="#custom">Want one for your family instead?</a>'}</p>`;
  show('page'); $('#page').scrollTop=0; window.scrollTo(0,0);
  $('#pg-cta').onclick=()=>{ audio(); sfx.tap(); const t=$('#pgf'); if(t){ t.scrollIntoView({behavior:'smooth',block:'start'}); setTimeout(()=>{const f=t.querySelector('input,select,textarea'); if(f) f.focus({preventScroll:true});},600); } };
  $('#pgf').onsubmit=async e=>{ e.preventDefault(); const f=e.target; if(f.botcheck.checked) return;
    const missing=P.form.filter(x=>x.req&&!String(f[x.name].value).trim()); if(missing.length){ $('#pg-msg').textContent='Please fill in: '+missing.map(m=>m.name).join(', '); f[missing[0].name].focus(); return; }
    if(f.Email&&!/^\S+@\S+\.\S+$/.test(f.Email.value)){ $('#pg-msg').textContent='Please check your email address.'; f.Email.focus(); return; }
    const data={}; P.form.forEach(x=>{data[x.name]=String(f[x.name].value).trim().slice(0,1200)});
    const btn=f.querySelector('button[type=submit]'); btn.disabled=true; btn.textContent='Sending…';
    try{ await GENet.submitEnquiry(P.kind,data); f.innerHTML=`<div class="pg-done"><b>Sent.</b> ${P.done}</div>`; }
    catch(err){ console.warn(err); btn.disabled=false; btn.textContent='Send enquiry'; $('#pg-msg').textContent='Could not send just now. Please try again in a minute.'; }
  };
}
$('#page-back').onclick=()=>{location.hash=''};

/* test hook */
window.__GE={state:()=>st,exp:()=>X,group:()=>G,renderSchedule:()=>renderSchedule()};
route();
})();
