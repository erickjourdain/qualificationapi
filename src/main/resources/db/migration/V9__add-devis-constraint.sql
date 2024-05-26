ALTER TABLE IF EXISTS `devis` DROP KEY IF EXISTS devis_unique;

ALTER TABLE `devis` ADD CONSTRAINT devis_unique UNIQUE KEY (reference,version);