(()=>{
const root=document.getElementById('app');
const load=(src)=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src});
const pngUrl=(canvas)=>canvas.toDataURL('image/png');

function roundRect(ctx,x,y,w,h,r,fill,stroke='#e8c26d',sw=3){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();ctx.lineWidth=sw;ctx.strokeStyle=stroke;ctx.stroke();
}
function panelPng(w,h){
  const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'rgba(14,36,61,.98)');g.addColorStop(1,'rgba(5,16,29,.95)');
  roundRect(x,3,3,w-6,h-6,Math.min(26,h*.28),g,'#e8c26d',3);
  x.strokeStyle='rgba(115,183,235,.45)';x.lineWidth=2;roundRect(x,9,9,w-18,h-18,Math.min(20,h*.22),'rgba(0,0,0,0)','rgba(115,183,235,.35)',2);
  return c;
}
async function cropPng(src,index,count){
  const im=await load(src);const sw=im.naturalWidth/count,sh=im.naturalHeight;
  const c=document.createElement('canvas');c.width=Math.round(sw);c.height=sh;
  c.getContext('2d').drawImage(im,Math.round(index*sw),0,Math.round(sw),sh,0,0,c.width,c.height);
  return pngUrl(c);
}
function resourcePng(kind){
  const c=panelPng(360,120),x=c.getContext('2d');
  if(kind==='gem'){x.fillStyle='#73d6ff';x.beginPath();x.moveTo(48,22);x.lineTo(85,43);x.lineTo(68,94);x.lineTo(29,94);x.lineTo(15,43);x.closePath();x.fill();x.strokeStyle='#eafaff';x.lineWidth=3;x.stroke()}
  if(kind==='gold'){x.fillStyle='#e8b33a';x.beginPath();x.arc(52,59,34,0,Math.PI*2);x.fill();x.strokeStyle='#fff0ae';x.lineWidth=4;x.stroke();x.strokeStyle='#7a551d';x.lineWidth=5;x.strokeRect(40,47,24,24)}
  if(kind==='herb'){x.strokeStyle='#83c36b';x.lineWidth=5;x.beginPath();x.moveTo(52,35);x.lineTo(83,92);x.stroke();[['#69b75c',40,38],['#8ccd71',67,46],['#5da955',43,65]].forEach(a=>{x.fillStyle=a[0];x.beginPath();x.ellipse(a[1],a[2],23,11,-.5,0,Math.PI*2);x.fill()})}
  x.fillStyle='rgba(4,14,26,.95)';x.strokeStyle='#e8c26d';x.lineWidth=3;x.beginPath();x.arc(305,60,33,0,Math.PI*2);x.fill();x.stroke();
  x.fillStyle='#fff0c8';x.fillRect(287,56,36,8);x.fillRect(301,42,8,36);
  return pngUrl(c);
}
function quickPng(type,label){
  const c=panelPng(220,220),x=c.getContext('2d');x.save();x.translate(110,80);x.lineWidth=8;x.strokeStyle='#f0cf7c';x.fillStyle='#fff1ce';
  if(type==='mail'){x.beginPath();x.roundRect(-55,-32,110,72,10);x.fill();x.stroke();x.strokeStyle='#8a6b3c';x.lineWidth=4;x.beginPath();x.moveTo(-50,-28);x.lineTo(0,8);x.lineTo(50,-28);x.stroke();x.fillStyle='#ff4949';x.beginPath();x.arc(52,-38,17,0,Math.PI*2);x.fill();x.strokeStyle='#e8c26d';x.stroke()}
  if(type==='rank'){x.fillStyle='#e4b544';x.beginPath();x.roundRect(-28,-38,56,62,8);x.fill();x.beginPath();x.arc(-32,-10,28,-1.2,1.2);x.stroke();x.beginPath();x.arc(32,-10,28,1.9,4.4);x.stroke();x.fillRect(-6,22,12,35);x.fillRect(-36,54,72,10)}
  if(type==='settings'){for(let a=0;a<8;a++){x.save();x.rotate(a*Math.PI/4);x.fillStyle='#e7c46f';x.fillRect(-7,-68,14,26);x.restore()}x.beginPath();x.arc(0,0,47,0,Math.PI*2);x.stroke();x.fillStyle='#68bce9';x.beginPath();x.arc(0,0,18,0,Math.PI*2);x.fill()}
  x.restore();x.textAlign='center';x.fillStyle='#fff0c8';x.font='700 26px system-ui';x.fillText(label,110,186);return pngUrl(c);
}
function statIcon(kind){
 const c=document.createElement('canvas');c.width=100;c.height=100;const x=c.getContext('2d');x.fillStyle='rgba(8,22,38,.9)';x.beginPath();x.arc(50,50,44,0,Math.PI*2);x.fill();x.strokeStyle='#e8c26d';x.lineWidth=4;x.stroke();
 if(kind==='hp'){x.fillStyle='#f24e59';x.beginPath();x.moveTo(50,78);x.bezierCurveTo(10,52,18,20,39,27);x.bezierCurveTo(47,30,50,39,50,39);x.bezierCurveTo(50,39,55,26,67,27);x.bezierCurveTo(91,30,87,58,50,78);x.fill()}
 if(kind==='atk'){x.strokeStyle='#eaf5ff';x.lineWidth=6;x.beginPath();x.moveTo(25,75);x.lineTo(74,26);x.moveTo(75,75);x.lineTo(26,26);x.stroke()}
 if(kind==='def'){x.fillStyle='#70aed8';x.beginPath();x.moveTo(50,20);x.lineTo(78,31);x.lineTo(72,67);x.lineTo(50,84);x.lineTo(28,67);x.lineTo(22,31);x.closePath();x.fill()}
 if(kind==='dodge'){x.fillStyle='#64aee0';x.beginPath();x.moveTo(25,62);x.lineTo(43,36);x.lineTo(58,40);x.lineTo(61,61);x.lineTo(78,71);x.lineTo(70,82);x.lineTo(35,78);x.closePath();x.fill()}
 if(kind==='crit'){x.fillStyle='#77c94f';[[39,39],[61,39],[39,61],[61,61]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,16,0,Math.PI*2);x.fill()})}
 return pngUrl(c);
}
function quotePng(){const c=panelPng(800,150),x=c.getContext('2d');x.strokeStyle='rgba(232,194,109,.6)';x.lineWidth=2;x.beginPath();x.moveTo(40,75);x.lineTo(760,75);x.stroke();return pngUrl(c)}
function fastPng(){const c=panelPng(360,120),x=c.getContext('2d');x.fillStyle='#ffd649';x.beginPath();x.moveTo(45,15);x.lineTo(84,15);x.lineTo(62,48);x.lineTo(90,48);x.lineTo(38,105);x.lineTo(52,62);x.lineTo(28,62);x.closePath();x.fill();x.fillStyle='#fff0c8';x.font='700 29px system-ui';x.fillText('Tăng Nhanh',112,72);return pngUrl(c)}
function blankPanel(w,h){return pngUrl(panelPng(w,h))}
function backgroundPng(){
 const w=768,h=1365,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
 let g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#cce9ff');g.addColorStop(.45,'#8fb8d2');g.addColorStop(1,'#203c50');x.fillStyle=g;x.fillRect(0,0,w,h);
 x.fillStyle='rgba(255,255,255,.55)';for(let i=0;i<42;i++){let cx=(i*193)%w,cy=250+((i*97)%650),rx=55+(i%5)*18,ry=18+(i%3)*7;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.fill()}
 const mountain=(base,amp,col,step)=>{x.fillStyle=col;x.beginPath();x.moveTo(0,h);for(let px=0;px<=w+step;px+=step){x.lineTo(px,base);x.lineTo(px+step/2,base-amp*(.55+((px/step)%3)/5));}x.lineTo(w,h);x.closePath();x.fill()};
 mountain(650,250,'rgba(77,108,127,.7)',90);mountain(820,310,'rgba(43,78,96,.88)',110);mountain(1010,260,'rgba(28,55,70,.98)',120);
 // heavenly gate
 x.fillStyle='rgba(225,230,226,.92)';x.fillRect(245,390,278,165);x.fillStyle='rgba(98,132,150,.48)';x.fillRect(330,433,108,122);
 x.fillStyle='#24384a';[[360,390,175],[345,355,145],[330,325,110]].forEach(([cy,yy,ww])=>{x.beginPath();x.moveTo(384-ww,yy);x.lineTo(384,yy-24);x.lineTo(384+ww,yy);x.lineTo(384+ww-18,yy+12);x.lineTo(384-ww+18,yy+12);x.closePath();x.fill()});
 // waterfalls
 x.fillStyle='rgba(235,251,255,.48)';[110,195,565,655].forEach(px=>x.fillRect(px,585,18,380));
 // foreground altar
 x.fillStyle='rgba(218,218,208,.88)';x.beginPath();x.ellipse(384,1130,520,190,0,0,Math.PI*2);x.fill();x.strokeStyle='rgba(226,190,110,.7)';x.lineWidth=5;x.stroke();
 // blossoms
 for(let i=0;i<95;i++){let side=i%2?1:-1,px=side<0?(i*37)%150:w-(i*53)%150,py=40+(i*83)%570;x.fillStyle=i%3?'#f6a9c8':'#ffd0df';x.beginPath();x.arc(px,py,4+(i%4),0,Math.PI*2);x.fill()}
 return pngUrl(c)
}
async function heroPng(){
 const base=await load('./public/img/cultivator.svg');const c=document.createElement('canvas');c.width=650;c.height=900;const x=c.getContext('2d');
 let glow=x.createRadialGradient(325,520,15,325,520,220);glow.addColorStop(0,'rgba(255,223,100,.5)');glow.addColorStop(1,'rgba(255,223,100,0)');x.fillStyle=glow;x.fillRect(80,260,490,500);
 x.drawImage(base,80,115,490,680);
 const sword=(cx,cy,tx,ty,col)=>{x.strokeStyle=col;x.lineWidth=10;x.beginPath();x.moveTo(cx,cy);x.lineTo(tx,ty);x.stroke();x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=3;x.stroke()};
 sword(125,330,55,110,'#f4c960');sword(525,330,600,120,'#75b6ff');sword(325,185,325,30,'#a8d9ff');
 for(let r=66;r>=12;r-=14){x.strokeStyle='rgba(255,220,105,'+(0.15+(66-r)/90)+')';x.lineWidth=4;x.beginPath();x.arc(325,550,r,0,Math.PI*2);x.stroke()}
 return pngUrl(c)
}
async function init(){
 try{
  document.getElementById('bgArt').src=backgroundPng();
  document.getElementById('heroArt').src=await heroPng();
  document.getElementById('profilePanelArt').src=blankPanel(900,270);
  document.getElementById('resGemArt').src=resourcePng('gem');document.getElementById('resGoldArt').src=resourcePng('gold');document.getElementById('resHerbArt').src=resourcePng('herb');
  document.getElementById('quickMailArt').src=quickPng('mail','Thư');document.getElementById('quickRankArt').src=quickPng('rank','BXH');document.getElementById('quickSettingsArt').src=quickPng('settings','Cài đặt');
  for(let i=0;i<10;i++)document.getElementById('side'+i).src=await cropPng('./assets/icons.webp',i,10);
  for(let i=0;i<4;i++)document.getElementById('action'+i).src=await cropPng('./assets/actions.webp',i,4);
  document.getElementById('quoteArt').src=quotePng();document.getElementById('fastArt').src=fastPng();
  document.getElementById('statsPanelArt').src=blankPanel(900,115);document.getElementById('logPanelArt').src=blankPanel(720,260);
  ['hp','atk','def','dodge','crit'].forEach((k,i)=>document.getElementById('stat'+i).src=statIcon(k));
 }catch(e){console.error('asset init',e)}
}
init();
})();