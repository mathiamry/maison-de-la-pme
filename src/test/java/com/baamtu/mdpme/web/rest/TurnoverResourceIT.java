package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Turnover;
import com.baamtu.mdpme.repository.TurnoverRepository;
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
 * Integration tests for the {@link TurnoverResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TurnoverResourceIT {

    private static final Float DEFAULT_MIN = 1F;
    private static final Float UPDATED_MIN = 2F;

    private static final Float DEFAULT_MAX = 1F;
    private static final Float UPDATED_MAX = 2F;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/turnovers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TurnoverRepository turnoverRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTurnoverMockMvc;

    private Turnover turnover;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Turnover createEntity(EntityManager em) {
        Turnover turnover = new Turnover().min(DEFAULT_MIN).max(DEFAULT_MAX).description(DEFAULT_DESCRIPTION);
        return turnover;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Turnover createUpdatedEntity(EntityManager em) {
        Turnover turnover = new Turnover().min(UPDATED_MIN).max(UPDATED_MAX).description(UPDATED_DESCRIPTION);
        return turnover;
    }

    @BeforeEach
    public void initTest() {
        turnover = createEntity(em);
    }

    @Test
    @Transactional
    void createTurnover() throws Exception {
        int databaseSizeBeforeCreate = turnoverRepository.findAll().size();
        // Create the Turnover
        restTurnoverMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(turnover)))
            .andExpect(status().isCreated());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeCreate + 1);
        Turnover testTurnover = turnoverList.get(turnoverList.size() - 1);
        assertThat(testTurnover.getMin()).isEqualTo(DEFAULT_MIN);
        assertThat(testTurnover.getMax()).isEqualTo(DEFAULT_MAX);
        assertThat(testTurnover.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createTurnoverWithExistingId() throws Exception {
        // Create the Turnover with an existing ID
        turnover.setId(1L);

        int databaseSizeBeforeCreate = turnoverRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTurnoverMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(turnover)))
            .andExpect(status().isBadRequest());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllTurnovers() throws Exception {
        // Initialize the database
        turnoverRepository.saveAndFlush(turnover);

        // Get all the turnoverList
        restTurnoverMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(turnover.getId().intValue())))
            .andExpect(jsonPath("$.[*].min").value(hasItem(DEFAULT_MIN.doubleValue())))
            .andExpect(jsonPath("$.[*].max").value(hasItem(DEFAULT_MAX.doubleValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getTurnover() throws Exception {
        // Initialize the database
        turnoverRepository.saveAndFlush(turnover);

        // Get the turnover
        restTurnoverMockMvc
            .perform(get(ENTITY_API_URL_ID, turnover.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(turnover.getId().intValue()))
            .andExpect(jsonPath("$.min").value(DEFAULT_MIN.doubleValue()))
            .andExpect(jsonPath("$.max").value(DEFAULT_MAX.doubleValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingTurnover() throws Exception {
        // Get the turnover
        restTurnoverMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTurnover() throws Exception {
        // Initialize the database
        turnoverRepository.saveAndFlush(turnover);

        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();

        // Update the turnover
        Turnover updatedTurnover = turnoverRepository.findById(turnover.getId()).get();
        // Disconnect from session so that the updates on updatedTurnover are not directly saved in db
        em.detach(updatedTurnover);
        updatedTurnover.min(UPDATED_MIN).max(UPDATED_MAX).description(UPDATED_DESCRIPTION);

        restTurnoverMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTurnover.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTurnover))
            )
            .andExpect(status().isOk());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
        Turnover testTurnover = turnoverList.get(turnoverList.size() - 1);
        assertThat(testTurnover.getMin()).isEqualTo(UPDATED_MIN);
        assertThat(testTurnover.getMax()).isEqualTo(UPDATED_MAX);
        assertThat(testTurnover.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingTurnover() throws Exception {
        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();
        turnover.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTurnoverMockMvc
            .perform(
                put(ENTITY_API_URL_ID, turnover.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(turnover))
            )
            .andExpect(status().isBadRequest());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTurnover() throws Exception {
        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();
        turnover.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTurnoverMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(turnover))
            )
            .andExpect(status().isBadRequest());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTurnover() throws Exception {
        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();
        turnover.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTurnoverMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(turnover)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTurnoverWithPatch() throws Exception {
        // Initialize the database
        turnoverRepository.saveAndFlush(turnover);

        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();

        // Update the turnover using partial update
        Turnover partialUpdatedTurnover = new Turnover();
        partialUpdatedTurnover.setId(turnover.getId());

        partialUpdatedTurnover.description(UPDATED_DESCRIPTION);

        restTurnoverMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTurnover.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTurnover))
            )
            .andExpect(status().isOk());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
        Turnover testTurnover = turnoverList.get(turnoverList.size() - 1);
        assertThat(testTurnover.getMin()).isEqualTo(DEFAULT_MIN);
        assertThat(testTurnover.getMax()).isEqualTo(DEFAULT_MAX);
        assertThat(testTurnover.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateTurnoverWithPatch() throws Exception {
        // Initialize the database
        turnoverRepository.saveAndFlush(turnover);

        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();

        // Update the turnover using partial update
        Turnover partialUpdatedTurnover = new Turnover();
        partialUpdatedTurnover.setId(turnover.getId());

        partialUpdatedTurnover.min(UPDATED_MIN).max(UPDATED_MAX).description(UPDATED_DESCRIPTION);

        restTurnoverMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTurnover.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTurnover))
            )
            .andExpect(status().isOk());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
        Turnover testTurnover = turnoverList.get(turnoverList.size() - 1);
        assertThat(testTurnover.getMin()).isEqualTo(UPDATED_MIN);
        assertThat(testTurnover.getMax()).isEqualTo(UPDATED_MAX);
        assertThat(testTurnover.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingTurnover() throws Exception {
        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();
        turnover.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTurnoverMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, turnover.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(turnover))
            )
            .andExpect(status().isBadRequest());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTurnover() throws Exception {
        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();
        turnover.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTurnoverMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(turnover))
            )
            .andExpect(status().isBadRequest());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTurnover() throws Exception {
        int databaseSizeBeforeUpdate = turnoverRepository.findAll().size();
        turnover.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTurnoverMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(turnover)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Turnover in the database
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTurnover() throws Exception {
        // Initialize the database
        turnoverRepository.saveAndFlush(turnover);

        int databaseSizeBeforeDelete = turnoverRepository.findAll().size();

        // Delete the turnover
        restTurnoverMockMvc
            .perform(delete(ENTITY_API_URL_ID, turnover.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Turnover> turnoverList = turnoverRepository.findAll();
        assertThat(turnoverList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
