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

import lne.intra.formsapi.model.exception.AppException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FileService {
  
  @Value("${lne.intra.formsapi.upload}")
  private String lneIntraFormsapiUpload;

  /**
   * Enregistrement du fichier dans le répertoire de stockage des rapports
   * 
   * @param file - MultipartFile le fichier à energistré
   * @throws AppException
   * @throws IllegalStateException
   * @throws IOException
   */
  public void save(MultipartFile file) throws AppException, IllegalStateException, IOException {
    String dir = System.getProperty("user.dir") + "/" + lneIntraFormsapiUpload + "/reports";
    file.transferTo(new File(dir + "/rapport.docx"));
  }

  public Resource getReport() throws MalformedURLException {
    String dir = System.getProperty("user.dir") + "/" + lneIntraFormsapiUpload + "/reports";
    String file = dir + "/rapport.docx";
    Path path = Paths.get(file);
    return new UrlResource(path.toUri());
  }
}
