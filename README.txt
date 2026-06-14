SITE DE CASAMENTO - GUILHERME & FERNANDA
VERSÃO REVISADA SEM ERRO CORS + LINK DE PRODUTO

O QUE FOI CORRIGIDO
- Corrigido erro CORS do GitHub Pages com Google Apps Script.
- O site agora usa JSONP para conversar com o Apps Script.
- Botão Ver produto sugerido mantido no modal.
- Descrição detalhada mantida no modal.
- Pix livre mantido com QR Code, copiar chave, valor e mensagem.

MUITO IMPORTANTE
Para corrigir o erro CORS, você precisa atualizar o Apps Script também.

PASSO A PASSO
1. Abra o Google Apps Script.
2. Apague o código antigo.
3. Cole todo o conteúdo do arquivo apps_script_google.js.
4. Clique em Salvar.
5. Clique em Implantar > Gerenciar implantações.
6. Clique no lápis da implantação ativa.
7. Em versão, escolha Nova versão.
8. Clique em Implantar.
9. Mantenha a URL /exec no config.js.
10. Suba os arquivos do site no GitHub e dê Commit changes.
11. Atualize o site com Ctrl + F5.

PLANILHA
Use exatamente estes cabeçalhos:

id | nome | valor | categoria | foto | descricao | link_loja | reservado | convidado | mensagem | data

LINK DO PRODUTO SUGERIDO
Cole o link na coluna:

link_loja

Quando a coluna link_loja estiver preenchida, o botão Ver produto sugerido aparece ao clicar no presente.

Se link_loja estiver vazio, o botão não aparece.
