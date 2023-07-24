package lne.intra.formsapi.controller;

import java.util.List;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lne.intra.formsapi.model.dto.FormDto;
import lne.intra.formsapi.model.dto.FormSearchDto;
import lne.intra.formsapi.model.dto.SearchCriteriaDto;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.FormRequest;
import lne.intra.formsapi.model.response.FormsResponse;
import lne.intra.formsapi.service.FormService;
import lne.intra.formsapi.service.FormSpecificationBuilder;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/data")
@RequiredArgsConstructor
public class FormController {

  private final FormService service;

  @PostMapping("/forms")
  public ResponseEntity<FormDto> save(
      @RequestBody FormRequest request) throws AppException {
    if (service.existingValidForm(request.getTitre())) {
      throw new AppException(400, "Une formulaire valide avec ce titre existe dans la base de données");
    }
    request.setTitre(request.getTitre().trim());
    request.setDescription(request.getDescription().trim());
    return ResponseEntity.ok(service.saveForm(request));
  }

  @GetMapping("/forms")
  public ResponseEntity<FormsResponse> getAllForms(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy) throws NotFoundException {

    Pageable paging = PageRequest.of(page, size);
    return ResponseEntity.ok(service.getAllForms(paging));
  }
  
  @GetMapping("/forms/search")
  public ResponseEntity<FormsResponse> getFormsBySearchCriteria(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestBody FormSearchDto formSearchDto) throws NotFoundException {

    FormSpecificationBuilder builder = new FormSpecificationBuilder();
    List<SearchCriteriaDto> criteriaList = formSearchDto.getSearchCriteriaList();
    if (criteriaList != null) {
      criteriaList.forEach(x -> {
        x.setDataOption(formSearchDto.getDataOption());
        builder.with(x);
      });
    }

    Pageable paging = PageRequest.of(page-1, size);
    return ResponseEntity.ok(service.findBySearchCriteria(builder.build(), paging));
  }
  
  @GetMapping("/forms/{id}")
  public ResponseEntity<FormDto> getForm(
      @PathVariable Integer id) throws NotFoundException {
    return ResponseEntity.ok(service.getForm(id));
  }
}
