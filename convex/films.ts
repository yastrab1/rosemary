import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addFilm = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("films", { name: args.name, watched: false });
  },
});

export const markWatched = mutation({
  args: {id:v.id("films")},
  handler: async (ctx,args)=> {
    const doc = await ctx.db.get("films",args.id)
    await ctx.db.replace("films",args.id,{name:"",...doc,watched:!doc?.watched})
  }
})

export const listFilms = query({
  args:{},
  handler: async (ctx,args) => {
    return await ctx.db.query("films").collect()
  }
})

export const deleteFilm = mutation({
  args:{id:v.id("films")},
  handler: async (ctx,args)=>{
    await ctx.db.delete("films",args.id)
  }
})