package lne.intra.formsapi.util;

import java.util.Objects;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.Nullable;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lne.intra.formsapi.model.Form;
import lne.intra.formsapi.model.SearchOperation;
import lne.intra.formsapi.model.dto.SearchCriteriaDto;

public class FormSpecification implements Specification<Form>{
  
  private final SearchCriteriaDto searchCriteria;

  public FormSpecification(final SearchCriteriaDto searchCriteria) {
    super();
    this.searchCriteria = searchCriteria;
  }

  @Override
  @Nullable
  public Predicate toPredicate(Root<Form> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
   
    String strToSearch = searchCriteria.getValue().toString().toLowerCase();

    switch (Objects.requireNonNull(SearchOperation.getSimpleOperation(searchCriteria.getOperation()))) {
      case CONTAINS:
        return cb.like(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + strToSearch + "%");
      case DOES_NOT_CONTAINS:
        return cb.notLike(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + strToSearch + "%");
      case EQUAL:
        return cb.equal(root.get(searchCriteria.getFilterKey()), strToSearch);
      case NOT_EQUAL:
        return cb.notEqual(root.get(searchCriteria.getFilterKey()), strToSearch);
      case BEGINS_WITH:
        return cb.like(cb.lower(root.get(searchCriteria.getFilterKey())), strToSearch + "%");
      case DOES_NOT_BEGIN_WITH:
        return cb.notLike(cb.lower(root.get(searchCriteria.getFilterKey())), strToSearch + "%");
      case ENDS_WITH:
        return cb.like(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + strToSearch);
      case DOES_NOT_END_WITH:
        return cb.notLike(cb.lower(root.get(searchCriteria.getFilterKey())), "%" + strToSearch);
      case NUL:
        return cb.isNull(cb.lower(root.get(searchCriteria.getFilterKey())));
      case NOT_NULL:
        return cb.isNotNull(cb.lower(root.get(searchCriteria.getFilterKey())));
      case GREATER_THAN:
        return cb.greaterThan(cb.lower(root.get(searchCriteria.getFilterKey())), strToSearch);
      case GREATER_THAN_EQUAL:
        return cb.greaterThanOrEqualTo(cb.lower(root.get(searchCriteria.getFilterKey())), strToSearch);
      case LESS_THAN:
        return cb.lessThan(cb.lower(root.get(searchCriteria.getFilterKey())), strToSearch);
      case LESS_THAN_EQUAL:
        return cb.lessThanOrEqualTo(cb.lower(root.get(searchCriteria.getFilterKey())), strToSearch);
      default:
        return null;
    }
  }


}
