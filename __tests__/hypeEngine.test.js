const {
  calculateHype,
  calculateMomentum,
  createReleaseSnapshot,
  calculateHypeDelivered,
} = require('../lib/hypeEngine');

describe('HypeScore engine v1', () => {
  const now = new Date('2026-09-17T00:00:00.000Z');

  test('handles Prisma enum values as well as lowercase API values', () => {
    const result = calculateHype([
      { choice: 'YES', createdAt: now, trustWeight: 1 },
      { choice: 'NO', createdAt: now, trustWeight: 1 },
    ], now);

    expect(result.score).toBe(50);
    expect(result.rawVotes).toBe(2);
    expect(result.effectiveVotes).toBe(2);
  });

  test('Bayesian prior prevents one vote from looking like certainty', () => {
    const result = calculateHype([
      { choice: 'YES', createdAt: now, trustWeight: 1 },
    ], now);

    expect(result.score).toBe(52);
  });

  test('watched and invalidated votes are excluded from live hype', () => {
    const result = calculateHype([
      { choice: 'YES', createdAt: now, watchedAt: now, trustWeight: 1 },
      { choice: 'NO', createdAt: now, invalidatedAt: now, trustWeight: 1 },
      { choice: 'YES', createdAt: now, trustWeight: 1 },
    ], now);

    expect(result.rawVotes).toBe(1);
    expect(result.score).toBe(52);
  });

  test('recency reduces the influence of older votes without deleting them', () => {
    const recent = calculateHype([
      { choice: 'YES', createdAt: now, trustWeight: 1 },
      { choice: 'NO', createdAt: now, trustWeight: 1 },
    ], now);

    const old = calculateHype([
      { choice: 'YES', createdAt: new Date('2026-06-04T00:00:00.000Z'), trustWeight: 1 },
      { choice: 'NO', createdAt: new Date('2026-06-04T00:00:00.000Z'), trustWeight: 1 },
    ], now);

    expect(recent.effectiveVotes).toBe(2);
    expect(old.effectiveVotes).toBeCloseTo(0.4, 1);
    expect(old.rawVotes).toBe(2);
  });

  test('momentum compares the latest snapshot with the latest snapshot at the cutoff', () => {
    const result = calculateMomentum([
      { at: '2026-09-01T00:00:00Z', score: 70 },
      { at: '2026-09-10T00:00:00Z', score: 76 },
      { at: '2026-09-17T00:00:00Z', score: 84 },
    ], now, 7);

    expect(result).toEqual({ change: 8, direction: 'up' });
  });

  test('release snapshot is immutable data with an engine version', () => {
    expect(createReleaseSnapshot(87.4, '2026-09-18T00:00:00Z')).toEqual({
      score: 87,
      releasedAt: '2026-09-18T00:00:00Z',
      type: 'pre_release_hype_snapshot',
      engineVersion: 'hypescore_engine_v1',
    });
  });

  test('hype delivered is calculated separately from hype', () => {
    expect(calculateHypeDelivered(80, 88)).toEqual({ gap: 8, label: 'delivered' });
    expect(calculateHypeDelivered(80, 75)).toEqual({ gap: -5, label: 'missed' });
    expect(calculateHypeDelivered(80, 82)).toEqual({ gap: 2, label: 'met_expectations' });
  });
});