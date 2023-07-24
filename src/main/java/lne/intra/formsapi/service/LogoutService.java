package lne.intra.formsapi.service;

import java.util.Date;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import lne.intra.formsapi.repository.TokenRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
  
  private final TokenRepository tokenRepository;


  @Override
  public void logout(
      HttpServletRequest request,
      HttpServletResponse response,
      Authentication authentication
  ) {
      // extraction des données d'autorisation de l'entête de la requête
      final String authHeader = request.getHeader("Authorization");
      final String jwt;

      // si pas d'autorisation de type Bearer retour direct
      if (authHeader == null || !authHeader.startsWith("Bearer ")) {
        return;
      }
      // extraction du token
      jwt = authHeader.substring(7);
      // récupération du token dans la base de données
      var storedToken = tokenRepository.findByToken(jwt)
          .orElse(null);
      // annulation des éléments de validation du token et mise à jour dans la BDD
      if (storedToken != null) {
        storedToken.setExpired(true);
        storedToken.setRevoked(true);
        storedToken.setUpdatedAt(new Date());
        tokenRepository.save(storedToken);
      }
  }
  
}
