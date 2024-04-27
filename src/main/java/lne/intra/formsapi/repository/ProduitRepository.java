package lne.intra.formsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import lne.intra.formsapi.model.Produit;

public interface ProduitRepository extends JpaRepository<Produit, Integer>, JpaSpecificationExecutor<Produit> {
  
}
