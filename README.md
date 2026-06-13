# bateCarimbo

Gerador, validador e formatador de CNPJ **numérico** (legado) e **alfanumérico** (novo formato SERPRO) para testes de software.

> **Aviso:** CNPJs gerados são fictícios e destinados exclusivamente a ambientes de desenvolvimento e testes. Não representam empresas reais.

## Funcionalidades

- **Gerador** — CNPJs válidos em lote (1–100), com ou sem máscara
- **Validador** — verifica dígitos verificadores e detecta o formato
- **Formatador** — aplica ou remove a máscara `XX.XXX.XXX/XXXX-XX`
- **Referência** — regex, comparativo de formatos e links oficiais

## Formatos suportados

| Formato | Regex (sem máscara) | Descrição |
|---------|---------------------|-----------|
| Numérico | `^\d{14}$` | 14 dígitos — formato atual |
| Alfanumérico | `^[0-9A-Z]{12}\d{2}$` | 12 chars alfanuméricos + 2 DVs numéricos (jul/2026+) |

O cálculo do dígito verificador segue o **módulo 11** com conversão ASCII − 48 para o formato alfanumérico, conforme [manual Serpro](https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf).

**Exemplo oficial:** `12.ABC.345/01DE-35`

## Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- TypeScript
- Tailwind CSS 4
- [shadcn/ui](https://ui.shadcn.com)

## Desenvolvimento

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testes unitários (Vitest)
npm run build    # build de produção
npm run lint     # ESLint
```

## Deploy

Compatível com [Vercel](https://vercel.com) — deploy zero-config, sem backend nem banco de dados.

## Licença

MIT — veja [LICENSE](LICENSE).
