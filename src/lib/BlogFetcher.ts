import Parser from "rss-parser";
import type { Article } from "../types/Article";

const excludeHatenaGuidList = [
  "4207112889932952200",
  "4207112889933743643",
  "4207112889935683885",
  "4207112889940526141",
  "4207112889940907890",
  "820878482956325029",
];

const parser: Parser = new Parser({
  maxRedirects: 5,
  timeout: 1000 * 10,
});

export async function blogFetcher(url: string): Promise<Article[]> {
  const feed = await parser.parseURL(url);
  const items = extractMyPosts(url, feed?.items ?? []);

  return items.map((item) => {
    return {
      title: item?.title ?? "タイトル不明",
      url: item?.link ?? "URL不明",
      pubDate: item?.pubDate ?? "公開日不明",
      isMySite: false,
      slug: ""
    };
  });
}

const extractMyPosts = (url: string, items: Parser.Item[]) => {
  const fetchURL = new URL(url);
  if (fetchURL.hostname === "tech-blog.voicy.jp") {
    return items.filter((item) => {
      const guidLink = item.guid ?? null;
      if (!guidLink) return false;
      const matchArray = guidLink.match(/hatenablog:\/\/entry\/(\d+$)/);
      if (!matchArray) return false;
      const guid = matchArray[1] ?? null;
      if (!guid) return false;
      return !excludeHatenaGuidList.find(
        (excludeHatenaGuid) => excludeHatenaGuid === guid
      );
    });
  }
  return items;
}