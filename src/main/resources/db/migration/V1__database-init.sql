DROP TABLE IF EXISTS answer;
CREATE TABLE
    answer (
        courante bit not null,
        createur integer,
        demande integer,
        form_id integer,
        gestionnaire integer,
        id integer not null auto_increment,
        locked_by integer,
        opportunite integer,
        version integer not null,
        created_at DATETIME DEFAULT CURRENT_DATE not null,
        locked_at DATETIME DEFAULT CURRENT_DATE,
        updated_at DATETIME DEFAULT CURRENT_DATE not null,
        reponse MEDIUMTEXT not null,
        uuid varchar(255) not null,
        statut VARCHAR(55) DEFAULT 'BROUILLON',
        primary key (id)
    ) engine = InnoDB;

DROP TABLE IF EXISTS file;
CREATE TABLE
    file (
        confirmed BOOLEAN DEFAULT FALSE,
        id integer not null auto_increment,
        proprietaire integer,
        created_at DATETIME DEFAULT CURRENT_DATE not null,
        updated_at DATETIME DEFAULT CURRENT_DATE not null,
        file_name varchar(255) not null,
        initial_name varchar(255) not null,
        primary key (id)
    ) engine = InnoDB;

DROP TABLE IF EXISTS form;
CREATE TABLE
    form (
        createur integer,
        id integer not null auto_increment,
        valide bit not null,
        version integer not null,
        created_at DATETIME DEFAULT CURRENT_DATE not null,
        updated_at DATETIME DEFAULT CURRENT_DATE not null,
        description varchar(255),
        formulaire MEDIUMTEXT not null,
        slug varchar(255) not null,
        titre varchar(255) not null,
        primary key (id)
    ) engine = InnoDB;

DROP TABLE IF EXISTS token;
CREATE TABLE
    token (
        expired BOOLEAN DEFAULT FALSE,
        id integer not null auto_increment,
        revoked BOOLEAN DEFAULT FALSE,
        user_id integer,
        created_at DATETIME DEFAULT CURRENT_DATE not null,
        updated_at DATETIME DEFAULT CURRENT_DATE not null,
        token varchar(255) not null,
        token_type VARCHAR(55) DEFAULT 'BEARER',
        primary key (id)
    ) engine = InnoDB;

DROP TABLE IF EXISTS user;
CREATE TABLE
    user (
        expired BOOLEAN DEFAULT FALSE,
        id integer not null auto_increment,
        locked BOOLEAN DEFAULT FALSE,
        validated BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_DATE not null,
        updated_at DATETIME DEFAULT CURRENT_DATE not null,
        login varchar(255) not null,
        nom varchar(255) not null,
        password varchar(255) not null,
        prenom varchar(255) not null,
        slug varchar(255) not null,
        role VARCHAR(55) DEFAULT 'USER',
        primary key (id)
    ) engine = InnoDB;

ALTER TABLE IF EXISTS form
ADD
    CONSTRAINT UK_pnuphfim98xy6y8xtjh7g0kou UNIQUE (slug);

ALTER TABLE IF EXISTS user
ADD
    CONSTRAINT UK_ew1hvam8uwaknuaellwhqchhb UNIQUE (login);

ALTER TABLE IF EXISTS user
ADD
    CONSTRAINT UK_4purqiaifeeekn0sgxa1lignd UNIQUE (slug);

ALTER TABLE IF EXISTS answer
ADD
    CONSTRAINT FKclogehral2c3cnykht3cck0ob FOREIGN KEY (createur) REFERENCES user (id);

ALTER TABLE IF EXISTS answer
ADD
    CONSTRAINT FKhb4wixuvuplam2c6p81wq44df FOREIGN KEY (form_id) REFERENCES form (id);

ALTER TABLE IF EXISTS answer
ADD
    CONSTRAINT FK9c30mxloskapplq1g5lakwlb9 FOREIGN KEY (gestionnaire) REFERENCES user (id);

ALTER TABLE IF EXISTS answer
ADD
    CONSTRAINT FKko9rjeb96wacb77a3h77dvi7s FOREIGN KEY (locked_by) REFERENCES user (id);

ALTER TABLE IF EXISTS file
ADD
    CONSTRAINT FKnn409o9v7agdo9fyihoe0x909 FOREIGN KEY (proprietaire) REFERENCES user (id);

ALTER TABLE IF EXISTS form
ADD
    CONSTRAINT FKg6ox68oofyoy5bqdmegvjb36f FOREIGN KEY (createur) REFERENCES user (id);

ALTER TABLE IF EXISTS token
ADD
    CONSTRAINT FKe32ek7ixanakfqsdaokm4q9y2 FOREIGN KEY (user_id) REFERENCES user (id);