-- Formulaire
--
SET @v_form  = "{\"name\":\"simulation de jeu\",\"description\":\"un tout premier formulaire de test\",\"language\":\"fr\",\"sections\":[{\"id\":\"ebef07c003034dace7a6e904e9444302dbcdaa92435018f6268e00292048f884\",\"name\":\"première section\",\"nodes\":[{\"id\":\"f03a572dbdada5317e43d9be46a65e80a0fb2e71872c0fa48c5ef2fc3746dfb2\",\"name\":\"Formulaire pour les joueurs\",\"nameVisible\":true,\"block\":{\"type\":\"@tripetto/block-paragraph\",\"version\":\"5.0.1\"}},{\"id\":\"31368deff759b7035d37639e5b6d2c451b3f3b241dc2e8ce435237762bc4c196\",\"name\":\"\",\"nameVisible\":true,\"description\":\"Première question\",\"slots\":[{\"id\":\"79286b39ea011aa3a35c8b04948c2ae4a333833e3fcf91e79b163b96fa7c00c4\",\"type\":\"number\",\"kind\":\"meta\",\"reference\":\"counter\",\"label\":\"Counter\",\"exportable\":false},{\"id\":\"0109dec30bc92734ec2fc9a29540fdc7b50e86769b8359e8574a2e64c130c1c8\",\"type\":\"boolean\",\"kind\":\"dynamic\",\"reference\":\"0425f946bf2f19dfb7470130dd92180e606bd796ed2717034c4797e115b240b6\",\"sequence\":0,\"label\":\"Checkbox\",\"name\":\"un premier choix\",\"required\":true,\"pipeable\":{\"label\":\"Checkbox\",\"content\":\"name\",\"legacy\":\"Checkbox\"},\"labelForFalse\":\"Not checked\",\"labelForTrue\":\"Checked\"},{\"id\":\"02747c12fe8fd09e63b6aba9637917bdf9b9362b570ef6bc61722f5f84461e4e\",\"type\":\"boolean\",\"kind\":\"dynamic\",\"reference\":\"d1a0132637921b1ae4e828b5e528d46f961ca52a0315edcc450983bd2d3d5f1c\",\"sequence\":1,\"label\":\"Checkbox\",\"name\":\"un second choix\",\"required\":true,\"pipeable\":{\"label\":\"Checkbox\",\"content\":\"name\",\"legacy\":\"Checkbox\"},\"labelForFalse\":\"Not checked\",\"labelForTrue\":\"Checked\"},{\"id\":\"e6ea836fc9055d0b28cd74861c2263d4d6d86d7bf3db9d684fcf0cebd94b6ea2\",\"type\":\"boolean\",\"kind\":\"dynamic\",\"reference\":\"4fddfdee920524e93c824e58537fd5f64348fa83e9c744bb0a09623818e9af1f\",\"sequence\":2,\"label\":\"Checkbox\",\"name\":\"un dernier choix\",\"required\":true,\"pipeable\":{\"label\":\"Checkbox\",\"content\":\"name\",\"legacy\":\"Checkbox\"},\"labelForFalse\":\"Not checked\",\"labelForTrue\":\"Checked\"}],\"block\":{\"type\":\"@tripetto/block-checkboxes\",\"version\":\"7.0.6\",\"checkboxes\":[{\"id\":\"0425f946bf2f19dfb7470130dd92180e606bd796ed2717034c4797e115b240b6\",\"name\":\"un premier choix\",\"exclusive\":true},{\"id\":\"d1a0132637921b1ae4e828b5e528d46f961ca52a0315edcc450983bd2d3d5f1c\",\"name\":\"un second choix\",\"exclusive\":true},{\"id\":\"4fddfdee920524e93c824e58537fd5f64348fa83e9c744bb0a09623818e9af1f\",\"name\":\"un dernier choix\"}],\"required\":true}}],\"branches\":[{\"id\":\"c10f80f0b26f5e7dd71551701dea62b733a029b344e7e6ecb451a6ae851cc8a3\",\"name\":\"premier choix\",\"sections\":[{\"id\":\"ab3eb5ad3d34cd46c6811bd66236c4fb766b3dd0c7ffdb8bdc50517b2d931b02\",\"name\":\"Adresse Email\",\"nodes\":[{\"id\":\"5f2cdf13294f3368b0844fd77c0b0cc8e70326521a51651eea353a537b5515b0\",\"name\":\"\",\"nameVisible\":true,\"placeholder\":\"email\",\"description\":\"merci de fournir votre adresse email\",\"slots\":[{\"id\":\"0273f4d8f38a61986be03617785836976f2b1abb1dedac7049148fa7ca8b64fe\",\"type\":\"string\",\"kind\":\"static\",\"reference\":\"email\",\"label\":\"Email address\",\"required\":true}],\"block\":{\"type\":\"@tripetto/block-email\",\"version\":\"6.0.2\"}}]}],\"conditions\":[{\"id\":\"da128953a6d61f732f2389dce138a93c766b3c112f78b2685a96a15f2174f088\",\"block\":{\"checkbox\":\"0425f946bf2f19dfb7470130dd92180e606bd796ed2717034c4797e115b240b6\",\"type\":\"@tripetto/block-checkboxes\",\"version\":\"7.0.6\",\"node\":\"31368deff759b7035d37639e5b6d2c451b3f3b241dc2e8ce435237762bc4c196\",\"slot\":\"0109dec30bc92734ec2fc9a29540fdc7b50e86769b8359e8574a2e64c130c1c8\",\"checked\":true}}],\"culling\":\"all\"},{\"id\":\"7f923cf5765d544b7acbd1395e2c43c4bfde2d680b9b66e8f0cc19dc65d31b4f\",\"name\":\"second choix\",\"sections\":[{\"id\":\"eb151cd6673def6f8a884b9eac07d19b353c9a0d5d8dbfa8bb8e998affb4e43f\",\"name\":\"Commentaire\",\"nodes\":[{\"id\":\"af2bd326c56a91fb8c5abb9497ae2fbe669011614d0f728de3b09a740c25cbd2\",\"explanation\":\"Merci de laisser un commentaire\",\"name\":\"\",\"nameVisible\":true,\"description\":\"Votre commentaire\",\"slots\":[{\"id\":\"e41f8b39a59137f07b35b8fc0c7ed4af67435d0a2ec21c65cb9ecd639761cee3\",\"type\":\"text\",\"kind\":\"static\",\"reference\":\"value\",\"label\":\"Multi-line text\",\"required\":true}],\"block\":{\"type\":\"@tripetto/block-textarea\",\"version\":\"6.0.2\"}}]}],\"conditions\":[{\"id\":\"73ffe840710aa2b9b86a08410637cfc3e0e0c12a8fa3d4590042380d23ddf629\",\"block\":{\"checkbox\":\"d1a0132637921b1ae4e828b5e528d46f961ca52a0315edcc450983bd2d3d5f1c\",\"type\":\"@tripetto/block-checkboxes\",\"version\":\"7.0.6\",\"node\":\"31368deff759b7035d37639e5b6d2c451b3f3b241dc2e8ce435237762bc4c196\",\"slot\":\"02747c12fe8fd09e63b6aba9637917bdf9b9362b570ef6bc61722f5f84461e4e\",\"checked\":true}}],\"culling\":\"all\"},{\"id\":\"6dc6736c1453cd79b6a4bf9843969265787ed7864c5151a5ee542c13d64e4674\",\"name\":\"dernier choix\",\"sections\":[{\"id\":\"1d4badad3b109b9b79ac754cc4138e3e99e7eda8d17371444e25f3d3f13ed71c\",\"nodes\":[{\"id\":\"095dfc6727a70f7dfc46e068285e005ac14bd46ffa8fb139e3ffcb78b92323fc\",\"name\":\"\",\"nameVisible\":true,\"placeholder\":\"sélectionner la date de fin de validité\",\"description\":\"Date de fin\",\"slots\":[{\"id\":\"7601a901e8285b0f29f2c3945d6ca3ad99f123868f1723096a2d8aaea8c3184b\",\"type\":\"date\",\"kind\":\"static\",\"reference\":\"date\",\"label\":\"Date\",\"precision\":\"days\",\"minimum\":true,\"maximum\":1703980800000}],\"block\":{\"type\":\"@tripetto/block-date\",\"version\":\"4.0.2\",\"minimum\":true,\"maximum\":1703980800000}}]}],\"conditions\":[{\"id\":\"bbc73cad4d2693c48d44c7b5770ac73766ff5f041f8aea5ac67087776313f67c\",\"block\":{\"checkbox\":\"4fddfdee920524e93c824e58537fd5f64348fa83e9c744bb0a09623818e9af1f\",\"type\":\"@tripetto/block-checkboxes\",\"version\":\"7.0.6\",\"node\":\"31368deff759b7035d37639e5b6d2c451b3f3b241dc2e8ce435237762bc4c196\",\"slot\":\"e6ea836fc9055d0b28cd74861c2263d4d6d86d7bf3db9d684fcf0cebd94b6ea2\",\"checked\":true}}],\"culling\":\"all\"}]},{\"id\":\"8c86c509b5ad52ba26f461a7ad5ec1cfca87d77606bbb7fc46dd527653871caf\",\"nodes\":[{\"id\":\"c6a687511ad52184b747b476d7d46919103d6e7f7fa482548e5f9a95542cffaf\",\"name\":\"Ce formulaire répond il à vos attentes?\",\"nameVisible\":true,\"slots\":[{\"id\":\"b0781e6008e263a80d7c1393685876a3a9747715f9cb2141984ea335ede518d9\",\"type\":\"string\",\"kind\":\"static\",\"reference\":\"answer\",\"label\":\"Answer\"}],\"block\":{\"type\":\"@tripetto/block-yes-no\",\"version\":\"5.0.3\"}}]}],\"builder\":{\"name\":\"@tripetto/builder\",\"version\":\"5.0.36\"}}";

-- Insertion des utilisateurs
INSERT INTO user (login, nom, prenom, password, slug, role) 
VALUES 
  (
    "jourdain", 
    "jourdain", 
    "erick", 
    "$2a$10$CFleb5bK8a3.boLzTwe4aOsaPpulMmbj3ooAdTjY77Fx75XnKSj6S",
    "erick_jourdain",
    "ADMIN"
  ),
  (
    "lenoiri", 
    "lenoir", 
    "isabelle", 
    "$2a$10$CFleb5bK8a3.boLzTwe4aOsaPpulMmbj3ooAdTjY77Fx75XnKSj6S",
    "isabelle_lenoir", 
    "USER"
  ),
  (
    "lerouxp", 
    "le roux", 
    "philippe", 
    "$2a$10$CFleb5bK8a3.boLzTwe4aOsaPpulMmbj3ooAdTjY77Fx75XnKSj6S",
    "philippe_le_roux", 
    "USER"
  ),
  (
    "toru", 
    "toru", 
    "denis", 
    "$2a$10$CFleb5bK8a3.boLzTwe4aOsaPpulMmbj3ooAdTjY77Fx75XnKSj6S",
    "denis_toru", 
    "USER"
  )
;

-- Insertion des formulaires
INSERT INTO form (titre, description, formulaire, version, createur, valide, slug, created_at, updated_at)
VALUES 
  ("formulaire 1", null, @v_form, 1, 1, 1, "formulaire_1_v1", NOW(), NOW()),
  ("formulaire 2", null, @v_form, 1, 1, 1, "formulaire_2_v1", NOW(), NOW()),
  ("formulaire 3", null, @v_form, 1, 1, 1, "formulaire_3_v1", NOW(), NOW()),
  ("formulaire 4", null, @v_form, 1, 1, 1, "formulaire_4_v1", NOW(), NOW()),
  ("formulaire 5", null, @v_form, 1, 1, 1, "formulaire_5_v1", NOW(), NOW()),
  ("formulaire 6", null, @v_form, 1, 1, 1, "formulaire_6_v1", NOW(), NOW()),
  ("formulaire 7", null, @v_form, 1, 1, 1, "formulaire_7_v1", NOW(), NOW()),
  ("formulaire 8", null, @v_form, 1, 1, 1, "formulaire_8_v1", NOW(), NOW()),
  ("formulaire 9", null, @v_form, 1, 1, 1, "formulaire_9_v1", NOW(), NOW()),
  ("formulaire 10", null, @v_form, 1, 1, 1, "formulaire_10_v1", NOW(), NOW()),
  ("formulaire 11", null, @v_form, 1, 1, 1, "formulaire_11_v1", NOW(), NOW()),
  ("formulaire 12", null, @v_form, 1, 1, 1, "formulaire_12_v1", NOW(), NOW()),
  ("formulaire 13", null, @v_form, 1, 1, 1, "formulaire_13_v1", NOW(), NOW()),
  ("formulaire 14", null, @v_form, 1, 1, 1, "formulaire_14_v1", NOW(), NOW()),
  ("formulaire 15", null, @v_form, 1, 1, 1, "formulaire_15_v1", NOW(), NOW()),
  ("formulaire 16", null, @v_form, 1, 1, 1, "formulaire_16_v1", NOW(), NOW()),
  ("formulaire 17", null, @v_form, 1, 1, 1, "formulaire_17_v1", NOW(), NOW()),
  ("formulaire 18", null, @v_form, 1, 1, 1, "formulaire_18_v1", NOW(), NOW()),
  ("formulaire 19", null, @v_form, 1, 1, 1, "formulaire_19_v1", NOW(), NOW()),
  ("formulaire 20", null, @v_form, 1, 1, 1, "formulaire_20_v1", NOW(), NOW()),
  ("formulaire 21", null, @v_form, 1, 1, 1, "formulaire_21_v1", NOW(), NOW()),
  ("formulaire 22", null, @v_form, 1, 1, 1, "formulaire_22_v1", NOW(), NOW()),
  ("formulaire 23", null, @v_form, 1, 1, 1, "formulaire_23_v1", NOW(), NOW()),
  ("formulaire 24", null, @v_form, 1, 1, 1, "formulaire_24_v1", NOW(), NOW()),
  ("formulaire 25", null, @v_form, 1, 1, 1, "formulaire_25_v1", NOW(), NOW())
;
