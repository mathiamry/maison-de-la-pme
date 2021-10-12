package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.SMEHouse;
import com.baamtu.mdpme.repository.SMEHouseRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.SMEHouse}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SMEHouseResource {

    private final Logger log = LoggerFactory.getLogger(SMEHouseResource.class);

    private static final String ENTITY_NAME = "sMEHouse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SMEHouseRepository sMEHouseRepository;

    public SMEHouseResource(SMEHouseRepository sMEHouseRepository) {
        this.sMEHouseRepository = sMEHouseRepository;
    }

    /**
     * {@code POST  /sme-houses} : Create a new sMEHouse.
     *
     * @param sMEHouse the sMEHouse to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sMEHouse, or with status {@code 400 (Bad Request)} if the sMEHouse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sme-houses")
    public ResponseEntity<SMEHouse> createSMEHouse(@Valid @RequestBody SMEHouse sMEHouse) throws URISyntaxException {
        log.debug("REST request to save SMEHouse : {}", sMEHouse);
        if (sMEHouse.getId() != null) {
            throw new BadRequestAlertException("A new sMEHouse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SMEHouse result = sMEHouseRepository.save(sMEHouse);
        return ResponseEntity
            .created(new URI("/api/sme-houses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sme-houses/:id} : Updates an existing sMEHouse.
     *
     * @param id the id of the sMEHouse to save.
     * @param sMEHouse the sMEHouse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sMEHouse,
     * or with status {@code 400 (Bad Request)} if the sMEHouse is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sMEHouse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sme-houses/{id}")
    public ResponseEntity<SMEHouse> updateSMEHouse(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SMEHouse sMEHouse
    ) throws URISyntaxException {
        log.debug("REST request to update SMEHouse : {}, {}", id, sMEHouse);
        if (sMEHouse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sMEHouse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sMEHouseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SMEHouse result = sMEHouseRepository.save(sMEHouse);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sMEHouse.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sme-houses/:id} : Partial updates given fields of an existing sMEHouse, field will ignore if it is null
     *
     * @param id the id of the sMEHouse to save.
     * @param sMEHouse the sMEHouse to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sMEHouse,
     * or with status {@code 400 (Bad Request)} if the sMEHouse is not valid,
     * or with status {@code 404 (Not Found)} if the sMEHouse is not found,
     * or with status {@code 500 (Internal Server Error)} if the sMEHouse couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sme-houses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SMEHouse> partialUpdateSMEHouse(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SMEHouse sMEHouse
    ) throws URISyntaxException {
        log.debug("REST request to partial update SMEHouse partially : {}, {}", id, sMEHouse);
        if (sMEHouse.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sMEHouse.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sMEHouseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SMEHouse> result = sMEHouseRepository
            .findById(sMEHouse.getId())
            .map(existingSMEHouse -> {
                if (sMEHouse.getName() != null) {
                    existingSMEHouse.setName(sMEHouse.getName());
                }
                if (sMEHouse.getDescription() != null) {
                    existingSMEHouse.setDescription(sMEHouse.getDescription());
                }
                if (sMEHouse.getAddress() != null) {
                    existingSMEHouse.setAddress(sMEHouse.getAddress());
                }
                if (sMEHouse.getEmail() != null) {
                    existingSMEHouse.setEmail(sMEHouse.getEmail());
                }
                if (sMEHouse.getPhone() != null) {
                    existingSMEHouse.setPhone(sMEHouse.getPhone());
                }

                return existingSMEHouse;
            })
            .map(sMEHouseRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sMEHouse.getId().toString())
        );
    }

    /**
     * {@code GET  /sme-houses} : get all the sMEHouses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sMEHouses in body.
     */
    @GetMapping("/sme-houses")
    public List<SMEHouse> getAllSMEHouses() {
        log.debug("REST request to get all SMEHouses");
        return sMEHouseRepository.findAll();
    }

    /**
     * {@code GET  /sme-houses/:id} : get the "id" sMEHouse.
     *
     * @param id the id of the sMEHouse to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sMEHouse, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sme-houses/{id}")
    public ResponseEntity<SMEHouse> getSMEHouse(@PathVariable Long id) {
        log.debug("REST request to get SMEHouse : {}", id);
        Optional<SMEHouse> sMEHouse = sMEHouseRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sMEHouse);
    }

    /**
     * {@code DELETE  /sme-houses/:id} : delete the "id" sMEHouse.
     *
     * @param id the id of the sMEHouse to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sme-houses/{id}")
    public ResponseEntity<Void> deleteSMEHouse(@PathVariable Long id) {
        log.debug("REST request to delete SMEHouse : {}", id);
        sMEHouseRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
