/**
 * I quiz di Brandy. Uno a caso a ogni visita.
 *
 * Ogni quiz è ricavato da una puntata reale del catalogo: `episodio` è
 * l'identificativo Megaphone (lo stesso di public/brandy-episodes.json), e
 * `cerca` è la parola con cui trovare le puntate correlate.
 *
 * ATTENZIONE: le domande sono state scritte leggendo titoli e descrizioni del
 * feed, non ascoltando le puntate. Vanno verificate da chi le ha scritte prima
 * di andare online.
 */
export interface Quiz {
  domanda: string;
  /** Tre risposte: la prima è quella giusta, vengono mescolate a video. */
  risposte: [string, string, string];
  spiegazione: string;
  /** Identificativo Megaphone della puntata che racconta la storia. */
  episodio: string;
  /** Parola chiave per pescare le puntate correlate. */
  cerca: string;
}

export const QUIZ: Quiz[] = [
  {
    domanda:
      "Foot Locker è passata da otto miliardi di dollari a essere venduta per due e mezzo. Da quale fornitore dipendeva per il 70% del suo giro d'affari?",
    risposte: ["Nike", "Adidas", "New Balance"],
    spiegazione:
      "Quando Nike ha deciso di vendere direttamente ai clienti, Foot Locker si è ritrovata senza il fornitore su cui aveva costruito tutto.",
    episodio: "MNTHA2290907933",
    cerca: "Foot Locker",
  },
  {
    domanda:
      "Per oltre trent'anni McDonald's ha tenuto le insalate nel menu pur vendendone pochissime. Perché?",
    risposte: [
      "Per neutralizzare il «voto di veto» dentro un gruppo di amici",
      "Per un obbligo di legge sulla ristorazione rapida",
      "Per un accordo con i produttori agricoli",
    ],
    spiegazione:
      "Basta una persona che non vuole hamburger per spostare tutto il gruppo in un altro locale: l'insalata serviva a non perdere il tavolo intero.",
    episodio: "MNTHA4016129638",
    cerca: "insalate McDonald",
  },
  {
    domanda:
      "Vietata per legge la pubblicità delle sigarette, come ha fatto Marlboro a restare sulle Ferrari di Formula 1?",
    risposte: [
      "Con un codice a barre stilizzato sulla monoposto",
      "Cambiando il nome in «Marlboro Racing»",
      "Pagando una deroga alla federazione",
    ],
    spiegazione:
      "Un motivo grafico che a trecento all'ora richiamava il pacchetto: il marchio senza il marchio.",
    episodio: "MNTHA8700066297",
    cerca: "Marlboro Ferrari",
  },
  {
    domanda: "In Italia i romanzi polizieschi hanno un nome che nessun altro Paese usa: gialli. Da dove arriva quel colore?",
    risposte: [
      "Dal colore delle copertine di una collana degli anni '30",
      "Dal cognome del primo autore italiano del genere",
      "Dal colore con cui la censura segnava quei libri",
    ],
    spiegazione:
      "Una collana di romanzi crime di grande successo esce con le copertine gialle, e il colore finisce per dare il nome a tutto il genere.",
    episodio: "MNTHA7460258939",
    cerca: "gialli thriller",
  },
  {
    domanda:
      "Durante il lockdown Barilla ha costruito una campagna su una domanda che milioni di persone cercavano su Google. Quale?",
    risposte: [
      "Quanto deve cuocere la pasta",
      "Dove trovare la farina",
      "Come si fa il pane in casa",
    ],
    spiegazione:
      "Una domanda banalissima, cercata da mezzo Paese chiuso in cucina: Barilla ci ha costruito sopra una delle sue campagne migliori.",
    episodio: "MNTHA8093437125",
    cerca: "Barilla",
  },
  {
    domanda: "La stella più ambita dai cuochi di tutto il mondo la assegna un produttore di pneumatici. Perché proprio lui?",
    risposte: [
      "Per spingere la gente a mettersi in auto e consumare gomme",
      "Perché i fondatori erano due cuochi",
      "Perché comprò una guida gastronomica già esistente",
    ],
    spiegazione:
      "La guida nasce come strumento per far viaggiare gli automobilisti: più chilometri, più pneumatici da cambiare.",
    episodio: "MNTHA9497519698",
    cerca: "Michelin",
  },
  {
    domanda: "Tutti la danno per francese, ma l'etimologia di «barbecue» racconta un'altra storia. Da dove arriva davvero?",
    risposte: [
      "Dai Caraibi",
      "Dal francese «barbe à queue»",
      "Dallo spagnolo «barba de cuero»",
    ],
    spiegazione:
      "Non è francese, come si racconta spesso: viene dai Caraibi. E la cottura originale era lenta e povera, non la grigliata veloce di oggi.",
    episodio: "MNTHA8063727455",
    cerca: "barbeque",
  },
  {
    domanda: "Con una sola campagna Coca-Cola si è presa un simbolo che usiamo tutti i giorni senza pensarci. Quale?",
    risposte: [
      "L'emoji della bibita sullo smartphone",
      "La forma della cannuccia",
      "Il rosso dei cartelli stradali",
    ],
    spiegazione:
      "Una campagna assurda e un po' inquietante: prendersi un simbolo che usiamo tutti i giorni senza pensarci.",
    episodio: "MNTHA4016925588",
    cerca: "emoji Coca",
  },
  {
    domanda:
      "Due registi hanno girato un'intera serie TV dentro un negozio IKEA, tra clienti inconsapevoli. Con quale accordo?",
    risposte: [
      "Nessuno: l'azienda non ne sapeva niente",
      "Un contratto di product placement",
      "Una sponsorizzazione pagata da IKEA",
    ],
    spiegazione:
      "«IKEA Heights» è stata girata di nascosto, trasformando gli showroom in set senza chiedere il permesso.",
    episodio: "MNTHA6911970056",
    cerca: "IKEA Heights",
  },
  {
    domanda: "Milka ha costruito una delle campagne più geniali degli ultimi anni su un difetto voluto. Di cosa si trattava?",
    risposte: [
      "Ha tolto un quadratino dalla tavoletta",
      "Ha stampato le confezioni storte",
      "Ha cambiato il viola in azzurro",
    ],
    spiegazione:
      "Un quadratino in meno, e sopra ci è nata una delle campagne più geniali degli ultimi anni.",
    episodio: "MNTHA2790562102",
    cerca: "Milka",
  },
  {
    domanda: "A prima vista la Kombat di Kappa sembrava solo una maglia più aderente delle altre. Cosa ha cambiato davvero?",
    risposte: [
      "Il modo in cui le divise da calcio vengono progettate e vendute",
      "Il regolamento sui numeri di maglia",
      "Il materiale con cui si fanno i palloni",
    ],
    spiegazione:
      "Da lì in poi la maglia smette di essere un indumento e diventa un prodotto tecnico da vendere ai tifosi.",
    episodio: "MNTHA7155601063",
    cerca: "Kombat Kappa",
  },
  {
    domanda: "La prima webcam della storia non nasce per la sicurezza né per le videochiamate, ma per un motivo molto più banale. Quale?",
    risposte: [
      "Controllare se il caffè era finito",
      "Sorvegliare un laboratorio di notte",
      "Fare videochiamate tra due atenei",
    ],
    spiegazione:
      "Dei ricercatori inglesi erano stufati di fare le scale per scoprire che la caffettiera era vuota. Da lì è nata la prima webcam.",
    episodio: "MNTHA6073156988",
    cerca: "webcam",
  },
  {
    domanda: "Il palloncino non è nato per le feste dei bambini, ma in un posto che nessuno immaginerebbe. Quale?",
    risposte: [
      "In un laboratorio scientifico",
      "In una fabbrica di giocattoli",
      "In un circo dell'Ottocento",
    ],
    spiegazione:
      "Non è nato per le feste: arriva da un laboratorio, e finirà anche per causare uno dei disastri pubblicitari più assurdi di sempre.",
    episodio: "MNTHA1748672460",
    cerca: "palloncino",
  },
  {
    domanda: "L'etichetta più famosa di Levi's, ancora oggi cucita sui jeans, mostra due cavalli impegnati in una prova. Quale?",
    risposte: [
      "Non riuscivano a strappare un paio di jeans",
      "Trainavano un carro carico di denim",
      "Indossavano due paia di jeans",
    ],
    spiegazione:
      "Pubblicità ingannevole o dimostrazione geniale? Quell'etichetta con i due cavalli è ancora sui jeans oggi.",
    episodio: "MNTHA9646950102",
    cerca: "Levi's",
  },
  {
    domanda: "Le bustine di tè sembrano esistite da sempre, e invece hanno una data di nascita. Come sono state inventate?",
    risposte: [
      "Per caso",
      "Da un brevetto inglese dell'Ottocento",
      "Su richiesta della marina britannica",
    ],
    spiegazione:
      "Nascono per sbaglio, vengono reinventate più volte, e le vere inventrici spariscono quasi del tutto dalla storia.",
    episodio: "MNTHA9101835171",
    cerca: "bustine",
  },
  {
    domanda: "Oggi la kombucha è un fenomeno globale da miliardi di dollari, ma ha duemila anni di storia alle spalle. Come si chiamava?",
    risposte: [
      "L'elisir dell'immortalità cinese",
      "Una medicina da guerra russa",
      "Una bevanda rituale messicana",
    ],
    spiegazione:
      "Dall'elisir dell'immortalità ai frigoriferi della Gen Z: un salto di duemila anni in pochi decenni.",
    episodio: "MNTHA7002374115",
    cerca: "kombucha",
  },
  {
    domanda: "WeRoad è diventata protagonista della loneliness economy capendo che il suo vero prodotto non sono i viaggi. E allora cos'è?",
    risposte: ["Le persone", "Le fotografie", "Le assicurazioni"],
    spiegazione:
      "Da agenzia di viaggi di gruppo a protagonista della loneliness economy: tanto che perfino Airbnb ha deciso di scommetterci.",
    episodio: "MNTHA2485569065",
    cerca: "WeRoad",
  },
  {
    domanda: "In una delle sue campagne più riuscite a Heinz è bastato un solo elemento grafico per mettere k.o. i concorrenti. Quale?",
    risposte: ["Una semplice linea rossa", "Un codice QR gigante", "Un carattere disegnato a mano"],
    spiegazione:
      "Una linea, e tutti hanno capito di che marca si parlava. Il massimo risultato col minimo segno.",
    episodio: "MNTHA3586485816",
    cerca: "Heinz",
  },
  {
    domanda:
      "Dal 2026 in Italia il POS comunica direttamente col registratore di cassa. Quanto è emerso in pochi mesi?",
    risposte: ["Oltre 5 miliardi di euro", "Circa 500 milioni", "Poco meno di un miliardo"],
    spiegazione:
      "Bastava così poco: collegare due macchine che già c'erano ha fatto emergere miliardi che prima sfuggivano.",
    episodio: "MNTHA5791031768",
    cerca: "POS registratore",
  },
  {
    domanda: "Nel mercato dei pannolini a scegliere non è chi li indossa. Da quale intuizione è nato un business da miliardi?",
    risposte: [
      "Venderli ai genitori come un prodotto di design",
      "Regalarli negli ospedali",
      "Venderli solo in abbonamento",
    ],
    spiegazione:
      "A scegliere non è chi li indossa: se decidono i genitori, tanto vale parlare a loro come si parla a chi compra oggetti belli.",
    episodio: "MNTHA8653862918",
    cerca: "pannolini",
  },
];
