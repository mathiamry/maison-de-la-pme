package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Partner;
import com.baamtu.mdpme.domain.PartnerRepresentative;
import com.baamtu.mdpme.domain.Person;
import com.baamtu.mdpme.domain.User;
import com.baamtu.mdpme.repository.PartnerRepresentativeRepository;
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
 * Integration tests for the {@link PartnerRepresentativeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PartnerRepresentativeResourceIT {

    private static final String DEFAULT_JOB_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_JOB_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/partner-representatives";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PartnerRepresentativeRepository partnerRepresentativeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPartnerRepresentativeMockMvc;

    private PartnerRepresentative partnerRepresentative;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PartnerRepresentative createEntity(EntityManager em) {
        PartnerRepresentative partnerRepresentative = new PartnerRepresentative()
            .jobTitle(DEFAULT_JOB_TITLE)
            .description(DEFAULT_DESCRIPTION);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        partnerRepresentative.setInternalUser(user);
        // Add required entity
        Person person;
        if (TestUtil.findAll(em, Person.class).isEmpty()) {
            person = PersonResourceIT.createEntity(em);
            em.persist(person);
            em.flush();
        } else {
            person = TestUtil.findAll(em, Person.class).get(0);
        }
        partnerRepresentative.setPerson(person);
        // Add required entity
        Partner partner;
        if (TestUtil.findAll(em, Partner.class).isEmpty()) {
            partner = PartnerResourceIT.createEntity(em);
            em.persist(partner);
            em.flush();
        } else {
            partner = TestUtil.findAll(em, Partner.class).get(0);
        }
        partnerRepresentative.setPartner(partner);
        return partnerRepresentative;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static PartnerRepresentative createUpdatedEntity(EntityManager em) {
        PartnerRepresentative partnerRepresentative = new PartnerRepresentative()
            .jobTitle(UPDATED_JOB_TITLE)
            .description(UPDATED_DESCRIPTION);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        partnerRepresentative.setInternalUser(user);
        // Add required entity
        Person person;
        if (TestUtil.findAll(em, Person.class).isEmpty()) {
            person = PersonResourceIT.createUpdatedEntity(em);
            em.persist(person);
            em.flush();
        } else {
            person = TestUtil.findAll(em, Person.class).get(0);
        }
        partnerRepresentative.setPerson(person);
        // Add required entity
        Partner partner;
        if (TestUtil.findAll(em, Partner.class).isEmpty()) {
            partner = PartnerResourceIT.createUpdatedEntity(em);
            em.persist(partner);
            em.flush();
        } else {
            partner = TestUtil.findAll(em, Partner.class).get(0);
        }
        partnerRepresentative.setPartner(partner);
        return partnerRepresentative;
    }

    @BeforeEach
    public void initTest() {
        partnerRepresentative = createEntity(em);
    }

    @Test
    @Transactional
    void createPartnerRepresentative() throws Exception {
        int databaseSizeBeforeCreate = partnerRepresentativeRepository.findAll().size();
        // Create the PartnerRepresentative
        restPartnerRepresentativeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isCreated());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeCreate + 1);
        PartnerRepresentative testPartnerRepresentative = partnerRepresentativeList.get(partnerRepresentativeList.size() - 1);
        assertThat(testPartnerRepresentative.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testPartnerRepresentative.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createPartnerRepresentativeWithExistingId() throws Exception {
        // Create the PartnerRepresentative with an existing ID
        partnerRepresentative.setId(1L);

        int databaseSizeBeforeCreate = partnerRepresentativeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPartnerRepresentativeMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPartnerRepresentatives() throws Exception {
        // Initialize the database
        partnerRepresentativeRepository.saveAndFlush(partnerRepresentative);

        // Get all the partnerRepresentativeList
        restPartnerRepresentativeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(partnerRepresentative.getId().intValue())))
            .andExpect(jsonPath("$.[*].jobTitle").value(hasItem(DEFAULT_JOB_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getPartnerRepresentative() throws Exception {
        // Initialize the database
        partnerRepresentativeRepository.saveAndFlush(partnerRepresentative);

        // Get the partnerRepresentative
        restPartnerRepresentativeMockMvc
            .perform(get(ENTITY_API_URL_ID, partnerRepresentative.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(partnerRepresentative.getId().intValue()))
            .andExpect(jsonPath("$.jobTitle").value(DEFAULT_JOB_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingPartnerRepresentative() throws Exception {
        // Get the partnerRepresentative
        restPartnerRepresentativeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewPartnerRepresentative() throws Exception {
        // Initialize the database
        partnerRepresentativeRepository.saveAndFlush(partnerRepresentative);

        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();

        // Update the partnerRepresentative
        PartnerRepresentative updatedPartnerRepresentative = partnerRepresentativeRepository.findById(partnerRepresentative.getId()).get();
        // Disconnect from session so that the updates on updatedPartnerRepresentative are not directly saved in db
        em.detach(updatedPartnerRepresentative);
        updatedPartnerRepresentative.jobTitle(UPDATED_JOB_TITLE).description(UPDATED_DESCRIPTION);

        restPartnerRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPartnerRepresentative.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPartnerRepresentative))
            )
            .andExpect(status().isOk());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
        PartnerRepresentative testPartnerRepresentative = partnerRepresentativeList.get(partnerRepresentativeList.size() - 1);
        assertThat(testPartnerRepresentative.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testPartnerRepresentative.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingPartnerRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();
        partnerRepresentative.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartnerRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, partnerRepresentative.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPartnerRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();
        partnerRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartnerRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPartnerRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();
        partnerRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartnerRepresentativeMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePartnerRepresentativeWithPatch() throws Exception {
        // Initialize the database
        partnerRepresentativeRepository.saveAndFlush(partnerRepresentative);

        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();

        // Update the partnerRepresentative using partial update
        PartnerRepresentative partialUpdatedPartnerRepresentative = new PartnerRepresentative();
        partialUpdatedPartnerRepresentative.setId(partnerRepresentative.getId());

        restPartnerRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPartnerRepresentative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPartnerRepresentative))
            )
            .andExpect(status().isOk());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
        PartnerRepresentative testPartnerRepresentative = partnerRepresentativeList.get(partnerRepresentativeList.size() - 1);
        assertThat(testPartnerRepresentative.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testPartnerRepresentative.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdatePartnerRepresentativeWithPatch() throws Exception {
        // Initialize the database
        partnerRepresentativeRepository.saveAndFlush(partnerRepresentative);

        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();

        // Update the partnerRepresentative using partial update
        PartnerRepresentative partialUpdatedPartnerRepresentative = new PartnerRepresentative();
        partialUpdatedPartnerRepresentative.setId(partnerRepresentative.getId());

        partialUpdatedPartnerRepresentative.jobTitle(UPDATED_JOB_TITLE).description(UPDATED_DESCRIPTION);

        restPartnerRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPartnerRepresentative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPartnerRepresentative))
            )
            .andExpect(status().isOk());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
        PartnerRepresentative testPartnerRepresentative = partnerRepresentativeList.get(partnerRepresentativeList.size() - 1);
        assertThat(testPartnerRepresentative.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testPartnerRepresentative.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingPartnerRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();
        partnerRepresentative.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPartnerRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partnerRepresentative.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPartnerRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();
        partnerRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartnerRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isBadRequest());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPartnerRepresentative() throws Exception {
        int databaseSizeBeforeUpdate = partnerRepresentativeRepository.findAll().size();
        partnerRepresentative.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPartnerRepresentativeMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partnerRepresentative))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the PartnerRepresentative in the database
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePartnerRepresentative() throws Exception {
        // Initialize the database
        partnerRepresentativeRepository.saveAndFlush(partnerRepresentative);

        int databaseSizeBeforeDelete = partnerRepresentativeRepository.findAll().size();

        // Delete the partnerRepresentative
        restPartnerRepresentativeMockMvc
            .perform(delete(ENTITY_API_URL_ID, partnerRepresentative.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<PartnerRepresentative> partnerRepresentativeList = partnerRepresentativeRepository.findAll();
        assertThat(partnerRepresentativeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
