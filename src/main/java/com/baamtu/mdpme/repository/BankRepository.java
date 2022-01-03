package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.Bank;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Bank entity.
 */
@Repository
public interface BankRepository extends JpaRepository<Bank, Long> {
    @Query(
        value = "select distinct bank from Bank bank left join fetch bank.smes",
        countQuery = "select count(distinct bank) from Bank bank"
    )
    Page<Bank> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct bank from Bank bank left join fetch bank.smes")
    List<Bank> findAllWithEagerRelationships();

    @Query("select bank from Bank bank left join fetch bank.smes where bank.id =:id")
    Optional<Bank> findOneWithEagerRelationships(@Param("id") Long id);
}
