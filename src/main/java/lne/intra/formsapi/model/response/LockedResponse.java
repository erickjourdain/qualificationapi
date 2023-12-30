package lne.intra.formsapi.model.response;

import java.util.Date;

import lne.intra.formsapi.model.User;
import lombok.Data;

@Data
public class LockedResponse {
  private Integer id;
  private Date lockedAt;
  private User utilisateur;
}
