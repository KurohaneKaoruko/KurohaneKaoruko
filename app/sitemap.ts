import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // 站点开启了 trailingSlash，条目地址需与线上形态一致
  return [
    { url: SITE.url + "/", lastModified, changeFrequency: "monthly", priority: 1 },
    { url: SITE.url + "/projects/", lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: SITE.url + "/about/", lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
