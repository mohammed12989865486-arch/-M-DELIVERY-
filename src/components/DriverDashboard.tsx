import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  CheckCircle, 
  Receipt, 
  Navigation, 
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Sparkles,
  Search
} from 'lucide-react';
import { Invoice } from '../types';
import { formatCurrency } from '../utils';

interface DriverDashboardProps {
  invoices: Invoice[];
  onUpdateInvoiceStatus: (invoiceId: string, newStatus: 'paid' | 'pending' | 'preparing' | 'ready' | 'completed') => void;
}

export default function DriverDashboard({ invoices, onUpdateInvoiceStatus }: DriverDashboardProps) {
  const [activeTab, setActiveTab] = useState<'ready' | 'delivered'>('ready');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Get ready invoices (delivery or takeaway)
  const readyOrders = invoices.filter(inv => {
    const isReady = inv.preparationStatus === 'ready';
    // Match search query
    const matchesSearch = searchQuery.trim() === '' || 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.deliveryPhone && inv.deliveryPhone.includes(searchQuery));
    
    return isReady && matchesSearch;
  });

  // 2. Get delivered/completed invoices
  const deliveredOrders = invoices.filter(inv => {
    const isCompleted = inv.preparationStatus === 'completed' && inv.isDelivery;
    const matchesSearch = searchQuery.trim() === '' || 
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inv.deliveryPhone && inv.deliveryPhone.includes(searchQuery));
    
    return isCompleted && matchesSearch;
  });

  const handleDeliverOrder = (id: string) => {
    onUpdateInvoiceStatus(id, 'completed');
    
    // Play sound feedback
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      // Success double-beep
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
      
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.15);
      }, 120);
    } catch (e) {
      console.log('Audio feedback error');
    }
  };

  return (
    <div className="bg-stone-950 p-4 md:p-6 rounded-2xl border border-stone-900 shadow-2xl max-w-5xl mx-auto space-y-6" dir="rtl">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-900 text-right">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                لوحة السائقين والتسليم الفوري
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                  نشط 🟢
                </span>
              </h2>
              <p className="text-xs text-stone-400 font-light mt-0.5">شاشة تسليم الطلبات الجاهزة من المطبخ للزبائن وتحديث حركات التوصيل</p>
            </div>
          </div>
        </div>

        {/* Deliveries Counter */}
        <div className="flex items-center gap-4 bg-stone-900/40 p-3 rounded-xl border border-stone-850 self-start md:self-auto">
          <div className="text-center px-3 border-l border-stone-800">
            <span className="block text-2xl font-black text-amber-500 font-mono">
              {invoices.filter(i => i.preparationStatus === 'ready').length}
            </span>
            <span className="text-[10px] text-stone-400 font-semibold">جاهز للتوصيل</span>
          </div>
          <div className="text-center px-3 text-right">
            <span className="block text-2xl font-black text-emerald-500 font-mono">
              {invoices.filter(i => i.preparationStatus === 'completed' && i.isDelivery).length}
            </span>
            <span className="text-[10px] text-stone-400 font-semibold">تم تسليمها</span>
          </div>
        </div>
      </div>

      {/* Tabs Control and Search Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Switch Tab Button */}
        <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800 self-start w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('ready')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'ready'
                ? 'bg-amber-550 text-stone-950 shadow-sm font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>الطلبات الجاهزة بالمطعم ({readyOrders.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('delivered')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'delivered'
                ? 'bg-emerald-600 text-stone-100 shadow-sm font-black'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>طلبـات تم تسليمهـا ({deliveredOrders.length})</span>
          </button>
        </div>

        {/* Global Search */}
        <div className="relative flex items-center flex-1 sm:max-w-xs">
          <Search className="absolute right-3 w-4 h-4 text-stone-500" />
          <input
            type="text"
            placeholder="بحث برقم الفاتورة أو هاتف الزبون..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900/60 text-white pr-9 pl-3 text-xs py-2 rounded-xl border border-stone-800 focus:outline-none focus:border-amber-550 transition-all text-right font-sans"
          />
        </div>
      </div>

      {/* Active Grid Output */}
      {activeTab === 'ready' ? (
        <div className="space-y-4">
          {readyOrders.length === 0 ? (
            <div className="bg-stone-900/30 border border-stone-900 py-16 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-stone-900 rounded-full border border-stone-850 flex items-center justify-center mx-auto text-stone-600">
                <Truck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-300">لا توجد أية طلبات جاهزة حالياً للتسليم</h3>
                <p className="text-xs text-stone-500 font-light max-w-sm mx-auto">عند قيام كادر المطبخ بإنهاء تجهيز أي طلب توصيل، سيظهر فورياً هنا في هذه اللوحة للسائقين.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {readyOrders.map((inv) => (
                  <motion.div
                    key={inv.id}
                    layoutId={`driver-ready-${inv.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-stone-900 rounded-2xl border border-stone-850 p-4 space-y-4 text-right flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top bar */}
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          فاتورة #{inv.invoiceNumber.split('-')[2] || inv.invoiceNumber}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="text-[10px] font-extrabold bg-stone-950 text-stone-300 px-2 py-0.5 rounded-md border border-stone-800">
                            {inv.isDelivery ? 'توصيل للمنزل 🛵' : 'سفري / خارجي'}
                          </span>
                        </div>
                      </div>

                      {/* Recipient details */}
                      <div className="bg-stone-950 p-3 rounded-xl border border-stone-850 space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-stone-500" />
                          <span className="text-xs text-stone-400 font-medium">المستلم:</span>
                          <strong className="text-xs text-white">
                            {inv.customerName || 'زبون محلي'}
                          </strong>
                        </div>

                        {inv.deliveryPhone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs text-stone-400 font-medium font-sans">الهاتف للتواصل:</span>
                            <a 
                              href={`tel:${inv.deliveryPhone}`} 
                              className="text-xs font-bold text-amber-500 font-mono select-all hover:underline"
                            >
                              {inv.deliveryPhone}
                            </a>
                          </div>
                        )}

                        {inv.deliveryAddress && (
                          <div className="flex items-start gap-2 pt-1 border-t border-stone-850/50 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                            <div className="text-right">
                              <span className="text-[10px] text-stone-500 font-semibold block">مكان التوصيل بالتفصيل:</span>
                              <p className="text-xs text-stone-200 leading-relaxed font-light mt-0.5">
                                {inv.deliveryAddress}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Food details */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-stone-400 font-bold block">محتويات الوجبة والمطبوخات:</span>
                        <div className="text-xs text-stone-300 space-y-1 bg-stone-950/40 p-2.5 rounded-lg border border-stone-850/50">
                          {inv.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px]">
                              <span>{item.nameAr}</span>
                              <strong className="text-white font-mono shrink-0 font-bold">× {item.quantity}</strong>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Money details */}
                      <div className="flex items-center justify-between bg-stone-950/80 px-3 py-2 rounded-xl border border-stone-850 text-xs">
                        <div className="flex items-center gap-1">
                          <span className="text-stone-400 text-[10px]">طريقة الدفع:</span>
                          <span className="font-extrabold text-amber-500">
                            {inv.paymentMethod === 'cash' ? 'كاش (نقدي)' : inv.paymentMethod === 'card' ? 'بطاقة (فيزا)' : 'Apple Pay'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-stone-400">القيمة الإجمالية:</span>
                          <span className="font-black text-white text-xs">{formatCurrency(inv.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <button
                      onClick={() => handleDeliverOrder(inv.id)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 mt-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>تم تسليم الطلب وبدء الدليفري / استلمت بنجاح ✅</span>
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      ) : (
        /* Completed/Delivered Invoices History */
        <div className="space-y-4">
          {deliveredOrders.length === 0 ? (
            <div className="bg-stone-900/30 border border-stone-900 py-16 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-stone-900 rounded-full border border-stone-850 flex items-center justify-center mx-auto text-stone-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-400">لا توجد طلبات تم إتمام تسليمها وتوصيلها بعد</h3>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveredOrders.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-stone-900/50 rounded-2xl border border-stone-900 p-4 space-y-3 text-right opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-400 bg-stone-950 px-2.5 py-1 rounded-lg border border-stone-850">
                      فاتورة #{inv.invoiceNumber.split('-')[2] || inv.invoiceNumber}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded-md font-bold">
                      تم التوصيل بنجاح 🟢
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-stone-300">
                    <div>
                      <span className="text-stone-400">اسم العميل:</span> <strong className="text-white">{inv.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-400">الهاتف:</span> <span className="font-mono text-amber-500 font-bold">{inv.deliveryPhone}</span>
                    </div>
                    <div>
                      <span className="text-stone-400">العنوان:</span> <span className="text-stone-300">{inv.deliveryAddress}</span>
                    </div>
                    <div className="pt-2 border-t border-stone-850/40 flex justify-between items-center">
                      <span className="text-stone-500 text-[10px]">القيمة المستلمة:</span>
                      <strong className="text-emerald-500 font-black">{formatCurrency(inv.total)}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
