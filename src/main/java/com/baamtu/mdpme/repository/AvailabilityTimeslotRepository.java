package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.AvailabilityTimeslot;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AvailabilityTimeslot entity.
 */
@Repository
public interface AvailabilityTimeslotRepository extends JpaRepository<AvailabilityTimeslot, Long> {
    @Query(
        value = "select distinct availabilityTimeslot from AvailabilityTimeslot availabilityTimeslot left join fetch availabilityTimeslot.advisors left join fetch availabilityTimeslot.partnerRepresentatives",
        countQuery = "select count(distinct availabilityTimeslot) from AvailabilityTimeslot availabilityTimeslot"
    )
    Page<AvailabilityTimeslot> findAllWithEagerRelationships(Pageable pageable);

    @Query(
        "select distinct availabilityTimeslot from AvailabilityTimeslot availabilityTimeslot left join fetch availabilityTimeslot.advisors left join fetch availabilityTimeslot.partnerRepresentatives"
    )
    List<AvailabilityTimeslot> findAllWithEagerRelationships();

    @Query(
        "select availabilityTimeslot from AvailabilityTimeslot availabilityTimeslot left join fetch availabilityTimeslot.advisors left join fetch availabilityTimeslot.partnerRepresentatives where availabilityTimeslot.id =:id"
    )
    Optional<AvailabilityTimeslot> findOneWithEagerRelationships(@Param("id") Long id);
}
