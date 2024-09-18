-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EAccountCategory" ADD VALUE 'Google';
ALTER TYPE "EAccountCategory" ADD VALUE 'Likee';
ALTER TYPE "EAccountCategory" ADD VALUE 'Twitch';
ALTER TYPE "EAccountCategory" ADD VALUE 'Reviews';
ALTER TYPE "EAccountCategory" ADD VALUE 'Others';
ALTER TYPE "EAccountCategory" ADD VALUE 'Snapchat';
ALTER TYPE "EAccountCategory" ADD VALUE 'Spotify';
