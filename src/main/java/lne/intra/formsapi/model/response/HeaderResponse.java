package lne.intra.formsapi.model.response;

import java.util.Date;

import lombok.Data;

@Data
public class HeaderResponse {
  private Integer id;
  private String uuid;
  private String societe;
  private String email;
  private String telephone;
  private String nom;
  private String prenom;
  private String opportunite;
  private String projet;
  private UtilisateurResponse createur;
  private UtilisateurResponse gestionnaire;
  private Date createdAt;
  private Date updatedAt;
}
