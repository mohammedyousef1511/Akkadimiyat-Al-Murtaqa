import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

interface CourseModalProps {
  courseId: Id<"courses">;
  onClose: () => void;
}

export function CourseModal({ courseId, onClose }: CourseModalProps) {
  const course = useQuery(api.courses.getById, { courseId });
  const enroll = useMutation(api.courses.enroll);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      await enroll({ courseId });
      toast.success("تم التسجيل في الدورة بنجاح!");
      onClose();
    } catch (error) {
      toast.error("حدث خطأ أثناء التسجيل");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!course) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header Image */}
          <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 relative">
            {course.imageUrl ? (
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl text-blue-300">📚</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-blue-900 mb-4">{course.title}</h1>
                
                <div className="flex items-center gap-4 mb-6">
                  {course.instructor?.profileImageUrl ? (
                    <img
                      src={course.instructor.profileImageUrl}
                      alt={course.instructor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xl">
                        {course.instructor?.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{course.instructor?.name}</h3>
                    <p className="text-gray-600">{course.instructor?.specialization.join(', ')}</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">وصف الدورة</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {course.fullDescription}
                  </p>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">محتوى الدورة</h3>
                  <div className="space-y-3">
                    {course.lessons.map((lesson, index) => (
                      <div key={lesson._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-900">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-600">{lesson.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {lesson.videoUrl && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">فيديو</span>
                          )}
                          {lesson.pdfResource && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">PDF</span>
                          )}
                          {lesson.zoomLink && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">زووم</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:w-80">
                <div className="bg-gray-50 rounded-2xl p-6 sticky top-4">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الدروس:</span>
                      <span className="font-bold">{course.totalLessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الجمهور المستهدف:</span>
                      <span className="font-bold">{course.targetAudience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التصنيف:</span>
                      <span className="font-bold">
                        {course.category === 'fiqh' && 'الفقه'}
                        {course.category === 'tafsir' && 'التفسير'}
                        {course.category === 'aqeedah' && 'العقيدة'}
                        {course.category === 'arabic' && 'اللغة العربية'}
                        {course.category === 'hadith' && 'الحديث'}
                      </span>
                    </div>
                  </div>

                  {course.enrollment ? (
                    <div className="text-center">
                      <div className="bg-green-100 text-green-800 py-3 px-4 rounded-xl mb-4">
                        <span className="font-bold">مسجل في الدورة</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        التقدم: {course.enrollment.progress}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors disabled:opacity-50"
                    >
                      {isEnrolling ? 'جاري التسجيل...' : 'التسجيل في الدورة'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
