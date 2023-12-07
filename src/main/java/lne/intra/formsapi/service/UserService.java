package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.Arrays;
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

  private Map<String, Object> defineResponse(User user, String include) {
    Map<String, Object> response = new HashMap<>();

    // création de la liste des champs à retourner par la requête
    List<String> fields = new ArrayList<String>();
    if (include != null)
      fields = Arrays.asList(include.toLowerCase().replaceAll(" ", "").split(","));
    
    // ajout des différents champs à retourner en fonction de la demande exposée
    // dans la requêtes d'interrogation
    if (fields.isEmpty() || fields.contains("id"))
      response.put("id", user.getId());
    if (fields.isEmpty() || fields.contains("prenom"))
      response.put("prenom", user.getPrenom());
    if (fields.isEmpty() || fields.contains("nom"))
      response.put("nom", user.getNom());
    if (fields.isEmpty() || fields.contains("login"))
      response.put("login", user.getLogin());
    if (fields.isEmpty() || fields.contains("role"))
      response.put("role", user.getRole());
    if (fields.isEmpty() || fields.contains("valide"))
      response.put("valide", user.getValidated());
    if (fields.isEmpty() || fields.contains("bloque"))
      response.put("bloque", user.getLocked());
    if (fields.isEmpty() || fields.contains("slug"))
      response.put("slug", user.getSlug());
    if (fields.isEmpty() || fields.contains("createdAt"))
      response.put("createdAt", user.getCreatedAt());
    if (fields.isEmpty() || fields.contains("updatedAt"))
      response.put("updatedAt", user.getUpdatedAt());

    return response;
  }

  /**
   * Get user by its id
   * @param id
   * @param include
   * @return
   * @throws AppException
   */
  public Map<String, Object> getUser(Integer id, String include) throws AppException {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    return defineResponse(user, include);
  }

  /**
   * Recherche d'utilisateur à partir des données de filtrage
   * @param spec    filtre
   * @param paging  numéro de la page
   * @param include liste des champs à inclure dans la réponse
   * @return
   */
  public UsersResponse search(@Filter Specification<User> spec, Pageable paging, String include) {
    Page<User> users = repository.findAll(spec, paging);
    List<Map<String, Object>> dataResponse = new ArrayList<>();
  
    for (User user : users) {
      dataResponse.add(defineResponse(user, include));
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
  
  /**
   * Accorder le rôle d'administrateur à un utilisateur
   * @param id      id de l'utilisateur
   * @param include champs à inclure dans la réponse
   * @return
   */
  public Map<String, Object> setAdmin(Integer id, String include) {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setRole(Role.ADMIN);
    repository.save(user);
    return defineResponse(user, include);
  }
  
  /**
   * Get utilisateur via son login
   * @param login
   * @param include champs à inclure dans la réponse
   * @return
   */
  public Map<String, Object> getByLogin(String login, String include) {
    User user = repository.findByLogin(login)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    return defineResponse(user, include);
  }
  
  /**
   * Enregistrement d'un nouvel utilisateur
   * @param request RegisterRequest requête de création
   * @param include champs à inclure dans la réponse
   * @return Utilisateur réponse contenant le token de connexion
   */
  public Map<String, Object> register(UserRequest request, String include) {
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
    return getUser(savedUser.getId(), include);
  }

  /**
   * Mise à jour des données d'un utilisateur
   * @param id
   * @param request
   * @param include champs à inclure dans la réponse
   * @return
   * @throws AppException
   */
  public Map<String, Object> update(Integer id, UserRequest request, String include) throws AppException {
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
    Optional.ofNullable(request.getValide())
        .ifPresent(res -> {
          user.setValidated(res);
        });
    Optional.ofNullable(request.getBloque())
        .ifPresent(res -> {
          user.setLocked(res);;
        });
    repository.save(user);
    // réponse avec les données de l'utilisateur
    return getUser(user.getId(), include);
  }

  /**
   * Valider le profil d'un utilisateur 
   * @param id
   * @param include
   * @return
   * @throws AppException
   */
  public Map<String, Object> validate(Integer id, String include) throws AppException {
    // vérification de l'existance de l'utilisateur à modifier
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setValidated(true);
    repository.save(user);
    // réponse avec les données de l'utilisateur
    return getUser(user.getId(), include);
  }

  /**
   * Bloquer le profil d'un utilisateur
   * @param id
   * @param include
   * @return
   * @throws AppException
   */
  public Map<String, Object> lock(Integer id, String include) throws AppException {
    // vérification de l'existance de l'utilisateur à modifier
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setLocked(true);
    repository.save(user);
    // réponse avec les données de l'utilisateur
    return getUser(user.getId(), include);
  }

}
