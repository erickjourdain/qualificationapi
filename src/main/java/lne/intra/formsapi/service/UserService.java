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
import lne.intra.formsapi.repository.UserRepository;
import lne.intra.formsapi.util.Slugify;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository repository;
  private final PasswordEncoder passwordEncoder;

  public Map<String, Object> setUserResponse(User user, String include) {
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
   * @return
   * @throws AppException
   */
  public User getUser(Integer id) throws AppException {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    return user;
  }

  /**
   * Recherche d'utilisateur à partir des données de filtrage
   * @param spec    filtre
   * @param paging  numéro de la page
   * @return
   */
  public Page<User> search(@Filter Specification<User> spec, Pageable paging) {
    Page<User> users = repository.findAll(spec, paging);    
    return users;
  }
  
  /**
   * Accorder le rôle d'administrateur à un utilisateur
   * @param id      id de l'utilisateur
   * @return
   */
  public User setAdmin(Integer id) {
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setRole(Role.ADMIN);
    return repository.save(user);
  }
  
  /**
   * Get utilisateur via son login
   * @param login
   * @return
   */
  public User getByLogin(String login) {
    User user = repository.findByLogin(login)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    return user;
  }
  
  /**
   * Enregistrement d'un nouvel utilisateur
   * @param request RegisterRequest requête de création
   * @return Utilisateur réponse contenant le token de connexion
   */
  public User register(UserRequest request) {
    final Slugify slug = Slugify.builder().build();
    // création du nouvel utilisatuer avec les données fournies
    User user = User.builder()
        .prenom(request.getPrenom())
        .nom(request.getNom())
        .login(request.getLogin())
        .password(passwordEncoder.encode(request.getPassword()))
        .slug(slug.slugify(request.getPrenom().trim()+" "+request.getNom().trim()))
        .role(Role.READER)
        .build();
    // réponse avec les données de l'utilisateur
    return repository.save(user);
  }

  /**
   * Mise à jour des données d'un utilisateur
   * @param id
   * @param request
   * @return
   * @throws AppException
   */
  public User update(Integer id, UserRequest request) throws AppException {
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
          user.setLocked(res);
        });
    // réponse avec les données de l'utilisateur
    return repository.save(user);
  }

  /**
   * Valider le profil d'un utilisateur 
   * @param id
   * @return
   * @throws AppException
   */
  public User validate(Integer id) throws AppException {
    // vérification de l'existance de l'utilisateur à modifier
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setValidated(true);
    // réponse avec les données de l'utilisateur
    return repository.save(user);
  }

  /**
   * Bloquer le profil d'un utilisateur
   * @param id
   * @return
   * @throws AppException
   */
  public User lock(Integer id) throws AppException {
    // vérification de l'existance de l'utilisateur à modifier
    User user = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "L'utilisateur recherché n'existe pas"));
    user.setLocked(true);
    // réponse avec les données de l'utilisateur
    return repository.save(user);
  }

}
