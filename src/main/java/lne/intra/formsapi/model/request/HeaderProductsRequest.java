package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lne.intra.formsapi.util.ObjectCreate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HeaderProductsRequest {
  
  @NotBlank(groups = ObjectCreate.class, message = "le champ 'societe' est obligatoire")
  private String societe;

  @NotBlank(groups = ObjectCreate.class, message = "le champ 'email' est obligatoire")
  @Email(groups = ObjectCreate.class, message = "le champ 'email' n'est pas une adresse valide")
  private String email;

  private String telephone;

  private String nom;

  private String prenom;

  private String opportunite;

  private String projet;

  @NotEmpty(groups = ObjectCreate.class, message = "au moins un produit doit être déclaré")
  private String[] produits;
  
}
