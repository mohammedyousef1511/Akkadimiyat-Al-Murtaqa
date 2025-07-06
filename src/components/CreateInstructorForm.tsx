import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface CreateInstructorFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateInstructorForm({ onClose, onSuccess }: CreateInstructorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
    specialization: [""],
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createInstructor = useMutation(api.admin.createInstructor);
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
    
    const filteredSpecialization = formData.specialization.filter(s => s.trim() !== "");
    if (filteredSpecialization.length === 0) {
      toast.error("يرجى إضافة تخصص واحد على الأقل");
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

      await createInstructor({
        ...formData,
        specialization: filteredSpecialization,
        email: formData.email || undefined,
        profileImage: imageId,
      });
      
      toast.success("تم إنشاء المدرس بنجاح");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("حدث خطأ في إنشاء المدرس");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSpecialization = () => {
    setFormData({
      ...formData,
      specialization: [...formData.specialization, ""],
    });
  };

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter((_, i) => i !== index),
    });
  };

  const updateSpecialization = (index: number, value: string) => {
    const newSpecialization = [...formData.specialization];
    newSpecialization[index] = value;
    setFormData({
      ...formData,
      specialization: newSpecialization,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">إضافة مدرس جديد</h2>
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
              اسم المدرس
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="أدخل اسم المدرس"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              صورة المدرس
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="instructor-image"
              />
              <label
                htmlFor="instructor-image"
                className="px-4 py-2 bg-green-100 text-green-900 rounded-lg cursor-pointer hover:bg-green-200 transition-colors"
              >
                اختر صورة
              </label>
              {imagePreview && (
                <div className="w-20 h-20 rounded-full overflow-hidden border">
                  <img src={imagePreview} alt="معاينة" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="البريد الإلكتروني"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              السيرة الذاتية
            </label>
            <textarea
              required
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="نبذة عن المدرس وخبراته"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التخصصات
            </label>
            <div className="space-y-3">
              {formData.specialization.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={spec}
                    onChange={(e) => updateSpecialization(index, e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: الفقه الإسلامي"
                  />
                  {formData.specialization.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      حذف
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSpecialization}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                + إضافة تخصص
              </button>
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
              className="flex-1 px-6 py-3 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة المدرس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
