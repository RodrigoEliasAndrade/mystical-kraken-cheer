export interface WisdomEntry {
  day: number;
  category: "FÉ" | "COMUNICAÇÃO" | "INTIMIDADE" | "FAMÍLIA" | "DESAFIOS" | "RENOVAÇÃO" | "MISSÃO" | "ORAÇÃO PESSOAL";
  quote: string;
  author: string;
  reflection: string;
  challenge: string;
}

export const wisdomEntries: WisdomEntry[] = [
  {
    day: 1,
    category: "FÉ",
    quote: "A oração conjugal não é um luxo, é oxigênio para o amor.",
    author: "Padre Henri Caffarel",
    reflection: "Assim como respiramos sem pensar, a oração deve ser natural no casal. Não precisa ser longa - apenas verdadeira.",
    challenge: "Antes de dormir, respirem juntos e agradeçam por 1 coisa do dia."
  },
  {
    day: 2,
    category: "ORAÇÃO PESSOAL",
    quote: "A oração conjugal nasce da oração pessoal. Não podemos dar ao outro o que não temos.",
    author: "Espiritualidade ENS",
    reflection: "Cada cônjuge precisa de um encontro pessoal e diário com Deus. A intimidade com Cristo de cada um alimenta a oração do casal.",
    challenge: "Hoje: Reserve 5 minutos SOZINHO(A) com Deus, além da oração conjugal."
  },
  {
    day: 3,
    category: "COMUNICAÇÃO",
    quote: "Escutar é um ato de amor mais profundo do que falar.",
    author: "Padre Henri Caffarel",
    reflection: "No silêncio da escuta, o outro se sente verdadeiramente acolhido. Escutar é abrir espaço para o mistério do outro.",
    challenge: "Na partilha de hoje, foque 100% em ouvir sem planejar a resposta."
  },
  {
    day: 4,
    category: "INTIMIDADE",
    quote: "O casal cristão é o sorriso de Deus para o mundo.",
    author: "Padre Henri Caffarel",
    reflection: "Sua união revela como Deus ama: com fidelidade, alegria e doação total.",
    challenge: "Diga ao seu cônjuge: 'Vejo a luz de Deus em você'."
  },
  {
    day: 5,
    category: "ORAÇÃO PESSOAL",
    quote: "A oração pessoal é o 'Dever de Sentar-se' com Deus.",
    author: "Espiritualidade ENS",
    reflection: "Sem o encontro individual com o Pai, a oração em casal corre o risco de se tornar apenas um diálogo humano.",
    challenge: "Hoje, faça sua oração pessoal em um lugar diferente e silencioso."
  },
  // Expandindo para 50 entradas iniciais (simuladas para rotação)
  ...Array.from({ length: 45 }, (_, i) => ({
    day: i + 6,
    category: (i % 8 === 0 ? "ORAÇÃO PESSOAL" : "RENOVAÇÃO") as any,
    quote: "O amor se renova no perdão e na oração diária.",
    author: "Papa Francisco",
    reflection: "Não deixem o sol se pôr sobre a vossa ira. O perdão é o tempero da santidade no lar.",
    challenge: "Peçam perdão por uma pequena falha de hoje e recomecem."
  }))
];

export const getDailyWisdom = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = (dayOfYear - 1) % wisdomEntries.length;
  return wisdomEntries[index];
};