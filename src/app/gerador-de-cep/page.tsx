import type { Metadata } from "next";

import {
  CepFormatterPanel,
  CepGeneratorPanel,
  CepLocatorPanel,
} from "@/components/cep/panels";
import { CEP_SEGMENTS } from "@/components/cep/segments";
import { CopyableCode, SectionLabel } from "@/components/docs";
import {
  AnatomySection,
  DocsWarning,
  FaqSection,
  GuideSection,
  OfficialLinksSection,
} from "@/components/doc-tool/reference";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CEP_LENGTH,
  CEP_MASKED_REGEX,
  CEP_REGEX,
  CEP_UFS,
  mask,
  MAX_BATCH_SIZE,
} from "@/lib/cep";
import { CEP_FAQ } from "@/lib/faq";
import { SITE_NAME } from "@/lib/site";
import { faqJsonLd, toolJsonLd } from "@/lib/structured-data";

const PAGE_TITLE =
  "Gerador de CEP por estado — faixas dos Correios e localizador de UF";
const PAGE_DESCRIPTION =
  "Gere CEPs de teste dentro da faixa oficial de cada estado, em lote. Descubra a UF de um CEP sem consultar API e aplique ou remova a máscara 00000-000.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/gerador-de-cep",
  },
  openGraph: {
    type: "website",
    url: "/gerador-de-cep",
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
  name: "Gerador de CEP",
  path: "/gerador-de-cep",
  description: PAGE_DESCRIPTION,
  featureList: [
    `Geração de CEP por estado em lote (até ${MAX_BATCH_SIZE} por vez)`,
    "Faixas oficiais de CEP dos Correios por UF",
    "Localização da UF a partir do CEP",
    "Formatação e remoção da máscara 00000-000",
  ],
});

function formatCepNumber(value: number): string {
  return mask(String(value).padStart(CEP_LENGTH, "0"));
}

export default function GeradorDeCep() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd data={webApplicationJsonLd} />
      <JsonLd data={faqJsonLd(CEP_FAQ)} />

      <SiteHeader
        active="cep"
        badge="Faixas oficiais dos Correios"
        heading="Gerador de CEP por estado"
        lead="Sorteia CEPs dentro da faixa oficial da unidade federativa que você escolher, descobre a UF de um CEP que você já tem e alterna entre 00000000 e 00000-000. Tudo resolvido por faixa numérica, sem consultar nenhum serviço externo."
      />

      <Tabs defaultValue="generator" className="mt-8 w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl !h-11">
          <TabsTrigger value="generator">Gerador</TabsTrigger>
          <TabsTrigger value="locator">Localizar UF</TabsTrigger>
          <TabsTrigger value="formatter">Formatador</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="mt-5">
          <CepGeneratorPanel />
        </TabsContent>

        <TabsContent value="locator" className="mt-5">
          <CepLocatorPanel />
        </TabsContent>

        <TabsContent value="formatter" className="mt-5">
          <CepFormatterPanel />
        </TabsContent>
      </Tabs>

      <div className="mt-14">
        <section aria-label="Referência" className="space-y-10">
          <DocsWarning>
            Os CEPs gerados caem dentro da faixa correta de cada estado, mas são
            sorteados ao acaso e podem não corresponder a um logradouro real.
            Use apenas para testes de software.
          </DocsWarning>

          <GuideSection title="Os oito dígitos, do país ao quarteirão">
            <p>
              O Código de Endereçamento Postal é lido da esquerda para a direita,
              do mais geral para o mais específico. Os cinco primeiros dígitos
              formam o <strong>prefixo</strong>, que localiza a área; os três
              últimos são o <strong>sufixo</strong>, que aponta o logradouro, um
              trecho de logradouro ou uma unidade de distribuição — caixas postais
              e grandes usuários entram aqui. Não existe dígito verificador em
              lugar nenhum: os oito dígitos são todos informação de endereço.
            </p>

            <h3>01310-100, dígito a dígito</h3>
            <p>
              O CEP de um trecho da Avenida Paulista, em São Paulo, se decompõe
              assim:
            </p>
            <ul>
              <li>
                <code>0</code> — <strong>região</strong>. É o dígito que divide o
                país em dez regiões postais; a região 0 cobre a capital paulista e
                o entorno.
              </li>
              <li>
                <code>1</code> — <strong>sub-região</strong>. Recorta a região em
                blocos menores.
              </li>
              <li>
                <code>3</code> — <strong>setor</strong>.
              </li>
              <li>
                <code>1</code> — <strong>subsetor</strong>.
              </li>
              <li>
                <code>0</code> — <strong>divisor de subsetor</strong>, o último
                dígito do prefixo e o mais fino dos cinco.
              </li>
              <li>
                <code>100</code> — <strong>sufixo</strong>, os três dígitos que
                identificam o logradouro ou o trecho atendido.
              </li>
            </ul>
            <p>
              Andar alguns quarteirões pela mesma avenida costuma mexer só no
              sufixo. Atravessar para outro bairro muda o setor ou o subsetor.
              Mudar de estado muda o primeiro dígito, ou os dois primeiros. É essa
              hierarquia que permite descobrir a UF de um CEP comparando o número
              com intervalos, sem consultar base alguma.
            </p>

            <h3>As dez regiões postais</h3>
            <p>
              A numeração começa em São Paulo — região 0 para a capital e o
              entorno, região 1 para o interior do estado — e segue pelo restante
              do país até terminar em 9, o Rio Grande do Sul. Como a divisão é
              geográfica e contínua, cada UF ocupa um ou dois intervalos fechados,
              listados na tabela mais abaixo. Três estados aparecem partidos em
              dois intervalos porque um vizinho corta a faixa: Distrito Federal e
              Goiás se intercalam duas vezes, e o bloco de Roraima separa em dois o
              do Amazonas. O mapa
              completo das regiões está no guia{" "}
              <a href="/guias/cep-estrutura-digitos-faixas-por-estado">
                como o CEP é estruturado
              </a>
              .
            </p>

            <h3>Sem dígito verificador, sobra a faixa</h3>
            <p>
              CPF, CNPJ, PIS e RENAVAM carregam um dígito calculado que denuncia a
              troca de um algarismo. O CEP não. Digitar{" "}
              <code>01310-100</code> como <code>01810-100</code> produz outro CEP
              plausível, dentro da mesma faixa de São Paulo, e nenhuma verificação
              local percebe o erro. Para os documentos que têm essa proteção, a
              conta está no guia de{" "}
              <a href="/guias/modulo-11-digito-verificador">
                módulo 11
              </a>
              ; para o CEP, o que dá para checar offline é formato mais faixa.
            </p>
          </GuideSection>

          <AnatomySection
            title="Anatomia do CEP"
            sample="01310-100"
            segments={CEP_SEGMENTS}
            length={CEP_LENGTH}
            details={[
              "Prefixo: região, sub-região, setor, subsetor e divisor de subsetor, nessa ordem.",
              "Sufixo: logradouro, trecho de logradouro, caixa postal ou grande usuário.",
            ]}
          />

          <div className="space-y-3">
            <SectionLabel>Regex</SectionLabel>
            <CopyableCode value={CEP_REGEX.source} label="Regex sem máscara" />
            <CopyableCode
              value={CEP_MASKED_REGEX.source}
              label="Regex com máscara"
            />
          </div>

          <div className="space-y-3">
            <SectionLabel>Faixas de CEP por estado</SectionLabel>
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left">
                    <th className="px-4 py-2 font-medium">UF</th>
                    <th className="px-4 py-2 font-medium">Estado</th>
                    <th className="px-4 py-2 text-right font-medium">Faixa</th>
                  </tr>
                </thead>
                <tbody>
                  {CEP_UFS.map((entry) => (
                    <tr key={entry.uf} className="border-b last:border-0">
                      <td className="px-4 py-2 font-mono">{entry.uf}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {entry.name}
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-[11px] text-muted-foreground sm:text-xs">
                        {entry.ranges
                          .map(
                            ([start, end]) =>
                              `${formatCepNumber(start)}–${formatCepNumber(end)}`,
                          )
                          .join(" · ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <GuideSection title="CEP geral de município e CEP de logradouro">
            <p>
              Nem todo CEP aponta para uma rua. Municípios pequenos costumam ter um
              único código atendendo o território inteiro, o <strong>CEP geral</strong>,
              reconhecível pelo sufixo <code>000</code>. Nas cidades grandes acontece
              o oposto: o mesmo bairro tem dezenas de CEPs, um por logradouro e às
              vezes um por trecho, além dos códigos reservados a caixas postais e a
              grandes usuários — um órgão público ou uma empresa que recebe
              correspondência em volume ganha CEP próprio. Esse último tipo identifica
              o destinatário, não a via.
            </p>
            <p>
              A diferença aparece no primeiro formulário que preenche endereço a
              partir do CEP. Com um CEP geral, a consulta devolve município e UF, mas
              logradouro e bairro voltam em branco — e a tela precisa deixar o usuário
              digitar a rua em vez de travar ou exibir erro. Uma massa de teste de
              endereços sem pelo menos um CEP geral não exercita esse caminho, que é
              justamente o que quebra em produção.
            </p>
            <p>
              Os números sorteados aqui respeitam a faixa da UF, mas não distinguem
              entre os tipos: pelo número não há como saber se ele seria um CEP geral,
              de logradouro ou de grande usuário. Para montar o endereço completo em
              volta dele, com estado e cidade coerentes, use o{" "}
              <a href="/gerador-de-pessoas">gerador de pessoas</a>.
            </p>
          </GuideSection>

          <GuideSection title="Validar formato e faixa em vez de consultar uma API">
            <p>
              Sem sair da sua aplicação dá para checar três coisas. Primeira: se
              restaram oito dígitos depois de remover a máscara. Segunda: se o número
              cai em algum intervalo conhecido — fora deles, o CEP não pertence a UF
              nenhuma. Terceira, a mais útil e a mais esquecida: se a UF daquele
              intervalo bate com o estado selecionado no formulário. É essa terceira
              checagem que pega o cadastro com CEP da faixa de Pernambuco e estado
              Paraná, um erro que a consulta de logradouro sozinha não denuncia.
            </p>
            <p>
              Um serviço externo responde outra pergunta: se aquele CEP existe e a que
              logradouro corresponde. Pergunta legítima em produção, péssima dependência
              dentro da suíte de testes. A partir do momento em que um teste de unidade
              faz uma requisição HTTP, ele depende de rede, de um serviço de terceiro
              estar no ar e do limite de requisições dele. O que passava ontem falha hoje
              por timeout, o tempo total cresce junto com o número de casos e o resultado
              deixa de ser determinístico, porque a base de CEPs muda com o tempo.
            </p>
            <p>
              O arranjo que costuma sobreviver: validar formato e faixa localmente, com
              dados fixos; isolar a chamada externa atrás de uma interface e usar um
              duplo de teste nos testes de unidade e de componente; e manter um punhado
              de testes de integração que realmente batem no serviço, rodando fora da
              suíte principal, onde uma falha de rede não derruba o build. O mesmo
              raciocínio vale para{" "}
              <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
                montar massa de dados de teste
              </a>{" "}
              e é o motivo de preferir{" "}
              <a href="/guias/lgpd-dados-de-teste">dados fictícios a dados reais</a> em
              ambiente de desenvolvimento.
            </p>
          </GuideSection>

          <FaqSection items={CEP_FAQ} />

          <OfficialLinksSection
            references={[
              {
                label: "Correios — Tudo sobre CEP",
                href: "https://www.correios.com.br/enviar/precisa-de-ajuda/tudo-sobre-cep",
              },
              {
                label: "Correios — Busca CEP",
                href: "https://buscacepinter.correios.com.br/",
              },
            ]}
          />
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
