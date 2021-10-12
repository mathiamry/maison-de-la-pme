package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AvailabilityTimeslotTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AvailabilityTimeslot.class);
        AvailabilityTimeslot availabilityTimeslot1 = new AvailabilityTimeslot();
        availabilityTimeslot1.setId(1L);
        AvailabilityTimeslot availabilityTimeslot2 = new AvailabilityTimeslot();
        availabilityTimeslot2.setId(availabilityTimeslot1.getId());
        assertThat(availabilityTimeslot1).isEqualTo(availabilityTimeslot2);
        availabilityTimeslot2.setId(2L);
        assertThat(availabilityTimeslot1).isNotEqualTo(availabilityTimeslot2);
        availabilityTimeslot1.setId(null);
        assertThat(availabilityTimeslot1).isNotEqualTo(availabilityTimeslot2);
    }
}
