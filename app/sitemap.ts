import type { MetadataRoute } from "next";
import { getAllEpisodes } from "@/lib/episodes";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const episodes = getAllEpisodes().map((e) => ({
    url: `${SITE_URL}/episodi/${e.slug}`,
    lastModified: e.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/episodi`, changeFrequency: "weekly", priority: 0.9 },
    ...episodes,
  ];
}
