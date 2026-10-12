import { legalContent } from "@/lib/legal";
import { useLocale } from "@/lib/locale-context";
import { Locale } from "@/lib/i18n";

export default function PrivacyPage() {
  const { locale, dir } = useLocale();

  const html =
    locale === ("ar" as Locale)
      ? legalContent.privacy.ar
      : legalContent.privacy.en;

  return (
    <div dir={dir} className="section-container py-10 md:py-14">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-card p-6 md:p-8">
        <article
          className="prose prose-neutral max-w-none prose-headings:font-bold prose-a:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}