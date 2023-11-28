-- CreateTable
CREATE TABLE `guard` (
    `id` INTEGER NOT NULL,
    `fn` VARCHAR(50) NOT NULL,
    `ln` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
    `lrn` INTEGER NOT NULL,
    `fn` VARCHAR(50) NOT NULL,
    `ln` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`lrn`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_in` (
    `id` INTEGER NOT NULL,
    `student` INTEGER NOT NULL,
    `guard` INTEGER NOT NULL,
    `time_in` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `guard`(`guard`),
    INDEX `student`(`student`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_out` (
    `id` INTEGER NOT NULL,
    `student_in` INTEGER NOT NULL,
    `guard` INTEGER NOT NULL,
    `time_out` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `guard`(`guard`),
    INDEX `student_in`(`student_in`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_in` ADD CONSTRAINT `student_in_ibfk_1` FOREIGN KEY (`student`) REFERENCES `student`(`lrn`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_in` ADD CONSTRAINT `student_in_ibfk_2` FOREIGN KEY (`guard`) REFERENCES `guard`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_out` ADD CONSTRAINT `student_out_ibfk_1` FOREIGN KEY (`student_in`) REFERENCES `student_in`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `student_out` ADD CONSTRAINT `student_out_ibfk_2` FOREIGN KEY (`guard`) REFERENCES `guard`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
