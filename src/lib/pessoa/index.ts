import { generateCep } from "@/lib/cep";
import { generateCpf } from "@/lib/cpf";
import {
  buildAddress,
  buildBirthDate,
  buildEmail,
  buildFullName,
  buildMobilePhone,
  clampCount,
  firstNameFor,
  pick,
  randomUf,
  UF_TO_REGION_DIGIT,
} from "@/lib/dados";
import type { Address, Gender, GeneratedRecord } from "@/lib/dados";
import { generateRg } from "@/lib/rg";

export const MAX_BATCH_SIZE = 25;

export type PessoaSexo = Gender | "random";

export type Pessoa = {
  nome: string;
  sexo: Gender;
  dataNascimento: string;
  idade: number;
  cpf: string;
  rg: string;
  nomeMae: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: Address;
};

export type GeneratePessoaOptions = {
  count?: number;
  uf?: string;
  sexo?: PessoaSexo;
};

function generateOne(uf: string | undefined, sexo: PessoaSexo): Pessoa {
  const resolvedSexo: Gender = sexo === "random" ? pick(["M", "F"]) : sexo;
  const { first, surnames, full } = buildFullName(resolvedSexo);
  const resolvedUf = uf ?? randomUf();
  const regionDigit = UF_TO_REGION_DIGIT[resolvedUf];

  const { date, age } = buildBirthDate(18, 80);
  const motherFirst = firstNameFor("F");

  return {
    nome: full,
    sexo: resolvedSexo,
    dataNascimento: date,
    idade: age,
    cpf: generateCpf({ count: 1, formatted: true, regionDigit })[0],
    rg: generateRg({ count: 1, formatted: true })[0],
    nomeMae: [motherFirst, ...surnames].join(" "),
    email: buildEmail(first, surnames),
    telefone: buildMobilePhone(resolvedUf),
    cep: generateCep({ count: 1, formatted: true, uf: resolvedUf })[0],
    endereco: buildAddress(resolvedUf),
  };
}

export function generatePessoa(options: GeneratePessoaOptions = {}): Pessoa[] {
  const { count = 1, uf, sexo = "random" } = options;
  const total = clampCount(count, MAX_BATCH_SIZE);
  return Array.from({ length: total }, () => generateOne(uf, sexo));
}

export function pessoaToRecord(pessoa: Pessoa): GeneratedRecord {
  const { endereco } = pessoa;
  return {
    title: pessoa.nome,
    subtitle: `${pessoa.idade} anos · ${endereco.cidade}/${endereco.uf}`,
    fields: [
      { label: "CPF", value: pessoa.cpf, mono: true },
      { label: "RG", value: pessoa.rg, mono: true },
      { label: "Nascimento", value: pessoa.dataNascimento },
      { label: "Sexo", value: pessoa.sexo === "M" ? "Masculino" : "Feminino" },
      { label: "Nome da mãe", value: pessoa.nomeMae },
      { label: "E-mail", value: pessoa.email, mono: true },
      { label: "Celular", value: pessoa.telefone, mono: true },
      { label: "CEP", value: pessoa.cep, mono: true },
      {
        label: "Endereço",
        value: `${endereco.logradouro}, ${endereco.numero} — ${endereco.bairro}`,
      },
      { label: "Cidade/UF", value: `${endereco.cidade}/${endereco.uf}` },
    ],
  };
}
