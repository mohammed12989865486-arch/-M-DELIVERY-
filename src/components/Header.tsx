import React from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin, Sparkles, User, Phone } from 'lucide-react';
import { LogoHorizontal } from './Logo';

interface HeaderProps {
  currentTable: string;
  orderType: 'dine_in' | 'takeaway' | 'delivery';
  onTableChange: (table: string) => void;
  onOrderTypeChange: (type: 'dine_in' | 'takeaway' | 'delivery') => void;
  
  deliveryName: string;
  deliveryAddress: string;
  deliveryPhone: string;
  onDeliveryNameChange: (val: string) => void;
  onDeliveryAddressChange: (val: string) => void;
  onDeliveryPhoneChange: (val: string) => void;
}

export default function Header({ 
  currentTable, 
  orderType, 
  onTableChange, 
  onOrderTypeChange,
  deliveryName,
  deliveryAddress,
  deliveryPhone,
  onDeliveryNameChange,
  onDeliveryAddressChange,
  onDeliveryPhoneChange
}: HeaderProps) {
  return (
    <header className="relative overflow-hidden bg-stone-900 text-stone-100 rounded-2xl mb-8 p-6 md:p-8 shadow-xl border border-stone-800">
      {/* Background Decorative glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-orange-600/10 blur-2xl" />

      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        {/* Brand info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <LogoHorizontal size="lg" />
          </motion.div>
          <div className="sm:border-r sm:border-stone-800 sm:pr-4 sm:h-12 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E96C20]/10 text-[#E96C20] font-bold border border-[#E96C20]/20">توصيل ذكي فوري</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-stone-400 text-xs font-light mt-1 text-right">
              أسرع منصة توصيل آمنة وموثوقة لجميع طلباتك
            </p>
          </div>
        </div>

        {/* Quick restaurant stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm border-t border-stone-800 pt-4 md:border-0 md:pt-0">
          <div className="flex items-center gap-1.5 text-stone-300">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>وقت التجهيز المتوقع: <strong>15 - 20 دقيقة</strong></span>
          </div>
          <div className="h-4 w-[1px] bg-stone-700 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-stone-300">
            <MapPin className="w-4 h-4 text-brand-500" />
            <span>الفرع الرئيسي • عمان</span>
          </div>
        </div>

        {/* Table / Order options */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-stone-950/85 p-3 rounded-xl border border-stone-800">
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-950/30 text-emerald-400 border border-emerald-900/40">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>خدمة التوصيل الفوري نشطة حالياً 🛵</span>
          </div>
        </div>
      </div>

      {/* Expanded Delivery details form */}
      {orderType === 'delivery' && (
        <div className="border-t border-stone-800/80 pt-4 mt-6 text-right animate-fadeIn space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h4 className="text-sm font-bold text-white">يرجى تعبئة بيانات التوصيل لإرفاقها على الفاتورة:</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Delivery Recipient Name */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 font-bold block">اسم الشخص المستلم <span className="text-amber-500">*</span>:</span>
              <div className="relative flex items-center">
                <User className="absolute right-3 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="مثال: أحمد مصطفى الروابدة"
                  value={deliveryName}
                  onChange={(e) => onDeliveryNameChange(e.target.value)}
                  className="w-full bg-stone-950 text-white pr-9 text-xs py-2 px-3 rounded-lg border border-stone-800 focus:outline-none focus:border-amber-550 placeholder-stone-700 transition-all text-right font-sans"
                  required
                />
              </div>
            </div>

            {/* Delivery Phone Number */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 font-bold block">رقم الهاتف للتواصل <span className="text-amber-500">*</span>:</span>
              <div className="relative flex items-center font-mono text-left">
                <Phone className="absolute right-3 w-4 h-4 text-stone-500" />
                <input
                  type="tel"
                  placeholder="مثال: 0791234567"
                  value={deliveryPhone}
                  onChange={(e) => onDeliveryPhoneChange(e.target.value)}
                  className="w-full bg-stone-950 text-white pr-9 text-xs py-2 px-3 rounded-lg border border-stone-800 focus:outline-none focus:border-amber-550 placeholder-stone-700 transition-all text-right font-mono"
                  required
                />
              </div>
            </div>

            {/* Detailed Address */}
            <div className="space-y-1">
              <span className="text-[11px] text-stone-400 font-bold block">مكان السكن بالتفصيل <span className="text-amber-500">*</span>:</span>
              <div className="relative flex items-center">
                <MapPin className="absolute right-3 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder="اسم الشارع، رقم البناية، رقم الطابق، الشقة..."
                  value={deliveryAddress}
                  onChange={(e) => onDeliveryAddressChange(e.target.value)}
                  className="w-full bg-stone-950 text-white pr-9 text-xs py-2 px-3 rounded-lg border border-stone-800 focus:outline-none focus:border-amber-550 placeholder-stone-700 transition-all text-right font-sans"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
