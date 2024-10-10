-- DropForeignKey
ALTER TABLE "spaces" DROP CONSTRAINT "spaces_common_id_fkey";

-- AlterTable
ALTER TABLE "spaces" ALTER COLUMN "common_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "spaces" ADD CONSTRAINT "spaces_common_id_fkey" FOREIGN KEY ("common_id") REFERENCES "commons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
