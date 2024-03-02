ALTER TABLE form ADD COLUMN (init_form INT);

DROP PROCEDURE if EXISTS initialise_init_form;
DROP PROCEDURE if EXISTS maj_version;
DELIMITER //

CREATE PROCEDURE initialise_init_form()
  BEGIN
    DECLARE cursor_id int;
    DECLARE cursor_titre varchar(255);
    DECLARE done int DEFAULT FALSE;
    DECLARE cursor_i CURSOR FOR SELECT id, titre FROM form WHERE version = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUNd SET done = TRUE;
    open cursor_i;
    read_loop: LOOP
      FETCH cursor_i INTO cursor_id, cursor_titre;
      IF done THEN
        LEAVE read_loop;
      END if;
      UPDATE form SET init_form = cursor_id WHERE titre = cursor_titre AND version != 1;
    END LOOP;
    CLOSE cursor_i;
  END; //

CREATE PROCEDURE maj_version()
  BEGIN
    DECLARE cursor_id int;
    DECLARE cursor_ver int;
    DECLARE cursor_slug varchar(255);
    DECLARE done int DEFAULT FALSE;
    DECLARE cursor_i CURSOR FOR SELECT id, version, slug FROM form WHERE slug like '%-v11%';
    DECLARE CONTINUE HANDLER FOR NOT FOUNd SET done = TRUE;
    OPEN cursor_i;
    read_loop: LOOP
      FETCH cursor_i INTO cursor_id, cursor_ver, cursor_slug;
      IF done THEN
        LEAVE read_loop;
      END if;
      UPDATE form SET slug = REGEXP_REPLACE(cursor_slug, '1\1+', cursor_ver) WHERE id = cursor_id;
    END LOOP;
    CLOSE cursor_i;
  END; //

DELIMITER ;

CALL initialise_init_form();

CALL maj_version();

DROP PROCEDURE if EXISTS initialise_init_form;

DROP PROCEDURE if EXISTS maj_version;

