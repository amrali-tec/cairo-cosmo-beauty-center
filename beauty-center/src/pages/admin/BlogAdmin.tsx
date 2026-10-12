import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { blogPosts, type BlogCategory, type BlogPost } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Pencil,
  Save,
  Search,
  Trash2,
  Plus,
  ArrowRight,
  Sparkles,
  Wand2,
  Languages,
  Code,
  Layers,
  Heading2,
  AlignLeft,
  ListOrdered,
  HelpCircle,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  LayoutTemplate,
  Stethoscope,
  BadgePercent,
  Calendar,
  MousePointerClick,
  Sparkle,
} from "lucide-react";
import {
  getAllAdminBlogPosts,
  saveAllAdminBlogPosts,
  type AdminBlogPost,
  type AdminBlogPostStatus,
} from "@/lib/admin/blog";
import { getAllAdminPosts as getLegacyAdminPosts } from "@/lib/posts";
import {
  translateArabicToEnglish,
  translateContentBlocks,
} from "@/services/translateService";

type GalleryItem = {
  src: string;
  alt: {
    ar: string;
    en: string;
  };
};

export type ContentBlock =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading"; level: 2 | 3; title: string }
  | { id: string; type: "list"; style: "bullet" | "number"; items: string }
  | { id: string; type: "image"; slot: string }
  | { id: string; type: "doctor"; doctorName: string; specialty: string; text: string }
  | { id: string; type: "offer"; offerTitle: string; discount: string; linkUrl: string }
  | { id: string; type: "cta"; title: string; subtitle: string; buttonText: string }
  | { id: string; type: "faq"; title: string; questions: { q: string; a: string }[] }
  | { id: string; type: "links"; title: string; links: { label: string; url: string }[] };

type BlogForm = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  blocksAr: ContentBlock[];
  blocksEn: ContentBlock[];
  activeEditorMode: "elementor" | "form" | "settings";
  category: BlogCategory;
  serviceSlug: string;
  doctorSlug: string;
  metaTitleAr: string;
  metaTitleEn: string;
  metaDescriptionAr: string;
  metaDescriptionEn: string;
  keywordsAr: string;
  keywordsEn: string;
  ogImage: string;
  cardImage: string;
  coverImage: string;
  gallery1Src: string;
  gallery1AltAr: string;
  gallery1AltEn: string;
  gallery2Src: string;
  gallery2AltAr: string;
  gallery2AltEn: string;
  dateISO: string;
  status: AdminBlogPostStatus;
};

const emptyForm: BlogForm = {
  id: "",
  slug: "",
  titleAr: "",
  titleEn: "",
  excerptAr: "",
  excerptEn: "",
  contentAr: "",
  contentEn: "",
  blocksAr: [],
  blocksEn: [],
  activeEditorMode: "elementor",
  category: "news",
  serviceSlug: "",
  doctorSlug: "",
  metaTitleAr: "",
  metaTitleEn: "",
  metaDescriptionAr: "",
  metaDescriptionEn: "",
  keywordsAr: "",
  keywordsEn: "",
  ogImage: "",
  cardImage: "/assets/hero-bg.jpg",
  coverImage: "/assets/hero-bg.jpg",
  gallery1Src: "",
  gallery1AltAr: "",
  gallery1AltEn: "",
  gallery2Src: "",
  gallery2AltAr: "",
  gallery2AltEn: "",
  dateISO: new Date().toISOString().slice(0, 10),
  status: "published",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function generateId() {
  return `post-${Date.now()}`;
}

function generateBlockId() {
  return `blk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

// Convert Visual Blocks array to HTML string
export function blocksToHtml(blocks: ContentBlock[]): string {
  if (!blocks || blocks.length === 0) return "";

  return blocks
    .map((block) => {
      switch (block.type) {
        case "paragraph":
          return block.text.trim() ? `<p>${block.text.trim()}</p>` : "";

        case "heading":
          return block.title.trim()
            ? `<h${block.level}>${block.title.trim()}</h${block.level}>`
            : "";

        case "list": {
          const lines = block.items
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);
          if (lines.length === 0) return "";
          const tag = block.style === "number" ? "ol" : "ul";
          return `<${tag}>${lines.map((item) => `<li>${item}</li>`).join("")}</${tag}>`;
        }

        case "image":
          return `<figure data-image-slot="${block.slot || "1"}"></figure>`;

        case "doctor":
          return `<h2>نصيحة الاستشاري: ${block.doctorName}</h2><p><strong>${block.specialty}:</strong> ${block.text}</p>`;

        case "offer":
          return `<h2>عرض مميز: ${block.offerTitle} (${block.discount})</h2><p><a href="${block.linkUrl}">اضغط هنا للحجز بالخصم</a></p>`;

        case "cta":
          return `<h2>${block.title}</h2><p>${block.subtitle}</p><p><a href="/ar/booking">${block.buttonText}</a></p>`;

        case "faq": {
          const titleHtml = `<h2>${block.title.trim() || "أسئلة شائعة"}</h2>`;
          const itemsHtml = block.questions
            .filter((item) => item.q.trim())
            .map((item) => `<h3>${item.q.trim()}</h3><p>${item.a.trim()}</p>`)
            .join("");
          return `${titleHtml}\n${itemsHtml}`;
        }

        case "links": {
          const titleHtml = `<h2>${block.title.trim() || "روابط مفيدة"}</h2>`;
          const linksHtml = block.links
            .filter((item) => item.label.trim() && item.url.trim())
            .map(
              (item) =>
                `<li><a href="${item.url.trim()}" target="_blank" rel="nofollow noopener">${item.label.trim()}</a></li>`,
            )
            .join("");
          return `${titleHtml}\n<ul>${linksHtml}</ul>`;
        }

        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

// Parse HTML string back to Visual Blocks array
export function htmlToBlocks(html: string): ContentBlock[] {
  if (!html || typeof window === "undefined" || !("DOMParser" in window)) {
    return html ? [{ id: generateBlockId(), type: "paragraph", text: html }] : [];
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return [];

  const blocks: ContentBlock[] = [];
  const children = Array.from(root.children);

  let i = 0;
  while (i < children.length) {
    const el = children[i];
    const tagName = el.tagName.toLowerCase();

    if (tagName === "p") {
      const text = el.innerHTML.trim();
      if (text) blocks.push({ id: generateBlockId(), type: "paragraph", text });
      i++;
    } else if (tagName === "h2" || tagName === "h3") {
      const title = el.textContent?.trim() || "";
      const level = tagName === "h2" ? 2 : 3;

      if (
        level === 2 &&
        (title.includes("أسئلة") || title.includes("FAQ") || title.includes("شائعة"))
      ) {
        const questions: { q: string; a: string }[] = [];
        i++;
        while (i < children.length) {
          const next = children[i];
          if (next.tagName.toLowerCase() === "h3") {
            const q = next.textContent?.trim() || "";
            let a = "";
            if (
              i + 1 < children.length &&
              children[i + 1].tagName.toLowerCase() === "p"
            ) {
              a = children[i + 1].innerHTML.trim();
              i++;
            }
            questions.push({ q, a });
            i++;
          } else if (next.tagName.toLowerCase() === "h2") {
            break;
          } else {
            i++;
          }
        }
        blocks.push({
          id: generateBlockId(),
          type: "faq",
          title: title || "أسئلة شائعة",
          questions,
        });
      } else if (
        level === 2 &&
        (title.includes("روابط") || title.includes("مصادر") || title.includes("Links"))
      ) {
        const links: { label: string; url: string }[] = [];
        i++;
        if (i < children.length) {
          const next = children[i];
          if (
            next.tagName.toLowerCase() === "ul" ||
            next.tagName.toLowerCase() === "ol"
          ) {
            next.querySelectorAll("a").forEach((a) => {
              links.push({
                label: a.textContent?.trim() || "",
                url: a.getAttribute("href") || "",
              });
            });
            i++;
          }
        }
        blocks.push({
          id: generateBlockId(),
          type: "links",
          title: title || "روابط مفيدة",
          links,
        });
      } else {
        blocks.push({ id: generateBlockId(), type: "heading", level, title });
        i++;
      }
    } else if (tagName === "ul" || tagName === "ol") {
      const items = Array.from(el.querySelectorAll("li"))
        .map((li) => li.innerHTML.trim())
        .join("\n");
      blocks.push({
        id: generateBlockId(),
        type: "list",
        style: tagName === "ol" ? "number" : "bullet",
        items,
      });
      i++;
    } else if (tagName === "figure") {
      const slot = el.getAttribute("data-image-slot") || "1";
      blocks.push({ id: generateBlockId(), type: "image", slot });
      i++;
    } else {
      const outer = el.outerHTML.trim();
      if (outer) blocks.push({ id: generateBlockId(), type: "paragraph", text: outer });
      i++;
    }
  }

  return blocks;
}

function mapFormToPost(form: BlogForm): AdminBlogPost {
  const finalContentAr = blocksToHtml(form.blocksAr) || form.contentAr;
  const finalContentEn = blocksToHtml(form.blocksEn) || form.contentEn || finalContentAr;

  const gallery: GalleryItem[] = [
    form.gallery1Src
      ? {
          src: form.gallery1Src,
          alt: { ar: form.gallery1AltAr || form.titleAr, en: form.gallery1AltEn || form.titleEn },
        }
      : null,
    form.gallery2Src
      ? {
          src: form.gallery2Src,
          alt: { ar: form.gallery2AltAr || form.titleAr, en: form.gallery2AltEn || form.titleEn },
        }
      : null,
  ].filter(Boolean) as GalleryItem[];

  const post: BlogPost = {
    id: form.id || generateId(),
    slug: form.slug || slugify(form.titleEn || form.titleAr || "post"),
    title: {
      ar: form.titleAr,
      en: form.titleEn || form.titleAr,
    },
    excerpt: {
      ar: form.excerptAr,
      en: form.excerptEn || form.excerptAr,
    },
    content: {
      ar: finalContentAr,
      en: finalContentEn,
    },
    category: form.category,
    serviceSlug: form.category === "service" ? form.serviceSlug : undefined,
    doctorSlug: form.category === "doctor" ? form.doctorSlug : undefined,
    seo: {
      metaTitle: {
        ar: form.metaTitleAr || form.titleAr,
        en: form.metaTitleEn || form.titleEn || form.titleAr,
      },
      metaDescription: {
        ar: form.metaDescriptionAr || form.excerptAr,
        en: form.metaDescriptionEn || form.excerptEn || form.excerptAr,
      },
      keywords:
        form.keywordsAr || form.keywordsEn
          ? {
              ar: form.keywordsAr,
              en: form.keywordsEn || form.keywordsAr,
            }
          : undefined,
      ogImage: form.ogImage || form.cardImage || undefined,
    },
    cardImage: form.cardImage || "/assets/hero-bg.jpg",
    coverImage: form.coverImage || form.cardImage || "/assets/hero-bg.jpg",
    gallery: gallery.length ? gallery : undefined,
    dateISO: form.dateISO || new Date().toISOString().slice(0, 10),
  };

  return {
    ...post,
    status: form.status,
  };
}

function mapPostToForm(post: AdminBlogPost): BlogForm {
  const blocksAr = htmlToBlocks(post.content.ar);
  const blocksEn = htmlToBlocks(post.content.en);

  return {
    id: post.id,
    slug: post.slug,
    titleAr: post.title.ar,
    titleEn: post.title.en,
    excerptAr: post.excerpt.ar,
    excerptEn: post.excerpt.en,
    contentAr: post.content.ar,
    contentEn: post.content.en,
    blocksAr: blocksAr.length > 0 ? blocksAr : [{ id: generateBlockId(), type: "paragraph", text: post.content.ar }],
    blocksEn: blocksEn.length > 0 ? blocksEn : [{ id: generateBlockId(), type: "paragraph", text: post.content.en }],
    activeEditorMode: "elementor",
    category: post.category,
    serviceSlug: post.serviceSlug || "",
    doctorSlug: post.doctorSlug || "",
    metaTitleAr: post.seo.metaTitle.ar,
    metaTitleEn: post.seo.metaTitle.en,
    metaDescriptionAr: post.seo.metaDescription.ar,
    metaDescriptionEn: post.seo.metaDescription.en,
    keywordsAr: post.seo.keywords?.ar || "",
    keywordsEn: post.seo.keywords?.en || "",
    ogImage: post.seo.ogImage || "",
    cardImage: post.cardImage || "",
    coverImage: post.coverImage || "",
    gallery1Src: post.gallery?.[0]?.src || "",
    gallery1AltAr: post.gallery?.[0]?.alt.ar || "",
    gallery1AltEn: post.gallery?.[0]?.alt.en || "",
    gallery2Src: post.gallery?.[1]?.src || "",
    gallery2AltAr: post.gallery?.[1]?.alt.ar || "",
    gallery2AltEn: post.gallery?.[1]?.alt.en || "",
    dateISO: post.dateISO,
    status: post.status,
  };
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="font-semibold text-foreground">{label}</Label>
        {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="card-elevated rounded-[1.6rem] border-border/70 bg-card/90">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        </div>
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function getSeedPosts(): AdminBlogPost[] {
  return blogPosts.map((post) => ({
    ...post,
    status: "published" as const,
  }));
}

function sortPostsNewestFirst(a: AdminBlogPost, b: AdminBlogPost) {
  return new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime();
}

function getInitialPosts(): AdminBlogPost[] {
  const seededPosts = getSeedPosts();
  const legacyPosts = getLegacyAdminPosts() as AdminBlogPost[];
  const currentPosts = getAllAdminBlogPosts();
  const mergedById = new Map<string, AdminBlogPost>();

  for (const post of seededPosts) {
    mergedById.set(post.id, post);
  }

  for (const post of legacyPosts) {
    mergedById.set(post.id, post);
  }

  for (const post of currentPosts) {
    mergedById.set(post.id, post);
  }

  return Array.from(mergedById.values()).sort(sortPostsNewestFirst);
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "form">("list");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPosts(getInitialPosts());
  }, []);

  useEffect(() => {
    saveAllAdminBlogPosts(posts);
  }, [posts]);

  const stats = useMemo(
    () => ({
      total: posts.length,
      published: posts.filter((post) => post.status === "published").length,
      draft: posts.filter((post) => post.status === "draft").length,
    }),
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter(
      (post) =>
        post.slug.toLowerCase().includes(q) ||
        post.title.ar.toLowerCase().includes(q) ||
        post.title.en.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q),
    );
  }, [posts, search]);

  const handleChange = (key: keyof BlogForm, value: unknown) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if ((key === "titleAr" || key === "titleEn") && !editingId) {
        next.slug = slugify(next.titleEn || next.titleAr);
      }
      return next;
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      dateISO: new Date().toISOString().slice(0, 10),
    });
    setSelectedBlockId(null);
  };

  const openNewForm = () => {
    resetForm();
    setViewMode("form");
  };

  const openEditForm = (post: AdminBlogPost) => {
    setEditingId(post.id);
    const mapped = mapPostToForm(post);
    setForm(mapped);
    if (mapped.blocksAr.length > 0) {
      setSelectedBlockId(mapped.blocksAr[0].id);
    }
    setViewMode("form");
  };

  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslate = async () => {
    setIsTranslating(true);
    try {
      const [titleEn, excerptEn, metaTitleEn, metaDescriptionEn, translatedBlocks] =
        await Promise.all([
          translateArabicToEnglish(form.titleAr),
          translateArabicToEnglish(form.excerptAr),
          translateArabicToEnglish(form.metaTitleAr || form.titleAr),
          translateArabicToEnglish(form.metaDescriptionAr || form.excerptAr),
          translateContentBlocks(form.blocksAr),
        ]);

      setForm((prev) => ({
        ...prev,
        titleEn: titleEn || prev.titleAr,
        excerptEn: excerptEn || prev.excerptAr,
        blocksEn: (translatedBlocks as ContentBlock[]) || prev.blocksAr,
        contentEn: blocksToHtml((translatedBlocks as ContentBlock[]) || prev.blocksAr),
        metaTitleEn: metaTitleEn || titleEn || prev.titleAr,
        metaDescriptionEn: metaDescriptionEn || excerptEn || prev.excerptAr,
        keywordsEn: prev.keywordsEn || prev.keywordsAr,
        slug: prev.slug || slugify(titleEn || prev.titleAr),
      }));
    } catch {
      // Fallback
      setForm((prev) => ({
        ...prev,
        titleEn: prev.titleEn || prev.titleAr,
        excerptEn: prev.excerptEn || prev.excerptAr,
        contentEn: prev.contentEn || prev.contentAr,
        blocksEn: prev.blocksEn.length > 0 ? prev.blocksEn : prev.blocksAr,
        metaTitleEn: prev.metaTitleEn || prev.metaTitleAr || prev.titleAr,
        metaDescriptionEn: prev.metaDescriptionEn || prev.metaDescriptionAr || prev.excerptAr,
        keywordsEn: prev.keywordsEn || prev.keywordsAr,
        slug: prev.slug || slugify(prev.titleAr),
      }));
    } finally {
      setIsTranslating(false);
    }
  };

  // Elementor Block Helpers
  const addElementorBlock = (type: ContentBlock["type"]) => {
    let newBlock: ContentBlock;

    switch (type) {
      case "paragraph":
        newBlock = { id: generateBlockId(), type: "paragraph", text: "اكتب نص الفقرة هنا بكل حرية وسهولة..." };
        break;
      case "heading":
        newBlock = { id: generateBlockId(), type: "heading", level: 2, title: "عنوان فرعي جديد" };
        break;
      case "list":
        newBlock = { id: generateBlockId(), type: "list", style: "bullet", items: "العنصر الأول في القائمة\nالعنصر الثاني في القائمة\nالعنصر الثالث" };
        break;
      case "doctor":
        newBlock = { id: generateBlockId(), type: "doctor", doctorName: "د. باسم زكي", specialty: "استشاري طب التجميل وتنسيق القوام", text: "النتيجة الطبيعية والمحسوبة دائماً أسهل في الصيانة وتمنح مظهر راقي جذاب." };
        break;
      case "offer":
        newBlock = { id: generateBlockId(), type: "offer", offerTitle: "عرض الفراكشنال ليزر وتجديد البشرة", discount: "خصم 30%", linkUrl: "/ar/offers" };
        break;
      case "cta":
        newBlock = { id: generateBlockId(), type: "cta", title: "هل ترغبين في استشارة مخصصة لبشرتك؟", subtitle: "احجزي موعدك الآن مع استشاريي كايرو كوزمو سنتر بخطة علاجية متكاملة.", buttonText: "احجزي موعدك الآن" };
        break;
      case "faq":
        newBlock = { id: generateBlockId(), type: "faq", title: "أسئلة شائعة حول الإجراء", questions: [{ q: "هل يتطلب هذا الإجراء فترة نقاهة؟", a: "لا، يمكنك العودة لممارسة أنشطتك اليومية فوراً بعد الجلسة." }, { q: "متى تظهر النتائج النهائية؟", a: "تبدأ النتائج في الظهور خلال 3-5 أيام وتكتمل تدريجياً." }] };
        break;
      case "links":
        newBlock = { id: generateBlockId(), type: "links", title: "روابط ومصادر مفيدة", links: [{ label: "فوائد البوتوكس ومتى تظهر النتائج؟", url: "/ar/blog/botox-benefits" }, { label: "دليل الفيلر الشامل", url: "/ar/blog/dermal-fillers-guide" }] };
        break;
      case "image":
        newBlock = { id: generateBlockId(), type: "image", slot: "1" };
        break;
    }

    setForm((prev) => ({
      ...prev,
      blocksAr: [...prev.blocksAr, newBlock],
    }));
    setSelectedBlockId(newBlock.id);
  };

  const updateSelectedBlock = (updatedBlock: ContentBlock) => {
    setForm((prev) => ({
      ...prev,
      blocksAr: prev.blocksAr.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)),
    }));
  };

  const removeSelectedBlock = (blockId: string) => {
    setForm((prev) => ({
      ...prev,
      blocksAr: prev.blocksAr.filter((b) => b.id !== blockId),
    }));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };

  const moveBlockPosition = (index: number, direction: "up" | "down") => {
    setForm((prev) => {
      const list = [...prev.blocksAr];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, blocksAr: list };
    });
  };

  const applyPreset = (presetType: "laser-tips" | "hydra-benefits" | "botox-filler") => {
    if (presetType === "laser-tips") {
      const arBlocks: ContentBlock[] = [
        { id: generateBlockId(), type: "paragraph", text: "في كايرو كوزمو سنتر (Cairo Cosmo Center) هدفنا هو إبراز الجمال الطبيعي المتوازن. يعتمد أطباؤنا على نتائج هادئة ومحسوبة تناسب ملامح الوجه." },
        { id: generateBlockId(), type: "heading", level: 2, title: "ليه النتيجة الطبيعية هي الأفضل؟" },
        { id: generateBlockId(), type: "paragraph", text: "لأن الجمال الحقيقي يظهر في التفاصيل الدقيقة بدون مبالغة، والحفاظ على نضارة البشرة مع تقليص المسام." },
        { id: generateBlockId(), type: "list", style: "bullet", items: "ترطيب البشرة بالمرهم الطبي المخصص\nتجنب التعرض المباشر لأشعة الشمس لـ 48 ساعة\nاستخدام واقي الشمس الطبي ومتابعة الأخصائية" },
        { id: generateBlockId(), type: "doctor", doctorName: "د. ناهد سمير", specialty: "استشاري الجلدية والتجميل", text: "متابعة البشرة بعد جلسة الليزر بالترطيب الطبي تمنحك أفضل نتيجة بدون أي تهيج." },
        { id: generateBlockId(), type: "faq", title: "أسئلة شائعة حول جلسات الليزر", questions: [{ q: "متى يمكنني ممارسة الرياضة بعد الجلسة؟", a: "يُفضل الانتظار لمدة 24 ساعة لتجنب التعرق الزائد والتهيج." }, { q: "هل يتطلب الليزر فترة نقاهة؟", a: "لا، يمكنك العودة لممارسة حياتك اليومية فوراً بعد الجلسة." }] },
        { id: generateBlockId(), type: "cta", title: "احجزي استشارتك المجانية لليزر الآن", subtitle: "فريقنا الطبي جاهز لتقييم نوع بشرتك واختيار جهاز الليزر الأنسب لك.", buttonText: "احجزي موعدك الآن" },
      ];

      setForm((prev) => ({
        ...prev,
        titleAr: "أهم 5 نصائح للعناية بالبشرة بعد جلسة الليزر",
        titleEn: "Top 5 Skincare Tips After Laser Sessions",
        category: "news",
        excerptAr: "دليل شامل لأهم الإرشادات والماسكات الواجب تجنبها بعد جلسات إزالة الشعر وتجديد البشرة بالليزر.",
        excerptEn: "Complete guide on post-laser skincare instructions and habits to avoid.",
        blocksAr: arBlocks,
        contentAr: blocksToHtml(arBlocks),
        status: "published",
        slug: "post-laser-skincare-tips",
      }));
    } else if (presetType === "hydra-benefits") {
      const arBlocks: ContentBlock[] = [
        { id: generateBlockId(), type: "paragraph", text: "تتعرض البشرة يومياً للتلوث والشوائب التي تسد المسام وتفقدها نضارتها. تساعد جلسة الهيدرافيشل على تنظيف وتقشير الجلد وضخ الفيتامينات." },
        { id: generateBlockId(), type: "heading", level: 2, title: "فوائد الهيدرافيشل الشهرية للبشرة" },
        { id: generateBlockId(), type: "list", style: "bullet", items: "إزالة الرؤوس السوداء والشوائب العميقة\nضخ الفيتامينات والترطيب المباشر\nتحفيز الدورة الدموية وإعادة النضارة" },
        { id: generateBlockId(), type: "offer", offerTitle: "باقة الهيدرافيشل والتغذية العميقة", discount: "خصم 25%", linkUrl: "/ar/offers" },
        { id: generateBlockId(), type: "links", title: "روابط داخلية مفيدة", links: [{ label: "احجزي جلسة هيدرافيشل الآن", url: "/ar/booking" }, { label: "استكشفي خدمات العناية بالبشرة", url: "/ar/services" }] },
      ];

      setForm((prev) => ({
        ...prev,
        titleAr: "لماذا تختار جلسات الهيدرافيشل لتنظيف البشرة شهرياً؟",
        titleEn: "Why Choose Monthly Hydrafacial Sessions?",
        category: "service",
        serviceSlug: "hydrafacial",
        excerptAr: "تقنية الهيدرافيشل تجمع بين تقشير المسام وتغذية الجلد بالسيرومات الطبيعية في جلسة واحدة.",
        excerptEn: "Hydrafacial technology combines pore cleansing and skin nourishment in one session.",
        blocksAr: arBlocks,
        contentAr: blocksToHtml(arBlocks),
        status: "published",
        slug: "hydrafacial-monthly-glow-benefits",
      }));
    } else if (presetType === "botox-filler") {
      const arBlocks: ContentBlock[] = [
        { id: generateBlockId(), type: "paragraph", text: "يتساءل الكثيرون عن الفارق بين البوتوكس والفيلر ومجالات استخدام كل منهما للحصول على نتيجة طبيعية متوازنة." },
        { id: generateBlockId(), type: "heading", level: 2, title: "الفرق الأساسي بين البوتوكس والفيلر" },
        { id: generateBlockId(), type: "paragraph", text: "البوتوكس يعمل على إرخاء العضلات المسببة للتجاعيد التعبيرية في الجبهة وحول العين، بينما يعوض الفيلر فقدان الحجم في الخدود والشفاه." },
        { id: generateBlockId(), type: "doctor", doctorName: "د. باسم زكي", specialty: "استشاري التجميل", text: "التدرج والتوازن أهم قاعدتين لحقن التجميل للحفاظ على تعبيرات وجهك الطبيعية." },
        { id: generateBlockId(), type: "faq", title: "أسئلة شائعة حول البوتوكس والفيلر", questions: [{ q: "هل الحقن يسبب أي ألم؟", a: "يتم استخدام مخدر موضعي خفيف لجعل الجلسة مريحة بدون ألم." }, { q: "كم تستمر نتائج الفيلر؟", a: "تستمر النتائج عادة بين 9 إلى 12 شهراً حسب نوع المادة والمنطقة." }] },
      ];

      setForm((prev) => ({
        ...prev,
        titleAr: "الفرق بين البوتوكس والفيلر: كيف تختار المناسب لك؟",
        titleEn: "Botox vs Fillers: How to Choose the Right Treatment?",
        category: "faq",
        excerptAr: "مقارنة دقيقة ومفصلة بين طريقة عمل البوتوكس لإرخاء العضلات والفيلر لملء الفراغات.",
        excerptEn: "Detailed comparison between Botox for muscle relaxation and Fillers for volume.",
        blocksAr: arBlocks,
        contentAr: blocksToHtml(arBlocks),
        status: "published",
        slug: "botox-vs-fillers-guide",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = mapFormToPost(form);

    if (editingId) {
      setPosts((prev) => prev.map((post) => (post.id === editingId ? payload : post)));
    } else {
      setPosts((prev) => [payload, ...prev]);
    }

    setViewMode("list");
    resetForm();
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
    if (editingId === id) resetForm();
  };

  const selectedBlock = useMemo(
    () => form.blocksAr.find((b) => b.id === selectedBlockId) || null,
    [form.blocksAr, selectedBlockId],
  );

  return (
    <div className="space-y-6">
      {viewMode === "list" ? (
        /* List Mode View */
        <div className="space-y-6">
          <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">المقالات والأخبار الطبية</p>
              <h2 className="mt-1 text-3xl font-black text-foreground">إدارة مدونة المركز</h2>
            </div>

            <Button onClick={openNewForm} size="lg" className="rounded-2xl btn-primary-gradient border-0 font-bold shadow-md shadow-primary/20">
              <Plus className="ml-2 h-5 w-5" />
              إضافة مقال جديد
            </Button>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <StatCard title="إجمالي المقالات" value={stats.total} icon={FileText} />
            <StatCard title="المقالات المنشورة" value={stats.published} icon={CheckCircle2} />
            <StatCard title="المسودات" value={stats.draft} icon={Clock3} />
          </section>

          <Card className="glass-panel rounded-[2rem] border-border/70 bg-card/90">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:max-w-md">
                  <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث بالعنوان أو التصنيف..."
                    className="h-11 rounded-2xl border-border bg-background/70 pr-10"
                  />
                </div>

                <div className="text-sm text-muted-foreground">
                  عدد المقالات: <span className="font-bold text-foreground">{filteredPosts.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.length === 0 ? (
              <Card className="col-span-full rounded-[2rem] border-border/70 bg-card/70 p-12 text-center text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 text-primary/40 mb-3" />
                <p className="text-lg font-bold text-foreground">لا توجد مقالات مطابقة</p>
                <p className="mt-1 text-sm">اضغط على زر "إضافة مقال جديد" لإضافة نصائح ومقالات جديدة للموقع</p>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="card-elevated flex flex-col justify-between overflow-hidden rounded-[2rem] border-border/70 bg-card/90">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={cn("rounded-full px-3 py-1 text-xs font-semibold", post.status === "published" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                        {post.status === "published" ? "منشور" : "مسودة"}
                      </Badge>
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                        {post.category}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="line-clamp-1 text-xl font-bold text-foreground">{post.title.ar}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{post.excerpt.ar}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/60 pt-3">
                      <span>تاريخ النشر: <strong className="text-foreground">{post.dateISO}</strong></span>
                    </div>
                  </CardContent>

                  <div className="border-t border-border/60 bg-muted/20 p-4 flex items-center justify-between gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditForm(post)} className="rounded-xl flex-1">
                      <Pencil className="ml-1.5 h-4 w-4" />
                      تعديل
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="rounded-xl">
                      <a href={`/ar/blog/${post.slug}`} target="_blank" rel="noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} className="rounded-xl">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Elementor Live Builder View */
        <div className="space-y-6">
          {/* Top Control Header Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/70 pb-4 bg-card/80 p-4 rounded-[2rem]">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setViewMode("list")} className="rounded-xl">
                <ArrowRight className="ml-1.5 h-4 w-4" />
                العودة للقائمة
              </Button>

              <div>
                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                  <LayoutTemplate className="h-5 w-5 text-primary" />
                  {editingId ? `تعديل مقال: ${form.titleAr || "بدون عنوان"}` : "محرّر إلمنتور التفاعلي الحي (Elementor Live Builder)"}
                </h2>
              </div>
            </div>

            {/* View Modes */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-xl bg-muted p-1 text-xs">
                <button
                  type="button"
                  onClick={() => handleChange("activeEditorMode", "elementor")}
                  className={cn("px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5", form.activeEditorMode === "elementor" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  🎨 Elementor Live Builder
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("activeEditorMode", "form")}
                  className={cn("px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5", form.activeEditorMode === "form" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
                >
                  🇪🇬 البيانات بالعربية والإنجليزية
                </button>
                <button
                  type="button"
                  onClick={() => handleChange("activeEditorMode", "settings")}
                  className={cn("px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5", form.activeEditorMode === "settings" ? "bg-background text-primary shadow-sm" : "text-muted-foreground")}
                >
                  ⚙️ SEO والتصنيفات
                </button>
              </div>

              {/* Presets & Auto-Translate */}
              <div className="hidden xl:flex items-center gap-1.5">
                <Button variant="secondary" size="sm" onClick={() => applyPreset("laser-tips")} className="rounded-xl text-xs">
                  <Sparkle className="ml-1 h-3 w-3 text-primary" />
                  نصائح ليزر
                </Button>
                <Button variant="secondary" size="sm" onClick={() => applyPreset("hydra-benefits")} className="rounded-xl text-xs">
                  <Sparkle className="ml-1 h-3 w-3 text-primary" />
                  هيدرافيشل
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAutoTranslate}
                disabled={isTranslating}
                className="rounded-xl border-primary/30 text-primary font-bold text-xs hover:bg-primary/10"
              >
                <Wand2 className={cn("ml-1.5 h-4 w-4 text-primary", isTranslating && "animate-spin")} />
                {isTranslating ? "جاري ترجمة المقال بالذكاء الاصطناعي..." : "🤖 ترجمة المقال كاملاً للإنجليزية"}
              </Button>

              <Button onClick={handleSubmit} className="rounded-xl btn-primary-gradient border-0 font-bold px-6">
                <Save className="ml-1.5 h-4 w-4" />
                حفظ المقال
              </Button>
            </div>
          </div>

          {form.activeEditorMode === "elementor" ? (
            /* Elementor Split-Screen (Sidebar Widgets + Live Canvas Stage) */
            <div className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
              {/* Elementor Left Control Sidebar */}
              <div className="space-y-6 sticky top-24">
                <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-lg overflow-hidden">
                  <div className="p-4 border-b border-border/60 bg-muted/30 flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground flex items-center gap-2">
                      <LayoutTemplate className="h-4 w-4 text-primary" />
                      لوحة عناصر إلمنتور (Widgets)
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {form.blocksAr.length} عنصر
                    </Badge>
                  </div>

                  <CardContent className="p-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto">
                    {/* Add Widgets Grid */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">إضافة عناصر للمقال:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("paragraph")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold hover:border-primary/50">
                          <span className="flex items-center gap-1 text-primary"><AlignLeft className="h-3.5 w-3.5" /> فقرة نصية</span>
                          <span className="text-[10px] text-muted-foreground font-normal">شرح ونصوص</span>
                        </Button>

                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("heading")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold hover:border-primary/50">
                          <span className="flex items-center gap-1 text-primary"><Heading2 className="h-3.5 w-3.5" /> عنوان فرعي</span>
                          <span className="text-[10px] text-muted-foreground font-normal">H2 / H3</span>
                        </Button>

                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("list")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold hover:border-primary/50">
                          <span className="flex items-center gap-1 text-primary"><ListOrdered className="h-3.5 w-3.5" /> قائمة عناصر</span>
                          <span className="text-[10px] text-muted-foreground font-normal">نقاط أو أرقام</span>
                        </Button>

                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("doctor")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold border-primary/20 bg-primary/5 hover:border-primary">
                          <span className="flex items-center gap-1 text-primary"><Stethoscope className="h-3.5 w-3.5" /> نصيحة طبيب</span>
                          <span className="text-[10px] text-muted-foreground font-normal">استشاري التجميل</span>
                        </Button>

                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("offer")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold border-primary/20 bg-primary/5 hover:border-primary">
                          <span className="flex items-center gap-1 text-primary"><BadgePercent className="h-3.5 w-3.5" /> بطاقة عرض</span>
                          <span className="text-[10px] text-muted-foreground font-normal">باقة أو خصم</span>
                        </Button>

                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("cta")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold border-primary/20 bg-primary/5 hover:border-primary">
                          <span className="flex items-center gap-1 text-primary"><MousePointerClick className="h-3.5 w-3.5" /> بنر حجز موعد</span>
                          <span className="text-[10px] text-muted-foreground font-normal">زر حجز مباشر</span>
                        </Button>

                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("faq")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold hover:border-primary/50">
                          <span className="flex items-center gap-1 text-primary"><HelpCircle className="h-3.5 w-3.5" /> أسئلة شائعة</span>
                          <span className="text-[10px] text-muted-foreground font-normal">سؤال وجواب</span>
                        </Button>

                        <Button type="button" variant="outline" size="sm" onClick={() => addElementorBlock("links")} className="h-auto py-2.5 flex-col items-start gap-1 rounded-xl text-xs font-semibold hover:border-primary/50">
                          <span className="flex items-center gap-1 text-primary"><LinkIcon className="h-3.5 w-3.5" /> مصادر وروابط</span>
                          <span className="text-[10px] text-muted-foreground font-normal">روابط موثوقة</span>
                        </Button>
                      </div>
                    </div>

                    {/* Block Inspector Properties Panel */}
                    <div className="border-t border-border/60 pt-4 space-y-3">
                      <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {selectedBlock ? `تعديل خصائص: ${selectedBlock.type}` : "انقر على أي قسم لتعديله"}
                      </Label>

                      {selectedBlock ? (
                        <div className="space-y-3 bg-muted/30 p-3 rounded-2xl border border-border/60">
                          {selectedBlock.type === "paragraph" ? (
                            <Field label="محتوى الفقرة النصية">
                              <Textarea
                                value={selectedBlock.text}
                                onChange={(e) => updateSelectedBlock({ ...selectedBlock, text: e.target.value })}
                                rows={4}
                                className="rounded-xl border-border bg-background text-sm"
                              />
                            </Field>
                          ) : null}

                          {selectedBlock.type === "heading" ? (
                            <div className="space-y-3">
                              <Field label="مستوى العنوان">
                                <Select value={String(selectedBlock.level)} onValueChange={(val) => updateSelectedBlock({ ...selectedBlock, level: Number(val) as 2 | 3 })}>
                                  <SelectTrigger className="h-10 rounded-xl">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="2">عنوان رئيسي H2</SelectItem>
                                    <SelectItem value="3">عنوان فرعي H3</SelectItem>
                                  </SelectContent>
                                </Select>
                              </Field>
                              <Field label="نص العنوان">
                                <Input
                                  value={selectedBlock.title}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, title: e.target.value })}
                                  className="h-10 rounded-xl bg-background"
                                />
                              </Field>
                            </div>
                          ) : null}

                          {selectedBlock.type === "doctor" ? (
                            <div className="space-y-3">
                              <Field label="اسم الاستشاري">
                                <Input
                                  value={selectedBlock.doctorName}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, doctorName: e.target.value })}
                                  className="h-10 rounded-xl bg-background"
                                />
                              </Field>
                              <Field label="التخصص">
                                <Input
                                  value={selectedBlock.specialty}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, specialty: e.target.value })}
                                  className="h-10 rounded-xl bg-background"
                                />
                              </Field>
                              <Field label="نص النصيحة أو التوضيح الطبي">
                                <Textarea
                                  value={selectedBlock.text}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, text: e.target.value })}
                                  rows={3}
                                  className="rounded-xl bg-background text-xs"
                                />
                              </Field>
                            </div>
                          ) : null}

                          {selectedBlock.type === "offer" ? (
                            <div className="space-y-3">
                              <Field label="عنوان العرض">
                                <Input
                                  value={selectedBlock.offerTitle}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, offerTitle: e.target.value })}
                                  className="h-10 rounded-xl bg-background"
                                />
                              </Field>
                              <Field label="شارة الخصم">
                                <Input
                                  value={selectedBlock.discount}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, discount: e.target.value })}
                                  className="h-10 rounded-xl bg-background"
                                />
                              </Field>
                              <Field label="رابط صفحة العرض">
                                <Input
                                  value={selectedBlock.linkUrl}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, linkUrl: e.target.value })}
                                  className="h-10 rounded-xl bg-background text-xs"
                                />
                              </Field>
                            </div>
                          ) : null}

                          {selectedBlock.type === "cta" ? (
                            <div className="space-y-3">
                              <Field label="العنوان التشجيعي">
                                <Input
                                  value={selectedBlock.title}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, title: e.target.value })}
                                  className="h-10 rounded-xl bg-background"
                                />
                              </Field>
                              <Field label="الوصف الفرعي">
                                <Textarea
                                  value={selectedBlock.subtitle}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, subtitle: e.target.value })}
                                  rows={2}
                                  className="rounded-xl bg-background text-xs"
                                />
                              </Field>
                              <Field label="نص زر الحجز">
                                <Input
                                  value={selectedBlock.buttonText}
                                  onChange={(e) => updateSelectedBlock({ ...selectedBlock, buttonText: e.target.value })}
                                  className="h-10 rounded-xl bg-background"
                                />
                              </Field>
                            </div>
                          ) : null}

                          {selectedBlock.type === "list" ? (
                            <Field label="عناصر القائمة (كل عنصر في سطر)">
                              <Textarea
                                value={selectedBlock.items}
                                onChange={(e) => updateSelectedBlock({ ...selectedBlock, items: e.target.value })}
                                rows={4}
                                className="rounded-xl bg-background text-xs"
                              />
                            </Field>
                          ) : null}

                          <Button type="button" variant="destructive" size="sm" onClick={() => removeSelectedBlock(selectedBlock.id)} className="w-full rounded-xl text-xs mt-2">
                            <Trash2 className="ml-1.5 h-3.5 w-3.5" />
                            حذف هذا العنصر
                          </Button>
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                          انقر على أي قسم داخل شاشة المعاينة الحية لتنشيط خصائصه وتعديل نصوصه هنا
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Elementor Main Stage: Live Article Canvas */}
              <Card className="rounded-[2.5rem] border-border/80 bg-card shadow-2xl overflow-hidden min-h-[750px]">
                {/* Simulated Website Navigation Bar */}
                <div className="border-b border-border/60 bg-muted/40 p-4 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                    <span className="mr-2 text-foreground font-semibold">https://cairocosmo.com/ar/blog/{form.slug || "preview"}</span>
                  </div>
                  <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary font-semibold">
                    معاينة حية ومباشرة (Live Elementor Stage)
                  </Badge>
                </div>

                {/* Live Article Stage Rendering */}
                <div className="p-6 md:p-12 space-y-8 max-w-3xl mx-auto">
                  {/* Article Header Preview */}
                  <div className="space-y-4 border-b border-border/60 pb-6">
                    <Input
                      value={form.titleAr}
                      onChange={(e) => handleChange("titleAr", e.target.value)}
                      placeholder="عنوان المقال الرئيسي (انقر هنا للتعديل المباشر)..."
                      className="text-2xl md:text-3xl font-black border-0 bg-transparent p-0 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground/50"
                    />

                    <Textarea
                      value={form.excerptAr}
                      onChange={(e) => handleChange("excerptAr", e.target.value)}
                      rows={2}
                      placeholder="الملخص الجذاب للمقال..."
                      className="text-sm md:text-base border-0 bg-transparent p-0 focus-visible:ring-0 text-muted-foreground placeholder:text-muted-foreground/40 resize-none"
                    />

                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" /> {form.dateISO}</span>
                      <span>•</span>
                      <span>4 دقائق قراءة</span>
                    </div>
                  </div>

                  {/* Cover Image Preview */}
                  {form.coverImage ? (
                    <div className="overflow-hidden rounded-3xl border border-border/70 shadow-md">
                      <img src={form.coverImage} alt="cover-preview" className="h-64 w-full object-cover" />
                    </div>
                  ) : null}

                  {/* Live Render Blocks Stage */}
                  <div className="space-y-6">
                    {form.blocksAr.length === 0 ? (
                      <div className="rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 p-12 text-center text-muted-foreground">
                        <Sparkles className="mx-auto h-10 w-10 text-primary mb-3 animate-pulse" />
                        <p className="text-base font-bold text-foreground">مسرح المقال فارغ حالياً</p>
                        <p className="text-xs mt-1">اضغط على أي عنصر من اللوحة الجانبية لإدراج فقرة أو عنوان أو بطاقة دكتور فورياً</p>
                      </div>
                    ) : (
                      form.blocksAr.map((block, idx) => {
                        const isSelected = selectedBlockId === block.id;

                        return (
                          <div
                            key={block.id}
                            onClick={() => setSelectedBlockId(block.id)}
                            className={cn(
                              "group relative rounded-2xl p-4 transition-all cursor-pointer border-2",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-transparent hover:border-primary/30 hover:bg-muted/30",
                            )}
                          >
                            {/* Elementor Hover Toolbar Badge */}
                            <div className="absolute -top-3.5 right-4 z-10 hidden group-hover:flex items-center gap-1.5 rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold text-primary-foreground shadow-md">
                              <span>
                                {block.type === "paragraph" && "فقرة نصية"}
                                {block.type === "heading" && `عنوان H${block.level}`}
                                {block.type === "list" && "قائمة نقاط"}
                                {block.type === "doctor" && "بطاقة طبيب"}
                                {block.type === "offer" && "بطاقة عرض"}
                                {block.type === "cta" && "بنر حجز"}
                                {block.type === "faq" && "أسئلة شائعة"}
                                {block.type === "links" && "روابط ومصادر"}
                              </span>

                              <div className="flex items-center gap-1 mr-2 border-r border-primary-foreground/30 pr-2">
                                <button type="button" onClick={(e) => { e.stopPropagation(); moveBlockPosition(idx, "up"); }} className="hover:opacity-75">
                                  <ChevronUp className="h-3 w-3" />
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); moveBlockPosition(idx, "down"); }} className="hover:opacity-75">
                                  <ChevronDown className="h-3 w-3" />
                                </button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); removeSelectedBlock(block.id); }} className="hover:text-red-200">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>

                            {/* Rendered Block Components */}
                            {block.type === "paragraph" ? (
                              <p className="text-base text-foreground leading-relaxed font-normal">{block.text || "انقر هنا لتعديل نص الفقرة..."}</p>
                            ) : null}

                            {block.type === "heading" ? (
                              block.level === 2 ? (
                                <h2 className="text-2xl font-bold text-foreground border-b border-border/60 pb-2">{block.title || "عنوان فرعي H2"}</h2>
                              ) : (
                                <h3 className="text-xl font-bold text-foreground">{block.title || "عنوان فرعي H3"}</h3>
                              )
                            ) : null}

                            {block.type === "list" ? (
                              <ul className="list-disc list-inside space-y-1.5 text-base text-foreground">
                                {block.items.split("\n").filter(Boolean).map((item, lIdx) => (
                                  <li key={lIdx}>{item}</li>
                                ))}
                              </ul>
                            ) : null}

                            {block.type === "doctor" ? (
                              <div className="not-prose rounded-3xl border border-primary/20 bg-primary/5 p-6 space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    <Stethoscope className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-foreground text-lg">{block.doctorName}</div>
                                    <div className="text-xs text-primary font-semibold">{block.specialty}</div>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground italic leading-relaxed">“{block.text}”</p>
                              </div>
                            ) : null}

                            {block.type === "offer" ? (
                              <div className="not-prose rounded-3xl border border-primary/20 bg-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
                                <div className="space-y-1">
                                  <Badge className="bg-primary/15 text-primary text-xs rounded-full px-3 py-1 mb-1">{block.discount}</Badge>
                                  <div className="font-bold text-foreground text-lg">{block.offerTitle}</div>
                                </div>
                                <Button size="sm" className="rounded-xl btn-primary-gradient border-0">احجز العرض الآن</Button>
                              </div>
                            ) : null}

                            {block.type === "cta" ? (
                              <div className="not-prose rounded-3xl bg-primary/10 border border-primary/20 p-6 text-center space-y-3">
                                <h3 className="text-xl font-bold text-foreground">{block.title}</h3>
                                <p className="text-sm text-muted-foreground">{block.subtitle}</p>
                                <Button size="lg" className="rounded-2xl btn-primary-gradient border-0 font-bold px-8 shadow-md">
                                  {block.buttonText}
                                </Button>
                              </div>
                            ) : null}

                            {block.type === "faq" ? (
                              <div className="space-y-3 not-prose">
                                <h2 className="text-xl font-bold text-foreground">{block.title}</h2>
                                {block.questions.map((qItem, qIdx) => (
                                  <div key={qIdx} className="rounded-2xl border bg-background/60 p-4 space-y-1">
                                    <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                                      <HelpCircle className="h-4 w-4 text-primary" />
                                      {qItem.q || "السؤال..."}
                                    </div>
                                    <div className="text-xs text-muted-foreground leading-relaxed pr-6">{qItem.a || "الإجابة..."}</div>
                                  </div>
                                ))}
                              </div>
                            ) : null}

                            {block.type === "links" ? (
                              <div className="space-y-3 not-prose">
                                <h2 className="text-xl font-bold text-foreground">{block.title}</h2>
                                <div className="grid gap-2">
                                  {block.links.map((lItem, lIdx) => (
                                    <div key={lIdx} className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                                      <LinkIcon className="h-4 w-4" />
                                      <span>{lItem.label || "عنوان الرابط"}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ) : form.activeEditorMode === "form" ? (
            /* Traditional Arabic / English Form View */
            <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="عنوان المقال بالعربية">
                    <Input value={form.titleAr} onChange={(e) => handleChange("titleAr", e.target.value)} className="h-12 rounded-2xl" />
                  </Field>
                  <Field label="Article Title in English">
                    <Input value={form.titleEn} onChange={(e) => handleChange("titleEn", e.target.value)} className="h-12 rounded-2xl" />
                  </Field>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="الملخص بالعربية">
                    <Textarea value={form.excerptAr} onChange={(e) => handleChange("excerptAr", e.target.value)} rows={3} className="rounded-2xl" />
                  </Field>
                  <Field label="Excerpt in English">
                    <Textarea value={form.excerptEn} onChange={(e) => handleChange("excerptEn", e.target.value)} rows={3} className="rounded-2xl" />
                  </Field>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Settings & SEO View */
            <Card className="rounded-[2rem] border-border/70 bg-card/95 shadow-xl">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Field label="تصنيف المقال">
                    <Select value={form.category} onValueChange={(val: BlogCategory) => handleChange("category", val)}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="news">أخبار ونصائح عامة</SelectItem>
                        <SelectItem value="service">مقالات متعلقة بخدمة</SelectItem>
                        <SelectItem value="doctor">مقالات باسم طبيب</SelectItem>
                        <SelectItem value="faq">أسئلة شائعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="تاريخ النشر">
                    <Input type="date" value={form.dateISO} onChange={(e) => handleChange("dateISO", e.target.value)} className="h-12 rounded-2xl" />
                  </Field>

                  <Field label="حالة النشر">
                    <Select value={form.status} onValueChange={(val: AdminBlogPostStatus) => handleChange("status", val)}>
                      <SelectTrigger className="h-12 rounded-2xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="published">منشور على الموقع</SelectItem>
                        <SelectItem value="draft">مسودة خفية</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
