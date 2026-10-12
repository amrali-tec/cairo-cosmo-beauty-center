import { services, getDoctorsForService } from "../../lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: any) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};

  return {
    title: `${service.title.ar} | Cairo Cosmo Center`,
    description: service.shortDescription.ar,
  };
}

export default async function ServicePage({ params }: any) {
  const locale = "en";
  const service = services.find((s) => s.slug === params.slug);

  if (!service) notFound();

  const doctors = getDoctorsForService(service.id);

  return (
    <main className="container py-12">
      {/* Hero */}
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-4">{service.title[locale]}</h1>
          <p className="text-gray-700 leading-relaxed">
            {service.description[locale]}
          </p>

          <div className="mt-6 flex gap-4">
            <Link href="/book" className="btn-primary">
              {locale === "ar" ? "احجز الآن" : "Book Now"}
            </Link>
            <a
              href="https://wa.me/201206666390"
              target="_blank"
              className="btn-outline"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <Image
          src={service.image}
          alt={service.title[locale]}
          className="rounded-xl"
        />
      </div>

      {/* Doctors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          {locale === "ar" ? "الأطباء المتخصصون" : "Specialized Doctors"}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Link
              key={doc.id}
              href={`/doctors/${doc.slug}`}
              className="border rounded-xl p-4 hover:shadow"
            >
              <Image
                src={doc.image}
                alt={doc.name[locale]}
                className="h-40 w-full object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold">{doc.name[locale]}</h3>
              <p className="text-sm text-gray-600">{doc.specialty[locale]}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          {locale === "ar" ? "أسئلة شائعة" : "Frequently Asked Questions"}
        </h2>

        <div className="space-y-4">
          {service.faqs.map((faq, i) => (
            <details key={i} className="border rounded-lg p-4">
              <summary className="font-medium cursor-pointer">
                {faq.question[locale]}
              </summary>
              <p className="mt-2 text-gray-700">{faq.answer[locale]}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: service.title.en,
            description: service.description.en,
            provider: {
              "@type": "MedicalClinic",
              name: "Cairo Cosmo Center",
            },
          }),
        }}
      />
    </main>
  );
}
