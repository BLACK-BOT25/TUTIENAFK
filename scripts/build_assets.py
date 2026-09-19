from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random, subprocess, sys

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"assets"/"ui"
OUT.mkdir(parents=True,exist_ok=True)

GOLD=(222,180,92,255); PALE=(255,240,200,255); NAVY=(6,18,34,235); NAVY2=(11,31,52,245)
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SERIF="/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SERIFB="/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

def font(path,size):
    return ImageFont.truetype(path,size)

def save(im,name):
    im.save(OUT/name,optimize=True)

def rr(draw,box,r=24,fill=NAVY,outline=GOLD,w=3):
    draw.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=w)

def fit(im,box):
    x,y,w,h=box
    s=min(w/im.width,h/im.height)
    nw,nh=int(im.width*s),int(im.height*s)
    im=im.resize((nw,nh),Image.Resampling.LANCZOS)
    return im,(x+(w-nw)//2,y+(h-nh)//2)

def split_strip(src,n,names):
    p=ROOT/src
    if not p.exists(): return False
    im=Image.open(p).convert("RGBA")
    for i,name in enumerate(names):
        x0=round(im.width*i/n); x1=round(im.width*(i+1)/n)
        crop=im.crop((x0,0,x1,im.height))
        a=crop.getchannel("A")
        bb=a.point(lambda p:255 if p>8 else 0).getbbox()
        if bb: crop=crop.crop(bb)
        save(crop,name)
    return True

# ---------- background ----------
W,H=768,1365
bg=Image.new("RGB",(W,H))
px=bg.load()
for y in range(H):
    t=y/(H-1)
    if t<.55:
        a=t/.55; c=(int(190-55*a),int(220-45*a),int(244-28*a))
    else:
        a=(t-.55)/.45; c=(int(135-92*a),int(175-116*a),int(216-135*a))
    for x in range(W): px[x,y]=c
d=ImageDraw.Draw(bg,"RGBA")
random.seed(11)
# sun / qi beam
for r,alpha in [(150,20),(95,28),(48,38)]:
    d.ellipse((W//2-r,100-r,W//2+r,100+r),fill=(220,244,255,alpha))
d.rectangle((W//2-3,0,W//2+3,430),fill=(170,235,255,95))
# distant mountains
for layer,(base,col) in enumerate([(535,(111,146,168,125)),(670,(73,111,132,165)),(820,(43,78,95,210))]):
    pts=[(-40,H)]
    step=60
    for x in range(-40,W+80,step):
        peak=base-random.randint(40,190)
        pts += [(x,base+40),(x+step//2,peak),(x+step,base+40)]
    pts += [(W+40,H)]
    d.polygon(pts,fill=col)
# floating islands
for cx,cy,sz in [(135,330,72),(625,300,84),(100,500,48),(665,510,54),(260,220,42),(520,205,48)]:
    d.ellipse((cx-sz,cy-sz//3,cx+sz,cy+sz//3),fill=(70,91,95,210))
    d.polygon([(cx-sz+8,cy),(cx+sz-8,cy),(cx+sz//3,cy+sz*2),(cx,cy+sz*3),(cx-sz//3,cy+sz*2)],fill=(63,79,84,205))
    # tiny pagoda
    d.rectangle((cx-10,cy-18,cx+10,cy),fill=(54,58,62,230))
    d.polygon([(cx-18,cy-18),(cx,cy-30),(cx+18,cy-18)],fill=(42,49,60,235))
# central gate
gx=W//2
d.rectangle((gx-145,390,gx+145,555),fill=(220,226,224,225),outline=(185,159,106,230),width=4)
d.rectangle((gx-68,435,gx+68,555),fill=(104,133,147,130))
d.arc((gx-72,425,gx+72,570),180,360,fill=(80,102,116,230),width=8)
for x in [gx-125,gx+125]:
    d.rectangle((x-9,375,x+9,570),fill=(225,227,219,235))
# multi roof
for yy,ww in [(376,190),(348,150),(323,105)]:
    d.polygon([(gx-ww,yy),(gx,yy-28),(gx+ww,yy),(gx+ww-18,yy+12),(gx-ww+18,yy+12)],fill=(41,58,74,245),outline=(184,146,76,230))
# waterfalls
for x in [95,177,590,675,310,460]:
    d.rounded_rectangle((x,570,x+18,1030),8,fill=(220,245,255,115))
# foreground terrace
d.ellipse((85,945,683,1260),fill=(205,207,199,225),outline=(222,180,92,220),width=6)
d.ellipse((150,995,618,1190),outline=(222,180,92,180),width=4)
# cherry branches
for side in [0,1]:
    bx=0 if side==0 else W
    for i in range(65):
        x=bx+(random.randint(0,165) if side==0 else -random.randint(0,165))
        y=random.randint(60,520)
        r=random.randint(3,8)
        d.ellipse((x-r,y-r,x+r,y+r),fill=(255,145+random.randint(0,60),200+random.randint(0,40),180))
# mist overlay
mist=Image.new("RGBA",(W,H),(0,0,0,0)); md=ImageDraw.Draw(mist)
for i in range(80):
    x=random.randint(-100,W+100); y=random.randint(450,1100); rx=random.randint(50,150); ry=random.randint(20,60)
    md.ellipse((x-rx,y-ry,x+rx,y+ry),fill=(245,250,255,random.randint(10,32)))
mist=mist.filter(ImageFilter.GaussianBlur(20))
bg=Image.alpha_composite(bg.convert("RGBA"),mist)
save(bg,"bg-main.png")

# ---------- hero ----------
try:
    import cairosvg
    svg=(ROOT/"public"/"img"/"cultivator.svg")
    cairosvg.svg2png(url=str(svg),write_to=str(OUT/"_hero_base.png"),output_width=520,output_height=720)
    hb=Image.open(OUT/"_hero_base.png").convert("RGBA")
except Exception:
    hb=Image.new("RGBA",(520,720),(0,0,0,0))
    hd=ImageDraw.Draw(hb)
    hd.ellipse((205,45,315,155),fill=(224,190,160,255))
    hd.polygon([(120,210),(400,210),(455,680),(65,680)],fill=(235,236,228,255))
hero=Image.new("RGBA",(650,900),(0,0,0,0))
glow=Image.new("RGBA",hero.size,(0,0,0,0)); gd=ImageDraw.Draw(glow)
gd.ellipse((125,220,525,720),fill=(255,210,70,38))
glow=glow.filter(ImageFilter.GaussianBlur(30))
hero=Image.alpha_composite(hero,glow)
hb,(hx,hy)=fit(hb,(65,135,520,720)); hero.alpha_composite(hb,(hx,hy))
hd=ImageDraw.Draw(hero,"RGBA")
# swords
for ang,color,cx,cy in [(-25,(255,211,95,230),130,280),(25,(135,190,255,230),520,280),(0,(190,225,255,230),325,120)]:
    L=220; rad=math.radians(ang-90)
    x2=cx+math.cos(rad)*L; y2=cy+math.sin(rad)*L
    hd.line((cx,cy,x2,y2),fill=color,width=10)
    hd.line((cx,cy,x2,y2),fill=(255,255,255,180),width=3)
# orb
for r,a in [(70,35),(48,70),(28,170),(12,255)]:
    hd.ellipse((325-r,505-r,325+r,505+r),fill=(255,210,65,a),outline=(255,235,170,min(255,a+60)),width=2)
save(hero,"hero-main.png")
try:(OUT/"_hero_base.png").unlink()
except:pass

# ---------- generic panel builders ----------
def panel(size,title=None):
    im=Image.new("RGBA",size,(0,0,0,0)); dr=ImageDraw.Draw(im)
    rr(dr,(4,4,size[0]-5,size[1]-5),min(28,size[1]//3),(6,18,34,235),GOLD,3)
    if title:
        dr.text((20,12),title,font=font(BOLD,max(16,size[1]//5)),fill=PALE)
    return im

# profile blank art
im=panel((900,270)); dr=ImageDraw.Draw(im)
# circular portrait pulled from avatar
av=Image.open(ROOT/"assets"/"avatar.webp").convert("RGBA")
av,(ax,ay)=fit(av,(25,25,210,210)); mask=Image.new("L",av.size,0); ImageDraw.Draw(mask).ellipse((0,0,av.width-1,av.height-1),fill=255); av.putalpha(mask)
im.alpha_composite(av,(ax,ay))
dr.ellipse((20,20,245,245),outline=GOLD,width=6)
dr.line((265,78,850,78),fill=(222,180,92,120),width=2)
dr.rounded_rectangle((270,174,840,224),22,fill=(2,10,20,180),outline=GOLD,width=2)
save(im,"hud-profile.png")

# resources
for name,kind in [("resource-gem.png","gem"),("resource-gold.png","gold"),("resource-herb.png","herb")]:
    im=panel((420,150)); dr=ImageDraw.Draw(im)
    if kind=="gem":
        pts=[(58,30),(95,54),(80,108),(36,108),(20,54)]
        dr.polygon(pts,fill=(95,205,255,255),outline=(220,245,255,255))
        dr.line((20,54,95,54),fill=(255,255,255,180),width=2)
    elif kind=="gold":
        dr.ellipse((25,28,108,111),fill=(232,180,45,255),outline=(255,230,150,255),width=4)
        dr.rectangle((52,50,82,83),outline=(110,75,20,255),width=4)
    else:
        for off,ang in [((48,42),0),((72,54),0),((45,74),0)]:
            dr.ellipse((off[0]-22,off[1]-12,off[0]+22,off[1]+12),fill=(95,190,78,255),outline=(200,245,150,255))
        dr.line((60,45,92,105),fill=(100,170,75,255),width=5)
    dr.ellipse((330,28,395,93),fill=(10,27,47,255),outline=GOLD,width=3)
    dr.line((345,60,380,60),fill=PALE,width=6); dr.line((362,43,362,77),fill=PALE,width=6)
    save(im,name)

# top quick buttons
for name,label,kind in [("btn-mail.png","Thư","mail"),("btn-rank.png","BXH","cup"),("btn-settings.png","Cài đặt","gear")]:
    im=panel((230,230)); dr=ImageDraw.Draw(im)
    cx,cy=115,85
    if kind=="mail":
        dr.rounded_rectangle((55,50,175,125),12,fill=(246,240,220,255),outline=GOLD,width=4)
        dr.line((58,55,115,98,172,55),fill=(120,90,50,255),width=4)
        dr.ellipse((165,25,205,65),fill=(245,62,62,255),outline=GOLD,width=3)
    elif kind=="cup":
        dr.rounded_rectangle((88,48,142,112),8,fill=(238,185,60,255),outline=PALE,width=3)
        dr.arc((55,50,100,105),70,290,fill=GOLD,width=7); dr.arc((130,50,175,105),250,110,fill=GOLD,width=7)
        dr.rectangle((108,110,122,143),fill=GOLD); dr.rectangle((80,140,150,151),fill=GOLD)
    else:
        for a in range(0,360,45):
            r1,r2=58,76; ca,sa=math.cos(math.radians(a)),math.sin(math.radians(a))
            dr.line((cx+ca*r1,cy+sa*r1,cx+ca*r2,cy+sa*r2),fill=GOLD,width=12)
        dr.ellipse((65,35,165,135),outline=GOLD,width=14); dr.ellipse((95,65,135,105),fill=(80,175,230,255))
    box=dr.textbbox((0,0),label,font=font(BOLD,28)); dr.text(((230-(box[2]-box[0]))/2,172),label,font=font(BOLD,28),fill=PALE)
    save(im,name)

# split art strips already in repo
split_strip("assets/actions.webp",4,["action-cultivate.png","action-explore.png","action-hunt.png","action-breakthrough.png"])
split_strip("assets/icons.webp",10,["btn-manuals.png","btn-equipment.png","btn-forge.png","btn-alchemy.png","btn-treasures.png","btn-pills.png","btn-herbs.png","btn-rift.png","btn-sect.png","btn-world.png"])

# fallback side buttons if split failed
for name,label,sym in [
("btn-manuals.png","Công Pháp","📜"),("btn-equipment.png","Pháp Bảo","⚔"),("btn-forge.png","Luyện Khí","◉"),("btn-alchemy.png","Luyện Đan","●"),("btn-treasures.png","Bảo Vật","▣"),
("btn-pills.png","Đan Dược","◌"),("btn-herbs.png","Dược Liệu","✦"),("btn-rift.png","Bí Cảnh","◎"),("btn-sect.png","Tông Môn","⌂"),("btn-world.png","Thế Giới","◇")]:
    if (OUT/name).exists(): continue
    im=Image.new("RGBA",(220,220),(0,0,0,0)); dr=ImageDraw.Draw(im)
    dr.ellipse((28,10,192,174),fill=(7,19,34,245),outline=GOLD,width=5)
    tb=dr.textbbox((0,0),sym,font=font(BOLD,70)); dr.text(((220-(tb[2]-tb[0]))/2,48),sym,font=font(BOLD,70),fill=PALE)
    tb=dr.textbbox((0,0),label,font=font(BOLD,22)); dr.text(((220-(tb[2]-tb[0]))/2,182),label,font=font(BOLD,22),fill=PALE)
    save(im,name)

# action fallbacks
for name,label,sub,col in [
("action-cultivate.png","Tu luyện","Hấp thu linh khí",(124,85,26,255)),
("action-explore.png","Thám hiểm","Khám phá thiên hạ",(33,78,110,255)),
("action-hunt.png","Trảm yêu","Rèn luyện bản thân",(103,33,34,255)),
("action-breakthrough.png","Đột phá","Vượt qua bình cảnh",(72,44,112,255))]:
    p=OUT/name
    if p.exists(): continue
    im=panel((520,180)); dr=ImageDraw.Draw(im); dr.rounded_rectangle((6,6,513,173),24,fill=col,outline=GOLD,width=4)
    dr.text((26,74),label,font=font(SERIFB,44),fill=PALE); dr.text((28,130),sub,font=font(SERIF,24),fill=(240,240,240,255))
    save(im,name)

# quote panel
im=panel((800,170)); dr=ImageDraw.Draw(im)
dr.text((55,50),"“Đạo tâm bất diệt, vạn pháp giai khả thành.”",font=font(SERIFB,27),fill=PALE)
save(im,"quote-panel.png")

# cultivation bar decorative base, without dynamic fill
im=panel((800,165)); dr=ImageDraw.Draw(im)
dr.rounded_rectangle((45,35,755,78),20,fill=(2,10,18,255),outline=GOLD,width=3)
dr.text((305,102),"Tu Vi",font=font(SERIFB,30),fill=PALE)
save(im,"cultivation-bar.png")

# fast
im=panel((360,130)); dr=ImageDraw.Draw(im)
dr.polygon([(48,20),(93,20),(69,57),(98,57),(43,112),(56,70),(30,70)],fill=(255,205,55,255))
dr.text((120,45),"Tăng Nhanh",font=font(BOLD,30),fill=PALE)
save(im,"btn-fast.png")

# stats panel
im=panel((900,115)); dr=ImageDraw.Draw(im)
for x in [180,360,540,720]: dr.line((x,22,x,94),fill=(222,180,92,100),width=2)
save(im,"panel-stats.png")

# stat icons
for name,label,kind in [("stat-hp.png","Khí Huyết","heart"),("stat-atk.png","Công Kích","sword"),("stat-def.png","Phòng Thủ","shield"),("stat-dodge.png","Né Tránh","boot"),("stat-crit.png","Tỷ Lệ Bạo","clover")]:
    im=Image.new("RGBA",(190,190),(0,0,0,0)); dr=ImageDraw.Draw(im)
    dr.ellipse((28,10,162,144),fill=(6,18,34,245),outline=GOLD,width=4)
    if kind=="heart":
        dr.polygon([(95,120),(45,70),(55,45),(80,40),(95,58),(110,40),(135,45),(145,70)],fill=(235,55,65,255))
    elif kind=="sword":
        dr.line((55,110,130,35),fill=(215,235,250,255),width=10); dr.line((135,110,60,35),fill=(215,235,250,255),width=10)
    elif kind=="shield":
        dr.polygon([(95,32),(137,47),(130,103),(95,128),(60,103),(53,47)],fill=(102,170,225,255),outline=PALE)
    elif kind=="boot":
        dr.polygon([(68,42),(105,45),(102,91),(135,106),(126,124),(65,116),(52,98),(70,82)],fill=(70,155,220,255))
    else:
        for cx,cy in [(80,62),(110,62),(80,92),(110,92)]: dr.ellipse((cx-22,cy-22,cx+22,cy+22),fill=(100,210,70,255))
    tb=dr.textbbox((0,0),label,font=font(BOLD,20)); dr.text(((190-(tb[2]-tb[0]))/2,153),label,font=font(BOLD,20),fill=PALE)
    save(im,name)

# log and location
im=panel((720,260)); dr=ImageDraw.Draw(im); dr.text((24,16),"Hệ Thống",font=font(BOLD,28),fill=PALE); dr.line((170,34,685,34),fill=GOLD,width=2); save(im,"panel-log.png")
locimg=Image.open(ROOT/"assets"/"location.webp").convert("RGBA") if (ROOT/"assets"/"location.webp").exists() else bg
locimg,_=fit(locimg,(0,0,400,260)); card=panel((400,260)); card.alpha_composite(locimg,(0,0)); cd=ImageDraw.Draw(card); cd.rectangle((0,195,400,260),fill=(3,10,18,210)); save(card,"card-location.png")

# decorative independent pieces
im=Image.new("RGBA",(260,260),(0,0,0,0)); dr=ImageDraw.Draw(im); dr.ellipse((15,15,245,245),outline=GOLD,width=14); dr.ellipse((32,32,228,228),outline=(82,130,190,255),width=6); save(im,"frame-avatar.png")
im=Image.new("RGBA",(110,110),(0,0,0,0)); ImageDraw.Draw(im).ellipse((10,10,100,100),fill=(245,56,56,255),outline=GOLD,width=5); save(im,"badge-notify.png")
im=Image.new("RGBA",(150,150),(0,0,0,0)); dr=ImageDraw.Draw(im); dr.ellipse((10,10,140,140),fill=(6,18,34,255),outline=GOLD,width=5); dr.line((43,75,107,75),fill=PALE,width=10); dr.line((75,43,75,107),fill=PALE,width=10); save(im,"btn-plus.png")
# corner/divider flourishes
im=Image.new("RGBA",(500,320),(0,0,0,0)); dr=ImageDraw.Draw(im); dr.line((15,145,15,15,230,15),fill=GOLD,width=8); dr.line((485,145,485,15,270,15),fill=GOLD,width=8); save(im,"frame-corners.png")
for name,size in [("decor-clouds.png",(500,220)),("decor-dividers.png",(720,180)),("decor-long-dividers.png",(900,120))]:
    im=Image.new("RGBA",size,(0,0,0,0)); dr=ImageDraw.Draw(im); y=size[1]//2
    dr.line((25,y,size[0]-25,y),fill=GOLD,width=3)
    for x in [size[0]//2-20,size[0]//2,size[0]//2+20]: dr.ellipse((x-5,y-5,x+5,y+5),fill=(95,175,235,255),outline=GOLD,width=2)
    save(im,name)

print("generated",len(list(OUT.glob("*.png"))),"png assets")
