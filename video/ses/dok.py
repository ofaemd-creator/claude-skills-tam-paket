import base64,json,pathlib,subprocess,sys,requests
key=[l.strip() for l in pathlib.Path("~/.claude/.gemini-key").expanduser().read_text().splitlines() if l.strip() and not l.startswith("#")][-1]
cuts=[float(x) for x in sys.argv[2].split(",")]; src=sys.argv[1]; FF=str(pathlib.Path("~/.local/bin/ffmpeg").expanduser())
parts=[{"text":"Aşağıdaki her ses parçasını Türkçe olarak birebir yazıya dök. Yalnızca JSON dizi döndür: [\"parça1 metni\", ...]"}]
b=[0.0]+cuts+[None]
for i in range(len(b)-1):
    cmd=[FF,"-v","error","-i",src,"-ss",str(b[i])]+(["-to",str(b[i+1])] if b[i+1] else [])+["-f","mp3","-"]
    a=subprocess.run(cmd,capture_output=True).stdout
    parts+= [{"text":f"Parça {i+1}:"},{"inlineData":{"mimeType":"audio/mp3","data":base64.b64encode(a).decode()}}]
r=requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent",headers={"x-goog-api-key":key},json={"contents":[{"parts":parts}],"generationConfig":{"responseMimeType":"application/json"}},timeout=300)
if r.status_code!=200: sys.exit(r.text[:300])
t=json.loads(r.json()["candidates"][0]["content"]["parts"][0]["text"])
for i,x in enumerate(t): print(f"{i+1:2d} {b[i]:6.2f} {x}")
