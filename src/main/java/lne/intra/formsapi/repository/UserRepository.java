package lne.intra.formsapi.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import lne.intra.formsapi.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
  
  Page<User> findAll(Pageable pageable);

  Optional<User> findByLogin(String login);

  Page<User> findAll(Specification<User> spec, Pageable paging);

  Optional<User> findByResetPwdToken(String token);

}
