package com.baamtu.mdpme.web.rest;

import com.baamtu.mdpme.domain.Size;
import com.baamtu.mdpme.repository.SizeRepository;
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
 * REST controller for managing {@link com.baamtu.mdpme.domain.Size}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SizeResource {

    private final Logger log = LoggerFactory.getLogger(SizeResource.class);

    private static final String ENTITY_NAME = "size";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SizeRepository sizeRepository;

    public SizeResource(SizeRepository sizeRepository) {
        this.sizeRepository = sizeRepository;
    }

    /**
     * {@code POST  /sizes} : Create a new size.
     *
     * @param size the size to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new size, or with status {@code 400 (Bad Request)} if the size has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sizes")
    public ResponseEntity<Size> createSize(@RequestBody Size size) throws URISyntaxException {
        log.debug("REST request to save Size : {}", size);
        if (size.getId() != null) {
            throw new BadRequestAlertException("A new size cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Size result = sizeRepository.save(size);
        return ResponseEntity
            .created(new URI("/api/sizes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sizes/:id} : Updates an existing size.
     *
     * @param id the id of the size to save.
     * @param size the size to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated size,
     * or with status {@code 400 (Bad Request)} if the size is not valid,
     * or with status {@code 500 (Internal Server Error)} if the size couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sizes/{id}")
    public ResponseEntity<Size> updateSize(@PathVariable(value = "id", required = false) final Long id, @RequestBody Size size)
        throws URISyntaxException {
        log.debug("REST request to update Size : {}, {}", id, size);
        if (size.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, size.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sizeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Size result = sizeRepository.save(size);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, size.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sizes/:id} : Partial updates given fields of an existing size, field will ignore if it is null
     *
     * @param id the id of the size to save.
     * @param size the size to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated size,
     * or with status {@code 400 (Bad Request)} if the size is not valid,
     * or with status {@code 404 (Not Found)} if the size is not found,
     * or with status {@code 500 (Internal Server Error)} if the size couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sizes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Size> partialUpdateSize(@PathVariable(value = "id", required = false) final Long id, @RequestBody Size size)
        throws URISyntaxException {
        log.debug("REST request to partial update Size partially : {}, {}", id, size);
        if (size.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, size.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sizeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Size> result = sizeRepository
            .findById(size.getId())
            .map(existingSize -> {
                if (size.getMin() != null) {
                    existingSize.setMin(size.getMin());
                }
                if (size.getMax() != null) {
                    existingSize.setMax(size.getMax());
                }
                if (size.getDescription() != null) {
                    existingSize.setDescription(size.getDescription());
                }

                return existingSize;
            })
            .map(sizeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, size.getId().toString())
        );
    }

    /**
     * {@code GET  /sizes} : get all the sizes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sizes in body.
     */
    @GetMapping("/sizes")
    public List<Size> getAllSizes() {
        log.debug("REST request to get all Sizes");
        return sizeRepository.findAll();
    }

    /**
     * {@code GET  /sizes/:id} : get the "id" size.
     *
     * @param id the id of the size to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the size, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sizes/{id}")
    public ResponseEntity<Size> getSize(@PathVariable Long id) {
        log.debug("REST request to get Size : {}", id);
        Optional<Size> size = sizeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(size);
    }

    /**
     * {@code DELETE  /sizes/:id} : delete the "id" size.
     *
     * @param id the id of the size to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sizes/{id}")
    public ResponseEntity<Void> deleteSize(@PathVariable Long id) {
        log.debug("REST request to delete Size : {}", id);
        sizeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
