package lne.intra.formsapi.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import lne.intra.formsapi.model.exception.AppException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {
  
  @Value("${lne.intra.formsapi.upload}")
  private String lneIntraFormsapiUpload;
  private String fileSeparator;

  @PostConstruct
  private void init() {
    fileSeparator = System.getProperty("file.separator");
  }

  /**
   * Enregistrement du fichier dans le répertoire de stockage des rapports
   * 
   * @param file - MultipartFile le fichier à energistré
   * @throws AppException
   * @throws IllegalStateException
   * @throws IOException
   */
  public void save(MultipartFile file) throws AppException, IllegalStateException, IOException {
    System.out.println(fileSeparator);
    String dir = System.getProperty("user.dir") + fileSeparator + lneIntraFormsapiUpload + fileSeparator + "reports";
    file.transferTo(new File(dir + fileSeparator + "rapport.docx"));
  }

  /**
   * Récupération du fichier demandé
   * 
   * @return Resource - Decripteur du fichier sélectionné
   * @throws MalformedURLException
   */
  public Resource getReport() throws MalformedURLException {
    String dir = System.getProperty("user.dir") + fileSeparator + lneIntraFormsapiUpload + fileSeparator + "reports";
    String file = dir + fileSeparator + "rapport.docx";
    Path path = Paths.get(file);
    return new UrlResource(path.toUri());
  }
}
