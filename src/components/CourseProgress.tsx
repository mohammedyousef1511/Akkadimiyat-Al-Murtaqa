import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LessonViewer } from "./LessonViewer";

interface CourseProgressProps {
  enrollment: any;
}

export function CourseProgress({ enrollment }: CourseProgressProps) {
  const [showLessons, setShowLessons] = useState(false);
  const lessons = useQuery(api.lessons.getByCourse, { 
    courseId: enrollment.courseId 
  });

  if (!enrollment.course) return null;

  const course = enrollment.course;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative h-32 bg-gradient-to-br from-blue-100 to-blue-200">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-blue-300">📚</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-blue-900">
          {enrollment.progress}% مكتمل
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-3 mb-4">
          {course.instructor?.profileImage ? (
            <img
              src={course.instructor.profileImage}
              alt={course.instructor.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">
                {course.instructor?.name.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm text-gray-600">{course.instructor?.name}</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>التقدم</span>
            <span>{enrollment.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${enrollment.progress}%` }}
            ></div>
          </div>
        </div>

        {enrollment.progress === 100 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <span>🎉</span>
              <span className="font-bold">تهانينا! لقد أكملت هذه الدورة</span>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowLessons(!showLessons)}
          className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors"
        >
          {showLessons ? 'إخفاء الدروس' : 'عرض الدروس'}
        </button>

        {showLessons && lessons && (
          <div className="mt-6 space-y-3">
            {lessons.map((lesson, index) => (
              <LessonViewer key={lesson._id} lesson={lesson} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
