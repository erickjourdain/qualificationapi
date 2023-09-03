package lne.intra.formsapi.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
    info = @Info(
        title = "Open Api Formulaire Backend", 
        version = "${lne.intra.formsapi.version}", 
        description = "Open Api documentation `Forms API`"
    ),
    servers = {
        @Server(
          description = "Serveur local de developpement",
          url = "http://localhost:3030"
        )
    }
)
@SecurityScheme(
  name= "BearerAuth",
  description = "authentification avec un token JWT dans l'entête de la requête",
  scheme = "bearer",
  type = SecuritySchemeType.HTTP,
  bearerFormat = "JWT",
  in = SecuritySchemeIn.HEADER
)
public class OpenApiConfiguration {
  
}
