package lne.intra.formsapi.model.dto;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FormDto {
  
  private Integer id;
  private String titre;
  private String description;
  private String formulaire;
  private Integer version;
  private Boolean valide;
  private UserDto createur;
  private Date createdAt;
  private Date updatedAt;
}
