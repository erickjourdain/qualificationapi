package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @NotBlank(message = "le champ 'nom' est obligatoire")
  @Size(min = 5, message = "le champ 'nom' doit contenir au moins 5 caractères")
  private String nom;

  @NotBlank(message = "le champ 'prenom' est obligatoire")
  @Size(min = 3, message = "le champ 'prenom' doit contenir au moins 3 caractères")
  private String prenom;

  @NotBlank(message = "le champ 'login' est obligatoire")
  @Size(min = 5, message = "le champ 'login' doit contenir au moins 5 caractères")
  private String login;

  @NotBlank(message = "le champ 'password' est obligatoire")
  @Size(min = 8, message = "le champ 'password' doit contenir au moins 5 caractères")
  private String password;
}
