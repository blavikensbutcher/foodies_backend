-- AlterTable
ALTER TABLE "recipe_ingredients" ALTER COLUMN "measure" SET NOT NULL;

-- AlterTable: rename thumb -> main_image
ALTER TABLE "recipes" RENAME COLUMN "thumb" TO "main_image";

-- CreateTable
CREATE TABLE "_RecipeLikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RecipeLikes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_RecipeLikes_B_index" ON "_RecipeLikes"("B");

-- AddForeignKey
ALTER TABLE "_RecipeLikes" ADD CONSTRAINT "_RecipeLikes_A_fkey" FOREIGN KEY ("A") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeLikes" ADD CONSTRAINT "_RecipeLikes_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
