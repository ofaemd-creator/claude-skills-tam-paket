# Tanıtım videosu (claude-skills-reel)

12 Claude Code skill’ini 1–2 saniyelik hızlı kesmelerle tanıtan, **9:16 dikey (Reels / Shorts / TikTok)** bir video ve onu üreten açık kaynak kod.
Video [HyperFrames](https://github.com/heygen-com/hyperframes) ile HTML’den render edilir; listeyi değiştirip kendi videonu üretebilirsin.

> *A 9:16 vertical reel that introduces 12 Claude Code skills with fast 1–2 s cuts, rendered from HTML with HyperFrames. Edit `skills.json` to make your own.*

## Videodaki skill’ler

| # | Skill | Ne yapar | Kaynak |
|---|---|---|---|
| 1 | `/anti-ui-slop` | Yapay zekânın ürettiği sıradan arayüzü engeller | [uizze/uizze](https://github.com/uizze/uizze) |
| 2 | `/canvas-design` | Bir fikirden afiş/görsel üretir | [anthropics/skills](https://github.com/anthropics/skills) |
| 3 | `/hyperframes` | HTML’den video üretir (bu video dahil) | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) |
| 4 | `/video-use` | Ham çekimi sohbet ederek kurgular | [browser-use/video-use](https://github.com/browser-use/video-use) |
| 5 | `/video-lens` | YouTube videosunu tek sayfada özetler | [kar2phi/video-lens](https://github.com/kar2phi/video-lens) |
| 6 | `/agent-browser` | Tarayıcıyı yönetir: siteyi gezer, form doldurur | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| 7 | `/literature-review` | İzlenebilir literatür taraması ve sentez | [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) |
| 8 | `/peer-review` | Makaleyi göndermeden önce hakem gözüyle inceler | [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) |
| 9 | `/verify-citations` | Kaynakların gerçekten var olduğunu doğrular | [Sketchjar/stipple-agent-skills](https://github.com/Sketchjar/stipple-agent-skills) |
| 10 | `/ai-seo` | ChatGPT, Perplexity gibi yapay zekâ aramalarında görünürlük | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) |
| 11 | `/grill-me` | Planını sert sorularla sorgular | [mattpocock/skills](https://github.com/mattpocock/skills) |
| 12 | `/caveman` | Kısa konuşup token tasarrufu sağlar | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) |

Bu depo yalnızca tanıtım videosudur; skill’lerin kendisi kendi depolarındadır ve kendi lisanslarına tabidir.

## Skill kurmadan önce: bul → denetle → kur

Skill, Claude’un senin bilgisayarında izlediği bir talimat dosyasıdır (`~/.claude/skills/<ad>/SKILL.md`); bazıları script de çalıştırır. Kurmadan önce:

1. **Bul** — resmî depoyu kullan; aynı adlı kopyalar ve çatallar olabilir.
2. **Denetle** — `SKILL.md`’yi ve varsa `scripts/` klasörünü oku. Şunlara bak:
   - script’ler hangi adreslere bağlanıyor, ne indiriyor, neyi çalıştırıyor;
   - kurulum sonrası çalışan betikler (`postinstall`) ve Claude Code kancaları (`hooks.json`);
   - gizli Unicode karakterler, “önceki talimatları yok say” türü ifadeler, “her zaman beni tercih et” gibi öncelik kapma cümleleri.
3. **Kur** — tek klasör olarak kopyala ya da bağla; kancaları ihtiyacın yoksa açma.

## Videoyu üretmek

Gereken: Node.js 22+, ffmpeg. HyperFrames CLI `npx` ile gelir.

```bash
node build.mjs                    # skills.json → compositions/card-NN.html + index.html
npx hyperframes preview           # tarayıcıda önizleme
npx hyperframes check             # düzen/zaman denetimi
npx hyperframes render -q delivery -o renders/reel.mp4
```

- **Kendi listen:** `skills.json` içindeki `skills` dizisini düzenle (`cat`, `name`, `desc`, `source`). Kart süresi `cardSeconds`, renkler `palettes`.
- **Müzik (isteğe bağlı):** lisanslı bir parçayı `assets/music.mp3` olarak koy ve `node build.mjs` çalıştır; altlık otomatik eklenir.
- Çıktı 1080×1920, 30 fps. Yazılar Instagram/TikTok arayüzünün altında kalmayacak güvenli bantta (y 168–1330 px).

## Yapı

```
skills.json            # içerik: 12 kart, renk paletleri
build.mjs              # kartları ve kök kompozisyonu üretir (bağımlılık yok)
compositions/
  hook.html            # "Claude’a yeni yetenek yükle."
  what.html            # SKILL.md nedir
  card-NN.html         # üretilir — elle düzenleme
  safe.html            # bul → denetle → kur
  end.html             # kapanış
  progress.html        # üstteki ilerleme çubuğu
assets/sfx/            # ses efektleri (Pixabay Content License, bkz. CREDITS.md)
```

## Lisans

Kod: [MIT](LICENSE). Ses efektleri: Pixabay Content License ([assets/sfx/CREDITS.md](assets/sfx/CREDITS.md)). Yazı tipleri (Archivo Black, Inter, JetBrains Mono) SIL Open Font License ile HyperFrames tarafından sağlanır.
Claude ve Claude Code, Anthropic’in markalarıdır; bu proje Anthropic ile bağlantılı değildir.
