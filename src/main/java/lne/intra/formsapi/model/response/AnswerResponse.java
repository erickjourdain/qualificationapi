package lne.intra.formsapi.model.response;

import java.util.Date;

import lombok.Data;

@Data
public class AnswerResponse {
  private Integer id;
  private String reponse;
  private CreateurResponse createur;
  private FormResponse formulaire;
  private Date createdAt;
  private Date updatedAt;
}
