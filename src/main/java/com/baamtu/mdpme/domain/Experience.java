package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Experience.
 */
@Entity
@Table(name = "experience")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Experience implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "min")
    private Float min;

    @Column(name = "max")
    private Float max;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "experience")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "activityArea", "need", "smeHouse", "turnover", "experience", "size", "bank", "representatives", "files" },
        allowSetters = true
    )
    private Set<Sme> smes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Experience id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getMin() {
        return this.min;
    }

    public Experience min(Float min) {
        this.setMin(min);
        return this;
    }

    public void setMin(Float min) {
        this.min = min;
    }

    public Float getMax() {
        return this.max;
    }

    public Experience max(Float max) {
        this.setMax(max);
        return this;
    }

    public void setMax(Float max) {
        this.max = max;
    }

    public String getDescription() {
        return this.description;
    }

    public Experience description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Sme> getSmes() {
        return this.smes;
    }

    public void setSmes(Set<Sme> smes) {
        if (this.smes != null) {
            this.smes.forEach(i -> i.setExperience(null));
        }
        if (smes != null) {
            smes.forEach(i -> i.setExperience(this));
        }
        this.smes = smes;
    }

    public Experience smes(Set<Sme> smes) {
        this.setSmes(smes);
        return this;
    }

    public Experience addSmes(Sme sme) {
        this.smes.add(sme);
        sme.setExperience(this);
        return this;
    }

    public Experience removeSmes(Sme sme) {
        this.smes.remove(sme);
        sme.setExperience(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Experience)) {
            return false;
        }
        return id != null && id.equals(((Experience) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Experience{" +
            "id=" + getId() +
            ", min=" + getMin() +
            ", max=" + getMax() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
