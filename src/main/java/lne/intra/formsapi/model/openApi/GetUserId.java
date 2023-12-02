package lne.intra.formsapi.model.openApi;

import lne.intra.formsapi.model.Role;
import lombok.Data;

@Data
public class GetUserId {
  private Integer id;
  private String prenom;
  private String nom;
  private String login;
  private Role role;
  private Boolean bloque;
  private Boolean valide;
}
