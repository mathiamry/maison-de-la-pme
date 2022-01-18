package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.AppointmentObject;
import com.baamtu.mdpme.repository.AppointmentObjectRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.AppointmentObject}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AppointmentObjectResource {

    private final Logger log = LoggerFactory.getLogger(AppointmentObjectResource.class);

    private static final String ENTITY_NAME = "appointmentObject";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppointmentObjectRepository appointmentObjectRepository;

    public AppointmentObjectResource(AppointmentObjectRepository appointmentObjectRepository) {
        this.appointmentObjectRepository = appointmentObjectRepository;
    }

    /**
     * {@code POST  /appointment-objects} : Create a new appointmentObject.
     *
     * @param appointmentObject the appointmentObject to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appointmentObject, or with status {@code 400 (Bad Request)} if the appointmentObject has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/appointment-objects")
    public ResponseEntity<AppointmentObject> createAppointmentObject(@Valid @RequestBody AppointmentObject appointmentObject)
        throws URISyntaxException {
        log.debug("REST request to save AppointmentObject : {}", appointmentObject);
        if (appointmentObject.getId() != null) {
            throw new BadRequestAlertException("A new appointmentObject cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppointmentObject result = appointmentObjectRepository.save(appointmentObject);
        return ResponseEntity
            .created(new URI("/api/appointment-objects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /appointment-objects/:id} : Updates an existing appointmentObject.
     *
     * @param id the id of the appointmentObject to save.
     * @param appointmentObject the appointmentObject to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointmentObject,
     * or with status {@code 400 (Bad Request)} if the appointmentObject is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appointmentObject couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/appointment-objects/{id}")
    public ResponseEntity<AppointmentObject> updateAppointmentObject(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AppointmentObject appointmentObject
    ) throws URISyntaxException {
        log.debug("REST request to update AppointmentObject : {}, {}", id, appointmentObject);
        if (appointmentObject.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointmentObject.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentObjectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AppointmentObject result = appointmentObjectRepository.save(appointmentObject);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appointmentObject.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /appointment-objects/:id} : Partial updates given fields of an existing appointmentObject, field will ignore if it is null
     *
     * @param id the id of the appointmentObject to save.
     * @param appointmentObject the appointmentObject to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appointmentObject,
     * or with status {@code 400 (Bad Request)} if the appointmentObject is not valid,
     * or with status {@code 404 (Not Found)} if the appointmentObject is not found,
     * or with status {@code 500 (Internal Server Error)} if the appointmentObject couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/appointment-objects/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AppointmentObject> partialUpdateAppointmentObject(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AppointmentObject appointmentObject
    ) throws URISyntaxException {
        log.debug("REST request to partial update AppointmentObject partially : {}, {}", id, appointmentObject);
        if (appointmentObject.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appointmentObject.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appointmentObjectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppointmentObject> result = appointmentObjectRepository
            .findById(appointmentObject.getId())
            .map(existingAppointmentObject -> {
                if (appointmentObject.getObject() != null) {
                    existingAppointmentObject.setObject(appointmentObject.getObject());
                }

                return existingAppointmentObject;
            })
            .map(appointmentObjectRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appointmentObject.getId().toString())
        );
    }

    /**
     * {@code GET  /appointment-objects} : get all the appointmentObjects.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appointmentObjects in body.
     */
    @GetMapping("/appointment-objects")
    public List<AppointmentObject> getAllAppointmentObjects() {
        log.debug("REST request to get all AppointmentObjects");
        return appointmentObjectRepository.findAll();
    }

    /**
     * {@code GET  /appointment-objects/:id} : get the "id" appointmentObject.
     *
     * @param id the id of the appointmentObject to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appointmentObject, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/appointment-objects/{id}")
    public ResponseEntity<AppointmentObject> getAppointmentObject(@PathVariable Long id) {
        log.debug("REST request to get AppointmentObject : {}", id);
        Optional<AppointmentObject> appointmentObject = appointmentObjectRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(appointmentObject);
    }

    /**
     * {@code DELETE  /appointment-objects/:id} : delete the "id" appointmentObject.
     *
     * @param id the id of the appointmentObject to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/appointment-objects/{id}")
    public ResponseEntity<Void> deleteAppointmentObject(@PathVariable Long id) {
        log.debug("REST request to delete AppointmentObject : {}", id);
        appointmentObjectRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
