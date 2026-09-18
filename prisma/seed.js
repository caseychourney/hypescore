const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const movies = [
  { slug: 'practical-magic-2', title: 'Practical Magic 2', status: 'RELEASED', releaseDate: new Date('2026-09-11T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'practical-magic-2' },
  { slug: 'spider-man-brand-new-day', title: 'Spider-Man: Brand New Day', status: 'RELEASED', releaseDate: new Date('2026-07-31T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'spider-man-brand-new-day' },
  { slug: 'the-odyssey', title: 'The Odyssey', status: 'RELEASED', releaseDate: new Date('2026-07-17T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'the-odyssey' },
  { slug: 'coyote-vs-acme', title: 'Coyote vs. Acme', status: 'RELEASED', releaseDate: new Date('2026-08-28T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'coyote-vs-acme' },
];

async function main() {
  for (const movie of movies) {
    await prisma.movie.upsert({
      where: { slug: movie.slug },
      update: movie,
      create: movie,
    });
  }
  await prisma.user.upsert({
    where: { id: 'demo-user' },
    update: {},
    create: { id: 'demo-user' },
  });
}

main().finally(() => prisma.$disconnect());
