# Génère le même script en une seule prise avec plusieurs voix Gemini TTS féminines pour comparer.
import json, base64, subprocess, wave, time, sys
STYLE=("Lis ce texte publicitaire en français avec une voix de femme chaleureuse, naturelle et souriante, comme une conseillère immobilière "
       "qui parle à un client : rythme vivant mais jamais pressé, vraies pauses entre les phrases, accent français neutre : ")
TEXT=("Votre annonce passe inaperçue ? ... Avec Immo Clap, dix photos suffisent. ... Votre bien devient un film cinématique, en dix minutes. ... "
      "Plus de vues. Plus de visites. ... Vendez plus vite, avec Immo Clap.")
VOICES=sys.argv[1:] or ["Sulafat","Laomedeia","Aoede","Leda","Despina","Vindemiatrix"]
MODELS=["gemini-3.1-flash-tts-preview","gemini-3.8-flash-tts","gemini-2.5-pro-preview-tts"]
for v in VOICES:
    body={"contents":[{"parts":[{"text":STYLE+TEXT}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":v}}}}}
    json.dump(body,open("build/tts_body.json","w")); ok=False
    for m in MODELS:
        for _ in range(3):
            r=subprocess.run(["curl","-sS","-X","POST",f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent","-H","Content-Type: application/json","-d","@build/tts_body.json"],capture_output=True,text=True)
            try:
                pcm=base64.b64decode(json.loads(r.stdout)["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
                w=wave.open(f"audio/candidates/voix_{v}.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm); w.close()
                print(v,m,round(len(pcm)/48000,1),"s",flush=True); ok=True; break
            except Exception: time.sleep(3)
        if ok: break
    if not ok: print(v,"échec",r.stdout[:120],flush=True)
