package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class GetAnswerId {
  private Integer id;
  private String uuid;
  private String reponse;
  private Integer version;
  private Boolean courante;
  private GetUserId createur;
  private GetUserId gestionnaire;
  private GetFormId formulaire;
  private String demande;
  private String opportunite;
  private Date createdAt;
  private Date updatedAt;
}
