import type { Article } from "../types/Article";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

type storedAllArticle = {
  lastUpdateDate: number;
  allArticle: Article[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storeDirPath = path.join(__dirname, "../data");
const storeFileName = "allBlogPosts.json";

export function blogStorerWrite(allArticle: Article[]) {
  console.info("blogStorerWrite: start");

  if (!existsSync(storeDirPath)) {
    mkdirSync(storeDirPath, { recursive: true });
  }

  writeFileSync(
    path.join(storeDirPath, storeFileName),
    JSON.stringify(
      <storedAllArticle>{
        lastUpdateDate: Date.now(),
        allArticle,
      },
      null,
      2
    ),
    "utf-8"
  );

  console.info("blogStorerWrite: end");
}

export function blogStorerRead(): storedAllArticle {
  if (!existsSync(path.join(storeDirPath, storeFileName))) {
    return <storedAllArticle>{
      lastUpdateDate: 0,
      allArticle: [],
    };
  }

  const allArticles = readFileSync(
    path.join(storeDirPath, storeFileName),
    "utf-8"
  );
  return JSON.parse(allArticles);
}
