package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SmeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sme.class);
        Sme sme1 = new Sme();
        sme1.setId(1L);
        Sme sme2 = new Sme();
        sme2.setId(sme1.getId());
        assertThat(sme1).isEqualTo(sme2);
        sme2.setId(2L);
        assertThat(sme1).isNotEqualTo(sme2);
        sme1.setId(null);
        assertThat(sme1).isNotEqualTo(sme2);
    }
}
