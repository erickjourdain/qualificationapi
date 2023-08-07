package lne.intra.formsapi.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import lne.intra.formsapi.model.Form;

public interface FormRepository extends JpaRepository<Form, Integer>, JpaSpecificationExecutor<Form> {

  Page<Form> findAll(Pageable pageable);

  Optional<Form> findBySlug(String slug);

  @Query("""
      select count(f.id) from Form f
      where f.valide = true
      and f.titre = :titre
      and f.version = :version
      """)
  Integer findByTitreVersionValide(String titre, Integer version);

  @Query("""
      select count(f.id) from Form f where f.valide = true and f.titre = :titre
      """)
  Integer findValidVersionByTitre(String titre);

}
