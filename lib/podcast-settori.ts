/**
 * Settore di ogni marchio raccontato nel podcast.
 *
 * Il feed RSS non porta questa informazione: la mappa è compilata a mano da
 * conoscenza generale e va verificata. La chiave è il nome del marchio così
 * come esce da `brandLabel()`, cioè come si legge sulle copertine.
 *
 * Le categorie sono le stesse dell'archivio YouTube (lib/episodes.ts), così i
 * due archivi parlano la stessa lingua — con un'aggiunta: "Sport & Outdoor".
 * Su YouTube lo sport sta sotto "Giochi & Intrattenimento", ma qui i marchi di
 * montagna e attrezzatura sono una dozzina e finirebbero sepolti.
 *
 * Chi non è in mappa non sparisce: resta visibile sotto "Tutti" e non compare
 * quando si filtra per settore. Fuori sono rimasti di proposito i marchi che
 * non sono aziende (SCELTE, SPECIALE, STORIE DI BRAND, DONNE DI GLORIA,
 * AVVENTURIERI 2.0) e i due casi che nessuna categoria descrive davvero: WWF e
 * TREEDOM, che sono ambiente e non profit.
 */
export const SETTORI: Record<string, string> = {
  // --- Moda & Lusso ---
  ARMANI: "Moda & Lusso",
  DIOR: "Moda & Lusso",
  "YVES SAINT LAURENT": "Moda & Lusso",
  GUCCI: "Moda & Lusso",
  CHANEL: "Moda & Lusso",
  "LOUIS VUITTON": "Moda & Lusso",
  LACOSTE: "Moda & Lusso",
  LEVIS: "Moda & Lusso",
  SUPERGA: "Moda & Lusso",
  "AIR JORDAN": "Moda & Lusso",
  NIKE: "Moda & Lusso",
  PUMA: "Moda & Lusso",
  "ADIDAS VS PUMA": "Moda & Lusso",
  "NEW BALANCE": "Moda & Lusso",
  KAPPA: "Moda & Lusso",

  // --- Bellezza & Salute ---
  NIVEA: "Bellezza & Salute",
  "L'ERBOLARIO": "Bellezza & Salute",
  ASPIRINA: "Bellezza & Salute",

  // --- Cibo & Bevande ---
  KFC: "Cibo & Bevande",
  "MCDONALD'S": "Cibo & Bevande",
  STARBUCKS: "Cibo & Bevande",
  "COCA-COLA": "Cibo & Bevande",
  PEPSI: "Cibo & Bevande",
  FANTA: "Cibo & Bevande",
  SCHWEPPES: "Cibo & Bevande",
  "RED BULL": "Cibo & Bevande",
  GATORADE: "Cibo & Bevande",
  GUINNESS: "Cibo & Bevande",
  "GUIDO BERLUCCHI": "Cibo & Bevande",
  "JACK DANIEL'S": "Cibo & Bevande",
  ALGIDA: "Cibo & Bevande",
  FERRERO: "Cibo & Bevande",
  PERUGINA: "Cibo & Bevande",
  MELEGATTI: "Cibo & Bevande",
  "BISCOTTI GENTILINI": "Cibo & Bevande",
  "KELLOGG'S": "Cibo & Bevande",
  MARS: "Cibo & Bevande",

  // --- Tecnologia ---
  APPLE: "Tecnologia",
  GOOGLE: "Tecnologia",
  NOKIA: "Tecnologia",
  BLACKBERRY: "Tecnologia",
  TELEGRAM: "Tecnologia",
  WHATSAPP: "Tecnologia",
  TWITTER: "Tecnologia",
  INSTAGRAM: "Tecnologia",
  YOUTUBE: "Tecnologia",
  SPOTIFY: "Tecnologia",
  NETFLIX: "Tecnologia",
  WIKIPEDIA: "Tecnologia",
  ZOOM: "Tecnologia",
  TINDER: "Tecnologia",
  UBER: "Tecnologia",
  "AIR BNB": "Tecnologia",
  POLAROID: "Tecnologia",
  KODAK: "Tecnologia",
  "GO PRO": "Tecnologia",
  OLIVETTI: "Tecnologia",
  HOOVER: "Tecnologia",

  // --- Casa & Design ---
  IKEA: "Casa & Design",
  TUPPERWARE: "Casa & Design",
  BIALETTI: "Casa & Design",

  // --- Motori & Trasporti ---
  LANCIA: "Motori & Trasporti",
  FIAT: "Motori & Trasporti",
  FERRARI: "Motori & Trasporti",
  MASERATI: "Motori & Trasporti",
  LAMBORGHINI: "Motori & Trasporti",
  MINI: "Motori & Trasporti",
  "BMW MOTORRAD": "Motori & Trasporti",
  "HARLEY-DAVIDSON": "Motori & Trasporti",
  YAMAHA: "Motori & Trasporti",
  DELOREAN: "Motori & Trasporti",
  RYANAIR: "Motori & Trasporti",

  // --- Giochi & Intrattenimento ---
  TETRIS: "Giochi & Intrattenimento",
  POKÉMON: "Giochi & Intrattenimento",
  NINTENDO: "Giochi & Intrattenimento",
  LEGO: "Giochi & Intrattenimento",
  BARBIE: "Giochi & Intrattenimento",
  MONOPOLY: "Giochi & Intrattenimento",
  MARVEL: "Giochi & Intrattenimento",
  "DC COMICS": "Giochi & Intrattenimento",
  "WARNER BROS.": "Giochi & Intrattenimento",
  "LOONEY TUNES": "Giochi & Intrattenimento",
  "HARRY POTTER": "Giochi & Intrattenimento",
  "WALT DISNEY": "Giochi & Intrattenimento",
  PIXAR: "Giochi & Intrattenimento",
  PLAYBOY: "Giochi & Intrattenimento",
  BLOCKBUSTER: "Giochi & Intrattenimento",

  // --- Media & Retail ---
  MEDIAWORLD: "Media & Retail",
  "POST-IT": "Media & Retail",
  STABILO: "Media & Retail",
  BIC: "Media & Retail",
  "LONELY PLANET": "Media & Retail",
  "GUINNESS WORLD RECORD": "Media & Retail",

  // --- Sport & Outdoor ---
  SALEWA: "Sport & Outdoor",
  FERRINO: "Sport & Outdoor",
  GARMONT: "Sport & Outdoor",
  SCARPA: "Sport & Outdoor",
  DOLOMITE: "Sport & Outdoor",
  "LA SPORTIVA": "Sport & Outdoor",
  COLMAR: "Sport & Outdoor",
  "K-WAY": "Sport & Outdoor",
  "THE NORTH FACE": "Sport & Outdoor",
  "DOLOMITI SUPERSKI": "Sport & Outdoor",
  PATAGONIA: "Sport & Outdoor",
  HEAD: "Sport & Outdoor",
  "SPECIALE MONTAGNA": "Sport & Outdoor",
};

/** Ordine con cui i settori compaiono nella tendina. */
export const ORDINE_SETTORI = [
  "Moda & Lusso",
  "Bellezza & Salute",
  "Cibo & Bevande",
  "Tecnologia",
  "Casa & Design",
  "Motori & Trasporti",
  "Giochi & Intrattenimento",
  "Media & Retail",
  "Sport & Outdoor",
];

/**
 * Anno di fondazione dei marchi che non stanno nella timeline.
 *
 * Gli anni della timeline (public/brand-timeline.json) coprono 101 marchi, ma
 * il podcast ne racconta di più. Questi sono i mancanti, compilati a mano come
 * i settori qui sopra: **da verificare**. Chi non è nemmeno qui resta fuori dal
 * filtro per epoca, non dall'archivio.
 */
export const ANNI_MANCANTI: Record<string, number> = {
  LANCIA: 1906,
  HOOVER: 1908,
  PATAGONIA: 1973,
  "LONELY PLANET": 1973,
  WWF: 1961,
  "GUINNESS WORLD RECORD": 1955,
  TREEDOM: 2010,
  MEDIAWORLD: 1991,
  "BISCOTTI GENTILINI": 1890,
};

/**
 * Marchi che nella timeline hanno un nome diverso da quello sulle copertine.
 */
export const ALIAS_TIMELINE: Record<string, string> = {
  "WALT DISNEY": "Disney",
};

// Periodi storici, gli stessi dell'archivio YouTube.
const EPOCHE = [
  { label: "Le origini (prima del 1900)", max: 1900 },
  { label: "Primo Novecento (1900–1949)", max: 1950 },
  { label: "Secondo dopoguerra (1950–1979)", max: 1980 },
  { label: "Anni '80 e '90", max: 2000 },
  { label: "Anni 2000", max: Infinity },
];

export const ORDINE_EPOCHE = EPOCHE.map((e) => e.label);

/** Anno di fondazione → periodo storico. */
export function epocaDaAnno(anno: number): string {
  return (EPOCHE.find((e) => anno < e.max) ?? EPOCHE[EPOCHE.length - 1]).label;
}
