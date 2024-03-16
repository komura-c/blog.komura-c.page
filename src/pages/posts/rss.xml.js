import rss from "@astrojs/rss";
import { BLOG_SITE_TITLE, BLOG_SITE_DESCRIPTION } from "../../config";
import { getCollection } from "astro:content";

export async function get() {
  const blogEntries = await getCollection("posts", ({ data }) => {
    return data.draft !== true;
  });
  return rss({
    title: BLOG_SITE_TITLE,
    description: BLOG_SITE_DESCRIPTION,
    site: import.meta.env.SITE,
    items: blogEntries.map((entry) => ({
      title: entry.data.title,
      pubDate: entry.data.pubDate,
      description: entry.data.description,
      link: `/posts/${entry.slug}/`,
    })),
    customData: `<language>ja</language>`,
  });
}
