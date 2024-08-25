package lne.intra.formsapi.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
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

  public InputStreamResource getReport() throws FileNotFoundException {
    String dir = System.getProperty("user.dir") + "/" + lneIntraFormsapiUpload + "/reports";
    File file = new File(dir + "/rapport.docx");
    return new InputStreamResource(new FileInputStream(file));
    //Path path = Paths.get(file);
    //return new UrlResource(path.toUri());
  }
}
