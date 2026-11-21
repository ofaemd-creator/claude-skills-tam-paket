import base64,json,pathlib,sys,requests
key=[l.strip() for l in pathlib.Path("~/.claude/.gemini-key").expanduser().read_text().splitlines() if l.strip() and not l.startswith("#")][-1]
model,out=sys.argv[1],sys.argv[2]
prompt=("Instrumental only, no vocals. 46 seconds. Energetic modern tech-promo electronic track at 124 BPM, "
        "punchy tight drums, bright plucky synths, deep but clean bass (not boomy), sidechained pads, confident and optimistic. "
        "Starts immediately with the beat at full energy (no long intro), steady groove throughout, one small lift around 30 seconds, "
        "clean ending on a bar line. Leaves space in the mids for a voiceover.")
r=requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",headers={"x-goog-api-key":key},
  json={"contents":[{"parts":[{"text":prompt}]}],"generationConfig":{"responseModalities":["AUDIO"]}},timeout=600)
if r.status_code!=200: sys.exit(f"HTTP {r.status_code}: {r.text[:300]}")
parts=r.json()["candidates"][0]["content"]["parts"]
p=next(p for p in parts if "inlineData" in p)["inlineData"]
open(out,"wb").write(base64.b64decode(p["data"])); print(out,p.get("mimeType"))
