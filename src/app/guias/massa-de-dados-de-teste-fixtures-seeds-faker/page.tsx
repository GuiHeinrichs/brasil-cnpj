import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("massa-de-dados-de-teste-fixtures-seeds-faker")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Quase todo projeto começa com três registros escritos à mão num arquivo{" "}
        <code>seed.sql</code>: &ldquo;João Teste&rdquo;, &ldquo;Maria
        Teste&rdquo; e um terceiro com CPF <code>111.111.111-11</code>. Funciona
        até o dia em que alguém abre a tela de listagem e descobre que a
        paginação nunca foi exercitada, que o filtro por estado retorna sempre o
        mesmo resultado e que o relatório por região fiscal quebra em produção
        porque todos os CPFs da base de teste tinham o mesmo nono dígito. A massa
        de dados não é um detalhe de infraestrutura: ela define quais bugs o seu
        conjunto de testes é <em>capaz</em> de encontrar.
      </p>

      <h2>Três propriedades de uma boa massa: determinismo, coerência e volume</h2>
      <p>
        <strong>Determinismo</strong> é a mais negligenciada. Uma massa
        determinística produz exatamente os mesmos registros toda vez que roda,
        dada a mesma entrada. Sem isso, você tem um teste que falha uma vez a
        cada trinta execuções porque o gerador sorteou um sobrenome com
        apóstrofo, e ninguém consegue reproduzir. O conserto não é remover a
        aleatoriedade — é torná-la controlada por uma semente que você registra
        na saída do teste.
      </p>
      <p>
        <strong>Coerência</strong> é o que separa massa útil de ruído
        sintaticamente válido. Um registro pode ter CPF com dígito verificador
        correto, CEP com oito algarismos e telefone com nove — e ainda assim ser
        impossível: CPF emitido no Rio Grande do Sul, CEP de Manaus, DDD de São
        Paulo e cidade de Recife. Cada campo passa isolado, o conjunto não faz
        sentido, e qualquer regra que cruze dois campos deixa de ser testada.
      </p>
      <p>
        <strong>Volume</strong> não significa &ldquo;muitas linhas&rdquo;, e sim
        distribuição. Um milhão de registros idênticos exercita menos código do
        que duzentos bem escolhidos. O que você quer é cobertura do espaço de
        entrada: todas as UFs, nomes curtos e longos, empresas abertas em 1992 e
        em 2025, pessoas com 18 anos recém-completos e com 79. Volume alto tem
        seu lugar — índice faltando e consulta N+1 só aparecem com carga —, mas é
        uma preocupação de outra camada.
      </p>

      <h2>Uma estratégia por camada, não uma massa única</h2>
      <p>
        O erro estrutural mais caro é tentar servir todas as camadas de teste com
        o mesmo arquivo. O teste unitário quer um registro previsível e legível
        dentro do próprio arquivo de teste; o ambiente de homologação quer
        milhares de fichas variadas; o teste de carga quer milhões e não se
        importa com o conteúdo. Misturar isso gera um <code>seed</code> gigante
        que ninguém entende e que ninguém ousa mudar.
      </p>
      <DataTable
        caption="Cada camada tem uma exigência dominante — e ela decide a técnica."
        headers={["Camada", "Ordem de grandeza", "Origem dos dados", "Semente"]}
        rows={[
          [
            "Teste unitário",
            "1 a 3 registros",
            "Literais no próprio teste ou factory com override explícito",
            "Nenhuma — valores fixos",
          ],
          [
            "Teste de integração",
            "dezenas",
            "Factory gravando em banco dentro de transação revertida",
            "Fixa por caso de teste",
          ],
          [
            "Seed de desenvolvimento",
            "centenas",
            "Script versionado no repositório",
            "Fixa e commitada",
          ],
          [
            "Homologação / QA",
            "milhares",
            "Mesmo script + lote curado de casos-limite",
            "Fixa e registrada junto com o ambiente",
          ],
          [
            "Teste de carga",
            "milhões",
            "Geração em streaming, sem materializar tudo em memória",
            "Uma por partição ou worker",
          ],
        ]}
      />
      <p>
        A regra prática: quanto mais perto do código, mais explícito e menor deve
        ser o dado. Um teste unitário que depende de uma linha específica de um
        seed de mil registros é um teste que vai quebrar quando alguém mexer no
        seed por um motivo não relacionado. Se o teste precisa de um CPF de São
        Paulo, ele deve dizer isso no próprio corpo — e não confiar que o
        registro de índice 47 continua sendo paulista.
      </p>

      <h2>Faker em JavaScript, Python e Java — o que cada um oferece e onde falha</h2>
      <p>
        Os três ecossistemas têm uma biblioteca madura de geração de dados
        sintéticos, mas a cobertura de Brasil varia muito entre elas. Vale
        conferir na versão exata que você usa, porque os provedores mudam entre
        releases.
      </p>
      <p>
        Em JavaScript e TypeScript, o <code>@faker-js/faker</code> expõe uma
        instância já configurada por idioma. A API é a mesma em todos os locales
        — <code>person</code>, <code>location</code>, <code>internet</code>,{" "}
        <code>company</code> —, e o locale troca apenas os dicionários. Isso
        significa que <strong>não existe método de documento brasileiro</strong>:
        não há CPF, CNPJ, RG, PIS, RENAVAM nem título de eleitor. O{" "}
        <code>zipCode()</code> devolve algo no formato de CEP, mas sem relação
        com o estado sorteado em <code>state()</code>.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="O locale pt-BR resolve nome, endereço e telefone. Documentos ficam por sua conta."
        code={`import { fakerPT_BR as faker } from "@faker-js/faker";

faker.seed(42);

const pessoa = {
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  cidade: faker.location.city(),
  uf: faker.location.state({ abbreviated: true }),
  cep: faker.location.zipCode(),
  // Sem provedor de documento: o CPF precisa vir de outro lugar,
  // e precisa respeitar a UF acima para o registro ser coerente.
  cpf: gerarCpf({ uf: "SP" }),
};`}
      />
      <p>
        Em Python, o <code>Faker</code> (pacote <code>faker</code>, do projeto
        joke2k) vai bem mais longe: o provider <code>pt_BR</code> inclui{" "}
        <code>cpf()</code> e <code>cnpj()</code> com dígitos verificadores
        calculados, além de nomes e endereços. É a opção mais completa dos três
        para documentos brasileiros. A semente é definida em nível de classe —
        detalhe que confunde quem espera um método de instância.
      </p>
      <CodeBlock
        language="Python"
        caption="Faker.seed é método de classe e afeta o gerador compartilhado; seed_instance isola uma instância."
        code={`from faker import Faker

fake = Faker("pt_BR")
Faker.seed(42)  # semente global, compartilhada entre instâncias

registro = {
    "nome": fake.name(),
    "cpf": fake.cpf(),
    "cnpj": fake.cnpj(),
    "cidade": fake.city(),
    "estado_sigla": fake.estado_sigla(),
    "cep": fake.postcode(),
}

# Para paralelizar sem colisão de semente, use instâncias isoladas:
worker = Faker("pt_BR")
worker.seed_instance(1001)`}
      />
      <p>
        No mundo Java, o <code>JavaFaker</code> original está parado há anos; o
        fork mantido é o <strong>Datafaker</strong>, que herdou a API e ganhou
        provedores próprios, incluindo CPF e CNPJ com variantes válida e
        inválida. Como o gerador aceita um <code>Random</code> no construtor, a
        reprodutibilidade fica explícita no código, o que é uma vantagem em
        relação às sementes globais dos outros dois.
      </p>
      <p>
        Onde os três falham igualmente: <strong>nenhum monta uma ficha
        internamente coerente</strong>. Você consegue um CPF válido e um estado
        válido, mas não um CPF cuja região fiscal corresponda àquele estado, com
        CEP dentro da faixa da UF e DDD compatível. Documentos menos comuns —
        CNH, PIS/PASEP, RENAVAM, título de eleitor — não têm provedor em nenhum
        deles. E o CNPJ alfanumérico, que convive com o numérico desde 2026,
        ainda não aparece nas bibliotecas genéricas; se o seu sistema vai receber
        esse formato, leia{" "}
        <a href="/guias/cnpj-alfanumerico-2026">o guia do CNPJ alfanumérico</a>{" "}
        antes de montar a massa.
      </p>

      <h2>Factories: por que elas envelhecem melhor que fixtures em JSON</h2>
      <p>
        Fixture é um arquivo com registros prontos. Factory é uma função que
        constrói um registro, com valores padrão razoáveis e possibilidade de
        sobrescrever campo a campo. A diferença aparece na primeira migração de
        banco.
      </p>
      <p>
        Quando você adiciona uma coluna obrigatória, todo arquivo de fixture
        passa a estar incompleto — e são dezenas deles, espalhados por pastas,
        cada um com quarenta campos copiados. Com factory, o valor padrão entra
        em um lugar só. O segundo ganho é de leitura: em{" "}
        <code>buildPessoa({"{"} uf: &quot;SP&quot; {"}"})</code> fica evidente
        que o teste é sobre São Paulo, enquanto{" "}
        <code>fixtures/pessoas.json[3]</code> obriga quem lê a abrir outro
        arquivo para descobrir por que aquele índice foi escolhido. O terceiro é
        político: fixtures acumulam registros que ninguém sabe se ainda são
        usados, e a pasta só cresce.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Padrões coerentes por UF, contador para campos únicos e override explícito do que o teste exige."
        code={`type Pessoa = {
  nome: string;
  cpf: string;
  uf: string;
  cep: string;
  ddd: number;
  email: string;
};

// Contador de instância: garante unicidade sem depender de aleatoriedade.
let seq = 0;

const PADRAO_POR_UF: Record<string, { cep: string; ddd: number }> = {
  SP: { cep: "04571-010", ddd: 11 },
  RJ: { cep: "20031-170", ddd: 21 },
  MG: { cep: "30130-010", ddd: 31 },
};

export function buildPessoa(overrides: Partial<Pessoa> = {}): Pessoa {
  const uf = overrides.uf ?? "SP";
  const base = PADRAO_POR_UF[uf];
  seq += 1;

  return {
    nome: \`Pessoa Teste \${seq}\`,
    cpf: gerarCpf({ uf }),      // nono dígito conforme a região fiscal da UF
    uf,
    cep: base.cep,              // dentro da faixa de CEP da UF
    ddd: base.ddd,
    email: \`pessoa\${seq}@example.com\`,
    ...overrides,
  };
}

export function resetFactory(): void {
  seq = 0;
}`}
      />
      <p>
        Repare no <code>resetFactory</code>. Contadores globais são a fonte mais
        comum de teste que passa sozinho e falha na suíte inteira: o terceiro
        teste espera <code>Pessoa Teste 1</code> e recebe{" "}
        <code>Pessoa Teste 7</code> porque outros arquivos rodaram antes. Zere no{" "}
        <code>beforeEach</code>, ou não asserte sobre o valor do contador.
      </p>

      <h2>Seeds reproduzíveis com semente fixa</h2>
      <p>
        Fixar a semente do gerador de números aleatórios é o primeiro passo, mas
        sozinho não basta. Três outras fontes de variação costumam sobrar:
      </p>
      <ul>
        <li>
          <strong>O relógio.</strong> Um seed que chama a data de hoje produz
          idades diferentes a cada execução, e um teste de &ldquo;maior de
          idade&rdquo; passa hoje e falha no aniversário do registro. Use uma
          data de referência constante e derive tudo dela.
        </li>
        <li>
          <strong>Os identificadores.</strong> UUID aleatório e chave
          auto-incremento do banco mudam entre execuções. Se algum teste compara
          IDs, gere-os de forma determinística a partir da semente.
        </li>
        <li>
          <strong>A ordem de inserção.</strong> Inserções concorrentes ou
          iteração sobre estruturas sem ordem garantida embaralham o resultado.
          Ordene antes de gravar.
        </li>
      </ul>
      <CodeBlock
        language="Python"
        caption="Instância própria de Random e data de referência constante: a mesma semente devolve a mesma massa."
        code={`import random
from datetime import date, timedelta

DATA_REFERENCIA = date(2026, 1, 1)  # nunca date.today() em um seed
SEMENTE = 20260101

def gerar_massa(quantidade: int, semente: int = SEMENTE):
    rnd = random.Random(semente)  # instância isolada, não o módulo global
    registros = []
    for i in range(quantidade):
        idade = rnd.randint(18, 80)
        nascimento = DATA_REFERENCIA - timedelta(days=idade * 365 + rnd.randint(0, 364))
        registros.append({"indice": i, "idade": idade, "nascimento": nascimento})
    return registros

assert gerar_massa(50) == gerar_massa(50)  # determinismo verificado no próprio seed`}
      />
      <p>
        Duas disciplinas complementam isso. Primeira: <strong>imprima a semente
        na saída do teste</strong>. Se a suíte sorteia a semente em CI para
        ampliar cobertura, o log precisa conter o valor usado, para que a falha
        seja reproduzível com um comando. Segunda: <strong>fixe a versão da
        biblioteca de geração</strong>. Semente igual com versão diferente não
        garante saída igual — dicionários de nomes e cidades mudam entre
        releases, e um <code>^</code> no <code>package.json</code> transforma
        determinismo em ilusão.
      </p>

      <h2>Coerência entre campos e por que ela importa mais do que parece</h2>
      <p>
        Um registro brasileiro tem várias amarrações implícitas que nenhum
        validador de campo isolado verifica:
      </p>
      <DataTable
        caption="Se estes pares não conversam, o registro é sintaticamente válido e logicamente impossível."
        headers={["Campos amarrados", "Regra"]}
        rows={[
          [
            "UF ↔ 9º dígito do CPF",
            "O nono dígito indica a região fiscal de emissão: 8 para SP, 6 para MG, 7 para ES e RJ.",
          ],
          [
            "UF ↔ faixa de CEP",
            "SP vai de 01000-000 a 19999-999, RJ de 20000-000 a 28999-999, MG de 30000-000 a 39999-999.",
          ],
          [
            "UF ↔ DDD",
            "11 a 19 em SP, 21/22/24 no RJ, 31 a 38 em MG.",
          ],
          [
            "Cidade ↔ UF",
            "Sorteio independente produz Curitiba/BA, que passa em qualquer NOT NULL.",
          ],
          [
            "Nascimento ↔ idade",
            "Se os dois campos são persistidos, precisam bater na data de referência.",
          ],
          [
            "Razão social ↔ natureza jurídica",
            "O sufixo LTDA ou S.A. faz parte do nome empresarial e tem de acompanhar a natureza.",
          ],
          [
            "Abertura da empresa ↔ hoje",
            "Data de abertura no futuro passa em validação de formato e quebra qualquer cálculo de tempo de atividade.",
          ],
        ]}
      />
      <p>
        O custo de ignorar isso é duplo. O técnico: regras que cruzam campos
        nunca são exercitadas. Um relatório que agrupa clientes por região fiscal
        a partir do CPF e confere contra a UF cadastrada vai passar verde
        enquanto a massa não tiver conflito nenhum — e vai explodir no primeiro
        dia em produção, porque em produção existem divergências legítimas
        (quem tirou o CPF em um estado e mudou para outro; veja{" "}
        <a href="/guias/regiao-fiscal-cpf">o que o nono dígito realmente diz</a>).
        O custo humano é mais sutil: quando o QA percebe que a massa é
        incoerente, ele para de confiar no ambiente e passa a corrigir registros
        na mão, o que destrói a reprodutibilidade que você tanto trabalhou para
        conseguir.
      </p>
      <p>
        É exatamente esse acoplamento que o{" "}
        <a href="/gerador-de-pessoas">gerador de pessoas</a> resolve: você escolhe
        a UF e ele deriva o nono dígito do CPF, o CEP dentro da faixa daquele
        estado, o DDD do celular e a cidade da lista da UF, tudo do mesmo sorteio.
        O <a href="/gerador-de-empresas">gerador de empresas</a> faz o mesmo para
        razão social, natureza jurídica, porte, data de abertura e endereço. Os
        e-mails das fichas usam domínios reservados pela IANA para documentação e
        testes — <code>example.com</code>, <code>exemplo.test</code>,{" "}
        <code>mail.invalid</code> e afins —, de modo que uma rotina de envio
        disparada por engano em homologação não chega a caixa de ninguém. Se você
        precisa só dos nomes, o <a href="/gerador-de-nomes">gerador de nomes</a>{" "}
        entrega a mesma base de antropônimos brasileiros.
      </p>

      <h2>Os casos-limite que sua massa precisa ter</h2>
      <p>
        Geração aleatória cobre o caso médio com folga e quase nunca cobre a
        borda. Por isso a massa de homologação deve ser{" "}
        <strong>gerada mais um lote curado</strong> — registros escritos à mão
        para forçar situações específicas, marcados como tal para ninguém
        &ldquo;limpar&rdquo; depois.
      </p>
      <DataTable
        caption="Lote curado mínimo para um cadastro brasileiro."
        headers={["Caso-limite", "O que ele quebra"]}
        rows={[
          [
            "CPF começando com zero",
            "012.345.678-90 é válido; armazenado como inteiro vira 12345678, e a comparação passa a falhar.",
          ],
          [
            "CPF com todos os dígitos iguais",
            "111.111.111-11 passa no cálculo do módulo 11 e precisa ser rejeitado por regra à parte.",
          ],
          [
            "CNPJ alfanumérico",
            "12.ABC.345/01DE-35 quebra colunas numéricas, máscaras e regex antigas.",
          ],
          [
            "Nome com acento, cedilha e apóstrofo",
            "Conceição D'Ávila expõe encoding errado, colação de banco e slug quebrado.",
          ],
          [
            "Nome de uma letra e nome de 80 caracteres",
            "Validação de tamanho mínimo, truncamento silencioso e quebra de layout em PDF.",
          ],
          [
            "CEP na virada de faixa",
            "19999-999 é o último de SP e 20000-000 o primeiro do RJ; comparação com > em vez de >= erra aqui.",
          ],
          [
            "Nascido em 29 de fevereiro",
            "Cálculo de idade e aniversário em ano não bissexto.",
          ],
          [
            "Maioridade completada na data de referência",
            "Comparações com > e >= divergem exatamente neste registro.",
          ],
          [
            "CPF duplicado em dois cadastros",
            "Revela se a unicidade é regra de banco, de aplicação ou de ninguém.",
          ],
          [
            "Endereço sem número e sem complemento",
            "Campos opcionais concatenados geram vírgula solta e linha vazia na etiqueta.",
          ],
        ]}
      />
      <p>
        A lista de armadilhas do lado do validador — máscara não removida,
        conversão para número, regex que aceita catorze dígitos — está detalhada
        em{" "}
        <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
          dez erros comuns em validadores de documentos brasileiros
        </a>
        . Vale montar um caso de teste para cada item de lá.
      </p>

      <h2>Um exemplo completo: seed em SQL e em Prisma</h2>
      <p>
        O seed mais simples que funciona é um arquivo SQL versionado, com
        registros coerentes e comentados. Serve para subir um ambiente local em
        segundos e é fácil de auditar em revisão de código.
      </p>
      <CodeBlock
        language="SQL — PostgreSQL"
        caption="CPF armazenado como texto de 11 caracteres; cada ficha com UF, CEP e DDD combinando."
        code={`CREATE TABLE cliente (
  id          bigserial PRIMARY KEY,
  nome        text        NOT NULL,
  cpf         char(11)    NOT NULL UNIQUE,  -- texto: preserva zero à esquerda
  uf          char(2)     NOT NULL,
  cep         char(8)     NOT NULL,
  ddd         smallint    NOT NULL,
  email       text        NOT NULL,
  criado_em   timestamptz NOT NULL DEFAULT '2026-01-01T00:00:00Z'
);

INSERT INTO cliente (nome, cpf, uf, cep, ddd, email) VALUES
  -- CPF com 9º dígito 8 (SP), CEP na faixa 01000000-19999999, DDD de SP
  ('Helena Barbosa',  '37120945823', 'SP', '04571010', 11, 'helena.barbosa@example.com'),
  -- CPF com 9º dígito 7 (ES e RJ), CEP na faixa 20000000-28999999
  ('Rafael Andrade',  '52863019759', 'RJ', '20031170', 21, 'rafael.andrade@example.org'),
  -- CPF com 9º dígito 6 (MG), CEP na faixa 30000000-39999999
  ('Beatriz Nogueira','63820541608', 'MG', '30130010', 31, 'beatriz.n@example.net'),
  -- Caso-limite curado: CPF começando com zero. NÃO REMOVER.
  ('Zero à Esquerda', '01234567890', 'SP', '01001000', 11, 'zero@example.com');

-- Mesma ideia na tabela de empresas: CNPJ em char(14), sem máscara.
INSERT INTO fornecedor (razao_social, cnpj, uf, abertura) VALUES
  ('Nogueira Logística LTDA',     '11222333000181', 'SP', '2011-03-14'),
  ('Barbosa & Andrade Sistemas S.A.', '37915427000120', 'MG', '1998-07-02'),
  ('Vale Norte Distribuidora LTDA',   '58206193000111', 'RJ', '2023-11-09');`}
      />
      <p>
        Quando a massa passa de algumas centenas de linhas, o SQL escrito à mão
        deixa de valer a pena e o seed vira código. Em projetos Node com Prisma, o
        script fica em <code>prisma/seed.ts</code> e roda com{" "}
        <code>npx prisma db seed</code>, desde que o caminho esteja declarado no{" "}
        <code>package.json</code>.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Semente fixa, lote curado inserido primeiro e criação em massa com createMany."
        code={`// prisma/seed.ts — configure em package.json:
//   "prisma": { "seed": "tsx prisma/seed.ts" }
import { PrismaClient } from "@prisma/client";
import { fakerPT_BR as faker } from "@faker-js/faker";

import { buildPessoa, resetFactory } from "../test/factories/pessoa";

const prisma = new PrismaClient();
const SEMENTE = 20260101;
const UFS = ["SP", "RJ", "MG"] as const;

// Registros de borda: escritos à mão, sempre presentes, nunca sorteados.
const CURADOS = [
  buildPessoa({ nome: "Zero à Esquerda", cpf: "01234567890", uf: "SP" }),
  buildPessoa({ nome: "Conceição D'Ávila", uf: "MG" }),
  buildPessoa({ nome: "Ana", uf: "RJ" }),
];

async function main() {
  faker.seed(SEMENTE);
  resetFactory();

  await prisma.cliente.deleteMany();       // seed idempotente
  await prisma.cliente.createMany({ data: CURADOS });

  const gerados = Array.from({ length: 500 }, (_, i) =>
    buildPessoa({
      nome: faker.person.fullName(),
      uf: UFS[i % UFS.length],             // distribuição garantida entre UFs
    }),
  );

  await prisma.cliente.createMany({ data: gerados });
  console.log(\`Seed concluído com semente \${SEMENTE}: \${gerados.length + CURADOS.length} clientes.\`);
}

main().finally(() => prisma.$disconnect());`}
      />
      <p>
        Dois detalhes desse script valem ser copiados. O <code>deleteMany</code>{" "}
        no começo torna o seed idempotente: rodar duas vezes deixa o banco no
        mesmo estado, em vez de duplicar tudo. E a distribuição por{" "}
        <code>i % UFS.length</code> substitui o sorteio de UF — com sorteio, uma
        execução azarada pode não gerar nenhum registro do Rio, e o teste do
        filtro por estado passa sem testar nada.
      </p>

      <h2>O que nunca deve entrar na massa</h2>
      <p>
        Dump de produção, mesmo mascarado. A tentação é grande porque a base real
        tem a variedade que nenhum gerador alcança, e o mascaramento parece
        resolver — troca-se o nome, embaralha-se o CPF, some-se o e-mail. O
        problema é que mascaramento malfeito preserva combinações que
        reidentificam: data de nascimento, CEP e profissão juntos já apontam para
        poucas pessoas; um CPF &ldquo;embaralhado&rdquo; que mantém o nono dígito
        e os dois verificadores ainda carrega informação; e a tabela de
        transações, que ninguém lembra de mascarar, continua contando a história
        toda.
      </p>
      <p>
        Some a isso o fato de ambientes de teste terem controles mais frouxos que
        produção — mais gente com acesso, logs verbosos, dumps circulando por
        anexo — e o cálculo fica simples: dado sintético nunca foi de ninguém,
        então não há o que reidentificar. As obrigações da LGPD e os cuidados
        práticos estão em{" "}
        <a href="/guias/lgpd-dados-de-teste">LGPD e dados de teste</a>.
      </p>
      <p>
        Duas exclusões menores, mas que causam estrago real. Domínios de e-mail
        que existem: se a massa usa <code>@gmail.com</code>, basta uma fila de
        notificação apontada para o ambiente errado para que um desconhecido
        receba a fatura de um cliente fictício — por isso as fichas do bateCarimbo
        usam apenas domínios reservados para documentação. E telefones
        plausíveis: um número com DDD e prefixo de celular válidos pode tocar no
        aparelho de alguém quando o disparo de SMS de homologação vazar para o
        provedor de produção.
      </p>
      <p>
        Por fim, vale registrar o limite honesto da massa sintética: um CPF
        gerado com dígito verificador correto é apenas <em>válido</em>, e validade
        não garante que o número não exista no cadastro da Receita. Por isso a
        massa serve para testar formato, regra de negócio e fluxo — e não para
        simular consulta cadastral. A distinção está detalhada em{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          CPF válido não é CPF existente
        </a>
        .
      </p>
    </ArticleLayout>
  );
}
