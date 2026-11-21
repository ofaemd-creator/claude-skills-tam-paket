---
name: languagetool-check
description: Makale metnini yerel, çevrimdışı LanguageTool 6.6 ile dilbilgisi/yazım/tekrar denetiminden geçirir (Paperpal/Grammarly tarzı ikinci göz). İngilizce (en-US/en-GB) içindir, Türkçe desteği yoktur; metin bilgisayardan çıkmaz. "Dilbilgisi kontrolü", "grammar check", "LanguageTool", dil düzenlemesinden sonra son kontrol istendiğinde kullan.
---

# LanguageTool denetimi (yerel)

Kurulum: resmî paketi https://languagetool.org/download/LanguageTool-stable.zip adresinden indirip açın; klasörü `LANGUAGETOOL_HOME` ortam değişkeniyle gösterin (varsayılan `~/LanguageTool/LanguageTool-6.6`). Java 17+ gerekir. Denetim ağ kullanmaz.

## Çalıştır

1. Metni düz metne çevir (docx → `textutil -convert txt dosya.docx`; PDF → `pdftotext` ya da Read ile oku). Kaynakça bölümünü çıkar: atıflar yanlış alarm üretir.
2. Denetle (8 GB RAM: -Xmx1g yeterli):
   ```bash
   java -Xmx1g -jar "${LANGUAGETOOL_HOME:-$HOME/LanguageTool/LanguageTool-6.6}/languagetool-commandline.jar" \
     -l en-US --json metin.txt > lt.json
   ```
   İngiliz yazımı isteyen dergi için `-l en-GB`. Gürültüyü azaltmak için `-d WHITESPACE_RULE,EN_QUOTES`.
3. JSON'daki `matches[]` bulgularını satır/bağlamla raporla; düzeltmeleri **sen değerlendir** — tıbbi terimler, kısaltmalar, istatistik gösterimi (P < .05, 95% CI) ve ilaç adları çoğunlukla yanlış alarmdır.

## Kurallar
- Bilimsel anlamı, sayıları, birimleri, atıfları değiştirme; yalnızca dil hatası düzelt.
- Bu bir ikinci göz: üslup/akış için `academic-language-editing`, yapay zekâ izi için `ai-writing-detox` kullan.
