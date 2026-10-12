import { useMemo, lazy, Suspense } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { DoctorsSection } from "@/components/sections/DoctorsSection";
import { BranchesSection } from "@/components/sections/BranchesSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { useLocale } from "@/lib/locale-context";
import { siteConfig } from "@/lib/i18n";
import { useSeo } from "@/hooks/useSeo";
import { LazySection } from "@/components/LazySection";
import { IdleLoader } from "@/components/IdleLoader";

import {
  AboutIntroMini,
  AboutValueCards,
  AboutServicesChips,
} from "@/components/sections/about/AboutBlocks";

// Below-the-fold & floating widgets loaded lazily for maximum mobile performance
const BeautyQuizSection = lazy(() => import("@/components/sections/BeautyQuizSection").then(m => ({ default: m.BeautyQuizSection })));
const BeforeAfterSection = lazy(() => import("@/components/BeforeAfterSection"));
const OffersSection = lazy(() => import("@/components/sections/OffersSection").then(m => ({ default: m.OffersSection })));
const TestimonialsSection = lazy(() => import("@/components/sections/TestimonialsSection").then(m => ({ default: m.TestimonialsSection })));
const CTASection = lazy(() => import("@/components/sections/CTASection").then(m => ({ default: m.CTASection })));
const BlogPreviewSlider = lazy(() => import("@/components/sections/BlogPreviewSlider").then(m => ({ default: m.BlogPreviewSlider })));
const LiveSocialProofToast = lazy(() => import("@/components/LiveSocialProofToast").then(m => ({ default: m.LiveSocialProofToast })));
const FloatingCalculatorModal = lazy(() => import("@/components/calculator/FloatingCalculatorModal").then(m => ({ default: m.FloatingCalculatorModal })));
const SmartBeautyConsultant = lazy(() => import("@/components/chat/SmartBeautyConsultant").then(m => ({ default: m.SmartBeautyConsultant })));

const HomePage = () => {
  const { locale } = useLocale();
  const canonical = `${siteConfig.url}/${locale}`;

  useSeo({
    title:
      locale === "ar"
        ? "الرئيسية"
        : "Home",
    description:
      locale === "ar"
        ? "كايرو كوزمو سنتر لليزر والتجميل الطبي في مصر. خدمات تجميل وعناية بالبشرة والشعر بخطط علاجية حديثة ونتائج طبيعية."
        : "Cairo Cosmo Center for laser and medical aesthetics in Egypt. Modern skin, hair, and beauty treatments with safe protocols and natural results.",
    canonical,
    ogImage: "/assets/blog/How-to-choose-your-aesthetic-plan-cover.png",
    keywords:
      locale === "ar"
        ? "ليزر إزالة الشعر, بوتوكس وفيلر, هيدرافيشل, علاج تساقط الشعر, مركز تجميل في مصر"
        : "laser hair removal, botox and fillers, hydrafacial, hair loss treatment, aesthetic clinic in Egypt",
  });

  const jsonLd = useMemo(() => {
    const organization = {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name.en,
      alternateName: siteConfig.name.ar,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
      image: `${siteConfig.url}${siteConfig.defaultOgImage}`,
      telephone: `+${siteConfig.whatsapp}`,
      email: siteConfig.email,
      sameAs: Object.values(siteConfig.socialLinks),
      address: {
        "@type": "PostalAddress",
        addressCountry: "EG",
      },
    };

    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name.en,
      inLanguage: [ "ar", "en" ],
    };

    const webpage = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#webpage`,
      url: canonical,
      name: locale === "ar" ? "الرئيسية" : "Home",
      description:
        locale === "ar"
          ? "كايرو كوزمو سنتر لليزر والتجميل الطبي في مصر."
          : "Cairo Cosmo Center for medical aesthetics and laser in Egypt.",
      isPartOf: { "@id": `${siteConfig.url}/#website` },
      inLanguage: locale,
    };

    return [organization, website, webpage];
  }, [canonical, locale]);

  return (
    <>
      {jsonLd.map((obj, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
      <HeroSection />
      <section className="py-12 md:py-16">
        <div className="section-container space-y-6">
          <AboutIntroMini />
          <AboutValueCards />
          <AboutServicesChips limit={8} />
        </div>
      </section>
      <ServicesSection />
      <LazySection minHeight="400px">
        <Suspense fallback={null}>
          <BeautyQuizSection />
        </Suspense>
      </LazySection>

      <LazySection minHeight="450px">
        <Suspense fallback={null}>
          <BeforeAfterSection locale={locale} />
        </Suspense>
      </LazySection>

      <DoctorsSection />
      <BranchesSection />
      <FAQSection />

      <LazySection minHeight="450px">
        <Suspense fallback={null}>
          <OffersSection limit={6} showFilters={false} />
        </Suspense>
      </LazySection>

      <LazySection minHeight="400px">
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
      </LazySection>

      <LazySection minHeight="300px">
        <Suspense fallback={null}>
          <CTASection />
        </Suspense>
      </LazySection>

      <LazySection minHeight="450px">
        <Suspense fallback={null}>
          <BlogPreviewSlider limit={3} />
        </Suspense>
      </LazySection>

      <IdleLoader delayMs={3500}>
        <Suspense fallback={null}>
          <LiveSocialProofToast />
          <FloatingCalculatorModal />
          <SmartBeautyConsultant />
        </Suspense>
      </IdleLoader>
    </>
  );
};

export default HomePage;
