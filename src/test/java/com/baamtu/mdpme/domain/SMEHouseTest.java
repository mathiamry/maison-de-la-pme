package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SMEHouseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SMEHouse.class);
        SMEHouse sMEHouse1 = new SMEHouse();
        sMEHouse1.setId(1L);
        SMEHouse sMEHouse2 = new SMEHouse();
        sMEHouse2.setId(sMEHouse1.getId());
        assertThat(sMEHouse1).isEqualTo(sMEHouse2);
        sMEHouse2.setId(2L);
        assertThat(sMEHouse1).isNotEqualTo(sMEHouse2);
        sMEHouse1.setId(null);
        assertThat(sMEHouse1).isNotEqualTo(sMEHouse2);
    }
}
