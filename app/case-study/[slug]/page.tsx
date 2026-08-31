import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy } from "@/lib/case-studies";

type Params = { slug: string };

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};
  return {
    title: `${cs.partner} — il case study`,
    description: cs.intro,
    alternates: { canonical: `/case-study/${cs.slug}` },
    openGraph: {
      type: "article",
      title: `${cs.partner} × Storie di Brand`,
      description: cs.intro,
      images: cs.video?.[0]
        ? [`https://i.ytimg.com/vi/${cs.video[0]}/maxresdefault.jpg`]
        : undefined,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <main className="case">
      <header className="case__hero">
        <Link href="/#collaborazioni" className="link-arrow">
          ← Tutte le collaborazioni
        </Link>
        <p className="eyebrow">{cs.formato}</p>
        <h1 className="case__title">{cs.titolo}</h1>
        <p className="case__intro">{cs.intro}</p>

        {cs.risultati && cs.risultati.length > 0 && (
          <div className="case__numbers">
            {cs.risultati.map((r) => (
              <div className="fact" key={r.label}>
                <strong>{r.value}</strong>
                <span>{r.label}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      {cs.video?.map((id) => (
        <div className="case__video reveal" key={id}>
          <div className="video-embed">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${id}`}
              title={`${cs.partner} — Storie di Brand`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}

      {/* Riquadri vuoti finché i video non ci sono: stesso ingombro, così
          l'impaginazione è già quella definitiva. */}
      {Array.from({ length: cs.videoAttesi ?? 0 }, (_, i) => (
        <div className="case__video reveal" key={`attesa-${i}`}>
          <div className="video-embed segnaposto">
            <span>Video · segnaposto</span>
          </div>
        </div>
      ))}

      {(cs.sfida || cs.soluzione) && (
        <section className="case__duo reveal">
          {cs.sfida && (
            <div className="case__duo__voce">
              <h2>La sfida</h2>
              <p>{cs.sfida}</p>
            </div>
          )}
          {cs.soluzione && (
            <div className="case__duo__voce">
              <h2>La soluzione</h2>
              <p>{cs.soluzione}</p>
            </div>
          )}
        </section>
      )}

      {cs.corpo && cs.corpo.length > 0 && (
        <div className="prose">
          {cs.corpo.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {((cs.backstage && cs.backstage.length > 0) || cs.backstageAttese) && (
        <section className="case__backstage">
          <h2 className="case__h2">Dietro le quinte</h2>
          <div className="case__shots">
            {cs.backstage?.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.src} src={b.src} alt={b.alt} loading="lazy" />
            ))}
            {Array.from({ length: cs.backstageAttese ?? 0 }, (_, i) => (
              <div className="case__shots__attesa" key={`attesa-${i}`}>
                <span>Foto · segnaposto</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* La chiusura è il punto in cui un altro brand decide se scriverci:
          vale un riquadro suo, non una domanda sospesa in fondo alla pagina.
          Due strade, perché chi non è ancora pronto a scrivere deve poter
          vedere un altro progetto invece di uscire dal sito. */}
      <section className="case__cta">
        <p className="eyebrow">Per i brand</p>
        <h2 className="case__cta__titolo">Vuoi un progetto così?</h2>
        <p className="case__cta__frase">
          Ogni collaborazione parte da una storia che il marchio non aveva
          ancora raccontato. Raccontaci la tua e ti diciamo come la
          metteremmo in scena.
        </p>
        <div className="case__cta__azioni">
          <Link href="/#collabora" className="btn btn--primary">
            Raccontaci la tua idea
          </Link>
          <Link href="/#collaborazioni" className="btn btn--ghost">
            Le altre collaborazioni
          </Link>
        </div>
      </section>
    </main>
  );
}
