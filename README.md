# TODO

- Ajustar LOCAL STORAGE
    - nao salvar o isLoggedIn, esse campo sera validado apos um request de validacao de code e passcode do localstorage,
      caso sucesso isLoggedIn = True
- Tratativa de erros
- Botao na tela da lista de compras vai gerar e copiar um link com URL + code + passcode
  - Sera necessario criar uma pagina que ao acessar o link tenta logar
    - sucesso -> salva code, passcode, seta logado e redireciona para pagina da lista
    - falha -> toast erro e redireciona para dashboard
- Adicionar loadings em botoes
- Ao gerar codigo e voltar para landing page sem finalizar o cadastro
salvar no localStorage o token para que n gere infinitos so de voltar e ir.
- Tela da lista de compras
  - Procurar icone para cada categoria
  - Back apenas salva categoria, caso nao enviado colocar em outros