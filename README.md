# 🌸 Cairo Cosmo - Beauty Center & Clinic Management System
# مركز كايرو كوزمو للتجميل - منصة إدارة العيادات والحجوزات

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📖 نظرة عامة | Overview

**Cairo Cosmo** هي منصة ويب متكاملة لإدارة مراكز وعيادات التجميل، تجمع بين واجهة أمامية فاخرة وجذابة للعملاء، ونظام حجز واستشارات فوري، ولوحة تحكم إدارية شاملة (Admin ERP/CRM) لإدارة المواعيد، الأطباء، العروض، المدونة، والعملاء، مدعومة بمساعد ذكي (Sophia AI Agent).

**Cairo Cosmo** is a comprehensive web platform for beauty and aesthetic clinics, featuring a premium patient-facing portal with online booking, cosmetic procedure calculators, and a robust administrative CRM/ERP backend with AI-assisted workflows.

---

## ✨ المميزات الرئيسية | Key Features

### 🌟 واجهة العملاء (Client Portal)
- **الصفحة الرئيسية (Homepage)**: تصميم عصري وتفاعلي يعرض أبرز الخدمات، آراء العملاء، وأحدث العروض.
- **كتالوج الخدمات والأطباء**: صفحات تفصيلية لكل إجراء طبي وفريق الأطباء الاستشاريين.
- **نظام الحجوزات الذكي (Smart Booking)**: حجز فوري للمواعيد وتحديد الفرع والطبيب والوقت المناسب.
- **حاسبة تكاليف الإجراءات (Procedure Calculator)**: أداة تفاعلية لتقدير تكاليف الجلسات والعمليات.
- **المدونة والمقالات (Beauty Blog)**: مقالات تثقيفية حول العناية بالبشرة والجراحة التجميلية مع تحسينات SEO.
- **تواصل وتكامل مباشر**: اتصال سريع عبر واتساب ونماذج اتصال مدعومة بإشعارات بريدية فورية.

### 🛡️ لوحة التحكم والإدارة (Admin Dashboard & CRM)
- **لوحة مؤشرات حية (Live Analytics)**: إحصائيات الحجوزات، الإيرادات، ونسب الإشغال.
- **إدارة المواعيد (Bookings Management)**: متابعة الحالات (مؤكد، ملغي، معلق، مكتمل).
- **إدارة الأطباء وفريق العمل (Team Management)**: صلاحيات، تخصصات، وجداول الدوام.
- **إدارة الحملات والعروض (Offers & Campaigns)**: إطلاق عروض ترويجية وتخفيضات موسمية.
- **مساعد صوفيا الذكي (Sophia Agent)**: تكامل مع وكيل ذكاء اصطناعي للمساعدة التلقائية.
- **إدارة سجلات العملاء (Patients CRM)**: ملفات المرضى وتاريخ الزيارات والملاحظات الطبية.

---

## 🛠️ التقنيات المستخدمة | Tech Stack

- **الواجهة الأمامية (Frontend)**:
  - React 18 + TypeScript + Vite 5
  - Tailwind CSS + Lucide Icons + Framer Motion
  - Radix UI & Shadcn/UI Component Primitives
  - TanStack Query (React Query) لإدارة البيانات وحالات الخادم
  - Recharts للرسوم البيانية والتحليلات

- **الواجهة الخلفية (Backend API)**:
  - PHP 8+ RESTful APIs (معالجة الحجوزات، التوثيق، العملاء)
  - PHPMailer لإرسال إشعارات وتأكيدات البريد الإلكتروني عبر SMTP
  - قاعدة بيانات MySQL (جداول الحجوزات، الأطباء، العملاء، السجلات)

---

## 📂 هيكل المشروع | Directory Structure

```text
Cairo Cosmo Master/
├── .gitignore
├── README.md
└── beauty-center/
    ├── package.json
    ├── vite.config.ts
    ├── index.html
    ├── api/                     # واجهات PHP الخلفية
    │   ├── auth/                # نظام تسجيل الدخول والجلسات
    │   ├── bookings/            # إدارة المواعيد
    │   ├── customers/           # سجلات المرضى
    │   ├── PHPMailer/           # مكتبة إرسال البريد الإلكتروني
    │   └── _mail-config.php     # إعدادات SMTP
    ├── database/
    │   ├── schema.sql           # مخطط قاعدة بيانات MySQL
    │   └── seed.sql             # البيانات الأولية والتجريبية
    ├── public/                  # الملفات العامة والصور الثابتة
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── components/          # مكونات الواجهة القابلة لإعادة الاستخدام
        ├── pages/               # صفحات المنصة (الرئيسية، الحجز، الخدمات...)
        │   └── admin/           # صفحات لوحة التحكم الإدارية
        ├── services/            # استدعاءات API والتواصل مع الخادم
        ├── hooks/               # Custom React Hooks
        └── types/               # تعريفات TypeScript
```

---

## 🚀 التشغيل والتثبيت المحلي | Local Setup & Installation

### المتطلبات الأساسية (Prerequisites):
- Node.js (v18+) و npm
- خادم محلي PHP / MySQL (مثل XAMPP, Laragon, أو Valet)

### خطوات التشغيل:

1. **الدخول إلى مجلد المشروع**:
   ```bash
   cd beauty-center
   ```

2. **تثبيت الحزم البرمجية**:
   ```bash
   npm install
   ```

3. **تشغيل بيئة التطوير**:
   ```bash
   npm run dev
   ```
   سيتم تشغيل الخادم على الرابط المحلي: `http://localhost:5173`

4. **إعداد قاعدة البيانات والـ API**:
   - قم بإنشاء قاعدة بيانات MySQL واستيراد الملفين:
     `database/schema.sql` ثم `database/seed.sql`
   - اضبط إعدادات الاتصال في `api/config.php` و `api/_mail-config.php`.

5. **بناء النسخة الإنتاجية (Production Build)**:
   ```bash
   npm run build
   ```

---

## 📄 الترخيص والحقوق | License
جميع الحقوق محفوظة © Cairo Cosmo Beauty Center.
