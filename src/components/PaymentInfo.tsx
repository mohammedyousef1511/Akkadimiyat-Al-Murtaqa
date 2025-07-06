import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function PaymentInfo() {
  const paymentInfo = useQuery(api.payment.getPaymentInfo);

  if (!paymentInfo) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">معلومات الدفع</h2>
          <p className="text-gray-600">معلومات الدفع غير متوفرة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">{paymentInfo.title}</h2>
          <p className="text-xl text-gray-600">{paymentInfo.description}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">تفاصيل الحساب البنكي</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">🏦</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">اسم البنك</h4>
                  <p className="text-gray-600">{paymentInfo.bankName}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600">👤</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">اسم صاحب الحساب</h4>
                  <p className="text-gray-600">{paymentInfo.accountName}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600">🔢</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">رقم الحساب</h4>
                  <p className="text-gray-600 font-mono text-lg">{paymentInfo.accountNumber}</p>
                </div>
              </div>
            </div>

            {paymentInfo.iban && (
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">🌐</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">رقم الآيبان (IBAN)</h4>
                    <p className="text-gray-600 font-mono text-lg">{paymentInfo.iban}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-l from-blue-900 to-blue-800 text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">تعليمات الدفع</h3>
          <div className="text-blue-200 leading-relaxed whitespace-pre-line">
            {paymentInfo.instructions}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-yellow-600">⚠️</span>
            </div>
            <div>
              <h4 className="font-bold text-yellow-800 mb-2">تنبيه مهم</h4>
              <p className="text-yellow-700">
                يرجى الاحتفاظ بإيصال التحويل وإرساله إلينا عبر البريد الإلكتروني أو الواتساب لتأكيد عملية الدفع وتفعيل اشتراكك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
