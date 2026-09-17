import { prisma } from '../../../../lib/prisma';
import { calculateHype, calculateMomentum } from '../../../../lib/hypeEngine';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const movie = await prisma.movie.findUnique({
      where: { id: req.query.id },
      include: {
        votes: true,
        snapshots: { orderBy: { capturedAt: 'desc' }, take: 100 },
        releaseSnapshot: true,
      },
    });

    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    const now = new Date();
    const hype = calculateHype(movie.votes, now);
    const history = movie.snapshots.map((s) => ({ at: s.capturedAt, score: s.score }));
    const momentum = calculateMomentum(history, now, 7);

    return res.status(200).json({
      movieId: movie.id,
      title: movie.title,
      hype,
      momentum,
      releaseSnapshot: movie.releaseSnapshot,
      updatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error('Hype read error', error);
    return res.status(500).json({ error: 'Unable to calculate Hype' });
  }
}
