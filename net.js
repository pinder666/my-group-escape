/* Group Escape networking. One small API, two transports:
   - LOCAL: BroadcastChannel + localStorage (tabs of one browser; for testing, no server)
   - SUPABASE: Realtime broadcast + presence, room state in table `rooms`, results in `results`
   No accounts. Each device gets a random id kept in localStorage. */
(function(){
const cfg=window.GE_CONFIG||{};
const online=!!(cfg.supabaseUrl&&cfg.supabaseAnonKey);
function ls(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
function deviceId(){let id=ls('ge-device');if(!id){id=Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);ls('ge-device',id)}
  if(!online){ /* test mode: each tab is its own player */ let t=null;try{t=sessionStorage.getItem('ge-tab');if(!t){t=Math.random().toString(36).slice(2,6);sessionStorage.setItem('ge-tab',t)}}catch(e){t='t'} id+='-'+t; }
  return id}
function newCode(){const a='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';for(let i=0;i<5;i++)s+=a[Math.floor(Math.random()*a.length)];return s}

let sbPromise=null;
function sb(){ if(!sbPromise) sbPromise=new Promise((res,rej)=>{const s=document.createElement('script');s.src='supabase.js';s.onload=()=>res(window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey));s.onerror=rej;document.head.appendChild(s)}); return sbPromise; }

/* ---- room connection ---- */
async function join(code,exp,me){
  const h={state:null,peers:[],onState:()=>{},onEvent:()=>{},onPeers:()=>{}};
  const joinedAt=Date.now();
  if(!online){
    const key='ge-room-'+code; const bc=new BroadcastChannel('ge-'+code); const seen={};
    h.state=ls(key)||{exp,created:Date.now()};
    const beat=()=>bc.postMessage({t:'hb',id:me.id,name:me.name,joined:joinedAt});
    const prune=()=>{const now=Date.now();const list=[{id:me.id,name:me.name,joined:joinedAt}];Object.values(seen).forEach(p=>{if(now-p.at<9000&&p.id!==me.id)list.push(p)});list.sort((a,b)=>a.joined-b.joined||(a.id<b.id?-1:1));const sig=JSON.stringify(list.map(p=>p.id+p.name));if(sig!==h._sig){h._sig=sig;h.peers=list;h.onPeers(list)}};
    bc.onmessage=e=>{const m=e.data;if(m.t==='hb'){seen[m.id]={id:m.id,name:m.name,joined:m.joined,at:Date.now()};prune()}else if(m.t==='bye'){delete seen[m.id];prune()}else if(m.t==='ev'){h.onEvent(m.ev)}else if(m.t==='st'){h.state=m.state;h.onState(m.state)}};
    beat(); h._hb=setInterval(()=>{beat();prune()},2500); setTimeout(prune,50);
    h.send=ev=>bc.postMessage({t:'ev',ev});
    h.patch=p=>{h.state=Object.assign({},ls(key)||h.state,p);ls(key,h.state);bc.postMessage({t:'st',state:h.state})};
    h.rename=n=>{me.name=n;beat();prune()};
    h.leave=()=>{clearInterval(h._hb);bc.postMessage({t:'bye',id:me.id});bc.close()};
    return h;
  }
  const client=await sb();
  const {data,error}=await client.from('rooms').select('state').eq('code',code).maybeSingle();
  if(error) throw new Error('rooms read: '+error.message);
  h.state=(data&&data.state)||{exp,created:Date.now()};
  if(!data){ const {error:e2}=await client.from('rooms').upsert({code,exp,state:h.state}); if(e2) throw new Error('rooms write: '+e2.message); }
  const ch=client.channel('room-'+code,{config:{presence:{key:me.id},broadcast:{self:false}}});
  ch.on('broadcast',{event:'ev'},({payload})=>h.onEvent(payload));
  ch.on('broadcast',{event:'st'},({payload})=>{h.state=payload;h.onState(payload)});
  ch.on('presence',{event:'sync'},()=>{const st=ch.presenceState();const list=Object.values(st).map(a=>a[0]).filter(Boolean).map(p=>({id:p.id,name:p.name,joined:p.joined}));list.sort((a,b)=>a.joined-b.joined||(a.id<b.id?-1:1));h.peers=list;h.onPeers(list)});
  await new Promise((r,j)=>ch.subscribe(s=>{if(s==='SUBSCRIBED')r();else if(s==='CHANNEL_ERROR'||s==='TIMED_OUT')j(new Error('realtime: '+s))}));
  await ch.track({id:me.id,name:me.name,joined:joinedAt});
  h.send=ev=>ch.send({type:'broadcast',event:'ev',payload:ev});
  h.patch=async p=>{h.state=Object.assign({},h.state,p);ch.send({type:'broadcast',event:'st',payload:h.state});await client.from('rooms').upsert({code,exp,state:h.state,updated_at:new Date().toISOString()})};
  h.rename=n=>{me.name=n;ch.track({id:me.id,name:n,joined:joinedAt})};
  h.leave=()=>{ch.untrack();client.removeChannel(ch)};
  return h;
}

/* ---- weekly leaderboard ---- */
function weekKey(d=new Date()){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);const y=t.getUTCFullYear();const w=Math.ceil(((t-Date.UTC(y,0,1))/864e5+1)/7);return y+'-W'+String(w).padStart(2,'0')}
async function submitResult(r){ // r: {exp,week,team,ms,hints,players,room}
  if(!online){const all=ls('ge-results')||[];if(!all.find(x=>x.room===r.room&&x.exp===r.exp))all.push(r);ls('ge-results',all);return}
  const client=await sb(); await client.from('results').insert(r);
}
async function topResults(exp,week,n=5){
  if(!online){return (ls('ge-results')||[]).filter(r=>r.exp===exp&&r.week===week).sort((a,b)=>a.ms-b.ms||a.hints-b.hints).slice(0,n)}
  const client=await sb(); const {data}=await client.from('results').select('team,ms,hints,players').eq('exp',exp).eq('week',week).order('ms',{ascending:true}).limit(n); return data||[];
}

function joinWithTimeout(code,exp,me){return Promise.race([join(code,exp,me),new Promise((_,j)=>setTimeout(()=>j(new Error('timeout')),15000))])}
async function submitFeedback(f){ // f: {exp,stars,comment,room}
  if(!online){const all=ls('ge-feedback')||[];all.push(Object.assign({at:Date.now()},f));ls('ge-feedback',all);return}
  const client=await sb(); const {error}=await client.from('feedback').insert(f); if(error) throw error;
}
async function submitMessage(m){ // m: {message, reply_to, exp}
  const key=cfg.messageKey; if(!key) throw new Error('messages not configured');
  const body={access_key:key,subject:'My Group Escape: new message'+(m.exp?' ('+m.exp+')':''),from_name:'My Group Escape player',message:m.message+(m.exp?'\n\nRoom: '+m.exp:'')+(m.reply_to?'\n\nReply to: '+m.reply_to:'\n\n(No reply contact given)'),botcheck:''};
  const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({})); if(!r.ok||j.success===false) throw new Error(j.message||('HTTP '+r.status));
}
async function submitEnquiry(kind,fields){ // kind: 'Custom room' | 'Teams'
  const key=cfg.messageKey; if(!key) throw new Error('enquiries not configured');
  const lines=Object.entries(fields).filter(([k,v])=>v).map(([k,v])=>k+': '+v).join('\n');
  const body={access_key:key,subject:'My Group Escape: '+kind+' enquiry',from_name:'My Group Escape enquiry',replyto:fields.Email||undefined,message:lines,botcheck:''};
  const r=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)});
  const j=await r.json().catch(()=>({})); if(!r.ok||j.success===false) throw new Error(j.message||('HTTP '+r.status));
}
window.GENet={online,submitFeedback,submitMessage,submitEnquiry,deviceId,newCode,join:joinWithTimeout,weekKey,submitResult,topResults,ls};
})();
