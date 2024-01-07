package lne.intra.formsapi.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.model.User;
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
      UserDetails userDetails,
      @RequestBody SignInRequest request,
      @RequestParam(required = false) String include
  ) {
    // vérification clef d'enregistrement
    if (!request.getSecret().equals(env.getProperty("lne.intra.formsapi.signinkey")))
      throw new AppException(400, "La clef d'enregistrement est incorrecte");
    UserRequest userRequest = UserRequest.builder()
        .nom(request.getNom().trim().toUpperCase())
        .prenom(request.getPrenom().trim().toLowerCase())
        .login(request.getLogin().trim().toLowerCase())
        .password(request.getPassword().trim())
        .build();
    User user = userService.register(userRequest);
    return ResponseEntity.ok(userService.setUserResponse(user, include, userDetails));
  }

  @Operation(summary = "Requête d'enregistrement de l'administrateur")
  @ApiResponse(responseCode = "200", description = "L'utilisateur créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @PostMapping("/admin")
  public ResponseEntity<Map<String, Object>> defineAdmin(
      UserDetails userDetails,
      @RequestBody SignInRequest request,
      @RequestParam(required = false) String include
  ) {
    // vérification clef d'enregistrement
    if (!request.getSecret().equals(env.getProperty("lne.intra.formsapi.signinkey")))
      throw new AppException(400, "La clef d'enregistrement est incorrecte");
    // vérification présence d'utilisateur dans la base
    Pageable paging = PageRequest.of(0, 10,
        Sort.by(Direction.ASC, "id"));
    Page<User> users = userService.search(null, paging, userDetails);
    if (users.getNumberOfElements() > 0)
      throw new AppException(400, "Il existe déjà des utilisateurs dans la base de données");
    UserRequest newUser = UserRequest.builder()
        .nom(request.getNom().trim().toUpperCase())
        .prenom(request.getPrenom().trim().toLowerCase())
        .login(request.getLogin().trim().toLowerCase())
        .validated(true)
        .role(Role.ADMIN)
        .password(request.getPassword().trim())
        .build();
    User admin = userService.register(newUser);
    return ResponseEntity.ok(userService.setUserResponse(admin, include, userDetails));
  }
}
