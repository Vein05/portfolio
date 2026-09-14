import rss from '@astrojs/rss';
import { posts } from '../data/posts.js';

export function GET(context) {
  return rss({
    title: 'Sugam Panthi',
    description:
      'Writing on LLM evaluation, tool-calling agents, and how people interact with LLMs.',
    site: context.site,
    items: posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((post) => ({
        title: post.title,
        description: post.excerpt,
        pubDate: new Date(`${post.date}T00:00:00Z`),
        link: `/blog/${post.slug}/`,
        categories: post.tags,
      })),
    customData: '<language>en-us</language>',
  });
}
