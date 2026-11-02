import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './profile';

export type Post = CollectionEntry<'blog'>;

export const postSlug = (post: Post) => post.id.split('/').slice(1).join('/');

export async function getPosts(lang: Lang): Promise<Post[]> {
  const posts = await getCollection(
    'blog',
    (p) => p.id.startsWith(`${lang}/`) && (import.meta.env.DEV || !p.data.draft),
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(d: Date, lang: Lang): string {
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-CO', { dateStyle: 'medium', timeZone: 'UTC' });
}
