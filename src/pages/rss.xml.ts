import type { APIContext } from 'astro';
import { feed } from '../data/rss';

export const GET = (context: APIContext) => feed('en', context.site!);
