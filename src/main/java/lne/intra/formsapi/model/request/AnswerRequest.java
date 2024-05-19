package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lne.intra.formsapi.model.Statut;
import lne.intra.formsapi.util.ObjectCreate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnswerRequest {
  
  @NotBlank(groups = ObjectCreate.class, message = "le champ 'reponse' est obligatoire")
  private String reponse;

  @NotNull(groups = ObjectCreate.class, message = "le champ 'formulaire' est obligatoire")
  @Min(groups = ObjectCreate.class, value = 1, message = "le champ 'formulaire' doit être positif")
  private Integer formulaire;

  private Statut statut;

  private String devis;

  @NotNull(groups = ObjectCreate.class, message = "le champ 'produit' est obligatoire")
  @Min(groups = ObjectCreate.class, value = 1, message = "le champ 'produit' doit être positif")
  private Integer produit;
}
