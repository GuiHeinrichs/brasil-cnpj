import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("lgpd-dados-de-teste")!;

export const metadata: Metadata = guideMetadata(guide);

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        É uma cena comum em times de desenvolvimento: para testar uma tela nova,
        alguém copia um pedaço da base de produção — com CPFs, nomes, e-mails e
        endereços reais de clientes — para o ambiente de homologação ou para a
        máquina local. Parece inofensivo e prático, mas é justamente o tipo de
        hábito que a <strong>Lei Geral de Proteção de Dados</strong> veio
        desencorajar. Este guia separa o que a lei efetivamente define do que
        virou folclore de corredor, compara as cinco formas de dado que circulam
        num time de software e mostra por que a solução mais popular — mascarar
        um dump — é a que menos resolve.
      </p>
      <p>
        <em>
          Este texto é informativo e não substitui aconselhamento jurídico. Para
          decisões concretas sobre conformidade, consulte o time jurídico ou o
          encarregado de dados (DPO) da sua organização.
        </em>
      </p>

      <h2>O que a Lei nº 13.709/2018 define, na prática</h2>
      <p>
        A LGPD é a Lei nº 13.709/2018. Quatro definições dela interessam
        diretamente a quem monta ambiente de teste, e todas aparecem logo no
        começo do texto, na parte de disposições preliminares.
      </p>
      <ul>
        <li>
          <strong>Dado pessoal</strong> é a informação relacionada a pessoa
          natural identificada <em>ou identificável</em>. A segunda metade é a
          que costuma passar batido: não precisa ser o CPF. Se a combinação de
          campos permite chegar em alguém, o conjunto é dado pessoal.
        </li>
        <li>
          <strong>Tratamento</strong> é qualquer operação com esse dado, e a lei
          enumera uma lista longa que inclui acesso, reprodução, transmissão e
          armazenamento. Restaurar um dump na sua máquina é tratamento. Deixar a
          cópia parada num disco também.
        </li>
        <li>
          <strong>Anonimização</strong> é o uso de meios técnicos razoáveis e
          disponíveis no momento do tratamento para que o dado perca a
          possibilidade de associação a um indivíduo. Dado anonimizado sai do
          alcance da lei — mas a própria lei condiciona isso: se a anonimização
          puder ser revertida com esforços razoáveis, o dado volta a ser pessoal.
          Quem anonimiza carrega o ônus de sustentar essa afirmação.
        </li>
        <li>
          <strong>Pseudonimização</strong> é o tratamento em que o dado perde a
          associação ao titular <em>a não ser</em> pelo uso de informação
          adicional mantida separadamente. Existe uma chave de volta, guardada em
          outro lugar. A consequência prática é direta: dado pseudonimizado
          continua sendo dado pessoal e continua sob a lei.
        </li>
      </ul>
      <p>
        Os princípios do tratamento fecham o raciocínio. A lei exige{" "}
        <strong>finalidade</strong> — o dado serve ao propósito informado no
        momento da coleta —, <strong>adequação</strong>,{" "}
        <strong>necessidade</strong> (limitar o tratamento ao mínimo suficiente,
        o que o mercado costuma chamar de minimização) e{" "}
        <strong>segurança</strong>. Ninguém preencheu um cadastro de e-commerce
        autorizando que seus dados fossem para o Postgres local de um
        desenvolvedor reproduzir um bug de paginação. A finalidade não cobre isso,
        e a necessidade muito menos: o bug de paginação não precisa daquelas
        pessoas, precisa de dez mil linhas.
      </p>
      <p>
        Ambientes de desenvolvimento e homologação tendem a ter controles bem
        mais fracos que a produção: mais gente com acesso, incluindo terceiros e
        prestadores; credenciais compartilhadas; logs verbosos com payload
        inteiro; <em>fixtures</em> versionadas no Git; bancos que ninguém
        monitora. Cada uma dessas superfícies é uma chance a mais de exposição, e
        a lei não trata ambiente de teste como categoria especial.
      </p>

      <h2>Cinco tipos de dado e o que muda entre eles</h2>
      <p>
        Boa parte da confusão em reunião de arquitetura vem de usar
        &ldquo;mascarado&rdquo;, &ldquo;anonimizado&rdquo; e
        &ldquo;sintético&rdquo; como sinônimos. Não são, e a diferença entre eles
        decide se o ambiente continua ou não sob as obrigações da LGPD.
      </p>
      <DataTable
        caption="O que muda entre os cinco tipos de dado que circulam num time de software"
        headers={["Tipo", "Reversível", "Ainda é dado pessoal", "Uso em teste"]}
        rows={[
          [
            "Real",
            "Não se aplica",
            "Sim",
            "Não deve sair da produção",
          ],
          [
            "Mascarado",
            "Em geral sim, pelo que sobrou em volta",
            "Sim, na maioria dos casos",
            "Só com os mesmos controles da produção",
          ],
          [
            "Pseudonimizado",
            "Sim, por quem tem a informação adicional",
            "Sim, por definição",
            "Não muda o regime jurídico do ambiente",
          ],
          [
            "Anonimizado",
            "Não deveria ser, mas depende da técnica",
            "Não, enquanto a anonimização se sustentar",
            "Aceitável, exigindo prova de irreversibilidade",
          ],
          [
            "Sintético",
            "Não há o que reverter",
            "Não",
            "Livre, em qualquer ambiente",
          ],
        ]}
      />
      <p>
        Repare na coluna do meio. Mascaramento e pseudonimização mudam a aparência
        do dado, não a sua natureza jurídica: o ambiente que recebe essa base
        continua tratando dado pessoal e continua devendo as mesmas medidas de
        segurança. Anonimização muda a natureza, mas cobra uma prova técnica que
        poucos times conseguem produzir. Dado sintético é o único que dispensa a
        discussão, porque nunca pertenceu a ninguém.
      </p>

      <h2>Por que mascarar um dump de produção não resolve</h2>
      <p>
        O pipeline de mascaramento é a resposta intuitiva e quase sempre a errada.
        Os motivos se acumulam.
      </p>
      <p>
        <strong>O dump cru existe antes da máscara.</strong> Alguém precisa de
        acesso de leitura à produção, rodar o export e gravar o arquivo em algum
        lugar antes de qualquer transformação. Esse arquivo intermediário passa
        por um disco, às vezes por um bucket, às vezes por um anexo de chat. O
        momento mais arriscado do processo é o seu começo, e o mascaramento não
        toca nele.
      </p>
      <p>
        <strong>Trocar os identificadores diretos não impede a
        reidentificação.</strong> Substitua nome, CPF e e-mail, e mantenha data de
        nascimento, CEP e a data da última compra. Esse trio já isola indivíduos
        numa base de porte médio. São os quase-identificadores, e eles costumam
        sobreviver ao mascaramento justamente porque o time quer preservar o
        comportamento dos relatórios.
      </p>
      <p>
        <strong>Hash não anonimiza dado enumerável.</strong> Trocar o CPF pelo seu
        hash preserva os <em>joins</em>, o que é conveniente, e por isso a técnica
        é popular. Só que o CPF tem nove dígitos de base e dois verificadores
        derivados dela: o espaço inteiro cabe em um bilhão de candidatos.
      </p>
      <CodeBlock
        language="TypeScript"
        caption="Um bilhão de candidatos é trabalho de minutos numa máquina comum. Quando o domínio do dado é enumerável, o hash é só um apelido."
        code={`import { createHash } from "node:crypto";

// hashVazado veio de uma coluna "anonimizada" por hash.
function reidentificar(hashVazado: string, algoritmo = "sha256") {
  for (let base = 0; base < 1_000_000_000; base++) {
    const cpf = comDigitosVerificadores(String(base).padStart(9, "0"));
    const h = createHash(algoritmo).update(cpf).digest("hex");
    if (h === hashVazado) return cpf;
  }
  return null;
}`}
      />
      <p>
        Adicionar sal resolve a força bruta e destrói os <em>joins</em>, que eram
        a razão de usar hash. Usar o mesmo sal em todas as tabelas devolve os{" "}
        <em>joins</em> e devolve também a reversibilidade para quem tiver o sal —
        que estará no repositório, porque o pipeline precisa dele.
      </p>
      <p>
        <strong>A máscara quebra o que o sistema valida.</strong> Substituir
        dígitos por asteriscos produz um CPF que falha no{" "}
        <a href="/guias/modulo-11-digito-verificador">módulo 11</a> e derruba
        justamente os testes de cadastro. Sortear números aleatórios no lugar
        produz documentos inválidos e rompe chaves estrangeiras. Manter a
        coerência entre CPF, CEP e UF depois de embaralhar tudo exige reimplementar
        as regras do domínio dentro do script de máscara — a mesma lógica que um
        gerador já tem pronta.
      </p>
      <p>
        <strong>Campos livres escapam.</strong> Observação de atendimento,
        descrição de chamado, complemento de endereço, corpo de e-mail arquivado,
        payload de auditoria em JSON, anexo em PDF, metadado de imagem. Nenhum
        regex cobre tudo isso, e é nesses campos que o dado pessoal se esconde com
        mais frequência.
      </p>
      <p>
        <strong>O pipeline apodrece em silêncio.</strong> Toda coluna nova precisa
        entrar no script de máscara. Uma <em>migration</em> cria{" "}
        <code>telefone_secundario</code>, ninguém lembra de atualizar o
        mascaramento, e a coluna vai crua para homologação sem que nenhum teste
        falhe. Mascaramento é um projeto com manutenção perpétua; geração de massa
        é uma função que você chama.
      </p>

      <h2>Por que inventar números na mão também não funciona</h2>
      <p>
        A saída oposta seria digitar qualquer coisa, mas os próprios sistemas
        impedem. Um CPF <code>000.000.000-00</code> ou um número digitado ao acaso
        quase sempre falha na validação de dígito verificador, e o teste morre
        antes de exercitar a regra de negócio. Já <code>Teste Teste</code> como
        nome esconde os bugs que só aparecem com nome real: acento, cedilha,
        preposição em minúscula, sobrenome que estoura o limite da coluna,{" "}
        <em>collation</em> que ordena errado. O time precisa de dado que{" "}
        <strong>pareça e se comporte como real</strong> sem <strong>ser</strong>{" "}
        de ninguém.
      </p>

      <h2>O que massa sintética resolve</h2>
      <p>
        Dado sintético é gerado artificialmente com as mesmas propriedades
        estruturais do dado real: dígitos verificadores corretos, CEP dentro da
        faixa do estado, CPF com o dígito de{" "}
        <a href="/guias/regiao-fiscal-cpf">região fiscal</a> compatível com a UF
        escolhida, nome com a distribuição de acentos e tamanhos que o Brasil
        produz. Passa nos validadores e exercita os mesmos caminhos de código.
        Como não descreve pessoa alguma, não é dado pessoal, e o ambiente que o
        recebe fica fora da discussão.
      </p>
      <p>
        A diferença para a anonimização é de origem. Anonimizar parte de um dado
        real e tenta apagar o vínculo, sempre sob a sombra de uma reidentificação
        futura com técnicas melhores do que as de hoje. Sintético nunca teve
        vínculo: não há o que reverter, e a conversa com o jurídico termina na
        primeira frase.
      </p>

      <h2>Checklist para pipelines, seeds e CI</h2>
      <ul>
        <li>
          <strong>Nenhum dump de produção sai da produção.</strong> Se o problema
          é volume, gere volume — um gerador produz cem mil fichas coerentes mais
          rápido do que um export roda.
        </li>
        <li>
          <strong>Homologação nasce vazia e é semeada</strong>, nunca restaurada
          de um backup de produção. Restaurar backup é copiar a base inteira, com
          as colunas que o script de máscara ainda não conhece.
        </li>
        <li>
          <strong>Seeds e fixtures versionados contêm apenas dado gerado.</strong>{" "}
          O que entra no histórico do Git é praticamente impossível de remover
          depois: cada clone do repositório carrega uma cópia.
        </li>
        <li>
          <strong>Um passo de CI varre os arquivos de massa</strong> atrás de
          padrões de documento, telefone e e-mail e falha quando aparece algo
          novo. Os padrões estão no guia de{" "}
          <a href="/guias/regex-documentos-brasileiros">
            regex para documentos brasileiros
          </a>
          .
        </li>
        <li>
          <strong>Semente fixa no gerador.</strong> Teste que falha precisa
          reproduzir; com seed determinístico você reproduz sem guardar o dado que
          causou a falha. O guia de{" "}
          <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
            massa de dados de teste
          </a>{" "}
          detalha o arranjo com <em>factories</em> e <em>fixtures</em>.
        </li>
        <li>
          <strong>Logs e telemetria de não-produção não recebem payload
          bruto.</strong> Rastreador de erro, APM e log estruturado são bancos de
          dados que ninguém chama de banco de dados.
        </li>
        <li>
          <strong>Print, vídeo de demo, coleção de Postman e exemplo de
          documentação usam dado gerado.</strong> Material que vai para fora é
          ambiente público, e é de lá que vazamento constrangedor costuma sair.
        </li>
        <li>
          <strong>Acesso de leitura à produção é nominal, temporário e
          auditado.</strong> Se todo mundo tem por padrão, o mascaramento vira
          teatro.
        </li>
        <li>
          <strong>Dado real que aparecer em homologação é incidente.</strong>{" "}
          Apague, estime a exposição, registre e avise o encarregado. Tratar como
          descuido normaliza a prática.
        </li>
      </ul>
      <p>
        É esse o desenho que o bateCarimbo atende: gerar documentos e fichas
        completas de pessoas e empresas fictícias, válidas nos validadores e
        coerentes por estado, para que a sua base de teste não precise nunca ter
        vindo da produção. Comece pelo{" "}
        <a href="/gerador-de-pessoas">gerador de pessoas</a> ou pelo{" "}
        <a href="/gerador-de-empresas">gerador de empresas</a> e leve o resultado
        direto para o seed.
      </p>
    </ArticleLayout>
  );
}
