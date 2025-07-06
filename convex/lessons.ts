import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getByCourse = query({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();

    if (!userId) {
      return lessons.map(lesson => ({
        ...lesson,
        pdfResourceUrl: null,
        completed: false,
      }));
    }

    return Promise.all(
      lessons.map(async (lesson) => {
        const pdfResourceUrl = lesson.pdfResource 
          ? await ctx.storage.getUrl(lesson.pdfResource) 
          : null;

        const progress = await ctx.db
          .query("lessonProgress")
          .withIndex("by_user_lesson", (q) => q.eq("userId", userId).eq("lessonId", lesson._id))
          .unique();

        return {
          ...lesson,
          pdfResourceUrl,
          completed: progress?.completed || false,
        };
      })
    );
  },
});

export const markComplete = mutation({
  args: { 
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Must be logged in");
    }

    // Check if already marked complete
    const existingProgress = await ctx.db
      .query("lessonProgress")
      .withIndex("by_user_lesson", (q) => q.eq("userId", userId).eq("lessonId", args.lessonId))
      .unique();

    if (existingProgress) {
      if (!existingProgress.completed) {
        await ctx.db.patch(existingProgress._id, {
          completed: true,
          completedAt: Date.now(),
        });
      }
    } else {
      await ctx.db.insert("lessonProgress", {
        userId,
        lessonId: args.lessonId,
        courseId: args.courseId,
        completed: true,
        completedAt: Date.now(),
      });
    }

    // Update course progress
    await updateCourseProgress(ctx, userId, args.courseId);
  },
});

async function updateCourseProgress(ctx: any, userId: string, courseId: string) {
  const totalLessons = await ctx.db
    .query("lessons")
    .withIndex("by_course", (q: any) => q.eq("courseId", courseId))
    .collect();

  const completedLessons = await ctx.db
    .query("lessonProgress")
    .withIndex("by_user_course", (q: any) => q.eq("userId", userId).eq("courseId", courseId))
    .filter((q: any) => q.eq(q.field("completed"), true))
    .collect();

  const progress = Math.round((completedLessons.length / totalLessons.length) * 100);

  const enrollment = await ctx.db
    .query("enrollments")
    .withIndex("by_user_course", (q: any) => q.eq("userId", userId).eq("courseId", courseId))
    .unique();

  if (enrollment) {
    await ctx.db.patch(enrollment._id, {
      progress,
      completedAt: progress === 100 ? Date.now() : undefined,
    });

    // Generate certificate if course is completed
    if (progress === 100) {
      const existingCertificate = await ctx.db
        .query("certificates")
        .filter((q: any) => q.eq(q.field("userId"), userId))
        .filter((q: any) => q.eq(q.field("courseId"), courseId))
        .unique();

      if (!existingCertificate) {
        const certificateId = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        await ctx.db.insert("certificates", {
          userId,
          courseId,
          issuedAt: Date.now(),
          certificateId,
        });
      }
    }
  }
}
