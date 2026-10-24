// Paste into Extensions > Apps Script from your Google Sheet.
const SPREADSHEET_ID = '18Zr7fzVQluB5rJWnpqRP6NNdUWJfK-ejELH_9nyot8U';
const QUOTE_TAB = 'Quote Requests';
function doPost(e) {
  function reply(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
  let lock;
  try {
    const data = JSON.parse(e.postData.contents);
    const token = PropertiesService.getScriptProperties().getProperty('QUOTE_WEBHOOK_TOKEN');
    if (!token || data.token !== token) return reply({ok:false});
    const limits = {name:100,phone:18,email:254,org:150,service:150,deadline:10,requirement:3000};
    for (const key in limits) {
      if (typeof data[key] !== 'string' || data[key].length > limits[key]) return reply({ok:false});
      data[key] = data[key].trim();
    }
    if (!data.name || !data.service || !data.requirement || !/^[+0-9 ()-]{10,18}$/.test(data.phone) || data.phone.replace(/\D/g,'').length < 10 || !/^[a-f0-9-]{36}$/i.test(data.requestId) || (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) || (data.deadline && !/^\d{4}-\d{2}-\d{2}$/.test(data.deadline))) return reply({ok:false});
    lock = LockService.getScriptLock();
    lock.waitLock(10000);
    const book = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = book.getSheetByName(QUOTE_TAB) || book.insertSheet(QUOTE_TAB);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received at','Request ID','Name','Phone','Email','Institution / company','Service / kit','Target date','Requirement / delivery city','Status']);
      sheet.setFrozenRows(1);
      sheet.getRange(1,1,1,10).setFontWeight('bold').setBackground('#d6fa65');
    }
    const last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(2,2,last-1,1).createTextFinder(data.requestId).matchEntireCell(true).findNext()) return reply({ok:true,requestId:data.requestId});
    // Prefix text interpreted as formulas; customer input remains plain text.
    function safe(value) { return /^[=+\-@\t\r\n]/.test(value) ? "'"+value : value; }
    const row = [new Date(),data.requestId,data.name,data.phone,data.email,data.org,data.service,data.deadline,data.requirement,'New'].map(value => typeof value === 'string' ? safe(value) : value);
    sheet.getRange(sheet.getLastRow()+1,1,1,row.length).setValues([row]);
    SpreadsheetApp.flush();
    return reply({ok:true,requestId:data.requestId});
  } catch (error) { return reply({ok:false}); }
  finally { if (lock && lock.hasLock()) lock.releaseLock(); }
}
