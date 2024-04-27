package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class GetProduitId {
  private Integer id;
  private String description;
  private GetHeaderId header;
  private GetUserId createur;
  private GetUserId gestionnaire;
  private Date createdAt;
  private Date updatedAt;
}
