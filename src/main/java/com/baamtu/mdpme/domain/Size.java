package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Size.
 */
@Entity
@Table(name = "size")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Size implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "min")
    private Integer min;

    @Column(name = "max")
    private Integer max;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "size")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "activityArea", "need", "smeHouse", "turnover", "experience", "size", "representatives", "files", "banks" },
        allowSetters = true
    )
    private Set<Sme> smes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Size id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMin() {
        return this.min;
    }

    public Size min(Integer min) {
        this.setMin(min);
        return this;
    }

    public void setMin(Integer min) {
        this.min = min;
    }

    public Integer getMax() {
        return this.max;
    }

    public Size max(Integer max) {
        this.setMax(max);
        return this;
    }

    public void setMax(Integer max) {
        this.max = max;
    }

    public String getDescription() {
        return this.description;
    }

    public Size description(String description) {
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
            this.smes.forEach(i -> i.setSize(null));
        }
        if (smes != null) {
            smes.forEach(i -> i.setSize(this));
        }
        this.smes = smes;
    }

    public Size smes(Set<Sme> smes) {
        this.setSmes(smes);
        return this;
    }

    public Size addSmes(Sme sme) {
        this.smes.add(sme);
        sme.setSize(this);
        return this;
    }

    public Size removeSmes(Sme sme) {
        this.smes.remove(sme);
        sme.setSize(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Size)) {
            return false;
        }
        return id != null && id.equals(((Size) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Size{" +
            "id=" + getId() +
            ", min=" + getMin() +
            ", max=" + getMax() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
