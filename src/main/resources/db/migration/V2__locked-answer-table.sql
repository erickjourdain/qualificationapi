alter table answer drop Foreign Key FKko9rjeb96wacb77a3h77dvi7s;

alter table answer drop column locked_by;

alter table answer drop column locked_at;

alter table answer add column (locked_id integer);

create table
    locked_answer (
        id integer not null AUTO_INCREMENT,
        locked_at DATETIME DEFAULT CURRENT_DATE not null,
        answer_id integer,
        locked_by integer,
        PRIMARY KEY (id)
    );

alter table
    if exists locked_answer
add
    constraint FKy7hvfrx2fhqrrp5tdczvgasr foreign key (locked_by) references user (id);

alter table
    if exists locked_answer
add
    constraint FKso327ogpdhuymy9dnj5we4fa foreign key (answer_id) references answer (id);
