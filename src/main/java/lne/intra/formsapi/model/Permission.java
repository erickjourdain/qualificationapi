package lne.intra.formsapi.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
  
  ADMIN_READ("admin:read"),
  ADMIN_CREATE("admin:create"),
  ADMIN_UPDATE("admin:update"),
  ADMIN_DELETE("admin:delete"),
  CREATOR_READ("creator:read"),
  CREATOR_CREATE("creator:create"),
  CREATOR_UPDATE("creator:update"),
  CREATOR_DELETE("creator:delete"),
  USER_READ("user:read"),
  USER_CREATE("user:create"),
  USER_UPDATE("user:update"),
  USER_DELETE("user:delete"),
  READER_READ("reader:read");

  @Getter
  private final String permission;
}
