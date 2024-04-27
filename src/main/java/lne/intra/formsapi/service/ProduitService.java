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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.turkraft.springfilter.boot.Filter;

import lne.intra.formsapi.model.Header;
import lne.intra.formsapi.model.Produit;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.ProduitRequest;
import lne.intra.formsapi.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProduitService {

  private final ProduitRepository produitRepository;
  private final UserService userService;
  private final HeaderService headerService;

  public Map<String, Object> addFieldsToProduit(Produit produit, String include)
      throws AppException {
    Map<String, Object> user = new HashMap<>();
    Map<String, Object> opp = new HashMap<>();
    Map<String, Object> response = new HashMap<>();

    // création de la liste des champs à retourner par la requête
    List<String> fields = new ArrayList<String>();
    if (include != null)
      fields = Arrays.asList(include.toLowerCase().replaceAll(" ", "").split(","));

    // ajout du champ créateur
    if (fields.isEmpty() || fields.contains("createur")) {
      // recherche du créateur de la réponse dans la base
      User createur = userService.getUser(produit.getCreateur().getId());
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
      User gestionnaire = userService.getUser(produit.getGestionnaire().getId());
      user.clear();
      user.put("id", gestionnaire.getId());
      user.put("prenom", gestionnaire.getPrenom());
      user.put("nom", gestionnaire.getNom());
      // user.put("role", gestionnaire.getRole());
      response.put("gestionnaire", user);
    }

    // ajout du champ opportunité
    if (fields.isEmpty() || fields.contains("opportunite")) {
      // recherche de l'opportunité associée au produit
      Header header = headerService.getHeader(produit.getHeader().getId());
      opp.clear();
      opp.put("id", header.getId());
      opp.put("societe", header.getSociete());
      opp.put("opportunite", header.getOpportunite());
      opp.put("projet", header.getProjet());
      response.put("header", header);
    }

    // ajout des différents champs à retourner en fonction de la demande exposée
    // dans la requêtes d'interrogation
    if (fields.isEmpty() || fields.contains("id"))
      response.put("id", produit.getId());
    if (fields.isEmpty() || fields.contains("description"))
      response.put("description", produit.getDescription());
    if (fields.isEmpty() || fields.contains("createdat"))
      response.put("createdAt", produit.getCreatedAt());
    if (fields.isEmpty() || fields.contains("updatedat"))
      response.put("updatedAt", produit.getUpdatedAt());

    return response;
  }

  /**
   * Recherche d'un produit en fonction de son id
   * 
   * @param id
   * @return
   * @throws AppException
   */
  public Produit geProduit(Integer id) throws AppException {
    Produit produit = produitRepository.findById(id)
        .orElseThrow(() -> new AppException(400, "Le produit n'existe pas"));
    return produit;
  }

  /**
   * Enregistrement d'une nouvelle entete
   * 
   * @param request
   * @param userDetails
   * @return
   * @throws AppException
   */
  public Produit saveProduit(ProduitRequest request, UserDetails userDetails)
      throws AppException {
    // récupération des informations sur l'utilisateur connecté
    User createur = userService.getByLogin(userDetails.getUsername());
    // récupération du header
    Header header = headerService.getHeader(request.getHeader());
    // création de la nouvelle entrée
    Produit produit = Produit.builder()
        .description(request.getDescription())
        .header(header)
        .createur(createur)
        .gestionnaire(createur)
        .build();
    // sauvegarde de la nouvelle entrée
    return produitRepository.save(produit);
  }

  /**
   * Mise à jour du produit
   * 
   * @param id
   * @param request
   * @param userDetails
   * @return
   * @throws AppException
   */
  public Produit updateProduit(Integer id, ProduitRequest request, UserDetails userDetails)
      throws AppException {
    // récupération de l'entité à modifier
    Produit produit = produitRepository.findById(id)
        .orElseThrow(() -> new AppException(404, "Impossible de trouver l'entity à modifier"));
    // mise à jour de la description
    Optional.ofNullable(request.getDescription())
        .ifPresent(res -> {
          produit.setDescription(res);
        });
    // mise à jour de l'opportunité
    Optional.ofNullable(request.getHeader())
        .ifPresent(res -> {
          Header header = headerService.getHeader(res);
          produit.setHeader(header);
        });
    // mise à jour de l'entité
    return produitRepository.save(produit);
  }

  /**
   * Recherche d'entités
   * 
   * @param spec
   * @param paging
   * @return
   */
  public Page<Produit> search(@Filter Specification<Produit> spec, Pageable paging) {
    // récupération des produits
    return produitRepository.findAll(spec, paging);
  }
}
