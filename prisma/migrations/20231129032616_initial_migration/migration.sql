/*
  Warnings:

  - The primary key for the `guard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fn` on the `guard` table. All the data in the column will be lost.
  - You are about to drop the column `ln` on the `guard` table. All the data in the column will be lost.
  - You are about to drop the column `fn` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `ln` on the `student` table. All the data in the column will be lost.
  - You are about to drop the `student_in` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_out` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstname` to the `Guard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Guard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sectionId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_in` DROP FOREIGN KEY `student_in_ibfk_1`;

-- DropForeignKey
ALTER TABLE `student_in` DROP FOREIGN KEY `student_in_ibfk_2`;

-- DropForeignKey
ALTER TABLE `student_out` DROP FOREIGN KEY `student_out_ibfk_1`;

-- DropForeignKey
ALTER TABLE `student_out` DROP FOREIGN KEY `student_out_ibfk_2`;

-- AlterTable
ALTER TABLE `guard` DROP PRIMARY KEY,
    DROP COLUMN `fn`,
    DROP COLUMN `ln`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `middlename` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `student` DROP COLUMN `fn`,
    DROP COLUMN `ln`,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `middlename` VARCHAR(191) NULL,
    ADD COLUMN `sectionId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `student_in`;

-- DropTable
DROP TABLE `student_out`;

-- CreateTable
CREATE TABLE `GradeLevel` (
    `level` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`level`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentLrn` INTEGER NOT NULL,
    `guardId` VARCHAR(191) NOT NULL,
    `timeIn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentExit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentEntryId` INTEGER NOT NULL,
    `guardId` VARCHAR(191) NOT NULL,
    `timeOut` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `StudentExit_studentEntryId_key`(`studentEntryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_level_fkey` FOREIGN KEY (`level`) REFERENCES `GradeLevel`(`level`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentEntry` ADD CONSTRAINT `StudentEntry_studentLrn_fkey` FOREIGN KEY (`studentLrn`) REFERENCES `Student`(`lrn`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentEntry` ADD CONSTRAINT `StudentEntry_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentExit` ADD CONSTRAINT `StudentExit_studentEntryId_fkey` FOREIGN KEY (`studentEntryId`) REFERENCES `StudentEntry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
