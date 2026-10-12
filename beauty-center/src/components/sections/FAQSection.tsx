import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { homeFAQs } from '@/lib/data';
import { getTranslation } from '@/lib/i18n';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const FAQSection = () => {
  const { locale, t, translations } = useLocale();

  return (
    <section className="py-16 md:py-24">
      <div className="section-container">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t(translations.common.faq)}
            </h2>
            <p className="text-muted-foreground">
              {locale === 'ar'
                ? 'إجابات على الأسئلة الأكثر شيوعاً'
                : 'Answers to frequently asked questions'}
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {homeFAQs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-card rounded-xl border border-border px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-start hover:no-underline py-5">
                  <span className="font-medium text-foreground">
                    {getTranslation(faq.question, locale)}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {getTranslation(faq.answer, locale)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
