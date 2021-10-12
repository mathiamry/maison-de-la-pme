package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UnavailabilityPeriodTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UnavailabilityPeriod.class);
        UnavailabilityPeriod unavailabilityPeriod1 = new UnavailabilityPeriod();
        unavailabilityPeriod1.setId(1L);
        UnavailabilityPeriod unavailabilityPeriod2 = new UnavailabilityPeriod();
        unavailabilityPeriod2.setId(unavailabilityPeriod1.getId());
        assertThat(unavailabilityPeriod1).isEqualTo(unavailabilityPeriod2);
        unavailabilityPeriod2.setId(2L);
        assertThat(unavailabilityPeriod1).isNotEqualTo(unavailabilityPeriod2);
        unavailabilityPeriod1.setId(null);
        assertThat(unavailabilityPeriod1).isNotEqualTo(unavailabilityPeriod2);
    }
}
