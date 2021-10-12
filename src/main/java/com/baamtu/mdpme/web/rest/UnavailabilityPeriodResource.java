package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.UnavailabilityPeriod;
import com.baamtu.mdpme.repository.UnavailabilityPeriodRepository;
import com.baamtu.mdpme.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.baamtu.mdpme.domain.UnavailabilityPeriod}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UnavailabilityPeriodResource {

    private final Logger log = LoggerFactory.getLogger(UnavailabilityPeriodResource.class);

    private static final String ENTITY_NAME = "unavailabilityPeriod";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UnavailabilityPeriodRepository unavailabilityPeriodRepository;

    public UnavailabilityPeriodResource(UnavailabilityPeriodRepository unavailabilityPeriodRepository) {
        this.unavailabilityPeriodRepository = unavailabilityPeriodRepository;
    }

    /**
     * {@code POST  /unavailability-periods} : Create a new unavailabilityPeriod.
     *
     * @param unavailabilityPeriod the unavailabilityPeriod to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new unavailabilityPeriod, or with status {@code 400 (Bad Request)} if the unavailabilityPeriod has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/unavailability-periods")
    public ResponseEntity<UnavailabilityPeriod> createUnavailabilityPeriod(@RequestBody UnavailabilityPeriod unavailabilityPeriod)
        throws URISyntaxException {
        log.debug("REST request to save UnavailabilityPeriod : {}", unavailabilityPeriod);
        if (unavailabilityPeriod.getId() != null) {
            throw new BadRequestAlertException("A new unavailabilityPeriod cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UnavailabilityPeriod result = unavailabilityPeriodRepository.save(unavailabilityPeriod);
        return ResponseEntity
            .created(new URI("/api/unavailability-periods/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /unavailability-periods/:id} : Updates an existing unavailabilityPeriod.
     *
     * @param id the id of the unavailabilityPeriod to save.
     * @param unavailabilityPeriod the unavailabilityPeriod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unavailabilityPeriod,
     * or with status {@code 400 (Bad Request)} if the unavailabilityPeriod is not valid,
     * or with status {@code 500 (Internal Server Error)} if the unavailabilityPeriod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/unavailability-periods/{id}")
    public ResponseEntity<UnavailabilityPeriod> updateUnavailabilityPeriod(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UnavailabilityPeriod unavailabilityPeriod
    ) throws URISyntaxException {
        log.debug("REST request to update UnavailabilityPeriod : {}, {}", id, unavailabilityPeriod);
        if (unavailabilityPeriod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unavailabilityPeriod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unavailabilityPeriodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        UnavailabilityPeriod result = unavailabilityPeriodRepository.save(unavailabilityPeriod);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unavailabilityPeriod.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /unavailability-periods/:id} : Partial updates given fields of an existing unavailabilityPeriod, field will ignore if it is null
     *
     * @param id the id of the unavailabilityPeriod to save.
     * @param unavailabilityPeriod the unavailabilityPeriod to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unavailabilityPeriod,
     * or with status {@code 400 (Bad Request)} if the unavailabilityPeriod is not valid,
     * or with status {@code 404 (Not Found)} if the unavailabilityPeriod is not found,
     * or with status {@code 500 (Internal Server Error)} if the unavailabilityPeriod couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/unavailability-periods/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<UnavailabilityPeriod> partialUpdateUnavailabilityPeriod(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody UnavailabilityPeriod unavailabilityPeriod
    ) throws URISyntaxException {
        log.debug("REST request to partial update UnavailabilityPeriod partially : {}, {}", id, unavailabilityPeriod);
        if (unavailabilityPeriod.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unavailabilityPeriod.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unavailabilityPeriodRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<UnavailabilityPeriod> result = unavailabilityPeriodRepository
            .findById(unavailabilityPeriod.getId())
            .map(existingUnavailabilityPeriod -> {
                if (unavailabilityPeriod.getStartTime() != null) {
                    existingUnavailabilityPeriod.setStartTime(unavailabilityPeriod.getStartTime());
                }
                if (unavailabilityPeriod.getEndTime() != null) {
                    existingUnavailabilityPeriod.setEndTime(unavailabilityPeriod.getEndTime());
                }

                return existingUnavailabilityPeriod;
            })
            .map(unavailabilityPeriodRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unavailabilityPeriod.getId().toString())
        );
    }

    /**
     * {@code GET  /unavailability-periods} : get all the unavailabilityPeriods.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of unavailabilityPeriods in body.
     */
    @GetMapping("/unavailability-periods")
    public List<UnavailabilityPeriod> getAllUnavailabilityPeriods(
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get all UnavailabilityPeriods");
        return unavailabilityPeriodRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /unavailability-periods/:id} : get the "id" unavailabilityPeriod.
     *
     * @param id the id of the unavailabilityPeriod to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the unavailabilityPeriod, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/unavailability-periods/{id}")
    public ResponseEntity<UnavailabilityPeriod> getUnavailabilityPeriod(@PathVariable Long id) {
        log.debug("REST request to get UnavailabilityPeriod : {}", id);
        Optional<UnavailabilityPeriod> unavailabilityPeriod = unavailabilityPeriodRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(unavailabilityPeriod);
    }

    /**
     * {@code DELETE  /unavailability-periods/:id} : delete the "id" unavailabilityPeriod.
     *
     * @param id the id of the unavailabilityPeriod to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/unavailability-periods/{id}")
    public ResponseEntity<Void> deleteUnavailabilityPeriod(@PathVariable Long id) {
        log.debug("REST request to delete UnavailabilityPeriod : {}", id);
        unavailabilityPeriodRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
