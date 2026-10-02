import json, base64, subprocess, wave
TEXT="Dites avec une voix féminine chaleureuse, souriante et dynamique, rythme soutenu : Votre annonce passe inaperçue ? Avec Immo Motion, dix photos suffisent. Votre bien devient un film, en quelques minutes. Plus de vues. Plus de visites. Vendez plus vite, avec Immo Motion."
body={"contents":[{"parts":[{"text":TEXT}]}],"generationConfig":{"responseModalities":["AUDIO"],"speechConfig":{"voiceConfig":{"prebuiltVoiceConfig":{"voiceName":"Kore"}}}}}
for model in ["gemini-3.1-flash-tts-preview","gemini-3.8-flash-tts","gemini-2.5-flash-preview-tts","gemini-2.5-pro-preview-tts"]:
    r=subprocess.run(["curl","-sS","-X","POST",f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent","-H","Content-Type: application/json","-d",json.dumps(body)],capture_output=True,text=True)
    try:
        d=json.loads(r.stdout); pcm=base64.b64decode(d["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
        w=wave.open("audio/voice.wav","wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm); w.close()
        print("voice ok",model,len(pcm)/48000,"s"); break
    except Exception as e: print(model,"fail",r.stdout[:200])
