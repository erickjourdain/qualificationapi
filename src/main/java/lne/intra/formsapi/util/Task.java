package lne.intra.formsapi.util;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import lne.intra.formsapi.repository.AnswerRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Task {
  private final AnswerRepository answerRepository;

  @Transactional
  @Scheduled(initialDelay = 15, fixedDelay = 15, timeUnit = TimeUnit.MINUTES)
  public void unlockAnswers() {
    Date targetTime = Calendar.getInstance().getTime();
    targetTime = DateUtils.addMinutes(targetTime, -15);
    answerRepository.updateLocked(targetTime);
  }

}
