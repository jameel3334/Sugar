export type Locale = 'en' | 'ar';

const en = {
  shop: 'Shop', collections: 'Collections', offer: 'Offer', search: 'Search 650+ scents', all: 'All',
  addToBag: 'Add to bag', added: 'Added', bag: 'Your bag', emptyBag: 'Your bag is empty', checkout: 'Checkout',
  continueShopping: 'Continue shopping', subtotal: 'Subtotal', bundleDiscount: 'Bundle discount', delivery: 'Delivery',
  free: 'Free', total: 'Total', size: 'Size', notes: 'Key notes', loadMore: 'Show more', results: 'scents',
  bundleTitle: '5 × 100ml for 20 KWD', bundleSub: 'Mix any five — free delivery across Kuwait',
  toNextBundle: (n: number) => `Add ${n} more 100ml ${n === 1 ? 'bottle' : 'bottles'} to unlock 5 for 20 KWD`,
  bundleUnlocked: 'Bundle unlocked — free delivery!',
  name: 'Full name', phone: 'Mobile (+965)', governorate: 'Governorate', area: 'Area', block: 'Block', street: 'Street',
  avenue: 'Avenue (optional)', house: 'House / Building', floor: 'Floor / Apt (optional)', orderNotes: 'Notes for the driver',
  payment: 'Payment', cash: 'Cash on delivery', knet: 'KNET on delivery', placeOrder: 'Place order', placing: 'Placing order…',
  required: 'Required', invalidPhone: 'Enter a valid Kuwaiti mobile', thanks: 'Thank you!', orderPlaced: 'Your order is placed',
  reference: 'Reference', sendWhatsapp: 'Send to us on WhatsApp', demoNote: 'Preview mode — order not sent to TradeMax yet.',
  men: 'Men', women: 'Women', unisex: 'Unisex', family: 'Family', gender: 'For', collection: 'Collection',
  signatures: 'SP Signatures', heroTitle: 'Luxury scents, honestly priced', heroSub: 'Inspired by the world’s icons. Blended for Kuwait.',
  explore: 'Explore scents', quickView: 'Quick view', soldOut: 'Sold out', back: 'Back', design: 'Design',
  quizTitle: 'Find your scent', quizStart: 'Start the quiz', mood: 'Shop by mood',
};

const ar: typeof en = {
  shop: 'تسوق', collections: 'المجموعات', offer: 'العرض', search: 'ابحث في أكثر من ٦٥٠ عطر', all: 'الكل',
  addToBag: 'أضف للسلة', added: 'تمت الإضافة', bag: 'سلتك', emptyBag: 'سلتك فارغة', checkout: 'إتمام الطلب',
  continueShopping: 'متابعة التسوق', subtotal: 'المجموع', bundleDiscount: 'خصم العرض', delivery: 'التوصيل',
  free: 'مجاني', total: 'الإجمالي', size: 'الحجم', notes: 'المكونات', loadMore: 'عرض المزيد', results: 'عطر',
  bundleTitle: '٥ قطع × ١٠٠ مل بـ ٢٠ د.ك', bundleSub: 'اختر أي خمسة — توصيل مجاني لجميع مناطق الكويت',
  toNextBundle: (n: number) => `أضف ${n} ${n === 1 ? 'عطر' : 'عطور'} ١٠٠ مل للحصول على عرض ٥ بـ ٢٠ د.ك`,
  bundleUnlocked: 'تم تفعيل العرض — توصيل مجاني!',
  name: 'الاسم الكامل', phone: 'رقم الهاتف (+965)', governorate: 'المحافظة', area: 'المنطقة', block: 'القطعة', street: 'الشارع',
  avenue: 'الجادة (اختياري)', house: 'المنزل / المبنى', floor: 'الدور / الشقة (اختياري)', orderNotes: 'ملاحظات للسائق',
  payment: 'الدفع', cash: 'الدفع نقداً عند الاستلام', knet: 'كي نت عند الاستلام', placeOrder: 'تأكيد الطلب', placing: 'جاري الإرسال…',
  required: 'مطلوب', invalidPhone: 'أدخل رقم هاتف كويتي صحيح', thanks: 'شكراً لك!', orderPlaced: 'تم استلام طلبك',
  reference: 'رقم الطلب', sendWhatsapp: 'أرسل الطلب عبر واتساب', demoNote: 'وضع المعاينة — لم يتم الإرسال إلى TradeMax بعد.',
  men: 'رجالي', women: 'نسائي', unisex: 'للجنسين', family: 'العائلة', gender: 'لـ', collection: 'المجموعة',
  signatures: 'توقيع SP', heroTitle: 'عطور فاخرة بأسعار عادلة', heroSub: 'مستوحاة من أشهر العطور العالمية. ممزوجة للكويت.',
  explore: 'اكتشف العطور', quickView: 'عرض سريع', soldOut: 'نفذت الكمية', back: 'رجوع', design: 'التصميم',
  quizTitle: 'اكتشف عطرك', quizStart: 'ابدأ الاختبار', mood: 'تسوق حسب المزاج',
};

export const dictionaries = { en, ar };
export type Dictionary = typeof en;
export const t = (locale: Locale): Dictionary => dictionaries[locale];
export const dir = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');
