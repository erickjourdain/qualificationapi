package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

  @NotBlank(groups = ObjectCreate.class, message = "le champ 'nom' est obligatoire")
  @Size(groups = { ObjectCreate.class,
      ObjectUpdate.class }, min = 5, message = "le champ 'nom' doit contenir au moins 5 caractères")
  private String nom;

  @NotBlank(groups = ObjectCreate.class, message = "le champ 'prenom' est obligatoire")
  @Size(groups = { ObjectCreate.class,
      ObjectUpdate.class }, min = 3, message = "le champ 'prenom' doit contenir au moins 3 caractères")
  private String prenom;

  @NotBlank(groups = ObjectCreate.class, message = "le champ 'login' est obligatoire")
  @Size(groups = { ObjectCreate.class,
      ObjectUpdate.class }, min = 5, message = "le champ 'login' doit contenir au moins 5 caractères")
  private String login;

  @NotBlank(groups = { ObjectCreate.class, ObjectUpdate.class }, message = "le champ 'password' est obligatoire")
  @Size(groups = { ObjectCreate.class,
      ObjectUpdate.class }, min = 8, message = "le champ 'password' doit contenir au moins 5 caractères")
  private String password;

  private Role role;
}
