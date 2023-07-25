package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.dto.FormDto;
import lne.intra.formsapi.model.dto.UserDto;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.FormRequest;
import lne.intra.formsapi.model.response.FormsResponse;
import lne.intra.formsapi.repository.FormRepository;
import lne.intra.formsapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FormService {

  private final UserRepository userRepository;
  private final FormRepository repository;
  private final ObjectsValidator<FormRequest> formValidator;

  private FormDto addUserToForm(Form form) throws AppException {
    User createur = userRepository.findById(form.getCreateur().getId())
      .orElseThrow(() -> new AppException(400, "Createur non trouvé"));

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
        .version(form.getVersion())
        .valide(form.getValide())
        .createdAt(form.getCreatedAt())
        .createur(createurDto)
        .updatedAt(form.getUpdatedAt())
        .build();

    return formDto;
  }

  public FormDto saveForm(FormRequest request) throws AppException {
    // validation des chaps fournis dans la requête
    formValidator.validate(request);
    // récupération du créateur
    var createur = userRepository.findById(request.getCreateur())
        .orElseThrow(() -> new AppException(400, "Impossible de trouver le créateur"));
    // création de la nouvelle entrée
    var form = Form.builder()
        .titre(request.getTitre())
        .formulaire(request.getFormulaire())
        .createur(createur)
        .build();
    // sauvegarde de la nouvelle entrée
    var newFrom = repository.save(form);
    return getForm(newFrom.getId());
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
        .build();

    return formsResponse;
  }

  public FormsResponse findBySearchCriteria(Specification<Form> spec, Pageable paging) throws NotFoundException {
    Page<Form> forms = repository.findAll(spec, paging);
    List<FormDto> formsDto = new ArrayList<>();

    for (Form form : forms) {
      formsDto.add(addUserToForm(form));
    }
    var formsResponse = FormsResponse.builder()
        .nombreFormulaires(forms.getTotalElements())
        .data(formsDto)
        .page(paging.getPageNumber()+1)
        .size(paging.getPageSize())
        .build();

    return formsResponse;
  }

  public Boolean existingValidForm(String titre) {
    Integer nbForms = repository.findValidVersionByTitre(titre);
    return nbForms > 0;
  }

}
