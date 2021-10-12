package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.File;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the File entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FileRepository extends JpaRepository<File, Long> {}
