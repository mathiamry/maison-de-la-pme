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
 * A Country.
 */
@Entity
@Table(name = "country")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Country implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JsonIgnoreProperties(value = { "countries", "persons" }, allowSetters = true)
    private Language language;

    @OneToMany(mappedBy = "country")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "country", "administrator", "frequentlyAskedQuestions", "advisors", "partners", "smes" },
        allowSetters = true
    )
    private Set<SMEHouse> smeHouses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Country id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Country name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Language getLanguage() {
        return this.language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Country language(Language language) {
        this.setLanguage(language);
        return this;
    }

    public Set<SMEHouse> getSmeHouses() {
        return this.smeHouses;
    }

    public void setSmeHouses(Set<SMEHouse> sMEHouses) {
        if (this.smeHouses != null) {
            this.smeHouses.forEach(i -> i.setCountry(null));
        }
        if (sMEHouses != null) {
            sMEHouses.forEach(i -> i.setCountry(this));
        }
        this.smeHouses = sMEHouses;
    }

    public Country smeHouses(Set<SMEHouse> sMEHouses) {
        this.setSmeHouses(sMEHouses);
        return this;
    }

    public Country addSmeHouses(SMEHouse sMEHouse) {
        this.smeHouses.add(sMEHouse);
        sMEHouse.setCountry(this);
        return this;
    }

    public Country removeSmeHouses(SMEHouse sMEHouse) {
        this.smeHouses.remove(sMEHouse);
        sMEHouse.setCountry(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Country)) {
            return false;
        }
        return id != null && id.equals(((Country) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Country{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
