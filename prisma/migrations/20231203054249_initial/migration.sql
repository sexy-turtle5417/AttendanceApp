-- CreateTable
CREATE TABLE `Guard` (
    `id` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `middlename` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Guard_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GradeLevel` (
    `level` INTEGER NOT NULL,
    `gradeLevel` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `GradeLevel_gradeLevel_key`(`gradeLevel`),
    PRIMARY KEY (`level`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Section` (
    `id` VARCHAR(191) NOT NULL,
    `sectionName` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,

    UNIQUE INDEX `Section_sectionName_key`(`sectionName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `lrn` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `middlename` VARCHAR(191) NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `sectionId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Student_email_key`(`email`),
    PRIMARY KEY (`lrn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Entry` (
    `id` VARCHAR(191) NOT NULL,
    `studentLrn` VARCHAR(191) NOT NULL,
    `guardId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exit` (
    `id` VARCHAR(191) NOT NULL,
    `studentEntryId` VARCHAR(191) NOT NULL,
    `guardId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Exit_studentEntryId_key`(`studentEntryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_level_fkey` FOREIGN KEY (`level`) REFERENCES `GradeLevel`(`level`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Section`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_studentLrn_fkey` FOREIGN KEY (`studentLrn`) REFERENCES `Student`(`lrn`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entry` ADD CONSTRAINT `Entry_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exit` ADD CONSTRAINT `Exit_studentEntryId_fkey` FOREIGN KEY (`studentEntryId`) REFERENCES `Entry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exit` ADD CONSTRAINT `Exit_guardId_fkey` FOREIGN KEY (`guardId`) REFERENCES `Guard`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
