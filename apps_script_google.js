// Google Apps Script - cole este código em script.google.com
// A planilha precisa ter a aba "Presentes" com as colunas:
// id | nome | valor | categoria | foto | reservado | convidado | mensagem | data

const SHEET_NAME = "Presentes";

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const rows = data.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
  const disponiveis = rows.filter(item => String(item.reservado).toLowerCase() !== "sim");

  return ContentService
    .createTextOutput(JSON.stringify(disponiveis))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const idCol = headers.indexOf("id");
    const reservadoCol = headers.indexOf("reservado");
    const convidadoCol = headers.indexOf("convidado");
    const mensagemCol = headers.indexOf("mensagem");
    const dataCol = headers.indexOf("data");

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][idCol]) === String(payload.id)) {
        if (String(data[i][reservadoCol]).toLowerCase() === "sim") {
          return json({ ok: false, erro: "Esse presente já foi reservado." });
        }
        sheet.getRange(i + 1, reservadoCol + 1).setValue("sim");
        sheet.getRange(i + 1, convidadoCol + 1).setValue(payload.nome || "");
        sheet.getRange(i + 1, mensagemCol + 1).setValue(payload.mensagem || "");
        sheet.getRange(i + 1, dataCol + 1).setValue(new Date());
        return json({ ok: true });
      }
    }

    return json({ ok: false, erro: "Presente não encontrado." });
  } catch (err) {
    return json({ ok: false, erro: "Erro interno: " + err.message });
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
