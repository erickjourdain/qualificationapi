package lne.intra.formsapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import lne.intra.formsapi.model.Devis;

public interface DevisRepository extends JpaRepository<Devis, Integer>, JpaSpecificationExecutor<Devis>{
  
  Optional<Devis> findByReference(String references);

}
