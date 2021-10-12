package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.Need;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Need entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NeedRepository extends JpaRepository<Need, Long> {}
