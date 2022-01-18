package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppointmentObjectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppointmentObject.class);
        AppointmentObject appointmentObject1 = new AppointmentObject();
        appointmentObject1.setId(1L);
        AppointmentObject appointmentObject2 = new AppointmentObject();
        appointmentObject2.setId(appointmentObject1.getId());
        assertThat(appointmentObject1).isEqualTo(appointmentObject2);
        appointmentObject2.setId(2L);
        assertThat(appointmentObject1).isNotEqualTo(appointmentObject2);
        appointmentObject1.setId(null);
        assertThat(appointmentObject1).isNotEqualTo(appointmentObject2);
    }
}
