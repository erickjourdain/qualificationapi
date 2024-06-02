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
import lne.intra.formsapi.model.Answer;
import lne.intra.formsapi.model.Devis;
import lne.intra.formsapi.model.LockedAnswer;
import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.openApi.GetAnswerId;
import lne.intra.formsapi.model.openApi.GetAnswers;
import lne.intra.formsapi.model.request.AnswerRequest;
import lne.intra.formsapi.model.request.AnswerDevisRequest;
import lne.intra.formsapi.model.response.ListDataResponse;
import lne.intra.formsapi.repository.AnswerRepository;
import lne.intra.formsapi.repository.DevisRepository;
import lne.intra.formsapi.service.AnswerService;
import lne.intra.formsapi.service.LockedAnswerService;
import lne.intra.formsapi.service.UserService;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectUpdate;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/answers")
@PreAuthorize("hasAnyRole('ADMIN','CREATOR','USER','READER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "reponses endpoint")
public class AnswerController {

  private final AnswerService service;
  private final UserService userService;
  private final LockedAnswerService lockedAnswerService;
  private final ObjectsValidator<AnswerRequest> answerValidator;
  private final ObjectsValidator<AnswerDevisRequest> answerDevisValidator;
  private final AnswerRepository answerRepository;
  private final DevisRepository devisRepository;

  /**
   * Contrôleur de création d'une nouvelle réponse
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param request     AnswerRequest objet JSON avec les champs définissant une
   *                    réponse à un formulaire
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetAnswerId> La réponse enregistrée
   * @throws AppException
   */
  @Operation(summary = "Création d'une nouvelle réponse", description = "Accès limité aux rôle `ADMIN`, `CREATOR` et `USER`")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "La réponse créée", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "400", description = "Données fournies incorrectes", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAnyAuthority('admin:create','creator:create','user:create')")
  public ResponseEntity<Map<String, Object>> save(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestBody AnswerRequest request,
      @RequestParam(required = false) String include) throws AppException {

    // Validation des champs fournis dans la requête
    answerValidator.validateData(request, ObjectCreate.class);
    // Sauvegarde de la réponse
    Answer answer = service.saveAnswer(request, userDetails);
    return ResponseEntity.ok(service.addFieldsToAnswer(answer, include));
  }

  /**
   * Contrôleur d'accès aux réponses apportées aux formulaires
   * 
   * @param page    Integer numéro de la page à retourner par défaut 1
   * @param size    Integer nombre d'éléments à envoyer par défaut 10
   * @param sortBy  String champ de tri
   * @param include String liste des champs à retourner
   * @param filter  Sting filtre à appliquer à la recherhce
   * @return ResponseEntity<ListDataResponse>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération des réponses apportées à un formulaire avec pagination et filtre", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "page", description = "Numéro de la page à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "size", description = "Nombre d'éléments à retourner", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "sortBy", description = "Champ de tri ex: asc(id) ou desc(createdAt)", required = false)
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @Parameter(in = ParameterIn.QUERY, name = "filter", description = "Filtre au format défini dans le package [turkraft/springfilter](https://github.com/turkraft/springfilter)", required = false, schema = @Schema(implementation = String.class), example = "valide:true and titre ~~ '*formulaire*'")
  @ApiResponse(responseCode = "200", description = "Les réponses et informations sur la pagination", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswers.class)))
  @ApiResponse(responseCode = "404", description = "Formulaire, Créateur ou Gestionnaire non trouvés dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<ListDataResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "asc(id)") String sortBy,
      @RequestParam(required = false) String include,
      @RequestParam(required = false) FilterSpecification<Answer> filter) throws NotFoundException {

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
    Page<Answer> answers = service.search(filter, paging);

    // Création de la liste des réponses
    List<Map<String, Object>> answersWithCreateur = new ArrayList<>();
    // boucle sur les réponses pour ajout des informations
    for (Answer answer : answers) {
      answersWithCreateur.add(service.addFieldsToAnswer(answer, include));
    }
    ListDataResponse response = ListDataResponse.builder()
        .nbElements(answers.getTotalElements()) // nombre de formulaires totales
        .data(answersWithCreateur) // les réponses
        .page(paging.getPageNumber() + 1) // le numéro de la page retournée
        .size(paging.getPageSize()) // le nombre d'éléments retournées
        .hasPrevious(answers.hasPrevious()) // existe-t-il une page précédente
        .hasNext(answers.hasNext()) // existe-t-il une page suivante
        .build();

    return ResponseEntity.ok(response);
  }

  /**
   * Contrôleur d'accès à une réponse via son id
   * 
   * @param userDetails
   * @param id          Integer l'id du réponse
   * @param include     String liste des champs à retourner
   * @return ResponseEntity<GetAnswerId>
   * @throws NotFoundException
   */
  @Operation(summary = "Récupération d'une réponse via son id", description = "Accès limité aux personnes connectées")
  @Parameter(in = ParameterIn.QUERY, name = "include", description = "Liste des champs à retourner", required = false, example = "id, titre, version, createur")
  @ApiResponse(responseCode = "200", description = "Réponse recherchée", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "404", description = "Formulaire, Créateur ou Gestionnaire non trouvés dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read','reader:read')")
  public ResponseEntity<Map<String, Object>> getAnswer(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestParam(required = false) String include) throws NotFoundException {

    // recherche de la réponse
    Answer answer = service.getAnswer(id);
    User user = userService.getByLogin(userDetails.getUsername());
    Boolean isReader = user.getRole() == Role.READER;
    // pose d'un verrou sur la réponse
    if (answer.getCourante() && lockedAnswerService.getByAnswer(answer).isEmpty() && !isReader) {
      LockedAnswer lockedAnswer = LockedAnswer.builder()
          .answer(answer)
          .utilisateur(user)
          .build();
      lockedAnswerService.insert(lockedAnswer);
    }
    return ResponseEntity.ok(service.addFieldsToAnswer(answer, include));
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
  @ApiResponse(responseCode = "200", description = "La réponse mise à jour", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "400", description = "Requête incorrecte", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "404", description = "Réponse ou Créateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Map<String, Object>> update(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestBody AnswerRequest request,
      @RequestParam(required = false) String include) throws NotFoundException {

    // validation des champs fournis dans la requête
    answerValidator.validateData(request, ObjectUpdate.class);

    // Récupération de la réponse à modifier
    Answer answer = service.getAnswer(id);
    // récupération des informations sur l'utilisateur connecté
    User user = userService.getByLogin(userDetails.getUsername());
    Optional<LockedAnswer> lockedAnswer = lockedAnswerService.getByAnswer(answer);
    lockedAnswer.ifPresentOrElse(lock -> {
      if (user.getId() != lock.getUtilisateur().getId())
        throw new AppException(403, "La réponse est vérouillée par un aute utilisateur");
    }, () -> {
      throw new AppException(403, "Acun verrou posé sur cette réponse");
    });
    // Vérification de la possibilité de modifier la réponse
    if (answer.getCourante().equals(false)) {
      throw new AppException(400, "Seules les dernières réponses peuvent être modifiées");
    }

    // Tests de cohérence des données fournies pour mise à jour de la réponse
    if (request.getFormulaire() != null) {
      throw new AppException(400, "Le formulaire ne peut être modifiée");
    }
    answer = service.updateAnswer(id, request, userDetails);
    return ResponseEntity.ok(service.addFieldsToAnswer(answer, include));
  }

  /**
   * Controleur d'ajout d'un devis à une réponse
   * 
   * @param userDetails
   * @param id
   * @param request
   * @param include
   * @return
   * @throws NotFoundException
   */
  @Operation(summary = "ajout d'un devis à réponse apportée à un formulaire", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @ApiResponse(responseCode = "200", description = "La réponse mise à jour", content = @Content(mediaType = "application/json", schema = @Schema(implementation = GetAnswerId.class)))
  @ApiResponse(responseCode = "400", description = "Requête incorrecte", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "404", description = "Réponse ou Créateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("/devis/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Map<String, Object>> updateDevis(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id,
      @RequestBody AnswerDevisRequest request,
      @RequestParam(required = false) String include) throws NotFoundException {

    // validation des champs fournis dans la requête
    answerDevisValidator.validateData(request, ObjectUpdate.class);

    // Récupération de la réponse à modifier
    Answer answer = service.getAnswer(id);
    // final Answer updatAnswer = answer;
    // récupération des informations sur l'utilisateur connecté
    User user = userService.getByLogin(userDetails.getUsername());
    Optional<LockedAnswer> lockedAnswer = lockedAnswerService.getByAnswer(answer);
    lockedAnswer.ifPresentOrElse(lock -> {
      if (user.getId() != lock.getUtilisateur().getId())
        throw new AppException(403, "La réponse est vérouillée par un aute utilisateur");
    }, () -> {
      throw new AppException(403, "Acun verrou posé sur cette réponse");
    });

    // Vérification cohérence de la référence du devis
    // Le devis ne peut être attaché à un autre produit
    Integer test1 = answerRepository.countDevisOtherProduct(answer.getProduit().getId(), request.getDevis());
    if (test1 > 0)
      throw new AppException(400, "Le devis est rattaché à un autre produit");
    // Le devis ne peut être attaché à une autre version de la réponse
    Integer test2 = answerRepository.countDevisProductForm(answer.getProduit().getId(), answer.getFormulaire().getId(),
        request.getDevis());
    if (test2 > 0)
      throw new AppException(400, "Ce devis est déjà rattaché à une autre version de la réponse");

    Optional<Devis> devis = devisRepository.findByReference(request.getDevis());
    if (devis.isPresent()) {
      answer.setDevis(devis.get());
    } else {
      Devis newDevis = Devis.builder()
          .reference(request.getDevis())
          .createur(user)
          .build();
      Devis savedDevis = devisRepository.save(newDevis);
      answer.setDevis(savedDevis);
    }
    answer = answerRepository.save(answer);

    return ResponseEntity.ok(service.addFieldsToAnswer(answer, include));
  }

  /**
   * Contrôleur de vérouillage d'une réponse
   * 
   * @param userDetails
   * @param id
   * @return
   * @throws NotFoundException
   */
  @Operation(summary = "Vérouillage d'une réponse", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @ApiResponse(responseCode = "200", description = "Réponse vérouillée", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "404", description = "Réponse ou Utilisateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping("/lock/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Boolean> lock(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id) throws NotFoundException {
    Answer answer = service.getAnswer(id);
    User user = userService.getByLogin(userDetails.getUsername());
    LockedAnswer lockedAnswer = LockedAnswer.builder()
        .answer(answer)
        .utilisateur(user)
        .build();
    lockedAnswerService.insert(lockedAnswer);
    return ResponseEntity.ok(true);
  }

  /**
   * Contrôleur de dévérouillage d'une réponse
   * 
   * @param userDetails
   * @param id
   * @return
   * @throws NotFoundException
   */
  @Operation(summary = "Dévérouillage d'une réponse", description = "Accès limité aux rôles `ADMIN`, `CREATOR` et `USER`")
  @ApiResponse(responseCode = "200", description = "Réponse vérouillée", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "404", description = "Réponse ou Utilisateur non trouvé dans la base", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping("/unlock/{id}")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:update','user:update')")
  public ResponseEntity<Boolean> unlock(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id) throws NotFoundException {
    Answer answer = service.getAnswer(id);
    Optional<LockedAnswer> lockedAnswer = lockedAnswerService.getByAnswer(answer);
    lockedAnswer.ifPresentOrElse(lock -> lockedAnswerService.delete(lock.getId()),
        () -> new AppException(404, "Aucun verrou posé sur cet enregistrement"));
    return ResponseEntity.ok(true);
  }
}
