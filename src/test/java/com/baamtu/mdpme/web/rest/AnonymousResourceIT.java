package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Anonymous;
import com.baamtu.mdpme.domain.Person;
import com.baamtu.mdpme.repository.AnonymousRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link AnonymousResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AnonymousResourceIT {

    private static final Instant DEFAULT_VISIT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_VISIT_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/anonymous";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AnonymousRepository anonymousRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAnonymousMockMvc;

    private Anonymous anonymous;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Anonymous createEntity(EntityManager em) {
        Anonymous anonymous = new Anonymous().visitDate(DEFAULT_VISIT_DATE);
        // Add required entity
        Person person;
        if (TestUtil.findAll(em, Person.class).isEmpty()) {
            person = PersonResourceIT.createEntity(em);
            em.persist(person);
            em.flush();
        } else {
            person = TestUtil.findAll(em, Person.class).get(0);
        }
        anonymous.setPerson(person);
        return anonymous;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Anonymous createUpdatedEntity(EntityManager em) {
        Anonymous anonymous = new Anonymous().visitDate(UPDATED_VISIT_DATE);
        // Add required entity
        Person person;
        if (TestUtil.findAll(em, Person.class).isEmpty()) {
            person = PersonResourceIT.createUpdatedEntity(em);
            em.persist(person);
            em.flush();
        } else {
            person = TestUtil.findAll(em, Person.class).get(0);
        }
        anonymous.setPerson(person);
        return anonymous;
    }

    @BeforeEach
    public void initTest() {
        anonymous = createEntity(em);
    }

    @Test
    @Transactional
    void createAnonymous() throws Exception {
        int databaseSizeBeforeCreate = anonymousRepository.findAll().size();
        // Create the Anonymous
        restAnonymousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(anonymous)))
            .andExpect(status().isCreated());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeCreate + 1);
        Anonymous testAnonymous = anonymousList.get(anonymousList.size() - 1);
        assertThat(testAnonymous.getVisitDate()).isEqualTo(DEFAULT_VISIT_DATE);
    }

    @Test
    @Transactional
    void createAnonymousWithExistingId() throws Exception {
        // Create the Anonymous with an existing ID
        anonymous.setId(1L);

        int databaseSizeBeforeCreate = anonymousRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAnonymousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(anonymous)))
            .andExpect(status().isBadRequest());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkVisitDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = anonymousRepository.findAll().size();
        // set the field null
        anonymous.setVisitDate(null);

        // Create the Anonymous, which fails.

        restAnonymousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(anonymous)))
            .andExpect(status().isBadRequest());

        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAnonymous() throws Exception {
        // Initialize the database
        anonymousRepository.saveAndFlush(anonymous);

        // Get all the anonymousList
        restAnonymousMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(anonymous.getId().intValue())))
            .andExpect(jsonPath("$.[*].visitDate").value(hasItem(DEFAULT_VISIT_DATE.toString())));
    }

    @Test
    @Transactional
    void getAnonymous() throws Exception {
        // Initialize the database
        anonymousRepository.saveAndFlush(anonymous);

        // Get the anonymous
        restAnonymousMockMvc
            .perform(get(ENTITY_API_URL_ID, anonymous.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(anonymous.getId().intValue()))
            .andExpect(jsonPath("$.visitDate").value(DEFAULT_VISIT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAnonymous() throws Exception {
        // Get the anonymous
        restAnonymousMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAnonymous() throws Exception {
        // Initialize the database
        anonymousRepository.saveAndFlush(anonymous);

        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();

        // Update the anonymous
        Anonymous updatedAnonymous = anonymousRepository.findById(anonymous.getId()).get();
        // Disconnect from session so that the updates on updatedAnonymous are not directly saved in db
        em.detach(updatedAnonymous);
        updatedAnonymous.visitDate(UPDATED_VISIT_DATE);

        restAnonymousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAnonymous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAnonymous))
            )
            .andExpect(status().isOk());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
        Anonymous testAnonymous = anonymousList.get(anonymousList.size() - 1);
        assertThat(testAnonymous.getVisitDate()).isEqualTo(UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void putNonExistingAnonymous() throws Exception {
        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();
        anonymous.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnonymousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, anonymous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(anonymous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAnonymous() throws Exception {
        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();
        anonymous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnonymousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(anonymous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAnonymous() throws Exception {
        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();
        anonymous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnonymousMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(anonymous)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAnonymousWithPatch() throws Exception {
        // Initialize the database
        anonymousRepository.saveAndFlush(anonymous);

        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();

        // Update the anonymous using partial update
        Anonymous partialUpdatedAnonymous = new Anonymous();
        partialUpdatedAnonymous.setId(anonymous.getId());

        restAnonymousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnonymous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnonymous))
            )
            .andExpect(status().isOk());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
        Anonymous testAnonymous = anonymousList.get(anonymousList.size() - 1);
        assertThat(testAnonymous.getVisitDate()).isEqualTo(DEFAULT_VISIT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateAnonymousWithPatch() throws Exception {
        // Initialize the database
        anonymousRepository.saveAndFlush(anonymous);

        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();

        // Update the anonymous using partial update
        Anonymous partialUpdatedAnonymous = new Anonymous();
        partialUpdatedAnonymous.setId(anonymous.getId());

        partialUpdatedAnonymous.visitDate(UPDATED_VISIT_DATE);

        restAnonymousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAnonymous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAnonymous))
            )
            .andExpect(status().isOk());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
        Anonymous testAnonymous = anonymousList.get(anonymousList.size() - 1);
        assertThat(testAnonymous.getVisitDate()).isEqualTo(UPDATED_VISIT_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingAnonymous() throws Exception {
        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();
        anonymous.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAnonymousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, anonymous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(anonymous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAnonymous() throws Exception {
        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();
        anonymous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnonymousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(anonymous))
            )
            .andExpect(status().isBadRequest());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAnonymous() throws Exception {
        int databaseSizeBeforeUpdate = anonymousRepository.findAll().size();
        anonymous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAnonymousMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(anonymous))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Anonymous in the database
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAnonymous() throws Exception {
        // Initialize the database
        anonymousRepository.saveAndFlush(anonymous);

        int databaseSizeBeforeDelete = anonymousRepository.findAll().size();

        // Delete the anonymous
        restAnonymousMockMvc
            .perform(delete(ENTITY_API_URL_ID, anonymous.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Anonymous> anonymousList = anonymousRepository.findAll();
        assertThat(anonymousList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
