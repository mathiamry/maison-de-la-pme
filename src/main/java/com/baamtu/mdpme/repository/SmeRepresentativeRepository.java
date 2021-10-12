package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.SmeRepresentative;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SmeRepresentative entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SmeRepresentativeRepository extends JpaRepository<SmeRepresentative, Long> {}
