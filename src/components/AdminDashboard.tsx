import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { CreateCourseForm } from "./CreateCourseForm";
import { CreateInstructorForm } from "./CreateInstructorForm";
import { PaymentManagement } from "./PaymentManagement";
import { LessonManagement } from "./LessonManagement";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'instructors' | 'students' | 'payment'>('overview');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateInstructor, setShowCreateInstructor] = useState(false);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<{id: Id<"courses">, name: string} | null>(null);
  
  const stats = useQuery(api.admin.getStats);
  const courses = useQuery(api.admin.getAllCourses);
  const instructors = useQuery(api.admin.getAllInstructors);
  const students = useQuery(api.admin.getAllStudents);
  
  const toggleCourseStatus = useMutation(api.admin.toggleCourseStatus);
  const deleteInstructor = useMutation(api.admin.deleteInstructor);
  const deleteCourse = useMutation(api.admin.deleteCourse);
  
  if (stats === undefined) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900"></div>
        </div>
      </div>
    );
  }

  const handleToggleCourse = async (courseId: Id<"courses">, isPublished: boolean) => {
    try {
      await toggleCourseStatus({ courseId, isPublished: !isPublished });
      toast.success(isPublished ? "تم إخفاء الدورة" : "تم نشر الدورة");
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleDeleteInstructor = async (instructorId: Id<"instructors">) => {
    if (confirm("هل أنت متأكد من حذف هذا المدرس؟")) {
      try {
        await deleteInstructor({ instructorId });
        toast.success("تم حذف المدرس");
      } catch (error) {
        toast.error("حدث خطأ في الحذف");
      }
    }
  };

  const handleDeleteCourse = async (courseId: Id<"courses">) => {
    if (confirm("هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع الدروس المرتبطة بها.")) {
      try {
        await deleteCourse({ courseId });
        toast.success("تم حذف الدورة");
      } catch (error) {
        toast.error("حدث خطأ في الحذف - قد تحتوي الدورة على طلاب مسجلين");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-l from-red-900 to-red-800 text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
              <p className="text-red-200">إدارة شاملة للأكاديمية</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalCourses}</div>
              <div className="text-red-200">إجمالي الدورات</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalInstructors}</div>
              <div className="text-red-200">المدرسون</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalStudents}</div>
              <div className="text-red-200">الطلاب</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold mb-2">{stats.totalEnrollments}</div>
              <div className="text-red-200">التسجيلات</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: 'overview', name: 'نظرة عامة', icon: '📊' },
            { id: 'courses', name: 'الدورات', icon: '📚' },
            { id: 'instructors', name: 'المدرسون', icon: '👨‍🏫' },
            { id: 'students', name: 'الطلاب', icon: '👨‍🎓' },
            { id: 'payment', name: 'معلومات الدفع', icon: '💳' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">النشاط الأخير</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600">✅</span>
                  </div>
                  <div>
                    <p className="font-medium">تم إنشاء دورة جديدة</p>
                    <p className="text-sm text-gray-500">منذ ساعتين</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600">👤</span>
                  </div>
                  <div>
                    <p className="font-medium">انضم طالب جديد</p>
                    <p className="text-sm text-gray-500">منذ 3 ساعات</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600">📝</span>
                  </div>
                  <div>
                    <p className="font-medium">تم تحديث محتوى دورة</p>
                    <p className="text-sm text-gray-500">منذ يوم</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowCreateCourse(true)}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
                >
                  <div className="text-2xl mb-2">➕</div>
                  <div className="font-medium text-blue-900">إضافة دورة</div>
                </button>
                <button 
                  onClick={() => setShowCreateInstructor(true)}
                  className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors text-center"
                >
                  <div className="text-2xl mb-2">👨‍🏫</div>
                  <div className="font-medium text-green-900">إضافة مدرس</div>
                </button>
                <button 
                  onClick={() => setActiveTab('payment')}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center"
                >
                  <div className="text-2xl mb-2">💳</div>
                  <div className="font-medium text-purple-900">إدارة الدفع</div>
                </button>
                <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors text-center">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-medium text-orange-900">الإعدادات</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && courses && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">إدارة الدورات</h3>
                <button 
                  onClick={() => setShowCreateCourse(true)}
                  className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  إضافة دورة جديدة
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدورة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدرس</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التصنيف</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدروس</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطلاب</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {course.imageUrl ? (
                            <img src={course.imageUrl} alt={course.title} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600">📚</span>
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{course.title}</div>
                            <div className="text-sm text-gray-500">{course.totalLessons} درس مخطط</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{course.instructor?.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {course.category === 'fiqh' && 'الفقه'}
                          {course.category === 'tafsir' && 'التفسير'}
                          {course.category === 'aqeedah' && 'العقيدة'}
                          {course.category === 'arabic' && 'اللغة العربية'}
                          {course.category === 'hadith' && 'الحديث'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{course.actualLessons} فعلي</div>
                          <div className="text-gray-500">من {course.totalLessons}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{course.enrollmentCount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {course.isPublished ? 'منشورة' : 'مخفية'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedCourseForLessons({id: course._id, name: course.title})}
                            className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                          >
                            الدروس
                          </button>
                          <button
                            onClick={() => handleToggleCourse(course._id, course.isPublished)}
                            className={`px-3 py-1 text-xs rounded ${
                              course.isPublished
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {course.isPublished ? 'إخفاء' : 'نشر'}
                          </button>
                          <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'instructors' && instructors && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">إدارة المدرسين</h3>
                <button 
                  onClick={() => setShowCreateInstructor(true)}
                  className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                >
                  إضافة مدرس جديد
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {instructors.map((instructor) => (
                <div key={instructor._id} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {instructor.profileImageUrl ? (
                      <img src={instructor.profileImageUrl} alt={instructor.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">{instructor.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900">{instructor.name}</h4>
                      <p className="text-sm text-gray-600">{instructor.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">{instructor.bio}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {instructor.specialization.map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    الدورات: {instructor.coursesCount}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-100 text-blue-800 py-2 rounded-lg text-sm hover:bg-blue-200 transition-colors">
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteInstructor(instructor._id)}
                      className="flex-1 bg-red-100 text-red-800 py-2 rounded-lg text-sm hover:bg-red-200 transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'students' && students && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">إدارة الطلاب</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الطالب</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البريد الإلكتروني</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدورات المسجلة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدورات المكتملة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ التسجيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold">
                              {student.name?.charAt(0) || student.email?.charAt(0)}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900">
                            {student.name || 'غير محدد'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.enrolledCourses}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{student.completedCourses}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(student._creationTime).toLocaleDateString('ar-SA')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <PaymentManagement />
          </div>
        )}

        {/* Modals */}
        {showCreateCourse && (
          <CreateCourseForm
            onClose={() => setShowCreateCourse(false)}
            onSuccess={() => {
              // Refresh data will happen automatically due to Convex reactivity
            }}
          />
        )}

        {showCreateInstructor && (
          <CreateInstructorForm
            onClose={() => setShowCreateInstructor(false)}
            onSuccess={() => {
              // Refresh data will happen automatically due to Convex reactivity
            }}
          />
        )}

        {selectedCourseForLessons && (
          <LessonManagement
            courseId={selectedCourseForLessons.id}
            courseName={selectedCourseForLessons.name}
            onClose={() => setSelectedCourseForLessons(null)}
          />
        )}
      </div>
    </div>
  );
}
