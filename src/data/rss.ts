import rss from '@astrojs/rss';
import { profile, type Lang } from './profile';
import { t, localePath } from './i18n';
import { getPosts, postSlug } from './blog';

export async function feed(lang: Lang, site: URL) {
  const posts = await getPosts(lang);
  return rss({
    title: `${profile.name} · ${t(lang, 'blog.title')}`,
    description: t(lang, 'blog.intro'),
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: post.data.tags,
      link: localePath(lang, `/blog/${postSlug(post)}/`),
    })),
    customData: `<language>${lang === 'en' ? 'en-us' : 'es-co'}</language>`,
  });
}
