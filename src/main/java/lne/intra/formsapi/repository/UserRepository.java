package lne.intra.formsapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import lne.intra.formsapi.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
  
  Optional<User> findByLogin(String login);

}
