package lne.intra.formsapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lne.intra.formsapi.model.Greeting;
import lne.intra.formsapi.service.GreetingService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/greetings")
@RequiredArgsConstructor
public class GreetingController {

  private final GreetingService service;

  @PostMapping
  public ResponseEntity<String> postGreeting(
      @RequestBody Greeting greeting) {

    final String greetingsMsg = service.saveGreeting(greeting);
    return ResponseEntity
        .accepted()
        .body(greetingsMsg);
  }
}
