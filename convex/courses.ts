import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    category: v.optional(v.union(
      v.literal("fiqh"),
      v.literal("tafsir"),
      v.literal("aqeedah"),
      v.literal("arabic"),
      v.literal("hadith")
    )),
  },
  handler: async (ctx, args) => {
    let courses;
    
    if (args.category) {
      courses = await ctx.db.query("courses")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();
    } else {
      courses = await ctx.db.query("courses")
        .filter((q) => q.eq(q.field("isPublished"), true))
        .collect();
    }
    
    return Promise.all(
      courses.map(async (course) => {
        const instructor = await ctx.db.get(course.instructorId);
        const imageUrl = course.image ? await ctx.storage.getUrl(course.image) : null;
        const instructorImageUrl = instructor?.profileImage 
          ? await ctx.storage.getUrl(instructor.profileImage) 
          : null;

        return {
          ...course,
          instructor: instructor ? {
            ...instructor,
            profileImageUrl: instructorImageUrl,
          } : null,
          imageUrl,
        };
      })
    );
  },
});

export const getById = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.courseId);
    if (!course) return null;

    const instructor = await ctx.db.get(course.instructorId);
    const imageUrl = course.image ? await ctx.storage.getUrl(course.image) : null;
    const instructorImageUrl = instructor?.profileImage 
      ? await ctx.storage.getUrl(instructor.profileImage) 
      : null;

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();

    const userId = await getAuthUserId(ctx);
    let enrollment = null;
    if (userId) {
      enrollment = await ctx.db
        .query("enrollments")
        .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", args.courseId))
        .unique();
    }

    return {
      ...course,
      instructor: instructor ? {
        ...instructor,
        profileImageUrl: instructorImageUrl,
      } : null,
      imageUrl,
      lessons,
      enrollment,
    };
  },
});

export const enroll = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in to enroll");
    }

    const course = await ctx.db.get(args.courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    // Check if already enrolled
    const existingEnrollment = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", userId).eq("courseId", args.courseId))
      .unique();

    if (existingEnrollment) {
      throw new Error("Already enrolled in this course");
    }

    return await ctx.db.insert("enrollments", {
      userId,
      courseId: args.courseId,
      enrolledAt: Date.now(),
      progress: 0,
    });
  },
});

export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const user = await ctx.db.get(userId);
    return user?.email === "adminmortaqa@gmail.com";
  },
});

export const getUserEnrollments = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await ctx.db.get(enrollment.courseId);
        const instructor = course ? await ctx.db.get(course.instructorId) : null;
        const imageUrl = course?.image ? await ctx.storage.getUrl(course.image) : null;

        return {
          ...enrollment,
          course: course ? {
            ...course,
            imageUrl,
            instructor,
          } : null,
        };
      })
    );
  },
});
