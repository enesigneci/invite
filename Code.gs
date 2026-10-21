/**
 * Test davet sayfası — e-posta kaydedici (Google Apps Script)
 * Bir Google Sheet aç > Uzantılar > Apps Script > bu kodu yapıştır.
 * Dağıt > Yeni dağıtım > Web uygulaması
 *   Çalıştıran: Ben   |   Erişimi olan: Herkes
 * Çıkan URL'yi index.html içindeki CONFIG.sheetEndpoint alanına yaz.
 */

const CLIENT_ID = '1051045005730-mb179jgdgemshiua36bv4gkac3r14mua.apps.googleusercontent.com'; // index.html ile aynı
const SHEET_NAME = 'Testçiler';

// Otomatik grup ekleme sadece Cloud Identity / Workspace grubuyla çalışır; şu an kapalı (boş).
// Açmak istersen grup adresini yaz ve "Admin SDK API" hizmetini ekle.
const GROUP_EMAIL = '';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);

    // Google'ın imzalı kimlik jetonunu doğrula (sahte kayıtları engeller)
    const res = UrlFetchApp.fetch(
      'https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(body.credential),
      { muteHttpExceptions: true }
    );
    if (res.getResponseCode() !== 200) return out_({ ok: false, error: 'invalid_token' });
    const info = JSON.parse(res.getContentText());
    if (info.aud !== CLIENT_ID || info.email_verified !== 'true') return out_({ ok: false, error: 'bad_audience' });

    const sheet = getSheet_();
    const email = String(info.email).toLowerCase();
    const emails = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    const idx = emails.indexOf(email);
    const row = [new Date(), email, info.name || '', (body.apps || []).join(', ')];

    if (idx === -1) sheet.appendRow(row);
    else sheet.getRange(idx + 2, 1, 1, row.length).setValues([row]); // tekrar girişte güncelle

    return out_({ ok: true, joined: addToGroup_(email) });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Kişiyi gruba ekler. Eklendiyse ya da zaten üyeyse true döner.
function addToGroup_(email) {
  if (!GROUP_EMAIL) return false;
  try {
    AdminDirectory.Members.insert({ email: email, role: 'MEMBER' }, GROUP_EMAIL);
    return true;
  } catch (err) {
    if (/already exists/i.test(String(err))) return true;
    console.error('Gruba eklenemedi: ' + email + ' — ' + err);
    return false;
  }
}

// Kurulumu test etmek için Apps Script editöründen bir kez çalıştır.
function testGroupAccess() {
  const g = AdminDirectory.Groups.get(GROUP_EMAIL);
  console.log('Grup bulundu: ' + g.email + ' (' + g.directMembersCount + ' üye)');
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Zaman', 'E-posta', 'Ad', 'Uygulamalar']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
