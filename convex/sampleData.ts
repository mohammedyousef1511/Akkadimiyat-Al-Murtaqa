import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const setupSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingInstructors = await ctx.db.query("instructors").collect();
    if (existingInstructors.length > 0) {
      return "Sample data already exists";
    }

    // Create sample instructors
    const instructor1 = await ctx.db.insert("instructors", {
      name: "د. محمد الأحمد",
      bio: "دكتور في الفقه الإسلامي من جامعة الأزهر، له خبرة 15 عاماً في التدريس",
      specialization: ["الفقه", "أصول الفقه"],
      email: "ahmad@example.com",
    });

    const instructor2 = await ctx.db.insert("instructors", {
      name: "د. فاطمة السالم",
      bio: "أستاذة التفسير وعلوم القرآن، حاصلة على الدكتوراه من الجامعة الإسلامية",
      specialization: ["التفسير", "علوم القرآن"],
      email: "salem@example.com",
    });

    // Create sample courses
    const course1 = await ctx.db.insert("courses", {
      title: "أساسيات الفقه الإسلامي",
      description: "دورة شاملة في أساسيات الفقه الإسلامي للمبتدئين",
      fullDescription: "هذه الدورة تغطي الأساسيات المهمة في الفقه الإسلامي، بدءاً من الطهارة والصلاة وانتهاءً بالمعاملات. مناسبة للمبتدئين الذين يريدون فهم أحكام الشريعة الإسلامية بطريقة مبسطة ومنهجية.",
      category: "fiqh" as const,
      instructorId: instructor1,
      targetAudience: "المبتدئين",
      totalLessons: 12,
      isPublished: true,
    });

    const course2 = await ctx.db.insert("courses", {
      title: "تفسير سورة البقرة",
      description: "دراسة تفصيلية لسورة البقرة مع التطبيق العملي",
      fullDescription: "دورة متخصصة في تفسير سورة البقرة، أطول سور القرآن الكريم. سنتناول الآيات بالتفصيل مع ربطها بالواقع المعاصر والاستفادة العملية منها في حياتنا اليومية.",
      category: "tafsir" as const,
      instructorId: instructor2,
      targetAudience: "المتوسط",
      totalLessons: 20,
      isPublished: true,
    });

    const course3 = await ctx.db.insert("courses", {
      title: "العقيدة الإسلامية",
      description: "دراسة أركان الإيمان والعقيدة الصحيحة",
      fullDescription: "دورة شاملة في العقيدة الإسلامية تتناول أركان الإيمان الستة وتوضح العقيدة الصحيحة بالأدلة من الكتاب والسنة.",
      category: "aqeedah" as const,
      instructorId: instructor1,
      targetAudience: "جميع المستويات",
      totalLessons: 15,
      isPublished: true,
    });

    // Create sample lessons for course 1
    await ctx.db.insert("lessons", {
      courseId: course1,
      title: "مقدمة في الفقه",
      description: "تعريف الفقه وأهميته في حياة المسلم",
      order: 1,
      videoUrl: "https://example.com/video1",
    });

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: "أحكام الطهارة",
      description: "الوضوء والغسل والتيمم",
      order: 2,
      videoUrl: "https://example.com/video2",
    });

    await ctx.db.insert("lessons", {
      courseId: course1,
      title: "أحكام الصلاة",
      description: "شروط وأركان وواجبات الصلاة",
      order: 3,
      videoUrl: "https://example.com/video3",
    });

    // Create sample lessons for course 2
    await ctx.db.insert("lessons", {
      courseId: course2,
      title: "مقدمة سورة البقرة",
      description: "التعريف بسورة البقرة وسبب نزولها",
      order: 1,
      videoUrl: "https://example.com/video4",
    });

    await ctx.db.insert("lessons", {
      courseId: course2,
      title: "الآيات 1-20",
      description: "تفسير الآيات الأولى من سورة البقرة",
      order: 2,
      videoUrl: "https://example.com/video5",
    });

    // Create sample lessons for course 3
    await ctx.db.insert("lessons", {
      courseId: course3,
      title: "الإيمان بالله",
      description: "الركن الأول من أركان الإيمان",
      order: 1,
      videoUrl: "https://example.com/video6",
    });

    await ctx.db.insert("lessons", {
      courseId: course3,
      title: "الإيمان بالملائكة",
      description: "الركن الثاني من أركان الإيمان",
      order: 2,
      videoUrl: "https://example.com/video7",
    });

    return "Sample data created successfully";
  },
});
