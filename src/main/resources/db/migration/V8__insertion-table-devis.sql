ALTER TABLE IF EXISTS `answer` DROP FOREIGN KEY IF EXISTS FKj6gdfexrxo63t9cbhfgln058a;

ALTER TABLE IF EXISTS `devis` DROP FOREIGN KEY IF EXISTS FKser9p4cxhoh5hkkbv5fj70sqj;

ALTER TABLE IF EXISTS `answer` DROP COLUMN IF EXISTS `devis`;

DROP TABLE IF EXISTS `devis`;

CREATE TABLE `devis`(
  id INTEGER NOT NULL AUTO_INCREMENT, reference TEXT NOT NULL, createur INTEGER NOT NULL , created_at DATETIME DEFAULT CURRENT_DATE not null, primary key (id), UNIQUE (reference)
) engine = InnoDB;

ALTER TABLE IF EXISTS `answer` ADD COLUMN `devis_id` INTEGER;

ALTER TABLE IF EXISTS `answer`
ADD CONSTRAINT FKj6gdfexrxo63t9cbhfgln058a FOREIGN KEY (devis_id) REFERENCES devis (id);