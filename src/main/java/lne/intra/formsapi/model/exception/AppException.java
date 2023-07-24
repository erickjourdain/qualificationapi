package lne.intra.formsapi.model.exception;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class AppException extends RuntimeException{
  
  private final Integer codeException;
  private final String message;
}
