package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.ActivityArea;
import com.baamtu.mdpme.repository.ActivityAreaRepository;
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
 * Integration tests for the {@link ActivityAreaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ActivityAreaResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/activity-areas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ActivityAreaRepository activityAreaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restActivityAreaMockMvc;

    private ActivityArea activityArea;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityArea createEntity(EntityManager em) {
        ActivityArea activityArea = new ActivityArea().name(DEFAULT_NAME);
        return activityArea;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ActivityArea createUpdatedEntity(EntityManager em) {
        ActivityArea activityArea = new ActivityArea().name(UPDATED_NAME);
        return activityArea;
    }

    @BeforeEach
    public void initTest() {
        activityArea = createEntity(em);
    }

    @Test
    @Transactional
    void createActivityArea() throws Exception {
        int databaseSizeBeforeCreate = activityAreaRepository.findAll().size();
        // Create the ActivityArea
        restActivityAreaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityArea)))
            .andExpect(status().isCreated());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeCreate + 1);
        ActivityArea testActivityArea = activityAreaList.get(activityAreaList.size() - 1);
        assertThat(testActivityArea.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createActivityAreaWithExistingId() throws Exception {
        // Create the ActivityArea with an existing ID
        activityArea.setId(1L);

        int databaseSizeBeforeCreate = activityAreaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restActivityAreaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityArea)))
            .andExpect(status().isBadRequest());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = activityAreaRepository.findAll().size();
        // set the field null
        activityArea.setName(null);

        // Create the ActivityArea, which fails.

        restActivityAreaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityArea)))
            .andExpect(status().isBadRequest());

        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllActivityAreas() throws Exception {
        // Initialize the database
        activityAreaRepository.saveAndFlush(activityArea);

        // Get all the activityAreaList
        restActivityAreaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(activityArea.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getActivityArea() throws Exception {
        // Initialize the database
        activityAreaRepository.saveAndFlush(activityArea);

        // Get the activityArea
        restActivityAreaMockMvc
            .perform(get(ENTITY_API_URL_ID, activityArea.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(activityArea.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingActivityArea() throws Exception {
        // Get the activityArea
        restActivityAreaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewActivityArea() throws Exception {
        // Initialize the database
        activityAreaRepository.saveAndFlush(activityArea);

        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();

        // Update the activityArea
        ActivityArea updatedActivityArea = activityAreaRepository.findById(activityArea.getId()).get();
        // Disconnect from session so that the updates on updatedActivityArea are not directly saved in db
        em.detach(updatedActivityArea);
        updatedActivityArea.name(UPDATED_NAME);

        restActivityAreaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedActivityArea.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedActivityArea))
            )
            .andExpect(status().isOk());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
        ActivityArea testActivityArea = activityAreaList.get(activityAreaList.size() - 1);
        assertThat(testActivityArea.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingActivityArea() throws Exception {
        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();
        activityArea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityAreaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, activityArea.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchActivityArea() throws Exception {
        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();
        activityArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityAreaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(activityArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamActivityArea() throws Exception {
        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();
        activityArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityAreaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(activityArea)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateActivityAreaWithPatch() throws Exception {
        // Initialize the database
        activityAreaRepository.saveAndFlush(activityArea);

        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();

        // Update the activityArea using partial update
        ActivityArea partialUpdatedActivityArea = new ActivityArea();
        partialUpdatedActivityArea.setId(activityArea.getId());

        partialUpdatedActivityArea.name(UPDATED_NAME);

        restActivityAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityArea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityArea))
            )
            .andExpect(status().isOk());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
        ActivityArea testActivityArea = activityAreaList.get(activityAreaList.size() - 1);
        assertThat(testActivityArea.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateActivityAreaWithPatch() throws Exception {
        // Initialize the database
        activityAreaRepository.saveAndFlush(activityArea);

        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();

        // Update the activityArea using partial update
        ActivityArea partialUpdatedActivityArea = new ActivityArea();
        partialUpdatedActivityArea.setId(activityArea.getId());

        partialUpdatedActivityArea.name(UPDATED_NAME);

        restActivityAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedActivityArea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedActivityArea))
            )
            .andExpect(status().isOk());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
        ActivityArea testActivityArea = activityAreaList.get(activityAreaList.size() - 1);
        assertThat(testActivityArea.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingActivityArea() throws Exception {
        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();
        activityArea.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restActivityAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, activityArea.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchActivityArea() throws Exception {
        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();
        activityArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityAreaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(activityArea))
            )
            .andExpect(status().isBadRequest());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamActivityArea() throws Exception {
        int databaseSizeBeforeUpdate = activityAreaRepository.findAll().size();
        activityArea.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restActivityAreaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(activityArea))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ActivityArea in the database
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteActivityArea() throws Exception {
        // Initialize the database
        activityAreaRepository.saveAndFlush(activityArea);

        int databaseSizeBeforeDelete = activityAreaRepository.findAll().size();

        // Delete the activityArea
        restActivityAreaMockMvc
            .perform(delete(ENTITY_API_URL_ID, activityArea.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ActivityArea> activityAreaList = activityAreaRepository.findAll();
        assertThat(activityAreaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
