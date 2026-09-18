-- CreateEnum
CREATE TYPE "MovieStatus" AS ENUM ('UPCOMING', 'RELEASED', 'STREAMING');

-- CreateEnum
CREATE TYPE "HypeChoice" AS ENUM ('YES', 'MAYBE', 'NO');

-- CreateEnum
CREATE TYPE "ModerationState" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "MovieStatus" NOT NULL DEFAULT 'UPCOMING',
    "releaseDate" TIMESTAMP(3),
    "runtimeMinutes" INTEGER,
    "certification" TEXT,
    "genres" JSONB,
    "posterUrl" TEXT,
    "backdropUrl" TEXT,
    "sourceProvider" TEXT,
    "sourceProviderId" TEXT,
    "sourceAttribution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HypeVote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "choice" "HypeChoice" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "watchedAt" TIMESTAMP(3),
    "invalidatedAt" TIMESTAMP(3),
    "trustWeight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    CONSTRAINT "HypeVote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HypeVoteAudit" (
    "id" TEXT NOT NULL,
    "voteId" TEXT NOT NULL,
    "oldChoice" "HypeChoice",
    "newChoice" "HypeChoice",
    "action" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HypeVoteAudit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HypeEvent" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "headline" TEXT,
    "summary" TEXT,
    "confidence" DOUBLE PRECISION,
    "moderation" "ModerationState" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HypeEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HypeSnapshot" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" INTEGER NOT NULL,
    "effectiveVotes" DOUBLE PRECISION NOT NULL,
    "rawVotes" INTEGER NOT NULL,
    "engineVersion" TEXT NOT NULL,
    CONSTRAINT "HypeSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "HypeReleaseSnapshot" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "releaseAt" TIMESTAMP(3) NOT NULL,
    "score" INTEGER NOT NULL,
    "effectiveVotes" DOUBLE PRECISION NOT NULL,
    "rawVotes" INTEGER NOT NULL,
    "engineVersion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HypeReleaseSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Watch" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "watchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Watch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "writing" INTEGER NOT NULL,
    "acting" INTEGER NOT NULL,
    "story" INTEGER NOT NULL,
    "characters" INTEGER NOT NULL,
    "visuals" INTEGER NOT NULL,
    "musicSound" INTEGER NOT NULL,
    "entertainment" INTEGER NOT NULL,
    "overall" INTEGER NOT NULL,
    "body" TEXT,
    "moderation" "ModerationState" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "widgetTheme" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Share" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "publisherId" TEXT,
    "userId" TEXT,
    "platform" TEXT NOT NULL,
    "cardVersion" TEXT NOT NULL,
    "referral" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Share_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Movie_slug_key" ON "Movie"("slug");
CREATE UNIQUE INDEX "HypeVote_userId_movieId_key" ON "HypeVote"("userId", "movieId");
CREATE UNIQUE INDEX "HypeReleaseSnapshot_movieId_key" ON "HypeReleaseSnapshot"("movieId");
CREATE UNIQUE INDEX "Watch_userId_movieId_key" ON "Watch"("userId", "movieId");
CREATE UNIQUE INDEX "Review_userId_movieId_key" ON "Review"("userId", "movieId");
CREATE UNIQUE INDEX "Publisher_domain_key" ON "Publisher"("domain");

CREATE INDEX "Movie_status_releaseDate_idx" ON "Movie"("status", "releaseDate");
CREATE INDEX "HypeVote_movieId_invalidatedAt_watchedAt_idx" ON "HypeVote"("movieId", "invalidatedAt", "watchedAt");
CREATE INDEX "HypeVoteAudit_voteId_createdAt_idx" ON "HypeVoteAudit"("voteId", "createdAt");
CREATE INDEX "HypeEvent_movieId_occurredAt_idx" ON "HypeEvent"("movieId", "occurredAt");
CREATE INDEX "HypeSnapshot_movieId_capturedAt_idx" ON "HypeSnapshot"("movieId", "capturedAt");
CREATE INDEX "Watch_movieId_watchedAt_idx" ON "Watch"("movieId", "watchedAt");
CREATE INDEX "Review_movieId_moderation_createdAt_idx" ON "Review"("movieId", "moderation", "createdAt");
CREATE INDEX "Share_movieId_platform_createdAt_idx" ON "Share"("movieId", "platform", "createdAt");

ALTER TABLE "HypeVote" ADD CONSTRAINT "HypeVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HypeVote" ADD CONSTRAINT "HypeVote_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HypeVoteAudit" ADD CONSTRAINT "HypeVoteAudit_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "HypeVote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HypeEvent" ADD CONSTRAINT "HypeEvent_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HypeSnapshot" ADD CONSTRAINT "HypeSnapshot_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "HypeReleaseSnapshot" ADD CONSTRAINT "HypeReleaseSnapshot_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Watch" ADD CONSTRAINT "Watch_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Share" ADD CONSTRAINT "Share_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Share" ADD CONSTRAINT "Share_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Share" ADD CONSTRAINT "Share_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
