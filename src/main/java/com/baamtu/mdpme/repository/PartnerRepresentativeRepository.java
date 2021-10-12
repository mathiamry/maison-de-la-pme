package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.PartnerRepresentative;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PartnerRepresentative entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PartnerRepresentativeRepository extends JpaRepository<PartnerRepresentative, Long> {}
