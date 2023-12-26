create table
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

create table
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

create table
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

create table
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

create table
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

alter table if exists form
add
    constraint UK_pnuphfim98xy6y8xtjh7g0kou unique (slug);

alter table if exists user
add
    constraint UK_ew1hvam8uwaknuaellwhqchhb unique (login);

alter table if exists user
add
    constraint UK_4purqiaifeeekn0sgxa1lignd unique (slug);

alter table if exists answer
add
    constraint FKclogehral2c3cnykht3cck0ob foreign key (createur) references user (id);

alter table if exists answer
add
    constraint FKhb4wixuvuplam2c6p81wq44df foreign key (form_id) references form (id);

alter table if exists answer
add
    constraint FK9c30mxloskapplq1g5lakwlb9 foreign key (gestionnaire) references user (id);

alter table if exists answer
add
    constraint FKko9rjeb96wacb77a3h77dvi7s foreign key (locked_by) references user (id);

alter table if exists file
add
    constraint FKnn409o9v7agdo9fyihoe0x909 foreign key (proprietaire) references user (id);

alter table if exists form
add
    constraint FKg6ox68oofyoy5bqdmegvjb36f foreign key (createur) references user (id);

alter table
    if exists token
add
    constraint FKe32ek7ixanakfqsdaokm4q9y2 foreign key (user_id) references user (id);