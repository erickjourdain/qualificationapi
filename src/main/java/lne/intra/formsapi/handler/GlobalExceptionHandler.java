package lne.intra.formsapi.handler;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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
        put("error", exception.toString());
        put("message", exception.getMessage());
      }
    };
    StackTraceElement[] elements = Thread.currentThread().getStackTrace();
    for (int i = 1; i < elements.length; i++) {
      StackTraceElement s = elements[i];
      System.out.println(
          "\tat " + s.getClassName() + "." + s.getMethodName() + "(" + s.getFileName() + ":" + s.getLineNumber() + ")");
    }
    return ResponseEntity
        .badRequest()
        .body(body);
  }

  @ExceptionHandler(EntityNotFoundException.class)
  public ResponseEntity<Object> handleException() {
    return new ResponseEntity<Object>("Entité non trouvée", null, HttpStatus.NOT_FOUND);
  }

  @ExceptionHandler(ObjectNotValidException.class)
  public ResponseEntity<?> handleException(ObjectNotValidException exception) {
    return ResponseEntity
        .badRequest()
        .body(exception.getErrorMessages());
  }

  @ExceptionHandler(UsernameNotFoundException.class)
  public ResponseEntity<Object> handleException(UsernameNotFoundException exception) {
    return new ResponseEntity<Object>("Utilisateur non trouvé", null, HttpStatus.NOT_FOUND);
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

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<Object> handleException(AccessDeniedException exception) {
    return new ResponseEntity<Object>("Accès interdit", null, HttpStatus.FORBIDDEN);
  }

}
