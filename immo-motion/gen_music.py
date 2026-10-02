import json, base64, subprocess
body={"contents":[{"parts":[{"text":"Instrumental only, no vocals. 30 seconds. Dynamic modern upbeat electronic pop for a real estate advertisement: punchy kick, bright plucks, uplifting build, confident and premium, 120 BPM."}]}],"generationConfig":{"responseModalities":["AUDIO","TEXT"]}}
for model in ["lyria-3-clip-preview","lyria-3.5","lyria-3-pro-preview"]:
    r=subprocess.run(["curl","-sS","-X","POST",f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent","-H","Content-Type: application/json","-d",json.dumps(body)],capture_output=True,text=True)
    try:
        d=json.loads(r.stdout)
        for p in d["candidates"][0]["content"]["parts"]:
            if "inlineData" in p:
                mt=p["inlineData"]["mimeType"]; open("audio/music_raw","wb").write(base64.b64decode(p["inlineData"]["data"])); print("music ok",model,mt); raise SystemExit
        print(model,"no audio",r.stdout[:200])
    except SystemExit: break
    except Exception as e: print(model,"fail",r.stdout[:300])
