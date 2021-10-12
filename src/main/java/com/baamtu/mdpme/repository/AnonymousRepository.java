package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.Anonymous;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Anonymous entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnonymousRepository extends JpaRepository<Anonymous, Long> {}
