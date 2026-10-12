import { useState } from "react";
import { useLocale } from "@/lib/locale-context";
import { doctors } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function DoctorMatchingSection() {
  const { locale, isRTL } = useLocale();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("laser");

  const specialtyMap: Record<string, { titleAr: string; titleEn: string; doctorSlug: string }> = {
    laser: {
      titleAr: "إزالة الشعر وتجديد البشرة بالليزر",
      titleEn: "Laser Hair Removal & Skin Rejuvenation",
      doctorSlug: "prof-nahed-samir",
    },
    botox: {
      titleAr: "حقن التجميل والبوتوكس والفيلر",
      titleEn: "Botox, Fillers & Facial Aesthetics",
      doctorSlug: "dr-basim-zaki",
    },
    sculpting: {
      titleAr: "جراحات التجميل وتنسيق القوام والنحت",
      titleEn: "Plastic Surgery & Body Contouring",
      doctorSlug: "prof-ahmed-el-sherif",
    },
  };

  const currentConfig = specialtyMap[selectedSpecialty] || specialtyMap.laser;

  const matchedDoctor =
    doctors.find((d) => d.slug === currentConfig.doctorSlug) || doctors[0];

  return (
    <section className="py-8 my-6 relative overflow-hidden bg-card/80 rounded-[2.5rem] border border-border/80 p-6 md:p-8 shadow-sm" dir={isRTL ? "rtl" : "ltr"}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <Badge variant="outline" className="rounded-full px-3.5 py-1 border-primary/30 text-primary font-bold text-xs mb-2">
              <Sparkles className="ml-1 h-3.5 w-3.5 inline" />
              {locale === "ar" ? "أداة المطابقة الطبية" : "Doctor Matcher Tool"}
            </Badge>
            <h3 className="text-2xl md:text-3xl font-black text-foreground">
              {locale === "ar" ? "اختر التخصص المطلوب لاقتراح الاستشاري الأنسب" : "Match Your Treatment with the Right Consultant"}
            </h3>
          </div>

          {/* Specialty Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant={selectedSpecialty === "laser" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty("laser")}
              className="rounded-xl text-xs font-bold"
            >
              ⚡ {locale === "ar" ? "ليزر وعناية بالبشرة" : "Laser & Skincare"}
            </Button>
            <Button
              type="button"
              variant={selectedSpecialty === "botox" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty("botox")}
              className="rounded-xl text-xs font-bold"
            >
              🌸 {locale === "ar" ? "حقن وبوتوكس وفيلر" : "Botox & Injectables"}
            </Button>
            <Button
              type="button"
              variant={selectedSpecialty === "sculpting" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty("sculpting")}
              className="rounded-xl text-xs font-bold"
            >
              💎 {locale === "ar" ? "نحت وتنسيق القوام" : "Body Contouring"}
            </Button>
          </div>
        </div>

        {/* Matched Doctor Recommendation Card */}
        {matchedDoctor ? (
          <Card className="rounded-[2rem] border-primary/20 bg-background/90 p-6 shadow-md">
            <CardContent className="p-0 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={matchedDoctor.image}
                  alt={matchedDoctor.name[locale]}
                  className="h-24 w-24 rounded-full object-cover border-2 border-primary/30 shadow-md shrink-0 bg-muted"
                />

                <div className="space-y-1">
                  <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-xs font-semibold">
                    {locale === "ar" ? "الاستشاري الموصى به" : "Recommended Consultant"}
                  </Badge>
                  <h4 className="text-xl font-bold text-foreground">{matchedDoctor.name[locale]}</h4>
                  <p className="text-sm font-semibold text-primary">{matchedDoctor.specialty[locale]}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 pt-1">{matchedDoctor.bio[locale]}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
                <Button variant="outline" size="sm" asChild className="rounded-xl w-full sm:w-auto text-xs font-bold">
                  <Link to={`/${locale}/doctors/${matchedDoctor.slug}`}>
                    {locale === "ar" ? "الملف الطبي" : "View Profile"}
                  </Link>
                </Button>

                <Button size="sm" asChild className="rounded-xl btn-primary-gradient border-0 font-bold w-full sm:w-auto text-xs">
                  <Link to={`/${locale}/book`}>
                    <Calendar className="ml-1 h-3.5 w-3.5" />
                    {locale === "ar" ? "احجز موعد الاستشارة" : "Book Consultation"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
