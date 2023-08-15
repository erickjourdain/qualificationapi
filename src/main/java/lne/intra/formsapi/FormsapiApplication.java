package lne.intra.formsapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(info = @Info(title = "Forms API", version = "${lne.intra.formsapi.version}", description = "Gestion des formulaires de qualification"))
@SpringBootApplication
public class FormsapiApplication {

	public static void main(String[] args) {
		SpringApplication.run(FormsapiApplication.class, args);
	}

}
