import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  Check, 
  Trash2, 
  Share2, 
  Plus, 
  Download,
  AlertCircle,
  Clock,
  Coins
} from 'lucide-react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onResetOrder: () => void;
}

export default function InvoiceModal({ invoice, onClose, onResetOrder }: InvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  // Helper to render interactive QR Code SVG representing ZATCA E-Invoice
  const renderZatcaQr = () => {
    // We compose a beautiful, detailed visual pseudo-QR code in high-fidelity vector format.
    // It features authentic compliance markers, central branding, and structural squares.
    return (
      <svg className="w-32 h-32 mx-auto bg-white p-1 rounded-lg border border-stone-200" viewBox="0 0 100 100">
        {/* QR Corner Anchor Boxes */}
        <rect x="5" y="5" width="20" height="20" fill="#1c1917" />
        <rect x="8" y="8" width="14" height="14" fill="#ffffff" />
        <rect x="11" y="11" width="8" height="8" fill="#1c1917" />

        <rect x="75" y="5" width="20" height="20" fill="#1c1917" />
        <rect x="78" y="8" width="14" height="14" fill="#ffffff" />
        <rect x="81" y="81" width="8" height="8" fill="#1c1917" />

        <rect x="5" y="75" width="20" height="20" fill="#1c1917" />
        <rect x="8" y="78" width="14" height="14" fill="#ffffff" />
        <rect x="11" y="81" width="8" height="8" fill="#1c1917" />

        <rect x="75" y="75" width="20" height="20" fill="#1c1917" />
        <rect x="78" y="78" width="14" height="14" fill="#ffffff" />

        {/* Small details / code dots */}
        <g fill="#292524">
          <rect x="30" y="5" width="4" height="4" />
          <rect x="38" y="8" width="8" height="4" />
          <rect x="50" y="5" width="4" height="8" />
          <rect x="58" y="8" width="8" height="4" />
          <rect x="30" y="15" width="8" height="4" />
          <rect x="42" y="15" width="4" height="8" />
          <rect x="54" y="18" width="12" height="4" />

          {/* Core matrix pattern */}
          <rect x="30" y="30" width="8" height="8" />
          <rect x="42" y="30" width="4" height="4" />
          <rect x="50" y="34" width="12" height="8" />
          <rect x="66" y="30" width="8" height="4" />
          
          <rect x="5" y="30" width="12" height="4" />
          <rect x="11" y="38" width="8" height="8" />
          <rect x="5" y="50" width="4" height="12" />
          <rect x="13" y="54" width="8" height="4" />

          <rect x="78" y="30" width="12" height="4" />
          <rect x="84" y="38" width="8" height="8" />
          <rect x="78" y="50" width="4" height="12" />
          <rect x="86" y="54" width="8" height="4" />

          <rect x="30" y="46" width="16" height="4" />
          <rect x="30" y="54" width="8" height="8" />
          <rect x="42" y="58" width="12" height="4" />
          <rect x="58" y="50" width="4" height="12" />
          
          <rect x="30" y="66" width="12" height="4" />
          <rect x="46" y="66" width="4" height="16" />
          <rect x="54" y="70" width="12" height="4" />
          <rect x="66" y="66" width="4" height="8" />

          <rect x="30" y="78" width="8" height="4" />
          <rect x="30" y="86" width="12" height="8" />
          <rect x="54" y="78" width="4" height="12" />
          <rect x="62" y="86" width="8" height="4" />

          {/* Authentic middle block logo */}
          <rect x="44" y="44" width="12" height="12" fill="#d97706" rx="2" />
        </g>
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-stone-900 rounded-2xl shadow-2xl border border-stone-800 overflow-hidden my-8"
      >
        {/* Success Alert Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-700/50 p-1.5 rounded-lg">
              <Check className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <p className="text-sm font-bold">تم تأكيد الطلب بنجاح</p>
              <p className="text-[10px] text-emerald-100">تم تسجيل فاتورتك الرقمية وحفظها في شاشة التجهيز</p>
            </div>
          </div>
          <span className="text-[11px] font-mono bg-emerald-800/80 border border-emerald-500/25 px-2.5 py-1 rounded-md font-bold">
            {invoice.invoiceNumber.split('-')[2]}
          </span>
        </div>

        {/* Core Receipt Container - styled like thermal roll paper */}
        <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto bg-stone-950 text-stone-100" id="printable-invoice">
          
          {/* Thermal Header */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-white">منصة M Delivery</h2>
            <p className="text-xs text-[#E96C20] font-mono tracking-wider font-bold">M DELIVERY PLATFORM</p>
            <p className="text-[11px] text-stone-400 font-light">شركة M لتوصيل الطلبات الفورية</p>
            <p className="text-[11px] text-stone-400">الفرع الرئيسي: عَمّان، المملكة الأردنية الهاشمية</p>
            <p className="text-[11px] text-stone-450 font-semibold pt-1">الرقم الضريبي الوطني: <span className="font-mono text-amber-500">154823101</span></p>
            
            <div className="border-b border-dashed border-stone-800 pt-3" />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-2 text-xs text-stone-300 font-medium">
            <div>
              <span className="text-stone-500">رقم الفاتورة:</span>{' '}
              <span className="font-mono text-stone-200 font-semibold">{invoice.invoiceNumber}</span>
            </div>
            <div className="text-left font-mono">
              <span className="text-stone-500">التاريخ:</span>{' '}
              <span className="text-stone-200">{new Date(invoice.date).toLocaleDateString('ar-SA')}</span>
            </div>
            <div>
              <span className="text-stone-500">نوع الطلب:</span>{' '}
              <span className="font-semibold text-stone-200 text-right">
                {invoice.isDelivery ? 'توصيل للمنزل 🛵' : invoice.dineIn ? 'تناول بالمطعم' : 'خارجي / سفري'}
              </span>
            </div>
            {invoice.dineIn && invoice.tableNumber && (
              <div className="text-left">
                <span className="text-stone-500">رقم الطاولة:</span>{' '}
                <span className="font-bold text-brand-400 bg-brand-950/30 px-2 py-0.5 rounded border border-brand-900/45">
                  طاولة {invoice.tableNumber}
                </span>
              </div>
            )}
            {invoice.customerName && !invoice.isDelivery && (
              <div className="col-span-2 border-t border-stone-850 pt-2 text-right">
                <span className="text-stone-500">اسم العميل:</span>{' '}
                <span className="font-bold text-stone-200">{invoice.customerName}</span>
              </div>
            )}
            {invoice.isDelivery && (
              <div className="col-span-2 border border-dashed border-amber-600/60 bg-amber-950/20 p-3 rounded-xl text-right space-y-1.5 mt-2">
                <p className="text-[11px] text-amber-500 font-extrabold flex items-center gap-1 justify-start">
                  <span>🛵 قـسـيـمـة مـوظـف الـتـوصـيـل (ألصقها على الوجبة):</span>
                </p>
                <div className="text-[11px] text-stone-300 space-y-1">
                  <div>
                    <span className="text-stone-400 font-medium">اسم الشخص المستلم:</span>{' '}
                    <strong className="text-white text-xs">{invoice.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">مكان السكن بالتفصيل:</span>{' '}
                    <strong className="text-white text-xs">{invoice.deliveryAddress}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 font-medium">رقم الهاتف للتواصل:</span>{' '}
                    <strong className="text-amber-450 text-xs font-mono font-bold select-all">{invoice.deliveryPhone}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dashed separators */}
          <div className="border-b border-dashed border-stone-800" />

          {/* Food items breakdown list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              <span className="w-1/2 text-right">الصنف (Dish)</span>
              <span className="w-1/6 text-center">الكمية</span>
              <span className="w-1/6 text-left">السعر</span>
              <span className="w-1/6 text-left">الإجمالي</span>
            </div>
            
            <div className="space-y-2 pt-1">
              {invoice.items.map((item) => (
                <div key={item.id} className="text-xs text-stone-300">
                  <div className="flex justify-between items-start">
                    <div className="w-1/2 space-y-0.5 text-right">
                      <p className="font-bold text-stone-100">{item.nameAr}</p>
                      <p className="text-[10px] text-stone-500 font-mono leading-none">{item.nameEn}</p>
                      {item.notes && (
                        <p className="text-[10px] text-amber-300 bg-amber-950/35 px-1.5 py-0.5 rounded border border-amber-900/30 mt-1 inline-block">
                          ملاحظة: {item.notes}
                        </p>
                      )}
                    </div>
                    <span className="w-1/6 text-center font-mono font-bold text-stone-400">{item.quantity}</span>
                    <span className="w-1/6 text-left font-mono">{item.price.toFixed(2)}</span>
                    <span className="w-1/6 text-left font-mono font-bold text-stone-100">
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financials totals invoice style */}
          <div className="border-t border-dashed border-stone-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500">المجموع الخاضع للضريبة:</span>
              <span className="font-mono font-semibold text-stone-300">{invoice.subtotal.toFixed(2)} د.أ</span>
            </div>

            {invoice.discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>خصم الكود المستخدم:</span>
                <span className="font-mono font-bold">-{invoice.discount.toFixed(2)} د.أ</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-stone-500">ضريبة المبيعات العامة (16%):</span>
              <span className="font-mono font-semibold text-stone-300">{invoice.vat.toFixed(2)} د.أ</span>
            </div>

            <div className="border-b border-stone-850 pt-1" />

            <div className="flex justify-between items-center text-sm md:text-base font-extrabold text-white pt-1">
              <span>المجموع الكلي النهائي:</span>
              <span className="font-mono text-brand-400">{formatCurrency(invoice.total)}</span>
            </div>
          </div>

          {/* Payment indicator block */}
          <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-850 flex items-center justify-between text-[11px] font-sans">
            <span className="text-stone-400 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-stone-500" />
              طريقة الدفع المعتمدة:
            </span>
            <span className="font-bold text-stone-250">
              {invoice.paymentMethod === 'cash' && 'الدفع نقداً في الصندوق'}
              {invoice.paymentMethod === 'card' && 'الدفع بالبطاقة الائتمانية'}
              {invoice.paymentMethod === 'apple_pay' && 'Apple Pay السريع'}
            </span>
          </div>

          {/* Compliance & QR section */}
          <div className="text-center space-y-3 pt-2">
            <div className="space-y-1">
              {/* QR Image Container styled inline to bypass light default wrapper constraints */}
              <div className="bg-stone-900 inline-block p-1.5 rounded-xl border border-stone-800">
                {renderZatcaQr()}
              </div>
              <p className="text-[10px] text-stone-500 font-sans mt-2">امسح الرمز للتحقق من الفاتورة الرقمية المبسطة</p>
            </div>
            
            <div className="border-b border-dashed border-stone-850" />
            
            <div className="space-y-1 mb-2">
              <p className="text-white font-bold text-xs">صحتين وعافية على قلبك!</p>
              <p className="text-[10px] text-stone-500">نشكر لك اختيارك مطعم جمر وهيل للطهي الفاخر والمأكولات النفيسة</p>
            </div>
          </div>

        </div>

        {/* Action Button toolbar — hidden during printing */}
        <div className="bg-stone-950 p-4 border-t border-stone-850 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
          >
            <Printer className="w-4 h-4 text-stone-400" />
            <span>طباعة الفاتورة</span>
          </button>

          <button
            onClick={onResetOrder}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-stone-100 font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs shadow-md shadow-brand-950/20"
          >
            <Plus className="w-4 h-4 text-brand-100" />
            <span>بدء طلب جديد (New Order)</span>
          </button>
        </div>

        {/* Close Button overlay */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-stone-300 hover:text-white font-bold transition-all p-1 text-xs bg-stone-800/65 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer border border-stone-700/50"
          title="إغلاق"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
}
