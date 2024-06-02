package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.NotBlank;
import lne.intra.formsapi.util.ObjectUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDevisRequest {
  
  @NotBlank(groups = ObjectUpdate.class, message = "le champ 'devis' est obligatoire")
  private String devis;
}
