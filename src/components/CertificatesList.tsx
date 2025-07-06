interface CertificatesListProps {
  certificates: any[];
}

export function CertificatesList({ certificates }: CertificatesListProps) {
  if (certificates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-2xl font-bold text-gray-600 mb-2">لا توجد شهادات بعد</h3>
        <p className="text-gray-500">أكمل دوراتك للحصول على الشهادات</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {certificates.map((certificate) => (
        <div key={certificate._id} className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">شهادة إتمام</h3>
            <h4 className="text-lg font-semibold text-blue-900 mb-4">{certificate.course?.title}</h4>
            
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p>المدرس: {certificate.instructor?.name}</p>
              <p>تاريخ الإصدار: {new Date(certificate.issuedAt).toLocaleDateString('ar-SA')}</p>
              <p>رقم الشهادة: {certificate.certificateId}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-300">
              <p className="text-xs text-gray-500 mb-2">هذه الشهادة تؤكد أن</p>
              <p className="font-bold text-lg text-gray-900 mb-2">{certificate.user?.name || certificate.user?.email}</p>
              <p className="text-xs text-gray-500 mb-2">قد أكمل بنجاح دورة</p>
              <p className="font-semibold text-blue-900">{certificate.course?.title}</p>
            </div>

            <button className="mt-4 w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
              تحميل الشهادة
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
