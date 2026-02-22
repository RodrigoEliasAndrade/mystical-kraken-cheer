export interface WisdomEntry {
  day: number;
  category: "FÉ" | "COMUNICAÇÃO" | "INTIMIDADE" | "FAMÍLIA" | "DESAFIOS" | "RENOVAÇÃO" | "MISSÃO";
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
    reflection: "Assim como o corpo precisa de ar, o sacramento do matrimônio precisa do diálogo com o Criador para se manter vivo e vibrante.",
    challenge: "Hoje, ao rezarem, segurem as mãos um do outro durante todo o tempo."
  },
  {
    day: 2,
    category: "COMUNICAÇÃO",
    quote: "O diálogo é a ponte que une dois mundos diferentes.",
    author: "Anônimo",
    reflection: "Escutar é um ato de amor mais profundo do que falar. No silêncio da escuta, o outro se sente verdadeiramente acolhido.",
    challenge: "Durante a partilha, ouça sem interromper e agradeça ao final."
  },
  {
    day: 3,
    category: "INTIMIDADE",
    quote: "A maior intimidade não é a física, mas a espiritual.",
    author: "São João Paulo II",
    reflection: "Quando um casal reza junto, eles se tornam um só coração diante de Deus, revelando suas almas um ao outro.",
    challenge: "Digam um ao outro uma virtude que admiram no cônjuge."
  },
  // Adicionando mais entradas simuladas para completar o ciclo inicial
  ...Array.from({ length: 47 }, (_, i) => ({
    day: i + 4,
    category: "RENOVAÇÃO" as const,
    quote: "O amor se renova no perdão diário.",
    author: "Papa Francisco",
    reflection: "Não deixem o sol se pôr sobre a vossa ira. O perdão é o tempero da santidade no lar.",
    challenge: "Peçam perdão por uma pequena falha de hoje."
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