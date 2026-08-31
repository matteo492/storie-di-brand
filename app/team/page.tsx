import type { Metadata } from "next";
import TeamCarousel from "@/components/TeamCarousel";
import { TEAM } from "@/lib/team";
import { OPEN_POSITIONS } from "@/lib/jobs";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Il team",
  description:
    "Le persone che fanno Storie di Brand: voci, autori, sound design e produzione dietro il podcast e il canale YouTube. Scopri anche le posizioni aperte.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  // Dati strutturati: rendono le posizioni indicizzabili su Google Lavoro.
  const jobsLd = OPEN_POSITIONS.map((job) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.summary,
    datePosted: job.postedAt,
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Storie di Brand",
      sameAs: SITE_URL,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Roma",
        addressCountry: "IT",
      },
    },
    ...(job.salaryMin && job.salaryMax
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "EUR",
            value: {
              "@type": "QuantitativeValue",
              minValue: job.salaryMin,
              maxValue: job.salaryMax,
              unitText: "YEAR",
            },
          },
        }
      : {}),
    directApply: false,
    url: job.url,
  }));

  return (
    <main className="team-page">
      <header className="page-head">
        <p className="eyebrow">Chi siamo</p>
        <h1>Le persone dietro le storie</h1>
        <p>
          Storie di Brand è fatto da un gruppo di {TEAM.length}{" "}
          persone tra voci, autori, sound design e produzione. Ecco chi c&apos;è
          dall&apos;altra parte del microfono.
        </p>
      </header>

      <section className="team-section">
        <TeamCarousel />
      </section>

      {/* POSIZIONI APERTE */}
      <section className="jobs" id="posizioni-aperte">
        <div className="jobs__head">
          <p className="eyebrow">Lavora con noi</p>
          <h2 className="section-title">Posizioni aperte</h2>
        </div>

        {OPEN_POSITIONS.length === 0 ? (
          <p className="jobs__empty">
            Al momento non abbiamo posizioni aperte. Se pensi di essere la persona
            giusta per il nostro team, scrivici comunque a{" "}
            <a href="mailto:max@storiedibrand.it">max@storiedibrand.it</a>.
          </p>
        ) : (
          <>
            <ul className="jobs__list">
              {OPEN_POSITIONS.map((job) => (
                <li key={job.url} className="job-card">
                  <div className="job-card__body">
                    <h3 className="job-card__title">{job.title}</h3>
                    <ul className="job-card__tags">
                      <li>{job.location}</li>
                      <li>{job.contract}</li>
                      {job.salary && <li>{job.salary}</li>}
                    </ul>
                    <p className="job-card__summary">{job.summary}</p>
                  </div>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener"
                    className="btn btn--primary job-card__cta"
                  >
                    Scopri e candidati →
                  </a>
                </li>
              ))}
            </ul>
            <p className="jobs__note">
              Non trovi il tuo ruolo? Scrivici a{" "}
              <a href="mailto:max@storiedibrand.it">max@storiedibrand.it</a>: ci fa
              sempre piacere conoscere persone in gamba.
            </p>
          </>
        )}
      </section>

      {jobsLd.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsLd) }}
        />
      )}
    </main>
  );
}
