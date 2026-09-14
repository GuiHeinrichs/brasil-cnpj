# bateCarimbo

Suíte gratuita de geradores, validadores e formatadores de documentos e dados brasileiros **fictícios**, para uso em testes de software.

**Site oficial:** [batecarimbo.com.br](https://batecarimbo.com.br)

> **Aviso:** todos os números gerados são fictícios. Eles têm formato e dígitos verificadores corretos, mas não pertencem a nenhuma pessoa, empresa ou veículo real e não constam em cadastro oficial algum. Uso restrito a desenvolvimento, homologação e demonstração.

## Ferramentas

| Documento | Rota | Observação |
|---|---|---|
| CNPJ | `/` | numérico e alfanumérico, com validador e formatador |
| CPF | `/gerador-de-cpf` | por região fiscal (9º dígito) |
| CNH | `/gerador-de-cnh` | registro de 11 dígitos com os dois DVs |
| Título de eleitor | `/gerador-de-titulo-de-eleitor` | por UF, com a exceção SP/MG do TSE |
| PIS/PASEP/NIS/NIT | `/gerador-de-pis` | mesmo número, quatro siglas |
| RG | `/gerador-de-rg` | padrão SSP-SP, com DV que pode ser X |
| RENAVAM | `/gerador-de-renavam` | 11 dígitos, aceita os antigos de 9 |
| Placa | `/gerador-de-placa` | Mercosul e padrão antigo |
| CEP | `/gerador-de-cep` | dentro das faixas oficiais por estado |
| Pessoas | `/gerador-de-pessoas` | ficha completa coerente por UF |
| Empresas | `/gerador-de-empresas` | razão social, CNPJ, porte e endereço |
| Nomes | `/gerador-de-nomes` | prenomes e sobrenomes brasileiros |
| Usernames | `/gerador-de-nicks` | identificadores públicos para testes |

Além das ferramentas, o site publica [guias técnicos](https://batecarimbo.com.br/guias) sobre validação de documentos brasileiros: módulo 11, CNPJ alfanumérico, validação em JavaScript, Python, Java, C# e SQL, regex, massa de dados de teste e LGPD.

## Formatos do CNPJ

| Formato | Regex (sem máscara) | Descrição |
|---------|---------------------|-----------|
| Numérico | `^\d{14}$` | 14 dígitos — formato legado, segue válido |
| Alfanumérico | `^[0-9A-Z]{12}\d{2}$` | 12 caracteres alfanuméricos + 2 DVs numéricos |

O cálculo do dígito verificador segue o **módulo 11**, com conversão ASCII − 48 no formato alfanumérico, conforme o [manual do SERPRO](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf).

**Exemplo oficial:** `12.ABC.345/01DE-35`

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- TypeScript
- Tailwind CSS 4
- [shadcn/ui](https://ui.shadcn.com) sobre [Base UI](https://base-ui.com)

Tudo roda no navegador: não há backend, banco de dados nem chamada de API. Nenhum dado gerado sai da máquina de quem usa.

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testes unitários (Vitest)
npm run build    # build de produção
npm run lint     # ESLint
```

## Autor

Mantido por **João Guilherme Heinrichs**, desenvolvedor em Porto Alegre (RS) — [github.com/GuiHeinrichs](https://github.com/GuiHeinrichs).

Correções e sugestões são bem-vindas por [issue](https://github.com/GuiHeinrichs/brasil-cnpj/issues) ou pela [página de contato](https://batecarimbo.com.br/contato) do site.

## Licença

MIT — veja [LICENSE](LICENSE).
