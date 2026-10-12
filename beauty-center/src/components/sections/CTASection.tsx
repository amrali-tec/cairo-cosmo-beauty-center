import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/locale-context';
import { siteConfig } from '@/lib/i18n';

export const CTASection = () => {
  const { locale, t, translations, isRTL } = useLocale();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 start-10 w-32 h-32 rounded-full bg-white" />
        <div className="absolute bottom-10 end-20 w-48 h-48 rounded-full bg-white" />
      </div>

      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {locale === 'ar'
              ? 'ابدأي رحلة جمالك اليوم'
              : 'Start Your Beauty Journey Today'}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            {locale === 'ar'
              ? 'احجزي استشارتك المجانية مع أحد أطبائنا المتخصصين واكتشفي الحلول المثالية لبشرتك'
              : 'Book your free consultation with one of our specialized doctors and discover the perfect solutions for your skin'}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="glass"
              size="xl"
              asChild
              className="border-white/30 text-white hover:bg-white hover:text-primary"
            >
              <Link to={`/${locale}/book`} className="gap-2">
                {t(translations.navigation.bookNow)}
                <ArrowIcon className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="whatsapp"
              size="xl"
              asChild
            >
              <a
                href={siteConfig.getWhatsAppUrl(locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Phone className="h-5 w-5" />
                {t(translations.hero.whatsappCta)}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
