package lne.intra.formsapi.util;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lne.intra.formsapi.model.exception.ObjectNotValidException;

@Component
public class ObjectsValidator<T> {

  private final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
  private final Validator validator = factory.getValidator();

  public void validate(T objectToValidate) {
    Set<ConstraintViolation<T>> violations = validator.validate(objectToValidate);
    if (!violations.isEmpty()) {
      var errorMessages = violations
          .stream()
          .map(ConstraintViolation::getMessage)
          .collect(Collectors.toSet());
      throw new ObjectNotValidException(errorMessages);
    }
  }

  public void validateData(T objectToValidate, Class<?> classValidation) {
    Set<ConstraintViolation<T>> violations = validator.validate(objectToValidate, classValidation);
    if (!violations.isEmpty()) {
      var errorMessages = violations
          .stream()
          .map(ConstraintViolation::getMessage)
          .collect(Collectors.toSet());
      throw new ObjectNotValidException(errorMessages);
    }
  }
}
