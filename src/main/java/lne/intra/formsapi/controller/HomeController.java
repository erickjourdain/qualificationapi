package lne.intra.formsapi.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class HomeController {
  
  @GetMapping("/")
  public Resource getMethodName() {
    return new ClassPathResource("static/index.html");
  }
  
}
