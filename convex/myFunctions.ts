import {v} from "convex/values";
import {query, mutation, action} from "./_generated/server";
import {api} from "./_generated/api";
import {getAuthUserId} from "@convex-dev/auth/server";
import { utapi } from "../app/server/uploadthing";
import { cookies } from "next/headers";
// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const getAllPosts = query({
        args: {},
        handler: async (ctx,args) => {
            const posts = await ctx.db.query("posts").collect()
            return posts
        }
    }
)
export const addPost = mutation({
    args:{content:v.string(),date:v.int64(),attachments:v.array(v.string())},
    handler: async (ctx,args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity == null){
            throw new Error("Unauthrized")
        }
        await ctx.db.insert("posts",{
            content:args.content,
            author: identity.tokenIdentifier,
            date: args.date,
            attachments: args.attachments
        })
    }
})
export const getPost = query({
  args: {id:v.id("posts")},
  handler: async (ctx, args) => {
    const post = await ctx.db.get("posts",args.id);
    return post;
  },
});

export const deletePost = mutation({
  args:{id:v.id("posts")},
  handler: async (ctx,args) => {
    await ctx.db.delete(args.id);
  }
})
