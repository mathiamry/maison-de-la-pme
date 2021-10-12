package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.Turnover;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Turnover entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TurnoverRepository extends JpaRepository<Turnover, Long> {}
