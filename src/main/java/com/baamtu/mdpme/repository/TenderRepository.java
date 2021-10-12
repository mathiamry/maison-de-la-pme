package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.Tender;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tender entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TenderRepository extends JpaRepository<Tender, Long> {
    @Query("select tender from Tender tender where tender.author.login = ?#{principal.username}")
    List<Tender> findByAuthorIsCurrentUser();
}
