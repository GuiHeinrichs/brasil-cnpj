import { ShieldCheckIcon } from "lucide-react";
import Link from "next/link";

import type { ToolId } from "@/lib/tools";

/**
 * Aviso curto exibido logo abaixo do H1 de cada ferramenta: deixa explícito,
 * acima da dobra, que os dados são fictícios e para uso em testes.
 *
 * Cada ferramenta tem o seu texto escrito à mão, e não uma frase-molde com o
 * substantivo trocado. Isso evita dois defeitos: erro de concordância e, pior,
 * afirmar que documentos sem dígito verificador (placa, CEP, nome, username)
 * têm "dígitos verificadores corretos" — o que a própria página desmente
 * poucos parágrafos abaixo.
 */
const NOTICES: Record<ToolId, React.ReactNode> = {
  cnpj: (
    <>
      Os CNPJs gerados aqui são <Strong>fictícios</Strong>. Os dígitos
      verificadores estão corretos, então eles passam em qualquer validador, mas
      nenhum deles corresponde a empresa inscrita na Receita Federal.
    </>
  ),
  cpf: (
    <>
      Os CPFs gerados aqui são <Strong>fictícios</Strong>. Os dígitos
      verificadores estão corretos, então eles passam em qualquer validador, mas
      nenhum deles pertence a uma pessoa nem consta no cadastro da Receita
      Federal.
    </>
  ),
  cnh: (
    <>
      Os registros de CNH gerados aqui são <Strong>fictícios</Strong>. Os dois
      dígitos verificadores estão corretos, mas nenhum deles corresponde a
      condutor habilitado no SENATRAN ou em DETRAN algum.
    </>
  ),
  titulo: (
    <>
      Os títulos de eleitor gerados aqui são <Strong>fictícios</Strong>. O
      código de estado e os dois dígitos verificadores são consistentes, mas
      nenhum deles consta no cadastro eleitoral do TSE.
    </>
  ),
  pis: (
    <>
      Os números de PIS gerados aqui são <Strong>fictícios</Strong>. O dígito
      verificador está correto, mas nenhum deles está atribuído a um trabalhador
      no CNIS.
    </>
  ),
  rg: (
    <>
      Os RGs gerados aqui são <Strong>fictícios</Strong>, no padrão da SSP de
      São Paulo. O dígito verificador está correto, mas nenhum deles consta em
      Secretaria de Segurança Pública alguma.
    </>
  ),
  renavam: (
    <>
      Os códigos RENAVAM gerados aqui são <Strong>fictícios</Strong>. O dígito
      verificador está correto, mas nenhum deles corresponde a veículo
      registrado.
    </>
  ),
  placa: (
    <>
      As placas geradas aqui são <Strong>fictícias</Strong>. Elas seguem o
      formato Mercosul ou o antigo, mas a placa não tem dígito verificador e
      nenhuma combinação daqui corresponde a veículo emplacado.
    </>
  ),
  cep: (
    <>
      Os CEPs gerados aqui são <Strong>fictícios</Strong>. Eles caem dentro da
      faixa oficial do estado escolhido, mas o CEP não tem dígito verificador e
      o número sorteado pode não existir como logradouro.
    </>
  ),
  pessoas: (
    <>
      As fichas geradas aqui são <Strong>fictícias</Strong>. Os documentos têm
      dígitos verificadores corretos e os campos são coerentes entre si, mas a
      ficha inteira é sorteada e não descreve nenhuma pessoa real.
    </>
  ),
  empresas: (
    <>
      As fichas de empresa geradas aqui são <Strong>fictícias</Strong>. O CNPJ
      tem dígitos verificadores corretos e o endereço é coerente com o estado,
      mas nenhuma delas está inscrita na Receita Federal.
    </>
  ),
  nomes: (
    <>
      Os nomes gerados aqui são <Strong>fictícios</Strong>: prenomes e
      sobrenomes brasileiros combinados ao acaso, para popular ambientes de
      teste. Não há consulta a cadastro nenhum e um nome isolado não identifica
      ninguém.
    </>
  ),
  nicks: (
    <>
      Os usernames gerados aqui são <Strong>fictícios</Strong>, feitos para
      popular cadastros de teste. A ferramenta não verifica disponibilidade em
      plataforma alguma.
    </>
  ),
};

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>;
}

export function TestDataNotice({ tool }: { tool: ToolId }) {
  return (
    <p
      role="note"
      className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"
    >
      <ShieldCheckIcon aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gold" />
      <span>
        {NOTICES[tool]} Use apenas em desenvolvimento, homologação e
        demonstração.{" "}
        <Link
          href="/termos#uso-permitido"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Uso permitido e proibido
        </Link>
        .
      </span>
    </p>
  );
}
