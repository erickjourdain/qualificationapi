package lne.intra.formsapi.service;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lne.intra.formsapi.model.Token;
import lne.intra.formsapi.model.TokenType;
import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.request.AuthenticationRequest;
import lne.intra.formsapi.model.response.AuthenticationResponse;
import lne.intra.formsapi.repository.TokenRepository;
import lne.intra.formsapi.repository.UserRepository;
import lne.intra.formsapi.util.ObjectsValidator;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthentificationService {

  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final ObjectsValidator<AuthenticationRequest> authenticationRequest;

  /**
   * Authentification d'un utilisateur via son login / mot de passe
   * 
   * @param request AuthenticationRequest requête d'authentification
   * @return AuthenticationResponse réponse contenant le token de connexion
   */
  public AuthenticationResponse authenticate(AuthenticationRequest request) {
    // validation des champs fournis dans la requête
    authenticationRequest.validate(request);
    // authentification de l'utilisateur
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.getLogin().toLowerCase(),
            request.getPassword()));
    // récupération de l'utilisateur via son login
    var user = repository.findByLogin(request.getLogin())
        .orElseThrow(() -> new UsernameNotFoundException("Utilisateur inconnu"));
    // vérification droit de connexion
    if (!user.isEnabled()) 
      throw new AccessDeniedException("Le compte n'est pas validé. Veuillez contacter un administrateur.");
    if (!user.isAccountNonLocked()) 
      throw new AccessDeniedException("Le compte est vérouillé. Veuillez contacter un administrateur.");
    // création du token
    var jwtToken = jwtService.generateToken(user);
    // sauvegarde du token
    saveUserToken(user, jwtToken);
    // définition et retour de la réponse avec le token généré
    return AuthenticationResponse
        .builder()
        .token(jwtToken)
        .build();
  }

  /**
   * Enregistrement du token généré
   * 
   * @param user User l'utilisateur connecté
   * @param jwtToken String le token généré lors de la connexion
   */
  private void saveUserToken(User user, String jwtToken) {
    // création du nouveau token
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType(TokenType.BEARER)
        .expired(false)
        .revoked(false)
        .build();
    // suppression des tokens actifs pour l'utilisateur courant
    revokeAllUserTokens(user);
    // sauveagrde du nouveau token
    tokenRepository.save(token);
  }

  /**
   * Suppression de tous les tokens valides
   * 
   * @param user User l'utilisateur connecté
   */
  private void revokeAllUserTokens(User user) {
    // recherche des tokens actifs
    var validUserTokens = tokenRepository.findAllTokensByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    // mise à jour des tokens actifs
    validUserTokens.forEach(t -> {
      t.setExpired(true);
      t.setRevoked(true);
    });
    // sauvegarde des tokens mis à jour
    tokenRepository.saveAll(validUserTokens);
  }

}