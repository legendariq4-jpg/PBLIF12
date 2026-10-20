const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const iso=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
const today=()=>iso(new Date());
const addD=(s,n)=>{const d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return iso(d)};
const diff=(a,b)=>Math.round((new Date(a+'T00:00:00')-new Date(b+'T00:00:00'))/864e5);
const ICON={'Tanaman tropis':'🌴','Tanaman berbunga':'🌸','Sukulen':'🌵','Tanaman hias daun':'🍃','Tanaman obat':'🌱','Sayur & buah':'🍅'};
const GUIDE=[
 ['Tanaman tropis','Suka lembap dan cahaya terang tidak langsung.',['Siram saat permukaan tanah mulai kering','Semprot daun bila udara kering','Pupuk sebulan sekali']],
 ['Tanaman berbunga','Butuh banyak cahaya agar rajin berbunga.',['Taruh di tempat yang kena matahari pagi','Buang bunga layu','Pupuk fosfor tinggi tiap 2 minggu']],
 ['Sukulen','Simpan air di daun, jadi jangan terlalu sering disiram.',['Siram 1–2 kali seminggu','Pakai media tanam berpasir','Hindari genangan air di pot']],
 ['Tanaman hias daun','Warna daun terbaik di cahaya sedang.',['Lap daun dari debu','Putar pot agar tumbuh merata','Ganti pot saat akar keluar dari lubang']],
 ['Tanaman obat','Mudah dirawat dan berguna di dapur.',['Panen daun secara bertahap','Siram rutin, jangan sampai kering total','Pangkas agar bercabang']],
 ['Sayur & buah','Butuh cahaya penuh minimal 6 jam sehari.',['Siram pagi hari','Beri pupuk kompos','Periksa hama tiap beberapa hari']]];
const TIPS=['Siram pagi hari agar air terserap sebelum siang.','Daun menguning sering tanda terlalu banyak air.','Cek tanah dengan jari sebelum menyiram.','Putar pot seminggu sekali agar tumbuh simetris.','Tanaman baru perlu waktu beradaptasi, jangan langsung dipindah-pindah.'];

let S;
try{S=JSON.parse(localStorage.getItem('rimbun')||'null')}catch(e){S=null}
if(!S||!Array.isArray(S.plants)){const t=today();S={plants:[
 {id:1,name:'Monstera',cat:'Tanaman tropis',loc:'Ruang tamu',int:4,last:addD(t,-5),img:'',note:'Suka cahaya terang tidak langsung.'},
 {id:2,name:'Lidah buaya',cat:'Tanaman obat',loc:'Balkon',int:7,last:addD(t,-2),img:'',note:''},
 {id:3,name:'Pakis',cat:'Tanaman hias daun',loc:'Kamar',int:2,last:t,img:'',note:''}],log:[],next:4}}
function save(){try{localStorage.setItem('rimbun',JSON.stringify(S))}catch(e){toast('Penyimpanan penuh. Hapus foto atau cadangkan data.')}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('s');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('s'),2200)}

let view='home',filter='Semua',sort='nama',term='';
const due=p=>p.int>0?addD(p.last||iso(new Date(p.id)),p.int):null;
const left=p=>due(p)?diff(due(p),today()):null;
const needs=p=>left(p)!==null&&left(p)<=0;
const doneToday=()=>S.log.filter(l=>l.date===today()).length;
const lastTxt=p=>{if(!p.last)return 'Belum pernah';const d=diff(today(),p.last);return d===0?'Hari ini':d===1?'Kemarin':d+' hari lalu'};

function water(id){const p=S.plants.find(x=>x.id===id);if(!p)return;p.last=today();S.log.unshift({id,name:p.name,date:today(),t:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})});S.log=S.log.slice(0,100);save();render();toast(p.name+' sudah disiram')}
function del(id){const p=S.plants.find(x=>x.id===id);if(p&&confirm('Hapus '+p.name+'?')){S.plants=S.plants.filter(x=>x.id!==id);save();$('#det').close();render();toast('Tanaman dihapus')}}

function photo(p){return `<div class="ph" data-d="${p.id}" role="button" tabindex="0" aria-label="Lihat ${esc(p.name)}">${p.img?`<img src="${p.img}" alt="${esc(p.name)}">`:ICON[p.cat]||'🌿'}</div>`}
function card(p){const l=left(p);
 const b=l===null?'':l<=0?'<span class="badge">Butuh air</span>':`<span class="badge ok">Siram ${l} hari lagi</span>`;
 const pr=p.int>0?Math.max(0,Math.min(100,100-(l/p.int)*100)):0;
 return `<article class="card"><div style="position:relative">${b}${photo(p)}</div><div class="cb"><span class="cat">${esc(p.cat)}</span><h3>${esc(p.name)}</h3>
 ${p.int>0?`<div class="prog" title="Kebutuhan air"><i style="width:${pr}%"></i></div>`:''}
 <div class="meta"><span>📍 ${esc(p.loc||'Belum diatur')}</span><span>💧 ${lastTxt(p)}</span></div>
 <div class="acts"><button class="w" data-w="${p.id}">💧 Siram</button><button data-e="${p.id}">Edit</button><button data-x="${p.id}">Hapus</button></div></div></article>`}
function stats(){const n=S.plants.filter(needs).length;
 return `<div class="stats"><div class="stat dark"><div class="e">🪴</div><div><b>${S.plants.length}</b><span>Total tanaman</span></div></div>
 <div class="stat"><div class="e">⏰</div><div><b>${n}</b><span>Tugas tersisa</span></div></div>
 <div class="stat"><div class="e">✅</div><div><b>${doneToday()}</b><span>Perawatan selesai hari ini</span></div></div></div>`}
function head(t,s){const d=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long'});
 return `<div class="top"><div><div class="date">${d}</div><h1>${t}</h1><p class="sub">${s}</p></div><div class="tip">💡 <b>Tip hari ini</b><br>${TIPS[new Date().getDate()%TIPS.length]}</div></div>`}
function list(){let a=S.plants.filter(p=>(filter==='Semua'||p.cat===filter)&&(p.name+p.loc+p.cat).toLowerCase().includes(term));
 a.sort((x,y)=>sort==='nama'?x.name.localeCompare(y.name):sort==='air'?(left(x)??999)-(left(y)??999):y.id-x.id);return a}
function taskRow(p){const l=left(p);return `<div class="row"><div class="th" style="${p.img?`background-image:url(${p.img})`:''}">${p.img?'':ICON[p.cat]||'🌿'}</div><div class="g"><b>${esc(p.name)}</b><br><small>${esc(p.loc||'Belum diatur')} · ${l<0?`<span class="late">Terlambat ${-l} hari</span>`:l===0?'Hari ini':'Dalam '+l+' hari'}</small></div><button class="btn ${l>0?'ghost':''}" data-w="${p.id}">Selesai</button></div>`}

function render(){
 document.querySelectorAll('.nav[data-v]').forEach(b=>b.classList.toggle('on',b.dataset.v===view));
 const n=S.plants.filter(needs).length;$('#nb').textContent=n;$('#nb').classList.toggle('hide',!n);
 let h='';
 if(view==='home'){
  const t=S.plants.filter(needs).sort((a,b)=>left(a)-left(b));
  h=head('Selamat datang','Ringkasan perawatan tanamanmu hari ini.')+stats()+'<h2>Perlu dirawat hari ini</h2>'+
   (t.length?t.map(taskRow).join(''):'<div class="empty">Semua tanaman sudah disiram. Santai dulu. ☕</div>')+
   '<h2 style="margin-top:28px">Terakhir ditambahkan</h2><div class="grid">'+([...S.plants].sort((a,b)=>b.id-a.id).slice(0,3).map(card).join('')||'<div class="empty">Belum ada tanaman.</div>')+'</div>';
 }else if(view==='plants'){
  const cats=['Semua',...Object.keys(ICON)],a=list();
  h=head('Tanaman saya','Koleksi tanaman dan catatan perawatanmu, tersimpan di browser ini.')+stats()+
   `<div class="bar">${cats.map(c=>`<button class="chip ${c===filter?'on':''}" data-f="${esc(c)}">${esc(c)}</button>`).join('')}
   <select id="so" aria-label="Urutkan"><option value="nama" ${sort==='nama'?'selected':''}>Urutkan: nama</option><option value="air" ${sort==='air'?'selected':''}>Urutkan: paling haus</option><option value="baru" ${sort==='baru'?'selected':''}>Urutkan: terbaru</option></select>
   <span class="sub" style="margin-left:auto">${a.length} tanaman</span></div>`+
   (a.length?`<div class="grid">${a.map(card).join('')}</div>`:'<div class="empty">Tidak ada tanaman yang cocok. Coba kata kunci lain atau tambah tanaman baru.</div>');
 }else if(view==='sched'){
  const sc=S.plants.filter(p=>p.int>0).sort((a,b)=>left(a)-left(b));
  const g=(t,f)=>{const r=sc.filter(f);return r.length?`<h2>${t}</h2>`+r.map(taskRow).join(''):''};
  h=head('Jadwal perawatan','Urut dari yang paling mendesak.')+
   (sc.length?g('Terlambat',p=>left(p)<0)+g('Hari ini',p=>left(p)===0)+g('Mendatang',p=>left(p)>0):'<div class="empty">Belum ada jadwal. Atur interval siram saat menambah tanaman.</div>')+
   '<h2 style="margin-top:28px">Riwayat penyiraman</h2>'+(S.log.length?S.log.slice(0,10).map(l=>`<div class="row"><div class="g"><b>${esc(l.name)}</b><br><small>${l.date===today()?'Hari ini':esc(l.date)} · ${esc(l.t)}</small></div>💧</div>`).join(''):'<div class="empty">Belum ada riwayat.</div>');
 }else{
  h=head('Panduan tanaman','Tips singkat untuk tiap jenis tanaman.')+'<div class="gd" style="margin-top:24px">'+GUIDE.map(g=>`<div class="card"><span style="font-size:34px">${ICON[g[0]]}</span><h3>${g[0]}</h3><p class="sub" style="font-size:14px">${g[1]}</p><ul>${g[2].map(x=>`<li>${x}</li>`).join('')}</ul></div>`).join('')+'</div>';
 }
 $('#app').innerHTML=h;
}

/* events */
document.addEventListener('click',e=>{
 const t=e.target.closest('button,.ph');if(!t)return;
 if(t.dataset.v){view=t.dataset.v;render();scrollTo(0,0)}
 if(t.dataset.w)water(+t.dataset.w);
 if(t.dataset.e){$('#det').close();openForm(+t.dataset.e)}
 if(t.dataset.x)del(+t.dataset.x);
 if(t.dataset.f){filter=t.dataset.f;render()}
 if(t.dataset.d)detail(+t.dataset.d);
});
document.addEventListener('change',e=>{if(e.target.id==='so'){sort=e.target.value;render()}});
$('#q').addEventListener('input',e=>{term=e.target.value.toLowerCase();if(view!=='plants'){view='plants'}render()});

function detail(id){const p=S.plants.find(x=>x.id===id);if(!p)return;const d=$('#det');
 d.innerHTML=`<div style="height:200px;border-radius:14px;overflow:hidden;background:linear-gradient(135deg,#2f7d57,#9bc79a);display:grid;place-items:center;font-size:64px">${p.img?`<img src="${p.img}" alt="" style="width:100%;height:100%;object-fit:cover">`:ICON[p.cat]||'🌿'}</div>
 <span class="cat" style="display:block;margin-top:14px">${esc(p.cat)}</span><h2 style="margin:4px 0">${esc(p.name)}</h2>
 <p class="sub">📍 ${esc(p.loc||'Belum diatur')} · 💧 ${lastTxt(p)}${p.int?` · setiap ${p.int} hari`:''}</p>
 <p style="margin-top:12px;white-space:pre-wrap">${esc(p.note)||'<span class="sub">Belum ada catatan.</span>'}</p>
 <div class="dact"><button class="btn ghost" data-x="${p.id}">Hapus</button><button class="btn ghost" data-e="${p.id}">Edit</button><button class="btn" onclick="this.closest('dialog').close()">Tutup</button></div>`;
 d.showModal()}

let editId=null,imgData='';
function openForm(id){editId=id||null;imgData='';const p=S.plants.find(x=>x.id===id);
 $('#dt').textContent=p?'Edit tanaman':'Tambah tanaman';
 $('#fn').value=p?.name||'';$('#fc').value=p?.cat||'Tanaman tropis';$('#fl').value=p?.loc||'';
 $('#fi').value=p?p.int:3;$('#fd').value=p?.last||today();$('#fnote').value=p?.note||'';$('#fp').value='';
 $('#dlg').showModal()}
$('#add').onclick=()=>openForm();
$('#cancel').onclick=()=>$('#dlg').close();
$('#fp').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
 r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/im.width),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);imgData=c.toDataURL('image/jpeg',.75)};im.src=r.result};r.readAsDataURL(f)};
$('#form').onsubmit=()=>{
 const o={name:$('#fn').value.trim(),cat:$('#fc').value,loc:$('#fl').value.trim(),int:Math.max(0,+$('#fi').value||0),last:$('#fd').value||today(),note:$('#fnote').value.trim()};
 if(!o.name)return;
 if(editId){const p=S.plants.find(x=>x.id===editId);Object.assign(p,o);if(imgData)p.img=imgData}
 else S.plants.push({id:S.next++,img:imgData,...o});
 save();render();toast(editId?'Perubahan disimpan':'Tanaman ditambahkan')};

/* theme + backup */
function theme(t){document.documentElement.dataset.theme=t;try{localStorage.setItem('rimbun-theme',t)}catch(e){}$('#theme').textContent=t==='dark'?'☀️ Mode terang':'🌙 Mode gelap';$('#theme2').textContent=t==='dark'?'☀️':'🌙'}
const tg=()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark');
$('#theme').onclick=tg;$('#theme2').onclick=tg;
let st='light';try{st=localStorage.getItem('rimbun-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){}
theme(st);
$('#exp').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='rimbun-cadangan-'+today()+'.json';a.click();toast('Cadangan diunduh')};
$('#imp').onclick=()=>$('#impf').click();
$('#impf').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!Array.isArray(d.plants))throw 0;S={plants:d.plants,log:d.log||[],next:d.next||Date.now()};save();render();toast('Data dipulihkan')}catch(x){toast('File cadangan tidak valid')}};r.readAsText(f)};
render();
