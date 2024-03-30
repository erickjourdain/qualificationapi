package lne.intra.formsapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.ChangePwdRequest;
import lne.intra.formsapi.service.JwtService;
import lne.intra.formsapi.service.UserService;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/reset-password")
@RequiredArgsConstructor
@Tag(name = "reset password endpoint")
public class ResetPwdController {

  private final UserService service;
  private final JwtService jwtService;
  private final ObjectsValidator<ChangePwdRequest> registerRequestValidator;

  /**
   * Mise à jour du mot de passe
   * 
   * @param request
   * @return
   * @throws AppException
   */
  @Operation(summary = "Mise à jour du mot de passe")
  @ApiResponse(responseCode = "200", description = "Mot de passe mis à jour", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @PostMapping()
  public ResponseEntity<Boolean> changePwd(
      @RequestBody ChangePwdRequest request) throws AppException {
    // validation des champs fournis dans la requête
    registerRequestValidator.validate(request);
    // test du token
    if (jwtService.isTokenExpired(request.getToken()))
      throw new AppException(400, "Le token fourni n'est pas valide.");
    return ResponseEntity.ok(service.resetPassword(request));
  }
}
