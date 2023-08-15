package lne.intra.formsapi.service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
  
  @Autowired
  private Environment env;

  /**
   * Extraction du nom de l'utilisateur
   * 
   * @param token String le token
   * @return String le nom de l'utilisateur
   */
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  /**
   * Extraction d'un élément du token
   * 
   * @param token          String le token
   * @param claimsResolver la fonction d'extraction
   * @return valeur du paramètre extrait
   */
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  /**
   * Génération d'un token à partir des informations de l'utilisateur
   * 
   * @param userDetails les informations de l'utilisateur
   * @return String le token généré
   */
  public String generateToken(UserDetails userDetails) {
    return generateToken(new HashMap<>(), userDetails);
  }

  /**
   * Génération d'un token à partir des informations de l'utilisateur courant
   * et d'informations complémentaires
   * 
   * @param extraClaims Map<String, Object> Map des informations complémentaires à
   *                    ajouter au token
   * @param userDetails les informations de l'utilisateur
   * @return String le token généré
   */
  public String generateToken(
      Map<String, Object> extraClaims,
      UserDetails userDetails) {
    return Jwts
        .builder()
        .setClaims(extraClaims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  /**
   * Etxraction des revendications du token
   * 
   * @param token String le token
   * @return les reveendications du token
   */
  private Claims extractAllClaims(String token) {
    return Jwts
        .parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  /**
   * Extraction de la date d'expiration du token
   * 
   * @param token le token
   * @return Date la date d'expiration du token
   */
  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  /**
   * Vérification de la validité du token
   * 
   * @param token       String le token
   * @param userDetails UserDetails l'utilisateur connecté
   * @return Boolean état du token
   */
  public boolean isTokenValid(String token, UserDetails userDetails) {
    // extraction de l'identifiant de l'utilisateur présent dans le token
    final String username = extractUsername(token);
    // vérification de la correspondande de l'utilisateur et de la date d'expiration
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  /**
   * Vérification de la date d'expiration du token
   * 
   * @param token String le token
   * @return Boolean état du token
   */
  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  /**
   * Définition de la Clef de signature des tokens
   * 
   * @return la clef de signature du token
   */
  private Key getSigningKey() {
    byte[] keyBytes = Decoders.BASE64.decode(env.getProperty("lne.intra.formsapi.secretkey"));
    return Keys.hmacShaKeyFor(keyBytes);
  }
}