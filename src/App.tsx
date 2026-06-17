import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MenuGrid from './components/MenuGrid';
import Cart from './components/Cart';
import InvoiceModal from './components/InvoiceModal';
import Logo from './components/Logo';
import OrderHistory from './components/OrderHistory';
import KitchenDashboard from './components/KitchenDashboard';
import DriverDashboard from './components/DriverDashboard';
import { MenuItem, CartItem, Invoice } from './types';
import { PROMO_CODES } from './data';
import { generateInvoiceNumber } from './utils';
import { Sparkles, ArrowDown, ChefHat, ShoppingBag, Eye, Lock, KeyRound, LogOut, ShieldCheck, ArrowRight, Settings, Truck, Smartphone, ArrowDownToLine } from 'lucide-react';
import ApkDownloadModal from './components/ApkDownloadModal';

export default function App() {
  const [viewMode, setViewMode] = useState<'customer' | 'staff' | 'driver'>('customer');
  const [flow, setFlow] = useState<'welcome' | 'app'>('welcome');
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [pinValue, setPinValue] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [targetView, setTargetView] = useState<'welcome_staff' | 'app_staff' | null>(null);
  const [apkModalOpen, setApkModalOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('delivery');
  const [deliveryName, setDeliveryName] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryPhone, setDeliveryPhone] = useState<string>('');
  const dineIn = orderType === 'dine_in';
  const [currentTable, setCurrentTable] = useState<string>('5');

  const handleNumberPress = (num: string) => {
    setPinError(false);
    if (pinValue.length < 4) {
      const newVal = pinValue + num;
      setPinValue(newVal);
      if (newVal === '1919') {
        setTimeout(() => {
          if (targetView === 'welcome_staff') {
            setFlow('app');
            setViewMode('staff');
          } else if (targetView === 'app_staff') {
            setViewMode('staff');
          }
          setPinValue('');
          setPinModalOpen(false);
        }, 250);
      } else if (newVal.length === 4) {
        setTimeout(() => {
          setPinError(true);
          setPinValue('');
        }, 250);
      }
    }
  };

  const handleBackspace = () => {
    setPinError(false);
    setPinValue(prev => prev.slice(0, -1));
  };

  const handleClearPin = () => {
    setPinError(false);
    setPinValue('');
  };

  // Load / Save invoices & menu items from localStorage inside session
  useEffect(() => {
    const cachedMenu = localStorage.getItem('jamr_hail_menu_items');
    if (cachedMenu) {
      try {
        setMenuItems(JSON.parse(cachedMenu));
      } catch (err) {
        console.error('Failed to parse cached menu:', err);
      }
    } else {
      // Empty by default as requested!
      setMenuItems([]);
    }

    const cached = localStorage.getItem('jamr_hail_invoices');
    if (cached) {
      try {
        setInvoices(JSON.parse(cached));
      } catch (err) {
        console.error('Failed to parse invoices cache:', err);
      }
    }
  }, []);

  const saveInvoices = (list: Invoice[]) => {
    setInvoices(list);
    localStorage.setItem('jamr_hail_invoices', JSON.stringify(list));
  };

  const saveMenuItems = (list: MenuItem[]) => {
    setMenuItems(list);
    localStorage.setItem('jamr_hail_menu_items', JSON.stringify(list));
  };

  const handleAddMenuItemToMenu = (newItem: MenuItem) => {
    const updated = [...menuItems, newItem];
    saveMenuItems(updated);
  };

  const handleDeleteItemFromMenu = (id: string) => {
    const updated = menuItems.filter((m) => m.id !== id);
    saveMenuItems(updated);
    // Remove from active shopping cart too
    setCartItems((prev) => prev.filter((item) => item.menuItem.id !== id));
  };

  // Seeding default Jordan Traditional items in case user wants to test quickly
  const handleLoadSampleItems = () => {
    const jordanDemo: MenuItem[] = [
      {
        id: 'jor-1',
        nameAr: 'منسف كركي بلدي بالجميد',
        nameEn: 'Traditional Jordanian Mansaf',
        descriptionAr: 'طبق المنسف الأردني العريق بجبن الجميد الكركي، قطع لحم بلدي طازج، أرز مكلل باللوز والصنوبر والخبز البلدي.',
        descriptionEn: 'The pride of Jordan: slow-cooked local lamb under rich Karaki Jameed, seasoned rice, toasted pine nuts, and shrak bread.',
        price: 18.00,
        category: 'mains',
        image: '🥘',
        isPopular: true,
        calories: 940
      },
      {
        id: 'jor-2',
        nameAr: 'مسخن دجاج فلسطيني عريق',
        nameEn: 'Authentic Palestinian Musakhan',
        descriptionAr: 'دجاج محمر بالسماق البلدي، زيت زيتون بكر وزينة البصل اللذيذ والصنوبر المقرمش على خبز الطابون الساخن.',
        descriptionEn: 'Golden roasted chicken pieces coated with tangy sumac, sweet olive-oil caramelized onions on warm, thick Taboon bread.',
        price: 11.50,
        category: 'mains',
        image: '🌯',
        isPopular: true,
        calories: 780
      },
      {
        id: 'jor-3',
        nameAr: 'مقبلات مشكلة ومعجنات الصاج',
        nameEn: 'Mixed Jordanian Appetizers',
        descriptionAr: 'توليفة من ورق عنب محشي، كبة لحم كلاسيكية مميزة، متبل باذنجان بالليمون، يقدم مع الخبز البلدي الطازج.',
        descriptionEn: 'An classic platter featuring hand-rolled vine leaves, crispy kibbeh balls, and smoky baba ghanoush dip.',
        price: 6.50,
        category: 'appetizers',
        image: '🥗',
        isVegetarian: true,
        calories: 310
      },
      {
        id: 'jor-4',
        nameAr: 'كنافة نابلسية خشنة غنية بالجبن',
        nameEn: 'Fine Nabulsi Knafeh with Akkawi Cheese',
        descriptionAr: 'التحفة الشرقية الساخنة بعجينة الكنافة الذهبية والجبنة الطرية المتماسكة، تسقى بالقطر العطر والفستق.',
        descriptionEn: 'Rich, stringy Akkawi cheese baked inside a premium shredded phyllo pastry shell, topped with simple orange syrup.',
        price: 4.00,
        category: 'desserts',
        image: '🥞',
        isPopular: true,
        calories: 450
      },
      {
        id: 'jor-5',
        nameAr: 'قنينة ليموناضة بالنعناع باردة',
        nameEn: 'Chilled Lemon Mint Cooler',
        descriptionAr: 'عصير الليمون المنعش المعصور يدويًا مع أوراق النعناع الجبلية الطازجة والثلج المجروش.',
        descriptionEn: 'Handpressed sour lime cubes muddled with cold garden mint sprigs and clean ice flakes.',
        price: 2.20,
        category: 'drinks',
        image: '🍹',
        isVegetarian: true,
        calories: 80
      }
    ];
    saveMenuItems(jordanDemo);
  };

  // Add Item to cart
  const handleAddItem = (item: MenuItem) => {
    setCartItems((prev) => {
      // Check if item already exists with empty notes.
      // If it exists with notes, we can treat it as a separate or consolidated line.
      // For best UX, we look for item with same ID and empty notes first.
      const existing = prev.find((cat) => cat.menuItem.id === item.id && cat.notes === '');
      if (existing) {
        return prev.map((cat) =>
          cat.id === existing.id ? { ...cat, quantity: cat.quantity + 1 } : cat
        );
      }
      return [
        ...prev,
        {
          id: `${item.id}-${Date.now()}`,
          menuItem: item,
          quantity: 1,
          notes: '',
        },
      ];
    });
  };

  // Remove Item from cart
  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update item quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  // Update kitchen instructions/notes
  const handleUpdateNotes = (id: string, notes: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  // Process checkout and issue tax invoice
  const handleCheckout = (options: {
    customerName: string;
    promoCode: string;
    paymentMethod: 'cash' | 'card' | 'apple_pay';
  }) => {
    if (cartItems.length === 0) return;

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.menuItem.price * item.quantity,
      0
    );

    let discount = 0;
    if (options.promoCode) {
      const code = options.promoCode.toUpperCase().trim();
      const promo = PROMO_CODES[code];
      if (promo && subtotal >= promo.minOrder) {
        discount = (subtotal * promo.percent) / 100;
      }
    }

    const vat = (subtotal - discount) * 0.16; // 16% standard Sales Tax rate in Jordan
    const total = subtotal - discount + vat;

    const isDelivery = orderType === 'delivery';

    const newInvoice: Invoice = {
      id: String(Date.now()),
      invoiceNumber: generateInvoiceNumber(),
      date: new Date().toISOString(),
      dineIn,
      isDelivery,
      deliveryAddress: isDelivery ? deliveryAddress : undefined,
      deliveryPhone: isDelivery ? deliveryPhone : undefined,
      tableNumber: dineIn ? currentTable : undefined,
      customerName: options.customerName || undefined,
      items: cartItems.map((item) => ({
        id: item.menuItem.id,
        nameAr: item.menuItem.nameAr,
        nameEn: item.menuItem.nameEn,
        price: item.menuItem.price,
        quantity: item.quantity,
        notes: item.notes || undefined,
      })),
      subtotal,
      discount,
      vat,
      total,
      paymentMethod: options.paymentMethod,
      status: 'pending',
      preparationStatus: 'pending',
    };

    if (isDelivery) {
      setDeliveryName('');
      setDeliveryAddress('');
      setDeliveryPhone('');
    }

    const updatedList = [newInvoice, ...invoices];
    saveInvoices(updatedList);
    setActiveInvoice(newInvoice);
  };

  const handleUpdateInvoiceStatus = (
    invoiceId: string,
    newStatus: 'paid' | 'pending' | 'preparing' | 'ready' | 'completed'
  ) => {
    const updated = invoices.map((inv) => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          preparationStatus: newStatus,
          status: newStatus === 'completed' ? 'paid' : 'pending',
        } as Invoice;
      }
      return inv;
    });
    saveInvoices(updated);
  };

  const handleClearAllInvoices = () => {
    saveInvoices([]);
  };

  // Reset current ordering session
  const handleResetOrder = () => {
    setCartItems([]);
    setActiveInvoice(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-16">
      {/* Decorative top colored line */}
      <div className="h-2 bg-gradient-to-r from-brand-700 via-amber-500 to-amber-700" />

      {flow === 'welcome' ? (
        /* GORGEOUS WELCOME LANDING PAGE */
        <div className="max-w-4xl mx-auto px-4 pt-16 md:pt-24 pb-8 text-center space-y-12" dir="rtl">
          
          {/* Logo & Slogan Header */}
          <div className="space-y-4 flex flex-col items-center">
            <Logo size="xl" showText={true} />

            <div className="space-y-1.5">
              <p className="text-xs md:text-sm text-stone-400 font-medium max-w-sm mx-auto leading-relaxed">
                المنصة الذكية لتوصيل وطلب الوجبات السريعة والطرود بكفاءة تامة وسرعة فائقة
              </p>
            </div>
          </div>

          {/* Gateways Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 max-w-5xl mx-auto items-stretch">
            
            {/* GATEWAY A: VISITOR/CUSTOMER */}
            <div 
              onClick={() => {
                setFlow('app');
                setViewMode('customer');
              }}
              className="group bg-stone-900/60 hover:bg-stone-900 rounded-3xl border border-stone-850 hover:border-brand-500/50 shadow-lg p-6 md:p-8 flex flex-col justify-between text-right cursor-pointer transition-all hover:scale-[1.02] hover:shadow-amber-950/20 active:scale-98"
            >
              <div className="space-y-5">
                {/* Glowing Badge */}
                <div className="w-12 h-12 bg-amber-950/40 rounded-2xl border border-amber-900/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-stone-950 transition-all">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-400 transition-colors">اطلب الآن</h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    تصفح أشهى وأفضل الوجبات السريعة المتوفرة للتوصيل الفوري واطلبها لتصلك إلى عتبة بيتك بأسرع وقت.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-850 flex items-center justify-between text-xs text-amber-500 font-bold">
                <span>تصفح واطلب الآن</span>
                <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* GATEWAY B: STAFF/EMPLOYEE */}
            <div 
              onClick={() => {
                setTargetView('welcome_staff');
                setPinValue('');
                setPinError(false);
                setPinModalOpen(true);
              }}
              className="group bg-stone-900/60 hover:bg-stone-900 rounded-3xl border border-stone-850 hover:border-brand-500/50 shadow-lg p-6 md:p-8 flex flex-col justify-between text-right cursor-pointer transition-all hover:scale-[1.02] hover:shadow-brand-950/20 active:scale-98"
            >
              <div className="space-y-5">
                {/* Glowing Badge */}
                <div className="w-12 h-12 bg-stone-950 rounded-2xl border border-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-600 group-hover:text-stone-100 transition-all">
                  <ChefHat className="w-5 h-5" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-550 transition-colors">المطاعم والمتاجر</h3>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-900/35">لوحة التحكم والمطبخ</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    لوحة التحكم الخاصة بالمطاعم والمتاجر الشريكة. تابع الطلبات الواردة فواً، تحكّم بحالة المطبخ والتحضير، وحدّث حالات الفواتير، وتابع تقارير المبيعات.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-850 flex items-center justify-between text-xs text-stone-300 font-bold">
                <span className="text-stone-400">لوحة التحكم (1919)</span>
                <Lock className="w-3.5 h-3.5 text-stone-500" />
              </div>
            </div>

            {/* GATEWAY C: DRIVERS / DISPATCH */}
            <div 
              onClick={() => {
                setFlow('app');
                setViewMode('driver');
              }}
              className="group bg-stone-900/60 hover:bg-stone-900 rounded-3xl border border-stone-850 hover:border-emerald-500/50 shadow-lg p-6 md:p-8 flex flex-col justify-between text-right cursor-pointer transition-all hover:scale-[1.02] hover:shadow-amber-950/20 active:scale-98"
            >
              <div className="space-y-5">
                {/* Glowing Badge */}
                <div className="w-12 h-12 bg-amber-950/40 rounded-2xl border border-amber-900/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-stone-950 transition-all">
                  <Truck className="w-5 h-5" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-amber-450 transition-colors">بوابة السائقين والتوصيل</h3>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-900/35">فوري 🛵</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">
                    بوابة خاصة بسائقي الدليفري والتوصيل. تابع الفواتير والطلبات الجاهزة بالمطعم فور انتهاء المطبخ من طهيها، استلم الطلب، وأكّد التوصيل للعميل وتحديث الحالة بنقرة زر.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-850 flex items-center justify-between text-xs text-amber-500 font-bold">
                <span>تصفح الفواتير الجاهزة</span>
                <ArrowRight className="w-4 h-4 -scale-x-100 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

          {/* APK Android App Promotion Banner */}
          <div 
            onClick={() => setApkModalOpen(true)}
            className="group relative bg-gradient-to-l from-blue-950/20 via-stone-900 to-stone-900 border border-blue-900/45 hover:border-amber-500/40 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 max-w-5xl mx-auto shadow-xl hover:shadow-[#1E50BA]/5 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="absolute inset-x-0 -top-px h-0.5 bg-gradient-to-r from-transparent via-[#E96C20]/25 to-transparent" />
            
            <div className="flex flex-col sm:flex-row items-center gap-4 text-right">
              {/* Animated Phone / Install icon */}
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-850 flex items-center justify-center text-[#E96C20] group-hover:bg-[#E96C20] group-hover:text-stone-950 transition-all shrink-0">
                <Smartphone className="w-5.5 h-5.5 animate-bounce" style={{ animationDuration: '3s' }} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-950/40 border border-amber-900/30">تطبيق الأندرويد متوفر الآن</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <h4 className="text-sm font-black text-white group-hover:text-blue-400 transition-colors">هل تبحث عن سرعة أكبر؟ ثبّت تطبيق الهاتف APK</h4>
                <p className="text-[11px] text-stone-400">تصفح وجباتك المفضلة، اطلب كزائر أو سائق، وتابع التوصيل في الوقت الفعلي ومباشرة من جوالك.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#E96C20] text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl shadow group-hover:bg-amber-500 group-hover:scale-103 active:scale-97 transition-all shrink-0">
              <ArrowDownToLine className="w-4 h-4" />
              <span>تنزيل APK مجاناً</span>
            </div>
          </div>

          {/* Quick legal / copyright footer */}
          <p className="text-[10px] text-stone-600 font-medium font-mono">© {new Date().getFullYear()} منصة M Delivery • جميع الحقوق محفوظة لغايات إدارة ومعالجة وتوصيل الطلبات الفورية</p>

        </div>
      ) : (
        /* MAIN APPLICATION WORKSPACE */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

          {/* Elegant Top Header bar with Logout / Quick switch button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/40 p-4 rounded-2xl border border-stone-900 max-w-5xl mx-auto" dir="rtl">
            
            {/* Brand Logo Link to Welcome */}
            <div 
              onClick={() => setFlow('welcome')} 
              className="flex items-center gap-2 cursor-pointer group select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-900 border border-stone-800 flex items-center justify-center overflow-hidden shadow">
                <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                  <path d="M 140 220 L 180 60 L 210 60 L 235 145 L 260 60 L 290 60 L 250 220 L 215 220 L 195 155 L 175 220 Z" fill="#1E50BA" />
                  <path d="M 205 160 C 235 150 265 110 320 115 L 305 90 L 340 115 L 305 140 L 310 125 C 265 120 240 155 205 160 Z" fill="#E96C20" />
                </svg>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-white group-hover:text-blue-400 transition-all">M <span className="text-[#E96C20]">Delivery</span></span>
                <span className="block text-[8px] text-stone-400 font-bold">M لتوصيل الطلبات</span>
              </div>
            </div>

            {/* Toggle View Mode: Customer vs Staff vs Driver */}
            <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800 shadow-md w-full sm:w-[420px]">
              <button
                onClick={() => setViewMode('customer')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  viewMode === 'customer'
                    ? 'bg-stone-850 text-stone-100 shadow-sm border border-stone-800 text-amber-450'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                <span>الطلب الذاتي</span>
              </button>
              
              <button
                onClick={() => {
                  if (viewMode !== 'staff') {
                    setTargetView('app_staff');
                    setPinValue('');
                    setPinError(false);
                    setPinModalOpen(true);
                  }
                }}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all relative ${
                  viewMode === 'staff'
                    ? 'bg-stone-850 text-stone-100 shadow-sm border border-stone-800 text-amber-400'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-500" />
                <span>المطبخ</span>
                {invoices.filter(i => {
                  const prep = (i as any).preparationStatus || 'pending';
                  return prep === 'pending';
                }).length > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                    {invoices.filter(i => {
                      const prep = (i as any).preparationStatus || 'pending';
                      return prep === 'pending';
                    }).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setViewMode('driver')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  viewMode === 'driver'
                    ? 'bg-stone-850 text-stone-100 shadow-sm border border-stone-800 text-amber-450'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                <span>السائقين</span>
              </button>
            </div>

            {/* Logout/Leave App Workspace */}
            <button
              onClick={() => setFlow('welcome')}
              className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-stone-950/80 hover:bg-stone-900 border border-stone-850 text-stone-300 hover:text-red-400 text-xs font-semibold cursor-pointer transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>تسجيل خروج</span>
            </button>

          </div>
          
          {viewMode === 'customer' ? (
            <>
              {/* Modern Header Banner */}
              <Header
                currentTable={currentTable}
                orderType={orderType}
                onTableChange={setCurrentTable}
                onOrderTypeChange={setOrderType}
                deliveryName={deliveryName}
                deliveryAddress={deliveryAddress}
                deliveryPhone={deliveryPhone}
                onDeliveryNameChange={setDeliveryName}
                onDeliveryAddressChange={setDeliveryAddress}
                onDeliveryPhoneChange={setDeliveryPhone}
              />

              {/* Content Layout: 12 Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Menu Sections (Left - Columns 8) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <div>
                      <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                        <span>قائمة المأكولات والمشروبات</span>
                        <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
                      </h2>
                      <p className="text-xs text-stone-400 mt-0.5">اختر أطباقك المفضلة لتجهيز الفاتورة الفورية</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400 font-medium font-sans">
                      <span>مرر للأسفل</span>
                      <ArrowDown className="w-3.5 h-3.5 text-stone-400 animate-bounce" />
                    </div>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-900/40 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 text-right">
                      <p className="font-bold text-amber-500">انشئ المنيو الخاص بك بالدينار الأردني 🇯🇴</p>
                      <p className="text-stone-300 font-light">يمكنك ملء المنيو يدويًا بالكامل، أو تحميل عينات طعام أردنية شهيرة لتجربة النظام فوراً ثم تعديلها أو حذفها.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLoadSampleItems}
                      className="bg-brand-600 hover:bg-brand-700 text-stone-100 font-bold px-3.5 py-2 rounded-lg active:scale-95 transition-all text-[11px] whitespace-nowrap cursor-pointer shadow-md"
                    >
                      تحميل أطباق أردنية تجريبية
                    </button>
                  </div>

                  <MenuGrid 
                    menuItems={menuItems} 
                    onAddItem={handleAddItem}
                    onAddMenuItemToMenu={handleAddMenuItemToMenu}
                    onDeleteItemFromMenu={handleDeleteItemFromMenu}
                  />
                </div>

                {/* Cart Basket & Bills History (Right - Columns 4) */}
                <div className="lg:col-span-4 space-y-6">
                  <Cart
                    cartItems={cartItems}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onUpdateNotes={handleUpdateNotes}
                    onCheckout={handleCheckout}
                    orderType={orderType}
                    deliveryName={deliveryName}
                    deliveryAddress={deliveryAddress}
                    deliveryPhone={deliveryPhone}
                    onDeliveryNameChange={setDeliveryName}
                    onDeliveryAddressChange={setDeliveryAddress}
                    onDeliveryPhoneChange={setDeliveryPhone}
                  />

                  <OrderHistory
                    invoices={invoices}
                    onSelectInvoice={setActiveInvoice}
                  />
                </div>

              </div>
            </>
          ) : viewMode === 'staff' ? (
            <KitchenDashboard 
              invoices={invoices}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
              onClearAllInvoices={handleClearAllInvoices}
            />
          ) : (
            <DriverDashboard
              invoices={invoices}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          )}

        </div>
      )}

      {/* Modern Invoice popup */}
      {activeInvoice && (
        <InvoiceModal
          invoice={activeInvoice}
          onClose={() => setActiveInvoice(null)}
          onResetOrder={handleResetOrder}
        />
      )}

      {/* Secure PIN Entry Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto" dir="rtl">
          <div className="relative w-full max-w-sm bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl p-6 md:p-8 text-center space-y-6">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="mx-auto w-14 h-14 bg-amber-950/40 rounded-full border border-amber-900/30 flex items-center justify-center text-amber-500 animate-pulse">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">رمز دخول طاقم العمل</h3>
              <p className="text-xs text-stone-400">يرجى إدخال رمز الأمان المكون من 4 أرقام للمتابعة</p>
            </div>

            {/* Hidden Input field for native focus support if typed on hardware keyboards */}
            <input 
              type="text" 
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={4}
              value={pinValue}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 4) {
                  setPinError(false);
                  setPinValue(val);
                  if (val === '1919') {
                    if (targetView === 'welcome_staff') {
                      setFlow('app');
                      setViewMode('staff');
                    } else {
                      setViewMode('staff');
                    }
                    setPinValue('');
                    setPinModalOpen(false);
                  } else if (val.length === 4) {
                    setTimeout(() => {
                      setPinError(true);
                      setPinValue('');
                    }, 250);
                  }
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-default"
              autoFocus
            />

            {/* Visual Code Indicators */}
            <div className="flex justify-center gap-4 py-2">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    pinError 
                      ? 'border-red-500 bg-red-500 animate-bounce' 
                      : pinValue.length > idx 
                        ? 'border-amber-500 bg-amber-500 scale-110 shadow-lg shadow-amber-500/50' 
                        : 'border-stone-700 bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {pinError && (
              <p className="text-xs text-red-500 font-bold animate-pulse">
                عذراً، رمز الدخول المدخل غير صحيح ❌
              </p>
            )}

            {/* Custom Interactive Pad */}
            <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleNumberPress(num)}
                  className="w-14 h-14 rounded-full bg-stone-950 border border-stone-800 hover:border-amber-650 hover:bg-stone-850 text-white font-mono font-bold text-lg flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearPin}
                className="w-14 h-14 rounded-full bg-stone-950/40 text-stone-400 hover:text-red-400 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                مسح
              </button>
              <button
                type="button"
                onClick={() => handleNumberPress('0')}
                className="w-14 h-14 rounded-full bg-stone-950 border border-stone-800 hover:border-amber-650 hover:bg-stone-850 text-white font-mono font-bold text-lg flex items-center justify-center transition-all cursor-pointer active:scale-90"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className="w-14 h-14 rounded-full bg-stone-950/40 text-stone-400 hover:text-amber-500 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                تراجع
              </button>
            </div>

            {/* Cancel Actions */}
            <div className="pt-2 border-t border-stone-850 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setPinModalOpen(false);
                  setPinValue('');
                  setPinError(false);
                }}
                className="flex-1 bg-stone-950 hover:bg-stone-850 text-stone-400 hover:text-white border border-stone-800 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                إلغاء وإغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* APK Android App Downloader dialog window */}
      <ApkDownloadModal 
        isOpen={apkModalOpen} 
        onClose={() => setApkModalOpen(false)} 
      />
    </div>
  );
}

