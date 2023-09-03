package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class GetAnswerId {
  private Integer id;
  private String reponse;
  private GetUserId createur;
  private GetFormId formulaire;
  private Date createdAt;
  private Date updatedAt;
}
