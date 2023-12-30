package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.FormRequest;
import lne.intra.formsapi.repository.FormRepository;
import lne.intra.formsapi.util.Slugify;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FormService {

  private final UserService userService;
  private final FormRepository repository;

  /**
   * Définition des champs à retourner et ajout du créateur du formulaire
   * 
   * @param form    <Form> formulaire à mettre à jour
   * @param include <String> chaine de caractère avec les champs à retourner
   * @return Liste des champs du formulaire à retourner
   * @throws AppException
   */
  public Map<String, Object> addUserToForm(Form form, String include) throws AppException {
    // recherche du créateur du formulaire dans la base
    User createur = userService.getUser(form.getCreateur().getId());

    Map<String, Object> user = new HashMap<>();
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

    // ajout des différents champs à retourner en fonction de la demande exposée
    // dans la requêtes d'interrogation
    if (fields.isEmpty() || fields.contains("id"))
      response.put("id", form.getId());
    if (fields.isEmpty() || fields.contains("titre"))
      response.put("titre", form.getTitre());
    if (fields.isEmpty() || fields.contains("description"))
      response.put("description", form.getDescription());
    if (fields.isEmpty() || fields.contains("formulaire"))
      response.put("formulaire", form.getFormulaire());
    if (fields.isEmpty() || fields.contains("version"))
      response.put("version", form.getVersion());
    if (fields.isEmpty() || fields.contains("valide"))
      response.put("valide", form.getValide());
    if (fields.isEmpty() || fields.contains("slug"))
      response.put("slug", form.getSlug());
    if (fields.isEmpty() || fields.contains("createur"))
      response.put("createur", user);
    if (fields.isEmpty() || fields.contains("createdat"))
      response.put("createdAt", form.getCreatedAt());
    if (fields.isEmpty() || fields.contains("updatedat"))
      response.put("updatedAt", form.getUpdatedAt());

    return response;
  }

  /**
   * Création d'un nouveau formulaire dans la base de données
   * 
   * @param request     <Request> la requête de création
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @return Liste des champs du formulaire à retourner
   * @throws AppException
   */
  public Form saveForm(FormRequest request, UserDetails userDetails)
      throws AppException {
    final Slugify slug = Slugify.builder().build();
    // récupération des informations sur l'utilisateur connecté
    User createur = userService.getByLogin(userDetails.getUsername());
    // création de la nouvelle entrée
    Form form = Form.builder()
        .titre(request.getTitre().trim())
        .formulaire(request.getFormulaire())
        .description((request.getDescription() != null) ? request.getDescription().trim() : null)
        .createur(createur)
        .slug(slug.slugify(request.getTitre().trim() + " v1"))
        .build();
    return repository.save(form);
  }

  /**
   * Mise à jour partielle d'un formulaire
   * 
   * @param id          <Integer> l'id du formulaire à mettre à jour
   * @param request     <Request> la requête de mise à jour
   * @param include     <String> chaine de caractère avec les champs à retourner
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @return Liste des champs du formulaire à retourner
   * @throws AppException
   */
  public Form partialUpdateForm(Integer id, FormRequest request, UserDetails userDetails)
      throws AppException {
    final Slugify slug = Slugify.builder().build();
    Form newForm = Form.builder().build();

    // récupération du formulaire à mettre à jour
    Form form = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "Le formulaire à mettre à jour n'existe pas"));
    // Mise à jour du titre
    Optional.ofNullable(request.getTitre())
        .ifPresent(res -> {
          form.setTitre(res);
          form.setSlug(slug.slugify(res + " v" + form.getVersion()));
        });
    // Mise à jour de la description
    Optional.ofNullable(request.getDescription())
        .ifPresent(res -> form.setDescription(res));
    // Mise à jour du créateur
    // récupération des informations sur l'utilisateur connecté
    User createur = userService.getByLogin(userDetails.getUsername());
    if (createur.getId() != form.getCreateur().getId())
      form.setCreateur(createur);
    // Mise à jour du formulaire Tripetto
    // Enregistrement d'une nouvelle entrée avec changement de version
    Optional.ofNullable(request.getFormulaire())
        .ifPresent(res -> form.setValide(false));
    if (!form.getValide()) {
      newForm = Form.builder()
          .titre(form.getTitre())
          .description(form.getDescription())
          .formulaire(request.getFormulaire())
          .version(form.getVersion() + 1)
          .slug(slug.slugify(form.getTitre() + " v" + form.getVersion() + 1))
          .createur(form.getCreateur())
          .build();
    }
    // sauvegarde du formulaire
    repository.save(form);
    // retour du formulaire mis à jour
    return (form.getValide()) ? form : repository.save(newForm);
  }

  /**
   * Récupération d'un formulaire à partir de son id
   * 
   * @param id      <Interger> identifiant du formulaire
   * @return Liste des champs du formulaire à retourner
   * @throws AppException
   */
  public Form getForm(Integer id) throws AppException {
    Form form = repository.findById(id)
        .orElseThrow(() -> new AppException(400, "Le formuaire n'existe pas"));
    return form;
  }

  /**
   * Récupération de tous les formulaires correspondant à un critère de recherche
   * 
   * @param spec    <Specification<Form>> les critères de recherche
   * @param paging  <Pageable> les informations de pagination (nb d'éléments, #
   *                page, tri)
   * @return <FormsResponse>
   */
  public Page<Form> search(@Filter Specification<Form> spec, Pageable paging) {
    // Récupération des formulaires
    return repository.findAll(spec, paging);
  }

  /**
   * Recherche d'un formulaire valide à partir de son titre
   * 
   * @param titre <String> le titre à rechercher
   * @return <Integer> nombre de formulaires trouvés
   */
  public Boolean existingValidForm(String titre) {
    Integer nbForms = repository.findValidVersionByTitre(titre);
    return nbForms > 0;
  }

}
