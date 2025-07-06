import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserCertificates = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const certificates = await ctx.db
      .query("certificates")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return Promise.all(
      certificates.map(async (certificate) => {
        const course = await ctx.db.get(certificate.courseId);
        const user = await ctx.db.get(certificate.userId);
        const instructor = course ? await ctx.db.get(course.instructorId) : null;

        return {
          ...certificate,
          course,
          user,
          instructor,
        };
      })
    );
  },
});

export const getByCertificateId = query({
  args: { certificateId: v.string() },
  handler: async (ctx, args) => {
    const certificate = await ctx.db
      .query("certificates")
      .withIndex("by_certificate_id", (q) => q.eq("certificateId", args.certificateId))
      .unique();

    if (!certificate) return null;

    const course = await ctx.db.get(certificate.courseId);
    const user = await ctx.db.get(certificate.userId);
    const instructor = course ? await ctx.db.get(course.instructorId) : null;

    return {
      ...certificate,
      course,
      user,
      instructor,
    };
  },
});
