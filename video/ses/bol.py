"""Tek çekim anlatımı sahne gruplarına böler → assets/vo/<id>.wav + ses/timing.json"""
import json, pathlib, subprocess
here = pathlib.Path(__file__).parent; root = here.parent
FF = str(pathlib.Path("~/.local/bin/ffmpeg").expanduser())
cuts = [float(x) for x in (here / "cuts.txt").read_text().strip().split(",")]
b = [0.0] + cuts + [float(subprocess.run([FF.replace("ffmpeg", "ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(here / "vo_puck.wav")], capture_output=True, text=True).stdout)]
# parça (1 tabanlı, dahil) aralıkları: Gemini dökümüyle eşlendi
groups = {"hook": (1, 1), "what": (2, 3), **{f"c{i:02d}": (i + 3, i + 3) for i in range(1, 13)}, "safe": (16, 18), "end": (19, 21)}
timing = {}
for gid, (a, z) in groups.items():
    s, e = b[a - 1], b[z]
    timing[gid] = {"dur": round(e - s, 3), "lines": [round(b[k - 1] - s, 3) for k in range(a, z + 1)]}
    subprocess.run([FF, "-v", "error", "-y", "-ss", str(s), "-to", str(e), "-i", str(here / "vo_puck.wav"),
                    "-af", "afade=t=in:d=0.01,afade=t=out:st=%.3f:d=0.04" % max(0, e - s - 0.04), "-ar", "48000",
                    str(root / "assets/vo" / f"{gid}.wav")], check=True)
(here / "timing.json").write_text(json.dumps(timing, indent=1))
print({k: v["dur"] for k, v in timing.items()}); print("safe", timing["safe"]["lines"], "end", timing["end"]["lines"], "what", timing["what"]["lines"])
