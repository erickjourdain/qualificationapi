package lne.intra.formsapi.model.response;

import java.util.Date;

import lne.intra.formsapi.model.User;
import lombok.Data;

@Data
public class DevisResponse {
  private Integer id;
  private String reference;
  private AnswerResponse answer;
  private User createur;
  private Date createdAt;
}
