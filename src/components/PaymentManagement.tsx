import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface PaymentFormData {
  title: string;
  description: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  iban: string;
  instructions: string;
}

export function PaymentManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  
  const paymentInfoList = useQuery(api.payment.getAllPaymentInfo);
  const createPaymentInfo = useMutation(api.payment.createPaymentInfo);
  const updatePaymentInfo = useMutation(api.payment.updatePaymentInfo);
  const togglePaymentInfoStatus = useMutation(api.payment.togglePaymentInfoStatus);
  const deletePaymentInfo = useMutation(api.payment.deletePaymentInfo);

  const [formData, setFormData] = useState<PaymentFormData>({
    title: "",
    description: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    iban: "",
    instructions: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      iban: "",
      instructions: "",
    });
    setEditingPayment(null);
    setShowCreateForm(false);
  };

  const handleEdit = (payment: any) => {
    setFormData({
      title: payment.title,
      description: payment.description,
      bankName: payment.bankName,
      accountNumber: payment.accountNumber,
      accountName: payment.accountName,
      iban: payment.iban || "",
      instructions: payment.instructions,
    });
    setEditingPayment(payment);
    setShowCreateForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPayment) {
        await updatePaymentInfo({
          paymentInfoId: editingPayment._id,
          ...formData,
          iban: formData.iban || undefined,
        });
        toast.success("تم تحديث معلومات الدفع بنجاح");
      } else {
        await createPaymentInfo({
          ...formData,
          iban: formData.iban || undefined,
        });
        toast.success("تم إنشاء معلومات الدفع بنجاح");
      }
      resetForm();
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleToggleStatus = async (paymentId: Id<"paymentInfo">, isActive: boolean) => {
    try {
      await togglePaymentInfoStatus({ paymentInfoId: paymentId, isActive: !isActive });
      toast.success(isActive ? "تم إلغاء تفعيل معلومات الدفع" : "تم تفعيل معلومات الدفع");
    } catch (error) {
      toast.error("حدث خطأ");
    }
  };

  const handleDelete = async (paymentId: Id<"paymentInfo">) => {
    if (confirm("هل أنت متأكد من حذف معلومات الدفع هذه؟")) {
      try {
        await deletePaymentInfo({ paymentInfoId: paymentId });
        toast.success("تم حذف معلومات الدفع");
      } catch (error) {
        toast.error("حدث خطأ في الحذف");
      }
    }
  };

  if (paymentInfoList === undefined) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">إدارة معلومات الدفع</h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
        >
          إضافة معلومات دفع جديدة
        </button>
      </div>

      {/* Payment Info List */}
      <div className="grid grid-cols-1 gap-6">
        {paymentInfoList.map((payment) => (
          <div key={payment._id} className="bg-white border rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{payment.title}</h4>
                <p className="text-gray-600">{payment.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  payment.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {payment.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">البنك:</span>
                <p className="font-medium">{payment.bankName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">اسم صاحب الحساب:</span>
                <p className="font-medium">{payment.accountName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">رقم الحساب:</span>
                <p className="font-mono">{payment.accountNumber}</p>
              </div>
              {payment.iban && (
                <div>
                  <span className="text-sm text-gray-500">الآيبان:</span>
                  <p className="font-mono">{payment.iban}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(payment)}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
              >
                تعديل
              </button>
              <button
                onClick={() => handleToggleStatus(payment._id, payment.isActive)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  payment.isActive
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {payment.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
              </button>
              <button
                onClick={() => handleDelete(payment._id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPayment ? "تعديل معلومات الدفع" : "إضافة معلومات دفع جديدة"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العنوان
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: معلومات الدفع"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="وصف معلومات الدفع"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم البنك
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: البنك الأهلي السعودي"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم صاحب الحساب
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم صاحب الحساب"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الحساب
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="رقم الحساب"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رقم الآيبان (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="SA0000000000000000000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تعليمات الدفع
                </label>
                <textarea
                  required
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                  placeholder="تعليمات مفصلة للدفع..."
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
                  {editingPayment ? "تحديث" : "إنشاء"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
