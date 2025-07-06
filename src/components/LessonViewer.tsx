import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface LessonViewerProps {
  lesson: any;
  index: number;
}

export function LessonViewer({ lesson, index }: LessonViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const markComplete = useMutation(api.lessons.markComplete);
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkComplete = async () => {
    if (lesson.completed) return;
    
    try {
      setIsMarking(true);
      await markComplete({ 
        lessonId: lesson._id, 
        courseId: lesson.courseId 
      });
      toast.success("تم تسجيل إكمال الدرس!");
    } catch (error) {
      toast.error("حدث خطأ أثناء تسجيل إكمال الدرس");
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      lesson.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            lesson.completed 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-300 text-gray-600'
          }`}>
            {lesson.completed ? '✓' : index + 1}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
            <p className="text-sm text-gray-600">{lesson.description}</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-4">
            {lesson.videoUrl && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">الفيديو:</h5>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <a 
                    href={lesson.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    مشاهدة الفيديو
                  </a>
                </div>
              </div>
            )}

            {lesson.pdfResourceUrl && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">المواد التعليمية:</h5>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <a 
                    href={lesson.pdfResourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                  >
                    <span>📄</span>
                    تحميل PDF
                  </a>
                </div>
              </div>
            )}

            {lesson.zoomLink && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">الجلسة المباشرة:</h5>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <a 
                    href={lesson.zoomLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2"
                  >
                    <span>🎥</span>
                    انضم إلى الجلسة
                  </a>
                </div>
              </div>
            )}

            {!lesson.completed && (
              <button
                onClick={handleMarkComplete}
                disabled={isMarking}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isMarking ? 'جاري التسجيل...' : 'تسجيل إكمال الدرس'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
