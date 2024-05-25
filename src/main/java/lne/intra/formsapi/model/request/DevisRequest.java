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
public class DevisRequest {
  
  @NotBlank(groups = ObjectCreate.class, message = "le champ 'reference' est oligatoire")
  private String reference;

  @NotNull(groups = ObjectCreate.class, message = "le champ 'version' est obligatoire")
  @Min(groups = ObjectCreate.class, value = 1, message = "le champ 'version' doit être positif")
  private Integer version;
}
