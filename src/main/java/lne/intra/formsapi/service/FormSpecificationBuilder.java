package lne.intra.formsapi.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.SearchOperation;
import lne.intra.formsapi.model.dto.SearchCriteriaDto;

public class FormSpecificationBuilder {
  
  private final List<SearchCriteriaDto> params;

  public FormSpecificationBuilder(){
    this.params = new ArrayList<>();
  }

  public final FormSpecificationBuilder with(String key, String operation, Object value) {
    params.add(new SearchCriteriaDto(key, operation, value));
    return this;
  }

  public final FormSpecificationBuilder with(SearchCriteriaDto searchCriteria) {
    params.add(searchCriteria);
    return this;
  }

  public Specification<Form> build() {
    if (params.size() == 0) {
      return null;
    }
    
    Specification<Form> result = new FormSpecification(params.get(0));
    for (int idx = 1; idx < params.size(); idx++) {
      SearchCriteriaDto criteria = params.get(idx);
      result = SearchOperation.getDataOption(criteria.getDataOption()) == SearchOperation.ALL
          ? Specification.where(result).and(new FormSpecification(criteria))
          : Specification.where(result).or(new FormSpecification(criteria));
    }
    return result;
  }
}
