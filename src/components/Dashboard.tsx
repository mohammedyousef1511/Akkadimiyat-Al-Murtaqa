import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { CourseProgress } from "./CourseProgress";
import { CertificatesList } from "./CertificatesList";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates'>('courses');
  const user = useQuery(api.auth.loggedInUser);
  const enrollments = useQuery(api.courses.getUserEnrollments);
  const certificates = useQuery(api.certificates.getUserCertificates);

  if (!user || enrollments === undefined || certificates === undefined) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.progress === 100).length;
  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-l from-blue-900 to-blue-800 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍🎓</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">مرحباً، {user.name || user.email}</h1>
              <p className="text-blue-200">لوحة التحكم الشخصية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">{enrollments.length}</div>
              <div className="text-blue-200">إجمالي الدورات</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">{inProgressCourses}</div>
              <div className="text-blue-200">دورات قيد التقدم</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">{completedCourses}</div>
              <div className="text-blue-200">دورات مكتملة</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 rounded-xl font-bold transition-colors ${
              activeTab === 'courses'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            دوراتي
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-6 py-3 rounded-xl font-bold transition-colors ${
              activeTab === 'certificates'
                ? 'bg-blue-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            شهاداتي ({certificates.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'courses' && (
          <div>
            {enrollments.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-2">لم تسجل في أي دورة بعد</h3>
                <p className="text-gray-500">ابدأ رحلتك التعليمية بالتسجيل في إحدى دوراتنا</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrollments.map((enrollment) => (
                  <CourseProgress key={enrollment._id} enrollment={enrollment} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && <CertificatesList certificates={certificates} />}
      </div>
    </div>
  );
}
