package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.SMEHouse;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the SMEHouse entity.
 */
@Repository
public interface SMEHouseRepository extends JpaRepository<SMEHouse, Long> {
    @Query(
        value = "select distinct sMEHouse from SMEHouse sMEHouse left join fetch sMEHouse.frequentlyAskedQuestions",
        countQuery = "select count(distinct sMEHouse) from SMEHouse sMEHouse"
    )
    Page<SMEHouse> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct sMEHouse from SMEHouse sMEHouse left join fetch sMEHouse.frequentlyAskedQuestions")
    List<SMEHouse> findAllWithEagerRelationships();

    @Query("select sMEHouse from SMEHouse sMEHouse left join fetch sMEHouse.frequentlyAskedQuestions where sMEHouse.id =:id")
    Optional<SMEHouse> findOneWithEagerRelationships(@Param("id") Long id);
}
