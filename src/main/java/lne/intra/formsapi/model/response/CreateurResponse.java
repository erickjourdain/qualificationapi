package lne.intra.formsapi.model.response;

import lne.intra.formsapi.model.Role;
import lombok.Data;

@Data
public class CreateurResponse {
  private Integer id;
  private String login;
  private String nom;
  private String prenom;
  private Role role;
}
