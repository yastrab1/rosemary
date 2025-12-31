import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  posts: defineTable({
    content: v.string(),
    author: v.string(),
    date: v.int64(),
    attachments: v.array(v.string())
  })
});
