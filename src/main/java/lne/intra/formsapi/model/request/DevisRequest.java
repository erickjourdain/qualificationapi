package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.NotBlank;
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

}
