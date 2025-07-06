import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { CourseModal } from "./CourseModal";
import { Id } from "../../convex/_generated/dataModel";

const categories = [
  { id: 'all', name: 'جميع الدورات', icon: '📚' },
  { id: 'fiqh', name: 'الفقه', icon: '⚖️' },
  { id: 'tafsir', name: 'التفسير', icon: '📖' },
  { id: 'aqeedah', name: 'العقيدة', icon: '🕌' },
  { id: 'arabic', name: 'اللغة العربية', icon: '✍️' },
  { id: 'hadith', name: 'الحديث', icon: '📜' },
];

export function CoursesCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<Id<"courses"> | null>(null);
  
  const courses = useQuery(api.courses.list, {
    category: selectedCategory === 'all' ? undefined : selectedCategory as any,
  });

  if (courses === undefined) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-blue-900 mb-4">دوراتنا التعليمية</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          اختر من مجموعة متنوعة من الدورات الشرعية المصممة لتناسب جميع المستويات
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-blue-900 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <span>{category.icon}</span>
            <span className="font-medium">{category.name}</span>
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => setSelectedCourseId(course._id)}
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-blue-300">
                    {categories.find(c => c.id === course.category)?.icon || '📚'}
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-blue-900">
                {categories.find(c => c.id === course.category)?.name}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                {course.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {course.description}
              </p>

              <div className="flex items-center gap-3 mb-4">
                {course.instructor?.profileImageUrl ? (
                  <img
                    src={course.instructor.profileImageUrl}
                    alt={course.instructor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {course.instructor?.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{course.instructor?.name}</p>
                  <p className="text-sm text-gray-500">{course.totalLessons} درس</p>
                </div>
              </div>

              <button className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
                التسجيل في الدورة
              </button>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">لا توجد دورات متاحة</h3>
          <p className="text-gray-500">سيتم إضافة دورات جديدة قريباً</p>
        </div>
      )}

      {/* Course Modal */}
      {selectedCourseId && (
        <CourseModal
          courseId={selectedCourseId}
          onClose={() => setSelectedCourseId(null)}
        />
      )}
    </section>
  );
}
