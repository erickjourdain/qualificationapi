-- Insertion des utilisateurs
INSERT INTO user (login, nom, prenom, password, slug, role) 
VALUES 
  (
    "erick", 
    "jourdain", 
    "erick", 
    "$2a$10$CFleb5bK8a3.boLzTwe4aOsaPpulMmbj3ooAdTjY77Fx75XnKSj6S",
    "erick_jourdain",
    "ADMIN"
  ),
  (
    "cathy", 
    "jourdain", 
    "cathy", 
    "cathy_jourdain",
    "$2a$10$CFleb5bK8a3.boLzTwe4aOsaPpulMmbj3ooAdTjY77Fx75XnKSj6S", 
    "USER"
  )
;

-- Insertion des formulaires
INSERT INTO form (titre, description, formulaire, version, createur, valide, slug)
VALUES 
  ("formulaire 1", null, "formulaire 1", 1, 1, 1, "formulaire_1_v1"),
  ("formulaire 2", null, "formulaire 2", 1, 1, 1, "formulaire_2_v1"),
  ("formulaire 3", null, "formulaire 3", 1, 1, 1, "formulaire_3_v1"),
  ("formulaire 4", null, "formulaire 4", 1, 1, 1, "formulaire_4_v1"),
  ("formulaire 5", null, "formulaire 5", 1, 1, 1, "formulaire_5_v1"),
  ("formulaire 6", null, "formulaire 6", 1, 1, 1, "formulaire_6_v1"),
  ("formulaire 7", null, "formulaire 7", 1, 1, 1, "formulaire_7_v1"),
  ("formulaire 8", null, "formulaire 8", 1, 1, 1, "formulaire_8_v1"),
  ("formulaire 9", null, "formulaire 9", 1, 1, 1, "formulaire_9_v1"),
  ("formulaire 10", null, "formulaire 10", 1, 1, 1, "formulaire_10_v1"),
  ("formulaire 11", null, "formulaire 11", 1, 1, 1, "formulaire_11_v1"),
  ("formulaire 12", null, "formulaire 12", 1, 1, 1, "formulaire_12_v1"),
  ("formulaire 13", null, "formulaire 13", 1, 1, 1, "formulaire_13_v1"),
  ("formulaire 14", null, "formulaire 14", 1, 1, 1, "formulaire_14_v1"),
  ("formulaire 15", null, "formulaire 15", 1, 1, 1, "formulaire_15_v1"),
  ("formulaire 16", null, "formulaire 16", 1, 1, 1, "formulaire_16_v1"),
  ("formulaire 17", null, "formulaire 17", 1, 1, 1, "formulaire_17_v1"),
  ("formulaire 18", null, "formulaire 18", 1, 1, 1, "formulaire_18_v1"),
  ("formulaire 19", null, "formulaire 19", 1, 1, 1, "formulaire_19_v1"),
  ("formulaire 20", null, "formulaire 20", 1, 1, 1, "formulaire_20_v1"),
  ("formulaire 21", null, "formulaire 21", 1, 1, 1, "formulaire_21_v1"),
  ("formulaire 22", null, "formulaire 22", 1, 1, 1, "formulaire_22_v1"),
  ("formulaire 23", null, "formulaire 23", 1, 1, 1, "formulaire_23_v1"),
  ("formulaire 24", null, "formulaire 24", 1, 1, 1, "formulaire_24_v1"),
  ("formulaire 25", null, "formulaire 25", 1, 1, 1, "formulaire_25_v1")
;
