package lne.intra.formsapi.model.dto;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
  
  private Integer id;
  private String prenom;
  private String nom;
  private String role;
  private Date createdAt;
  private Date updatedAt;
}
