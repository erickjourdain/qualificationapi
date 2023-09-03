package lne.intra.formsapi.model.openApi;

import java.util.List;

import lombok.Data;

@Data
public class GetUsers {
  private List<GetUserId> data;
  private Integer page;
  private Integer size;
  private Long nombreFormulaires;
  private Boolean hasPrevious;
  private Boolean hasNext;
}
