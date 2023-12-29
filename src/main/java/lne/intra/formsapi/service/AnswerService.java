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
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.AnswerRequest;
import lne.intra.formsapi.repository.AnswerRepository;
import lne.intra.formsapi.repository.FormRepository;
import lne.intra.formsapi.repository.LockedAnswerRepository;
import lne.intra.formsapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnswerService {

  private final AnswerRepository answerRepository;
  private final UserRepository userRepository;
  private final FormRepository formRepository;
  private final LockedAnswerRepository lockedAnswerRepository;

  /**
   * Ajout des champs à retourner à la réponse
   * 
   * @param answer
   * @param include
   * @return
   * @throws AppException
   */
  public Map<String, Object> addFieldsToAnswer(Answer answer, String include) throws AppException {
    Map<String, Object> user1 = new HashMap<>();
    Map<String, Object> user2 = new HashMap<>();
    Map<String, Object> form = new HashMap<>();
    Map<String, Object> response = new HashMap<>();

    // création de la liste des champs à retourner par la requête
    List<String> fields = new ArrayList<String>();
    if (include != null)
      fields = Arrays.asList(include.toLowerCase().replaceAll(" ", "").split(","));

    // ajout du champ créateur
    if (fields.isEmpty() || fields.contains("createur")) {
      // recherche du créateur de la réponse dans la base
      User createur = userRepository.findById(answer.getCreateur().getId())
          .orElseThrow(() -> new AppException(404, "Impossible de trouver le créateur"));
      user1.put("id", createur.getId());
      user1.put("prenom", createur.getPrenom());
      user1.put("nom", createur.getNom());
      user1.put("role", createur.getRole());
      response.put("createur", user1);
    }

    // ajout du champ gestionnaire
    if (fields.isEmpty() || fields.contains("gestionnaire")) {
      // recherche du gestionnaire courant dans la base
      User gestionnaire = userRepository.findById(answer.getGestionnaire().getId())
          .orElseThrow(() -> new AppException(404, "Impossible de trouver le gestionnaire"));
      user2.put("id", gestionnaire.getId());
      user2.put("prenom", gestionnaire.getPrenom());
      user2.put("nom", gestionnaire.getNom());
      user2.put("role", gestionnaire.getRole());
      response.put("gestionnaire", user2);
    }

    // ajout du champ locked
    if (fields.isEmpty() || fields.contains("lock")) {
      if (answer.getLock() != null) {
        // recherche de l'utilisateur courant dans la base
        LockedAnswer lockedAnswer = lockedAnswerRepository.findByAnswer(answer)
            .orElseThrow(
                () -> new AppException(404, "Impossible de trouver l'enregistrement de vérouillage recherché"));
        response.put("lock", lockedAnswer);
      } else
        response.put("lock", null);

    }

    // ajout du champ formulaire
    if (fields.isEmpty() || fields.contains("formulaire")) {
      // recherche du formulaire dans la base
      Form formulaire = formRepository.findById(answer.getFormulaire().getId())
          .orElseThrow(() -> new AppException(404, "Impossible de trouver le formulaire"));
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
    if (fields.isEmpty() || fields.contains("statut"))
      response.put("statut", answer.getStatut());
    if (fields.isEmpty() || fields.contains("demande"))
      response.put("demande", answer.getDemande());
    if (fields.isEmpty() || fields.contains("opportunite"))
      response.put("opportunite", answer.getOpportunite());
    if (fields.isEmpty() || fields.contains("version"))
      response.put("version", answer.getVersion());
    if (fields.isEmpty() || fields.contains("courante"))
      response.put("courante", answer.getCourante());
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
   * Energistrement d'une nouvelle réponse
   * 
   * @param request
   * @param userDetails
   * @return
   * @throws AppException
   */
  public Answer saveAnswer(AnswerRequest request, UserDetails userDetails)
      throws AppException {
    // récupération des informations sur l'utilisateur connecté
    User createur = userRepository.findByLogin(userDetails.getUsername())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver l'utilisateur connecté'"));
    // récupération du formulaire
    Form formulaire = formRepository.findById(request.getFormulaire())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le formulaire"));
    // création de la nouvelle entrée
    Answer answer = Answer.builder()
        .uuid(UUID.randomUUID().toString())
        .reponse(request.getReponse().trim())
        .formulaire(formulaire)
        .createur(createur)
        .gestionnaire(createur)
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

    // Mise à jour de la demande
    Optional.ofNullable(request.getDemande())
        .ifPresent(res -> {
          answer.setDemande(res);
        });
    // Mise à jour de l'opportunité
    Optional.ofNullable(request.getOpportunite())
        .ifPresent(res -> {
          answer.setOpportunite(res);
        });
    // Mise à jour du statut
    Optional.ofNullable(request.getStatut())
        .ifPresent(res -> {
          answer.setStatut(res);
        });
    // récupération des informations sur l'utilisateur connecté
    User user = userRepository.findByLogin(userDetails.getUsername())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver l'utilisateur connecté'"));
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
          .demande(answer.getDemande())
          .opportunite(answer.getOpportunite())
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
