// Builds compositions/card-NN.html and index.html from skills.json (+ ses/timing.json when narrated).
// Usage: node build.mjs   (no dependencies)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from "node:fs";

const url = (p) => new URL(p, import.meta.url);
const cfg = JSON.parse(readFileSync(url("./skills.json"), "utf8"));
const W = 1080, H = 1920;
const pad = (n) => String(n).padStart(2, "0");
const r2 = (x) => +x.toFixed(2);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// scene lengths follow the narration (ses/timing.json from ses/bol.py); without it, fixed defaults
const T = existsSync(url("./ses/timing.json")) ? JSON.parse(readFileSync(url("./ses/timing.json"), "utf8")) : {};
const vo = (id) => T[id]?.dur ?? 0;
const HOOK = r2(Math.max(2.2, vo("hook") + 0.3)), WHAT = r2(Math.max(2.7, vo("what") + 0.15));
const SAFE = r2(Math.max(3.3, vo("safe") + 0.75)), END = r2(Math.max(4.2, vo("end") + 2.2));
const cardDur = cfg.skills.map((_, i) => r2(Math.max(cfg.cardSeconds, vo(`c${pad(i + 1)}`) + 0.1)));
const cardsStart = HOOK + WHAT;
const cardStart = (i) => cardsStart + cardDur.slice(0, i).reduce((a, b) => a + b, 0);
const safeStart = cardStart(cfg.skills.length);
const endStart = safeStart + SAFE;
const total = r2(endStart + END);

// mono glyph ≈ 0.6em; keep the command inside an 840 px column
const fit = (name) => Math.min(110, Math.floor(840 / (name.length * 0.6)));

// 24×24 line icons (Lucide shapes, ISC). pathLength=1 lets every shape draw on with one dash tween.
const ICONS = {
  layout: '<rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="9" height="7" rx="1"/><rect x="16" y="14" width="5" height="7" rx="1"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  play: '<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M10 8.5v7l6-3.5z"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  trend: '<path d="M22 7 13.5 15.5 8.5 10.5 2 17"/><path d="M16 7h6v6"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
};
const icon = (k) => ICONS[k].replace(/<(path|rect|circle)/g, '<$1 pathLength="1"');

// Seam kinds, each caused by the outgoing card's colour leaving the frame: 0 wipe, 1 iris from the caret, 2 split, 3 flash cut
const KINDS = ["wipe", "iris", "split", "flash"];
const kindOf = (i) => KINDS[i % KINDS.length];

mkdirSync(url("./compositions/"), { recursive: true });
for (const f of readdirSync(url("./compositions/"))) if (/^card-\d+\.html$/.test(f)) unlinkSync(url(`./compositions/${f}`));

function card(i, s, C) {
  const id = `card-${pad(i + 1)}`, p = `c${pad(i + 1)}`;
  const pal = cfg.palettes[i % cfg.palettes.length];
  const prev = i === 0 ? "#0d1226" : cfg.palettes[(i - 1) % cfg.palettes.length].bg;
  const kind = kindOf(i), nextKind = kindOf(i + 1);
  const size = s.size ?? fit(s.name);
  const words = s.desc.split(" ").map((w, k) => `<span class="${p}-wm"><span id="${p}-w${k}" class="${p}-w">${esc(w)}</span></span>`).join(" ");
  const nWords = s.desc.split(" ").length;
  const blurWords = i % 2 === 0; // alternate word entrances: blur-in vs masked rise
  const vars = [
    { id: "num", type: "string", label: "Sıra", default: `${pad(i + 1)} / ${pad(cfg.skills.length)}` },
    { id: "cat", type: "string", label: "Kategori", default: s.cat },
    { id: "name", type: "string", label: "Skill adı", default: s.name },
    { id: "bg", type: "color", label: "Zemin", default: pal.bg },
    { id: "fg", type: "color", label: "Yazı", default: pal.fg },
    { id: "accent", type: "color", label: "Vurgu", default: pal.accent },
  ];
  const enter = {
    wipe: `tl.fromTo("#${p}-prev", { x: 0 }, { x: -${W}, duration: 0.26, ease: "power3.inOut" }, 0);
    tl.fromTo("#${p}-stage", { x: 220 }, { x: 0, duration: 0.3, ease: "power4.out" }, 0.04);`,
    iris: `tl.fromTo("#${p}-world", { clipPath: "circle(0% at 84% 28%)" }, { clipPath: "circle(150% at 84% 28%)", duration: 0.34, ease: "power3.in" }, 0);
    tl.fromTo("#${p}-stage", { scale: 1.12 }, { scale: 1, duration: 0.4, ease: "power3.out", transformOrigin: "50% 30%" }, 0.06);`,
    split: `tl.fromTo("#${p}-prevA", { y: 0 }, { y: -${H / 2}, duration: 0.28, ease: "power3.in" }, 0);
    tl.fromTo("#${p}-prevB", { y: 0 }, { y: ${H / 2}, duration: 0.28, ease: "power3.in" }, 0);
    tl.fromTo("#${p}-stage", { y: 90 }, { y: 0, duration: 0.34, ease: "power4.out" }, 0.08);`,
    flash: `tl.fromTo("#${p}-flash", { opacity: 1 }, { opacity: 0, duration: 0.16, ease: "power2.out" }, 0.02);
    tl.fromTo("#${p}-stage", { scale: 1.08 }, { scale: 1, duration: 0.3, ease: "power3.out", transformOrigin: "30% 35%" }, 0);`,
  }[kind];
  // exit matches the next seam's direction so speeds meet at the cut
  const exit = {
    wipe: `{ x: 0 }, { x: -260, duration: 0.14, ease: "power3.in", immediateRender: false }`,
    iris: `{ scale: 1 }, { scale: 0.9, duration: 0.14, ease: "power3.in", immediateRender: false, transformOrigin: "84% 28%" }`,
    split: `{ y: 0 }, { y: -70, duration: 0.14, ease: "power3.in", immediateRender: false }`,
    flash: `{ scale: 1 }, { scale: 1.06, duration: 0.1, ease: "power2.in", immediateRender: false }`,
  }[nextKind];
  const prevLayer = {
    wipe: `<div id="${p}-prev" class="${p}-full" style="background:${prev}"></div>`,
    iris: `<div id="${p}-prev" class="${p}-full" style="background:${prev}"></div>`,
    split: `<div id="${p}-prevA" class="${p}-half" style="top:0;background:${prev}"></div><div id="${p}-prevB" class="${p}-half" style="top:${H / 2}px;background:${prev}"></div>`,
    flash: `<div id="${p}-flash" class="${p}-full" style="background:#ffffff;z-index:5"></div>`,
  }[kind];
  const worldOpen = kind === "iris" ? `<div id="${p}-world" class="${p}-full">` : `<div id="${p}-world-static" class="${p}-full">`;
  return `<template>
  <html data-composition-variables='${JSON.stringify(vars).replace(/'/g, "&#39;")}'></html>
  <style>
    #root { position: absolute; inset: 0; overflow: hidden; }
    .${p}-full { position: absolute; inset: 0; }
    .${p}-half { position: absolute; left: 0; width: ${W}px; height: ${H / 2}px; z-index: 4; }
    #${p}-bg { position: absolute; inset: 0; background: var(--bg, ${pal.bg}); }
    #${p}-stage { position: absolute; inset: 0; color: var(--fg, ${pal.fg}); }
    #${p}-top { position: absolute; left: 88px; top: 250px; display: flex; gap: 22px; align-items: center; }
    #${p}-num { font: 700 38px/1 "JetBrains Mono", monospace; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; }
    #${p}-chip { font: 400 34px/1 "Archivo Black", sans-serif; letter-spacing: 0.08em; background: var(--accent, ${pal.accent}); color: var(--bg, ${pal.bg}); padding: 12px 20px 10px; border-radius: 6px; }
    #${p}-namewrap { position: absolute; left: 88px; top: 470px; width: 860px; }
    #${p}-name { font-family: "JetBrains Mono", monospace; font-weight: 700; font-size: ${size}px; line-height: 1.05; letter-spacing: -0.02em; white-space: nowrap; }
    #${p}-caret { display: inline-block; width: 0.5em; height: ${Math.round(size * 0.95)}px; margin-left: 6px; vertical-align: -0.12em; background: var(--accent, ${pal.accent}); }
    #${p}-rule { position: absolute; left: 88px; top: 700px; width: 200px; height: 12px; background: var(--accent, ${pal.accent}); }
    #${p}-desc { position: absolute; left: 88px; top: 770px; width: 820px; font: 400 100px/1.04 "Archivo Black", sans-serif; letter-spacing: -0.01em; }
    .${p}-wm { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: 0.06em; }
    .${p}-w { display: inline-block; }
    #${p}-icon { position: absolute; left: 88px; top: 1110px; width: 200px; height: 200px; }
    #${p}-icon svg { width: 100%; height: 100%; fill: none; stroke: var(--accent, ${pal.accent}); stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
    #${p}-icon svg * { stroke-dasharray: 1; }
    #${p}-tex { position: absolute; left: 40px; top: 1440px; white-space: nowrap; font: 400 380px/1 "Archivo Black", sans-serif; color: transparent; -webkit-text-stroke: 4px var(--accent, ${pal.accent}); opacity: 0.45; }
  </style>
  <div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
    ${kind === "iris" ? prevLayer : ""}
    ${worldOpen}
      <div id="${p}-bg"></div>
      <div id="${p}-stage" data-layout-allow-overflow>
        <div id="${p}-tex" data-var-text="cat" data-layout-ignore>${esc(s.cat)}</div>
        <div id="${p}-top">
          <span id="${p}-num" data-var-text="num">${pad(i + 1)} / ${pad(cfg.skills.length)}</span>
          <span id="${p}-chip" data-var-text="cat">${esc(s.cat)}</span>
        </div>
        <div id="${p}-namewrap"><span id="${p}-name" data-var-text="name">${esc(s.name)}</span><span id="${p}-caret"></span></div>
        <div id="${p}-rule"></div>
        <div id="${p}-desc">${words}</div>
        <div id="${p}-icon" data-layout-ignore><svg viewBox="0 0 24 24">${icon(s.icon ?? "zap")}</svg></div>
      </div>
    </div>
    ${kind === "iris" ? "" : prevLayer}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    ${enter}
    tl.fromTo("#${p}-top", { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.22, ease: "power3.out" }, 0.08);
    tl.fromTo("#${p}-name", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.34, ease: "steps(${Math.max(6, s.name.length)})" }, 0.1);
    tl.fromTo("#${p}-caret", { opacity: 0 }, { opacity: 1, duration: 0.01 }, 0.44);
    tl.fromTo("#${p}-caret", { opacity: 1 }, { opacity: 0, duration: 0.01, immediateRender: false }, 0.8);
    tl.fromTo("#${p}-caret", { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, 1.15);
    tl.fromTo("#${p}-rule", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.22, ease: "power4.out" }, 0.2);
    ${blurWords
      ? `tl.fromTo(".${p}-w", { opacity: 0, filter: "blur(10px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.14, ease: "power2.out", stagger: 0.07 }, 0.24);`
      : `tl.fromTo(".${p}-w", { yPercent: 105 }, { yPercent: 0, duration: 0.24, ease: "power4.out", stagger: 0.07 }, 0.24);`}
    tl.fromTo("#${p}-icon svg *", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut", stagger: 0.06 }, ${r2(0.3 + nWords * 0.05)});
    tl.fromTo("#${p}-icon", { rotation: -8, scale: 0.86 }, { rotation: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }, ${r2(0.3 + nWords * 0.05)});
    tl.fromTo("#${p}-tex", { x: 0 }, { x: -240, duration: ${C}, ease: "none" }, 0);
    tl.fromTo("#${p}-stage", ${exit}, ${r2(C - 0.14)});
    window.__timelines["${id}"] = tl;
  </script>
</template>
`;
}

const hosts = [];
const sfx = [];
const host = (id, src, start, dur) =>
  `      <div id="${id}" data-composition-id="${id}" data-composition-src="${src}" data-start="${r2(start)}" data-duration="${r2(dur)}" data-width="${W}" data-height="${H}" data-track-index="1" data-track-kind="graphics"></div>`;
// measured with `npx hyperframes audio <file> --json` (moments.peak, after any trim):
// a hit is placed so its peak lands one frame after the picture event
const PEAK = { pop: 0.12, whoosh: 0.162, "whoosh-short": 0.162, "impact-bass-1": 0.073, "impact-bass-2": 0.022, sparkle: 0.027, "click-soft": 0.073, typing: 0.034, "glitch-1": 0.128, riser: 1.57 };
const hit = (file, event, vol = 1, dur, mediaStart) =>
  sfx.push({ file, at: +Math.max(0, event + 1 / 30 - PEAK[file]).toFixed(3), vol, dur, mediaStart });

hosts.push(host("hook", "compositions/hook.html", 0, HOOK));
hit("pop", 0.3, 0.8); hit("pop", 0.62, 0.8); hit("impact-bass-1", 1.0, 0.9); hit("sparkle", 1.3, 0.5);
hosts.push(host("what", "compositions/what.html", HOOK, WHAT));
hit("whoosh", HOOK, 0.9); hit("typing", HOOK + 0.12, 0.45, 1.0, 0.42);
cfg.skills.forEach((s, i) => {
  const id = `card-${pad(i + 1)}`;
  writeFileSync(url(`./compositions/${id}.html`), card(i, s, cardDur[i]));
  const t = cardStart(i);
  hosts.push(host(id, `compositions/${id}.html`, t, cardDur[i]));
  ({
    wipe: () => hit("whoosh", t + 0.1, 0.85),
    iris: () => hit("pop", t + 0.2, 0.7),
    split: () => hit("whoosh", t + 0.14, 0.8),
    flash: () => hit("glitch-1", t, 0.45, 0.45, 0.35),
  })[kindOf(i)]();
});
hosts.push(host("safe", "compositions/safe.html", safeStart, SAFE));
hit("impact-bass-2", safeStart, 0.9);
(T.safe ? [T.safe.lines[2], T.safe.lines[2] + 0.5, T.safe.lines[2] + 1.05] : [0.85, 1.45, 2.05]).forEach((d) => hit("click-soft", safeStart + d, 0.8));
hosts.push(host("end", "compositions/end.html", endStart, END));
hit("whoosh", endStart, 0.85);
const stamp = endStart + (T.end ? T.end.lines[1] + 0.1 : 2.2);
hit("riser", stamp, 0.6, 1.6, 1.9); hit("impact-bass-1", stamp, 0.9);

const scenes = { hook: 0, what: HOOK, ...Object.fromEntries(cfg.skills.map((_, i) => [`c${pad(i + 1)}`, cardStart(i)])), safe: safeStart, end: endStart };
const voTags = Object.keys(T).filter((id) => existsSync(url(`./assets/vo/${id}.wav`))).map((id) =>
  `      <audio id="vo-${id}" class="clip" src="assets/vo/${id}.wav" data-start="${r2(scenes[id])}" data-duration="${r2(T[id].dur)}" data-volume="1" data-track-index="6"></audio>`).join("\n");
const sfxGain = voTags ? 0.55 : 1; // effects sit under the narration
const hasMusic = existsSync(url("./assets/music.mp3")); // optional bed: drop any licensed track here
// file lengths (s) of the bundled Pixabay effects; every clip gets an explicit duration
const LEN = { "click-soft": 0.36, "glitch-1": 2.6, pop: 0.72, "impact-bass-1": 2.1, "impact-bass-2": 2.59, riser: 10, sparkle: 1.8, typing: 1.54, "whoosh-short": 0.57, whoosh: 0.57 };
const laneEnds = []; // greedy lanes so no two effects overlap on one track
const audio = sfx.map((a, k) => {
  const dur = r2(Math.min(a.dur ?? LEN[a.file], total - a.at));
  let lane = laneEnds.findIndex((e) => e <= a.at);
  if (lane < 0) lane = laneEnds.push(0) - 1;
  laneEnds[lane] = a.at + dur;
  return `      <audio id="sfx-${pad(k + 1)}" class="clip" src="assets/sfx/${a.file}.mp3" data-start="${a.at}" data-duration="${dur}"${a.mediaStart ? ` data-media-start="${a.mediaStart}"` : ""} data-volume="${r2(a.vol * sfxGain)}" data-track-index="${10 + lane}"></audio>`;
}).join("\n");

const index = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #0d1226; }
      #root { width: 100%; height: 100%; position: relative; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}" data-motion-blur="on" data-motion-blur-shutter="200">
${hosts.join("\n")}
      <div id="progress" data-composition-id="progress" data-composition-src="compositions/progress.html" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}" data-track-index="2" data-track-kind="graphics" data-variable-values='{"seconds":${total}}' style="z-index:50"></div>
${hasMusic ? `      <audio id="music" class="clip" src="assets/music.mp3" data-start="0" data-duration="${total}" data-volume="0.3" data-fade-out="1.2" data-track-index="5"></audio>\n` : ""}${voTags}
${audio}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
writeFileSync(url("./index.html"), index);
console.log(`ok: ${cfg.skills.length} kart, ${sfx.length} efekt, ${total} sn | geçişler ${cfg.skills.map((_, i) => kindOf(i)).join(" ")}`);
