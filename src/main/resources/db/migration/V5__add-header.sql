# suppression des données de ka table answer
DELETE FROM answer WHERE 1 = 1;

# suppression clef étrangère answer.header_id vers header.id
ALTER TABLE answer drop Foreign Key IF EXISTS FK4peh7eeif9wwq25x8qdbctwha;

# suppression clef étrangère header.createur vers user.id
ALTER TABLE answer drop Foreign Key IF EXISTS FKadixvs7e563ao1y476r6ob3d5;
# suppression clef étrangère header.gestionnaire vers user.id
ALTER TABLE answer drop Foreign Key IF EXISTS FK37plrrxkioaiovrakxhb3sde8;

# reset de l'id à 1
ALTER TABLE answer AUTO_INCREMENT = 1;

# suppression de la colonne answer.opportunite
ALTER TABLE answer DROP COLUMN IF EXISTS opportunite;

# renommer la colonne answer.gestionnaire en gestionnaire.devis
ALTER TABLE answer RENAME COLUMN IF EXISTS demande TO devis;

# modification de la colonne answer.statut pour valeur par défaut à QUALIFICATION
ALTER TABLE answer MODIFY COLUMN statut VARCHAR(55) NOT NULL DEFAULT("QUALIFICATION");

# ajouter de la colonne answer.header_id
ALTER TABLE answer
ADD COLUMN IF NOT EXISTS header_id INTEGER;

# création de la table header
DROP TABLE IF EXISTS `header`;
CREATE TABLE `header` (
    id INTEGER NOT NULL AUTO_INCREMENT, uuid VARCHAR(255) NOT NULL, societe VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, telephone VARCHAR(55), nom VARCHAR(255), prenom VARCHAR(255), produit TEXT NOT NULL, opportunite INTEGER, createur integer, gestionnaire integer, created_at DATETIME DEFAULT CURRENT_DATE not null, updated_at DATETIME DEFAULT CURRENT_DATE not null, primary key (id)
) engine = InnoDB;

# ajout clef étrangère header.createur vers user.id
ALTER TABLE IF EXISTS header
ADD CONSTRAINT FKadixvs7e563ao1y476r6ob3d5 FOREIGN KEY (createur) REFERENCES user (id);

# ajout clef étrangère header.gestionnaire vers user.id
ALTER TABLE IF EXISTS header
ADD CONSTRAINT FK37plrrxkioaiovrakxhb3sde8 FOREIGN KEY (gestionnaire) REFERENCES user (id);

# ajout clef étrangère answer.header_id vers header.id
ALTER TABLE IF EXISTS answer
ADD CONSTRAINT FK4peh7eeif9wwq25x8qdbctwha FOREIGN KEY (header_id) REFERENCES header (id);
