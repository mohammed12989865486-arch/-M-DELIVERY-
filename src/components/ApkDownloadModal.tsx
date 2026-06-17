import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Smartphone, Shield, Sparkles, HelpCircle, 
  Download, ExternalLink, Chrome, Compass, Info, Check, ArrowRight, Copy, Github
} from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApkDownloadModal({ isOpen, onClose }: ApkDownloadModalProps) {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk'>('pwa');
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [copied, setCopied] = useState(false);

  const getPermanentSharedUrl = () => {
    let url = window.location.origin || window.location.href;
    
    // Replace development subdomain prefix with the permanent preview/shared one if it matches AI Studio pattern
    if (url.includes('ais-dev-')) {
      url = url.replace('ais-dev-', 'ais-pre-');
    }
    // Also strip trailing slashes to keep it super clean
    return url.replace(/\/+$/, "");
  };

  const handleCopyUrl = async () => {
    const url = getPermanentSharedUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for sandboxed iframes
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy', err);
    }
  };

  const triggerInstructionTxt = () => {
    setDownloadState('downloading');
    
    setTimeout(() => {
      setDownloadState('completed');
      
      const instructions = `
=========================================
   M Delivery - أدوات تحويل التطبيق لملف APK
=========================================
بما أن هذه منصة تطوير برمجية سحابية (Web App Sandbox)، لا تمكن البيئة من تجميع ملفات ثنائية تالفة (.apk) ذات حجم كبير مباشرة من المتصفح.

للحصول على تطبيق أندرويد حقيقي بصيغة APK متكامل:
1. اذهب إلى قائمة الإعدادات (Settings) في أعلى يمين واجهة Build AI Studio.
2. اضغط على خيار "تصدير كـ ZIP" (Export as ZIP) لتحميل الكود البرمجي الكامل للمشروع.
3. استخدم إحدى المنصات المجانية التالية لتحويل ملفات الويب المفكوكة إلى ملّف APK حقيقي خلال دقيقة واحدة:
   - Web2APK (https://www.web2apk.com)
   - CapacitorJS (بسطر أوامر بسيط: npx cap add android)
   - Cordova / PhoneGap

رابط المنصة المباشر للتشغيل الفوري: ${getPermanentSharedUrl()}
=========================================
`;
      const blob = new Blob([instructions], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'M-Delivery-APK-Build-Guide.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 800);
  };

  if (!isOpen) return null;

  const appUrl = getPermanentSharedUrl();
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=1e50ba&bgcolor=ffffff&qzone=1&data=${encodeURIComponent(appUrl)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" dir="rtl">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-950/85 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, y: 15, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 15, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden z-10"
        >
          {/* Status highlight line */}
          <div className="h-1.5 bg-gradient-to-r from-[#1E50BA] to-[#E96C20]" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-xl bg-stone-950/50 hover:bg-stone-850 text-stone-400 hover:text-white transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Header Title with animated Phone */}
            <div className="flex items-center gap-4 text-right pt-2 border-b border-stone-800 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/30 border border-blue-900/40 flex items-center justify-center text-blue-400 shrink-0">
                <Smartphone className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full bg-[#1E50BA]/10 text-blue-400 border border-[#1E50BA]/20">التشغيل على الجوال</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                </div>
                <h3 className="text-xl font-black text-white mt-1">تشغيل وتثبيت تطبيق M Delivery على الهاتف</h3>
                <p className="text-stone-400 text-xs mt-0.5">تجنب مشكلة تحليل الحزمة (Parsing Error) واستمتع بواجهة سريعة وكاملة.</p>
              </div>
            </div>

            {/* Explanatory Info Banner */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-right">
              <Info className="w-5 h-5 text-[#E96C20] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-amber-500 text-xs font-bold font-sans">توضيح هام بخصوص خطأ "مشكلة في تحليل الحزمة"</h4>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  أنظمة أندرويد تظهر هذا الخطأ عند محاولة فتح ملف ليس حزمة تثبيت أندرويد حقيقية (حيث أن المتصفح هنا لا يمكنه تجميع كود الويب البرمجي إلى حزمة ثنائية APK مشفرة مباشرة). 
                  لقد وفرنا لك أفضل طريقتين لتشغيل التطبيق كشاشة كاملة وبسرعة فائقة.
                </p>
              </div>
            </div>

            {/* Custom Tab Selector */}
            <div className="flex bg-stone-950 p-1 rounded-xl border border-stone-850">
              <button
                onClick={() => setActiveTab('pwa')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'pwa'
                    ? 'bg-gradient-to-r from-[#1E50BA] to-blue-600 text-white shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>التشغيل والربط بالمتصفح (موصى به)</span>
              </button>
              <button
                onClick={() => setActiveTab('apk')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'apk'
                    ? 'bg-gradient-to-r from-[#E96C20] to-amber-600 text-white shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>إنشاء تطبيق APK ونشره على GitHub</span>
              </button>
            </div>

            {/* PWA Tab Content */}
            {activeTab === 'pwa' && (
              <div className="space-y-5">
                <div className="text-right">
                  <h4 className="text-sm font-bold text-white mb-2">رابط تشغيل الويب الذكي المباشر (PWA):</h4>
                  <p className="text-stone-400 text-xs leading-relaxed">
                    يعمل تماماً مثل أي تطبيق عادي من المتجر (بدون شريط متصفح، استجابة سريعة جداً، واستهلاك منخفض جداً لبيانات هاتفك).
                  </p>
                </div>

                {/* Instant Link Copy & Dynamic QR Code section */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-850 flex flex-col md:flex-row items-center gap-5">
                  <div className="flex-1 w-full space-y-3">
                    <label className="block text-stone-400 text-xs font-bold text-right">رابط التطبيق لمشاركته أو فتحه على الهاتف:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={appUrl}
                        className="bg-stone-900 border border-stone-800 text-stone-200 text-xs font-mono rounded-xl px-3 py-2.5 flex-1 select-all focus:outline-none"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="px-3.5 py-2.5 rounded-xl bg-blue-950/45 border border-blue-900/50 hover:bg-blue-900/50 text-blue-400 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span className="text-xs font-bold">{copied ? 'تم النسخ!' : 'نسخ'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed text-right">
                      انسخ هذا الرابط وأرسله لنفسك أو افتحه بمستعرض جوالك لتتمكن من تنصيب التطبيق بنقرة زر واحدة.
                    </p>
                  </div>
                  
                  {/* Real QR Code using official qrserver details */}
                  <div className="flex flex-col items-center p-2.5 bg-white rounded-2xl shrink-0 shadow-lg border border-stone-800">
                    <img 
                      src={qrCodeUrl} 
                      alt="رابط كيو آر كود للتطبيق" 
                      className="w-28 h-28 object-contain"
                    />
                    <span className="text-[9px] text-[#1E50BA] font-black mt-2 leading-none">امسح بكاميرا هاتفك للفتح فوراً!</span>
                  </div>
                </div>

                {/* Steps Grid */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-850/80 flex gap-4 text-right">
                    <div className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#E96C20] shrink-0 font-bold text-sm">
                      1
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-stone-200 text-xs font-bold">افتح الرابط في متصفح هاتفك</h5>
                      <p className="text-stone-400 text-[11px] leading-relaxed">
                        افتح الرابط المنسوخ أعلاه في هاتفك الذكي باستخدام متصفح <span className="text-blue-400 font-bold">Chrome (لأندرويد)</span> أو <span className="text-amber-500 font-bold">Safari (للايفون)</span>.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-850/80 flex gap-4 text-right">
                    <div className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#E96C20] shrink-0 font-bold text-sm">
                      2
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-stone-200 text-xs font-bold">اختر "إضافة لشاشتك الرئيسية"</h5>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                        <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800 space-y-1">
                          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                            <Chrome className="w-3.5 h-3.5" />
                            <span>على هواتف الأندرويد:</span>
                          </div>
                          <p className="text-stone-400 leading-normal">
                            اضغط على زر النقاط الثلاثة <span className="text-white">⋮</span> بأعلى المتصفح ثم اختر <span className="text-white font-bold">"الإضافة إلى الشاشة الرئيسية"</span> (Add to Home screen).
                          </p>
                        </div>

                        <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800 space-y-1">
                          <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                            <Compass className="w-3.5 h-3.5" />
                            <span>على هواتف الآيفون:</span>
                          </div>
                          <p className="text-stone-400 leading-normal">
                            اضغط على زر المشاركة <span className="text-white">⎋</span> في القائمة السفلية لـ Safari ثم اختر <span className="text-white font-bold">"إلى الشاشة الرئيسية"</span> (Add to Home Screen).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-stone-950/60 p-3.5 rounded-2xl border border-stone-850/80 flex gap-4 text-right">
                    <div className="w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#E96C20] shrink-0 font-bold text-sm">
                      3
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-stone-200 text-xs font-bold">افتح التطبيق وباشر الطلب والتحكم!</h5>
                      <p className="text-stone-400 text-[11px] leading-relaxed">
                        ستظهر أيقونة التطبيق M Delivery على جوالك بجوار تطبيقاتك المفضلة، افتحها واستخدم النظام بواجهة كاملة مريحة وسريعة.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-[#1E50BA] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow active:scale-95 transition-all cursor-pointer"
                  >
                    <span>فهمت الطريقة، سأجرب ذلك الآن على هاتفي 👍</span>
                  </button>
                </div>
              </div>
            )}

            {/* APK Tab Content (Now extended with GitHub and settings guide) */}
            {activeTab === 'apk' && (
              <div className="space-y-5 text-right">
                
                {/* Exporting & GitHub Guide */}
                <div className="bg-blue-950/20 border border-blue-900/40 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold">
                    <Github className="w-5 h-5" />
                    <h4 className="text-xs font-bold">كيفية تنزيل التطبيق بنسخته الدائمة ونشره على GitHub:</h4>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    منصة Google AI Studio تتيح لك تصدير الكود المصدري الدائم لتطبيقك أو نشره مباشرة على حسابك في GitHub باتباع الخطوات البسيطة التالية:
                  </p>
                  <div className="space-y-2 text-[11px] text-stone-400 mr-2">
                    <div className="flex gap-2">
                      <span className="text-[#E96C20] font-bold">•</span>
                      <span>افتح <b>قائمة الإعدادات (Settings ⚙️)</b> في أعلى يمين واجهة Build AI Studio الحالية.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#E96C20] font-bold">•</span>
                      <span>اضغط على خيار <b>"Export to GitHub"</b> لربط وإرسال الكود فوراً إلى مستودع جديد على حسابك في GitHub.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[#E96C20] font-bold">•</span>
                      <span>أو اختر <b>"Download ZIP"</b> للحصول على كامل الملفات والرموز البرمجية للعمل بها محلياً على جهازك.</span>
                    </div>
                  </div>
                </div>

                <p className="text-stone-400 text-xs leading-relaxed">
                  إذا كنت ترغب بالاحتفاظ بملف تثبيت أندرويد حقيقي بصيغة (.apk) لنشره على متجر قوقل بلاي أو إرساله للعملاء، يمكنك استغلال الملفات المصدرة:
                </p>

                <div className="space-y-3.5">
                  <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-850 space-y-1.5">
                    <h5 className="text-white text-xs font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E96C20]" />
                      الخطوة 1: استخدام الكود المصدّر من AI Studio
                    </h5>
                    <p className="text-stone-400 text-[11px] leading-relaxed mr-4">
                      بعد حفظ الكود البرمجي الكامل لمشروعك (سواء عبر تحميل ZIP أو مزامنته من مستودع GitHub الخاص بك)، سيكون لديك مشروع React كامل كلياً مع TypeScript جاهز للتعبئة والتثبيت الثنائي.
                    </p>
                  </div>

                  <div className="bg-stone-950/60 p-4 rounded-2xl border border-stone-850 space-y-1.5">
                    <h5 className="text-white text-xs font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E96C20]" />
                      الخطوة 2: تحويل الويب لتطبيق تثبيت حقيقي لمتجر جوجل
                    </h5>
                    <p className="text-stone-400 text-[11px] leading-relaxed mr-4">
                      استخدم أدوات تعبئة مجانية وسهلة جداً مثل <a href="https://web2apk.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 font-bold hover:underline inline-flex items-center gap-0.5">Web2APK <ExternalLink className="w-2.5 h-2.5" /></a> أو CapacitorJS لتوليد ملف APK حقيقي وجاهز للتنصيب على أجهزة المستخدمين يدعم كافة معايير أندرويد الرسمية.
                    </p>
                  </div>
                </div>

                {/* Instructions Text Download Button */}
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2 text-stone-400">
                    <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-[11px] text-stone-300 font-medium">دليل تفصيلي جاهز وبسيط متاح للتحميل</span>
                  </div>
                  
                  {downloadState === 'idle' ? (
                    <button
                      onClick={triggerInstructionTxt}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E96C20] to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>تنزيل دليل التثبيت والمصادر</span>
                    </button>
                  ) : downloadState === 'downloading' ? (
                    <span className="text-xs text-stone-400 animate-pulse font-bold">جاري تنزيل الملف...</span>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> تم التنزيل! تصفح دليل تحويل APK على جهازك.
                    </span>
                  )}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
