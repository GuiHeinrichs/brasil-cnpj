
/**
 * Perguntas frequentes exibidas nas páginas e replicadas no JSON-LD (FAQPage).
 * O texto visível e o estruturado devem permanecer idênticos — o Google exige
 * que o markup corresponda ao conteúdo da página.
 *
 * Regra editorial: as perguntas genéricas que valeriam para qualquer gerador
 * ("os números são reais?", "como gerar em massa?") ficam em SITE_FAQ, exibida
 * uma única vez em /sobre. Cada documento responde aqui apenas o que é
 * específico dele — caso contrário a mesma resposta se repetiria em treze
 * páginas, que é exatamente o padrão de conteúdo duplicado a evitar.
 */

/** FAQ geral do site, exibida em /sobre. Responde o que vale para toda ferramenta. */
export const SITE_FAQ = [
  {
    question: "Os documentos gerados pelo bateCarimbo são reais?",
    answer:
      "Não. Todos os números são sorteados e recebem os dígitos verificadores corretos pelo mesmo algoritmo do documento real, mas não correspondem a nenhuma pessoa, empresa ou veículo. Eles não constam em cadastro nenhum — nem da Receita Federal, nem do SENATRAN, do TSE, do INSS ou de qualquer outro órgão.",
  },
  {
    question: "Para que servem números que passam na validação mas não existem?",
    answer:
      "Para testar software. Um formulário de cadastro, um emissor de nota fiscal ou uma rotina de importação rejeitam documentos com dígito verificador errado, então não dá para inventar números à mão. Usar documentos de pessoas reais em ambiente de desenvolvimento é um risco de privacidade desnecessário. Números fictícios com formato correto resolvem os dois problemas ao mesmo tempo.",
  },
  {
    question: "Como gerar documentos em lote?",
    answer:
      "Todas as ferramentas aceitam uma quantidade no painel de geração e devolvem a lista pronta, com botão de copiar por item e de copiar tudo de uma vez. As fichas completas de pessoa e de empresa saem em lotes de até 25; os geradores de documento, em lotes de até 100. Para volumes maiores, repita a geração — nada é armazenado entre as rodadas.",
  },
  {
    question: "Meus dados são enviados para algum servidor?",
    answer:
      "Não. Os algoritmos rodam inteiramente no seu navegador, em JavaScript. Nada do que você gera, valida ou cola nas ferramentas sai do seu computador, e nada fica salvo depois que a página é fechada. Não há cadastro, login nem histórico.",
  },
  {
    question: "Posso usar os números gerados em um sistema de produção?",
    answer:
      "Não. Eles se destinam a ambientes de teste, desenvolvimento, homologação e demonstração. Usar um documento fictício para se identificar perante órgãos públicos, instituições financeiras ou qualquer serviço que exija documento verdadeiro é ilícito e foge completamente da finalidade da ferramenta.",
  },
  {
    question: "A ferramenta é gratuita? Posso usar em projeto comercial?",
    answer:
      "Sim para as duas perguntas. O bateCarimbo é gratuito, sem limite de uso e sem cadastro, e o código é aberto sob licença MIT — o que permite usar, copiar, modificar e distribuir, inclusive em projetos comerciais, desde que o aviso de copyright seja mantido.",
  },
] as const;

export const CNPJ_FAQ = [
  {
    question: "O que muda com o CNPJ alfanumérico e desde quando ele vale?",
    answer:
      "Desde julho de 2026 as novas inscrições podem conter letras de A a Z nas doze primeiras posições — a raiz e a ordem do estabelecimento. Os dois dígitos verificadores continuam sempre numéricos. CNPJs numéricos já existentes seguem válidos e não mudam: os dois formatos convivem indefinidamente.",
  },
  {
    question: "Como o dígito verificador é calculado quando há letras?",
    answer:
      "Cada caractere entra na conta pelo seu código ASCII menos 48. Para os algarismos isso devolve o próprio valor (o caractere 0 vale 0, o 9 vale 9) e para as letras devolve 17 em diante (A vale 17, B vale 18, até Z valendo 42). Feita essa conversão, o resto do cálculo é o módulo 11 de sempre, com os mesmos pesos.",
  },
  {
    question: "Por que a Receita precisou criar o formato alfanumérico?",
    answer:
      "Porque as combinações puramente numéricas da raiz estão se esgotando. Incluir letras nas doze posições da base multiplica a quantidade de inscrições possíveis sem aumentar o tamanho do número, o que manteria compatível o tamanho dos campos já existentes nos sistemas.",
  },
  {
    question: "O que preciso mudar no meu sistema para aceitar o novo formato?",
    answer:
      "Três pontos concentram quase todos os problemas: colunas de banco declaradas como numéricas, que precisam virar texto; expressões regulares e máscaras que só aceitam dígitos; e rotinas de validação que convertem o CNPJ para inteiro antes de calcular o dígito. Ordenação e comparação também mudam, porque passam a ser alfabéticas.",
  },
  {
    question: "A raiz do CNPJ ainda identifica matriz e filiais?",
    answer:
      "Sim, a estrutura não mudou. As oito primeiras posições continuam sendo a raiz, compartilhada por todos os estabelecimentos da mesma empresa, e as quatro seguintes a ordem, em que 0001 designa a matriz e os números seguintes as filiais. O que mudou foi apenas o conjunto de caracteres permitido.",
  },
] as const;

export const CPF_FAQ = [
  {
    question: "O que significa o 9º dígito do CPF?",
    answer:
      "Ele identifica a região fiscal da Receita Federal que emitiu o documento. O dígito 8 corresponde a São Paulo, o 6 a Minas Gerais, o 0 ao Rio Grande do Sul, e assim por diante — a tabela completa das dez regiões está na seção Regiões fiscais desta página.",
  },
  {
    question: "O 9º dígito prova em que estado a pessoa nasceu ou mora?",
    answer:
      "Não. Ele indica apenas onde o CPF foi emitido. Quem nasceu no Paraná e tirou o documento morando em São Paulo tem o dígito 8. Usar esse dígito como regra de negócio para inferir domicílio é um erro comum e produz resultados errados.",
  },
  {
    question: "Posso gerar CPF de um estado específico?",
    answer:
      "Sim. Escolha a região fiscal no Gerador e o 9º dígito sairá correspondente, com os dois verificadores recalculados em cima dessa base. Estados de uma mesma região compartilham o dígito — Paraná e Santa Catarina são ambos 9, por exemplo.",
  },
  {
    question: "Por que 111.111.111-11 é recusado se a conta fecha?",
    answer:
      "Porque sequências com todos os dígitos iguais realmente satisfazem o cálculo do módulo 11, mas são rejeitadas por convenção — justamente por serem os valores que alguém digitaria para burlar um formulário. Um validador completo precisa tratar esses dez casos separadamente, além de conferir os dígitos.",
  },
  {
    question: "Um CPF com dígitos corretos existe de fato na Receita?",
    answer:
      "Não necessariamente. O cálculo confirma apenas que o número é bem formado. Existência e situação cadastral (regular, suspensa, cancelada, titular falecido) só a consulta oficial da Receita Federal responde, e nenhum número gerado aqui consta lá.",
  },
] as const;

export const CNH_FAQ = [
  {
    question: "O número de registro da CNH é o mesmo em toda renovação?",
    answer:
      "Sim. O registro de onze dígitos acompanha o condutor por toda a vida, mesmo mudando de categoria ou de estado. O que muda a cada emissão é o número do espelho, impresso em outro campo do documento e usado para identificar aquela via específica.",
  },
  {
    question: "Registro, espelho e RENACH são a mesma coisa?",
    answer:
      "Não. O registro identifica o condutor de forma permanente, o número do espelho identifica a via emitida do documento e o RENACH identifica o processo aberto no DETRAN — ele aparece durante a habilitação e na troca de documento, combinando a sigla do estado com uma sequência numérica.",
  },
  {
    question: "Como é calculado o dígito verificador da CNH?",
    answer:
      "Os nove primeiros dígitos passam por dois cálculos de módulo 11: pesos de 9 a 1 para o primeiro verificador e de 1 a 9 para o segundo. O detalhe é o tratamento do resto 10, em que implementações divergem — o gerador evita produzir essas combinações ambíguas, de modo que os números passam em qualquer validador.",
  },
  {
    question: "Por que dois validadores online discordam sobre a mesma CNH?",
    answer:
      "Porque quando o primeiro cálculo resulta em resto 10 existem duas interpretações difundidas: uma trata o dígito como 0 e outra aplica um desconto de 2 na segunda conta. As duas circulam há anos em código copiado entre projetos. Por isso o gerador simplesmente não emite números que caiam nesse caso.",
  },
  {
    question: "O número da CNH indica categoria, validade ou pontuação?",
    answer:
      "Não. O registro é apenas um identificador sequencial com verificadores. Categoria, data de validade, restrições médicas e pontuação ficam no cadastro do DETRAN e do SENATRAN, fora do número — por isso não há como deduzi-los a partir dele.",
  },
] as const;

export const TITULO_FAQ = [
  {
    question: "Posso gerar título de eleitor de um estado específico?",
    answer:
      "Sim. Escolha a unidade federativa no Gerador e os dígitos 9 e 10 sairão com o código correspondente: 01 é São Paulo, 02 Minas Gerais, e a numeração segue até 28, reservado aos eleitores no exterior.",
  },
  {
    question: "O número do título indica a zona e a seção eleitoral?",
    answer:
      "Não. Zona e seção ficam no cadastro do TSE e mudam quando o eleitor transfere o domicílio eleitoral, enquanto o número do título permanece o mesmo. O número carrega apenas o sequencial, o código do estado de inscrição e os dois dígitos verificadores.",
  },
  {
    question: "Como é calculado o dígito verificador do título?",
    answer:
      "O sequencial de oito dígitos recebe os pesos de 2 a 9 e o resto da divisão por 11 é o primeiro verificador. Em seguida, os dois dígitos do estado e esse primeiro verificador recebem os pesos 7, 8 e 9 para produzir o segundo. Nos dois cálculos, resto 10 vira 0.",
  },
  {
    question: "Por que São Paulo e Minas Gerais têm regra diferente?",
    answer:
      "É uma exceção oficial do TSE: nos títulos inscritos em São Paulo e em Minas Gerais, quando o resto do primeiro cálculo é 0 o dígito vira 1 em vez de 0. Como nem todo validador implementa essa exceção, o gerador evita as combinações ambíguas e produz números que passam nas duas interpretações.",
  },
] as const;

export const PIS_FAQ = [
  {
    question: "PIS, PASEP, NIS e NIT são o mesmo número?",
    answer:
      "Sim, é o mesmo número de onze dígitos — muda só o nome conforme quem o utiliza. PIS é como a Caixa o chama para trabalhadores da iniciativa privada, PASEP é o equivalente do Banco do Brasil para servidores públicos, NIS é o nome usado nos programas sociais e no CadÚnico, e NIT é como o INSS se refere a ele.",
  },
  {
    question: "Onde cada uma dessas siglas aparece no dia a dia?",
    answer:
      "No eSocial e na folha de pagamento o campo costuma se chamar NIS. No extrato do abono salarial e no aplicativo da Caixa aparece como PIS. No Meu INSS e nas guias de contribuição aparece como NIT. Em benefícios sociais, como NIS. Sistemas que tratam essas siglas como campos diferentes acabam duplicando o mesmo dado.",
  },
  {
    question: "Como é calculado o dígito verificador do PIS?",
    answer:
      "Os dez primeiros dígitos recebem, nessa ordem, os pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2. Soma-se os produtos e calcula-se o resto da divisão por 11. O dígito é 11 menos esse resto, com uma ressalva: quando o resultado dá 10 ou 11, o dígito é 0.",
  },
  {
    question: "Um PIS com dígito correto significa que a pessoa é cadastrada?",
    answer:
      "Não. O cálculo confirma apenas a boa formação do número. Saber se ele está efetivamente atribuído a um trabalhador exige consulta ao CNIS, pelo Meu INSS ou pelos canais da Caixa — e nenhum número gerado aqui consta nesse cadastro.",
  },
] as const;

export const RENAVAM_FAQ = [
  {
    question: "Por que existem RENAVAMs de 9 e de 11 dígitos?",
    answer:
      "O código foi ampliado de nove para onze dígitos em 2013, quando as combinações do formato antigo se aproximaram do esgotamento. Os números antigos continuam válidos: basta completá-los com zeros à esquerda até chegar a onze posições. O Validador desta página faz esse preenchimento automaticamente.",
  },
  {
    question: "Como converter um RENAVAM antigo de 9 dígitos?",
    answer:
      "Acrescente dois zeros à esquerda. O código 123456789 vira 00123456789, e o dígito verificador não muda, porque zeros à esquerda não alteram a soma ponderada. É a mesma inscrição, apenas escrita no formato atual.",
  },
  {
    question: "Como é calculado o dígito verificador do RENAVAM?",
    answer:
      "Os dez primeiros dígitos recebem os pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2. A soma dos produtos é multiplicada por 10 e o dígito é o resto da divisão desse total por 11, com resto 10 valendo 0. É o único documento desta lista que multiplica a soma antes de tirar o resto.",
  },
  {
    question: "O RENAVAM muda quando o veículo é vendido ou troca de placa?",
    answer:
      "Não. O RENAVAM identifica o veículo desde o primeiro registro e permanece o mesmo em transferências de propriedade, mudanças de estado e troca de placa para o padrão Mercosul. É o identificador mais estável dos três que um veículo possui.",
  },
] as const;

export const RG_FAQ = [
  {
    question: "Por que meu RG de outro estado não valida nesta ferramenta?",
    answer:
      "Porque o RG não é um documento nacional. Cada estado o emite pela sua Secretaria de Segurança Pública, com tamanho de numeração e regra de dígito verificador próprios — há estados que sequer usam dígito verificador. Esta ferramenta adota o padrão da SSP de São Paulo, que é o mais difundido entre validadores, então números de outras unidades federativas podem não passar.",
  },
  {
    question: "Qual padrão de RG a ferramenta usa?",
    answer:
      "O da SSP-SP: oito dígitos de base mais um verificador calculado por módulo 11, exibido na máscara 00.000.000-0. É a convenção que a maioria dos validadores online implementa, motivo pelo qual foi escolhida como referência.",
  },
  {
    question: "Por que alguns RGs terminam em X?",
    answer:
      "No cálculo do verificador, quando 11 menos o resto resulta em 10, é preciso representar dois algarismos em uma única posição. A convenção é usar a letra X, o mesmo recurso adotado em outros documentos que usam módulo 11. Campos de banco que aceitam apenas dígitos rejeitam esses RGs indevidamente.",
  },
  {
    question: "Uma pessoa pode ter mais de um RG?",
    answer:
      "Sim, e é mais comum do que parece. Como a emissão é estadual e não havia base unificada, quem viveu em estados diferentes pode ter obtido um RG em cada um, com números distintos. Sistemas que tratam o RG como chave única de pessoa acabam criando cadastros duplicados por causa disso.",
  },
  {
    question: "O RG vai deixar de existir com a CIN?",
    answer:
      "A Carteira de Identidade Nacional unifica o documento em todo o país usando o número do CPF como identificador único, o que resolve justamente o problema dos vários RGs. Durante a transição os dois convivem, e formulários continuam pedindo o RG no formato antigo — que é o que esta ferramenta gera.",
  },
] as const;

export const CEP_FAQ = [
  {
    question: "Os CEPs gerados existem de verdade?",
    answer:
      "Eles caem dentro da faixa oficial do estado escolhido, mas o número exato é sorteado — pode não corresponder a um logradouro real. Servem para testar máscara, validação de formato e regras por região, não para calcular frete ou endereçar uma entrega de verdade.",
  },
  {
    question: "Posso gerar CEP de um estado específico?",
    answer:
      "Sim. Escolha a unidade federativa e o número sairá dentro da faixa daquele estado — São Paulo vai de 01000-000 a 19999-999, por exemplo. Na opção Aleatório, qualquer estado pode ser sorteado.",
  },
  {
    question: "Como descubro a qual estado um CEP pertence?",
    answer:
      "Use a aba Localizar UF: cole um ou mais CEPs e a ferramenta compara cada um com as faixas dos Correios e mostra o estado correspondente, sem consultar nenhuma API externa.",
  },
  {
    question: "O CEP tem dígito verificador?",
    answer:
      "Não. Ele é uma chave de endereçamento de oito dígitos, formada por um prefixo de cinco e um sufixo de três, sem nenhum dígito de controle. Por isso não existe como saber se um CEP está correto apenas olhando para ele: só dá para checar o formato e a faixa.",
  },
  {
    question: "Qual a diferença entre CEP de logradouro e CEP geral?",
    answer:
      "Cidades menores têm um CEP único que atende todo o município, com sufixo 000. Em cidades grandes, cada logradouro — às vezes cada trecho ou cada prédio de grande porte — tem o seu. Um formulário que exige logradouro preenchido a partir do CEP precisa lidar com os dois casos.",
  },
] as const;

export const PLACA_FAQ = [
  {
    question: "Qual a diferença entre a placa Mercosul e a antiga?",
    answer:
      "A antiga segue o padrão ABC-1234, com três letras e quatro algarismos. A Mercosul é ABC1D23: a quinta posição, que antes era o segundo algarismo, passou a ser uma letra. As duas têm sete caracteres, o que evitou mudanças no tamanho dos campos dos sistemas.",
  },
  {
    question: "Como uma placa antiga é convertida para o padrão Mercosul?",
    answer:
      "Converte-se o segundo algarismo — a quinta posição da placa — em letra pela tabela 0 igual a A, 1 igual a B, 2 igual a C, seguindo até 9 igual a J. As três letras iniciais e os demais algarismos não mudam. Assim, ABC-1234 corresponde a ABC1C34.",
  },
  {
    question: "Preciso trocar a placa do meu carro?",
    answer:
      "Não por vontade própria. A substituição é obrigatória apenas em situações específicas, como transferência de propriedade, mudança de município ou estado, e quando a placa antiga é danificada ou roubada. Fora esses casos, o padrão antigo continua válido.",
  },
  {
    question: "A placa tem dígito verificador?",
    answer:
      "Não. Nenhum dos dois padrões possui dígito de controle, então não existe como validar matematicamente uma placa. A ferramenta verifica apenas se a combinação de letras e números corresponde ao formato Mercosul ou ao antigo.",
  },
  {
    question: "Placas de moto seguem o mesmo formato?",
    answer:
      "Sim quanto à combinação de caracteres: motocicletas usam o mesmo padrão ABC1D23. O que difere é o leiaute físico, disposto em duas linhas em vez de uma. Para efeito de validação em software, a regra é a mesma dos automóveis.",
  },
] as const;

export const PESSOA_FAQ = [
  {
    question: "Os dados da ficha são coerentes entre si?",
    answer:
      "Sim, e é esse o ponto da ferramenta. Ao escolher um estado, o CPF sai com o 9º dígito da região fiscal correta, o CEP fica dentro da faixa daquela unidade federativa, e cidade e DDD do telefone correspondem ao mesmo estado. Uma ficha com São Paulo no endereço não vem com DDD do Ceará.",
  },
  {
    question: "Por que os e-mails usam domínios que não existem?",
    answer:
      "De propósito. Endereços em domínios reservados para documentação e teste nunca chegam a uma caixa real, então uma rotina de envio disparada por engano em homologação não incomoda ninguém. É a mesma razão pela qual não usamos domínios de provedores conhecidos.",
  },
  {
    question: "As fichas podem coincidir com uma pessoa real?",
    answer:
      "O nome pode coincidir, porque combinamos prenomes e sobrenomes comuns no Brasil. O conjunto, não: o CPF é sorteado dentro do espaço de números válidos e a chance de bater com um documento atribuído a alguém, junto com todos os demais campos, é desprezível. A ferramenta não consulta nenhuma base real nem permite chegar a uma pessoa a partir de uma ficha.",
  },
  {
    question: "Posso usar as fichas para testar cadastro e onboarding?",
    answer:
      "Sim, é o uso pretendido: preencher formulários de cadastro, testar validações cruzadas de endereço, popular telas administrativas e alimentar testes automatizados. O que não se deve fazer é usá-las em qualquer processo que trate os dados como identificação verdadeira.",
  },
  {
    question: "Como levo várias fichas para o meu projeto?",
    answer:
      "Gere o lote e use os botões de exportação: cada ficha tem cópia por campo e cópia completa em texto, e o lote inteiro pode ser exportado em JSON ou XML, formatos que entram direto em seeds e fixtures.",
  },
] as const;

export const EMPRESA_FAQ = [
  {
    question: "O que é natureza jurídica e como ela difere do porte?",
    answer:
      "Natureza jurídica é o tipo societário — sociedade limitada, sociedade anônima, empresário individual, sociedade limitada unipessoal — e define como a empresa é constituída e quem responde pelas obrigações. Porte é outra coisa: microempresa e empresa de pequeno porte são classificações por faturamento, que uma sociedade limitada pode ter ou deixar de ter sem mudar de tipo.",
  },
  {
    question: "Razão social e nome fantasia são sempre diferentes?",
    answer:
      "Não obrigatoriamente, mas costumam ser. A razão social é o nome registrado, usado em contratos e notas fiscais, normalmente terminado com a sigla do tipo societário. O nome fantasia é a marca pela qual o público conhece a empresa. Sistemas que guardam só um dos dois acabam emitindo documentos com o nome errado.",
  },
  {
    question: "O CNPJ da ficha é válido?",
    answer:
      "Ele tem os dois dígitos verificadores calculados corretamente, então passa em qualquer validador de formato. Mas é um número fictício, sem inscrição na Receita Federal: serve para testar máscaras, formulários e fluxos de cadastro, nunca para emitir documento fiscal de verdade.",
  },
  {
    question: "O endereço corresponde ao estado escolhido?",
    answer:
      "Sim. Ao escolher a unidade federativa, o CEP fica dentro da faixa oficial daquele estado e a cidade e o DDD do telefone acompanham. Isso permite testar regras que dependem de localização, como cálculo de imposto por estado ou roteamento de atendimento.",
  },
  {
    question: "Dá para gerar empresas em lote e exportar?",
    answer:
      "Sim. Informe a quantidade e gere várias fichas de uma vez, copiando campo a campo, a ficha inteira em texto ou o lote completo em JSON e XML.",
  },
] as const;

export const NOME_FAQ = [
  {
    question: "De onde vêm os nomes gerados?",
    answer:
      "De uma lista de prenomes e sobrenomes comuns no Brasil, combinados ao acaso. O resultado é plausível como nome brasileiro, o que importa quando a massa de teste vai aparecer em telas, relatórios ou demonstrações para outras pessoas.",
  },
  {
    question: "Posso escolher o sexo do nome?",
    answer:
      "Pode. Selecione masculino, feminino ou aleatório: o prenome sai conforme a opção escolhida e os sobrenomes são os mesmos nos dois casos.",
  },
  {
    question: "Os nomes gerados podem coincidir com pessoas reais?",
    answer:
      "Podem, e isso é inevitável: prenomes e sobrenomes comuns se combinam de formas que existem no mundo real. Qualquer coincidência é casual — a ferramenta não consulta cadastro nenhum, e um nome isolado não identifica ninguém.",
  },
  {
    question: "Por que testar com nomes acentuados importa?",
    answer:
      "Porque acentos e cedilha revelam problemas de codificação que passam despercebidos com massa em inglês: colunas com collation errada, truncamento no meio de um caractere multibyte, ordenação alfabética que coloca Á depois de Z, normalização inconsistente em buscas. Uma massa brasileira realista expõe esses casos cedo.",
  },
] as const;

export const NICK_FAQ = [
  {
    question: "Para que serve um gerador de usernames em testes?",
    answer:
      "Para popular cadastros que exigem um identificador público único — perfis, contas de demonstração, ambientes de homologação de redes internas. Diferente do nome da pessoa, o username tem regras próprias de tamanho e de caracteres permitidos, e testar isso pede uma massa específica.",
  },
  {
    question: "Quais estilos estão disponíveis?",
    answer:
      "Limpo, em que duas palavras são concatenadas com iniciais maiúsculas; com números ao final; leet, com letras substituídas por algarismos parecidos; e com underscore separando as palavras. Cada estilo exercita um conjunto diferente de caracteres na validação.",
  },
  {
    question: "Por que testar usernames com números e underscore?",
    answer:
      "Porque as regras variam muito entre plataformas: algumas proíbem underscore no início, outras limitam a quantidade de algarismos, outras recusam nomes só numéricos. Gerar as quatro variações de uma vez cobre os casos que um formulário precisa aceitar ou rejeitar de forma consistente.",
  },
  {
    question: "O que é o estilo leet?",
    answer:
      "É uma convenção de escrita surgida em fóruns da internet em que certas letras são trocadas por algarismos visualmente parecidos: A vira 4, E vira 3, I vira 1, O vira 0 e S vira 5. Em testes ele é útil porque produz strings mistas de letras e números com aparência de nome, boas para exercitar validações.",
  },
  {
    question: "O username gerado está disponível em alguma plataforma?",
    answer:
      "A ferramenta apenas sugere combinações e não consulta serviço nenhum. Se a intenção for usar o nome de verdade em algum lugar, é preciso conferir a disponibilidade na própria plataforma.",
  },
] as const;
