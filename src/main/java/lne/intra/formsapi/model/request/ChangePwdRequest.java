package lne.intra.formsapi.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class ChangePwdRequest {

  @NotBlank(groups = { ObjectCreate.class, ObjectUpdate.class }, message = "le champ 'password' est obligatoire")
  @Size(groups = { ObjectCreate.class,
      ObjectUpdate.class }, min = 8, message = "le champ 'password' doit contenir au moins 8 caractères")
  private String password;

  @NotBlank(groups = { ObjectCreate.class, ObjectUpdate.class }, message = "le champ 'token' est obligatoire")
  @Size(groups = { ObjectCreate.class, ObjectUpdate.class })
  private String token;  
}
