package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.UnavailabilityPeriod;
import com.baamtu.mdpme.repository.UnavailabilityPeriodRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UnavailabilityPeriodResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class UnavailabilityPeriodResourceIT {

    private static final Instant DEFAULT_START_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/unavailability-periods";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UnavailabilityPeriodRepository unavailabilityPeriodRepository;

    @Mock
    private UnavailabilityPeriodRepository unavailabilityPeriodRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUnavailabilityPeriodMockMvc;

    private UnavailabilityPeriod unavailabilityPeriod;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnavailabilityPeriod createEntity(EntityManager em) {
        UnavailabilityPeriod unavailabilityPeriod = new UnavailabilityPeriod().startTime(DEFAULT_START_TIME).endTime(DEFAULT_END_TIME);
        return unavailabilityPeriod;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UnavailabilityPeriod createUpdatedEntity(EntityManager em) {
        UnavailabilityPeriod unavailabilityPeriod = new UnavailabilityPeriod().startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);
        return unavailabilityPeriod;
    }

    @BeforeEach
    public void initTest() {
        unavailabilityPeriod = createEntity(em);
    }

    @Test
    @Transactional
    void createUnavailabilityPeriod() throws Exception {
        int databaseSizeBeforeCreate = unavailabilityPeriodRepository.findAll().size();
        // Create the UnavailabilityPeriod
        restUnavailabilityPeriodMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isCreated());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeCreate + 1);
        UnavailabilityPeriod testUnavailabilityPeriod = unavailabilityPeriodList.get(unavailabilityPeriodList.size() - 1);
        assertThat(testUnavailabilityPeriod.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testUnavailabilityPeriod.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void createUnavailabilityPeriodWithExistingId() throws Exception {
        // Create the UnavailabilityPeriod with an existing ID
        unavailabilityPeriod.setId(1L);

        int databaseSizeBeforeCreate = unavailabilityPeriodRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUnavailabilityPeriodMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUnavailabilityPeriods() throws Exception {
        // Initialize the database
        unavailabilityPeriodRepository.saveAndFlush(unavailabilityPeriod);

        // Get all the unavailabilityPeriodList
        restUnavailabilityPeriodMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(unavailabilityPeriod.getId().intValue())))
            .andExpect(jsonPath("$.[*].startTime").value(hasItem(DEFAULT_START_TIME.toString())))
            .andExpect(jsonPath("$.[*].endTime").value(hasItem(DEFAULT_END_TIME.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUnavailabilityPeriodsWithEagerRelationshipsIsEnabled() throws Exception {
        when(unavailabilityPeriodRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUnavailabilityPeriodMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(unavailabilityPeriodRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllUnavailabilityPeriodsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(unavailabilityPeriodRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restUnavailabilityPeriodMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(unavailabilityPeriodRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getUnavailabilityPeriod() throws Exception {
        // Initialize the database
        unavailabilityPeriodRepository.saveAndFlush(unavailabilityPeriod);

        // Get the unavailabilityPeriod
        restUnavailabilityPeriodMockMvc
            .perform(get(ENTITY_API_URL_ID, unavailabilityPeriod.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(unavailabilityPeriod.getId().intValue()))
            .andExpect(jsonPath("$.startTime").value(DEFAULT_START_TIME.toString()))
            .andExpect(jsonPath("$.endTime").value(DEFAULT_END_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingUnavailabilityPeriod() throws Exception {
        // Get the unavailabilityPeriod
        restUnavailabilityPeriodMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUnavailabilityPeriod() throws Exception {
        // Initialize the database
        unavailabilityPeriodRepository.saveAndFlush(unavailabilityPeriod);

        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();

        // Update the unavailabilityPeriod
        UnavailabilityPeriod updatedUnavailabilityPeriod = unavailabilityPeriodRepository.findById(unavailabilityPeriod.getId()).get();
        // Disconnect from session so that the updates on updatedUnavailabilityPeriod are not directly saved in db
        em.detach(updatedUnavailabilityPeriod);
        updatedUnavailabilityPeriod.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restUnavailabilityPeriodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUnavailabilityPeriod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUnavailabilityPeriod))
            )
            .andExpect(status().isOk());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
        UnavailabilityPeriod testUnavailabilityPeriod = unavailabilityPeriodList.get(unavailabilityPeriodList.size() - 1);
        assertThat(testUnavailabilityPeriod.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testUnavailabilityPeriod.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void putNonExistingUnavailabilityPeriod() throws Exception {
        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();
        unavailabilityPeriod.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnavailabilityPeriodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, unavailabilityPeriod.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUnavailabilityPeriod() throws Exception {
        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();
        unavailabilityPeriod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnavailabilityPeriodMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUnavailabilityPeriod() throws Exception {
        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();
        unavailabilityPeriod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnavailabilityPeriodMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUnavailabilityPeriodWithPatch() throws Exception {
        // Initialize the database
        unavailabilityPeriodRepository.saveAndFlush(unavailabilityPeriod);

        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();

        // Update the unavailabilityPeriod using partial update
        UnavailabilityPeriod partialUpdatedUnavailabilityPeriod = new UnavailabilityPeriod();
        partialUpdatedUnavailabilityPeriod.setId(unavailabilityPeriod.getId());

        restUnavailabilityPeriodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnavailabilityPeriod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUnavailabilityPeriod))
            )
            .andExpect(status().isOk());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
        UnavailabilityPeriod testUnavailabilityPeriod = unavailabilityPeriodList.get(unavailabilityPeriodList.size() - 1);
        assertThat(testUnavailabilityPeriod.getStartTime()).isEqualTo(DEFAULT_START_TIME);
        assertThat(testUnavailabilityPeriod.getEndTime()).isEqualTo(DEFAULT_END_TIME);
    }

    @Test
    @Transactional
    void fullUpdateUnavailabilityPeriodWithPatch() throws Exception {
        // Initialize the database
        unavailabilityPeriodRepository.saveAndFlush(unavailabilityPeriod);

        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();

        // Update the unavailabilityPeriod using partial update
        UnavailabilityPeriod partialUpdatedUnavailabilityPeriod = new UnavailabilityPeriod();
        partialUpdatedUnavailabilityPeriod.setId(unavailabilityPeriod.getId());

        partialUpdatedUnavailabilityPeriod.startTime(UPDATED_START_TIME).endTime(UPDATED_END_TIME);

        restUnavailabilityPeriodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnavailabilityPeriod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUnavailabilityPeriod))
            )
            .andExpect(status().isOk());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
        UnavailabilityPeriod testUnavailabilityPeriod = unavailabilityPeriodList.get(unavailabilityPeriodList.size() - 1);
        assertThat(testUnavailabilityPeriod.getStartTime()).isEqualTo(UPDATED_START_TIME);
        assertThat(testUnavailabilityPeriod.getEndTime()).isEqualTo(UPDATED_END_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingUnavailabilityPeriod() throws Exception {
        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();
        unavailabilityPeriod.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnavailabilityPeriodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, unavailabilityPeriod.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUnavailabilityPeriod() throws Exception {
        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();
        unavailabilityPeriod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnavailabilityPeriodMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isBadRequest());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUnavailabilityPeriod() throws Exception {
        int databaseSizeBeforeUpdate = unavailabilityPeriodRepository.findAll().size();
        unavailabilityPeriod.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnavailabilityPeriodMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(unavailabilityPeriod))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the UnavailabilityPeriod in the database
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUnavailabilityPeriod() throws Exception {
        // Initialize the database
        unavailabilityPeriodRepository.saveAndFlush(unavailabilityPeriod);

        int databaseSizeBeforeDelete = unavailabilityPeriodRepository.findAll().size();

        // Delete the unavailabilityPeriod
        restUnavailabilityPeriodMockMvc
            .perform(delete(ENTITY_API_URL_ID, unavailabilityPeriod.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UnavailabilityPeriod> unavailabilityPeriodList = unavailabilityPeriodRepository.findAll();
        assertThat(unavailabilityPeriodList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
