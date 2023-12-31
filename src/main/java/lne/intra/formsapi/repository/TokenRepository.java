package lne.intra.formsapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import lne.intra.formsapi.model.Token;

public interface TokenRepository extends JpaRepository<Token, Integer>{
  
  @Query("""
      select t from Token t inner join User u on t.user.id = u.id
      where u.id = :userId and (t.expired = false or t.revoked = false)
      """)
  List<Token> findAllTokensByUser(Integer userId);

  @Modifying
  @Query("delete Token t where t.expired = true or t.revoked = true")
  void deleteOldToken();

  Optional<Token> findByToken(String token);
}
