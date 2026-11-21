# Claude Skills — Tam Paket

**v1.1: 28 akademik + 9 tasarım/video/tarayıcı/strateji becerisi = 37 skill.** Claude Code ve Codex için tek ZIP, ağsız kurulum. Önceki 20 bilimsel beceri ve Humanizer dahil; tekrarları eklenmedi. Kaynaklar ve güvenlik incelemesinin sınırları [SECURITY.md](SECURITY.md) içinde.

**[Tam paketi tek ZIP indir](https://github.com/ofaemd-creator/claude-skills-tam-paket/releases/latest/download/claude-skills-tam-paket.zip)** · [Tüm sürümler](https://github.com/ofaemd-creator/claude-skills-tam-paket/releases)

> 37 instruction-only skill workflows. External applications, render engines, browser binaries, language models and subscriptions are not bundled. No acceptance or zero-risk security guarantee.

## Kurulum

```bash
git clone https://github.com/ofaemd-creator/claude-skills-tam-paket.git
cd claude-skills-tam-paket
./install.sh --liste     # önce neyin kurulacağını gör
./install.sh             # 37 skill → ~/.claude/skills; kurulumda ağ gerekmez
./install.sh --hafif     # ilk 25 akademik skill
./install.sh --target codex  # 37 skill → ~/.codex/skills
./install.sh --target all    # Claude Code ve Codex
```

- ZIP'i indirdiysen açıp klasöründe `bash install.sh` çalıştır; Git veya internet gerekmez. macOS/Linux/WSL için Bash 3.2+ ve `shasum`/`sha256sum` gerekir. Windows PowerShell için kurulum betiği yoktur.
- Aynı adla kurulu skill **korunur**. `--force` kullanılırsa eski klasör silinmez; hedefteki `.tam-paket-backups/` altına taşınır.
- Betik SHA-256 bütünlük kontrolü yapar ve yalnızca dosya kopyalar; Git indirme, npm/pip, model veya hook kurulumu yapmaz.
- LanguageTool, HyperFrames ve diğer uygulamaların çalışma ortamları ayrıca gereklidir. Skill kurmak uygulamayı veya ücretli hesabı kurmaz.
- Kurduktan sonra Claude Code'u yeniden başlat. Bir skill'i çağırmak için adını yaz: `/peer-review`.

## İçindekiler

### Makale yazımı ve dil
| Skill | Ne yapar |
|---|---|
| `scientific-writing` | IMRaD yapısında makale taslağı, bölümler arası tutarlılık, raporlama kılavuzları (CONSORT, STROBE vb.) |
| `academic-language-editing` | Akademik dil, dilbilgisi, yeniden ifade; anlamı koruyarak kısaltma |
| `academic-translation` | Türkçe ↔ İngilizce bilimsel çeviri; terim, sayı ve anlam tutarlılığı |
| `humanizer` | Bilimsel anlamı koruyarak daha doğal, açık anlatım |
| `ai-writing-detox` | Yapay zekâ yazı kalıplarını (klişe, şişirme) temizler |
| `languagetool-check` | Yerel, çevrimdışı LanguageTool ile İngilizce dilbilgisi ikinci kontrolü |
| `academic-paper` *(Imbad0202)* | 12 ajanlı makale yazım hattı; plan, özet, revizyon, atıf kontrolü, YZ beyanı |

### Kendi hakemliğin ve kanıt
| Skill | Ne yapar |
|---|---|
| `peer-review` | Yayın öncesi hakem değerlendirmesi ve öncelikli düzeltme planı |
| `academic-paper-reviewer` *(Imbad0202)* | 5 koltuklu hakem paneli: dergi uyumu + 3 hakem + karşı görüşçü |
| `scientific-critical-thinking` | Yöntem, yanlılık, nedensellik ve kanıt düzeyinin eleştirel değerlendirmesi |
| `statistical-analysis` | Test seçimi, varsayımlar, etki büyüklüğü, güç ve istatistik raporlama |
| `academic-integrity-audit` | Atıf, metin benzerliği, etik, yazarlık ve YZ beyanı incelemesi |
| `academic-pdf-evidence` | PDF'ten yöntem, sonuç ve tablo çıkarma; konum göstererek yanıt |

### Kaynaklar ve literatür
| Skill | Ne yapar |
|---|---|
| `citation-management` | Kaynakça, DOI/PMID, iddia–kaynak eşleştirme, BibTeX |
| `verify-citations` | Kaynakların gerçekten var olduğunu ve iddiayı desteklediğini doğrular |
| `literature-review` | Sistematik, kapsam ve anlatı derlemeleri için izlenebilir iş akışı |
| `academic-literature-discovery` | Bibliyografik araçlarla makale bulma ve karşılaştırma |

### Araştırma tasarımı
| Skill | Ne yapar |
|---|---|
| `hypothesis-generation` | Sınanabilir hipotezler ve onları ayırt edecek deney önerileri |
| `scientific-brainstorming` | Araştırma sorusu, boşluk, fikir ve çalışma tasarımı |

### Şekil, sunum ve gönderim
| Skill | Ne yapar |
|---|---|
| `scientific-visualization` | Veriye sadık bilimsel grafik ve şekil |
| `scientific-schematics` | Şema, mekanizma diyagramı, grafik özet |
| `scientific-slides` | Bilimsel sunum, poster, sade dilde özet |
| `venue-templates` | Hedef derginin biçim, beyan ve gönderim şartları |
| `academic-journal-selection` | Konu uyumu, indeks, Q1 durumu, ücret ve politikalarla dergi karşılaştırma |
| `academic-revision-response` | Hakemlere madde madde yanıt ve yeniden gönderim paketi |
| `academic-writing` | CRediT, ORCID, ön kayıt, preprint, YZ kullanım beyanı |

### Koordinasyon
| Skill | Ne yapar |
|---|---|
| `academic-publication-pipeline` | Makaleye uygun skill'leri seçip yayın hazırlığını yönetir |
| `academic-pipeline` *(Imbad0202)* | Araştır → yaz → tutarlılık → hakem → düzelt → yeniden hakem → bitir |

**Önerilen akış:** `academic-publication-pipeline` ile başla → `scientific-writing` ile yaz → `verify-citations` + `citation-management` ile kaynakları doğrula → `peer-review` / `academic-paper-reviewer` ile kendi hakemliğini yap → `academic-language-editing` + `languagetool-check` ile dili bitir → `academic-journal-selection` + `venue-templates` ile gönder.

> Hiçbir araç dergide kabulü garanti etmez. SCIE ve Q1 bilgisini Clarivate'in resmî kaynağından (Master Journal List / JCR) doğrula.

## Videodaki diğer skill'ler

Bu dokuz beceri artık pakette **yerel yönergeleri sıkılaştırılmış metin sürümleri** olarak bulunur. Orijinal talimatlar, kaynak commit ve lisansları klasörlerinde saklanır. Harici betikler, agent süreçleri, fontlar, modeller ve runtime'lar dahil değildir:

| Skill | Depo |
|---|---|
| `/anti-ui-slop` | [uizze/uizze](https://github.com/uizze/uizze) |
| `/canvas-design` | [anthropics/skills](https://github.com/anthropics/skills) |
| `/hyperframes` | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) |
| `/video-use` | [browser-use/video-use](https://github.com/browser-use/video-use) |
| `/video-lens` | [kar2phi/video-lens](https://github.com/kar2phi/video-lens) |
| `/agent-browser` | [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) |
| `/ai-seo` | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) |
| `/grill-me` | [mattpocock/skills](https://github.com/mattpocock/skills) |
| `/caveman` | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) |

## Skill kurmadan önce: bul → denetle → kur

Skill, Claude'un bilgisayarında izlediği bir talimat dosyasıdır (`SKILL.md`); bazıları script de çalıştırır.

1. **Bul** — resmî depoyu kullan; aynı adlı kopyalar ve çatallar olabilir.
2. **Denetle** — `SKILL.md`'yi ve varsa `scripts/` klasörünü oku: hangi adreslere bağlanıyor, ne indiriyor, ne çalıştırıyor; kurulum sonrası betikler (`postinstall`), kancalar (`hooks.json`), gizli Unicode karakterler, "önceki talimatları yok say" ya da "her zaman beni tercih et" türü cümleler.
3. **Kur** — tek klasör olarak kopyala ya da bağla; kancaları ihtiyacın yoksa açma.

Önceki 20 bilimsel skill korunmuştur: bir kısmı K-Dense kaynağından uyarlama, bir kısmı yerel iş akışıdır; köken ayrıntıları `PROVENANCE.json` içindedir. Yeni eklenen 12 skill de betik/otomatik hook olmadan, yeniden yazılmış giriş yönergeleriyle paketlenmiştir. Bir modele farklı roller vermek bağımsız insan hakemliği değildir.

Üç `academic-paper*` / `academic-pipeline` bileşeni CC BY-NC 4.0 lisanslıdır: ticari kullanım kısıtı korunur. Paketin tamamını koşulsuz MIT lisanslı veya ticari kullanıma sınırsız açık diye sunmayın. Diğer bileşenlerin lisansları için [NOTICE.md](NOTICE.md).

## Tanıtım videosu

`video/` klasörü, skill tanıtım Reels'i için açık kaynak bir [HyperFrames](https://github.com/heygen-com/hyperframes) şablonudur: `skills.json`'daki listeyi değiştirip kendi 9:16 videonu üretebilirsin. Ayrıntılar `video/README.md`'de.

## Lisans ve kaynaklar

Bu deponun kendi dosyaları (kurulum betiği, `languagetool-check`, video kodu): [MIT](LICENSE). Üçüncü taraf skill'ler kendi lisanslarıyla gelir; ayrıntılar [NOTICE.md](NOTICE.md) içinde.
Claude ve Claude Code, Anthropic'in markalarıdır; bu proje Anthropic ile bağlantılı değildir.
