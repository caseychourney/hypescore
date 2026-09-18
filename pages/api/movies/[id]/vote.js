import { prisma } from '../../../../lib/prisma';
import { calculateHype } from '../../../../lib/hypeEngine';

const choices = new Set(['yes', 'maybe', 'no']);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { choice, userId } = req.body || {};

  if (!choices.has(choice)) return res.status(400).json({ error: 'choice must be yes, maybe, or no' });
  if (!userId || typeof userId !== 'string') return res.status(400).json({ error: 'userId is required until authentication is connected' });

  try {
    const movie = await prisma.movie.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    if (movie.status !== 'UPCOMING') return res.status(409).json({ error: 'This movie is no longer in the pre-release Hype pool' });

    await prisma.user.upsert({ where:{id:userId}, update:{}, create:{id:userId} });

    const existing = await prisma.hypeVote.findUnique({ where: { userId_movieId: { userId, movieId: movie.id } } });
    const now = new Date();
    const normalizedChoice = choice.toUpperCase();

    const vote = await prisma.hypeVote.upsert({
      where: { userId_movieId: { userId, movieId: movie.id } },
      update: { choice: normalizedChoice, watchedAt: null, invalidatedAt: null, updatedAt: now },
      create: { userId, movieId: movie.id, choice: normalizedChoice, createdAt: now },
    });

    await prisma.hypeVoteAudit.create({
      data: { voteId: vote.id, oldChoice: existing?.choice || null, newChoice: vote.choice, action: existing ? 'changed' : 'created' },
    });

    const votes = await prisma.hypeVote.findMany({ where: { movieId: movie.id } });
    const result = calculateHype(votes, now);

    await prisma.hypeSnapshot.create({
      data: { movieId: movie.id, score: result.score, effectiveVotes: result.effectiveVotes, rawVotes: result.rawVotes, engineVersion: 'hypescore_engine_v1', capturedAt: now },
    });

    return res.status(200).json({ movieId: movie.id, slug: movie.slug, choice: normalizedChoice, hype: result.score, effectiveVotes: result.effectiveVotes, rawVotes: result.rawVotes, updatedAt: now.toISOString() });
  } catch (error) {
    console.error('Hype vote error', error);
    return res.status(500).json({ error: 'Unable to save Hype vote' });
  }
}
