import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Flame, 
  Sparkles, 
  Leaf, 
  Utensils, 
  Soup, 
  Cake, 
  Coffee, 
  Grid, 
  Plus, 
  Eye,
  Trash2,
  FolderOpen,
  PlusCircle,
  X,
  PlusSquare,
  Sparkle
} from 'lucide-react';
import { MenuItem, Category } from '../types';
import { CATEGORIES } from '../data';
import { formatCurrency } from '../utils';

// Dynamic icon resolver
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Grid: Grid,
  Soup: Soup,
  Utensils: Utensils,
  Flame: Flame,
  Cake: Cake,
  Coffee: Coffee,
};

// Preset beautiful emojis for food picker
const MENU_EMOJIS = ['🍲', '🥘', '🍛', '🥩', '🍗', '🍖', '🍔', '🍟', '🍕', '🥪', '🌯', '🥗', '🥣', '🍣', '🍰', '🧁', '🍮', '🍩', '🍪', '🍨', '🥤', '🍹', '☕', '🥛'];

interface MenuGridProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
  onAddMenuItemToMenu: (item: MenuItem) => void;
  onDeleteItemFromMenu: (id: string) => void;
}

export default function MenuGrid({ menuItems, onAddItem, onAddMenuItemToMenu, onDeleteItemFromMenu }: MenuGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailItem, setActiveDetailItem] = useState<MenuItem | null>(null);
  
  // Custom item adder form states
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formNameAr, setFormNameAr] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formDescAr, setFormDescAr] = useState('');
  const [formDescEn, setFormDescEn] = useState('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formCategory, setFormCategory] = useState('mains');
  const [formImage, setFormImage] = useState('🍲');
  const [formCalories, setFormCalories] = useState<string>('');
  
  const [formIsPopular, setFormIsPopular] = useState(false);
  const [formIsSpicy, setFormIsSpicy] = useState(false);
  const [formIsVegetarian, setFormIsVegetarian] = useState(false);
  
  // validation state
  const [validationError, setValidationError] = useState('');

  // Filter and search items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = 
        item.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleSubmitNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!formNameAr.trim() || !formNameEn.trim()) {
      setValidationError('يرجى كتابة اسم الصنف بالعربية والإنجليزية');
      return;
    }

    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setValidationError('يرجى إدخال سعر صحيح أكبر من الصفر');
      return;
    }

    const newItem: MenuItem = {
      id: `custom-item-${Date.now()}`,
      nameAr: formNameAr.trim(),
      nameEn: formNameEn.trim(),
      descriptionAr: formDescAr.trim() || 'صنف طعام لذيذ ومعد خصيصاً بمكونات جودة عالية.',
      descriptionEn: formDescEn.trim() || 'Specially crafted delicious food item made with premium ingredients.',
      price: parsedPrice,
      category: formCategory,
      image: formImage,
      calories: formCalories ? parseInt(formCalories) : undefined,
      isPopular: formIsPopular,
      isSpicy: formIsSpicy,
      isVegetarian: formIsVegetarian
    };

    onAddMenuItemToMenu(newItem);

    // Reset Form
    setFormNameAr('');
    setFormNameEn('');
    setFormDescAr('');
    setFormDescEn('');
    setFormPrice('');
    setFormCalories('');
    setFormIsPopular(false);
    setFormIsSpicy(false);
    setFormIsVegetarian(false);
    setIsAddingNew(false);
  };

  return (
    <div className="flex-1 space-y-6">
      
      {/* Category selector slider & Dynamic item management buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="overflow-x-auto pb-2 scrollbar-none flex gap-2 w-full sm:w-auto">
          {CATEGORIES.map((cat) => {
            const IconComponent = iconMap[cat.iconName] || Utensils;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-brand-600 text-stone-100 shadow-lg shadow-brand-600/30 border border-brand-500/30'
                    : 'bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-stone-500'}`} />
                <div className="flex flex-col items-start leading-none text-right">
                  <span className="font-bold text-[11px] sm:text-xs">{cat.nameAr}</span>
                  <span className={`text-[8px] font-normal ${isSelected ? 'text-brand-100' : 'text-stone-500'}`}>{cat.nameEn}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Trigger Form Toggle */}
        <button
          onClick={() => setIsAddingNew(!isAddingNew)}
          className="flex-shrink-0 bg-stone-900 border border-stone-800 text-brand-500 hover:text-brand-400 font-extrabold text-xs px-4 py-3 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer w-full sm:w-auto"
        >
          {isAddingNew ? (
            <>
              <X className="w-4 h-4 text-red-400" />
              <span>إغلاق النموذج</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 text-brand-500" />
              <span>إضافة صنف جديد للمنيو</span>
            </>
          )}
        </button>
      </div>

      {/* Add New Item Form section */}
      <AnimatePresence>
        {isAddingNew && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmitNewItem} className="bg-white p-5 rounded-2xl border-2 border-stone-200/90 shadow-lg space-y-4 text-right">
              <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
                <PlusSquare className="w-5 h-5 text-brand-600" />
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">تعبئة مواصفات صنف طعام جديد</h3>
                  <p className="text-[10px] text-stone-400">سيتم حفظ الصنف فوراً في قائمة الطعام الذاتي</p>
                </div>
              </div>

              {validationError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-bold">
                  {validationError}
                </div>
              )}

              {/* Names row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">اسم الصنف باللغة العربية *</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder="مثال: منسف كركي بلدي"
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    className="w-full text-right text-xs py-2 px-3 rounded-lg bg-stone-50 border border-stone-250 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">اسم الصنف بالإنجليزي (English) *</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder="e.g., Traditional Karaki Mansaf"
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    className="w-full text-left text-xs py-2 px-3 rounded-lg bg-stone-50 border border-stone-250 focus:outline-none focus:border-brand-500 focus:bg-white font-mono"
                    style={{ direction: 'ltr' }}
                  />
                </div>
              </div>

              {/* Descriptions row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">الوصف بالعربية</label>
                  <textarea
                    rows={2}
                    maxLength={150}
                    placeholder="وصف الطبق، المكونات، طريقة التقديم..."
                    value={formDescAr}
                    onChange={(e) => setFormDescAr(e.target.value)}
                    className="w-full text-right text-xs py-2 px-3 rounded-lg bg-stone-50 border border-stone-250 focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">الوصف بالإنجليزي (Description English)</label>
                  <textarea
                    rows={2}
                    maxLength={150}
                    placeholder="Ingredients, standard serving, allergen declarations..."
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    className="w-full text-left text-xs py-2 px-3 rounded-lg bg-stone-50 border border-stone-250 focus:outline-none focus:border-brand-500 focus:bg-white font-mono"
                    style={{ direction: 'ltr' }}
                  />
                </div>
              </div>

              {/* Price, Category, Calories */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">السعر بالدينار الأردني *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="الأرقام بالإنجليزية فقط: 12.50"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full text-right text-xs py-2 pl-12 pr-3 rounded-lg bg-stone-50 border border-stone-250 focus:outline-none focus:border-brand-500 focus:bg-white font-mono"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">د.أ</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">القسم / الفئة</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-right text-xs py-2 px-3 rounded-lg bg-stone-50 border border-stone-250 focus:outline-none focus:border-brand-500 focus:bg-white font-sans"
                  >
                    <option value="appetizers">المقبلات (Appetizers)</option>
                    <option value="mains">الأطباق الرئيسية (Mains)</option>
                    <option value="grills">المشويات (Grills)</option>
                    <option value="desserts">الحلويات (Desserts)</option>
                    <option value="drinks">المشروبات (Drinks)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">السعرات الحرارية (اختياري)</label>
                  <input
                    type="number"
                    placeholder="مثال: 450"
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                    className="w-full text-right text-xs py-2 px-3 rounded-lg bg-stone-50 border border-stone-250 focus:outline-none focus:border-brand-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Emoji Icon picker */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">أيقونة الصنف (تفصل حسب شكل الطبق)</label>
                <div className="flex flex-wrap gap-1.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  {MENU_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormImage(emoji)}
                      className={`w-9 h-9 text-lg rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                        formImage === emoji 
                          ? 'bg-amber-600 scale-110 shadow-md text-white' 
                          : 'bg-white hover:bg-stone-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food features (Tags) */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs">
                <label className="flex items-center gap-1.5 font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>طبق شائع بمبيعات عالية (شائع)</span>
                </label>

                <label className="flex items-center gap-1.5 font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsSpicy}
                    onChange={(e) => setFormIsSpicy(e.target.checked)}
                    className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>يحتوي على فلفل وحار (حار)</span>
                </label>

                <label className="flex items-center gap-1.5 font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsVegetarian}
                    onChange={(e) => setFormIsVegetarian(e.target.checked)}
                    className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span>خضار ومكونات عشبية (نباتي)</span>
                </label>
              </div>

              {/* Submit button */}
              <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="bg-stone-100 text-stone-600 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
                >
                  حفظ الصنف ونشره في المنيو
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input and status bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between font-sans">
        <div className="relative flex-1">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-500" />
          <input
            type="text"
            placeholder="ابحث عن وجبة، مقبلات، مشروب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-right pl-4 pr-10 py-2.5 bg-stone-900 text-stone-100 text-sm rounded-xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-brand-500/25 focus:border-brand-500 transition-all font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
            >
              مسح
            </button>
          )}
        </div>

        <div className="text-xs text-stone-300 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800 self-start sm:self-auto font-medium">
          تم العثور على: {filteredItems.length} صنفًا
        </div>
      </div>

      {/* Menu Grid list */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 bg-stone-100/50 rounded-2xl border-2 border-dashed border-stone-200 p-6">
          <FolderOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-600 font-extrabold mb-1">المنيو فارغ حالياً</p>
          <p className="text-stone-400 text-xs max-w-sm mx-auto">
            انقر على زر <span className="font-bold text-brand-600">إضافة صنف جديد للمنيو</span> لتبدأ بإدخال مأكولاتك، مشوياتك وحلوياتك بأسعارها ونشرها في القائمة فورا!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-stone-900 rounded-2xl border border-stone-850 hover:border-brand-500/50 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Card Top Section */}
                <div className="p-4 flex gap-4">
                  {/* Styled Food Icon representation */}
                  <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-stone-950 group-hover:bg-brand-950/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner border border-stone-800 transition-colors">
                    {item.image}
                    {item.calories !== undefined && (
                      <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 whitespace-nowrap">
                        {item.calories} سعرة
                      </span>
                    )}
                  </div>

                  {/* Food description */}
                  <div className="flex-1 space-y-1 text-right">
                    <div className="flex flex-wrap items-start justify-between gap-1">
                      <div>
                        <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors text-base text-right">
                          {item.nameAr}
                        </h3>
                        <p className="text-[11px] text-stone-400 font-mono tracking-tight font-medium text-right">
                          {item.nameEn}
                        </p>
                      </div>
                      
                      {/* Price Badge */}
                      <span className="text-sm font-extrabold text-brand-400 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800 font-mono">
                        {formatCurrency(item.price)}
                      </span>
                    </div>

                    <p className="text-xs text-stone-300 line-clamp-2 pt-1 font-light leading-relaxed text-right">
                      {item.descriptionAr}
                    </p>

                    {/* Food Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1.5 justify-start">
                      {item.isPopular && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-amber-950/40 text-amber-300 px-1.5 py-0.5 rounded border border-amber-900/40">
                          <Sparkles className="w-2.5 h-2.5" />
                          شائع
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-red-950/40 text-red-350 px-1.5 py-0.5 rounded border border-red-900/40">
                          <Flame className="w-2.5 h-2.5" />
                          حار
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-emerald-950/40 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-900/40">
                          <Leaf className="w-2.5 h-2.5" />
                          نباتي
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action bar */}
                <div className="bg-stone-950/30 px-4 py-3 border-t border-stone-800/80 flex items-center justify-between gap-4 font-sans">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveDetailItem(item)}
                      className="text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      تفاصيل
                    </button>

                    <button
                      onClick={() => onDeleteItemFromMenu(item.id)}
                      className="text-stone-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title="احذف الصنف نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </button>
                  </div>

                  <button
                    onClick={() => onAddItem(item)}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    إضافة للطلب
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Details Dialog overlay */}
      <AnimatePresence>
        {activeDetailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDetailItem(null)}
              className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs"
            />

            {/* Dialog Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 text-right text-stone-100"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <button
                    onClick={() => setActiveDetailItem(null)}
                    className="p-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
                  >
                    إغلاق
                  </button>
                  
                  <div className="w-16 h-16 rounded-xl bg-stone-950 text-4xl flex items-center justify-center shadow-inner border border-stone-800">
                    {activeDetailItem.image}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white">{activeDetailItem.nameAr}</h3>
                  <p className="text-xs text-stone-400 font-mono mt-0.5">{activeDetailItem.nameEn}</p>
                </div>

                <div className="p-3 bg-stone-950 rounded-xl space-y-1.5 text-xs text-stone-300 leading-relaxed font-light">
                  <p className="font-semibold text-brand-400">الوصف المعتمد:</p>
                  <p>{activeDetailItem.descriptionAr}</p>
                  <p className="italic font-mono text-stone-500 mt-1 border-t border-stone-800 pt-1.5">{activeDetailItem.descriptionEn}</p>
                </div>

                {/* Info summary */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                    <p className="text-stone-500 text-[10px]">السعر المحدد</p>
                    <p className="font-extrabold text-brand-400 mt-0.5">{formatCurrency(activeDetailItem.price)}</p>
                  </div>
                  <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800">
                    <p className="text-stone-500 text-[10px]">السعرات الحرارية</p>
                    <p className="font-extrabold text-stone-300 mt-0.5">{activeDetailItem.calories ?? 'غير محدد'} كالوري</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      onAddItem(activeDetailItem);
                      setActiveDetailItem(null);
                    }}
                    className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة إلى الطلبات
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
