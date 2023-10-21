package lne.intra.formsapi.model.response;

import java.util.Date;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UploadResponse {
  private Integer id;
  private String initialName;
  private Boolean confirmed;
  private Date createdAt;
  private Date updatedAt;
}
