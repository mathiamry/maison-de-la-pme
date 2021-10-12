package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Administrator;
import com.baamtu.mdpme.domain.Country;
import com.baamtu.mdpme.domain.SMEHouse;
import com.baamtu.mdpme.repository.SMEHouseRepository;
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
 * Integration tests for the {@link SMEHouseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SMEHouseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "_@#+.52pSdy";
    private static final String UPDATED_EMAIL = "o[NB@om.eq_5";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/sme-houses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SMEHouseRepository sMEHouseRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSMEHouseMockMvc;

    private SMEHouse sMEHouse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SMEHouse createEntity(EntityManager em) {
        SMEHouse sMEHouse = new SMEHouse()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .address(DEFAULT_ADDRESS)
            .email(DEFAULT_EMAIL)
            .phone(DEFAULT_PHONE);
        // Add required entity
        Country country;
        if (TestUtil.findAll(em, Country.class).isEmpty()) {
            country = CountryResourceIT.createEntity(em);
            em.persist(country);
            em.flush();
        } else {
            country = TestUtil.findAll(em, Country.class).get(0);
        }
        sMEHouse.setCountry(country);
        // Add required entity
        Administrator administrator;
        if (TestUtil.findAll(em, Administrator.class).isEmpty()) {
            administrator = AdministratorResourceIT.createEntity(em);
            em.persist(administrator);
            em.flush();
        } else {
            administrator = TestUtil.findAll(em, Administrator.class).get(0);
        }
        sMEHouse.setAdministrator(administrator);
        return sMEHouse;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SMEHouse createUpdatedEntity(EntityManager em) {
        SMEHouse sMEHouse = new SMEHouse()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .address(UPDATED_ADDRESS)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE);
        // Add required entity
        Country country;
        if (TestUtil.findAll(em, Country.class).isEmpty()) {
            country = CountryResourceIT.createUpdatedEntity(em);
            em.persist(country);
            em.flush();
        } else {
            country = TestUtil.findAll(em, Country.class).get(0);
        }
        sMEHouse.setCountry(country);
        // Add required entity
        Administrator administrator;
        if (TestUtil.findAll(em, Administrator.class).isEmpty()) {
            administrator = AdministratorResourceIT.createUpdatedEntity(em);
            em.persist(administrator);
            em.flush();
        } else {
            administrator = TestUtil.findAll(em, Administrator.class).get(0);
        }
        sMEHouse.setAdministrator(administrator);
        return sMEHouse;
    }

    @BeforeEach
    public void initTest() {
        sMEHouse = createEntity(em);
    }

    @Test
    @Transactional
    void createSMEHouse() throws Exception {
        int databaseSizeBeforeCreate = sMEHouseRepository.findAll().size();
        // Create the SMEHouse
        restSMEHouseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMEHouse)))
            .andExpect(status().isCreated());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeCreate + 1);
        SMEHouse testSMEHouse = sMEHouseList.get(sMEHouseList.size() - 1);
        assertThat(testSMEHouse.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSMEHouse.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSMEHouse.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testSMEHouse.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSMEHouse.getPhone()).isEqualTo(DEFAULT_PHONE);
    }

    @Test
    @Transactional
    void createSMEHouseWithExistingId() throws Exception {
        // Create the SMEHouse with an existing ID
        sMEHouse.setId(1L);

        int databaseSizeBeforeCreate = sMEHouseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSMEHouseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMEHouse)))
            .andExpect(status().isBadRequest());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = sMEHouseRepository.findAll().size();
        // set the field null
        sMEHouse.setName(null);

        // Create the SMEHouse, which fails.

        restSMEHouseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMEHouse)))
            .andExpect(status().isBadRequest());

        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = sMEHouseRepository.findAll().size();
        // set the field null
        sMEHouse.setEmail(null);

        // Create the SMEHouse, which fails.

        restSMEHouseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMEHouse)))
            .andExpect(status().isBadRequest());

        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = sMEHouseRepository.findAll().size();
        // set the field null
        sMEHouse.setPhone(null);

        // Create the SMEHouse, which fails.

        restSMEHouseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMEHouse)))
            .andExpect(status().isBadRequest());

        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSMEHouses() throws Exception {
        // Initialize the database
        sMEHouseRepository.saveAndFlush(sMEHouse);

        // Get all the sMEHouseList
        restSMEHouseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sMEHouse.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)));
    }

    @Test
    @Transactional
    void getSMEHouse() throws Exception {
        // Initialize the database
        sMEHouseRepository.saveAndFlush(sMEHouse);

        // Get the sMEHouse
        restSMEHouseMockMvc
            .perform(get(ENTITY_API_URL_ID, sMEHouse.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sMEHouse.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE));
    }

    @Test
    @Transactional
    void getNonExistingSMEHouse() throws Exception {
        // Get the sMEHouse
        restSMEHouseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSMEHouse() throws Exception {
        // Initialize the database
        sMEHouseRepository.saveAndFlush(sMEHouse);

        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();

        // Update the sMEHouse
        SMEHouse updatedSMEHouse = sMEHouseRepository.findById(sMEHouse.getId()).get();
        // Disconnect from session so that the updates on updatedSMEHouse are not directly saved in db
        em.detach(updatedSMEHouse);
        updatedSMEHouse
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .address(UPDATED_ADDRESS)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE);

        restSMEHouseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSMEHouse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSMEHouse))
            )
            .andExpect(status().isOk());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
        SMEHouse testSMEHouse = sMEHouseList.get(sMEHouseList.size() - 1);
        assertThat(testSMEHouse.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSMEHouse.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSMEHouse.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testSMEHouse.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSMEHouse.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void putNonExistingSMEHouse() throws Exception {
        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();
        sMEHouse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSMEHouseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sMEHouse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sMEHouse))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSMEHouse() throws Exception {
        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();
        sMEHouse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMEHouseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sMEHouse))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSMEHouse() throws Exception {
        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();
        sMEHouse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMEHouseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sMEHouse)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSMEHouseWithPatch() throws Exception {
        // Initialize the database
        sMEHouseRepository.saveAndFlush(sMEHouse);

        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();

        // Update the sMEHouse using partial update
        SMEHouse partialUpdatedSMEHouse = new SMEHouse();
        partialUpdatedSMEHouse.setId(sMEHouse.getId());

        partialUpdatedSMEHouse.description(UPDATED_DESCRIPTION).address(UPDATED_ADDRESS).email(UPDATED_EMAIL).phone(UPDATED_PHONE);

        restSMEHouseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSMEHouse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSMEHouse))
            )
            .andExpect(status().isOk());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
        SMEHouse testSMEHouse = sMEHouseList.get(sMEHouseList.size() - 1);
        assertThat(testSMEHouse.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSMEHouse.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSMEHouse.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testSMEHouse.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSMEHouse.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void fullUpdateSMEHouseWithPatch() throws Exception {
        // Initialize the database
        sMEHouseRepository.saveAndFlush(sMEHouse);

        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();

        // Update the sMEHouse using partial update
        SMEHouse partialUpdatedSMEHouse = new SMEHouse();
        partialUpdatedSMEHouse.setId(sMEHouse.getId());

        partialUpdatedSMEHouse
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .address(UPDATED_ADDRESS)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE);

        restSMEHouseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSMEHouse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSMEHouse))
            )
            .andExpect(status().isOk());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
        SMEHouse testSMEHouse = sMEHouseList.get(sMEHouseList.size() - 1);
        assertThat(testSMEHouse.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSMEHouse.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSMEHouse.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testSMEHouse.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSMEHouse.getPhone()).isEqualTo(UPDATED_PHONE);
    }

    @Test
    @Transactional
    void patchNonExistingSMEHouse() throws Exception {
        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();
        sMEHouse.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSMEHouseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sMEHouse.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sMEHouse))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSMEHouse() throws Exception {
        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();
        sMEHouse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMEHouseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sMEHouse))
            )
            .andExpect(status().isBadRequest());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSMEHouse() throws Exception {
        int databaseSizeBeforeUpdate = sMEHouseRepository.findAll().size();
        sMEHouse.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSMEHouseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sMEHouse)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SMEHouse in the database
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSMEHouse() throws Exception {
        // Initialize the database
        sMEHouseRepository.saveAndFlush(sMEHouse);

        int databaseSizeBeforeDelete = sMEHouseRepository.findAll().size();

        // Delete the sMEHouse
        restSMEHouseMockMvc
            .perform(delete(ENTITY_API_URL_ID, sMEHouse.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SMEHouse> sMEHouseList = sMEHouseRepository.findAll();
        assertThat(sMEHouseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
