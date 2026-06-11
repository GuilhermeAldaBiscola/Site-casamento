SITE DE LISTA DE CASAMENTO - GUILHERME & FERNANDA

O QUE VEM NO PACOTE
1. index.html - página principal do site.
2. style.css - tema fúcsia.
3. script.js - funcionamento da lista e reserva.
4. config.js - onde você cola a URL do Google Apps Script.
5. apps_script_google.js - código para colar no Google Apps Script.
6. modelo_planilha.csv - modelo para importar no Google Planilhas.
7. pasta img - imagens modelo dos presentes.

COMO COLOCAR FOTOS DOS PRESENTES
1. Coloque suas imagens dentro da pasta img.
2. Use nomes simples, exemplo: airfryer.jpg, panelas.jpg.
3. Na planilha, na coluna foto, coloque: img/airfryer.jpg
4. Suba essas imagens junto com o site no GitHub Pages.

COMO FAZER O ITEM SUMIR QUANDO ALGUÉM RESERVAR
1. Crie uma planilha no Google Planilhas.
2. Importe o arquivo modelo_planilha.csv.
3. Renomeie a aba para: Presentes
4. Vá em Extensões > Apps Script.
5. Apague tudo e cole o conteúdo do arquivo apps_script_google.js.
6. Salve.
7. Clique em Implantar > Nova implantação.
8. Tipo: App da Web.
9. Executar como: você.
10. Quem tem acesso: qualquer pessoa.
11. Copie a URL gerada.
12. Abra o arquivo config.js e cole a URL aqui:
const API_URL = "SUA_URL_AQUI";

COMO PUBLICAR DE GRAÇA
Opção recomendada: GitHub Pages.
1. Crie uma conta no GitHub.
2. Crie um repositório chamado lista-casamento.
3. Envie todos os arquivos deste pacote.
4. Vá em Settings > Pages.
5. Em Source, escolha Deploy from branch.
6. Escolha main / root.
7. O GitHub vai gerar o link público do site.

IMPORTANTE
Sem configurar o Google Apps Script, o site funciona apenas em modo demonstração.
Com o Apps Script configurado, a reserva passa a valer para todos os convidados.
