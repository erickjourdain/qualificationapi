package lne.intra.formsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import lne.intra.formsapi.model.Header;

public interface HeaderRepository extends JpaRepository<Header, Integer>, JpaSpecificationExecutor<Header> {
 
}