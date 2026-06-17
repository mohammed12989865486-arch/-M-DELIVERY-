import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Percent, 
  ChevronLeft, 
  Receipt,
  User,
  MessageSquareOff,
  MessageSquare,
  Phone,
  MapPin
} from 'lucide-react';
import { CartItem, MenuItem } from '../types';
import { PROMO_CODES } from '../data';
import { formatCurrency } from '../utils';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onCheckout: (options: { customerName: string; promoCode: string; paymentMethod: 'cash' | 'card' | 'apple_pay' }) => void;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  deliveryName: string;
  deliveryAddress: string;
  deliveryPhone: string;
  onDeliveryNameChange: (val: string) => void;
  onDeliveryAddressChange: (val: string) => void;
  onDeliveryPhoneChange: (val: string) => void;
}

export default function Cart({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onUpdateNotes, 
  onCheckout,
  orderType,
  deliveryName,
  deliveryAddress,
  deliveryPhone,
  onDeliveryNameChange,
  onDeliveryAddressChange,
  onDeliveryPhoneChange
}: CartProps) {
  const [promoInput, setPromoInput] = useState('');
  const [activePromo, setActivePromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'apple_pay'>('cash');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.menuItem.price * item.quantity), 0);
  }, [cartItems]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!activePromo) return 0;
    const promo = PROMO_CODES[activePromo];
    if (promo && subtotal >= promo.minOrder) {
      return (subtotal * promo.percent) / 100;
    }
    return 0;
  }, [activePromo, subtotal]);

  // General Sales Tax (16% in Jordan)
  const vatAmount = useMemo(() => {
    const afterDiscount = subtotal - discountAmount;
    return afterDiscount * 0.16;
  }, [subtotal, discountAmount]);

  // Final Total
  const totalAmount = useMemo(() => {
    return subtotal - discountAmount + vatAmount;
  }, [subtotal, discountAmount, vatAmount]);

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoInput.toUpperCase().trim();
    if (!code) return;

    if (PROMO_CODES[code]) {
      const match = PROMO_CODES[code];
      if (subtotal < match.minOrder) {
        setPromoError(`الحد الأدنى لتفعيل الكود هو ${formatCurrency(match.minOrder)}`);
        setActivePromo(null);
      } else {
        setActivePromo(code);
        setPromoError(null);
      }
    } else {
      setPromoError('كود الخصم المدخل غير صحيح');
      setActivePromo(null);
    }
  };

  const handleRemovePromo = () => {
    setActivePromo(null);
    setPromoInput('');
    setPromoError(null);
  };

  const isDeliveryIncomplete = orderType === 'delivery' && (
    !deliveryName.trim() || !deliveryAddress.trim() || !deliveryPhone.trim()
  );

  const handleTriggerCheckout = () => {
    if (isDeliveryIncomplete) return;
    onCheckout({
      customerName: orderType === 'delivery' ? deliveryName.trim() : customerName.trim(),
      promoCode: activePromo || '',
      paymentMethod
    });
  };

  return (
    <div className="bg-stone-900 rounded-2xl border border-stone-850 shadow-xl p-5 flex flex-col h-[calc(100vh-160px)] md:h-[680px] sticky top-6 text-stone-100">
      {/* Sidebar Header */}
      <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-950/40 p-2 rounded-xl text-brand-400 border border-brand-900/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base leading-none text-right">سلة الطلبات</h2>
            <span className="text-[10px] text-stone-500 font-mono mt-1 block text-right">Your Basket</span>
          </div>
        </div>
        <span className="text-xs font-bold bg-stone-950 text-stone-300 px-2.5 py-1 rounded-full border border-stone-850 font-mono">
          {cartItems.reduce((sum, i) => sum + i.quantity, 0)} أصناف
        </span>
      </div>

      {/* Cart Content scroll area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3.5 pr-0.5">
        <AnimatePresence mode="popLayout">
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-stone-950 flex items-center justify-center text-stone-600 mb-2 border border-stone-850">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-stone-400 text-sm font-semibold">السلة فارغة حالياً</p>
              <p className="text-stone-500 text-xs mt-0.5 max-w-[200px] leading-relaxed">أضف بعض مأكولاتنا اللذيذة لبدء إعداد الطلب</p>
            </motion.div>
          ) : (
            cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-stone-950 rounded-xl p-3 border border-stone-850 relative group"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Food Mini Info */}
                  <div className="flex-1 text-right">
                    <h4 className="font-bold text-stone-100 text-xs sm:text-sm line-clamp-1">
                      {item.menuItem.nameAr}
                    </h4>
                    <span className="text-[10px] text-stone-500 font-mono block text-right">
                      {item.menuItem.nameEn}
                    </span>
                    <span className="text-xs font-bold text-brand-400 block mt-1">
                      {formatCurrency(item.menuItem.price * item.quantity)}
                    </span>
                  </div>

                  {/* Quantity and Controls */}
                  <div className="flex flex-col items-end justify-between gap-2.5">
                    <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-800">
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-5.5 h-5.5 bg-stone-950 hover:bg-stone-800 rounded text-stone-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-extrabold w-5 text-center font-mono text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            onRemoveItem(item.id);
                          } else {
                            onUpdateQuantity(item.id, -1);
                          }
                        }}
                        className="w-5.5 h-5.5 bg-stone-950 hover:bg-stone-800 rounded text-stone-300 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Notes toggle */}
                      <button
                        onClick={() => setEditingNotesId(editingNotesId === item.id ? null : item.id)}
                        className={`text-[10px] flex items-center gap-0.5 px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                          item.notes 
                            ? 'bg-amber-950/50 text-amber-300 border border-amber-900/40 font-medium' 
                            : 'text-stone-400 hover:text-stone-200 bg-stone-800/50'
                        }`}
                      >
                        {item.notes ? <MessageSquare className="w-3 h-3 text-amber-400" /> : <MessageSquareOff className="w-3 h-3 text-stone-500" />}
                        {item.notes ? 'ملاحظة مضافة' : 'إضافة ملاحظة'}
                      </button>

                      {/* Remove item */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-stone-500 hover:text-red-400 p-0.5 rounded transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes Input Area */}
                {editingNotesId === item.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2 pt-2 border-t border-stone-800"
                  >
                    <input
                      type="text"
                      placeholder="امثلة: بدون كزبرة، زيادة صوص الثوم..."
                      value={item.notes}
                      onChange={(e) => onUpdateNotes(item.id, e.target.value)}
                      className="w-full text-right text-xs py-1.5 px-2 rounded-lg bg-stone-950 border border-stone-850 text-stone-100 focus:outline-none focus:border-brand-500 focus:bg-stone-950 font-sans"
                    />
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Promo code & checkout configs (only if cart has items) */}
      {cartItems.length > 0 && (
        <div className="border-t border-stone-800 pt-3.5 space-y-3.5 bg-stone-900 font-sans">
          {/* Discount code section */}
          <div>
            {activePromo ? (
              <div className="flex items-center justify-between bg-emerald-950/40 text-emerald-350 text-xs p-2 rounded-xl border border-emerald-900/40">
                <div className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-emerald-400" />
                  <span>تم تفعيل الخصم <strong>{activePromo}</strong> (خصم {PROMO_CODES[activePromo].percent}%)</span>
                </div>
                <button 
                  onClick={handleRemovePromo}
                  className="text-[10px] underline font-bold hover:text-emerald-100 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="flex items-stretch gap-2">
                <input
                  type="text"
                  placeholder="رمز ترويجي (MEAL10 / WELCOME)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 text-right text-xs bg-stone-950 px-2.5 py-1.5 rounded-lg border border-stone-800 text-stone-100 focus:outline-none focus:border-brand-500 placeholder-stone-600 focus:bg-stone-950"
                />
                <button
                  onClick={handleApplyPromo}
                  className="bg-stone-950 text-brand-400 border border-stone-800 text-xs px-3.5 py-1.5 rounded-lg font-bold hover:bg-stone-800 hover:text-brand-350 transition-colors cursor-pointer"
                >
                  تطبيق
                </button>
              </div>
            )}
            {promoError && (
              <p className="text-[10px] text-red-400 mt-1">{promoError}</p>
            )}
          </div>

          <div className="space-y-2 border-t border-stone-800 pt-3 text-right">
            {orderType === 'delivery' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                  <span>🛵 بيانات التوصيل والتواصل:</span>
                </div>
                
                {/* Delivery Name Input */}
                <div className="relative flex items-center">
                  <User className="absolute right-2.5 w-3.5 h-3.5 text-stone-500" />
                  <input
                    type="text"
                    placeholder="اسم الشخص المستلم (مطلوب)"
                    value={deliveryName}
                    onChange={(e) => onDeliveryNameChange(e.target.value)}
                    className="w-full text-right text-xs bg-stone-950 pr-8 py-1.5 rounded-lg border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-550 placeholder-stone-600 focus:bg-stone-950 font-sans"
                    required
                  />
                </div>

                {/* Delivery Phone Input */}
                <div className="relative flex items-center">
                  <Phone className="absolute right-2.5 w-3.5 h-3.5 text-stone-500" />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف للتواصل (مطلوب)"
                    value={deliveryPhone}
                    onChange={(e) => onDeliveryPhoneChange(e.target.value)}
                    className="w-full text-right text-xs bg-stone-950 pr-8 py-1.5 rounded-lg border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-550 placeholder-stone-600 focus:bg-stone-950 font-mono"
                    required
                  />
                </div>

                {/* Delivery Address Input */}
                <div className="relative flex items-center">
                  <MapPin className="absolute right-2.5 w-3.5 h-3.5 text-stone-500" />
                  <input
                    type="text"
                    placeholder="مكان السكن بالتفصيل (مطلوب)"
                    value={deliveryAddress}
                    onChange={(e) => onDeliveryAddressChange(e.target.value)}
                    className="w-full text-right text-xs bg-stone-950 pr-8 py-1.5 rounded-lg border border-stone-800 text-stone-100 focus:outline-none focus:border-amber-550 placeholder-stone-600 focus:bg-stone-950 font-sans"
                    required
                  />
                </div>
              </div>
            ) : (
              /* Customer name (optional) */
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="اسم العميل (اختياري)"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="flex-1 text-right text-xs bg-stone-950 px-2.5 py-1.5 rounded-lg border border-stone-800 text-stone-100 focus:outline-none focus:border-brand-500 placeholder-stone-600 focus:bg-stone-950 font-sans"
                />
              </div>
            )}

            {/* Payment Selector */}
            <div className="grid grid-cols-3 gap-1 p-0.5 bg-stone-950 rounded-lg border border-stone-800">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'cash' ? 'bg-stone-800 text-white shadow-sm border border-stone-700/60' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                نقداً
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'card' ? 'bg-stone-800 text-white shadow-sm border border-stone-700/60' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                بطاقة / فيزا
              </button>
              <button
                onClick={() => setPaymentMethod('apple_pay')}
                className={`py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                  paymentMethod === 'apple_pay' ? 'bg-black text-brand-400 shadow-sm border border-stone-800' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Apple Pay
              </button>
            </div>
          </div>

          {/* Pricing summaries */}
          <div className="space-y-1.5 text-xs text-stone-300 bg-stone-950 p-3 rounded-xl border border-stone-850 font-sans">
            <div className="flex justify-between">
              <span className="text-stone-500">المجموع الفرعي (Subtotal):</span>
              <span className="font-semibold text-stone-250 font-mono">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-450">
                <span>خصم الكود المستعمل:</span>
                <span className="font-bold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-500">ضريبة المبيعات العامة (16%):</span>
              <span className="font-semibold text-stone-250 font-mono">{formatCurrency(vatAmount)}</span>
            </div>
            <div className="h-[1px] bg-stone-805/40 my-1" />
            <div className="flex justify-between text-sm font-extrabold text-white">
              <span>المجموع الكلي الفاتورة:</span>
              <span className="text-brand-400 font-mono">{formatCurrency(totalAmount)}</span>
            </div>
          </div>

          {/* Incomplete Delivery Alert Banner */}
          {isDeliveryIncomplete && (
            <div className="bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-[11px] text-red-300 text-right leading-relaxed font-sans">
              ⚠️ <strong>بيانات التوصيل غير مكتملة!</strong> يرجى تعبئة الاسم وعنوان السكن بالتفصيل ورقم الهاتف أعلاه لإتمام وإصدار الفاتورة.
            </div>
          )}

          {/* Issue invoice button */}
          <button
            onClick={handleTriggerCheckout}
            disabled={isDeliveryIncomplete}
            className={`w-full font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              isDeliveryIncomplete
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-850'
                : 'bg-gradient-to-r from-brand-600 to-amber-600 hover:from-brand-500 hover:to-amber-500 text-stone-100 hover:shadow-lg active:scale-98'
            }`}
          >
            <Receipt className="w-4 h-4 text-amber-200" />
            <span>إصدار وتأكيد الفاتورة</span>
          </button>
        </div>
      )}
    </div>
  );
}
