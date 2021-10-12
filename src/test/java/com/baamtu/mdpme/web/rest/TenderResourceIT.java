package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Tender;
import com.baamtu.mdpme.domain.User;
import com.baamtu.mdpme.repository.TenderRepository;
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
 * Integration tests for the {@link TenderResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TenderResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_PUBLISH_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_PUBLISH_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_EXPIRY_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_EXPIRY_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IS_VALID = false;
    private static final Boolean UPDATED_IS_VALID = true;

    private static final Boolean DEFAULT_IS_ARCHIVED = false;
    private static final Boolean UPDATED_IS_ARCHIVED = true;

    private static final Boolean DEFAULT_IS_PUBLISHED = false;
    private static final Boolean UPDATED_IS_PUBLISHED = true;

    private static final String ENTITY_API_URL = "/api/tenders";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTenderMockMvc;

    private Tender tender;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tender createEntity(EntityManager em) {
        Tender tender = new Tender()
            .title(DEFAULT_TITLE)
            .description(DEFAULT_DESCRIPTION)
            .publishDate(DEFAULT_PUBLISH_DATE)
            .expiryDate(DEFAULT_EXPIRY_DATE)
            .isValid(DEFAULT_IS_VALID)
            .isArchived(DEFAULT_IS_ARCHIVED)
            .isPublished(DEFAULT_IS_PUBLISHED);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        tender.setAuthor(user);
        return tender;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tender createUpdatedEntity(EntityManager em) {
        Tender tender = new Tender()
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .publishDate(UPDATED_PUBLISH_DATE)
            .expiryDate(UPDATED_EXPIRY_DATE)
            .isValid(UPDATED_IS_VALID)
            .isArchived(UPDATED_IS_ARCHIVED)
            .isPublished(UPDATED_IS_PUBLISHED);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        tender.setAuthor(user);
        return tender;
    }

    @BeforeEach
    public void initTest() {
        tender = createEntity(em);
    }

    @Test
    @Transactional
    void createTender() throws Exception {
        int databaseSizeBeforeCreate = tenderRepository.findAll().size();
        // Create the Tender
        restTenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isCreated());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeCreate + 1);
        Tender testTender = tenderList.get(tenderList.size() - 1);
        assertThat(testTender.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTender.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTender.getPublishDate()).isEqualTo(DEFAULT_PUBLISH_DATE);
        assertThat(testTender.getExpiryDate()).isEqualTo(DEFAULT_EXPIRY_DATE);
        assertThat(testTender.getIsValid()).isEqualTo(DEFAULT_IS_VALID);
        assertThat(testTender.getIsArchived()).isEqualTo(DEFAULT_IS_ARCHIVED);
        assertThat(testTender.getIsPublished()).isEqualTo(DEFAULT_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void createTenderWithExistingId() throws Exception {
        // Create the Tender with an existing ID
        tender.setId(1L);

        int databaseSizeBeforeCreate = tenderRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isBadRequest());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = tenderRepository.findAll().size();
        // set the field null
        tender.setTitle(null);

        // Create the Tender, which fails.

        restTenderMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isBadRequest());

        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTenders() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        // Get all the tenderList
        restTenderMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tender.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].publishDate").value(hasItem(DEFAULT_PUBLISH_DATE.toString())))
            .andExpect(jsonPath("$.[*].expiryDate").value(hasItem(DEFAULT_EXPIRY_DATE.toString())))
            .andExpect(jsonPath("$.[*].isValid").value(hasItem(DEFAULT_IS_VALID.booleanValue())))
            .andExpect(jsonPath("$.[*].isArchived").value(hasItem(DEFAULT_IS_ARCHIVED.booleanValue())))
            .andExpect(jsonPath("$.[*].isPublished").value(hasItem(DEFAULT_IS_PUBLISHED.booleanValue())));
    }

    @Test
    @Transactional
    void getTender() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        // Get the tender
        restTenderMockMvc
            .perform(get(ENTITY_API_URL_ID, tender.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tender.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.publishDate").value(DEFAULT_PUBLISH_DATE.toString()))
            .andExpect(jsonPath("$.expiryDate").value(DEFAULT_EXPIRY_DATE.toString()))
            .andExpect(jsonPath("$.isValid").value(DEFAULT_IS_VALID.booleanValue()))
            .andExpect(jsonPath("$.isArchived").value(DEFAULT_IS_ARCHIVED.booleanValue()))
            .andExpect(jsonPath("$.isPublished").value(DEFAULT_IS_PUBLISHED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingTender() throws Exception {
        // Get the tender
        restTenderMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewTender() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();

        // Update the tender
        Tender updatedTender = tenderRepository.findById(tender.getId()).get();
        // Disconnect from session so that the updates on updatedTender are not directly saved in db
        em.detach(updatedTender);
        updatedTender
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .publishDate(UPDATED_PUBLISH_DATE)
            .expiryDate(UPDATED_EXPIRY_DATE)
            .isValid(UPDATED_IS_VALID)
            .isArchived(UPDATED_IS_ARCHIVED)
            .isPublished(UPDATED_IS_PUBLISHED);

        restTenderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTender.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTender))
            )
            .andExpect(status().isOk());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
        Tender testTender = tenderList.get(tenderList.size() - 1);
        assertThat(testTender.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTender.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTender.getPublishDate()).isEqualTo(UPDATED_PUBLISH_DATE);
        assertThat(testTender.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
        assertThat(testTender.getIsValid()).isEqualTo(UPDATED_IS_VALID);
        assertThat(testTender.getIsArchived()).isEqualTo(UPDATED_IS_ARCHIVED);
        assertThat(testTender.getIsPublished()).isEqualTo(UPDATED_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void putNonExistingTender() throws Exception {
        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();
        tender.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTenderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tender.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTender() throws Exception {
        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();
        tender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTenderMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTender() throws Exception {
        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();
        tender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTenderMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTenderWithPatch() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();

        // Update the tender using partial update
        Tender partialUpdatedTender = new Tender();
        partialUpdatedTender.setId(tender.getId());

        partialUpdatedTender.expiryDate(UPDATED_EXPIRY_DATE).isValid(UPDATED_IS_VALID);

        restTenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTender.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTender))
            )
            .andExpect(status().isOk());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
        Tender testTender = tenderList.get(tenderList.size() - 1);
        assertThat(testTender.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testTender.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTender.getPublishDate()).isEqualTo(DEFAULT_PUBLISH_DATE);
        assertThat(testTender.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
        assertThat(testTender.getIsValid()).isEqualTo(UPDATED_IS_VALID);
        assertThat(testTender.getIsArchived()).isEqualTo(DEFAULT_IS_ARCHIVED);
        assertThat(testTender.getIsPublished()).isEqualTo(DEFAULT_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void fullUpdateTenderWithPatch() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();

        // Update the tender using partial update
        Tender partialUpdatedTender = new Tender();
        partialUpdatedTender.setId(tender.getId());

        partialUpdatedTender
            .title(UPDATED_TITLE)
            .description(UPDATED_DESCRIPTION)
            .publishDate(UPDATED_PUBLISH_DATE)
            .expiryDate(UPDATED_EXPIRY_DATE)
            .isValid(UPDATED_IS_VALID)
            .isArchived(UPDATED_IS_ARCHIVED)
            .isPublished(UPDATED_IS_PUBLISHED);

        restTenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTender.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTender))
            )
            .andExpect(status().isOk());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
        Tender testTender = tenderList.get(tenderList.size() - 1);
        assertThat(testTender.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testTender.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTender.getPublishDate()).isEqualTo(UPDATED_PUBLISH_DATE);
        assertThat(testTender.getExpiryDate()).isEqualTo(UPDATED_EXPIRY_DATE);
        assertThat(testTender.getIsValid()).isEqualTo(UPDATED_IS_VALID);
        assertThat(testTender.getIsArchived()).isEqualTo(UPDATED_IS_ARCHIVED);
        assertThat(testTender.getIsPublished()).isEqualTo(UPDATED_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void patchNonExistingTender() throws Exception {
        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();
        tender.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tender.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTender() throws Exception {
        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();
        tender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTenderMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tender))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTender() throws Exception {
        int databaseSizeBeforeUpdate = tenderRepository.findAll().size();
        tender.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTenderMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tender)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tender in the database
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTender() throws Exception {
        // Initialize the database
        tenderRepository.saveAndFlush(tender);

        int databaseSizeBeforeDelete = tenderRepository.findAll().size();

        // Delete the tender
        restTenderMockMvc
            .perform(delete(ENTITY_API_URL_ID, tender.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tender> tenderList = tenderRepository.findAll();
        assertThat(tenderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
