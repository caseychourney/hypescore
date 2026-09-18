import { prisma } from '../../lib/prisma';
import { movieSlug, tmdbFetch, tmdbImage } from '../../lib/tmdb';

function authorized(req) {
  const secret = process.env.HYPESCORE_SYNC_SECRET;
  if (!secret) return false;
  const supplied = req.headers.authorization || '';
  return supplied === 'Bearer ' + secret;
}

async function upsertMovie(item, now) {
  const releaseDate = item.release_date ? new Date(item.release_date + 'T00:00:00Z') : null;
  const status = releaseDate && releaseDate <= now ? 'RELEASED' : 'UPCOMING';
  const data = {
    title: item.title || item.original_title || 'Untitled',
    status,
    releaseDate,
    overview: item.overview || null,
    originalLanguage: item.original_language || null,
    genres: item.genre_ids || [],
    posterUrl: tmdbImage(item.poster_path),
    backdropUrl: tmdbImage(item.backdrop_path, 'w1280'),
    sourceProvider: 'tmdb',
    sourceProviderId: String(item.id),
    sourceAttribution: 'TMDB',
    tmdbId: item.id,
  };
  const existing = await prisma.movie.findFirst({ where: { tmdbId: item.id } });
  if (existing) return prisma.movie.update({ where: { id: existing.id }, data });
  return prisma.movie.create({ data: { ...data, slug: movieSlug(data.title, item.id) } });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });
  if (!authorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const region = String(req.query.region || process.env.HYPESCORE_REGION || 'US').toUpperCase();
    const pages = Math.min(5, Math.max(1, Number.parseInt(req.query.pages || '3', 10) || 3));
    const now = new Date();
    const seen = new Map();
    for (const endpoint of ['/movie/now_playing', '/movie/upcoming', '/movie/popular']) {
      for (let page = 1; page <= pages; page += 1) {
        const data = await tmdbFetch(endpoint, { language: 'en-US', region, page });
        for (const item of data.results || []) seen.set(item.id, item);
      }
    }
    let imported = 0;
    for (const item of seen.values()) { await upsertMovie(item, now); imported += 1; }
    return res.status(200).json({ ok: true, provider: 'tmdb', region, imported, sourceCount: seen.size, note: 'TMDB metadata imported. HypeScore remains separate and is populated by HypeScore votes.' });
  } catch (error) {
    console.error('Movie sync error', error);
    return res.status(500).json({ error: error.message || 'Movie sync failed' });
  }
}
