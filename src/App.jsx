import React, { useState } from 'react'

const brands = ['Canon', 'Ricoh', 'Konica Minolta', 'Sharp', 'Toshiba', 'Kyocera', 'HP', 'Xerox', 'Samsung', 'Brother']

const demos = [
  { title: 'خط عمودی', component: 'Drum / Cleaning Blade', confidence: 87, priority: 'بالا', causes: ['فرسودگی Drum', 'آلودگی Cleaning Blade', 'مشکل Developer'] },
  { title: 'لکه‌های تکرارشونده', component: 'Drum / Roller', confidence: 82, priority: 'متوسط', causes: ['آلودگی Drum', 'آسیب Roller', 'آلودگی مسیر چاپ'] },
  { title: 'پس‌زمینه خاکستری', component: 'Developer / Drum / Charging', confidence: 79, priority: 'بالا', causes: ['شارژ نامناسب Drum', 'مشکل Developer', 'فرسودگی Drum'] },
  { title: 'Ghosting', component: 'Fuser / Drum', confidence: 84, priority: 'بالا', causes: ['دمای نامناسب Fuser', 'فرسودگی Drum', 'مشکل انتقال تونر'] },
  { title: 'چاپ کم‌رنگ', component: 'Toner / Developer / Drum', confidence: 76, priority: 'متوسط', causes: ['کمبود تونر', 'فرسودگی Developer', 'مشکل شارژ یا Drum'] }
]

const css = `
* { box-sizing: border-box; }
body { margin: 0; font-family: Arial, sans-serif; background: #f5f7fb; color: #152033; }
button, input, select, textarea { font: inherit; }
.wrap { max-width: 1100px; margin: auto; padding: 30px 18px; }
.card { background: white; border: 1px solid #e3e8f1; border-radius: 20px; padding: 22px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; }
.field { width: 100%; padding: 12px; border: 1px solid #d5dce8; border-radius: 10px; margin: 7px 0 14px; }
.primary { width: 100%; padding: 14px; border: 0; border-radius: 12px; background: #3156c9; color: white; font-weight: 700; cursor: pointer; }
.demo { padding: 10px 14px; border: 1px solid #d5dce8; background: #f8faff; border-radius: 12px; cursor: pointer; }
.result { border: 1px solid #d8e0ed; background: white; border-radius: 20px; padding: 25px; margin-top: 20px; }
.badge { display: inline-block; padding: 6px 10px; border-radius: 10px; background: #fff3cd; font-size: 12px; }
.item { background: #f7f9fc; border-radius: 12px; padding: 14px; }
.history { padding: 12px 0; border-bottom: 1px solid #edf0f5; }
`

export default function App() {
  const [image, setImage] = useState(null)
  const [brand, setBrand] = useState('Canon')
  const [model, setModel] = useState('')
  const [symptom, setSymptom] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('acd-history') || '[]')
    } catch {
      return []
    }
  })

  function analyze(demo = demos[0]) {
    setLoading(true)
    setTimeout(() => {
      const report = {
        defect: demo.title,
        component: demo.component,
        confidence: demo.confidence,
        priority: demo.priority,
        causes: demo.causes,
        brand,
        model,
        symptom,
        checks: [
          'نمونه چاپ را در چند صفحه متوالی بررسی کنید.',
          'فاصله تکرار علامت را در صورت وجود اندازه‌گیری کنید.',
          'قطعه مشکوک را طبق سرویس‌منوال مدل دستگاه بررسی کنید.'
        ],
        solution: 'ابتدا علت‌های محتمل و قطعه مشکوک بررسی شود و هرگونه سرویس یا تعویض مطابق دستورالعمل سازنده انجام شود.',
        id: Date.now(),
        date: new Date().toLocaleString('fa-IR')
      }
      setResult(report)
      const nextHistory = [report, ...history].slice(0, 20)
      setHistory(nextHistory)
      localStorage.setItem('acd-history', JSON.stringify(nextHistory))
      setLoading(false)
    }, 700)
  }

  function handleFile(event) {
    const file = event.target.files && event.target.files[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      window.alert('حجم تصویر باید کمتر از ۸ مگابایت باشد.')
      return
    }
    setImage(URL.createObjectURL(file))
  }

  return (
    <>
      <style>{css}</style>
      <div dir="rtl">
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e9f0', padding: '18px 6%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <b style={{ fontSize: 24 }}>دکتر کپی</b>
            <small style={{ display: 'block', color: '#667085' }}>AI Copier Doctor</small>
          </div>
          <span style={{ color: '#667085' }}>دستیار هوشمند تشخیص ایرادات چاپ</span>
        </header>

        <main className="wrap">
          <section style={{ textAlign: 'center', marginBottom: 30 }}>
            <span className="badge">نسخه MVP • Demo Mode</span>
            <h1 style={{ fontSize: 40, margin: '16px 0 8px' }}>از روی نمونه چاپ، مشکل دستگاه را سریع‌تر پیدا کنید.</h1>
            <p style={{ color: '#667085' }}>عکس نمونه چاپ را وارد کنید و گزارش ساختاریافته عیب‌یابی اولیه دریافت کنید.</p>
          </section>

          <div className="grid">
            <section className="card">
              <h2>۱. آپلود نمونه چاپ</h2>
              <label style={{ display: 'block', padding: 35, textAlign: 'center', border: '2px dashed #b9c4d8', borderRadius: 16, cursor: 'pointer' }}>
                📸<br />
                <b>{image ? 'تصویر انتخاب شد' : 'آپلود عکس چاپ'}</b><br />
                <small>JPG / PNG / WEBP • حداکثر ۸MB</small>
                <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }} onChange={handleFile} />
              </label>
              {image && <img src={image} alt="نمونه چاپ" style={{ width: '100%', maxHeight: 260, objectFit: 'contain', marginTop: 14, borderRadius: 12 }} />}
            </section>

            <section className="card">
              <h2>۲. مشخصات دستگاه</h2>
              <label>برند<select className="field" value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>مدل دستگاه<input className="field" value={model} onChange={(e) => setModel(e.target.value)} placeholder="مثلاً imageRUNNER..." /></label>
              <label>توضیح مشکل<textarea className="field" value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="مثلاً یک خط عمودی در تمام صفحات دیده می‌شود." /></label>
              <button className="primary" disabled={loading} onClick={() => analyze()}>{loading ? 'در حال تحلیل...' : '🔍 شروع عیب‌یابی'}</button>
            </section>
          </div>

          <section className="card" style={{ marginTop: 20 }}>
            <h2>نمونه‌های آماده برای تست</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {demos.map((demo) => <button className="demo" key={demo.title} onClick={() => analyze(demo)}>{demo.title}</button>)}
            </div>
          </section>

          {result && (
            <section className="result">
              <span className="badge">Demo Analysis — تحلیل آزمایشی</span>
              <h2>{result.defect}</h2>
              <div className="grid">
                <div className="item"><small>اطمینان</small><br /><b>{result.confidence}٪</b></div>
                <div className="item"><small>قطعه مشکوک</small><br /><b>{result.component}</b></div>
                <div className="item"><small>اولویت تعمیر</small><br /><b>{result.priority}</b></div>
                <div className="item"><small>برند</small><br /><b>{result.brand}</b></div>
              </div>
              <h3>علت‌های محتمل</h3>
              <ul>{result.causes.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>مراحل بررسی پیشنهادی</h3>
              <ol>{result.checks.map((item) => <li key={item}>{item}</li>)}</ol>
              <h3>راهکار پیشنهادی</h3>
              <p>{result.solution}</p>
              <small style={{ color: '#667085' }}>این نتیجه شبیه‌سازی MVP است و جایگزین بررسی حضوری تکنسین و سرویس‌منوال دستگاه نیست.</small>
            </section>
          )}

          <section className="card" style={{ marginTop: 20 }}>
            <h2>سوابق اخیر</h2>
            {history.length === 0 ? <p style={{ color: '#667085' }}>هنوز گزارشی ذخیره نشده است.</p> : history.map((item) => (
              <div className="history" key={item.id}>
                <b>{item.defect}</b><br />
                <small>{item.brand} {item.model || ''} • {item.date} • اطمینان {item.confidence}٪</small>
              </div>
            ))}
          </section>
        </main>

        <footer style={{ textAlign: 'center', padding: 28, color: '#667085', fontSize: 12 }}>دکتر کپی — ابزار کمکی عیب‌یابی اولیه دستگاه‌های کپی و پرینتر</footer>
      </div>
    </>
  )
}
