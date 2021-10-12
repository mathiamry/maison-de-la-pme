package com.baamtu.mdpme.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Need.
 */
@Entity
@Table(name = "need")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Need implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "need")
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

    public Need id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Need name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Sme> getSmes() {
        return this.smes;
    }

    public void setSmes(Set<Sme> smes) {
        if (this.smes != null) {
            this.smes.forEach(i -> i.setNeed(null));
        }
        if (smes != null) {
            smes.forEach(i -> i.setNeed(this));
        }
        this.smes = smes;
    }

    public Need smes(Set<Sme> smes) {
        this.setSmes(smes);
        return this;
    }

    public Need addSmes(Sme sme) {
        this.smes.add(sme);
        sme.setNeed(this);
        return this;
    }

    public Need removeSmes(Sme sme) {
        this.smes.remove(sme);
        sme.setNeed(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Need)) {
            return false;
        }
        return id != null && id.equals(((Need) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Need{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
