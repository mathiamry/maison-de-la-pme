package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PartnerRepresentativeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PartnerRepresentative.class);
        PartnerRepresentative partnerRepresentative1 = new PartnerRepresentative();
        partnerRepresentative1.setId(1L);
        PartnerRepresentative partnerRepresentative2 = new PartnerRepresentative();
        partnerRepresentative2.setId(partnerRepresentative1.getId());
        assertThat(partnerRepresentative1).isEqualTo(partnerRepresentative2);
        partnerRepresentative2.setId(2L);
        assertThat(partnerRepresentative1).isNotEqualTo(partnerRepresentative2);
        partnerRepresentative1.setId(null);
        assertThat(partnerRepresentative1).isNotEqualTo(partnerRepresentative2);
    }
}
