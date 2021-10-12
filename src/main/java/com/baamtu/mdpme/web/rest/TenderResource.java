package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.Tender;
import com.baamtu.mdpme.repository.TenderRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.Tender}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TenderResource {

    private final Logger log = LoggerFactory.getLogger(TenderResource.class);

    private static final String ENTITY_NAME = "tender";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TenderRepository tenderRepository;

    public TenderResource(TenderRepository tenderRepository) {
        this.tenderRepository = tenderRepository;
    }

    /**
     * {@code POST  /tenders} : Create a new tender.
     *
     * @param tender the tender to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tender, or with status {@code 400 (Bad Request)} if the tender has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tenders")
    public ResponseEntity<Tender> createTender(@Valid @RequestBody Tender tender) throws URISyntaxException {
        log.debug("REST request to save Tender : {}", tender);
        if (tender.getId() != null) {
            throw new BadRequestAlertException("A new tender cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tender result = tenderRepository.save(tender);
        return ResponseEntity
            .created(new URI("/api/tenders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tenders/:id} : Updates an existing tender.
     *
     * @param id the id of the tender to save.
     * @param tender the tender to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tender,
     * or with status {@code 400 (Bad Request)} if the tender is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tender couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tenders/{id}")
    public ResponseEntity<Tender> updateTender(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Tender tender
    ) throws URISyntaxException {
        log.debug("REST request to update Tender : {}, {}", id, tender);
        if (tender.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tender.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tenderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tender result = tenderRepository.save(tender);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tender.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tenders/:id} : Partial updates given fields of an existing tender, field will ignore if it is null
     *
     * @param id the id of the tender to save.
     * @param tender the tender to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tender,
     * or with status {@code 400 (Bad Request)} if the tender is not valid,
     * or with status {@code 404 (Not Found)} if the tender is not found,
     * or with status {@code 500 (Internal Server Error)} if the tender couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tenders/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tender> partialUpdateTender(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Tender tender
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tender partially : {}, {}", id, tender);
        if (tender.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tender.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tenderRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tender> result = tenderRepository
            .findById(tender.getId())
            .map(existingTender -> {
                if (tender.getTitle() != null) {
                    existingTender.setTitle(tender.getTitle());
                }
                if (tender.getDescription() != null) {
                    existingTender.setDescription(tender.getDescription());
                }
                if (tender.getPublishDate() != null) {
                    existingTender.setPublishDate(tender.getPublishDate());
                }
                if (tender.getExpiryDate() != null) {
                    existingTender.setExpiryDate(tender.getExpiryDate());
                }
                if (tender.getIsValid() != null) {
                    existingTender.setIsValid(tender.getIsValid());
                }
                if (tender.getIsArchived() != null) {
                    existingTender.setIsArchived(tender.getIsArchived());
                }
                if (tender.getIsPublished() != null) {
                    existingTender.setIsPublished(tender.getIsPublished());
                }

                return existingTender;
            })
            .map(tenderRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tender.getId().toString())
        );
    }

    /**
     * {@code GET  /tenders} : get all the tenders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tenders in body.
     */
    @GetMapping("/tenders")
    public List<Tender> getAllTenders() {
        log.debug("REST request to get all Tenders");
        return tenderRepository.findAll();
    }

    /**
     * {@code GET  /tenders/:id} : get the "id" tender.
     *
     * @param id the id of the tender to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tender, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tenders/{id}")
    public ResponseEntity<Tender> getTender(@PathVariable Long id) {
        log.debug("REST request to get Tender : {}", id);
        Optional<Tender> tender = tenderRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tender);
    }

    /**
     * {@code DELETE  /tenders/:id} : delete the "id" tender.
     *
     * @param id the id of the tender to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tenders/{id}")
    public ResponseEntity<Void> deleteTender(@PathVariable Long id) {
        log.debug("REST request to delete Tender : {}", id);
        tenderRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
