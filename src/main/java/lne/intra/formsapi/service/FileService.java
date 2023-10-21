package lne.intra.formsapi.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import lne.intra.formsapi.model.File;
import lne.intra.formsapi.model.Role;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.model.response.UploadResponse;
import lne.intra.formsapi.repository.FileRepository;
import lne.intra.formsapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {

  private final FileRepository repository;
  private final UserRepository userRepository;

  /**
   * Sauvegarde d'un fichier dans la base
   * 
   * @param fileName    <String> nom du fichier à supprimer
   * @param initialName <String> nom du fichier original
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @return objet représentant le fichier sauvegardé <UploadResponse>
   * @throws AppException
   */
  public UploadResponse saveFile(String fileName, String initialName, UserDetails userDetails) throws AppException {
    // recherche de l'utilisateur courant
    User proprietaire = userRepository.findByLogin(userDetails.getUsername())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le proprietaire"));
    // création du fichier
    File file = File.builder()
        .fileName(fileName)
        .initialName(initialName)
        .proprietaire(proprietaire)
        .build();
    // sauvegarde du fichier dans la base
    File newFile = repository.save(file);
    // création de la réponse
    var response = UploadResponse.builder()
        .id(newFile.getId())
        .initialName(newFile.getInitialName())
        .confirmed(newFile.getConfirmed())
        .createdAt(newFile.getCreatedAt())
        .updatedAt(newFile.getCreatedAt())
        .build();
    // retour de la réponse
    return response;
  }

  /**
   * Suppresion d'un fichier à partir de son id
   * 
   * @param id          <Interger> identifiant du fichier
   * @param userDetails <UserDetails>
   * @return le fichier supprimé <File>
   */
  public File deleteFile(Integer id, UserDetails userDetails) {
    // recherche du fichier dans la base
    File file = repository.findById(id)
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le fichier recherché"));
    // recherche du propriétaire du fichier
    User user = userRepository.findByLogin(userDetails.getUsername())
        .orElseThrow(() -> new AppException(404, "Impossible de trouver le proprietaire"));
    // vérification que l'utilisateur courant est le propriétaire ou un
    // administrateur
    if (file.getProprietaire().getId() != user.getId() && user.getRole() != Role.ADMIN) {
      throw new AppException(403, "Vous ne disposez pas des droits nécessaire pour réaliser cette opération");
    }
    // vérification que le fichier n'est pas confirmé
    if (file.getConfirmed()) {
      throw new AppException(403, "Le fichier est utilisé, il ne peut être supprimé");
    }
    // suppression de l'entrée dans la base
    repository.deleteById(id);
    // retour du fichier
    return file;
  }
}
