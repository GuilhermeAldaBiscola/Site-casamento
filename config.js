// Cole aqui a URL do seu Google Apps Script depois de publicar como Web App.
// Exemplo: const API_URL = "
https://script.google.com/macros/s/AKfycbyz9dVTFiWD3YkDlvR_qYOEdKzeWG9rulRf0JQIBAgdhm2T_IUrc7X9wXUhuEG3uB_E/exec";
const API_URL = "https://script.google.com/macros/s/AKfycbyz9dVTFiWD3YkDlvR_qYOEdKzeWG9rulRf0JQIBAgdhm2T_IUrc7X9wXUhuEG3uB_E/exec";

// Enquanto você ainda não configurou o Google Apps Script, o site mostra esta lista de teste.
const PRESENTES_DEMO = [
  { id: "airfryer", nome: "Air Fryer", valor: "R$ 350", categoria: "Cozinha", foto: "img/airfryer.svg" },
  { id: "panelas", nome: "Jogo de Panelas", valor: "R$ 300", categoria: "Cozinha", foto: "img/panelas.svg" },
  { id: "liquidificador", nome: "Liquidificador", valor: "R$ 180", categoria: "Cozinha", foto: "img/liquidificador.svg" },
  { id: "faqueiro", nome: "Faqueiro", valor: "R$ 160", categoria: "Cozinha", foto: "img/faqueiro.svg" },
  { id: "toalhas", nome: "Jogo de Toalhas", valor: "R$ 140", categoria: "Banho", foto: "img/toalhas.svg" },
  { id: "cama", nome: "Jogo de Cama Casal", valor: "R$ 220", categoria: "Quarto", foto: "img/cama.svg" },
  { id: "pix100", nome: "Cota Pix para o lar", valor: "R$ 100", categoria: "Cotas", foto: "img/pix.svg" },
  { id: "pix200", nome: "Cota Pix especial", valor: "R$ 200", categoria: "Cotas", foto: "img/pix.svg" }
];
