package lne.intra.formsapi.model;

import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;

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
@NoArgsConstructor
@AllArgsConstructor
public class Token {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String token;

  @Enumerated(EnumType.STRING)
  @Column(columnDefinition = "VARCHAR(55) DEFAULT 'BEARER'")
  @Builder.Default private TokenType tokenType = TokenType.BEARER;

  @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
  @Builder.Default private Boolean expired = false;

  @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
  @Builder.Default
  private Boolean revoked = false;
  
  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @CreationTimestamp
  @Builder.Default private Date createdAt = new Date();

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @Builder.Default private Date updatedAt = new Date();

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

}
