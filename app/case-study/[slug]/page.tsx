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

      {cs.corpo && cs.corpo.length > 0 && (
        <div className="prose">
          {cs.corpo.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {cs.backstage && cs.backstage.length > 0 && (
        <section className="case__backstage">
          <h2 className="section-title">Dietro le quinte</h2>
          <div className="case__shots">
            {cs.backstage.map((b) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={b.src} src={b.src} alt={b.alt} loading="lazy" />
            ))}
          </div>
        </section>
      )}

      <section className="case__cta">
        <h2 className="section-title">Vuoi un progetto così?</h2>
        <Link href="/#collabora" className="btn btn--primary">
          Raccontaci la tua idea
        </Link>
      </section>
    </main>
  );
}
