package lne.intra.formsapi.controller;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.exception.AppException;
import lne.intra.formsapi.service.FileService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/reports")
@PreAuthorize("hasAnyRole('ADMIN','CREATOR', 'USER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "reports endpoint")
public class ReportController {

  private final FileService fileService;

  /**
   * Contrôleur de sauvegarde du fichier Rapport.docx
   * 
   * @param file
   * @return ResponseEntity 
   * @throws AppException
   * @throws IllegalStateException
   * @throws IOException
   */
  @Operation(summary = "Chargement d'un fichier rapport", description = "Accès limité aux rôle `ADMIN` et `CREATOR`")
  @ApiResponse(responseCode = "200", description = "Fichier sauvegardé", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "400", description = "Opération non réalisée", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PatchMapping("/upload")
  @PreAuthorize("hasAnyAuthority('admin:update','creator:upddate')")
  public ResponseEntity<Map<String, Object>> upload(
    @RequestParam MultipartFile file
  ) throws AppException, IllegalStateException, IOException {

    Map<String, Object> response = new HashMap<>();

    fileService.save(file);
    response.put("status", true);
    response.put("message", "fichier eneregistré");
    return ResponseEntity.ok(response);
  }

  /**
   * Contrôleur de récupération du fichier Rapport.docx
   * 
   * @return
   * @throws AppException
   * @throws MalformedURLException
   */
  @Operation(summary = "Téléchargement du fichier rapport", description = "Accès limité aux rôle `ADMIN`, `CREATOR` et 'USER'")
  @ApiResponse(responseCode = "200", description = "Fichier Rapport", content = @Content(mediaType = "application/octet-stream"))
  @ApiResponse(responseCode = "400", description = "Erreur lors du téléchargement", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @GetMapping("")
  @PreAuthorize("hasAnyAuthority('admin:read','creator:read','user:read')")
  public ResponseEntity<Resource> getReport() throws AppException, MalformedURLException {
    
    return ResponseEntity.ok()
      .header(HttpHeaders.CONTENT_DISPOSITION, 
        "attachement; filename=\"rapport.docx\"")
        .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
        .body(fileService.getReport());
  }
}
