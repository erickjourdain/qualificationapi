package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class GetFormId {
  private Integer id;
  private String titre;
  private String slug;
  private String description;
  private Boolean courant;
  private Boolean valide;
  private GetUserId createur;
  private Date createdAt;
  private Date updatedAt;
}
