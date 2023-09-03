package lne.intra.formsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import lne.intra.formsapi.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Integer>, JpaSpecificationExecutor<Answer>{
}
