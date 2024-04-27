package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lne.intra.formsapi.util.ObjectCreate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProduitRequest {
  
  @NotBlank(groups = ObjectCreate.class, message = "le champ 'description' est obligatoire")
  private String description;

  @NotNull(groups = ObjectCreate.class, message = "le champ 'header' est obligatoire")
  @Min(groups = ObjectCreate.class, value = 1, message = "le champ 'header' doit être positif")
  private Integer header;

}
