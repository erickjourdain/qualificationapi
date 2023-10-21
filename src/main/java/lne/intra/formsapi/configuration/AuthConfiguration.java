package lne.intra.formsapi.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import lne.intra.formsapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AuthConfiguration {

  private final UserRepository repository;

  /**
   * Retourne l'utilisateur à partir de son login
   * 
   * @return UserDetailsService l'utilisateur via son login
   */
  @Bean
  UserDetailsService userDetailsService() {
    return username -> repository.findByLogin(username)
        .orElseThrow(() -> new UsernameNotFoundException("Utilisateur inconnu"));
  }

  /**
   * Définition des méthodes d'authentification de l'application
   * 
   * @return AuthenticationProvider l'authentification provider
   */
  @Bean
  AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService());
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  /**
   * Définition de l'authentification manager de l'application
   * 
   * @param config AuthenticationConfiguration paramètre de configuration de
   *               l'authentification
   * @return AuthenticationManager l'authenfication manager
   * @throws Exception
   */
  @Bean
  AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }

  /**
   * Définition du service d'encodage du mot de passe
   * 
   * @return PasswordEncoder le service d'encodage du mot de passe
   */
  @Bean
  PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
