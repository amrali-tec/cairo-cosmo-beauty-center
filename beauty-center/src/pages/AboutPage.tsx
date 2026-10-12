// src/pages/AboutPage.tsx
import { useLocaleParam } from "@/lib/use-locale-param";
import { useSeo } from "@/hooks/useSeo";
import {
  AboutIntroMini,
  AboutValueCards,
  AboutWhyUs,
  AboutServicesChips,
  AboutDoctorsPreview,
} from "@/components/sections/about/AboutBlocks";

export default function AboutPage() {
  const locale = useLocaleParam();

  useSeo({
    title:
      locale === "ar"
        ? "من نحن | مركز القاهرة الطبي"
        : "About | Cairo Cosmo Center",
    description:
      locale === "ar"
        ? "تعرف على المركز: فريق متخصص، تقنيات حديثة، وتجربة آمنة بنتائج طبيعية."
        : "Learn about the center: specialized team, modern technology, safe care and natural results.",
    canonical: `https://cairoplasticsurgery.com/${locale}/about`,
  });

  return (
    <div className="section-container py-10 md:py-14 space-y-6">
      <AboutIntroMini showReadMore={false} />
      <AboutValueCards />
      <AboutWhyUs />
      <AboutServicesChips limit={10} />
      <AboutDoctorsPreview limit={6} />
    </div>
  );
}
