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
import lne.intra.formsapi.model.Produit;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetProduitId;
import lne.intra.formsapi.model.openApi.GetProduits;
import lne.intra.formsapi.model.request.ProduitRequest;
import lne.intra.formsapi.model.response.ListDataResponse;
import lne.intra.formsapi.service.ProduitService;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectUpdate;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/produits")
@PreAuthorize("hasAnyRole('ADMIN','CREATOR','USER','READER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "produits endpoint")
public class ProduitController {

  private final ProduitService service;
  private final ObjectsValidator<ProduitRequest> produitValidator;

  /**
   * 
   * Contrôleur de création d'un nouveau produit
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param request     ProduitRequest objet JSON avec les champs définissant un produit
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetProduitId> La produit enregistré
   * @throws AppException
   */
  @Operation(summary = "Création d'un nouveau produit", description = "Accès limité aux rôle `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, description, header, createur")
  @ApiResponse(responseCode = "200", description = "Le produit créé", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetProduitId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAnyAuthority('admin:create','creator:create','user:create')")
  public ResponseEntity<Map<String, Object>> save(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody ProduitRequest request,
      @RequestParam(required = false) String include) throws AppException {

    // validation des champs fournis par la requête
    produitValidator.validateData(request, ObjectCreate.class);
    // sauvegarde du produit
    Produit produit = service.saveProduit(request, userDetails);
    return ResponseEntity.ok(service.addFieldsToProduit(produit, include));
  }

  /**
   * Contrôleur d'accès aux produits
   * 
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherhce
   * @return ResponseEntity<ListDataResponse>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération des produits avec pagination et filtre", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri ex: asc(id) ou desc(createdAt)", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les réponses et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetProduits.class)))
  @ApiResponse(responseCode = "404", description = "Header non trouvés dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<ListDataResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "asc(id)") String sortBy,
      @RequestParam(required = false) String include,
      @RequestParam(required = false) FilterSpecification<Produit> filter) throws NotFoundException {

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
    Page<Produit> produits = service.search(filter, paging);

    // Création de la liste des réponses
    List<Map<String, Object>> produitWithHeader = new ArrayList<>();
    // boucle sur les réponses pour ajout des informations
    for (Produit produit : produits) {
      produitWithHeader.add(service.addFieldsToProduit(produit, include));
    }
    ListDataResponse response = ListDataResponse.builder()
        .nbElements(produits.getTotalElements()) // nombre de formulaires totales
        .data(produitWithHeader) // les produits
        .page(paging.getPageNumber() + 1) // le numéro de la page retournée
        .size(paging.getPageSize()) // le nombre d'éléments retournées
        .hasPrevious(produits.hasPrevious()) // existe-t-il une page précédente
        .hasNext(produits.hasNext()) // existe-t-il une page suivante
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * Contrôleur d'accès à un produit via son id
   * 
   * @param userDetails
   * @param id          Integer l'id du produit
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetProduitId>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'une réponse via son id", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Réponse recherchée", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetProduitId.class)))
  @ApiResponse(responseCode = "404", description = "Header non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<Map<String, Object>> getAnswer(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {

    // recherche du produit
    Produit produit = service.geProduit(id);
    return ResponseEntity.ok(service.addFieldsToProduit(produit, include));
  }

  /**
   * Contrôleur de mise à jour d'un produit
   * 
   * @param userDetails
   * @param id
   * @param request
   * @param include
   * @return
   * @throws NotFoundException
   */
  @Operation(summary = "Mise à jour d'un produit", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @ApiResponse(responseCode = "200", description = "La réponse mise à jour", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetProduitId.class)))
  @ApiResponse(responseCode = "400", description = "Requête incorrecte", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "404", description = "Header non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Map<String, Object>> update(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestBody ProduitRequest request,
      @RequestParam(required = false) String include) throws NotFoundException {

    // validation des champs fournis dans la requête
    produitValidator.validateData(request, ObjectUpdate.class);

    // Récupération du produit à modifier
    Produit produit = service.geProduit(id);
    produit = service.updateProduit(id, request, userDetails);
    return ResponseEntity.ok(service.addFieldsToProduit(produit, include));
  }

}
