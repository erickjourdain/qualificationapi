package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.response.UsersResponse;
import lne.intra.formsapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository repository;

  public Map<String, Object> getUser(Integer id) throws AppException {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    
    Map<String, Object> response = new HashMap<>();

    response.put("id", user.getId());
    response.put("prenom", user.getPrenom());
    response.put("nom", user.getNom());
    response.put("role", user.getRole());
    response.put("slug", user.getSlug());
    response.put("createdAt", user.getCreatedAt());
    response.put("updatedAt", user.getUpdatedAt());

    return response;
  }

  public UsersResponse getAllUsers(Pageable paging) {
    Page<User> users = repository.findAll(paging);
    List<Map<String, Object>> dataResponse = new ArrayList<>();

    for (User user : users) {
      Map<String, Object> response = new HashMap<>();

      response.put("id", user.getId());
      response.put("prenom", user.getPrenom());
      response.put("nom", user.getNom());
      response.put("role", user.getRole());
      response.put("slug", user.getSlug());
      response.put("createdAt", user.getCreatedAt());
      response.put("updatedAt", user.getUpdatedAt());

      dataResponse.add(response);
    }
    var response = UsersResponse.builder()
        .nombreUsers(users.getTotalElements())
        .data(dataResponse)
        .page(paging.getPageNumber()+1)
        .size(paging.getPageSize())
        .hasPrevious(users.hasPrevious())
        .hasNext(users.hasNext())
        .build();

    return response;
  }

  public UsersResponse search(@Filter Specification<User> spec, Pageable paging) {
    Page<User> users = repository.findAll(spec, paging);
    List<Map<String, Object>> dataResponse = new ArrayList<>();

    for (User user : users) {
      Map<String, Object> response = new HashMap<>();

      response.put("id", user.getId());
      response.put("prenom", user.getPrenom());
      response.put("nom", user.getNom());
      response.put("role", user.getRole());
      response.put("slug", user.getSlug());
      response.put("createdAt", user.getCreatedAt());
      response.put("updatedAt", user.getUpdatedAt());

      dataResponse.add(response);
    }
    var response = UsersResponse.builder()
        .nombreUsers(users.getTotalElements())
        .data(dataResponse)
        .page(paging.getPageNumber()+1)
        .size(paging.getPageSize())
        .hasPrevious(users.hasPrevious())
        .hasNext(users.hasNext())
        .build();

    return response;
  }
  
  public Map<String, Object> setAdmin(Integer id) {
    
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setRole(Role.ADMIN);
    repository.save(user);
    
    Map<String, Object> response = new HashMap<>();

    response.put("id", user.getId());
    response.put("prenom", user.getPrenom());
    response.put("nom", user.getNom());
    response.put("role", user.getRole());
    response.put("slug", user.getSlug());
    response.put("createdAt", user.getCreatedAt());
    response.put("updatedAt", user.getUpdatedAt());

    return response;
  }

  public Map<String, Object>  getByLogin(String login) {
    User user = repository.findByLogin(login)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    
    Map<String, Object> response = new HashMap<>();

    response.put("id", user.getId());
    response.put("prenom", user.getPrenom());
    response.put("nom", user.getNom());
    response.put("role", user.getRole());
    response.put("slug", user.getSlug());
    response.put("createdAt", user.getCreatedAt());
    response.put("updatedAt", user.getUpdatedAt());

    return response;
  }

}
