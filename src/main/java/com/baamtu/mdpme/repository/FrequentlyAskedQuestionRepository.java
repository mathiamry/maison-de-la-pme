package com.baamtu.mdpme.repository;

import com.baamtu.mdpme.domain.FrequentlyAskedQuestion;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FrequentlyAskedQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FrequentlyAskedQuestionRepository extends JpaRepository<FrequentlyAskedQuestion, Long> {
    @Query(
        "select frequentlyAskedQuestion from FrequentlyAskedQuestion frequentlyAskedQuestion where frequentlyAskedQuestion.author.login = ?#{principal.username}"
    )
    List<FrequentlyAskedQuestion> findByAuthorIsCurrentUser();
}
