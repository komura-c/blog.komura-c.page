import type { Article } from "../types/Article";
import { blogFetcher } from "./BlogFetcher";

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
  return new Promise((resolve, reject) => {
    if (allOuterPosts.length) {
      resolve(allOuterPosts);
    } else if (isLoading) {
      fetchAwaits.push(resolve);
    } else {
      isLoading = true;

      Promise.allSettled(allOuterFeedList.map((feed)=>{
        return blogFetcher(feed);
      })).then((allResult) => {
        allResult.forEach((result) => {
          if (result.status === "fulfilled") {
            allOuterPosts.push(...result.value);
          } else {
            reject(result.reason);
          }
        });

        if (!allOuterPosts.length) {
          reject(new Error("No feed items"));
        }

        resolve(allOuterPosts);

        fetchAwaits.forEach((resolveFunction) => {
          resolveFunction(allOuterPosts);
        });

        isLoading = false;
      });
    }
  });
}
