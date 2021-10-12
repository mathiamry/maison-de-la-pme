package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.Turnover;
import com.baamtu.mdpme.repository.TurnoverRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.Turnover}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TurnoverResource {

    private final Logger log = LoggerFactory.getLogger(TurnoverResource.class);

    private static final String ENTITY_NAME = "turnover";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TurnoverRepository turnoverRepository;

    public TurnoverResource(TurnoverRepository turnoverRepository) {
        this.turnoverRepository = turnoverRepository;
    }

    /**
     * {@code POST  /turnovers} : Create a new turnover.
     *
     * @param turnover the turnover to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new turnover, or with status {@code 400 (Bad Request)} if the turnover has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/turnovers")
    public ResponseEntity<Turnover> createTurnover(@RequestBody Turnover turnover) throws URISyntaxException {
        log.debug("REST request to save Turnover : {}", turnover);
        if (turnover.getId() != null) {
            throw new BadRequestAlertException("A new turnover cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Turnover result = turnoverRepository.save(turnover);
        return ResponseEntity
            .created(new URI("/api/turnovers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /turnovers/:id} : Updates an existing turnover.
     *
     * @param id the id of the turnover to save.
     * @param turnover the turnover to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated turnover,
     * or with status {@code 400 (Bad Request)} if the turnover is not valid,
     * or with status {@code 500 (Internal Server Error)} if the turnover couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/turnovers/{id}")
    public ResponseEntity<Turnover> updateTurnover(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Turnover turnover
    ) throws URISyntaxException {
        log.debug("REST request to update Turnover : {}, {}", id, turnover);
        if (turnover.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, turnover.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!turnoverRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Turnover result = turnoverRepository.save(turnover);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, turnover.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /turnovers/:id} : Partial updates given fields of an existing turnover, field will ignore if it is null
     *
     * @param id the id of the turnover to save.
     * @param turnover the turnover to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated turnover,
     * or with status {@code 400 (Bad Request)} if the turnover is not valid,
     * or with status {@code 404 (Not Found)} if the turnover is not found,
     * or with status {@code 500 (Internal Server Error)} if the turnover couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/turnovers/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Turnover> partialUpdateTurnover(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Turnover turnover
    ) throws URISyntaxException {
        log.debug("REST request to partial update Turnover partially : {}, {}", id, turnover);
        if (turnover.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, turnover.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!turnoverRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Turnover> result = turnoverRepository
            .findById(turnover.getId())
            .map(existingTurnover -> {
                if (turnover.getMin() != null) {
                    existingTurnover.setMin(turnover.getMin());
                }
                if (turnover.getMax() != null) {
                    existingTurnover.setMax(turnover.getMax());
                }
                if (turnover.getDescription() != null) {
                    existingTurnover.setDescription(turnover.getDescription());
                }

                return existingTurnover;
            })
            .map(turnoverRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, turnover.getId().toString())
        );
    }

    /**
     * {@code GET  /turnovers} : get all the turnovers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of turnovers in body.
     */
    @GetMapping("/turnovers")
    public List<Turnover> getAllTurnovers() {
        log.debug("REST request to get all Turnovers");
        return turnoverRepository.findAll();
    }

    /**
     * {@code GET  /turnovers/:id} : get the "id" turnover.
     *
     * @param id the id of the turnover to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the turnover, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/turnovers/{id}")
    public ResponseEntity<Turnover> getTurnover(@PathVariable Long id) {
        log.debug("REST request to get Turnover : {}", id);
        Optional<Turnover> turnover = turnoverRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(turnover);
    }

    /**
     * {@code DELETE  /turnovers/:id} : delete the "id" turnover.
     *
     * @param id the id of the turnover to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/turnovers/{id}")
    public ResponseEntity<Void> deleteTurnover(@PathVariable Long id) {
        log.debug("REST request to delete Turnover : {}", id);
        turnoverRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
