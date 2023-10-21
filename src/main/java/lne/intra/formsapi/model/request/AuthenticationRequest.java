package lne.intra.formsapi.model.request;

// import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
  
  @NotBlank(message = "le champ 'login' est obligatoire")
  private String login;

  @NotBlank(message = "le champ 'password' est obligatoire")
  private String password;

  // private MultipartFile file;
}
