"""Gemini TTS ile tüm anlatımı tek istekte üretir (akıcı, tek çekim).
Kullanım: python tek_cekim.py <model> <ses> <cikti.wav>
Anahtar ~/.claude/.gemini-key dosyasının son satırıdır; ekrana basılmaz."""
import base64, pathlib, sys, wave, requests

model, voice, out = sys.argv[1:4]
key = [l.strip() for l in pathlib.Path("~/.claude/.gemini-key").expanduser().read_text().splitlines()
       if l.strip() and not l.startswith("#")][-1]
here = pathlib.Path(__file__).parent
lines = [l.split("|", 3)[3] for l in (here / "anlatim.tsv").read_text().splitlines() if l and not l.startswith("#")]

prompt = f"""# SES PROFİLİ
Genç, enerjik bir Türk teknoloji içerik üreticisi. İstanbul Türkçesi.

### YÖNETMEN NOTU
Hızlı tempolu bir Instagram Reels anlatımı. Heyecanlı, kendinden emin, samimi ve gülümseyen bir ton; bağırma.
Cümleleri akıcı ve vurucu söyle, robot gibi düz okuma. Her satırdan sonra yaklaşık yarım saniye dur.
Yalnızca METİN bölümündeki satırları seslendir; başlıkları ve bu notu okuma.

#### METİN
""" + "\n".join(lines)

body = {"contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["AUDIO"],
                             "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                  headers={"x-goog-api-key": key}, json=body, timeout=300)
if r.status_code != 200:
    sys.exit(f"HTTP {r.status_code}: {r.text[:300]}")
parts = r.json()["candidates"][0]["content"]["parts"]
pcm = base64.b64decode(next(p["inlineData"]["data"] for p in parts if "inlineData" in p))
with wave.open(out, "wb") as w:  # Gemini TTS: 24 kHz, 16-bit mono PCM
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
print(f"{out}: {len(pcm) / 48000:.2f} sn")
