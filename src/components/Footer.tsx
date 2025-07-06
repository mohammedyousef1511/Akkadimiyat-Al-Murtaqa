export function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.png" 
                  alt="شعار أكاديمية المرتقى" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to text if image doesn't exist
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) nextElement.style.display = 'block';
                  }}
                />
                <span className="text-blue-900 font-bold text-lg hidden">أ</span>
              </div>
              <h3 className="text-xl font-bold">أكاديمية المرتقى</h3>
            </div>
            <p className="text-blue-200 mb-4 max-w-md">
              منصة علمية تجمع بين أصالة العلم الشرعي وحداثة الوسائل التعليمية، 
              نسعى لنشر العلم النافع وتعليم الأجيال أحكام دينهم.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span>📘</span>
              </a>
              <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span>📱</span>
              </a>
              <a href="#" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <span>📧</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-blue-200">
              <li><a href="#" className="hover:text-white transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">الدورات</a></li>
              <li><a href="#" className="hover:text-white transition-colors">المدرسون</a></li>
              <li><a href="#" className="hover:text-white transition-colors">من نحن</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-blue-200">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span>info@almurtaqa.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <span>+966 50 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
          <p>&copy; 2024 أكاديمية المرتقى. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
