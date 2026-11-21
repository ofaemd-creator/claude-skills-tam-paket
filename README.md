# Claude Skills — Tam Paket

Bilimsel makale yazmaktan yayına hazırlamaya, kendi hakemliğini yapmaktan dergi seçmeye kadar **Claude Code için 28 skill** tek pakette. Hepsi kurulmadan önce denetlendi: script, ağ bağlantısı, gizli talimat ve kanca (hook) taraması yapıldı.

> *A vetted bundle of 28 Claude Code skills for scientific writing, self peer-review, journal selection and publication prep — plus the source of the 9:16 reel that introduces them.*

## Kurulum

```bash
git clone https://github.com/ofaemd-creator/claude-skills-tam-paket.git
cd claude-skills-tam-paket
./install.sh --liste     # önce neyin kurulacağını gör
./install.sh             # 28 skill → ~/.claude/skills
./install.sh --hafif     # yalnızca pakette gelen 25 skill (git/ağ gerekmez)
```

- Aynı adla kurulu bir skill varsa **üzerine yazılmaz** (`--force` ile yazılır).
- Betik yalnızca dosya kopyalar, sabitlenmiş bir commit indirir ve bağlantı kurar; npm/pip kurulumu, dış script ya da Claude Code kancası çalıştırmaz.
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

Tanıtım videosunda geçen ama bu pakette olmayan skill'ler kendi resmî depolarından kurulur:

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

Bu paketteki 20 bilimsel skill, K-Dense'in kaynağından **script'leri çıkarılmış, yalnızca talimat** içeren sürümlerdir (her birinde `PROVENANCE.json`).

## Tanıtım videosu

`video/` klasörü, skill tanıtım Reels'i için açık kaynak bir [HyperFrames](https://github.com/heygen-com/hyperframes) şablonudur: `skills.json`'daki listeyi değiştirip kendi 9:16 videonu üretebilirsin. Ayrıntılar `video/README.md`'de.

## Lisans ve kaynaklar

Bu deponun kendi dosyaları (kurulum betiği, `languagetool-check`, video kodu): [MIT](LICENSE). Üçüncü taraf skill'ler kendi lisanslarıyla gelir; ayrıntılar [NOTICE.md](NOTICE.md) içinde.
Claude ve Claude Code, Anthropic'in markalarıdır; bu proje Anthropic ile bağlantılı değildir.
