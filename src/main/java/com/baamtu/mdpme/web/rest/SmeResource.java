package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.Sme;
import com.baamtu.mdpme.repository.SmeRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.Sme}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SmeResource {

    private final Logger log = LoggerFactory.getLogger(SmeResource.class);

    private static final String ENTITY_NAME = "sme";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SmeRepository smeRepository;

    public SmeResource(SmeRepository smeRepository) {
        this.smeRepository = smeRepository;
    }

    /**
     * {@code POST  /smes} : Create a new sme.
     *
     * @param sme the sme to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sme, or with status {@code 400 (Bad Request)} if the sme has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/smes")
    public ResponseEntity<Sme> createSme(@Valid @RequestBody Sme sme) throws URISyntaxException {
        log.debug("REST request to save Sme : {}", sme);
        if (sme.getId() != null) {
            throw new BadRequestAlertException("A new sme cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sme result = smeRepository.save(sme);
        return ResponseEntity
            .created(new URI("/api/smes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /smes/:id} : Updates an existing sme.
     *
     * @param id the id of the sme to save.
     * @param sme the sme to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sme,
     * or with status {@code 400 (Bad Request)} if the sme is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sme couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/smes/{id}")
    public ResponseEntity<Sme> updateSme(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Sme sme)
        throws URISyntaxException {
        log.debug("REST request to update Sme : {}, {}", id, sme);
        if (sme.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sme.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!smeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sme result = smeRepository.save(sme);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sme.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /smes/:id} : Partial updates given fields of an existing sme, field will ignore if it is null
     *
     * @param id the id of the sme to save.
     * @param sme the sme to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sme,
     * or with status {@code 400 (Bad Request)} if the sme is not valid,
     * or with status {@code 404 (Not Found)} if the sme is not found,
     * or with status {@code 500 (Internal Server Error)} if the sme couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/smes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Sme> partialUpdateSme(@PathVariable(value = "id", required = false) final Long id, @NotNull @RequestBody Sme sme)
        throws URISyntaxException {
        log.debug("REST request to partial update Sme partially : {}, {}", id, sme);
        if (sme.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sme.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!smeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sme> result = smeRepository
            .findById(sme.getId())
            .map(existingSme -> {
                if (sme.getName() != null) {
                    existingSme.setName(sme.getName());
                }
                if (sme.getEmail() != null) {
                    existingSme.setEmail(sme.getEmail());
                }
                if (sme.getPhone() != null) {
                    existingSme.setPhone(sme.getPhone());
                }
                if (sme.getPhone2() != null) {
                    existingSme.setPhone2(sme.getPhone2());
                }
                if (sme.getLogo() != null) {
                    existingSme.setLogo(sme.getLogo());
                }
                if (sme.getAddress() != null) {
                    existingSme.setAddress(sme.getAddress());
                }
                if (sme.getLatitude() != null) {
                    existingSme.setLatitude(sme.getLatitude());
                }
                if (sme.getLongitude() != null) {
                    existingSme.setLongitude(sme.getLongitude());
                }
                if (sme.getWebSite() != null) {
                    existingSme.setWebSite(sme.getWebSite());
                }
                if (sme.getSmeImmatriculationNumber() != null) {
                    existingSme.setSmeImmatriculationNumber(sme.getSmeImmatriculationNumber());
                }
                if (sme.getIsClient() != null) {
                    existingSme.setIsClient(sme.getIsClient());
                }
                if (sme.getIsAuthorized() != null) {
                    existingSme.setIsAuthorized(sme.getIsAuthorized());
                }
                if (sme.getTermsOfUse() != null) {
                    existingSme.setTermsOfUse(sme.getTermsOfUse());
                }
                if (sme.getIsValid() != null) {
                    existingSme.setIsValid(sme.getIsValid());
                }

                return existingSme;
            })
            .map(smeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sme.getId().toString())
        );
    }

    /**
     * {@code GET  /smes} : get all the smes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of smes in body.
     */
    @GetMapping("/smes")
    public List<Sme> getAllSmes() {
        log.debug("REST request to get all Smes");
        return smeRepository.findAll();
    }

    /**
     * {@code GET  /smes/:id} : get the "id" sme.
     *
     * @param id the id of the sme to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sme, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/smes/{id}")
    public ResponseEntity<Sme> getSme(@PathVariable Long id) {
        log.debug("REST request to get Sme : {}", id);
        Optional<Sme> sme = smeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(sme);
    }

    /**
     * {@code DELETE  /smes/:id} : delete the "id" sme.
     *
     * @param id the id of the sme to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/smes/{id}")
    public ResponseEntity<Void> deleteSme(@PathVariable Long id) {
        log.debug("REST request to delete Sme : {}", id);
        smeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
