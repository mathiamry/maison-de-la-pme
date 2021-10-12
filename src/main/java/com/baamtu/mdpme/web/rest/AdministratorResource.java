package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.Administrator;
import com.baamtu.mdpme.repository.AdministratorRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.Administrator}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AdministratorResource {

    private final Logger log = LoggerFactory.getLogger(AdministratorResource.class);

    private static final String ENTITY_NAME = "administrator";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdministratorRepository administratorRepository;

    public AdministratorResource(AdministratorRepository administratorRepository) {
        this.administratorRepository = administratorRepository;
    }

    /**
     * {@code POST  /administrators} : Create a new administrator.
     *
     * @param administrator the administrator to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new administrator, or with status {@code 400 (Bad Request)} if the administrator has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/administrators")
    public ResponseEntity<Administrator> createAdministrator(@Valid @RequestBody Administrator administrator) throws URISyntaxException {
        log.debug("REST request to save Administrator : {}", administrator);
        if (administrator.getId() != null) {
            throw new BadRequestAlertException("A new administrator cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Administrator result = administratorRepository.save(administrator);
        return ResponseEntity
            .created(new URI("/api/administrators/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /administrators/:id} : Updates an existing administrator.
     *
     * @param id the id of the administrator to save.
     * @param administrator the administrator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated administrator,
     * or with status {@code 400 (Bad Request)} if the administrator is not valid,
     * or with status {@code 500 (Internal Server Error)} if the administrator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/administrators/{id}")
    public ResponseEntity<Administrator> updateAdministrator(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Administrator administrator
    ) throws URISyntaxException {
        log.debug("REST request to update Administrator : {}, {}", id, administrator);
        if (administrator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, administrator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!administratorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Administrator result = administratorRepository.save(administrator);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, administrator.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /administrators/:id} : Partial updates given fields of an existing administrator, field will ignore if it is null
     *
     * @param id the id of the administrator to save.
     * @param administrator the administrator to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated administrator,
     * or with status {@code 400 (Bad Request)} if the administrator is not valid,
     * or with status {@code 404 (Not Found)} if the administrator is not found,
     * or with status {@code 500 (Internal Server Error)} if the administrator couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/administrators/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Administrator> partialUpdateAdministrator(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Administrator administrator
    ) throws URISyntaxException {
        log.debug("REST request to partial update Administrator partially : {}, {}", id, administrator);
        if (administrator.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, administrator.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!administratorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Administrator> result = administratorRepository
            .findById(administrator.getId())
            .map(existingAdministrator -> {
                if (administrator.getJobTitle() != null) {
                    existingAdministrator.setJobTitle(administrator.getJobTitle());
                }
                if (administrator.getDescription() != null) {
                    existingAdministrator.setDescription(administrator.getDescription());
                }

                return existingAdministrator;
            })
            .map(administratorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, administrator.getId().toString())
        );
    }

    /**
     * {@code GET  /administrators} : get all the administrators.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of administrators in body.
     */
    @GetMapping("/administrators")
    public List<Administrator> getAllAdministrators() {
        log.debug("REST request to get all Administrators");
        return administratorRepository.findAll();
    }

    /**
     * {@code GET  /administrators/:id} : get the "id" administrator.
     *
     * @param id the id of the administrator to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the administrator, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/administrators/{id}")
    public ResponseEntity<Administrator> getAdministrator(@PathVariable Long id) {
        log.debug("REST request to get Administrator : {}", id);
        Optional<Administrator> administrator = administratorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(administrator);
    }

    /**
     * {@code DELETE  /administrators/:id} : delete the "id" administrator.
     *
     * @param id the id of the administrator to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/administrators/{id}")
    public ResponseEntity<Void> deleteAdministrator(@PathVariable Long id) {
        log.debug("REST request to delete Administrator : {}", id);
        administratorRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
