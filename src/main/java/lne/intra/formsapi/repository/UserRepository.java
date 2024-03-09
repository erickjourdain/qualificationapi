package lne.intra.formsapi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import lne.intra.formsapi.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
  
  @SuppressWarnings("null")
  Page<User> findAll(Pageable pageable);

  Optional<User> findByLogin(String login);

  Page<User> findAll(Specification<User> spec, Pageable paging);

  Optional<User> findByResetPwdToken(String token);

  @Query("select us from User us where us.resetPwdToken is not null")
  List<User> findToken();

  @Modifying
  @Query("update User us set us.resetPwdToken = null where us.id = :id")
  void deleteOldToken(Integer id);
}
