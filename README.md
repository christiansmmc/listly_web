# TODO

- Ajustar LOCAL STORAGE
    - nao salvar o isLoggedIn, esse campo sera validado apos um request de validacao de code e passcode do localstorage,
      caso sucesso isLoggedIn = True
- Tratativa de erros
- Botao na tela da lista de compras vai gerar e copiar um link com URL + code + passcode
  - Sera necessario criar uma pagina que ao acessar o link tenta logar
    - sucesso -> salva code, passcode, seta logado e redireciona para pagina da lista
    - falha -> toast erro e redireciona para dashboard