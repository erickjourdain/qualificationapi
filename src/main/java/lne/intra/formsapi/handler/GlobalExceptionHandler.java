package lne.intra.formsapi.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.persistence.EntityNotFoundException;
import lne.intra.formsapi.model.dto.ErrorDto;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.exception.ObjectNotValidException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<?> handleException(IllegalStateException exception) {
    return ResponseEntity
        .badRequest()
        .body(exception.getMessage());
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<?> handleException(Exception exception) {
    Map<String, String> body = new HashMap<String, String>() {
      {
        put("code", "bad request: 400");
        put("message", exception.getMessage());
      }
    };
    return ResponseEntity
        .badRequest()
        .body(body);
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<?> handleException() {
    return ResponseEntity
        .notFound()
        .build();
  }

  @ExceptionHandler(ObjectNotValidException.class)
  public ResponseEntity<?> handleException(ObjectNotValidException exception) {
    return ResponseEntity
        .badRequest()
        .body(exception.getErrorMessages());
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<?> handleException(UsernameNotFoundException exception) {
    return ResponseEntity
        .badRequest()
        .body(exception.getMessage());
  }

  @ExceptionHandler(AppException.class)
  public ResponseEntity<?> handleException(AppException exception) {
    var error = ErrorDto
        .builder()
        .code(exception.getCodeException())
        .message(exception.getMessage())
        .build();
    return ResponseEntity
        .badRequest()
        .body(error);
  }

}
