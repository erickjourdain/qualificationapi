package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.dto.UserDto;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.response.UsersResponse;
import lne.intra.formsapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository repository;

  public UserDto getUser(Integer id) throws AppException {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    return UserDto.builder()
        .id(user.getId())
        .nom(user.getNom())
        .prenom(user.getPrenom())
        .role(user.getRole())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .build();
  }

  public UsersResponse getAllUsers(Pageable paging) {
    Page<User> users = repository.findAll(paging);
    List<UserDto> userDtos = new ArrayList<>();

    for (User user : users) {
      userDtos.add(UserDto.builder()
          .id(user.getId())
          .nom(user.getNom())
          .prenom(user.getPrenom())
          .role(user.getRole())
          .createdAt(user.getCreatedAt())
          .updatedAt(user.getUpdatedAt())
          .build());
    }
    var usersResponse = UsersResponse.builder()
        .nombreUsers(users.getTotalElements())
        .data(userDtos)
        .page(paging.getPageNumber()+1)
        .size(paging.getPageSize())
        .hasPrevious(users.hasPrevious())
        .hasNext(users.hasNext())
        .build();

    return usersResponse;
  }

  public UsersResponse getfindBySearchCriteria(Specification<User> spec, Pageable paging) {
    Page<User> users = repository.findAll(spec, paging);
    List<UserDto> userDtos = new ArrayList<>();

    for (User user : users) {
      userDtos.add(UserDto.builder()
          .nom(user.getNom())
          .prenom(user.getPrenom())
          .role(user.getRole())
          .build());
    }
    var usersResponse = UsersResponse.builder()
        .nombreUsers(users.getTotalElements())
        .data(userDtos)
        .page(paging.getPageNumber() + 1)
        .size(paging.getPageSize())
        .hasPrevious(users.hasPrevious())
        .hasNext(users.hasNext())
        .build();

    return usersResponse;
  }
  
  public UserDto setAdmin(Integer id) {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setRole(Role.ADMIN);
    repository.save(user);
    return UserDto.builder()
        .id(user.getId())
        .nom(user.getNom())
        .prenom(user.getPrenom())
        .role(user.getRole())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .build();
  }

  public UserDto getByLogin(String login) {
    User user = repository.findByLogin(login)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    return UserDto.builder()
        .id(user.getId())
        .nom(user.getNom())
        .prenom(user.getPrenom())
        .role(user.getRole())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .build();
  }

}
