/** HypeScore engine v1: audience intent, not arbitrary event bonuses. */

const PRIOR_MEAN = 0.5;
const PRIOR_STRENGTH = 20;
const HALF_LIFE_DAYS = 45;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function daysBetween(a, b) {
  return Math.max(0, (new Date(b) - new Date(a)) / 86400000);
}

function recencyWeight(createdAt, asOf = new Date()) {
  const age = daysBetween(createdAt, asOf);
  return Math.pow(0.5, age / HALF_LIFE_DAYS);
}

function normalizeChoice(choice) {
  return String(choice || '').toLowerCase();
}

function calculateHype(votes, asOf = new Date()) {
  const active = votes.filter((vote) => !vote.invalidatedAt && !vote.watchedAt && !vote.invalidated && !vote.watched);
  let weightedTotal = 0;
  let weightedIntent = 0;

  for (const vote of active) {
    const choice = normalizeChoice(vote.choice);
    const intent = choice === 'yes' ? 1 : choice === 'maybe' ? 0.5 : choice === 'no' ? 0 : null;
    if (intent === null) continue;

    const trustWeight = clamp(Number(vote.trustWeight ?? 1), 0, 1);
    const weight = recencyWeight(vote.createdAt, asOf) * trustWeight;
    weightedIntent += weight;
    weightedTotal += weight * intent;
  }

  const denominator = weightedIntent + PRIOR_STRENGTH;
  const score = denominator === 0 ? 50 : ((weightedTotal + PRIOR_MEAN * PRIOR_STRENGTH) / denominator) * 100;

  return {
    score: Math.round(clamp(score, 0, 100)),
    effectiveVotes: Number(weightedIntent.toFixed(1)),
    rawVotes: active.length,
  };
}

function calculateMomentum(history, now = new Date(), days = 7) {
  const cutoff = new Date(new Date(now).getTime() - days * 86400000);
  const current = [...history]
    .filter((point) => new Date(point.at) <= now)
    .sort((a, b) => new Date(b.at) - new Date(a.at))[0];
  const previous = [...history]
    .filter((point) => new Date(point.at) <= cutoff)
    .sort((a, b) => new Date(b.at) - new Date(a.at))[0];

  if (!current || !previous) return { change: 0, direction: 'flat' };

  const change = current.score - previous.score;
  return { change, direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat' };
}

function createReleaseSnapshot(score, releasedAt) {
  return {
    score: Math.round(clamp(score, 0, 100)),
    releasedAt,
    type: 'pre_release_hype_snapshot',
    engineVersion: 'hypescore_engine_v1',
  };
}

function calculateHypeDelivered(preReleaseHype, audienceScore) {
  const gap = Math.round(audienceScore - preReleaseHype);
  return {
    gap,
    label: gap >= 5 ? 'delivered' : gap <= -5 ? 'missed' : 'met_expectations',
  };
}

module.exports = {
  calculateHype,
  calculateMomentum,
  createReleaseSnapshot,
  calculateHypeDelivered,
  recencyWeight,
};