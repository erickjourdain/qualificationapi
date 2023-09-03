package lne.intra.formsapi.controller;

import java.util.Map;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.converter.FilterSpecification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.openApi.GetUserId;
import lne.intra.formsapi.model.openApi.GetUsers;
import lne.intra.formsapi.model.request.RegisterRequest;
import lne.intra.formsapi.model.response.UsersResponse;
import lne.intra.formsapi.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v${lne.intra.formsapi.api}/data/users")
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "utilisateurs endpoint")
public class UsersController {
  
  private final UserService service;

  /**
   * Création d'un nouvel utilisateur
   * 
   * @param request RegisterRequest objet Json avec les informations nécessaires à l'enregistrement de l'utilisateur
   * @return User le nouvel utilisateur enregistré
   */
  @Operation(summary = "Création d'un nouvel utilisateur", description = "Accès limité au rôle `ADMIN`")
  @ApiResponse(responseCode = "200", description = "L'utilisateur créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping("/register")
  @PreAuthorize("hasAuthority('admin:create')")
  public ResponseEntity<Map<String, Object>> register(
    @RequestBody(description = "Objet JSON représentant l'utilisateur à insérer", required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = RegisterRequest.class))) RegisterRequest request
  ) {
    return ResponseEntity.ok(service.register(request));
  }

  /**
   * Contrôleur d'accès aux utilisateurs
   * 
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherche
   * @return ResponseEntity<GetUsers>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération des utilisateurs avec pagination et filtre", description = "Accès limité au rôle `ADMIN`")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les utilisateurs et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUsers.class)))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))  
  @GetMapping
  @PreAuthorize("hasAuthority('admin:read')")
  public ResponseEntity<UsersResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy,
      FilterSpecification<User> filter) throws NotFoundException {

    Pageable paging = PageRequest.of(page - 1, size);
    return ResponseEntity.ok(service.search(filter, paging));
  }

  /**
   * Contrôleur d'accès à un utilisateur via son id
   * 
   * @param id Integer l'identifiant de l'utilisateur
   * @return ResponseEntity<User> le nouvel utilisateur enregistré
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'un utilisateur via son id", description = "Accès limité au rôle `ADMIN`")  
  @Parameter(in = ParameterIn.PATH, name = "id", description = "L'identifinat du l'utilisateur", required = true, example = "1")
  @ApiResponse(responseCode = "200", description = "Utilisateur recherché", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('admin:read')")
  public ResponseEntity<Map<String, Object>> getUser(
      @PathVariable Integer id) throws NotFoundException {
    return ResponseEntity.ok(service.getUser(id));
  }

  /**
   * Contrôleur d'accès aux information de l'utilisateur connecté
   * 
   * @param userDetails
   * @return ResponseEntity<User> informations de l'utilisateur connecté
   */
  @Operation(summary = "Récupération des informations sur l'utilisateur connecté", description = "Accès limité aux rôles `ADMIN` et `USER`")  
  @ApiResponse(responseCode = "200", description = "Information sur l'utilisateur", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/me")
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<Map<String, Object>> getMe(@AuthenticationPrincipal UserDetails userDetails) {
    return ResponseEntity.ok(service.getByLogin(userDetails.getUsername()));
  }

  /**
   * Contrôleur d'ajout des droits d'administeur à un utilisateur
   * 
   * @param id Integer l'identifiant de l'utilisateur
   * @return ResponseEntity<User> informations de l'utilisateur connecté
   * @throws NotFoundException
   */
  @Operation(summary = "Donner les droits d'admin à un utilisateur", description = "Accès limité au rôle `ADMIN`")
  @Parameter(in = ParameterIn.PATH, name = "id", description = "L'identifinat du l'utilisateur", required = true, example = "1")
  @ApiResponse(responseCode = "200", description = "Utilisateur recherché", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("setAdmin/{id}")
  @PreAuthorize("hasAuthority('admin:update')")
  public ResponseEntity<Map<String, Object>> setAdmin(
      @PathVariable Integer id)throws NotFoundException
  {
    return ResponseEntity.ok(service.setAdmin(id));
  }

}
