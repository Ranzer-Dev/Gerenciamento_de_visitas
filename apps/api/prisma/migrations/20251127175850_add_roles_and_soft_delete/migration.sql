-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "agents" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "visits" ADD COLUMN     "deleted_at" TIMESTAMP(3);
