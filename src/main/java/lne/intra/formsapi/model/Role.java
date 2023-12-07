package lne.intra.formsapi.model;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import static lne.intra.formsapi.model.Permission.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Role {
  ADMIN(
      Set.of(
          ADMIN_CREATE,
          ADMIN_READ,
          ADMIN_UPDATE,
          ADMIN_DELETE,
          CREATOR_CREATE,
          CREATOR_READ,
          CREATOR_UPDATE,
          CREATOR_DELETE,
          USER_CREATE,
          USER_READ,
          USER_UPDATE,
          USER_DELETE)),
  CREATOR(
      Set.of(
          CREATOR_CREATE,
          CREATOR_READ,
          CREATOR_UPDATE,
          CREATOR_DELETE,
          USER_CREATE,
          USER_READ,
          USER_UPDATE,
          USER_DELETE)),
  USER(
      Set.of(
          USER_CREATE,
          USER_READ,
          USER_UPDATE,
          USER_DELETE)),
  READER(
      Set.of(
          READER_UPDATE,
          READER_READ));

  @Getter
  private final Set<Permission> permissions;

  public List<SimpleGrantedAuthority> getAuthorities() {
    var authorities = getPermissions()
        .stream()
        .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
        .collect(Collectors.toList());
    authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
    return authorities;
  }
}
