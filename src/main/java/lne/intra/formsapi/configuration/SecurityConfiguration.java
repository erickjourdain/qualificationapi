package lne.intra.formsapi.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import static lne.intra.formsapi.model.Permission.*;
import static lne.intra.formsapi.model.Role.*;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

  private final JwtAuthentificationFilter jwtAuthFilter;
  private final AuthenticationProvider authenticationProvider;
  private final LogoutHandler logoutHandler;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(authorize -> authorize
            /*
            .requestMatchers("/api/v1/data/forms/**").hasAnyRole(ADMIN.name(), USER.name())
            .requestMatchers(HttpMethod.GET, "/api/v1/data/forms/**").hasAnyAuthority(ADMIN_READ.name(), USER_READ.name())
            .requestMatchers(HttpMethod.POST, "/api/v1/data/forms/**").hasAnyAuthority(ADMIN_CREATE.name(), USER_CREATE.name())
            .requestMatchers(HttpMethod.PUT, "/api/v1/data/forms/**").hasAnyAuthority(ADMIN_UPDATE.name(), USER_UPDATE.name())
            .requestMatchers(HttpMethod.DELETE, "/api/v1/data/forms/**")
            .hasAnyAuthority(ADMIN_DELETE.name(), USER_DELETE.name())
            */
            /*
            .requestMatchers("/api/v1/data/users/**").hasRole(ADMIN.name())
            .requestMatchers(HttpMethod.GET, "/api/v1/data/users/**").hasAuthority(ADMIN_READ.name())
            .requestMatchers(HttpMethod.POST, "/api/v1/data/users/**").hasAuthority(ADMIN_CREATE.name())
            .requestMatchers(HttpMethod.PUT, "/api/v1/data/users/**").hasAuthority(ADMIN_UPDATE.name())
            .requestMatchers(HttpMethod.DELETE, "/api/v1/data/users/**").hasAuthority(ADMIN_DELETE.name())
            */
            .anyRequest().permitAll())

        .sessionManagement((session) -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
        .logout(logout -> logout
            .logoutUrl("/api/v1/auth/logout")
            .addLogoutHandler(logoutHandler)
            .logoutSuccessHandler(
                (request, response, authentication) -> SecurityContextHolder.clearContext()));
    return http.build();
  }
}
