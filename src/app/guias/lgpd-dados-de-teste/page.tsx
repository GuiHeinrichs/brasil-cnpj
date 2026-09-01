import type { Metadata } from "next";

import { ArticleLayout, guideMetadata } from "@/components/guias/article-layout";
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
        hábito que a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> veio
        desencorajar. Este guia explica o risco e como massa de dados fictícia
        resolve o problema sem quebrar as validações do sistema.
      </p>
      <p>
        <em>
          Este texto é informativo e não substitui aconselhamento jurídico. Para
          decisões concretas sobre conformidade, consulte o time jurídico ou o
          encarregado de dados (DPO) da sua organização.
        </em>
      </p>

      <h2>Por que dado real em ambiente de teste é um problema</h2>
      <p>
        CPF, nome, endereço, telefone e e-mail são <strong>dados pessoais</strong>{" "}
        segundo a LGPD — informações que identificam uma pessoa. Tratá-los (o que
        inclui copiar, armazenar e usar) exige uma base legal e obedece a
        princípios como <strong>finalidade</strong> (usar o dado só para o que foi
        coletado), <strong>minimização</strong> (usar o mínimo necessário) e{" "}
        <strong>segurança</strong>. Reaproveitar dados de clientes para testar
        software normalmente não se encaixa na finalidade original da coleta e vai
        contra a minimização.
      </p>
      <p>
        Some a isso o fato de que ambientes de desenvolvimento e teste quase sempre
        têm <strong>controles mais fracos</strong> que a produção: mais pessoas com
        acesso (incluindo terceiros e prestadores), senhas compartilhadas, logs
        verbosos, dumps de banco circulando por e-mail e{" "}
        <em>fixtures</em> versionadas no repositório. Cada uma dessas superfícies é
        uma chance a mais de vazamento — e um vazamento de dado real tem
        consequências reais para as pessoas envolvidas e para a empresa.
      </p>

      <h2>Por que &quot;inventar&quot; números não funciona</h2>
      <p>
        A saída óbvia seria digitar qualquer coisa, mas os próprios sistemas
        impedem isso. Preencher um campo de CPF com <code>000.000.000-00</code> ou
        com um número digitado ao acaso quase sempre falha na validação de dígito
        verificador. Já usar <code>Teste Teste</code> como nome esconde bugs que só
        aparecem com nomes reais — acentos, nomes compostos, sobrenomes longos. O
        desenvolvedor precisa de dados que <strong>pareçam e se comportem como
        reais</strong>, passando nas validações, sem <strong>serem</strong> de
        ninguém.
      </p>

      <h2>Dados sintéticos: o meio-termo certo</h2>
      <p>
        A resposta é a <strong>massa de dados sintética</strong>: documentos e
        fichas gerados artificialmente, com dígitos verificadores matematicamente
        válidos, mas que não correspondem a nenhuma pessoa ou empresa registrada.
        Um CPF gerado assim passa em qualquer validador de módulo 11, um CNPJ passa
        na conferência do DV, e um endereço fictício tem CEP dentro da faixa
        correta do estado — só que nada disso pertence a um indivíduo real. Como o
        dado não é pessoal, ele fica fora do alcance da LGPD, e você pode usá-lo à
        vontade em qualquer ambiente.
      </p>
      <p>
        Vale distinguir de <strong>anonimização</strong>. Anonimizar é transformar
        um dado real de modo que a pessoa não possa mais ser identificada — o que é
        difícil de fazer bem e, se malfeito, ainda permite reidentificação. Dado
        sintético evita o problema pela raiz: ele nunca foi de ninguém, então não
        há o que reidentificar.
      </p>

      <h2>Boas práticas no dia a dia</h2>
      <ul>
        <li>
          <strong>Nunca versione dado real</strong> em <em>seeds</em> ou{" "}
          <em>fixtures</em>. Uma vez no histórico do Git, ele é difícil de remover.
        </li>
        <li>
          Gere massa fictícia coerente para popular ambientes de desenvolvimento e
          homologação — com documentos válidos e campos que combinam entre si
          (CPF do estado certo, CEP na faixa da UF).
        </li>
        <li>
          Se precisar reproduzir um bug com base em dados de produção, prefira{" "}
          <strong>mascarar ou substituir</strong> os campos pessoais antes de levar
          o caso para outro ambiente.
        </li>
        <li>
          Trate demonstrações e capturas de tela como ambiente público: use dados
          fictícios para não expor clientes em apresentações e materiais.
        </li>
      </ul>
      <p>
        É essa a proposta do bateCarimbo: gerar documentos e fichas completas de
        pessoas e empresas fictícias, com dados válidos e coerentes por estado,
        para que você teste seus sistemas sem nunca precisar tocar em informação de
        gente de verdade.
      </p>
    </ArticleLayout>
  );
}
