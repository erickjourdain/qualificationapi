package lne.intra.formsapi.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lne.intra.formsapi.model.dto.SearchCriteriaDto;
import lne.intra.formsapi.model.dto.SearchDto;
import lne.intra.formsapi.model.dto.UserDto;
import lne.intra.formsapi.model.response.UsersResponse;
import lne.intra.formsapi.service.UserService;
import lne.intra.formsapi.util.UserSpecificationBuilder;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/data/users")
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
@RequiredArgsConstructor
public class UsersController {
  
  private final UserService service;

  @GetMapping()
  @PreAuthorize("hasAuthority('admin:read')")
  public ResponseEntity<UsersResponse> getAllUsers(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy) throws NotFoundException {

    Pageable paging = PageRequest.of(page-1, size);
    return ResponseEntity.ok(service.getAllUsers(paging));
  }
  
  @GetMapping("/search")
  @PreAuthorize("hasAuthority('admin:read')")
  public ResponseEntity<UsersResponse> getUsersBySearchCriteria(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "id") String sortBy,
      @RequestBody SearchDto searchDto) throws NotFoundException {

    UserSpecificationBuilder builder = new UserSpecificationBuilder();
    List<SearchCriteriaDto> criteriaList = searchDto.getSearchCriteriaList();
    if (criteriaList != null) {
      criteriaList.forEach(x -> {
        x.setDataOption(searchDto.getDataOption());
        builder.with(x);
      });
    }

    Pageable paging = PageRequest.of(page-1, size);
    return ResponseEntity.ok(service.getfindBySearchCriteria(builder.build(), paging));
  }
  
  @GetMapping("/{id}")
  @PreAuthorize("hasAuthority('admin:read')")
  public ResponseEntity<UserDto> getUser(
      @PathVariable Integer id) throws NotFoundException {
    return ResponseEntity.ok(service.getUser(id));
  }

  @GetMapping("/me")
  @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
  public ResponseEntity<UserDto> getMe(@AuthenticationPrincipal UserDetails userDetails) {
    return ResponseEntity.ok(service.getByLogin(userDetails.getUsername()));
  }

  @PatchMapping("setAdmin/{id}")
  @PreAuthorize("hasAuthority('admin:update')")
  public ResponseEntity<UserDto> setAdmin(
      @PathVariable Integer id)throws NotFoundException
  {
    return ResponseEntity.ok(service.setAdmin(id));
  }

}
