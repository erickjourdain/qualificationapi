package lne.intra.formsapi.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

  private final Path fileStorageLocation;

  /**
   * Constructeur de la classe
   * 
   * @param env <Environment> Objet représentant les variables d'environnement de l'application
   */
  public FileStorageService(Environment env) {
    this.fileStorageLocation = Paths.get(env.getProperty("lne.intra.formsapi.upload-dir"))
        .toAbsolutePath().normalize();

    try {
      Files.createDirectories(this.fileStorageLocation);
    } catch (Exception ex) {
      throw new RuntimeException("Impossible de créer le répertoire de stockage des fichiers", ex);
    }
  }
  
  /**
   * Extraction de l'extension du fichier à enregistrer
   * 
   * @param fileName <String> nom du fichier à enregistrer
   * @return
   */
  private String getFileExtension(String fileName) {
    if (fileName == null) {
      return null;
    }

    String[] fileNameParts = fileName.split("\\.");

    return fileNameParts[fileNameParts.length - 1];
  }

  /**
   * Energistrement du fichier
   * 
   * @param file <Multipart> fichier à sauvegarder intégré dans une requête de type Multipart
   * @return le nom du fichier enregistré
   */
  public String storeFile(MultipartFile file) {
    // Normalize file name
    String fileName = new Date().getTime() + "-file." + getFileExtension(file.getOriginalFilename());

    try {
      // Check if the filename contains invalid characters
      if (fileName.contains("..")) {
        throw new RuntimeException(
            "Sorry! Filename contains invalid path sequence " + fileName);
      }

      Path targetLocation = this.fileStorageLocation.resolve(fileName);
      Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

      return fileName;
    } catch (IOException ex) {
      throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
    }
  }
  
  /**
   * Suppression d'un fichier
   * 
   * @param fileName <String> nom du fichier à supprimer
   * @return Boolean
   */
  public Boolean deleteFile(String fileName) {
    try {
      // Check if the filename contains invalid characters
      if (fileName.contains("..")) {
        throw new RuntimeException(
            "Sorry! Filename contains invalid path sequence " + fileName);
      }

      Path targetLocation = this.fileStorageLocation.resolve(fileName);
      Files.delete(targetLocation);

      return true;
    } catch (IOException ex) {
      throw new RuntimeException("Could not delete file " + fileName + ". Please try again!", ex);
    }
  }
}
