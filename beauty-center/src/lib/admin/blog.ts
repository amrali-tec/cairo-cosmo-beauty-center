import { blogPosts as defaultPosts, type BlogPost } from "@/lib/blog";

export type AdminBlogPostStatus = "draft" | "published";

export type AdminBlogPost = BlogPost & {
  status: AdminBlogPostStatus;
};

const STORAGE_KEY = "admin_blog_posts_v3";

export function getAllAdminBlogPosts(): AdminBlogPost[] {
  if (typeof window === "undefined") {
    return defaultPosts.map((p) => ({ ...p, status: "published" as const }));
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
    }
  }
  const initial = defaultPosts.map((p) => ({ ...p, status: "published" as const }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function saveAllAdminBlogPosts(posts: AdminBlogPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

export function getPublishedAdminBlogPosts(): AdminBlogPost[] {
  return getAllAdminBlogPosts().filter((post) => post.status === "published");
}
