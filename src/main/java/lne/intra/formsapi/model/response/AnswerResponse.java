package lne.intra.formsapi.model.response;

import java.util.Date;

import lne.intra.formsapi.model.Statut;
import lombok.Data;

@Data
public class AnswerResponse {
  private Integer id;
  private String uuid;
  private String reponse;
  private Integer version;
  private Boolean courante;
  private String devis;
  private Statut statut;
  private UtilisateurResponse createur;
  private UtilisateurResponse gestionnaire;
  private ProduitResponse produit;
  private FormResponse formulaire;
  private LockedResponse lock;
  private Date createdAt;
  private Date updatedAt;
}
