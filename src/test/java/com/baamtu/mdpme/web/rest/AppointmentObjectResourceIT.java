package com.baamtu.mdpme.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.baamtu.mdpme.IntegrationTest;
import com.baamtu.mdpme.domain.Appointment;
import com.baamtu.mdpme.domain.AppointmentObject;
import com.baamtu.mdpme.repository.AppointmentObjectRepository;
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
 * Integration tests for the {@link AppointmentObjectResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AppointmentObjectResourceIT {

    private static final String DEFAULT_OBJECT = "AAAAAAAAAA";
    private static final String UPDATED_OBJECT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/appointment-objects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AppointmentObjectRepository appointmentObjectRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppointmentObjectMockMvc;

    private AppointmentObject appointmentObject;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppointmentObject createEntity(EntityManager em) {
        AppointmentObject appointmentObject = new AppointmentObject().object(DEFAULT_OBJECT);
        // Add required entity
        Appointment appointment;
        if (TestUtil.findAll(em, Appointment.class).isEmpty()) {
            appointment = AppointmentResourceIT.createEntity(em);
            em.persist(appointment);
            em.flush();
        } else {
            appointment = TestUtil.findAll(em, Appointment.class).get(0);
        }
        appointmentObject.setObject(appointment);
        return appointmentObject;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppointmentObject createUpdatedEntity(EntityManager em) {
        AppointmentObject appointmentObject = new AppointmentObject().object(UPDATED_OBJECT);
        // Add required entity
        Appointment appointment;
        if (TestUtil.findAll(em, Appointment.class).isEmpty()) {
            appointment = AppointmentResourceIT.createUpdatedEntity(em);
            em.persist(appointment);
            em.flush();
        } else {
            appointment = TestUtil.findAll(em, Appointment.class).get(0);
        }
        appointmentObject.setObject(appointment);
        return appointmentObject;
    }

    @BeforeEach
    public void initTest() {
        appointmentObject = createEntity(em);
    }

    @Test
    @Transactional
    void createAppointmentObject() throws Exception {
        int databaseSizeBeforeCreate = appointmentObjectRepository.findAll().size();
        // Create the AppointmentObject
        restAppointmentObjectMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isCreated());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeCreate + 1);
        AppointmentObject testAppointmentObject = appointmentObjectList.get(appointmentObjectList.size() - 1);
        assertThat(testAppointmentObject.getObject()).isEqualTo(DEFAULT_OBJECT);
    }

    @Test
    @Transactional
    void createAppointmentObjectWithExistingId() throws Exception {
        // Create the AppointmentObject with an existing ID
        appointmentObject.setId(1L);

        int databaseSizeBeforeCreate = appointmentObjectRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppointmentObjectMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkObjectIsRequired() throws Exception {
        int databaseSizeBeforeTest = appointmentObjectRepository.findAll().size();
        // set the field null
        appointmentObject.setObject(null);

        // Create the AppointmentObject, which fails.

        restAppointmentObjectMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isBadRequest());

        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAppointmentObjects() throws Exception {
        // Initialize the database
        appointmentObjectRepository.saveAndFlush(appointmentObject);

        // Get all the appointmentObjectList
        restAppointmentObjectMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appointmentObject.getId().intValue())))
            .andExpect(jsonPath("$.[*].object").value(hasItem(DEFAULT_OBJECT)));
    }

    @Test
    @Transactional
    void getAppointmentObject() throws Exception {
        // Initialize the database
        appointmentObjectRepository.saveAndFlush(appointmentObject);

        // Get the appointmentObject
        restAppointmentObjectMockMvc
            .perform(get(ENTITY_API_URL_ID, appointmentObject.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appointmentObject.getId().intValue()))
            .andExpect(jsonPath("$.object").value(DEFAULT_OBJECT));
    }

    @Test
    @Transactional
    void getNonExistingAppointmentObject() throws Exception {
        // Get the appointmentObject
        restAppointmentObjectMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAppointmentObject() throws Exception {
        // Initialize the database
        appointmentObjectRepository.saveAndFlush(appointmentObject);

        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();

        // Update the appointmentObject
        AppointmentObject updatedAppointmentObject = appointmentObjectRepository.findById(appointmentObject.getId()).get();
        // Disconnect from session so that the updates on updatedAppointmentObject are not directly saved in db
        em.detach(updatedAppointmentObject);
        updatedAppointmentObject.object(UPDATED_OBJECT);

        restAppointmentObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAppointmentObject.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAppointmentObject))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
        AppointmentObject testAppointmentObject = appointmentObjectList.get(appointmentObjectList.size() - 1);
        assertThat(testAppointmentObject.getObject()).isEqualTo(UPDATED_OBJECT);
    }

    @Test
    @Transactional
    void putNonExistingAppointmentObject() throws Exception {
        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();
        appointmentObject.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppointmentObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appointmentObject.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppointmentObject() throws Exception {
        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();
        appointmentObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentObjectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppointmentObject() throws Exception {
        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();
        appointmentObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentObjectMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppointmentObjectWithPatch() throws Exception {
        // Initialize the database
        appointmentObjectRepository.saveAndFlush(appointmentObject);

        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();

        // Update the appointmentObject using partial update
        AppointmentObject partialUpdatedAppointmentObject = new AppointmentObject();
        partialUpdatedAppointmentObject.setId(appointmentObject.getId());

        restAppointmentObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppointmentObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppointmentObject))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
        AppointmentObject testAppointmentObject = appointmentObjectList.get(appointmentObjectList.size() - 1);
        assertThat(testAppointmentObject.getObject()).isEqualTo(DEFAULT_OBJECT);
    }

    @Test
    @Transactional
    void fullUpdateAppointmentObjectWithPatch() throws Exception {
        // Initialize the database
        appointmentObjectRepository.saveAndFlush(appointmentObject);

        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();

        // Update the appointmentObject using partial update
        AppointmentObject partialUpdatedAppointmentObject = new AppointmentObject();
        partialUpdatedAppointmentObject.setId(appointmentObject.getId());

        partialUpdatedAppointmentObject.object(UPDATED_OBJECT);

        restAppointmentObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppointmentObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppointmentObject))
            )
            .andExpect(status().isOk());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
        AppointmentObject testAppointmentObject = appointmentObjectList.get(appointmentObjectList.size() - 1);
        assertThat(testAppointmentObject.getObject()).isEqualTo(UPDATED_OBJECT);
    }

    @Test
    @Transactional
    void patchNonExistingAppointmentObject() throws Exception {
        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();
        appointmentObject.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppointmentObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appointmentObject.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppointmentObject() throws Exception {
        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();
        appointmentObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentObjectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppointmentObject() throws Exception {
        int databaseSizeBeforeUpdate = appointmentObjectRepository.findAll().size();
        appointmentObject.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppointmentObjectMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appointmentObject))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppointmentObject in the database
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppointmentObject() throws Exception {
        // Initialize the database
        appointmentObjectRepository.saveAndFlush(appointmentObject);

        int databaseSizeBeforeDelete = appointmentObjectRepository.findAll().size();

        // Delete the appointmentObject
        restAppointmentObjectMockMvc
            .perform(delete(ENTITY_API_URL_ID, appointmentObject.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AppointmentObject> appointmentObjectList = appointmentObjectRepository.findAll();
        assertThat(appointmentObjectList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
