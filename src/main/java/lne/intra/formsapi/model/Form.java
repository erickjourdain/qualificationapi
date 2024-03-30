package lne.intra.formsapi.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Form {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  @Size(min = 5, max = 125, message = "Le titre doit contenir entre 5 et 125 caractères")
  private String titre;

  @Size(min = 25, max = 255, message = "La description doit contenir entre 25 et 255 caractères")
  private String description;

  @Column(nullable = false, columnDefinition = "MEDIUMTEXT")
  private String formulaire;

  @Column
  private Integer initForm;

  @Column(nullable = false)
  @Builder.Default
  private Integer version = 1;

  @Column(nullable = false)
  @Builder.Default
  private Boolean valide = true;

  @Column(nullable = false, unique = true)
  private String slug;

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @CreationTimestamp
  private Date createdAt;

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @UpdateTimestamp
  private Date updatedAt;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "createur")
  private User createur;

}
