package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.dto.FormDto;
import lne.intra.formsapi.model.dto.UserDto;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.FormRequest;
import lne.intra.formsapi.model.response.FormsResponse;
import lne.intra.formsapi.repository.FormRepository;
import lne.intra.formsapi.repository.UserRepository;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectUpdate;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FormService {

  private final UserRepository userRepository;
  private final FormRepository repository;
  private final ObjectsValidator<FormRequest> formValidator;

  private FormDto addUserToForm(Form form) throws AppException {
    User createur = userRepository.findById(form.getCreateur().getId())
      .orElseThrow(() -> new AppException(404, "Impossible de trouver le créateur"));

    UserDto createurDto = UserDto
        .builder()
        .id(createur.getId())
        .prenom(createur.getPrenom())
        .nom(createur.getNom())
        .role(createur.getRole())
        .createdAt(createur.getCreatedAt())
        .updatedAt(createur.getUpdatedAt())
        .build();
    FormDto formDto = FormDto
        .builder()
        .id(form.getId())
        .titre(form.getTitre())
        .description(form.getDescription())
        .formulaire(form.getFormulaire())
        .version(form.getVersion())
        .valide(form.getValide())
        .createdAt(form.getCreatedAt())
        .createur(createurDto)
        .updatedAt(form.getUpdatedAt())
        .build();

    return formDto;
  }

  public FormDto saveForm(FormRequest request) throws AppException {
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
        .build();
    // sauvegarde de la nouvelle entrée
    Form newForm = repository.save(form);
    return getForm(newForm.getId());
  }

  public FormDto partialUpdateForm(Integer id,FormRequest request) throws AppException {
    // validation des champs fournis dans la requête
    formValidator.validateForm(request, ObjectUpdate.class);
    // récupération du formulaire à mettre à jour
    Form form = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "Le formulaire à mettre à jour n'existe pas"));
    List<Integer> newId = new ArrayList<>();
    Optional.ofNullable(request.getTitre())
        .ifPresent(res -> form.setTitre(res));
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
              .createur(form.getCreateur())
              .build();
          newId.add(repository.save(newForm).getId());
        });
    // mise à jour du formulaire
    repository.save(form);
    return getForm(newId.size() > 0 ? newId.get(0) : id);
  }

  public FormDto getForm(Integer id) throws AppException {
    Form form = repository.findById(id)
        .orElseThrow(() -> new AppException(400, "Le formuaire n'existe pas"));
    return addUserToForm(form);
  }

  public FormsResponse getAllForms(Pageable paging) throws NotFoundException {
    Page<Form> forms = repository.findAll(paging);
    List<FormDto> formsDto = new ArrayList<>();

    for (Form form : forms) {
      formsDto.add(addUserToForm(form));
    }
    var formsResponse = FormsResponse.builder()
        .nombreFormulaires(forms.getTotalElements())
        .data(formsDto)
        .page(paging.getPageNumber()+1)
        .size(paging.getPageSize())
        .hasPrevious(forms.hasPrevious())
        .hasNext(forms.hasNext())
        .build();

    return formsResponse;
  }
  
  public FormsResponse search(@Filter Specification<Form> spec, Pageable paging) {
    Page<Form> forms = repository.findAll(spec, paging);
    List<FormDto> formsDto = new ArrayList<>();

    for (Form form : forms) {
      formsDto.add(addUserToForm(form));
    }
    var formsResponse = FormsResponse.builder()
        .nombreFormulaires(forms.getTotalElements())
        .data(formsDto)
        .page(paging.getPageNumber() + 1)
        .size(paging.getPageSize())
        .hasPrevious(forms.hasPrevious())
        .hasNext(forms.hasNext())
        .build();

    return formsResponse;
      
  }

  public Boolean existingValidForm(String titre) {
    Integer nbForms = repository.findValidVersionByTitre(titre);
    return nbForms > 0;
  }

}
