package lne.intra.formsapi.controller;

import java.util.Map;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.converter.FilterSpecification;

import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.FormRequest;
import lne.intra.formsapi.model.response.FormsResponse;
import lne.intra.formsapi.service.FormService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/data/forms")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
public class FormController {

  private final FormService service;

  @PostMapping()
  @PreAuthorize("hasAuthority('admin:create')")
  public ResponseEntity<Map<String, Object>> save(
      @RequestBody FormRequest request) throws AppException {
    if (service.existingValidForm(request.getTitre())) {
      throw new AppException(400, "Une formulaire valide avec ce titre existe dans la base de données");
    }
    return ResponseEntity.ok(service.saveForm(request));
  }

  @PatchMapping("/{id}")
  @PreAuthorize("hasAuthority('admin:update')")
  public ResponseEntity<Map<String, Object>> update(
      @PathVariable Integer id,
      @RequestBody FormRequest request) throws NotFoundException {
    return ResponseEntity.ok(service.partialUpdateForm(id, request));
  }

  @GetMapping
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<FormsResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy,
      FilterSpecification<Form> filter) throws NotFoundException {

    Pageable paging = PageRequest.of(page - 1, size);
    return ResponseEntity.ok(service.search(filter, paging));
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<Map<String, Object>> getForm(
      @PathVariable Integer id) throws NotFoundException {
    return ResponseEntity.ok(service.getForm(id));
  }
}
