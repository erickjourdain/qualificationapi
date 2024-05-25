package lne.intra.formsapi.model.openApi;

import java.util.List;

import lombok.Data;

@Data
public class GetDevis {
  private List<GetDevisId> data;
  private Integer page;
  private Integer size;
  private Long nbElements;
  private Boolean hasPrevious;
  private Boolean hasNext;
}
