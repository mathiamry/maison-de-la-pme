package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.ActivityArea;
import com.baamtu.mdpme.repository.ActivityAreaRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.ActivityArea}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivityAreaResource {

    private final Logger log = LoggerFactory.getLogger(ActivityAreaResource.class);

    private static final String ENTITY_NAME = "activityArea";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityAreaRepository activityAreaRepository;

    public ActivityAreaResource(ActivityAreaRepository activityAreaRepository) {
        this.activityAreaRepository = activityAreaRepository;
    }

    /**
     * {@code POST  /activity-areas} : Create a new activityArea.
     *
     * @param activityArea the activityArea to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activityArea, or with status {@code 400 (Bad Request)} if the activityArea has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activity-areas")
    public ResponseEntity<ActivityArea> createActivityArea(@Valid @RequestBody ActivityArea activityArea) throws URISyntaxException {
        log.debug("REST request to save ActivityArea : {}", activityArea);
        if (activityArea.getId() != null) {
            throw new BadRequestAlertException("A new activityArea cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ActivityArea result = activityAreaRepository.save(activityArea);
        return ResponseEntity
            .created(new URI("/api/activity-areas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /activity-areas/:id} : Updates an existing activityArea.
     *
     * @param id the id of the activityArea to save.
     * @param activityArea the activityArea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityArea,
     * or with status {@code 400 (Bad Request)} if the activityArea is not valid,
     * or with status {@code 500 (Internal Server Error)} if the activityArea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activity-areas/{id}")
    public ResponseEntity<ActivityArea> updateActivityArea(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ActivityArea activityArea
    ) throws URISyntaxException {
        log.debug("REST request to update ActivityArea : {}, {}", id, activityArea);
        if (activityArea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityArea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityAreaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ActivityArea result = activityAreaRepository.save(activityArea);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activityArea.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /activity-areas/:id} : Partial updates given fields of an existing activityArea, field will ignore if it is null
     *
     * @param id the id of the activityArea to save.
     * @param activityArea the activityArea to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated activityArea,
     * or with status {@code 400 (Bad Request)} if the activityArea is not valid,
     * or with status {@code 404 (Not Found)} if the activityArea is not found,
     * or with status {@code 500 (Internal Server Error)} if the activityArea couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/activity-areas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ActivityArea> partialUpdateActivityArea(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ActivityArea activityArea
    ) throws URISyntaxException {
        log.debug("REST request to partial update ActivityArea partially : {}, {}", id, activityArea);
        if (activityArea.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, activityArea.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!activityAreaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ActivityArea> result = activityAreaRepository
            .findById(activityArea.getId())
            .map(existingActivityArea -> {
                if (activityArea.getName() != null) {
                    existingActivityArea.setName(activityArea.getName());
                }

                return existingActivityArea;
            })
            .map(activityAreaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activityArea.getId().toString())
        );
    }

    /**
     * {@code GET  /activity-areas} : get all the activityAreas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of activityAreas in body.
     */
    @GetMapping("/activity-areas")
    public List<ActivityArea> getAllActivityAreas() {
        log.debug("REST request to get all ActivityAreas");
        return activityAreaRepository.findAll();
    }

    /**
     * {@code GET  /activity-areas/:id} : get the "id" activityArea.
     *
     * @param id the id of the activityArea to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the activityArea, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activity-areas/{id}")
    public ResponseEntity<ActivityArea> getActivityArea(@PathVariable Long id) {
        log.debug("REST request to get ActivityArea : {}", id);
        Optional<ActivityArea> activityArea = activityAreaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activityArea);
    }

    /**
     * {@code DELETE  /activity-areas/:id} : delete the "id" activityArea.
     *
     * @param id the id of the activityArea to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activity-areas/{id}")
    public ResponseEntity<Void> deleteActivityArea(@PathVariable Long id) {
        log.debug("REST request to delete ActivityArea : {}", id);
        activityAreaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
