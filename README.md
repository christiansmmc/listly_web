# TODO

- Criptografar senha salva no local storage
- Tratativa de erros com toast
- Adicionar loadings
- Ao gerar codigo e voltar para landing page sem finalizar o cadastro salvar no localStorage o token para que n gere
  infinitos so de voltar e ir.
- Tela da lista de compras
    - Procurar icone para cada categoria
    - Atualizar requests para usar react query, assim ele atualiza dps de um tempo a lista, caso 2 ou mais pessoas mexem
      ao mesmo tempo, sera atualizado para elas em tempo real
    - Botao na tela da lista de compras vai gerar e copiar um link com URL + code + passcode
      - Sera necessario criar uma pagina que ao acessar o link tenta logar
          - sucesso -> salva code, passcode, seta logado e redireciona para pagina da lista
          - falha -> toast erro e redireciona para dashboard