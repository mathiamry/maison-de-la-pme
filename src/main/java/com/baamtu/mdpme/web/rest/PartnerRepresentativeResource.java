package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.PartnerRepresentative;
import com.baamtu.mdpme.repository.PartnerRepresentativeRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.PartnerRepresentative}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PartnerRepresentativeResource {

    private final Logger log = LoggerFactory.getLogger(PartnerRepresentativeResource.class);

    private static final String ENTITY_NAME = "partnerRepresentative";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PartnerRepresentativeRepository partnerRepresentativeRepository;

    public PartnerRepresentativeResource(PartnerRepresentativeRepository partnerRepresentativeRepository) {
        this.partnerRepresentativeRepository = partnerRepresentativeRepository;
    }

    /**
     * {@code POST  /partner-representatives} : Create a new partnerRepresentative.
     *
     * @param partnerRepresentative the partnerRepresentative to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new partnerRepresentative, or with status {@code 400 (Bad Request)} if the partnerRepresentative has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/partner-representatives")
    public ResponseEntity<PartnerRepresentative> createPartnerRepresentative(
        @Valid @RequestBody PartnerRepresentative partnerRepresentative
    ) throws URISyntaxException {
        log.debug("REST request to save PartnerRepresentative : {}", partnerRepresentative);
        if (partnerRepresentative.getId() != null) {
            throw new BadRequestAlertException("A new partnerRepresentative cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PartnerRepresentative result = partnerRepresentativeRepository.save(partnerRepresentative);
        return ResponseEntity
            .created(new URI("/api/partner-representatives/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /partner-representatives/:id} : Updates an existing partnerRepresentative.
     *
     * @param id the id of the partnerRepresentative to save.
     * @param partnerRepresentative the partnerRepresentative to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated partnerRepresentative,
     * or with status {@code 400 (Bad Request)} if the partnerRepresentative is not valid,
     * or with status {@code 500 (Internal Server Error)} if the partnerRepresentative couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/partner-representatives/{id}")
    public ResponseEntity<PartnerRepresentative> updatePartnerRepresentative(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody PartnerRepresentative partnerRepresentative
    ) throws URISyntaxException {
        log.debug("REST request to update PartnerRepresentative : {}, {}", id, partnerRepresentative);
        if (partnerRepresentative.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, partnerRepresentative.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!partnerRepresentativeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PartnerRepresentative result = partnerRepresentativeRepository.save(partnerRepresentative);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, partnerRepresentative.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /partner-representatives/:id} : Partial updates given fields of an existing partnerRepresentative, field will ignore if it is null
     *
     * @param id the id of the partnerRepresentative to save.
     * @param partnerRepresentative the partnerRepresentative to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated partnerRepresentative,
     * or with status {@code 400 (Bad Request)} if the partnerRepresentative is not valid,
     * or with status {@code 404 (Not Found)} if the partnerRepresentative is not found,
     * or with status {@code 500 (Internal Server Error)} if the partnerRepresentative couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/partner-representatives/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PartnerRepresentative> partialUpdatePartnerRepresentative(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody PartnerRepresentative partnerRepresentative
    ) throws URISyntaxException {
        log.debug("REST request to partial update PartnerRepresentative partially : {}, {}", id, partnerRepresentative);
        if (partnerRepresentative.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, partnerRepresentative.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!partnerRepresentativeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PartnerRepresentative> result = partnerRepresentativeRepository
            .findById(partnerRepresentative.getId())
            .map(existingPartnerRepresentative -> {
                if (partnerRepresentative.getJobTitle() != null) {
                    existingPartnerRepresentative.setJobTitle(partnerRepresentative.getJobTitle());
                }
                if (partnerRepresentative.getDescription() != null) {
                    existingPartnerRepresentative.setDescription(partnerRepresentative.getDescription());
                }

                return existingPartnerRepresentative;
            })
            .map(partnerRepresentativeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, partnerRepresentative.getId().toString())
        );
    }

    /**
     * {@code GET  /partner-representatives} : get all the partnerRepresentatives.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of partnerRepresentatives in body.
     */
    @GetMapping("/partner-representatives")
    public List<PartnerRepresentative> getAllPartnerRepresentatives() {
        log.debug("REST request to get all PartnerRepresentatives");
        return partnerRepresentativeRepository.findAll();
    }

    /**
     * {@code GET  /partner-representatives/:id} : get the "id" partnerRepresentative.
     *
     * @param id the id of the partnerRepresentative to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the partnerRepresentative, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/partner-representatives/{id}")
    public ResponseEntity<PartnerRepresentative> getPartnerRepresentative(@PathVariable Long id) {
        log.debug("REST request to get PartnerRepresentative : {}", id);
        Optional<PartnerRepresentative> partnerRepresentative = partnerRepresentativeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(partnerRepresentative);
    }

    /**
     * {@code DELETE  /partner-representatives/:id} : delete the "id" partnerRepresentative.
     *
     * @param id the id of the partnerRepresentative to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/partner-representatives/{id}")
    public ResponseEntity<Void> deletePartnerRepresentative(@PathVariable Long id) {
        log.debug("REST request to delete PartnerRepresentative : {}", id);
        partnerRepresentativeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
