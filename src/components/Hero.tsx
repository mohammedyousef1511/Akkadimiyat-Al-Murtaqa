interface HeroProps {
  onViewCourses: () => void;
}

export function Hero({ onViewCourses }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-l from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <span className="text-4xl font-bold text-yellow-400">أ</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              أكاديمية المرتقى
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              منصة علمية تجمع بين أصالة العلم الشرعي وحداثة الوسائل
            </p>
            <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
              انضم إلى رحلة التعلم الشرعي مع نخبة من العلماء والمدرسين المتخصصين في بيئة تعليمية تفاعلية حديثة
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onViewCourses}
              className="px-8 py-4 bg-yellow-500 text-blue-900 font-bold rounded-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              استعرض الدورات
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 transition-all duration-300">
              تعرف علينا أكثر
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold mb-2">دورات متنوعة</h3>
              <p className="text-blue-200">فقه، تفسير، عقيدة، لغة عربية، وحديث</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-bold mb-2">مدرسون متخصصون</h3>
              <p className="text-blue-200">نخبة من العلماء والأكاديميين المتميزين</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold mb-2">شهادات معتمدة</h3>
              <p className="text-blue-200">احصل على شهادة إتمام لكل دورة تكملها</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
