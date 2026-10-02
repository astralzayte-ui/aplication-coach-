import json, base64, subprocess, sys, concurrent.futures as cf
BASE="Photographie immobilière professionnelle, lumineuse, grand angle, style magazine, haute définition, aucune personne, aucun texte. Même villa moderne contemporaine (béton clair, bois chaud, grandes baies vitrées). "
SHOTS=[
 ("01_facade","Façade extérieure de la villa au coucher du soleil, ciel doré, jardin soigné"),
 ("02_entree","Hall d'entrée spacieux, escalier design, lumière naturelle"),
 ("03_salon","Grand salon lumineux, canapé beige, baie vitrée donnant sur le jardin"),
 ("04_cuisine","Cuisine ouverte moderne avec îlot en marbre blanc et bois"),
 ("05_salle_a_manger","Salle à manger élégante, grande table en bois, suspension design"),
 ("06_chambre","Chambre parentale cosy, lit king size, lin beige, lumière douce du matin"),
 ("07_sdb","Salle de bain luxueuse, baignoire îlot, pierre naturelle"),
 ("08_terrasse","Terrasse en bois avec salon d'extérieur, vue sur le jardin"),
 ("09_piscine","Piscine à débordement au crépuscule, éclairage chaud"),
 ("10_nuit","Façade de la villa de nuit, fenêtres éclairées, ambiance haut de gamme"),
]
def gen(s):
    name,desc=s
    body={"contents":[{"parts":[{"text":BASE+desc}]}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":"9:16"}}}
    for model in ["gemini-2.5-flash-image","gemini-3.1-flash-image","gemini-3.1-flash-image-preview"]:
        r=subprocess.run(["curl","-sS","-X","POST",f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent","-H","Content-Type: application/json","-d",json.dumps(body)],capture_output=True,text=True)
        try:
            d=json.loads(r.stdout)
            for p in d["candidates"][0]["content"]["parts"]:
                if "inlineData" in p:
                    open(f"photos/{name}.png","wb").write(base64.b64decode(p["inlineData"]["data"])); return name,model,"ok"
            err=str(d)[:150]
        except Exception as e: err=str(e)+r.stdout[:150]
    return name,"-",err
with cf.ThreadPoolExecutor(5) as ex:
    for r in ex.map(gen,SHOTS): print(r,flush=True)
