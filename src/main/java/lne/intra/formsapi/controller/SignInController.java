package lne.intra.formsapi.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetUserId;
import lne.intra.formsapi.model.request.SignInRequest;
import lne.intra.formsapi.model.request.UserRequest;
import lne.intra.formsapi.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/signin")
@RequiredArgsConstructor
@Tag(name = "signin endpoint")
public class SignInController {
  @Autowired
  private Environment env;

  private final UserService userService;

  @Operation(summary = "Requête d'enregistrement d'un nouvel utilisateur")
  @ApiResponse(responseCode = "200", description = "L'utilisateur créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @PostMapping("")
  public ResponseEntity<Map<String, Object>> signing(
      @RequestBody(description = "Objet JSON représentant l'utilisateur à insérer", required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = SignInRequest.class))) SignInRequest request
  ) {

    if (!request.getSecret().equals(env.getProperty("lne.intra.formsapi.signinkey")))
      throw new AppException(400, "La clef d'enregistrement est incorrecte");
    var newUser = UserRequest.builder()
        .nom(request.getNom().trim())
        .prenom(request.getPrenom().trim())
        .login(request.getLogin().trim())
        .password(request.getPassword().trim())
        .build();
    return ResponseEntity.ok(userService.register(newUser));
  }
}
