import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("validar-cpf-cnpj-sql-postgres-mysql-sqlserver")!;

export const metadata: Metadata = guideMetadata(guide);

const PG_CPF = `CREATE OR REPLACE FUNCTION cpf_valido(entrada text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
PARALLEL SAFE
AS $$
DECLARE
  doc   text;
  base  text;
  soma  int;
  resto int;
  dv1   int;
  dv2   int;
BEGIN
  IF entrada IS NULL THEN
    RETURN false;
  END IF;

  doc := regexp_replace(entrada, '[^0-9]', '', 'g');

  IF length(doc) <> 11 THEN
    RETURN false;
  END IF;

  -- 00000000000, 11111111111 e companhia fecham a conta do modulo 11
  IF doc = repeat(left(doc, 1), 11) THEN
    RETURN false;
  END IF;

  base := left(doc, 9);

  soma := 0;
  FOR i IN 1..9 LOOP
    soma := soma + substr(base, i, 1)::int * (11 - i);   -- pesos 10..2
  END LOOP;
  resto := soma % 11;
  dv1 := CASE WHEN resto < 2 THEN 0 ELSE 11 - resto END;

  base := base || dv1::text;

  soma := 0;
  FOR i IN 1..10 LOOP
    soma := soma + substr(base, i, 1)::int * (12 - i);   -- pesos 11..2
  END LOOP;
  resto := soma % 11;
  dv2 := CASE WHEN resto < 2 THEN 0 ELSE 11 - resto END;

  RETURN right(doc, 2) = dv1::text || dv2::text;
END;
$$;`;

const PG_CNPJ = `CREATE OR REPLACE FUNCTION cnpj_valido(entrada text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
PARALLEL SAFE
AS $$
DECLARE
  doc   text;
  base  text;
  p1    int[] := ARRAY[5,4,3,2,9,8,7,6,5,4,3,2];
  p2    int[] := ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2];
  soma  int;
  resto int;
  dv1   int;
  dv2   int;
BEGIN
  IF entrada IS NULL THEN
    RETURN false;
  END IF;

  doc := upper(regexp_replace(entrada, '[^0-9A-Za-z]', '', 'g'));

  -- 12 posicoes de base (digito ou letra) + 2 digitos verificadores
  IF doc !~ '^[0-9A-Z]{12}[0-9]{2}$' THEN
    RETURN false;
  END IF;

  IF doc = repeat(left(doc, 1), 14) THEN
    RETURN false;
  END IF;

  base := left(doc, 12);

  -- valor do caractere = codigo ASCII menos 48: '0' vale 0, 'A' vale 17, 'Z' vale 42
  soma := 0;
  FOR i IN 1..12 LOOP
    soma := soma + (ascii(substr(base, i, 1)) - 48) * p1[i];
  END LOOP;
  resto := soma % 11;
  dv1 := CASE WHEN resto < 2 THEN 0 ELSE 11 - resto END;

  soma := dv1 * p2[13];
  FOR i IN 1..12 LOOP
    soma := soma + (ascii(substr(base, i, 1)) - 48) * p2[i];
  END LOOP;
  resto := soma % 11;
  dv2 := CASE WHEN resto < 2 THEN 0 ELSE 11 - resto END;

  RETURN right(doc, 2) = dv1::text || dv2::text;
END;
$$;`;

const PG_CHECK = `-- NOT VALID cria a restricao sem varrer a tabela inteira:
-- a partir daqui toda linha nova ou alterada e verificada.
ALTER TABLE cliente
  ADD CONSTRAINT cliente_cpf_valido
  CHECK (cpf IS NULL OR cpf_valido(cpf)) NOT VALID;

-- depois de limpar o legado, a varredura roda com lock fraco:
ALTER TABLE cliente VALIDATE CONSTRAINT cliente_cpf_valido;`;

const MYSQL_FN = `DELIMITER $$

CREATE FUNCTION cpf_valido(entrada VARCHAR(20))
RETURNS BOOLEAN
DETERMINISTIC
NO SQL
BEGIN
  DECLARE doc  VARCHAR(20);
  DECLARE base VARCHAR(11);
  DECLARE i, soma, resto, dv1, dv2 INT;

  IF entrada IS NULL THEN
    RETURN FALSE;
  END IF;

  SET doc = REGEXP_REPLACE(entrada, '[^0-9]', '');

  IF CHAR_LENGTH(doc) <> 11 THEN
    RETURN FALSE;
  END IF;

  IF doc = REPEAT(LEFT(doc, 1), 11) THEN
    RETURN FALSE;
  END IF;

  SET base = LEFT(doc, 9);

  SET soma = 0, i = 1;
  WHILE i <= 9 DO
    SET soma = soma + CAST(SUBSTRING(base, i, 1) AS UNSIGNED) * (11 - i);
    SET i = i + 1;
  END WHILE;
  SET resto = soma % 11;
  SET dv1 = IF(resto < 2, 0, 11 - resto);

  SET base = CONCAT(base, dv1);

  SET soma = 0, i = 1;
  WHILE i <= 10 DO
    SET soma = soma + CAST(SUBSTRING(base, i, 1) AS UNSIGNED) * (12 - i);
    SET i = i + 1;
  END WHILE;
  SET resto = soma % 11;
  SET dv2 = IF(resto < 2, 0, 11 - resto);

  RETURN RIGHT(doc, 2) = CONCAT(dv1, dv2);
END$$

DELIMITER ;`;

const MYSQL_TRIGGER = `DELIMITER $$

CREATE TRIGGER cliente_cpf_bi BEFORE INSERT ON cliente
FOR EACH ROW
BEGIN
  IF NEW.cpf IS NOT NULL AND NOT cpf_valido(NEW.cpf) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'CPF invalido';
  END IF;
  -- a trigger tambem pode normalizar, o que um CHECK nunca faz:
  SET NEW.cpf = REGEXP_REPLACE(NEW.cpf, '[^0-9]', '');
END$$

CREATE TRIGGER cliente_cpf_bu BEFORE UPDATE ON cliente
FOR EACH ROW
BEGIN
  IF NEW.cpf IS NOT NULL AND NOT cpf_valido(NEW.cpf) THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'CPF invalido';
  END IF;
  SET NEW.cpf = REGEXP_REPLACE(NEW.cpf, '[^0-9]', '');
END$$

DELIMITER ;`;

const TSQL = `CREATE OR ALTER FUNCTION dbo.CpfValido (@entrada varchar(20))
RETURNS bit
WITH SCHEMABINDING
AS
BEGIN
    DECLARE @doc varchar(20) = @entrada;
    DECLARE @base varchar(11);
    DECLARE @i int, @soma int, @resto int, @dv1 int, @dv2 int;

    IF @doc IS NULL RETURN 0;

    -- sem regex nativo: remove um caractere nao numerico por vez
    WHILE PATINDEX('%[^0-9]%', @doc) > 0
        SET @doc = STUFF(@doc, PATINDEX('%[^0-9]%', @doc), 1, '');

    IF LEN(@doc) <> 11 RETURN 0;
    IF @doc = REPLICATE(LEFT(@doc, 1), 11) RETURN 0;

    SET @base = LEFT(@doc, 9);

    SET @soma = 0; SET @i = 1;
    WHILE @i <= 9
    BEGIN
        SET @soma = @soma + CAST(SUBSTRING(@base, @i, 1) AS int) * (11 - @i);
        SET @i = @i + 1;
    END;
    SET @resto = @soma % 11;
    SET @dv1 = CASE WHEN @resto < 2 THEN 0 ELSE 11 - @resto END;

    SET @base = @base + CAST(@dv1 AS varchar(1));

    SET @soma = 0; SET @i = 1;
    WHILE @i <= 10
    BEGIN
        SET @soma = @soma + CAST(SUBSTRING(@base, @i, 1) AS int) * (12 - @i);
        SET @i = @i + 1;
    END;
    SET @resto = @soma % 11;
    SET @dv2 = CASE WHEN @resto < 2 THEN 0 ELSE 11 - @resto END;

    RETURN CASE
        WHEN RIGHT(@doc, 2) = CAST(@dv1 AS varchar(1)) + CAST(@dv2 AS varchar(1))
        THEN 1 ELSE 0
    END;
END;
GO

-- WITH NOCHECK adota o legado sem reprovar a migracao
ALTER TABLE dbo.Cliente WITH NOCHECK
    ADD CONSTRAINT CK_Cliente_Cpf
    CHECK (Cpf IS NULL OR dbo.CpfValido(Cpf) = 1);
GO`;

const AUDIT = `-- 1. quanto e de que tipo e o estrago
WITH normalizado AS (
  SELECT
    c.id,
    c.cpf AS original,
    regexp_replace(coalesce(c.cpf, ''), '[^0-9]', '', 'g') AS digitos
  FROM cliente c
),
classificado AS (
  SELECT
    id,
    original,
    digitos,
    CASE
      WHEN original IS NULL OR btrim(original) = ''
        THEN 'vazio'
      WHEN length(digitos) <> 11
        THEN 'tamanho ' || length(digitos)
      WHEN digitos = repeat(left(digitos, 1), 11)
        THEN 'sequencia repetida'
      WHEN NOT cpf_valido(digitos)
        THEN 'digito verificador errado'
      ELSE 'ok'
    END AS motivo
  FROM normalizado
)
SELECT
  motivo,
  count(*)        AS linhas,
  min(id)         AS exemplo_id,
  min(original)   AS exemplo
FROM classificado
WHERE motivo <> 'ok'
GROUP BY motivo
ORDER BY linhas DESC;

-- 2. o mesmo documento gravado em grafias diferentes
SELECT
  regexp_replace(cpf, '[^0-9]', '', 'g') AS digitos,
  count(*)                               AS ocorrencias,
  string_agg(DISTINCT cpf, ' | ')        AS grafias
FROM cliente
WHERE cpf IS NOT NULL
GROUP BY 1
HAVING count(*) > 1
ORDER BY ocorrencias DESC;`;

const MIGRATION = `-- 1. a coluna vira texto de tamanho fixo e recupera os zeros a esquerda
ALTER TABLE empresa
  ALTER COLUMN cnpj TYPE varchar(14) COLLATE "C"
  USING lpad(cnpj::text, 14, '0');

-- 2. forma canonica: 12 posicoes alfanumericas em maiuscula + 2 digitos
ALTER TABLE empresa
  ADD CONSTRAINT empresa_cnpj_formato
  CHECK (cnpj ~ '^[0-9A-Z]{12}[0-9]{2}$');

-- 3. o digito verificador, com a mesma funcao para os dois formatos
ALTER TABLE empresa
  ADD CONSTRAINT empresa_cnpj_dv
  CHECK (cnpj IS NULL OR cnpj_valido(cnpj)) NOT VALID;

-- 4. raiz como coluna gerada: agrupa matriz e filiais sem SUBSTRING solto no codigo
ALTER TABLE empresa
  ADD COLUMN cnpj_raiz varchar(8)
  GENERATED ALWAYS AS (left(cnpj, 8)) STORED;

CREATE INDEX empresa_cnpj_raiz_idx ON empresa (cnpj_raiz);`;

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Quase todo sistema brasileiro valida CPF e CNPJ na camada de aplicação, e
        quase todo banco de dados brasileiro tem documento inválido gravado. Os dois
        fatos convivem porque a aplicação não é a única coisa que escreve na tabela:
        existem cargas em lote, migrações de sistemas antigos, integrações que
        entraram por outra porta e o <code>UPDATE</code> que alguém rodou no console
        de produção às onze da noite. O banco é a última fronteira, e é onde a regra
        vale para todo mundo.
      </p>

      <h2>Por que validar também no banco</h2>
      <p>
        Validação na aplicação é indispensável — é ela que devolve mensagem de erro
        decente para quem está digitando. Mas ela protege apenas um caminho de
        escrita. Um <code>COPY</code> no PostgreSQL, um <code>LOAD DATA</code> no
        MySQL ou um pacote do SSIS entram por baixo dela. Quando o mesmo banco é
        usado por dois serviços escritos em linguagens diferentes, a regra existe em
        dois lugares e, com o tempo, existe em duas versões.
      </p>
      <p>
        A restrição no banco resolve isso de um jeito que nenhuma biblioteca resolve:
        ela é avaliada a cada linha, independentemente de quem mandou a linha. E ela
        muda a natureza do bug. Sem restrição, o dado errado entra silenciosamente e
        aparece meses depois, na emissão de uma nota fiscal ou numa consulta a um
        serviço da Receita Federal que devolve erro para um documento que o seu
        cadastro jurava estar certo. Com restrição, o <code>INSERT</code> falha na
        hora, com a linha problemática na mão.
      </p>
      <p>
        O custo é real e vale dizer: uma função escalar rodando por linha em uma
        carga de milhões de registros pesa. A decisão sobre onde pagar esse custo
        está mais adiante neste guia.
      </p>

      <h2>O tipo da coluna: por que inteiro é sempre errado</h2>
      <p>
        Antes de qualquer função, o tipo. Guardar CPF ou CNPJ em coluna numérica é o
        erro estrutural mais comum, e ele não tem conserto por validação — o dado já
        chega corrompido.
      </p>
      <p>
        O CPF <code>012.345.678-90</code> é perfeitamente válido: base{" "}
        <code>012345678</code>, soma 156 no primeiro dígito verificador e 210 no
        segundo. Gravado em <code>BIGINT</code>, ele vira <code>1234567890</code>.
        Dez algarismos. O zero à esquerda não é decoração, é parte do documento, e
        nenhum <code>lpad</code> na leitura desfaz o fato de que a coluna passou a
        armazenar outra coisa.
      </p>
      <DataTable
        caption="O mesmo CPF válido em três modelagens diferentes."
        headers={["Tipo da coluna", "O que fica gravado", "Consequência"]}
        rows={[
          [
            "BIGINT",
            "1234567890",
            "Perde o zero à esquerda e não aceita letra nenhuma",
          ],
          [
            "VARCHAR(14) com máscara",
            "012.345.678-90",
            "Duas grafias do mesmo documento convivem na tabela",
          ],
          [
            "CHAR(11), só dígitos",
            "01234567890",
            "Forma canônica: um documento, uma representação",
          ],
        ]}
      />
      <p>
        O CNPJ alfanumérico encerra a discussão de vez. A partir de julho de 2026 as
        novas inscrições podem trazer letras nas doze posições da base, e{" "}
        <code>12.ABC.345/01DE-35</code> é um número tão legítimo quanto qualquer
        outro. Coluna numérica não recebe isso, e a conversão não é opcional: os dois
        formatos vão conviver na mesma tabela. O{" "}
        <a href="/guias/cnpj-alfanumerico-2026">guia do CNPJ alfanumérico</a> detalha
        a regra de conversão de caractere para valor.
      </p>
      <p>
        Sobra o argumento de performance, que costuma ser mais folclore do que
        medição. Um índice B-tree sobre <code>BIGINT</code> ocupa oito bytes por
        chave contra onze mais o cabeçalho de uma <code>char(11)</code>; a diferença
        só aparece em tabelas muito grandes. E ela evapora na primeira consulta que
        precisa de <code>lpad(cpf::text, 11, &apos;0&apos;)</code> no{" "}
        <code>WHERE</code>, porque a expressão descarta o índice comum e exige um
        índice de expressão só para desfazer o estrago. Texto de tamanho fixo, com
        apenas dígitos, mais um índice único: essa é a modelagem que não cobra juros
        depois.
      </p>

      <h2>PostgreSQL — função PL/pgSQL e restrição CHECK</h2>
      <p>
        A função abaixo é declarada <code>IMMUTABLE</code> e{" "}
        <code>PARALLEL SAFE</code>, o que é verdade: ela não toca em tabela nenhuma e
        devolve sempre o mesmo resultado para a mesma entrada. Essas duas marcações
        importam — sem <code>IMMUTABLE</code> você não consegue usá-la em índice de
        expressão nem em coluna gerada.
      </p>
      <CodeBlock
        language="SQL — PostgreSQL"
        caption="A função aceita entrada com ou sem máscara e devolve boolean, nunca exceção."
        code={PG_CPF}
      />
      <p>
        A versão do CNPJ muda em três pontos: os pesos são cíclicos de 2 a 9, o valor
        de cada caractere é o código ASCII menos 48 (assim <code>A</code> vale 17 e{" "}
        <code>Z</code> vale 42) e o formato aceita letras apenas nas doze posições da
        base. Para <code>12ABC34501DE</code>, a primeira soma dá 459 e{" "}
        <code>459 % 11 = 8</code>, produzindo o dígito 3; a segunda dá 424 com resto
        6, produzindo o dígito 5.
      </p>
      <CodeBlock
        language="SQL — PostgreSQL"
        caption="A mesma função serve para CNPJ numérico e alfanumérico — o numérico é o caso em que nenhuma letra aparece."
        code={PG_CNPJ}
      />
      <p>
        Com a função no lugar, a restrição é uma linha. O detalhe que economiza uma
        janela de manutenção é o <code>NOT VALID</code>: ele passa a exigir a regra
        de toda escrita nova sem varrer a tabela existente, o que permite subir a
        restrição primeiro e limpar o legado depois.
      </p>
      <CodeBlock language="SQL — PostgreSQL" code={PG_CHECK} />
      <p>
        Uma ressalva honesta sobre <code>CHECK</code> com função de usuário no
        PostgreSQL: se você alterar a função depois, as linhas já gravadas não são
        reavaliadas — a restrição continua marcada como válida com dados que a nova
        versão reprovaria. E, no restore de um dump, a função precisa existir antes
        da tabela; quando ela mora em outro schema, o <code>search_path</code> do
        restore pode transformar isso em erro. Deixe a função no mesmo schema da
        tabela e o problema desaparece.
      </p>

      <h2>MySQL — stored function e as limitações de CHECK por versão</h2>
      <p>
        No MySQL a tradução é direta, com duas dependências: <code>REGEXP_REPLACE</code>{" "}
        só existe a partir do 8.0, e a função precisa ser declarada{" "}
        <code>DETERMINISTIC</code> para ser criada com o log binário ativo na
        configuração padrão. Em 5.7 dá para substituir a limpeza da máscara por um
        laço com <code>SUBSTRING</code> testando cada caractere.
      </p>
      <CodeBlock
        language="SQL — MySQL"
        caption="DELIMITER é necessário no cliente de linha de comando; clientes gráficos e migrations geralmente dispensam."
        code={MYSQL_FN}
      />
      <p>
        Agora a parte que costuma pegar quem vem do PostgreSQL. Antes da versão
        8.0.16 o MySQL <strong>aceitava a sintaxe de <code>CHECK</code> e a
        ignorava</strong> — a restrição era guardada e nunca aplicada. Do 8.0.16 em
        diante ela passou a ser efetivamente verificada, o que significa que o mesmo
        DDL se comporta de dois jeitos diferentes conforme a versão do servidor.
        Antes de confiar num <code>CHECK</code>, confirme em qual versão o banco de
        produção realmente roda.
      </p>
      <p>
        Mesmo no 8.0.16 e acima há um limite que não tem contorno: a expressão de um{" "}
        <code>CHECK</code> no MySQL não pode chamar stored function. Isto é, você
        pode escrever <code>CHECK (cpf REGEXP &apos;^[0-9]{"{11}"}$&apos;)</code>,
        mas não <code>CHECK (cpf_valido(cpf))</code>. Para aplicar o dígito
        verificador, o caminho é uma trigger.
      </p>
      <CodeBlock
        language="SQL — MySQL"
        caption="SIGNAL com SQLSTATE 45000 é a forma padrão de abortar a escrita com mensagem própria."
        code={MYSQL_TRIGGER}
      />
      <p>
        Repare que a trigger faz algo que uma restrição jamais faria: além de
        reprovar, ela normaliza, retirando a máscara antes de gravar. Isso resolve na
        raiz o problema de duas grafias para o mesmo documento — mas cria dois
        objetos de banco para manter em sincronia, e a lógica passa a morar num lugar
        onde ninguém procura ao ler o schema. Some-se a isso que são necessárias duas
        triggers quase idênticas, uma para <code>INSERT</code> e outra para{" "}
        <code>UPDATE</code>, com o risco clássico de corrigir uma e esquecer a outra.
      </p>

      <h2>SQL Server — função escalar em T-SQL</h2>
      <p>
        O T-SQL não tem expressão regular nativa nas versões em uso na maioria das
        instalações, então a limpeza da máscara vira um laço com{" "}
        <code>PATINDEX</code> e <code>STUFF</code>. Em compensação, o SQL Server
        aceita função de usuário dentro de <code>CHECK</code> sem cerimônia.
      </p>
      <CodeBlock
        language="SQL — SQL Server"
        caption="WITH SCHEMABINDING impede que alguém altere um objeto do qual a função depende e também a torna elegível para otimizações."
        code={TSQL}
      />
      <p>
        O <code>WITH NOCHECK</code> na restrição é o equivalente do{" "}
        <code>NOT VALID</code> do PostgreSQL: adota o legado como está e passa a
        cobrar das escritas novas. Quando a base estiver limpa, um{" "}
        <code>ALTER TABLE dbo.Cliente WITH CHECK CHECK CONSTRAINT CK_Cliente_Cpf</code>{" "}
        valida o que já existe e devolve a restrição para o estado confiável — enquanto
        ela estiver marcada como não confiável, o otimizador ignora a garantia ao
        montar planos.
      </p>
      <p>
        O ponto sensível é desempenho. Funções escalares em T-SQL são avaliadas linha
        a linha e historicamente impedem paralelismo no plano; versões recentes do
        SQL Server fazem inlining automático de funções escalares, mas funções com
        laço <code>WHILE</code>, como esta, ficam de fora dessa otimização. Em tabelas
        grandes com carga pesada de escrita, meça antes de colocar a função numa
        restrição — talvez ela sirva melhor como ferramenta de auditoria periódica.
      </p>

      <h2>CHECK, trigger ou aplicação: onde colocar a regra</h2>
      <p>
        As três opções não competem, cobrem camadas diferentes, e escolher só uma
        costuma ser a decisão errada.
      </p>
      <ul>
        <li>
          <strong>Aplicação.</strong> É a única camada que conversa com o usuário.
          Devolve &ldquo;o segundo dígito verificador não confere&rdquo; em vez de uma
          violação de constraint, valida antes de montar o formulário inteiro e não
          consome conexão de banco. Veja o{" "}
          <a href="/guias/validar-cpf-cnpj-javascript-typescript">
            guia de validação em JavaScript e TypeScript
          </a>{" "}
          para a implementação equivalente.
        </li>
        <li>
          <strong>CHECK.</strong> Declarativo, barato de auditar (está no DDL, entra
          no controle de versão do schema) e impossível de contornar sem um{" "}
          <code>ALTER TABLE</code> explícito. Não normaliza nada e, no MySQL, não
          chama função. Não é portável: a mesma restrição precisa ser reescrita em
          cada banco.
        </li>
        <li>
          <strong>Trigger.</strong> Consegue normalizar e reprovar no mesmo passo, e é
          a única saída no MySQL. Em troca, é código imperativo escondido do
          desenvolvedor que lê só o schema, e costuma ser o primeiro suspeito quando
          uma carga em lote fica lenta.
        </li>
      </ul>
      <p>
        O arranjo que envelhece bem: normalizar e validar na aplicação para a
        experiência de uso; uma restrição no banco como rede de segurança contra as
        escritas que não passam por ela; e uma consulta de auditoria agendada para
        pegar o que entrou antes de tudo isso existir. Vale lembrar que nenhuma das
        três diz se o documento existe de fato — um CPF pode ter dígitos corretos e
        nunca ter sido emitido, assunto do{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          guia sobre situação cadastral
        </a>
        .
      </p>

      <h2>Auditoria: encontrando documentos inválidos já gravados na base</h2>
      <p>
        Antes de ligar qualquer restrição, é preciso saber o tamanho do problema. Uma
        contagem simples de inválidos não ajuda muito; o que decide o plano de
        limpeza é a distribuição dos motivos. Campo vazio se resolve com{" "}
        <code>NULL</code>, tamanho errado costuma ser truncamento de coluna em algum
        ETL, sequência repetida é placeholder de formulário, e dígito verificador
        errado é digitação humana — cada um pede um tratamento.
      </p>
      <CodeBlock
        language="SQL — PostgreSQL"
        caption="A primeira consulta classifica o estrago; a segunda encontra o mesmo documento gravado com e sem máscara, que é o defeito que quebra JOIN e índice único."
        code={AUDIT}
      />
      <p>
        A segunda consulta merece atenção especial numa base que nunca teve
        restrição. É comum encontrar <code>012.345.678-90</code> e{" "}
        <code>01234567890</code> como dois clientes distintos, com pedidos divididos
        entre eles. Um índice único sobre a coluna crua nunca detectou o duplicado
        porque, para o banco, são strings diferentes. A correção é escolher a forma
        canônica, atualizar todas as linhas para ela e só então criar o índice único
        — nessa ordem, ou o índice falha na criação.
      </p>
      <p>
        Se o volume de inválidos for grande, o caminho menos arriscado é copiar as
        linhas reprovadas para uma tabela de quarentena com o motivo, esvaziar o campo
        na tabela original e tratar a quarentena como fila de correção. Assim a
        restrição entra hoje e a limpeza acontece no ritmo possível.
      </p>

      <h2>Preparando o schema para o CNPJ alfanumérico</h2>
      <p>
        Quem guardou CNPJ como número tem uma migração pela frente, e ela é mais do
        que um <code>ALTER COLUMN</code>. O <code>USING</code> com{" "}
        <code>lpad</code> é o que devolve os zeros à esquerda que o tipo numérico
        comeu ao longo dos anos.
      </p>
      <CodeBlock
        language="SQL — PostgreSQL"
        caption="Rode em transação e confira as contagens antes do commit: a conversão de tipo reescreve a tabela inteira."
        code={MIGRATION}
      />
      <p>
        A cláusula <code>COLLATE &quot;C&quot;</code> não é detalhe estético. Em uma
        collation de locale, a ordenação de strings que misturam letras e dígitos
        segue regras linguísticas, e uma atualização da biblioteca de collation do
        sistema operacional pode mudar essa ordem — o que invalida índices de texto e
        obriga a um <code>REINDEX</code>. Para um identificador que é apenas uma
        sequência de <code>[0-9A-Z]</code>, a ordem binária é previsível, estável
        entre servidores e mais rápida de comparar.
      </p>
      <p>
        No MySQL e no SQL Server, o cuidado equivalente é fugir das collations
        insensíveis a maiúsculas, que são o padrão nos dois. Com{" "}
        <code>utf8mb4_0900_ai_ci</code>, a consulta{" "}
        <code>WHERE cnpj = &apos;12abc34501de35&apos;</code> encontra a linha gravada
        em maiúsculas — conveniente, e exatamente por isso perigoso: o erro de
        normalização nunca aparece, até o dia em que o valor sai do banco em
        minúsculas e é enviado para um serviço externo que o rejeita. Uma collation
        binária (<code>utf8mb4_bin</code> ou <code>Latin1_General_BIN2</code>) somada
        à restrição de formato força a normalização na porta de entrada.
      </p>
      <p>
        A coluna gerada com a raiz de oito posições resolve um incômodo prático: em
        um CNPJ alfanumérico, agrupar filiais por matriz continua sendo comparar as
        oito primeiras posições, só que agora elas podem conter letras e nenhuma
        aritmética funciona. Com a raiz materializada e indexada, o relatório de
        grupo econômico deixa de depender de <code>SUBSTRING</code> repetido em cada
        consulta. Para testar a migração antes de encostar em produção, o{" "}
        <Link href="/">gerador de CNPJ</Link> emite lotes no formato alfanumérico com dígito
        verificador correto, e o{" "}
        <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
          guia de massa de dados de teste
        </a>{" "}
        mostra como transformar esses lotes em seeds reproduzíveis.
      </p>
    </ArticleLayout>
  );
}
