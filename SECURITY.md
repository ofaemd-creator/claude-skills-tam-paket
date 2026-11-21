# İnceleme ve dağıtım sınırları — v1.1

Bu sürüm 37 skill giriş metni içerir. 25 mevcut beceri korunmuş, 3 akademik ve 9 ek beceri çevrimdışı metin uyarlaması olarak dahil edilmiştir. Mevcut dosyalar otomatik silinmez. Kaynak sürümler `SOURCES_LOCK.json` içinde sabitlenmiştir; ek bileşenlerde orijinal SKILL.md karşılaştırma için korunmuştur.

Yapılanlar: seçilen metin ve lisansları okuma, dış servis/komut/anahtar/hook/yönlendirici talimat kalıpları taraması, kaynaktan alınan metinlerde Git blob hash kontrolü, kurulumda SHA-256 dosya kontrolü ve geçici hedeflerde gerçek kurulum testleri. Kaynak komutlar ve üçüncü taraf kodlar çalıştırılmadı. Bu, tüm satırların bağımsız güvenlik denetimi, davranışsal prompt-enjeksiyon testi veya sıfır açık garantisi değildir.

Yeni skill girişleri harici script çalıştırma, otomatik paket/model indirme, kimlik bilgisi okuma, zorunlu satıcı atfı ve arka plan ajan süreçlerini etkinleştirmez. Referans metinleri yine güvenilmeyen veri olarak değerlendirilmelidir. Ek üç akademik skill'in karmaşık upstream agent/kalibrasyon motorları değil, temel iş akışlarının yerel uyarlamaları dağıtılır. Yeni dokuz genel becerinin uygulama runtime'ları kurulmaz.

Skill bir talimat dosyasıdır; çalıştığı asistanın araçlarına ve yetkilerine bağlıdır. Bu paket bir işletim sistemi sandbox'ı oluşturmaz ve bulut asistanını çevrimdışı yapmaz. Gizli makale, hasta verisi veya özel medya ek dış servislere ayrıca yetki ve uygun politika kontrolü olmadan gönderilmemelidir.

Yanlış sonuç, uydurma kaynak veya intihal eksiksiz şekilde engellenmiş sayılmaz. Kaynak varlığı kadar iddiayı destekleyip desteklemediği de doğrulanmalıdır. Q1/SCIE kapsamı güncel resmi kayıtlarla ve yıl/kategori belirtilerek kontrol edilir. Yayın kabulü garanti edilemez. Tanıtım videosundaki örnek belgeler, dergiler ve sayılar gösterim amaçlıdır.

`SHA256SUMS` bütünlük kontrolü, dosyaların dağıtılan sürümden değişip değişmediğini gösterir; içerik güvenilirliği veya imzalı yayıncı kimliği kanıtı değildir. Şüpheli içerik veya kurulum sorunu için depoda issue açın; kişisel dosya ve anahtar paylaşmayın.
