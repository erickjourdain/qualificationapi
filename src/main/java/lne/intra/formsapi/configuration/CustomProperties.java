package lne.intra.formsapi.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "lne.intra.formsapi")
public class CustomProperties {

  private String secretkey;

}
