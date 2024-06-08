package lne.intra.formsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import lne.intra.formsapi.model.Answer;

public interface AnswerRepository extends JpaRepository<Answer, Integer>, JpaSpecificationExecutor<Answer> {

  @Query("""
      select count(a) from Answer a
      inner join Devis d on d.id = a.devis.id
      where a.produit.id <> :produit
      and d.reference = :devis
      """)
  Integer countDevisOtherProduct(Integer produit, String devis);

  @Query("""
      select count(a) from Answer a
      inner join Devis d on d.id = a.devis.id
      where a.id = :answer
      """)
  Integer countDevisOnAnswser(Integer answer);

  @Query("""
      select count(a) from Answer a
      inner join Devis d on d.id = a.devis.id
      where a.produit.header.id <> :header
      and d.reference = :devis
      """)
  Integer countDevisOtherHeader(Integer header, String devis);

  @Query("""
      select count(a) from Answer a
      inner join Devis d on d.id = a.devis.id
      where a.produit.id = :produit
      and a.formulaire.id =:formulaire
      and d.reference = :devis
      """)
  Integer countDevisProductForm(Integer produit, Integer formulaire, String devis);

}
