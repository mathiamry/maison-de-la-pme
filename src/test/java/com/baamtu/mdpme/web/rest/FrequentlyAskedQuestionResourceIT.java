package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.FrequentlyAskedQuestion;
import com.baamtu.mdpme.domain.User;
import com.baamtu.mdpme.repository.FrequentlyAskedQuestionRepository;
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
 * Integration tests for the {@link FrequentlyAskedQuestionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FrequentlyAskedQuestionResourceIT {

    private static final String DEFAULT_QUESTION = "AAAAAAAAAA";
    private static final String UPDATED_QUESTION = "BBBBBBBBBB";

    private static final String DEFAULT_ANSWER = "AAAAAAAAAA";
    private static final String UPDATED_ANSWER = "BBBBBBBBBB";

    private static final Integer DEFAULT_ORDER = 1;
    private static final Integer UPDATED_ORDER = 2;

    private static final Boolean DEFAULT_IS_PUBLISHED = false;
    private static final Boolean UPDATED_IS_PUBLISHED = true;

    private static final String ENTITY_API_URL = "/api/frequently-asked-questions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FrequentlyAskedQuestionRepository frequentlyAskedQuestionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFrequentlyAskedQuestionMockMvc;

    private FrequentlyAskedQuestion frequentlyAskedQuestion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FrequentlyAskedQuestion createEntity(EntityManager em) {
        FrequentlyAskedQuestion frequentlyAskedQuestion = new FrequentlyAskedQuestion()
            .question(DEFAULT_QUESTION)
            .answer(DEFAULT_ANSWER)
            .order(DEFAULT_ORDER)
            .isPublished(DEFAULT_IS_PUBLISHED);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        frequentlyAskedQuestion.setAuthor(user);
        return frequentlyAskedQuestion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FrequentlyAskedQuestion createUpdatedEntity(EntityManager em) {
        FrequentlyAskedQuestion frequentlyAskedQuestion = new FrequentlyAskedQuestion()
            .question(UPDATED_QUESTION)
            .answer(UPDATED_ANSWER)
            .order(UPDATED_ORDER)
            .isPublished(UPDATED_IS_PUBLISHED);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        frequentlyAskedQuestion.setAuthor(user);
        return frequentlyAskedQuestion;
    }

    @BeforeEach
    public void initTest() {
        frequentlyAskedQuestion = createEntity(em);
    }

    @Test
    @Transactional
    void createFrequentlyAskedQuestion() throws Exception {
        int databaseSizeBeforeCreate = frequentlyAskedQuestionRepository.findAll().size();
        // Create the FrequentlyAskedQuestion
        restFrequentlyAskedQuestionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isCreated());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeCreate + 1);
        FrequentlyAskedQuestion testFrequentlyAskedQuestion = frequentlyAskedQuestionList.get(frequentlyAskedQuestionList.size() - 1);
        assertThat(testFrequentlyAskedQuestion.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testFrequentlyAskedQuestion.getAnswer()).isEqualTo(DEFAULT_ANSWER);
        assertThat(testFrequentlyAskedQuestion.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testFrequentlyAskedQuestion.getIsPublished()).isEqualTo(DEFAULT_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void createFrequentlyAskedQuestionWithExistingId() throws Exception {
        // Create the FrequentlyAskedQuestion with an existing ID
        frequentlyAskedQuestion.setId(1L);

        int databaseSizeBeforeCreate = frequentlyAskedQuestionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFrequentlyAskedQuestionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkQuestionIsRequired() throws Exception {
        int databaseSizeBeforeTest = frequentlyAskedQuestionRepository.findAll().size();
        // set the field null
        frequentlyAskedQuestion.setQuestion(null);

        // Create the FrequentlyAskedQuestion, which fails.

        restFrequentlyAskedQuestionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isBadRequest());

        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAnswerIsRequired() throws Exception {
        int databaseSizeBeforeTest = frequentlyAskedQuestionRepository.findAll().size();
        // set the field null
        frequentlyAskedQuestion.setAnswer(null);

        // Create the FrequentlyAskedQuestion, which fails.

        restFrequentlyAskedQuestionMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isBadRequest());

        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFrequentlyAskedQuestions() throws Exception {
        // Initialize the database
        frequentlyAskedQuestionRepository.saveAndFlush(frequentlyAskedQuestion);

        // Get all the frequentlyAskedQuestionList
        restFrequentlyAskedQuestionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(frequentlyAskedQuestion.getId().intValue())))
            .andExpect(jsonPath("$.[*].question").value(hasItem(DEFAULT_QUESTION)))
            .andExpect(jsonPath("$.[*].answer").value(hasItem(DEFAULT_ANSWER)))
            .andExpect(jsonPath("$.[*].order").value(hasItem(DEFAULT_ORDER)))
            .andExpect(jsonPath("$.[*].isPublished").value(hasItem(DEFAULT_IS_PUBLISHED.booleanValue())));
    }

    @Test
    @Transactional
    void getFrequentlyAskedQuestion() throws Exception {
        // Initialize the database
        frequentlyAskedQuestionRepository.saveAndFlush(frequentlyAskedQuestion);

        // Get the frequentlyAskedQuestion
        restFrequentlyAskedQuestionMockMvc
            .perform(get(ENTITY_API_URL_ID, frequentlyAskedQuestion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(frequentlyAskedQuestion.getId().intValue()))
            .andExpect(jsonPath("$.question").value(DEFAULT_QUESTION))
            .andExpect(jsonPath("$.answer").value(DEFAULT_ANSWER))
            .andExpect(jsonPath("$.order").value(DEFAULT_ORDER))
            .andExpect(jsonPath("$.isPublished").value(DEFAULT_IS_PUBLISHED.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingFrequentlyAskedQuestion() throws Exception {
        // Get the frequentlyAskedQuestion
        restFrequentlyAskedQuestionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFrequentlyAskedQuestion() throws Exception {
        // Initialize the database
        frequentlyAskedQuestionRepository.saveAndFlush(frequentlyAskedQuestion);

        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();

        // Update the frequentlyAskedQuestion
        FrequentlyAskedQuestion updatedFrequentlyAskedQuestion = frequentlyAskedQuestionRepository
            .findById(frequentlyAskedQuestion.getId())
            .get();
        // Disconnect from session so that the updates on updatedFrequentlyAskedQuestion are not directly saved in db
        em.detach(updatedFrequentlyAskedQuestion);
        updatedFrequentlyAskedQuestion
            .question(UPDATED_QUESTION)
            .answer(UPDATED_ANSWER)
            .order(UPDATED_ORDER)
            .isPublished(UPDATED_IS_PUBLISHED);

        restFrequentlyAskedQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFrequentlyAskedQuestion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFrequentlyAskedQuestion))
            )
            .andExpect(status().isOk());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
        FrequentlyAskedQuestion testFrequentlyAskedQuestion = frequentlyAskedQuestionList.get(frequentlyAskedQuestionList.size() - 1);
        assertThat(testFrequentlyAskedQuestion.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testFrequentlyAskedQuestion.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testFrequentlyAskedQuestion.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testFrequentlyAskedQuestion.getIsPublished()).isEqualTo(UPDATED_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void putNonExistingFrequentlyAskedQuestion() throws Exception {
        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();
        frequentlyAskedQuestion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFrequentlyAskedQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, frequentlyAskedQuestion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFrequentlyAskedQuestion() throws Exception {
        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();
        frequentlyAskedQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequentlyAskedQuestionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFrequentlyAskedQuestion() throws Exception {
        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();
        frequentlyAskedQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequentlyAskedQuestionMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFrequentlyAskedQuestionWithPatch() throws Exception {
        // Initialize the database
        frequentlyAskedQuestionRepository.saveAndFlush(frequentlyAskedQuestion);

        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();

        // Update the frequentlyAskedQuestion using partial update
        FrequentlyAskedQuestion partialUpdatedFrequentlyAskedQuestion = new FrequentlyAskedQuestion();
        partialUpdatedFrequentlyAskedQuestion.setId(frequentlyAskedQuestion.getId());

        partialUpdatedFrequentlyAskedQuestion.answer(UPDATED_ANSWER);

        restFrequentlyAskedQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFrequentlyAskedQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFrequentlyAskedQuestion))
            )
            .andExpect(status().isOk());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
        FrequentlyAskedQuestion testFrequentlyAskedQuestion = frequentlyAskedQuestionList.get(frequentlyAskedQuestionList.size() - 1);
        assertThat(testFrequentlyAskedQuestion.getQuestion()).isEqualTo(DEFAULT_QUESTION);
        assertThat(testFrequentlyAskedQuestion.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testFrequentlyAskedQuestion.getOrder()).isEqualTo(DEFAULT_ORDER);
        assertThat(testFrequentlyAskedQuestion.getIsPublished()).isEqualTo(DEFAULT_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void fullUpdateFrequentlyAskedQuestionWithPatch() throws Exception {
        // Initialize the database
        frequentlyAskedQuestionRepository.saveAndFlush(frequentlyAskedQuestion);

        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();

        // Update the frequentlyAskedQuestion using partial update
        FrequentlyAskedQuestion partialUpdatedFrequentlyAskedQuestion = new FrequentlyAskedQuestion();
        partialUpdatedFrequentlyAskedQuestion.setId(frequentlyAskedQuestion.getId());

        partialUpdatedFrequentlyAskedQuestion
            .question(UPDATED_QUESTION)
            .answer(UPDATED_ANSWER)
            .order(UPDATED_ORDER)
            .isPublished(UPDATED_IS_PUBLISHED);

        restFrequentlyAskedQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFrequentlyAskedQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFrequentlyAskedQuestion))
            )
            .andExpect(status().isOk());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
        FrequentlyAskedQuestion testFrequentlyAskedQuestion = frequentlyAskedQuestionList.get(frequentlyAskedQuestionList.size() - 1);
        assertThat(testFrequentlyAskedQuestion.getQuestion()).isEqualTo(UPDATED_QUESTION);
        assertThat(testFrequentlyAskedQuestion.getAnswer()).isEqualTo(UPDATED_ANSWER);
        assertThat(testFrequentlyAskedQuestion.getOrder()).isEqualTo(UPDATED_ORDER);
        assertThat(testFrequentlyAskedQuestion.getIsPublished()).isEqualTo(UPDATED_IS_PUBLISHED);
    }

    @Test
    @Transactional
    void patchNonExistingFrequentlyAskedQuestion() throws Exception {
        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();
        frequentlyAskedQuestion.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFrequentlyAskedQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, frequentlyAskedQuestion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFrequentlyAskedQuestion() throws Exception {
        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();
        frequentlyAskedQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequentlyAskedQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isBadRequest());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFrequentlyAskedQuestion() throws Exception {
        int databaseSizeBeforeUpdate = frequentlyAskedQuestionRepository.findAll().size();
        frequentlyAskedQuestion.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFrequentlyAskedQuestionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(frequentlyAskedQuestion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FrequentlyAskedQuestion in the database
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFrequentlyAskedQuestion() throws Exception {
        // Initialize the database
        frequentlyAskedQuestionRepository.saveAndFlush(frequentlyAskedQuestion);

        int databaseSizeBeforeDelete = frequentlyAskedQuestionRepository.findAll().size();

        // Delete the frequentlyAskedQuestion
        restFrequentlyAskedQuestionMockMvc
            .perform(delete(ENTITY_API_URL_ID, frequentlyAskedQuestion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FrequentlyAskedQuestion> frequentlyAskedQuestionList = frequentlyAskedQuestionRepository.findAll();
        assertThat(frequentlyAskedQuestionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
