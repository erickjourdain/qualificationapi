package lne.intra.formsapi.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Greeting {
  
  @NotNull(message = "le champ 'msg' ne peut être vide")
  @NotEmpty(message = "le champ 'msg' ne peut être vide")
  private String msg;

  @NotNull(message = "le champ 'from' ne peut être vide")
  @NotEmpty(message = "le champ 'from' ne peut être vide")
  private String from;

  @NotNull(message = "le champ 'to' ne peut être vide")
  @NotEmpty(message = "le champ 'to' ne peut être vide")
  private String to;
}
