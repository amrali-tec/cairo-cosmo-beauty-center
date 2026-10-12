// src/services/translateService.ts

// Specialized Medical & Beauty Aesthetics Dictionary for Cairo Cosmo Center
const medicalGlossary: Record<string, string> = {
  "كايرو كوزمو سنتر": "Cairo Cosmo Center",
  "كايرو كوزمو": "Cairo Cosmo",
  "فراكشنال ليزر": "Fractional CO2 Laser",
  "إزالة الشعر بالليزر": "Laser Hair Removal",
  "نضارة البشرة": "Skin Rejuvenation",
  "تنسيق القوام": "Body Contouring",
  "حقن البوتوكس": "Botox Injections",
  "حقن الفيلر": "Dermal Fillers",
  "الهيدرافيشل": "Hydrafacial",
  "هيدرافيشل": "Hydrafacial",
  "تقشير البشرة": "Skin Peeling",
  "شد البشرة": "Skin Tightening",
  "استشاري جراحة التجميل": "Consultant Plastic Surgeon",
  "استشاري الجلدية والتجميل": "Consultant Dermatologist",
  "استشاري طب التجميل": "Consultant Aesthetic Physician",
  "أسئلة شائعة": "Frequently Asked Questions",
  "روابط ومصادر": "Useful Resources",
  "بدون فترة نقاهة": "No downtime",
  "تقييم مجاني": "Free Consultation",
  "جلسة واحدة": "Single Session",
};

/**
 * Translates Arabic text to English using free client translation service + medical glossary.
 */
export async function translateArabicToEnglish(text: string): Promise<string> {
  if (!text || !text.trim()) return "";

  // 1. Check if the entire string matches a glossary term
  const trimmed = text.trim();
  if (medicalGlossary[trimmed]) {
    return medicalGlossary[trimmed];
  }

  // 2. Pre-process medical glossary keywords
  let processedText = text;
  for (const [arTerm, enTerm] of Object.entries(medicalGlossary)) {
    processedText = processedText.split(arTerm).join(enTerm);
  }

  // 3. Call free client translation API
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ar&tl=en&dt=t&q=${encodeURIComponent(processedText)}`,
    );

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedString = data[0]
          .map((item: [string]) => item[0])
          .filter(Boolean)
          .join("");
        if (translatedString && translatedString.trim()) {
          return translatedString.trim();
        }
      }
    }
  } catch {
    // Fallback if offline
  }

  return processedText;
}

/**
 * Translates a complete array of Visual Content Blocks from Arabic to English
 */
export async function translateContentBlocks(
  blocks: { id: string; type: string; [key: string]: any }[],
): Promise<{ id: string; type: string; [key: string]: any }[]> {
  const translatedBlocks = [];

  for (const block of blocks) {
    switch (block.type) {
      case "paragraph": {
        const translatedText = await translateArabicToEnglish(block.text);
        translatedBlocks.push({ ...block, text: translatedText });
        break;
      }

      case "heading": {
        const translatedTitle = await translateArabicToEnglish(block.title);
        translatedBlocks.push({ ...block, title: translatedTitle });
        break;
      }

      case "list": {
        const itemsList = block.items.split("\n").filter(Boolean);
        const translatedItems = await Promise.all(
          itemsList.map((item: string) => translateArabicToEnglish(item)),
        );
        translatedBlocks.push({ ...block, items: translatedItems.join("\n") });
        break;
      }

      case "doctor": {
        const doctorName = await translateArabicToEnglish(block.doctorName);
        const specialty = await translateArabicToEnglish(block.specialty);
        const text = await translateArabicToEnglish(block.text);
        translatedBlocks.push({ ...block, doctorName, specialty, text });
        break;
      }

      case "offer": {
        const offerTitle = await translateArabicToEnglish(block.offerTitle);
        const discount = await translateArabicToEnglish(block.discount);
        translatedBlocks.push({ ...block, offerTitle, discount });
        break;
      }

      case "cta": {
        const title = await translateArabicToEnglish(block.title);
        const subtitle = await translateArabicToEnglish(block.subtitle);
        const buttonText = await translateArabicToEnglish(block.buttonText);
        translatedBlocks.push({ ...block, title, subtitle, buttonText });
        break;
      }

      case "faq": {
        const title = await translateArabicToEnglish(block.title || "أسئلة شائعة");
        const translatedQuestions = [];
        for (const qItem of block.questions || []) {
          const q = await translateArabicToEnglish(qItem.q);
          const a = await translateArabicToEnglish(qItem.a);
          translatedQuestions.push({ q, a });
        }
        translatedBlocks.push({ ...block, title, questions: translatedQuestions });
        break;
      }

      case "links": {
        const title = await translateArabicToEnglish(block.title || "روابط مفيدة");
        const translatedLinks = [];
        for (const lItem of block.links || []) {
          const label = await translateArabicToEnglish(lItem.label);
          translatedLinks.push({ ...lItem, label });
        }
        translatedBlocks.push({ ...block, title, links: translatedLinks });
        break;
      }

      default:
        translatedBlocks.push(block);
        break;
    }
  }

  return translatedBlocks;
}
