-- AddForeignKey
ALTER TABLE `StudentExit` ADD CONSTRAINT `StudentExit_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
