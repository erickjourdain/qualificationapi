package lne.intra.formsapi.configuration;

import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebMvc
@RequiredArgsConstructor
public class ResourceWebConfig  implements WebMvcConfigurer {
  
  private final Environment env;
    
  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String location = env.getProperty("lne.intra.formsapi.storage-mapping");
    
    registry.addResourceHandler("/uploads/**").addResourceLocations(location);
  }
}
