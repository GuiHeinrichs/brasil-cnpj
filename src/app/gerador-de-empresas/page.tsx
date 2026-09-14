import type { Metadata } from "next";
import Link from "next/link";

import {
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { EmpresaGeneratorPanel } from "@/components/empresa/panels";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MAX_BATCH_SIZE } from "@/lib/empresa";
import { EMPRESA_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Empresas fictícias com CNPJ válido e endereço";
const PAGE_DESCRIPTION =
  "Fichas completas de pessoa jurídica para testes: razão social, nome fantasia, CNPJ válido, natureza jurídica, porte e endereço dentro da UF escolhida.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-empresas",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-empresas",
    siteName: SITE_NAME,
    locale: "pt_BR",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

const webApplicationJsonLd = toolJsonLd({
  name: "Gerador de Empresas",
  path: "/gerador-de-empresas",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de fichas de empresa em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Razão social e nome fantasia independentes",
    "Natureza jurídica e porte em campos separados",
    "CNPJ válido, CEP, cidade e DDD coerentes com a UF",
    "Cópia campo a campo, da ficha inteira ou do lote em JSON e XML",
  ],
});

const RELATED = [
  { href: "/", label: "Gerador de CNPJ" },
  { href: "/gerador-de-cep", label: "Gerador de CEP" },
];

export default function GeradorDeEmpresas() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(EMPRESA_FAQ)} />

      <SiteHeader
        active="empresas"
        badge="Ficha completa · CNPJ · endereço por UF"
        heading="Gerador de Empresas (ficha completa fictícia)"
        lead="Cada rodada monta uma pessoa jurídica inteira e coerente: razão social, nome fantasia, CNPJ com dígitos verificadores corretos, natureza jurídica, porte, data de abertura, contato e endereço dentro do estado que você escolher."
      />

      <div className="mt-8">
        <EmpresaGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            As empresas são inteiramente fictícias e destinadas a testes de
            software. O CNPJ tem dígitos verificadores válidos, mas não há
            inscrição na Receita Federal — não use em produção fiscal.
          </DocsWarning>

          <GuideSection title="Os campos de uma ficha de pessoa jurídica">
            <p>
              Em um cadastro real, os campos de uma empresa vêm de origens
              diferentes: o nome sai do registro na junta comercial, o CNPJ da
              Receita Federal, o endereço da inscrição e o contato do próprio
              cadastro do sistema. A ficha gerada aqui reproduz esse conjunto com
              as dependências certas entre os campos, que é justamente o que uma
              massa montada à mão costuma errar.
            </p>

            <h3>Razão social e nome fantasia</h3>
            <p>
              A razão social é o nome registrado — aparece em contrato, nota
              fiscal e procuração — e termina com a sigla do tipo societário
              (<code>LTDA</code>, <code>S.A.</code>, <code>EI</code>). O nome
              fantasia é a marca pela qual o público conhece a empresa e não tem
              relação obrigatória com a razão social. O gerador monta os dois de
              forma independente de propósito: sistemas que guardam um campo só
              acabam imprimindo a marca no lugar do nome jurídico, e o documento
              sai inválido.
            </p>

            <h3>CNPJ, raiz e ordem do estabelecimento</h3>
            <p>
              O CNPJ da ficha tem os dois dígitos verificadores calculados por{" "}
              <a href="/guias/modulo-11-digito-verificador">módulo 11</a>, então
              passa em qualquer validador de formato. A estrutura por trás dele
              é a raiz, que identifica a empresa, seguida da ordem, que
              identifica o estabelecimento —
              matriz e filiais compartilham a mesma raiz e diferem na ordem. Um
              cadastro que aplica índice único sobre a raiz impede o cliente de
              cadastrar a segunda filial; um que trata cada estabelecimento como
              empresa distinta perde a consolidação. O que cada número identifica
              está em{" "}
              <a href="/guias/cpf-cnpj-inscricao-estadual-mei-diferencas">
                CPF, CNPJ, inscrição estadual e MEI
              </a>
              .
            </p>
            <p>
              A ficha sai sempre com CNPJ somente de dígitos, que continua válido
              e continua sendo a esmagadora maioria da base instalada. Desde
              julho de 2026, porém, novas inscrições podem trazer letras na raiz
              e na ordem: para gerar nesse formato, use o modo alfanumérico do{" "}
              <Link href="/">gerador de CNPJ</Link> e veja o que muda no cálculo
              em{" "}
              <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a>.
            </p>

            <h3>Endereço, CEP e telefone que fecham entre si</h3>
            <p>
              Escolhida a unidade federativa, o CEP cai dentro da faixa oficial
              daquele estado, a cidade vem da lista do próprio estado e o DDD do
              telefone acompanha. Isso importa para qualquer regra que dependa de
              localização: alíquota por estado, tabela de frete, roteamento de
              atendimento. Massa montada com CEP paulista, cidade gaúcha e DDD
              pernambucano passa no formulário e só quebra quando alguém cruza
              os campos.
            </p>

            <h3>E-mail em domínio reservado</h3>
            <p>
              O e-mail de contato sai no formato{" "}
              <code>contato@nomefantasia.example.com</code>. O domínio{" "}
              <code>example.com</code> é reservado para documentação e exemplos e
              não pode ser registrado por ninguém: uma rotina de disparo que
              escape de homologação não entrega mensagem na caixa de um
              terceiro. Isso não substitui a trava no ambiente — em teste, o
              envio deveria passar por uma lista de domínios permitidos.
            </p>
          </GuideSection>

          <GuideSection title="Natureza jurídica, porte e regime tributário são três coisas">
            <p>
              Esses três campos são colapsados em um enum só com frequência
              suficiente para valer a separação. Eles mudam por motivos
              diferentes, em momentos diferentes, e um não determina o outro.
            </p>

            <h3>Natureza jurídica: como a empresa foi constituída</h3>
            <p>
              É o tipo societário — sociedade empresária limitada, sociedade
              limitada unipessoal, sociedade anônima, empresário individual.
              Define quem responde pelas obrigações, quantos sócios a empresa
              tem e qual sigla encerra a razão social. Só muda com alteração de
              ato constitutivo registrada no órgão competente, o que na prática
              significa raramente.
            </p>
            <p>
              A EIRELI não aparece nas fichas porque foi extinta pela{" "}
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14195.htm"
                rel="noopener noreferrer"
                target="_blank"
              >
                Lei 14.195/2021
              </a>
              : as que existiam foram transformadas em sociedades limitadas
              unipessoais. Se o seu formulário ainda oferece EIRELI como opção
              selecionável, o valor precisa virar histórico — aceito na leitura
              de registros antigos, fora da lista de escolha em cadastros novos.
            </p>

            <h3>Porte: faixa de receita bruta</h3>
            <p>
              Microempresa, empresa de pequeno porte ou demais. É enquadramento
              por faturamento: a mesma sociedade limitada pode ser ME em um ano e
              EPP no seguinte sem tocar no contrato social. O MEI também é um
              enquadramento, com teto próprio, aplicado sobre o empresário
              individual — não é uma natureza jurídica, apesar de aparecer como
              se fosse em boa parte dos formulários por aí. Por isso o porte tem
              campo separado na ficha.
            </p>

            <h3>Regime tributário: como o imposto é apurado</h3>
            <p>
              Simples Nacional, lucro presumido ou lucro real. É opção fiscal,
              revista periodicamente, e não decorre do porte: ser EPP não obriga
              a optar pelo Simples, e há atividades impedidas de optar mesmo
              dentro do limite de receita. A ficha não gera esse campo
              exatamente porque ele não pode ser deduzido dos outros dois — se o
              seu sistema precisa dele, ele tem de ser informado, nunca inferido.
            </p>
            <p>
              Na modelagem, isso vira três colunas. E, como porte e regime mudam
              ao longo da vida da empresa enquanto a natureza jurídica tende a
              ficar parada, os dois primeiros pedem vigência: guardar apenas o
              valor atual apaga a informação de qual regra valia na data de uma
              nota emitida no ano passado.
            </p>
          </GuideSection>

          <GuideSection title="Erros comuns em cadastro de empresa">
            <ul>
              <li>
                Guardar o CNPJ em coluna numérica. Zeros à esquerda somem, e o
                formato alfanumérico não cabe. Texto normalizado, sem pontuação,
                com a máscara aplicada só na exibição.
              </li>
              <li>
                Deduzir estado a partir do CNPJ. Diferente do CPF, cujo nono
                dígito indica a{" "}
                <a href="/guias/regiao-fiscal-cpf">região fiscal de emissão</a>,
                o CNPJ não codifica localização: a UF vem do endereço, e só dele.
              </li>
              <li>
                Validar nome fantasia como obrigatório. Muita empresa não tem —
                e nada impede que ele seja idêntico à razão social.
              </li>
              <li>
                Tratar inscrição estadual como campo de formato único. O layout
                varia por estado, e empresa isenta simplesmente não tem.
              </li>
              <li>
                Copiar empresas reais da base de produção para popular
                homologação. É o cenário que um gerador de fichas existe para
                substituir; o porquê está em{" "}
                <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
              </li>
            </ul>
          </GuideSection>

          <div className="space-y-3">
            <SectionLabel>Documentos da ficha</SectionLabel>
            <p className="text-sm text-muted-foreground">
              A ficha reusa os geradores dedicados do bateCarimbo, com o mesmo
              cálculo de dígitos verificadores:
            </p>
            <ul className="flex flex-wrap gap-2">
              {RELATED.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="inline-flex rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:border-ring/40"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <FaqSection items={EMPRESA_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Receita Federal — Cadastro CNPJ",
                href: "https://www.gov.br/receitafederal/pt-br/assuntos/orientacao-tributaria/cadastros/cnpj",
              },
              {
                label: "Lei 14.195/2021 — extinção da EIRELI",
                href: "https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14195.htm",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
