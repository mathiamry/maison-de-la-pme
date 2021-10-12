package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.ActivityArea;
import com.baamtu.mdpme.domain.SMEHouse;
import com.baamtu.mdpme.domain.Sme;
import com.baamtu.mdpme.repository.SmeRepository;
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
 * Integration tests for the {@link SmeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SmeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "c}:@v`rZ.j\"";
    private static final String UPDATED_EMAIL = ";3&9=@l.4=PKF";

    private static final String DEFAULT_PHONE = "AAAAAAAAAA";
    private static final String UPDATED_PHONE = "BBBBBBBBBB";

    private static final String DEFAULT_PHONE_2 = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_2 = "BBBBBBBBBB";

    private static final String DEFAULT_LOGO = "AAAAAAAAAA";
    private static final String UPDATED_LOGO = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_LATITUDE = "AAAAAAAAAA";
    private static final String UPDATED_LATITUDE = "BBBBBBBBBB";

    private static final String DEFAULT_LONGITUDE = "AAAAAAAAAA";
    private static final String UPDATED_LONGITUDE = "BBBBBBBBBB";

    private static final String DEFAULT_WEB_SITE = "AAAAAAAAAA";
    private static final String UPDATED_WEB_SITE = "BBBBBBBBBB";

    private static final String DEFAULT_SME_IMMATRICULATION_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_SME_IMMATRICULATION_NUMBER = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_CLIENT = false;
    private static final Boolean UPDATED_IS_CLIENT = true;

    private static final Boolean DEFAULT_IS_AUTHORIZED = false;
    private static final Boolean UPDATED_IS_AUTHORIZED = true;

    private static final String DEFAULT_TERMS_OF_USE = "AAAAAAAAAA";
    private static final String UPDATED_TERMS_OF_USE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_VALID = false;
    private static final Boolean UPDATED_IS_VALID = true;

    private static final String ENTITY_API_URL = "/api/smes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SmeRepository smeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSmeMockMvc;

    private Sme sme;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sme createEntity(EntityManager em) {
        Sme sme = new Sme()
            .name(DEFAULT_NAME)
            .email(DEFAULT_EMAIL)
            .phone(DEFAULT_PHONE)
            .phone2(DEFAULT_PHONE_2)
            .logo(DEFAULT_LOGO)
            .address(DEFAULT_ADDRESS)
            .latitude(DEFAULT_LATITUDE)
            .longitude(DEFAULT_LONGITUDE)
            .webSite(DEFAULT_WEB_SITE)
            .smeImmatriculationNumber(DEFAULT_SME_IMMATRICULATION_NUMBER)
            .isClient(DEFAULT_IS_CLIENT)
            .isAuthorized(DEFAULT_IS_AUTHORIZED)
            .termsOfUse(DEFAULT_TERMS_OF_USE)
            .isValid(DEFAULT_IS_VALID);
        // Add required entity
        ActivityArea activityArea;
        if (TestUtil.findAll(em, ActivityArea.class).isEmpty()) {
            activityArea = ActivityAreaResourceIT.createEntity(em);
            em.persist(activityArea);
            em.flush();
        } else {
            activityArea = TestUtil.findAll(em, ActivityArea.class).get(0);
        }
        sme.setActivityArea(activityArea);
        // Add required entity
        SMEHouse sMEHouse;
        if (TestUtil.findAll(em, SMEHouse.class).isEmpty()) {
            sMEHouse = SMEHouseResourceIT.createEntity(em);
            em.persist(sMEHouse);
            em.flush();
        } else {
            sMEHouse = TestUtil.findAll(em, SMEHouse.class).get(0);
        }
        sme.setSmeHouse(sMEHouse);
        return sme;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sme createUpdatedEntity(EntityManager em) {
        Sme sme = new Sme()
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .phone2(UPDATED_PHONE_2)
            .logo(UPDATED_LOGO)
            .address(UPDATED_ADDRESS)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .webSite(UPDATED_WEB_SITE)
            .smeImmatriculationNumber(UPDATED_SME_IMMATRICULATION_NUMBER)
            .isClient(UPDATED_IS_CLIENT)
            .isAuthorized(UPDATED_IS_AUTHORIZED)
            .termsOfUse(UPDATED_TERMS_OF_USE)
            .isValid(UPDATED_IS_VALID);
        // Add required entity
        ActivityArea activityArea;
        if (TestUtil.findAll(em, ActivityArea.class).isEmpty()) {
            activityArea = ActivityAreaResourceIT.createUpdatedEntity(em);
            em.persist(activityArea);
            em.flush();
        } else {
            activityArea = TestUtil.findAll(em, ActivityArea.class).get(0);
        }
        sme.setActivityArea(activityArea);
        // Add required entity
        SMEHouse sMEHouse;
        if (TestUtil.findAll(em, SMEHouse.class).isEmpty()) {
            sMEHouse = SMEHouseResourceIT.createUpdatedEntity(em);
            em.persist(sMEHouse);
            em.flush();
        } else {
            sMEHouse = TestUtil.findAll(em, SMEHouse.class).get(0);
        }
        sme.setSmeHouse(sMEHouse);
        return sme;
    }

    @BeforeEach
    public void initTest() {
        sme = createEntity(em);
    }

    @Test
    @Transactional
    void createSme() throws Exception {
        int databaseSizeBeforeCreate = smeRepository.findAll().size();
        // Create the Sme
        restSmeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isCreated());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeCreate + 1);
        Sme testSme = smeList.get(smeList.size() - 1);
        assertThat(testSme.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSme.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testSme.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testSme.getPhone2()).isEqualTo(DEFAULT_PHONE_2);
        assertThat(testSme.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testSme.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testSme.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testSme.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testSme.getWebSite()).isEqualTo(DEFAULT_WEB_SITE);
        assertThat(testSme.getSmeImmatriculationNumber()).isEqualTo(DEFAULT_SME_IMMATRICULATION_NUMBER);
        assertThat(testSme.getIsClient()).isEqualTo(DEFAULT_IS_CLIENT);
        assertThat(testSme.getIsAuthorized()).isEqualTo(DEFAULT_IS_AUTHORIZED);
        assertThat(testSme.getTermsOfUse()).isEqualTo(DEFAULT_TERMS_OF_USE);
        assertThat(testSme.getIsValid()).isEqualTo(DEFAULT_IS_VALID);
    }

    @Test
    @Transactional
    void createSmeWithExistingId() throws Exception {
        // Create the Sme with an existing ID
        sme.setId(1L);

        int databaseSizeBeforeCreate = smeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSmeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isBadRequest());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = smeRepository.findAll().size();
        // set the field null
        sme.setName(null);

        // Create the Sme, which fails.

        restSmeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isBadRequest());

        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = smeRepository.findAll().size();
        // set the field null
        sme.setEmail(null);

        // Create the Sme, which fails.

        restSmeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isBadRequest());

        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPhoneIsRequired() throws Exception {
        int databaseSizeBeforeTest = smeRepository.findAll().size();
        // set the field null
        sme.setPhone(null);

        // Create the Sme, which fails.

        restSmeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isBadRequest());

        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSmeImmatriculationNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = smeRepository.findAll().size();
        // set the field null
        sme.setSmeImmatriculationNumber(null);

        // Create the Sme, which fails.

        restSmeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isBadRequest());

        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllSmes() throws Exception {
        // Initialize the database
        smeRepository.saveAndFlush(sme);

        // Get all the smeList
        restSmeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sme.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].phone").value(hasItem(DEFAULT_PHONE)))
            .andExpect(jsonPath("$.[*].phone2").value(hasItem(DEFAULT_PHONE_2)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].latitude").value(hasItem(DEFAULT_LATITUDE)))
            .andExpect(jsonPath("$.[*].longitude").value(hasItem(DEFAULT_LONGITUDE)))
            .andExpect(jsonPath("$.[*].webSite").value(hasItem(DEFAULT_WEB_SITE)))
            .andExpect(jsonPath("$.[*].smeImmatriculationNumber").value(hasItem(DEFAULT_SME_IMMATRICULATION_NUMBER)))
            .andExpect(jsonPath("$.[*].isClient").value(hasItem(DEFAULT_IS_CLIENT.booleanValue())))
            .andExpect(jsonPath("$.[*].isAuthorized").value(hasItem(DEFAULT_IS_AUTHORIZED.booleanValue())))
            .andExpect(jsonPath("$.[*].termsOfUse").value(hasItem(DEFAULT_TERMS_OF_USE)))
            .andExpect(jsonPath("$.[*].isValid").value(hasItem(DEFAULT_IS_VALID.booleanValue())));
    }

    @Test
    @Transactional
    void getSme() throws Exception {
        // Initialize the database
        smeRepository.saveAndFlush(sme);

        // Get the sme
        restSmeMockMvc
            .perform(get(ENTITY_API_URL_ID, sme.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sme.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.phone").value(DEFAULT_PHONE))
            .andExpect(jsonPath("$.phone2").value(DEFAULT_PHONE_2))
            .andExpect(jsonPath("$.logo").value(DEFAULT_LOGO))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.latitude").value(DEFAULT_LATITUDE))
            .andExpect(jsonPath("$.longitude").value(DEFAULT_LONGITUDE))
            .andExpect(jsonPath("$.webSite").value(DEFAULT_WEB_SITE))
            .andExpect(jsonPath("$.smeImmatriculationNumber").value(DEFAULT_SME_IMMATRICULATION_NUMBER))
            .andExpect(jsonPath("$.isClient").value(DEFAULT_IS_CLIENT.booleanValue()))
            .andExpect(jsonPath("$.isAuthorized").value(DEFAULT_IS_AUTHORIZED.booleanValue()))
            .andExpect(jsonPath("$.termsOfUse").value(DEFAULT_TERMS_OF_USE))
            .andExpect(jsonPath("$.isValid").value(DEFAULT_IS_VALID.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingSme() throws Exception {
        // Get the sme
        restSmeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSme() throws Exception {
        // Initialize the database
        smeRepository.saveAndFlush(sme);

        int databaseSizeBeforeUpdate = smeRepository.findAll().size();

        // Update the sme
        Sme updatedSme = smeRepository.findById(sme.getId()).get();
        // Disconnect from session so that the updates on updatedSme are not directly saved in db
        em.detach(updatedSme);
        updatedSme
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .phone2(UPDATED_PHONE_2)
            .logo(UPDATED_LOGO)
            .address(UPDATED_ADDRESS)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .webSite(UPDATED_WEB_SITE)
            .smeImmatriculationNumber(UPDATED_SME_IMMATRICULATION_NUMBER)
            .isClient(UPDATED_IS_CLIENT)
            .isAuthorized(UPDATED_IS_AUTHORIZED)
            .termsOfUse(UPDATED_TERMS_OF_USE)
            .isValid(UPDATED_IS_VALID);

        restSmeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSme.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSme))
            )
            .andExpect(status().isOk());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
        Sme testSme = smeList.get(smeList.size() - 1);
        assertThat(testSme.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSme.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSme.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testSme.getPhone2()).isEqualTo(UPDATED_PHONE_2);
        assertThat(testSme.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testSme.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testSme.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testSme.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testSme.getWebSite()).isEqualTo(UPDATED_WEB_SITE);
        assertThat(testSme.getSmeImmatriculationNumber()).isEqualTo(UPDATED_SME_IMMATRICULATION_NUMBER);
        assertThat(testSme.getIsClient()).isEqualTo(UPDATED_IS_CLIENT);
        assertThat(testSme.getIsAuthorized()).isEqualTo(UPDATED_IS_AUTHORIZED);
        assertThat(testSme.getTermsOfUse()).isEqualTo(UPDATED_TERMS_OF_USE);
        assertThat(testSme.getIsValid()).isEqualTo(UPDATED_IS_VALID);
    }

    @Test
    @Transactional
    void putNonExistingSme() throws Exception {
        int databaseSizeBeforeUpdate = smeRepository.findAll().size();
        sme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSmeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sme.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSme() throws Exception {
        int databaseSizeBeforeUpdate = smeRepository.findAll().size();
        sme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSme() throws Exception {
        int databaseSizeBeforeUpdate = smeRepository.findAll().size();
        sme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSmeWithPatch() throws Exception {
        // Initialize the database
        smeRepository.saveAndFlush(sme);

        int databaseSizeBeforeUpdate = smeRepository.findAll().size();

        // Update the sme using partial update
        Sme partialUpdatedSme = new Sme();
        partialUpdatedSme.setId(sme.getId());

        partialUpdatedSme
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phone2(UPDATED_PHONE_2)
            .logo(UPDATED_LOGO)
            .smeImmatriculationNumber(UPDATED_SME_IMMATRICULATION_NUMBER)
            .isAuthorized(UPDATED_IS_AUTHORIZED)
            .termsOfUse(UPDATED_TERMS_OF_USE)
            .isValid(UPDATED_IS_VALID);

        restSmeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSme))
            )
            .andExpect(status().isOk());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
        Sme testSme = smeList.get(smeList.size() - 1);
        assertThat(testSme.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSme.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSme.getPhone()).isEqualTo(DEFAULT_PHONE);
        assertThat(testSme.getPhone2()).isEqualTo(UPDATED_PHONE_2);
        assertThat(testSme.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testSme.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testSme.getLatitude()).isEqualTo(DEFAULT_LATITUDE);
        assertThat(testSme.getLongitude()).isEqualTo(DEFAULT_LONGITUDE);
        assertThat(testSme.getWebSite()).isEqualTo(DEFAULT_WEB_SITE);
        assertThat(testSme.getSmeImmatriculationNumber()).isEqualTo(UPDATED_SME_IMMATRICULATION_NUMBER);
        assertThat(testSme.getIsClient()).isEqualTo(DEFAULT_IS_CLIENT);
        assertThat(testSme.getIsAuthorized()).isEqualTo(UPDATED_IS_AUTHORIZED);
        assertThat(testSme.getTermsOfUse()).isEqualTo(UPDATED_TERMS_OF_USE);
        assertThat(testSme.getIsValid()).isEqualTo(UPDATED_IS_VALID);
    }

    @Test
    @Transactional
    void fullUpdateSmeWithPatch() throws Exception {
        // Initialize the database
        smeRepository.saveAndFlush(sme);

        int databaseSizeBeforeUpdate = smeRepository.findAll().size();

        // Update the sme using partial update
        Sme partialUpdatedSme = new Sme();
        partialUpdatedSme.setId(sme.getId());

        partialUpdatedSme
            .name(UPDATED_NAME)
            .email(UPDATED_EMAIL)
            .phone(UPDATED_PHONE)
            .phone2(UPDATED_PHONE_2)
            .logo(UPDATED_LOGO)
            .address(UPDATED_ADDRESS)
            .latitude(UPDATED_LATITUDE)
            .longitude(UPDATED_LONGITUDE)
            .webSite(UPDATED_WEB_SITE)
            .smeImmatriculationNumber(UPDATED_SME_IMMATRICULATION_NUMBER)
            .isClient(UPDATED_IS_CLIENT)
            .isAuthorized(UPDATED_IS_AUTHORIZED)
            .termsOfUse(UPDATED_TERMS_OF_USE)
            .isValid(UPDATED_IS_VALID);

        restSmeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSme))
            )
            .andExpect(status().isOk());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
        Sme testSme = smeList.get(smeList.size() - 1);
        assertThat(testSme.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSme.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testSme.getPhone()).isEqualTo(UPDATED_PHONE);
        assertThat(testSme.getPhone2()).isEqualTo(UPDATED_PHONE_2);
        assertThat(testSme.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testSme.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testSme.getLatitude()).isEqualTo(UPDATED_LATITUDE);
        assertThat(testSme.getLongitude()).isEqualTo(UPDATED_LONGITUDE);
        assertThat(testSme.getWebSite()).isEqualTo(UPDATED_WEB_SITE);
        assertThat(testSme.getSmeImmatriculationNumber()).isEqualTo(UPDATED_SME_IMMATRICULATION_NUMBER);
        assertThat(testSme.getIsClient()).isEqualTo(UPDATED_IS_CLIENT);
        assertThat(testSme.getIsAuthorized()).isEqualTo(UPDATED_IS_AUTHORIZED);
        assertThat(testSme.getTermsOfUse()).isEqualTo(UPDATED_TERMS_OF_USE);
        assertThat(testSme.getIsValid()).isEqualTo(UPDATED_IS_VALID);
    }

    @Test
    @Transactional
    void patchNonExistingSme() throws Exception {
        int databaseSizeBeforeUpdate = smeRepository.findAll().size();
        sme.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSmeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sme.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSme() throws Exception {
        int databaseSizeBeforeUpdate = smeRepository.findAll().size();
        sme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sme))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSme() throws Exception {
        int databaseSizeBeforeUpdate = smeRepository.findAll().size();
        sme.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSmeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sme)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sme in the database
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSme() throws Exception {
        // Initialize the database
        smeRepository.saveAndFlush(sme);

        int databaseSizeBeforeDelete = smeRepository.findAll().size();

        // Delete the sme
        restSmeMockMvc.perform(delete(ENTITY_API_URL_ID, sme.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sme> smeList = smeRepository.findAll();
        assertThat(smeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
