package lne.intra.formsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import lne.intra.formsapi.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Integer>, JpaSpecificationExecutor<Answer> {

  @Query("""
    select count(a.id) from Answser a
    where a.produit <> :produit
    and a.devis = :devis
    """)
  Integer CountDevisOtherProduct(Integer produit, Integer devis);

  @Query("""
    select count(a.id) from Answser a
    where a.produit = :produit
    and a.formulaire =: formulaire
    and a.devis = :devis
    """)
  Integer CountDevisProductForm(Integer produit, Integer formulaire, Integer devis);

}
