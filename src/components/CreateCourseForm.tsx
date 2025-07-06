import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface CreateCourseFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCourseForm({ onClose, onSuccess }: CreateCourseFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fullDescription: "",
    category: "fiqh" as const,
    instructorId: "" as Id<"instructors">,
    targetAudience: "",
    totalLessons: 1,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const instructors = useQuery(api.instructors.list);
  const createCourse = useMutation(api.admin.createCourse);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instructorId) {
      toast.error("يرجى اختيار مدرس");
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageId: Id<"_storage"> | undefined;
      
      if (selectedImage) {
        // Upload image
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": selectedImage.type },
          body: selectedImage,
        });
        
        if (!result.ok) {
          throw new Error("فشل في رفع الصورة");
        }
        
        const { storageId } = await result.json();
        imageId = storageId;
      }

      await createCourse({
        ...formData,
        image: imageId,
      });
      
      toast.success("تم إنشاء الدورة بنجاح");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("حدث خطأ في إنشاء الدورة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">إنشاء دورة جديدة</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              عنوان الدورة
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل عنوان الدورة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة الدورة
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="course-image"
              />
              <label
                htmlFor="course-image"
                className="px-4 py-2 bg-blue-100 text-blue-900 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
              >
                اختر صورة
              </label>
              {imagePreview && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border">
                  <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف مختصر
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="وصف مختصر للدورة"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الوصف التفصيلي
            </label>
            <textarea
              required
              value={formData.fullDescription}
              onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="وصف تفصيلي للدورة"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التصنيف
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="fiqh">الفقه</option>
                <option value="tafsir">التفسير</option>
                <option value="aqeedah">العقيدة</option>
                <option value="arabic">اللغة العربية</option>
                <option value="hadith">الحديث</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المدرس
              </label>
              <select
                required
                value={formData.instructorId}
                onChange={(e) => setFormData({ ...formData, instructorId: e.target.value as Id<"instructors"> })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">اختر المدرس</option>
                {instructors?.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الجمهور المستهدف
              </label>
              <input
                type="text"
                required
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: المبتدئين"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد الدروس
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.totalLessons}
                onChange={(e) => setFormData({ ...formData, totalLessons: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "جاري الإنشاء..." : "إنشاء الدورة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
