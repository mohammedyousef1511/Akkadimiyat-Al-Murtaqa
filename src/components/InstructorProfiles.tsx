import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function InstructorProfiles() {
  const instructors = useQuery(api.instructors.list);

  if (instructors === undefined) {
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
        <h2 className="text-4xl font-bold text-blue-900 mb-4">مدرسونا المتميزون</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          نخبة من العلماء والأكاديميين المتخصصين في العلوم الشرعية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {instructors.map((instructor) => (
          <div key={instructor._id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="p-6 text-center">
              <div className="mb-6">
                {instructor.profileImageUrl ? (
                  <img
                    src={instructor.profileImageUrl}
                    alt={instructor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 font-bold text-2xl">
                      {instructor.name.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-blue-900 mb-2">{instructor.name}</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {instructor.specialization.map((spec, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{instructor.bio}</p>

              <div className="border-t pt-4">
                <div className="flex justify-center items-center gap-4 text-sm text-gray-500">
                  <span>📚 {instructor.coursesCount} دورة</span>
                  {instructor.email && (
                    <span>✉️ {instructor.email}</span>
                  )}
                </div>
              </div>

              {instructor.courses.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-900 mb-3">الدورات التي يدرسها:</h4>
                  <div className="space-y-2">
                    {instructor.courses.slice(0, 3).map((course) => (
                      <div key={course._id} className="bg-gray-50 rounded-lg p-3 text-right">
                        <p className="font-medium text-gray-900 text-sm">{course.title}</p>
                      </div>
                    ))}
                    {instructor.courses.length > 3 && (
                      <p className="text-sm text-gray-500">و {instructor.courses.length - 3} دورات أخرى</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {instructors.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">👨‍🏫</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">لا يوجد مدرسون حالياً</h3>
          <p className="text-gray-500">سيتم إضافة المدرسين قريباً</p>
        </div>
      )}
    </section>
  );
}
