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

export const getPaymentInfo = query({
  args: {},
  handler: async (ctx) => {
    const paymentInfo = await ctx.db
      .query("paymentInfo")
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
    
    return paymentInfo;
  },
});

export const getAllPaymentInfo = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    
    return await ctx.db.query("paymentInfo").collect();
  },
});

export const createPaymentInfo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    bankName: v.string(),
    accountNumber: v.string(),
    accountName: v.string(),
    iban: v.optional(v.string()),
    instructions: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    // Deactivate all existing payment info
    const existingPaymentInfo = await ctx.db.query("paymentInfo").collect();
    for (const info of existingPaymentInfo) {
      await ctx.db.patch(info._id, { isActive: false });
    }

    // Create new active payment info
    return await ctx.db.insert("paymentInfo", {
      ...args,
      isActive: true,
    });
  },
});

export const updatePaymentInfo = mutation({
  args: {
    paymentInfoId: v.id("paymentInfo"),
    title: v.string(),
    description: v.string(),
    bankName: v.string(),
    accountNumber: v.string(),
    accountName: v.string(),
    iban: v.optional(v.string()),
    instructions: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const { paymentInfoId, ...updateData } = args;
    
    return await ctx.db.patch(paymentInfoId, updateData);
  },
});

export const togglePaymentInfoStatus = mutation({
  args: {
    paymentInfoId: v.id("paymentInfo"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    if (args.isActive) {
      // Deactivate all other payment info
      const allPaymentInfo = await ctx.db.query("paymentInfo").collect();
      for (const info of allPaymentInfo) {
        if (info._id !== args.paymentInfoId) {
          await ctx.db.patch(info._id, { isActive: false });
        }
      }
    }

    return await ctx.db.patch(args.paymentInfoId, { isActive: args.isActive });
  },
});

export const deletePaymentInfo = mutation({
  args: {
    paymentInfoId: v.id("paymentInfo"),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db.delete(args.paymentInfoId);
  },
});
