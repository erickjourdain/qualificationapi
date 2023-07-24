package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FormRequest {

  @NotBlank(message = "le champ 'titre' est obligatoire")
  @Size(min = 5, max = 125, message = "le champ 'title' doit contenir entre 5 et 125 caractères")
  private String titre;

  @Size(min = 5, max = 255, message = "le champ 'description' doit contenir entre 5 et 255 caractères")
  private String description;

  @NotBlank(message = "le champ 'formulaire' est obligatoire")
  private String formulaire;

  @NotNull(message = "le champ 'createur' est obligatoire")
  @Min(value = 1, message = "le champ 'createur' doit être positif")
  private Integer createur;

}
