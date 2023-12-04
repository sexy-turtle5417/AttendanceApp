-- DropForeignKey
ALTER TABLE `Entry` DROP FOREIGN KEY `Entry_guardId_fkey`;

-- DropForeignKey
ALTER TABLE `Exit` DROP FOREIGN KEY `Exit_guardId_fkey`;

-- DropForeignKey
ALTER TABLE `Section` DROP FOREIGN KEY `Section_level_fkey`;

-- DropForeignKey
ALTER TABLE `Student` DROP FOREIGN KEY `Student_sectionId_fkey`;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_level_fkey` FOREIGN KEY (`level`) REFERENCES `GradeLevel`(`level`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exit` ADD CONSTRAINT `Exit_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
