package lne.intra.formsapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lne.intra.formsapi.model.request.AuthenticationRequest;
import lne.intra.formsapi.model.request.RegisterRequest;
import lne.intra.formsapi.model.response.AuthenticationResponse;
import lne.intra.formsapi.service.AuthentificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthentificationService service;

  @PostMapping("/register")
  public ResponseEntity<AuthenticationResponse> register(
    @RequestBody RegisterRequest request
  ) {
    return ResponseEntity.ok(service.register(request));
  }

  @PostMapping("/authenticated")
  public ResponseEntity<AuthenticationResponse> authenticate(
    @RequestBody AuthenticationRequest request
  ) {
    return ResponseEntity.ok(service.authenticate(request));
  }

}