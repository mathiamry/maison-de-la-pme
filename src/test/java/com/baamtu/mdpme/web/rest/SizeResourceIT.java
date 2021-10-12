package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Size;
import com.baamtu.mdpme.repository.SizeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SizeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SizeResourceIT {

    private static final Integer DEFAULT_MIN = 1;
    private static final Integer UPDATED_MIN = 2;

    private static final Integer DEFAULT_MAX = 1;
    private static final Integer UPDATED_MAX = 2;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sizes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SizeRepository sizeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSizeMockMvc;

    private Size size;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Size createEntity(EntityManager em) {
        Size size = new Size().min(DEFAULT_MIN).max(DEFAULT_MAX).description(DEFAULT_DESCRIPTION);
        return size;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Size createUpdatedEntity(EntityManager em) {
        Size size = new Size().min(UPDATED_MIN).max(UPDATED_MAX).description(UPDATED_DESCRIPTION);
        return size;
    }

    @BeforeEach
    public void initTest() {
        size = createEntity(em);
    }

    @Test
    @Transactional
    void createSize() throws Exception {
        int databaseSizeBeforeCreate = sizeRepository.findAll().size();
        // Create the Size
        restSizeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(size)))
            .andExpect(status().isCreated());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeCreate + 1);
        Size testSize = sizeList.get(sizeList.size() - 1);
        assertThat(testSize.getMin()).isEqualTo(DEFAULT_MIN);
        assertThat(testSize.getMax()).isEqualTo(DEFAULT_MAX);
        assertThat(testSize.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createSizeWithExistingId() throws Exception {
        // Create the Size with an existing ID
        size.setId(1L);

        int databaseSizeBeforeCreate = sizeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSizeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(size)))
            .andExpect(status().isBadRequest());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSizes() throws Exception {
        // Initialize the database
        sizeRepository.saveAndFlush(size);

        // Get all the sizeList
        restSizeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(size.getId().intValue())))
            .andExpect(jsonPath("$.[*].min").value(hasItem(DEFAULT_MIN)))
            .andExpect(jsonPath("$.[*].max").value(hasItem(DEFAULT_MAX)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getSize() throws Exception {
        // Initialize the database
        sizeRepository.saveAndFlush(size);

        // Get the size
        restSizeMockMvc
            .perform(get(ENTITY_API_URL_ID, size.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(size.getId().intValue()))
            .andExpect(jsonPath("$.min").value(DEFAULT_MIN))
            .andExpect(jsonPath("$.max").value(DEFAULT_MAX))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingSize() throws Exception {
        // Get the size
        restSizeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSize() throws Exception {
        // Initialize the database
        sizeRepository.saveAndFlush(size);

        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();

        // Update the size
        Size updatedSize = sizeRepository.findById(size.getId()).get();
        // Disconnect from session so that the updates on updatedSize are not directly saved in db
        em.detach(updatedSize);
        updatedSize.min(UPDATED_MIN).max(UPDATED_MAX).description(UPDATED_DESCRIPTION);

        restSizeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSize.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSize))
            )
            .andExpect(status().isOk());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
        Size testSize = sizeList.get(sizeList.size() - 1);
        assertThat(testSize.getMin()).isEqualTo(UPDATED_MIN);
        assertThat(testSize.getMax()).isEqualTo(UPDATED_MAX);
        assertThat(testSize.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingSize() throws Exception {
        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();
        size.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSizeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, size.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(size))
            )
            .andExpect(status().isBadRequest());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSize() throws Exception {
        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();
        size.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSizeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(size))
            )
            .andExpect(status().isBadRequest());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSize() throws Exception {
        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();
        size.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSizeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(size)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSizeWithPatch() throws Exception {
        // Initialize the database
        sizeRepository.saveAndFlush(size);

        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();

        // Update the size using partial update
        Size partialUpdatedSize = new Size();
        partialUpdatedSize.setId(size.getId());

        partialUpdatedSize.max(UPDATED_MAX).description(UPDATED_DESCRIPTION);

        restSizeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSize.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSize))
            )
            .andExpect(status().isOk());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
        Size testSize = sizeList.get(sizeList.size() - 1);
        assertThat(testSize.getMin()).isEqualTo(DEFAULT_MIN);
        assertThat(testSize.getMax()).isEqualTo(UPDATED_MAX);
        assertThat(testSize.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateSizeWithPatch() throws Exception {
        // Initialize the database
        sizeRepository.saveAndFlush(size);

        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();

        // Update the size using partial update
        Size partialUpdatedSize = new Size();
        partialUpdatedSize.setId(size.getId());

        partialUpdatedSize.min(UPDATED_MIN).max(UPDATED_MAX).description(UPDATED_DESCRIPTION);

        restSizeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSize.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSize))
            )
            .andExpect(status().isOk());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
        Size testSize = sizeList.get(sizeList.size() - 1);
        assertThat(testSize.getMin()).isEqualTo(UPDATED_MIN);
        assertThat(testSize.getMax()).isEqualTo(UPDATED_MAX);
        assertThat(testSize.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingSize() throws Exception {
        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();
        size.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSizeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, size.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(size))
            )
            .andExpect(status().isBadRequest());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSize() throws Exception {
        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();
        size.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSizeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(size))
            )
            .andExpect(status().isBadRequest());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSize() throws Exception {
        int databaseSizeBeforeUpdate = sizeRepository.findAll().size();
        size.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSizeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(size)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Size in the database
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSize() throws Exception {
        // Initialize the database
        sizeRepository.saveAndFlush(size);

        int databaseSizeBeforeDelete = sizeRepository.findAll().size();

        // Delete the size
        restSizeMockMvc
            .perform(delete(ENTITY_API_URL_ID, size.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Size> sizeList = sizeRepository.findAll();
        assertThat(sizeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
