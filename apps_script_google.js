const SHEET_PRESENTES = "Presentes";
const SHEET_PIX = "Pix";

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PRESENTES);

  if (!sheet) {
    return json({ success: false, message: "Aba Presentes não encontrada." });
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return json([]);

  const headers = data.shift().map(h => String(h).trim());

  const presentes = data
    .filter(row => row.some(cell => String(cell).trim() !== ""))
    .map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] === undefined ? "" : row[index];
      });
      return obj;
    });

  return json(presentes);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const tipo = String(body.tipo || "reserva").trim().toLowerCase();

    if (tipo === "pix") {
      return registrarPix(body);
    }

    return reservarPresente(body);
  } catch (error) {
    return json({ success: false, message: error.message });
  }
}

function reservarPresente(body) {
  const id = String(body.id || "").trim();
  const convidado = String(body.convidado || "").trim();
  const mensagem = String(body.mensagem || "").trim();

  if (!id || !convidado) {
    return json({ success: false, message: "Dados incompletos para reserva." });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PRESENTES);

  if (!sheet) {
    return json({ success: false, message: "Aba Presentes não encontrada." });
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).trim());

  const idCol = headers.indexOf("id");
  const reservadoCol = headers.indexOf("reservado");
  const convidadoCol = headers.indexOf("convidado");
  const mensagemCol = headers.indexOf("mensagem");
  const dataCol = headers.indexOf("data");

  if (idCol === -1 || reservadoCol === -1) {
    return json({ success: false, message: "Colunas id ou reservado não encontradas." });
  }

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][idCol]).trim() === id) {
      if (String(data[i][reservadoCol]).trim()) {
        return json({ success: false, message: "Este presente já foi reservado." });
      }

      sheet.getRange(i + 1, reservadoCol + 1).setValue("SIM");
      if (convidadoCol !== -1) sheet.getRange(i + 1, convidadoCol + 1).setValue(convidado);
      if (mensagemCol !== -1) sheet.getRange(i + 1, mensagemCol + 1).setValue(mensagem);
      if (dataCol !== -1) sheet.getRange(i + 1, dataCol + 1).setValue(new Date());

      return json({ success: true, message: "Reservado com sucesso." });
    }
  }

  return json({ success: false, message: "Presente não encontrado." });
}

function registrarPix(body) {
  const nome = String(body.nome || "").trim();
  const valor = String(body.valor || "").trim();
  const mensagem = String(body.mensagem || "").trim();

  if (!nome || !valor) {
    return json({ success: false, message: "Nome e valor são obrigatórios para aviso de Pix." });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_PIX);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PIX);
    sheet.appendRow(["data", "nome", "valor", "mensagem"]);
  }

  sheet.appendRow([new Date(), nome, valor, mensagem]);

  return json({ success: true, message: "Aviso de Pix registrado." });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
