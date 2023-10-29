package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lne.intra.formsapi.model.Statut;
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
public class AnswerRequest {
  
  @NotBlank(groups = ObjectCreate.class, message = "le champ 'reponse' est obligatoire")
  private String reponse;

  @NotNull(groups = ObjectCreate.class, message = "le champ 'formulaire' est obligatoire")
  @Min(groups = ObjectCreate.class, value = 1, message = "le champ 'formulaire' doit être positif")
  private Integer formulaire;

  private Statut statut;

  @Min(groups = { ObjectCreate.class, ObjectUpdate.class }, value = 100000, message = "le champ 'opportunite' doit contenir 6 digits")
  @Max(groups = { ObjectCreate.class, ObjectUpdate.class }, value = 999999, message = "le champ 'opportunite' doit contenir 6 digits")
  private Integer opportunite;

  @Min(groups = { ObjectCreate.class, ObjectUpdate.class }, value = 100000, message = "le champ 'demande' doit contenir 6 digits")
  @Max(groups = { ObjectCreate.class, ObjectUpdate.class }, value = 999999, message = "le champ 'demande' doit contenir 6 digits")
  private Integer demande;
}
