package lne.intra.formsapi.util;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import jakarta.transaction.Transactional;
import lne.intra.formsapi.repository.LockedAnswerRepository;
import lne.intra.formsapi.repository.TokenRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Task {
  private final LockedAnswerRepository lockedAnswerRepository;
  private final TokenRepository tokenRepository;

  @Transactional
  @Scheduled(initialDelay = 15, fixedDelay = 15, timeUnit = TimeUnit.MINUTES)
  public void unlockAnswers() {
    Date targetTime = Calendar.getInstance().getTime();
    targetTime = DateUtils.addMinutes(targetTime, -15);
    lockedAnswerRepository.deleteOldLocked(targetTime);
  }

  @Transactional
  @Scheduled(initialDelay = 12, fixedDelay = 12, timeUnit = TimeUnit.HOURS)
  public void deleteToken() {
    tokenRepository.deleteOldToken();
  }
}
