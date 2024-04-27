package lne.intra.formsapi.model.response;

import java.util.Date;

import lne.intra.formsapi.model.User;
import lombok.Data;

@Data
public class ProduitResponse {
  private Integer id;
  private String description;
  private HeaderResponse header;
  private User createur;
  private User gestionnaire;
  private Date createdAt;
  private Date updatedAt;
}
