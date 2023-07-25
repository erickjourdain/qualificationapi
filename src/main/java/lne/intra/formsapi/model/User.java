package lne.intra.formsapi.model;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class User implements UserDetails{
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(nullable = false)
  private String prenom;

  @Column(nullable = false)
  private String nom;

  @Column(nullable = false, unique = true)
  private String login;

  @Column(nullable = false)
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(columnDefinition = "VARCHAR(55) DEFAULT 'USER'")
  @Builder.Default private Role role = Role.USER;

  @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
  @Builder.Default private Boolean expired = false;

  @Column(columnDefinition = "BOOLEAN DEFAULT FALSE")
  @Builder.Default private Boolean locked = false;

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @CreationTimestamp
  @Builder.Default private Date createdAt = new Date();

  @Column(columnDefinition = "DATETIME DEFAULT CURRENT_DATE", nullable = false)
  @Builder.Default private Date updatedAt = new Date();

  @OneToMany(mappedBy = "user")
  private List<Token> tokens;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return role.getAuthorities();
  }

  @Override
  public String getUsername() {
    return login;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
  
}
