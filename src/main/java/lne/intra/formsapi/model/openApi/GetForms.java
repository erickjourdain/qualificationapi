package lne.intra.formsapi.model.openApi;

import java.util.List;


import lombok.Data;

@Data
public class GetForms {
  private List<GetFormId> data;
  private Integer page;
  private Integer size;
  private Long nombreFormulaires;
  private Boolean hasPrevious;
  private Boolean hasNext;
}
