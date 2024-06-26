package lne.intra.formsapi.model.response;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListDataResponse {
  private List<Map<String, Object>> data;
  private Integer page;
  private Integer size;
  private Long nbElements;
  private Boolean hasPrevious;
  private Boolean hasNext;
}
