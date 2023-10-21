package lne.intra.formsapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import lne.intra.formsapi.model.File;

public interface FileRepository extends JpaRepository<File, Integer>{
  
}
