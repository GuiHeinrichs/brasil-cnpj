import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("cpf-valido-nao-e-cpf-existente-situacao-cadastral")!;

export const metadata: Metadata = guideMetadata(guide);

const NIVEIS = [
  [
    "Formato",
    "A string tem o tamanho e os caracteres esperados depois de remover a máscara?",
    "Local, microssegundos",
  ],
  [
    "Dígito verificador",
    "Os últimos dígitos batem com o cálculo feito sobre a base?",
    "Local, microssegundos",
  ],
  [
    "Cadastro",
    "Existe uma inscrição com esse número e em que situação ela está?",
    "Chamada externa, centenas de milissegundos",
  ],
];

const SITUACOES_CPF = [
  [
    "Regular",
    "A inscrição existe e não há pendência registrada em nome do titular.",
  ],
  [
    "Pendente de regularização",
    "O titular deixou de entregar alguma declaração à qual estava obrigado.",
  ],
  [
    "Suspensa",
    "O cadastro tem informação incorreta ou faltante e precisa ser corrigido.",
  ],
  [
    "Titular falecido",
    "O óbito foi comunicado à Receita Federal e ficou registrado no cadastro.",
  ],
  [
    "Cancelada",
    "A inscrição foi encerrada por decisão administrativa ou judicial, inclusive em casos de duplicidade.",
  ],
  [
    "Nula",
    "A inscrição foi anulada porque nunca deveria ter existido, em geral por vício ou fraude na origem.",
  ],
];

const SITUACOES_CNPJ = [
  ["Ativa", "A inscrição está em pleno funcionamento perante o cadastro."],
  [
    "Suspensa",
    "A inscrição está temporariamente impedida, por irregularidade cadastral ou por determinação externa.",
  ],
  [
    "Inapta",
    "A pessoa jurídica deixou de cumprir obrigações declaratórias por tempo suficiente para perder a regularidade.",
  ],
  [
    "Baixada",
    "A inscrição foi encerrada. É o fim de linha do cadastro: a empresa não opera mais sob aquele número.",
  ],
  [
    "Nula",
    "A inscrição foi anulada, normalmente por vício na constituição ou por duplicidade.",
  ],
];

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Um validador de CPF responde a uma pergunta de aritmética: os dois últimos
        dígitos batem com a conta feita sobre os nove primeiros? Ele não responde —
        e não tem como responder — se existe alguém por trás daquele número. São
        perguntas diferentes, resolvidas em camadas diferentes do sistema, e
        confundir uma com a outra produz desde bugs bobos de cadastro até decisões
        de produto que não se sustentam.
      </p>

      <h2>Três níveis de verificação: formato, dígito e existência</h2>
      <p>
        Todo documento brasileiro com dígito verificador admite três perguntas
        empilhadas, cada uma mais cara e mais lenta que a anterior:
      </p>
      <DataTable
        caption="As três camadas, do mais barato ao mais caro"
        headers={["Nível", "Pergunta que responde", "Onde e a que custo"]}
        rows={NIVEIS}
      />
      <p>
        O nível de formato é sintático: onze algarismos para o CPF, catorze
        posições para o CNPJ — que desde 2026 aceita letras nas doze primeiras,
        conforme explicado no guia do{" "}
        <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a>. O nível do
        dígito verificador é aritmético: aplica o{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a> sobre a base e
        compara com o que veio na entrada. Os dois rodam dentro do seu processo, sem
        rede, e nessa ordem — não faz sentido gastar uma chamada externa com uma
        string que nem tem o tamanho certo.
      </p>
      <p>
        O terceiro nível é de outra natureza. Não é cálculo: é consulta a um cadastro
        mantido pela Receita Federal, que só ela pode responder. Nenhuma biblioteca de
        validação chega lá offline.
      </p>

      <h2>Por que um gerador produz números válidos que não existem</h2>
      <p>
        O dígito verificador é uma função da base. Para cada conjunto de nove
        algarismos existe exatamente um par de verificadores correto, o que
        significa que há cerca de um bilhão de CPFs bem formados dentro de um
        universo de cem bilhões de sequências de onze algarismos. Um número
        escolhido ao acaso tem por volta de 1% de chance de passar na conferência —
        e é exatamente por isso que o DV serve ao que foi criado: pegar erro de
        digitação, não atestar identidade.
      </p>
      <p>
        Gerar um documento fictício é percorrer esse caminho na ordem inversa:
        sorteia-se a base e calcula-se o par de verificadores. No exemplo didático
        mais conhecido, a base <code>123456789</code> produz soma 210 no primeiro
        dígito (resto 1, menor que 2, então o dígito é 0) e soma 255 no segundo
        (resto 2, então o dígito é <code>11 − 2 = 9</code>), resultando em{" "}
        <code>123.456.789-09</code>. O número passa em qualquer validador do
        mercado e ninguém em sã consciência diria que ele identifica uma pessoa.
      </p>
      <p>
        Vale ser exato sobre o que isso quer dizer. O{" "}
        <a href="/gerador-de-cpf">gerador de CPF</a> e o{" "}
        <Link href="/">gerador de CNPJ</Link> daqui não consultam cadastro nenhum: eles
        sorteiam e calculam. Como o espaço de números bem formados é finito, um
        número gerado pode, por coincidência aritmética, coincidir com uma inscrição
        que já existe. O que o gerador jamais faz é <strong>associar</strong> esse
        número a um nome, a uma data de nascimento ou a um endereço de alguém real —
        e é a associação, não o número solto, que transforma uma sequência de
        algarismos em dado pessoal. As fichas do{" "}
        <a href="/gerador-de-pessoas">gerador de pessoas</a> seguem a mesma lógica:
        campos sorteados que combinam entre si e não correspondem a ninguém.
      </p>

      <h2>As situações cadastrais do CPF</h2>
      <p>
        Existir no cadastro é só metade da resposta. Uma inscrição ativa carrega um
        estado, e esse estado muda ao longo da vida do titular. A consulta pública
        da Receita Federal devolve a situação em que o CPF se encontra:
      </p>
      <DataTable
        caption="Situações cadastrais devolvidas pela consulta pública de CPF"
        headers={["Situação", "O que significa"]}
        rows={SITUACOES_CPF}
      />
      <p>
        Duas observações importam para quem escreve código. A primeira: a consulta
        pública é um formulário web que exige o número do CPF{" "}
        <strong>mais a data de nascimento</strong> do titular, além de verificação
        anti-robô. Não existe uma API aberta e gratuita da Receita para isso, raspar
        o formulário quebra a cada mudança de layout, e a exigência da data já
        denuncia o desenho: a consulta pressupõe que quem pergunta tem algum vínculo
        com a pessoa, não que vai varrer uma lista.
      </p>
      <p>
        A segunda: <strong>&ldquo;Regular&rdquo; não é prova de identidade.</strong>{" "}
        A situação diz que aquela inscrição não tem pendência, não que a pessoa do
        outro lado da tela é o titular. Autenticação de identidade é um problema
        separado, resolvido por outros meios, e nenhuma consulta cadastral substitui
        isso.
      </p>

      <h2>As situações cadastrais do CNPJ</h2>
      <p>
        No cadastro de pessoa jurídica o vocabulário é diferente e a leitura tem
        consequências operacionais mais imediatas, porque sistemas costumam decidir
        se emitem nota, se liberam crédito ou se aceitam um fornecedor com base
        nesse campo.
      </p>
      <DataTable
        caption="Situações cadastrais do CNPJ"
        headers={["Situação", "O que significa"]}
        rows={SITUACOES_CNPJ}
      />
      <p>
        Junto da situação vem a <strong>data da situação cadastral</strong> e um{" "}
        <strong>motivo</strong> — e é o motivo que costuma ser ignorado. Uma inscrição
        baixada por encerramento voluntário e outra baixada de ofício contam
        histórias distintas sobre o mesmo CNPJ.
      </p>
      <p>
        Outro equívoco frequente: tratar <strong>Ativa</strong> como sinônimo de
        &quot;pode emitir nota fiscal&quot;. O CNPJ é o cadastro federal. A
        habilitação para circular mercadoria ou prestar serviço depende de inscrição
        estadual e municipal, que são cadastros à parte, com situações próprias — o
        guia sobre{" "}
        <a href="/guias/cpf-cnpj-inscricao-estadual-mei-diferencas">
          CPF, CNPJ, inscrição estadual e MEI
        </a>{" "}
        detalha essa separação. E há o caso do MEI e do empresário individual, em que
        os dados do CNPJ se confundem com os de uma pessoa física: tratar &quot;dado
        de empresa&quot; como automaticamente impessoal, nesses casos, é um atalho
        perigoso.
      </p>

      <h2>Quando o seu sistema realmente precisa consultar a Receita</h2>
      <p>
        A regra que funciona bem na prática: consulte quando a{" "}
        <strong>decisão depende do estado da inscrição</strong>, não quando você só
        quer garantir que o usuário digitou certo. Situações em que a consulta se
        justifica:
      </p>
      <ul>
        <li>
          Abertura de conta, contratação de crédito e outros fluxos regulatórios em
          que a empresa tem obrigação legal de conhecer a contraparte.
        </li>
        <li>
          Cadastro de fornecedor ou parceiro, onde uma inscrição inapta ou baixada
          muda a decisão de contratar.
        </li>
        <li>
          Emissão de documento fiscal, em que os dados cadastrais do destinatário
          precisam bater com o cadastro oficial.
        </li>
        <li>
          Cobrança recorrente de longo prazo, em que a situação registrada há dois
          anos pode não valer mais hoje.
        </li>
      </ul>
      <p>
        E a lista do que <strong>não</strong> justifica consulta: formulário de
        newsletter, cadastro de conta gratuita, CPF usado apenas como chave de
        deduplicação interna, tela de teste. Nesses casos o módulo 11 basta. Muita
        integração cara existe porque alguém confundiu &quot;quero evitar erro de
        digitação&quot; com &quot;preciso saber quem é essa pessoa&quot;.
      </p>

      <h2>O custo escondido de consultar: latência, disponibilidade e finalidade do tratamento</h2>
      <p>
        Colocar uma chamada externa no caminho síncrono de um cadastro muda o perfil
        de falha da aplicação. A validação local nunca fica fora do ar; um serviço
        externo fica. Formulário que devolve erro 500 porque o provedor caiu trocou um
        problema de qualidade de dado por um de disponibilidade — e barrou justamente
        quem estava com tudo certo.
      </p>
      <p>
        O desenho que costuma resolver: aceitar o cadastro com a validação local,
        marcar o registro como <em>pendente de verificação cadastral</em> e rodar a
        consulta de forma assíncrona, com fila e repetição. A decisão que depende da
        situação (liberar limite, emitir documento, habilitar o fornecedor) espera; o
        cadastro, não.
      </p>
      <p>
        Do lado dos dados, consultar a situação de um documento de terceiro é
        tratamento de dado pessoal quando o documento é de pessoa física. Isso puxa
        as perguntas que a LGPD organiza em torno de{" "}
        <strong>finalidade</strong> e <strong>necessidade</strong>: para que serve a
        consulta neste fluxo, qual base legal a sustenta, o que você guarda do retorno
        e por quanto tempo. Persistir o nome e a data de nascimento devolvidos quando
        a regra só precisava do campo de situação é coleta acima do necessário. O{" "}
        <a href="/guias/lgpd-dados-de-teste">guia sobre LGPD e dados de teste</a>{" "}
        cobre o lado do ambiente de desenvolvimento; aqui a pergunta é de produção.
      </p>
      <p>
        Três práticas de implementação que evitam retrabalho:
      </p>
      <ul>
        <li>
          <strong>Guarde a resposta com carimbo de data.</strong> &quot;Regular&quot;
          sem a data da consulta é um dado sem validade. Defina um TTL explícito e
          reconsulte quando expirar.
        </li>
        <li>
          <strong>Persista o mínimo.</strong> Situação, data da consulta e um
          identificador da requisição costumam bastar. O payload completo raramente
          precisa ir para o banco.
        </li>
        <li>
          <strong>Não jogue o retorno no log.</strong> Log de aplicação é replicado,
          indexado e visto por muita gente. Registre o resultado, não o documento nem
          os dados do titular.
        </li>
      </ul>

      <h2>Como testar uma integração de consulta sem usar documento real</h2>
      <p>
        Nenhum teste automatizado deveria bater no serviço oficial, e nenhum deveria
        usar o CPF de um colega de equipe como fixture. O caminho é isolar a consulta
        atrás de uma interface e testar contra um dublê determinístico, alimentado
        por documentos fictícios gerados.
      </p>
      <p>
        Primeiro, a verificação em camadas, com a consulta como dependência opcional:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="As camadas na ordem: só chega à consulta o que já passou no dígito verificador."
        code={`type Nivel = "formato" | "digito" | "cadastro";

type Resultado =
  | { ok: true; nivel: Nivel }
  | { ok: false; nivel: Nivel; motivo: string };

const SITUACOES_ACEITAS = new Set(["REGULAR"]);

export async function verificarCpf(
  entrada: string,
  consulta?: ConsultaCadastral,
): Promise<Resultado> {
  const digitos = entrada.replace(/\\D/g, "");

  if (digitos.length !== 11) {
    return { ok: false, nivel: "formato", motivo: "tamanho diferente de 11" };
  }
  if (!dvConfere(digitos)) {
    return { ok: false, nivel: "digito", motivo: "digito verificador invalido" };
  }

  // Sem provedor injetado, a verificação para no nível local — e isso
  // precisa ficar explícito na resposta, não implícito num booleano.
  if (!consulta) return { ok: true, nivel: "digito" };

  const { situacao } = await consulta.situacaoCpf(digitos);
  return SITUACOES_ACEITAS.has(situacao)
    ? { ok: true, nivel: "cadastro" }
    : { ok: false, nivel: "cadastro", motivo: "situacao " + situacao };
}`}
      />
      <p>
        Depois, o dublê. A ideia é mapear a situação devolvida a partir de um pedaço
        do próprio documento fictício, para que cada cenário tenha um CPF de teste
        estável e o time consiga reproduzir o caso de &quot;titular falecido&quot;
        sem precisar de um titular falecido:
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Dublê determinístico: o último dígito do CPF fictício escolhe a situação."
        code={`export interface ConsultaCadastral {
  situacaoCpf(cpf: string): Promise<{ situacao: string; consultadoEm: string }>;
}

const MAPA: Record<string, string> = {
  "0": "REGULAR",
  "1": "PENDENTE_DE_REGULARIZACAO",
  "2": "SUSPENSA",
  "3": "TITULAR_FALECIDO",
  "4": "CANCELADA",
  "5": "NULA",
};

export class ConsultaFake implements ConsultaCadastral {
  // Data fixa: teste com relógio real vira teste intermitente.
  static readonly MOMENTO = "2026-09-14T12:00:00Z";

  async situacaoCpf(cpf: string) {
    return {
      situacao: MAPA[cpf.slice(-1)] ?? "REGULAR",
      consultadoEm: ConsultaFake.MOMENTO,
    };
  }
}`}
      />
      <p>
        A suíte passa a cobrir os seis ramos de situação sem rede e sem dado de
        ninguém. Para o adaptador real, o teste que importa é de contrato: um payload
        de exemplo, com os campos pessoais trocados por valores fictícios, conferindo
        se o código desserializa a resposta e traduz os códigos de situação.
        Estratégias de montagem dessa massa estão no guia de{" "}
        <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
          massa de dados de teste
        </a>
        .
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li>
          <strong>Ler &quot;CPF válido&quot; como &quot;CPF do usuário&quot;.</strong>{" "}
          O módulo 11 não autentica ninguém. Se o seu fluxo trata um documento
          validado como identidade confirmada, o buraco está no desenho, não na
          biblioteca.
        </li>
        <li>
          <strong>Esperar que um documento gerado apareça na consulta oficial.</strong>{" "}
          Ele não foi inscrito em lugar nenhum. A resposta esperada para um CPF
          fictício é justamente a ausência de cadastro.
        </li>
        <li>
          <strong>Derrubar o cadastro quando a consulta externa falha.</strong>{" "}
          Timeout de provedor virando erro 500 na tela do usuário é falha de
          arquitetura. Separe o que precisa da verificação do que não precisa.
        </li>
        <li>
          <strong>Cachear a situação para sempre.</strong> Situação cadastral muda.
          Sem TTL e sem data da consulta, você toma decisões de hoje com informação
          de dois anos atrás.
        </li>
        <li>
          <strong>Guardar o retorno inteiro &quot;porque pode ser útil&quot;.</strong>{" "}
          Dado de terceiro armazenado sem finalidade definida é passivo, não ativo.
        </li>
        <li>
          <strong>Confundir CNPJ ativo com empresa apta a operar.</strong> Situação
          federal regular convive com inscrição estadual bloqueada, e o erro só
          aparece na hora de emitir o documento fiscal.
        </li>
        <li>
          <strong>Validar com regex só numérica depois do CNPJ alfanumérico.</strong>{" "}
          Um padrão de catorze dígitos rejeita inscrições legítimas a partir de 2026;
          o guia de{" "}
          <a href="/guias/regex-documentos-brasileiros">
            regex de documentos brasileiros
          </a>{" "}
          traz os padrões atualizados.
        </li>
      </ul>
      <p>
        Manter as camadas separadas é o que põe cada uma no lugar certo: formato e
        dígito verificador resolvem qualidade de entrada e podem rodar a cada tecla
        digitada; situação cadastral resolve decisão de negócio, custa caro e carrega
        responsabilidade sobre dado de gente real. Os geradores deste site vivem
        inteiramente no primeiro território.
      </p>
    </ArticleLayout>
  );
}
