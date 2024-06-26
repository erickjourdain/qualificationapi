package lne.intra.formsapi.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
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
import lne.intra.formsapi.model.Header;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetDir;
import lne.intra.formsapi.model.openApi.GetHeaderId;
import lne.intra.formsapi.model.openApi.GetHeaders;
import lne.intra.formsapi.model.request.HeaderProductsRequest;
import lne.intra.formsapi.model.request.HeaderRequest;
import lne.intra.formsapi.model.request.ProduitRequest;
import lne.intra.formsapi.model.response.ListDataResponse;
import lne.intra.formsapi.service.HeaderService;
import lne.intra.formsapi.service.ProduitService;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectUpdate;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/headers")
@PreAuthorize("hasAnyRole('ADMIN','CREATOR','USER','READER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "headers endpoint")
public class HeaderController {

  private final HeaderService headerService;
  private final ProduitService produitService;
  private final ObjectsValidator<HeaderRequest> headerValidator;
  private final ObjectsValidator<HeaderProductsRequest> headerProductsValidator;

  @Value("${lne.intra.formsapi.gecdocdir}")
  private String gecdocdir;

  @Operation(summary = "Récupération des chemins de l'opportunité et du projet dans GEC-DOCUMENTS", description = "Accès limité aux personnes connectées")
  @ApiResponse(responseCode = "200", description = "Liste des chemins", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetDir.class)))
  @ApiResponse(responseCode = "404", description = "id non trouvé", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/dir/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<Map<String, Object>> directories(
      @PathVariable Integer id) throws AppException, IOException {

    Map<String, Object> response = new HashMap<>();

    // Récupération de l'entête
    Header header = headerService.getHeader(id);

    // Recherche du répertoire opportunité
    if (Objects.nonNull(header.getOpportunite()) && !header.getOpportunite().isEmpty()) {
      String opp = StringUtils.right(header.getOpportunite(), 7);
      String year = StringUtils.substring(opp, 0, 2);
      Path startDir = Paths.get(gecdocdir + "/OPPORTUNITES/20" + year);
      Optional<Path> oppDir = Files.walk(startDir)
          .filter(Files::isDirectory)
          .filter(f -> f.toString().contains(opp))
          .findFirst();
      response.put("opportunite", oppDir);
    } else
      response.put("opportunite", null);

    // Recherche du répertoire projet
    if (Objects.nonNull(header.getProjet()) && !header.getProjet().isEmpty()) {
      int numProjet = Integer.valueOf(StringUtils.right(header.getProjet(), 6));
      Path startDir = Paths.get(gecdocdir + "/PROJETS");
      Optional<Path> initDir = Files.walk(startDir, 1)
          .filter(Files::isDirectory)
          .filter(f -> f.getFileName().toString().matches("P[0-9]{6}-P[0-9]{6}"))
          .filter(f -> {
            int startProj = Integer.valueOf(StringUtils.substring(f.getFileName().toString(), 1, 7));
            int endProj = Integer.valueOf(StringUtils.substring(f.getFileName().toString(), 9, 15));
            return (startProj <= numProjet && numProjet <= endProj);
          })
          .findFirst();
      initDir.ifPresentOrElse(dir -> {
        Optional<Path> projDir;
        try {
          projDir = Files.walk(dir, 1)
              .filter(Files::isDirectory)
              .filter(f -> f.toString().contains(header.getProjet()))
              .findFirst();
          response.put("projet", projDir);
        } catch (IOException e) {
          response.put("projet", null);
        }
      }, () -> response.put("projet", null));
    } else
      response.put("projet", null);

    return ResponseEntity.ok(response);
  }

  /**
   * Contrôleur de création d'une nouvelle entête
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param request     HeaderRequest objet JSON avec les champs définissant une
   *                    entête
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetHeaderId> l'entête enregistrée
   * @throws AppException
   */
  @Operation(summary = "Création d'une nouvelle entête", description = "Accès limité aux rôle `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, societe, email, produit, createur")
  @ApiResponse(responseCode = "200", description = "L'entête créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetHeaderId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAnyAuthority('admin:create','creator:create','user:create')")
  public ResponseEntity<Map<String, Object>> save(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody HeaderRequest request,
      @RequestParam(required = false) String include) throws AppException {

    // Validation des champs de la requête
    headerValidator.validateData(request, ObjectCreate.class);
    // Sauvegarde de l'entete
    Header header = headerService.saveHeader(request, userDetails);
    return ResponseEntity.ok(headerService.addFieldsToHeader(header, include));
  }

  /**
   * Contrôleur de création d'une nouvelle entête incluant des produits associés
   * 
   * @param userDetails
   * @param request
   * @param include
   * @return
   * @throws AppException
   */
  @Operation(summary = "Création d'une nouvelle entête avec des produits associés", description = "Accès limité aux rôle `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "", required = false, example = "id, societe, email, produit, createur")
  @ApiResponse(responseCode = "200", description = "L'entête créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetHeaderId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping("/with-products")
  @PreAuthorize("hasAnyAuthority('admin:create','creator:create','user:create')")
  public ResponseEntity<Map<String, Object>> saveWithProducts(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody HeaderProductsRequest request,
      @RequestParam(required = false) String include) throws AppException {

    // Validation des champs de la requête
    headerProductsValidator.validateData(request, ObjectCreate.class);
    HeaderRequest headerRequest = HeaderRequest.builder()
        .societe(request.getSociete())
        .email(request.getEmail())
        .nom(request.getNom())
        .prenom(request.getPrenom())
        .telephone(request.getTelephone())
        .projet(request.getProjet())
        .opportunite(request.getOpportunite())
        .build();
    Header header = headerService.saveHeader(headerRequest, userDetails);
    for (String description : request.getProduits()) {
      ProduitRequest produit = ProduitRequest.builder()
          .description(description)
          .header(header.getId())
          .build();
      produitService.saveProduit(produit, userDetails);
    }
    return ResponseEntity.ok(headerService.addFieldsToHeader(header, include));
  }

  /**
   * Contrôleur d'accès aux entêtes
   * 
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherhce
   * @return ResponseEntity<HeadersResponse>
   * @throws AppException
   */
  @Operation(summary = "Récupération des entêtes avec pagination et filtre", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri ex: asc(id) ou desc(createdAt)", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, societe, email, produit, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les réponses et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetHeaders.class)))
  @ApiResponse(responseCode = "404", description = "Créateur ou Gestionnaire non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<ListDataResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "asc(id)") String sortBy,
      @RequestParam(required = false) String include,
      @RequestParam(required = false) FilterSpecification<Header> filter) throws AppException {

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

    // Récupération des entêtes
    Page<Header> headers = headerService.search(filter, paging);

    // Création de la liste des entêtes
    List<Map<String, Object>> headersList = new ArrayList<>();
    // boucle sur les entêtes pour ajout des informations
    for (Header header : headers) {
      headersList.add(headerService.addFieldsToHeader(header, include));
    }

    ListDataResponse response = ListDataResponse.builder()
        .nbElements(headers.getTotalElements())
        .data(headersList)
        .page(paging.getPageNumber() + 1)
        .size(paging.getPageSize())
        .hasPrevious(headers.hasPrevious())
        .hasNext(headers.hasNext())
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * Contrôleur d'accès à une entête via son id
   * 
   * @param id      Integer l'id de l'entête
   * @param include String liste des champs à retourner
   * @return ResponseEntity<GetHeaderId>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'une entête via son id", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, societe, email, produit, createur")
  @ApiResponse(responseCode = "200", description = "Réponse recherchée", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetHeaderId.class)))
  @ApiResponse(responseCode = "404", description = "Créateur ou Gestionnaire non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<Map<String, Object>> getHeader(
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {
    // recherche de l'entête
    Header header = headerService.getHeader(id);
    return ResponseEntity.ok(headerService.addFieldsToHeader(header, include));
  }

  /**
   * Contrôleur de mise à jour d'une entête
   * 
   * @param userDetails
   * @param id
   * @param request
   * @param include
   * @return
   * @throws NotFoundException
   */
  @Operation(summary = "Mise à jour d'une entête", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @ApiResponse(responseCode = "200", description = "L'entête mise à jour", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetHeaderId.class)))
  @ApiResponse(responseCode = "400", description = "Requête incorrecte", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "404", description = "Créateur ou Gestionnaire non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Map<String, Object>> update(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestBody HeaderRequest request,
      @RequestParam(required = false) String include) throws NotFoundException {
    // Validation des champs fournis dans la requête
    headerValidator.validateData(request, ObjectUpdate.class);
    // Récupération de l'entête à modifier
    Header header = headerService.getHeader(id);
    header = headerService.updatHeader(id, request, userDetails);
    return ResponseEntity.ok(headerService.addFieldsToHeader(header, include));
  }
}
