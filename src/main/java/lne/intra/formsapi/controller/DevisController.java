package lne.intra.formsapi.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import lne.intra.formsapi.model.Devis;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetDevis;
import lne.intra.formsapi.model.openApi.GetDevisId;
import lne.intra.formsapi.model.request.DevisRequest;
import lne.intra.formsapi.model.response.ListDataResponse;
import lne.intra.formsapi.service.DevisService;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/devis")
@PreAuthorize("hasAnyRole('ADMIN','CREATOR','USER','READER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BeraerAuth")
@Tag(name = "devis endpoint")
public class DevisController {

  private final DevisService service;
  private final ObjectsValidator<DevisRequest> devisValidator;

  @Operation(summary = "Création d'un nouveau devis", description = "Accès limité aux roles `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, reference")
  @ApiResponse(responseCode = "200", description = "Le devis créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetDevisId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAnyAuthority('admin:create','creator:create','user:create')")
  public ResponseEntity<Map<String, Object>> save(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody DevisRequest request,
      @RequestParam(required = false) String include) throws AppException {
    // Validation des champs fournis dans la requête
    devisValidator.validateData(request, ObjectCreate.class);
    // Vérifier que le devis n'existe pas dans la base
    Optional<Devis> dev = service.getByRef(request.getReference());
    if (dev.isPresent()) throw new AppException(400, "Le devis est déjà présent dans la base");
    // Sauvegarde du devis
    Devis devis = service.saveDevis(request, userDetails);
    return ResponseEntity.ok(service.addFieldsToDevis(devis, include));
  }

  /**
   * Contrôleur d'accès aux devis
   * 
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherhce
   * @return ResponseEntity<ListDataResponse>
   */
  @Operation(summary = "Récupération des devis avec pagination et filtre", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri ex: asc(id) ou desc(createdAt)", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, reference, version")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les devis et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetDevis.class)))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<ListDataResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "asc(id)") String sortBy,
      @RequestParam(required = false) String include,
      @RequestParam(required = false) FilterSpecification<Devis> filter) {

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

    // Récupération des réponses
    Page<Devis> devis = service.search(filter, paging);

    // Création de la liste des devis
    List<Map<String, Object>> devisList = new ArrayList<>();
    // boucle sur les réponses pour ajout des informations
    for (Devis dev : devis) {
      devisList.add(service.addFieldsToDevis(dev, include));
    }

    ListDataResponse response = ListDataResponse.builder()
        .nbElements(devis.getTotalElements()) // nombre de formulaires totales
        .data(devisList) // les réponses
        .page(paging.getPageNumber() + 1) // le numéro de la page retournée
        .size(paging.getPageSize()) // le nombre d'éléments retournées
        .hasPrevious(devis.hasPrevious()) // existe-t-il une page précédente
        .hasNext(devis.hasNext()) // existe-t-il une page suivante
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * Contrôleur d'accès à un devis via son id
   * 
   * @param userDetails
   * @param id          Integer l'id du devis
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetDevisId>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'un devis via son id", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, référence, version")
  @ApiResponse(responseCode = "200", description = "Devis recherché", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetDevisId.class)))
  @ApiResponse(responseCode = "404", description = "Devis non trouvés dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<Map<String, Object>> getDevis(
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {

    // recherche du devis
    Devis devis = service.getDevis(id);

    return ResponseEntity.ok(service.addFieldsToDevis(devis, include));
  }

}
