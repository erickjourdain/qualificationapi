package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Header;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.HeaderRequest;
import lne.intra.formsapi.repository.HeaderRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HeaderService {

  private final HeaderRepository headerRepository;
  private final UserService userService;

  public Map<String, Object> addFieldsToHeader(Header header, String include)
      throws AppException {
    Map<String, Object> user = new HashMap<>();
    Map<String, Object> response = new HashMap<>();

    // création de la liste des champs à retourner par la requête
    List<String> fields = new ArrayList<String>();
    if (include != null)
      fields = Arrays.asList(include.toLowerCase().replaceAll(" ", "").split(","));

    // ajout du champ créateur
    if (fields.isEmpty() || fields.contains("createur")) {
      // recherche du créateur de la réponse dans la base
      User createur = userService.getUser(header.getCreateur().getId());
      user.clear();
      user.put("id", createur.getId());
      user.put("prenom", createur.getPrenom());
      user.put("nom", createur.getNom());
      // user.put("role", createur.getRole());
      response.put("createur", user);
    }

    // ajout du champ gestionnaire
    if (fields.isEmpty() || fields.contains("gestionnaire")) {
      // recherche du gestionnaire courant dans la base
      User gestionnaire = userService.getUser(header.getGestionnaire().getId());
      user.clear();
      user.put("id", gestionnaire.getId());
      user.put("prenom", gestionnaire.getPrenom());
      user.put("nom", gestionnaire.getNom());
      // user.put("role", gestionnaire.getRole());
      response.put("gestionnaire", user);
    }

    // ajout des différents champs à retourner en fonction de la demande exposée
    // dans la requêtes d'interrogation
    if (fields.isEmpty() || fields.contains("id"))
      response.put("id", header.getId());
    if (fields.isEmpty() || fields.contains("uuid"))
      response.put("uuid", header.getUuid());
    if (fields.isEmpty() || fields.contains("societe"))
      response.put("societe", header.getSociete());
    if (fields.isEmpty() || fields.contains("email"))
      response.put("email", header.getEmail());
    if (fields.isEmpty() || fields.contains("telephone"))
      response.put("telephone", header.getTelephone());
    if (fields.isEmpty() || fields.contains("nom"))
      response.put("nom", header.getNom());
    if (fields.isEmpty() || fields.contains("prenom"))
      response.put("prenom", header.getPrenom());
    if (fields.isEmpty() || fields.contains("opportunite"))
      response.put("opportunite", header.getOpportunite());
    if (fields.isEmpty() || fields.contains("projet"))
      response.put("projet", header.getProjet());
    if (fields.isEmpty() || fields.contains("createdat"))
      response.put("createdAt", header.getCreatedAt());
    if (fields.isEmpty() || fields.contains("updatedat"))
      response.put("updatedAt", header.getUpdatedAt());

    return response;
  }

  /**
   * Recherche d'une entete en fonction de son id
   * 
   * @param id
   * @return
   * @throws AppException
   */
  public Header getHeader(Integer id) throws AppException {
    Header header = headerRepository.findById(id)
        .orElseThrow(() -> new AppException(400, "L'entete n'existe pas"));
    return header;
  }

  /**
   * Enregistrement d'une nouvelle entete
   * 
   * @param request
   * @param userDetails
   * @return
   * @throws AppException
   */
  public Header saveHeader(HeaderRequest request, UserDetails userDetails)
      throws AppException {
    // récupération des informations sur l'utilisateur connecté
    User createur = userService.getByLogin(userDetails.getUsername());
    // création de la nouvelle entrée
    Header header = Header.builder()
        .uuid(UUID.randomUUID().toString())
        .societe(request.getSociete())
        .email(request.getEmail().toLowerCase())
        .telephone(request.getTelephone())
        .nom(request.getNom().toUpperCase())
        .prenom(request.getPrenom().toLowerCase())
        .opportunite(request.getOpportunite().toUpperCase())
        .projet(request.getProjet().toUpperCase())
        .createur(createur)
        .gestionnaire(createur)
        .build();
    // sauvegarde de la nouvelle entrée
    return headerRepository.save(header);
  }

  /**
   * Mise à jour de l'entete
   * 
   * @param id
   * @param request
   * @param userDetails
   * @return
   * @throws AppException
   */
  public Header updatHeader(Integer id, HeaderRequest request, UserDetails userDetails)
      throws AppException {
    // récupération de l'entité à modifier
    Header header = headerRepository.findById(id)
        .orElseThrow(() -> new AppException(404, "Impossible de trouver l'entete à modifier"));
    // Mise à jour de l'opportunité
    Optional.ofNullable(request.getOpportunite())
        .ifPresent(res -> {
          header.setOpportunite(res);
        });
    // Mise à jour du projet
    Optional.ofNullable(request.getProjet())
        .ifPresent(res -> {
          header.setProjet(res);
        }); 
    // Mise à jour de la societe
    Optional.ofNullable(request.getSociete())
        .ifPresent(res -> {
          header.setSociete(res);
        });
    // Mise à jour de la telephone
    Optional.ofNullable(request.getTelephone())
        .ifPresent(res -> {
          header.setTelephone(res);
        });
    // Mise à jour du nom
    Optional.ofNullable(request.getNom())
        .ifPresent(res -> {
          header.setNom(res);
        });
    // Mise à jour du prenom
    Optional.ofNullable(request.getPrenom())
        .ifPresent(res -> {
          header.setPrenom(res);
        });
    // mise à jour de l'entete
    return headerRepository.save(header);
  }

  /**
   * Recherche d'entités
   * 
   * @param spec
   * @param paging
   * @return
   */
  public Page<Header> search(@Filter Specification<Header> spec, Pageable paging) {
    // Récupération des entetes
    return headerRepository.findAll(spec, paging);
  }

}
