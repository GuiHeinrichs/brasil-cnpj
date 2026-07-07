import { MAX_BATCH_SIZE } from "@/lib/cnpj";

/**
 * Perguntas frequentes exibidas nas páginas e replicadas no JSON-LD (FAQPage).
 * O texto visível e o estruturado devem permanecer idênticos — Google exige
 * que o markup corresponda ao conteúdo da página.
 */
export const CNPJ_FAQ = [
  {
    question: "Os CNPJs gerados são reais?",
    answer:
      "Não. São números fictícios com dígitos verificadores matematicamente válidos, criados apenas para testes de software. Não correspondem a empresas registradas na Receita Federal.",
  },
  {
    question: "Como gerar CNPJ em massa?",
    answer: `Na aba Gerador, informe a quantidade desejada (até ${MAX_BATCH_SIZE} por vez), escolha o formato e gere a lista em lote, com ou sem máscara, pronta para copiar para seeds e fixtures de teste.`,
  },
  {
    question: "O que é o CNPJ alfanumérico?",
    answer:
      "É o novo formato definido pela Receita Federal e pelo SERPRO: raiz e ordem passam a aceitar letras (A–Z) além de números, e os dois dígitos verificadores continuam numéricos. Vale para novas inscrições a partir de julho de 2026.",
  },
  {
    question: "Como validar um CNPJ?",
    answer:
      "Use a aba Validador: ela confere os dígitos verificadores pelo módulo 11 e detecta automaticamente se o número está no formato numérico ou alfanumérico.",
  },
  {
    question: "A ferramenta é gratuita?",
    answer:
      "Sim. O bateCarimbo é gratuito, de código aberto (licença MIT) e roda inteiramente no navegador, sem cadastro e sem envio de dados a servidores.",
  },
];

export const CPF_FAQ = [
  {
    question: "Os CPFs gerados são reais?",
    answer:
      "Não. São números fictícios com dígitos verificadores matematicamente válidos, criados apenas para testes de software. Não correspondem a pessoas reais nem constam no cadastro da Receita Federal.",
  },
  {
    question: "Como gerar CPF em massa?",
    answer: `Na aba Gerador, informe a quantidade desejada (até ${MAX_BATCH_SIZE} por vez) e gere a lista em lote, com ou sem máscara, pronta para copiar para seeds e fixtures de teste.`,
  },
  {
    question: "O que significa o 9º dígito do CPF?",
    answer:
      "Ele identifica a região fiscal que emitiu o documento: 8 corresponde a São Paulo, 0 ao Rio Grande do Sul (10ª RF), e assim por diante. A tabela completa está na seção Regiões fiscais.",
  },
  {
    question: "Posso gerar CPF de um estado específico?",
    answer:
      "Sim. Escolha a região fiscal no Gerador e o 9º dígito sairá de acordo — por exemplo, 8ª RF para São Paulo. Estados da mesma região compartilham o mesmo dígito.",
  },
  {
    question: "Como validar um CPF?",
    answer:
      "Use a aba Validador: ela confere os dois dígitos verificadores pelo módulo 11, rejeita sequências repetidas como 111.111.111-11 e mostra a região fiscal de cada CPF válido.",
  },
];

export const CNH_FAQ = [
  {
    question: "As CNHs geradas são reais?",
    answer:
      "Não. São números de registro fictícios com dígitos verificadores matematicamente válidos, criados apenas para testes de software. Não constam no cadastro do SENATRAN nem nos DETRANs.",
  },
  {
    question: "Como gerar CNH em massa?",
    answer: `Na aba Gerador, informe a quantidade desejada (até ${MAX_BATCH_SIZE} por vez) e gere a lista em lote, pronta para copiar para seeds e fixtures de teste.`,
  },
  {
    question: "Como é calculado o dígito verificador da CNH?",
    answer:
      "Os 9 primeiros dígitos recebem dois cálculos de módulo 11: pesos 9 a 1 para o primeiro DV e 1 a 9 para o segundo. Validadores conhecidos divergem quando o resto do primeiro cálculo é 10 — o gerador evita essas combinações, então os números passam em qualquer um.",
  },
  {
    question: "O número gerado tem categoria ou validade?",
    answer:
      "Não. O registro de 11 dígitos não codifica categoria, UF nem data de validade — esses dados ficam apenas no cadastro do DETRAN, fora do número.",
  },
];

export const TITULO_FAQ = [
  {
    question: "Os títulos de eleitor gerados são reais?",
    answer:
      "Não. São números fictícios com dígitos verificadores matematicamente válidos, criados apenas para testes de software. Não constam no cadastro do TSE.",
  },
  {
    question: "Posso gerar título de um estado específico?",
    answer:
      "Sim. Escolha a UF no Gerador e os dígitos 9–10 sairão com o código correspondente: 01 é São Paulo, 02 Minas Gerais, e assim até 28 (eleitores no exterior).",
  },
  {
    question: "Como é calculado o DV do título de eleitor?",
    answer:
      "O sequencial (8 dígitos) recebe os pesos 2 a 9; o resto da divisão por 11 é o primeiro DV. Depois, UF e primeiro DV recebem os pesos 7, 8 e 9 para o segundo. Resto 10 vira 0.",
  },
  {
    question: "Por que São Paulo e Minas Gerais têm regra diferente?",
    answer:
      "Exceção oficial do TSE: nos títulos de SP e MG, quando o resto é 0 o DV vira 1. Nem todo validador implementa a exceção, então o gerador evita os casos ambíguos — os números passam nas duas interpretações.",
  },
];

export const PIS_FAQ = [
  {
    question: "PIS, PASEP, NIS e NIT são o mesmo número?",
    answer:
      "Sim. É o mesmo número de 11 dígitos do cadastro do trabalhador — o nome muda conforme o órgão: PIS (Caixa), PASEP (Banco do Brasil), NIS (programas sociais) e NIT (INSS).",
  },
  {
    question: "Os números de PIS gerados são reais?",
    answer:
      "Não. São números fictícios com dígito verificador matematicamente válido, criados apenas para testes de software. Não correspondem a trabalhadores cadastrados.",
  },
  {
    question: "Como gerar PIS em massa?",
    answer: `Na aba Gerador, informe a quantidade desejada (até ${MAX_BATCH_SIZE} por vez) e gere a lista em lote, com ou sem a máscara 999.99999.99-9.`,
  },
  {
    question: "Como é calculado o dígito do PIS?",
    answer:
      "Os 10 primeiros dígitos recebem os pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2. O DV é 11 menos o resto da divisão da soma por 11; resultados 10 e 11 viram 0.",
  },
];

export const RENAVAM_FAQ = [
  {
    question: "Os RENAVAMs gerados são reais?",
    answer:
      "Não. São números fictícios com dígito verificador matematicamente válido, criados apenas para testes de software. Não correspondem a veículos registrados.",
  },
  {
    question: "Por que o RENAVAM tem 11 dígitos?",
    answer:
      "O formato foi ampliado de 9 para 11 dígitos em 2013. Números antigos continuam válidos com zeros à esquerda — o Validador completa automaticamente.",
  },
  {
    question: "Como é calculado o dígito do RENAVAM?",
    answer:
      "Os 10 primeiros dígitos recebem os pesos 3, 2, 9, 8, 7, 6, 5, 4, 3 e 2. A soma é multiplicada por 10 e o DV é o resto da divisão por 11; resto 10 vira 0.",
  },
  {
    question: "Como gerar RENAVAM em massa?",
    answer: `Na aba Gerador, informe a quantidade desejada (até ${MAX_BATCH_SIZE} por vez) e gere a lista em lote, pronta para copiar para seeds e fixtures de teste.`,
  },
];

export const RG_FAQ = [
  {
    question: "Os RGs gerados são reais?",
    answer:
      "Não. São números fictícios com dígito verificador válido, criados apenas para testes de software. Não constam em nenhuma Secretaria de Segurança Pública.",
  },
  {
    question: "Qual padrão de RG a ferramenta usa?",
    answer:
      "O da SSP-SP (São Paulo): 8 dígitos mais um verificador calculado por módulo 11, que pode ser 0-9 ou X. É a convenção mais difundida e a que a maioria dos validadores online adota. Cada estado emite o RG com regras próprias, então o número pode não validar em outras UFs.",
  },
  {
    question: "Por que alguns RGs terminam em X?",
    answer:
      "No cálculo do dígito verificador, quando 11 menos o resto resulta em 10, o valor é representado pela letra X. É o mesmo recurso usado em outros documentos com módulo 11.",
  },
  {
    question: "Como gerar RG em massa?",
    answer: `Na aba Gerador, informe a quantidade desejada (até ${MAX_BATCH_SIZE} por vez) e gere a lista em lote, com ou sem a máscara 00.000.000-0.`,
  },
];

export const CEP_FAQ = [
  {
    question: "Os CEPs gerados existem de verdade?",
    answer:
      "Eles caem dentro das faixas oficiais de cada estado, mas são sorteados ao acaso — pode ser que o número não corresponda a um logradouro real. Servem para testes de formulário e validação de máscara, não para entrega.",
  },
  {
    question: "Posso gerar CEP de um estado específico?",
    answer:
      "Sim. Escolha a UF no Gerador e o CEP sairá dentro da faixa daquele estado (por exemplo, 01000-000 a 19999-999 em São Paulo). Em Aleatório, qualquer estado pode sair.",
  },
  {
    question: "Como descubro a qual estado um CEP pertence?",
    answer:
      "Use a aba Localizar UF: informe um ou mais CEPs e a ferramenta mostra o estado correspondente, comparando o número com as faixas dos Correios.",
  },
  {
    question: "O CEP tem dígito verificador?",
    answer:
      "Não. O CEP é só uma chave de endereçamento de 8 dígitos (prefixo + sufixo), sem dígito de controle — por isso a ferramenta valida apenas o formato e a faixa do estado.",
  },
];

export const PLACA_FAQ = [
  {
    question: "As placas geradas são reais?",
    answer:
      "Não. As combinações de letras e números são aleatórias e fictícias, criadas para testes de software. Não correspondem a veículos emplacados no DENATRAN.",
  },
  {
    question: "Qual a diferença entre a placa Mercosul e a antiga?",
    answer:
      "A antiga segue o padrão ABC-1234 (três letras e quatro números). A Mercosul, adotada no Brasil a partir de 2018, é ABC1D23: a quinta posição passou a ser uma letra. As duas têm sete caracteres.",
  },
  {
    question: "Como uma placa antiga vira Mercosul?",
    answer:
      "O segundo número da placa antiga (a quinta posição) é convertido em letra pela tabela 0=A, 1=B, 2=C … 9=J. Assim, ABC-1234 corresponde à placa Mercosul ABC1C34. As três letras e os demais números não mudam.",
  },
  {
    question: "A placa tem dígito verificador?",
    answer:
      "Não. A placa não possui dígito de controle — a ferramenta valida apenas se o formato corresponde ao padrão Mercosul ou ao antigo.",
  },
];

export const PESSOA_FAQ = [
  {
    question: "As pessoas geradas são reais?",
    answer:
      "Não. Cada ficha combina nome, CPF, RG, data de nascimento, endereço e contato totalmente fictícios, criados para testes de software. Não correspondem a nenhuma pessoa real.",
  },
  {
    question: "Os dados da ficha são coerentes entre si?",
    answer:
      "Sim. Ao escolher um estado, o CPF sai com o 9º dígito da região fiscal correta, o CEP fica dentro da faixa daquele estado e a cidade e o DDD do telefone também correspondem à UF.",
  },
  {
    question: "O CPF e o CNPJ da ficha são válidos?",
    answer:
      "O CPF tem dígitos verificadores matematicamente válidos (passa em validadores), mas é fictício. Use a ficha para preencher formulários e cadastros em ambiente de teste, nunca em sistemas reais.",
  },
  {
    question: "Como gerar várias pessoas de uma vez?",
    answer:
      "Informe a quantidade desejada e gere o lote. Cada ficha tem botão de copiar por campo e um \"Copiar ficha\" que leva todos os dados em texto, prontos para seeds e fixtures.",
  },
];

export const EMPRESA_FAQ = [
  {
    question: "As empresas geradas são reais?",
    answer:
      "Não. Razão social, nome fantasia, CNPJ e endereço são fictícios, criados para testes de software. Não correspondem a empresas registradas na Receita Federal.",
  },
  {
    question: "O CNPJ gerado é válido?",
    answer:
      "Sim, no sentido de ter dígitos verificadores corretos (módulo 11). Mas é um número fictício, sem inscrição na Receita — serve apenas para testar máscaras, formulários e fluxos de cadastro.",
  },
  {
    question: "O endereço corresponde ao estado escolhido?",
    answer:
      "Sim. Ao escolher a UF, o CEP fica dentro da faixa do estado, e a cidade e o DDD do telefone também são daquele estado.",
  },
  {
    question: "Posso gerar empresas em lote?",
    answer:
      "Pode. Informe a quantidade e gere várias fichas de uma vez, copiando campo a campo ou a ficha inteira em texto.",
  },
];

export const NOME_FAQ = [
  {
    question: "Os nomes são aleatórios?",
    answer:
      "Sim. Combinamos prenomes e sobrenomes brasileiros comuns ao acaso. São nomes plausíveis e fictícios, ideais para popular bancos de teste, mockups e protótipos.",
  },
  {
    question: "Posso escolher o sexo do nome?",
    answer:
      "Pode. Selecione Masculino, Feminino ou Aleatório e gere a lista. O prenome sai de acordo com a opção; os sobrenomes são os mesmos para ambos.",
  },
  {
    question: "Como gerar nomes em massa?",
    answer:
      "Informe a quantidade desejada e gere a lista em lote, com botão de copiar por nome e \"Copiar tudo\" para levar todos de uma vez.",
  },
  {
    question: "Os nomes gerados podem coincidir com pessoas reais?",
    answer:
      "Matematicamente sim — prenomes e sobrenomes comuns se combinam de infinitas formas. Qualquer coincidência é casual: a ferramenta não consulta nenhum cadastro real e não é possível rastrear uma pessoa a partir de um nome gerado aqui.",
  },
  {
    question: "Posso usar esses nomes em produção?",
    answer:
      "Não. Os nomes são gerados para testes de software. Não os utilize em sistemas reais com usuários, em formulários públicos ou em qualquer contexto que exija dados de pessoas reais.",
  },
  {
    question: "Quantos nomes posso gerar de uma vez?",
    answer:
      "Você pode gerar até 50 nomes por vez. Para volumes maiores, gere em múltiplos lotes e use o botão \"Copiar tudo\" em cada rodada.",
  },
];

export const NICK_FAQ = [
  {
    question: "Para que serve o gerador de nicks?",
    answer:
      "Para criar apelidos e nomes de usuário para jogos, redes sociais e perfis de teste. Combina palavras em inglês com números e estilos diferentes.",
  },
  {
    question: "Quais estilos estão disponíveis?",
    answer:
      "Limpo (DarkWolf), com números (DarkWolf42), leet com substituição de letras (D4rkW0lf) e underscore (dark_wolf_07). Em Aleatório, os estilos se misturam.",
  },
  {
    question: "O que é o estilo leet (l33t)?",
    answer:
      "Leet speak é uma convenção de escrita na internet em que certas letras são substituídas por números visualmente parecidos: A→4, E→3, I→1, O→0, S→5. Surgiu nas décadas de 1980 e 1990 em fóruns e comunidades de hackers e é muito usada em nomes de usuário de jogos.",
  },
  {
    question: "O nick gerado está disponível na plataforma que eu uso?",
    answer:
      "A ferramenta apenas sugere combinações — não verifica disponibilidade em nenhum serviço. Confirme no próprio site ou jogo antes de usar.",
  },
  {
    question: "Posso usar esses nicks em perfis de teste automatizados?",
    answer:
      "Sim. Gere em lote e copie a lista para popular seeds ou scripts de teste que precisem criar usuários fictícios com usernames plausíveis.",
  },
  {
    question: "De onde vêm as palavras usadas nos nicks?",
    answer:
      "As palavras são selecionadas de um banco de adjetivos e substantivos em inglês comuns em contextos de jogos e comunidades online (dark, wolf, storm, shadow, etc.). Elas são combinadas aleatoriamente em pares.",
  },
];
