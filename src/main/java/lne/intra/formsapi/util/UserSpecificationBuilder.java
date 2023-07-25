package lne.intra.formsapi.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import lne.intra.formsapi.model.User;
import lne.intra.formsapi.model.SearchOperation;
import lne.intra.formsapi.model.dto.SearchCriteriaDto;

public class UserSpecificationBuilder {
  
  private final List<SearchCriteriaDto> params;

  public UserSpecificationBuilder(){
    this.params = new ArrayList<>();
  }

  public final UserSpecificationBuilder with(String key, String operation, Object value) {
    params.add(new SearchCriteriaDto(key, operation, value));
    return this;
  }

  public final UserSpecificationBuilder with(SearchCriteriaDto searchCriteria) {
    params.add(searchCriteria);
    return this;
  }

  public Specification<User> build() {
    if (params.size() == 0) {
      return null;
    }
    
    Specification<User> result = new UserSpecification(params.get(0));
    for (int idx = 1; idx < params.size(); idx++) {
      SearchCriteriaDto criteria = params.get(idx);
      result = SearchOperation.getDataOption(criteria.getDataOption()) == SearchOperation.ALL
          ? Specification.where(result).and(new UserSpecification(criteria))
          : Specification.where(result).or(new UserSpecification(criteria));
    }
    return result;
  }
}
