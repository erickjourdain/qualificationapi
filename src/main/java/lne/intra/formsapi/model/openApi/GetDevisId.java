package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class GetDevisId {
  private Integer id;
  private String reference;
  private GetUserId createur;
  private Date createdAt;
}
