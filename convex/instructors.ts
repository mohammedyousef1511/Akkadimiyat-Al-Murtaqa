import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const instructors = await ctx.db.query("instructors").collect();
    
    return Promise.all(
      instructors.map(async (instructor) => {
        const profileImageUrl = instructor.profileImage 
          ? await ctx.storage.getUrl(instructor.profileImage) 
          : null;

        // Get courses taught by this instructor
        const courses = await ctx.db
          .query("courses")
          .withIndex("by_instructor", (q) => q.eq("instructorId", instructor._id))
          .filter((q) => q.eq(q.field("isPublished"), true))
          .collect();

        return {
          ...instructor,
          profileImageUrl,
          coursesCount: courses.length,
          courses,
        };
      })
    );
  },
});

export const getById = query({
  args: { instructorId: v.id("instructors") },
  handler: async (ctx, args) => {
    const instructor = await ctx.db.get(args.instructorId);
    if (!instructor) return null;

    const profileImageUrl = instructor.profileImage 
      ? await ctx.storage.getUrl(instructor.profileImage) 
      : null;

    const courses = await ctx.db
      .query("courses")
      .withIndex("by_instructor", (q) => q.eq("instructorId", args.instructorId))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .collect();

    return {
      ...instructor,
      profileImageUrl,
      courses,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    email: v.optional(v.string()),
    specialization: v.array(v.string()),
    profileImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("instructors", args);
  },
});
