package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class GetAnswerId {
  private Integer id;
  private String uuid;
  private String reponse;
  private Integer version;
  private Boolean valide;
  private GetUserId createur;
  private GetFormId formulaire;
  private String demande;
  private String opportunite;
  private Date createdAt;
  private Date updatedAt;
}
