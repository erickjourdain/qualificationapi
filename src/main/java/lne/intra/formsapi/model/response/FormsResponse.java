package lne.intra.formsapi.model.response;

import java.util.List;

import lne.intra.formsapi.model.dto.FormDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FormsResponse {

  private List<FormDto> data;

  private Integer page;
  
  private Integer size;

  private Long nombreFormulaires;

}
