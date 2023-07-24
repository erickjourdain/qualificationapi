package lne.intra.formsapi.model.exception;

import java.util.Set;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class ObjectNotValidException extends RuntimeException {
  
  private final Set<String> errorMessages;
}
