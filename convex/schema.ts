import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  instructors: defineTable({
    name: v.string(),
    bio: v.string(),
    profileImage: v.optional(v.id("_storage")),
    email: v.optional(v.string()),
    specialization: v.array(v.string()),
  }).index("by_email", ["email"]),

  courses: defineTable({
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
    image: v.optional(v.id("_storage")),
    targetAudience: v.string(),
    totalLessons: v.number(),
    isPublished: v.boolean(),
  }).index("by_category", ["category"])
    .index("by_instructor", ["instructorId"]),

  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    description: v.string(),
    order: v.number(),
    videoUrl: v.optional(v.string()),
    pdfResource: v.optional(v.id("_storage")),
    zoomLink: v.optional(v.string()),
  }).index("by_course", ["courseId"])
    .index("by_course_order", ["courseId", "order"]),

  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    enrolledAt: v.number(),
    completedAt: v.optional(v.number()),
    progress: v.number(), // percentage 0-100
  }).index("by_user", ["userId"])
    .index("by_course", ["courseId"])
    .index("by_user_course", ["userId", "courseId"]),

  lessonProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    courseId: v.id("courses"),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  }).index("by_user_lesson", ["userId", "lessonId"])
    .index("by_user_course", ["userId", "courseId"]),

  certificates: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
    issuedAt: v.number(),
    certificateId: v.string(), // unique certificate identifier
  }).index("by_user", ["userId"])
    .index("by_certificate_id", ["certificateId"]),

  paymentInfo: defineTable({
    title: v.string(),
    description: v.string(),
    bankName: v.string(),
    accountNumber: v.string(),
    accountName: v.string(),
    iban: v.optional(v.string()),
    instructions: v.string(),
    isActive: v.boolean(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
