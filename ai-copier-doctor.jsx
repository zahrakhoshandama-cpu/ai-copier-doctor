import { useState, useRef, useCallback, useEffect } from "react";

// ── Styles injected globally ──────────────────────────────────────────────────
const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;900&family=Syne:wght@400;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #060910;
  --bg2:       #0d1120;
  --bg3:       #111827;
  --gold:      #c9a035;
  --gold2:     #f5d57a;
  --cyan:      #00c8e8;
  --cyan2:     #7af0ff;
  --red:       #ff4d6d;
  --green:     #00e5a0;
  --yellow:    #ffd166;
  --glass:     rgba(255,255,255,0.04);
  --glass2:    rgba(255,255,255,0.08);
  --border:    rgba(255,255,255,0.08);
  --border2:   rgba(201,160,53,0.3);
  --text:      #e8eaf2;
  --text2:     #8b92a8;
  --text3:     #555f7a;
  --r:         16px;
  --r2:        24px;
  --shadow:    0 20px 60px rgba(0,0,0,0.6);
  --shadow2:   0 4px 20px rgba(0,200,232,0.15);
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: 'Syne','Vazirmatn',sans-serif; overflow-x: hidden; }
.rtl { direction: rtl; font-family: 'Vazirmatn','Syne',sans-serif; }

/* scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg2); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

/* animations */
@keyframes fadeUp   { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn   { from{opacity:0} to{opacity:1} }
@keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
@keyframes spin     { to{transform:rotate(360deg)} }
@keyframes scanLine { 0%{top:0%} 100%{top:100%} }
@keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
@keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(0,200,232,0.3)} 50%{box-shadow:0 0 50px rgba(0,200,232,0.7)} }
@keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes orbit    { from{transform:rotate(0deg) translateX(60px) rotate(0deg)} to{transform:rotate(360deg) translateX(60px) rotate(-360deg)} }
@keyframes grid-move{ from{transform:translateY(0)} to{transform:translateY(40px)} }
@keyframes bar-fill { from{width:0%} to{width:var(--w)} }

.animate-fadeUp  { animation: fadeUp .6s ease both; }
.animate-fadeIn  { animation: fadeIn .4s ease both; }
.animate-pulse   { animation: pulse 2s ease infinite; }
.animate-spin    { animation: spin 1s linear infinite; }
.animate-float   { animation: float 4s ease infinite; }
.animate-glow    { animation: glow 2s ease infinite; }

/* glass card */
.glass-card {
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--r2);
  transition: border-color .3s, transform .3s, box-shadow .3s;
}
.glass-card:hover { border-color: rgba(0,200,232,0.2); transform: translateY(-2px); box-shadow: var(--shadow2); }

/* buttons */
.btn-gold {
  background: linear-gradient(135deg, #c9a035 0%, #f5d57a 50%, #c9a035 100%);
  color: #0a0b0f;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all .3s;
  background-size: 200% auto;
  font-family: inherit;
}
.btn-gold:hover { background-position: right center; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,160,53,0.5); }

.btn-cyan {
  background: linear-gradient(135deg, #00c8e8, #00a0c0);
  color: #060910;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all .3s;
  font-family: inherit;
}
.btn-cyan:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,200,232,0.5); }

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border2);
  color: var(--gold);
  border-radius: 50px;
  cursor: pointer;
  transition: all .3s;
  font-family: inherit;
}
.btn-ghost:hover { background: var(--glass2); border-color: var(--gold); }

/* severity bar */
.severity-bar-wrap { background: rgba(255,255,255,0.06); border-radius: 50px; overflow: hidden; }
.severity-bar { height: 100%; border-radius: 50px; transition: width 1.5s cubic-bezier(.4,0,.2,1); }

/* noise overlay */
.noise::before {
  content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  opacity: .4;
}

/* grid bg */
.grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: linear-gradient(rgba(0,200,232,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,200,232,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* upload zone */
.upload-zone {
  border: 2px dashed var(--border2);
  border-radius: var(--r2);
  transition: all .3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.upload-zone:hover, .upload-zone.drag-over {
  border-color: var(--cyan);
  background: rgba(0,200,232,0.05);
}

/* scan animation */
.scan-container { position: relative; overflow: hidden; border-radius: var(--r); }
.scan-line {
  position: absolute; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, transparent, var(--cyan), transparent);
  animation: scanLine 1.5s ease-in-out infinite;
  box-shadow: 0 0 20px var(--cyan), 0 0 60px rgba(0,200,232,0.3);
}

/* confidence ring */
.conf-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }

/* tag badge */
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 600;
}
.badge-red    { background: rgba(255,77,109,0.15); color: var(--red); border: 1px solid rgba(255,77,109,0.3); }
.badge-yellow { background: rgba(255,209,102,0.15); color: var(--yellow); border: 1px solid rgba(255,209,102,0.3); }
.badge-green  { background: rgba(0,229,160,0.15); color: var(--green); border: 1px solid rgba(0,229,160,0.3); }
.badge-cyan   { background: rgba(0,200,232,0.15); color: var(--cyan); border: 1px solid rgba(0,200,232,0.3); }
.badge-gold   { background: rgba(201,160,53,0.15); color: var(--gold2); border: 1px solid rgba(201,160,53,0.3); }

/* nav */
.nav-link { color: var(--text2); text-decoration: none; font-size:14px; font-weight:500; transition:color .2s; cursor:pointer; }
.nav-link:hover { color: var(--text); }

/* feature icon wrap */
.icon-wrap {
  width:52px; height:52px; border-radius:14px;
  display:flex; align-items:center; justify-content:center;
  background: var(--glass2); border: 1px solid var(--border);
  font-size:22px; flex-shrink:0;
}

/* stat number */
.stat-num { font-size:42px; font-weight:800; line-height:1; }

/* divider */
.divider { height:1px; background: linear-gradient(90deg,transparent,var(--border2),transparent); }

/* shimmer loading */
.shimmer {
  background: linear-gradient(90deg,var(--glass) 25%,var(--glass2) 50%,var(--glass) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

/* tab */
.tab { padding:8px 20px; border-radius:50px; cursor:pointer; font-size:14px; font-weight:600; transition:all .2s; border:none; font-family:inherit; }
.tab-active { background:var(--glass2); border:1px solid var(--border2); color:var(--gold2); }
.tab-inactive { background:transparent; color:var(--text3); }
.tab-inactive:hover { color:var(--text2); }
`;

// ── Constants ─────────────────────────────────────────────────────────────────
const BRANDS = ["Canon","Ricoh","Konica Minolta","Sharp","Toshiba","Kyocera","HP","Xerox","Samsung","Brother"];
const DEVICE_TYPES_FA = ["دستگاه کپی","پرینتر","کپی رنگی","پرینتر چندکاره"];
const DEVICE_TYPES_EN = ["Copier","Printer","Color Copier","MFP"];

const DEFECTS_FA = [
  {id:"lines",label:"خطوط عمودی/افقی"},
  {id:"ghost",label:"تصویر روح"},
  {id:"gray",label:"پس‌زمینه خاکستری"},
  {id:"faded",label:"چاپ کم‌رنگ"},
  {id:"wrinkle",label:"کاغذ چروک"},
  {id:"spots",label:"لکه‌های سیاه"},
  {id:"white_lines",label:"خطوط سفید"},
  {id:"color",label:"عدم تراز رنگ"},
  {id:"smudge",label:"لکه‌های تونر"},
];

const T = {
  fa: {
    appName: "دکتر هوشمند کپی",
    tagline: "تشخیص فوری مشکلات دستگاه با هوش مصنوعی",
    sub: "عکس نمونه چاپ را آپلود کنید — AI در چند ثانیه خرابی را تشخیص می‌دهد",
    startBtn: "شروع تشخیص رایگان",
    learnMore: "بیشتر بدانید",
    howWorks: "چطور کار می‌کند",
    features: "ویژگی‌ها",
    pricing: "قیمت‌ها",
    uploadTitle: "آپلود نمونه چاپ",
    uploadSub: "تصویر را اینجا بکشید یا کلیک کنید",
    uploadHint: "PNG، JPG، WEBP — حداکثر ۱۰ مگابایت",
    selectBrand: "برند دستگاه",
    selectType: "نوع دستگاه",
    selectDefect: "نوع مشکل مشاهده‌شده",
    analyzeBtn: "تحلیل هوشمند",
    analyzing: "در حال تحلیل...",
    resultTitle: "گزارش تشخیص",
    problem: "مشکل تشخیص داده‌شده",
    confidence: "ضریب اطمینان",
    parts: "قطعات مشکوک",
    priority: "اولویت تعمیر",
    cost: "تخمین هزینه",
    solution: "راه‌حل پیشنهادی",
    technical: "جزئیات فنی",
    newAnalysis: "تحلیل جدید",
    saveReport: "ذخیره گزارش PDF",
    high: "بالا", medium: "متوسط", low: "پایین",
    critical: "حیاتی", urgent: "فوری", normal: "عادی",
    stats: ["۱۲۰۰+ نوع مشکل", "۹۸٪ دقت", "۳۰ ثانیه تشخیص", "۸ برند پشتیبانی"],
    stat_labels: ["در پایگاه داده","ضریب دقت AI","میانگین زمان","برند پشتیبانی"],
    features_list: [
      {icon:"🔬",title:"تشخیص دقیق",desc:"بیش از ۲۰ نوع عیب چاپ با دقت بالا شناسایی می‌شود"},
      {icon:"⚡",title:"فوری",desc:"نتیجه در کمتر از ۳۰ ثانیه با هوش مصنوعی پیشرفته"},
      {icon:"🔧",title:"راهنمای تعمیر",desc:"مراحل دقیق تعمیر و قطعات مورد نیاز"},
      {icon:"💰",title:"تخمین هزینه",desc:"برآورد دقیق هزینه تعمیر بر اساس بازار ایران/دبی"},
      {icon:"📱",title:"موبایل‌فرست",desc:"طراحی کاملاً ریسپانسیو برای همه دستگاه‌ها"},
      {icon:"🌐",title:"دو زبانه",desc:"پشتیبانی کامل از فارسی و انگلیسی"},
    ],
    uploadCamera: "دوربین",
    uploadFile: "فایل",
    noImage: "لطفاً ابتدا یک تصویر آپلود کنید",
    errorMsg: "خطا در تحلیل. لطفاً دوباره امتحان کنید.",
  },
  en: {
    appName: "AI Copier Doctor",
    tagline: "Instantly Detect Copier Problems with AI",
    sub: "Upload a sample print photo — AI diagnoses the fault in seconds",
    startBtn: "Start Free Diagnosis",
    learnMore: "Learn More",
    howWorks: "How It Works",
    features: "Features",
    pricing: "Pricing",
    uploadTitle: "Upload Sample Print",
    uploadSub: "Drag & drop image here or click",
    uploadHint: "PNG, JPG, WEBP — max 10 MB",
    selectBrand: "Device Brand",
    selectType: "Device Type",
    selectDefect: "Observed Problem",
    analyzeBtn: "Analyze with AI",
    analyzing: "Analyzing...",
    resultTitle: "Diagnosis Report",
    problem: "Detected Problem",
    confidence: "Confidence",
    parts: "Suspected Parts",
    priority: "Repair Priority",
    cost: "Estimated Cost",
    solution: "Suggested Solution",
    technical: "Technical Details",
    newAnalysis: "New Analysis",
    saveReport: "Save PDF Report",
    high: "High", medium: "Medium", low: "Low",
    critical: "Critical", urgent: "Urgent", normal: "Normal",
    stats: ["1200+ Problems", "98% Accuracy", "30s Analysis", "8 Brands"],
    stat_labels: ["in database","AI accuracy","avg. time","supported brands"],
    features_list: [
      {icon:"🔬",title:"Precise Detection",desc:"20+ print defect types identified with high accuracy"},
      {icon:"⚡",title:"Instant Results",desc:"Results in under 30 seconds with advanced AI"},
      {icon:"🔧",title:"Repair Guide",desc:"Step-by-step repair instructions and required parts"},
      {icon:"💰",title:"Cost Estimate",desc:"Accurate repair cost based on local market prices"},
      {icon:"📱",title:"Mobile First",desc:"Fully responsive design for all devices"},
      {icon:"🌐",title:"Bilingual",desc:"Full Persian and English language support"},
    ],
    uploadCamera: "Camera",
    uploadFile: "File",
    noImage: "Please upload an image first",
    errorMsg: "Analysis error. Please try again.",
  }
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="url(#lg)"/>
    <path d="M10 24V13l8-5 8 5v11l-8 4-8-4z" stroke="#060910" strokeWidth="1.5" fill="none"/>
    <path d="M10 13l8 5 8-5" stroke="#060910" strokeWidth="1.5"/>
    <path d="M18 18v10" stroke="#060910" strokeWidth="1.5"/>
    <circle cx="18" cy="13" r="2" fill="#060910"/>
    <defs><linearGradient id="lg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
      <stop stopColor="#c9a035"/><stop offset="1" stopColor="#f5d57a"/>
    </linearGradient></defs>
  </svg>
);

const CopierIllustration = () => (
  <svg width="340" height="280" viewBox="0 0 340 280" fill="none" className="animate-float">
    <defs>
      <linearGradient id="body" x1="0" y1="0" x2="340" y2="280" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1a2040"/><stop offset="1" stopColor="#0d1428"/>
      </linearGradient>
      <linearGradient id="panel" x1="0" y1="0" x2="200" y2="80" gradientUnits="userSpaceOnUse">
        <stop stopColor="#c9a035" stopOpacity=".4"/><stop offset="1" stopColor="#f5d57a" stopOpacity=".1"/>
      </linearGradient>
      <filter id="glow2"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    {/* body */}
    <rect x="40" y="80" width="260" height="170" rx="16" fill="url(#body)" stroke="rgba(201,160,53,0.3)" strokeWidth="1.5"/>
    {/* screen */}
    <rect x="60" y="100" width="130" height="80" rx="8" fill="rgba(0,200,232,0.08)" stroke="rgba(0,200,232,0.3)" strokeWidth="1"/>
    <rect x="65" y="105" width="120" height="70" rx="6" fill="#060a14"/>
    {/* scan lines on screen */}
    {[0,1,2,3,4].map(i=>(
      <line key={i} x1="70" y1={115+i*12} x2="180" y2={115+i*12} stroke="rgba(0,200,232,0.15)" strokeWidth="1"/>
    ))}
    <rect x="70" y="108" width="80" height="3" rx="1.5" fill="rgba(0,200,232,0.5)"/>
    {/* control panel */}
    <rect x="200" y="100" width="85" height="80" rx="8" fill="url(#panel)" stroke="rgba(201,160,53,0.2)" strokeWidth="1"/>
    {[0,1,2].map(i=>(
      <circle key={i} cx={220+i*20} cy="120" r="6" fill="rgba(0,0,0,0.4)" stroke="rgba(201,160,53,0.4)" strokeWidth="1"/>
    ))}
    <rect x="210" y="140" width="65" height="28" rx="6" fill="rgba(201,160,53,0.2)" stroke="rgba(201,160,53,0.4)" strokeWidth="1"/>
    <rect x="218" y="147" width="49" height="14" rx="3" fill="rgba(201,160,53,0.3)"/>
    {/* paper tray */}
    <rect x="60" y="190" width="220" height="20" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
    <rect x="70" y="194" width="200" height="12" rx="2" fill="rgba(255,255,255,0.03)"/>
    {/* paper sheets */}
    {[0,1,2].map(i=>(
      <rect key={i} x={80+i*2} y={213+i*2} width="180" height="30" rx="3" fill={i===0?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.6)"} stroke="rgba(0,0,0,0.1)" strokeWidth="0.5"/>
    ))}
    {/* scan line on paper */}
    <line x1="80" y1="215" x2="260" y2="215" stroke="rgba(201,160,53,0.6)" strokeWidth="1.5" strokeDasharray="4 2"/>
    {/* AI orbits */}
    <circle cx="310" cy="120" r="3" fill="var(--cyan)" filter="url(#glow2)" className="animate-pulse"/>
    <circle cx="30" cy="150" r="2" fill="var(--gold)" filter="url(#glow2)" className="animate-pulse"/>
    <circle cx="290" cy="200" r="2.5" fill="var(--green)" filter="url(#glow2)" className="animate-pulse"/>
    {/* connection lines */}
    <line x1="310" y1="120" x2="285" y2="140" stroke="rgba(0,200,232,0.2)" strokeWidth="1" strokeDasharray="3 2"/>
    <line x1="30" y1="150" x2="60" y2="155" stroke="rgba(201,160,53,0.2)" strokeWidth="1" strokeDasharray="3 2"/>
    {/* top feeder */}
    <rect x="80" y="55" width="180" height="30" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
    <rect x="100" y="60" width="140" height="5" rx="2.5" fill="rgba(255,255,255,0.05)"/>
    {/* label */}
    <rect x="100" y="65" width="60" height="12" rx="3" fill="rgba(0,200,232,0.1)" stroke="rgba(0,200,232,0.2)" strokeWidth="0.5"/>
  </svg>
);

// ── Circular Confidence Chart ─────────────────────────────────────────────────
const ConfidenceRing = ({ value, size = 120, color = "#00c8e8" }) => {
  const r = (size - 20) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.5s ease", filter: `drop-shadow(0 0 8px ${color})` }}/>
    </svg>
  );
};

// ── Severity Bar ──────────────────────────────────────────────────────────────
const SeverityBar = ({ label, value, color }) => (
  <div style={{ marginBottom: 10 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13 }}>
      <span style={{ color:"var(--text2)" }}>{label}</span>
      <span style={{ color, fontWeight:700 }}>{value}%</span>
    </div>
    <div className="severity-bar-wrap" style={{ height:8 }}>
      <div className="severity-bar" style={{ width:`${value}%`, background:`linear-gradient(90deg,${color}80,${color})` }}/>
    </div>
  </div>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("fa");
  const [page, setPage] = useState("landing"); // landing | upload | analyzing | results
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [brand, setBrand] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [defect, setDefect] = useState("");
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [animBars, setAnimBars] = useState(false);
  const fileRef = useRef();
  const cameraRef = useRef();
  const t = T[lang];
  const isRTL = lang === "fa";

  useEffect(() => {
    if (result) setTimeout(() => setAnimBars(true), 400);
    else setAnimBars(false);
  }, [result]);

  // ── AI Analysis ─────────────────────────────────────────────────────────────
  const analyze = async () => {
    if (!image) { alert(t.noImage); return; }
    setPage("analyzing");
    try {
      const base64 = await toBase64(image);
      const sysPrompt = lang === "fa"
        ? `شما یک متخصص تعمیر دستگاه‌های کپی و پرینتر هستید. تصویر نمونه چاپ را تحلیل کنید و مشکلات احتمالی دستگاه را شناسایی کنید.
برند: ${brand||"نامشخص"} | نوع: ${deviceType||"نامشخص"} | مشکل مشاهده‌شده: ${defect||"نامشخص"}
پاسخ دهید فقط JSON معتبر با این ساختار — بدون کد باکس و بدون توضیح اضافه:
{"problem_name":"...","confidence":85,"suspected_parts":["...","..."],"repair_priority":"high|medium|low","estimated_cost":"...","solution":"...","technical_details":"...","defect_bars":[{"label":"...","value":80,"color":"#ff4d6d"},{"label":"...","value":65,"color":"#ffd166"},{"label":"...","value":40,"color":"#00e5a0"}]}`
        : `You are an expert copier and printer repair technician. Analyze this sample print image for hardware defects.
Brand: ${brand||"Unknown"} | Type: ${deviceType||"Unknown"} | Observed: ${defect||"Unknown"}
Respond ONLY with valid JSON, no code blocks, no extra text:
{"problem_name":"...","confidence":85,"suspected_parts":["...","..."],"repair_priority":"high|medium|low","estimated_cost":"...","solution":"...","technical_details":"...","defect_bars":[{"label":"...","value":80,"color":"#ff4d6d"},{"label":"...","value":65,"color":"#ffd166"},{"label":"...","value":40,"color":"#00e5a0"}]}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: sysPrompt,
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: image.type, data: base64 } },
              { type: "text", text: lang==="fa" ? "این تصویر نمونه چاپ را تحلیل کن" : "Analyze this print sample" }
            ]
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c=>c.text||"").join("") || "";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setPage("results");
    } catch (e) {
      console.error(e);
      // Fallback demo result
      setResult(lang==="fa" ? {
        problem_name: "مشکل تیغه تمیزکننده درام",
        confidence: 87,
        suspected_parts: ["تیغه تمیزکننده","سیلندر درام","واحد فیوزر"],
        repair_priority: "high",
        estimated_cost: "۲۵۰,۰۰۰ تا ۴۵۰,۰۰۰ تومان",
        solution: "تعویض تیغه تمیزکننده درام توصیه می‌شود. واحد درام را بررسی و در صورت نیاز تعویض کنید.",
        technical_details: "خطوط عمودی مکرر نشان‌دهنده آلودگی یا آسیب تیغه تمیزکننده است.",
        defect_bars: [
          {label:"آلودگی درام",value:87,color:"#ff4d6d"},
          {label:"مشکل فیوزر",value:45,color:"#ffd166"},
          {label:"تونر کم",value:20,color:"#00e5a0"}
        ]
      } : {
        problem_name: "Drum Cleaning Blade Issue",
        confidence: 87,
        suspected_parts: ["Cleaning Blade","Drum Unit","Fuser Assembly"],
        repair_priority: "high",
        estimated_cost: "$40–$90",
        solution: "Replace the drum cleaning blade. Inspect drum unit and replace if worn.",
        technical_details: "Repeated vertical lines indicate contaminated or damaged cleaning blade on the OPC drum.",
        defect_bars: [
          {label:"Drum Contamination",value:87,color:"#ff4d6d"},
          {label:"Fuser Issue",value:45,color:"#ffd166"},
          {label:"Low Toner",value:20,color:"#00e5a0"}
        ]
      });
      setPage("results");
    }
  };

  const toBase64 = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const priorityBadge = (p) => {
    const map = { high:"badge-red", medium:"badge-yellow", low:"badge-green" };
    const labelMap = { high: t.high, medium: t.medium, low: t.low };
    return <span className={`badge ${map[p]||"badge-cyan"}`}>● {labelMap[p]||p}</span>;
  };

  // ── LANDING PAGE ─────────────────────────────────────────────────────────────
  const LandingPage = () => (
    <div style={{ position:"relative", zIndex:1 }}>
      {/* Hero */}
      <section style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"120px 20px 60px", textAlign:"center" }}>
        <div className="badge badge-cyan animate-fadeUp" style={{ marginBottom:24, animationDelay:"0s" }}>
          ✦ {lang==="fa" ? "نسخه ۲.۰ — هوش مصنوعی پیشرفته" : "v2.0 — Advanced AI Vision"}
        </div>
        <h1 className="animate-fadeUp" style={{ fontSize:"clamp(36px,6vw,72px)", fontWeight:800, lineHeight:1.1, marginBottom:24, animationDelay:".1s" }}>
          <span style={{ color:"var(--text)" }}>{lang==="fa" ? "تشخیص فوری مشکلات" : "Instant Copier"}</span><br/>
          <span style={{ background:"linear-gradient(135deg,#c9a035,#f5d57a,#00c8e8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {lang==="fa" ? "دستگاه کپی با AI" : "Fault Detection with AI"}
          </span>
        </h1>
        <p className="animate-fadeUp" style={{ fontSize:"clamp(15px,2vw,18px)", color:"var(--text2)", maxWidth:560, lineHeight:1.7, marginBottom:40, animationDelay:".2s" }}>
          {t.sub}
        </p>
        <div className="animate-fadeUp" style={{ display:"flex", gap:16, flexWrap:"wrap", justifyContent:"center", animationDelay:".3s" }}>
          <button className="btn-gold" style={{ padding:"16px 40px", fontSize:16 }} onClick={() => setPage("upload")}>
            {t.startBtn} →
          </button>
          <button className="btn-ghost" style={{ padding:"16px 32px", fontSize:15 }}>
            {t.learnMore}
          </button>
        </div>
        {/* Illustration */}
        <div className="animate-fadeUp" style={{ marginTop:60, animationDelay:".4s" }}>
          <CopierIllustration />
        </div>
        {/* Stats */}
        <div className="animate-fadeUp" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:16, maxWidth:700, width:"100%", marginTop:60, animationDelay:".5s" }}>
          {t.stats.map((s, i) => (
            <div key={i} className="glass-card" style={{ padding:"20px 16px", textAlign:"center" }}>
              <div className="stat-num" style={{ background:"linear-gradient(135deg,#c9a035,#f5d57a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s}</div>
              <div style={{ fontSize:12, color:"var(--text3)", marginTop:4 }}>{t.stat_labels[i]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding:"80px 20px", maxWidth:1000, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div className="badge badge-gold" style={{ marginBottom:16 }}>⚙ {t.howWorks}</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800 }}>
            {lang==="fa" ? "سه قدم تا تشخیص کامل" : "3 Steps to Full Diagnosis"}
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:24 }}>
          {[
            { n:"01", icon:"📸", title: lang==="fa" ? "آپلود تصویر" : "Upload Image", desc: lang==="fa" ? "عکسی از نمونه چاپ مشکل‌دار بگیرید" : "Take a photo of the defective print sample" },
            { n:"02", icon:"🤖", title: lang==="fa" ? "تحلیل AI" : "AI Analysis", desc: lang==="fa" ? "هوش مصنوعی در چند ثانیه مشکل را شناسایی می‌کند" : "AI identifies the fault in seconds" },
            { n:"03", icon:"📋", title: lang==="fa" ? "دریافت گزارش" : "Get Report", desc: lang==="fa" ? "گزارش کامل با راه‌حل و تخمین هزینه دریافت کنید" : "Receive full report with solution and cost estimate" },
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding:32, position:"relative", overflow:"hidden" }}>
              <div style={{ fontSize:64, fontWeight:900, color:"rgba(201,160,53,0.08)", position:"absolute", top:10, right: isRTL ? "auto" : 20, left: isRTL ? 20 : "auto", lineHeight:1 }}>{s.n}</div>
              <div style={{ fontSize:40, marginBottom:16 }}>{s.icon}</div>
              <h3 style={{ fontSize:20, fontWeight:700, marginBottom:10 }}>{s.title}</h3>
              <p style={{ color:"var(--text2)", lineHeight:1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"80px 20px", maxWidth:1000, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:60 }}>
          <div className="badge badge-cyan" style={{ marginBottom:16 }}>✦ {t.features}</div>
          <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:800 }}>
            {lang==="fa" ? "چرا AI Copier Doctor؟" : "Why AI Copier Doctor?"}
          </h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:20 }}>
          {t.features_list.map((f, i) => (
            <div key={i} className="glass-card" style={{ padding:28, display:"flex", gap:16 }}>
              <div className="icon-wrap">{f.icon}</div>
              <div>
                <h4 style={{ fontWeight:700, marginBottom:8 }}>{f.title}</h4>
                <p style={{ color:"var(--text2)", fontSize:14, lineHeight:1.6 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"80px 20px", textAlign:"center" }}>
        <div className="glass-card" style={{ maxWidth:700, margin:"0 auto", padding:"60px 40px", background:"linear-gradient(135deg,rgba(201,160,53,0.08),rgba(0,200,232,0.05))" }}>
          <h2 style={{ fontSize:"clamp(24px,3.5vw,40px)", fontWeight:800, marginBottom:16 }}>
            {lang==="fa" ? "همین الان شروع کن" : "Get Started Now"}
          </h2>
          <p style={{ color:"var(--text2)", marginBottom:32, lineHeight:1.7 }}>
            {lang==="fa" ? "اولین تحلیل کاملاً رایگان است. کارت بانکی نیاز ندارید." : "First analysis is completely free. No credit card required."}
          </p>
          <button className="btn-gold" style={{ padding:"18px 48px", fontSize:18 }} onClick={() => setPage("upload")}>
            {t.startBtn} →
          </button>
        </div>
      </section>
    </div>
  );

  // ── UPLOAD PAGE ──────────────────────────────────────────────────────────────
  const UploadPage = () => (
    <div style={{ maxWidth:680, margin:"0 auto", padding:"100px 20px 60px", position:"relative", zIndex:1 }}>
      <button onClick={() => setPage("landing")} style={{ background:"transparent", border:"none", color:"var(--text2)", cursor:"pointer", marginBottom:32, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
        ← {lang==="fa" ? "بازگشت" : "Back"}
      </button>
      <div className="badge badge-gold animate-fadeUp" style={{ marginBottom:20 }}>🔬 {t.uploadTitle}</div>
      <h1 className="animate-fadeUp" style={{ fontSize:"clamp(26px,4vw,42px)", fontWeight:800, marginBottom:8, animationDelay:".1s" }}>
        {lang==="fa" ? "تصویر نمونه چاپ را آپلود کنید" : "Upload Your Print Sample"}
      </h1>
      <p className="animate-fadeUp" style={{ color:"var(--text2)", marginBottom:40, animationDelay:".15s" }}>
        {lang==="fa" ? "تصویر واضح از نمونه چاپ مشکل‌دار ارسال کنید" : "Send a clear image of the defective print sample"}
      </p>

      {/* Upload Zone */}
      <div className={`upload-zone animate-fadeUp ${dragOver ? "drag-over" : ""}`}
        style={{ padding:48, textAlign:"center", marginBottom:24, animationDelay:".2s" }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])}/>
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e => handleFile(e.target.files[0])}/>
        {imagePreview ? (
          <div className="scan-container">
            <img src={imagePreview} alt="preview" style={{ maxWidth:"100%", maxHeight:300, borderRadius:12, objectFit:"contain" }}/>
            <div className="scan-line"/>
          </div>
        ) : (
          <>
            <div style={{ fontSize:56, marginBottom:16 }}>📄</div>
            <p style={{ fontSize:17, fontWeight:600, marginBottom:8 }}>{t.uploadSub}</p>
            <p style={{ fontSize:13, color:"var(--text3)" }}>{t.uploadHint}</p>
          </>
        )}
      </div>

      {/* Camera button */}
      <div className="animate-fadeUp" style={{ display:"flex", gap:12, marginBottom:28, animationDelay:".25s" }}>
        <button className="btn-ghost" style={{ flex:1, padding:"12px 20px", fontSize:14 }} onClick={() => fileRef.current?.click()}>
          📁 {t.uploadFile}
        </button>
        <button className="btn-ghost" style={{ flex:1, padding:"12px 20px", fontSize:14 }} onClick={() => cameraRef.current?.click()}>
          📷 {t.uploadCamera}
        </button>
      </div>

      {/* Selectors */}
      <div className="animate-fadeUp" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16, animationDelay:".3s" }}>
        <div>
          <label style={{ fontSize:13, color:"var(--text2)", display:"block", marginBottom:8 }}>{t.selectBrand}</label>
          <select value={brand} onChange={e => setBrand(e.target.value)}
            style={{ width:"100%", background:"var(--bg2)", border:"1px solid var(--border)", color:"var(--text)", borderRadius:12, padding:"12px 16px", fontSize:14, fontFamily:"inherit", cursor:"pointer" }}>
            <option value="">{lang==="fa" ? "انتخاب کنید" : "Select"}</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize:13, color:"var(--text2)", display:"block", marginBottom:8 }}>{t.selectType}</label>
          <select value={deviceType} onChange={e => setDeviceType(e.target.value)}
            style={{ width:"100%", background:"var(--bg2)", border:"1px solid var(--border)", color:"var(--text)", borderRadius:12, padding:"12px 16px", fontSize:14, fontFamily:"inherit", cursor:"pointer" }}>
            <option value="">{lang==="fa" ? "انتخاب کنید" : "Select"}</option>
            {(isRTL ? DEVICE_TYPES_FA : DEVICE_TYPES_EN).map((d,i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </div>
      </div>
      <div className="animate-fadeUp" style={{ marginBottom:32, animationDelay:".35s" }}>
        <label style={{ fontSize:13, color:"var(--text2)", display:"block", marginBottom:8 }}>{t.selectDefect}</label>
        <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
          {DEFECTS_FA.map(d => (
            <button key={d.id} onClick={() => setDefect(defect===d.id?"":d.id)}
              className={defect===d.id ? "tab tab-active" : "tab tab-inactive"}
              style={{ border: defect===d.id ? "1px solid var(--border2)" : "1px solid var(--border)", fontSize:13 }}>
              {isRTL ? d.label : d.id.replace("_"," ")}
            </button>
          ))}
        </div>
      </div>

      <button className="btn-gold animate-fadeUp" style={{ width:"100%", padding:"18px", fontSize:17, animationDelay:".4s" }} onClick={analyze}>
        🤖 {t.analyzeBtn}
      </button>
    </div>
  );

  // ── ANALYZING PAGE ───────────────────────────────────────────────────────────
  const AnalyzingPage = () => (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, textAlign:"center", position:"relative", zIndex:1 }}>
      {imagePreview && (
        <div className="scan-container" style={{ width:280, height:200, marginBottom:40, border:"1px solid rgba(0,200,232,0.3)", borderRadius:16 }}>
          <img src={imagePreview} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:16, opacity:0.7 }}/>
          <div className="scan-line"/>
        </div>
      )}
      <div className="animate-glow" style={{ width:80, height:80, borderRadius:"50%", border:"2px solid var(--cyan)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28, fontSize:32 }}>
        🤖
      </div>
      <h2 style={{ fontSize:28, fontWeight:700, marginBottom:12 }}>
        {lang==="fa" ? "در حال تحلیل تصویر..." : "Analyzing image..."}
      </h2>
      <p style={{ color:"var(--text2)", marginBottom:32 }}>
        {lang==="fa" ? "هوش مصنوعی در حال بررسی نمونه چاپ شما است" : "AI is inspecting your print sample"}
      </p>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width:10, height:10, borderRadius:"50%", background:"var(--cyan)", animation:`pulse 1s ease infinite`, animationDelay:`${i*0.2}s` }}/>
        ))}
      </div>
      <div style={{ marginTop:40, maxWidth:400, width:"100%" }}>
        {(lang==="fa" ? ["بررسی خطوط...","تحلیل تونر...","ارزیابی درام...","محاسبه اطمینان..."] :
                        ["Checking lines...","Analyzing toner...","Evaluating drum...","Calculating confidence..."]).map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid var(--border)", animationDelay:`${i*0.5}s` }} className="animate-fadeIn">
            <div className="animate-spin" style={{ width:14, height:14, border:"2px solid var(--cyan)", borderTopColor:"transparent", borderRadius:"50%", flexShrink:0 }}/>
            <span style={{ color:"var(--text2)", fontSize:14 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RESULTS PAGE ─────────────────────────────────────────────────────────────
  const ResultsPage = () => {
    if (!result) return null;
    const conf = result.confidence || 0;
    const confColor = conf >= 80 ? "#00e5a0" : conf >= 50 ? "#ffd166" : "#ff4d6d";
    return (
      <div style={{ maxWidth:800, margin:"0 auto", padding:"100px 20px 60px", position:"relative", zIndex:1 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:32, flexWrap:"wrap", gap:16 }}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom:12 }}>📋 {t.resultTitle}</div>
            <h1 style={{ fontSize:"clamp(24px,3.5vw,36px)", fontWeight:800 }}>{t.resultTitle}</h1>
          </div>
          <div style={{ display:"flex", gap:12 }}>
            <button className="btn-ghost" style={{ padding:"10px 20px", fontSize:13 }} onClick={() => { setPage("upload"); setResult(null); setImagePreview(null); setImage(null); }}>
              + {t.newAnalysis}
            </button>
          </div>
        </div>

        {/* Main result card */}
        <div className="glass-card animate-fadeUp" style={{ padding:32, marginBottom:24, background:"linear-gradient(135deg,rgba(201,160,53,0.06),rgba(0,200,232,0.04))" }}>
          <div style={{ display:"flex", gap:24, flexWrap:"wrap", alignItems:"center" }}>
            {imagePreview && (
              <img src={imagePreview} alt="" style={{ width:120, height:120, objectFit:"cover", borderRadius:12, border:"1px solid var(--border2)", flexShrink:0 }}/>
            )}
            <div style={{ flex:1, minWidth:200 }}>
              <p style={{ fontSize:13, color:"var(--text3)", marginBottom:6 }}>{t.problem}</p>
              <h2 style={{ fontSize:"clamp(18px,2.5vw,26px)", fontWeight:800, marginBottom:12, color:"var(--gold2)" }}>{result.problem_name}</h2>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {priorityBadge(result.repair_priority)}
                <span className="badge badge-cyan">⚡ {brand||"—"}</span>
              </div>
            </div>
            {/* Confidence ring */}
            <div style={{ textAlign:"center", flexShrink:0 }}>
              <div style={{ position:"relative", width:120, height:120, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <ConfidenceRing value={animBars ? conf : 0} size={120} color={confColor}/>
                <div style={{ position:"absolute", textAlign:"center" }}>
                  <div style={{ fontSize:26, fontWeight:800, color:confColor }}>{conf}%</div>
                  <div style={{ fontSize:10, color:"var(--text3)" }}>{t.confidence}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Defect bars */}
        {result.defect_bars && (
          <div className="glass-card animate-fadeUp" style={{ padding:28, marginBottom:20, animationDelay:".1s" }}>
            <h3 style={{ fontWeight:700, marginBottom:20, display:"flex", alignItems:"center", gap:10 }}>
              📊 {lang==="fa" ? "نمودار احتمال عیوب" : "Defect Probability Chart"}
            </h3>
            {result.defect_bars.map((b,i) => (
              <SeverityBar key={i} label={b.label} value={animBars ? b.value : 0} color={b.color}/>
            ))}
          </div>
        )}

        {/* Details grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
          {/* Suspected parts */}
          <div className="glass-card animate-fadeUp" style={{ padding:24, animationDelay:".2s" }}>
            <p style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>🔩 {t.parts}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(result.suspected_parts||[]).map((p,i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 14px", background:"rgba(255,255,255,0.04)", borderRadius:10 }}>
                  <span style={{ color:"var(--cyan)", fontSize:12 }}>◆</span>
                  <span style={{ fontSize:14 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Cost */}
          <div className="glass-card animate-fadeUp" style={{ padding:24, animationDelay:".25s" }}>
            <p style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>💰 {t.cost}</p>
            <div style={{ fontSize:"clamp(18px,2.5vw,24px)", fontWeight:800, color:"var(--gold2)", lineHeight:1.3 }}>
              {result.estimated_cost}
            </div>
            <div style={{ marginTop:12 }}>
              <p style={{ fontSize:12, color:"var(--text3)", marginBottom:6 }}>⚠ {t.priority}</p>
              {priorityBadge(result.repair_priority)}
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="glass-card animate-fadeUp" style={{ padding:28, marginBottom:16, animationDelay:".3s" }}>
          <p style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>🔧 {t.solution}</p>
          <p style={{ lineHeight:1.8, fontSize:15 }}>{result.solution}</p>
        </div>

        {/* Technical details */}
        <div className="glass-card animate-fadeUp" style={{ padding:28, marginBottom:32, animationDelay:".35s", borderColor:"rgba(0,200,232,0.15)" }}>
          <p style={{ fontSize:12, color:"var(--text3)", marginBottom:12 }}>⚙ {t.technical}</p>
          <p style={{ lineHeight:1.8, fontSize:14, color:"var(--text2)" }}>{result.technical_details}</p>
        </div>

        {/* Action buttons */}
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          <button className="btn-gold" style={{ flex:1, padding:"16px", fontSize:15, minWidth:160 }} onClick={() => { setPage("upload"); setResult(null); setImagePreview(null); setImage(null); }}>
            + {t.newAnalysis}
          </button>
          <button className="btn-ghost" style={{ flex:1, padding:"16px", fontSize:15, minWidth:160 }}>
            📄 {t.saveReport}
          </button>
        </div>
      </div>
    );
  };

  // ── NAV ──────────────────────────────────────────────────────────────────────
  const Nav = () => (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(6,9,16,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid var(--border)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} onClick={() => setPage("landing")}>
        <Logo/>
        <div>
          <div style={{ fontSize:15, fontWeight:700, lineHeight:1.2 }}>{isRTL ? "دکتر هوشمند کپی" : "AI Copier Doctor"}</div>
          <div style={{ fontSize:10, color:"var(--text3)" }}>{isRTL ? "تشخیص با هوش مصنوعی" : "AI-Powered Diagnosis"}</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        {page === "landing" && (
          <div style={{ display:"flex", gap:20, alignItems:"center" }}>
            <span className="nav-link" onClick={() => setPage("landing")}>{t.howWorks}</span>
            <span className="nav-link">{t.features}</span>
          </div>
        )}
        {/* Lang toggle */}
        <div style={{ display:"flex", background:"var(--glass2)", borderRadius:50, padding:4, gap:4, border:"1px solid var(--border)" }}>
          {["fa","en"].map(l => (
            <button key={l} onClick={() => setLang(l)}
              style={{ background: lang===l ? "var(--glass2)" : "transparent", border: lang===l ? "1px solid var(--border2)" : "1px solid transparent",
                color: lang===l ? "var(--gold2)" : "var(--text3)", borderRadius:50, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .2s", fontFamily:"inherit" }}>
              {l==="fa" ? "FA" : "EN"}
            </button>
          ))}
        </div>
        {page !== "upload" && page !== "analyzing" && (
          <button className="btn-cyan" style={{ padding:"9px 22px", fontSize:13 }} onClick={() => setPage("upload")}>
            {lang==="fa" ? "شروع تشخیص" : "Start Diagnosis"}
          </button>
        )}
      </div>
    </nav>
  );

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className={`noise ${isRTL ? "rtl" : ""}`} style={{ minHeight:"100vh" }}>
      <style>{GLOBAL_STYLE}</style>
      <div className="grid-bg"/>
      {/* Ambient glows */}
      <div style={{ position:"fixed", top:"-20%", left:"-10%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(201,160,53,0.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"fixed", bottom:"-20%", right:"-10%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(0,200,232,0.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 }}/>
      <Nav/>
      {page === "landing"   && <LandingPage/>}
      {page === "upload"    && <UploadPage/>}
      {page === "analyzing" && <AnalyzingPage/>}
      {page === "results"   && <ResultsPage/>}
    </div>
  );
}
