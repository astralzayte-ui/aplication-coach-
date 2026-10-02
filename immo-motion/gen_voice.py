# Génère la voix off phrase par phrase (timings exacts) puis assemble avec des pauses calibrées.
import json, base64, subprocess, wave, time
import numpy as np
STYLE="Dites avec une voix féminine chaleureuse, souriante et dynamique, rythme soutenu : "
LINES=[
 ("s1","Votre annonce passe inaperçue ?"),
 ("s2","Avec ImmoClap, dix photos suffisent."),
 ("s3","Votre bien devient un film cinématique, en dix minutes."),
 ("s4","Plus de vues."),
 ("s5","Plus de visites."),
 ("s6","Vendez plus vite, avec ImmoClap."),
]
MODELS=["gemini-3.1-flash-tts-preview","gemini-3.8-flash-tts","gemini-3.8-flash-lite-tts","gemini-2.5-flash-preview-tts"]
def tts(text,maxdur):
    body={"contents":[{"parts":[{"text":STYLE+text}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":"Kore"}}}}}
    json.dump(body,open("build/tts_body.json","w"))
    for m in MODELS:
        for attempt in range(4):
            r=subprocess.run(["curl","-sS","-X","POST",f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent","-H","Content-Type: application/json","-d","@build/tts_body.json"],capture_output=True,text=True)
            try:
                d=json.loads(r.stdout); a=np.frombuffer(base64.b64decode(d["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]),dtype=np.int16)
                if len(a)/24000<=maxdur: return m,a
                print("  trop long",m,round(len(a)/24000,1),"s, nouvel essai",flush=True)
            except Exception: pass
            time.sleep(3)
    raise SystemExit("TTS failed: "+r.stdout[:200])
import sys, os
only=set(sys.argv[1:])
out={}
for k,t in LINES:
    if only and k not in only: continue
    m,a=tts(t, len(t.split())*0.6+1.2)
    # coupe le silence de début/fin
    f=a.astype(np.float32)/32768; idx=np.where(np.abs(f)>0.012)[0]
    a=a[max(idx[0]-240,0):idx[-1]+360]
    out[k]=a
    w=wave.open(f"audio/{k}.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(a.tobytes()); w.close()
    print(k,m,round(len(a)/24000,2),"s",flush=True)
dur=json.load(open("build/voice_durations.json")) if os.path.exists("build/voice_durations.json") else {}
dur.update({k:len(v)/24000 for k,v in out.items()})
json.dump(dur,open("build/voice_durations.json","w"))
