import { getHomeSections, searchMovies } from '../../lib/movieCatalog';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : '';
    if (q.trim()) {
      const page = Math.max(1, Number.parseInt(req.query.page || '1', 10) || 1);
      const pageSize = Math.min(50, Math.max(1, Number.parseInt(req.query.pageSize || '24', 10) || 24));
      return res.status(200).json(await searchMovies(q, page, pageSize));
    }
    const data = await getHomeSections();
    return res.status(200).json({ ...data, weekStart: data.weekStart.toISOString(), weekEnd: data.weekEnd.toISOString() });
  } catch (error) {
    console.error('Movie catalog API error', error);
    return res.status(500).json({ error: 'Unable to load movie catalog' });
  }
}
