package lne.intra.formsapi.model.openApi;

import java.util.Date;

import lombok.Data;

@Data
public class LockId {
  
  private Integer id;
  private Date lockedAt;
  private GetUserId utilisateur;

}
