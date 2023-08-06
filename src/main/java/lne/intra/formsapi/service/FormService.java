package lne.intra.formsapi.service;

import java.util.ArrayList;
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

  private Map<String, Object> addUserToForm(Form form) throws AppException {
    User createur = userRepository.findById(form.getCreateur().getId())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le créateur"));

    Map<String, Object> user = new HashMap<>();
    Map<String, Object> response = new HashMap<>();
    
    user.put("id", createur.getId());
    user.put("prenom", createur.getPrenom());
    user.put("nom", createur.getNom());
    user.put("role", createur.getRole());

    response.put("id", form.getId());
    response.put("titre", form.getTitre());
    response.put("description", form.getDescription());
    response.put("version", form.getVersion());
    response.put("valide", form.getValide());
    response.put("slug", form.getSlug());
    response.put("createur", user);
    response.put("createdAt", form.getCreatedAt());
    response.put("updatedAt", form.getUpdatedAt());

    return response;
  }

  public Map<String, Object> saveForm(FormRequest request) throws AppException {
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
        .slug(slug.slugify(request.getTitre().trim() + "v" + 1))
        .build();
    // sauvegarde de la nouvelle entrée
    Form newForm = repository.save(form);
    return getForm(newForm.getId());
  }

  public Map<String, Object> partialUpdateForm(Integer id, FormRequest request) throws AppException {
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
          form.setSlug(slug.slugify(res + "v" + form.getVersion()));
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
              .slug(slug.slugify(form.getTitre() + "v" + form.getVersion() + 1))
              .createur(form.getCreateur())
              .build();
          newId.add(repository.save(newForm).getId());
        });
    // mise à jour du formulaire
    repository.save(form);
    return getForm(newId.size() > 0 ? newId.get(0) : id);
  }

  public Map<String, Object> getForm(Integer id) throws AppException {
    Form form = repository.findById(id)
        .orElseThrow(() -> new AppException(400, "Le formuaire n'existe pas"));
    return addUserToForm(form);
  }

  public FormsResponse getAllForms(Pageable paging) throws NotFoundException {
    Page<Form> forms = repository.findAll(paging);
    List<Map<String, Object>> formsWithCreateur = new ArrayList<>();

    for (Form form : forms) {
      formsWithCreateur.add(addUserToForm(form));
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

  public FormsResponse search(@Filter Specification<Form> spec, Pageable paging) {
    Page<Form> forms = repository.findAll(spec, paging);
    List<Map<String, Object>> formsWithCreateur = new ArrayList<>();

    for (Form form : forms) {
      formsWithCreateur.add(addUserToForm(form));
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
