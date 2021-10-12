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
 * A SMEHouse.
 */
@Entity
@Table(name = "sme_house")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SMEHouse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "address")
    private String address;

    @NotNull
    @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "phone", nullable = false)
    private String phone;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "language", "smeHouses" }, allowSetters = true)
    private Country country;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "internalUser", "person", "houseSmes" }, allowSetters = true)
    private Administrator administrator;

    @OneToMany(mappedBy = "smeHouse")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "internalUser", "person", "smeHouse", "appointmnents", "availabilityTimeslots", "unavailabilityPeriods" },
        allowSetters = true
    )
    private Set<Advisor> advisors = new HashSet<>();

    @OneToMany(mappedBy = "smeHouse")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "smeHouse", "representings" }, allowSetters = true)
    private Set<Partner> partners = new HashSet<>();

    @OneToMany(mappedBy = "smeHouse")
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

    public SMEHouse id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public SMEHouse name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public SMEHouse description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return this.address;
    }

    public SMEHouse address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getEmail() {
        return this.email;
    }

    public SMEHouse email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return this.phone;
    }

    public SMEHouse phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Country getCountry() {
        return this.country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public SMEHouse country(Country country) {
        this.setCountry(country);
        return this;
    }

    public Administrator getAdministrator() {
        return this.administrator;
    }

    public void setAdministrator(Administrator administrator) {
        this.administrator = administrator;
    }

    public SMEHouse administrator(Administrator administrator) {
        this.setAdministrator(administrator);
        return this;
    }

    public Set<Advisor> getAdvisors() {
        return this.advisors;
    }

    public void setAdvisors(Set<Advisor> advisors) {
        if (this.advisors != null) {
            this.advisors.forEach(i -> i.setSmeHouse(null));
        }
        if (advisors != null) {
            advisors.forEach(i -> i.setSmeHouse(this));
        }
        this.advisors = advisors;
    }

    public SMEHouse advisors(Set<Advisor> advisors) {
        this.setAdvisors(advisors);
        return this;
    }

    public SMEHouse addAdvisors(Advisor advisor) {
        this.advisors.add(advisor);
        advisor.setSmeHouse(this);
        return this;
    }

    public SMEHouse removeAdvisors(Advisor advisor) {
        this.advisors.remove(advisor);
        advisor.setSmeHouse(null);
        return this;
    }

    public Set<Partner> getPartners() {
        return this.partners;
    }

    public void setPartners(Set<Partner> partners) {
        if (this.partners != null) {
            this.partners.forEach(i -> i.setSmeHouse(null));
        }
        if (partners != null) {
            partners.forEach(i -> i.setSmeHouse(this));
        }
        this.partners = partners;
    }

    public SMEHouse partners(Set<Partner> partners) {
        this.setPartners(partners);
        return this;
    }

    public SMEHouse addPartners(Partner partner) {
        this.partners.add(partner);
        partner.setSmeHouse(this);
        return this;
    }

    public SMEHouse removePartners(Partner partner) {
        this.partners.remove(partner);
        partner.setSmeHouse(null);
        return this;
    }

    public Set<Sme> getSmes() {
        return this.smes;
    }

    public void setSmes(Set<Sme> smes) {
        if (this.smes != null) {
            this.smes.forEach(i -> i.setSmeHouse(null));
        }
        if (smes != null) {
            smes.forEach(i -> i.setSmeHouse(this));
        }
        this.smes = smes;
    }

    public SMEHouse smes(Set<Sme> smes) {
        this.setSmes(smes);
        return this;
    }

    public SMEHouse addSmes(Sme sme) {
        this.smes.add(sme);
        sme.setSmeHouse(this);
        return this;
    }

    public SMEHouse removeSmes(Sme sme) {
        this.smes.remove(sme);
        sme.setSmeHouse(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SMEHouse)) {
            return false;
        }
        return id != null && id.equals(((SMEHouse) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SMEHouse{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", address='" + getAddress() + "'" +
            ", email='" + getEmail() + "'" +
            ", phone='" + getPhone() + "'" +
            "}";
    }
}
