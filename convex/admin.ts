import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Helper function to check if user is admin
async function requireAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Must be logged in");
  }

  const user = await ctx.db.get(userId);
  if (user?.email !== "adminmortaqa@gmail.com") {
    throw new Error("Admin access required");
  }

  return userId;
}

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const [courses, instructors, users, enrollments] = await Promise.all([
      ctx.db.query("courses").collect(),
      ctx.db.query("instructors").collect(),
      ctx.db.query("users").collect(),
      ctx.db.query("enrollments").collect(),
    ]);

    return {
      totalCourses: courses.length,
      totalInstructors: instructors.length,
      totalStudents: users.length,
      totalEnrollments: enrollments.length,
    };
  },
});

export const getAllCourses = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const courses = await ctx.db.query("courses").collect();

    return Promise.all(
      courses.map(async (course) => {
        const instructor = await ctx.db.get(course.instructorId);
        const imageUrl = course.image ? await ctx.storage.getUrl(course.image) : null;
        
        // Count enrollments for this course
        const enrollments = await ctx.db
          .query("enrollments")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect();

        // Count lessons for this course
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_course", (q) => q.eq("courseId", course._id))
          .collect();

        return {
          ...course,
          instructor,
          imageUrl,
          enrollmentCount: enrollments.length,
          actualLessons: lessons.length,
        };
      })
    );
  },
});

export const getAllInstructors = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const instructors = await ctx.db.query("instructors").collect();

    return Promise.all(
      instructors.map(async (instructor) => {
        const profileImageUrl = instructor.profileImage 
          ? await ctx.storage.getUrl(instructor.profileImage) 
          : null;

        // Count courses for this instructor
        const courses = await ctx.db
          .query("courses")
          .withIndex("by_instructor", (q) => q.eq("instructorId", instructor._id))
          .collect();

        return {
          ...instructor,
          profileImageUrl,
          coursesCount: courses.length,
        };
      })
    );
  },
});

export const getAllStudents = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").collect();

    return Promise.all(
      users.map(async (user) => {
        // Count enrollments for this user
        const enrollments = await ctx.db
          .query("enrollments")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        const completedEnrollments = enrollments.filter(e => e.progress === 100);

        return {
          ...user,
          enrolledCourses: enrollments.length,
          completedCourses: completedEnrollments.length,
        };
      })
    );
  },
});

export const toggleCourseStatus = mutation({
  args: {
    courseId: v.id("courses"),
    isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    await ctx.db.patch(args.courseId, {
      isPublished: args.isPublished,
    });

    return { success: true };
  },
});

export const deleteInstructor = mutation({
  args: {
    instructorId: v.id("instructors"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Check if instructor has courses
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_instructor", (q) => q.eq("instructorId", args.instructorId))
      .collect();

    if (courses.length > 0) {
      throw new Error("Cannot delete instructor with existing courses");
    }

    await ctx.db.delete(args.instructorId);

    return { success: true };
  },
});

export const createCourse = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    fullDescription: v.string(),
    category: v.union(
      v.literal("fiqh"),
      v.literal("tafsir"),
      v.literal("aqeedah"),
      v.literal("arabic"),
      v.literal("hadith")
    ),
    instructorId: v.id("instructors"),
    targetAudience: v.string(),
    totalLessons: v.number(),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.insert("courses", {
      ...args,
      isPublished: false,
    });
  },
});

export const createInstructor = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    email: v.optional(v.string()),
    specialization: v.array(v.string()),
    profileImage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.insert("instructors", args);
  },
});

export const deleteCourse = mutation({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Check if course has enrollments
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    if (enrollments.length > 0) {
      throw new Error("Cannot delete course with existing enrollments");
    }

    // Delete all lessons for this course
    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .collect();

    for (const lesson of lessons) {
      await ctx.db.delete(lesson._id);
    }

    // Delete the course
    await ctx.db.delete(args.courseId);

    return { success: true };
  },
});

// Lesson management functions
export const getCourseLessons = query({
  args: {
    courseId: v.id("courses"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.courseId))
      .order("asc")
      .collect();

    return lessons;
  },
});

export const createLesson = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    description: v.string(),
    order: v.number(),
    videoUrl: v.optional(v.string()),
    zoomLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.insert("lessons", args);
  },
});

export const updateLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    title: v.string(),
    description: v.string(),
    order: v.number(),
    videoUrl: v.optional(v.string()),
    zoomLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { lessonId, ...updateData } = args;
    
    return await ctx.db.patch(lessonId, updateData);
  },
});

export const deleteLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.delete(args.lessonId);
  },
});
