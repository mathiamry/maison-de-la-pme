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
 * A Language.
 */
@Entity
@Table(name = "language")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Language implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "key", nullable = false)
    private String key;

    @OneToMany(mappedBy = "language")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "language", "smeHouses" }, allowSetters = true)
    private Set<Country> countries = new HashSet<>();

    @OneToMany(mappedBy = "language")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "language" }, allowSetters = true)
    private Set<Person> persons = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Language id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Language name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return this.key;
    }

    public Language key(String key) {
        this.setKey(key);
        return this;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public Set<Country> getCountries() {
        return this.countries;
    }

    public void setCountries(Set<Country> countries) {
        if (this.countries != null) {
            this.countries.forEach(i -> i.setLanguage(null));
        }
        if (countries != null) {
            countries.forEach(i -> i.setLanguage(this));
        }
        this.countries = countries;
    }

    public Language countries(Set<Country> countries) {
        this.setCountries(countries);
        return this;
    }

    public Language addCountries(Country country) {
        this.countries.add(country);
        country.setLanguage(this);
        return this;
    }

    public Language removeCountries(Country country) {
        this.countries.remove(country);
        country.setLanguage(null);
        return this;
    }

    public Set<Person> getPersons() {
        return this.persons;
    }

    public void setPersons(Set<Person> people) {
        if (this.persons != null) {
            this.persons.forEach(i -> i.setLanguage(null));
        }
        if (people != null) {
            people.forEach(i -> i.setLanguage(this));
        }
        this.persons = people;
    }

    public Language persons(Set<Person> people) {
        this.setPersons(people);
        return this;
    }

    public Language addPersons(Person person) {
        this.persons.add(person);
        person.setLanguage(this);
        return this;
    }

    public Language removePersons(Person person) {
        this.persons.remove(person);
        person.setLanguage(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Language)) {
            return false;
        }
        return id != null && id.equals(((Language) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Language{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", key='" + getKey() + "'" +
            "}";
    }
}
