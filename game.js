const REALMS=[
{name:'Luyện Khí tầng 1',need:100,hp:100,atk:10,def:8,dodge:5,crit:5},
{name:'Luyện Khí tầng 2',need:180,hp:120,atk:13,def:10,dodge:6,crit:6},
{name:'Luyện Khí tầng 3',need:300,hp:145,atk:17,def:13,dodge:7,crit:7},
{name:'Luyện Khí tầng 4',need:480,hp:175,atk:21,def:16,dodge:8,crit:8},
{name:'Luyện Khí tầng 5',need:720,hp:210,atk:26,def:20,dodge:9,crit:9},
{name:'Trúc Cơ sơ kỳ',need:1100,hp:270,atk:34,def:26,dodge:10,crit:11},
{name:'Trúc Cơ trung kỳ',need:1600,hp:330,atk:42,def:32,dodge:11,crit:12},
{name:'Trúc Cơ hậu kỳ',need:2300,hp:400,atk:50,def:40,dodge:12,crit:13},
{name:'Kim Đan sơ kỳ',need:3200,hp:500,atk:62,def:50,dodge:14,crit:15},
{name:'Kim Đan trung kỳ',need:4400,hp:620,atk:76,def:62,dodge:15,crit:17},
{name:'Kim Đan hậu kỳ',need:6000,hp:760,atk:92,def:76,dodge:16,crit:19},
{name:'Nguyên Anh sơ kỳ',need:9000,hp:980,atk:116,def:92,dodge:18,crit:22}];
const LOCS=[
{name:'Sơn Ngoại Thanh Minh',danger:1},{name:'Huyền Thủy Cốc',danger:2},{name:'Phong Lôi Đài',danger:3},{name:'Vạn Yêu Lĩnh',danger:4},{name:'Tinh Vân Bí Cảnh',danger:5}];
const MOBS=[
{name:'Thanh Phong Lang',face:'🐺',m:1},{name:'Xích Hỏa Hầu',face:'🐵',m:1.35},{name:'U Minh Xà',face:'🐍',m:1.8},{name:'Thiết Vũ Ưng',face:'🦅',m:2.3},{name:'Huyết Ma Tướng',face:'👹',m:3.1}];
const KEY='tutienafk-v3';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
function now(){return new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'})}
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function defState(){return {p:{name:'Diệp Mặc',realm:0,cult:0,hp:100,maxHp:100,atk:10,def:8,dodge:5,crit:5,gems:30,gold:120,herbs:8,pills:1,manual:0,sword:0,forge:0,treasure:0,sect:0,loc:0},flags:{mail:true,starter:false,sect:false,rift:true},logs:[{t:now(),x:'[Hệ Thống] Chào mừng đến với thế giới tu tiên!'},{t:now(),x:'[Hệ Thống] Hãy bắt đầu con đường của ngươi.'}],combat:null}}
let S=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||defState()}catch(e){return defState()}}
function save(){localStorage.setItem(KEY,JSON.stringify(S))}
function realm(){return REALMS[S.p.realm]}
function loc(){return LOCS[S.p.loc]}
function log(x){S.logs.unshift({t:now(),x});S.logs=S.logs.slice(0,6);save();renderLog()}
function pct(v,m){return Math.max(0,Math.min(100,v/Math.max(1,m)*100))}
function stats(){let p=S.p,r=realm();p.maxHp=r.hp+p.forge*10+p.treasure*3;p.atk=r.atk+p.sword*4+p.manual*2;p.def=r.def+p.forge*3;p.dodge=r.dodge+Math.floor(p.manual/2);p.crit=r.crit+Math.floor(p.sword/2);p.hp=Math.max(1,Math.min(p.maxHp,p.hp))}
function gain(v){S.p.cult+=v;let cap=realm().need*1.45;if(S.p.realm<REALMS.length-1&&S.p.cult>cap)S.p.cult=Math.floor(cap)}
function cultivate(n){let total=0,g=0,h=0;for(let i=0;i<n;i++){total+=rnd(12,22)+S.p.manual*2+S.p.forge;if(Math.random()<.4)g+=rnd(4,12);if(Math.random()<.25)h++}gain(total);S.p.gold+=g;S.p.herbs+=h;log('[Tu luyện] +'+total+' tu vi'+(g?', +'+g+' linh tệ':'')+(h?', +'+h+' dược liệu':''));render()}
function explore(){if(Math.random()<.3){startCombat();return}let d=loc().danger,g=rnd(18*d,42*d),h=rnd(1,2+d),c=rnd(16*d,30*d);S.p.gold+=g;S.p.herbs+=h;gain(c);if(Math.random()<.12)S.p.treasure++;log('[Thám hiểm] '+loc().name+': +'+g+' linh tệ, +'+h+' dược liệu, +'+c+' tu vi.');render()}
function breakthrough(){let p=S.p,r=realm();if(p.realm>=REALMS.length-1){log('[Đột phá] Đã chạm giới hạn phiên bản.');return}if(p.cult<r.need){log('[Đột phá] Cần '+r.need+' tu vi.');return}let bonus=p.pills?18:0;if(p.pills)p.pills--;let chance=Math.max(35,Math.min(92,55+p.manual*2+bonus-p.realm*2));if(Math.random()*100<chance){p.cult-=r.need;p.realm++;stats();p.hp=p.maxHp;log('[Đột phá] Thành công tiến vào '+realm().name+'!')}else{p.cult=Math.max(0,p.cult-Math.floor(r.need*.16));p.hp=Math.max(1,p.hp-Math.floor(p.maxHp*.18));log('[Đột phá] Thất bại, mất một phần tu vi.')}render()}
function startCombat(){let p=S.p,d=loc().danger,idx=Math.min(MOBS.length-1,Math.floor((p.realm+d)/3)),m=MOBS[idx],sc=m.m+d*.16+p.realm*.08;S.combat={name:m.name,face:m.face,maxHp:Math.floor(78*sc),hp:Math.floor(78*sc),atk:Math.floor(9*sc),def:Math.floor(4*sc)};save();renderCombat();$('#combat').classList.add('show');log('[Chiến đấu] '+m.name+' xuất hiện!')}
function attack(){let c=S.combat,p=S.p;if(!c)return;let dmg=Math.max(1,p.atk+rnd(-2,6)-c.def),crit=Math.random()*100<p.crit;if(crit)dmg=Math.floor(dmg*1.7);c.hp=Math.max(0,c.hp-dmg);log('[Chiến đấu] Gây '+dmg+' sát thương'+(crit?' (Bạo kích)':''));if(c.hp<=0){let g=rnd(30,65)+p.realm*6,h=rnd(1,3),v=rnd(25,55)+p.manual*2;p.gold+=g;p.herbs+=h;gain(v);if(Math.random()<.16)p.pills++;S.combat=null;save();$('#combat').classList.remove('show');log('[Chiến thắng] +'+g+' linh tệ, +'+h+' dược liệu, +'+v+' tu vi.');render();return}if(Math.random()*100>=p.dodge){let hit=Math.max(1,c.atk+rnd(-2,4)-p.def);p.hp=Math.max(1,p.hp-hit);log('[Chiến đấu] '+c.name+' phản kích, mất '+hit+' khí huyết.')}else log('[Chiến đấu] Né tránh thành công!');save();render();renderCombat()}
function flee(){if(!S.combat)return;if(Math.random()<.72){S.combat=null;$('#combat').classList.remove('show');log('[Chiến đấu] Rút lui thành công.')}else{log('[Chiến đấu] Thoát thân thất bại!');attack()}save();render()}
function craft(){if(S.p.herbs<5||S.p.gold<40){log('[Luyện đan] Cần 5 dược liệu và 40 linh tệ.');return}S.p.herbs-=5;S.p.gold-=40;S.p.pills+=Math.random()<.2?2:1;log('[Luyện đan] Luyện thành Phá Cảnh Đan.');render();open('alchemy')}
function upgrade(k,base,step,label){let cost=base+S.p[k]*step;if(S.p.gold<cost){log('['+label+'] Cần '+cost+' linh tệ.');return}S.p.gold-=cost;S.p[k]++;stats();log('['+label+'] Nâng lên +'+S.p[k]+'.');render();open(k==='manual'?'manuals':k==='sword'?'equipment':'forge')}
function usePill(){if(!S.p.pills){log('[Đan dược] Không còn Phá Cảnh Đan.');return}S.p.pills--;gain(120+S.p.realm*35);S.p.hp=Math.min(S.p.maxHp,S.p.hp+30);log('[Đan dược] Dùng Phá Cảnh Đan, tu vi tăng mạnh.');render();open('pills')}
function mail(){if(S.flags.starter){log('[Thư] Quà tân thủ đã nhận.');return}S.flags.starter=true;S.flags.mail=false;S.p.gold+=300;S.p.herbs+=10;S.p.gems+=20;S.p.pills+=2;log('[Thư] Nhận quà tân thủ.');render();open('mail')}
function buy(kind){let c=kind==='gold'?10:kind==='herbs'?8:15;if(S.p.gems<c){log('[Cửa hàng] Không đủ tiên ngọc.');return}S.p.gems-=c;if(kind==='gold')S.p.gold+=300;if(kind==='herbs')S.p.herbs+=8;if(kind==='pill')S.p.pills++;log('[Cửa hàng] Đổi tiên ngọc thành công.');render();open('shop')}
function sect(){if(S.flags.sect){log('[Tông môn] Hôm nay đã lĩnh bổng lộc.');return}S.flags.sect=true;S.p.gold+=180;S.p.sect+=20;gain(80);log('[Tông môn] Lĩnh bổng lộc: +180 linh tệ, +80 tu vi.');render();open('sect')}
function rift(){if(!S.flags.rift){log('[Bí cảnh] Hôm nay đã dùng lượt.');return}S.flags.rift=false;if(Math.random()<.55){let g=rnd(8,18);S.p.gems+=g;gain(rnd(100,180));if(Math.random()<.35)S.p.treasure++;log('[Bí cảnh] Cơ duyên: +'+g+' tiên ngọc.');render();open('rift')}else{close();startCombat()}}
function treasure(){if(!S.p.treasure){log('[Bảo vật] Không có bảo rương.');return}S.p.treasure--;let r=Math.random();if(r<.4)S.p.gold+=220;else if(r<.72)S.p.herbs+=10;else if(r<.92)S.p.pills++;else S.p.gems+=20;log('[Bảo vật] Mở rương nhận kỳ vật.');render();open('treasures')}
function nextLoc(){S.p.loc=(S.p.loc+1)%LOCS.length;log('[Thế giới] Di chuyển đến '+loc().name+'.');render()}
function rename(){let n=prompt('Nhập tên đạo hữu mới:',S.p.name);if(n&&n.trim()){S.p.name=n.trim().slice(0,14);save();render();open('settings')}}
function reset(){if(confirm('Xóa toàn bộ tiến độ?')){S=defState();save();render();close()}}
function head(t,s){return '<div class="head"><div><h2>'+t+'</h2><p>'+s+'</p></div><button class="close" onclick="closeGame()">Đóng</button></div>'}
function card(t,p,b){return '<div class="card"><h3>'+t+'</h3><p>'+p+'</p>'+(b||'')+'</div>'}
function open(type){let p=S.p,h='';
if(type==='mail')h=head('Thư','Quà tặng hệ thống.')+card('Quà tân thủ','300 linh tệ, 10 dược liệu, 20 tiên ngọc, 2 phá cảnh đan.','<button class="btn" onclick="claimMail()">Nhận quà</button>');
if(type==='rank')h=head('BXH','Xếp hạng nội bộ.')+card(p.name,realm().name+' • Lực chiến '+(p.atk+p.def+p.maxHp),'<div class="row"><span>Hạng</span><b>Top 1</b></div>');
if(type==='settings')h=head('Cài đặt','Dữ liệu lưu tự động trên máy.')+card('Tên nhân vật','Hiện tại: '+p.name,'<button class="btn blue" onclick="renameGame()">Đổi tên</button>')+card('Dữ liệu','Có thể bắt đầu lại bất cứ lúc nào.','<button class="btn red" onclick="resetGame()">Xóa tiến độ</button>');
if(type==='manuals')h=head('Công Pháp','Tăng hiệu suất tu luyện.')+card('Đạo Pháp Tự Nhiên +'+p.manual,'Tăng công kích và né tránh.','<button class="btn" onclick="upManual()">Nâng cấp • '+(80+p.manual*70)+' linh tệ</button>');
if(type==='equipment')h=head('Pháp Bảo','Cường hóa phi kiếm.')+card('Phi Kiếm +'+p.sword,'Tăng công kích và bạo kích.','<button class="btn" onclick="upSword()">Cường hóa • '+(100+p.sword*90)+' linh tệ</button>');
if(type==='forge')h=head('Luyện Khí','Cường hóa linh lô hộ thể.')+card('Linh Lô +'+p.forge,'Tăng khí huyết và phòng thủ.','<button class="btn" onclick="upForge()">Luyện khí • '+(90+p.forge*85)+' linh tệ</button>');
if(type==='alchemy')h=head('Luyện Đan','Chế luyện đan dược.')+card('Phá Cảnh Đan × '+p.pills,'5 dược liệu + 40 linh tệ.','<button class="btn purple" onclick="craftPill()">Luyện ngay</button>');
if(type==='treasures')h=head('Bảo Vật','Kỳ duyên tích lũy.')+card('Bảo rương × '+p.treasure,'Mở để nhận tài nguyên ngẫu nhiên.','<button class="btn" onclick="openTreasure()">Mở rương</button>');
if(type==='pills')h=head('Đan Dược','Dùng đan tăng tu vi.')+card('Phá Cảnh Đan × '+p.pills,'Dùng thủ công để tăng mạnh tu vi.','<button class="btn purple" onclick="usePillGame()">Dùng đan</button>');
if(type==='herbs')h=head('Dược Liệu','Nguyên liệu luyện đan.')+card('Dược liệu × '+p.herbs,'Kiếm thêm khi tu luyện, thám hiểm và đánh yêu.','<button class="btn blue" onclick="closeGame();exploreGame()">Đi thu thập</button>');
if(type==='rift')h=head('Bí Cảnh','Một lượt cơ duyên mỗi ngày.')+card('Tinh Vân Bí Cảnh',S.flags.rift?'Đang mở.':'Đã dùng lượt hôm nay.','<button class="btn green" onclick="enterRift()">Tiến vào</button>');
if(type==='sect')h=head('Tông Môn','Thanh Vân Tông.')+card('Cống hiến: '+p.sect,'Nhận bổng lộc hằng ngày.','<button class="btn green" onclick="claimSect()">Lĩnh bổng lộc</button>');
if(type==='world')h=head('Thế Giới','Chọn khu vực lịch luyện.')+card(loc().name,'Mức nguy hiểm '+loc().danger+'.','<button class="btn blue" onclick="nextLocation();openGame(\'world\')">Đổi khu vực</button>');
if(type==='shop')h=head('Cửa Hàng','Dùng tiên ngọc đổi tài nguyên.')+'<div class="grid">'+card('300 linh tệ','Giá 10 tiên ngọc.','<button class="btn" onclick="buyGold()">Đổi</button>')+card('8 dược liệu','Giá 8 tiên ngọc.','<button class="btn" onclick="buyHerbs()">Đổi</button>')+card('1 phá cảnh đan','Giá 15 tiên ngọc.','<button class="btn purple" onclick="buyPill()">Đổi</button>')+card('Tiên ngọc','Hiện có '+p.gems+'.','')+'</div>';
$('#modalBody').innerHTML=h;$('#modal').classList.add('show')}
function close(){$('#modal').classList.remove('show');if(!S.combat)$('#combat').classList.remove('show')}
function renderCombat(){if(!S.combat)return;let c=S.combat;$('#combatBody').innerHTML=head('Trảm Yêu','Đánh bại yêu thú để đoạt linh tài.')+'<div class="card enemy"><div class="enemyFace">'+c.face+'</div><div style="flex:1"><h3>'+c.name+'</h3><p>HP '+c.hp+'/'+c.maxHp+' • Công '+c.atk+' • Thủ '+c.def+'</p><div class="hpbar"><i style="width:'+pct(c.hp,c.maxHp)+'%"></i></div></div></div><div class="grid" style="margin-top:10px"><button class="btn red" onclick="attackGame()">Tấn công</button><button class="btn blue" onclick="fleeGame()">Rút lui</button></div>'}
function renderLog(){$('#log').innerHTML=S.logs.map(o=>'<div class="line"><b>'+o.x+'</b> <span>'+o.t+'</span></div>').join('')}
function render(){stats();let p=S.p,r=realm();$('#name').textContent=p.name;$('#realm').textContent=r.name;$('#gems').textContent=p.gems;$('#gold').textContent=p.gold;$('#herbs').textContent=p.herbs;$('#miniFill').style.width=pct(p.cult,r.need)+'%';$('#miniText').textContent=p.cult+' / '+r.need+' Tu Vi';$('#cultFill').style.width=pct(p.cult,r.need)+'%';$('#cultText').textContent='Tu Vi: '+p.cult+' / '+r.need;$('#hp').textContent=p.hp+'/'+p.maxHp;$('#atk').textContent=p.atk;$('#def').textContent=p.def;$('#dodge').textContent=p.dodge+'%';$('#crit').textContent=p.crit+'%';$('#loc').textContent=loc().name;$('#mailDot').style.display=S.flags.mail?'block':'none';renderLog();save()}
$$('[data-open]').forEach(b=>b.onclick=()=>open(b.dataset.open));
$('#cultivate').onclick=()=>cultivate(1);$('#fast').onclick=()=>cultivate(10);$('#explore').onclick=explore;$('#hunt').onclick=startCombat;$('#breakthrough').onclick=breakthrough;$('#nextLoc').onclick=nextLoc;
$('#modal').onclick=e=>{if(e.target.id==='modal')close()};$('#combat').onclick=e=>{if(e.target.id==='combat')flee()};
window.closeGame=close;window.openGame=open;window.claimMail=mail;window.renameGame=rename;window.resetGame=reset;window.upManual=()=>upgrade('manual',80,70,'Công pháp');window.upSword=()=>upgrade('sword',100,90,'Pháp bảo');window.upForge=()=>upgrade('forge',90,85,'Luyện khí');window.craftPill=craft;window.usePillGame=usePill;window.claimSect=sect;window.enterRift=rift;window.openTreasure=treasure;window.nextLocation=nextLoc;window.buyGold=()=>buy('gold');window.buyHerbs=()=>buy('herbs');window.buyPill=()=>buy('pill');window.attackGame=attack;window.fleeGame=flee;window.exploreGame=explore;
let day=new Date().toDateString();if(localStorage.getItem('tutien-day')!==day){localStorage.setItem('tutien-day',day);S.flags.sect=false;S.flags.rift=true;save()}
render();