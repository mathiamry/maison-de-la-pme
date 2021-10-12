package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AnonymousTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Anonymous.class);
        Anonymous anonymous1 = new Anonymous();
        anonymous1.setId(1L);
        Anonymous anonymous2 = new Anonymous();
        anonymous2.setId(anonymous1.getId());
        assertThat(anonymous1).isEqualTo(anonymous2);
        anonymous2.setId(2L);
        assertThat(anonymous1).isNotEqualTo(anonymous2);
        anonymous1.setId(null);
        assertThat(anonymous1).isNotEqualTo(anonymous2);
    }
}
