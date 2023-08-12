package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.FormRequest;
import lne.intra.formsapi.model.response.FormsResponse;
import lne.intra.formsapi.repository.FormRepository;
import lne.intra.formsapi.repository.UserRepository;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectUpdate;
import lne.intra.formsapi.util.ObjectsValidator;
import lne.intra.formsapi.util.Slugify;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FormService {

  private final UserRepository userRepository;
  private final FormRepository repository;
  private final ObjectsValidator<FormRequest> formValidator;

  private Map<String, Object> addUserToForm(Form form, String include) throws AppException {
    User createur = userRepository.findById(form.getCreateur().getId())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le créateur"));

    Map<String, Object> user = new HashMap<>();
    Map<String, Object> response = new HashMap<>();
    
    List<String> fields = new ArrayList<String>();
    if (include != "") Arrays.asList(include.toLowerCase().split(","));

    if (fields.isEmpty() || fields.contains("createur")) {
      user.put("id", createur.getId());
      user.put("prenom", createur.getPrenom());
      user.put("nom", createur.getNom());
      user.put("role", createur.getRole());
    }

    if (fields.isEmpty() || fields.contains("id")) response.put("id", form.getId());
    if (fields.isEmpty() || fields.contains("titre")) response.put("titre", form.getTitre());
    if (fields.isEmpty() || fields.contains("description")) response.put("description", form.getDescription());
    if (fields.isEmpty() || fields.contains("formulaire")) response.put("formulaire", form.getFormulaire());
    if (fields.isEmpty() || fields.contains("version")) response.put("version", form.getVersion());
    if (fields.isEmpty() || fields.contains("valide")) response.put("valide", form.getValide());
    if (fields.isEmpty() || fields.contains("slug")) response.put("slug", form.getSlug());
    if (fields.isEmpty() || fields.contains("createur")) response.put("createur", user);
    if (fields.isEmpty() || fields.contains("createdAt")) response.put("createdAt", form.getCreatedAt());
    if (fields.isEmpty() || fields.contains("updatedAt")) response.put("updatedAt", form.getUpdatedAt());

    return response;
  }

  public Map<String, Object> saveForm(FormRequest request, String include) throws AppException {
    final Slugify slug = Slugify.builder().build();
    // validation des champs fournis dans la requête
    formValidator.validateForm(request, ObjectCreate.class);
    // récupération du créateur
    User createur = userRepository.findById(request.getCreateur())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le créateur"));
    // création de la nouvelle entrée
    Form form = Form.builder()
        .titre(request.getTitre().trim())
        .formulaire(request.getFormulaire().trim())
        .description((request.getDescription() != null) ? request.getDescription().trim() : null)
        .createur(createur)
        .slug(slug.slugify(request.getTitre().trim() + " v1"))
        .build();
    // sauvegarde de la nouvelle entrée
    Form newForm = repository.save(form);
    return getForm(newForm.getId(), include);
  }

  public Map<String, Object> partialUpdateForm(Integer id, FormRequest request, String include) throws AppException {
    final Slugify slug = Slugify.builder().build();
    // validation des champs fournis dans la requête
    formValidator.validateForm(request, ObjectUpdate.class);
    // récupération du formulaire à mettre à jour
    Form form = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "Le formulaire à mettre à jour n'existe pas"));
    List<Integer> newId = new ArrayList<>();
    Optional.ofNullable(request.getTitre())
        .ifPresent(res -> {
          form.setTitre(res);
          form.setSlug(slug.slugify(res + " v" + form.getVersion()));
        });
    Optional.ofNullable(request.getDescription())
        .ifPresent(res -> form.setDescription(res));
    Optional.ofNullable(request.getCreateur())
        .ifPresent(res -> {
          var createur = userRepository.findById(request.getCreateur())
              .orElseThrow(() -> new AppException(404, "Impossible de trouver le créateur"));
          form.setCreateur(createur);
        });
    Optional.ofNullable(request.getFormulaire())
        .ifPresent(res -> {
          form.setValide(false);
          Form newForm = Form.builder()
              .titre(form.getTitre())
              .description(form.getDescription())
              .formulaire(res)
              .version(form.getVersion() + 1)
              .slug(slug.slugify(form.getTitre() + " v" + form.getVersion() + 1))
              .createur(form.getCreateur())
              .build();
          newId.add(repository.save(newForm).getId());
        });
    // mise à jour du formulaire
    repository.save(form);
    return getForm(newId.size() > 0 ? newId.get(0) : id, include);
  }

  public Map<String, Object> getForm(Integer id, String include) throws AppException {
    Form form = repository.findById(id)
        .orElseThrow(() -> new AppException(400, "Le formuaire n'existe pas"));
    return addUserToForm(form, include);
  }

  public Map<String, Object> getFormBySlug(String slug, String include) throws AppException {
    Form form = repository.findBySlug(slug)
        .orElseThrow(() -> new AppException(400, "Le formuaire n'existe pas"));
    return addUserToForm(form, include);
  }

  public FormsResponse getAllForms(Pageable paging, String include) throws NotFoundException {
    Page<Form> forms = repository.findAll(paging);
    List<Map<String, Object>> formsWithCreateur = new ArrayList<>();

    for (Form form : forms) {
      formsWithCreateur.add(addUserToForm(form, include));
    }
    var response = FormsResponse.builder()
        .nombreFormulaires(forms.getTotalElements())
        .data(formsWithCreateur)
        .page(paging.getPageNumber() + 1)
        .size(paging.getPageSize())
        .hasPrevious(forms.hasPrevious())
        .hasNext(forms.hasNext())
        .build();

    return response;
  }

  public FormsResponse search(@Filter Specification<Form> spec, Pageable paging, String include) {
    Page<Form> forms = repository.findAll(spec, paging);
    List<Map<String, Object>> formsWithCreateur = new ArrayList<>();

    for (Form form : forms) {
      formsWithCreateur.add(addUserToForm(form, include));
    }
    var response = FormsResponse.builder()
        .nombreFormulaires(forms.getTotalElements())
        .data(formsWithCreateur)
        .page(paging.getPageNumber() + 1)
        .size(paging.getPageSize())
        .hasPrevious(forms.hasPrevious())
        .hasNext(forms.hasNext())
        .build();

    return response;

  }

  public Boolean existingValidForm(String titre) {
    Integer nbForms = repository.findValidVersionByTitre(titre);
    return nbForms > 0;
  }

}
