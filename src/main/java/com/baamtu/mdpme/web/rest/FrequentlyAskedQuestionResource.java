package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.FrequentlyAskedQuestion;
import com.baamtu.mdpme.repository.FrequentlyAskedQuestionRepository;
import com.baamtu.mdpme.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.baamtu.mdpme.domain.FrequentlyAskedQuestion}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FrequentlyAskedQuestionResource {

    private final Logger log = LoggerFactory.getLogger(FrequentlyAskedQuestionResource.class);

    private static final String ENTITY_NAME = "frequentlyAskedQuestion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FrequentlyAskedQuestionRepository frequentlyAskedQuestionRepository;

    public FrequentlyAskedQuestionResource(FrequentlyAskedQuestionRepository frequentlyAskedQuestionRepository) {
        this.frequentlyAskedQuestionRepository = frequentlyAskedQuestionRepository;
    }

    /**
     * {@code POST  /frequently-asked-questions} : Create a new frequentlyAskedQuestion.
     *
     * @param frequentlyAskedQuestion the frequentlyAskedQuestion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new frequentlyAskedQuestion, or with status {@code 400 (Bad Request)} if the frequentlyAskedQuestion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/frequently-asked-questions")
    public ResponseEntity<FrequentlyAskedQuestion> createFrequentlyAskedQuestion(
        @Valid @RequestBody FrequentlyAskedQuestion frequentlyAskedQuestion
    ) throws URISyntaxException {
        log.debug("REST request to save FrequentlyAskedQuestion : {}", frequentlyAskedQuestion);
        if (frequentlyAskedQuestion.getId() != null) {
            throw new BadRequestAlertException("A new frequentlyAskedQuestion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FrequentlyAskedQuestion result = frequentlyAskedQuestionRepository.save(frequentlyAskedQuestion);
        return ResponseEntity
            .created(new URI("/api/frequently-asked-questions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /frequently-asked-questions/:id} : Updates an existing frequentlyAskedQuestion.
     *
     * @param id the id of the frequentlyAskedQuestion to save.
     * @param frequentlyAskedQuestion the frequentlyAskedQuestion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated frequentlyAskedQuestion,
     * or with status {@code 400 (Bad Request)} if the frequentlyAskedQuestion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the frequentlyAskedQuestion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/frequently-asked-questions/{id}")
    public ResponseEntity<FrequentlyAskedQuestion> updateFrequentlyAskedQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody FrequentlyAskedQuestion frequentlyAskedQuestion
    ) throws URISyntaxException {
        log.debug("REST request to update FrequentlyAskedQuestion : {}, {}", id, frequentlyAskedQuestion);
        if (frequentlyAskedQuestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, frequentlyAskedQuestion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!frequentlyAskedQuestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FrequentlyAskedQuestion result = frequentlyAskedQuestionRepository.save(frequentlyAskedQuestion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, frequentlyAskedQuestion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /frequently-asked-questions/:id} : Partial updates given fields of an existing frequentlyAskedQuestion, field will ignore if it is null
     *
     * @param id the id of the frequentlyAskedQuestion to save.
     * @param frequentlyAskedQuestion the frequentlyAskedQuestion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated frequentlyAskedQuestion,
     * or with status {@code 400 (Bad Request)} if the frequentlyAskedQuestion is not valid,
     * or with status {@code 404 (Not Found)} if the frequentlyAskedQuestion is not found,
     * or with status {@code 500 (Internal Server Error)} if the frequentlyAskedQuestion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/frequently-asked-questions/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FrequentlyAskedQuestion> partialUpdateFrequentlyAskedQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody FrequentlyAskedQuestion frequentlyAskedQuestion
    ) throws URISyntaxException {
        log.debug("REST request to partial update FrequentlyAskedQuestion partially : {}, {}", id, frequentlyAskedQuestion);
        if (frequentlyAskedQuestion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, frequentlyAskedQuestion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!frequentlyAskedQuestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FrequentlyAskedQuestion> result = frequentlyAskedQuestionRepository
            .findById(frequentlyAskedQuestion.getId())
            .map(existingFrequentlyAskedQuestion -> {
                if (frequentlyAskedQuestion.getQuestion() != null) {
                    existingFrequentlyAskedQuestion.setQuestion(frequentlyAskedQuestion.getQuestion());
                }
                if (frequentlyAskedQuestion.getAnswer() != null) {
                    existingFrequentlyAskedQuestion.setAnswer(frequentlyAskedQuestion.getAnswer());
                }
                if (frequentlyAskedQuestion.getOrder() != null) {
                    existingFrequentlyAskedQuestion.setOrder(frequentlyAskedQuestion.getOrder());
                }
                if (frequentlyAskedQuestion.getIsPublished() != null) {
                    existingFrequentlyAskedQuestion.setIsPublished(frequentlyAskedQuestion.getIsPublished());
                }

                return existingFrequentlyAskedQuestion;
            })
            .map(frequentlyAskedQuestionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, frequentlyAskedQuestion.getId().toString())
        );
    }

    /**
     * {@code GET  /frequently-asked-questions} : get all the frequentlyAskedQuestions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of frequentlyAskedQuestions in body.
     */
    @GetMapping("/frequently-asked-questions")
    public List<FrequentlyAskedQuestion> getAllFrequentlyAskedQuestions() {
        log.debug("REST request to get all FrequentlyAskedQuestions");
        return frequentlyAskedQuestionRepository.findAll();
    }

    /**
     * {@code GET  /frequently-asked-questions/:id} : get the "id" frequentlyAskedQuestion.
     *
     * @param id the id of the frequentlyAskedQuestion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the frequentlyAskedQuestion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/frequently-asked-questions/{id}")
    public ResponseEntity<FrequentlyAskedQuestion> getFrequentlyAskedQuestion(@PathVariable Long id) {
        log.debug("REST request to get FrequentlyAskedQuestion : {}", id);
        Optional<FrequentlyAskedQuestion> frequentlyAskedQuestion = frequentlyAskedQuestionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(frequentlyAskedQuestion);
    }

    /**
     * {@code DELETE  /frequently-asked-questions/:id} : delete the "id" frequentlyAskedQuestion.
     *
     * @param id the id of the frequentlyAskedQuestion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/frequently-asked-questions/{id}")
    public ResponseEntity<Void> deleteFrequentlyAskedQuestion(@PathVariable Long id) {
        log.debug("REST request to delete FrequentlyAskedQuestion : {}", id);
        frequentlyAskedQuestionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
