import { MessageCircle } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';
import { siteConfig } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export const WhatsAppButton = () => {
  const { locale, dir } = useLocale();
  const whatsappUrl = siteConfig.getWhatsAppUrl(locale);

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed z-50 p-4 rounded-full shadow-lg transition-all duration-300',
        'bg-whatsapp hover:bg-whatsapp-hover',
        'hover:scale-110 hover:shadow-xl',
        'animate-pulse-soft',
        'bottom-6',
        dir === 'rtl' ? 'left-6' : 'right-6'
      )}
      aria-label={locale === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
    >
      <MessageCircle className="h-6 w-6 text-white" fill="white" />
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full animate-ping bg-whatsapp/30" />
    </a>
  );
};
