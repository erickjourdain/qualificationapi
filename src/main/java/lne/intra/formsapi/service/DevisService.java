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

import lne.intra.formsapi.model.Devis;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.request.DevisRequest;
import lne.intra.formsapi.repository.DevisRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DevisService {

  private final DevisRepository devisRepository;
  private final UserService userService;

  public Map<String, Object> addFieldsToDevis(Devis devis, String include) throws AppException {

    Map<String, Object> response = new HashMap<>();

    // création de la liste des champs à retourner par la requête
    List<String> fields = new ArrayList<String>();
    if (include != null)
      fields = Arrays.asList(include.toLowerCase().replaceAll(" ", "").split(","));

    // ajout des différents champs à retourner en fonction de la demande exposée
    // dans la requêtes d'interrogation
    if (fields.isEmpty() || fields.contains("id"))
      response.put("id", devis.getId());
    if (fields.isEmpty() || fields.contains("reference"))
      response.put("reference", devis.getReference());
    if (fields.isEmpty() || fields.contains("answer"))
      response.put("answer", devis.getAnswer());
    if (fields.isEmpty() || fields.contains("createdAt"))
      response.put("createdAt", devis.getCreatedAt());

    return response;
  }

  /**
   * Recherche d'un devis en fonction de son id
   * 
   * @param id
   * @return Devis
   * @throws AppException
   */
  public Devis getDevis(Integer id) throws AppException {
    Devis devis = devisRepository.findById(id)
        .orElseThrow(() -> new AppException(404, "Le devis n'existe pas"));
    return devis;
  }

  /**
   * Enregistrement d'un nouveau devis
   * 
   * @param request
   * @return Devis
   * @throws AppException
   */
  public Devis saveDevis(DevisRequest request, UserDetails userDetails) 
  throws AppException {
    // récupération des informations sur l'utilisateur connecté
    User createur = userService.getByLogin(userDetails.getUsername());
    // création de la nouvelle entrée
    Devis devis = Devis.builder()
        .reference(request.getReference())
        .answer(request.getAnswer())
        .createur(createur)
        .build();
    // sauvegarde de la nouvelle entrée
    return devisRepository.save(devis);
  }

  /**
   * Recherche d'une liste de devis
   * 
   * @param spec
   * @param paging
   * @return
   */
  public Page<Devis> search(@Filter Specification<Devis> spec, Pageable paging) {
    return devisRepository.findAll(spec, paging);
  }

  /**
   * Recherche d'un devis via sa référence
   */
  public Optional<Devis> getByRef(String reference) {
    return devisRepository.findByReference(reference);
  }
}
