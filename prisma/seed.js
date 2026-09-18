const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const movies = [
  {
    slug: 'spider-man-brand-new-day',
    title: 'Spider-Man: Brand New Day',
    status: 'RELEASED',
    releaseDate: new Date('2026-07-31T00:00:00Z'),
    genres: ['Science Fiction', 'Action', 'Adventure'],
    posterUrl: 'https://media.themoviedb.org/t/p/w500/9JCQtDCSpPR2ld55yNlEg1VwcQo.jpg',
    overview: 'Spider-Man returns for a new chapter.',
    sourceProvider: 'tmdb',
    sourceProviderId: '969681',
    sourceAttribution: 'TMDB',
    tmdbId: 969681,
    hype: 94
  },
  {
    slug: 'the-odyssey',
    title: 'The Odyssey',
    status: 'RELEASED',
    releaseDate: new Date('2026-07-17T00:00:00Z'),
    runtimeMinutes: 172,
    genres: ['Action', 'Adventure', 'Fantasy'],
    posterUrl: 'https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-odyssey/images/regions/ca/updates1/onesheet.jpg',
    overview: 'Christopher Nolan’s mythic action epic inspired by Homer’s Odyssey.',
    tagline: 'Defy the gods.',
    sourceProvider: 'tmdb',
    sourceProviderId: '157336',
    sourceAttribution: 'TMDB',
    tmdbId: 157336,
    hype: 91
  },
  {
    slug: 'practical-magic-2',
    title: 'Practical Magic 2',
    status: 'RELEASED',
    releaseDate: new Date('2026-09-11T00:00:00Z'),
    runtimeMinutes: 130,
    genres: ['Comedy', 'Drama', 'Fantasy'],
    posterUrl: 'https://www.practicalmagicmovie.com/assets/images/mobilebanner.jpg',
    overview: 'The Owens family faces a new magical threat.',
    sourceProvider: 'official',
    sourceProviderId: 'practical-magic-2',
    sourceAttribution: 'Warner Bros.',
    hype: 87
  },
  {
    slug: 'dune-part-three',
    title: 'Dune: Part Three',
    status: 'UPCOMING',
    releaseDate: new Date('2026-12-18T00:00:00Z'),
    genres: ['Science Fiction', 'Action', 'Adventure', 'Drama'],
    posterUrl: 'https://image.tmdb.org/t/p/w500/o95CF7NK5FDD2qR2mEI7nQw3JIm.jpg',
    overview: 'The epic conclusion to Denis Villeneuve’s Dune trilogy.',
    sourceProvider: 'tmdb',
    sourceProviderId: '1170608',
    sourceAttribution: 'TMDB',
    tmdbId: 1170608,
    hype: 93
  }
];

async function main() {
  for (const movie of movies) {
    const { hype, ...data } = movie;
    const saved = await prisma.movie.upsert({
      where: { slug: movie.slug },
      update: data,
      create: data
    });

    await prisma.hypeReleaseSnapshot.upsert({
      where: { movieId: saved.id },
      update: {
        score: hype,
        releaseAt: saved.releaseDate || new Date(),
        effectiveVotes: 100,
        rawVotes: 100,
        engineVersion: 'demo_seed_v1'
      },
      create: {
        movieId: saved.id,
        releaseAt: saved.releaseDate || new Date(),
        score: hype,
        effectiveVotes: 100,
        rawVotes: 100,
        engineVersion: 'demo_seed_v1'
      }
    });
  }

  await prisma.user.upsert({
    where: { id: 'demo-user' },
    update: {},
    create: { id: 'demo-user' }
  });
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
