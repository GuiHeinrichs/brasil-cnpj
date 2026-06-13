/** Listas de dados fictícios brasileiros usadas pelos geradores. */

export const FIRST_NAMES_M = [
  "Miguel", "Arthur", "Heitor", "Bernardo", "Davi", "Theo", "Gabriel", "Pedro",
  "Lucas", "Matheus", "Rafael", "Enzo", "Guilherme", "Nicolas", "Lorenzo",
  "Gustavo", "Felipe", "Daniel", "João", "Bruno", "Eduardo", "Henrique",
  "Murilo", "Vinícius", "Caio", "Leonardo", "Thiago", "André", "Rodrigo",
  "Fernando", "Marcelo", "Ricardo", "Paulo", "Carlos", "Marcos", "Antônio",
  "José", "Francisco", "Luiz", "Roberto", "Sérgio", "Fábio", "Diego",
  "Alexandre", "Vitor", "Otávio", "Igor", "Samuel", "Benjamin", "Renato",
] as const;

export const FIRST_NAMES_F = [
  "Maria", "Ana", "Alice", "Laura", "Sophia", "Helena", "Valentina", "Júlia",
  "Heloísa", "Luiza", "Manuela", "Beatriz", "Cecília", "Lara", "Isabella",
  "Mariana", "Lívia", "Giovanna", "Camila", "Larissa", "Letícia", "Fernanda",
  "Gabriela", "Amanda", "Carolina", "Bruna", "Patrícia", "Juliana", "Vanessa",
  "Aline", "Débora", "Tatiane", "Bianca", "Rafaela", "Sabrina", "Carla",
  "Daniela", "Adriana", "Cláudia", "Sandra", "Simone", "Renata", "Priscila",
  "Vitória", "Yasmin", "Clara", "Eduarda", "Isadora", "Marina", "Natália",
] as const;

export const SURNAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Lima", "Pereira", "Ferreira",
  "Costa", "Rodrigues", "Almeida", "Nascimento", "Carvalho", "Araújo",
  "Ribeiro", "Gomes", "Martins", "Rocha", "Barbosa", "Alves", "Melo",
  "Mendes", "Cardoso", "Teixeira", "Moreira", "Correia", "Cavalcanti", "Dias",
  "Castro", "Campos", "Pinto", "Moraes", "Freitas", "Vieira", "Monteiro",
  "Cunha", "Azevedo", "Borges", "Macedo", "Fernandes", "Lopes", "Marques",
  "Nunes", "Ramos", "Reis", "Andrade", "Batista", "Duarte", "Fonseca",
  "Guimarães", "Machado", "Nogueira", "Pacheco", "Tavares", "Brito", "Camargo",
] as const;

export const STREET_TYPES = [
  "Rua", "Avenida", "Travessa", "Alameda", "Praça", "Rodovia", "Estrada",
  "Largo",
] as const;

export const STREET_NAMES = [
  "das Flores", "Brasil", "Sete de Setembro", "Quinze de Novembro",
  "Tiradentes", "Getúlio Vargas", "Santos Dumont", "São João", "Dom Pedro II",
  "Marechal Deodoro", "Rui Barbosa", "Floriano Peixoto", "Barão do Rio Branco",
  "Duque de Caxias", "Sete de Abril", "Conceição", "do Comércio", "São Pedro",
  "Bento Gonçalves", "Independência", "das Acácias", "dos Andradas",
  "Padre Anchieta", "Castro Alves", "Visconde de Mauá",
] as const;

export const NEIGHBORHOODS = [
  "Centro", "Jardim América", "Vila Nova", "São José", "Boa Vista",
  "Industrial", "Santa Mônica", "Jardim das Flores", "Bela Vista",
  "Parque das Águas", "Cidade Nova", "Santo Antônio", "São Cristóvão",
  "Vila Maria", "Jardim Europa", "Alto da Boa Vista", "Cidade Jardim",
  "Nova Esperança", "Vila Operária", "Parque Industrial",
] as const;

export const EMAIL_DOMAINS = [
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br", "icloud.com",
  "bol.com.br", "uol.com.br", "terra.com.br",
] as const;

/** Cidades por UF (capital + principais), para coerência com o CEP. */
export const CITIES_BY_UF: Record<string, readonly string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul"],
  AL: ["Maceió", "Arapiraca"],
  AM: ["Manaus", "Parintins", "Itacoatiara"],
  AP: ["Macapá", "Santana"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Camaçari"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte"],
  DF: ["Brasília", "Ceilândia", "Taguatinga"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
  MA: ["São Luís", "Imperatriz", "Caxias"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis"],
  PA: ["Belém", "Ananindeua", "Santarém"],
  PB: ["João Pessoa", "Campina Grande"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru"],
  PI: ["Teresina", "Parnaíba"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa"],
  RJ: ["Rio de Janeiro", "São Gonçalo", "Niterói", "Duque de Caxias"],
  RN: ["Natal", "Mossoró", "Parnamirim"],
  RO: ["Porto Velho", "Ji-Paraná"],
  RR: ["Boa Vista"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "Chapecó"],
  SE: ["Aracaju", "Nossa Senhora do Socorro"],
  SP: ["São Paulo", "Campinas", "Guarulhos", "Santos", "Ribeirão Preto"],
  TO: ["Palmas", "Araguaína"],
};

/** Códigos de DDD válidos por UF (lista representativa). */
export const DDD_BY_UF: Record<string, readonly number[]> = {
  AC: [68], AL: [82], AM: [92, 97], AP: [96],
  BA: [71, 73, 74, 75, 77], CE: [85, 88], DF: [61], ES: [27, 28],
  GO: [62, 64], MA: [98, 99], MG: [31, 32, 33, 34, 35, 37, 38], MS: [67],
  MT: [65, 66], PA: [91, 93, 94], PB: [83], PE: [81, 87], PI: [86, 89],
  PR: [41, 42, 43, 44, 45, 46], RJ: [21, 22, 24], RN: [84], RO: [69],
  RR: [95], RS: [51, 53, 54, 55], SC: [47, 48, 49], SE: [79],
  SP: [11, 12, 13, 14, 15, 16, 17, 18, 19], TO: [63],
};

/** UF → 9º dígito do CPF (Região Fiscal da Receita Federal). */
export const UF_TO_REGION_DIGIT: Record<string, string> = {
  DF: "1", GO: "1", MS: "1", MT: "1", TO: "1",
  AC: "2", AM: "2", AP: "2", PA: "2", RO: "2", RR: "2",
  CE: "3", MA: "3", PI: "3",
  AL: "4", PB: "4", PE: "4", RN: "4",
  BA: "5", SE: "5",
  MG: "6",
  ES: "7", RJ: "7",
  SP: "8",
  PR: "9", SC: "9",
  RS: "0",
};

export const COMPANY_SECTORS = [
  "Comércio", "Indústria", "Serviços", "Tecnologia", "Construções",
  "Transportes", "Engenharia", "Consultoria", "Logística", "Alimentos",
  "Distribuidora", "Soluções", "Sistemas", "Representações", "Participações",
  "Empreendimentos", "Materiais", "Equipamentos",
] as const;

export const COMPANY_LEGAL_TYPES = [
  { suffix: "LTDA", nature: "Sociedade Empresária Limitada" },
  { suffix: "ME", nature: "Microempresa" },
  { suffix: "EIRELI", nature: "Empresa Individual de Resp. Limitada" },
  { suffix: "S.A.", nature: "Sociedade Anônima" },
  { suffix: "EPP", nature: "Empresa de Pequeno Porte" },
] as const;

export const FANTASY_PREFIXES = [
  "Prime", "Nova", "Top", "Mega", "Smart", "Grupo", "Inova", "Forte", "Brasil",
  "Real", "Master", "Alpha", "Vita", "Eco", "Tech", "Bel", "Global", "Único",
] as const;

export const FANTASY_SUFFIXES = [
  "Center", "Express", "Soluções", "Tech", "Group", "Store", "Lab", "Hub",
  "Brasil", "Mais", "Care", "Place", "Line", "Print", "Net", "Fácil",
] as const;

export const NICK_ADJECTIVES = [
  "Dark", "Mega", "Ultra", "Pro", "Cyber", "Neon", "Turbo", "Shadow", "Ghost",
  "Royal", "Epic", "Wild", "Toxic", "Frozen", "Crazy", "Silent", "Rapid",
  "Savage", "Noble", "Mystic", "Lunar", "Solar", "Iron", "Golden", "Crimson",
] as const;

export const NICK_NOUNS = [
  "Wolf", "Dragon", "Phoenix", "Ninja", "Tiger", "Falcon", "Viper", "Hunter",
  "Knight", "Raven", "Storm", "Blade", "Fox", "Lion", "Sniper", "Reaper",
  "Titan", "Hawk", "Panther", "Cobra", "Demon", "Samurai", "Warrior", "Ranger",
  "Pixel",
] as const;
