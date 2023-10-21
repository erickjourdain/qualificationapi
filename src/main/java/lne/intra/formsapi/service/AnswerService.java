package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Answer;
import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.AnswerRequest;
import lne.intra.formsapi.model.response.AnswersResponse;
import lne.intra.formsapi.repository.AnswerRepository;
import lne.intra.formsapi.repository.FormRepository;
import lne.intra.formsapi.repository.UserRepository;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnswerService {

  private final AnswerRepository answerRepository;
  private final UserRepository userRepository;
  private final FormRepository formRepository;
  private final ObjectsValidator<AnswerRequest> answerValidator;

  private Map<String, Object> addUserFormToAnswer(Answer answer, String include) throws AppException {
    // recherche du créateur de la réponse dans la base
    User createur = userRepository.findById(answer.getCreateur().getId())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le créateur"));
    // recherche du formulaire dans la base
    Form formulaire = formRepository.findById(answer.getFormulaire().getId())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le formulaire"));

    Map<String, Object> user = new HashMap<>();
    Map<String, Object> form = new HashMap<>();
    Map<String, Object> response = new HashMap<>();

    // création de la liste des champs à retourner par la requête
    List<String> fields = new ArrayList<String>();
    if (include != null)
      fields = Arrays.asList(include.toLowerCase().replaceAll(" ", "").split(","));

    // ajout du champ créateur
    if (fields.isEmpty() || fields.contains("createur")) {
      user.put("id", createur.getId());
      user.put("prenom", createur.getPrenom());
      user.put("nom", createur.getNom());
      user.put("role", createur.getRole());
    }

    // ajout du champ formulaire
    if (fields.isEmpty() || fields.contains("formulaire")) {
      form.put("id", formulaire.getId());
      form.put("titre", formulaire.getTitre());
      form.put("version", formulaire.getVersion());
      form.put("valide", formulaire.getValide());
      form.put("slug", formulaire.getSlug());
    }

    // ajout des différents champs à retourner en fonction de la demande exposée
    // dans la requêtes d'interrogation
    if (fields.isEmpty() || fields.contains("id"))
      response.put("id", answer.getId());
    if (fields.isEmpty() || fields.contains("formulaire"))
      response.put("formulaire", form);
    if (fields.isEmpty() || fields.contains("reponse"))
      response.put("reponse", answer.getReponse());
    if (fields.isEmpty() || fields.contains("donnees"))
      response.put("donnees", answer.getDonnees());
    if (fields.isEmpty() || fields.contains("createur"))
      response.put("createur", user);
    if (fields.isEmpty() || fields.contains("statut"))
      response.put("statut", answer.getStatut());
    if (fields.isEmpty() || fields.contains("demande"))
      response.put("demande", answer.getDemande());
    if (fields.isEmpty() || fields.contains("opportunite"))
      response.put("opportunite", answer.getOpportunite());
    if (fields.isEmpty() || fields.contains("createdat"))
      response.put("createdAt", answer.getCreatedAt());
    if (fields.isEmpty() || fields.contains("updatedat"))
      response.put("updatedAt", answer.getUpdatedAt());

    return response;
  }

  public Map<String, Object> getAnswer(Integer id, String include) throws AppException {
    Answer answer = answerRepository.findById(id)
        .orElseThrow(() -> new AppException(400, "La réponse n'existe pas"));
    return addUserFormToAnswer(answer, include);
  }

  public Map<String, Object> saveAnswer(AnswerRequest request, String include, UserDetails userDetails)
      throws AppException {
    // validation des champs fournis dans la requête
    answerValidator.validateData(request, ObjectCreate.class);
    // récupération des informations sur l'utilisateur connecté
    User createur = userRepository.findByLogin(userDetails.getUsername())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver l'utilisateur connecté'"));
    // récupération du formulaire
    Form formulaire = formRepository.findById(request.getFormulaire())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le formulaire"));
    // création de la nouvelle entrée
    Answer answer = Answer.builder()
        .reponse(request.getReponse().trim())
        .donnees(request.getDonnees().trim())
        .formulaire(formulaire)
        .createur(createur)
        .build();
    // sauvegarde de la nouvelle entrée
    Answer newAnswer = answerRepository.save(answer);
    return getAnswer(newAnswer.getId(), include);
  }

  public AnswersResponse search(@Filter Specification<Answer> spec, Pageable paging, String include) {
    // Récupération des formulaires
    Page<Answer> answers = answerRepository.findAll(spec, paging);
    List<Map<String, Object>> AnswersWithCreateur = new ArrayList<>();

    // boucle sur les formulaires pour ajout du créateur
    for (Answer answer : answers) {
      AnswersWithCreateur.add(addUserFormToAnswer(answer, include));
    }
    var response = AnswersResponse.builder()
        .nombreReponses(answers.getTotalElements()) // nombre de formulaires totales
        .data(AnswersWithCreateur) // les réponses
        .page(paging.getPageNumber() + 1) // le numéro de la page retournée
        .size(paging.getPageSize()) // le nombre d'éléments retournées
        .hasPrevious(answers.hasPrevious()) // existe-t-il une page précédente
        .hasNext(answers.hasNext()) // existe-t-il une page suivante
        .build();

    return response;
  }

}
