import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface LessonFormData {
  title: string;
  description: string;
  order: number;
  videoUrl: string;
  zoomLink: string;
}

interface LessonManagementProps {
  courseId: Id<"courses">;
  courseName: string;
  onClose: () => void;
}

export function LessonManagement({ courseId, courseName, onClose }: LessonManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  
  const lessons = useQuery(api.admin.getCourseLessons, { courseId });
  const createLesson = useMutation(api.admin.createLesson);
  const updateLesson = useMutation(api.admin.updateLesson);
  const deleteLesson = useMutation(api.admin.deleteLesson);

  const [formData, setFormData] = useState<LessonFormData>({
    title: "",
    description: "",
    order: 1,
    videoUrl: "",
    zoomLink: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      order: lessons ? lessons.length + 1 : 1,
      videoUrl: "",
      zoomLink: "",
    });
    setEditingLesson(null);
    setShowCreateForm(false);
  };

  const handleEdit = (lesson: any) => {
    setFormData({
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      videoUrl: lesson.videoUrl || "",
      zoomLink: lesson.zoomLink || "",
    });
    setEditingLesson(lesson);
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingLesson) {
        await updateLesson({
          lessonId: editingLesson._id,
          ...formData,
          videoUrl: formData.videoUrl || undefined,
          zoomLink: formData.zoomLink || undefined,
        });
        toast.success("تم تحديث الدرس بنجاح");
      } else {
        await createLesson({
          courseId,
          ...formData,
          videoUrl: formData.videoUrl || undefined,
          zoomLink: formData.zoomLink || undefined,
        });
        toast.success("تم إنشاء الدرس بنجاح");
      }
      resetForm();
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (lessonId: Id<"lessons">) => {
    if (confirm("هل أنت متأكد من حذف هذا الدرس؟")) {
      try {
        await deleteLesson({ lessonId });
        toast.success("تم حذف الدرس");
      } catch (error) {
        toast.error("حدث خطأ في الحذف");
      }
    }
  };

  if (lessons === undefined) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">إدارة دروس الدورة</h2>
              <p className="text-gray-600">{courseName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">الدروس ({lessons.length})</h3>
            <button
              onClick={() => {
                setFormData({
                  title: "",
                  description: "",
                  order: lessons.length + 1,
                  videoUrl: "",
                  zoomLink: "",
                });
                setShowCreateForm(true);
              }}
              className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
            >
              إضافة درس جديد
            </button>
          </div>

          {/* Lessons List */}
          <div className="space-y-4">
            {lessons.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">لا توجد دروس بعد</h3>
                <p className="text-gray-500">ابدأ بإضافة الدرس الأول لهذه الدورة</p>
              </div>
            ) : (
              lessons.map((lesson) => (
                <div key={lesson._id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          الدرس {lesson.order}
                        </span>
                        <h4 className="text-lg font-bold text-gray-900">{lesson.title}</h4>
                      </div>
                      <p className="text-gray-600 mb-3">{lesson.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lesson.videoUrl && (
                          <div className="flex items-center gap-2">
                            <span className="text-red-600">🎥</span>
                            <a 
                              href={lesson.videoUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline truncate"
                            >
                              رابط الفيديو
                            </a>
                          </div>
                        )}
                        {lesson.zoomLink && (
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">📹</span>
                            <a 
                              href={lesson.zoomLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline truncate"
                            >
                              رابط الزوم
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(lesson)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(lesson._id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Create/Edit Form Modal */}
          {showCreateForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {editingLesson ? "تعديل الدرس" : "إضافة درس جديد"}
                    </h2>
                    <button
                      onClick={resetForm}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        عنوان الدرس
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="أدخل عنوان الدرس"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ترتيب الدرس
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      وصف الدرس
                    </label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="وصف مختصر للدرس"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الفيديو (اختياري)
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      رابط الزوم (اختياري)
                    </label>
                    <input
                      type="url"
                      value={formData.zoomLink}
                      onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      {editingLesson ? "تحديث الدرس" : "إضافة الدرس"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
