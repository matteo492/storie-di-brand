import type { Metadata } from "next";
import TeamCarousel from "@/components/TeamCarousel";
import { TEAM } from "@/lib/team";

export const metadata: Metadata = {
  title: "Il team",
  description:
    "Le persone che fanno Storie di Brand: voci, autori, sound design e produzione dietro il podcast e il canale YouTube.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <main>
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
    </main>
  );
}
