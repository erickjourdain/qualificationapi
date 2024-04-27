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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Produit {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String description;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "header_id")
  private Header header;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "createur")
  private User createur;

  @JsonBackReference
  @ManyToOne
  @JoinColumn(name = "gestionnaire")
  private User gestionnaire;

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @CreationTimestamp
  private Date createdAt;

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @UpdateTimestamp
  private Date updatedAt;
}
