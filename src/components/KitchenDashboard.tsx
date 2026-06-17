import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  Utensils, 
  Play, 
  Flame, 
  RotateCcw,
  Tag, 
  Receipt, 
  Tv, 
  Users, 
  ShoppingBag,
  Bell,
  Trash2,
  ListFilter
} from 'lucide-react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils';

interface KitchenDashboardProps {
  invoices: Invoice[];
  onUpdateInvoiceStatus: (invoiceId: string, newStatus: 'paid' | 'pending' | 'preparing' | 'ready' | 'completed') => void;
  onClearAllInvoices?: () => void;
}

export default function KitchenDashboard({ 
  invoices, 
  onUpdateInvoiceStatus, 
  onClearAllInvoices 
}: KitchenDashboardProps) {
  const [filterTable, setFilterTable] = useState<string>('all');
  
  // Local state to play standard sound or alert
  const [bellRung, setBellRung] = useState(false);

  const handleUpdateStatus = (id: string, status: any) => {
    onUpdateInvoiceStatus(id, status);
    
    // Play a gentle notification sound if supported
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      console.log('Audio feedback not allowed by browser autoplay rules');
    }

    setBellRung(true);
    setTimeout(() => setBellRung(false), 800);
  };

  // Group invoices by their kitchen/delivery statuses
  // Backward compatibility: If an invoice status is "pending" or "paid", we map it appropriately
  const getInvoicePreparationStatus = (inv: Invoice): 'pending' | 'preparing' | 'ready' | 'completed' => {
    // If the invoice explicitly has a custom status attached, we use it, otherwise fallback
    return (inv as any).preparationStatus || (inv.status === 'pending' ? 'pending' : 'preparing');
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filterTable === 'all') return true;
    if (filterTable === 'delivery') return inv.isDelivery;
    if (filterTable === 'takeaway') return !inv.dineIn && !inv.isDelivery;
    return inv.dineIn && inv.tableNumber === filterTable;
  });

  // Extract unique active table numbers
  const uniqueTables = Array.from(
    new Set(
      invoices
        .filter(inv => inv.dineIn && inv.tableNumber)
        .map(inv => inv.tableNumber as string)
    )
  );

  const pendingOrders = filteredInvoices.filter(inv => getInvoicePreparationStatus(inv) === 'pending');
  const preparingOrders = filteredInvoices.filter(inv => getInvoicePreparationStatus(inv) === 'preparing');
  const readyOrders = filteredInvoices.filter(inv => getInvoicePreparationStatus(inv) === 'ready');
  const completedOrders = filteredInvoices.filter(inv => getInvoicePreparationStatus(inv) === 'completed');

  const getElapsedTime = (dateString: string) => {
    const elapsedMs = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(elapsedMs / 60000);
    if (minutes < 1) return 'الآن';
    return `منذ ${minutes} د`;
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Header and Filter Bar */}
      <div className="bg-stone-900 text-stone-100 p-5 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-brand-600/20 text-brand-400 p-3 rounded-2xl border border-brand-500/20">
            <ChefHat className={`w-7 h-7 ${bellRung ? 'animate-bounce' : 'animate-pulse'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold tracking-tight">شاشة تحضير المطبخ والموظفين</h2>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Bell className="w-2.5 h-2.5" />
                تحديث تلقائي مفعّل
              </span>
            </div>
            <p className="text-xs text-stone-400 font-light mt-0.5">لوحة فورية لمتابعة طلبات الزبائن، البدء بتجهيز المأكولات، وإشعار الصالة بالجهوزية</p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-stone-800/80 p-1.5 rounded-xl border border-stone-700 text-xs">
            <ListFilter className="w-3.5 h-3.5 text-stone-400 mr-1" />
            <span className="text-stone-300 ml-1.5">فرز الطلبات:</span>
            <button
              onClick={() => setFilterTable('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterTable === 'all' ? 'bg-amber-600 text-slate-900 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              الكل ({invoices.length})
            </button>
          </div>

          {onClearAllInvoices && invoices.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من تصفير ومسح جميع الفواتير النشطة والسابقة؟')) {
                  onClearAllInvoices();
                }
              }}
              className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-900/60 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              تصفير الفواتير
            </button>
          )}
        </div>
      </div>

      {/* KDS Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* COL 1: Pending Orders (بانتظار التحضير) */}
        <div className="bg-stone-900 rounded-2xl border border-stone-850 p-4 space-y-3 text-right">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="bg-stone-950 text-stone-300 font-bold text-xs px-2.5 py-0.5 rounded-full font-mono border border-stone-800">
              {pendingOrders.length}
            </span>
            <div className="flex items-center gap-1.5 text-stone-200">
              <span className="font-bold text-sm">بانتظار التحضير</span>
              <div className="w-2 h-2 rounded-full bg-stone-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {pendingOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs font-light">
                لا توجد طلبات جديدة حالياً
              </div>
            ) : (
              pendingOrders.map(inv => (
                <OrderCard 
                  key={inv.id} 
                  invoice={inv} 
                  getElapsedTime={getElapsedTime}
                  onNext={() => handleUpdateStatus(inv.id, 'preparing')}
                  nextLabel="بدء التجهيز في المطبخ"
                  nextColor="bg-amber-600 hover:bg-amber-700 text-stone-100"
                  nextIcon={<Play className="w-3.5 h-3.5" />}
                />
              ))
            )}
          </div>
        </div>

        {/* COL 2: Preparing (جاري التجهيز على الفحم / النار) */}
        <div className="bg-amber-950/10 rounded-2xl border border-amber-900/30 p-4 space-y-3 text-right">
          <div className="flex items-center justify-between pb-2 border-b border-amber-900/20">
            <span className="bg-amber-950/60 text-amber-300 font-bold text-xs px-2.5 py-0.5 rounded-full font-mono border border-amber-900/30">
              {preparingOrders.length}
            </span>
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="font-bold text-sm">تحت التجهيز (المطبخ)</span>
              <div className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs font-light">
                شيف المطبخ بانتظار استلام طلبات
              </div>
            ) : (
              preparingOrders.map(inv => (
                <OrderCard 
                  key={inv.id} 
                  invoice={inv} 
                  getElapsedTime={getElapsedTime}
                  onNext={() => handleUpdateStatus(inv.id, 'ready')}
                  nextLabel="اكتمل الطهي وجاهز"
                  nextColor="bg-emerald-600 hover:bg-emerald-700 text-stone-100"
                  nextIcon={<Flame className="w-3.5 h-3.5" />}
                />
              ))
            )}
          </div>
        </div>

        {/* COL 3: Ready for pickup (جاهز للتسليم / للغرفة) */}
        <div className="bg-emerald-950/10 rounded-2xl border border-emerald-900/30 p-4 space-y-3 text-right">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-900/20">
            <span className="bg-emerald-950/60 text-emerald-300 font-bold text-xs px-2.5 py-0.5 rounded-full font-mono border border-emerald-900/30">
              {readyOrders.length}
            </span>
            <div className="flex items-center gap-1.5 text-emerald-500">
              <span className="font-bold text-sm">جاهز للتسليم 🔔</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs font-light">
                لا توجد أطباق جاهزة بانتظار النداء
              </div>
            ) : (
              readyOrders.map(inv => (
                <OrderCard 
                  key={inv.id} 
                  invoice={inv} 
                  getElapsedTime={getElapsedTime}
                  onNext={() => handleUpdateStatus(inv.id, 'completed')}
                  nextLabel="تأكيد تسليم الطلب للعميل"
                  nextColor="bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-850"
                  nextIcon={<CheckCircle className="w-3.5 h-3.5 text-brand-500" />}
                />
              ))
            )}
          </div>
        </div>

        {/* COL 4: Completed (المستلمة / المغلقة) */}
        <div className="bg-stone-900 rounded-2xl border border-stone-850 p-4 space-y-3 text-right">
          <div className="flex items-center justify-between pb-2 border-b border-stone-800">
            <span className="bg-stone-950 text-stone-400 font-bold text-xs px-2.5 py-0.5 rounded-full font-mono border border-stone-800">
              {completedOrders.length}
            </span>
            <div className="flex items-center gap-1.5 text-stone-400">
              <span className="font-bold text-sm">الطلبات المستلمة</span>
              <div className="w-2 h-2 rounded-full bg-stone-500" />
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
            {completedOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs font-light">
                لا توجد مبيعات مكتملة بعد في هذه الجلسة
              </div>
            ) : (
              completedOrders.map(inv => (
                <OrderCard 
                  key={inv.id} 
                  invoice={inv} 
                  getElapsedTime={getElapsedTime}
                  onNext={() => handleUpdateStatus(inv.id, 'pending')}
                  nextLabel="إعادة إرسال للمطبخ"
                  nextColor="bg-stone-805 hover:bg-stone-750 text-stone-300"
                  nextIcon={<RotateCcw className="w-3.5 h-3.5" />}
                />
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

/* Internal Card Subcomponent for tidiness and neat rendering */
interface OrderCardProps {
  key?: string;
  invoice: Invoice;
  getElapsedTime: (date: string) => string;
  onNext: () => void;
  nextLabel: string;
  nextColor: string;
  nextIcon: React.ReactNode;
}

function OrderCard({ invoice, getElapsedTime, onNext, nextLabel, nextColor, nextIcon }: OrderCardProps) {
  // Safe extraction of name & details
  const displayNo = invoice.invoiceNumber.split('-')[2] || invoice.invoiceNumber;
  const isDineIn = invoice.dineIn;
  const isDelivery = invoice.isDelivery;
  const table = invoice.tableNumber;
  const name = invoice.customerName || 'زبون محلي';

  return (
    <div className="bg-stone-950 rounded-xl border border-stone-850 p-3.5 shadow-md space-y-3 hover:border-brand-500/50 hover:shadow-lg transition-all relative overflow-hidden text-right text-stone-100">
      
      {/* Top Meta info */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="text-xs text-stone-400 font-mono flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-stone-500" />
          <span>{getElapsedTime(invoice.date)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {isDelivery ? (
            <span className="bg-amber-600/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1">
              توصيل 🛵
            </span>
          ) : isDineIn ? (
            <span className="bg-amber-950/40 text-amber-300 border border-amber-900/40 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1">
              <Users className="w-2.5 h-2.5 text-amber-400" />
              طاولة {table}
            </span>
          ) : (
            <span className="bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 px-1.5 py-0.5 rounded-md text-[10px] font-extrabold flex items-center gap-1">
              <ShoppingBag className="w-2.5 h-2.5 text-indigo-400" />
              سفري
            </span>
          )}
          <span className="bg-stone-900 text-brand-400 font-bold text-[10px] font-mono px-2 py-0.5 rounded-md border border-stone-800">
            #{displayNo}
          </span>
        </div>
      </div>

      {/* Customer Name */}
      <div className="space-y-1.5 border-b border-stone-850 pb-1.5">
        <p className="text-xs font-extrabold text-stone-300">
          الاسم: <span className="text-white font-normal">{name}</span>
        </p>
        {isDelivery && (
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-lg p-2 text-[10px] space-y-1 text-right">
            <div>
              <span className="text-stone-400 font-medium">الهاتف:</span>{' '}
              <span className="text-amber-500 font-bold font-mono select-all">{invoice.deliveryPhone}</span>
            </div>
            <div>
              <span className="text-stone-400 font-medium">العنوان:</span>{' '}
              <span className="text-stone-200 font-light block mt-0.5 whitespace-pre-wrap">{invoice.deliveryAddress}</span>
            </div>
          </div>
        )}
      </div>

      {/* Food Items List inside invoice */}
      <div className="space-y-1.5">
        {invoice.items.map((item, idx) => (
          <div key={idx} className="bg-stone-900/80 p-2 rounded-lg text-xs border border-stone-850/60">
            <div className="flex items-start justify-between gap-2">
              <span className="font-extrabold text-brand-400 underline decoration-stone-800 decoration-2">
                {item.quantity}x
              </span>
              <div className="flex-1 text-right">
                <span className="font-bold text-stone-100">{item.nameAr}</span>
                <span className="block text-[8px] text-stone-500 font-mono">{item.nameEn}</span>
              </div>
            </div>

            {/* Note attached to this food item */}
            {item.notes && item.notes.trim() !== '' && (
              <div className="mt-1 pb-0.5 px-1.5 bg-amber-950/30 rounded text-[10px] text-amber-300 font-semibold border-r-2 border-amber-500">
                ملاحظة: {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="flex justify-between items-center text-xs text-stone-400 pt-1 border-t border-stone-850">
        <span className="font-bold text-brand-400">{formatCurrency(invoice.total)}</span>
        <span>الدفع: <span className="font-bold text-stone-200">{invoice.paymentMethod === 'apple_pay' ? 'Apple Pay' : invoice.paymentMethod === 'card' ? 'بطاقة' : 'نقداً'}</span></span>
      </div>

      {/* Action Button for state progression */}
      <button
        onClick={onNext}
        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer mt-2 ${nextColor}`}
      >
        {nextIcon}
        <span>{nextLabel}</span>
      </button>

    </div>
  );
}
