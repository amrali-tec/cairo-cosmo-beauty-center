// src/lib/data/beforeAfter.ts
import type { BeforeAfterItem } from "./types";

// ==============================
// ✅ Before & After Gallery (Enhanced Real Medical Results)
// ==============================

export const beforeAfterData: BeforeAfterItem[] = [
  // ─── Laser Hair Removal ───
  {
    serviceId: "laser-hair-removal",
    beforeImage: "/assets/services/Laser.jpeg",
    afterImage: "/assets/before-after/Removal of skin laser.jpeg",
  },

  // ─── Men's Laser Hair Removal ───
  {
    serviceId: "mens-laser-hair-removal",
    beforeImage: "/assets/services/mens-laser-hair-removal.png",
    afterImage: "/assets/services/Laser.jpeg",
  },

  // ─── Botox & Fillers ───
  {
    serviceId: "botox",
    beforeImage: "/assets/services/botox.jpeg",
    afterImage: "/assets/before-after/Botox.jpeg",
  },
  {
    serviceId: "botox",
    beforeImage: "/assets/services/Fillers.jpeg",
    afterImage: "/assets/before-after/Botox-2.jpeg",
  },
  {
    serviceId: "botox",
    beforeImage: "/assets/services/botox.jpeg",
    afterImage: "/assets/before-after/Filler.jpeg",
  },
  {
    serviceId: "botox",
    beforeImage: "/assets/services/Fillers.jpeg",
    afterImage: "/assets/before-after/Nosecorrection-fillers.jpeg",
  },
  {
    serviceId: "botox",
    beforeImage: "/assets/services/Lip-augmentation.jpeg",
    afterImage: "/assets/before-after/Liptinting.jpeg",
  },

  // ─── Skin Booster ───
  {
    serviceId: "skin-booster",
    beforeImage: "/assets/services/skinbooster.jpeg",
    afterImage: "/assets/before-after/Skinbooster.jpeg",
  },

  // ─── Dermapen ───
  {
    serviceId: "dermapen",
    beforeImage: "/assets/services/Dermapen.jpeg",
    afterImage: "/assets/services/dermapen-treatment.jpg",
  },

  // ─── Mesotherapy ───
  {
    serviceId: "mesotherapy",
    beforeImage: "/assets/services/Mesotherapy.jpeg",
    afterImage: "/assets/before-after/Mesotherapy.jpeg",
  },

  // ─── HIFU ───
  {
    serviceId: "hifu",
    beforeImage: "/assets/services/Non-surgical facelift.jpeg",
    afterImage: "/assets/services/hifu-treatment.jpg",
  },

  // ─── HydraFacial / Skin Cleansing ───
  {
    serviceId: "hydrafacial",
    beforeImage: "/assets/services/hydrafacial.jpeg",
    afterImage: "/assets/services/hydrafacial-glow.jpg",
  },

  // ─── Thread Lift ───
  {
    serviceId: "thread-lift",
    beforeImage: "/assets/services/Non-surgical facelift.jpeg",
    afterImage: "/assets/services/thread-lift-contouring.jpg",
  },

  // ─── Oxygen Facial ───
  {
    serviceId: "oxygeno-facial",
    beforeImage: "/assets/services/Oxygen.jpeg",
    afterImage: "/assets/before-after/Oxygen.jpeg",
  },

  // ─── Hair Loss Treatment ───
  {
    serviceId: "hair-loss-treatment",
    beforeImage: "/assets/services/exosomes.jpeg",
    afterImage: "/assets/before-after/Hairltreatment.jpeg",
  },
  {
    serviceId: "hair-loss-treatment",
    beforeImage: "/assets/services/exosome2.jpeg",
    afterImage: "/assets/before-after/Stemtherapy.jpeg",
  },
];

export function getBeforeAfterByService(serviceId: string): BeforeAfterItem[] {
  return beforeAfterData.filter((item) => item.serviceId === serviceId);
}
