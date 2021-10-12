package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.SmeRepresentative;
import com.baamtu.mdpme.repository.SmeRepresentativeRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.SmeRepresentative}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SmeRepresentativeResource {

    private final Logger log = LoggerFactory.getLogger(SmeRepresentativeResource.class);

    private static final String ENTITY_NAME = "smeRepresentative";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SmeRepresentativeRepository smeRepresentativeRepository;

    public SmeRepresentativeResource(SmeRepresentativeRepository smeRepresentativeRepository) {
        this.smeRepresentativeRepository = smeRepresentativeRepository;
    }

    /**
     * {@code POST  /sme-representatives} : Create a new smeRepresentative.
     *
     * @param smeRepresentative the smeRepresentative to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new smeRepresentative, or with status {@code 400 (Bad Request)} if the smeRepresentative has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sme-representatives")
    public ResponseEntity<SmeRepresentative> createSmeRepresentative(@Valid @RequestBody SmeRepresentative smeRepresentative)
        throws URISyntaxException {
        log.debug("REST request to save SmeRepresentative : {}", smeRepresentative);
        if (smeRepresentative.getId() != null) {
            throw new BadRequestAlertException("A new smeRepresentative cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SmeRepresentative result = smeRepresentativeRepository.save(smeRepresentative);
        return ResponseEntity
            .created(new URI("/api/sme-representatives/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sme-representatives/:id} : Updates an existing smeRepresentative.
     *
     * @param id the id of the smeRepresentative to save.
     * @param smeRepresentative the smeRepresentative to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated smeRepresentative,
     * or with status {@code 400 (Bad Request)} if the smeRepresentative is not valid,
     * or with status {@code 500 (Internal Server Error)} if the smeRepresentative couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sme-representatives/{id}")
    public ResponseEntity<SmeRepresentative> updateSmeRepresentative(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SmeRepresentative smeRepresentative
    ) throws URISyntaxException {
        log.debug("REST request to update SmeRepresentative : {}, {}", id, smeRepresentative);
        if (smeRepresentative.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, smeRepresentative.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!smeRepresentativeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SmeRepresentative result = smeRepresentativeRepository.save(smeRepresentative);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, smeRepresentative.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sme-representatives/:id} : Partial updates given fields of an existing smeRepresentative, field will ignore if it is null
     *
     * @param id the id of the smeRepresentative to save.
     * @param smeRepresentative the smeRepresentative to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated smeRepresentative,
     * or with status {@code 400 (Bad Request)} if the smeRepresentative is not valid,
     * or with status {@code 404 (Not Found)} if the smeRepresentative is not found,
     * or with status {@code 500 (Internal Server Error)} if the smeRepresentative couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sme-representatives/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SmeRepresentative> partialUpdateSmeRepresentative(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SmeRepresentative smeRepresentative
    ) throws URISyntaxException {
        log.debug("REST request to partial update SmeRepresentative partially : {}, {}", id, smeRepresentative);
        if (smeRepresentative.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, smeRepresentative.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!smeRepresentativeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SmeRepresentative> result = smeRepresentativeRepository
            .findById(smeRepresentative.getId())
            .map(existingSmeRepresentative -> {
                if (smeRepresentative.getJobTitle() != null) {
                    existingSmeRepresentative.setJobTitle(smeRepresentative.getJobTitle());
                }
                if (smeRepresentative.getIsAdmin() != null) {
                    existingSmeRepresentative.setIsAdmin(smeRepresentative.getIsAdmin());
                }
                if (smeRepresentative.getIsManager() != null) {
                    existingSmeRepresentative.setIsManager(smeRepresentative.getIsManager());
                }

                return existingSmeRepresentative;
            })
            .map(smeRepresentativeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, smeRepresentative.getId().toString())
        );
    }

    /**
     * {@code GET  /sme-representatives} : get all the smeRepresentatives.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of smeRepresentatives in body.
     */
    @GetMapping("/sme-representatives")
    public List<SmeRepresentative> getAllSmeRepresentatives() {
        log.debug("REST request to get all SmeRepresentatives");
        return smeRepresentativeRepository.findAll();
    }

    /**
     * {@code GET  /sme-representatives/:id} : get the "id" smeRepresentative.
     *
     * @param id the id of the smeRepresentative to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the smeRepresentative, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sme-representatives/{id}")
    public ResponseEntity<SmeRepresentative> getSmeRepresentative(@PathVariable Long id) {
        log.debug("REST request to get SmeRepresentative : {}", id);
        Optional<SmeRepresentative> smeRepresentative = smeRepresentativeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(smeRepresentative);
    }

    /**
     * {@code DELETE  /sme-representatives/:id} : delete the "id" smeRepresentative.
     *
     * @param id the id of the smeRepresentative to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sme-representatives/{id}")
    public ResponseEntity<Void> deleteSmeRepresentative(@PathVariable Long id) {
        log.debug("REST request to delete SmeRepresentative : {}", id);
        smeRepresentativeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
