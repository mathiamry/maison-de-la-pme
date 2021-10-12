package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.SMEHouse;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SMEHouse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SMEHouseRepository extends JpaRepository<SMEHouse, Long> {}
