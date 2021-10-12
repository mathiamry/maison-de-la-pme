package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.AvailabilityTimeslot;
import com.baamtu.mdpme.domain.enumeration.Day;
import com.baamtu.mdpme.repository.AvailabilityTimeslotRepository;
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
 * Integration tests for the {@link AvailabilityTimeslotResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class AvailabilityTimeslotResourceIT {

    private static final Integer DEFAULT_START_HOUR = 1;
    private static final Integer UPDATED_START_HOUR = 2;

    private static final Integer DEFAULT_START_MIN = 1;
    private static final Integer UPDATED_START_MIN = 2;

    private static final Integer DEFAULT_END_HOUR = 1;
    private static final Integer UPDATED_END_HOUR = 2;

    private static final Integer DEFAULT_END_MIN = 1;
    private static final Integer UPDATED_END_MIN = 2;

    private static final Day DEFAULT_DAY = Day.MONDAY;
    private static final Day UPDATED_DAY = Day.TUESDAY;

    private static final String ENTITY_API_URL = "/api/availability-timeslots";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AvailabilityTimeslotRepository availabilityTimeslotRepository;

    @Mock
    private AvailabilityTimeslotRepository availabilityTimeslotRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAvailabilityTimeslotMockMvc;

    private AvailabilityTimeslot availabilityTimeslot;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AvailabilityTimeslot createEntity(EntityManager em) {
        AvailabilityTimeslot availabilityTimeslot = new AvailabilityTimeslot()
            .startHour(DEFAULT_START_HOUR)
            .startMin(DEFAULT_START_MIN)
            .endHour(DEFAULT_END_HOUR)
            .endMin(DEFAULT_END_MIN)
            .day(DEFAULT_DAY);
        return availabilityTimeslot;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AvailabilityTimeslot createUpdatedEntity(EntityManager em) {
        AvailabilityTimeslot availabilityTimeslot = new AvailabilityTimeslot()
            .startHour(UPDATED_START_HOUR)
            .startMin(UPDATED_START_MIN)
            .endHour(UPDATED_END_HOUR)
            .endMin(UPDATED_END_MIN)
            .day(UPDATED_DAY);
        return availabilityTimeslot;
    }

    @BeforeEach
    public void initTest() {
        availabilityTimeslot = createEntity(em);
    }

    @Test
    @Transactional
    void createAvailabilityTimeslot() throws Exception {
        int databaseSizeBeforeCreate = availabilityTimeslotRepository.findAll().size();
        // Create the AvailabilityTimeslot
        restAvailabilityTimeslotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isCreated());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeCreate + 1);
        AvailabilityTimeslot testAvailabilityTimeslot = availabilityTimeslotList.get(availabilityTimeslotList.size() - 1);
        assertThat(testAvailabilityTimeslot.getStartHour()).isEqualTo(DEFAULT_START_HOUR);
        assertThat(testAvailabilityTimeslot.getStartMin()).isEqualTo(DEFAULT_START_MIN);
        assertThat(testAvailabilityTimeslot.getEndHour()).isEqualTo(DEFAULT_END_HOUR);
        assertThat(testAvailabilityTimeslot.getEndMin()).isEqualTo(DEFAULT_END_MIN);
        assertThat(testAvailabilityTimeslot.getDay()).isEqualTo(DEFAULT_DAY);
    }

    @Test
    @Transactional
    void createAvailabilityTimeslotWithExistingId() throws Exception {
        // Create the AvailabilityTimeslot with an existing ID
        availabilityTimeslot.setId(1L);

        int databaseSizeBeforeCreate = availabilityTimeslotRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAvailabilityTimeslotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = availabilityTimeslotRepository.findAll().size();
        // set the field null
        availabilityTimeslot.setStartHour(null);

        // Create the AvailabilityTimeslot, which fails.

        restAvailabilityTimeslotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartMinIsRequired() throws Exception {
        int databaseSizeBeforeTest = availabilityTimeslotRepository.findAll().size();
        // set the field null
        availabilityTimeslot.setStartMin(null);

        // Create the AvailabilityTimeslot, which fails.

        restAvailabilityTimeslotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndHourIsRequired() throws Exception {
        int databaseSizeBeforeTest = availabilityTimeslotRepository.findAll().size();
        // set the field null
        availabilityTimeslot.setEndHour(null);

        // Create the AvailabilityTimeslot, which fails.

        restAvailabilityTimeslotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEndMinIsRequired() throws Exception {
        int databaseSizeBeforeTest = availabilityTimeslotRepository.findAll().size();
        // set the field null
        availabilityTimeslot.setEndMin(null);

        // Create the AvailabilityTimeslot, which fails.

        restAvailabilityTimeslotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDayIsRequired() throws Exception {
        int databaseSizeBeforeTest = availabilityTimeslotRepository.findAll().size();
        // set the field null
        availabilityTimeslot.setDay(null);

        // Create the AvailabilityTimeslot, which fails.

        restAvailabilityTimeslotMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAvailabilityTimeslots() throws Exception {
        // Initialize the database
        availabilityTimeslotRepository.saveAndFlush(availabilityTimeslot);

        // Get all the availabilityTimeslotList
        restAvailabilityTimeslotMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(availabilityTimeslot.getId().intValue())))
            .andExpect(jsonPath("$.[*].startHour").value(hasItem(DEFAULT_START_HOUR)))
            .andExpect(jsonPath("$.[*].startMin").value(hasItem(DEFAULT_START_MIN)))
            .andExpect(jsonPath("$.[*].endHour").value(hasItem(DEFAULT_END_HOUR)))
            .andExpect(jsonPath("$.[*].endMin").value(hasItem(DEFAULT_END_MIN)))
            .andExpect(jsonPath("$.[*].day").value(hasItem(DEFAULT_DAY.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAvailabilityTimeslotsWithEagerRelationshipsIsEnabled() throws Exception {
        when(availabilityTimeslotRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAvailabilityTimeslotMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(availabilityTimeslotRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllAvailabilityTimeslotsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(availabilityTimeslotRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restAvailabilityTimeslotMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(availabilityTimeslotRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getAvailabilityTimeslot() throws Exception {
        // Initialize the database
        availabilityTimeslotRepository.saveAndFlush(availabilityTimeslot);

        // Get the availabilityTimeslot
        restAvailabilityTimeslotMockMvc
            .perform(get(ENTITY_API_URL_ID, availabilityTimeslot.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(availabilityTimeslot.getId().intValue()))
            .andExpect(jsonPath("$.startHour").value(DEFAULT_START_HOUR))
            .andExpect(jsonPath("$.startMin").value(DEFAULT_START_MIN))
            .andExpect(jsonPath("$.endHour").value(DEFAULT_END_HOUR))
            .andExpect(jsonPath("$.endMin").value(DEFAULT_END_MIN))
            .andExpect(jsonPath("$.day").value(DEFAULT_DAY.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAvailabilityTimeslot() throws Exception {
        // Get the availabilityTimeslot
        restAvailabilityTimeslotMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAvailabilityTimeslot() throws Exception {
        // Initialize the database
        availabilityTimeslotRepository.saveAndFlush(availabilityTimeslot);

        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();

        // Update the availabilityTimeslot
        AvailabilityTimeslot updatedAvailabilityTimeslot = availabilityTimeslotRepository.findById(availabilityTimeslot.getId()).get();
        // Disconnect from session so that the updates on updatedAvailabilityTimeslot are not directly saved in db
        em.detach(updatedAvailabilityTimeslot);
        updatedAvailabilityTimeslot
            .startHour(UPDATED_START_HOUR)
            .startMin(UPDATED_START_MIN)
            .endHour(UPDATED_END_HOUR)
            .endMin(UPDATED_END_MIN)
            .day(UPDATED_DAY);

        restAvailabilityTimeslotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAvailabilityTimeslot.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAvailabilityTimeslot))
            )
            .andExpect(status().isOk());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
        AvailabilityTimeslot testAvailabilityTimeslot = availabilityTimeslotList.get(availabilityTimeslotList.size() - 1);
        assertThat(testAvailabilityTimeslot.getStartHour()).isEqualTo(UPDATED_START_HOUR);
        assertThat(testAvailabilityTimeslot.getStartMin()).isEqualTo(UPDATED_START_MIN);
        assertThat(testAvailabilityTimeslot.getEndHour()).isEqualTo(UPDATED_END_HOUR);
        assertThat(testAvailabilityTimeslot.getEndMin()).isEqualTo(UPDATED_END_MIN);
        assertThat(testAvailabilityTimeslot.getDay()).isEqualTo(UPDATED_DAY);
    }

    @Test
    @Transactional
    void putNonExistingAvailabilityTimeslot() throws Exception {
        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();
        availabilityTimeslot.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvailabilityTimeslotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, availabilityTimeslot.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAvailabilityTimeslot() throws Exception {
        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();
        availabilityTimeslot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailabilityTimeslotMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAvailabilityTimeslot() throws Exception {
        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();
        availabilityTimeslot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailabilityTimeslotMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAvailabilityTimeslotWithPatch() throws Exception {
        // Initialize the database
        availabilityTimeslotRepository.saveAndFlush(availabilityTimeslot);

        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();

        // Update the availabilityTimeslot using partial update
        AvailabilityTimeslot partialUpdatedAvailabilityTimeslot = new AvailabilityTimeslot();
        partialUpdatedAvailabilityTimeslot.setId(availabilityTimeslot.getId());

        partialUpdatedAvailabilityTimeslot.startHour(UPDATED_START_HOUR).endHour(UPDATED_END_HOUR).endMin(UPDATED_END_MIN).day(UPDATED_DAY);

        restAvailabilityTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvailabilityTimeslot.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvailabilityTimeslot))
            )
            .andExpect(status().isOk());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
        AvailabilityTimeslot testAvailabilityTimeslot = availabilityTimeslotList.get(availabilityTimeslotList.size() - 1);
        assertThat(testAvailabilityTimeslot.getStartHour()).isEqualTo(UPDATED_START_HOUR);
        assertThat(testAvailabilityTimeslot.getStartMin()).isEqualTo(DEFAULT_START_MIN);
        assertThat(testAvailabilityTimeslot.getEndHour()).isEqualTo(UPDATED_END_HOUR);
        assertThat(testAvailabilityTimeslot.getEndMin()).isEqualTo(UPDATED_END_MIN);
        assertThat(testAvailabilityTimeslot.getDay()).isEqualTo(UPDATED_DAY);
    }

    @Test
    @Transactional
    void fullUpdateAvailabilityTimeslotWithPatch() throws Exception {
        // Initialize the database
        availabilityTimeslotRepository.saveAndFlush(availabilityTimeslot);

        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();

        // Update the availabilityTimeslot using partial update
        AvailabilityTimeslot partialUpdatedAvailabilityTimeslot = new AvailabilityTimeslot();
        partialUpdatedAvailabilityTimeslot.setId(availabilityTimeslot.getId());

        partialUpdatedAvailabilityTimeslot
            .startHour(UPDATED_START_HOUR)
            .startMin(UPDATED_START_MIN)
            .endHour(UPDATED_END_HOUR)
            .endMin(UPDATED_END_MIN)
            .day(UPDATED_DAY);

        restAvailabilityTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAvailabilityTimeslot.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAvailabilityTimeslot))
            )
            .andExpect(status().isOk());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
        AvailabilityTimeslot testAvailabilityTimeslot = availabilityTimeslotList.get(availabilityTimeslotList.size() - 1);
        assertThat(testAvailabilityTimeslot.getStartHour()).isEqualTo(UPDATED_START_HOUR);
        assertThat(testAvailabilityTimeslot.getStartMin()).isEqualTo(UPDATED_START_MIN);
        assertThat(testAvailabilityTimeslot.getEndHour()).isEqualTo(UPDATED_END_HOUR);
        assertThat(testAvailabilityTimeslot.getEndMin()).isEqualTo(UPDATED_END_MIN);
        assertThat(testAvailabilityTimeslot.getDay()).isEqualTo(UPDATED_DAY);
    }

    @Test
    @Transactional
    void patchNonExistingAvailabilityTimeslot() throws Exception {
        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();
        availabilityTimeslot.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAvailabilityTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, availabilityTimeslot.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAvailabilityTimeslot() throws Exception {
        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();
        availabilityTimeslot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailabilityTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isBadRequest());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAvailabilityTimeslot() throws Exception {
        int databaseSizeBeforeUpdate = availabilityTimeslotRepository.findAll().size();
        availabilityTimeslot.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAvailabilityTimeslotMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(availabilityTimeslot))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AvailabilityTimeslot in the database
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAvailabilityTimeslot() throws Exception {
        // Initialize the database
        availabilityTimeslotRepository.saveAndFlush(availabilityTimeslot);

        int databaseSizeBeforeDelete = availabilityTimeslotRepository.findAll().size();

        // Delete the availabilityTimeslot
        restAvailabilityTimeslotMockMvc
            .perform(delete(ENTITY_API_URL_ID, availabilityTimeslot.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AvailabilityTimeslot> availabilityTimeslotList = availabilityTimeslotRepository.findAll();
        assertThat(availabilityTimeslotList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
