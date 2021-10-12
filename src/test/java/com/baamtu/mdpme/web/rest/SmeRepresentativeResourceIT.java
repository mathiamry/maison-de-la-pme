package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Person;
import com.baamtu.mdpme.domain.Sme;
import com.baamtu.mdpme.domain.SmeRepresentative;
import com.baamtu.mdpme.repository.SmeRepresentativeRepository;
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
 * Integration tests for the {@link SmeRepresentativeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SmeRepresentativeResourceIT {

    private static final String DEFAULT_JOB_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_JOB_TITLE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_ADMIN = false;
    private static final Boolean UPDATED_IS_ADMIN = true;

    private static final Boolean DEFAULT_IS_MANAGER = false;
    private static final Boolean UPDATED_IS_MANAGER = true;

    private static final String ENTITY_API_URL = "/api/sme-representatives";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SmeRepresentativeRepository smeRepresentativeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSmeRepresentativeMockMvc;

    private SmeRepresentative smeRepresentative;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SmeRepresentative createEntity(EntityManager em) {
        SmeRepresentative smeRepresentative = new SmeRepresentative()
            .jobTitle(DEFAULT_JOB_TITLE)
            .isAdmin(DEFAULT_IS_ADMIN)
            .isManager(DEFAULT_IS_MANAGER);
        // Add required entity
        Person person;
        if (TestUtil.findAll(em, Person.class).isEmpty()) {
            person = PersonResourceIT.createEntity(em);
            em.persist(person);
            em.flush();
        } else {
            person = TestUtil.findAll(em, Person.class).get(0);
        }
        smeRepresentative.setPerson(person);
        // Add required entity
        Sme sme;
        if (TestUtil.findAll(em, Sme.class).isEmpty()) {
            sme = SmeResourceIT.createEntity(em);
            em.persist(sme);
            em.flush();
        } else {
            sme = TestUtil.findAll(em, Sme.class).get(0);
        }
        smeRepresentative.setSme(sme);
        return smeRepresentative;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SmeRepresentative createUpdatedEntity(EntityManager em) {
        SmeRepresentative smeRepresentative = new SmeRepresentative()
            .jobTitle(UPDATED_JOB_TITLE)
            .isAdmin(UPDATED_IS_ADMIN)
            .isManager(UPDATED_IS_MANAGER);
        // Add required entity
        Person person;
        if (TestUtil.findAll(em, Person.class).isEmpty()) {
            person = PersonResourceIT.createUpdatedEntity(em);
            em.persist(person);
            em.flush();
        } else {
            person = TestUtil.findAll(em, Person.class).get(0);
        }
        smeRepresentative.setPerson(person);
        // Add required entity
        Sme sme;
        if (TestUtil.findAll(em, Sme.class).isEmpty()) {
            sme = SmeResourceIT.createUpdatedEntity(em);
            em.persist(sme);
            em.flush();
        } else {
            sme = TestUtil.findAll(em, Sme.class).get(0);
        }
        smeRepresentative.setSme(sme);
        return smeRepresentative;
    }

    @BeforeEach
    public void initTest() {
        smeRepresentative = createEntity(em);
    }

    @Test
    @Transactional
    void createSmeRepresentative() throws Exception {
        int databaseSizeBeforeCreate = smeRepresentativeRepository.findAll().size();
        // Create the SmeRepresentative
        restSmeRepresentativeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isCreated());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeCreate + 1);
        SmeRepresentative testSmeRepresentative = smeRepresentativeList.get(smeRepresentativeList.size() - 1);
        assertThat(testSmeRepresentative.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testSmeRepresentative.getIsAdmin()).isEqualTo(DEFAULT_IS_ADMIN);
        assertThat(testSmeRepresentative.getIsManager()).isEqualTo(DEFAULT_IS_MANAGER);
    }

    @Test
    @Transactional
    void createSmeRepresentativeWithExistingId() throws Exception {
        // Create the SmeRepresentative with an existing ID
        smeRepresentative.setId(1L);

        int databaseSizeBeforeCreate = smeRepresentativeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSmeRepresentativeMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSmeRepresentatives() throws Exception {
        // Initialize the database
        smeRepresentativeRepository.saveAndFlush(smeRepresentative);

        // Get all the smeRepresentativeList
        restSmeRepresentativeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(smeRepresentative.getId().intValue())))
            .andExpect(jsonPath("$.[*].jobTitle").value(hasItem(DEFAULT_JOB_TITLE)))
            .andExpect(jsonPath("$.[*].isAdmin").value(hasItem(DEFAULT_IS_ADMIN.booleanValue())))
            .andExpect(jsonPath("$.[*].isManager").value(hasItem(DEFAULT_IS_MANAGER.booleanValue())));
    }

    @Test
    @Transactional
    void getSmeRepresentative() throws Exception {
        // Initialize the database
        smeRepresentativeRepository.saveAndFlush(smeRepresentative);

        // Get the smeRepresentative
        restSmeRepresentativeMockMvc
            .perform(get(ENTITY_API_URL_ID, smeRepresentative.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(smeRepresentative.getId().intValue()))
            .andExpect(jsonPath("$.jobTitle").value(DEFAULT_JOB_TITLE))
            .andExpect(jsonPath("$.isAdmin").value(DEFAULT_IS_ADMIN.booleanValue()))
            .andExpect(jsonPath("$.isManager").value(DEFAULT_IS_MANAGER.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingSmeRepresentative() throws Exception {
        // Get the smeRepresentative
        restSmeRepresentativeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSmeRepresentative() throws Exception {
        // Initialize the database
        smeRepresentativeRepository.saveAndFlush(smeRepresentative);

        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();

        // Update the smeRepresentative
        SmeRepresentative updatedSmeRepresentative = smeRepresentativeRepository.findById(smeRepresentative.getId()).get();
        // Disconnect from session so that the updates on updatedSmeRepresentative are not directly saved in db
        em.detach(updatedSmeRepresentative);
        updatedSmeRepresentative.jobTitle(UPDATED_JOB_TITLE).isAdmin(UPDATED_IS_ADMIN).isManager(UPDATED_IS_MANAGER);

        restSmeRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSmeRepresentative.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSmeRepresentative))
            )
            .andExpect(status().isOk());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
        SmeRepresentative testSmeRepresentative = smeRepresentativeList.get(smeRepresentativeList.size() - 1);
        assertThat(testSmeRepresentative.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testSmeRepresentative.getIsAdmin()).isEqualTo(UPDATED_IS_ADMIN);
        assertThat(testSmeRepresentative.getIsManager()).isEqualTo(UPDATED_IS_MANAGER);
    }

    @Test
    @Transactional
    void putNonExistingSmeRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();
        smeRepresentative.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSmeRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, smeRepresentative.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSmeRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();
        smeRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSmeRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();
        smeRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSmeRepresentativeWithPatch() throws Exception {
        // Initialize the database
        smeRepresentativeRepository.saveAndFlush(smeRepresentative);

        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();

        // Update the smeRepresentative using partial update
        SmeRepresentative partialUpdatedSmeRepresentative = new SmeRepresentative();
        partialUpdatedSmeRepresentative.setId(smeRepresentative.getId());

        partialUpdatedSmeRepresentative.isAdmin(UPDATED_IS_ADMIN);

        restSmeRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSmeRepresentative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSmeRepresentative))
            )
            .andExpect(status().isOk());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
        SmeRepresentative testSmeRepresentative = smeRepresentativeList.get(smeRepresentativeList.size() - 1);
        assertThat(testSmeRepresentative.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testSmeRepresentative.getIsAdmin()).isEqualTo(UPDATED_IS_ADMIN);
        assertThat(testSmeRepresentative.getIsManager()).isEqualTo(DEFAULT_IS_MANAGER);
    }

    @Test
    @Transactional
    void fullUpdateSmeRepresentativeWithPatch() throws Exception {
        // Initialize the database
        smeRepresentativeRepository.saveAndFlush(smeRepresentative);

        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();

        // Update the smeRepresentative using partial update
        SmeRepresentative partialUpdatedSmeRepresentative = new SmeRepresentative();
        partialUpdatedSmeRepresentative.setId(smeRepresentative.getId());

        partialUpdatedSmeRepresentative.jobTitle(UPDATED_JOB_TITLE).isAdmin(UPDATED_IS_ADMIN).isManager(UPDATED_IS_MANAGER);

        restSmeRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSmeRepresentative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSmeRepresentative))
            )
            .andExpect(status().isOk());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
        SmeRepresentative testSmeRepresentative = smeRepresentativeList.get(smeRepresentativeList.size() - 1);
        assertThat(testSmeRepresentative.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testSmeRepresentative.getIsAdmin()).isEqualTo(UPDATED_IS_ADMIN);
        assertThat(testSmeRepresentative.getIsManager()).isEqualTo(UPDATED_IS_MANAGER);
    }

    @Test
    @Transactional
    void patchNonExistingSmeRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();
        smeRepresentative.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSmeRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, smeRepresentative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSmeRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();
        smeRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSmeRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = smeRepresentativeRepository.findAll().size();
        smeRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(smeRepresentative))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SmeRepresentative in the database
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSmeRepresentative() throws Exception {
        // Initialize the database
        smeRepresentativeRepository.saveAndFlush(smeRepresentative);

        int databaseSizeBeforeDelete = smeRepresentativeRepository.findAll().size();

        // Delete the smeRepresentative
        restSmeRepresentativeMockMvc
            .perform(delete(ENTITY_API_URL_ID, smeRepresentative.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SmeRepresentative> smeRepresentativeList = smeRepresentativeRepository.findAll();
        assertThat(smeRepresentativeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
