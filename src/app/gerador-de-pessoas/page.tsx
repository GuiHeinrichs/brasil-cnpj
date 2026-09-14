import type { Metadata } from "next";
import Link from "next/link";

import {
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { SectionLabel } from "@/components/docs";
import { CodeBlock } from "@/components/guias/code-block";
import { JsonLd } from "@/components/json-ld";
import { PessoaGeneratorPanel } from "@/components/pessoa/panels";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PESSOA_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE } from "@/lib/pessoa";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de Pessoas — ficha fictícia coerente por estado";
const PAGE_DESCRIPTION =
  "Gere fichas de pessoas fictícias com CPF, e-mail, telefone e endereço coerentes com a UF escolhida, mais RG no padrão SSP-SP. E-mails em domínios que não recebem mensagem e exportação em JSON ou XML.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-pessoas",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-pessoas",
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
  name: "Gerador de Pessoas",
  path: "/gerador-de-pessoas",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de fichas completas em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "CPF com o dígito da região fiscal, CEP na faixa do estado, cidade e DDD da UF escolhida",
    "RG pela convenção SSP-SP, sem vínculo com o estado escolhido",
    "Nome, data de nascimento, nome da mãe, e-mail e telefone",
    "Cópia campo a campo ou da ficha inteira",
  ],
});

const JSON_SAMPLE = `[
  {
    "nome": "Ana Ribeiro Castro",
    "cpf": "123.456.789-09",
    "rg": "24.598.973-0",
    "nascimento": "14/03/1988",
    "sexo": "Feminino",
    "nomeDaMae": "Cláudia Ribeiro Castro",
    "email": "ana.castro42@example.org",
    "celular": "(41) 98461-2037",
    "cep": "80230-450",
    "endereco": "Rua das Acácias, 412 — Jardim América",
    "cidadeUf": "Curitiba/PR"
  }
]`;

const XML_SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<pessoas>
  <pessoa>
    <nome>Ana Ribeiro Castro</nome>
    <cpf>123.456.789-09</cpf>
    <rg>24.598.973-0</rg>
    <nascimento>14/03/1988</nascimento>
    <sexo>Feminino</sexo>
    <nomeDaMae>Cláudia Ribeiro Castro</nomeDaMae>
    <email>ana.castro42@example.org</email>
    <celular>(41) 98461-2037</celular>
    <cep>80230-450</cep>
    <endereco>Rua das Acácias, 412 — Jardim América</endereco>
    <cidadeUf>Curitiba/PR</cidadeUf>
  </pessoa>
</pessoas>`;

const RELATED = [
  { href: "/gerador-de-cpf", label: "Gerador de CPF" },
  { href: "/gerador-de-rg", label: "Gerador de RG" },
  { href: "/gerador-de-cep", label: "Gerador de CEP" },
];

export default function GeradorDePessoas() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(PESSOA_FAQ)} />

      <SiteHeader
        active="pessoas"
        badge="Ficha coerente por estado"
        heading="Gerador de Pessoas (ficha completa fictícia)"
        lead="Escolha o estado e receba uma ficha inteira — nome, CPF, RG, nascimento, nome da mãe, e-mail, telefone e endereço — com os campos amarrados entre si. Até 25 por vez, com exportação do lote em JSON ou XML."
      />

      <div className="mt-8">
        <PessoaGeneratorPanel />
      </div>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            As fichas são inteiramente fictícias e destinadas a testes de
            software. Os documentos têm dígitos verificadores válidos, mas não
            pertencem a nenhuma pessoa real — não use em sistemas de produção.
          </DocsWarning>

          <GuideSection title="Uma ficha inteira, não dez campos sorteados">
            <p>
              Montar uma pessoa de teste chamando um gerador para cada campo
              produz um registro que não sobrevive à primeira validação cruzada:
              alguém que mora em Curitiba, com CEP de Recife e DDD do Acre.
              Aqui a ficha nasce de uma escolha só — a unidade federativa — e o
              resto é derivado dela.
            </p>

            <h3>O que a UF amarra</h3>
            <ul>
              <li>
                <strong>CPF</strong>: o nono dígito recebe o código da região
                fiscal do estado escolhido. Paraná e Santa Catarina usam 9, São
                Paulo usa 8, Rio Grande do Sul usa 0 — a tabela completa está no
                guia sobre{" "}
                <a href="/guias/regiao-fiscal-cpf">
                  o nono dígito e a região fiscal
                </a>
                .
              </li>
              <li>
                <strong>CEP</strong>: sorteado dentro da faixa oficial daquela
                UF. No Paraná, entre{" "}
                <code>80000-000</code> e <code>87999-999</code>.
              </li>
              <li>
                <strong>Cidade</strong>: capital ou outro município grande do
                mesmo estado, nunca um nome solto.
              </li>
              <li>
                <strong>Telefone</strong>: DDD da lista daquela UF (no Paraná,
                de 41 a 46), em formato de celular com o nono dígito.
              </li>
            </ul>
            <p>
              Nome, sexo, data de nascimento entre 18 e 80 anos, nome da mãe, RG
              e e-mail completam o registro. O nome da mãe reaproveita os
              sobrenomes do titular, detalhe que some quando a massa é montada
              campo a campo e que aparece em qualquer tela que confere filiação.
              CPF e RG saem dos mesmos geradores dedicados, com dígito
              verificador calculado por{" "}
              <a href="/guias/modulo-11-digito-verificador">módulo 11</a>.
            </p>

            <h3>Onde a incoerência estraga o teste</h3>
            <p>
              Boa parte dos formulários brasileiros consulta o CEP e preenche
              cidade e UF sozinha. Uma ficha incoerente faz esse preenchimento
              sobrescrever o que o teste digitou, e o caso falha por um motivo
              que não tem nada a ver com a regra em avaliação. O mesmo vale para
              roteamento de atendimento por DDD, alíquota por estado, frete por
              região e relatórios agregados por UF: essas regras leem a
              combinação dos campos, não cada um isolado. Quando um teste quebra,
              você quer que a causa esteja no código, não na massa.
            </p>
          </GuideSection>

          <GuideSection title="Por que os e-mails usam domínios que não existem">
            <p>
              Os endereços gerados saem apenas em seis domínios:{" "}
              <code>example.com</code>, <code>example.org</code>,{" "}
              <code>example.net</code>, <code>teste.example</code>,{" "}
              <code>exemplo.test</code> e <code>mail.invalid</code>. Os três
              primeiros são nomes reservados para documentação; os de topo{" "}
              <code>.test</code>, <code>.example</code> e <code>.invalid</code>{" "}
              são reservados justamente para documentação e teste, e não são
              delegados na raiz do DNS. Nenhum deles entrega e-mail.
            </p>
            <p>
              A razão é prática. Ambiente de homologação dispara e-mail de
              boas-vindas, redefinição de senha, aviso de cobrança e notificação
              de status. Se a massa usar domínios de provedores reais, um
              endereço sorteado pode existir e pertencer a alguém que nunca ouviu
              falar do seu sistema — e passa a receber mensagens transacionais
              dele. Com domínio reservado, a entrega morre na resolução do MX e
              nada chega a uma caixa de verdade.
            </p>
            <p>
              O efeito colateral é útil: ao apontar o SMTP de homologação para
              essa massa, todo envio indevido vira bounce, o que expõe rotinas
              que estavam mandando e-mail quando não deviam.
            </p>
            <p>
              Um cuidado: se o seu validador de e-mail consulta registro MX ou
              usa lista de domínios descartáveis, ele vai recusar esses
              endereços. Em teste, valide apenas o formato, ou reserve um domínio
              próprio sem MX (algo como{" "}
              <code>teste.suaempresa.com.br</code>) e troque o sufixo ao carregar
              a massa.
            </p>
          </GuideSection>

          <GuideSection title="Exportar o lote em JSON ou XML">
            <p>
              Cada ficha pode ser copiada campo a campo, inteira em texto, em
              JSON ou em XML. Quando o lote tem mais de uma pessoa, aparece um
              grupo de cópia do conjunto completo nos três formatos — o limite é
              de {MAX_BATCH_SIZE} fichas por geração. Os rótulos da tela viram
              chaves em camelCase sem acento:{" "}
              <code>Nome da mãe</code> vira <code>nomeDaMae</code> e{" "}
              <code>Cidade/UF</code> vira <code>cidadeUf</code>.
            </p>

            <CodeBlock
              language="JSON"
              caption="Lote de uma ficha. O array cresce conforme a quantidade pedida."
              code={JSON_SAMPLE}
            />

            <p>
              A saída XML usa <code>&lt;pessoas&gt;</code> como raiz e um{" "}
              <code>&lt;pessoa&gt;</code> por ficha, com os mesmos nomes de
              chave como elementos e os caracteres <code>&amp;</code>,{" "}
              <code>&lt;</code> e <code>&gt;</code> escapados. Serve para
              alimentar integração legada que ainda fala SOAP ou arquivo
              posicional convertido.
            </p>

            <CodeBlock language="XML" code={XML_SAMPLE} />

            <p>
              Para virar seed de verdade, esse JSON precisa ser congelado num
              arquivo versionado em vez de regerado a cada execução — caso
              contrário o teste passa hoje e falha amanhã com outro sorteio. O
              guia sobre{" "}
              <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
                fixtures, seeds e faker
              </a>{" "}
              trata dessa escolha entre massa fixa e massa gerada, e de quando
              cada uma compensa.
            </p>
          </GuideSection>

          <GuideSection title="Uso responsável: a ficha não identifica ninguém">
            <p>
              Os nomes vêm de listas de prenomes e sobrenomes comuns no Brasil,
              então um nome gerado pode coincidir com o de alguém real. O
              conjunto, não: o CPF e o RG são sorteados dentro do espaço de
              números com dígito verificador correto, sem consultar nenhuma base,
              e não existe caminho de volta de uma ficha para uma pessoa. Nada do
              que sai daqui é dado pessoal.
            </p>
            <p>
              Ter dígito verificador correto também não significa existir. O CPF
              da ficha passa em qualquer rotina de validação de formato, mas não
              tem inscrição na Receita Federal — situação cadastral só a própria
              Receita informa, na consulta oficial.
            </p>
            <p>
              O que a ficha não serve para fazer: abrir conta, preencher cadastro
              que exija identificação verdadeira, assinar documento em nome de
              outra pessoa, contornar verificação de idade ou enganar antifraude.
              Passar-se por outra pessoa ou apresentar identificação falsa é
              crime, e o fato de o número fechar a conta do dígito verificador
              não muda isso. Os limites estão detalhados em{" "}
              <Link href="/termos#uso-permitido">uso permitido e proibido</Link>.
            </p>
            <p>
              No sentido oposto, trocar um dump de produção por fichas fictícias
              em desenvolvimento e homologação reduz a superfície de exposição de
              dados reais em ambientes que costumam ter menos controle de acesso,
              log e retenção. O guia sobre{" "}
              <a href="/guias/lgpd-dados-de-teste">
                LGPD e dados de teste
              </a>{" "}
              detalha esse raciocínio, incluindo anonimização e minimização.
            </p>
          </GuideSection>

          <div className="space-y-3">
            <SectionLabel>Documentos da ficha</SectionLabel>
            <p className="text-sm text-muted-foreground">
              Cada campo reusa os geradores dedicados do bateCarimbo, com o mesmo
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

          <FaqSection items={PESSOA_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "LGPD — Lei 13.709/2018 (texto integral)",
                href: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
              },
              {
                label: "ANPD — Autoridade Nacional de Proteção de Dados",
                href: "https://www.gov.br/anpd/pt-br",
              },
              {
                label: "Receita Federal — consulta de situação cadastral do CPF",
                href: "https://servicos.receita.fazenda.gov.br/Servicos/CPF/ConsultaSituacao/ConsultaPublica.asp",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
