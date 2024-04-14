package lne.intra.formsapi.model.openApi;

import java.util.List;

import lombok.Data;

@Data
public class GetHeaders {
  private List<GetHeaderId> data;
  private Integer page;
  private Integer size;
  private Long nombreReponses;
  private Boolean hasPrevious;
  private Boolean hasNext;
}
