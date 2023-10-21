package lne.intra.formsapi.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Answer {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String reponse;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String donnees;

  private Integer demande;

  private Integer opportunite;

  @Enumerated(EnumType.STRING)
  @Column(columnDefinition = "VARCHAR(55) DEFAULT 'BROUILLON'")
  @Builder.Default private Statut statut = Statut.BROUILLON;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "createur")
  private User createur;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "form_id")
  private Form formulaire;

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @CreationTimestamp
  private Date createdAt;

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @UpdateTimestamp
  private Date updatedAt;
}
