package lne.intra.formsapi.model.response;

import java.util.Date;

import lne.intra.formsapi.model.Statut;
import lombok.Data;

@Data
public class AnswerResponse {
  private Integer id;
  private String reponse;
  private CreateurResponse createur;
  private FormResponse formulaire;
  private Integer demande;
  private Integer opportunite;
  private Statut statut;
  private Date createdAt;
  private Date updatedAt;
}
