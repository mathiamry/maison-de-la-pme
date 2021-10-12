package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.Anonymous;
import com.baamtu.mdpme.repository.AnonymousRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.Anonymous}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AnonymousResource {

    private final Logger log = LoggerFactory.getLogger(AnonymousResource.class);

    private static final String ENTITY_NAME = "anonymous";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnonymousRepository anonymousRepository;

    public AnonymousResource(AnonymousRepository anonymousRepository) {
        this.anonymousRepository = anonymousRepository;
    }

    /**
     * {@code POST  /anonymous} : Create a new anonymous.
     *
     * @param anonymous the anonymous to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new anonymous, or with status {@code 400 (Bad Request)} if the anonymous has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/anonymous")
    public ResponseEntity<Anonymous> createAnonymous(@Valid @RequestBody Anonymous anonymous) throws URISyntaxException {
        log.debug("REST request to save Anonymous : {}", anonymous);
        if (anonymous.getId() != null) {
            throw new BadRequestAlertException("A new anonymous cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Anonymous result = anonymousRepository.save(anonymous);
        return ResponseEntity
            .created(new URI("/api/anonymous/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /anonymous/:id} : Updates an existing anonymous.
     *
     * @param id the id of the anonymous to save.
     * @param anonymous the anonymous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anonymous,
     * or with status {@code 400 (Bad Request)} if the anonymous is not valid,
     * or with status {@code 500 (Internal Server Error)} if the anonymous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/anonymous/{id}")
    public ResponseEntity<Anonymous> updateAnonymous(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Anonymous anonymous
    ) throws URISyntaxException {
        log.debug("REST request to update Anonymous : {}, {}", id, anonymous);
        if (anonymous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anonymous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!anonymousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Anonymous result = anonymousRepository.save(anonymous);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, anonymous.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /anonymous/:id} : Partial updates given fields of an existing anonymous, field will ignore if it is null
     *
     * @param id the id of the anonymous to save.
     * @param anonymous the anonymous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anonymous,
     * or with status {@code 400 (Bad Request)} if the anonymous is not valid,
     * or with status {@code 404 (Not Found)} if the anonymous is not found,
     * or with status {@code 500 (Internal Server Error)} if the anonymous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/anonymous/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Anonymous> partialUpdateAnonymous(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Anonymous anonymous
    ) throws URISyntaxException {
        log.debug("REST request to partial update Anonymous partially : {}, {}", id, anonymous);
        if (anonymous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anonymous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!anonymousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Anonymous> result = anonymousRepository
            .findById(anonymous.getId())
            .map(existingAnonymous -> {
                if (anonymous.getVisitDate() != null) {
                    existingAnonymous.setVisitDate(anonymous.getVisitDate());
                }

                return existingAnonymous;
            })
            .map(anonymousRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, anonymous.getId().toString())
        );
    }

    /**
     * {@code GET  /anonymous} : get all the anonymous.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of anonymous in body.
     */
    @GetMapping("/anonymous")
    public List<Anonymous> getAllAnonymous() {
        log.debug("REST request to get all Anonymous");
        return anonymousRepository.findAll();
    }

    /**
     * {@code GET  /anonymous/:id} : get the "id" anonymous.
     *
     * @param id the id of the anonymous to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the anonymous, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/anonymous/{id}")
    public ResponseEntity<Anonymous> getAnonymous(@PathVariable Long id) {
        log.debug("REST request to get Anonymous : {}", id);
        Optional<Anonymous> anonymous = anonymousRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(anonymous);
    }

    /**
     * {@code DELETE  /anonymous/:id} : delete the "id" anonymous.
     *
     * @param id the id of the anonymous to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/anonymous/{id}")
    public ResponseEntity<Void> deleteAnonymous(@PathVariable Long id) {
        log.debug("REST request to delete Anonymous : {}", id);
        anonymousRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
