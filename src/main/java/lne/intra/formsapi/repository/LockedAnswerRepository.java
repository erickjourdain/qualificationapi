package lne.intra.formsapi.repository;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import lne.intra.formsapi.model.Answer;
import lne.intra.formsapi.model.LockedAnswer;

public interface LockedAnswerRepository extends JpaRepository<LockedAnswer, Integer>{

  Optional<LockedAnswer> findByAnswer(Answer answer);

  Long deleteByAnswer(Answer answer);

  @Modifying
  @Query("delete LockedAnswer la where la.lockedAt <= : timestamp")
  void deleteOldLocked(Date timestamp);
  
}
