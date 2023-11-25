package lne.intra.formsapi.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import lne.intra.formsapi.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Integer>, JpaSpecificationExecutor<Answer> {

  @Modifying
  @Query("""
          update Answer a SET a.lockedAt = NULL, a.utilisateur = null
          where a.lockedAt <= :timestamp
      """)
  void updateLocked(Date timestamp);
}
