package lne.intra.formsapi.service;

import org.springframework.stereotype.Service;

import lne.intra.formsapi.model.Greeting;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GreetingService {

  private final ObjectsValidator<Greeting> greetingValidator;

  public String saveGreeting(Greeting greeting) {

    greetingValidator.validate(greeting);

    final String greetingMsg = "Greeting message <<" +
        greeting.getMsg()
        + ">> from: " +
        greeting.getFrom().toUpperCase()
        + " to: " +
        greeting.getTo().toUpperCase();

    return greetingMsg;
  }
}
