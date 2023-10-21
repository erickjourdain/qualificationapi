package lne.intra.formsapi.controller;

import java.util.Map;

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
   * Création d'un nouvelle réponse
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param request     AnswerRequest objet JSON avec les champs définissant une
   *                    réponse à un formulaire
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetAnswerId> La réponse enregistrée
   * @throws AppException
   */
  @Operation(summary = "Création d'une nouvelle réponse", description = "Accès limité aux rôle `ADMIN` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Le formulaire créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAnyAuthority('admin:create','user:create')")
  public ResponseEntity<Map<String, Object>> save(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody AnswerRequest request,
      @RequestParam(required = false) String include) throws AppException {
    return ResponseEntity.ok(service.saveAnswer(request, include, userDetails));
  }

  /**
   * Contrôleur d'accès aux réponses apportées aux formulaire
   * 
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherhce
   * @return ResponseEntity<AnswersResponse>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération des réponses apportées à un formulaire avec pagination et filtre", description = "Accès limité aux rôles `ADMIN` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les réponses et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswers.class)))
  @ApiResponse(responseCode = "404", description = "Createur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<AnswersResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestParam(required = false) String include,
      FilterSpecification<Answer> filter) throws NotFoundException {

    Pageable paging = PageRequest.of(page - 1, size, Sort.by(Direction.DESC, sortBy));
    return ResponseEntity.ok(service.search(filter, paging, include));
  }

  /**
   * Contrôleur d'accès à une réponse via son id
   * 
   * @param id      Integer l'id du réponse
   * @param include String liste des champs à retourner
   * @return ResponseEntity<GetAnswerId>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'une réponse via son id", description = "Accès limité aux rôles `ADMIN` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Réponse recherchée", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "404", description = "Formuliare ou Createur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<Map<String, Object>> getAnswer(
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {
    return ResponseEntity.ok(service.getAnswer(id, include));
  }
}
