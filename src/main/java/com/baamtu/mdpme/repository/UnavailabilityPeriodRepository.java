package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.UnavailabilityPeriod;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the UnavailabilityPeriod entity.
 */
@Repository
public interface UnavailabilityPeriodRepository extends JpaRepository<UnavailabilityPeriod, Long> {
    @Query(
        value = "select distinct unavailabilityPeriod from UnavailabilityPeriod unavailabilityPeriod left join fetch unavailabilityPeriod.advisors left join fetch unavailabilityPeriod.partnerRepresentatives",
        countQuery = "select count(distinct unavailabilityPeriod) from UnavailabilityPeriod unavailabilityPeriod"
    )
    Page<UnavailabilityPeriod> findAllWithEagerRelationships(Pageable pageable);

    @Query(
        "select distinct unavailabilityPeriod from UnavailabilityPeriod unavailabilityPeriod left join fetch unavailabilityPeriod.advisors left join fetch unavailabilityPeriod.partnerRepresentatives"
    )
    List<UnavailabilityPeriod> findAllWithEagerRelationships();

    @Query(
        "select unavailabilityPeriod from UnavailabilityPeriod unavailabilityPeriod left join fetch unavailabilityPeriod.advisors left join fetch unavailabilityPeriod.partnerRepresentatives where unavailabilityPeriod.id =:id"
    )
    Optional<UnavailabilityPeriod> findOneWithEagerRelationships(@Param("id") Long id);
}
