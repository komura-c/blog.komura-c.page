import rss from "@astrojs/rss";
import { BLOG_SITE_TITLE, BLOG_SITE_DESCRIPTION } from "../config";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blogEntries = await getCollection("posts", ({ data }) => {
    return data.draft !== true;
  });
  return rss({
    title: BLOG_SITE_TITLE,
    description: BLOG_SITE_DESCRIPTION,
    site: context.site,
    items: blogEntries
      .sort(
        (a, b) =>
          new Date(b.data.pubDate).valueOf() -
          new Date(a.data.pubDate).valueOf()
      )
      .map((entry) => {
        return {
          title: entry.data.title,
          pubDate: entry.data.pubDate,
          description: entry.data.description,
          link: `/posts/${entry.slug}/`,
          customData: `<language>ja</language>`,
        };
      }),
  });
}
