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
import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetFormId;
import lne.intra.formsapi.model.openApi.GetForms;
import lne.intra.formsapi.model.request.FormRequest;
import lne.intra.formsapi.model.response.FormsResponse;
import lne.intra.formsapi.service.FormService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/forms")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "formulaires endpoint")
public class FormController {

  private final FormService service;

  /**
   * Création d'un nouveau formulaire
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param request     FormRequest objet JSON avec les champs définissant le
   *                    formulaire
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetFormId> Le formulaire enregistré
   * @throws AppException
   */
  @Operation(summary = "Création d'un nouveau formulaire", description = "Accès limité au rôle `ADMIN`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Le formulaire créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetFormId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAuthority('admin:create')")
  public ResponseEntity<Map<String, Object>> save(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody FormRequest request,
      @RequestParam(required = false) String include) throws AppException {
    if (service.existingValidForm(request.getTitre())) {
      throw new AppException(400, "Une formulaire valide avec ce titre existe dans la base de données");
    }
    return ResponseEntity.ok(service.saveForm(request, include, userDetails));
  }
  /*
   * @Operation(summary = "Création d'un nouveau formulaire", description =
   * "Accès limité au rôle `ADMIN`")
   * 
   * @Parameter(in = ParameterIn.QUERY, name = "include", description =
   * "Liste des champs à retourner", required = false, example =
   * "id, titre, version, createur")
   * 
   * @ApiResponse(responseCode = "200", description = "Le formulaire créé",
   * content = @Content(mediaType = "application/json", schema
   * = @Schema(implementation = GetFormId.class)))
   * 
   * @ApiResponse(responseCode = "400", description =
   * "Données fournies incorrectes", content = @Content(mediaType =
   * "application/json"))
   * 
   * @ApiResponse(responseCode = "403", description =
   * "Accès non autorisé ou token invalide", content = @Content(mediaType =
   * "application/text"))
   * 
   * @PostMapping()
   * 
   * @PreAuthorize("hasAuthority('admin:create')")
   * public ResponseEntity<Map<String, Object>> save(
   * 
   * @AuthenticationPrincipal UserDetails userDetails,
   * 
   * @RequestBody FormRequest request,
   * 
   * @RequestParam(required = false) String include) throws AppException {
   * if (service.existingValidForm(request.getTitre())) {
   * throw new AppException(400,
   * "Une formulaire valide avec ce titre existe dans la base de données");
   * }
   * return ResponseEntity.ok(service.saveForm(request, include, userDetails));
   * }
   */

  /**
   * Mise à jour d'un formulaire via son id
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param id          Integer l'identifiant du formulaire
   * @param include     String liste des champs à retourner
   * @param request     FormRequest object JSON avec les champs définissant le
   *                    formulaire
   * @return ResponseEntity<GetFormId> le formulaire mis à jour
   * @throws NotFoundException
   */
  @Operation(summary = "Mise à jour d'un formulaire", description = "Accès limité au rôle `ADMIN` \n* si le champ formulaire est fourni, création d'une nouvelle entrée en version N+1  \n * sinon mise à jour du formulaire existant")
  @Parameter(in = ParameterIn.PATH, name = "id", description = "ID du formulaire à mettre à jour", example = "1")
  @ApiResponse(responseCode = "200", description = "Le formulaire mis à jour", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetFormId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrecte", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("/{id}")
  @PreAuthorize("hasAuthority('admin:update')")
  public ResponseEntity<Map<String, Object>> update(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include,
      @RequestBody FormRequest request)
      throws AppException {
    if (request.getTitre() != null && service.existingValidForm(request.getTitre())) {
      throw new AppException(400, "Une formulaire valide avec ce titre existe dans la base de données");
    }
    return ResponseEntity.ok(service.partialUpdateForm(id, request, include, userDetails));
  }

  /**
   * Contrôleur d'accès aux formulaires
   * 
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherche
   * @return ResponseEntity<FormsResponse>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération de formulaires avec pagination et filtre", description = "Accès limité aux rôles `ADMIN` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri ex: asc(id) ou desc(createdAt)", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les formulaires et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetForms.class)))
  @ApiResponse(responseCode = "404", description = "Createur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<FormsResponse> get(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "asc(id)") String sortBy,
      @RequestParam(required = false) String include,
      @RequestParam(required = false) FilterSpecification<Form> filter) throws NotFoundException {

    // Test paramètre de tri
    boolean b = Pattern.matches("(desc|asc)[(](id|version|createdAt|updatedAt)[)]", sortBy);
    if (!b)
      throw new AppException(400, "Le champ de tri est incorrect");
    // Définition du paramètre de tri
    int indexStart = sortBy.indexOf("(");
    String direction = sortBy.substring(0, indexStart);
    int indexEnd = sortBy.indexOf(")");
    String field = sortBy.substring(indexStart + 1, indexEnd);

    Pageable paging = PageRequest.of(page - 1, size,
        Sort.by((Pattern.matches("asc", direction)) ? Direction.ASC : Direction.DESC, field));
    return ResponseEntity.ok(service.search(filter, paging, include));
  }

  /**
   * Contrôleur d'accès à un formulaire via son id
   * 
   * @param id      Integer l'id du formulaire
   * @param include String liste des champs à retourner
   * @return ResponseEntity<GetFormId>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'un formulaire via son id", description = "Accès limité aux rôles `ADMIN` et `USER`")
  @Parameter(in = ParameterIn.PATH, name = "id", description = "L'identifinat du formulaire", required = true, example = "1")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Formulaire recherché", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetFormId.class)))
  @ApiResponse(responseCode = "404", description = "Formuliare ou Createur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<Map<String, Object>> getForm(
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {
    return ResponseEntity.ok(service.getForm(id, include));
  }
}
