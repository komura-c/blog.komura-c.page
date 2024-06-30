import type { Article } from "../types/Article";
import { blogFetcher } from "./BlogFetcher";
import { blogStorerRead, blogStorerWrite } from "./BlogStorer";

const storedLimit = 1000 * 60 * 60 * 12; // 12 hours

const allOuterFeedList = [
  "https://komura-c.hatenablog.com/rss",
  "https://tech-blog.voicy.jp/rss/author/komura_c",
  "https://zenn.dev/komura_c/feed",
  "https://qiita.com/komura_c/feed",
];

let isLoading = false;
const fetchAwaits: ((value: Article[] | PromiseLike<Article[]>) => void)[] = [];
const allOuterPosts: Article[] = [];

export function getAllOuterPosts(): Promise<Article[]> {
  return new Promise(async (resolve, reject) => {
    if (allOuterPosts.length) {
      resolve(allOuterPosts);
      return;
    } else if (isLoading) {
      fetchAwaits.push(resolve);
      return;
    }
    isLoading = true;

    const storedAllBlogPosts = blogStorerRead();
    if (
      storedAllBlogPosts.lastUpdateDate > 0 &&
      storedAllBlogPosts.lastUpdateDate + storedLimit > Date.now()
    ) {
      allOuterPosts.push(...storedAllBlogPosts.allArticle);
      resolve(allOuterPosts);
      return;
    }

    const fetchPromises = allOuterFeedList.map((feed) => {
      return blogFetcher(feed);
    });
    const allResult = await Promise.allSettled(fetchPromises);
    allResult.forEach((result) => {
      if (result.status === "fulfilled") {
        allOuterPosts.push(...result.value);
      } else {
        reject(result.reason);
        return;
      }
    });

    if (!allOuterPosts.length) {
      reject(new Error("No feed items"));
      return;
    }

    blogStorerWrite(allOuterPosts);
    resolve(allOuterPosts);

    fetchAwaits.forEach((resolveFunction) => {
      resolveFunction(allOuterPosts);
    });

    isLoading = false;
    return;
  });
}
