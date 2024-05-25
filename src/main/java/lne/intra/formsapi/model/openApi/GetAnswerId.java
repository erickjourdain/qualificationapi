package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lne.intra.formsapi.model.Devis;
import lne.intra.formsapi.model.Statut;
import lombok.Data;

@Data
public class GetAnswerId {
  private Integer id;
  private String uuid;
  private String reponse;
  private Integer version;
  private Boolean courante;
  private Devis devis;
  private Statut statut;
  private GetUserId createur;
  private GetUserId gestionnaire;
  private GetFormId formulaire;
  private LockId lock;
  private Date createdAt;
  private Date updatedAt;
}
