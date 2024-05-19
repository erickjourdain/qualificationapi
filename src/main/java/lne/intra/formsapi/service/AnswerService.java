package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Answer;
import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.LockedAnswer;
import lne.intra.formsapi.model.Produit;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.AnswerRequest;
import lne.intra.formsapi.repository.AnswerRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnswerService {

  private final AnswerRepository answerRepository;
  private final UserService userService;
  private final FormService formService;
  private final LockedAnswerService lockedAnswerService;
  private final ProduitService produitService;

  /**
   * Ajout des champs à retourner à la réponse
   * 
   * @param answer
   * @param include
   * @return
   * @throws AppException
   */
  public Map<String, Object> addFieldsToAnswer(Answer answer, String include) throws AppException {
    Map<String, Object> user = new HashMap<>();
    Map<String, Object> form = new HashMap<>();
    Map<String, Object> response = new HashMap<>();
    Map<String, Object> lock = new HashMap<>();

    // création de la liste des champs à retourner par la requête
    List<String> fields = new ArrayList<String>();
    if (include != null)
      fields = Arrays.asList(include.toLowerCase().replaceAll(" ", "").split(","));

    // ajout du champ créateur
    if (fields.isEmpty() || fields.contains("createur")) {
      // recherche du créateur de la réponse dans la base
      User createur = userService.getUser(answer.getCreateur().getId());
      user.clear();
      user.put("id", createur.getId());
      user.put("prenom", createur.getPrenom());
      user.put("nom", createur.getNom());
      //user.put("role", createur.getRole());
      response.put("createur", user);
    }

    // ajout du champ gestionnaire
    if (fields.isEmpty() || fields.contains("gestionnaire")) {
      // recherche du gestionnaire courant dans la base
      User gestionnaire = userService.getUser(answer.getGestionnaire().getId());
      user.clear();
      user.put("id", gestionnaire.getId());
      user.put("prenom", gestionnaire.getPrenom());
      user.put("nom", gestionnaire.getNom());
      //user.put("role", gestionnaire.getRole());
      response.put("gestionnaire", user);
    }

    // ajout du champ locked
    if (fields.isEmpty() || fields.contains("lock")) {
      Optional<LockedAnswer> lockedAnswer = lockedAnswerService.getByAnswer(answer);
      lockedAnswer.ifPresentOrElse(
          l -> {
            User lockedBy = userService.getUser(l.getUtilisateur().getId());
            lock.put("id", l.getId());
            lock.put("lockedAt", l.getLockedAt());
            user.clear();
            user.put("id", lockedBy.getId());
            user.put("prenom", lockedBy.getPrenom());
            user.put("nom", lockedBy.getNom());
            user.put("role", lockedBy.getRole());
            lock.put("utilisateur", user);
            response.put("lock", lock);
          },
          () -> response.put("lock", null));
    }

    // ajout du champ formulaire
    if (fields.isEmpty() || fields.contains("formulaire")) {
      // recherche du formulaire dans la base
      Form formulaire = formService.getForm(answer.getFormulaire().getId());
      form.put("id", formulaire.getId());
      form.put("formulaire", formulaire.getFormulaire());
      form.put("titre", formulaire.getTitre());
      form.put("version", formulaire.getVersion());
      form.put("valide", formulaire.getValide());
      form.put("slug", formulaire.getSlug());
      response.put("formulaire", form);
    }

    // ajout des différents champs à retourner en fonction de la demande exposée
    // dans la requêtes d'interrogation
    if (fields.isEmpty() || fields.contains("id"))
      response.put("id", answer.getId());
    if (fields.isEmpty() || fields.contains("uuid"))
      response.put("uuid", answer.getUuid());
    if (fields.isEmpty() || fields.contains("reponse"))
      response.put("reponse", answer.getReponse());
    if (fields.isEmpty() || fields.contains("version"))
      response.put("version", answer.getVersion());
    if (fields.isEmpty() || fields.contains("courante"))
      response.put("courante", answer.getCourante());
    if (fields.isEmpty() || fields.contains("devis"))
      response.put("devis", answer.getDevis());
    if (fields.isEmpty() || fields.contains("statut"))
      response.put("statut", answer.getStatut());
    if (fields.isEmpty() || fields.contains("createdat"))
      response.put("createdAt", answer.getCreatedAt());
    if (fields.isEmpty() || fields.contains("updatedat"))
      response.put("updatedAt", answer.getUpdatedAt());

    return response;
  }

  /**
   * Recherche d'une réponse en fonction de son id
   * 
   * @param id
   * @return
   * @throws AppException
   */
  public Answer getAnswer(Integer id) throws AppException {
    Answer answer = answerRepository.findById(id)
        .orElseThrow(() -> new AppException(400, "La réponse n'existe pas"));
    return answer;
  }

  /**
   * Enregistrement d'une nouvelle réponse
   * 
   * @param request
   * @param userDetails
   * @return
   * @throws AppException
   */
  public Answer saveAnswer(AnswerRequest request, UserDetails userDetails)
      throws AppException {
    // récupération des informations sur l'utilisateur connecté
    User createur = userService.getByLogin(userDetails.getUsername());
    // récupération du formulaire
    Form formulaire = formService.getForm(request.getFormulaire());
    // récupération du produit
    Produit produit = produitService.geProduit(request.getProduit());
    // création de la nouvelle entrée
    Answer answer = Answer.builder()
        .uuid(UUID.randomUUID().toString())
        .reponse(request.getReponse().trim())
        .formulaire(formulaire)
        .createur(createur)
        .gestionnaire(createur)
        .produit(produit)
        .build();
    // sauvegarde de la nouvelle entrée
    return answerRepository.save(answer);
  }

  /**
   * Mise à jour d'une réponse
   * 
   * @param id
   * @param request
   * @param userDetails
   * @return
   * @throws AppException
   */
  public Answer updateAnswer(Integer id, AnswerRequest request, UserDetails userDetails)
      throws AppException {

    Answer newAnswer = Answer.builder().build();

    // récupération de l'entité à modifier
    Answer answer = answerRepository.findById(id)
        .orElseThrow(() -> new AppException(404, "Impossible de trouver la réponse à modifier"));

    // Mise à jour du devis
    Optional.ofNullable(request.getDevis())
        .ifPresent(res -> {
          answer.setDevis(res);
        });
    // Mise à jour du statut
    Optional.ofNullable(request.getStatut())
        .ifPresent(res -> {
          answer.setStatut(res);
        });
    // récupération des informations sur l'utilisateur connecté
    User user = userService.getByLogin(userDetails.getUsername());
    // Mise à jour du gestionnaire
    answer.setGestionnaire(user);
    // Mise à jour des données et de la réponse
    // Enregistrement d'une nouvelle entrée avec changement de version
    Optional.ofNullable(request.getReponse())
        .ifPresent(res -> {
          answer.setCourante(false);
        });
    if (!answer.getCourante()) {
      newAnswer = Answer.builder()
          .uuid(answer.getUuid())
          .formulaire(answer.getFormulaire())
          .reponse(request.getReponse())
          .version(answer.getVersion() + 1)
          .createur(user)
          .gestionnaire(user)
          .devis(answer.getDevis())
          .statut(answer.getStatut())
          .build();
    }
    // mise à jour de la réponse
    answerRepository.save(answer);
    return answer.getCourante() ? answer : answerRepository.save(newAnswer);
  }

  /**
   * Recherche d'une liste de réponses
   * 
   * @param spec
   * @param paging
   * @return
   */
  public Page<Answer> search(@Filter Specification<Answer> spec, Pageable paging) {
    // Récupération des réponses
    return answerRepository.findAll(spec, paging);
  }
}
