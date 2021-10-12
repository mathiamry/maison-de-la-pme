package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PartnerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Partner.class);
        Partner partner1 = new Partner();
        partner1.setId(1L);
        Partner partner2 = new Partner();
        partner2.setId(partner1.getId());
        assertThat(partner1).isEqualTo(partner2);
        partner2.setId(2L);
        assertThat(partner1).isNotEqualTo(partner2);
        partner1.setId(null);
        assertThat(partner1).isNotEqualTo(partner2);
    }
}
