package lne.intra.formsapi.controller;

import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import lne.intra.formsapi.model.Answer;
import lne.intra.formsapi.model.Statut;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetAnswerId;
import lne.intra.formsapi.model.openApi.GetAnswers;
import lne.intra.formsapi.model.request.AnswerRequest;
import lne.intra.formsapi.model.response.AnswersResponse;
import lne.intra.formsapi.service.AnswerService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/answers")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "reponses endpoint")
public class AnswerController {

  private final AnswerService service;

  /**
   * Contrôleur de création d'un nouvelle réponse
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param request     AnswerRequest objet JSON avec les champs définissant une
   *                    réponse à un formulaire
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetAnswerId> La réponse enregistrée
   * @throws AppException
   */
  @Operation(summary = "Création d'une nouvelle réponse", description = "Accès limité aux rôle `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Le formulaire créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAnyAuthority('admin:create','creator:create','user:create')")
  public ResponseEntity<Map<String, Object>> save(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody AnswerRequest request,
      @RequestParam(required = false) String include) throws AppException {
    return ResponseEntity.ok(service.saveAnswer(request, include, userDetails));
  }

  /**
   * Contrôleur d'accès aux réponses apportées aux formulaires
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherhce
   * @return ResponseEntity<AnswersResponse>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération des réponses apportées à un formulaire avec pagination et filtre", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri ex: asc(id) ou desc(createdAt)", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les réponses et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswers.class)))
  @ApiResponse(responseCode = "404", description = "Createur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read')")
  public ResponseEntity<AnswersResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "asc(id)") String sortBy,
      @RequestParam(required = false) String include,
      FilterSpecification<Answer> filter) throws NotFoundException {

    // Test paramètre de tri
    boolean b = Pattern.matches("(desc|asc)[(](id|uuid|version|createdAt|updatedAt)[)]", sortBy);
    if (!b)
      throw new AppException(400, "Le champ de tri est incorrect");
    // Définition du paramètre de tri
    int indexStart = sortBy.indexOf("(");
    String direction = sortBy.substring(0, indexStart + 1);
    int indexEnd = sortBy.indexOf(")");
    String field = sortBy.substring(indexStart + 1, indexEnd);

    // Limitation nombre d'éléments retrourné
    size = (size > 50) ? 50 : size;

    Pageable paging = PageRequest.of(page - 1, size,
        Sort.by((Pattern.matches("asc", direction)) ? Direction.ASC : Direction.DESC, field));
    return ResponseEntity.ok(service.search(filter, paging, include));
  }

  /**
   * Contrôleur d'accès à une réponse via son id
   * @param userDetails
   * @param id          Integer l'id du réponse
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetAnswerId>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'une réponse via son id", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Réponse recherchée", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "404", description = "Formuliare ou Createur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read')")
  public ResponseEntity<Map<String, Object>> getAnswer(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {

    // recherche de la réponse
    Map<String, Object> answer = service.getAnswer(id, include);
    // pose d'un verrour sur la réponse
    Boolean courante = (Boolean) answer.get("courante");
    Boolean notLockedAt = (answer.get("lockedAt") == null);
    if (courante && notLockedAt) {
      service.lockAnswer(id, userDetails);
      answer = service.getAnswer(id, include);
    }
    return ResponseEntity.ok(answer);
  }

  /**
   * Contrôleur de mise à jour d'une réponse
   * 
   * @param userDetails
   * @param id
   * @param request
   * @param include
   * @return
   * @throws NotFoundException
   */
  @Operation(summary = "Mise à jour d'une réponse apportée à un formulaire", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @ApiResponse(responseCode = "200", description = "La réponse mise à jour", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswers.class)))
  @ApiResponse(responseCode = "404", description = "Réponse ou Créateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Map<String, Object>> update(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestBody AnswerRequest request,
      @RequestParam(required = false) String include) throws NotFoundException {

    Map<String, Object> answer = service.getAnswer(id, include);
    Statut statut = (Statut) answer.get("statut");
    // AnswerResponse rep = (AnswerResponse) answer;
    if (answer.get("courante").equals(false)) {
      throw new AppException(400, "Seule les dernières réponses peuvent être modifiées");
    }
    // test de cohérence des données fournies pour mise à jour de la réponse
    if (request.getFormulaire() != null) {
      throw new AppException(400, "Le formulaire ne peut être modifiée");
    }
    if (statut == Statut.DEVIS || statut == Statut.GAGNE
        || statut == Statut.PERDU || statut == Statut.TERMINE && request.getOpportunite() != null) {
      throw new AppException(400, "L'opportunité ne peut être modifiée");
    }
    if (statut == Statut.DEVIS || statut == Statut.GAGNE
        || statut == Statut.PERDU || statut == Statut.TERMINE && request.getDemande() != null) {
      throw new AppException(400, "La demande ne peut être modifiée");
    }

    return ResponseEntity.ok(service.updateAnswer(id, request, include, userDetails));
  }

  @PutMapping("/lock/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Boolean> lock(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id) throws NotFoundException {
    service.lockAnswer(id, userDetails);
    return ResponseEntity.ok(true);
  }

  @PutMapping("/unlock/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Boolean> unlock(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id) throws NotFoundException {
    service.unlockAnswer(id, userDetails);
    return ResponseEntity.ok(true);
  }
}
