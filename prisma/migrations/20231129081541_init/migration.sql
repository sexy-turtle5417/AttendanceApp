-- CreateTable
CREATE TABLE `Guard` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `middlename` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `Student` (
    `lrn` INTEGER NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `middlename` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `sectionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`lrn`)
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

-- AddForeignKey
ALTER TABLE `StudentExit` ADD CONSTRAINT `StudentExit_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
