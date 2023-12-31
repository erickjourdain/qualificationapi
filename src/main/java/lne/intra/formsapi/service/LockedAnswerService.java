package lne.intra.formsapi.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import lne.intra.formsapi.model.Answer;
import lne.intra.formsapi.model.LockedAnswer;
import lne.intra.formsapi.repository.LockedAnswerRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LockedAnswerService {
  private final LockedAnswerRepository repository;

  public Optional<LockedAnswer> getByAnswer(Answer answer) {
    return repository.findByAnswer(answer);
  }

  public Boolean delete(Integer id) {
    repository.deleteById(id);
    return true;
  }

  public LockedAnswer insert(LockedAnswer lockedAnswer) {
    return repository.save(lockedAnswer);
  }

}
