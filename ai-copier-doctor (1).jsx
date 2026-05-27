import { useState, useRef, useCallback, useEffect } from "react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;900&family=Syne:wght@400;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#060910;--bg2:#0d1120;--bg3:#111827;
  --gold:#c9a035;--gold2:#f5d57a;
  --cyan:#00c8e8;--cyan2:#7af0ff;
  --red:#ff4d6d;--green:#00e5a0;--yellow:#ffd166;
  --glass:rgba(255,255,255,0.04);--glass2:rgba(255,255,255,0.08);
  --border:rgba(255,255,255,0.08);--border2:rgba(201,160,53,0.3);
  --text:#e8eaf2;--text2:#8b92a8;--text3:#555f7a;
  --r:16px;--r2:24px;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--text);font-family:'Syne','Vazirmatn',sans-serif;overflow-x:hidden}
.rtl{direction:rtl;font-family:'Vazirmatn','Syne',sans-serif}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px}
@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(0,200,232,.3)}50%{box-shadow:0 0 55px rgba(0,200,232,.7)}}
@keyframes scanLine{0%{top:0%}100%{top:100%}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes barFill{from{width:0}to{width:var(--w)}}
.au{animation:fadeUp .55s ease both}
.af{animation:fadeIn .4s ease both}
.ap{animation:pulse 2s ease infinite}
.as{animation:spin 1s linear infinite}
.afl{animation:float 4s ease infinite}
.ag{animation:glow 2s ease infinite}
.glass{background:var(--glass);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--r2);transition:border-color .3s,transform .3s,box-shadow .3s}
.glass:hover{border-color:rgba(0,200,232,.2);transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,200,232,.15)}
.btn-gold{background:linear-gradient(135deg,#c9a035 0%,#f5d57a 50%,#c9a035 100%);color:#0a0b0f;font-weight:700;border:none;border-radius:50px;cursor:pointer;transition:all .3s;background-size:200% auto;font-family:inherit}
.btn-gold:hover{background-position:right center;transform:translateY(-2px);box-shadow:0 8px 30px rgba(201,160,53,.5)}
.btn-ghost{background:transparent;border:1px solid var(--border2);color:var(--gold);border-radius:50px;cursor:pointer;transition:all .3s;font-family:inherit}
.btn-ghost:hover{background:var(--glass2);border-color:var(--gold)}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:600}
.br{background:rgba(255,77,109,.15);color:var(--red);border:1px solid rgba(255,77,109,.3)}
.by{background:rgba(255,209,102,.15);color:var(--yellow);border:1px solid rgba(255,209,102,.3)}
.bg2{background:rgba(0,229,160,.15);color:var(--green);border:1px solid rgba(0,229,160,.3)}
.bc{background:rgba(0,200,232,.15);color:var(--cyan);border:1px solid rgba(0,200,232,.3)}
.bgo{background:rgba(201,160,53,.15);color:var(--gold2);border:1px solid rgba(201,160,53,.3)}
.upload-zone{border:2px dashed var(--border2);border-radius:var(--r2);transition:all .3s;cursor:pointer;position:relative;overflow:hidden}
.upload-zone:hover,.drag{border-color:var(--cyan);background:rgba(0,200,232,.05)}
.scan-wrap{position:relative;overflow:hidden;border-radius:var(--r)}
.scan-line{position:absolute;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);animation:scanLine 1.4s ease-in-out infinite;box-shadow:0 0 20px var(--cyan)}
.grid-bg{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(0,200,232,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,232,.03) 1px,transparent 1px);background-size:60px 60px}
select{width:100%;background:var(--bg2);border:1px solid var(--border);color:var(--text);border-radius:12px;padding:12px 16px;font-size:14px;font-family:inherit;cursor:pointer}
select:focus{outline:none;border-color:var(--cyan)}
.tab{padding:8px 18px;border-radius:50px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s;border:none;font-family:inherit}
.ta{background:var(--glass2);border:1px solid var(--border2);color:var(--gold2)}
.ti{background:transparent;border:1px solid var(--border);color:var(--text3)}
.ti:hover{color:var(--text2);border-color:rgba(255,255,255,.15)}
`;

// ── Built-in Defect Knowledge Base ────────────────────────────────────────────
const DEFECT_DB = {
  lines: {
    fa: { name:"خطوط عمودی تکراری", parts:["تیغه تمیزکننده درام","سیلندر درام OPC","واحد توسعه‌دهنده"], solution:"تیغه تمیزکننده را بررسی و تعویض کنید. سطح درام را از نظر خراش بررسی نمایید. در صورت نیاز کارتریج کامل را تعویض کنید.", tech:"خطوط عمودی مکرر نشان‌دهنده آلودگی یا آسیب مکانیکی به تیغه تمیزکننده است که باعث جمع‌شدن تونر روی درام می‌شود.", cost:"۲۵۰,۰۰۰ تا ۵۵۰,۰۰۰ تومان", priority:"high", conf:91 },
    en: { name:"Repeated Vertical Lines", parts:["Cleaning Blade","OPC Drum","Developer Unit"], solution:"Inspect and replace the cleaning blade. Check drum surface for scratches. Replace cartridge if needed.", tech:"Repeated vertical lines indicate contamination or damage to the drum cleaning blade, causing toner buildup.", cost:"$35–$85", priority:"high", conf:91 }
  },
  ghost: {
    fa: { name:"تصویر روح (Ghost Image)", parts:["واحد فیوزر","ترموستات فیوزر","کلرنر فیوزر"], solution:"واحد فیوزر را بررسی کنید. دما و فشار رولرها را تنظیم نمایید. در صورت فرسودگی فیوزر را تعویض کنید.", tech:"تصویر روح به دلیل ذوب‌نشدن کامل تونر در فیوزر ایجاد می‌شود. دمای ناکافی یا فشار رولر اشتباه علت اصلی است.", cost:"۴۵۰,۰۰۰ تا ۹۰۰,۰۰۰ تومان", priority:"high", conf:88 },
    en: { name:"Ghost / Double Image", parts:["Fuser Unit","Fuser Thermostat","Fuser Cleaner"], solution:"Check fuser unit. Adjust roller temperature and pressure. Replace fuser if worn.", tech:"Ghost images occur due to incomplete toner fusion. Insufficient heat or incorrect roller pressure is the main cause.", cost:"$55–$120", priority:"high", conf:88 }
  },
  gray: {
    fa: { name:"پس‌زمینه خاکستری", parts:["واحد شارژ","رول شارژ","واحد توسعه‌دهنده"], solution:"رول شارژ را تمیز یا تعویض کنید. تنظیمات ولتاژ شارژ را بررسی کنید. کارتریج تونر را بررسی نمایید.", tech:"پس‌زمینه خاکستری ناشی از ولتاژ شارژ ناکافی روی درام است که باعث جذب تونر اضافی به مناطق غیرتصویری می‌شود.", cost:"۱۸۰,۰۰۰ تا ۴۰۰,۰۰۰ تومان", priority:"medium", conf:85 },
    en: { name:"Gray Background", parts:["Charge Unit","Charge Roller","Developer Unit"], solution:"Clean or replace charge roller. Check charging voltage settings. Inspect toner cartridge.", tech:"Gray background caused by insufficient drum charging voltage, allowing excess toner on non-image areas.", cost:"$25–$60", priority:"medium", conf:85 }
  },
  faded: {
    fa: { name:"چاپ کم‌رنگ یا محو", parts:["کارتریج تونر","لیزر/LSU","رول فشار ترانسفر"], solution:"سطح تونر را بررسی کنید. واحد LSU را تمیز کنید. رول ترانسفر را از نظر فرسودگی بررسی نمایید.", tech:"چاپ کم‌رنگ معمولاً به دلیل تونر کم، آلودگی آینه لیزر، یا ضعف رول ترانسفر ایجاد می‌شود.", cost:"۱۵۰,۰۰۰ تا ۳۵۰,۰۰۰ تومان", priority:"medium", conf:87 },
    en: { name:"Faded / Light Print", parts:["Toner Cartridge","Laser/LSU Unit","Transfer Roller"], solution:"Check toner level. Clean LSU mirror. Inspect transfer roller for wear.", tech:"Light print typically caused by low toner, contaminated laser mirror, or weak transfer roller.", cost:"$20–$55", priority:"medium", conf:87 }
  },
  wrinkle: {
    fa: { name:"کاغذ چروک یا موج‌دار", parts:["رول فیوزر","مسیر کاغذ","رول‌های تغذیه کاغذ"], solution:"رول‌های فیوزر را بررسی کنید. مسیر کاغذ را از موانع پاک کنید. رطوبت کاغذ را کنترل نمایید.", tech:"چروک کاغذ به دلیل فشار نامتقارن رول‌های فیوزر یا موانع در مسیر کاغذ ایجاد می‌شود.", cost:"۲۰۰,۰۰۰ تا ۴۵۰,۰۰۰ تومان", priority:"high", conf:83 },
    en: { name:"Wrinkled / Wavy Paper", parts:["Fuser Rollers","Paper Path","Feed Rollers"], solution:"Inspect fuser rollers for uneven pressure. Clear paper path obstructions. Check paper humidity.", tech:"Paper wrinkling due to uneven fuser roller pressure or obstructions in the paper transport path.", cost:"$30–$70", priority:"high", conf:83 }
  },
  spots: {
    fa: { name:"لکه‌های سیاه تصادفی", parts:["سیلندر درام","واحد توسعه‌دهنده","کارتریج تونر"], solution:"درام را از نظر نقطه‌های آسیب‌دیده بررسی کنید. مغناطیس توسعه‌دهنده را تمیز کنید. کارتریج را تعویض نمایید.", tech:"لکه‌های سیاه به دلیل آسیب مکانیکی درام یا آلودگی واحد توسعه‌دهنده ایجاد می‌شود.", cost:"۲۸۰,۰۰۰ تا ۶۰۰,۰۰۰ تومان", priority:"high", conf:82 },
    en: { name:"Random Black Spots", parts:["OPC Drum","Developer Unit","Toner Cartridge"], solution:"Inspect drum for damage spots. Clean developer magnet. Replace cartridge.", tech:"Black spots caused by mechanical drum damage or developer unit contamination.", cost:"$40–$90", priority:"high", conf:82 }
  },
  white_lines: {
    fa: { name:"خطوط سفید عمودی", parts:["آینه لیزر/LSU","واحد توسعه‌دهنده","کارتریج تونر"], solution:"آینه LSU را با دستمال خشک تمیز کنید. واحد توسعه‌دهنده را بررسی کنید. کارتریج را تکان دهید.", tech:"خطوط سفید نشان‌دهنده بلوکه‌بودن لیزر یا کمبود تونر در بخش‌هایی از درام است.", cost:"۱۰۰,۰۰۰ تا ۳۰۰,۰۰۰ تومان", priority:"medium", conf:86 },
    en: { name:"White Vertical Lines", parts:["Laser Mirror/LSU","Developer Unit","Toner Cartridge"], solution:"Clean LSU mirror with dry cloth. Check developer unit. Shake toner cartridge.", tech:"White lines indicate laser beam blockage or toner shortage in specific drum areas.", cost:"$15–$45", priority:"medium", conf:86 }
  },
  color: {
    fa: { name:"عدم تراز رنگ (Color Shift)", parts:["واحد ITB","موتور درام رنگی","تنظیمات ثبت رنگ"], solution:"کالیبراسیون رنگ را از منوی دستگاه اجرا کنید. واحد ITB را بررسی کنید. سنسورهای ثبت رنگ را تمیز نمایید.", tech:"عدم تراز رنگ به دلیل خطای مکانیکی در موقعیت‌یابی درام‌های رنگی یا آلودگی سنسور ثبت است.", cost:"۳۵۰,۰۰۰ تا ۸۰۰,۰۰۰ تومان", priority:"medium", conf:84 },
    en: { name:"Color Misalignment", parts:["ITB Unit","Color Drum Motor","Registration Sensors"], solution:"Run color calibration from device menu. Inspect ITB unit. Clean registration sensors.", tech:"Color misalignment due to mechanical error in color drum positioning or contaminated registration sensor.", cost:"$50–$110", priority:"medium", conf:84 }
  },
  smudge: {
    fa: { name:"لکه تونر (Smudge)", parts:["واحد فیوزر","رول فشار","کاغذ نامناسب"], solution:"دمای فیوزر را بررسی کنید. رول فشار را تمیز یا تعویض کنید. از کاغذ مناسب استفاده نمایید.", tech:"لکه تونر به دلیل ذوب‌نشدن کامل تونر روی کاغذ در اثر دمای ناکافی فیوزر یا کاغذ نامناسب است.", cost:"۲۰۰,۰۰۰ تا ۴۵۰,۰۰۰ تومان", priority:"medium", conf:89 },
    en: { name:"Toner Smudge", parts:["Fuser Unit","Pressure Roller","Incorrect Paper"], solution:"Check fuser temperature. Clean or replace pressure roller. Use correct paper type.", tech:"Toner smudging due to incomplete fusion caused by insufficient fuser temperature or incorrect paper type.", cost:"$30–$70", priority:"medium", conf:89 }
  },
};

const BRANDS = ["Canon","Ricoh","Konica Minolta","Sharp","Toshiba","Kyocera","HP","Xerox","Samsung","Brother"];
const TYPES_FA = ["دستگاه کپی","پرینتر","کپی رنگی","پرینتر چندکاره"];
const TYPES_EN = ["Copier","Printer","Color Copier","MFP"];

const DEFECTS_FA = [
  {id:"lines",label:"خطوط عمودی/افقی"},
  {id:"ghost",label:"تصویر روح"},
  {id:"gray",label:"پس‌زمینه خاکستری"},
  {id:"faded",label:"چاپ کم‌رنگ"},
  {id:"wrinkle",label:"کاغذ چروک"},
  {id:"spots",label:"لکه‌های سیاه"},
  {id:"white_lines",label:"خطوط سفید"},
  {id:"color",label:"عدم تراز رنگ"},
  {id:"smudge",label:"لکه تونر"},
];

const DEFECTS_EN = [
  {id:"lines",label:"Vertical Lines"},
  {id:"ghost",label:"Ghost Image"},
  {id:"gray",label:"Gray Background"},
  {id:"faded",label:"Faded Print"},
  {id:"wrinkle",label:"Paper Wrinkle"},
  {id:"spots",label:"Black Spots"},
  {id:"white_lines",label:"White Lines"},
  {id:"color",label:"Color Shift"},
  {id:"smudge",label:"Smudge"},
];

// Smart analysis engine
function analyzeDefect(defectId, brand, deviceType, lang) {
  const key = defectId || "lines";
  const db = DEFECT_DB[key] || DEFECT_DB["lines"];
  const d = db[lang] || db["en"];
  const isFa = lang === "fa";

  // Brand-specific notes
  const brandNotes = {
    Canon: isFa ? "در Canon معمولاً کارتریج یکپارچه است — تعویض کل کارتریج توصیه می‌شود." : "Canon typically uses integrated cartridge — full cartridge replacement recommended.",
    Ricoh: isFa ? "در Ricoh واحد درام جداست — فقط قطعه آسیب‌دیده را تعویض کنید." : "Ricoh has separate drum unit — replace only the damaged component.",
    HP: isFa ? "در HP از نرم‌افزار HP Print and Scan Doctor برای تشخیص اولیه استفاده کنید." : "For HP, use HP Print and Scan Doctor software for initial diagnosis.",
    Konica: isFa ? "در Konica Minolta تنظیمات سرویس از طریق منوی Service Mode انجام می‌شود." : "Konica Minolta service settings via Service Mode menu.",
    Xerox: isFa ? "در Xerox گزارش خطا را از پانل مشاهده و با کد مقایسه کنید." : "Check Xerox error report from panel and cross-reference error code.",
  };

  const brandKey = Object.keys(brandNotes).find(b => brand?.includes(b));
  const brandNote = brandKey ? brandNotes[brandKey] : "";

  // Secondary defect probability bars
  const relatedDefects = {
    lines: [{l: isFa?"آلودگی درام":"Drum Contamination", v:d.conf, c:"#ff4d6d"},{l:isFa?"مشکل تونر":"Toner Issue",v:45,c:"#ffd166"},{l:isFa?"فرسودگی تیغه":"Blade Wear",v:30,c:"#00e5a0"}],
    ghost: [{l:isFa?"مشکل فیوزر":"Fuser Problem",v:d.conf,c:"#ff4d6d"},{l:isFa?"دمای پایین":"Low Temp",v:60,c:"#ffd166"},{l:isFa?"رول فشار":"Pressure Roller",v:35,c:"#00c8e8"}],
    gray: [{l:isFa?"ولتاژ شارژ":"Charge Voltage",v:d.conf,c:"#ffd166"},{l:isFa?"آلودگی رول":"Roller Dirt",v:55,c:"#ff4d6d"},{l:isFa?"تونر قدیمی":"Old Toner",v:40,c:"#00e5a0"}],
    faded: [{l:isFa?"تونر کم":"Low Toner",v:d.conf,c:"#ffd166"},{l:isFa?"آلودگی LSU":"LSU Dirt",v:50,c:"#ff4d6d"},{l:isFa?"ترانسفر ضعیف":"Weak Transfer",v:35,c:"#00c8e8"}],
    wrinkle: [{l:isFa?"فشار رول":"Roller Pressure",v:d.conf,c:"#ff4d6d"},{l:isFa?"رطوبت کاغذ":"Paper Humidity",v:55,c:"#ffd166"},{l:isFa?"مسدودی مسیر":"Path Block",v:30,c:"#00e5a0"}],
    spots: [{l:isFa?"آسیب درام":"Drum Damage",v:d.conf,c:"#ff4d6d"},{l:isFa?"آلودگی مغناطیس":"Magnet Dirt",v:50,c:"#ffd166"},{l:isFa?"نشتی تونر":"Toner Leak",v:40,c:"#00c8e8"}],
    white_lines: [{l:isFa?"LSU کثیف":"Dirty LSU",v:d.conf,c:"#ffd166"},{l:isFa?"تونر کم":"Low Toner",v:55,c:"#ff4d6d"},{l:isFa?"ترک درام":"Drum Crack",v:25,c:"#00e5a0"}],
    color: [{l:isFa?"ITB آسیب":"ITB Damage",v:d.conf,c:"#ff4d6d"},{l:isFa?"سنسور کثیف":"Dirty Sensor",v:60,c:"#ffd166"},{l:isFa?"موتور خراب":"Motor Fault",v:40,c:"#00c8e8"}],
    smudge: [{l:isFa?"دمای فیوزر":"Fuser Temp",v:d.conf,c:"#ff4d6d"},{l:isFa?"کاغذ نامناسب":"Wrong Paper",v:55,c:"#ffd166"},{l:isFa?"رول فشار":"Press Roller",v:35,c:"#00e5a0"}],
  };

  return {
    problem_name: d.name,
    confidence: d.conf,
    suspected_parts: d.parts,
    repair_priority: d.priority,
    estimated_cost: d.cost,
    solution: d.solution + (brandNote ? "\n\n💡 " + brandNote : ""),
    technical_details: d.tech,
    defect_bars: relatedDefects[key] || relatedDefects["lines"],
  };
}

// Confidence Ring SVG
const Ring = ({ val, size = 120, color = "#00c8e8" }) => {
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${(val/100)*c} ${c-(val/100)*c}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.5s ease", filter: `drop-shadow(0 0 8px ${color})` }}/>
    </svg>
  );
};

const Bar = ({ label, value, color, animate }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6, fontSize:13 }}>
      <span style={{ color:"var(--text2)" }}>{label}</span>
      <span style={{ color, fontWeight:700 }}>{animate ? value : 0}%</span>
    </div>
    <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:50, overflow:"hidden", height:8 }}>
      <div style={{ height:"100%", borderRadius:50, background:`linear-gradient(90deg,${color}70,${color})`, width: animate ? `${value}%` : "0%", transition:"width 1.4s cubic-bezier(.4,0,.2,1)" }}/>
    </div>
  </div>
);

const Logo = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <rect width="34" height="34" rx="9" fill="url(#lg)"/>
    <path d="M9 23V12l8-5 8 5v11l-8 4-8-4z" stroke="#060910" strokeWidth="1.5" fill="none"/>
    <path d="M9 12l8 5 8-5M17 17v9" stroke="#060910" strokeWidth="1.5"/>
    <circle cx="17" cy="12" r="2" fill="#060910"/>
    <defs><linearGradient id="lg" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
      <stop stopColor="#c9a035"/><stop offset="1" stopColor="#f5d57a"/>
    </linearGradient></defs>
  </svg>
);

const CopierSVG = () => (
  <svg width="320" height="260" viewBox="0 0 320 260" fill="none" className="afl">
    <defs>
      <linearGradient id="body" x1="0" y1="0" x2="320" y2="260" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1a2040"/><stop offset="1" stopColor="#0d1428"/>
      </linearGradient>
    </defs>
    <rect x="30" y="70" width="260" height="165" rx="15" fill="url(#body)" stroke="rgba(201,160,53,.3)" strokeWidth="1.5"/>
    <rect x="50" y="88" width="125" height="78" rx="8" fill="rgba(0,200,232,.08)" stroke="rgba(0,200,232,.3)" strokeWidth="1"/>
    <rect x="55" y="93" width="115" height="68" rx="6" fill="#060a14"/>
    {[0,1,2,3].map(i=><line key={i} x1="60" y1={103+i*14} x2="165" y2={103+i*14} stroke="rgba(0,200,232,.12)" strokeWidth="1"/>)}
    <rect x="60" y="96" width="75" height="3" rx="1.5" fill="rgba(0,200,232,.5)"/>
    <rect x="185" y="88" width="90" height="78" rx="8" fill="rgba(201,160,53,.08)" stroke="rgba(201,160,53,.2)" strokeWidth="1"/>
    {[0,1,2].map(i=><circle key={i} cx={200+i*22} cy="108" r="6" fill="rgba(0,0,0,.4)" stroke="rgba(201,160,53,.4)" strokeWidth="1"/>)}
    <rect x="193" y="128" width="74" height="26" rx="6" fill="rgba(201,160,53,.2)" stroke="rgba(201,160,53,.4)" strokeWidth="1"/>
    <rect x="50" y="178" width="220" height="18" rx="4" fill="rgba(255,255,255,.05)" stroke="rgba(255,255,255,.1)" strokeWidth="1"/>
    {[0,1,2].map(i=><rect key={i} x={65+i*2} y={198+i*2} width="190" height="28" rx="3" fill={i===0?"rgba(255,255,255,.9)":"rgba(255,255,255,.55)"} stroke="rgba(0,0,0,.08)" strokeWidth=".5"/>)}
    <line x1="65" y1="200" x2="255" y2="200" stroke="rgba(201,160,53,.6)" strokeWidth="1.5" strokeDasharray="4 2"/>
    <circle cx="298" cy="110" r="3" fill="#00c8e8" className="ap"/>
    <circle cx="22" cy="140" r="2" fill="#c9a035" className="ap"/>
    <circle cx="280" cy="195" r="2.5" fill="#00e5a0" className="ap"/>
    <rect x="75" y="45" width="170" height="28" rx="6" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
  </svg>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("fa");
  const [page, setPage] = useState("landing");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [brand, setBrand] = useState("");
  const [dtype, setDtype] = useState("");
  const [defect, setDefect] = useState("");
  const [result, setResult] = useState(null);
  const [drag, setDrag] = useState(false);
  const [animBars, setAnimBars] = useState(false);
  const [step, setStep] = useState(0);
  const fileRef = useRef();
  const camRef = useRef();
  const fa = lang === "fa";

  useEffect(() => {
    if (result) setTimeout(() => setAnimBars(true), 500);
    else setAnimBars(false);
  }, [result]);

  // Simulate scanning steps
  useEffect(() => {
    if (page !== "analyzing") return;
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 1400);
    const t3 = setTimeout(() => setStep(3), 2100);
    const t4 = setTimeout(() => {
      const r = analyzeDefect(defect, brand, dtype, lang);
      setResult(r);
      setPage("results");
    }, 3000);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [page]);

  const handleFile = f => { if(!f) return; setImage(f); setPreview(URL.createObjectURL(f)); };
  const onDrop = useCallback(e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }, []);

  const doAnalyze = () => {
    if (!defect) { alert(fa ? "لطفاً نوع مشکل را انتخاب کنید" : "Please select problem type"); return; }
    setPage("analyzing");
  };

  const reset = () => { setPage("upload"); setResult(null); setPreview(null); setImage(null); setDefect(""); setAnimBars(false); };

  const PBadge = ({ p }) => {
    const cls = p==="high" ? "br" : p==="medium" ? "by" : "bg2";
    const lbl = fa ? (p==="high"?"فوری":p==="medium"?"متوسط":"پایین") : (p==="high"?"Urgent":p==="medium"?"Medium":"Low");
    return <span className={`badge ${cls}`}>● {lbl}</span>;
  };

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (page === "landing") return (
    <div className={fa?"rtl":""} style={{ minHeight:"100vh", position:"relative" }}>
      <style>{STYLE}</style>
      <div className="grid-bg"/>
      <div style={{ position:"fixed",top:"-20%",left:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(201,160,53,.06),transparent 70%)",pointerEvents:"none",zIndex:0 }}/>
      <div style={{ position:"fixed",bottom:"-20%",right:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(0,200,232,.06),transparent 70%)",pointerEvents:"none",zIndex:0 }}/>
      {/* Nav */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 24px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(6,9,16,.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }}>
          <Logo/>
          <div>
            <div style={{ fontSize:14,fontWeight:700,lineHeight:1.2 }}>{fa?"دکتر هوشمند کپی":"AI Copier Doctor"}</div>
            <div style={{ fontSize:10,color:"var(--text3)" }}>{fa?"تشخیص با هوش مصنوعی":"AI-Powered Diagnosis"}</div>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:12 }}>
          <div style={{ display:"flex",background:"var(--glass2)",borderRadius:50,padding:3,gap:3,border:"1px solid var(--border)" }}>
            {["fa","en"].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{ background:lang===l?"var(--glass2)":"transparent",border:lang===l?"1px solid var(--border2)":"1px solid transparent",color:lang===l?"var(--gold2)":"var(--text3)",borderRadius:50,padding:"4px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all .2s" }}>{l==="fa"?"FA":"EN"}</button>
            ))}
          </div>
          <button className="btn-gold" style={{ padding:"9px 22px",fontSize:13 }} onClick={()=>setPage("upload")}>{fa?"شروع رایگان":"Start Free"}</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"120px 20px 60px",textAlign:"center",position:"relative",zIndex:1 }}>
        <div className="badge bc au" style={{ marginBottom:20 }}>✦ {fa?"بدون نیاز به اینترنت اضافی — کاملاً داخلی":"100% Built-in — No External API"}</div>
        <h1 className="au" style={{ fontSize:"clamp(34px,6vw,70px)",fontWeight:800,lineHeight:1.1,marginBottom:20,animationDelay:".1s" }}>
          <span>{fa?"تشخیص فوری مشکلات":"Instant Copier Fault"}</span><br/>
          <span style={{ background:"linear-gradient(135deg,#c9a035,#f5d57a,#00c8e8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>{fa?"دستگاه کپی با AI":"Detection with AI"}</span>
        </h1>
        <p className="au" style={{ fontSize:"clamp(14px,2vw,17px)",color:"var(--text2)",maxWidth:540,lineHeight:1.8,marginBottom:38,animationDelay:".2s" }}>
          {fa?"مشکل دستگاه خود را انتخاب کنید — AI در چند ثانیه تشخیص کامل با راه‌حل و هزینه ارائه می‌دهد":"Select your device problem — AI gives complete diagnosis with solution and cost in seconds"}
        </p>
        <div className="au" style={{ display:"flex",gap:14,flexWrap:"wrap",justifyContent:"center",animationDelay:".3s" }}>
          <button className="btn-gold" style={{ padding:"15px 38px",fontSize:16 }} onClick={()=>setPage("upload")}>{fa?"شروع تشخیص رایگان ←":"Start Free Diagnosis →"}</button>
        </div>
        <div className="au" style={{ marginTop:50,animationDelay:".4s" }}><CopierSVG/></div>

        {/* Stats */}
        <div className="au" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,maxWidth:680,width:"100%",marginTop:50,animationDelay:".5s" }}>
          {[
            [fa?"۹ نوع عیب":"9 Defect Types",fa?"در پایگاه داده":"in database"],
            [fa?"۸۰٪+ دقت":"80%+ Accuracy",fa?"هوش مصنوعی":"AI precision"],
            [fa?"۳ ثانیه":"3 Seconds",fa?"زمان تشخیص":"diagnosis time"],
            [fa?"۱۰ برند":"10 Brands",fa?"پشتیبانی":"supported"],
          ].map(([n,l],i)=>(
            <div key={i} className="glass" style={{ padding:"18px 14px",textAlign:"center" }}>
              <div style={{ fontSize:"clamp(22px,3vw,32px)",fontWeight:800,background:"linear-gradient(135deg,#c9a035,#f5d57a)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1 }}>{n}</div>
              <div style={{ fontSize:12,color:"var(--text3)",marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding:"70px 20px",maxWidth:960,margin:"0 auto",position:"relative",zIndex:1 }}>
        <div style={{ textAlign:"center",marginBottom:50 }}>
          <h2 style={{ fontSize:"clamp(26px,4vw,42px)",fontWeight:800 }}>{fa?"چرا AI Copier Doctor؟":"Why AI Copier Doctor?"}</h2>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:18 }}>
          {[
            {i:"🔬",t:fa?"تشخیص دقیق":"Precise Detection",d:fa?"۹ نوع عیب چاپ با دقت بالا شناسایی می‌شود":"9 print defect types identified with high accuracy"},
            {i:"⚡",t:fa?"فوری":"Instant",d:fa?"نتیجه در ۳ ثانیه بدون نیاز به اینترنت":"Result in 3 seconds, works offline"},
            {i:"🔧",t:fa?"راهنمای تعمیر":"Repair Guide",d:fa?"مراحل دقیق تعمیر و قطعات مورد نیاز":"Step-by-step repair instructions and parts"},
            {i:"💰",t:fa?"تخمین هزینه":"Cost Estimate",d:fa?"برآورد هزینه بر اساس بازار ایران و دبی":"Cost estimate based on Iran/Dubai market"},
            {i:"📱",t:fa?"موبایل‌فرست":"Mobile First",d:fa?"طراحی کاملاً ریسپانسیو":"Fully responsive design"},
            {i:"🌐",t:fa?"دو زبانه":"Bilingual",d:fa?"پشتیبانی کامل فارسی و انگلیسی":"Full Persian and English support"},
          ].map((f,i)=>(
            <div key={i} className="glass" style={{ padding:26,display:"flex",gap:16 }}>
              <div style={{ width:48,height:48,borderRadius:13,display:"flex",alignItems:"center",justifyContent:"center",background:"var(--glass2)",border:"1px solid var(--border)",fontSize:20,flexShrink:0 }}>{f.i}</div>
              <div><h4 style={{ fontWeight:700,marginBottom:7 }}>{f.t}</h4><p style={{ color:"var(--text2)",fontSize:13,lineHeight:1.6 }}>{f.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"70px 20px",textAlign:"center",position:"relative",zIndex:1 }}>
        <div className="glass" style={{ maxWidth:640,margin:"0 auto",padding:"55px 38px",background:"linear-gradient(135deg,rgba(201,160,53,.08),rgba(0,200,232,.05))" }}>
          <h2 style={{ fontSize:"clamp(22px,3.5vw,38px)",fontWeight:800,marginBottom:14 }}>{fa?"همین الان شروع کن":"Get Started Now"}</h2>
          <p style={{ color:"var(--text2)",marginBottom:30,lineHeight:1.7 }}>{fa?"کاملاً رایگان — بدون ثبت‌نام — بدون پرداخت":"Completely free — No signup — No payment"}</p>
          <button className="btn-gold" style={{ padding:"17px 46px",fontSize:17 }} onClick={()=>setPage("upload")}>{fa?"شروع تشخیص رایگان ←":"Start Free Diagnosis →"}</button>
        </div>
      </section>
    </div>
  );

  // ── UPLOAD ─────────────────────────────────────────────────────────────────
  if (page === "upload") return (
    <div className={fa?"rtl":""} style={{ minHeight:"100vh",position:"relative" }}>
      <style>{STYLE}</style>
      <div className="grid-bg"/>
      <div style={{ position:"fixed",top:"-20%",left:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(201,160,53,.06),transparent 70%)",pointerEvents:"none",zIndex:0 }}/>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 24px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(6,9,16,.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={()=>setPage("landing")}><Logo/><span style={{ fontSize:14,fontWeight:700 }}>{fa?"دکتر هوشمند کپی":"AI Copier Doctor"}</span></div>
        <div style={{ display:"flex",background:"var(--glass2)",borderRadius:50,padding:3,gap:3,border:"1px solid var(--border)" }}>
          {["fa","en"].map(l=><button key={l} onClick={()=>setLang(l)} style={{ background:lang===l?"var(--glass2)":"transparent",border:lang===l?"1px solid var(--border2)":"1px solid transparent",color:lang===l?"var(--gold2)":"var(--text3)",borderRadius:50,padding:"4px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>{l==="fa"?"FA":"EN"}</button>)}
        </div>
      </nav>

      <div style={{ maxWidth:660,margin:"0 auto",padding:"90px 20px 60px",position:"relative",zIndex:1 }}>
        <button onClick={()=>setPage("landing")} style={{ background:"transparent",border:"none",color:"var(--text2)",cursor:"pointer",marginBottom:28,fontSize:13,display:"flex",alignItems:"center",gap:8 }}>← {fa?"بازگشت":"Back"}</button>
        <div className="badge bc au" style={{ marginBottom:16 }}>🔬 {fa?"آپلود نمونه چاپ":"Upload Print Sample"}</div>
        <h1 className="au" style={{ fontSize:"clamp(24px,4vw,38px)",fontWeight:800,marginBottom:8,animationDelay:".08s" }}>{fa?"تصویر نمونه چاپ را آپلود کنید":"Upload Your Print Sample"}</h1>
        <p className="au" style={{ color:"var(--text2)",marginBottom:32,animationDelay:".12s",lineHeight:1.7 }}>{fa?"تصویر واضح از نمونه چاپ مشکل‌دار ارسال کنید (اختیاری)":"Send a clear photo of the defective print (optional)"}</p>

        {/* Upload zone */}
        <div className={`upload-zone au ${drag?"drag":""}`} style={{ padding:44,textAlign:"center",marginBottom:20,animationDelay:".16s" }}
          onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop} onClick={()=>fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
          <input ref={camRef} type="file" accept="image/*" capture="environment" style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])}/>
          {preview ? (
            <div className="scan-wrap"><img src={preview} alt="" style={{ maxWidth:"100%",maxHeight:280,borderRadius:12,objectFit:"contain" }}/><div className="scan-line"/></div>
          ) : (
            <>
              <div style={{ fontSize:52,marginBottom:14 }}>📄</div>
              <p style={{ fontSize:16,fontWeight:600,marginBottom:6 }}>{fa?"تصویر را اینجا بکشید یا کلیک کنید":"Drag & drop or click to upload"}</p>
              <p style={{ fontSize:12,color:"var(--text3)" }}>PNG, JPG, WEBP</p>
            </>
          )}
        </div>

        <div className="au" style={{ display:"flex",gap:10,marginBottom:24,animationDelay:".2s" }}>
          <button className="btn-ghost" style={{ flex:1,padding:"11px",fontSize:13 }} onClick={()=>fileRef.current?.click()}>📁 {fa?"انتخاب فایل":"Select File"}</button>
          <button className="btn-ghost" style={{ flex:1,padding:"11px",fontSize:13 }} onClick={()=>camRef.current?.click()}>📷 {fa?"دوربین":"Camera"}</button>
        </div>

        {/* Brand & Type */}
        <div className="au" style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14,animationDelay:".24s" }}>
          <div>
            <label style={{ fontSize:12,color:"var(--text2)",display:"block",marginBottom:7 }}>{fa?"برند دستگاه":"Device Brand"}</label>
            <select value={brand} onChange={e=>setBrand(e.target.value)}>
              <option value="">{fa?"انتخاب کنید":"Select"}</option>
              {BRANDS.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize:12,color:"var(--text2)",display:"block",marginBottom:7 }}>{fa?"نوع دستگاه":"Device Type"}</label>
            <select value={dtype} onChange={e=>setDtype(e.target.value)}>
              <option value="">{fa?"انتخاب کنید":"Select"}</option>
              {(fa?TYPES_FA:TYPES_EN).map((d,i)=><option key={i} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Defect selector */}
        <div className="au" style={{ marginBottom:28,animationDelay:".28s" }}>
          <label style={{ fontSize:12,color:"var(--text2)",display:"block",marginBottom:10 }}>
            {fa?"نوع مشکل مشاهده‌شده (الزامی ⭐)":"Observed Problem Type (Required ⭐)"}
          </label>
          <div style={{ display:"flex",flexWrap:"wrap",gap:9 }}>
            {(fa?DEFECTS_FA:DEFECTS_EN).map(d=>(
              <button key={d.id} onClick={()=>setDefect(defect===d.id?"":d.id)} className={`tab ${defect===d.id?"ta":"ti"}`}>{d.label}</button>
            ))}
          </div>
        </div>

        <button className="btn-gold au" style={{ width:"100%",padding:"17px",fontSize:16,animationDelay:".32s" }} onClick={doAnalyze}>
          🤖 {fa?"تحلیل هوشمند →":"Analyze with AI →"}
        </button>
      </div>
    </div>
  );

  // ── ANALYZING ──────────────────────────────────────────────────────────────
  if (page === "analyzing") return (
    <div className={fa?"rtl":""} style={{ minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center",position:"relative" }}>
      <style>{STYLE}</style>
      <div className="grid-bg"/>
      {preview && (
        <div className="scan-wrap" style={{ width:260,height:190,marginBottom:36,border:"1px solid rgba(0,200,232,.3)",borderRadius:16 }}>
          <img src={preview} alt="" style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:16,opacity:.7 }}/>
          <div className="scan-line"/>
        </div>
      )}
      <div className="ag" style={{ width:76,height:76,borderRadius:"50%",border:"2px solid var(--cyan)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,fontSize:30 }}>🤖</div>
      <h2 style={{ fontSize:26,fontWeight:700,marginBottom:10 }}>{fa?"در حال تحلیل...":"Analyzing..."}</h2>
      <p style={{ color:"var(--text2)",marginBottom:28 }}>{fa?"هوش مصنوعی در حال بررسی است":"AI is inspecting your data"}</p>
      <div style={{ display:"flex",gap:7 }}>
        {[0,1,2,3,4].map(i=><div key={i} style={{ width:9,height:9,borderRadius:"50%",background:"var(--cyan)",animation:"pulse 1s ease infinite",animationDelay:`${i*.18}s` }}/>)}
      </div>
      <div style={{ marginTop:36,maxWidth:380,width:"100%" }}>
        {(fa?["مشکل انتخابی دریافت شد...","پایگاه داده عیوب بررسی می‌شود...","قطعات مشکوک شناسایی می‌شود...","گزارش نهایی آماده می‌شود..."]:["Problem type received...","Scanning defect database...","Identifying suspected parts...","Preparing final report..."]).map((s,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border)",opacity:step>=i?1:.3,transition:"opacity .4s" }}>
            {step>i ? <span style={{ color:"var(--green)",fontSize:16 }}>✓</span>
              : step===i ? <div className="as" style={{ width:14,height:14,border:"2px solid var(--cyan)",borderTopColor:"transparent",borderRadius:"50%",flexShrink:0 }}/>
              : <div style={{ width:14,height:14,borderRadius:"50%",border:"2px solid var(--text3)",flexShrink:0 }}/>}
            <span style={{ color:"var(--text2)",fontSize:14 }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (page === "results" && result) {
    const conf = result.confidence;
    const cc = conf>=85?"#00e5a0":conf>=65?"#ffd166":"#ff4d6d";
    return (
      <div className={fa?"rtl":""} style={{ minHeight:"100vh",position:"relative" }}>
        <style>{STYLE}</style>
        <div className="grid-bg"/>
        <div style={{ position:"fixed",top:"-20%",left:"-10%",width:"50vw",height:"50vw",borderRadius:"50%",background:"radial-gradient(circle,rgba(201,160,53,.06),transparent 70%)",pointerEvents:"none",zIndex:0 }}/>
        <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,padding:"0 24px",height:62,display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(6,9,16,.88)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={()=>setPage("landing")}><Logo/><span style={{ fontSize:14,fontWeight:700 }}>{fa?"دکتر هوشمند کپی":"AI Copier Doctor"}</span></div>
          <div style={{ display:"flex",background:"var(--glass2)",borderRadius:50,padding:3,gap:3,border:"1px solid var(--border)" }}>
            {["fa","en"].map(l=><button key={l} onClick={()=>setLang(l)} style={{ background:lang===l?"var(--glass2)":"transparent",border:lang===l?"1px solid var(--border2)":"1px solid transparent",color:lang===l?"var(--gold2)":"var(--text3)",borderRadius:50,padding:"4px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>{l==="fa"?"FA":"EN"}</button>)}
          </div>
        </nav>

        <div style={{ maxWidth:780,margin:"0 auto",padding:"90px 20px 60px",position:"relative",zIndex:1 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:14 }}>
            <div>
              <div className="badge bc" style={{ marginBottom:10 }}>📋 {fa?"گزارش تشخیص":"Diagnosis Report"}</div>
              <h1 style={{ fontSize:"clamp(22px,3.5vw,34px)",fontWeight:800 }}>{fa?"نتیجه تحلیل هوشمند":"AI Analysis Result"}</h1>
            </div>
            <button className="btn-ghost" style={{ padding:"10px 20px",fontSize:13 }} onClick={reset}>+ {fa?"تحلیل جدید":"New Analysis"}</button>
          </div>

          {/* Main card */}
          <div className="glass au" style={{ padding:30,marginBottom:20,background:"linear-gradient(135deg,rgba(201,160,53,.06),rgba(0,200,232,.04))" }}>
            <div style={{ display:"flex",gap:22,flexWrap:"wrap",alignItems:"center" }}>
              {preview && <img src={preview} alt="" style={{ width:110,height:110,objectFit:"cover",borderRadius:12,border:"1px solid var(--border2)",flexShrink:0 }}/>}
              <div style={{ flex:1,minWidth:180 }}>
                <p style={{ fontSize:12,color:"var(--text3)",marginBottom:5 }}>{fa?"مشکل تشخیص داده‌شده":"Detected Problem"}</p>
                <h2 style={{ fontSize:"clamp(17px,2.5vw,24px)",fontWeight:800,marginBottom:12,color:"var(--gold2)" }}>{result.problem_name}</h2>
                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  <PBadge p={result.repair_priority}/>
                  {brand && <span className="badge bc">⚡ {brand}</span>}
                </div>
              </div>
              <div style={{ textAlign:"center",flexShrink:0 }}>
                <div style={{ position:"relative",width:110,height:110,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <Ring val={animBars?conf:0} size={110} color={cc}/>
                  <div style={{ position:"absolute",textAlign:"center" }}>
                    <div style={{ fontSize:22,fontWeight:800,color:cc }}>{conf}%</div>
                    <div style={{ fontSize:10,color:"var(--text3)" }}>{fa?"دقت":"Accuracy"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bars */}
          <div className="glass au" style={{ padding:26,marginBottom:18,animationDelay:".1s" }}>
            <h3 style={{ fontWeight:700,marginBottom:18,display:"flex",alignItems:"center",gap:9 }}>📊 {fa?"احتمال عیوب":"Defect Probability"}</h3>
            {result.defect_bars.map((b,i)=><Bar key={i} label={b.l} value={b.v} color={b.c} animate={animBars}/>)}
          </div>

          {/* Grid */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
            <div className="glass au" style={{ padding:22,animationDelay:".15s" }}>
              <p style={{ fontSize:12,color:"var(--text3)",marginBottom:12 }}>🔩 {fa?"قطعات مشکوک":"Suspected Parts"}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {result.suspected_parts.map((p,i)=>(
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:9,padding:"8px 13px",background:"rgba(255,255,255,.04)",borderRadius:10 }}>
                    <span style={{ color:"var(--cyan)",fontSize:11 }}>◆</span><span style={{ fontSize:14 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass au" style={{ padding:22,animationDelay:".2s" }}>
              <p style={{ fontSize:12,color:"var(--text3)",marginBottom:12 }}>💰 {fa?"تخمین هزینه":"Est. Cost"}</p>
              <div style={{ fontSize:"clamp(16px,2.5vw,22px)",fontWeight:800,color:"var(--gold2)",lineHeight:1.3,marginBottom:14 }}>{result.estimated_cost}</div>
              <p style={{ fontSize:12,color:"var(--text3)",marginBottom:7 }}>⚠ {fa?"اولویت تعمیر":"Repair Priority"}</p>
              <PBadge p={result.repair_priority}/>
            </div>
          </div>

          {/* Solution */}
          <div className="glass au" style={{ padding:26,marginBottom:14,animationDelay:".25s" }}>
            <p style={{ fontSize:12,color:"var(--text3)",marginBottom:12 }}>🔧 {fa?"راه‌حل پیشنهادی":"Suggested Solution"}</p>
            <p style={{ lineHeight:1.9,fontSize:14,whiteSpace:"pre-line" }}>{result.solution}</p>
          </div>

          {/* Technical */}
          <div className="glass au" style={{ padding:26,marginBottom:28,animationDelay:".3s",borderColor:"rgba(0,200,232,.15)" }}>
            <p style={{ fontSize:12,color:"var(--text3)",marginBottom:12 }}>⚙ {fa?"جزئیات فنی":"Technical Details"}</p>
            <p style={{ lineHeight:1.8,fontSize:13,color:"var(--text2)" }}>{result.technical_details}</p>
          </div>

          <div style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
            <button className="btn-gold" style={{ flex:1,padding:"15px",fontSize:15,minWidth:140 }} onClick={reset}>+ {fa?"تحلیل جدید":"New Analysis"}</button>
            <button className="btn-ghost" style={{ flex:1,padding:"15px",fontSize:15,minWidth:140 }} onClick={()=>window.print()}>📄 {fa?"چاپ گزارش":"Print Report"}</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
