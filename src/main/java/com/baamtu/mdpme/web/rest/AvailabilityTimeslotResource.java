package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.AvailabilityTimeslot;
import com.baamtu.mdpme.repository.AvailabilityTimeslotRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.AvailabilityTimeslot}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AvailabilityTimeslotResource {

    private final Logger log = LoggerFactory.getLogger(AvailabilityTimeslotResource.class);

    private static final String ENTITY_NAME = "availabilityTimeslot";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AvailabilityTimeslotRepository availabilityTimeslotRepository;

    public AvailabilityTimeslotResource(AvailabilityTimeslotRepository availabilityTimeslotRepository) {
        this.availabilityTimeslotRepository = availabilityTimeslotRepository;
    }

    /**
     * {@code POST  /availability-timeslots} : Create a new availabilityTimeslot.
     *
     * @param availabilityTimeslot the availabilityTimeslot to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new availabilityTimeslot, or with status {@code 400 (Bad Request)} if the availabilityTimeslot has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/availability-timeslots")
    public ResponseEntity<AvailabilityTimeslot> createAvailabilityTimeslot(@Valid @RequestBody AvailabilityTimeslot availabilityTimeslot)
        throws URISyntaxException {
        log.debug("REST request to save AvailabilityTimeslot : {}", availabilityTimeslot);
        if (availabilityTimeslot.getId() != null) {
            throw new BadRequestAlertException("A new availabilityTimeslot cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AvailabilityTimeslot result = availabilityTimeslotRepository.save(availabilityTimeslot);
        return ResponseEntity
            .created(new URI("/api/availability-timeslots/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /availability-timeslots/:id} : Updates an existing availabilityTimeslot.
     *
     * @param id the id of the availabilityTimeslot to save.
     * @param availabilityTimeslot the availabilityTimeslot to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated availabilityTimeslot,
     * or with status {@code 400 (Bad Request)} if the availabilityTimeslot is not valid,
     * or with status {@code 500 (Internal Server Error)} if the availabilityTimeslot couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/availability-timeslots/{id}")
    public ResponseEntity<AvailabilityTimeslot> updateAvailabilityTimeslot(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AvailabilityTimeslot availabilityTimeslot
    ) throws URISyntaxException {
        log.debug("REST request to update AvailabilityTimeslot : {}, {}", id, availabilityTimeslot);
        if (availabilityTimeslot.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, availabilityTimeslot.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!availabilityTimeslotRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AvailabilityTimeslot result = availabilityTimeslotRepository.save(availabilityTimeslot);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, availabilityTimeslot.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /availability-timeslots/:id} : Partial updates given fields of an existing availabilityTimeslot, field will ignore if it is null
     *
     * @param id the id of the availabilityTimeslot to save.
     * @param availabilityTimeslot the availabilityTimeslot to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated availabilityTimeslot,
     * or with status {@code 400 (Bad Request)} if the availabilityTimeslot is not valid,
     * or with status {@code 404 (Not Found)} if the availabilityTimeslot is not found,
     * or with status {@code 500 (Internal Server Error)} if the availabilityTimeslot couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/availability-timeslots/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AvailabilityTimeslot> partialUpdateAvailabilityTimeslot(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AvailabilityTimeslot availabilityTimeslot
    ) throws URISyntaxException {
        log.debug("REST request to partial update AvailabilityTimeslot partially : {}, {}", id, availabilityTimeslot);
        if (availabilityTimeslot.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, availabilityTimeslot.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!availabilityTimeslotRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AvailabilityTimeslot> result = availabilityTimeslotRepository
            .findById(availabilityTimeslot.getId())
            .map(existingAvailabilityTimeslot -> {
                if (availabilityTimeslot.getStartHour() != null) {
                    existingAvailabilityTimeslot.setStartHour(availabilityTimeslot.getStartHour());
                }
                if (availabilityTimeslot.getStartMin() != null) {
                    existingAvailabilityTimeslot.setStartMin(availabilityTimeslot.getStartMin());
                }
                if (availabilityTimeslot.getEndHour() != null) {
                    existingAvailabilityTimeslot.setEndHour(availabilityTimeslot.getEndHour());
                }
                if (availabilityTimeslot.getEndMin() != null) {
                    existingAvailabilityTimeslot.setEndMin(availabilityTimeslot.getEndMin());
                }
                if (availabilityTimeslot.getDay() != null) {
                    existingAvailabilityTimeslot.setDay(availabilityTimeslot.getDay());
                }

                return existingAvailabilityTimeslot;
            })
            .map(availabilityTimeslotRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, availabilityTimeslot.getId().toString())
        );
    }

    /**
     * {@code GET  /availability-timeslots} : get all the availabilityTimeslots.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of availabilityTimeslots in body.
     */
    @GetMapping("/availability-timeslots")
    public List<AvailabilityTimeslot> getAllAvailabilityTimeslots(
        @RequestParam(required = false, defaultValue = "false") boolean eagerload
    ) {
        log.debug("REST request to get all AvailabilityTimeslots");
        return availabilityTimeslotRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /availability-timeslots/:id} : get the "id" availabilityTimeslot.
     *
     * @param id the id of the availabilityTimeslot to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the availabilityTimeslot, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/availability-timeslots/{id}")
    public ResponseEntity<AvailabilityTimeslot> getAvailabilityTimeslot(@PathVariable Long id) {
        log.debug("REST request to get AvailabilityTimeslot : {}", id);
        Optional<AvailabilityTimeslot> availabilityTimeslot = availabilityTimeslotRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(availabilityTimeslot);
    }

    /**
     * {@code DELETE  /availability-timeslots/:id} : delete the "id" availabilityTimeslot.
     *
     * @param id the id of the availabilityTimeslot to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/availability-timeslots/{id}")
    public ResponseEntity<Void> deleteAvailabilityTimeslot(@PathVariable Long id) {
        log.debug("REST request to delete AvailabilityTimeslot : {}", id);
        availabilityTimeslotRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
