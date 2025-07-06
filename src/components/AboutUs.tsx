export function AboutUs() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">من نحن</h2>
          <p className="text-xl text-gray-600">
            أكاديمية المرتقى - رحلتك نحو العلم الشرعي الأصيل
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-blue-900 mb-6">رؤيتنا</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              نسعى لأن نكون المنصة الرائدة في التعليم الشرعي الرقمي، حيث نجمع بين أصالة العلم الشرعي 
              وحداثة الوسائل التعليمية لنقدم تجربة تعليمية متميزة تناسب احتياجات العصر.
            </p>
            <p className="text-gray-700 leading-relaxed">
              نؤمن بأن العلم الشرعي حق للجميع، ونعمل على تسهيل الوصول إليه من خلال منصة تفاعلية 
              حديثة تجمع بين الجودة والسهولة في التعلم.
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h4 className="text-xl font-bold text-blue-900 mb-4">هدفنا</h4>
            <p className="text-gray-700">
              إعداد جيل واعٍ بأحكام دينه، متمكن من علومه الشرعية، قادر على التعامل مع تحديات العصر 
              بفهم صحيح وبصيرة نافذة.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h4 className="text-xl font-bold text-blue-900 mb-4">منهجية علمية</h4>
            <p className="text-gray-600">
              نعتمد على منهجية علمية دقيقة في تقديم المحتوى، مع مراعاة التدرج في التعليم والتطبيق العملي.
            </p>
          </div>

          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👥</span>
            </div>
            <h4 className="text-xl font-bold text-blue-900 mb-4">تفاعل مجتمعي</h4>
            <p className="text-gray-600">
              نوفر بيئة تعليمية تفاعلية تشجع على النقاش البناء وتبادل الخبرات بين الطلاب والمدرسين.
            </p>
          </div>

          <div className="text-center bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h4 className="text-xl font-bold text-blue-900 mb-4">جودة عالية</h4>
            <p className="text-gray-600">
              نحرص على تقديم محتوى عالي الجودة من خلال نخبة من العلماء والمتخصصين في العلوم الشرعية.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-l from-blue-900 to-blue-800 text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">انضم إلى رحلة التعلم</h3>
          <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
            ابدأ رحلتك في تعلم العلوم الشرعية اليوم واكتشف عالماً من المعرفة والحكمة مع أكاديمية المرتقى
          </p>
          <button className="bg-yellow-500 text-blue-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors">
            ابدأ التعلم الآن
          </button>
        </div>
      </div>
    </section>
  );
}
