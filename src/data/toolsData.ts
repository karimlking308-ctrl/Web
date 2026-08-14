import { CategoryInfo, ToolDefinition } from '../types';

export const categoriesData: CategoryInfo[] = [
  {
    id: 'image',
    name: 'Image Tools',
    nameAr: 'أدوات الصور',
    description: 'Resize, compress, convert and edit images',
    descriptionAr: 'تغيير حجم الصور وضغطها وتحويلها وتعديلها',
    icon: 'ImageIcon',
    badgeColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    bgGradient: 'from-emerald-500/10 to-teal-500/5',
    iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    nameAr: 'أدوات PDF',
    description: 'Convert, merge, split, compress PDF files',
    descriptionAr: 'تحويل ودمج وتقسيم وضغط ملفات PDF',
    icon: 'FileTextIcon',
    badgeColor: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-800',
    bgGradient: 'from-red-500/10 to-rose-500/5',
    iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  {
    id: 'code',
    name: 'Code Tools',
    nameAr: 'أدوات البرمجة',
    description: 'Format, validate, convert and generate code',
    descriptionAr: 'تنسيق والتحقق من صحة وتحويل وإنشاء الأكواد',
    icon: 'CodeIcon',
    badgeColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    bgGradient: 'from-purple-500/10 to-indigo-500/5',
    iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    id: 'text',
    name: 'Text Tools',
    nameAr: 'أدوات النصوص',
    description: 'Count, convert, clean and analyze text',
    descriptionAr: 'عد وتحويل وتنظيف وتحليل النصوص والكلمات',
    icon: 'TypeIcon',
    badgeColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    bgGradient: 'from-amber-500/10 to-yellow-500/5',
    iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    id: 'calculators',
    name: 'Calculators',
    nameAr: 'الحاسبات',
    description: 'Financial, health, math and other calculators',
    descriptionAr: 'حاسبات مالية، تاريخية، نسبة مئوية ورياضية',
    icon: 'CalculatorIcon',
    badgeColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    bgGradient: 'from-blue-500/10 to-sky-500/5',
    iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'converters',
    name: 'Converters',
    nameAr: 'المحولات',
    description: 'Unit, data, time and other converters',
    descriptionAr: 'تحويل وحدات القياس، البيانات، الوقت والحرارة',
    icon: 'RefreshCwIcon',
    badgeColor: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    bgGradient: 'from-cyan-500/10 to-teal-500/5',
    iconBg: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/50 dark:text-cyan-400',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
  },
];

export const allToolsData: ToolDefinition[] = [
  // ================= IMAGE TOOLS =================
  {
    id: 'image-resizer',
    slug: 'image-resizer',
    name: 'Image Resizer',
    nameAr: 'تغيير حجم الصور',
    description: 'Resize images to any custom width and height with pixel-perfect aspect ratio preservation.',
    descriptionAr: 'تغيير أبعاد وحجم الصور إلى أي طول وعرض مع الحفاظ التام على تناسب الأبعاد.',
    category: 'image',
    icon: 'Maximize2Icon',
    isPopular: true,
    keywords: ['resize image', 'photo resizer', 'scale picture', 'dimensions', 'width height', 'aspect ratio', 'crop'],
    keywordsAr: ['تصغير الصور', 'تغيير ابعاد الصورة', 'تكبير الصور', 'ريسايز'],
    features: [
      'Custom pixel width & height controls',
      'Lock or unlock original aspect ratio',
      'Preset common dimensions (1080p, 4K, Instagram, Twitter)',
      'Export to PNG, JPEG, or WEBP with instant download',
      '100% private browser processing'
    ],
    featuresAr: [
      'تحديد دقيق للأبعاد بالبكسل أو النسبة المئوية',
      'قفل أو فتح تناسب الأبعاد الأصلية',
      'أبعاد جاهزة لوسائل التواصل الاجتماعي (إنستغرام، تويتر، يوتيوب)',
      'تصدير فوري بصيغ PNG أو JPEG أو WEBP',
      'معالجة محلية بالكامل داخل المتصفح بدون رفع'
    ],
    howToUse: [
      { step: 1, title: 'Upload Image', desc: 'Drag and drop or select an image from your computer.' },
      { step: 2, title: 'Set Dimensions', desc: 'Enter your desired width and height, or pick a percentage scaling.' },
      { step: 3, title: 'Download Resized File', desc: 'Click Download to instantly save your resized image.' }
    ],
    howToUseAr: [
      { step: 1, title: 'رفع الصورة', desc: 'قم بسحب وإفلات أو اختيار صورتك من جهازك.' },
      { step: 2, title: 'تحديد الأبعاد', desc: 'أدخل العرض والارتفاع المطلوبين أو اختر نسبة مئوية.' },
      { step: 3, title: 'تحميل الصورة', desc: 'انقر على تحميل لحفظ صورتك بالأبعاد الجديدة فوراً.' }
    ],
    faqs: [
      { q: 'Will resizing reduce my image quality?', a: 'Sol Tools utilizes high-quality bicubic smoothing algorithms to preserve maximum sharpness during scaling.' },
      { q: 'Is my image uploaded to any server?', a: 'No, all image processing occurs directly in your browser using the HTML5 Canvas API.' }
    ],
    faqsAr: [
      { q: 'هل يؤثر تغيير الحجم على جودة الصورة؟', a: 'يستخدم Sol Tools خوارزميات تنعيم عالية الدقة للحفاظ على وضوح الصورة بأفضل جودة ممكنة.' },
      { q: 'هل يتم رفع الصور إلى أي خادم خارجي؟', a: 'لا، تتم جميع معالجات الصور محلياً بالكامل داخل متصفحك للحفاظ على خصوصيتك المطلقة.' }
    ],
    relatedToolIds: ['image-compressor', 'image-converter', 'image-cropper', 'image-rotator']
  },
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    name: 'Image Compressor',
    nameAr: 'ضغط الصور',
    description: 'Compress PNG, JPG, and WEBP images to reduce file size while maintaining excellent visual clarity.',
    descriptionAr: 'تقليل حجم ملفات الصور بصيغ PNG و JPG و WEBP مع الحفاظ على وضوح التفاصيل.',
    category: 'image',
    icon: 'Minimize2Icon',
    isPopular: true,
    keywords: ['compress image', 'reduce photo size', 'optimize jpg', 'shrink png', 'file size'],
    keywordsAr: ['ضغط الصور', 'تقليل حجم الصورة', 'تحسين الصور للمواقع'],
    features: [
      'Interactive quality compression slider (1% to 100%)',
      'Side-by-side original vs compressed size comparison',
      'Percentage savings calculation',
      'Supports JPG, PNG, WEBP formats'
    ],
    featuresAr: [
      'مقبض تحكم تفاعلي بنسبة الضغط والجودة (1% إلى 100%)',
      'مقارنة مباشرة بين الحجم الأصلي والحجم المضغوط',
      'حساب نسبة التوفير في المساحة فوراً',
      'يدعم صيغ JPG و PNG و WEBP'
    ],
    howToUse: [
      { step: 1, title: 'Select File', desc: 'Choose the image you wish to compress.' },
      { step: 2, title: 'Adjust Quality', desc: 'Slide the quality level to achieve your desired balance of size and clarity.' },
      { step: 3, title: 'Save File', desc: 'Download the compressed image directly to your device.' }
    ],
    howToUseAr: [
      { step: 1, title: 'اختيار الصورة', desc: 'اختر الصورة التي تريد تقليل حجمها.' },
      { step: 2, title: 'ضبط الجودة', desc: 'حرّك شريط الجودة للوصول للحجم والوضوح المطلوب.' },
      { step: 3, title: 'حفظ الملف', desc: 'انقر على زر التحميل لحفظ الصورة المضغوطة.' }
    ],
    faqs: [
      { q: 'How much file size can I save?', a: 'Typically between 40% and 80% size reduction with virtually no noticeable difference in screen display quality.' },
      { q: 'What is the maximum file size supported?', a: 'Because it runs locally in your browser memory, you can compress images up to 50MB smoothly.' }
    ],
    faqsAr: [
      { q: 'ما مقدار التوفير في حجم الملف؟', a: 'عادة ما بين 40% إلى 80% توفير في الحجم دون أي تراجع ملحوظ في جودة العرض.' },
      { q: 'ما هو الحد الأقصى لحجم الصورة؟', a: 'نظراً لأن الأداة تعمل بذاكرة المتصفح، يمكنك ضغط صور بأحجام تصل إلى 50 ميغابايت بسلاسة.' }
    ],
    relatedToolIds: ['image-resizer', 'image-converter', 'image-cropper']
  },
  {
    id: 'image-converter',
    slug: 'image-converter',
    name: 'Image Converter',
    nameAr: 'محول صيغ الصور',
    description: 'Convert between PNG, JPG, WEBP, and BMP image formats quickly and cleanly.',
    descriptionAr: 'تحويل سريع بين صيغ الصور المختلفة PNG و JPG و WEBP و BMP بنقرة واحدة.',
    category: 'image',
    icon: 'RefreshCwIcon',
    keywords: ['convert image', 'png to jpg', 'jpg to png', 'webp converter', 'bmp'],
    keywordsAr: ['تحويل الصيغ', 'تحويل من png الى jpg', 'تحويل الى webp'],
    features: [
      'Convert to PNG, JPEG, WEBP, and BMP',
      'Adjust background color for transparent PNG to JPG conversions',
      'Instant preview and file download',
      'Preserve high visual fidelity'
    ],
    featuresAr: [
      'التحويل إلى PNG و JPEG و WEBP و BMP',
      'تخصيص لون الخلفية عند تحويل صور PNG الشفافة إلى JPG',
      'معاينة فورية وتحميل سريع',
      'الحفاظ على أعلى دقة ممكنة للألوان'
    ],
    howToUse: [
      { step: 1, title: 'Upload Image', desc: 'Select the image you want to convert.' },
      { step: 2, title: 'Select Target Format', desc: 'Choose PNG, JPG, or WEBP as your output format.' },
      { step: 3, title: 'Download', desc: 'Click Download to get your converted image.' }
    ],
    howToUseAr: [
      { step: 1, title: 'رفع الصورة', desc: 'اختر الصورة التي تريد تحويل صيغتها.' },
      { step: 2, title: 'اختيار الصيغة الهدف', desc: 'اختر بين صيغ PNG أو JPG أو WEBP.' },
      { step: 3, title: 'التحميل', desc: 'انقر على تحميل للحصول على ملفك بالصيغة الجديدة.' }
    ],
    faqs: [
      { q: 'Can I convert transparent PNGs to JPG?', a: 'Yes, Sol Tools lets you specify the solid background fill color (e.g. white or black) for transparent images.' }
    ],
    faqsAr: [
      { q: 'هل يمكن تحويل الصور الشفافة إلى JPG؟', a: 'نعم، يتيح لك Sol Tools اختيار لون الخلفية (مثل الأبيض أو الأسود) عند تحويل PNG الشفاف.' }
    ],
    relatedToolIds: ['image-resizer', 'image-compressor', 'image-cropper']
  },
  {
    id: 'image-cropper',
    slug: 'image-cropper',
    name: 'Image Cropper',
    nameAr: 'قص واقتصاص الصور',
    description: 'Crop and trim your photos with preset aspect ratios (1:1, 16:9, 4:3, 9:16) or custom freeform boxes.',
    descriptionAr: 'قص وتحديد الصور بنسب أبعاد ثابتة (1:1، 16:9، 4:3) أو تحديد حر دقيق.',
    category: 'image',
    icon: 'CropIcon',
    keywords: ['crop photo', 'trim image', 'square crop', 'aspect ratio crop', 'avatar cut'],
    keywordsAr: ['قص الصورة', 'اقتصاص الصور', 'قص مربع', 'قص صورة شخصية'],
    features: [
      'Aspect ratio presets: Square (1:1), Widescreen (16:9), Standard (4:3), Story (9:16)',
      'Freeform rectangular crop selection',
      'Precise crop box coordinate inputs',
      'Real-time output preview'
    ],
    featuresAr: [
      'نسب أبعاد جاهزة: مربع (1:1)، عريض (16:9)، ستوري (9:16)، قياسي (4:3)',
      'تحديد حر لحواف القص بدقة',
      'إمكانية كتابة الإحداثيات والأبعاد يدوياً',
      'معاينة حية وفورية لنتيجة القص'
    ],
    howToUse: [
      { step: 1, title: 'Upload Image', desc: 'Select or drag your image into the workspace.' },
      { step: 2, title: 'Adjust Crop Box', desc: 'Drag the crop frame or choose an aspect ratio preset.' },
      { step: 3, title: 'Crop & Save', desc: 'Click Crop Image and download your trimmed file.' }
    ],
    howToUseAr: [
      { step: 1, title: 'رفع الصورة', desc: 'اختر الصورة أو اسحبها إلى مساحة العمل.' },
      { step: 2, title: 'تعديل إطار القص', desc: 'حدد منطقة القص أو اختر نسبة أبعاد جاهزة.' },
      { step: 3, title: 'قص وحفظ', desc: 'انقر على قص الصورة ثم قم بتحميل النتيجة.' }
    ],
    faqs: [
      { q: 'Is there a limit on crop dimensions?', a: 'No, you can crop to any sub-region within your original image.' }
    ],
    faqsAr: [
      { q: 'هل هناك حد لأبعاد القص؟', a: 'لا، يمكنك قص أي جزء داخل حدود الصورة الأصلية.' }
    ],
    relatedToolIds: ['image-resizer', 'image-rotator', 'image-compressor']
  },
  {
    id: 'image-rotator',
    slug: 'image-rotator',
    name: 'Image Rotator & Flipper',
    nameAr: 'تدوير وقلب الصور',
    description: 'Rotate images 90°, 180°, 270°, or flip horizontally and vertically in one click.',
    descriptionAr: 'تدوير الصور بمقدار 90 أو 180 أو 270 درجة، أو قلبها أفقياً ورأسياً بنقرة واحدة.',
    category: 'image',
    icon: 'RotateCwIcon',
    keywords: ['rotate image', 'flip photo', 'mirror image', 'turn 90 degrees', 'upside down'],
    keywordsAr: ['تدوير الصورة', 'قلب الصورة', 'عكس الصورة افقيا'],
    features: [
      'Rotate Clockwise & Counter-Clockwise (90°, 180°, 270°)',
      'Horizontal Mirror Flip & Vertical Invert',
      'Custom angle rotation slider (-180° to +180°)',
      'Instant full-resolution download'
    ],
    featuresAr: [
      'تدوير باتجاه أو عكس عقارب الساعة (90°، 180°، 270°)',
      'قلب أفقي (مرآة) وقلب رأسي فوري',
      'شريط تدوير بزوايا مخصصة من -180° إلى +180°',
      'تحميل فوري بكامل الدقة الأصلية'
    ],
    howToUse: [
      { step: 1, title: 'Upload Picture', desc: 'Select the photo you want to rotate or mirror.' },
      { step: 2, title: 'Click Orientation Buttons', desc: 'Click Rotate 90° or Flip to adjust orientation.' },
      { step: 3, title: 'Download Result', desc: 'Download your perfectly oriented image.' }
    ],
    howToUseAr: [
      { step: 1, title: 'رفع الصورة', desc: 'اختر الصورة التي تريد تدويرها أو قلبها.' },
      { step: 2, title: 'تحديد الاتجاه', desc: 'انقر على أزرار التدوير 90 درجة أو أزرار القلب.' },
      { step: 3, title: 'تحميل النتيجة', desc: 'قم بتحميل صورتك بعد تعديل اتجاهها.' }
    ],
    faqs: [
      { q: 'Does rotating reduce the resolution?', a: 'No, all pixel data is preserved accurately.' }
    ],
    faqsAr: [
      { q: 'هل يقلل التدوير من دقة الصورة؟', a: 'لا، يتم الحفاظ على كامل دقة البكسلات دون فقدان.' }
    ],
    relatedToolIds: ['image-resizer', 'image-cropper', 'image-converter']
  },

  // ================= PDF / FILE TOOLS =================
  {
    id: 'pdf-to-jpg',
    slug: 'pdf-to-jpg',
    name: 'PDF to JPG',
    nameAr: 'تحويل PDF إلى JPG',
    description: 'Extract and convert PDF pages into high-resolution JPG / PNG images directly in your browser.',
    descriptionAr: 'استخراج وتحويل صفحات ملفات PDF إلى صور JPG و PNG عالية الدقة داخل المتصفح.',
    category: 'pdf',
    icon: 'FileImageIcon',
    isPopular: true,
    keywords: ['pdf to jpg', 'pdf to image', 'convert pdf to png', 'extract pages', 'pdf photo'],
    keywordsAr: ['تحويل pdf الى صور', 'تحويل بي دي اف الى jpg', 'استخراج صفحات pdf'],
    features: [
      'Render PDF pages to high-DPI images',
      'Download individual pages or bulk download',
      'Choose between JPG and PNG image formats',
      '100% secure client-side rendering'
    ],
    featuresAr: [
      'عرض وتحويل صفحات PDF إلى صور بدقة عالية',
      'تحميل صفحات مفردة أو جميع الصفحات',
      'إمكانية الاختيار بين صيغتي JPG و PNG',
      'معالجة آمنة وسرية داخل المتصفح'
    ],
    howToUse: [
      { step: 1, title: 'Select PDF', desc: 'Upload the PDF document you want to convert.' },
      { step: 2, title: 'Preview Pages', desc: 'View thumbnails of all rendered document pages.' },
      { step: 3, title: 'Download Images', desc: 'Save specific pages or download all page images.' }
    ],
    howToUseAr: [
      { step: 1, title: 'اختيار ملف PDF', desc: 'اختر المستند الذي ترغب في تحويل صفحاته إلى صور.' },
      { step: 2, title: 'معاينة الصفحات', desc: 'شاهد مصغرات لجميع صفحات المستند المستخرجة.' },
      { step: 3, title: 'تحميل الصور', desc: 'قم بتحميل الصفحات المطلوبة كصور عالية الجودة.' }
    ],
    faqs: [
      { q: 'Is there a page count limit?', a: 'You can convert documents with dozens of pages swiftly.' }
    ],
    faqsAr: [
      { q: 'هل هناك حد لعدد الصفحات؟', a: 'يمكنك تحويل المستندات التي تحتوي على عشرات الصفحات بسرعة فائقة.' }
    ],
    relatedToolIds: ['jpg-to-pdf', 'merge-pdf', 'split-pdf']
  },
  {
    id: 'jpg-to-pdf',
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    nameAr: 'تحويل JPG إلى PDF',
    description: 'Convert JPG, PNG, and WEBP images into a clean, multi-page professional PDF document.',
    descriptionAr: 'دمج وتحويل صور JPG و PNG و WEBP إلى مستند PDF موحد ومتعدد الصفحات.',
    category: 'pdf',
    icon: 'FileTextIcon',
    isPopular: true,
    keywords: ['jpg to pdf', 'images to pdf', 'photo to pdf document', 'png to pdf', 'make pdf'],
    keywordsAr: ['تحويل الصور الى pdf', 'دمج الصور في ملف pdf', 'صنع ملف pdf من الصور'],
    features: [
      'Combine multiple images into one PDF',
      'Reorder images via drag & drop or click',
      'Page orientation: Portrait or Landscape',
      'Page sizing options (A4, Letter, Auto-fit to image size)',
      'Custom margin settings (None, Small, Normal)'
    ],
    featuresAr: [
      'دمج صور متعددة في ملف PDF واحد منظم',
      'إعادة ترتيب الصور بسهولة',
      'اختيار اتجاه الصفحة: طولي (Portrait) أو عرضي (Landscape)',
      'خيارات قياس الصفحة (A4، Letter، أو مقاس الصورة الأصلي)',
      'تخصيص الهوامش (بدون، صغيرة، عادية)'
    ],
    howToUse: [
      { step: 1, title: 'Upload Images', desc: 'Select one or more JPG/PNG files.' },
      { step: 2, title: 'Arrange & Configure', desc: 'Set page orientation, margins, and order.' },
      { step: 3, title: 'Generate PDF', desc: 'Click Create PDF and download your document.' }
    ],
    howToUseAr: [
      { step: 1, title: 'رفع الصور', desc: 'اختر صورة واحدة أو أكثر من جهازك.' },
      { step: 2, title: 'الترتيب والإعداد', desc: 'اضبط اتجاه الصفحات والهوامش والترتيب.' },
      { step: 3, title: 'إنشاء PDF', desc: 'انقر على إنشاء PDF وحمّل المستند فوراً.' }
    ],
    faqs: [
      { q: 'Can I reorder pages before creating the PDF?', a: 'Yes, you can move items up and down or remove unwanted images.' }
    ],
    faqsAr: [
      { q: 'هل يمكنني ترتيب الصفحات قبل إنشاء الملف؟', a: 'نعم، يمكنك تحريك الصور لأعلى أو لأسفل وإزالة أي صورة غير مرغوبة.' }
    ],
    relatedToolIds: ['pdf-to-jpg', 'merge-pdf', 'split-pdf']
  },
  {
    id: 'merge-pdf',
    slug: 'merge-pdf',
    name: 'Merge PDF',
    nameAr: 'دمج ملفات PDF',
    description: 'Combine multiple PDF files into a single unified document with custom ordering.',
    descriptionAr: 'دمج عدة ملفات PDF معاً في ملف واحد متناسق مع إمكانية إعادة ترتيب الملفات.',
    category: 'pdf',
    icon: 'LayersIcon',
    keywords: ['merge pdf', 'combine pdf', 'join pdf documents', 'pdf merger'],
    keywordsAr: ['دمج ملفات pdf', 'تجميع ملفات بي دي اف', 'توحيد ملفات pdf'],
    features: [
      'Merge unlimited PDF files',
      'Drag or click to reorder documents before merging',
      'Fast browser-side document assembly',
      'Preserves original bookmarks and vector clarity'
    ],
    featuresAr: [
      'دمج ملفات PDF متعددة بسهولة',
      'إعادة ترتيب المستندات قبل الدمج',
      'تجميع سريع داخل المتصفح بدون انتظار الرفع',
      'الحفاظ على جودة الخطوط والصور المدمجة'
    ],
    howToUse: [
      { step: 1, title: 'Upload PDFs', desc: 'Add two or more PDF files.' },
      { step: 2, title: 'Reorder Files', desc: 'Arrange files in the exact sequence you want.' },
      { step: 3, title: 'Merge & Download', desc: 'Click Merge PDF to assemble and download.' }
    ],
    howToUseAr: [
      { step: 1, title: 'رفع الملفات', desc: 'أضف ملفين أو أكثر من ملفات PDF.' },
      { step: 2, title: 'ترتيب الملفات', desc: 'رتب الملفات بالتسلسل الذي تريده.' },
      { step: 3, title: 'دمج وتحميل', desc: 'انقر على دمج PDF لتنزيل الملف الموحد.' }
    ],
    faqs: [
      { q: 'Is there a limit on how many PDFs I can merge?', a: 'You can merge as many files as your device memory allows.' }
    ],
    faqsAr: [
      { q: 'هل هناك حد لعدد الملفات التي يمكن دمجها؟', a: 'يمكنك دمج أي عدد تريده من الملفات بكل سلاسة.' }
    ],
    relatedToolIds: ['split-pdf', 'jpg-to-pdf', 'pdf-to-jpg']
  },
  {
    id: 'split-pdf',
    slug: 'split-pdf',
    name: 'Split PDF',
    nameAr: 'تقسيم ملفات PDF',
    description: 'Split a PDF into separate files or extract specific page ranges (e.g. 1-3, 5, 8-10).',
    descriptionAr: 'استخراج صفحات معينة أو تقسيم ملف PDF إلى مستندات منفصلة بسهولة.',
    category: 'pdf',
    icon: 'ScissorsIcon',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf', 'cut pdf pages'],
    keywordsAr: ['تقسيم pdf', 'استخراج صفحات pdf', 'فصل صفحات بي دي اف'],
    features: [
      'Custom page range specification (e.g., 1-5, 8, 11-14)',
      'Extract single pages or custom sub-documents',
      'Live total page count detection',
      'Instant download of extracted PDF'
    ],
    featuresAr: [
      'تحديد نطاقات صفحات مخصصة (مثل 1-5، 8، 11-14)',
      'استخراج صفحات فردية أو مستندات فرعية',
      'اكتشاف عدد صفحات الملف تلقائياً',
      'تحميل فوري للملف المستخرج'
    ],
    howToUse: [
      { step: 1, title: 'Upload PDF', desc: 'Select the PDF document to split.' },
      { step: 2, title: 'Enter Page Ranges', desc: 'Specify which pages to extract (e.g. 1-3, 5).' },
      { step: 3, title: 'Split & Save', desc: 'Download your new extracted PDF document.' }
    ],
    howToUseAr: [
      { step: 1, title: 'رفع المستند', desc: 'اختر ملف PDF المراد تقسيمه.' },
      { step: 2, title: 'تحديد الصفحات', desc: 'أدخل أرقام الصفحات المطلوبة (مثل 1-3، 5).' },
      { step: 3, title: 'تقسيم وحفظ', desc: 'حمّل المستند الجديد بالصفحات المختارة.' }
    ],
    faqs: [
      { q: 'How do I specify multiple page ranges?', a: 'Use commas and dashes, such as "1-4, 7, 9-12".' }
    ],
    faqsAr: [
      { q: 'كيف أحدد نطاقات متعددة؟', a: 'استخدم الفواصل والشرطات، مثل "1-4, 7, 9-12".' }
    ],
    relatedToolIds: ['merge-pdf', 'pdf-to-jpg', 'jpg-to-pdf']
  },

  // ================= CODE TOOLS =================
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter',
    nameAr: 'تنسيق وجمل JSON',
    description: 'Format, beautify, and validate JSON data with indentation options and tree visualization.',
    descriptionAr: 'تنسيق وترتيب والتحقق من صحة بيانات JSON مع خيارات المسافات البادئة.',
    category: 'code',
    icon: 'BracesIcon',
    isPopular: true,
    keywords: ['json formatter', 'beautify json', 'pretty print json', 'format json', 'json viewer'],
    keywordsAr: ['تنسيق json', 'ترتيب كود json', 'فحص json'],
    features: [
      'Indentation options (2 spaces, 4 spaces, Tab)',
      'Syntax error highlighting with line & position detection',
      'Tree structure view and raw formatted text',
      'One-click copy and JSON file download',
      'Sample data loader for quick testing'
    ],
    featuresAr: [
      'خيارات مسافات بادئة متعددة (مسافتان، 4 مسافات، Tab)',
      'تحديد أخطاء الصياغة مع رقم السطر والموضع',
      'عرض شجري تفاعلي بالإضافة إلى النص المنسق',
      'نسخ سريع بنقرة واحدة وتحميل كملف .json',
      'زر لتحميل نموذج بيانات للتجربة السريعة'
    ],
    howToUse: [
      { step: 1, title: 'Paste JSON', desc: 'Paste your raw JSON code or load a sample.' },
      { step: 2, title: 'Choose Indentation', desc: 'Select 2-space, 4-space, or tab formatting.' },
      { step: 3, title: 'Copy or Download', desc: 'Copy formatted JSON or download as a file.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق الكود', desc: 'الصق كود JSON غير المنسق أو حمل نموذجاً للتجربة.' },
      { step: 2, title: 'اختيار التنسيق', desc: 'اختر نوع المسافة البادئة المناسب لك.' },
      { step: 3, title: 'نسخ أو تحميل', desc: 'انسخ النتيجة المنسقة أو حمّلها كملف.' }
    ],
    faqs: [
      { q: 'Can it handle large JSON strings?', a: 'Yes, it easily parses multi-megabyte payloads in fractions of a second.' }
    ],
    faqsAr: [
      { q: 'هل يتعامل مع ملفات JSON الضخمة؟', a: 'نعم، يقوم بمعالجة البيانات الكبيرة بسرعة فائقة داخل الذاكرة.' }
    ],
    relatedToolIds: ['json-validator', 'json-minifier', 'base64-encoder-decoder']
  },
  {
    id: 'json-validator',
    slug: 'json-validator',
    name: 'JSON Validator',
    nameAr: 'التحقق من صحة JSON',
    description: 'Validate JSON syntax and detect detailed errors, missing quotes, trailing commas, and unclosed brackets.',
    descriptionAr: 'فحص واكتشاف الأخطاء النحوية في JSON بدقة وتحديد السطر والرمز المسبب للخطأ.',
    category: 'code',
    icon: 'CheckCircleIcon',
    keywords: ['json validator', 'check json syntax', 'valid json', 'lint json', 'json error detector'],
    keywordsAr: ['التحقق من صحة json', 'تصحيح أخطاء json', 'فاحص json'],
    features: [
      'Accurate error line and character pointer',
      'Explains common errors (trailing comma, unquoted key, unescaped character)',
      'Displays parsed keys, value types, and depth stats',
      'Clean visual success / error badges'
    ],
    featuresAr: [
      'تحديد موقع الخطأ بدقة مع رقم السطر وموضع الحرف',
      'توضيح الأسباب الشائعة للأخطاء (فواصل زائدة، مفاتيح بدون علامات تنصيص)',
      'إحصائيات حول عدد المفاتيح وأنواع القيم والعمق',
      'مؤشرات بصرية واضحة للنجاح أو الخطأ'
    ],
    howToUse: [
      { step: 1, title: 'Input JSON', desc: 'Paste the JSON text you want to inspect.' },
      { step: 2, title: 'Check Validity', desc: 'Instant automatic validation reports status and syntax health.' },
      { step: 3, title: 'Fix & Beautify', desc: 'View line errors and correct formatting.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال الكود', desc: 'الصق نص JSON المراد التحقق من صحته.' },
      { step: 2, title: 'الفحص الفوري', desc: 'يتم فحص الصياغة تلقائياً مع تقرير فوري.' },
      { step: 3, title: 'المعاينة والإصلاح', desc: 'شاهد موضع الخطأ وقم بتصحيحه مباشرة.' }
    ],
    faqs: [
      { q: 'Why is my JSON invalid?', a: 'The most common issues are single quotes instead of double quotes, trailing commas after the last object property, or missing brackets.' }
    ],
    faqsAr: [
      { q: 'ما هي أكثر أخطاء JSON شيوعاً؟', a: 'استخدام علامات تنصيص مفردة بدلاً من المزدوجة، أو وضع فاصلة بعد آخر عنصر، أو نسيان إغلاق الأقواس.' }
    ],
    relatedToolIds: ['json-formatter', 'json-minifier', 'base64-encoder-decoder']
  },
  {
    id: 'json-minifier',
    slug: 'json-minifier',
    name: 'JSON Minifier',
    nameAr: 'ضغط وتصغير JSON',
    description: 'Minify JSON by removing extra whitespace, tabs, and line breaks to optimize API payloads.',
    descriptionAr: 'ضغط وتصغير كود JSON وإزالة المسافات والأسطر الفارغة لتقليل حجم البيانات.',
    category: 'code',
    icon: 'MinimizeIcon',
    keywords: ['minify json', 'compress json', 'strip whitespace json', 'shrink json payload'],
    keywordsAr: ['ضغط json', 'تصغير json', 'تقليل حجم json'],
    features: [
      'Strips all unnecessary whitespace and newlines',
      'Calculates original size vs minified size and byte savings %',
      'One-click copy to clipboard',
      'Validate JSON before minification'
    ],
    featuresAr: [
      'إزالة جميع المسافات والأسطر الزائدة فوراً',
      'حساب الحجم الأصلي مقابل الحجم المضغوط ونسبة التوفير',
      'نسخ سريع بنقرة واحدة إلى الحافظة',
      'فحص صحة الكود قبل الضغط'
    ],
    howToUse: [
      { step: 1, title: 'Paste JSON', desc: 'Paste standard formatted JSON.' },
      { step: 2, title: 'Minify', desc: 'Instant minification compresses it to a single line.' },
      { step: 3, title: 'Copy Result', desc: 'Click Copy to use your lightweight JSON in production.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق JSON', desc: 'الصق كود JSON المنسق.' },
      { step: 2, title: 'الضغط', desc: 'يتم ضغط الكود فورياً في سطر واحد مضغوط.' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انقر على نسخ لاستخدام الكود المضغوط.' }
    ],
    faqs: [
      { q: 'Will minification change the data structure?', a: 'No, all values, types, and properties remain completely identical.' }
    ],
    faqsAr: [
      { q: 'هل يغير الضغط من هيكل البيانات؟', a: 'لا، تبقى كافة القيم والمفاتيح والأنواع مطابقة تماماً للأصل.' }
    ],
    relatedToolIds: ['json-formatter', 'json-validator', 'base64-encoder-decoder']
  },
  {
    id: 'base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder / Decoder',
    nameAr: 'تشفير وفك تشفير Base64',
    description: 'Encode plain text or binary files into Base64 format, or decode Base64 back into readable text.',
    descriptionAr: 'تحويل النصوص والملفات إلى ترميز Base64 وفك تشفير سلاسل Base64 إلى نصوص أصلية.',
    category: 'code',
    icon: 'BinaryIcon',
    isPopular: true,
    keywords: ['base64 encode', 'base64 decode', 'text to base64', 'base64 to text', 'binary converter'],
    keywordsAr: ['ترميز base64', 'فك تشفير base64', 'تحويل base64'],
    features: [
      'Bi-directional conversion: Text to Base64 & Base64 to Text',
      'UTF-8 and multi-language / Arabic character support',
      'Live character and byte counter',
      'URL-safe Base64 mode toggle',
      'One-click copy and swap inputs'
    ],
    featuresAr: [
      'تحويل مزدوج الاتجاه: من نص إلى Base64 ومن Base64 إلى نص',
      'دعم كامل لترميز UTF-8 واللغة العربية والرموز التعبيرية',
      'عداد حي لعدد الأحرف والبايتات',
      'خيار تفعيل الوضع الآمن لعناوين الويب (URL Safe)',
      'نسخ سريع وتبديل بين المدخلات والمخرجات'
    ],
    howToUse: [
      { step: 1, title: 'Choose Mode', desc: 'Select Encode or Decode.' },
      { step: 2, title: 'Enter Text', desc: 'Type or paste the input string.' },
      { step: 3, title: 'Get Result', desc: 'Copy the resulting Base64 output.' }
    ],
    howToUseAr: [
      { step: 1, title: 'اختيار الوضع', desc: 'اختر ترميز (Encode) أو فك تشفير (Decode).' },
      { step: 2, title: 'إدخال النص', desc: 'اكتب أو الصق النص المطلوب.' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انسخ الناتج فوراً بنقرة زر.' }
    ],
    faqs: [
      { q: 'Does it support Arabic letters and emojis?', a: 'Yes, full UTF-8 encoding ensures non-Latin characters are handled perfectly.' }
    ],
    faqsAr: [
      { q: 'هل يدعم الحروف العربية والإيموجي؟', a: 'نعم، يدعم ترميز UTF-8 الكامل لضمان عدم تلف الحروف العربية والرموز.' }
    ],
    relatedToolIds: ['url-encoder-decoder', 'json-formatter', 'uuid-generator']
  },
  {
    id: 'url-encoder-decoder',
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    nameAr: 'ترميز وفك تشفير عناوين URL',
    description: 'Encode special characters for safe URL transmission or decode percent-encoded URLs into readable text.',
    descriptionAr: 'ترميز الرموز الخاصة في روابط URL وفك تشفير الروابط المشفرة برموز النسبة المئوية.',
    category: 'code',
    icon: 'LinkIcon',
    keywords: ['url encode', 'url decode', 'percent encoding', 'uri component', 'sanitize url'],
    keywordsAr: ['ترميز الروابط', 'فك تشفير url', 'تحويل روابط الويب'],
    features: [
      'Encode URI Component & Full URI modes',
      'Decode percent-encoded strings (%20, %2F, etc.)',
      'Handles multi-byte Unicode and Arabic characters',
      'Instant conversion as you type'
    ],
    featuresAr: [
      'أوضاع ترميز الروابط بالكامل أو ترميز مكونات الرابط (encodeURIComponent)',
      'فك تشفير الرموز مثل (%20 و %2F وغيرها)',
      'دعم كامل للغة العربية والرموز الخاصة',
      'تحويل فوري أثناء الكتابة'
    ],
    howToUse: [
      { step: 1, title: 'Select Mode', desc: 'Choose Encode to URL or Decode from URL.' },
      { step: 2, title: 'Paste Input', desc: 'Paste your URL or query parameters.' },
      { step: 3, title: 'Copy Output', desc: 'Copy the clean converted output.' }
    ],
    howToUseAr: [
      { step: 1, title: 'تحديد العملية', desc: 'اختر ترميز أو فك تشفير الرابط.' },
      { step: 2, title: 'لصق الرابط', desc: 'الصق الرابط أو معلمات البحث.' },
      { step: 3, title: 'نسخ الناتج', desc: 'انسخ الناتج المشفر أو المفكوك بنقرة واحدة.' }
    ],
    faqs: [
      { q: 'What is percent-encoding?', a: 'Percent-encoding replaces unsafe ASCII characters with a "%" followed by two hexadecimal digits.' }
    ],
    faqsAr: [
      { q: 'ما هو ترميز النسبة المئوية (Percent Encoding)؟', a: 'هو استبدال الرموز غير الآمنة في الروابط برمز % متبوعاً برقمين سداسي عشري.' }
    ],
    relatedToolIds: ['base64-encoder-decoder', 'uuid-generator', 'json-formatter']
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID / GUID Generator',
    nameAr: 'مولد معرفات UUID / GUID',
    description: 'Generate random cryptographically secure UUID v4 identifiers in bulk with customization options.',
    descriptionAr: 'توليد معرفات فريدة عالمياً UUID v4 عشوائية وآمنة برمجياً بشكل فردي أو مجمع.',
    category: 'code',
    icon: 'KeyIcon',
    keywords: ['uuid generator', 'guid generator', 'uuid v4', 'random id generator', 'unique identifier'],
    keywordsAr: ['مولد uuid', 'انشاء guid', 'معرفات فريدة', 'توليد معرف عشوائي'],
    features: [
      'Generates standard RFC4122 Version 4 UUIDs',
      'Batch generation (1 to 100 UUIDs at once)',
      'Uppercase or lowercase output toggle',
      'Include or remove hyphens',
      'Wrap in quotes or brackets option',
      'One-click copy all'
    ],
    featuresAr: [
      'توليد معرفات قياسية متوافقة مع RFC4122 Version 4',
      'توليد مجمع من 1 إلى 100 معرف دفعة واحدة',
      'التبديل بين الأحرف الكبيرة والصغيرة (Uppercase / Lowercase)',
      'إمكانية إزالة أو إبقاء الشرطات الفاصلة (-)',
      'إمكانية الإحاطة بعلامات تنصيص أو أقواس',
      'نسخ كافة المعرفات بضغطة زر'
    ],
    howToUse: [
      { step: 1, title: 'Select Quantity', desc: 'Choose how many UUIDs to generate.' },
      { step: 2, title: 'Customize Format', desc: 'Toggle uppercase or remove hyphens.' },
      { step: 3, title: 'Generate & Copy', desc: 'Click Generate and copy to clipboard.' }
    ],
    howToUseAr: [
      { step: 1, title: 'تحديد العدد', desc: 'اختر كمية المعرفات المطلوبة.' },
      { step: 2, title: 'تخصيص الصيغة', desc: 'حدد خيارات الأحرف الكبيرة والشرطات.' },
      { step: 3, title: 'توليد ونسخ', desc: 'انقر على توليد وانسخ المعرفات فوراً.' }
    ],
    faqs: [
      { q: 'Is UUID v4 truly unique?', a: 'The probability of generating two duplicate UUID v4 identifiers is virtually zero (1 in 2^122).' }
    ],
    faqsAr: [
      { q: 'هل معرّف UUID فريد حقاً؟', a: 'نعم، احتمالية تكرار معرفين من نوع UUID v4 تكاد تكون مستحيلة عملياً (1 من 2 أس 122).' }
    ],
    relatedToolIds: ['qr-code-generator', 'base64-encoder-decoder', 'json-formatter']
  },
  {
    id: 'html-formatter',
    slug: 'html-formatter',
    name: 'HTML Formatter & Beautifier',
    nameAr: 'تنسيق وترتيب HTML',
    description: 'Format, indent, and beautify messy HTML code with clean tag nesting.',
    descriptionAr: 'ترتيب وتنسيق أكواد HTML غير المنظمة وإعادة تنظيم الوسوم والمسافات البادئة.',
    category: 'code',
    icon: 'CodeIcon',
    keywords: ['html formatter', 'beautify html', 'indent html', 'clean html markup', 'html viewer'],
    keywordsAr: ['تنسيق html', 'ترتيب كود html', 'تنظيف وسوم html'],
    features: [
      'Clean nested tag indentation (2 spaces or 4 spaces)',
      'Self-closing tag normalization',
      'Syntax highlighting preview',
      'One-click copy and file download'
    ],
    featuresAr: [
      'تنسيق متسلسل للوسوم المتداخلة (مسافتان أو 4 مسافات)',
      'توحيد الوسوم ذاتية الإغلاق',
      'معاينة واضحة مع إبراز الأكواد',
      'نسخ فوري وتحميل كملف .html'
    ],
    howToUse: [
      { step: 1, title: 'Paste HTML', desc: 'Paste raw or minified HTML markup.' },
      { step: 2, title: 'Click Beautify', desc: 'Instantly format tags and indentation.' },
      { step: 3, title: 'Copy Result', desc: 'Copy the pristine HTML code.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق الكود', desc: 'الصق كود HTML المضغوط أو غير المنسق.' },
      { step: 2, title: 'تنسيق', desc: 'شاهد التنسيق الفوري وترتيب الوسوم.' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انسخ كود HTML الجميل والمنظم.' }
    ],
    faqs: [
      { q: 'Does it strip invalid tags?', a: 'It preserves all HTML elements while properly arranging tag hierarchies.' }
    ],
    faqsAr: [
      { q: 'هل يحذف الوسوم المخصصة؟', a: 'يحافظ على كافة العناصر والوسوم مع إعادة ترتيبها بشكل جميل.' }
    ],
    relatedToolIds: ['css-formatter', 'javascript-formatter', 'sql-formatter']
  },
  {
    id: 'css-formatter',
    slug: 'css-formatter',
    name: 'CSS Formatter & Beautifier',
    nameAr: 'تنسيق وترتيب CSS',
    description: 'Beautify and structure stylesheet rules, selectors, and property declarations.',
    descriptionAr: 'ترتيب وتنسيق ملفات CSS وأوراق الأنماط وتنسيق القواعد والخصائص بانتظام.',
    category: 'code',
    icon: 'FileCodeIcon',
    keywords: ['css formatter', 'beautify css', 'pretty css', 'format stylesheet', 'css cleaner'],
    keywordsAr: ['تنسيق css', 'ترتيب كود css', 'تنسيق الستايل'],
    features: [
      'Formats selectors, brackets, and properties onto clean lines',
      'Indents CSS declaration blocks uniformly',
      'Supports standard CSS, CSS variables, and media queries',
      'Copy and download ready-to-use .css file'
    ],
    featuresAr: [
      'تنسيق المحددات والأقواس والخصائص في أسطر منظمة',
      'مسافات بادئة موحدة لكتل إعلانات CSS',
      'دعم كامل لمتغيرات CSS واستعلامات الوسائط (Media Queries)',
      'نسخ وتحميل فوري لملف .css'
    ],
    howToUse: [
      { step: 1, title: 'Paste CSS', desc: 'Paste your unformatted stylesheet rules.' },
      { step: 2, title: 'Format Code', desc: 'Auto-format brackets and declarations.' },
      { step: 3, title: 'Copy Result', desc: 'Copy the styled CSS block.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق CSS', desc: 'الصق أكواد CSS غير المنسقة.' },
      { step: 2, title: 'التنسيق', desc: 'يتم تنظيم الأقواس والخصائص فوراً.' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انسخ كود CSS المنظم.' }
    ],
    faqs: [
      { q: 'Can I format SCSS or SASS with this tool?', a: 'Standard CSS syntax is fully supported, including nested CSS rules.' }
    ],
    faqsAr: [
      { q: 'هل يدعم قواعد CSS المتداخلة؟', a: 'نعم، يدعم صياغة CSS القياسية وكافة قواعد الاستعلام والمتغيرات.' }
    ],
    relatedToolIds: ['html-formatter', 'javascript-formatter', 'json-formatter']
  },
  {
    id: 'javascript-formatter',
    slug: 'javascript-formatter',
    name: 'JavaScript Formatter',
    nameAr: 'تنسيق كود جافاسكريبت JS',
    description: 'Beautify JavaScript and TypeScript code blocks with clean indentation and bracket spacing.',
    descriptionAr: 'تنسيق وترتيب أكواد جافاسكريبت وتايب سكريبت مع مسافات بادئة وتنظيم الأقواس.',
    category: 'code',
    icon: 'TerminalIcon',
    keywords: ['js formatter', 'javascript beautifier', 'pretty print js', 'format typescript', 'code cleaner'],
    keywordsAr: ['تنسيق جافاسكريبت', 'ترتيب كود js', 'مصحح جافاسكريبت'],
    features: [
      'Indents statements, loops, functions, and object literals',
      'Organizes semicolons and curly brace blocks',
      'Supports modern ES6+ syntax',
      'Fast client-side execution'
    ],
    featuresAr: [
      'تنظيم الدوال والحلقات والكائنات والمتغيرات',
      'ترتيب الفواصل المنقوطة والأقواس المعقوفة',
      'يدعم صياغة ES6+ الحديثة',
      'تنفيذ محلي فوري فائق السرعة'
    ],
    howToUse: [
      { step: 1, title: 'Paste Code', desc: 'Paste raw JavaScript / TypeScript.' },
      { step: 2, title: 'Format', desc: 'Auto-indent and structure logic blocks.' },
      { step: 3, title: 'Copy', desc: 'Copy formatted script to clipboard.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق الكود', desc: 'الصق كود جافاسكريبت المطلوب.' },
      { step: 2, title: 'تنسيق', desc: 'تنظيم فوري للمسافات والأسطر والأقواس.' },
      { step: 3, title: 'نسخ', desc: 'انسخ الكود المنسق فوراً.' }
    ],
    faqs: [
      { q: 'Does this run or execute my code?', a: 'No, it only performs lexical formatting without executing any code.' }
    ],
    faqsAr: [
      { q: 'هل يتم تشغيل الكود؟', a: 'لا، تتم معالجة النص فقط لترتيبه بصرياً دون تنفيذ أي جزء منه.' }
    ],
    relatedToolIds: ['html-formatter', 'css-formatter', 'json-formatter']
  },
  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    nameAr: 'تنسيق وترتيب استعلامات SQL',
    description: 'Format SQL queries with capitalized keywords (SELECT, FROM, WHERE, JOIN) and indented clauses.',
    descriptionAr: 'تنسيق استعلامات قواعد البيانات SQL مع تحويل الكلمات المفتاحية لأحرف كبيرة وتنظيم الجمل.',
    category: 'code',
    icon: 'DatabaseIcon',
    keywords: ['sql formatter', 'beautify sql', 'format database query', 'sql pretty print', 'sql keywords'],
    keywordsAr: ['تنسيق sql', 'ترتيب استعلام sql', 'تنسيق قواعد البيانات'],
    features: [
      'Capitalizes standard SQL keywords (SELECT, INSERT, UPDATE, DELETE, JOIN, WHERE, GROUP BY)',
      'Splits clauses onto readable indented lines',
      'Compatible with PostgreSQL, MySQL, SQLite, Oracle, and MS SQL',
      'One-click copy and download'
    ],
    featuresAr: [
      'تكبير الكلمات المفتاحية تلقائياً (SELECT, FROM, JOIN, WHERE)',
      'تقسيم الجمل الشرطية والربط إلى أسطر منظمة',
      'متوافق مع PostgreSQL و MySQL و SQLite و Oracle و SQL Server',
      'نسخ سريع وتحميل كملف .sql'
    ],
    howToUse: [
      { step: 1, title: 'Paste Query', desc: 'Paste your single-line or messy SQL query.' },
      { step: 2, title: 'Format SQL', desc: 'Keywords are highlighted and placed on new lines.' },
      { step: 3, title: 'Copy Query', desc: 'Copy the clear structured SQL query.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق الاستعلام', desc: 'الصق استعلام SQL غير المرتب.' },
      { step: 2, title: 'تنسيق الاستعلام', desc: 'يتم ترتيب الكلمات المفتاحية في أسطر منظمة.' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انسخ استعلام SQL المنظم بنقرة واحدة.' }
    ],
    faqs: [
      { q: 'Which SQL dialects are supported?', a: 'It works with standard ANSI SQL and all major RDBMS dialects.' }
    ],
    faqsAr: [
      { q: 'ما هي قواعد البيانات المدعومة؟', a: 'يعمل مع المعيار القياسي ANSI SQL وكافة قواعد البيانات الشهيرة.' }
    ],
    relatedToolIds: ['json-formatter', 'html-formatter', 'javascript-formatter']
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    nameAr: 'مولد رموز الاستجابة السريعة QR',
    description: 'Generate customizable, high-resolution QR codes for URLs, plain text, emails, phone numbers, and Wi-Fi.',
    descriptionAr: 'إنشاء رموز QR مخصصة وعالية الدقة للروابط والنصوص ورسائل البريد وشبكات الواي فاي.',
    category: 'code',
    icon: 'QrCodeIcon',
    isPopular: true,
    keywords: ['qr code generator', 'create qr code', 'free qr code', 'download qr png', 'barcode generator'],
    keywordsAr: ['انشاء باركود', 'توليد كود qr', 'صانع رمز الاستجابة السريعة'],
    features: [
      'Generate QR codes for URLs, plain text, emails, SMS, and Wi-Fi',
      'Customizable foreground and background colors',
      'Adjustable size (from 128px to 1024px high resolution)',
      'Error correction level selection (Low, Medium, Quartile, High)',
      'Download instant crisp PNG image'
    ],
    featuresAr: [
      'إنشاء رموز QR للروابط والنصوص والبريد الإلكتروني والواي فاي',
      'تخصيص ألوان الرمز والخلفية حسب رغبتك',
      'التحكم في دقة وحجم الصورة من 128px حتى 1024px بدقة فائقة',
      'مستويات تصحيح الأخطاء (L, M, Q, H)',
      'تحميل فوري بصيغة PNG عالية الوضوح'
    ],
    howToUse: [
      { step: 1, title: 'Enter Content', desc: 'Type or paste your link, text, or contact data.' },
      { step: 2, title: 'Customize Appearance', desc: 'Pick your preferred colors and size.' },
      { step: 3, title: 'Download PNG', desc: 'Download your ready-to-print QR code.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال المحتوى', desc: 'اكتب الرابط أو النص أو بيانات الاتصال.' },
      { step: 2, title: 'تخصيص المظهر', desc: 'اختر الألوان والحجم ومستوى الدقة.' },
      { step: 3, title: 'تحميل الرمز', desc: 'حمّل صورة QR عالية الجودة بصيغة PNG.' }
    ],
    faqs: [
      { q: 'Do these QR codes expire?', a: 'No, static QR codes encode your data directly into the pattern and never expire.' }
    ],
    faqsAr: [
      { q: 'هل تنتهي صلاحية رموز QR؟', a: 'لا، الرموز الثابتة تحتوي على بياناتك بشكل مباشر ولا تنتهي صلاحيتها أبداً.' }
    ],
    relatedToolIds: ['uuid-generator', 'base64-encoder-decoder', 'url-encoder-decoder']
  },

  // ================= TEXT TOOLS =================
  {
    id: 'word-counter',
    slug: 'word-counter',
    name: 'Word Counter',
    nameAr: 'عداد الكلمات والنصوص',
    description: 'Calculate live word count, character count (with & without spaces), sentence count, paragraph count, and reading time.',
    descriptionAr: 'حساب دقيق ومباشر لعدد الكلمات والأحرف والفقرات والجمل ووقت القراءة المقدر.',
    category: 'text',
    icon: 'FileTextIcon',
    isPopular: true,
    keywords: ['word counter', 'character count', 'paragraph count', 'reading time', 'essay length', 'text stats'],
    keywordsAr: ['عداد الكلمات', 'حساب عدد الحروف', 'احصائيات النص', 'كم كلمة'],
    features: [
      'Real-time live count as you type or paste',
      'Word count, Character count (with & without spaces)',
      'Paragraph count, Sentence count, and Line count',
      'Estimated Reading Time & Speaking Time metrics',
      'Top repeated keywords density breakdown',
      'Supports English, Arabic, and multi-language scripts'
    ],
    featuresAr: [
      'تحديث فوري ومباشر أثناء الكتابة أو اللصق',
      'عدد الكلمات، عدد الأحرف (مع وبدون مسافات)',
      'عدد الفقرات، عدد الجمل، وعدد الأسطر',
      'تقدير وقت القراءة ووقت الإلقاء الصوتي',
      'تحليل تكرار الكلمات الأكثر استخداماً',
      'دعم كامل للغة العربية والإنجليزية واللغات المختلفة'
    ],
    howToUse: [
      { step: 1, title: 'Type or Paste Text', desc: 'Enter your article, essay, or message.' },
      { step: 2, title: 'Inspect Real-time Stats', desc: 'View complete statistics displayed in dynamic cards.' },
      { step: 3, title: 'Copy Text', desc: 'Copy or clear text with one click.' }
    ],
    howToUseAr: [
      { step: 1, title: 'كتابة أو لصق النص', desc: 'أدخل مقالك أو رسالتك في مساحة النص.' },
      { step: 2, title: 'معاينة الإحصائيات', desc: 'شاهد كافة المقاييس والنتائج تظهر فوراً.' },
      { step: 3, title: 'نسخ النص', desc: 'انسخ أو امسح النص بنقرة واحدة.' }
    ],
    faqs: [
      { q: 'How is reading time estimated?', a: 'Based on standard adult average reading speed of 200 words per minute.' }
    ],
    faqsAr: [
      { q: 'كيف يتم حساب وقت القراءة؟', a: 'بناءً على متوسط سرعة القراءة الطبيعية للبالغين المقدرة بـ 200 كلمة في الدقيقة.' }
    ],
    relatedToolIds: ['character-counter', 'text-case-converter', 'text-cleaner']
  },
  {
    id: 'character-counter',
    slug: 'character-counter',
    name: 'Character Counter',
    nameAr: 'عداد الأحرف والرموز',
    description: 'Detailed character counting tool with social media character limits (Twitter/X, Instagram, LinkedIn, SMS).',
    descriptionAr: 'عداد دقيق للأحرف والمسافات مع حدود النشر على منصات التواصل (تويتر، لينكد إن، إنستغرام، SMS).',
    category: 'text',
    icon: 'HashIcon',
    keywords: ['character counter', 'letter counter', 'twitter character limit', 'sms character length', 'byte size'],
    keywordsAr: ['عداد الحروف', 'حساب طول التغريدة', 'حد حروف تويتر'],
    features: [
      'Live character counters with and without spaces',
      'Social media progress bars (Twitter 280 chars, SMS 160 chars, Meta title 60 chars)',
      'Total byte size calculation in UTF-8',
      'Number of vowels, consonants, and numeric digits breakdown'
    ],
    featuresAr: [
      'عداد مباشر للأحرف بالمسافات وبدون مسافات',
      'مؤشرات تقدم لحدود النشر (تويتر 280 حرف، رسائل SMS 160، عناوين سيو 60)',
      'حساب الحجم بالبايتات وفق ترميز UTF-8',
      'تفصيل عدد الحروف والأرقام والرموز الخاصة'
    ],
    howToUse: [
      { step: 1, title: 'Input Text', desc: 'Paste or type your caption or text.' },
      { step: 2, title: 'Check Limits', desc: 'Monitor your character progress indicators.' },
      { step: 3, title: 'Optimize Length', desc: 'Trim to fit your desired platform.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال النص', desc: 'الصق النص المراد قياس طوله.' },
      { step: 2, title: 'متابعة الحدود', desc: 'شاهد أشرطة التقدم لمنصات التواصل المختلفة.' },
      { step: 3, title: 'تعديل الطول', desc: 'عدل النص ليتناسب مع الحد المطلوب.' }
    ],
    faqs: [
      { q: 'How many characters are allowed in a tweet?', a: 'Standard X (Twitter) posts allow 280 characters.' }
    ],
    faqsAr: [
      { q: 'كم عدد الحروف المسموح بها في تويتر؟', a: 'تسمح التغريدات العادية بـ 280 حرفاً كحد أقصى.' }
    ],
    relatedToolIds: ['word-counter', 'text-case-converter', 'find-and-replace']
  },
  {
    id: 'text-case-converter',
    slug: 'text-case-converter',
    name: 'Text Case Converter',
    nameAr: 'محول حالة الأحرف',
    description: 'Transform text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, kebab-case, snake_case, and CONSTANT_CASE.',
    descriptionAr: 'تحويل حالة النصوص الإنجليزية إلى أحرف كبيرة وصغيرة، حالة العناوين، وحالات البرمجة (camelCase, snake_case).',
    category: 'text',
    icon: 'CaseSensitiveIcon',
    isPopular: true,
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'sentence case', 'camelcase', 'snake case', 'kebab case'],
    keywordsAr: ['تحويل حالة الحروف', 'احرف كبيرة وصغيرة', 'تنسيق العناوين'],
    features: [
      'UPPERCASE: ALL CAPS TEXT',
      'lowercase: all small text',
      'Title Case: Capitalize First Letter Of Each Word',
      'Sentence case: Capitalize first letter of every sentence',
      'Developer cases: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE',
      'Alternating case: aLtErNaTiNg cAsE',
      'One-click instant conversion & copy'
    ],
    featuresAr: [
      'الأحرف الكبيرة UPPERCASE: جميع الحروف كبيرة',
      'الأحرف الصغيرة lowercase: جميع الحروف صغيرة',
      'حالة العناوين Title Case: تكبير أول حرف من كل كلمة',
      'حالة الجملة Sentence case: تكبير أول حرف من كل جملة',
      'حالات المبرمجين: camelCase و snake_case و kebab-case و PascalCase',
      'حالة متبادلة: aLtErNaTiNg cAsE',
      'تحويل ونسخ فوري بنقرة واحدة'
    ],
    howToUse: [
      { step: 1, title: 'Enter Text', desc: 'Paste your text in the input box.' },
      { step: 2, title: 'Pick a Case', desc: 'Click any format button (e.g. Title Case, UPPERCASE).' },
      { step: 3, title: 'Copy Result', desc: 'Click Copy to get the converted text.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال النص', desc: 'الصق النص المطلوب تحويله.' },
      { step: 2, title: 'اختيار الحالة', desc: 'انقر على نوع التنسيق المطلوب (مثل Title Case أو UPPERCASE).' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انسخ النص بعد تحويله بنقرة واحدة.' }
    ],
    faqs: [
      { q: 'What is Title Case?', a: 'Title Case capitalizes the primary words of a title while keeping articles lowercase.' }
    ],
    faqsAr: [
      { q: 'ما هي حالة Title Case؟', a: 'هي تكبير الحرف الأول من كل كلمة رئيسية لتنسيق العناوين.' }
    ],
    relatedToolIds: ['word-counter', 'remove-duplicate-lines', 'text-cleaner']
  },
  {
    id: 'remove-duplicate-lines',
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    nameAr: 'حذف الأسطر المكررة',
    description: 'Delete duplicate lines from lists, data dumps, and text files while keeping unique entries intact.',
    descriptionAr: 'حذف وتصفية الأسطر والكلمات المكررة من القوائم والنصوص والبيانات بنقرة واحدة.',
    category: 'text',
    icon: 'ListFilterIcon',
    keywords: ['remove duplicate lines', 'deduplicate list', 'unique lines', 'remove duplicates', 'list cleaner'],
    keywordsAr: ['حذف التكرار', 'ازالة الاسطر المكررة', 'تصفية القوائم', 'استخراج الفريد'],
    features: [
      'Case-sensitive or case-insensitive duplicate matching',
      'Option to trim leading/trailing whitespace before comparison',
      'Option to remove empty/blank lines',
      'Preserve original line order or sort alphabetically',
      'Displays duplicate count and removed line stats'
    ],
    featuresAr: [
      'مطابقة مع مراعاة حالة الأحرف أو تجاهلها',
      'خيار إزالة المسافات الفارغة من بداية ونهاية الأسطر',
      'خيار حذف الأسطر الفارغة تلقائياً',
      'الحفاظ على الترتيب الأصلي أو الترتيب الأبجدي',
      'عرض عدد الأسطر المحذوفة ونسبة التصفية'
    ],
    howToUse: [
      { step: 1, title: 'Paste Lines', desc: 'Paste your list of items or lines.' },
      { step: 2, title: 'Set Options', desc: 'Choose trimming, empty line removal, or sorting.' },
      { step: 3, title: 'Copy Unique List', desc: 'Copy your deduplicated list.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق القائمة', desc: 'الصق قائمة العناصر أو الأسطر.' },
      { step: 2, title: 'ضبط الخيارات', desc: 'اختر إزالة الفراغات أو حذف الأسطر الفارغة.' },
      { step: 3, title: 'نسخ القائمة', desc: 'انسخ القائمة الفريدة الخالية من التكرار.' }
    ],
    faqs: [
      { q: 'Does it change the order of unique lines?', a: 'By default, original first-appearance order is preserved.' }
    ],
    faqsAr: [
      { q: 'هل يتغير ترتيب الأسطر؟', a: 'افتراضياً يتم الحفاظ على الترتيب الأصلي مع إزالة التكرارات اللاحقة.' }
    ],
    relatedToolIds: ['text-sorter', 'text-cleaner', 'find-and-replace']
  },
  {
    id: 'text-cleaner',
    slug: 'text-cleaner',
    name: 'Text Cleaner & Normalizer',
    nameAr: 'تنظيف وتنسيق النصوص',
    description: 'Clean text by removing extra spaces, multiple blank lines, HTML tags, special symbols, and line breaks.',
    descriptionAr: 'تنظيف النصوص وإزالة المسافات الزائدة، الأسطر الفارغة المتعددة، وسوم HTML والرموز غير المرغوبة.',
    category: 'text',
    icon: 'SparklesIcon',
    keywords: ['clean text', 'remove extra spaces', 'strip html tags', 'remove line breaks', 'normalize text'],
    keywordsAr: ['تنظيف النص', 'ازالة المسافات الزائدة', 'حذف وسوم html', 'ازالة الفراغات'],
    features: [
      'Remove consecutive duplicate spaces (single space normalization)',
      'Remove blank / empty lines',
      'Strip HTML / XML tags',
      'Remove all line breaks (merge into single paragraph)',
      'Trim trailing spaces from each line'
    ],
    featuresAr: [
      'إزالة المسافات المزدوجة المتتالية وتوحيدها لمسافة واحدة',
      'حذف الأسطر الفارغة والمسافات البيضاء الزائدة',
      'حذف وسوم HTML و XML بالكامل',
      'دمج الأسطر في فقرة واحدة متصلة',
      'تنظيف نهايات وبدايات الأسطر'
    ],
    howToUse: [
      { step: 1, title: 'Paste Dirty Text', desc: 'Paste raw text with unwanted spaces or tags.' },
      { step: 2, title: 'Select Cleaning Rules', desc: 'Toggle the cleaning options you need.' },
      { step: 3, title: 'Clean & Copy', desc: 'Click Clean Text and copy the result.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق النص', desc: 'الصق النص الذي يحتوي على مسافات أو وسوم زائدة.' },
      { step: 2, title: 'اختيار خيارات التنظيف', desc: 'فعل خيارات إزالة المسافات أو حذف الوسوم.' },
      { step: 3, title: 'تنظيف ونسخ', desc: 'انقر على تنظيف النص وانسخ النتيجة المنقحة.' }
    ],
    faqs: [
      { q: 'Will this remove punctuation?', a: 'No, punctuation is preserved unless you specifically enable special symbol removal.' }
    ],
    faqsAr: [
      { q: 'هل يحذف علامات الترقيم؟', a: 'لا، يتم الحفاظ على علامات الترقيم إلا إذا اخترت إزالتها يدوياً.' }
    ],
    relatedToolIds: ['remove-duplicate-lines', 'find-and-replace', 'text-sorter']
  },
  {
    id: 'text-sorter',
    slug: 'text-sorter',
    name: 'Text & List Sorter',
    nameAr: 'ترتيب وفرز القوائم والنصوص',
    description: 'Sort lists and text lines alphabetically (A-Z or Z-A), numerically, by line length, or in reverse order.',
    descriptionAr: 'فرز وترتيب القوائم والأسطر أبجدياً (أ-ي أو ي-أ)، رقمياً، حسب طول السطر، أو عكس الترتيب.',
    category: 'text',
    icon: 'ArrowUpDownIcon',
    keywords: ['sort text', 'alphabetical sorter', 'a-z sorter', 'reverse list', 'sort by length', 'numeric sort'],
    keywordsAr: ['ترتيب ابجدي', 'فرز النصوص', 'ترتيب القوائم', 'عكس الترتيب'],
    features: [
      'Alphabetical sorting: A to Z and Z to A (full Arabic & English support)',
      'Natural & Numeric sorting (1, 2, 10 instead of 1, 10, 2)',
      'Sort by line length (shortest to longest / longest to shortest)',
      'Reverse line order & Randomize / Shuffle list'
    ],
    featuresAr: [
      'ترتيب أبجدي تصاعدي وتنازلي (أ-ي و A-Z)',
      'ترتيب رقمي ذكي طبيعي (1، 2، 10 بدلاً من 1، 10، 2)',
      'ترتيب حسب طول السطر (من الأقصر للأطول والعكس)',
      'عكس ترتيب الأسطر وخلط عشوائي للقائمة (Shuffle)'
    ],
    howToUse: [
      { step: 1, title: 'Paste Lines', desc: 'Paste the list of items to sort.' },
      { step: 2, title: 'Choose Sort Method', desc: 'Click A-Z, Z-A, Numeric, or Length.' },
      { step: 3, title: 'Copy Sorted List', desc: 'Copy your sorted output.' }
    ],
    howToUseAr: [
      { step: 1, title: 'لصق القائمة', desc: 'الصق عناصر القائمة المراد ترتيبها.' },
      { step: 2, title: 'اختيار نوع الفرز', desc: 'اختر الترتيب الأبجدي أو الرقمي أو حسب الطول.' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انسخ القائمة بعد فرزها وترتيبها.' }
    ],
    faqs: [
      { q: 'Does it support sorting Arabic names and words?', a: 'Yes, full Arabic Unicode collation is supported for accurate alphabetical ordering.' }
    ],
    faqsAr: [
      { q: 'هل يدعم ترتيب الأسماء والكلمات العربية؟', a: 'نعم، يدعم الترتيب الهجائي العربي الدقيق من الألف إلى الياء.' }
    ],
    relatedToolIds: ['remove-duplicate-lines', 'text-cleaner', 'find-and-replace']
  },
  {
    id: 'find-and-replace',
    slug: 'find-and-replace',
    name: 'Find & Replace Text',
    nameAr: 'البحث والاستبدال في النصوص',
    description: 'Find and replace words, phrases, numbers, or regular expressions across large text documents.',
    descriptionAr: 'البحث عن كلمات أو عبارات أو أرقام واستبدالها بنصوص جديدة مع دعم التعابير النمطية (Regex).',
    category: 'text',
    icon: 'SearchIcon',
    keywords: ['find and replace', 'replace text', 'batch replace words', 'regex replace', 'substitute text'],
    keywordsAr: ['بحث واستبدال', 'استبدال الكلمات', 'تغيير النصوص المكررة'],
    features: [
      'Find and replace with instant match counter',
      'Match case toggle (case-sensitive / insensitive)',
      'Whole word match option',
      'Regular Expression (RegEx) support with flags',
      'Replace all or step-by-step match preview'
    ],
    featuresAr: [
      'بحث واستبدال فوري مع عداد لعدد الكلمات المطابقة',
      'خيار مراعاة حالة الأحرف (Case Sensitive)',
      'خيار مطابقة الكلمة بالكامل فقط (Whole Word)',
      'دعم كامل للتعابير النمطية Regular Expressions',
      'معاينة التغييرات ونسخ النص النهائي'
    ],
    howToUse: [
      { step: 1, title: 'Input Text', desc: 'Paste your document text.' },
      { step: 2, title: 'Set Find & Replace Fields', desc: 'Type what to find and what to replace it with.' },
      { step: 3, title: 'Replace & Copy', desc: 'Click Replace All and copy your updated text.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال النص', desc: 'الصق النص المراد التعديل عليه.' },
      { step: 2, title: 'تحديد الكلمات', desc: 'أدخل الكلمة المراد البحث عنها والبديل الجديد.' },
      { step: 3, title: 'استبدال ونسخ', desc: 'انقر على استبدال الكل وانسخ النص المعدل.' }
    ],
    faqs: [
      { q: 'Can I use Regex expressions?', a: 'Yes, enable the Regex toggle to use pattern-based search like `\\d+` or `\\b[A-Z]+\\b`.' }
    ],
    faqsAr: [
      { q: 'هل يمكن استخدام الـ Regex؟', a: 'نعم، بتفعيل خيار Regex يمكنك البحث بأنماط متقدمة للأرقام والرموز.' }
    ],
    relatedToolIds: ['text-cleaner', 'word-counter', 'text-case-converter']
  },

  // ================= CALCULATORS =================
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    nameAr: 'حاسبة النسبة المئوية',
    description: 'Calculate percentages easily: find X% of Y, calculate what percentage X is of Y, and find percentage increase or decrease.',
    descriptionAr: 'حساب النسب المئوية بسهولة: كم يساوي X% من Y، وما هي نسبة X إلى Y، ونسبة الزيادة أو النقصان.',
    category: 'calculators',
    icon: 'PercentIcon',
    isPopular: true,
    keywords: ['percentage calculator', 'percent of number', 'calculate percentage', 'percentage increase', 'percentage decrease'],
    keywordsAr: ['حاسبة النسبة المئوية', 'حساب النسبة', 'نسبة الزيادة', 'نسبة الخصم'],
    features: [
      'Calculate X% of Y (e.g. What is 15% of 240?)',
      'Calculate what percentage X is of Y (e.g. 45 is what % of 180?)',
      'Percentage Increase & Decrease between two values',
      'Detailed calculation formula breakdown and explanation',
      'Instant result updates as you type'
    ],
    featuresAr: [
      'حساب كم يساوي X% من Y (مثال: كم يساوي 15% من 240؟)',
      'حساب نسبة X من Y (مثال: 45 تمثل كم % من 180؟)',
      'حساب نسبة الزيادة أو النقصان المئوية بين قيمتين',
      'شرح خطوة بخطوة لطريقة ومعادلة الحساب',
      'تحديث فوري ومباشر للنتائج أثناء الكتابة'
    ],
    howToUse: [
      { step: 1, title: 'Choose Formula', desc: 'Select which percentage calculation you need.' },
      { step: 2, title: 'Enter Numbers', desc: 'Input your initial values and percentage.' },
      { step: 3, title: 'View Result', desc: 'See instant answers and mathematical steps.' }
    ],
    howToUseAr: [
      { step: 1, title: 'اختيار نوع الحساب', desc: 'حدد المعادلة التي تريد حسابها.' },
      { step: 2, title: 'إدخال الأرقام', desc: 'أدخل القيم والأرقام المطلوبة.' },
      { step: 3, title: 'مشاهدة النتيجة', desc: 'احصل على النتيجة فوراً مع تفاصيل المعادلة.' }
    ],
    faqs: [
      { q: 'How do you calculate percentage increase?', a: 'Subtract the old value from the new value, divide by the old value, then multiply by 100.' }
    ],
    faqsAr: [
      { q: 'كيف يتم حساب نسبة الزيادة؟', a: 'اطرح القيمة القديمة من الجديدة، ثم اقسم الناتج على القيمة القديمة واضرب في 100.' }
    ],
    relatedToolIds: ['discount-calculator', 'profit-loss-calculator', 'tip-calculator']
  },
  {
    id: 'age-calculator',
    slug: 'age-calculator',
    name: 'Age Calculator',
    nameAr: 'حاسبة العمر الدقيقة',
    description: 'Calculate your exact age in years, months, weeks, days, hours, and minutes, plus next birthday countdown.',
    descriptionAr: 'حساب العمر الدقيق بالسنوات والأشهر والأسابيع والأيام والساعات مع عداد تنازلي ليوم الميلاد القادم.',
    category: 'calculators',
    icon: 'CalendarIcon',
    isPopular: true,
    keywords: ['age calculator', 'calculate my age', 'exact age in days', 'next birthday countdown', 'date of birth'],
    keywordsAr: ['حاسبة العمر', 'احسب عمري', 'كم عمري بالايام', 'العد التنازلي لعيد ميلادي'],
    features: [
      'Exact age calculated in Years, Months, and Days',
      'Total life metrics: Total Months, Total Weeks, Total Days, Total Hours',
      'Next Birthday countdown with days remaining and weekday',
      'Day of the week you were born on (e.g. Friday)',
      'Astrological Zodiac sign display'
    ],
    featuresAr: [
      'حساب العمر بدقة بالسنوات والأشهر والأيام',
      'مقاييس شاملة: إجمالي الأشهر، إجمالي الأسابيع، إجمالي الأيام والساعات',
      'عداد تنازلي ليوم الميلاد القادم ومعرفة اليوم الموافق له',
      'معرفة اليوم الذي ولدت فيه من أيام الأسبوع (مثال: الجمعة)',
      'عرض البرج الفلكي'
    ],
    howToUse: [
      { step: 1, title: 'Pick Birth Date', desc: 'Select your birth date from the date picker.' },
      { step: 2, title: 'Choose Reference Date', desc: 'Defaults to today or pick a custom date.' },
      { step: 3, title: 'Explore Age Breakdown', desc: 'View your age details and milestone metrics.' }
    ],
    howToUseAr: [
      { step: 1, title: 'تحديد تاريخ الميلاد', desc: 'اختر يوم وشهر وسنة ميلادك.' },
      { step: 2, title: 'تاريخ المقارنة', desc: 'افتراضياً هو تاريخ اليوم أو تاريخ مخصص.' },
      { step: 3, title: 'مشاهدة تفاصيل العمر', desc: 'شاهد تحليلاً شاملاً لعمرك بالأيام والشهور والساعات.' }
    ],
    faqs: [
      { q: 'Does it account for leap years?', a: 'Yes, leap years and variable month lengths (28, 29, 30, 31 days) are accurately calculated.' }
    ],
    faqsAr: [
      { q: 'هل تأخذ الحسبة في الاعتبار السنوات الكبيسة؟', a: 'نعم، يتم حساب السنوات الكبيسة وتفاوت أيام الشهور بدقة متناهية.' }
    ],
    relatedToolIds: ['date-difference-calculator', 'percentage-calculator', 'time-converter']
  },
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    name: 'Discount & Sale Calculator',
    nameAr: 'حاسبة الخصم والتخفيضات',
    description: 'Calculate final sale prices, total money saved, and applicable sales tax on discounted purchases.',
    descriptionAr: 'حساب السعر النهائي بعد التخفيض، إجمالي المبلغ الموفر، وضريبة القيمة المضافة.',
    category: 'calculators',
    icon: 'TagIcon',
    keywords: ['discount calculator', 'sale price calculator', 'savings calculator', 'percent off', 'sales tax'],
    keywordsAr: ['حاسبة الخصم', 'سعر بعد التخفيض', 'حساب التوفير', 'حاسبة العروض'],
    features: [
      'Enter original price and discount percentage (e.g. 25% off)',
      'Optional additional secondary discount (e.g. Extra 10% off)',
      'Optional sales tax / VAT rate inclusion',
      'Displays final amount to pay and total amount saved'
    ],
    featuresAr: [
      'إدخال السعر الأصلي ونسبة الخصم (مثال: خصم 25%)',
      'إمكانية إضافة خصم إضافي مركب (مثال: خصم إضافي 10%)',
      'إمكانية احتساب ضريبة القيمة المضافة (VAT)',
      'عرض السعر النهائي للدفع وإجمالي المبلغ الموفر'
    ],
    howToUse: [
      { step: 1, title: 'Enter Original Price', desc: 'Input the item sticker price.' },
      { step: 2, title: 'Input Discount %', desc: 'Enter the sale percentage discount.' },
      { step: 3, title: 'View Savings', desc: 'Instantly view your final price and savings.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال السعر الأصلي', desc: 'أدخل السعر قبل الخصم.' },
      { step: 2, title: 'إدخال نسبة الخصم', desc: 'أدخل النسبة المئوية للتخفيض.' },
      { step: 3, title: 'مشاهدة التوفير', desc: 'شاهد السعر النهائي ومقدار ما وفرته فوراً.' }
    ],
    faqs: [
      { q: 'How is a compound discount calculated?', a: 'The second discount percentage is applied to the already discounted price, not the original price.' }
    ],
    faqsAr: [
      { q: 'كيف يُحسب الخصم المركب الإضافي؟', a: 'يتم تطبيق نسبة الخصم الثاني على السعر بعد الخصم الأول وليس السعر الأصلي.' }
    ],
    relatedToolIds: ['percentage-calculator', 'profit-loss-calculator', 'tip-calculator']
  },
  {
    id: 'profit-loss-calculator',
    slug: 'profit-loss-calculator',
    name: 'Profit / Loss Calculator',
    nameAr: 'حاسبة الأرباح والخسائر',
    description: 'Calculate net profit, profit margin percentage, markup percentage, and return on investment (ROI).',
    descriptionAr: 'حساب صافي الربح أو الخسارة، هامش الربح المئوي، نسبة الزيادة على التكلفة (Markup) والعائد على الاستثمار.',
    category: 'calculators',
    icon: 'TrendingUpIcon',
    keywords: ['profit loss calculator', 'profit margin', 'markup calculator', 'roi calculator', 'business math'],
    keywordsAr: ['حاسبة الارباح والخسائر', 'هامش الربح', 'حساب العائد على الاستثمار', 'حاسبة التجارة'],
    features: [
      'Calculates Net Profit / Net Loss amount',
      'Calculates Profit Margin % (Profit / Revenue)',
      'Calculates Markup % (Profit / Cost)',
      'Break-even and unit quantity multipliers'
    ],
    featuresAr: [
      'حساب صافي مبلغ الربح أو الخسارة',
      'حساب هامش الربح المئوي Profit Margin %',
      'حساب نسبة الزيادة على التكلفة Markup %',
      'تحديد الكميات ومضاعفات الوحدات المباعة'
    ],
    howToUse: [
      { step: 1, title: 'Enter Cost Price', desc: 'Input how much the item cost you to produce or buy.' },
      { step: 2, title: 'Enter Selling Price', desc: 'Input your retail selling price.' },
      { step: 3, title: 'Analyze Margins', desc: 'View net profit and profit margin percentage.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال سعر التكلفة', desc: 'أدخل تكلفة شراء أو إنتاج السلعة.' },
      { step: 2, title: 'إدخال سعر البيع', desc: 'أدخل سعر البيع للجمهور.' },
      { step: 3, title: 'تحليل الأرباح', desc: 'شاهد صافي الربح وهامش الربح المئوي فوراً.' }
    ],
    faqs: [
      { q: 'What is the difference between Margin and Markup?', a: 'Margin is profit divided by selling price, while Markup is profit divided by cost price.' }
    ],
    faqsAr: [
      { q: 'ما الفرق بين هامش الربح (Margin) ونسبة الإضافة (Markup)؟', a: 'هامش الربح هو نسبة الربح مقسومة على سعر البيع، بينما الـ Markup هو نسبة الربح مقسومة على سعر التكلفة.' }
    ],
    relatedToolIds: ['percentage-calculator', 'discount-calculator', 'tip-calculator']
  },
  {
    id: 'tip-calculator',
    slug: 'tip-calculator',
    name: 'Tip & Bill Split Calculator',
    nameAr: 'حاسبة الإكرامية وتقسيم الفاتورة',
    description: 'Calculate tip amount, total bill with tip, and split the final bill evenly among friends or party members.',
    descriptionAr: 'حساب قيمة الإكرامية، وإجمالي الفاتورة، وتقسيم المبلغ بالتساوي بين مجموعة من الأشخاص.',
    category: 'calculators',
    icon: 'DollarSignIcon',
    keywords: ['tip calculator', 'split bill calculator', 'gratuity calculator', 'restaurant bill split', 'dinner split'],
    keywordsAr: ['حاسبة الاكرامية', 'تقسيم الفاتورة', 'حساب البقشيش', 'حاسبة المطعم'],
    features: [
      'Quick tip preset buttons (10%, 15%, 18%, 20%, 25%) or custom percentage',
      'Split bill evenly between 1 to 50 people',
      'Calculates Tip per Person and Total per Person',
      'Option to round up total for clean cash payments'
    ],
    featuresAr: [
      'أزرار سريعة لنسب الإكرامية (10%، 15%، 18%، 20%، 25%) أو نسبة مخصصة',
      'تقسيم الفاتورة بالتساوي بين 1 إلى 50 شخصاً',
      'حساب نصيب كل شخص من الإكرامية ومن إجمالي الفاتورة',
      'خيار تقريب المبالغ للدفع النقدي المريح'
    ],
    howToUse: [
      { step: 1, title: 'Enter Bill Amount', desc: 'Type your subtotal or total bill amount.' },
      { step: 2, title: 'Select Tip % & People', desc: 'Pick your tip rate and number of guests.' },
      { step: 3, title: 'Get Split Amount', desc: 'See each person\'s exact share.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال قيمة الفاتورة', desc: 'أدخل المبلغ الإجمالي للفاتورة.' },
      { step: 2, title: 'تحديد النسبة والأشخاص', desc: 'اختر نسبة الإكرامية وعدد الأشخاص.' },
      { step: 3, title: 'مشاهدة النصيب', desc: 'شاهد نصيب كل شخص بدقة.' }
    ],
    faqs: [
      { q: 'Can I enter custom tip percentages?', a: 'Yes, you can enter any custom tip percentage or fixed dollar amount.' }
    ],
    faqsAr: [
      { q: 'هل يمكنني إدخال نسبة مخصصة؟', a: 'نعم، يمكنك كتابة أي نسبة مئوية مخصصة ترغب بها.' }
    ],
    relatedToolIds: ['percentage-calculator', 'discount-calculator', 'profit-loss-calculator']
  },
  {
    id: 'date-difference-calculator',
    slug: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    nameAr: 'حاسبة الفرق بين تاريخين',
    description: 'Calculate the exact number of days, weeks, months, years, and business days between any two dates.',
    descriptionAr: 'حساب عدد الأيام والأسابيع والشهور والسنوات وأيام العمل الفعلية بين أي تاريخين.',
    category: 'calculators',
    icon: 'ClockIcon',
    keywords: ['date difference', 'days between dates', 'date calculator', 'calculate time between dates', 'business days'],
    keywordsAr: ['الفرق بين تاريخين', 'كم يوم بين تاريخين', 'حساب المدة الزمنية', 'ايام العمل'],
    features: [
      'Total calendar days between two dates',
      'Breakdown in Years, Months, and Days',
      'Option to include or exclude start / end dates',
      'Business days calculation (Monday-Friday working days excluding weekends)',
      'Total weeks and weekend count breakdown'
    ],
    featuresAr: [
      'حساب إجمالي الأيام التقويمية بين تاريخين',
      'تفصيل المدة بالسنوات والأشهر والأيام',
      'خيار تضمين أو استبعاد يوم البداية والنهاية',
      'حساب أيام العمل الفعلية (استثناء عطلة نهاية الأسبوع)',
      'إجمالي عدد الأسابيع وأيام العطلات'
    ],
    howToUse: [
      { step: 1, title: 'Pick Start Date', desc: 'Select your beginning date.' },
      { step: 2, title: 'Pick End Date', desc: 'Select your target ending date.' },
      { step: 3, title: 'View Duration', desc: 'Instantly view total days and duration breakdown.' }
    ],
    howToUseAr: [
      { step: 1, title: 'تحديد تاريخ البداية', desc: 'اختر تاريخ اليوم أو التاريخ الأول.' },
      { step: 2, title: 'تحديد تاريخ النهاية', desc: 'اختر التاريخ المستهدف للمقارنة.' },
      { step: 3, title: 'مشاهدة المدة', desc: 'شاهد إجمالي الأيام وتفاصيل الفترة الزمنية.' }
    ],
    faqs: [
      { q: 'How does it count business days?', a: 'It calculates days falling on Monday through Friday, skipping Saturdays and Sundays.' }
    ],
    faqsAr: [
      { q: 'كيف يتم حساب أيام العمل؟', a: 'يتم احتساب الأيام من الاثنين إلى الجمعة (أو أيام الأسبوع العادية) مع استثناء عطلات نهاية الأسبوع.' }
    ],
    relatedToolIds: ['age-calculator', 'time-converter', 'percentage-calculator']
  },

  // ================= CONVERTERS =================
  {
    id: 'length-converter',
    slug: 'length-converter',
    name: 'Length & Distance Converter',
    nameAr: 'محول وحدات الطول والمسافة',
    description: 'Convert between Meters, Kilometers, Centimeters, Millimeters, Miles, Yards, Feet, and Inches.',
    descriptionAr: 'تحويل وحدات القياس بين المتر، الكيلومتر، السنتيمتر، المليمتر، الميل، الياردة، القدم، والبوصة.',
    category: 'converters',
    icon: 'RulerIcon',
    isPopular: true,
    keywords: ['length converter', 'meters to feet', 'km to miles', 'inches to cm', 'distance converter', 'unit converter'],
    keywordsAr: ['تحويل الطول', 'من متر الى قدم', 'من ميل الى كيلومتر', 'تحويل البوصة الى سم'],
    features: [
      'Instant conversion across all units simultaneously',
      'Supports Metric (km, m, cm, mm) & Imperial (miles, yards, feet, inches)',
      'Scientific notation for extremely large or microscopic distances',
      'Swap units with one click'
    ],
    featuresAr: [
      'تحويل فوري وشامل لجميع الوحدات في نفس الوقت',
      'يدعم النظام المتري (كم، م، سم، ملم) والنظام الإمبراطوري (ميل، ياردة، قدم، بوصة)',
      'دعم الأرقام القياسية والدقيقة جداً',
      'تبديل الوحدات بنقرة واحدة'
    ],
    howToUse: [
      { step: 1, title: 'Enter Value', desc: 'Type the number you want to convert.' },
      { step: 2, title: 'Select From & To Units', desc: 'Pick your source and target units.' },
      { step: 3, title: 'View All Units', desc: 'See the converted value and full conversion table.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال القيمة', desc: 'اكتب الرقم المطلوب تحويله.' },
      { step: 2, title: 'تحديد الوحدات', desc: 'اختر الوحدة الحالية والوحدة المستهدفة.' },
      { step: 3, title: 'مشاهدة النتائج', desc: 'شاهد النتيجة وجدول التحويل لكافة الوحدات.' }
    ],
    faqs: [
      { q: 'How many feet are in a meter?', a: '1 meter equals approximately 3.28084 feet.' }
    ],
    faqsAr: [
      { q: 'كم قدماً في المتر الواحد؟', a: 'المتر الواحد يساوي تقريباً 3.28084 قدم.' }
    ],
    relatedToolIds: ['weight-converter', 'temperature-converter', 'data-units-converter']
  },
  {
    id: 'weight-converter',
    slug: 'weight-converter',
    name: 'Weight & Mass Converter',
    nameAr: 'محول وحدات الوزن والكتلة',
    description: 'Convert between Kilograms, Grams, Milligrams, Metric Tons, Pounds (lbs), Ounces (oz), and Stones.',
    descriptionAr: 'تحويل وحدات الوزن بين الكيلوجرام، الجرام، المليجرام، الطن، الرطل (باوند)، الأونصة، والستون.',
    category: 'converters',
    icon: 'ScaleIcon',
    keywords: ['weight converter', 'kg to lbs', 'grams to ounces', 'pounds to kilograms', 'mass converter'],
    keywordsAr: ['تحويل الوزن', 'من كيلو الى باوند', 'من جرام الى اونصة', 'محول الكتلة'],
    features: [
      'Converts Kilograms, Grams, Milligrams, Tons, Pounds, Ounces, Stones',
      'Real-time multi-unit synchronized table',
      'Accurate conversion constants up to 8 decimal places',
      'One-click result copying'
    ],
    featuresAr: [
      'تحويل الكيلوجرام والجرام والمليجرام والطن والباوند والأونصة',
      'جدول متزامن يعرض كافة الوحدات المقابلة مباشرة',
      'دقة حسابية عالية حتى 8 خانات عشرية',
      'نسخ النتيجة بنقرة واحدة'
    ],
    howToUse: [
      { step: 1, title: 'Enter Weight', desc: 'Type your weight value.' },
      { step: 2, title: 'Pick Units', desc: 'Select your starting unit (e.g. Kilograms).' },
      { step: 3, title: 'View Equivalents', desc: 'View conversions in Pounds, Ounces, and Grams.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال الوزن', desc: 'أدخل قيمة الوزن المراد تحويلها.' },
      { step: 2, title: 'اختيار الوحدة', desc: 'اختر الوحدة الأصلية (مثال: كيلوجرام).' },
      { step: 3, title: 'معاينة النتيجة', desc: 'شاهد الوزن المقابل بالباوند والأونصة والجرام.' }
    ],
    faqs: [
      { q: 'How many pounds are in 1 kilogram?', a: '1 kilogram equals approximately 2.20462 pounds.' }
    ],
    faqsAr: [
      { q: 'كم باوند في الكيلوجرام الواحد؟', a: 'الكيلوجرام الواحد يساوي تقريباً 2.20462 باوند.' }
    ],
    relatedToolIds: ['length-converter', 'temperature-converter', 'data-units-converter']
  },
  {
    id: 'temperature-converter',
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    nameAr: 'محول درجات الحرارة',
    description: 'Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K) with instant formula display.',
    descriptionAr: 'تحويل درجات الحرارة بين المئوية (سلزيوس)، الفهرنهايت، والكلفن مع عرض معادلة التحويل.',
    category: 'converters',
    icon: 'ThermometerIcon',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'fahrenheit to celsius', 'kelvin converter', 'degrees conversion'],
    keywordsAr: ['تحويل الحرارة', 'من فهرنهايت الى مئوي', 'من مئوية الى كلفن', 'درجة الحرارة'],
    features: [
      'Simultaneous Celsius, Fahrenheit, and Kelvin conversion',
      'Displays standard scientific conversion formulas',
      'Reference water freezing and boiling points',
      'Slider and numeric input support'
    ],
    featuresAr: [
      'تحويل متزامن بين الدرجة المئوية والفهرنهايت والكلفن',
      'عرض المعادلات الرياضية والعلمية المستخدمة في التحويل',
      'نقاط مرجعية لدرجات تجمد وغليان الماء وحرارة الجسم الطبيعية',
      'إدخال رقمي وشريط تمرير سلس'
    ],
    howToUse: [
      { step: 1, title: 'Enter Degree', desc: 'Type any temperature reading.' },
      { step: 2, title: 'Select Scale', desc: 'Pick Celsius (°C), Fahrenheit (°F), or Kelvin (K).' },
      { step: 3, title: 'See Converted Values', desc: 'View accurate converted temperatures instantly.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال الدرجة', desc: 'اكتب قراءة درجة الحرارة.' },
      { step: 2, title: 'اختيار المقياس', desc: 'اختر سلزيوس أو فهرنهايت أو كلفن.' },
      { step: 3, title: 'مشاهدة القيم', desc: 'شاهد درجات الحرارة المحولة فوراً.' }
    ],
    faqs: [
      { q: 'What is the formula to convert Celsius to Fahrenheit?', a: '°F = (°C × 9/5) + 32.' }
    ],
    faqsAr: [
      { q: 'ما هي معادلة تحويل المئوي إلى فهرنهايت؟', a: 'الدرجة بالفهرنهايت = (الدرجة المئوية × 9/5) + 32.' }
    ],
    relatedToolIds: ['length-converter', 'weight-converter', 'time-converter']
  },
  {
    id: 'time-converter',
    slug: 'time-converter',
    name: 'Time Units Converter',
    nameAr: 'محول وحدات الوقت والزمن',
    description: 'Convert between Milliseconds, Seconds, Minutes, Hours, Days, Weeks, Months, and Years.',
    descriptionAr: 'تحويل وحدات الوقت بين الأجزاء من الثانية، الثواني، الدقائق، الساعات، الأيام، الأسابيع، والسنوات.',
    category: 'converters',
    icon: 'ClockIcon',
    keywords: ['time converter', 'seconds to hours', 'hours to days', 'minutes to seconds', 'duration converter'],
    keywordsAr: ['تحويل الوقت', 'من ثواني الى ساعات', 'من ساعات الى ايام', 'محول الزمن'],
    features: [
      'Convert Milliseconds, Seconds, Minutes, Hours, Days, Weeks, Months, Years',
      'Complete breakdown into Days:Hours:Minutes:Seconds format',
      'Live synchronized multi-unit output table',
      'Accurate year and month calendar approximations'
    ],
    featuresAr: [
      'تحويل الملي ثانية والثواني والدقائق والساعات والأيام والأسابيع والسنوات',
      'تفصيل كامل بصيغة أيام : ساعات : دقائق : ثواني',
      'جدول تحويل متزامن لكافة الوحدات في لحظة واحدة',
      'حسابات زمنية دقيقة'
    ],
    howToUse: [
      { step: 1, title: 'Enter Time Value', desc: 'Type your duration number.' },
      { step: 2, title: 'Select Unit', desc: 'Choose your starting time unit (e.g. Hours).' },
      { step: 3, title: 'View All Units', desc: 'See equivalents in Minutes, Seconds, and Days.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال القيمة', desc: 'اكتب مقدار الوقت المراد تحويله.' },
      { step: 2, title: 'اختيار الوحدة', desc: 'اختر الوحدة الحالية (مثال: ساعات).' },
      { step: 3, title: 'مشاهدة النتائج', desc: 'شاهد ما يقابلها بالدقائق والثواني والأيام.' }
    ],
    faqs: [
      { q: 'How many seconds are in a full day?', a: 'There are exactly 86,400 seconds in 24 hours.' }
    ],
    faqsAr: [
      { q: 'كم ثانية في اليوم الواحد؟', a: 'يحتوي اليوم (24 ساعة) على 86,400 ثانية بالضبط.' }
    ],
    relatedToolIds: ['date-difference-calculator', 'age-calculator', 'data-units-converter']
  },
  {
    id: 'data-units-converter',
    slug: 'data-units-converter',
    name: 'Data & Storage Units Converter',
    nameAr: 'محول وحدات البيانات والتخزين',
    description: 'Convert between Bits, Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), Terabytes (TB), and Petabytes (PB).',
    descriptionAr: 'تحويل وحدات التخزين الرقمي بين البت، البايت، الكيلوبايت، الميجابايت، الجيجابايت، والتيرابايت.',
    category: 'converters',
    icon: 'HardDriveIcon',
    keywords: ['data converter', 'mb to gb', 'gb to tb', 'bytes to kb', 'storage converter', 'bits to bytes'],
    keywordsAr: ['تحويل البيانات', 'من ميجا الى جيجا', 'من جيجا الى تيرا', 'حساب سعة التخزين'],
    features: [
      'Supports Decimal (1000 bytes = 1 KB) and Binary / IEC (1024 bytes = 1 KiB) standards',
      'Converts Bits (b, Kb, Mb, Gb) and Bytes (B, KB, MB, GB, TB, PB)',
      'Data transfer rate speed estimates for downloads',
      'One-click copy of all converted units'
    ],
    featuresAr: [
      'دعم المعيار العشري (1000 بايت = 1 كيلوبايت) والمعيار الثنائي IEC (1024 بايت = 1 كايبي بايت)',
      'تحويل البت (Bits) والبايت (Bytes) من الكيلو إلى التيرابايت والبيتابايت',
      'تقدير أوقات سرعة التحميل ونقل البيانات',
      'نسخ سريع لنتائج التحويل بضغطة زر'
    ],
    howToUse: [
      { step: 1, title: 'Enter Data Size', desc: 'Type your file or storage size.' },
      { step: 2, title: 'Select Storage Unit', desc: 'Choose your base unit (e.g. Gigabytes GB).' },
      { step: 3, title: 'See All Conversions', desc: 'Instantly view Megabytes, Terabytes, and Bytes.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال الحجم', desc: 'اكتب حجم الملف أو سعة التخزين.' },
      { step: 2, title: 'اختيار الوحدة', desc: 'اختر الوحدة الحالية (مثال: جيجابايت GB).' },
      { step: 3, title: 'مشاهدة التحويلات', desc: 'شاهد الحجم بالميجابايت والتيرابايت والبايت.' }
    ],
    faqs: [
      { q: 'What is the difference between 1000 and 1024 bytes?', a: 'Hard drive manufacturers often use base 10 (1000 bytes = 1 KB), while operating systems use base 2 binary (1024 bytes = 1 KiB).' }
    ],
    faqsAr: [
      { q: 'ما الفرق بين 1000 و 1024 بايت؟', a: 'تستخدم شركات الأقراص الصلبة النظام العشري (1000 بايت = 1KB)، بينما تستخدم أنظمة التشغيل النظام الثنائي (1024 بايت = 1KiB).' }
    ],
    relatedToolIds: ['number-base-converter', 'time-converter', 'length-converter']
  },
  {
    id: 'number-base-converter',
    slug: 'number-base-converter',
    name: 'Number Base Converter',
    nameAr: 'محول أنظمة العد والأرقام',
    description: 'Convert numbers simultaneously between Decimal (Base 10), Binary (Base 2), Hexadecimal (Base 16), and Octal (Base 8).',
    descriptionAr: 'تحويل فوري وشامل بين النظام العشري (Decimal)، الثنائي (Binary)، السداسي عشري (Hex)، والثماني (Octal).',
    category: 'converters',
    icon: 'BinaryIcon',
    keywords: ['number base converter', 'decimal to binary', 'hex to decimal', 'binary to hex', 'octal converter'],
    keywordsAr: ['تحويل انظمة العد', 'من عشري الى ثنائي', 'من باينري الى هيكس', 'نظام سداسي عشري'],
    features: [
      'Simultaneous live conversion: Decimal, Binary, Hexadecimal, and Octal',
      'Supports custom base inputs from Base 2 up to Base 36',
      'Displays binary bits visualization and byte grouping (e.g. 1100 1010)',
      'One-click copy for each base system'
    ],
    featuresAr: [
      'تحويل فوري متزامن: العشري، الثنائي، السداسي عشري، والثماني',
      'دعم أنظمة العد المخصصة من الأساس 2 وحتى الأساس 36',
      'عرض تمثيل البتات وتجميع البايتات (مثل 1100 1010)',
      'نسخ سريع لأي نظام عد بنقرة واحدة'
    ],
    howToUse: [
      { step: 1, title: 'Enter Number', desc: 'Type a number in any base field.' },
      { step: 2, title: 'Automatic Multi-Base Sync', desc: 'All other base fields update in real-time.' },
      { step: 3, title: 'Copy Result', desc: 'Copy the binary, hex, or decimal output.' }
    ],
    howToUseAr: [
      { step: 1, title: 'إدخال الرقم', desc: 'اكتب الرقم في أي حقل من حقول أنظمة العد.' },
      { step: 2, title: 'تحديث فوري', desc: 'يتم تحديث جميع الأنظمة الأخرى تلقائياً.' },
      { step: 3, title: 'نسخ النتيجة', desc: 'انسخ الناتج الثنائي أو السداسي عشري أو العشري.' }
    ],
    faqs: [
      { q: 'What characters are allowed in Hexadecimal?', a: 'Digits 0-9 and letters A through F (representing values 10 to 15).' }
    ],
    faqsAr: [
      { q: 'ما هي الرموز المقبولة في النظام السداسي عشري Hex؟', a: 'الأرقام من 0 إلى 9 والحروف من A إلى F (التي تمثل القيم من 10 إلى 15).' }
    ],
    relatedToolIds: ['data-units-converter', 'base64-encoder-decoder', 'length-converter']
  }
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return allToolsData.find((t) => t.slug === slug || t.id === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return allToolsData.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return allToolsData.filter((t) => t.isPopular);
}
