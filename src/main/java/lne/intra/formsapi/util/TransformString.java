package lne.intra.formsapi.util;

import org.springframework.stereotype.Service;

@Service
public class TransformString {
  /**
   * Mettre une majuscule au début de chaque mot
   * @param input la chaine à modifier
   * @return
   */
  public String FirstCharacterUpper(String input) {
    String[] words = input.split("\\s");

    StringBuilder firstResult = new StringBuilder();

    for (String word : words) {
      // capitalize the first letter, append the rest of the word, and add a space
      firstResult.append(Character.toTitleCase(word.charAt(0)))
          .append(word.substring(1).toLowerCase())
          .append(" ");
    }

    words = firstResult.toString().trim().split("-");
    StringBuilder result = new StringBuilder();
    
    for (String word : words) {
      // capitalize the first letter, append the rest of the word, and add a space
      result.append(Character.toTitleCase(word.charAt(0)))
          .append(word.substring(1).toLowerCase())
          .append("-");
    }

    return result.toString().replaceAll(".$", "").trim();
  }
}
