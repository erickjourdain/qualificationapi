package lne.intra.formsapi.controller;

import java.util.Map;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.converter.FilterSpecification;

import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.response.UsersResponse;
import lne.intra.formsapi.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/data/users")
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequiredArgsConstructor
public class UsersController {
  
  private final UserService service;

  @GetMapping
  @PreAuthorize("hasAuthority('admin:read')")
  public ResponseEntity<UsersResponse> search(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy,
      FilterSpecification<User> filter) throws NotFoundException {

    Pageable paging = PageRequest.of(page - 1, size);
    return ResponseEntity.ok(service.search(filter, paging));
  }
  
  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('admin:read')")
  public ResponseEntity<Map<String, Object>> getUser(
      @PathVariable Integer id) throws NotFoundException {
    return ResponseEntity.ok(service.getUser(id));
  }

  @GetMapping("/me")
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<Map<String, Object>> getMe(@AuthenticationPrincipal UserDetails userDetails) {
    return ResponseEntity.ok(service.getByLogin(userDetails.getUsername()));
  }

  @PatchMapping("setAdmin/{id}")
  @PreAuthorize("hasAuthority('admin:update')")
  public ResponseEntity<Map<String, Object>> setAdmin(
      @PathVariable Integer id)throws NotFoundException
  {
    return ResponseEntity.ok(service.setAdmin(id));
  }

}
