package lne.intra.formsapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.request.AuthenticationRequest;
import lne.intra.formsapi.model.response.AuthenticationResponse;
import lne.intra.formsapi.service.AuthentificationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/auth")
@RequiredArgsConstructor
@Tag(name="authentification endpoint")
public class AuthenticationController {

  private final AuthentificationService service;

  /**
   * Contrôleur d'authentification des utilisateurs
   * @param request RegisterRequest objet Json contenant le login / mot de passe de l'utilisateur
   * @return 
   */
  @Operation(summary = "Réquête d'authentification de l'utilisateur")
  @ApiResponse(responseCode = "200", description = "Authentification réussie", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthenticationResponse.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Login / Mot de passe inncorrects", content = @Content(mediaType = "application/json"))
  @PostMapping("/authenticated")
  public ResponseEntity<AuthenticationResponse> authenticate(
    @RequestBody AuthenticationRequest request
  ) {
    return ResponseEntity.ok(service.authenticate(request));
  }

}