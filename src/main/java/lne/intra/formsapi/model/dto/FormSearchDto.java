package lne.intra.formsapi.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FormSearchDto {
  
  private List<SearchCriteriaDto> searchCriteriaList;
  private String dataOption;
}
