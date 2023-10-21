package lne.intra.formsapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lne.intra.formsapi.model.File;
import lne.intra.formsapi.model.response.UploadResponse;
import lne.intra.formsapi.service.FileService;
import lne.intra.formsapi.service.FileStorageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v${lne.intra.formsapi.api}/data/upload")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "upload endpoint")
public class FileUploadController {

  private final FileStorageService fileStorageService;
  private final FileService fileService;

  /**
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param file        <MultipartFile>
   * @return objet représentant le fichier sauvegardé <UploadResponse>
   */
  @Operation(summary = "Enregistrement d'un fichier", description = "Accès limité au rôle `ADMIN`")
  @ApiResponse(responseCode = "200", description = "Fichier enregistré", content = @Content(mediaType = "application/json"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @PostMapping()
  @PreAuthorize("hasAnyAuthority('admin:create','user:create')")
  public ResponseEntity<UploadResponse> uploadFile(
      @AuthenticationPrincipal UserDetails userDetails,
      @RequestParam(name = "file", required = true) MultipartFile file) {
    String fileName = fileStorageService.storeFile(file);
    UploadResponse fileData = fileService.saveFile(fileName, file.getOriginalFilename(), userDetails);

    return ResponseEntity.ok().body(fileData);
  }

  /**
   * 
   * @param userDetails <UserDetails> information sur l'utilisateur connecté
   * @param id          <Integer> l'identifiant du fichier à supprimer
   * @return            <Boolean>
   */
  @Operation(summary = "Suppression d'un fichier via son id", description = "Accès limité au rôle `ADMIN`")
  @ApiResponse(responseCode = "200", description = "Fichier supprimé", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "403", description = "Accès non autorisé ou token invalide", content = @Content(mediaType = "application/text"))
  @ApiResponse(responseCode = "404", description = "Fichier ou propriétaire inexistant dans la base", content = @Content(mediaType = "application/text"))
  @DeleteMapping()
  @PreAuthorize("hasAnyAuthority('admin:delete','user:delete')")
  public ResponseEntity<Boolean> deleteFile(
      @AuthenticationPrincipal UserDetails userDetails,
      @PathVariable Integer id
  ) {
    File file = fileService.deleteFile(id, userDetails);
    fileStorageService.deleteFile(file.getFileName());
    return ResponseEntity.ok().body(true);
  }
}
