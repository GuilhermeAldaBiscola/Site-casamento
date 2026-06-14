// Cole aqui a URL do Apps Script publicado como App da Web.
// Use a URL que termina em /exec.
const API_URL = "https://script.google.com/macros/s/AKfycbyKcQbKsNdNLg7c7j3iyMZo9c3q905huvS1anin_pwwvOel3IDW0Sz5NB4qy76lkKcKEg/exec";

const PIX_KEY = "10193675986";
const PIX_QR_CODE = "img/qrcode-pix.png";

const PIX_ITEM = {
  id: "pix_livre",
  nome: "Pix livre para os noivos",
  valor: "Valor à escolha do convidado",
  categoria: "Pix",
  foto: "img/pix.svg",
  descricao: "Escolha o valor que desejar e envie uma mensagem para nos avisar do Pix. Sua contribuição vai nos ajudar a construir nosso lar do nosso jeito.",
  link_loja: ""
};

const PRESENTES_DEMO = [
  {
    id: "airfryer",
    nome: "Air Fryer",
    valor: "R$ 350",
    categoria: "Cozinha",
    foto: "img/airfryer.svg",
    descricao: "Air Fryer para preparar refeições rápidas no dia a dia. Preferência por modelos de 4L ou 5L.",
    link_loja: "https://www.google.com/search?q=air+fryer"
  },
  {
    id: "panelas",
    nome: "Jogo de Panelas",
    valor: "R$ 300",
    categoria: "Cozinha",
    foto: "img/panelas.svg",
    descricao: "Jogo de panelas antiaderente para montar nossa cozinha.",
    link_loja: "https://www.google.com/search?q=jogo+de+panelas"
  }
];
