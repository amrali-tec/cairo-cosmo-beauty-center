import { services } from "@/data/data";
import Link from "next/link";
import Image from "next/image";
import { getLocale } from "@/lib/i18n";

export default async function ServicesPage() {
  const locale = await getLocale();

  return (
    <main className="container py-12">
      <h1 className="text-3xl font-bold mb-8">
        {locale === "ar" ? "خدماتنا الطبية" : "Our Medical Services"}
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/services/${service.slug}`}
            className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
          >
            <Image
              src={service.image}
              alt={service.title[locale]}
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                {service.title[locale]}
              </h2>
              <p className="text-sm text-gray-600">
                {service.shortDescription[locale]}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
