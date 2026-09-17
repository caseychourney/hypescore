const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const movies = [
  { slug: 'superman', title: 'Superman', status: 'RELEASED', releaseDate: new Date('2025-07-11T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'superman' },
  { slug: 'fantastic-four-first-steps', title: 'The Fantastic Four: First Steps', status: 'RELEASED', releaseDate: new Date('2025-07-25T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'fantastic-four-first-steps' },
  { slug: 'dune-part-two', title: 'Dune: Part Two', status: 'RELEASED', releaseDate: new Date('2024-03-01T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'dune-part-two' },
  { slug: 'deadpool-and-wolverine', title: 'Deadpool & Wolverine', status: 'RELEASED', releaseDate: new Date('2024-07-26T00:00:00Z'), sourceProvider: 'demo', sourceProviderId: 'deadpool-and-wolverine' },
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
