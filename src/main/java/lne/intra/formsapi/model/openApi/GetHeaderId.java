package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class GetHeaderId {
  private Integer id;
  private String uuid;
  private String societe;
  private String email;
  private String telephone;
  private String nom;
  private String prenom;
  private String produit;
  private String opportunite;
  private GetUserId createur;
  private GetUserId gestionnaire;
  private Date createdAt;
  private Date updatedAt;
}
