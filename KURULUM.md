# Test Davet Sitesi — invite.enesigneci.com

Davet edilen kişinin yaptığı: Google ile giriş → test grubuna katıl → her uygulamada "Testçi ol" → "Yükle".

## Kurulu olanlar
| Parça | Nerede | Hesap |
|---|---|---|
| Google Grubu | `enes-app-testers@googlegroups.com` (herkes katılabilir, üye listesini sadece sahip görür) | zeynepakyoligneci@gmail.com |
| Play Console kapalı test | Pourcery (`com.pourcery`) ve Vocab5K (`com.vocab5k.app`) → Alpha kanalı, testçiler = yukarıdaki grup | zeynepakyoligneci@gmail.com |
| Google girişi | Cloud projesi `enes-test-davet`, uygulama adı "Enes Test Daveti", yayında (production) | zeynepakyoligneci@gmail.com |
| DNS | Cloudflare: CNAME `invite` → `enesigneci.github.io` (DNS only / gri bulut) | enesigneci@gmail.com |
| Site | GitHub Pages, repo `enesigneci/invite`, `CNAME` dosyası | enesigneci (GitHub) |

## Uygulama eklemek / çıkarmak
`index.html` → `CONFIG.apps` dizisine satır ekle/sil. Yeni uygulamanın Play Console'daki kapalı test kanalında
**Test kullanıcıları → Google Gruplar → `enes-app-testers@googlegroups.com`** seçili olmalı.

## Kimin katıldığını görmek (isteğe bağlı)
1. zeynepakyoligneci@gmail.com ile yeni Google Sheet → **Uzantılar → Apps Script** → `Code.gs` içeriğini yapıştır.
2. Proje ayarları → "appsscript.json'u göster" → bu klasördeki `appsscript.json` ile değiştir.
3. **Dağıt → Yeni dağıtım → Web uygulaması** — Çalıştıran: *Ben*, Erişim: *Herkes*.
4. Çıkan URL'yi `index.html` → `CONFIG.sheetEndpoint`'e yaz ve siteyi güncelle.

Grup üyelerini ayrıca https://groups.google.com/g/enes-app-testers/members adresinden de görebilirsin.

## Hatırlatma
Uygulama başına **en az 12, tercihen 15–20 testçi**, **14 gün** kesintisiz testte kalmalı.
