package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.UserRequest;
import lne.intra.formsapi.model.response.UsersResponse;
import lne.intra.formsapi.repository.UserRepository;
import lne.intra.formsapi.util.ObjectsValidator;
import lne.intra.formsapi.util.Slugify;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;
  private final ObjectsValidator<UserRequest> registerRequestValidator;

  public Map<String, Object> getUser(Integer id) throws AppException {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));

    Map<String, Object> response = new HashMap<>();

    response.put("id", user.getId());
    response.put("prenom", user.getPrenom());
    response.put("nom", user.getNom());
    response.put("role", user.getRole());
    response.put("valide", user.getValidated());
    response.put("bloque", user.getLocked());
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
      response.put("valide", user.getValidated());
      response.put("bloque", user.getLocked());
      response.put("slug", user.getSlug());
      response.put("createdAt", user.getCreatedAt());
      response.put("updatedAt", user.getUpdatedAt());

      dataResponse.add(response);
    }
    var response = UsersResponse.builder()
        .nombreUsers(users.getTotalElements())
        .data(dataResponse)
        .page(paging.getPageNumber() + 1)
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
      response.put("valide", user.getValidated());
      response.put("bloque", user.getLocked());
      response.put("slug", user.getSlug());
      response.put("createdAt", user.getCreatedAt());
      response.put("updatedAt", user.getUpdatedAt());

      dataResponse.add(response);
    }
    var response = UsersResponse.builder()
        .nombreUsers(users.getTotalElements())
        .data(dataResponse)
        .page(paging.getPageNumber() + 1)
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
    response.put("valide", user.getValidated());
    response.put("bloque", user.getLocked());
    response.put("slug", user.getSlug());
    response.put("createdAt", user.getCreatedAt());
    response.put("updatedAt", user.getUpdatedAt());

    return response;
  }

  public Map<String, Object> getByLogin(String login) {
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

  /**
   * Enregistrement des nouveaux utilisateurs
   * 
   * @param request RegisterRequest requête de création
   * @return Utilisateur réponse contenant le token de connexion
   */
  public Map<String, Object> register(UserRequest request) {
    // validation des champs fournis dans la requête
    registerRequestValidator.validate(request);
    final Slugify slug = Slugify.builder().build();
    // création du nouvel utilisatuer avec les données fournies
    var user = User.builder()
        .prenom(request.getPrenom())
        .nom(request.getNom())
        .login(request.getLogin())
        .password(passwordEncoder.encode(request.getPassword()))
        .slug(slug.slugify(request.getPrenom().trim()+" "+request.getNom().trim()))
        .role(Role.READER)
        .build();
    // sauvegarde de l'utilisateur
    var savedUser = repository.save(user);
    // réponse avec les données de l'utilisateur
    return getUser(savedUser.getId());
  }

  public Map<String, Object> update(Integer id, UserRequest request) throws AppException {
    // vérification de l'existance de l'utilisateur à modifier
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    // Mise à jour des données
    Optional.ofNullable(request.getNom())
        .ifPresent(res -> {
          user.setNom(res);
        });
    Optional.ofNullable(request.getPrenom())
        .ifPresent(res -> {
          user.setPrenom(res);
        });
    Optional.ofNullable(request.getRole())
        .ifPresent(res -> {
          user.setRole(res);
        });
    Optional.ofNullable(request.getRole())
        .ifPresent(res -> {
          user.setRole(res);
        });
    repository.save(user);
    // réponse avec les données de l'utilisateur
    return getUser(user.getId());
  }

  public Map<String, Object> validate(Integer id) throws AppException {
    // vérification de l'existance de l'utilisateur à modifier
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setValidated(true);
    repository.save(user);
    // réponse avec les données de l'utilisateur
    return getUser(user.getId());
  }

  public Map<String, Object> lock(Integer id) throws AppException {
    // vérification de l'existance de l'utilisateur à modifier
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setLocked(true);
    repository.save(user);
    // réponse avec les données de l'utilisateur
    return getUser(user.getId());
  }

}
