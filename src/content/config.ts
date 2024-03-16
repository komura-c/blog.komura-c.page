// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// 2. Define a schema for each collection you'd like to validate.
const postsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.string(),
    pubDate: z.string(),
    heroImage: z.string(),
    draft: z.boolean(),
    createdDate: z.string(),
    updatedDate: z.string(),
  }),
});
// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  posts: postsCollection,
};
