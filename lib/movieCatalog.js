import { prisma } from './prisma';

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  d.setHours(0, 0, 0, 0);
  return d;
}

function serialize(movie) {
  const hype = movie.releaseSnapshot?.score ?? movie.snapshots?.[0]?.score ?? 0;
  return { slug: movie.slug, title: movie.title, releaseDate: movie.releaseDate?.toISOString() ?? null, runtimeMinutes: movie.runtimeMinutes, certification: movie.certification, genres: Array.isArray(movie.genres) ? movie.genres : [], posterUrl: movie.posterUrl, backdropUrl: movie.backdropUrl, hype, status: movie.status };
}

const include = { releaseSnapshot: { select: { score: true } }, snapshots: { orderBy: { capturedAt: 'desc' }, take: 1, select: { score: true } } };

export async function getHomeSections(now = new Date()) {
  const weekStart = startOfWeek(now);
  const weekEnd = new Date(weekStart.getTime() + 7 * 86400000);
  const cutoff = new Date(now.getTime() - 120 * 86400000);
  const [all, opening, theatres, upcoming] = await Promise.all([
    prisma.movie.findMany({ where: { status: { not: 'STREAMING' } }, include, orderBy: { updatedAt: 'desc' }, take: 100 }),
    prisma.movie.findMany({ where: { releaseDate: { gte: weekStart, lt: weekEnd }, status: { not: 'STREAMING' } }, include, orderBy: { releaseDate: 'asc' }, take: 20 }),
    prisma.movie.findMany({ where: { status: 'RELEASED', releaseDate: { gte: cutoff, lte: now } }, include, orderBy: { releaseDate: 'desc' }, take: 30 }),
    prisma.movie.findMany({ where: { status: 'UPCOMING', releaseDate: { gt: now } }, include, orderBy: { releaseDate: 'asc' }, take: 30 })
  ]);
  const ranked = all.map(serialize).filter(m => m.hype > 0).sort((a,b) => b.hype - a.hype);
  return { mostHyped: ranked.slice(0,8), topHyped: ranked.slice(0,10), openingThisWeek: opening.map(serialize).sort((a,b)=>b.hype-a.hype), inTheatresNow: theatres.map(serialize).sort((a,b)=>b.hype-a.hype), comingSoon: upcoming.map(serialize), weekStart, weekEnd };
}

export async function searchMovies(query, page = 1, pageSize = 24) {
  const q = String(query || '').trim();
  const skip = Math.max(0, (page - 1) * pageSize);
  const where = q ? { title: { contains: q, mode: 'insensitive' } } : {};
  const [movies, total] = await Promise.all([
    prisma.movie.findMany({ where, include, orderBy: [{ releaseDate: 'desc' }, { title: 'asc' }], skip, take: pageSize }),
    prisma.movie.count({ where })
  ]);
  return { results: movies.map(serialize), total, page, pageSize, pages: Math.ceil(total / pageSize) };
}
