package lne.intra.formsapi.model.response;

import java.util.Date;

import lombok.Data;

@Data
public class FormResponse {
  private Integer id;
  private String titre;
  private String description;
  private String formulaire;
  private Integer version;
  private Boolean valide;
  private CreateurResponse createur;
  private Date createdAt;
  private Date updatedAt;
}
