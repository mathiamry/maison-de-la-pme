package com.baamtu.mdpme.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.baamtu.mdpme.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SizeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Size.class);
        Size size1 = new Size();
        size1.setId(1L);
        Size size2 = new Size();
        size2.setId(size1.getId());
        assertThat(size1).isEqualTo(size2);
        size2.setId(2L);
        assertThat(size1).isNotEqualTo(size2);
        size1.setId(null);
        assertThat(size1).isNotEqualTo(size2);
    }
}
