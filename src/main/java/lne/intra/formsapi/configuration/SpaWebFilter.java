package lne.intra.formsapi.configuration;

import java.io.IOException;

//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SpaWebFilter extends OncePerRequestFilter{

  @SuppressWarnings("null")
  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
      FilterChain filterChain) throws ServletException, IOException {
    String path = request.getRequestURI();
    //Authentication user = SecurityContextHolder.getContext().getAuthentication();
    //System.out.println(user);
    //if (user != null && !path.startsWith("/api") && !path.contains(".") && path.matches("/(.*)")) {
    if (!path.startsWith("/api") && !path.contains(".") && path.matches("/(.*)")) {
      request.getRequestDispatcher("/").forward(request, response);
      return;
    }

    filterChain.doFilter(request, response);
  }
}
