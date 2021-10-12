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
 * A Administrator.
 */
@Entity
@Table(name = "administrator")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Administrator implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "description")
    private String description;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User internalUser;

    @JsonIgnoreProperties(value = { "language" }, allowSetters = true)
    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Person person;

    @OneToMany(mappedBy = "administrator")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "country", "administrator", "advisors", "partners", "smes" }, allowSetters = true)
    private Set<SMEHouse> houseSmes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Administrator id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return this.jobTitle;
    }

    public Administrator jobTitle(String jobTitle) {
        this.setJobTitle(jobTitle);
        return this;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getDescription() {
        return this.description;
    }

    public Administrator description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public Administrator internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Person getPerson() {
        return this.person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Administrator person(Person person) {
        this.setPerson(person);
        return this;
    }

    public Set<SMEHouse> getHouseSmes() {
        return this.houseSmes;
    }

    public void setHouseSmes(Set<SMEHouse> sMEHouses) {
        if (this.houseSmes != null) {
            this.houseSmes.forEach(i -> i.setAdministrator(null));
        }
        if (sMEHouses != null) {
            sMEHouses.forEach(i -> i.setAdministrator(this));
        }
        this.houseSmes = sMEHouses;
    }

    public Administrator houseSmes(Set<SMEHouse> sMEHouses) {
        this.setHouseSmes(sMEHouses);
        return this;
    }

    public Administrator addHouseSmes(SMEHouse sMEHouse) {
        this.houseSmes.add(sMEHouse);
        sMEHouse.setAdministrator(this);
        return this;
    }

    public Administrator removeHouseSmes(SMEHouse sMEHouse) {
        this.houseSmes.remove(sMEHouse);
        sMEHouse.setAdministrator(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Administrator)) {
            return false;
        }
        return id != null && id.equals(((Administrator) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Administrator{" +
            "id=" + getId() +
            ", jobTitle='" + getJobTitle() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
