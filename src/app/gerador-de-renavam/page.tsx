import type { Metadata } from "next";

import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AlgorithmSection,
  AnatomySection,
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import {
  RenavamGeneratorPanel,
  RenavamValidatorPanel,
} from "@/components/renavam/panels";
import { RENAVAM_SEGMENTS } from "@/components/renavam/segments";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RENAVAM_FAQ } from "@/lib/faq";
import { MAX_BATCH_SIZE, RENAVAM_LENGTH, RENAVAM_REGEX } from "@/lib/renavam";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE = "Gerador de RENAVAM com dígito verificador";
const PAGE_DESCRIPTION =
  "Gere RENAVAMs fictícios de onze dígitos com dígito verificador correto e valide os que você já tem — inclusive os antigos de nove dígitos.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-renavam",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-renavam",
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
  name: "Gerador de RENAVAM",
  path: "/gerador-de-renavam",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de RENAVAM válido em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Validação do dígito verificador (módulo 11)",
    "Suporte a números antigos de 9 dígitos (zeros à esquerda)",
  ],
});

export default function GeradorDeRenavam() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(RENAVAM_FAQ)} />

      <SiteHeader
        active="renavam"
        badge="11 dígitos desde 2013"
        heading="Gerador de RENAVAM"
        lead="Monta códigos de onze dígitos com o verificador já calculado e, no validador, aceita também os antigos de nove — completando os zeros à esquerda antes de conferir a conta."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="validator">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <RenavamGeneratorPanel />
        </TabsContent>

        <TabsContent value="validator" className="mt-5">
          <RenavamValidatorPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            RENAVAMs gerados nesta ferramenta são fictícios e destinados
            exclusivamente a testes de software. Não correspondem a veículos
            reais.
          </DocsWarning>

          <GuideSection title="O que o número do RENAVAM identifica">
            <p>
              RENAVAM é a sigla do{" "}
              <strong>Registro Nacional de Veículos Automotores</strong>, a base
              que reúne os veículos licenciados no país. O número é atribuído no
              primeiro registro e fica colado ao veículo: troca de proprietário,
              mudança de estado e substituição da placa não o alteram. Ele é o
              que o sistema de trânsito usa para amarrar licenciamento anual,
              IPVA, multas, transferência e comunicação de venda a um mesmo
              veículo ao longo de décadas.
            </p>
            <p>
              Em software ele chega como campo obrigatório de onze posições em
              cadastros de seguradoras, revendas, despachantes e frotas. Números
              fictícios com verificador correto exercitam esse caminho inteiro
              sem copiar o documento de um carro real.
            </p>

            <h3>De nove para onze dígitos</h3>
            <p>
              Até 2013 o RENAVAM era escrito com nove dígitos. Com a ampliação
              para onze, os registros antigos não foram renumerados: continuam
              válidos, apenas passam a ser escritos com zeros à esquerda até
              completar o tamanho atual. A conversão é literalmente um{" "}
              <code>padStart(11, &quot;0&quot;)</code> — nada de recalcular nada.
            </p>
            <p>
              O detalhe que explica por que isso funciona está nos pesos. A lista{" "}
              <code>3, 2, 9, 8, 7, 6, 5, 4, 3, 2</code> é aplicada alinhada à
              direita: o último dígito da base sempre recebe peso 2, o penúltimo
              peso 3, e assim por diante. Acrescentar zeros na frente só
              acrescenta produtos iguais a zero e não desloca o peso de nenhum
              dígito significativo. Por isso{" "}
              <code>123456789</code> vira <code>00123456789</code> e o último
              dígito, 9, continua sendo o verificador correto: a base{" "}
              <code>0012345678</code> soma 156, que multiplicada por 10 dá 1560, e
              o resto de 1560 por 11 é justamente 9.
            </p>
            <p>
              Um validador, portanto, não pode exigir onze caracteres na
              entrada: normalize primeiro, confira o dígito depois. O painel de
              validação desta página aceita de nove a onze dígitos.
            </p>

            <h3>Por que a soma é multiplicada por 10</h3>
            <p>
              Entre os documentos brasileiros que usam{" "}
              <a href="/guias/modulo-11-digito-verificador">módulo 11</a>, o
              RENAVAM é o esquisito: em vez de calcular o resto da soma
              ponderada e fazer <code>11 − resto</code>, ele multiplica a soma
              por 10 antes de tirar o resto. O motivo é aritmético. Em módulo 11,
              10 equivale a −1, então <code>(soma × 10) mod 11</code> dá
              exatamente o mesmo valor que <code>11 − (soma mod 11)</code>.
            </p>
            <p>
              A vantagem da forma com multiplicação é que ela absorve sozinha os
              dois casos de borda que costumam virar bug nas outras
              implementações. Quando a soma já é múltipla de 11, a fórmula
              clássica produz 11 e exige uma correção para 0; aqui o resto sai 0
              direto. E quando o resto é 1, a clássica produz 10, que não cabe em
              uma casa; aqui o resultado é 10 e a única regra extra necessária é
              tratá-lo como 0 — o RENAVAM não usa a letra X. Escrever o cálculo
              sem o <code>× 10</code> é o erro mais comum de quem porta o código
              de outro documento: sem ele o dígito sai errado em todos os casos
              em que a soma não é múltipla de 11.
            </p>
          </GuideSection>

          <GuideSection title="RENAVAM, chassi e placa são três coisas diferentes">
            <p>
              Todo veículo carrega três identificadores que o público costuma
              tratar como sinônimos, e eles têm origem, formato e estabilidade
              diferentes:
            </p>
            <ul>
              <li>
                <strong>RENAVAM</strong> — identificador administrativo,{" "}
                <strong>onze dígitos numéricos</strong> com dígito verificador.
                Nasce no primeiro registro e nunca muda.
              </li>
              <li>
                <strong>Chassi (VIN)</strong> — identificador físico gravado pelo
                fabricante, <strong>17 caracteres alfanuméricos</strong>. O padrão
                internacional exclui as letras I, O e Q justamente para não
                confundir com os algarismos 1 e 0. Também não muda, mas é uma
                chave global, não brasileira.
              </li>
              <li>
                <strong>Placa</strong> — vinculada ao emplacamento e a mais
                volátil das três: muda em transferência entre estados, em segunda
                via e na migração para o{" "}
                <a href="/guias/placa-mercosul-vs-antiga">padrão Mercosul</a>.
              </li>
            </ul>
            <p>
              A consequência para modelagem é direta: a placa é um atributo do
              veículo, não a chave dele. Sistemas que indexam frota por placa
              acabam com registros duplicados depois de qualquer transferência, e
              históricos de multa que se perdem. Chassi e RENAVAM servem como
              chave estável; entre os dois, o RENAVAM é o que aparece nos serviços
              públicos brasileiros.
            </p>
            <p>
              A diferença também aparece na validação de entrada. Os três exigem
              expressões regulares distintas — <code>{RENAVAM_REGEX.source}</code>{" "}
              para o RENAVAM, um alfabeto reduzido e sem acento para o chassi,
              duas alternativas para a placa. O guia de{" "}
              <a href="/guias/regex-documentos-brasileiros">
                regex para documentos brasileiros
              </a>{" "}
              reúne os padrões e mostra por que nenhum deles substitui a conferência
              do dígito verificador.
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia do RENAVAM"
            sample="12345678900"
            segments={RENAVAM_SEGMENTS}
            length={RENAVAM_LENGTH}
            details={[
              "Número do registro nacional do veículo: dez dígitos.",
              "Dígito verificador: módulo 11 sobre a base.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={RENAVAM_REGEX.source} label="Regex do RENAVAM" />
          </div>

          <AlgorithmSection
            intro={
              <>
                Base{" "}
                <code className="font-mono text-foreground">1234567890</code> →
                DV <code className="font-mono text-foreground">0</code> →
                RENAVAM{" "}
                <code className="font-mono text-foreground">12345678900</code>
              </>
            }
            steps={[
              "Multiplicar os 10 dígitos pelos pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2, da esquerda para a direita.",
              "Somar os produtos e multiplicar a soma por 10.",
              "DV = resto da divisão por 11; resto 10 vira 0.",
            ]}
            worked={[
              {
                title: "Dígito verificador da base 1234567890",
                steps: [
                  { char: "1", weight: 3 },
                  { char: "2", weight: 2 },
                  { char: "3", weight: 9 },
                  { char: "4", weight: 8 },
                  { char: "5", weight: 7 },
                  { char: "6", weight: 6 },
                  { char: "7", weight: 5 },
                  { char: "8", weight: 4 },
                  { char: "9", weight: 3 },
                  { char: "0", weight: 2 },
                ],
                sum: 231,
                remainder: 0,
                rule: "Antes do resto, a soma é multiplicada por 10: 231 × 10 = 2310, e 2310 dividido por 11 dá resto 0. Um resto 10 seria escrito como 0.",
                result: "0",
              },
            ]}
            note="Números anteriores a 2013 tinham 9 dígitos e continuam válidos com zeros à esquerda — o Validador completa automaticamente."
          />

          <GuideSection title="Erros comuns com RENAVAM">
            <ul>
              <li>
                <strong>Guardar o número como inteiro.</strong> É o erro que mais
                aparece em migração de base: <code>00123456789</code> vira{" "}
                <code>123456789</code> na primeira serialização e o registro passa
                a falhar na validação. RENAVAM é texto de tamanho fixo —{" "}
                <code>varchar(11)</code> no banco, <code>string</code> no
                contrato da API, nunca <code>int</code> nem <code>number</code>.
              </li>
              <li>
                <strong>Exigir exatamente onze caracteres na entrada.</strong> Os
                documentos de veículos antigos continuam circulando com nove
                dígitos impressos. Normalize antes de validar, em vez de rejeitar
                quem digitou o que está no CRLV.
              </li>
              <li>
                <strong>Portar o cálculo de outro documento.</strong> Copiar a
                rotina de CPF ou de PIS e só trocar os pesos produz dígitos
                errados: falta a multiplicação por 10 antes do resto, que é
                exclusiva do RENAVAM.
              </li>
              <li>
                <strong>Confiar apenas na regex.</strong>{" "}
                <code>{RENAVAM_REGEX.source}</code> só diz que há onze dígitos.
                Números como <code>11111111111</code> passam por qualquer teste de
                formato e não têm verificador coerente — sequências repetidas são
                rejeitadas nesta ferramenta por serem lixo típico de formulário,
                não dado de teste.
              </li>
              <li>
                <strong>Aceitar máscara que não existe.</strong> Diferente de CPF
                e CNPJ, o RENAVAM não tem separador oficial. Se a interface
                exibir pontos ou hífens, remova-os antes de comparar com o valor
                armazenado, senão o mesmo veículo é gravado em dois formatos.
              </li>
              <li>
                <strong>Usar o RENAVAM do próprio carro na fixture.</strong> Um
                número real é dado de veículo real, e ele acaba versionado no
                repositório para sempre. É o assunto do guia sobre{" "}
                <a href="/guias/lgpd-dados-de-teste">
                  LGPD e dados de teste
                </a>
                .
              </li>
            </ul>
            <p>
              Boa parte desses tropeços não é específica de veículos: o guia de{" "}
              <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
                erros comuns em validadores de documentos brasileiros
              </a>{" "}
              mostra os mesmos padrões em CPF, CNPJ e CEP.
            </p>
          </GuideSection>

          <FaqSection items={RENAVAM_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Portal de Serviços do SENATRAN",
                href: "https://portalservicos.senatran.serpro.gov.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
