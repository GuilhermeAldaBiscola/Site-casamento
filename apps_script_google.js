const SHEET_PRESENTES = "Presentes";
const SHEET_PIX = "Pix";

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = String(params.action || "list").trim().toLowerCase();

    let result;

    if (action === "reserva") {
      result = reservarPresente(params);
    } else if (action === "pix") {
      result = registrarPix(params);
    } else {
      result = listarPresentes();
    }

    return responder(result, params.callback);
  } catch (error) {
    return responder({ success: false, message: error.message }, e && e.parameter ? e.parameter.callback : "");
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    const tipo = String(body.tipo || "reserva").trim().toLowerCase();

    if (tipo === "pix") {
      return responder(registrarPix(body));
    }

    return responder(reservarPresente(body));
  } catch (error) {
    return responder({ success: false, message: error.message });
  }
}

function listarPresentes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PRESENTES);

  if (!sheet) {
    return { success: false, message: "Aba Presentes não encontrada." };
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

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

  return presentes;
}

function reservarPresente(data) {
  const id = String(data.id || "").trim();
  const convidado = String(data.convidado || "").trim();
  const mensagem = String(data.mensagem || "").trim();

  if (!id || !convidado) {
    return { success: false, message: "Dados incompletos para reserva." };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_PRESENTES);

  if (!sheet) {
    return { success: false, message: "Aba Presentes não encontrada." };
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());

  const idCol = headers.indexOf("id");
  const reservadoCol = headers.indexOf("reservado");
  const convidadoCol = headers.indexOf("convidado");
  const mensagemCol = headers.indexOf("mensagem");
  const dataCol = headers.indexOf("data");

  if (idCol === -1 || reservadoCol === -1) {
    return { success: false, message: "Colunas id ou reservado não encontradas." };
  }

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol]).trim() === id) {
      if (String(values[i][reservadoCol]).trim()) {
        return { success: false, message: "Este presente já foi reservado." };
      }

      sheet.getRange(i + 1, reservadoCol + 1).setValue("SIM");
      if (convidadoCol !== -1) sheet.getRange(i + 1, convidadoCol + 1).setValue(convidado);
      if (mensagemCol !== -1) sheet.getRange(i + 1, mensagemCol + 1).setValue(mensagem);
      if (dataCol !== -1) sheet.getRange(i + 1, dataCol + 1).setValue(new Date());

      return { success: true, message: "Reservado com sucesso." };
    }
  }

  return { success: false, message: "Presente não encontrado." };
}

function registrarPix(data) {
  const nome = String(data.nome || "").trim();
  const valor = String(data.valor || "").trim();
  const mensagem = String(data.mensagem || "").trim();

  if (!nome || !valor) {
    return { success: false, message: "Nome e valor são obrigatórios para aviso de Pix." };
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_PIX);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_PIX);
    sheet.appendRow(["data", "nome", "valor", "mensagem"]);
  }

  sheet.appendRow([new Date(), nome, valor, mensagem]);

  return { success: true, message: "Aviso de Pix registrado." };
}

function responder(obj, callback) {
  const json = JSON.stringify(obj);
  const cb = String(callback || "").trim();

  if (cb) {
    return ContentService
      .createTextOutput(cb + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
