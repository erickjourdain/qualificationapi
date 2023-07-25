package lne.intra.formsapi.model.response;

import java.util.List;

import lne.intra.formsapi.model.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UsersResponse {
  
  private List<UserDto> data;

  private Integer page;

  private Integer size;

  private Long nombreUsers;
}
