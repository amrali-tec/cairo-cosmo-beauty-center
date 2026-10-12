import { getAllAdminBlogPosts } from "@/lib/admin/blog";
import type { BlogPost } from "@/lib/blog";

export type PostStatus = "draft" | "published";

export function getAllAdminPosts() {
  return getAllAdminBlogPosts();
}

export function getPublishedBlogPosts(): BlogPost[] {
  return getAllAdminBlogPosts()
    .filter((post) => post.status === "published")
    .sort(
      (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
    );
}

export function getAdminBlogPostBySlug(slug: string): BlogPost | undefined {
  return getPublishedBlogPosts().find((post) => post.slug === slug);
}