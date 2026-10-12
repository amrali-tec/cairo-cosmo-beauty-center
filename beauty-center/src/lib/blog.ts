// src/lib/blog.ts
import type { Locale, TranslatedString } from "../lib/i18n";

export type BlogCategory = "service" | "doctor" | "faq" | "news";

export interface BlogPost {
  id: string;
  slug: string;

  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;

  content: {
    ar: string;
    en: string;
  };

  category: BlogCategory;

  serviceSlug?: string;
  doctorSlug?: string;

  seo: {
    metaTitle: TranslatedString;
    metaDescription: TranslatedString;
    keywords?: TranslatedString;
    ogImage?: string;
  };

  cardImage?: string;
  coverImage?: string;

  gallery?: { src: string; alt: TranslatedString }[];

  dateISO: string;
}

const img = (name: string) => `/assets/blog/${name}`;

/**
 * Removes any "Booking CTA" blocks inside the article HTML.
 * It targets sections like:
 * - <h2>احجزي ...</h2> + <p>... href="/ar/booking" ...</p>
 * - <h2>Book ...</h2> + <p>... href="/en/booking" ...</p>
 * Also handles generic "/{locale}/booking" forms.
 */
const stripBookingCtaBlock = (html: string) => {
  if (!html) return html;

  // Normalize super repeated spaces a bit (keeps html intact)
  const src = String(html);

  // A helper to remove: H2 followed by one or more paragraphs that contain booking links
  // Arabic variants
  const arH2 =
    String.raw`<h2>\s*(?:احجزي|احجز(?:ي)?)\s*(?:استشارة|موعد|تقييم|خطة|جلسة|حجز|احجزي\s*موعد|احجز\s*الآن|ابدأ\s*من\s*هنا|ابدئي\s*من\s*هنا)\s*<\/h2>`;
  const enH2 =
    String.raw`<h2>\s*(?:Book(?:\s+(?:a|an|your))?\s*(?:consultation|assessment|appointment|plan|now)|Start\s*here)\s*<\/h2>`;

  // Paragraph(s) containing booking links (/ar/booking, /en/booking, /{locale}/booking)
  const bookingHref =
    String.raw`href="\/(?:ar|en)\/booking"|href="\/[a-z]{2}\/booking"|href="\/booking"`;

  // Remove H2 + following P blocks that contain booking links
  const reH2PlusBookingP = new RegExp(
    String.raw`(?:${arH2}|${enH2})\s*(?:<p>[\s\S]*?(?:${bookingHref})[\s\S]*?<\/p>\s*)+`,
    "g",
  );

  // Also remove standalone paragraphs that contain booking links (in case someone wrote CTA without H2)
  const reBookingParagraphOnly = new RegExp(
    String.raw`<p>[\s\S]*?(?:${bookingHref})[\s\S]*?<\/p>\s*`,
    "g",
  );

  // Edge: sometimes CTA text is wrapped in extra whitespace or includes rel/target attributes
  // We already match on href, so it's fine.

  return src.replace(reH2PlusBookingP, "").replace(reBookingParagraphOnly, "");
};

const blogPostsRaw: BlogPost[] = [
  // -------------------- Service Articles --------------------

  {
    id: "p1",
    slug: "botox-benefits",
    title: {
      ar: "فوائد البوتوكس ومتى تظهر النتائج؟",
      en: "Botox benefits and when results appear",
    },
    excerpt: {
      ar: "دليل مبسط عن البوتوكس: كيف يعمل، متى تظهر النتائج، ومدة استمرارها مع نصائح قبل وبعد الجلسة.",
      en: "A simple guide: how Botox works, results timeline, duration, plus before/after tips.",
    },
    content: {
      ar: `
        <p><strong>البوتوكس</strong> من أشهر الخيارات غير الجراحية لتخفيف <strong>التجاعيد التعبيرية</strong> مثل خطوط الجبهة وحول العين وخط العبوس. الهدف الحقيقي هو <strong>مظهر مرتاح وطبيعي</strong> وليس “تجميد” الملامح.</p>

        <figure data-image-slot="1"></figure>

        <h2>كيف يعمل البوتوكس؟</h2>
        <p>يقلل البوتوكس من الإشارات العصبية للعضلة المستهدفة، فتقل قوة انقباضها، وبالتالي تخف خطوط التعبير الناتجة عن الحركة المتكررة.</p>

        <h2>متى تظهر النتائج؟</h2>
        <ul>
          <li><strong>البداية:</strong> من 3 إلى 7 أيام.</li>
          <li><strong>النتيجة الكاملة:</strong> غالبًا خلال 10 إلى 14 يومًا.</li>
        </ul>

        <h2>كم تدوم نتائج البوتوكس؟</h2>
        <p>تستمر عادةً من <strong>3 إلى 6 أشهر</strong> حسب قوة العضلات، نمط الحياة، والالتزام بتعليمات ما بعد الجلسة.</p>

        <figure data-image-slot="2"></figure>

        <h2>أشهر مناطق الحقن</h2>
        <ul>
          <li>خطوط الجبهة</li>
          <li>خط العبوس بين الحاجبين</li>
          <li>حول العين (Crow’s feet)</li>
        </ul>

        <h2>نصائح قبل الجلسة</h2>
        <ul>
          <li>أخبري الطبيب عن أي أدوية أو مكملات قد تزيد الكدمات (حسب حالتك).</li>
          <li>تجنبي الكحول قبل الجلسة بـ 24 ساعة.</li>
          <li>لا ترفعي سقف التوقعات: النتيجة الأفضل دائمًا “طبيعية”.</li>
        </ul>

        <h2>تعليمات بعد الجلسة (أهم 48 ساعة)</h2>
        <ul>
          <li>تجنبي فرك المنطقة أول 24 ساعة.</li>
          <li>تجنبي الساونا والحرارة العالية لمدة 48 ساعة.</li>
          <li>تجنبي التمارين العنيفة أول يوم.</li>
        </ul>

        <h2>أسئلة شائعة (FAQ)</h2>
        <h3>هل البوتوكس يجعل الوجه جامد؟</h3>
        <p>لو الجرعة وتوزيع النقاط صح، النتيجة تكون طبيعية وتخفف التجاعيد بدون “جمود”.</p>

        <h3>متى أحتاج جلسة متابعة؟</h3>
        <p>غالبًا بعد 3 إلى 6 أشهر. وأحيانًا تعديل بسيط بعد 10 إلى 14 يومًا حسب تقييم الطبيب.</p>

        <h2>روابط طبية موثوقة</h2>
        <ul>
          <li><a href="https://www.nhs.uk/conditions/cosmetic-procedures/cosmetic-injections/botulinum-toxin/" target="_blank" rel="nofollow noopener">NHS: Botulinum toxin (Botox)</a></li>
          <li><a href="https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin" target="_blank" rel="nofollow noopener">AAD: Botulinum toxin for wrinkles</a></li>
        </ul>

        <h2>تابعنا على السوشيال</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>

        <div data-video-slot="1"></div>
      `,
      en: `
        <p><strong>Botox</strong> is one of the most popular non-surgical options for <strong>expression lines</strong> like forehead lines, frown lines, and crow’s feet. The goal is a <strong>refreshed, natural look</strong>, not a frozen face.</p>

        <figure data-image-slot="1"></figure>

        <h2>How does Botox work?</h2>
        <p>Botox temporarily reduces nerve signals to targeted muscles, so they contract less. This softens dynamic wrinkles caused by repeated facial movements.</p>

        <h2>When do results appear?</h2>
        <ul>
          <li><strong>Initial changes:</strong> 3–7 days.</li>
          <li><strong>Full effect:</strong> usually 10–14 days.</li>
        </ul>

        <h2>How long does Botox last?</h2>
        <p>Typically <strong>3–6 months</strong>, depending on muscle strength, lifestyle, and aftercare.</p>

        <figure data-image-slot="2"></figure>

        <h2>Common injection areas</h2>
        <ul>
          <li>Forehead lines</li>
          <li>Glabellar (frown) lines</li>
          <li>Crow’s feet</li>
        </ul>

        <h2>Before your appointment</h2>
        <ul>
          <li>Tell your clinician about medications/supplements that may increase bruising (case dependent).</li>
          <li>Avoid alcohol 24 hours before.</li>
          <li>Natural results usually look best.</li>
        </ul>

        <h2>Aftercare (first 48 hours)</h2>
        <ul>
          <li>Avoid rubbing the area for 24 hours.</li>
          <li>Avoid heat/sauna for 48 hours.</li>
          <li>Avoid intense workouts on day 1.</li>
        </ul>

        <h2>FAQ</h2>
        <h3>Will Botox make my face look frozen?</h3>
        <p>Not necessarily. Proper dosing and placement can reduce lines while keeping expressions natural.</p>

        <h3>When should I repeat it?</h3>
        <p>Usually every 3–6 months. A touch-up may be considered at 10–14 days if needed.</p>

        <h2>Trusted resources</h2>
        <ul>
          <li><a href="https://www.nhs.uk/conditions/cosmetic-procedures/cosmetic-injections/botulinum-toxin/" target="_blank" rel="nofollow noopener">NHS: Botox overview</a></li>
          <li><a href="https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin" target="_blank" rel="nofollow noopener">AAD: Botox for wrinkles</a></li>
        </ul>

        <h2>Follow Cairo Cosmo</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>

        <div data-video-slot="1"></div>
      `,
    },
    category: "service",
    serviceSlug: "botox",
    seo: {
      metaTitle: {
        ar: "فوائد البوتوكس ومتى تظهر النتائج | كايرو كوزمو",
        en: "Botox Results Timeline & Benefits | Cairo Cosmo",
      },
      metaDescription: {
        ar: "دليل شامل عن البوتوكس: كيف يعمل، متى تظهر النتائج، مدة استمرارها، ونصائح قبل وبعد الجلسة للحصول على نتيجة طبيعية.",
        en: "A complete guide to Botox: how it works, when results show, how long it lasts, and aftercare tips for natural outcomes.",
      },
      keywords: {
        ar: "بوتوكس, تجاعيد الجبهة, خطوط العبوس, حول العين, حقن تجميلي, كايرو كوزمو",
        en: "botox, forehead lines, frown lines, crow's feet, aesthetic injections, cairo cosmo",
      },
      ogImage: img("botox-OGImage.png"),
    },
    cardImage: img("botox-Card.png"),
    coverImage: img("Botox-cover.jpg"),
    gallery: [
      { src: img("botox-Inlineslot1.png"), alt: { ar: "جلسة بوتوكس", en: "Botox session" } },
      { src: img("botox-Inlineslot2.png"), alt: { ar: "مناطق حقن البوتوكس", en: "Botox injection areas" } },
    ],
    dateISO: "2026-01-21",
  },

  {
    id: "p2",
    slug: "dermal-fillers-guide",
    title: { ar: "الفيلر: الأنواع والاستخدامات وأخطاء شائعة", en: "Dermal fillers: types, uses, and common mistakes" },
    excerpt: { ar: "متى نختار الفيلر؟ وأين يُستخدم؟ وكيف نحصل على نتيجة طبيعية بدون مبالغة؟", en: "When to choose fillers, where they’re used, and how to get natural results." },
    content: {
      ar: `
        <p><strong>الفيلر</strong> يساعد على استعادة الحجم وتحسين ملامح الوجه بشكل طبيعي عند اختيار النوع والكمية بدقة. أهم قاعدة: <strong>التدرج</strong> دائمًا أجمل من جلسة واحدة “ثقيلة”.</p>

        <figure data-image-slot="1"></figure>

        <h2>ما هو الفيلر؟</h2>
        <p>هو مواد تُحقن تحت الجلد لتحسين الحجم أو التناسق أو تنعيم بعض الخطوط. الأكثر شيوعًا تجميليًا هو <strong>حمض الهيالورونيك</strong>.</p>

        <h2>أشهر الاستخدامات</h2>
        <ul>
          <li>الشفاه والخدود</li>
          <li>خطوط الابتسامة</li>
          <li>تحديد الفك والذقن</li>
          <li>تحسين التناسق العام للوجه</li>
        </ul>

        <figure data-image-slot="2"></figure>

        <h2>أخطاء شائعة</h2>
        <ul>
          <li><strong>المبالغة</strong> في الكمية للحصول على نتيجة سريعة.</li>
          <li>التركيز على “ترند” بدل نسب الوجه.</li>
          <li>تكرار نفس المنطقة بدون خطة شاملة.</li>
        </ul>

        <h2>نصائح بعد الفيلر</h2>
        <ul>
          <li>تجنبي الضغط أو المساج أول 24 ساعة.</li>
          <li>تجنبي الساونا والحرارة العالية 48 ساعة.</li>
          <li>الكدمات الخفيفة واردة وتزول غالبًا خلال أيام.</li>
        </ul>

        <h2>FAQ</h2>
        <h3>هل الفيلر دائم؟</h3>
        <p>غالبًا لا. المدة تختلف حسب النوع والمنطقة وقد تمتد عدة أشهر.</p>

        <h3>هل يمكن تعديل النتيجة؟</h3>
        <p>بعض الأنواع يمكن تعديلها لدى الطبيب عند الحاجة.</p>

        <h2>روابط موثوقة</h2>
        <ul>
          <li><a href="https://www.aad.org/public/cosmetic/fillers" target="_blank" rel="nofollow noopener">AAD: Dermal fillers</a></li>
          <li><a href="https://www.nhs.uk/conditions/cosmetic-procedures/cosmetic-injections/dermal-fillers/" target="_blank" rel="nofollow noopener">NHS: Dermal fillers</a></li>
        </ul>

        <h2>تابعنا</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>

        <div data-video-slot="1"></div>
      `,
      en: `
        <p><strong>Dermal fillers</strong> can restore volume and enhance facial harmony when the right product and dose are chosen carefully. Key rule: <strong>gradual enhancement</strong> looks more refined than one heavy session.</p>

        <figure data-image-slot="1"></figure>

        <h2>What are fillers?</h2>
        <p>Injectable materials placed under the skin to restore volume, improve proportions, or soften lines. <strong>Hyaluronic acid</strong> is commonly used in aesthetics.</p>

        <h2>Common uses</h2>
        <ul>
          <li>Lips & cheeks</li>
          <li>Smile lines</li>
          <li>Jawline & chin definition</li>
          <li>Overall facial balance</li>
        </ul>

        <figure data-image-slot="2"></figure>

        <h2>Common mistakes</h2>
        <ul>
          <li><strong>Overfilling</strong> to chase instant dramatic change.</li>
          <li>Following trends instead of proportions.</li>
          <li>Repeating the same area without a structured plan.</li>
        </ul>

        <h2>Aftercare tips</h2>
        <ul>
          <li>Avoid pressure or massage for 24 hours.</li>
          <li>Avoid heat/sauna for 48 hours.</li>
          <li>Mild bruising may occur and usually resolves in a few days.</li>
        </ul>

        <h2>FAQ</h2>
        <h3>Are fillers permanent?</h3>
        <p>Usually not. Duration varies by product and area and can last several months.</p>

        <h3>Can results be adjusted?</h3>
        <p>Some fillers can be adjusted by a qualified clinician if needed.</p>

        <h2>Trusted resources</h2>
        <ul>
          <li><a href="https://www.aad.org/public/cosmetic/fillers" target="_blank" rel="nofollow noopener">AAD: Dermal fillers</a></li>
          <li><a href="https://www.nhs.uk/conditions/cosmetic-procedures/cosmetic-injections/dermal-fillers/" target="_blank" rel="nofollow noopener">NHS: Dermal fillers</a></li>
        </ul>

        <h2>Follow Cairo Cosmo</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>

        <div data-video-slot="1"></div>
      `,
    },
    category: "service",
    serviceSlug: "fillers",
    seo: {
      metaTitle: { ar: "دليل الفيلر: الأنواع والاستخدامات | كايرو كوزمو", en: "Dermal Fillers Guide | Cairo Cosmo" },
      metaDescription: {
        ar: "تعرف على أنواع الفيلر واستخداماته وأخطاء شائعة وكيف تحصل على نتيجة طبيعية مع نصائح قبل وبعد الجلسة.",
        en: "Learn filler types, uses, common mistakes, and tips for natural-looking results.",
      },
      keywords: { ar: "فيلر, هيالورونيك, شفاه, خدود, فك, ذقن, تجميل غير جراحي", en: "fillers, hyaluronic acid, lips, cheeks, jawline, chin, non-surgical aesthetics" },
      ogImage: img("Dermal-fillers-og.png"),
    },
    cardImage: img("Dermal-fillers-card.png"),
    coverImage: img("Dermal-fillers-cover.png"),
    gallery: [
      { src: img("Dermal-fillers-Inlineslot1.png"), alt: { ar: "نتائج فيلر طبيعية", en: "Natural filler results" } },
      { src: img("Dermal-fillers-Inlineslot2.png"), alt: { ar: "مناطق الفيلر الشائعة", en: "Common filler areas" } },
    ],
    dateISO: "2026-01-22",
  },

  {
    id: "p3",
    slug: "laser-hair-removal-sessions",
    title: { ar: "إزالة الشعر بالليزر: عدد الجلسات والنتائج المتوقعة", en: "Laser hair removal: sessions and expected results" },
    excerpt: { ar: "كم جلسة تحتاج؟ ومتى تظهر النتيجة؟ وأهم تعليمات قبل وبعد جلسة الليزر.", en: "How many sessions, when results show, and key before/after tips." },
    content: {
      ar: `
        <p><strong>إزالة الشعر بالليزر</strong> من أكثر الحلول طلبًا لأنها تقلل كثافة الشعر وتبطئ نموه مع الوقت. عدد الجلسات يختلف حسب نوع الشعر والبشرة والمنطقة والهرمونات.</p>

        <figure data-image-slot="1"></figure>

        <h2>كم جلسة أحتاج؟</h2>
        <p>غالبًا من <strong>6 إلى 8 جلسات</strong> للحصول على أفضل نتيجة، ثم جلسات متابعة حسب الحاجة.</p>

        <h2>متى أرى النتائج؟</h2>
        <ul>
          <li>يبدأ التساقط عادة خلال <strong>1–3 أسابيع</strong> بعد الجلسة.</li>
          <li>مع الجلسات يقل النمو وتقل الكثافة تدريجيًا.</li>
        </ul>

        <figure data-image-slot="2"></figure>

        <h2>قبل الجلسة</h2>
        <ul>
          <li>تجنبي التعرض للشمس/التسمير قبل الجلسة.</li>
          <li>تجنبي إزالة الشعر من الجذور (حلاوة/نتف) قبل الجلسة حسب البروتوكول.</li>
          <li>اتبعي تعليمات الطبيب حول الحلاقة قبل الجلسة.</li>
        </ul>

        <h2>بعد الجلسة (48 ساعة)</h2>
        <ul>
          <li>استخدمي واقي الشمس للمناطق المكشوفة.</li>
          <li>تجنبي الساونا والحرارة العالية 48 ساعة.</li>
          <li>استخدمي مرطبًا لطيفًا وتجنبي المقشرات القوية مؤقتًا.</li>
        </ul>

        <h2>FAQ</h2>
        <h3>هل الليزر يناسب كل أنواع البشرة؟</h3>
        <p>توجد تقنيات مختلفة تناسب درجات بشرة متعددة، والقرار النهائي يعتمد على تقييم الطبيب ونوع الجهاز.</p>

        <h2>روابط موثوقة</h2>
        <ul>
          <li><a href="https://www.aad.org/public/cosmetic/hair-removal/laser-hair-removal" target="_blank" rel="nofollow noopener">AAD: Laser hair removal</a></li>
          <li><a href="https://my.clevelandclinic.org/health/treatments/22251-laser-hair-removal" target="_blank" rel="nofollow noopener">Cleveland Clinic: Laser hair removal</a></li>
        </ul>

        <h2>تابعنا</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>

        <div data-video-slot="1"></div>
      `,
      en: `
        <p><strong>Laser hair removal</strong> is popular because it reduces hair density and slows regrowth over time. The number of sessions depends on hair type, skin type, body area, and hormonal factors.</p>

        <figure data-image-slot="1"></figure>

        <h2>How many sessions do I need?</h2>
        <p>Most people need <strong>6–8 sessions</strong> for optimal results, then maintenance sessions as needed.</p>

        <h2>When will I see results?</h2>
        <ul>
          <li>Shedding often starts within <strong>1–3 weeks</strong> after a session.</li>
          <li>With repeated sessions, density reduces progressively.</li>
        </ul>

        <figure data-image-slot="2"></figure>

        <h2>Before your session</h2>
        <ul>
          <li>Avoid sun exposure/tanning beforehand.</li>
          <li>Avoid root removal methods (waxing/epilating) per protocol.</li>
          <li>Follow shaving guidance from your clinician.</li>
        </ul>

        <h2>Aftercare (first 48 hours)</h2>
        <ul>
          <li>Use sunscreen for exposed areas.</li>
          <li>Avoid heat/sauna for 48 hours.</li>
          <li>Use gentle moisturizers and pause strong exfoliants temporarily.</li>
        </ul>

        <h2>FAQ</h2>
        <h3>Is laser suitable for all skin types?</h3>
        <p>Different technologies may suit different skin tones. Final suitability depends on clinical assessment and device selection.</p>

        <h2>Trusted resources</h2>
        <ul>
          <li><a href="https://www.aad.org/public/cosmetic/hair-removal/laser-hair-removal" target="_blank" rel="nofollow noopener">AAD: Laser hair removal</a></li>
          <li><a href="https://my.clevelandclinic.org/health/treatments/22251-laser-hair-removal" target="_blank" rel="nofollow noopener">Cleveland Clinic: Laser hair removal</a></li>
        </ul>

        <h2>Follow Cairo Cosmo</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>

        <div data-video-slot="1"></div>
      `,
    },
    category: "service",
    serviceSlug: "laser-hair-removal",
    seo: {
      metaTitle: { ar: "إزالة الشعر بالليزر: عدد الجلسات والنتائج | كايرو كوزمو", en: "Laser Hair Removal Sessions & Results | Cairo Cosmo" },
      metaDescription: { ar: "تعرف على عدد جلسات الليزر، متى تظهر النتائج، وتعليمات قبل وبعد الجلسة للحصول على أفضل نتيجة.", en: "Learn how many laser sessions you need, when results appear, plus before/after care tips." },
      keywords: { ar: "ليزر إزالة الشعر, جلسات الليزر, نتائج الليزر, عناية بعد الليزر", en: "laser hair removal, laser sessions, laser results, aftercare" },
      ogImage: img("laser-hair-removal-concept-OG.png"),
    },
    cardImage: img("laser-hair-removal-card.png"),
    coverImage: img("Laser-hair-removal-cover.png"),
    gallery: [
      { src: img("laser-hair-removel-Inlineslot1.png"), alt: { ar: "جلسة إزالة الشعر بالليزر", en: "Laser hair removal session" } },
      { src: img("laser-hair-removal-Inlineslot2.png"), alt: { ar: "تعليمات بعد الليزر", en: "Laser aftercare" } },
    ],
    dateISO: "2026-01-23",
  },

  // ✅ مقالات خدمات جديدة

  {
    id: "p4",
    slug: "chemical-peels-guide",
    title: { ar: "التقشير الكيميائي: الأنواع والفوائد ومتى تظهر النتيجة", en: "Chemical peels: types, benefits, and when results show" },
    excerpt: { ar: "دليل مبسط للتقشير الكيميائي: مناسب لمين؟ وكيف تختار النوع الصحيح؟ وتعليمات قبل وبعد.", en: "A simple chemical peel guide: who it’s for, how to choose, and before/after tips." },
    content: {
      ar: `
        <p><strong>التقشير الكيميائي</strong> يساعد على تحسين ملمس البشرة وتخفيف التصبغات وآثار الحبوب عند اختيار النوع والتركيز المناسبين. أهم نقطة: <strong>التقشير خطة</strong> وليس جلسة واحدة.</p>

        <figure data-image-slot="1"></figure>

        <h2>أنواع التقشير الكيميائي</h2>
        <ul>
          <li><strong>سطحي:</strong> لإشراقة وتحسين بسيط بالملمس.</li>
          <li><strong>متوسط:</strong> للتصبغات وآثار الحبوب بشكل أوضح.</li>
          <li><strong>عميق:</strong> يُحدد بدقة وتحت إشراف طبي حسب الحالة.</li>
        </ul>

        <h2>متى تظهر النتيجة؟</h2>
        <p>قد تلاحظين تحسنًا تدريجيًا خلال أيام، وتتحسن النتيجة أكثر مع تكرار الجلسات حسب خطة الطبيب.</p>

        <figure data-image-slot="2"></figure>

        <h2>قبل الجلسة</h2>
        <ul>
          <li>تجنبي التعرض المكثف للشمس.</li>
          <li>اتبعي إرشادات الطبيب في إيقاف بعض المنتجات النشطة قبل الجلسة.</li>
        </ul>

        <h2>بعد الجلسة</h2>
        <ul>
          <li>مرطب لطيف + <strong>واقي شمس</strong> يوميًا.</li>
          <li>تجنبي التقشير اليدوي أو الفرك.</li>
          <li>التقشير الخفيف طبيعي حسب النوع.</li>
        </ul>

        <h2>روابط موثوقة</h2>
        <ul>
          <li><a href="https://www.aad.org/public/cosmetic/younger-looking/chemical-peels" target="_blank" rel="nofollow noopener">AAD: Chemical peels</a></li>
        </ul>

        <div data-video-slot="1"></div>
      `,
      en: `
        <p><strong>Chemical peels</strong> can improve texture and help with pigmentation and post-acne marks when the right type and strength are selected. The key: it’s a <strong>plan</strong>, not a one-time fix.</p>

        <figure data-image-slot="1"></figure>

        <h2>Types of chemical peels</h2>
        <ul>
          <li><strong>Superficial:</strong> glow + mild texture improvement.</li>
          <li><strong>Medium:</strong> more visible improvement for pigmentation and acne marks.</li>
          <li><strong>Deep:</strong> carefully selected and medically supervised.</li>
        </ul>

        <h2>When do results show?</h2>
        <p>You may notice gradual improvement within days, with better results over a course of sessions.</p>

        <figure data-image-slot="2"></figure>

        <h2>Before treatment</h2>
        <ul>
          <li>Avoid intense sun exposure.</li>
          <li>Follow guidance on pausing certain active products.</li>
        </ul>

        <h2>Aftercare</h2>
        <ul>
          <li>Gentle moisturizer + <strong>sunscreen</strong> daily.</li>
          <li>Avoid picking or scrubbing.</li>
          <li>Light peeling can be normal depending on the peel type.</li>
        </ul>

        <h2>Trusted resource</h2>
        <ul>
          <li><a href="https://www.aad.org/public/cosmetic/younger-looking/chemical-peels" target="_blank" rel="nofollow noopener">AAD: Chemical peels</a></li>
        </ul>

        <div data-video-slot="1"></div>
      `,
    },
    category: "service",
    serviceSlug: "peels",
    seo: {
      metaTitle: { ar: "التقشير الكيميائي: الأنواع والفوائد | كايرو كوزمو", en: "Chemical Peel Guide | Cairo Cosmo" },
      metaDescription: { ar: "تعرف على أنواع التقشير الكيميائي ومتى تظهر النتائج وتعليمات قبل وبعد الجلسة للحصول على بشرة أنعم وإشراقة أفضل.", en: "Learn chemical peel types, when results show, and before/after care tips for smoother, brighter skin." },
      keywords: { ar: "تقشير كيميائي, تصبغات, آثار الحبوب, تقشير سطحي, تقشير متوسط", en: "chemical peel, pigmentation, acne marks, superficial peel, medium peel" },
      ogImage: img("chemical-peels-og.png"),
    },
    cardImage: img("chemical-peels-Inlineslot2.png"),
    coverImage: img("chemical-peels-Inlineslot2.png"),
    gallery: [
      { src: img("chemical-peels-Inlineslot1.png"), alt: { ar: "جلسة تقشير كيميائي", en: "Chemical peel session" } },
      { src: img("chemical-peels-Inlineslot2.png"), alt: { ar: "عناية بعد التقشير", en: "Post-peel care" } },
    ],
    dateISO: "2026-01-27",
  },

  {
    id: "p5",
    slug: "skin-rejuvenation-options",
    title: { ar: "تجديد البشرة: أفضل الخيارات حسب نوع بشرتك", en: "Skin rejuvenation: best options for your skin type" },
    excerpt: { ar: "كيف تختار بين النضارة، الترطيب العميق، أو تحفيز الكولاجين؟ دليل سريع وخطة جلسات.", en: "How to choose glow, deep hydration, or collagen stimulation: a practical guide." },
    content: {
      ar: `
        <p>هدف <strong>تجديد البشرة</strong> هو تحسين الملمس والإشراقة وتقليل بهتان الجلد تدريجيًا. الاختيار الصحيح يعتمد على <strong>نوع البشرة</strong> والمشكلة الأساسية: تصبغات، مسام، جفاف، أو آثار حبوب.</p>

        <figure data-image-slot="1"></figure>

        <h2>3 مسارات شائعة لتجديد البشرة</h2>
        <ul>
          <li><strong>نضارة وترطيب:</strong> لبشرة مرهقة أو جافة.</li>
          <li><strong>تحسين الملمس والمسام:</strong> عند وجود مسام واضحة أو خشونة.</li>
          <li><strong>تحفيز الكولاجين:</strong> لشد خفيف وتحسين تدريجي طويل المدى.</li>
        </ul>

        <h2>متى تظهر النتائج؟</h2>
        <p>التحسن غالبًا تدريجي ويظهر مع الالتزام بالخطة + واقي الشمس + روتين مناسب.</p>

        <figure data-image-slot="2"></figure>

        <h2>روتين بسيط يثبت النتيجة</h2>
        <ul>
          <li>غسول لطيف</li>
          <li>مرطب مناسب</li>
          <li><strong>واقي شمس</strong> يوميًا</li>
        </ul>

        <div data-video-slot="1"></div>
      `,
      en: `
        <p><strong>Skin rejuvenation</strong> aims to improve texture, glow, and reduce dullness over time. The right choice depends on your <strong>skin type</strong> and the main concern: pigmentation, pores, dehydration, or post-acne marks.</p>

        <figure data-image-slot="1"></figure>

        <h2>3 common rejuvenation paths</h2>
        <ul>
          <li><strong>Glow & hydration:</strong> for tired or dry skin.</li>
          <li><strong>Texture & pores:</strong> for visible pores and roughness.</li>
          <li><strong>Collagen stimulation:</strong> for gradual firming and long-term improvement.</li>
        </ul>

        <h2>When do results show?</h2>
        <p>Results are often progressive and improve with a good plan + sunscreen + supportive skincare.</p>

        <figure data-image-slot="2"></figure>

        <h2>Simple routine that protects results</h2>
        <ul>
          <li>Gentle cleanser</li>
          <li>Appropriate moisturizer</li>
          <li><strong>Sunscreen</strong> daily</li>
        </ul>

        <div data-video-slot="1"></div>
      `,
    },
    category: "service",
    serviceSlug: "rejuvenation",
    seo: {
      metaTitle: { ar: "تجديد البشرة: أفضل الخيارات حسب نوع بشرتك | كايرو كوزمو", en: "Skin Rejuvenation Options | Cairo Cosmo" },
      metaDescription: { ar: "دليل لتجديد البشرة: خيارات النضارة والترطيب وتحفيز الكولاجين ومتى تظهر النتائج وكيف تثبتينها بروتين بسيط.", en: "A practical guide to rejuvenation: glow/hydration/collagen options, results timeline, and how to maintain improvements." },
      keywords: { ar: "تجديد البشرة, نضارة, تحفيز كولاجين, ترطيب عميق, مسام", en: "skin rejuvenation, glow, collagen, deep hydration, pores" },
      ogImage: img("Skin-rejuvenation-og.png"),
    },
    cardImage: img("Skin-rejuvenation-card.png"),
    coverImage: img("Skin-rejuvenation-cover.png"),
    gallery: [
      { src: img("Skin-rejuvenation-Inline-slot1.png"), alt: { ar: "جلسة تجديد البشرة", en: "Skin rejuvenation session" } },
      { src: img("Skin-rejuvenation-Inline-slot2.png"), alt: { ar: "تحسين نضارة البشرة", en: "Improved skin glow" } },
    ],
    dateISO: "2026-01-28",
  },

  // -------------------- Doctor Articles --------------------

  {
    id: "d1",
    slug: "dr-bassam-zaki-non-surgical-aesthetics",
    title: {
      ar: "د. باسم زكي: كيف نحقق نتيجة طبيعية في التجميل بدون جراحة؟",
      en: "Dr. Basam Zaki: How to achieve natural non-surgical aesthetics",
    },
    excerpt: {
      ar: "فلسفة التدرّج وتقييم الوجه كاملًا: كيف نصل لنتيجة طبيعية وراقية بدون مبالغة مع خطة واضحة وخيارات غير جراحية.",
      en: "A natural-look framework: gradual enhancement, full-face assessment, and a clear non-surgical plan.",
    },
    content: {
      ar: `
        <p>
          في <strong>كايرو كوزمو (Cairo Cosmo Center)</strong> هدفنا مش “تغيير الملامح”…
          الهدف هو <strong>إبرازها</strong> بشكل طبيعي ومتوازن. وده بالضبط الأساس اللي بيعتمد عليه
          <strong>د. باسم زكي</strong> في التجميل بدون جراحة: نتيجة هادئة، محسوبة، ومناسبة لنِسَب الوجه.
        </p>

        <figure data-image-slot="1"></figure>

        <h2>ليه “النتيجة الطبيعية” هي الأفضل؟</h2>
        <p>
          لأن الجمال الحقيقي بيبان في التفاصيل: تقليل خطوط التعبير بدون جمود، تحسين التناسق بدون مبالغة،
          وخطة تحافظ على ملامحك بدل ما تغيرها. النتيجة الطبيعية كمان بتكون أسهل في الصيانة على المدى الطويل.
        </p>

        <h2>3 قواعد لنتيجة طبيعية بدون جراحة</h2>
        <ol>
          <li><strong>التدرّج</strong>: خطوة صغيرة + تقييم + خطوة تانية لو احتجنا.</li>
          <li><strong>الخامة المناسبة للمنطقة</strong>: مش كل مادة أو إجراء ينفع لكل مكان.</li>
          <li><strong>تقييم الوجه بالكامل</strong>: التوازن أهم من تكبير جزء واحد.</li>
        </ol>

        <h2>أشهر الحالات اللي بنبدأ فيها بخطة “هادئة”</h2>
        <ul>
          <li><strong>خطوط تعبير</strong> (جبهة/عبوس/حول العين) مع الحفاظ على تعبير الوجه.</li>
          <li><strong>فقدان حجم بسيط</strong> في الخد أو تحت العين (حسب التقييم).</li>
          <li><strong>بهتان وإجهاد البشرة</strong> اللي محتاج تجديد ونضارة قبل أي خطوة شكلية.</li>
        </ul>

        <h2>مسار الاستشارة في Cairo Cosmo Center</h2>
        <ol>
          <li><strong>تقييم الوجه</strong>: ملاحظة النِسَب، الحركة، جودة الجلد، وأولوية التحسين.</li>
          <li><strong>اقتراح خطة</strong>: جلسة واحدة أو كورس جلسات حسب الهدف (مش ترند).</li>
          <li><strong>توقعات واقعية</strong>: إيه اللي هيتحسن فورًا وإيه اللي يحتاج وقت.</li>
          <li><strong>متابعة</strong>: مراجعة بعد الإجراء عند الحاجة لضبط التفاصيل.</li>
        </ol>

        <h2>روابط داخلية مفيدة قبل ما تقرري</h2>
        <ul>
          <li><a href="/ar/blog/botox-benefits">فوائد البوتوكس ومتى تظهر النتائج؟</a></li>
          <li><a href="/ar/blog/dermal-fillers-guide">دليل الفيلر: الأنواع والاستخدامات وأخطاء شائعة</a></li>
          <li><a href="/ar/blog/botox-vs-fillers">بوتوكس أم فيلر؟ الفرق ومتى نختار كل واحد</a></li>
          <li><a href="/ar/blog/skin-rejuvenation-options">تجديد البشرة: أفضل الخيارات حسب نوع بشرتك</a></li>
        </ul>

        <h2>مصادر طبية موثوقة (روابط خارجية)</h2>
        <ul>
          <li>
            <a href="https://www.nhs.uk/conditions/cosmetic-procedures/cosmetic-injections/botulinum-toxin/"
               target="_blank" rel="nofollow noopener">
              NHS: Botox (Botulinum toxin)
            </a>
          </li>
          <li>
            <a href="https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin"
               target="_blank" rel="nofollow noopener">
              AAD: Botulinum toxin for wrinkles
            </a>
          </li>
          <li>
            <a href="https://www.aad.org/public/cosmetic/fillers"
               target="_blank" rel="nofollow noopener">
              AAD: Dermal fillers
            </a>
          </li>
        </ul>

        <h2>أسئلة شائعة</h2>
        <h3>هل ممكن أوصل لنتيجة طبيعية حتى لو عايزة فرق واضح؟</h3>
        <p>
          نعم، الفكرة إن الفرق يكون <strong>محسوب</strong> ومتدرج، وده عادةً يعطي شكل “راقي” بدل تغيّر مفاجئ.
        </p>

        <h3>إمتى أعرف إنّي محتاجة خطة كاملة مش إجراء واحد؟</h3>
        <p>
          لما تكون المشكلة مركبة: خطوط + فقدان حجم بسيط + جودة جلد محتاجة تحسين. وقتها الخطة المتوازنة أفضل.
        </p>

        <h2>تابع د. باسم زكي</h2>
        <p>
          <a href="https://www.facebook.com/DrBasimZaki/?locale=ar_AR" target="_blank" rel="nofollow noopener">
            صفحة د. باسم زكي على فيسبوك
          </a>
        </p>
      `,
      en: `
        <p>
          At <strong>Cairo Cosmo Center</strong>, the goal isn’t to “change” your features,
          it’s to <strong>enhance</strong> them naturally and proportionally. That’s the core of
          <strong>Dr. Basam Zaki</strong>’s approach to non-surgical aesthetics: subtle, precise,
          and tailored to facial harmony.
        </p>

        <figure data-image-slot="1"></figure>

        <h2>Why natural-looking results matter</h2>
        <p>
          Natural outcomes age better, feel more authentic, and are easier to maintain.
          The best results soften expression lines without freezing, refine proportions without exaggeration,
          and preserve your identity.
        </p>

        <h2>3 rules for natural non-surgical results</h2>
        <ol>
          <li><strong>Go gradual</strong>: small steps, assess, then refine.</li>
          <li><strong>Choose the right material for the area</strong>: not every option fits every zone.</li>
          <li><strong>Full-face assessment</strong>: harmony beats focusing on a single feature.</li>
        </ol>

        <h2>Common starting points</h2>
        <ul>
          <li><strong>Expression lines</strong> (forehead / frown / crow’s feet) while keeping movement natural.</li>
          <li><strong>Subtle volume restoration</strong> (case dependent).</li>
          <li><strong>Skin quality upgrades</strong> before any structural enhancements.</li>
        </ul>

        <h2>Your consultation journey at Cairo Cosmo Center</h2>
        <ol>
          <li><strong>Assessment</strong>: proportions, movement, skin quality, priorities.</li>
          <li><strong>Plan</strong>: single session vs staged course.</li>
          <li><strong>Expectations</strong>: what improves fast vs what takes time.</li>
          <li><strong>Follow-up</strong>: refine if needed.</li>
        </ol>

        <h2>Internal links you may find helpful</h2>
        <ul>
          <li><a href="/en/blog/botox-benefits">Botox benefits and when results appear</a></li>
          <li><a href="/en/blog/dermal-fillers-guide">Dermal fillers: types, uses, and common mistakes</a></li>
          <li><a href="/en/blog/botox-vs-fillers">Botox vs Fillers: when to choose each</a></li>
          <li><a href="/en/blog/skin-rejuvenation-options">Skin rejuvenation options for your skin type</a></li>
        </ul>

        <h2>Trusted medical resources</h2>
        <ul>
          <li>
            <a href="https://www.nhs.uk/conditions/cosmetic-procedures/cosmetic-injections/botulinum-toxin/"
               target="_blank" rel="nofollow noopener">
              NHS: Botox overview
            </a>
          </li>
          <li>
            <a href="https://www.aad.org/public/cosmetic/wrinkles/botulinum-toxin"
               target="_blank" rel="nofollow noopener">
              AAD: Botox for wrinkles
            </a>
          </li>
          <li>
            <a href="https://www.aad.org/public/cosmetic/fillers"
               target="_blank" rel="nofollow noopener">
              AAD: Dermal fillers
            </a>
          </li>
        </ul>

        <h2>FAQ</h2>
        <h3>Can results be natural yet noticeable?</h3>
        <p>
          Yes. The key is staged improvement with proper placement and balanced proportions.
        </p>

        <h3>When do I need a plan, not just one procedure?</h3>
        <p>
          When concerns overlap (lines + mild volume loss + skin quality). A structured plan works best.
        </p>

        <h2>Follow Dr. Basam Zaki</h2>
        <p>
          <a href="https://www.facebook.com/DrBasimZaki/?locale=ar_AR" target="_blank" rel="nofollow noopener">
            Dr. Basam Zaki on Facebook
          </a>
        </p>
      `,
    },
    category: "doctor",
    doctorSlug: "dr-bassam-zaki",
    seo: {
      metaTitle: {
        ar: "د. باسم زكي | نتيجة طبيعية في التجميل بدون جراحة - كايرو كوزمو",
        en: "Dr. Basam Zaki | Natural Non-Surgical Aesthetics - Cairo Cosmo",
      },
      metaDescription: {
        ar: "تعرف على فلسفة د. باسم زكي في Cairo Cosmo Center للوصول لنتائج طبيعية بدون مبالغة: تدرّج، تقييم الوجه بالكامل، وخطة علاج غير جراحية.",
        en: "Discover Dr. Basam Zaki’s natural approach at Cairo Cosmo Center: gradual enhancement, full-face assessment, and a non-surgical plan.",
      },
      keywords: {
        ar: "د. باسم زكي, كايرو كوزمو, Cairo Cosmo Center, تجميل بدون جراحة, نتيجة طبيعية, بوتوكس, فيلر, تقييم الوجه",
        en: "Dr. Basam Zaki, Cairo Cosmo Center, non-surgical aesthetics, natural results, botox, fillers, facial assessment",
      },
      ogImage: img("bassim-zaki.png"),
    },
    cardImage: img("bassim-zaki.png"),
    coverImage: img("bassim-zaki.png"),
    gallery: [
      { src: img("dr-bassemzaki-blog.png"), alt: { ar: "استشارة تجميل في كايرو كوزمو", en: "Aesthetic consultation at Cairo Cosmo Center" } },
    ],
    dateISO: "2026-01-24",
  },
  {
  id: "p5",
  slug: "body-contouring-after-weight-loss",
  title: { 
    ar: "شد الترهلات بعد التكميم: الحل الطبي لاستعادة شكل الجسم", 
    en: "Body Contouring After Gastric Sleeve: The Medical Solution" 
  },
  excerpt: { 
    ar: "دليلك الشامل لعمليات شد الجسم بعد فقدان الوزن الكبير: الأسباب، المناطق المستهدفة، الوقت المناسب، وأفضل الحلول الطبية مع د. باسم زكي.", 
    en: "Comprehensive guide to body contouring after significant weight loss: target areas, timing, and results with Dr. Bassem Zaki." 
  },
  content: {
    ar: `
      <p>تُعد عمليات <strong>تكميم المعدة</strong> وتحويل المسار من أنجح الحلول لعلاج السمنة المفرطة، وقد ساعدت آلاف المرضى في مصر على فقدان وزن كبير وتحسين صحتهم بشكل ملحوظ. لكن بعد فقدان الوزن، يواجه كثير من المرضى مشكلة شائعة وهي <strong>ترهلات الجلد بعد التكميم</strong>.</p>

      <p>قد تظهر هذه الترهلات في عدة مناطق من الجسم مثل البطن، الذراعين، الفخذين، الصدر والظهر، وقد تؤثر على الشكل العام للجسم وعلى ثقة المريض بنفسه.</p>

      <p>هنا تأتي أهمية <strong>عمليات شد الترهلات بعد التكميم</strong>، والتي تهدف إلى إزالة الجلد الزائد وإعادة تشكيل الجسم ليصبح أكثر تناسقًا.</p>

      <figure data-image-slot="1"></figure>

      <h2>لماذا تحدث الترهلات بعد التكميم؟</h2>
      <p>بعد عمليات السمنة يفقد الجسم كميات كبيرة من الدهون خلال فترة قصيرة، لكن الجلد الذي كان متمددًا لفترة طويلة قد لا يستطيع الانكماش مرة أخرى بنفس الكفاءة.</p>

      <h3>أهم الأسباب</h3>
      <ul>
        <li>فقدان وزن سريع وكبير.</li>
        <li>ضعف مرونة الجلد.</li>
        <li>التقدم في العمر.</li>
        <li>العوامل الوراثية.</li>
        <li>عدم ممارسة الرياضة.</li>
      </ul>

      <h2>أشهر مناطق الترهلات</h2>
      <ul>
        <li><strong>البطن:</strong> جلد زائد وضعف في العضلات.</li>
        <li><strong>الذراعين:</strong> ما يعرف بأجنحة الذراعين.</li>
        <li><strong>الفخذين:</strong> خاصة المنطقة الداخلية.</li>
        <li><strong>الصدر والظهر:</strong> ترهلات تؤثر على القوام العام.</li>
      </ul>

      <figure data-image-slot="2"></figure>

      <h2>متى يمكن إجراء عملية شد الترهلات؟</h2>
      <ul>
        <li>استقرار الوزن لمدة 6 إلى 12 شهر.</li>
        <li>الوصول إلى الوزن المثالي.</li>
        <li>استقرار الحالة الصحية.</li>
      </ul>

      <h2>أنواع عمليات شد الترهلات</h2>

      <h3>شد البطن</h3>
      <p>يشمل إزالة الجلد الزائد وشد العضلات للحصول على بطن مشدودة.</p>

      <h3>شد الذراعين</h3>
      <p>للتخلص من الجلد المترهل وتحسين الشكل العام.</p>

      <h3>شد الفخذين</h3>
      <p>لتقليل الاحتكاك وتحسين تناسق الساقين.</p>

      <h3>شد الجسم الكامل</h3>
      <p>يتم في الحالات الشديدة للحصول على نتيجة متكاملة.</p>

      <h2>هل يمكن العلاج بدون جراحة؟</h2>
      <p>في الحالات البسيطة يمكن استخدام الليزر أو الأجهزة، لكن في الحالات الشديدة الجراحة هي الحل الأفضل.</p>

      <h2>فوائد العملية</h2>
      <ul>
        <li>تحسين شكل الجسم.</li>
        <li>زيادة الثقة بالنفس.</li>
        <li>سهولة الحركة.</li>
        <li>تقليل الالتهابات الجلدية.</li>
      </ul>

      <h2>فترة التعافي</h2>
      <ul>
        <li>حركة خفيفة خلال أسبوعين.</li>
        <li>العودة للعمل خلال 2-3 أسابيع.</li>
        <li>النتائج النهائية خلال عدة أشهر.</li>
      </ul>

      <h2>نصائح مهمة</h2>
      <ul>
        <li>ممارسة الرياضة.</li>
        <li>شرب الماء.</li>
        <li>تناول البروتين.</li>
        <li>الحفاظ على الوزن.</li>
      </ul>

      <h2>الخلاصة</h2>
      <p>عمليات شد الترهلات بعد التكميم خطوة مهمة لاستكمال رحلة فقدان الوزن واستعادة القوام المتناسق.</p>

      <h2>احجز استشارة</h2>
      <p>
        <strong>د. باسم زكي</strong><br/>
        بروفيسور جراحة التجميل – كلية طب عين شمس
      </p>

      <p>
        <a href="https://www.facebook.com/CCosmoCenter" target="_blank">Facebook</a> ·
        <a href="https://www.instagram.com/cairocosmocenter" target="_blank">Instagram</a>
      </p>

      <div data-video-slot="1"></div>
    `,
    en: `
      <p><strong>Gastric sleeve</strong> and bypass surgeries are successful obesity treatments, but significant weight loss often leaves patients with <strong>sagging skin</strong> that impacts self-confidence.</p>

      <figure data-image-slot="1"></figure>

      <h2>Why does skin sag after weight loss?</h2>
      <p>Rapid weight loss doesn't allow stretched skin enough time to retract. Factors like skin elasticity, age, and genetics play a major role.</p>

      <h2>Common Target Areas</h2>
      <ul>
        <li><strong>Abdomen</strong></li>
        <li><strong>Arms</strong></li>
        <li><strong>Thighs</strong></li>
        <li><strong>Back & Chest</strong></li>
      </ul>

      <figure data-image-slot="2"></figure>

      <h2>When is the right time?</h2>
      <p>After weight stabilization for 6–12 months.</p>

      <h2>Recovery</h2>
      <p>Light activity within 2 weeks, full results over months.</p>

      <h2>Follow Us</h2>
      <p>
        <a href="https://www.facebook.com/CCosmoCenter" target="_blank">Facebook</a> ·
        <a href="https://www.instagram.com/cairocosmocenter" target="_blank">Instagram</a>
      </p>

      <div data-video-slot="1"></div>
    `,
  },
  category: "doctor",
  doctorSlug: "dr-bassem-zaki",
  serviceSlug: "body-contouring",
  seo: {
    metaTitle: { 
      ar: "شد الترهلات بعد التكميم | د. باسم زكي", 
      en: "Body Contouring After Gastric Sleeve | Dr. Bassem Zaki" 
    },
    metaDescription: {
      ar: "تعرف على أفضل الحلول الطبية لشد الترهلات بعد فقدان الوزن مع د. باسم زكي.",
      en: "Discover the best medical solutions for skin tightening after weight loss."
    },
    keywords: { 
      ar: "شد الترهلات, تكميم المعدة, شد الجسم, دكتور باسم زكي", 
      en: "body contouring, gastric sleeve, skin tightening" 
    },
    ogImage: img("body-contouring-og.png"),
  },
  cardImage: img("body-contouring-card.png"),
  coverImage: img("body-contouring-cover.jpg"),
  dateISO: "2026-03-17",
},

  {
    id: "d2",
    slug: "prof-ahmed-el-sherif-advanced-procedures",
    title: {
      ar: "أ.د. أحمد الشريف: متى نختار الإجراء المتقدم؟",
      en: "Prof. Ahmed El Sherif: When to choose advanced procedures",
    },
    excerpt: {
      ar: "دليل عملي لاختيار الإجراء المتقدم عند الحاجة: تقييم الجلد، درجة الترهل، وتوقعات واقعية مع خطة متابعة.",
      en: "A practical decision guide: skin assessment, laxity level, realistic goals, and follow-up planning.",
    },
    content: {
      ar: `
        <p>
          في <strong>كايرو كوزمو (Cairo Cosmo Center)</strong> بنؤمن إن اختيار الإجراء الصح يبدأ بـ
          <strong>تقييم شامل</strong> وليس “ترند”. وده اللي بيركز عليه <strong>أ.د. أحمد الشريف</strong>:
          متى نكتفي بخيارات بسيطة؟ ومتى نحتاج إجراء متقدم علشان نحقق نتيجة آمنة وواقعية؟
        </p>

        <figure data-image-slot="1"></figure>

        <h2>متى نحتاج إجراء متقدم؟</h2>
        <ul>
          <li><strong>ترهل واضح</strong> لا يستجيب للخيارات البسيطة أو التحسينات السطحية.</li>
          <li><strong>مشاكل جلد مركبة</strong> تحتاج خطة متكاملة (ملمس + تصبغات + مرونة).</li>
          <li><strong>هدف محدد</strong> وتوقعات واقعية مع استعداد للمتابعة.</li>
        </ul>

        <h2>علامات تساعدنا نقرر (قبل أي اختيار)</h2>
        <ol>
          <li><strong>درجة الترهل</strong>: بسيط، متوسط، شديد.</li>
          <li><strong>جودة الجلد</strong>: سمك الجلد، المرونة، آثار الحبوب/التصبغات.</li>
          <li><strong>العمر ونمط الحياة</strong>: شمس، تدخين، نوم، عادات.</li>
          <li><strong>النتيجة المطلوبة</strong>: فرق بسيط ولا تحسين ملحوظ؟</li>
        </ol>

        <h2>ليه خطة المتابعة مهمة؟</h2>
        <p>
          الإجراءات المتقدمة غالبًا تحتاج <strong>متابعة</strong> وتدرج أو دمج مع روتين/جلسات داعمة.
          النتيجة الأفضل مش “جلسة وخلاص”، بل خطة ذكية تحافظ على التحسن.
        </p>

        <h2>روابط داخلية مفيدة</h2>
        <ul>
          <li><a href="/ar/blog/how-to-choose-your-aesthetic-plan">كيف تختار خطة التجميل المناسبة؟ (بدون تسرّع)</a></li>
          <li><a href="/ar/blog/skin-rejuvenation-options">تجديد البشرة: أفضل الخيارات حسب نوع بشرتك</a></li>
          <li><a href="/ar/blog/chemical-peels-guide">التقشير الكيميائي: الأنواع والفوائد ومتى تظهر النتيجة</a></li>
        </ul>

        <h2>مصادر طبية موثوقة (روابط خارجية)</h2>
        <ul>
          <li>
            <a href="https://www.aad.org/public/cosmetic"
               target="_blank" rel="nofollow noopener">
              AAD: Cosmetic treatments overview
            </a>
          </li>
          <li>
            <a href="https://www.nhs.uk/conditions/cosmetic-procedures/"
               target="_blank" rel="nofollow noopener">
              NHS: Cosmetic procedures guidance
            </a>
          </li>
        </ul>

        <h2>أسئلة شائعة</h2>
        <h3>هل الإجراء المتقدم مناسب لأي شخص؟</h3>
        <p>
          مش دايمًا. الاختيار يعتمد على <strong>التقييم</strong> وجودة الجلد وهدف الحالة.
          أحيانًا إجراء أبسط بخطة صحيحة يدي نتيجة أفضل.
        </p>

        <h3>هل لازم أبدأ بإجراء كبير؟</h3>
        <p>
          غالبًا الأفضل هو <strong>التدرّج</strong>: نبدأ بما يناسب الحالة ونبني عليه لو احتجنا.
        </p>
      `,
      en: `
        <p>
          At <strong>Cairo Cosmo Center</strong>, choosing the right option starts with proper
          <strong>clinical assessment</strong>, not trends. <strong>Prof. Ahmed El Sherif</strong> focuses on one key question:
          when is a simple option enough, and when do we need an advanced procedure to achieve safe, realistic outcomes?
        </p>

        <figure data-image-slot="1"></figure>

        <h2>When do we consider an advanced option?</h2>
        <ul>
          <li><strong>Visible laxity</strong> that doesn’t respond to simpler approaches.</li>
          <li><strong>Complex skin concerns</strong> requiring a structured plan (texture + pigmentation + elasticity).</li>
          <li><strong>Clear goals</strong> with realistic expectations and follow-up readiness.</li>
        </ul>

        <h2>Decision factors before choosing</h2>
        <ol>
          <li><strong>Laxity level</strong>: mild, moderate, significant.</li>
          <li><strong>Skin quality</strong>: thickness, elasticity, acne marks, pigmentation.</li>
          <li><strong>Age & lifestyle</strong>: sun exposure, smoking, sleep, habits.</li>
          <li><strong>Goal clarity</strong>: subtle refinement vs noticeable improvement.</li>
        </ol>

        <h2>Why follow-up planning matters</h2>
        <p>
          Advanced procedures often benefit from staged follow-up and supportive skincare.
          The best results come from a smart plan, not a single isolated session.
        </p>

        <h2>Internal links</h2>
        <ul>
          <li><a href="/en/blog/how-to-choose-your-aesthetic-plan">How to choose the right aesthetic plan</a></li>
          <li><a href="/en/blog/skin-rejuvenation-options">Skin rejuvenation options</a></li>
          <li><a href="/en/blog/chemical-peels-guide">Chemical peels guide</a></li>
        </ul>

        <h2>Trusted resources</h2>
        <ul>
          <li>
            <a href="https://www.aad.org/public/cosmetic"
               target="_blank" rel="nofollow noopener">
              AAD: Cosmetic treatments overview
            </a>
          </li>
          <li>
            <a href="https://www.nhs.uk/conditions/cosmetic-procedures/"
               target="_blank" rel="nofollow noopener">
              NHS: Cosmetic procedures guidance
            </a>
          </li>
        </ul>

        <h2>FAQ</h2>
        <h3>Is an advanced option right for everyone?</h3>
        <p>
          Not always. Suitability depends on assessment, skin quality, and goals. Sometimes simpler options work best.
        </p>

        <h3>Do I need to start with the biggest step?</h3>
        <p>
          Usually no. A gradual, structured approach often produces the most refined results.
        </p>
      `,
    },
    category: "doctor",
    doctorSlug: "prof-ahmed-el-sherif",
    seo: {
      metaTitle: {
        ar: "أ.د. أحمد الشريف | متى نختار الإجراء المتقدم؟ - كايرو كوزمو",
        en: "Prof. Ahmed El Sherif | When to Choose Advanced Procedures - Cairo Cosmo",
      },
      metaDescription: {
        ar: "دليل مبسط من Cairo Cosmo Center مع أ.د. أحمد الشريف: مؤشرات اختيار الإجراء المتقدم، عوامل التقييم، وأهمية خطة المتابعة لنتيجة آمنة وواقعية.",
        en: "A Cairo Cosmo Center guide by Prof. Ahmed El Sherif: when advanced options make sense, decision factors, and why follow-up planning matters.",
      },
      keywords: {
        ar: "أ.د. أحمد الشريف, كايرو كوزمو, Cairo Cosmo Center, إجراء متقدم, شد, ترهل, تقييم الجلد, خطة تجميل",
        en: "Prof. Ahmed El Sherif, Cairo Cosmo Center, advanced procedures, laxity, skin assessment, aesthetic plan",
      },
      ogImage: img("ahmed.jpeg"),
    },
    cardImage: img("ahmed.jpeg"),
    coverImage: img("ahmed.jpeg"),
    gallery: [
      { src: img("dr-ahmed-alshrif-blog.png"), alt: { ar: "تقييم وإجراء تجميلي متقدم", en: "Assessment for advanced aesthetic procedure" } },
    ],
    dateISO: "2026-01-25",
  },

  {
    id: "d3",
    slug: "prof-nahed-samir-skin-health",
    title: {
      ar: "أ.د. ناهد سمير: أساس البشرة الصحية قبل أي تجميل",
      en: "Prof. Nahed Samir: Skin health before any aesthetic treatment",
    },
    excerpt: {
      ar: "قبل أي إجراء تجميلي: بناء أساس قوي للبشرة بروتين بسيط، تقييم طبي، وخطة علاج تثبت النتائج.",
      en: "Before any aesthetic step: build skin health with a simple routine, medical assessment, and a plan that protects results.",
    },
    content: {
      ar: `
        <p>
          أقوى نتيجة تجميل تبدأ من <strong>جلد صحي</strong>. في <strong>كايرو كوزمو (Cairo Cosmo Center)</strong>
          تركّز <strong>أ.د. ناهد سمير</strong> على الأساس: ترطيب، حماية من الشمس، وعلاج المشكلات الجلدية قبل أي خطوة تجميلية.
          لأن “جلد قوي” يعني نتائج أجمل وتستمر أطول.
        </p>

        <figure data-image-slot="1"></figure>

        <h2>ليه صحة البشرة مهمة قبل أي تجميل؟</h2>
        <ul>
          <li>لأن أي إجراء يبان أحسن على بشرة مرطبة ومحميّة.</li>
          <li>لأن التصبغات/الحبوب أو الالتهاب يقلل جودة النتيجة.</li>
          <li>لأن الروتين الصحيح يحافظ على التحسن ويطوّل عمره.</li>
        </ul>

        <h2>3 خطوات تثبت النتائج (قاعدة ذهبية)</h2>
        <ol>
          <li><strong>ترطيب + إصلاح الحاجز</strong>: منتجات لطيفة مناسبة لنوع البشرة.</li>
          <li><strong>واقي شمس يوميًا</strong>: أهم خطوة لتثبيت أي تحسن.</li>
          <li><strong>اختيار علاج مناسب للحالة</strong>: تصبغات، مسام، آثار حبوب… حسب التقييم.</li>
        </ol>

        <h2>روتين بسيط (يخدم أغلب الحالات)</h2>
        <h3>صباحًا</h3>
        <ul>
          <li>غسول لطيف</li>
          <li>مرطب مناسب</li>
          <li><strong>واقي شمس</strong> (إعادة وضعه حسب الحاجة)</li>
        </ul>

        <h3>مساءً</h3>
        <ul>
          <li>تنظيف لطيف</li>
          <li>مرطب/مهدئ</li>
          <li>منتج علاجي حسب الحالة (يوصف بعد التقييم)</li>
        </ul>

        <h2>روابط داخلية مرتبطة بالبشرة</h2>
        <ul>
          <li><a href="/ar/blog/skin-rejuvenation-options">تجديد البشرة: أفضل الخيارات حسب نوع بشرتك</a></li>
          <li><a href="/ar/blog/chemical-peels-guide">التقشير الكيميائي: الأنواع والفوائد ومتى تظهر النتيجة</a></li>
          <li><a href="/ar/blog/how-to-choose-your-aesthetic-plan">كيف تختار خطة التجميل المناسبة؟ (بدون تسرّع)</a></li>
        </ul>

        <h2>مصادر طبية موثوقة (روابط خارجية)</h2>
        <ul>
          <li>
            <a href="https://www.aad.org/public/everyday-care"
               target="_blank" rel="nofollow noopener">
              AAD: Everyday skincare & skin health
            </a>
          </li>
          <li>
            <a href="https://www.aad.org/public/everyday-care/sun-protection/sunscreen-patients"
               target="_blank" rel="nofollow noopener">
              AAD: Sunscreen basics
            </a>
          </li>
        </ul>

        <h2>أسئلة شائعة</h2>
        <h3>هل ينفع أعمل إجراء تجميلي وأنا عندي حبوب نشطة؟</h3>
        <p>
          أحيانًا لازم نبدأ بعلاج الحبوب/الالتهاب الأول علشان نحمي البشرة ونضمن نتيجة أفضل. القرار يعتمد على التقييم.
        </p>

        <h3>أنا ببقى ملتزمة أسبوعين وبعدين أوقف.. إزاي أثبّت؟</h3>
        <p>
          خليك على “الأبسط”: غسول لطيف + مرطب + <strong>واقي شمس</strong>. ده أساس ثابت، وبعده نضيف علاجات حسب الحاجة.
        </p>
      `,
      en: `
        <p>
          The best aesthetic outcomes start with <strong>healthy skin</strong>. At <strong>Cairo Cosmo Center</strong>,
          <strong>Prof. Nahed Samir</strong> prioritizes skin fundamentals: hydration, sun protection, and targeted treatment
          before any aesthetic step. Strong skin means better results and longer-lasting improvements.
        </p>

        <figure data-image-slot="1"></figure>

        <h2>Why skin health comes first</h2>
        <ul>
          <li>Procedures look better on hydrated, protected skin.</li>
          <li>Pigmentation, acne, or inflammation can reduce outcome quality.</li>
          <li>A good routine maintains improvements over time.</li>
        </ul>

        <h2>3 steps to lock in results</h2>
        <ol>
          <li><strong>Hydrate + support the skin barrier</strong>.</li>
          <li><strong>Daily sunscreen</strong> (the most important step).</li>
          <li><strong>Targeted treatment</strong> based on your concern.</li>
        </ol>

        <h2>A simple routine that works for many</h2>
        <h3>Morning</h3>
        <ul>
          <li>Gentle cleanser</li>
          <li>Moisturizer</li>
          <li><strong>Sunscreen</strong> (reapply as needed)</li>
        </ul>

        <h3>Evening</h3>
        <ul>
          <li>Gentle cleanse</li>
          <li>Moisturize/soothe</li>
          <li>Targeted product (based on assessment)</li>
        </ul>

        <h2>Internal links</h2>
        <ul>
          <li><a href="/en/blog/skin-rejuvenation-options">Skin rejuvenation options</a></li>
          <li><a href="/en/blog/chemical-peels-guide">Chemical peels guide</a></li>
          <li><a href="/en/blog/how-to-choose-your-aesthetic-plan">How to choose the right aesthetic plan</a></li>
        </ul>

        <h2>Trusted resources</h2>
        <ul>
          <li>
            <a href="https://www.aad.org/public/everyday-care"
               target="_blank" rel="nofollow noopener">
              AAD: Everyday skincare & skin health
            </a>
          </li>
          <li>
            <a href="https://www.aad.org/public/everyday-care/sun-protection/sunscreen-patients"
               target="_blank" rel="nofollow noopener">
              AAD: Sunscreen basics
            </a>
          </li>
        </ul>

        <h2>FAQ</h2>
        <h3>Can I do aesthetic treatments with active acne?</h3>
        <p>
          Sometimes we treat inflammation first to protect the skin and improve outcomes. It depends on assessment.
        </p>

        <h3>I stay consistent for 2 weeks then stop, how do I maintain?</h3>
        <p>
          Keep the basics: gentle cleanser + moisturizer + <strong>sunscreen</strong>. Then add targeted steps as needed.
        </p>
      `,
    },
    category: "doctor",
    doctorSlug: "prof-nahed-samir",
    seo: {
      metaTitle: {
        ar: "أ.د. ناهد سمير | أساس البشرة الصحية قبل أي تجميل - كايرو كوزمو",
        en: "Prof. Nahed Samir | Skin Health First - Cairo Cosmo",
      },
      metaDescription: {
        ar: "إرشادات عملية من Cairo Cosmo Center مع أ.د. ناهد سمير: روتين بسيط، واقي شمس، وعلاج مناسب لتثبيت النتائج قبل وبعد أي إجراء تجميلي.",
        en: "A Cairo Cosmo Center guide by Prof. Nahed Samir: simple routine, sunscreen, and targeted treatment to protect results before/after aesthetics.",
      },
      keywords: {
        ar: "أ.د. ناهد سمير, كايرو كوزمو, Cairo Cosmo Center, صحة البشرة, واقي شمس, ترطيب, علاج التصبغات, آثار الحبوب",
        en: "Prof. Nahed Samir, Cairo Cosmo Center, skin health, sunscreen, hydration, pigmentation, acne marks",
      },
      ogImage: img("dr-nahid-samir.png"),
    },
    cardImage: img("dr-nahid-samir.png"),
    coverImage: img("dr-nahid-samir.png"),
    gallery: [
      { src: img("dr-nahid-samir-blog.png"), alt: { ar: "عناية بالبشرة في كايرو كوزمو", en: "Skincare at Cairo Cosmo Center" } },
    ],
    dateISO: "2026-01-26",
  },

  // -------------------- FAQ Articles --------------------

  {
    id: "f1",
    slug: "botox-vs-fillers",
    title: { ar: "بوتوكس أم فيلر؟ الفرق ومتى نختار كل واحد", en: "Botox vs Fillers: differences and when to choose each" },
    excerpt: { ar: "شرح سريع ومفيد: البوتوكس للخطوط التعبيرية، والفيلر للحجم والتناسق… مع أمثلة واضحة.", en: "Clear differences: Botox for expression lines, fillers for volume and balance." },
    content: {
      ar: `
        <p>سؤال يتكرر كثيرًا: <strong>بوتوكس ولا فيلر؟</strong> الإجابة تعتمد على المشكلة الأساسية.</p>

        <h2>البوتوكس يناسب مين؟</h2>
        <p>لو المشكلة هي <strong>تجاعيد تعبيرية</strong> بسبب حركة العضلات (جبهة، عبوس، حول العين).</p>
        <p><a href="/ar/blog/botox-benefits">اقرأ دليل البوتوكس الكامل</a></p>

        <h2>الفيلر يناسب مين؟</h2>
        <p>لو المشكلة هي <strong>فقدان حجم</strong> أو رغبة في تحسين التناسق (شفاه، خدود، فك، ذقن).</p>
        <p><a href="/ar/blog/dermal-fillers-guide">اقرأ دليل الفيلر الكامل</a></p>

        <figure data-image-slot="1"></figure>

        <h2>هل يمكن الجمع بينهما؟</h2>
        <p>نعم في كثير من الحالات، لكن بخطة توزيع صحيحة وتدرّج.</p>

        <h2>تابعنا</h2>
        <p>
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>
      `,
      en: `
        <p>This is a common question: <strong>Botox or fillers?</strong> The answer depends on your main concern.</p>

        <h2>When is Botox a better choice?</h2>
        <p>When the issue is <strong>expression lines</strong> caused by muscle movement (forehead, frown, crow’s feet).</p>
        <p><a href="/en/blog/botox-benefits">Read the full Botox guide</a></p>

        <h2>When are fillers a better choice?</h2>
        <p>When the issue is <strong>volume loss</strong> or facial balance (lips, cheeks, jawline, chin).</p>
        <p><a href="/en/blog/dermal-fillers-guide">Read the full fillers guide</a></p>

        <figure data-image-slot="1"></figure>

        <h2>Can we combine them?</h2>
        <p>Often yes, but only with a structured plan and gradual approach.</p>

        <h2>Follow Cairo Cosmo</h2>
        <p>
          <a href="https://www.instagram.com/cairocosmocenter?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="nofollow noopener">Instagram</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>
      `,
    },
    category: "faq",
    seo: {
      metaTitle: { ar: "بوتوكس أم فيلر؟ الفرق ومتى نختار | كايرو كوزمو", en: "Botox vs Fillers | Cairo Cosmo" },
      metaDescription: { ar: "تعرف على الفرق بين البوتوكس والفيلر ومتى نختار كل إجراء للحصول على نتيجة طبيعية ومتوازنة.", en: "Learn Botox vs fillers differences and when to choose each for natural, balanced results." },
      keywords: { ar: "بوتوكس, فيلر, الفرق بين البوتوكس والفيلر, تجاعيد, حجم الوجه", en: "botox vs fillers, difference, wrinkles, facial volume" },
      ogImage: img("Inlineslot1-BotoxvsFillers.png"),
    },
    cardImage: img("BotoxvsFillers.png"),
    coverImage: img("BotoxvsFillers.png"),
    gallery: [{ src: img("Inlineslot1-BotoxvsFillers.png"), alt: { ar: "بوتوكس vs فيلر", en: "Botox vs fillers" } }],
    dateISO: "2026-01-29",
  },

  // -------------------- News Articles --------------------

  {
    id: "n1",
    slug: "how-to-choose-your-aesthetic-plan",
    title: { ar: "كيف تختار خطة التجميل المناسبة؟ (بدون تسرّع)", en: "How to choose the right aesthetic plan (without rushing)" },
    excerpt: { ar: "نصائح عملية لتحديد هدفك، توقعاتك، وأفضل بداية: تقييم + خطة جلسات تدريجية.", en: "Practical tips to define your goals, expectations, and a safe gradual plan." },
    content: {
      ar: `
        <p>أكبر سبب لنتيجة غير مرضية ليس الإجراء نفسه… بل <strong>اختيار الإجراء بدون خطة</strong>. هنا خطوات بسيطة تساعدك تختار صح.</p>

        <h2>1) حددي المشكلة الأساسية</h2>
        <ul>
          <li>هل المشكلة خطوط تعبير؟ (بوتوكس)</li>
          <li>هل المشكلة فقدان حجم/تناسق؟ (فيلر)</li>
          <li>هل المشكلة بهتان/ملمس/تصبغات؟ (تجديد/تقشير)</li>
        </ul>

        <h2>2) ابدئي بالتدرج</h2>
        <p>التغييرات الصغيرة المتدرجة تعطي نتيجة “غالية” وهادئة.</p>

        <h2>3) حافظي على أساس البشرة</h2>
        <p>واقي الشمس + ترطيب + روتين بسيط… دول يحافظوا على أي نتيجة.</p>

        <figure data-image-slot="1"></figure>

        <h2>تابعينا</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>
      `,
      en: `
        <p>The biggest cause of unsatisfying outcomes isn’t the treatment itself, it’s <strong>choosing a procedure without a plan</strong>. Here’s a simple way to decide.</p>

        <h2>1) Define your main concern</h2>
        <ul>
          <li>Expression lines? (Botox)</li>
          <li>Volume loss/balance? (Fillers)</li>
          <li>Dullness/texture/pigmentation? (Rejuvenation/peels)</li>
        </ul>

        <h2>2) Go gradual</h2>
        <p>Small, staged improvements often look more refined.</p>

        <h2>3) Protect skin basics</h2>
        <p>Sunscreen + hydration + a simple routine helps maintain any result.</p>

        <figure data-image-slot="1"></figure>

        <h2>Follow us</h2>
        <p>
          <a href="https://www.facebook.com/CCosmoCenter" target="_blank" rel="nofollow noopener">Facebook</a> ·
          <a href="https://www.tiktok.com/@cairo.cosmo.cente?is_from_webapp=1&sender_device=pc" target="_blank" rel="nofollow noopener">TikTok</a> ·
          <a href="https://www.youtube.com/@cairocosmo" target="_blank" rel="nofollow noopener">YouTube</a>
        </p>
      `,
    },
    category: "news",
    seo: {
      metaTitle: { ar: "كيف تختار خطة التجميل المناسبة؟ | كايرو كوزمو", en: "How to Choose the Right Aesthetic Plan | Cairo Cosmo" },
      metaDescription: { ar: "خطوات بسيطة لاختيار الإجراء التجميلي المناسب بدون تسرّع: تحديد المشكلة، التدرج، وروتين يحافظ على النتائج.", en: "A simple framework to choose the right aesthetic plan: define goals, go gradual, and protect results." },
      keywords: { ar: "خطة تجميل, اختيار الإجراء, بوتوكس, فيلر, تجديد البشرة", en: "aesthetic plan, choosing treatment, botox, fillers, rejuvenation" },
      ogImage: img("How-to-choose-your-aesthetic-plan-cover.png"),
    },
    cardImage: img("How-to-choose-your-aesthetic-plan-cover.png"),
    coverImage: img("How-to-choose-your-aesthetic-plan-cover.png"),
    gallery: [{ src: img("How-to-choose-your-aesthetic-plan-Inlineslot1.png"), alt: { ar: "خطة تجميل", en: "Aesthetic plan" } }],
    dateISO: "2026-01-30",
  },
];

/**
 * ✅ Export sanitized posts:
 * - removes any booking CTA blocks inside content HTML (ar/en)
 */
export const blogPosts: BlogPost[] = blogPostsRaw.map((p) => ({
  ...p,
  content: {
    ar: stripBookingCtaBlock(p.content.ar),
    en: stripBookingCtaBlock(p.content.en),
  },
}));

export const getPostBySlug = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);

export const getPostsByServiceSlug = (serviceSlug: string) =>
  blogPosts.filter((p) => p.serviceSlug === serviceSlug);

export const getPostsByDoctorSlug = (doctorSlug: string) =>
  blogPosts.filter((p) => p.doctorSlug === doctorSlug);

export const sortPostsNewestFirst = (a: BlogPost, b: BlogPost) =>
  new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
