# Musique synthétisée (120 BPM, La mineur), bruitages et mixage, calés sur timeline.json
import json, wave, subprocess
import numpy as np
from scipy.signal import butter, lfilter
SR=44100
TL=json.load(open("timeline.json")); TOTAL=TL["total"]+0.6
N=int(TOTAL*SR); rng=np.random.default_rng(7)
def t_(n): return np.arange(n)/SR
def hz(m): return 440*2**((m-69)/12)
def lp(x,f,o=2): b,a=butter(o,f/(SR/2),"low"); return lfilter(b,a,x)
def hp(x,f,o=2): b,a=butter(o,f/(SR/2),"high"); return lfilter(b,a,x)
def bp(x,lo,hi,o=2): b,a=butter(o,[lo/(SR/2),hi/(SR/2)],"band"); return lfilter(b,a,x)
def put(buf,t,x,g=1.0):
    i=int(t*SR)
    if i>=len(buf): return
    j=min(len(buf),i+len(x)); buf[i:j]+=g*x[:j-i]
def env_exp(n,tau): return np.exp(-t_(n)/tau)
# ---------- sons
def kick():
    n=int(0.45*SR); t=t_(n); f=45+120*np.exp(-t/0.04); ph=2*np.pi*np.cumsum(f)/SR
    return np.sin(ph)*env_exp(n,0.16)*(1-np.exp(-t/0.002))+0.25*np.random.default_rng(1).standard_normal(n)*env_exp(n,0.004)
def clap():
    n=int(0.25*SR); x=bp(rng.standard_normal(n),1200,5500)
    e=np.exp(-t_(n)/0.07)*(1+0.8*(np.sin(2*np.pi*90*t_(n))>0)*np.exp(-t_(n)/0.015)); return x*e*0.9
def hat(dec=0.035):
    n=int(0.15*SR); return hp(rng.standard_normal(n),7500)*env_exp(n,dec)*0.5
def pluck(m,dur=0.28):
    n=int(dur*SR); t=t_(n); f=hz(m)
    x=sum((1/(k))*np.sin(2*np.pi*f*k*t+0.3*k) for k in (1,2,3,4,5))
    return lp(x,2400)*env_exp(n,0.09)*(1-np.exp(-t/0.002))*0.35
def bass(m,dur=0.27):
    n=int(dur*SR); t=t_(n); f=hz(m); x=np.sin(2*np.pi*f*t)+0.5*np.sin(2*np.pi*2*f*t)*np.exp(-t/0.1)
    return np.tanh(1.6*x)*env_exp(n,0.5)*np.minimum(1,(dur-t)/0.02)*0.5
def pad(notes,dur):
    n=int(dur*SR); t=t_(n); x=np.zeros(n)
    for m in notes:
        for d in (-0.07,0,0.07):
            f=hz(m)*2**(d/12); x+=2*((f*t)%1)-1
    x=lp(x,1100); a=np.minimum(1,t/0.6)*np.minimum(1,(dur-t)/0.4); return x*a*0.05
def click(): n=int(0.05*SR); t=t_(n); return (np.sin(2*np.pi*2400*t)*env_exp(n,0.006)+0.6*hp(rng.standard_normal(n),4000)*env_exp(n,0.004))*0.5
def pop(): n=int(0.14*SR); t=t_(n); f=500+700*(1-np.exp(-t/0.03)); return np.sin(2*np.pi*np.cumsum(f)/SR)*env_exp(n,0.05)*0.5
def ding(f0=1318.5):
    n=int(2.4*SR); t=t_(n); x=sum(a*np.sin(2*np.pi*f0*r*t)*np.exp(-t/d) for a,r,d in ((1,1,1.0),(0.45,2.76,0.5),(0.3,5.4,0.25),(0.3,0.5,1.4)))
    return x*0.35
def impact(dur=1.6):
    n=int(dur*SR); t=t_(n); b=np.sin(2*np.pi*(38+60*np.exp(-t/0.12))*t)*env_exp(n,0.5); r=lp(rng.standard_normal(n),900)*env_exp(n,0.35)*0.8
    return (b+r)*0.9
def whoosh(dur=0.55,up=True):
    n=int(dur*SR); t=t_(n); x=rng.standard_normal(n); out=np.zeros(n); k=12
    for i in range(k):
        a,b=int(n*i/k),int(n*(i+1)/k); fc=(500+3800*((i+0.5)/k)**1.6) if up else (4300-3800*((i+0.5)/k)**1.6)
        out[a:b]=bp(x,fc*0.7,fc*1.3,2)[a:b]
    w=np.sin(np.pi*t/dur)**2; return out*w*1.6
def riser(dur):
    n=int(dur*SR); t=t_(n); x=rng.standard_normal(n); out=np.zeros(n); k=40
    for i in range(k):
        a,b=int(n*i/k),int(n*(i+1)/k); fc=300+9000*((i+0.5)/k)**2.2; out[a:b]=bp(x,fc*0.6,min(fc*1.5,19000),2)[a:b]
    return out*(t/dur)**2.2*0.9
# ---------- musique
BEAT=0.5; music=np.zeros(N); kdur=np.zeros(N)
CH=[[57,60,64],[53,57,60],[60,64,67],[55,59,62]]; ROOT=[33,29,36,31]
nb=int(TOTAL/BEAT); kicks=[]
S=TL["scenes"]
def sec(t):
    return "hook" if t<S["logo"][0] else "logo" if t<S["demo"][0] else "demo" if t<S["cta"][0] else "cta"
END_BEAT=TL["total"]-2.0   # la batterie s'arrête 2 s avant la fin
for b in range(nb):
    t=b*BEAT; bar=(b//4)%4; s=sec(t); drums=t<END_BEAT
    if s=="hook" and b%2==0 and t>=0.5: put(music,t,kick(),0.35)
    if t>=S["logo"][0] and drums:
        put(music,t,kick(),0.9); kicks.append(t)
        put(music,t+0.25,hat(),0.5); 
        if s in("demo","cta") and b%2==1: put(music,t,clap(),0.55)
        if s in("demo","cta"): put(music,t+0.125,hat(0.02),0.25); put(music,t+0.375,hat(0.02),0.25)
        # basse en croches
        for h,m in ((0,ROOT[bar]),(0.5,ROOT[bar]),):
            put(music,t+h*BEAT,bass(m+ (12 if (b%4==3 and h==0.5) else 0)),0.7)
    if s=="hook": put(music,t+0.25,hat(0.02),0.15)
    # arpège en doubles croches
    if t>=S["logo"][0] and t<TL["total"]-1.0:
        g=0.35 if s=="logo" else 0.55
        notes=CH[bar]
        for q in range(4):
            m=notes[[0,1,2,1][q]]+12
            put(music,t+q*BEAT/4,pluck(m),g*(1 if q%2==0 else 0.7))
for bar in range(int(TOTAL/2)+1):
    t=bar*2.0; put(music,t,pad(CH[bar%4]+[CH[bar%4][0]-12],2.2),1.0 if t>=2.5 else 0.8)
# fill de caisse claire avant le CTA
for i,tt in enumerate(np.arange(S["cta"][0]-1.0,S["cta"][0],0.125)): put(music,tt,clap(),0.2+0.5*i/8)
# sidechain (pompage) sur les kicks
duck=np.ones(N)
for kt in kicks:
    i=int(kt*SR); n=int(0.22*SR); j=min(N,i+n); duck[i:j]=np.minimum(duck[i:j],1-0.55*np.exp(-t_(n)[:j-i]/0.09))
music*=duck
fx=np.zeros(N)
put(fx,0.0,riser(S["logo"][0]),0.8)
for t0 in (S["logo"][0],S["demo"][0],S["cta"][0]): put(fx,t0-0.02,impact(),0.8)
music+=fx
# fondu final
fo=int(1.2*SR); music[-fo:]*=np.linspace(1,0,fo); music*=np.minimum(1,t_(N)/0.05)
# ---------- bruitages (clics, whoosh, ding, pop)
sfx=np.zeros(N); E=TL["ev"]
for w in TL["words"]: put(sfx,w,click(),0.8)
for c in (S["logo"][0],S["demo"][0],S["cta"][0]): put(sfx,c-0.25,whoosh(0.5,True),0.55)
for c in TL["cuts"]: put(sfx,c-0.18,whoosh(0.4,True),0.5)
for c in TL.get("soft",[]): put(sfx,c-0.12,whoosh(0.3,True),0.25)
put(sfx,E["wordmark"]+0.1,ding(),0.9)
for i,t0 in enumerate(E["thumbs"]): put(sfx,t0,click(),0.7)
put(sfx,E["ten"],pop(),0.7)
for k in ("lower","lower2","ring","views","visits","vendez","vite","lockup"): put(sfx,E[k],pop(),0.55)
put(sfx,E["lockup"]+0.05,ding(1568),0.6)
for i in range(6): put(sfx,E["ring"]+i*0.3,click(),0.25)
# ---------- voix (placée au bon timing)
voice=np.zeros(int(TOTAL*24000))
for k,t0 in TL["voice"].items():
    w=wave.open(f"audio/{k}.wav"); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768; w.close()
    a=a/ max(np.max(np.abs(a)),1e-3)*0.85; i=int(t0*24000); voice[i:i+len(a)]+=a[:len(voice)-i]
def wr(name,x,sr,stereo=False):
    x=np.clip(x,-1,1); d=(x*32767).astype(np.int16)
    if stereo: d=np.repeat(d[:,None],2,1)
    w=wave.open(name,"wb"); w.setnchannels(2 if stereo else 1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(d.tobytes()); w.close()
pk=lambda x: x/np.max(np.abs(x))
wr("audio/voice_track.wav",voice,24000); wr("audio/music.wav",pk(music)*0.9,SR); wr("audio/sfx.wav",pk(sfx)*0.9,SR)
# ---------- mixage (la musique baisse quand la voix parle)
fc=("[1:a]aresample=44100,highpass=f=90,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,volume=1.0,asplit=2[v][vs];"
    "[2:a]volume=0.62[m0];[m0][vs]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=300:makeup=1[md];"
    "[3:a]volume=0.55[sx];[v][md][sx]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=9,alimiter=limit=0.95[out]")
subprocess.run(["ffmpeg","-v","error","-y","-f","lavfi","-t",str(TOTAL),"-i","anullsrc=r=44100:cl=stereo","-i","audio/voice_track.wav","-i","audio/music.wav","-i","audio/sfx.wav",
   "-filter_complex",fc,"-map","[out]","-t",str(TL["total"]),"-ar","44100","-ac","2","audio/mix.wav"],check=True)
print("audio ok",TL["total"],"s")
