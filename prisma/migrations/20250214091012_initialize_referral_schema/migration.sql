-- CreateTable
CREATE TABLE `Referral` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refereeName` VARCHAR(191) NOT NULL,
    `refereeEmail` VARCHAR(191) NOT NULL,
    `refereePhone` VARCHAR(191) NOT NULL,
    `friendName` VARCHAR(191) NOT NULL,
    `friendEmail` VARCHAR(191) NOT NULL,
    `friendPhone` VARCHAR(191) NOT NULL,
    `selectedOption` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
