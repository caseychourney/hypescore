const { calculateHype, calculateMomentum, createReleaseSnapshot, calculateHypeDelivered } = require('./hypeEngine');

describe('HypeScore engine v1', () => {
  test('neutral prior keeps an empty movie at 50', () => {
    expect(calculateHype([]).score).toBe(50);
  });

  test('one vote is smoothed toward neutral', () => {
    const result = calculateHype([{ choice: 'yes', createdAt: '2026-09-17T00:00:00Z' }], new Date('2026-09-17T00:00:00Z'));
    expect(result.score).toBe(52);
    expect(result.rawVotes).toBe(1);
  });

  test('watched and invalidated votes do not affect live hype', () => {
    const result = calculateHype([
      { choice: 'yes', createdAt: '2026-09-17T00:00:00Z', watched: true },
      { choice: 'no', createdAt: '2026-09-17T00:00:00Z', invalidated: true },
      { choice: 'yes', createdAt: '2026-09-17T00:00:00Z' }
    ], new Date('2026-09-17T00:00:00Z'));
    expect(result.rawVotes).toBe(1);
    expect(result.score).toBe(52);
  });

  test('momentum compares the latest point to the latest point at or before the cutoff', () => {
    const history = [
      { at: '2026-09-01T00:00:00Z', score: 70 },
      { at: '2026-09-10T00:00:00Z', score: 78 },
      { at: '2026-09-17T00:00:00Z', score: 84 }
    ];
    expect(calculateMomentum(history, new Date('2026-09-17T00:00:00Z'), 7)).toEqual({ change: 6, direction: 'up' });
  });

  test('release snapshot is bounded and versioned', () => {
    expect(createReleaseSnapshot(112, '2026-09-17T00:00:00Z')).toEqual({
      score: 100,
      releasedAt: '2026-09-17T00:00:00Z',
      type: 'pre_release_hype_snapshot',
      engineVersion: 'hypescore_engine_v1'
    });
  });

  test('hype delivered compares audience result with release hype', () => {
    expect(calculateHypeDelivered(80, 90)).toEqual({ gap: 10, label: 'delivered' });
    expect(calculateHypeDelivered(90, 80)).toEqual({ gap: -10, label: 'missed' });
    expect(calculateHypeDelivered(80, 83)).toEqual({ gap: 3, label: 'met_expectations' });
  });
});
