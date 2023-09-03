package lne.intra.formsapi.model.request;

import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lne.intra.formsapi.util.ObjectCreate;
import lne.intra.formsapi.util.ObjectUpdate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FormRequest {

    @NotBlank(groups = ObjectCreate.class, message = "le champ 'titre' est obligatoire")
    @Size(groups = { ObjectCreate.class,
        ObjectUpdate.class }, min = 5, max = 125, message = "le champ 'titre' doit contenir entre 5 et 125 caractères")
    @Parameter(description = "Titre du formulaire", required = true, example = "formulaire")
    private String titre;

    @Size(groups = { ObjectCreate.class,
        ObjectUpdate.class }, min = 25, max = 255, message = "le champ 'description' doit contenir entre 25 et 255 caractères")
    private String description;

    @NotBlank(groups = ObjectCreate.class, message = "le champ 'formulaire' est obligatoire")
    private String formulaire;

    @NotNull(groups = ObjectCreate.class, message = "le champ 'createur' est obligatoire")
    @Min(groups = { ObjectCreate.class,
            ObjectUpdate.class }, value = 1, message = "le champ 'createur' doit être positif")
    private Integer createur;

}
