package lne.intra.formsapi.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.converter.FilterSpecification;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetUserId;
import lne.intra.formsapi.model.openApi.GetUsers;
import lne.intra.formsapi.model.request.UserRequest;
import lne.intra.formsapi.model.response.UsersResponse;
import lne.intra.formsapi.service.UserService;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v${lne.intra.formsapi.api}/data/users")
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "utilisateurs endpoint")
public class UsersController {

  private final UserService service;
  private final ObjectsValidator<UserRequest> registerRequestValidator;

  /**
   * Création d'un nouvel utilisateur
   * @param request UserRequest objet Json avec les informations nécessaires à
   *                l'enregistrement de l'utilisateur
   * @return User le nouvel utilisateur enregistré
   */
  @Operation(summary = "Création d'un nouvel utilisateur", description = "Accès limité au rôle `ADMIN`")
  @ApiResponse(responseCode = "200", description = "L'utilisateur créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping("/register")
  @PreAuthorize("hasAuthority('admin:create')")
  public ResponseEntity<Map<String, Object>> register(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody UserRequest request,
      @RequestParam(required = false) String include) throws AppException {
    // validation des champs fournis dans la requête
    registerRequestValidator.validate(request);
    // Enregistrement de l'utilisateur
    User user = service.register(request);
    service.validate(user.getId());
    return ResponseEntity.ok(service.setUserResponse(user, include, userDetails));
  }

  /**
   * Contrôleur d'accès aux utilisateurs
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherche
   * @return ResponseEntity<GetUsers>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération des utilisateurs avec pagination et filtre", description = "Limitation aux utilisateurs actif pour les rôles différents d'ADMIN")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri ex: asc(id) ou desc(createdAt)", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "validated:true")
  @ApiResponse(responseCode = "200", description = "Les utilisateurs et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUsers.class)))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<UsersResponse> search(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "asc(id)") String sortBy,
      @RequestParam(required = false) FilterSpecification<User> filter,
      @RequestParam(required = false) String include) throws NotFoundException {

    // Test paramètre de tri
    boolean b = Pattern.matches("(desc|asc)[(](id|createdAt|updatedAt)[)]", sortBy);
    if (!b)
      throw new AppException(400, "Le champ de tri est incorrect");
    // Définition du paramètre de tri
    int indexStart = sortBy.indexOf("(");
    String direction = sortBy.substring(0, indexStart);
    int indexEnd = sortBy.indexOf(")");
    String field = sortBy.substring(indexStart + 1, indexEnd);

    // Limitation nombre d'éléments retrourné
    size = (size > 50) ? 50 : size;
    // Définition des paramètres de pagination
    Pageable paging = PageRequest.of(page - 1, size,
        Sort.by((Pattern.matches("asc", direction)) ? Direction.ASC : Direction.DESC, field));
    Page<User> users = service.search(filter, paging, userDetails);

    // Création de la liste des utilisateurs
    List<Map<String, Object>> usersData = new ArrayList<>();
    for (User user : users) {
      usersData.add(service.setUserResponse(user, include, userDetails));
    }
    // Construction de la réponse
    UsersResponse response = UsersResponse.builder()
        .nombreUsers(users.getTotalElements())
        .data(usersData)
        .page(paging.getPageNumber() + 1)
        .size(paging.getPageSize())
        .hasPrevious(users.hasPrevious())
        .hasNext(users.hasNext())
        .build();
    return ResponseEntity.ok(response);
  }

  /**
   * Contrôleur d'accès à un utilisateur via son id
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
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {
    User user = service.getUser(id);
    return ResponseEntity.ok(service.setUserResponse(user, include, userDetails));
  }

  /**
   * Contrôleur d'accès aux informations de l'utilisateur connecté
   * @param userDetails
   * @return ResponseEntity<User> informations de l'utilisateur connecté
   */
  @Operation(summary = "Récupération des informations sur l'utilisateur connecté", description = "Accès limité aux rôles `ADMIN` et `USER`")
  @ApiResponse(responseCode = "200", description = "Information sur l'utilisateur", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/me")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<Map<String, Object>> getMe(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestParam(required = false) String include) {
    User user = service.getByLogin(userDetails.getUsername());
    return ResponseEntity.ok(service.setUserResponse(user, include, userDetails));
  }

  /**
   * Contrôleur d'ajout des droits d'administrateur à un utilisateur
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
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {
    User user = service.setAdmin(id);
    return ResponseEntity.ok(service.setUserResponse(user, include, userDetails));
  }

  /**
   * Modification d'un utilisateur
   * @param id Integer l'identifiant de l'utilisateur
   * @param request UserRequest objet Json avec les informations nécessaires à
   *                la mise à jour de l'utilisateur
   * @return ResponseEntity<User> informations de l'utilisateur connecté
   * @throws NotFoundException
   */
  @Operation(summary = "Modifier les données d'un utilisateur", description = "Accès limité au rôle `ADMIN`")
  @Parameter(in = ParameterIn.PATH, name = "id", description = "L'identifinat du l'utilisateur", required = true, example = "1")
  @ApiResponse(responseCode = "200", description = "Utilisateur recherché", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update','user:update','reader:update')")
  public ResponseEntity<Map<String, Object>> updateUser(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestBody UserRequest request,
      @RequestParam(required = false) String include)
      throws NotFoundException {

    // récupération des informations sur l'utilisateur connecté
    User user =  service.getByLogin(userDetails.getUsername());
    if (!user.getId().equals(id) && user.getRole() != Role.ADMIN)
      throw new AppException(403, "Vous ne disposez pas des droits nécessaires pour effectuer cette mise à jour");
    User updatedUser = service.update(id, request);
    return ResponseEntity.ok(service.setUserResponse(updatedUser, include, userDetails));
  }

  /**
   * Valider un utilisateur
   * @param id Integer l'identifiant de l'utilisateur
   * @return ResponseEntity<User> informations de l'utilisateur connecté
   * @throws NotFoundException
   */
  @Operation(summary = "Valider un utilisateur", description = "Accès limité au rôle `ADMIN`")
  @Parameter(in = ParameterIn.PATH, name = "id", description = "L'identifinat du l'utilisateur", required = true, example = "1")
  @ApiResponse(responseCode = "200", description = "Utilisateur recherché", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("validate/{id}")
  @PreAuthorize("hasAuthority('admin:update')")
  public ResponseEntity<Map<String, Object>> validate(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include)
      throws NotFoundException {
    User user = service.validate(id);
    return ResponseEntity.ok(service.setUserResponse(user, include, userDetails));
  }

  /**
   * Bloquer un utilisateur
   * @param id Integer l'identifiant de l'utilisateur
   * @return ResponseEntity<User> informations de l'utilisateur connecté
   * @throws NotFoundException
   */
  @Operation(summary = "Bloquer un utilisateur", description = "Accès limité au rôle `ADMIN`")
  @Parameter(in = ParameterIn.PATH, name = "id", description = "L'identifinat du l'utilisateur", required = true, example = "1")
  @ApiResponse(responseCode = "200", description = "Utilisateur recherché", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetUserId.class)))
  @ApiResponse(responseCode = "404", description = "Utilisateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("lock/{id}")
  @PreAuthorize("hasAuthority('admin:update')")
  public ResponseEntity<Map<String, Object>> lock(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include)
      throws NotFoundException {
    User user = service.lock(id);
    return ResponseEntity.ok(service.setUserResponse(user, include, userDetails));
  }  

}
