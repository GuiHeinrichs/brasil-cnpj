import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
import { CodeBlock } from "@/components/guias/code-block";
import { DataTable } from "@/components/guias/worked-table";
import { getGuide } from "@/lib/guias";

const guide = getGuide("validar-cpf-cnpj-python-java-csharp")!;

export const metadata: Metadata = guideMetadata(guide);

const PYTHON_CORE = `import re

_NON_DIGIT = re.compile(r"[^0-9]")
_NON_ALNUM = re.compile(r"[^0-9A-Za-z]")
_CNPJ_SHAPE = re.compile(r"^[0-9A-Z]{12}[0-9]{2}$")

# Pesos do CNPJ para a base de 13 caracteres; a base de 12 usa os 12 últimos.
_CNPJ_WEIGHTS = (6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2)


def _module11(products: int) -> int:
    remainder = products % 11
    return 0 if remainder < 2 else 11 - remainder


def _cpf_check_digit(base: str, start_weight: int) -> int:
    total = sum(int(c) * (start_weight - i) for i, c in enumerate(base))
    return _module11(total)


def is_valid_cpf(value: str | None) -> bool:
    cpf = _NON_DIGIT.sub("", value or "")
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        return False
    first = _cpf_check_digit(cpf[:9], 10)
    second = _cpf_check_digit(cpf[:9] + str(first), 11)
    return cpf[9:] == f"{first}{second}"


def _cnpj_check_digit(base: str) -> int:
    weights = _CNPJ_WEIGHTS[-len(base):]
    total = sum((ord(c) - 48) * w for c, w in zip(base, weights))
    return _module11(total)


def is_valid_cnpj(value: str | None) -> bool:
    cnpj = _NON_ALNUM.sub("", value or "").upper()
    if not _CNPJ_SHAPE.match(cnpj) or cnpj == cnpj[0] * 14:
        return False
    first = _cnpj_check_digit(cnpj[:12])
    second = _cnpj_check_digit(cnpj[:12] + str(first))
    return cnpj[12:] == f"{first}{second}"`;

const PYTHON_PYDANTIC = `from typing import Annotated

from pydantic import AfterValidator, BaseModel, Field


def _normalize_cpf(value: str) -> str:
    cpf = _NON_DIGIT.sub("", value or "")
    if not is_valid_cpf(cpf):
        raise ValueError("CPF inválido")
    return cpf


def _normalize_cnpj(value: str) -> str:
    cnpj = _NON_ALNUM.sub("", value or "").upper()
    if not is_valid_cnpj(cnpj):
        raise ValueError("CNPJ inválido")
    return cnpj


Cpf = Annotated[str, AfterValidator(_normalize_cpf)]
Cnpj = Annotated[str, AfterValidator(_normalize_cnpj)]


class Cliente(BaseModel):
    nome: str = Field(min_length=3)
    cpf: Cpf


class Fornecedor(BaseModel):
    razao_social: str
    cnpj: Cnpj


# Cliente(nome="Ana", cpf="123.456.789-09").cpf  ->  "12345678909"`;

const PYTHON_FAKER = `import random

from faker import Faker

fake = Faker("pt_BR")
Faker.seed(42)  # a mesma seed produz sempre a mesma massa

fake.cpf()   # CPF com máscara e dígitos verificadores válidos
fake.cnpj()  # CNPJ numérico com máscara

_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"


def fake_cnpj_alfanumerico(rng: random.Random) -> str:
    """Gera um CNPJ alfanumérico fictício com DV correto."""
    base = "".join(rng.choice(_CHARSET) for _ in range(12))
    first = _cnpj_check_digit(base)
    second = _cnpj_check_digit(base + str(first))
    return f"{base}{first}{second}"


# fake_cnpj_alfanumerico(random.Random(42))  ->  base aleatória + 2 dígitos`;

const PYTHON_TEST = `import pytest

CPF_CASES = [
    ("123.456.789-09", True),
    ("12345678909", True),
    ("111.111.111-11", False),
    ("123.456.789-00", False),
    ("123456789", False),
    (None, False),
]

CNPJ_CASES = [
    ("11.222.333/0001-81", True),
    ("12.ABC.345/01DE-35", True),
    ("12.abc.345/01de-35", True),
    ("00.000.000/0000-00", False),
    ("12.ABC.345/01DE-3X", False),
    (None, False),
]


@pytest.mark.parametrize("entrada,esperado", CPF_CASES)
def test_is_valid_cpf(entrada, esperado):
    assert is_valid_cpf(entrada) is esperado


@pytest.mark.parametrize("entrada,esperado", CNPJ_CASES)
def test_is_valid_cnpj(entrada, esperado):
    assert is_valid_cnpj(entrada) is esperado`;

const JAVA_CORE = `package br.com.exemplo.documentos;

import java.util.Locale;

public final class Documentos {

    private static final int[] CNPJ_WEIGHTS = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

    private Documentos() {
    }

    public static String onlyDigits(String value) {
        return value == null ? "" : value.replaceAll("[^0-9]", "");
    }

    public static String normalizeCnpj(String value) {
        return value == null
                ? ""
                : value.replaceAll("[^0-9A-Za-z]", "").toUpperCase(Locale.ROOT);
    }

    private static int module11(int total) {
        int remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    public static boolean isValidCpf(String value) {
        String cpf = onlyDigits(value);
        if (cpf.length() != 11 || cpf.chars().distinct().count() == 1) {
            return false;
        }
        int first = cpfCheckDigit(cpf.substring(0, 9), 10);
        int second = cpfCheckDigit(cpf.substring(0, 9) + first, 11);
        return cpf.charAt(9) - '0' == first && cpf.charAt(10) - '0' == second;
    }

    private static int cpfCheckDigit(String base, int startWeight) {
        int total = 0;
        for (int i = 0; i < base.length(); i++) {
            total += (base.charAt(i) - '0') * (startWeight - i);
        }
        return module11(total);
    }

    public static boolean isValidCnpj(String value) {
        String cnpj = normalizeCnpj(value);
        if (!cnpj.matches("[0-9A-Z]{12}[0-9]{2}")
                || cnpj.chars().distinct().count() == 1) {
            return false;
        }
        String base = cnpj.substring(0, 12);
        int first = cnpjCheckDigit(base);
        int second = cnpjCheckDigit(base + first);
        return cnpj.charAt(12) - '0' == first && cnpj.charAt(13) - '0' == second;
    }

    private static int cnpjCheckDigit(String base) {
        int offset = CNPJ_WEIGHTS.length - base.length();
        int total = 0;
        for (int i = 0; i < base.length(); i++) {
            total += (base.charAt(i) - 48) * CNPJ_WEIGHTS[offset + i];
        }
        return module11(total);
    }
}`;

const JAVA_ANNOTATION = `package br.com.exemplo.documentos;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CnpjValidator.class)
public @interface Cnpj {
    String message() default "CNPJ inválido";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

class CnpjValidator implements ConstraintValidator<Cnpj, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        // null passa: quem exige preenchimento é o @NotNull/@NotBlank.
        return value == null || Documentos.isValidCnpj(value);
    }
}

// Uso no DTO:
// public record FornecedorRequest(@NotBlank String razaoSocial, @NotBlank @Cnpj String cnpj) {}`;

const JAVA_TEST = `package br.com.exemplo.documentos;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class DocumentosTest {

    @ParameterizedTest
    @CsvSource({
        "'123.456.789-09', true",
        "'12345678909',    true",
        "'111.111.111-11', false",
        "'123.456.789-00', false",
        "'123456789',      false"
    })
    void validaCpf(String entrada, boolean esperado) {
        assertEquals(esperado, Documentos.isValidCpf(entrada));
    }

    @ParameterizedTest
    @CsvSource({
        "'11.222.333/0001-81', true",
        "'12.ABC.345/01DE-35', true",
        "'12.abc.345/01de-35', true",
        "'00.000.000/0000-00', false",
        "'12.ABC.345/01DE-3X', false"
    })
    void validaCnpj(String entrada, boolean esperado) {
        assertEquals(esperado, Documentos.isValidCnpj(entrada));
    }

    @org.junit.jupiter.api.Test
    void naoExplodeComNulo() {
        assertEquals(false, Documentos.isValidCpf(null));
        assertEquals(false, Documentos.isValidCnpj(null));
    }
}`;

const JAVA_RECORD = `package br.com.exemplo.documentos;

/** Value object: se a instância existe, o CPF é válido e está normalizado. */
public record Cpf(String valor) {

    public Cpf {
        valor = Documentos.onlyDigits(valor);
        if (!Documentos.isValidCpf(valor)) {
            throw new IllegalArgumentException("CPF inválido");
        }
    }

    /** Formatação só na saída: 000.000.000-00 */
    public String formatado() {
        return valor.replaceFirst("(\\\\d{3})(\\\\d{3})(\\\\d{3})(\\\\d{2})", "$1.$2.$3-$4");
    }
}`;

const CSHARP_CORE = `using System.Linq;
using System.Text.RegularExpressions;

namespace Exemplo.Documentos;

public static class DocumentoExtensions
{
    private static readonly int[] CnpjWeights = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

    private static readonly Regex NonDigit = new("[^0-9]", RegexOptions.Compiled);
    private static readonly Regex NonAlphanumeric = new("[^0-9A-Za-z]", RegexOptions.Compiled);
    private static readonly Regex CnpjShape = new("^[0-9A-Z]{12}[0-9]{2}$", RegexOptions.Compiled);

    public static string OnlyDigits(this string? value) =>
        value is null ? string.Empty : NonDigit.Replace(value, string.Empty);

    public static string NormalizeCnpj(this string? value) =>
        value is null
            ? string.Empty
            : NonAlphanumeric.Replace(value, string.Empty).ToUpperInvariant();

    private static int Module11(int total)
    {
        var remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }

    public static bool IsValidCpf(this string? value)
    {
        var cpf = value.OnlyDigits();
        if (cpf.Length != 11 || cpf.All(c => c == cpf[0]))
        {
            return false;
        }

        var baseDigits = cpf[..9];
        var first = CpfCheckDigit(baseDigits, 10);
        var second = CpfCheckDigit(baseDigits + first, 11);
        return cpf[9] - '0' == first && cpf[10] - '0' == second;
    }

    private static int CpfCheckDigit(string baseDigits, int startWeight)
    {
        var total = 0;
        for (var i = 0; i < baseDigits.Length; i++)
        {
            total += (baseDigits[i] - '0') * (startWeight - i);
        }

        return Module11(total);
    }

    public static bool IsValidCnpj(this string? value)
    {
        var cnpj = value.NormalizeCnpj();
        if (!CnpjShape.IsMatch(cnpj) || cnpj.All(c => c == cnpj[0]))
        {
            return false;
        }

        var baseChars = cnpj[..12];
        var first = CnpjCheckDigit(baseChars);
        var second = CnpjCheckDigit(baseChars + first);
        return cnpj[12] - '0' == first && cnpj[13] - '0' == second;
    }

    private static int CnpjCheckDigit(string baseChars)
    {
        var offset = CnpjWeights.Length - baseChars.Length;
        var total = 0;
        for (var i = 0; i < baseChars.Length; i++)
        {
            total += (baseChars[i] - 48) * CnpjWeights[offset + i];
        }

        return Module11(total);
    }
}`;

const CSHARP_VALIDATION = `using System;
using System.ComponentModel.DataAnnotations;
using FluentValidation;

namespace Exemplo.Documentos;

// 1) DataAnnotations: serve para ASP.NET Core validar o model binding sozinho.
[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
public sealed class CnpjAttribute : ValidationAttribute
{
    public CnpjAttribute() => ErrorMessage = "CNPJ inválido.";

    public override bool IsValid(object? value) =>
        value is null || (value is string text && text.IsValidCnpj());
}

public sealed class FornecedorRequest
{
    [Required]
    public string RazaoSocial { get; init; } = string.Empty;

    [Required]
    [Cnpj]
    public string Documento { get; init; } = string.Empty;
}

// 2) FluentValidation: mesma regra, mas fora do DTO e com mensagens por caso.
public sealed class FornecedorRequestValidator : AbstractValidator<FornecedorRequest>
{
    public FornecedorRequestValidator()
    {
        RuleFor(x => x.RazaoSocial).NotEmpty().MinimumLength(3);

        RuleFor(x => x.Documento)
            .NotEmpty().WithMessage("Informe o CNPJ.")
            .Must(documento => documento.IsValidCnpj())
            .WithMessage("CNPJ inválido.");
    }
}`;

const CSHARP_TEST = `using Xunit;

namespace Exemplo.Documentos.Tests;

public class DocumentoExtensionsTests
{
    [Theory]
    [InlineData("123.456.789-09", true)]
    [InlineData("12345678909", true)]
    [InlineData("111.111.111-11", false)]
    [InlineData("123.456.789-00", false)]
    [InlineData("123456789", false)]
    [InlineData(null, false)]
    public void ValidaCpf(string? entrada, bool esperado) =>
        Assert.Equal(esperado, entrada.IsValidCpf());

    [Theory]
    [InlineData("11.222.333/0001-81", true)]
    [InlineData("12.ABC.345/01DE-35", true)]
    [InlineData("12.abc.345/01de-35", true)]
    [InlineData("00.000.000/0000-00", false)]
    [InlineData("12.ABC.345/01DE-3X", false)]
    [InlineData(null, false)]
    public void ValidaCnpj(string? entrada, bool esperado) =>
        Assert.Equal(esperado, entrada.IsValidCnpj());
}`;

const TEST_CASES: (string | number)[][] = [
  ["123.456.789-09", "CPF", "válido", "entrada com máscara"],
  ["12345678909", "CPF", "válido", "mesma entrada sem máscara"],
  [
    "111.111.111-11",
    "CPF",
    "inválido",
    "sequência repetida que passa no módulo 11",
  ],
  ["123.456.789-00", "CPF", "inválido", "segundo dígito verificador trocado"],
  ["123456789", "CPF", "inválido", "comprimento menor que 11"],
  ["11.222.333/0001-81", "CNPJ", "válido", "formato numérico com máscara"],
  [
    "12.ABC.345/01DE-35",
    "CNPJ",
    "válido",
    "formato alfanumérico, exemplo oficial",
  ],
  [
    "12.abc.345/01de-35",
    "CNPJ",
    "válido",
    "letras minúsculas exigem normalização",
  ],
  [
    "00.000.000/0000-00",
    "CNPJ",
    "inválido",
    "único repetido que fecha o módulo 11",
  ],
  [
    "12.ABC.345/01DE-3X",
    "CNPJ",
    "inválido",
    "os dois DVs continuam numéricos",
  ],
  ["null", "ambos", "inválido", "não pode lançar exceção"],
];

export default function Guide() {
  return (
    <ArticleLayout guide={guide}>
      <p>
        Um validador de CPF e CNPJ cabe em trinta linhas em qualquer linguagem. O
        que costuma dar errado não é a aritmética — é a camada em volta dela:
        onde a normalização acontece, o que o framework de validação faz com um
        campo nulo, como cada linguagem converte um caractere em número e o que
        o teste realmente cobre. Este guia mostra a mesma regra em Python, Java e
        C#, com atenção aos pontos em que as três divergem.
      </p>

      <h2>A regra é a mesma; muda o idioma</h2>
      <p>
        O cálculo é módulo 11 nos dois documentos: multiplique cada caractere da
        base por um peso, some, divida por 11 e derive o dígito do resto. O
        passo a passo com as contas resolvidas está no guia de{" "}
        <a href="/guias/modulo-11-digito-verificador">
          módulo 11 e dígito verificador
        </a>{" "}
        e não se repete aqui. O que interessa agora é o contrato da função e o
        que cada linguagem faz de diferente para cumpri-lo.
      </p>
      <p>
        O contrato das três implementações é sempre o mesmo:
        recebem uma string que pode vir nula, com máscara ou sem, e devolvem um
        booleano. Nunca lançam exceção por entrada malformada — entrada ruim é
        resposta <code>false</code>, não <code>throw</code>. E a normalização
        acontece dentro da função, não é responsabilidade de quem chama, porque
        a chamada vem de lugares demais: formulário, importação de planilha,
        mensagem de fila, script de migração.
      </p>
      <p>
        Três decisões de implementação valem para as três linguagens. A primeira:
        a regra que rejeita sequências repetidas é uma regra <em>extra</em>, não
        faz parte do módulo 11 — os números que ela pega passam na conta e
        precisam ser barrados à parte. No CPF são dez, de{" "}
        <code>000.000.000-00</code> a <code>999.999.999-99</code>: todos fecham
        os dois dígitos. No CNPJ numérico é só{" "}
        <code>00.000.000/0000-00</code>; as outras nove repetições de catorze
        dígitos já são reprovadas pelo próprio módulo 11 — a de{" "}
        <code>1</code> teria de terminar em <code>80</code>, e aí deixa de ser
        repetição. A segunda: o CPF usa pesos decrescentes fixos (10 a 2 e
        depois 11 a 2), enquanto o CNPJ usa uma lista que cicla de 2 a 9 da
        direita para a esquerda, o que na prática vira uma janela sobre um array
        de treze pesos. A terceira: o resto menor que 2 vira dígito 0; do
        contrário, o dígito é <code>11 − resto</code>.
      </p>
      <p>
        Vale separar desde já o que essa função responde do que ela não responde.
        Ela diz que o número é bem formado e consistente. Não diz que existe, nem
        que está regular na Receita — essa distinção está detalhada em{" "}
        <a href="/guias/cpf-valido-nao-e-cpf-existente-situacao-cadastral">
          CPF válido não é CPF existente
        </a>
        .
      </p>

      <h2>Python</h2>
      <h3>A função pura</h3>
      <p>
        Em Python o risco está nas funções que parecem fazer a coisa certa. A
        classe de caracteres <code>\d</code> e o método <code>str.isdigit()</code>{" "}
        não se limitam a <code>0-9</code>: outros algarismos Unicode entram na
        conta, e alguns deles <code>int()</code> converte sem reclamar. Por isso
        a limpeza usa <code>[^0-9]</code> explicitamente, e não{" "}
        <code>\D</code>.
      </p>
      <CodeBlock
        language="Python"
        caption="Um módulo sem dependências; funciona em Python 3.10 ou superior por causa do tipo str | None."
        code={PYTHON_CORE}
      />
      <p>
        O detalhe que faz o CNPJ alfanumérico funcionar está em{" "}
        <code>ord(c) - 48</code>. Para um algarismo isso devolve o próprio valor
        (<code>ord(&quot;7&quot;) - 48 == 7</code>); para uma letra maiúscula,
        devolve 17 no caso de <code>A</code>, 18 no de <code>B</code>, e assim
        por diante. É a mesma função para os dois formatos, e é por isso que o{" "}
        <code>.upper()</code> antes do cálculo é obrigatório: <code>a</code>{" "}
        minúsculo daria 49, não 17.
      </p>
      <h3>Validator no Pydantic</h3>
      <p>
        Em um projeto FastAPI ou em qualquer coisa que use Pydantic v2, a função
        pura não deve ser chamada no handler. Ela vira um tipo anotado com{" "}
        <code>AfterValidator</code>, e aí todo modelo que declara aquele tipo
        ganha validação e normalização de graça. O validator devolve a string
        limpa, então o resto do código recebe sempre onze caracteres sem
        pontuação.
      </p>
      <CodeBlock
        language="Python"
        caption="AfterValidator roda depois da coerção de tipo do Pydantic; levantar ValueError vira erro 422 no FastAPI."
        code={PYTHON_PYDANTIC}
      />
      <h3>Massa de teste com Faker pt_BR</h3>
      <p>
        O Faker com locale <code>pt_BR</code> resolve o caso comum:{" "}
        <code>fake.cpf()</code> e <code>fake.cnpj()</code> devolvem documentos
        com dígito verificador correto. Duas ressalvas. O gerador não garante que
        o número não seja uma sequência repetida, então ele não substitui o teste
        do caso <code>111.111.111-11</code>. E se a versão do provedor que você
        usa ainda emite apenas CNPJ numérico, a massa não exercita o caminho
        alfanumérico — nesse caso vale gerar você mesmo, reaproveitando a função
        de dígito já escrita.
      </p>
      <CodeBlock
        language="Python"
        caption="Faker.seed fixa a sequência: a mesma suíte gera a mesma massa em qualquer máquina."
        code={PYTHON_FAKER}
      />
      <p>
        Estratégias de fixture, factory e seed reproduzível estão em{" "}
        <a href="/guias/massa-de-dados-de-teste-fixtures-seeds-faker">
          como montar massa de dados de teste brasileira
        </a>
        . Para um lote rápido sem escrever código, o{" "}
        <a href="/gerador-de-cpf">gerador de CPF</a> e o{" "}
        <Link href="/">gerador de CNPJ</Link> exportam em CSV e JSON.
      </p>
      <CodeBlock
        language="Python"
        caption="pytest parametrizado: a tabela de casos fica separada da asserção."
        code={PYTHON_TEST}
      />

      <h2>Java</h2>
      <h3>O método estático</h3>
      <p>
        Java tem uma armadilha própria e ela é silenciosa:{" "}
        <code>Character.getNumericValue(&apos;A&apos;)</code> devolve 10, não 17.
        Quem usa esse método achando que ele é o equivalente do{" "}
        <code>ord()</code> escreve um validador que aceita alguns CNPJ
        alfanuméricos errados e rejeita outros corretos, sem nunca lançar
        exceção. A conversão certa é a subtração direta:{" "}
        <code>c - 48</code>, com o <code>char</code> promovido a{" "}
        <code>int</code>.
      </p>
      <CodeBlock
        language="Java"
        caption="Classe final com construtor privado: o compilador impede instanciar um utilitário."
        code={JAVA_CORE}
      />
      <p>
        Duas escolhas de API merecem nota. <code>toUpperCase(Locale.ROOT)</code>{" "}
        é obrigatório: a versão sem argumento usa o locale da JVM, e em locale
        turco a letra <code>i</code> não vira <code>I</code>. E{" "}
        <code>String.matches</code> exige correspondência total da string, ao
        contrário de <code>Matcher.find</code> — é o comportamento que queremos
        aqui, mas é bom saber por que não há <code>^</code> nem <code>$</code>{" "}
        no padrão.
      </p>
      <p>
        Se o validador roda em laço — validando uma planilha de dez mil linhas,
        por exemplo —, troque <code>replaceAll</code> e <code>matches</code> por
        um <code>Pattern</code> estático compilado uma vez. Os métodos de{" "}
        <code>String</code> compilam a expressão a cada chamada, o que em Python
        e em C# já está resolvido pelos objetos de regex criados no nível do
        módulo e da classe. É a diferença mais visível de custo entre as três
        versões, e ela não aparece em nenhum teste unitário.
      </p>
      <h3>Anotação de Bean Validation</h3>
      <p>
        O Hibernate Validator já traz as anotações <code>@CPF</code> e{" "}
        <code>@CNPJ</code> no pacote de restrições brasileiras, e para o formato
        numérico elas resolvem. Antes de confiar nelas para o CNPJ alfanumérico,
        confira o comportamento da versão que está no seu{" "}
        <code>pom.xml</code>. Escrever a sua própria restrição custa dois
        arquivos e deixa a regra sob o seu controle:
      </p>
      <CodeBlock
        language="Java"
        caption="A convenção de Bean Validation é aceitar null e deixar a obrigatoriedade para @NotNull."
        code={JAVA_ANNOTATION}
      />
      <h3>Teste JUnit</h3>
      <p>
        <code>@CsvSource</code> deixa a tabela de casos legível dentro do próprio
        teste. As aspas simples em volta de cada entrada preservam espaços e
        evitam que o parser do JUnit se confunda com o alinhamento — sem elas,
        você acabaria testando strings diferentes das que escreveu.
      </p>
      <CodeBlock
        language="Java"
        caption="O caso do nulo fica em um teste próprio porque @CsvSource não expressa null sem configuração extra."
        code={JAVA_TEST}
      />

      <h2>C#</h2>
      <h3>Método de extensão</h3>
      <p>
        Em C# a forma natural é um método de extensão sobre{" "}
        <code>string?</code>, o que permite escrever{" "}
        <code>documento.IsValidCpf()</code> na regra de negócio. Um detalhe que
        surpreende quem vem de outra linguagem: chamar um método de extensão em
        uma referência nula não lança <code>NullReferenceException</code>, porque
        a chamada é estática e a instância vira apenas o primeiro argumento. Isso
        torna o caso nulo testável sem cerimônia.
      </p>
      <p>
        O outro ponto é o <code>Regex</code>. Em .NET, <code>\d</code> casa
        qualquer dígito decimal Unicode por padrão, não só{" "}
        <code>0-9</code>. Assim como em Python, a correção é escrever a faixa
        explícita.
      </p>
      <CodeBlock
        language="C#"
        caption="Regex estáticos e compilados: instanciar Regex dentro do método a cada chamada é desperdício em rota quente."
        code={CSHARP_CORE}
      />
      <p>
        <code>ToUpperInvariant()</code> cumpre aqui o mesmo papel do{" "}
        <code>Locale.ROOT</code> em Java. Se o processo roda com cultura{" "}
        <code>tr-TR</code>, <code>ToUpper()</code> produz caracteres que a sua
        regex não reconhece, e um CNPJ perfeitamente válido é recusado em
        produção enquanto passa na sua máquina.
      </p>
      <p>
        A partir do .NET 7 dá para substituir os três campos <code>Regex</code>{" "}
        por métodos parciais marcados com <code>[GeneratedRegex]</code>: o
        gerador de código produz o autômato em tempo de compilação, elimina a
        construção em tempo de execução e ainda avisa no build se o padrão
        estiver malformado. A regra de validação não muda; muda só quem paga o
        custo da compilação da expressão.
      </p>
      <h3>DataAnnotations ou FluentValidation</h3>
      <p>
        As duas abordagens convivem. <code>DataAnnotations</code> é o caminho
        mais curto quando o ASP.NET Core já faz o model binding e você só quer o{" "}
        <code>ModelState</code> reprovando o request. FluentValidation tira a
        regra do DTO, o que ajuda quando o mesmo objeto tem regras diferentes por
        operação — cadastro exige o documento, atualização parcial não.
      </p>
      <CodeBlock
        language="C#"
        caption="O atributo delega para a extensão: a regra existe em um lugar só, independentemente de quem a chama."
        code={CSHARP_VALIDATION}
      />
      <h3>Teste xUnit</h3>
      <CodeBlock
        language="C#"
        caption="InlineData aceita null diretamente, o que torna o caso da entrada ausente parte da mesma tabela."
        code={CSHARP_TEST}
      />

      <h2>A mesma tabela de casos de teste nas três linguagens</h2>
      <p>
        Repare que os três testes acima usam exatamente as mesmas entradas. Isso
        não é coincidência: quando um serviço em Java, um worker em Python e um
        gateway em C# validam o mesmo documento, divergência entre eles vira
        incidente. Manter uma tabela canônica de casos — de preferência num
        arquivo compartilhado, versionado fora de cada repositório — é o que
        garante que as três implementações concordem.
      </p>
      <DataTable
        caption="Conjunto mínimo de casos. Todos os números são fictícios."
        headers={["Entrada", "Documento", "Esperado", "O que o caso cobre"]}
        rows={TEST_CASES}
      />
      <p>
        O caso <code>00.000.000/0000-00</code> é o mais instrutivo da lista: é
        o único CNPJ numérico de dígitos repetidos cujos dois verificadores
        fecham o módulo 11 — base zerada, soma zero, resto zero, dígitos{" "}
        <code>00</code>. Um validador que só faz a conta aprova esse CNPJ; só a
        regra extra de sequência repetida o rejeita — e é justamente essa regra
        que costuma ser esquecida quando alguém reescreve o validador{" "}
        &ldquo;mais limpo&rdquo;. Outros deslizes do mesmo tipo estão
        catalogados em{" "}
        <a href="/guias/erros-comuns-validadores-documentos-brasileiros">
          dez erros comuns em validadores
        </a>
        .
      </p>
      <p>
        Acima dessa tabela cabe um teste de propriedade, e as três linguagens têm
        biblioteca para isso — Hypothesis em Python, jqwik em Java, FsCheck em
        C#. A propriedade útil aqui é redonda: para qualquer base gerada
        aleatoriamente, o documento montado com os dígitos calculados pela sua
        função é aceito por ela; e trocar qualquer um dos dois dígitos
        verificadores por outro valor faz a validação falhar. São duas
        propriedades sempre verdadeiras, e verificá-las sobre milhares de bases
        sorteadas encontra erros de peso ou de índice que uma tabela fixa de
        poucas entradas deixa passar.
      </p>

      <h2>Onde validar: borda, serviço ou banco</h2>
      <p>
        Validar na borda — no DTO do controller, com Pydantic, Bean Validation ou
        DataAnnotations — dá a melhor mensagem de erro e falha barato. Mas a
        borda HTTP é só uma das portas. Consumidor de fila, importador de CSV,
        job noturno e script de migração entram pelos fundos e não passam por
        anotação nenhuma. Quem confia só na borda descobre isso quando encontra
        documento inválido gravado em produção.
      </p>
      <p>
        Um cuidado prático para quem valida em mais de um ponto: a normalização
        precisa ser idempotente. Se a borda grava{" "}
        <code>12345678909</code> e o consumidor da fila roda a mesma limpeza de
        novo, o resultado tem de ser idêntico. As três implementações acima
        satisfazem isso porque removem caracteres em vez de reposicionar
        máscara — aplicar a função duas vezes devolve a mesma string.
      </p>
      <p>
        A camada que realmente protege é o domínio, e as três linguagens oferecem
        a mesma ferramenta: um tipo que não pode existir em estado inválido. Em
        Java isso é um <code>record</code> com construtor compacto; em C#, um{" "}
        <code>readonly record struct</code> com a checagem no construtor; em
        Python, o tipo anotado mostrado acima, ou uma{" "}
        <code>@dataclass(frozen=True)</code> com <code>__post_init__</code>. O
        ganho é o mesmo nos três casos: depois da construção, nenhuma função
        precisa revalidar nada.
      </p>
      <CodeBlock
        language="Java"
        caption="O construtor compacto de um record pode reatribuir o parâmetro antes de ele virar campo."
        code={JAVA_RECORD}
      />
      <p>
        No banco fica a última linha de defesa, contra o que entrou por caminhos
        que você não controla. Uma restrição <code>CHECK</code> chamando uma
        função de validação resolve, e as implementações em PostgreSQL, MySQL e
        SQL Server estão em{" "}
        <a href="/guias/validar-cpf-cnpj-sql-postgres-mysql-sqlserver">
          validar CPF e CNPJ no banco de dados
        </a>
        . Uma regra acompanha todas as camadas: grave o documento normalizado,
        só os caracteres, em coluna de texto de tamanho fixo. Máscara é
        apresentação e se aplica na saída, como no método{" "}
        <code>formatado()</code> acima.
      </p>

      <h2>O CNPJ alfanumérico nas três linguagens</h2>
      <p>
        Desde julho de 2026 as novas inscrições no CNPJ podem sair no formato
        alfanumérico, com letras nas doze posições da base e os dois dígitos
        verificadores ainda numéricos. O detalhamento do formato está no guia do{" "}
        <a href="/guias/cnpj-alfanumerico-2026">CNPJ alfanumérico</a>; o que
        interessa aqui é que cada linguagem tropeça em um ponto diferente ao
        absorver a mudança.
      </p>
      <p>
        Em Python, o tropeço é a exceção mascarada. Um validador antigo escrito
        com <code>int(c)</code> levanta <code>ValueError</code> na primeira letra;
        se essa chamada estiver dentro de um <code>try/except Exception: return
        False</code> — padrão comum em validadores defensivos —, todo CNPJ
        alfanumérico passa a ser reportado como inválido, sem log e sem stack
        trace. O sintoma chega como reclamação de usuário, não como erro no
        monitoramento.
      </p>
      <p>
        Em Java, o tropeço é o resultado errado sem erro nenhum. Como{" "}
        <code>Character.getNumericValue</code> atribui 10 a <code>A</code>, 11 a{" "}
        <code>B</code> e assim por diante, a soma fecha em um número plausível e
        o método devolve <code>true</code> ou <code>false</code> com a mesma
        confiança de sempre. É o pior tipo de defeito: determinístico, silencioso
        e só detectável comparando com o exemplo oficial.
      </p>
      <p>
        Em C#, o tropeço costuma estar antes da validação, na tipagem. Código
        legado que recebe o documento como <code>long</code> ou{" "}
        <code>decimal</code> — ou que chama <code>long.Parse</code> para
        &ldquo;limpar&rdquo; a entrada — quebra com uma exceção de formato antes
        de qualquer regra rodar. Converter o campo para <code>string</code> em
        todo o caminho, do DTO ao repositório, é pré-requisito para o resto
        funcionar.
      </p>
      <p>
        Há ainda um erro comum às três: aceitar a base com letras e esquecer que
        os DVs continuam numéricos. Uma regex de <code>[0-9A-Z]{"{14}"}</code>{" "}
        aprova <code>12.ABC.345/01DE-3X</code>, que não é um CNPJ. O padrão certo
        separa as duas partes, como nas implementações acima:{" "}
        <code>[0-9A-Z]{"{12}"}[0-9]{"{2}"}</code>. Para conferir o seu validador
        contra entradas nos dois formatos, o{" "}
        <Link href="/">gerador de CNPJ</Link> produz lotes numéricos e alfanuméricos
        com os dígitos calculados pela mesma regra usada neste guia.
      </p>
    </ArticleLayout>
  );
}
